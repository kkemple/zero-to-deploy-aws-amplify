import React, { createContext, Component } from "react";
import { Auth } from "aws-amplify";

const { Provider, Consumer } = createContext({
  loaded: false,
  user: null,
  isAuthenticated: false
});

export class AuthProvider extends Component {
  state = {
    user: null,
    loaded: false,
    isAuthenticated: false
  };

  componentDidMount = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.setState(state => ({
        ...state,
        user,
        loaded: true,
        isAuthenticated: true
      }));
    } catch (error) {
      this.setState(
        state => ({
          ...state,
          loaded: true,
          isAuthenticated: false
        }),
        () => console.error(error)
      );
    }
    window.addEventListener("popstate", this.onPopState);
  };

  componentWillUnmount = async () => {
    window.removeEventListener("popstate", this.onPopState);
  };

  onPopState = async () => {
    if (this.state.isAuthenticated) {
      try {
        await Auth.currentAuthenticatedUser();
      } catch (error) {
        console.error(error);
        this.setState(state => ({
          ...state,
          user: null,
          isAuthenticated: false
        }));
      }
    }
  };

  render = () => <Provider value={this.state}>{this.props.children}</Provider>;
}

export const AuthConsumer = Consumer;
