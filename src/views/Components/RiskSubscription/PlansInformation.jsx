import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import {
  cardTitle,
  primaryColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
const styles = {
  ...regularFormsStyle,
  cardContainer: {
    transition: "all .3s ease-out",
    border: "solid 1px #e8e8e8",
    "&:hover": {
      boxShadow: "0 2px 15px 0 rgb(0 0 0 / 15%)"
    }
  },
  planContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  }
};

const PlansInformation = ({ classes, plan, onPlanSelection, onContactUs, isAvailable, riskStatus }) => {
  console.log(plan);
  return (
    <>
      <GridContainer justify="center" style={{ marginRight: 15 }}>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <Card className={classes.cardContainer}>
            <div className={classes.planContainer}>
              <div
                style={{
                  textAlign: "center",
                  width: "100%",
                  color: "#FFFFFF",
                  padding: "5px 15px",
                  fontSize: 24,
                  fontweight: 800,
                  backgroundColor: "#163e6d"
                }}
              >
                {plan.contactButton ? "More than 10 Users" : plan.maxUserAllowed === 1 ? plan.maxUserAllowed + " User" : "Up to " + plan.maxUserAllowed + " Users"}
              </div>
              <div
                style={{
                  padding: "35px 15px 40px 15px",
                  textAlign: "left",
                  minHeight: 179,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  borderBottom: "1px solid #ededed"
                }}
              >
                {plan && plan.description && plan.description.split("\r\n").map((d, i) => (
                  <p
                    style={{
                      marginTop: 10,
                      textAlign: "left",
                      minHeight: 21,
                      fontSize: 20,
                      fontweight: 500
                    }}
                    key={i}
                  >
                    {d}
                  </p>
                ))}
              </div>
              <div
                style={{
                  padding: "15px 0px 20px 0px",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column"
                }}
              >
                {plan.contactButton ? (
                  <Button
                  size="lg"
                  style={{ backgroundColor: primaryColor[5] }}
                  onClick={event => onContactUs(event, plan)}
                >
                  Contact US
                </Button>
                ) : (
                  <Button
                  size="lg"
                  disabled={!isAvailable}
                  style={{ backgroundColor: primaryColor[5] }}
                  onClick={event => onPlanSelection(event, plan)}
                >
                  {riskStatus.freePlanUsed ? "Start" : "Start One-Month*  Free Trial"}
                </Button>
              )}
              </div>
            </div>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
};

PlansInformation.propTypes = {
  classes: PropTypes.object.isRequired,
  plan: PropTypes.object.isRequired,
  onPlanSelection: PropTypes.func
};

export default withRouter(withStyles(styles)(PlansInformation));
