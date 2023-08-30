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
import NoticeModal from "views/Components/NoticeModal.jsx";

import response from "views/Pages/json/marketrates.json";
import CurrencyPairDialogFRWD from "./CurrencyPairDialogFRWD";
import MarketRatesGraph from "./MarketRatesGraph";

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
  // "5 Years",
  ""
];
const REFRESHTIME = 2 * 60 * 1000; // 2 min
const COLUMNSKEYPAIR = [
  { text: "1 Week", key: "OneWeek" },
  { text: "3 Months", key: "ThreeMonth" },
  { text: "6 Months", key: "SixMonth" },
  { text: "9 Months", key: "NineMonth" },
  { text: "1 Year", key: "OneYear" },
  { text: "2 Years", key: "TwoYear" }
  // { text: "5 Years", key: "FiveYear" }
];

const style = {
  container: {
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
  },
  tableHeadBold: {
    fontWeight: "bold"
  },
  tableHedgeHead: {
    //backgroundColor: "#5882c780",
    fontWeight: "normal"
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

class ForwardPriceRates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: "",
      showGrid: false,
      apiData: [],
      displayData: [],
      allCurrencyPairs: [],
      showCurrencyPairModal: false,
      selectedObject: {},
      showGraphModal: false,
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
    if (
      this.props.currencyPairDataChanged &&
      this.props.currencyPairs.length > 0
    ) {
      this.getAPIData(true, this.props.currencyPairs);
      this.registerForDataRefresh(this.props.currencyPairs);
    }
  }
  componentWillReceiveProps(newProps) {
    if (
      this.props.currencyPairDataChanged !== newProps.currencyPairDataChanged
    ) {
      this.getAPIData(true, newProps.currencyPairs);
      if (this.interval != null) {
        clearInterval(this.interval);
        this.registerForDataRefresh(newProps.currencyPairs);
      }
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
    }
  }
  getAPIData = async (loading, currencyPairs) => {
    if (loading) {
      this.props.setLoading(true);
    }
    currencyPairs = currencyPairs.join(",");

    const res = await apiHandler({
      url: endpoint.MARKET_EXCHANGE_RATE_FORWARD + "?currency=" + currencyPairs,
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
      this.parseData(res.data, loading);
    }
  };

  parseData = (response, loading) => {
    if (response && response.length > 0) {
      let apiData = [...response];
      let displayData = [];
      response = this.props.display === "max" ? response.slice(0, 9) : response;

      this.props.currencyPairs.map((x, index) => {
        let obj = response.filter(o => o.currencyPair === x);
        let arr = [index];
        if (obj.length > 0) {
          arr = [...arr, this.getCurrencyPairButton(obj[0])];
          COLUMNSKEYPAIR.forEach(c => {
            arr = [...arr, this.getValue(c.key, obj[0].forwardRates)];
          });
          arr[arr.length] = this.getEditButton(obj[0]);
          displayData = [...displayData, arr];
        } else {
          arr = [...arr, x];
          displayData = [...displayData, arr];
        }
      });

      //      response.forEach((obj, index) => {
      // let arr = [index, this.getCurrencyPairButton(obj)];
      // COLUMNSKEYPAIR.forEach((x, index) => {
      //   arr = [...arr, this.getValue(x.key, obj.forwardRates)];
      // });

      //   arr[arr.length] = this.getEditButton(obj);
      //   displayData = [...displayData, arr];
      // });
      this.setState({
        apiData,
        displayData
      });
      if (loading) {
        this.props.setLoading(false);
      }
    }
  };

  getValue = (key, forwardRates) => {
    let data = forwardRates.filter(x => x.Expiration === key);
    return data.length > 0 ? data[0].Mid.toFixed(5) : "";
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
          onClick={() => this.showCurrencyPairModal(obj)}
        >
          <TrendingUpIcon />
        </IconButton>
      </div>
    );
  };

  getEditButton = obj => {
    console.log("editcurrencypair", obj);

    return (
      <Edit
        onClick={() => this.editCurrencyPair(obj)}
        className={cx(this.props.classes.editIcon, this.props.classes.icon)}
      />
    );
  };
  editCurrencyPair = async obj => {
    if (this.state.allCurrencyPairs.length > 0) {
      this.setState({
        showCurrencyPairModal: true,
        selectedObject: obj
      });
    } else {
      // Get All Currency Pairs
      //CURRENCY_PAIRS
      const res = await apiHandler({
        url: endpoint.CURRENCY_PAIRS + "?type=FXFWD&default=true",
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
        const currencyPairs = res.data.currencyPairs
          ? res.data.currencyPairs
          : [];

        this.setState({
          allCurrencyPairs: currencyPairs,
          showCurrencyPairModal: true,
          selectedObject: obj
        });
      }
    }
  };
  handleCloseDialog = stateName => {
    this.setState({
      [stateName]: false
    });
  };

  onSubmitCurrencyPair = newCurrencyPair => {
    this.setState({ showCurrencyPairModal: false, selectedObject: null });
    let currencyPairs = this.props.currencyPairs;
    let index = this.props.currencyPairs.findIndex(
      x => x === this.state.selectedObject.currencyPair
    );
    currencyPairs[index] = newCurrencyPair;
    this.props.updateCurrencyPair(currencyPairs);
  };

  showCurrencyPairModal = obj => {
    this.setState({
      showGraphModal: true,
      selectedObject: obj
    });
  };
  render() {
    const { classes, type } = this.props;
    return (
      <div className={classes.container}>
        <h2 className={(classes.groupHeader, classes.featureTitleHeader)}>
          Forward Rates
        </h2>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={COLUMNS}
              tableData={this.state.displayData}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[classes.tableHedgeHead]}
              customClassesForCells={[1]}
            />
          </GridItem>
        </GridContainer>
        {this.state.showCurrencyPairModal && (
          <CurrencyPairDialogFRWD
            showModal={this.state.showCurrencyPairModal}
            handleClose={this.handleCloseDialog}
            currencyPairs={this.state.allCurrencyPairs}
            editObject={this.state.selectedObject}
            onSubmitCurrencyPair={this.onSubmitCurrencyPair}
          />
        )}
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
ForwardPriceRates.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(ForwardPriceRates));
