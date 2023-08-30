import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Edit from "@material-ui/icons/Edit";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import IconButton from "@material-ui/core/IconButton";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import Table from "components/Table/Table.jsx";
import ChangeCurrencyPair from "./ChangeCurrencyPair";
import MarketRatesGraph from "./MarketRatesGraph";
import NoticeModal from "views/Components/NoticeModal.jsx";
import response from "views/Pages/json/marketrates.json";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const COLUMNS = [
  "Currency Pair",
  "Bid",
  "Ask",
  "Mid",
  "Net Change",
  "% Change",
  "Open",
  "High",
  "Low",
  ""
];
const REFRESHTIME = 5 * 1000; // 5 Seconds

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

class LiveExchangeRates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: "",
      displayData: [],
      apiLiveExchangeRatesData: [],
      apiHistoricalData: [],
      showCurrencyPairModal: false,
      showGraphModal: false,

      selectedObject: {},
      columns:
        this.props.display === "min"
          ? [...COLUMNS.slice(0, 4), COLUMNS[COLUMNS.length - 1]]
          : COLUMNS,
      currencyPairs: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
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
    // if(this.props.currencyPairDataChanged&&this.props.currencyPairs.length>0){
    if (this.interval != null) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.getAPIData(true, this.props.currencyPairs);
    this.registerForDataRefresh(this.props.currencyPairs);
    // }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.currencyPairDataChanged !== newProps.currencyPairDataChanged
    ) {
      this.getAPIData(false, newProps.currencyPairs);
      if (this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.registerForDataRefresh(newProps.currencyPairs);
    }
  }

  registerForDataRefresh = currencyPairs => {
    this.interval = setInterval(() => {
      this.getAPIData(false, currencyPairs);
    }, REFRESHTIME);
  };
  componentWillUnmount() {
    if (this.interval != null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getAPIData = (loading, currencyPairs) => {
    currencyPairs = currencyPairs.join(",");
    if (loading) {
      this.props.setLoading(true);
    }
    this.getliveExchangeRateData(currencyPairs, loading);
  };
  getliveExchangeRateData = async (currencyPairs, loading) => {
    if (!currencyPairs) return;

    const res = await apiHandler({
      url: endpoint.MARKET_EXCHANGE_RATE_LIVE + "?currency=" + currencyPairs,
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
      let exchangeRates = res.data.exchangeRates ? res.data.exchangeRates : [];
      if (exchangeRates.length) {
        this.setState(
          {
            apiLiveExchangeRatesData: exchangeRates
          },
          () => {
            this.getLatestHistoricData(exchangeRates, currencyPairs, loading);
          }
        );
      }
    }
  };
  getLatestHistoricData = async (
    liveExchangeRatesData,
    currencyPairs,
    loading
  ) => {
    const res = await apiHandler({
      url:
        endpoint.MARKET_EXCHANGE_RATE_HISTORICAL + "?currency=" + currencyPairs,
      authToken: sessionStorage.getItem("token")
    });
    if (loading) {
      this.props.setLoading(false);
    }

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
      let exchangeRates = res.data.exchangeRates ? res.data.exchangeRates : [];

      if (exchangeRates.length) {
        this.setState(
          {
            apiHistoricalData: exchangeRates
          },
          () => {
            if (liveExchangeRatesData.length > 0 && exchangeRates) {
              this.setGridData(liveExchangeRatesData, exchangeRates);
            }
          }
        );
      }
    }
  };

  handleCloseDialog = stateName => {
    this.setState({
      [stateName]: false
    });
  };

  setGridData = (liveExchangeRatesData, historicalData) => {
    const { classes } = this.props;
    // liveExchangeRatesData.sort(x=>x.currencyPair)
    // historicalData.sort(x=>x.currencyPair)

    // liveExchangeRatesData = !liveExchangeRatesData
    //   ? []
    //   : this.props.display === "min"
    //   ? liveExchangeRatesData.slice(0, 2)
    //   : this.props.display === "max"
    //   ? liveExchangeRatesData.slice(0, 9)
    //   : liveExchangeRatesData;

    let data = [];
    this.props.currencyPairs.forEach((x, index) => {
      let obj = liveExchangeRatesData.filter(o => o.currencyPair === x);
      if (obj.length > 0) {
        let historicalObj = this.getDataFromHistoricalRateArr(
          historicalData,
          x
        );
        let netChange = "";
        let percentageChange = "";

        if (
          obj[0]["bid"] &&
          historicalObj["open"] &&
          historicalObj["open"] !== "" &&
          obj[0]["bid"] !== ""
        ) {
          netChange = obj[0]["bid"] - historicalObj["open"];
        }
        if (
          netChange !== "" &&
          historicalObj["open"] &&
          historicalObj["open"] !== ""
        ) {
          percentageChange =
            (parseFloat(netChange) * 100) / parseFloat(historicalObj["open"]);
        }

        let bidDisplayData =
          this.state.displayData[index] && this.state.displayData[index][2]
            ? this.state.displayData[index][2]
            : 0;
        let askDisplayData =
          this.state.displayData[index] && this.state.displayData[index][3]
            ? this.state.displayData[index][3]
            : 0;
        let midDisplayData =
          this.state.displayData[index] && this.state.displayData[index][4]
            ? this.state.displayData[index][4]
            : 0;

        let bidColor =
          parseFloat(bidDisplayData.data) > parseFloat(obj[0]["bid"])
            ? classes.elemRed
            : parseFloat(bidDisplayData.data) < parseFloat(obj[0]["bid"])
            ? classes.elemGreen
            : classes.elemBlack;
        let askColor =
          parseFloat(askDisplayData.data) > parseFloat(obj[0]["ask"])
            ? classes.elemRed
            : parseFloat(askDisplayData.data) < parseFloat(obj[0]["ask"])
            ? classes.elemGreen
            : classes.elemBlack;
        let midColor =
          parseFloat(midDisplayData.data) > parseFloat(obj[0]["mid"])
            ? classes.elemRed
            : parseFloat(midDisplayData.data) < parseFloat(obj[0]["mid"])
            ? classes.elemGreen
            : classes.elemBlack;

        let netChangeColor =
          netChange !== ""
            ? parseFloat(netChange) < 0
              ? classes.elemRed
              : classes.elemGreen
            : classes.elemBlack;
        let percentageChangeColor =
          percentageChange !== ""
            ? parseFloat(percentageChange) < 0
              ? classes.elemRed
              : classes.elemBlack
            : classes.elemBlack;
        let arr = [
          index,
          {
            data: this.getCurrencyPairButton(obj[0]),
            style: classes.elemBlack
          },
          { data: obj[0]["bid"].toFixed(5), style: bidColor },
          { data: obj[0]["ask"].toFixed(5), style: askColor },
          { data: obj[0]["mid"].toFixed(5), style: midColor }
        ];
        const openVal = historicalObj["open"]
          ? historicalObj["open"].toFixed(5)
          : "";
        const highVal = historicalObj["high"]
          ? historicalObj["high"].toFixed(5)
          : "";
        const lowVal = historicalObj["low"]
          ? historicalObj["low"].toFixed(5)
          : "";

        if (this.props.display !== "min") {
          arr = [
            ...arr,
            netChange !== ""
              ? { data: netChange.toFixed(5), style: netChangeColor }
              : "",
            percentageChange !== ""
              ? {
                  data: percentageChange.toFixed(2) + "%",
                  style: percentageChangeColor
                }
              : "",
            { data: openVal, style: classes.elemBlack },
            { data: highVal, style: classes.elemBlack },
            { data: lowVal, style: classes.elemBlack }
          ];
        }

        data = [
          ...data,
          [
            ...arr,
            { data: this.getEditButton(obj[0]), style: classes.elemBlack }
          ]
        ];
      } else {
        data = [...data, [index, x]];
      }
    });
    //liveExchangeRatesData.forEach((obj, index) => {
    // let historicalObj = this.getDataFromHistoricalRateArr(
    //   historicalData,
    //   obj.currencyPair
    // );
    // let netChange = "";
    // let percentageChange = "";

    // if (
    //   obj["bid"] &&
    //   historicalObj["open"] &&
    //   historicalObj["open"] !== "" &&
    //   obj["bid"] !== ""
    // ) {
    //   netChange = obj["bid"] - historicalObj["open"];
    // }
    // if (
    //   netChange !== "" &&
    //   historicalObj["open"] &&
    //   historicalObj["open"] !== ""
    // ) {
    //   percentageChange =
    //     (parseFloat(netChange) * 100) / parseFloat(historicalObj["open"]);
    // }
    // let bidDisplayData =
    //   this.state.displayData[index] && this.state.displayData[index][2]
    //     ? this.state.displayData[index][2]
    //     : 0;
    // let askDisplayData =
    //   this.state.displayData[index] && this.state.displayData[index][3]
    //     ? this.state.displayData[index][3]
    //     : 0;
    // let midDisplayData =
    //   this.state.displayData[index] && this.state.displayData[index][4]
    //     ? this.state.displayData[index][4]
    //     : 0;

    // let bidColor =
    //   parseFloat(bidDisplayData.data) > parseFloat(obj["bid"])
    //     ? classes.elemRed
    //     : parseFloat(bidDisplayData.data) < parseFloat(obj["bid"])
    //     ? classes.elemGreen
    //     : classes.elemBlack;
    // let askColor =
    //   parseFloat(askDisplayData.data) > parseFloat(obj["ask"])
    //     ? classes.elemRed
    //     : parseFloat(askDisplayData.data) < parseFloat(obj["ask"])
    //     ? classes.elemGreen
    //     : classes.elemBlack;
    // let midColor =
    //   parseFloat(midDisplayData.data) > parseFloat(obj["mid"])
    //     ? classes.elemRed
    //     : parseFloat(midDisplayData.data) < parseFloat(obj["mid"])
    //     ? classes.elemGreen
    //     : classes.elemBlack;

    // let netChangeColor =
    //   netChange !== ""
    //     ? parseFloat(netChange) < 0
    //       ? classes.elemRed
    //       : classes.elemGreen
    //     : classes.elemBlack;
    // let percentageChangeColor =
    //   percentageChange !== ""
    //     ? parseFloat(percentageChange) < 0
    //       ? classes.elemRed
    //       : classes.elemBlack
    //     : classes.elemBlack;
    // let arr = [
    //   index,
    //   { data: this.getCurrencyPairButton(obj), style: classes.elemBlack },
    //   { data: obj["bid"].toFixed(5), style: bidColor },
    //   { data: obj["ask"].toFixed(5), style: askColor },
    //   { data: obj["mid"].toFixed(5), style: midColor }
    // ];
    // const openVal = historicalObj["open"] ? historicalObj["open"].toFixed(5) : "";
    // const highVal = historicalObj["high"] ? historicalObj["high"].toFixed(5) : "";
    // const lowVal = historicalObj["low"] ? historicalObj["low"].toFixed(5) : "";

    // if (this.props.display !== "min") {
    //   arr = [
    //     ...arr,
    //     netChange !== ""
    //       ? { data: netChange.toFixed(5), style: netChangeColor }
    //       : "",
    //     percentageChange !== ""
    //       ? {
    //           data: percentageChange.toFixed(2) + "%",
    //           style: percentageChangeColor
    //         }
    //       : "",
    //     { data: openVal, style: classes.elemBlack },
    //     { data: highVal, style: classes.elemBlack },
    //     { data: lowVal, style: classes.elemBlack }
    //   ];
    // }

    // data = [
    //   ...data,
    //   [...arr, { data: this.getEditButton(obj), style: classes.elemBlack }]
    // ];
    //});
    this.setState({
      displayData: data
    });
    console.log("Live Data - ", data);
  };
  getDataFromHistoricalRateArr = (historicalData, currencyPair) => {
    let data = historicalData.filter(x => x.currencyPair === currencyPair);
    return data.length > 0 ? data[0] : {};
  };

  getCurrencyPairButton = obj => {
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
          onClick={() => this.showCurrencyPairModal(obj)}
        >
          <TrendingUpIcon />
        </IconButton>
      </div>
    );
  };

  getEditButton = obj => {
    return (
      <Edit
        onClick={() => this.editCurrencyPair(obj)}
        className={cx(this.props.classes.editIcon, this.props.classes.icon)}
      />
    );
  };
  editCurrencyPair = obj => {
    console.log("editcurrencypair", obj);
    this.setState({
      showCurrencyPairModal: true,
      selectedObject: obj
    });
  };

  onSubmitCurrencyPair = (baseCurrency, quoteCurrency) => {
    // this.setState({ showCurrencyPairModal: false, selectedObject: null });
    // let index = this.state.apiLiveExchangeRatesData.findIndex(
    //   x => x.currencyPair === this.state.selectedObject.currencyPair
    // );
    let index = this.props.currencyPairs.findIndex(
      x => x === this.state.selectedObject.currencyPair
    );
    console.log("editcurrencypair", index);
    console.log("editcurrencypair", this.state.selectedObject.currencyPair);
    console.log("editcurrencypair", baseCurrency + quoteCurrency);

    let currencyPairs = this.props.currencyPairs;
    currencyPairs[index] = baseCurrency + quoteCurrency;
    this.props.updateCurrencyPair(currencyPairs);
  };

  showCurrencyPairModal = obj => {
    this.setState({
      showGraphModal: true,
      selectedObject: obj
    });
  };

  render() {
    const { classes, display } = this.props;
    return (
      <div
        className={display === "max" ? classes.container : classes.mincontainer}
      >
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={this.state.columns}
              tableData={this.state.displayData}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[classes.tableHedgeHead]}
              customClassesForCells={[1]}
              isMarketData={true}
            />
          </GridItem>
        </GridContainer>
        <ChangeCurrencyPair
          showModal={this.state.showCurrencyPairModal}
          handleClose={this.handleCloseDialog}
          currencies={this.props.currencies}
          editObject={this.state.selectedObject}
          onSubmitCurrencyPair={this.onSubmitCurrencyPair}
        />
        {this.state.showGraphModal && (
          <MarketRatesGraph
            showModal={this.state.showGraphModal}
            handleClose={this.handleCloseDialog}
            selectedObject={this.state.selectedObject}
            setLoading={this.props.setLoading}
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
LiveExchangeRates.propTypes = {
  classes: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  setLoading: PropTypes.func.isRequired,
  currencyPairs: PropTypes.array.isRequired,
  currencyPairDataChanged: PropTypes.func.isRequired,
  updateCurrencyPair: PropTypes.func.isRequired,
  display: PropTypes.string
};
export default withRouter(withStyles(style)(LiveExchangeRates));
