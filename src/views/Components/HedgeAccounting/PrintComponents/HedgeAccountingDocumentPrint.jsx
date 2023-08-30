import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import cx from "classnames";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import hedgeAccountingPrintStyle from "assets/jss/material-dashboard-pro-react/views/hedgeAccountingPrintStyle.jsx";

class HedgeAccountingDocumentPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { classes, documentContent } = this.props;
    return (
      <div className={cx(classes.container)}>
        <GridContainer justify="center" className={classes.groupContainer}>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <h4 className={cx(classes.groupHeader, classes.featureTitleHeader)}>
              {this.props.documentName}
            </h4>
          </GridItem>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <h4>
              <b>Risk Management Objectives and Strategy</b>
            </h4>
            <p>{documentContent.riskManagementObjective}</p>
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>
              <b>Type of Hedging Relationship</b>
            </h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.typeOfHedingText}
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>
              <b>Date of Designation of hedge</b>
            </h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.dateOfDesignation}
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>
              <b>Nature of risk being hedged</b>
            </h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.natureofRiskOption == 3
              ? documentContent.natureofRiskOther
              : documentContent.natureofRiskText}
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>
              <b>Identification of hedged item</b>
            </h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.identificationOfHedgeItemText}
          </GridItem>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <p>{documentContent.identificationOfHedgeItemDescription}</p>
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>
              <b>Is the hedged item a forecasted transaction?</b>
            </h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.isForecastedTransactionText}
          </GridItem>
          {documentContent.isForecastedTransactionOption == 1 && (
            <>
              <GridItem xs={10} sm={10} md={10} lg={10}>
                <h4>
                  <b>{"Nature of forecasted transaction"}</b>
                </h4>
              </GridItem>
              <GridItem xs={10} sm={10} md={10} lg={10}>
                <p>{documentContent.natureOfForecastedDesignation}</p>
              </GridItem>
              <GridItem xs={10} sm={10} md={10} lg={10}>
                <h4>
                  <b>Expected time scale for forecasted transaction</b>
                </h4>
              </GridItem>
              <GridItem xs={10} sm={10} md={10} lg={10}>
                <p>{documentContent.timeScale}</p>
              </GridItem>
              <GridItem xs={10} sm={10} md={10} lg={10}>
                <h4>
                  <b>
                    Rationale for forecast transaction being highly probable to
                    occur
                  </b>
                </h4>
              </GridItem>
              <GridItem xs={10} sm={10} md={10} lg={10}>
                <p>{documentContent.rationale}</p>
              </GridItem>
            </>
          )}
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <h4>
              <b>Identification of hedging instrument</b>
            </h4>
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>Please enter deal ID or transaction No.</h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.dealId}
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>Designation of forward element of forward contracts</h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.designationOfForwardElementText}
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>Foreign currency basis spreads:</h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.foreignCurrencyText}
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>Time value of an option:</h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.timeValueText}
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5}>
            <h4>Proportion used for hedging:</h4>
          </GridItem>
          <GridItem
            xs={5}
            sm={5}
            md={5}
            lg={5}
            className={classes.pTagResponse}
          >
            {documentContent.proportionOfHedgingOption == 2
              ? documentContent.proportionOfHedgingValue
              : documentContent.proportionOfHedgingText}
          </GridItem>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <h4>
              <b>Hedge effectiveness</b>
            </h4>
            <p className={classes.pTagResponse}>
              {documentContent.hedgeEffectiveness}
            </p>
            <h4>
              <b>Credit risk does not dominate</b>
            </h4>
            <p className={classes.pTagResponse}>{documentContent.creditRisk}</p>
          </GridItem>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <h4>
              <b>Expected causes of hedge ineffectiveness, if any</b>
            </h4>
            <p>
              {documentContent.expectedCausesOfHedge &&
              documentContent.expectedCausesOfHedge !== ""
                ? documentContent.expectedCausesOfHedge
                : "none"}
            </p>
          </GridItem>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            {documentContent.anyOtherInfo &&
              documentContent.anyOtherInfo !== "" && (
                <>
                  <h4>
                    Any other information that may be used to assist with
                    understanding the hedging relationship, for example a
                    diagram of the transaction structure
                  </h4>
                  <h4>
                    <b>Additional Information</b>
                  </h4>
                  <p>{documentContent.anyOtherInfo}</p>
                </>
              )}
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
HedgeAccountingDocumentPrint.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(hedgeAccountingPrintStyle)(
  HedgeAccountingDocumentPrint
);
