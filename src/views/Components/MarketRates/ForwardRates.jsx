import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import ForwardPriceRates from "./ForwardPriceRates";
import HedgingCostsView from "./HedgingCostsView";
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

class ForwardRates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      currencyPairDataChanged: false,
      currencyPairs: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  componentDidMount() {
    this.getCurrencyPairs();
  }
  getCurrencyPairs = async () => {
    this.props.setLoading(true);
    let isDefaultRequired = false;
    const res = await apiHandler({
      url: endpoint.CURRENCY_PAIRS + "?type=FXFWD&default=false",
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
        isDefaultRequired = true;
      }
    } else {
      if (res.data.currencyPairs) {
        const currencyPairs = res.data.currencyPairs.slice(0, 10);
        this.setState({
          currencyPairs: currencyPairs,
          currencyPairDataChanged: true
        });
      } else {
        isDefaultRequired = true;
      }
    }
    if (isDefaultRequired) {
      // Get all default Currency Pairs
      const resDefault = await apiHandler({
        url: endpoint.CURRENCY_PAIRS + "?type=FXFWD&default=true",
        authToken: sessionStorage.getItem("token")
      });
      if (resDefault.data.errorCode) {
        if (resDefault.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else if (resDefault.data.errorCode === 403) {
          return;
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: resDefault.data.userDesc
          });
        }
      } else {
        const currencyPairs = resDefault.data.currencyPairs.slice(0, 10);
        this.setState({
          currencyPairs: currencyPairs,
          currencyPairDataChanged: true
        });
      }
    }
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  onSubmitCurrencyPair = async newCurrencyPairs => {
    this.setState({ callInProgress: true });
    const param = {
      currencyPairs: newCurrencyPairs,
      type: "FXFWD"
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CURRENCY_PAIRS,
      data: param,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });

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
      const currencyPairs = res.data.currencyPairs
        ? res.data.currencyPairs.slice(0, 10)
        : [];
      this.setState({
        currencyPairs: currencyPairs,
        currencyPairDataChanged: !this.state.currencyPairDataChanged
      });
    }
  };
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  render() {
    const {
      classes,
      currencies,
      setLoading,
      currencyPairs,
      currencyPairDataChanged,
      updateCurrencyPair,
      display
    } = this.props;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <h4 style={{ display: "inline-block" }}>
              <b>Forward Rates</b>
            </h4>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <div>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={classes.root}
                >
                  <div
                    position="static"
                    color="default"
                    style={{ paddingLeft: 30 }}
                  >
                    <Tabs
                      value={this.state.value}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="full width tabs example"
                    >
                      <Tab label="Price" {...a11yProps(0, classes)} />
                      <Tab
                        label={
                          <Tooltip
                            title="These are mid indicative costs and do not take into account bid offer or counterparty credit and other spreads. Positive value indicates a cost whereas a negative value indicates benefit given the differential between spot rate and forward rate in a particular currency pair."
                            placement="top"
                            classes={{
                              tooltip: classes.tooltipCalculator
                            }}
                          >
                            <span>
                              Hedging Costs{" "}
                              <InfoOutlined className={classes.info} />
                            </span>
                          </Tooltip>
                        }
                        {...a11yProps(1, classes)}
                      />
                    </Tabs>
                  </div>
                  <TabPanel
                    value={this.state.value}
                    index={0}
                    className={classes.tabPanelClass}
                  >
                    <ForwardPriceRates
                      currencies={currencies}
                      setLoading={setLoading}
                      currencyPairs={currencyPairs}
                      updateCurrencyPair={this.onSubmitCurrencyPair}
                      display={display}
                      currencyPairs={this.state.currencyPairs}
                      currencyPairDataChanged={
                        this.state.currencyPairDataChanged
                      }
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={1}
                    className={classes.tabPanelClass}
                  >
                    <HedgingCostsView
                      currencies={currencies}
                      setLoading={setLoading}
                      currencyPairs={currencyPairs}
                      currencyPairs={this.state.currencyPairs}
                      currencyPairDataChanged={
                        this.state.currencyPairDataChanged
                      }
                      updateCurrencyPair={this.onSubmitCurrencyPair}
                      display={display}
                    />
                  </TabPanel>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
          {this.state.noticeModal && (
            <NoticeModal
              noticeModal={this.state.noticeModal}
              noticeModalHeader={this.state.noticeModalHeader}
              noticeModalErrMsg={this.state.noticeModalErrMsg}
              closeModal={this.closeNoticeModal}
            />
          )}
        </GridContainer>
      </>
    );
  }
}
ForwardRates.propTypes = {
  classes: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  setLoading: PropTypes.func.isRequired,
  currencyPairs: PropTypes.array.isRequired,
  currencyPairDataChanged: PropTypes.func.isRequired,
  updateCurrencyPair: PropTypes.func.isRequired,
  display: PropTypes.string
};
export default withRouter(withStyles(style)(ForwardRates));
