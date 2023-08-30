import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import RiskImpact from "./RiskImpact";
import StackBarChart from "./RiskHorizon/StackBarChart";
import BubbleChart from "./RiskHorizon/BubbleChart";
import RiskAlert from "./RiskAlert";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import RiskInputPrint from "./RiskInputPrint";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
const style = theme => ({
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
    // , textAlign: "center"
  },
  question: {
    marginTop: "35px",
    fontSize: "20px"
  },
  options: {
    marginTop: "25px"
  },
  footer: {
    padding: "20px 15px 0px 15px"
  },
  subTitle: {
    float: "left",
    paddingTop: 30
  },
  center: {
    textAlign: "center "
  },
  boxInput: {
    border: "1px solid #757575",
    padding: 5
  },
  groupHeader: {
    textAlign: "left",
    fontSize: 30,
    marginTop: 0
  },
  featureTitleHeader: {
    //height: 35,
    color: "#3c4858",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold"
    // textAlign: "center"
    //marginTop: 0
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "5px 25px"
  },
  circleTooltiptext: {
    visibility: "hidden",
    width: "auto",
    backgroundColor: "#555",
    color: "#fff",
    textAlign: "center",
    borderRadius: "6px",
    padding: "5px ",
    position: "absolute",
    zIndex: "1",
    top: "125%",
    left: "50%",
    opacity: "0",
    transition: "opacity 0.3s"
  },
  iconButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: "#53ac57",
    float: "right"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
});

const CATEGORIES = [
  { name: "low", color: "limegreen" },
  { name: "medium", color: "gold" },
  { name: "high", color: "tomato" },
  { name: "max", color: "firebrick" }
];

class RiskRadarPrint extends React.Component {
  error = {
    // profitOtherNameErrorMsg: {
    //   required: "Specify Name of Profit"
    // },
  };

  constructor(props) {
    super(props);
    this.state = {
      callInProgress: false,
      actualRiskValue: 0,
      riskAlertPercentage: 0,
      minRiskAmount: 0,
      maxRiskAmount: 100,
      nonRiskAmount: 0,
      lowRiskAmount: 0,
      mediumRiskAmount: 0,
      highRiskAmount: 0,
      unbearableRiskAmount: 0,
      showSpeedometer: false,
      showSettingsDialog: false,
      isChanged: false,
      thresoldRiskAmount: "",
      emailIDs: "",
      sendEmail: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }

  render() {
    const { classes, impactData } = this.props;

    return (
      <div style={{ margin: 40 }}>
        <div>
          <RiskInputPrint
                      parsedRiskRadarData={this.props.parsedRiskRadarData}
                      isChanged={this.props.isChanged}

            impactData={this.props.impactData}
            existingHedgesDisplay={this.props.existingHedgesDisplay}
            existingAssetsDisplay={this.props.existingAssetsDisplay}
            existingLiabilitiesDisplay={this.props.existingLiabilitiesDisplay}
            payablesDisplay={this.props.payablesDisplay}
            receivablesDisplay={this.props.receivablesDisplay}
            forecastedRevenuesDisplay={this.props.forecastedRevenuesDisplay}
            forecastedCostsDisplay={this.props.forecastedCostsDisplay}
          />
        </div>
        
        <div style={{ marginTop: 60, pageBreakBefore: "always" }}>
          <h4>
            <b>Risk Horizon - Bubble Chart</b>
          </h4>
          <div>
            <BubbleChart
            parsedRiskRadarData={this.props.parsedRiskRadarData}
            isChanged={this.props.isChanged}

              printComponent={true}
            />
          </div>
        </div>
        <div style={{ marginTop: 60, pageBreakBefore: "always" }}>
          <h4>
            <b>Risk Horizon - Stack Bar Chart - Category Wise</b>
          </h4>
          <div>
            <StackBarChart
           
              printComponent={true}

               chartCurrentView={'categoryWise'}
            parsedRiskRadarData={this.props.parsedRiskRadarData}
            isChanged={this.props.isChanged}
          
            // minYear={this.state.minYear}
            // maxYear={this.state.maxYear}
           
            />
          </div>
          <div style={{ marginTop: 60 }}>
          <h4>
            <b>Risk Horizon - Stack Bar Chart - Currency Wise</b>
          </h4>
            <StackBarChart
           
              printComponent={true}

               chartCurrentView={'currencyWise'}
            parsedRiskRadarData={this.props.parsedRiskRadarData}
            isChanged={this.props.isChanged}
          
            // minYear={this.state.minYear}
            // maxYear={this.state.maxYear}
           
            />
          </div>
        </div>
        <div style={{ marginTop: 60, pageBreakBefore: "always" }}>
          <RiskImpact
                        riskRadarData={this.props.riskRadarData}
                        parsedRiskRadarData={this.props.parsedRiskRadarData}
                        functionalCurrency={this.props.functionalCurrency}
                        senstivityPercentage={this.props.senstitivityPercentage}
            isChanged={this.props.isChanged}
            printComponent={true}
          />
        </div>
        <div style={{ marginTop: 60, pageBreakBefore: "always" }}>
          <h4>
            <b>Risk Alert</b>
          </h4>
          <div>
            <RiskAlert
riskRadarData={this.props.riskRadarData}
            isChanged={this.props.isChanged}

functionalCurrency={this.props.functionalCurrency}
              printComponent={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
RiskRadarPrint.propTypes = {
  classes: PropTypes.object.isRequired,
  impactData: PropTypes.object.isRequired,
  calculateGraph: PropTypes.func,
  isChanged: PropTypes.bool
};
export default withStyles(style)(RiskRadarPrint);
