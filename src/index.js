import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { StateProvider, useStateValue } from "utils/Utils.js";
import AuthLayout from "layouts/Auth.jsx";
import RtlLayout from "layouts/RTL.jsx";
import AdminLayout from "layouts/Admin.jsx";
import HomeLayout from "layouts/Home.jsx";
import XeroOauth from "views/Pages/XeroOauth.jsx";
import { refreshToken } from "utils/Utils.js";
import { history } from "variables/general";

import "assets/scss/material-dashboard-pro-react.scss?v=1.5.0";

const hist = createBrowserHistory();

const initialState = {
  authenticated: !!sessionStorage.getItem("token")
};

const App = () => {
  const ProtectedRoute = ({ ...routeProps }) => {
    // eslint-disable-next-line no-unused-vars
    const [{ authenticated }, dispatch] = useStateValue(initialState);
    refreshToken();
    return (
      <Route
        {...routeProps}
        component={authenticated ? routeProps.component : HomeLayout}
      />
    );
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "changeAuthenticated":
        return {
          ...state,
          authenticated: action.authenticated
        };

      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <BrowserRouter history={history}>
        <Switch>
          <Route path="/rtl" component={RtlLayout} />
          <ProtectedRoute path="/auth" component={AuthLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Route path="/home" component={HomeLayout} />
          <Route exact path="/xero-oauth" component={XeroOauth} />
          <Redirect from="/" to="/home" />
        </Switch>
      </BrowserRouter>
    </StateProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
