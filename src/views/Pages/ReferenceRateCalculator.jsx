import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import RateCalculator from "views/Pages/RateCalculator";

import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const ReferenceRateCalculator = ({ classes }) => {
  return <>
          <GridContainer justify="center">
          <GridItem xs={10} sm={10} md={10} lg={10}>
              <div style={{ float: "left" }}>
                <h4>
                <span>
                    <b>
                      Reference Rate Calculator{" "}
                      <Tooltip
                        id="tooltip-calculator"
                        title="Reference rates are the market mid-point of the bid and offer for each currency – supplied by Xignite. Therefore, they are not dealing rates. For dealing rates, please choose the FX Dealing from the main page."
                        placement="top"
                        classes={{
                          tooltip: classes.tooltipCalculator
                        }}
                      >
                        <InfoOutlined className={classes.info} />
                      </Tooltip>
                    </b>
                  </span>
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: "small",
                      color: "#31ae0c"
                    }}
                  >
                    Live!
                  </span>
                </h4>
             </div>
             </GridItem>
              <GridItem xs={12} sm={12} md={10} lg={10}>
              <Card>
                <CardBody>
                  <RateCalculator />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
  </>;
};

ReferenceRateCalculator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(
  withStyles(regularFormsStyle)(ReferenceRateCalculator)
);
