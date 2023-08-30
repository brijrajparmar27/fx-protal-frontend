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
import MarketRatesGraph from "./MarketRatesGraph";
import CurrencyPairDialogFRWD from "./CurrencyPairDialogFRWD";
import NoticeModal from "views/Components/NoticeModal.jsx";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import moment from "moment";

const COLUMNSKEYPAIR = [
  { text: "1 Week", key: "OneWeek" },
  { text: "3 Months", key: "ThreeMonth" },
  { text: "6 Months", key: "SixMonth" },
  { text: "9 Months", key: "NineMonth" },
  { text: "1 Year", key: "OneYear" },
  { text: "2 Years", key: "TwoYear" }
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
    fontWeight: "bold",
    cursor: "pointer"
  },
  tableCurrencyHead: {
    fontStyle: "italic",
    padding: "12px 20px !important"
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

class HedgingCostsView extends React.Component {
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
      allCurrencyPairs: [],
      columns: [
        "Currency Pair",
        "1 Week",
        "3 Months",
        "6 Months",
        "9 Months",
        "1 Year",
        "2 Years"
      ],
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
      //this.registerForDataRefresh(this.props.currencyPairs);
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
    }, 900000); // 15 min = 15 * 60 * 1000
  };
  componentWillUnmount() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }
  getSettlementDate = key => {
    let date = new Date();
    if (key === "1month") {
      let d = new Date(date.getFullYear(), date.getMonth() + 2, 0);
      return moment(d).format("YYYY-MM-DD");
    } else if (key === "3months") {
      let d = new Date(date.getFullYear(), date.getMonth() + 4, 0);
      return moment(d).format("YYYY-MM-DD");
    } else if (key === "6months") {
      let d = new Date(date.getFullYear(), date.getMonth() + 7, 0);
      return moment(d).format("YYYY-MM-DD");
    } else if (key === "1year") {
      let d = new Date(date.getFullYear() + 1, date.getMonth() + 1, 0);
      return moment(d).format("YYYY-MM-DD");
    } else if (key === "2years") {
      let d = new Date(date.getFullYear() + 2, date.getMonth() + 1, 0);
      return moment(d).format("YYYY-MM-DD");
    }
  };
  getCurrencyPairHeading = text => {
    const { classes } = this.props;
    return <span className={classes.tableHeadBold}>{text}</span>;
  };
  getCurrencyHeading = text => {
    const { classes } = this.props;
    return <span className={classes.tableCurrencyHead}>{text}</span>;
  };
  showCurrencyPairModal = currencyPair => {
    this.setState({
      showGraphModal: true,
      selectedObject: { currencyPair: currencyPair }
    });
  };
  handleCloseDialog = stateName => {
    this.setState({
      [stateName]: false
    });
  };

  getAPIData = async (loading, currencyPairs) => {
    this.props.setLoading(true);

    let params = {
      currency: currencyPairs.join(",")
    };
    //CALCULATE_HEADING_COST
    const res = await apiHandler({
      url:
        endpoint.CALCULATE_HEADING_COST +
        "?currency=" +
        currencyPairs.join(","),
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
      console.log("responseapi", params, res.data);
      this.parseData(currencyPairs, res.data, loading);
    }
  };

  parseData = (currencyPairs, response, loading) => {
    if (response && response.length > 0) {
      let apiData = [...response];
      let displayData = [];

      currencyPairs.forEach((currencyPair, index) => {
        const buy = currencyPair.substring(0, 3);
        const sell = currencyPair.substring(3, 6);

        let arr = [
          index + 1,
          this.getCurrencyHeading("Buy " + buy + " Sell " + sell)
        ];
        let arr2 = [
          index + 2,
          this.getCurrencyHeading("Buy " + sell + " Sell " + buy)
        ];

        // Get Data for selected Currency Pair
        const hedgeCost = response.filter(
          hedge => hedge.currencyPair === currencyPair
        );

        // get each column data for selected hedgeCost
        COLUMNSKEYPAIR.forEach((column, idx) => {
          if (
            hedgeCost[0] &&
            hedgeCost[0].expirationHedgingCostMap &&
            hedgeCost[0].expirationHedgingCostMap[column.key]
          ) {
            const hedgeDataForPeriod =
              hedgeCost[0].expirationHedgingCostMap[column.key];
            if (hedgeDataForPeriod.length > 0) {
              let firstRow = hedgeDataForPeriod.filter(
                x => x.currencyCode === buy
              );
              let secondRow = hedgeDataForPeriod.filter(
                x => x.currencyCode === sell
              );
              arr[idx + 2] = firstRow[0].hedgingCostPercentage.toFixed(2) + "%";
              arr2[idx + 2] =
                secondRow[0].hedgingCostPercentage.toFixed(2) + "%";
            } else {
              arr[idx + 2] = "";
              arr2[idx + 2] = "";
            }
          } else {
            arr[idx + 2] = "";
            arr2[idx + 2] = "";
          }
          if (idx === COLUMNSKEYPAIR.length - 1) {
            displayData = [
              ...displayData,
              [
                index,
                this.getCurrencyPairButton(currencyPair),
                "",
                "",
                "",
                "",
                "",
                ""
              ],
              arr,
              arr2
            ];
          }
          if (index === currencyPairs.length - 1) {
            this.setState({
              displayData: displayData
            });
          }
        });
      });
    }
    this.props.setLoading(false);
  };
  getValue = (key, forwardRates) => {
    let data = forwardRates.filter(x => x.Expiration === key);
    return data.length > 0 ? data[0].Mid : "";
  };

  getCurrencyPairButton = (currencyPair, obj) => {
    return (
      <div className={cx(this.props.classes.currencyPair)}>
        <a
          onClick={() => this.showCurrencyPairModal(currencyPair)}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(this.props.classes.tableHeadBold)}
        >
          {currencyPair}
        </a>
        <IconButton
          aria-label="close"
          className={this.props.classes.closeButton}
          onClick={() => this.showCurrencyPairModal(currencyPair)}
        >
          <TrendingUpIcon />
        </IconButton>
        <Edit
          onClick={() => this.editCurrencyPair({ currencyPair: currencyPair })}
          className={cx(this.props.classes.editIcon, this.props.classes.icon)}
        />
      </div>
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
  onSubmitCurrencyPair = newCurrencyPair => {
    this.setState({ showCurrencyPairModal: false, selectedObject: null });
    let currencyPairs = this.props.currencyPairs;
    let index = this.props.currencyPairs.findIndex(
      x => x === this.state.selectedObject.currencyPair
    );
    currencyPairs[index] = newCurrencyPair;
    this.props.updateCurrencyPair(currencyPairs);
  };
  render() {
    const { classes, display } = this.props;
    return (
      <div className={classes.container}>
        <h2 className={(classes.groupHeader, classes.featureTitleHeader)}>
          Hedging Cost Indications
        </h2>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={this.state.columns}
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
HedgingCostsView.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(HedgingCostsView));
