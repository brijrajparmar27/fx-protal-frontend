import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

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
import response from "views/Pages/json/marketrates.json";
import NoticeModal from "views/Components/NoticeModal.jsx";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const COLUMNS = [
  "Currency Pair",
  "Daily",
  "1 Week",
  "1 Month",
  "YTD",
  "1 Year",
  "3 Years",
  ""
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
  closeButton: {
    visibility: "hidden"
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

class SpotPerformanceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: "",
      displayData: [],
      apiData: [],
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
      this.getAPIData(true, newProps.currencyPairs);
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
    }, 5000);
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
    this.getPerformanceRateData(currencyPairs, loading);
  };
  getPerformanceRateData = async (currencyPairs, loading) => {
    const res = await apiHandler({
      url: endpoint.CURRENCY_PERFORMANCE + "?currency=" + currencyPairs,
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
      this.setState(
        {
          apiData: res.data && res.data.length > 0 ? res.data : []
        },
        () => {
          if (res.data && res.data.length > 0) {
            this.setGridData(res.data);
          }
        }
      );
    }
  };

  handleCloseDialog = stateName => {
    this.setState({
      [stateName]: false
    });
  };
  getEditButton = obj => {
    console.log("editbuttoncheck", obj);
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
  getText = text => {
    text = parseFloat(text).toFixed(2);
    return (
      <span style={{ color: text < 0 ? "red" : "green" }}>
        {text}
        {"%"}
      </span>
    );
  };

  setGridData = apiData => {
    console.log("setgriddata", apiData);
    // apiData=apiData.sort(x=>x.currencyPair)
    console.log("setgriddata", this.props.currencyPairs);
    let data = [];
    this.props.currencyPairs.map((x, index) => {
      let obj = apiData.filter(o => o.currencyPair === x);
      let arr = [index];
      if (obj.length > 0) {
        console.log("editbuttoncheck", this.getEditButton(obj[0]));

        arr = [
          ...arr,
          this.getCurrencyPairButton(obj[0]),
          this.getText(obj[0]["daily"]),
          this.getText(obj[0]["oneWeek"]),
          this.getText(obj[0]["oneMonth"]),
          this.getText(obj[0]["ytd"]),
          this.getText(obj[0]["oneYear"]),
          this.getText(obj[0]["threeYear"]),
          this.getEditButton({
            ...obj[0],
            baseCurrency: obj[0].currencyPair.substring(0, 3),
            quoteCurrency: obj[0].currencyPair.substring(3, 6)
          })
        ];
      } else {
        arr = [...arr, x];
      }
      data = [...data, arr];
    });
    console.log("editbuttoncheck", data);

    // apiData.forEach((obj, index) => {
    //   let arr = [
    //     index,
    //     this.getCurrencyPairButton(obj),
    //     this.getText(obj["daily"]),
    //     this.getText(obj["oneWeek"]),
    //     this.getText(obj["oneMonth"]),
    //     this.getText(obj["ytd"]),
    //     this.getText(obj["oneYear"]),
    //     this.getText(obj["threeYear"])
    //   ];

    //   data = [...data, arr];
    // });
    this.setState({
      displayData: data
    });
  };
  showCurrencyPairModal = obj => {
    this.setState({
      showGraphModal: true,
      selectedObject: obj
    });
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
  onSubmitCurrencyPair = (baseCurrency, quoteCurrency) => {
    // this.setState({ showCurrencyPairModal: false, selectedObject: null });
    // let index = this.state.apiLiveExchangeRatesData.findIndex(
    //   x => x.currencyPair === this.state.selectedObject.currencyPair
    // );
    let index = this.props.currencyPairs.findIndex(
      x => x === this.state.selectedObject.currencyPair
    );

    let currencyPairs = this.props.currencyPairs;
    currencyPairs[index] = baseCurrency + quoteCurrency;
    this.props.updateCurrencyPair(currencyPairs);
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
SpotPerformanceView.propTypes = {
  classes: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  setLoading: PropTypes.func.isRequired,
  currencyPairs: PropTypes.array.isRequired,
  currencyPairDataChanged: PropTypes.func.isRequired,
  updateCurrencyPair: PropTypes.func.isRequired,
  display: PropTypes.string
};
export default withRouter(withStyles(style)(SpotPerformanceView));
