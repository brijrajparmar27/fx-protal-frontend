import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.jsx";
import routes from "routes.js";

import pagesStyle from "assets/jss/material-dashboard-pro-react/layouts/authStyle.jsx";

import register from "assets/img/register.jpeg";
import login from "assets/img/login.jpeg";
import lock from "assets/img/lock.jpeg";
import error from "assets/img/clint-mckoy.jpg";
import pricing from "assets/img/bg-pricing.jpeg";

import Footer from "./Footer";

class Pages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {}
    };
  }
  componentDidMount() {
    document.body.style.overflow = "unset";
  }
  setUserInfo = userInfo => {
    this.setState({
      userInfo
    });
  };
  getRoutes = (routes, cms) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views, cms);
      }
      if (
        (prop.layout === "/auth" || prop.layout === "/auth/admin") &&
        !prop.overlay
      ) {
        return (
          <Route
            path={prop.layout + prop.path}
            key={key}
            render={() => (
              <prop.component cms={cms} contentPath={prop.contentPath} />
            )}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBgImage = () => {
    if (window.location.pathname.indexOf("/auth/register-page") !== -1) {
      return register;
    } else if (window.location.pathname.indexOf("/auth/login-page") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/pricing-page") !== -1) {
      return pricing;
    } else if (
      window.location.pathname.indexOf("/auth/lock-screen-page") !== -1
    ) {
      return lock;
    } else if (window.location.pathname.indexOf("/auth/error-page") !== -1) {
      return error;
    }
  };
  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  render() {
    console.log(this.props);
    const { classes, ...rest } = this.props;
    return (
      <div>
        <AuthNavbar
          brandText={this.getActiveRoute(routes)}
          {...rest}
          setUserInfo={this.setUserInfo}
        />
        <div style={{ paddingTop: 100, minHeight: "calc(100vh - 20px)" }}>
          <Switch>{this.getRoutes(routes, null)}</Switch>
        </div>
        <Footer userInfo={this.state.userInfo} />
      </div>
    );
  }
}

Pages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(pagesStyle)(Pages);
