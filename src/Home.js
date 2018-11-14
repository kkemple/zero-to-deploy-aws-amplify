import React, { Component } from "react";
import { graphqlOperation, Auth } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";
import { css } from "emotion";
import uuid from "uuid";

import {
  containerStyles,
  titleStyles,
  inputStyles,
  dividerStyles
} from "./styles";
import { navigate } from "@reach/router";

const todoContainerStyles = css`
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 64px;
  min-width: 300px;
`;

const addTodoInputStyles = css`
  margin-right: 15px;
  flex: 1;
  display: inline-block;
`;

const addTodoButtonStyles = css`
  flex: 0;
  min-width: 50px;
  cursor: pointer;

  :hover {
    color: white;
    background-color: #f857a6;
  }

  :disabled {
    color: white;
    background-color: lightgrey;
    border-color: lightgrey;
  }
`;

const addTodoContainerStyles = css`
  display: flex;
  justify-content: space-between;
`;

const textStyles = css`
  font-weight: 300;
  color: #f857a6;
`;

const todoStyles = css`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const listItemStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const deleteButtonStyles = css`
  font-size: 10px;
  padding: 4px;
  margin-bottom: 0;
  cursor: pointer;

  :hover {
    color: white;
    background-color: #f857a6;
  }
`;

const logoutStyles = css`
  color: white;
  text-transform: uppercase;
  text-decoration: none;
  margin-top: 10px;
  font-size: 10px;
`;

class AddTodo extends Component {
  state = { todo: "" };

  submitTodo = async createTodo => {
    try {
      await createTodo({
        input: { id: uuid(), task: this.state.todo }
      });
      this.setState(state => ({
        ...state,
        todo: ""
      }));
    } catch (error) {
      alert(`Todo creation failed! ${error.message}`);
    }
  };

  render = () => (
    <Connect mutation={graphqlOperation(mutations.createTodo)}>
      {({ mutation: createTodo, loading }) => (
        <div className={addTodoContainerStyles}>
          <input
            className={`${inputStyles} ${addTodoInputStyles}`}
            type="text"
            value={this.state.todo}
            placeholder="Add a todo"
            onKeyPress={event => {
              if (event.key === "Enter") {
                this.submitTodo(createTodo);
                return;
              }
            }}
            onChange={event => {
              const { value } = event.target;
              this.setState(state => ({
                ...state,
                todo: value
              }));
            }}
          />
          <button
            disabled={this.state.todo === ""}
            type="button"
            className={`${inputStyles} ${addTodoButtonStyles}`}
            onClick={() => this.submitTodo(createTodo)}
          >
            Add
          </button>
        </div>
      )}
    </Connect>
  );
}

const Todo = ({ item }) => (
  <Connect mutation={graphqlOperation(mutations.deleteTodo)}>
    {({ mutation: deleteTodo }) => (
      <div className={listItemStyles}>
        <span className={`${textStyles} ${todoStyles}`} title={item.task}>
          {item.task}
        </span>
        <button
          onClick={() => deleteTodo({ input: { id: item.id } })}
          className={`${inputStyles} ${deleteButtonStyles}`}
        >
          Delete
        </button>
      </div>
    )}
  </Connect>
);

const AllTodos = () => (
  <Connect
    query={graphqlOperation(queries.listTodos)}
    subscription={graphqlOperation(subscriptions.onCreateTodo)}
    onSubscriptionMsg={(prev, { onCreateTodo }) => {
      return {
        listTodos: {
          items: prev.listTodos.items.concat([onCreateTodo]),
          nextToken: prev.listTodos.nextToken
        }
      };
    }}
  >
    {({ data: { listTodos }, loading, error }) => {
      if (error) return <h3 className={textStyles}>Error</h3>;
      if (loading) return <h3 className={textStyles}>Loading...</h3>;

      return listTodos.items.length ? (
        listTodos.items.map(item => <Todo key={item.task} item={item} />)
      ) : (
        <h3 className={textStyles}>No Todos Yet!</h3>
      );
    }}
  </Connect>
);

export default () => (
  <div className={containerStyles}>
    <h1 className={titleStyles}>Todo Share</h1>
    <div className={todoContainerStyles}>
      <AddTodo />
      <div className={dividerStyles} />
      <AllTodos />
    </div>
    <a
      className={logoutStyles}
      href="/"
      onClick={async event => {
        event.preventDefault();

        await Auth.signOut();
        navigate("/login");
      }}
    >
      Logout
    </a>
  </div>
);
