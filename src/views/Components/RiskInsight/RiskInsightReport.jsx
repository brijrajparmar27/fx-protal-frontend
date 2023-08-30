import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import RiskInsightDataReport from "./RiskInsightDataReport.jsx";
import RiskInsightInputReport from "./RiskInsightInputReport.jsx";
import { formatDate } from "../../../utils/Utils";

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

class RiskInsightReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  render() {
    const {
      classes,
      functionalCurrency,
      questionsObj,
      reportData
    } = this.props;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={6} sm={6} md={6} lg={6}>
            <h4 style={{ display: "inline-block" }}>
              <b>Risk Insight Reports</b>
            </h4>
          </GridItem>
          <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: "right" }}>
            <h4 style={{ display: "inline-block" }}>
              {reportData.reportCreatedDate && <b>
                {"Report Date: " + formatDate(reportData.reportCreatedDate)}
              </b>}
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
                      <Tab
                        label="Risk Insight Report"
                        {...a11yProps(0, classes)}
                      />
                      <Tab label="Your Inputs" {...a11yProps(1, classes)} />
                    </Tabs>
                  </div>
                  <TabPanel
                    value={this.state.value}
                    index={0}
                    className={classes.tabPanelClass}
                  >
                    <RiskInsightDataReport
                      functionalCurrency={reportData.baseCurrency ? reportData.baseCurrency : functionalCurrency}
                      questionsObj={questionsObj}
                      reportData={reportData}
                      toggleView={this.props.toggleView}
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={1}
                    className={classes.tabPanelClass}
                  >
                    <RiskInsightInputReport
                      functionalCurrency={reportData.baseCurrency ? reportData.baseCurrency : functionalCurrency}
                      reportData={reportData}
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
RiskInsightReport.propTypes = {
  classes: PropTypes.object.isRequired,
  functionalCurrency: PropTypes.object,
  questionsObj: PropTypes.object,
  reportData: PropTypes.object,
  toggleView: PropTypes.func
};
export default withStyles(style)(RiskInsightReport);
