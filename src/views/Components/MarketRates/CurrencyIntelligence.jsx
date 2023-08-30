import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import IconButton from "@material-ui/core/IconButton";
import AddAlertIcon from "@material-ui/icons/AddAlert";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import Table from "components/Table/Table.jsx";
import ChangeCurrencyPair from "./ChangeCurrencyPair";
import MarketRatesGraph from "./MarketRatesGraph";
import CurrencyPairAlert from "./CurrencyPairAlert";
import response from "views/Pages/json/marketrates.json";
import NoticeModal from "views/Components/NoticeModal.jsx";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const COLUMNS = [
  "Currency Pair",
  "1 Week",
  "3 Months",
  "6 Months",
  "9 Months",
  "1 Year",
  "2 Years",
  "5 Years"
];

const COLUMNSKEYPAIR = [
  { text: "1 Week", key: "OneWeek" },
  { text: "3 Months", key: "ThreeMonth" },
  { text: "6 Months", key: "SixMonth" },
  { text: "9 Months", key: "NineMonth" },
  { text: "1 Year", key: "OneYear" },
  { text: "2 Years", key: "TwoYear" },
  { text: "5 Years", key: "FiveYear" }
];

const MAPPEDCURRENCIES = [
  "EUR",
  "USD",
  "JPY",
  "GBP",
  "CHF",
  "AUD",
  "CAD",
  "NZD",
  "CNY"
];

const style = {
  container: {
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
  },
  mincontainer: {
    backgroundColor: "#ffffff",
    padding: "10px 0px"
  },
  tableHeadBold: {
    fontWeight: "bold"
  },
  tableHedgeHead: {
    //backgroundColor: "#5882c780",
    fontWeight: "bold"
  },
  center: {
    textAlign: "center "
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
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black"
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  currencyPairTag: {
    cursor: "pointer"
  },
  elemGreen: {
    color: "#53ac57"
  },
  elemRed: {
    color: "red"
  },
  elemBlack: {
    color: "#000000de"
  },
  closeButton: {
    visibility: "hidden"
  },
  elemGreen: {
    color: "#53ac57"
  },
  elemRed: {
    color: "red"
  },
  elemBlack: {
    color: "#000000de"
  },
  currencyPair: {
    "&:hover": {
      "& button": {
        visibility: "visible"
      }
    }
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class CurrencyIntelligence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: "",
      showGrid: false,
      apiData: [],
      displayData: [],
      showCurrencyPairModal: false,
      selectedObject: {},
      showGraphModal: false,
      showCurrencyPairAlertModal: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",

      mappedCurrencies: MAPPEDCURRENCIES,
      tableColumns: ["", ...MAPPEDCURRENCIES]
    };
    this.interval = null;
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  componentDidMount() {
    this.getCurrencyPairs();
  }

  getCurrencyPairs = () => {
    this.props.setLoading(true);
    this.getAPIData(true, MAPPEDCURRENCIES);
    this.registerForDataRefresh(MAPPEDCURRENCIES);
  };
  registerForDataRefresh = currencyPairs => {
    this.interval = setInterval(() => {
      this.getAPIData(false, currencyPairs);
    }, 5000);
  };
  componentWillUnmount() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }
  getAPIData = async (loading, currencies) => {
    if (loading) {
      this.props.setLoading(true);
    }
    currencies = currencies.join(",");

    //MARKET_EXCHANGE_RATE_LIVEGRAPH
    const res = await apiHandler({
      url:
        endpoint.MARKET_EXCHANGE_RATE_LIVEGRAPH + "?currencies=" + currencies,
      authToken: sessionStorage.getItem("token")
    });

    console.log("response", res);
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
      this.parseData(res.data.exchangeRates, loading);
    }
  };

  parseData = (apiData, loading) => {
    const classes = this.props.classes;
    if (apiData && apiData.length > 0) {
      let displayData = [];

      MAPPEDCURRENCIES.forEach((baseCurrency, index) => {
        let arr = [index, { data: baseCurrency, style: classes.elemBlack }];
        MAPPEDCURRENCIES.forEach((quoteCurrency, idx) => {
          let prevData =
            this.state.displayData[index] &&
            this.state.displayData[index][idx + 2]
              ? this.state.displayData[index][idx + 2]
              : 0;
          let currentData = this.getCurrencyData(
            apiData,
            baseCurrency,
            quoteCurrency
          );

          let color =
            parseFloat(prevData.data) > parseFloat(currentData)
              ? classes.elemRed
              : parseFloat(prevData.data) < parseFloat(currentData)
              ? classes.elemGreen
              : classes.elemBlack;
          arr.push({ data: currentData, style: color });
        });

        displayData = [...displayData, arr];
      });
      this.setState({
        apiData,
        displayData
      });
      if (loading) {
        this.props.setLoading(false);
      }
    }
  };
  getCurrencyData = (apiData, baseCurrency, quoteCurrency) => {
    let obj = apiData.filter(
      x => x.baseCurrency === baseCurrency && x.quoteCurrency === quoteCurrency
    );
    // console.log("getcurrencydata", obj);
    return obj.length > 0 ? obj[0].mid.toFixed(5) : "";
  };
  getValue = (key, forwardRates) => {
    let data = forwardRates.filter(x => x.Expiration === key);
    return data.length > 0 ? data[0].Mid : "";
  };

  getCurrencyPairButton = obj => {
    console.log("getCurrencyPairButton", obj);
    return (
      <div className={cx(this.props.classes.currencyPair)}>
        <a
          onClick={() => this.showCurrencyPairModal(obj)}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(this.props.classes.currencyPairTag)}
        >
          {obj.currencyPair}
        </a>
        <IconButton
          aria-label="close"
          className={this.props.classes.closeButton}
          onClick={() => this.openCurrencyPairAlertModal(obj)}
        >
          <AddAlertIcon />
        </IconButton>
      </div>
    );
  };
  openCurrencyPairAlertModal = obj => {
    this.setState({
      showCurrencyPairAlertModal: true,
      selectedObject: obj
    });
  };

  showCurrencyPairModal = obj => {
    this.setState({
      showGraphModal: true,
      selectedObject: obj
    });
  };
  handleCloseDialog = stateName => {
    this.setState({
      [stateName]: false
    });
  };
  render() {
    const { classes, display } = this.props;
    return (
      <div className={classes.container}>
        <h2 className={(classes.groupHeader, classes.featureTitleHeader)}>
          Cross Rates
        </h2>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={this.state.tableColumns}
              tableData={this.state.displayData}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[classes.tableHedgeHead]}
              customClassesForCells={[1]}
              isMarketData={true}
            />
          </GridItem>
        </GridContainer>

        {this.state.showGraphModal && (
          <MarketRatesGraph
            showModal={this.state.showGraphModal}
            handleClose={this.handleCloseDialog}
            selectedObject={this.state.selectedObject}
            setLoading={this.props.setLoading}
            graphAttribute={"mid"}
          />
        )}
        {this.state.showCurrencyPairAlertModal && (
          <CurrencyPairAlert
            showModal={this.state.showCurrencyPairAlertModal}
            handleClose={this.handleCloseDialog}
            currencyPairs={this.state.currencyPairs}
            currencyPair={this.state.selectedObject.currencyPair}
            // selectedObject={this.state.selectedObject}
            onSubmitCurrencyPair={this.onSubmitCurrencyPair}
          />
        )}
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
      </div>
    );
  }
}
CurrencyIntelligence.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(CurrencyIntelligence));
