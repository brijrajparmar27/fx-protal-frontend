import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import routes from "routes.js";
import { Switch, Route } from "react-router-dom";

// @material-ui/icons
import Work from "@material-ui/icons/Work";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { CMS } from "../../utils/API";

import {
  cardTitle,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const styles = {
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem"
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px"
  },
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px"
    }
  },
  iconRose: {
    color: roseColor
  },
  marginTop30: {
    marginTop: "30px"
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px"
    }
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999"
  },
  listItemIcon: {
    marginTop: "-3px",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    color: "inherit",
    display: "inline-block"
  }
};

//import contactUsPageStyle from "assets/jss/material-dashboard-pro-react/views/contactUsPageStyle";

const SubmitCustomerRegistration = props => {
  const [cms, setCms] = useState();
  const { classes } = props;
  const contentPath = "/cms/public/pages/contactUs.json";

  async function componentDidMount() {
    await CMS.get(contentPath).then(res => {
      const cms = res.data;
      setCms(cms);
    });
  }

  useEffect(() => {
    componentDidMount();
  }, []);

  function getRoutes(routes, cms) {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views, cms);
      }
      if (prop.layout === "/auth/customer-registration" && !prop.overlay) {
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
  }

  return cms ? (
    <>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} lg={8}>
          <h4>
            <b>Customer Registration</b>
          </h4>
        </GridItem>
        <GridItem xs={12} sm={8}>
          <Card>
            <CardHeader color="warning" text>
              <CardText color="warning">
                <Work className={classes.listItemIcon} />
              </CardText>
            </CardHeader>
            <CardBody style={{ paddingLeft: 100, top: -60 }}>
              <b>
                You are about to submit your customer application to FXGuard
              </b>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <Switch>{getRoutes(routes, null)}</Switch>
    </>
  ) : (
    ""
  );
};

SubmitCustomerRegistration.propTypes = {
  classes: PropTypes.object.isRequired
};

//export default withStyles(contactUsPageStyle)(CustomerRegistration);
export default withStyles(styles)(SubmitCustomerRegistration);
