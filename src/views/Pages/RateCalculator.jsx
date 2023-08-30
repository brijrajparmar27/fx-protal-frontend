import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import ForwardRateCalculator from "./ForwardRateCalculator";
import SpotRateCalculator from "./SpotRateCalculator";

import ResearchFeed from "../Components/MarketRates/ResearchFeed";
import ForwardRates from "../Components/MarketRates/ForwardRates";
import SpotRates from "../Components/MarketRates/SpotRates";
import CurrencyIntelligence from "../Components/MarketRates/CurrencyIntelligence";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";


const CURRENCYPAIRS = ["EURUSD", "USDINR"];

const style = {
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
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
          {/* <Typography>{children}</Typography> */}
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

class RateCalculator extends React.Component {
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
    const { classes } = this.props;
    return (
      <>
        <GridContainer justify="center">
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
                  <AppBar position="static" color="default">
                    <Tabs
                      value={this.state.value}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab label="Spot Rate" {...a11yProps(0)} />
                      <Tab label="Forward Rate" {...a11yProps(1)} />
                    </Tabs>
                  </AppBar>

                  <TabPanel
                    value={this.state.value}
                    index={0}
                    className={classes.tabPanelClass}
                  >
                    <SpotRateCalculator />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={1}
                    className={classes.tabPanelClass}
                  >
                    <ForwardRateCalculator />
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
RateCalculator.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(RateCalculator);
