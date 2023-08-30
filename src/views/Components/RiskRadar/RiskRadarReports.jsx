import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HedgeEffectiveness from "./RiskRadarReports/HedgeEffectiveness";
import KeyExposures from "./RiskRadarReports/KeyExposures";
import ExposureLinkedHedgeList from "./RiskRadarReports/ExposureLinkedHedgeList";
import ActualHedge from "./RiskRadarReports/ActualHedge";
import HedgeNotLinkedList from "./RiskRadarReports/HedgeNotLinkedList";
import RiskHedgeReport from "./RiskRadarReports/RiskHedgeReport";
import HedgeAnalysisReport from "./RiskRadarReports/HedgeAnalysisReport";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const style = theme => ({
  tabroot: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: "#40a9ff",
      opacity: 1
    },
    "&$selected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: "#40a9ff"
    }
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
});

function a11yProps(index, classes) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    classes: {
      root: classes.tabroot
    }
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

class RiskRadarReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      currencyPairDataChanged: false,
      currencyPairs: []
    };
  }
  componentDidMount() {}
  setLoading = () => {};

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  render() {
    const { classes, riskRadarData, parsedRiskRadarData } = this.props;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <h4 style={{ display: "inline-block" }}>
              <b>Risk Radar Reports</b>
            </h4>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <div>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={classes.root}
                >
                  <div position="static" color="default">
                    <Tabs
                      value={this.state.value}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      variant="scrollable"
                      textColor="primary"
                      aria-label="full width tabs example"
                    >
                      <Tab label="Actual Hedge %" {...a11yProps(0, classes)} />
                      <Tab label="Hedged Items" {...a11yProps(1, classes)} />
                      <Tab
                        label="Not Linked Hedges"
                        {...a11yProps(2, classes)}
                      />
                      <Tab label="Key Exposures" {...a11yProps(3, classes)} />
                      <Tab
                        label="Hedge Effectiveness"
                        {...a11yProps(4, classes)}
                      />
                      <Tab label="Risk & Hedges" {...a11yProps(5, classes)} />
                      <Tab label="Hedge Analysis" {...a11yProps(6, classes)} />
                    </Tabs>
                  </div>
                  <TabPanel
                    value={this.state.value}
                    index={0}
                    className={classes.tabPanelClass}
                  >
                    <ActualHedge
                      riskRadarData={riskRadarData}
                      functionalCurrency={
                        parsedRiskRadarData.functionalCurrency
                      }
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={1}
                    className={classes.tabPanelClass}
                  >
                    <ExposureLinkedHedgeList
                      parsedRiskRadarData={parsedRiskRadarData}
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={2}
                    className={classes.tabPanelClass}
                  >
                    <HedgeNotLinkedList
                      riskRadarData={riskRadarData}
                      getRiskRadarData={this.props.getRiskRadarData}
                      functionalCurrency={this.props.functionalCurrency}
                      isChanged={this.props.isChanged}
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={3}
                    className={classes.tabPanelClass}
                  >
                    <KeyExposures
                      setLoading={this.setLoading}
                      riskRadarData={riskRadarData}
                      parsedRiskRadarData={parsedRiskRadarData}
                      functionalCurrency={this.props.functionalCurrency}
                      senstivityPercentage={this.props.senstivityPercentage}
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={4}
                    className={classes.tabPanelClass}
                  >
                    <HedgeEffectiveness
                      parsedRiskRadarData={parsedRiskRadarData}
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={5}
                    className={classes.tabPanelClass}
                  >
                    <RiskHedgeReport
                      parsedRiskRadarData={parsedRiskRadarData}
                      riskRadarData={riskRadarData}
                      functionalCurrency={this.props.functionalCurrency}
                      currencies={this.props.currencies}
                      getRiskRadarData={this.props.getRiskRadarData}
                      isChanged={this.props.isChanged}
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={6}
                    className={classes.tabPanelClass}
                  >
                    <HedgeAnalysisReport
                      setLoading={this.setLoading}
                      parsedRiskRadarData={parsedRiskRadarData}
                      riskRadarData={riskRadarData}
                      functionalCurrency={this.props.functionalCurrency}
                      currencies={this.props.currencies}
                      getRiskRadarData={this.props.getRiskRadarData}
                      isChanged={this.props.isChanged}
                    />
                  </TabPanel>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
      </>
    );
  }
}
RiskRadarReports.propTypes = {
  classes: PropTypes.object.isRequired,
  riskRadarData: PropTypes.object.isRequired,
  parsedRiskRadarData: PropTypes.object,
  functionalCurrency: PropTypes.object,
  senstivityPercentage: PropTypes.object,
  currencies: PropTypes.array,
  isChanged: PropTypes.bool,
  getRiskRadarData: PropTypes.func
};
export default withStyles(style)(RiskRadarReports);
