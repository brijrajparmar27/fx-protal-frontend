import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route, NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { CMS } from "../utils/API";

// core components
import HomeNavbar from "components/Navbars/HomeNavbar.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import routes from "routes.js";
import Button from "components/CustomButtons/Button.jsx";
import ListItemText from "@material-ui/core/ListItemText";
import { TrackPage, PageView, initGA } from "views/Components/Tracking";

import pagesStyle from "assets/jss/material-dashboard-pro-react/layouts/homeStyle.jsx";

import logoTransparent from "assets/img/FXguardLogoTransparent.png";

import facebook from "assets/img/landing/facebook-logo-button.png";
import linkedin from "assets/img/landing/linkedin.png";
import twitter from "assets/img/landing/twitter-logo-button.png";
import youtube from "assets/img/landing/youtube.png";

import CookieConsent from "components/CookieConsent/CookieConsent.jsx";
// import { module } from "assets/config";

import homePageJson from "assets/s3-json/homePage.json";

const Pages = props => {
  const [cms, setCms] = useState();
  const { classes, ...rest } = props;
  console.log(props);

  async function componentDidMount() {
    // if (module === "RISKS") {
      setCms(homePageJson);
    // } else {
    //   await CMS.get("/cms/public/pages/homePage.json").then(res => {
    //     const cms = res.data;
    //     setCms(cms);
    //   });
    // }
  }
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    componentDidMount();
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 960) {
      document.body.style.overflow = "unset";
    }
  });

  return cms ? (
    <div style={{ width: "99%" }}>
      {/* <div style={{ width: "calc(100% - 15px)" }}> */}
      <HomeNavbar
        brandText={getActiveRoute(routes)}
        data={cms.header}
        {...rest}
      />
      <CookieConsent />

      {/* <div className={classes.wrapper} ref="wrapper"> */}
      <div className={classes.homeBodyContainer}>
        <Switch>{getRoutes(routes, cms)}</Switch>
        <Switch>{getOverlayRoutes(routes, cms)}</Switch>
      </div>
      {/* <HomePage cms={cms} /> */}
      <GridContainer
        justify="center"
        style={{
          backgroundColor: "black",
          color: "white",
          paddingTop: 50,
          paddingBottom: 160,
          paddingRight: 30,
          textAlign: window.innerWidth <= 992 ? "center" : "left"
        }}
      >
        <GridItem xs={12} sm={12} md={10} lg={9}>
          <GridContainer
            justify="center"
            style={{
              justifyContent: "space-between",
              margin: 0
            }}
          >
            <GridItem xs={12} sm={12} md={12} lg={4}>
              <img
                src={logoTransparent}
                alt={""}
                className={classes.titleImage}
                style={{ height: 40 }}
              />
              <p
                style={{
                  fontSize: 13,
                  marginTop: 10
                }}
              >
                Regulated by the Financial Conduct Authority (FCA), UK (FRN
                918221), as an Authorised Payment Institution (API). Registered
                with HMRC (XFML00000163557); HMRC is a supervisory body for
                Money Laundering Regulations in the UK.
              </p>
              <p>&copy; FXGuard Limited 2022. All rights reserved</p>
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={3}
              style={{
                fontSize: 13,
                fontWeight: 500
              }}
            >
              <p>{cms.body.footer.heading.content}</p>
              <hr
                style={{
                  width: 30,
                  margin: window.innerWidth <= 992 ? "auto" : 0
                }}
              />
              <ul
                style={{
                  listStyleType: "none",
                  paddingLeft: 0
                }}
              >
                {cms.body.footer.moreInformation.links.map((item, index) => (
                  <li key={index}>
                    <NavLink to={"" + item.link}>
                      <ListItemText
                        primary={item.label}
                        disableTypography={true}
                        className={classes.listItemText}
                      />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={3}
              //style={{ textAlign: "right" }}
            >
              <a
                href="https://www.facebook.com/fxguardlimited"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={facebook}
                  alt={"facebook"}
                  className={classes.socialButton}
                />
              </a>
              <a
                href="https://www.linkedin.com/company/fxguard-limited/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={linkedin}
                  alt={"linkedin"}
                  className={classes.socialButton}
                />
              </a>
              {/* <a
                href="https://twitter.com/fx_guard/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={twitter}
                  alt={"twitter"}
                  className={classes.socialButton}
                />
              </a> */}
              <a
                href="https://www.youtube.com/channel/UCXkiWPp5rEcAl_-BDMdvSVA/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={youtube}
                  alt={"youtube"}
                  className={classes.socialButton}
                />
              </a>
              <NavLink to={"/home/contact-us"}>
                <Button
                  round={false}
                  color="info"
                  size="lg"
                  style={{ width: "90%", height: 52 }}
                >
                  CONTACT US
                </Button>
              </NavLink>
              <p
                style={{
                  fontSize: 13
                }}
              >
                Support Line: +44 (020) 8168-0505
              </p>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </div>
  ) : (
    ""
  );
};

const getRoutes = (routes, cms) => {
  return routes.map((prop, key) => {
    if (prop.collapse) {
      return getRoutes(prop.views, cms);
    }
    if (prop.layout === "/home" && !prop.overlay) {
      // console.log('PATH - ', prop.layout + prop.path);
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
const getOverlayRoutes = (routes, cms) => {
  return routes.map((prop, key) => {
    if (prop.collapse) {
      return getOverlayRoutes(prop.views, cms);
    }
    if (prop.layout === "/home" && !!prop.overlay) {
      return (
        <Route
          path={prop.layout + (prop.path === "" ? "landing" : prop.path)}
          key={key}
          // component={prop.component}
          render={data => {
            console.log("line257", data);

            if (prop.path === "/signup-page" && data.location.state == null) {
              //|| !data.location.state.notProspectDemoUser)){
              let location = data.location;
              location.state = { notProspectDemoUser: true };
              data.location = location;
              return <prop.component {...data} />;
            }
            return <prop.component {...data} />;
          }}
        />
      );
    } else {
      return null;
    }
  });
};
const getActiveRoute = routes => {
  let activeRoute = "Default Brand Text";
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].collapse) {
      let collapseActiveRoute = getActiveRoute(routes[i].views);
      if (collapseActiveRoute !== activeRoute) {
        return collapseActiveRoute;
      }
    } else {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        TrackPage();
        return routes[i].name;
      }
    }
  }
  return activeRoute;
};

Pages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(pagesStyle)(Pages);
