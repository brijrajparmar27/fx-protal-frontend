import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

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
import MarketRatesCalendar from "../Components/MarketRates/MarketRatesCalendar";
import ResearchFeed from "../Components/MarketRates/ResearchFeed";
import ForwardRates from "../Components/MarketRates/ForwardRates";
import SpotRates from "../Components/MarketRates/SpotRates";
import CurrencyIntelligence from "../Components/MarketRates/CurrencyIntelligence";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import NoticeModal from "views/Components/NoticeModal.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const CURRENCYPAIRS = ["EURUSD", "USDINR"];

const style = {
  info: {
    display: "inline-block",
    verticalAlign: "super",
    fontSize: 14,
    marginRight: 5
  },
  tooltipCalculator: {
    padding: "10px 15px",
    minWidth: "200px",
    color: whiteColor,
    lineHeight: "1.7em",
    background: "rgb(" + hexToRgb(grayColor[6]) + ")",
    border: "none",
    borderRadius: "3px",
    opacity: "1!important",
    boxShadow:
      "0 8px 10px 1px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 3px 14px 2px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 5px 5px -3px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
    maxWidth: "400px",
    textAlign: "top",
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "400",
    textShadow: "none",
    textTransform: "none",
    letterSpacing: "normal",
    wordBreak: "normal",
    wordSpacing: "normal",
    wordWrap: "normal",
    whiteSpace: "normal",
    lineBreak: "auto"
  },
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

class MarketRates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      value: 0,
      callInProgress: false,
      currencyPairDataChanged: false,
      currencyPairs: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  componentWillMount() {
    this.getCurrencies();
    this.getUserCurrencyPairs();
  }

  getCurrencies = async () => {
    let config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    };
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      config,
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
      this.setState({
        currencies: res.data.currrencies
      });
    }
  };
  getUserCurrencyPairs = () => {
    this.setState({
      currencyPairs: CURRENCYPAIRS,
      currencyPairDataChanged: !this.state.currencyPairDataChanged
    });
  };

  updateCurrencyPair = (baseCurrency, quoteCurrency, index) => {
    let currencyPairs = [...CURRENCYPAIRS];
    currencyPairs[index] = baseCurrency + quoteCurrency;
    this.setState({
      currencyPairs: currencyPairs,
      currencyPairDataChanged: !this.state.currencyPairDataChanged
    });
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  setLoading = value => {
    this.setState({
      callInProgress: value
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <h4 style={{ display: "inline-block" }}>
              <b>
                Market Rates
                <Tooltip
                  id="tooltip-marketRates"
                  title="Where not mentioned, these are mid indicative rates. Green colour means positive change, and red colour means negative change from the previous level."
                  placement="top"
                  classes={{
                    tooltip: classes.tooltipCalculator
                  }}
                >
                  <InfoOutlined className={classes.info} />
                </Tooltip>
              </b>
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
                  <AppBar position="static" color="default">
                    <Tabs
                      value={this.state.value}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab label="Live Exchange Rate" {...a11yProps(0)} />
                      <Tab label="Cross Rates" {...a11yProps(1)} />
                      <Tab label="Forward Rates" {...a11yProps(2)} />
                      <Tab label="Economic Calendar" {...a11yProps(3)} />
                      <Tab label="currency News" {...a11yProps(4)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel
                    value={this.state.value}
                    index={0}
                    className={classes.tabPanelClass}
                  >
                    <SpotRates
                      currencies={this.state.currencies}
                      setLoading={this.setLoading}
                      currencyPairs={this.state.currencyPairs}
                      currencyPairDataChanged={
                        this.state.currencyPairDataChanged
                      }
                      updateCurrencyPair={this.updateCurrencyPair}
                      display="max"
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={1}
                    className={classes.tabPanelClass}
                  >
                    <CurrencyIntelligence
                      setLoading={this.setLoading}
                      currencies={this.state.currencies}
                      currencyPairs={this.state.currencyPairs}
                      currencyPairDataChanged={
                        this.state.currencyPairDataChanged
                      }
                      updateCurrencyPair={this.updateCurrencyPair}
                      display="min"
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={2}
                    className={classes.tabPanelClass}
                  >
                    <ForwardRates
                      setLoading={this.setLoading}
                      currencies={this.state.currencies}
                      currencyPairs={this.state.currencyPairs}
                      currencyPairDataChanged={
                        this.state.currencyPairDataChanged
                      }
                      updateCurrencyPair={this.updateCurrencyPair}
                      display="min"
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={3}
                    className={classes.tabPanelClass}
                  >
                    <MarketRatesCalendar />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={4}
                    className={classes.tabPanelClass}
                  >
                    <ResearchFeed />
                  </TabPanel>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
            }}
            open={this.state.callInProgress}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle
              id="waiting-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <h4 className={classes.modalTitle}>{"Processing..."}</h4>
            </DialogTitle>
            <DialogContent
              id="waiting-modal-slide-description"
              className={classes.modalBody}
              style={{ textAlign: "center" }}
            >
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}{" "}
      </>
    );
  }
}
MarketRates.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(MarketRates));
