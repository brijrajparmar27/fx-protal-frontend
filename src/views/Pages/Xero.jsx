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
  successColor,
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
const onClickXeroConnect = async () => {
      const res = await apiHandler({
        url: "fx-forrex/v1/xero/accounting/authorize?redirectUri=http://localhost:3000/xero-oauth"        ,
        authToken: sessionStorage.getItem("token")
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else if (res.data.errorCode === 403) {
          return;
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: res.data.userDesc
          });
        }
      } else {
       console.log(res.data);
       window.location.href = res.data.redirect_uri;
      }
};
const Xero = ({ classes }) => {
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
                <Button
                    size="sm"
                    style={{
                    backgroundColor: successColor[1],
                    // width: 270,
                    marginTop: 20
                    }}
                    onClick={() => onClickXeroConnect()}
                >
                    <h5>CONNECT</h5>
                </Button>
                
              </div>
            </div>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
};

Xero.propTypes = {
  classes: PropTypes.object.isRequired,
  plan: PropTypes.object.isRequired,
  onPlanSelection: PropTypes.func
};

export default withRouter(withStyles(styles)(Xero));
