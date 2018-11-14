import React from "react";
import { Redirect } from "@reach/router";

import { AuthConsumer } from "./auth-context";

export default ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isAuthenticated }) => {
      if (!isAuthenticated) {
        return <Redirect to="/login" noThrow />;
      }
      return <Component {...rest} />;
    }}
  </AuthConsumer>
);
