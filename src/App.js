import React from "react";
import { Router } from "@reach/router";

import Home from "./Home";
import Login from "./Login";
import Loading from "./Loading";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider, AuthConsumer } from "./auth-context";

const App = () => (
  <AuthProvider>
    <AuthConsumer>
      {({ loaded }) =>
        loaded ? (
          <Router>
            <Login path="/login" />
            <ProtectedRoute component={Home} default />
          </Router>
        ) : (
          <Loading />
        )
      }
    </AuthConsumer>
  </AuthProvider>
);

export default App;
