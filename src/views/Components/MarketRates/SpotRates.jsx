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

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import LiveExchangeRates from "./LiveExchangeRates";
import SpotPerformanceView from "./SpotPerformanceView";
import NoticeModal from "views/Components/NoticeModal.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
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

class SpotRates extends React.Component {
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

  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  getCurrencyPairs = async () => {
    this.props.setLoading(true);

    let config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    };
    const res = await apiHandler({
      url: endpoint.CURRENCY_PAIRS + "?type=FXSPOT",
      authToken: sessionStorage.getItem("token")
    });
    this.props.setLoading(false);

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
        currencyPairDataChanged: true
      });
    }
  };
  onSubmitCurrencyPair = async newCurrencyPairs => {
    this.setState({ callInProgress: true });

    console.log("editcurrencypair", newCurrencyPairs);
    const param = {
      currencyPairs: newCurrencyPairs,
      type: "FXSPOT"
    };
    //CURRENCY_PAIRS
    const res = await apiHandler({
      url: endpoint.CURRENCY_PAIRS,
      method: "POST",
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
      updateCurrencyPair,
      display
    } = this.props;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <h4 style={{ display: "inline-block" }}>
              <b>Live Exchange Rates</b>
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
                      <Tab label="Performance" {...a11yProps(1, classes)} />
                    </Tabs>
                  </div>
                  <TabPanel
                    value={this.state.value}
                    index={0}
                    className={classes.tabPanelClass}
                  >
                    <LiveExchangeRates
                      currencies={currencies}
                      setLoading={setLoading}
                      currencyPairs={this.state.currencyPairs}
                      currencyPairDataChanged={
                        this.state.currencyPairDataChanged
                      }
                      updateCurrencyPair={this.onSubmitCurrencyPair}
                      display={display}
                    />
                  </TabPanel>
                  <TabPanel
                    value={this.state.value}
                    index={1}
                    className={classes.tabPanelClass}
                  >
                    <SpotPerformanceView
                      currencies={currencies}
                      setLoading={setLoading}
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
SpotRates.propTypes = {
  classes: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  setLoading: PropTypes.func.isRequired,
  currencyPairs: PropTypes.array.isRequired,
  currencyPairDataChanged: PropTypes.func.isRequired,
  updateCurrencyPair: PropTypes.func.isRequired,
  display: PropTypes.string
};
export default withRouter(withStyles(style)(SpotRates));
