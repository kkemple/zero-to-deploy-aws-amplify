import React, { Component } from "react";
import { css } from "emotion";
import { Auth } from "aws-amplify";
import { navigate } from "@reach/router";

import {
  containerStyles,
  titleStyles,
  inputStyles,
  dividerStyles
} from "./styles";

const formStyles = css`
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

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    verificationCode: ""
  };

  signUp = async () => {
    try {
      const { username, password, email } = this.state;
      await Auth.signUp({
        username,
        password,
        attributes: {
          email
        }
      });
      alert("Sign up successful, check email for verification code");
    } catch (error) {
      alert(error.message);
    }
  };

  confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp(
        this.state.username,
        this.state.verificationCode
      );
      alert("Sign up confirmed!");
      await Auth.signIn(this.state.username, this.state.password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  render = () => (
    <div className={containerStyles}>
      <h1 className={titleStyles}>Todo Share</h1>
      <div className={formStyles}>
        <input
          className={inputStyles}
          type="text"
          placeholder="Username"
          value={this.state.username}
          onChange={event => {
            const { value } = event.target;
            this.setState(state => ({
              ...state,
              username: value
            }));
          }}
        />
        <input
          className={inputStyles}
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={event => {
            const { value } = event.target;
            this.setState(state => ({
              ...state,
              password: value
            }));
          }}
        />
        <input
          className={inputStyles}
          type="email"
          placeholder="Email"
          value={this.state.email}
          onChange={event => {
            const { value } = event.target;
            this.setState(state => ({
              ...state,
              email: value
            }));
          }}
        />
        <input
          className={inputStyles}
          type="submit"
          value="Sign Up"
          onClick={this.signUp}
        />
        <div className={dividerStyles} />
        <input
          className={inputStyles}
          type="text"
          value={this.state.verificationCode}
          placeholder="Code"
          onChange={event => {
            const { value } = event.target;
            this.setState(state => ({
              ...state,
              verificationCode: value
            }));
          }}
        />
        <input
          className={inputStyles}
          type="submit"
          value="Code"
          onClick={this.confirmSignUp}
        />
        <div className={dividerStyles} />
        <button
          className={inputStyles}
          type="button"
          onClick={this.props.onSwitchForm}
        >
          Login
        </button>
      </div>
    </div>
  );
}

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  logIn = async () => {
    try {
      await Auth.signIn(this.state.username, this.state.password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  render = () => (
    <div className={containerStyles}>
      <h1 className={titleStyles}>Todo Share</h1>
      <div className={formStyles}>
        <input
          className={inputStyles}
          type="text"
          placeholder="Username"
          value={this.state.username}
          onChange={event => {
            const { value } = event.target;
            this.setState(state => ({
              ...state,
              username: value
            }));
          }}
        />
        <input
          className={inputStyles}
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={event => {
            const { value } = event.target;
            this.setState(state => ({
              ...state,
              password: value
            }));
          }}
        />
        <input
          className={inputStyles}
          type="submit"
          value="Login"
          onClick={this.logIn}
        />
        <div className={dividerStyles} />
        <button
          className={inputStyles}
          type="button"
          onClick={this.props.onSwitchForm}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default class Authenticate extends Component {
  state = {
    login: true
  };

  render = () =>
    this.state.login ? (
      <Login
        onSwitchForm={() =>
          this.setState(() => ({
            login: false
          }))
        }
      />
    ) : (
      <SignUp
        onSwitchForm={() =>
          this.setState(() => ({
            login: true
          }))
        }
      />
    );
}
