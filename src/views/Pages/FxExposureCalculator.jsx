import React from "react";
import ReactToPrint from "react-to-print";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// react plugin for creating charts
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import cx from "classnames";
import FormHelperText from "@material-ui/core/FormHelperText";
import Table from "components/Table/Table.jsx";

// @material-ui/icons
import Add from "@material-ui/icons/Add";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
// import LockOutline from "@material-ui/icons/LockOutline";
import { validate } from "../../utils/Validator";
import { formatMoney, parseCurrency } from "../../utils/Utils";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import FXExposureCalculatorPrint from "./FxExposureCalculatorPrint.jsx";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import GetStartedModal from "views/Components/GetStartedModal.jsx";

import {
  cardTitle,
  roseColor,
  successColor,
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor,
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import { Bar } from "react-chartjsx";
import "chartjs-plugin-labels";

const styles = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center",
  },
  exposureCard: {
    marginTop: 15,
    marginBottom: 10,
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0",
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem",
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px",
  },
  footer: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "5px 25px",
  },
  pr0: {
    paddingRight: "0px !important;",
  },
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px",
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px",
    },
  },
  iconRose: {
    color: roseColor,
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3,
  },
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3,
  },
  addIcon: {
    marginTop: 0,
    height: 35,
    width: 35,
    borderRadius: 6,
  },
  marginTop30: {
    marginTop: "30px",
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px",
    },
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white",
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "black",
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46,
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 18,
    marginRight: 5,
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999",
  },
  listItemIcon: {
    marginTop: "-3px",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    color: "inherit",
    display: "inline-block",
  },
  filledSelect: {
    backgroundColor: "grey",
    color: "white !important",
  },
  white: {
    color: "white",
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white",
    fontSize: "14px",
    fontWeight: 300,
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right",
  },
  currencyLabel: {
    paddingTop: "7px !important",
    float: "left",
  },
  currencyHeading: {
    padding: "0px !important",
    marginLeft: "-25px",
    fontSize: "x-small",
  },
  tooltipCalculator: {
    padding: "10px 15px",
    minWidth: "200px",
    color: whiteColor,
    lineHeight: "1.7em",
    background: "rgba(" + hexToRgb(grayColor[6]) + ",0.9)",
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
    textAlign: "center",
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
    lineBreak: "auto",
  },
  tableHeadBold: {
    fontWeight: "bold",
  },
  tableHedgeHead: {
    backgroundColor: "#5882c780",
    fontWeight: "bold",
  },
  tableMarginHead: {
    backgroundColor: "#fdbf2d80",
  },
  ...customSelectStyle,
  ...regularFormsStyle,
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class FXExposureCalculator extends React.Component {
  error = {
    totalSalesErrorMsg: {
      required: "Total Sales value is required",
      positive: "Total Sales should be positive number",
    },
    totalCostsErrorMsg: {
      required: "Total Costs value is required",
      range: "Total Costs should be 1 to 25 characters",
    },
    impactGrossMarginErrorMsg: {
      required: "Gross Margin percentage value is required",
      range: "Gross Margin percentage value should be between 0 to 100",
    },
    hedgingPercentageErrorMsg: {
      required: "Hedging percentage value is required",
      range: "Hedging percentage value should be between 0 to 100",
    },
    hedgingCostPercentageErrorMsg: {
      required: "Value date is required",
      range: "Hedging Cost percentage value should be between -10 to +10",
    },
    fcsSalesErrorMsg: {
      exceed: "Total Amount should be less than Total Sales",
    },
    fcsCostsErrorMsg: {
      exceed: "Total Amount should be less than Cost of Sales",
    },
    fcsSalesCurrencyErrorMsg: {
      localCurrency: "Choose currency other than local currency",
      fcsSalesCurrency: "Choose different currencies for Sales and Costs",
    },
    fcsCostsCurrencyErrorMsg: {
      localCurrency: "Choose currency other than local currency",
      fcsCostsCurrency: "Choose different currencies for Sales and Costs",
    },

    // companyEmailErrorMsg: {
    //   required: "Corporate Email is required",
    //   company: "Please enter a corporate email",
    //   valid: "Please enter a valid email"
    // },
    // cityErrorMsg: {
    //   required: "City is required"
    // },
    // postalCodeErrorMsg: {
    //   required: "Postal code is required"
    // },
    // countryCodeErrorMsg: {
    //   required: "Country is required"
    // },
    // typeErrorMsg: {
    //   required: "Password is required"
    // }
  };

  constructor(props) {
    super(props);

    this.initialState = {
      withHedgingKey: 0,
      withoutHedgingKey: 0,
      baseCurrencyCode: "",
      currencies: [],
      totalSales: "",
      totalSalesState: "",
      totalSalesPristine: false,
      totalSalesErrorMsg: [],
      totalCosts: "",
      totalCostsState: "",
      totalCostsPristine: false,
      totalCostsErrorMsg: [],
      grossMargin: "",
      localCurrency: "GBP",
      isNoticeModal: false,
      noticeModalMsg: "",
      noticeModalHeaderMsg: "",
      impactGrossMargin: 10,
      impactGrossMarginState: "",
      impactGrossMarginPristine: false,
      impactGrossMarginErrorMsg: [],
      hedgingPercentage: 50,
      hedgingPercentageState: "",
      hedgingPercentagePristine: false,
      hedgingPercentageErrorMsg: [],
      hedgingCostPercentage: 0,
      hedgingCostPercentageState: "",
      hedgingCostPercentagePristine: false,
      hedgingCostPercentageErrorMsg: [],
      totalforeignSalesAmount: "",
      fcsSalesState: "success",
      fcsSalesErrorMsg: [],
      totalforeignCostsAmount: "",
      fcsCostsState: "success",
      fcsCostsErrorMsg: [],
      foreignSales: [
        {
          fcsSalesAmount: "",
          fcsSalesCurrency: "",
        },
      ],
      foreignCosts: [
        {
          fcsCostsAmount: "",
          fcsCostsCurrency: "",
        },
      ],
      yAxisMinWithoutHedging: 0,
      yAxisMaxWithoutHedging: 100,
      yAxisMinWithHedging: 0,
      yAxisMaxWithHedging: 100,
      disabledPaymentButton: false,
      callInProgress: false,
      grossMarginPercentageData: [],
      grossMarginData: [],
      salesInHomeCurrencyData: [],
      costOfSalesInHomeCurrencyData: [],
      enablePrint: true,
      printData: {},
      chartsData: {},
      grossMarginCurrencyColumns: [
        "",
        "0%",
        "10%",
        "-10%",
        "20%",
        "-20%",
        "30%",
        "-30%",
      ],
      grossMarginCurrencyFirstColumn: ["0", "25", "50", "100"],
      grossMarginTableData: [],
    };

    this.state = this.initialState;
  }

  componentDidMount = () => {
    this.initialzeData();
  };

  initialzeData = () => {
    this.getBaseCurrency();
    this.getCurrencies();
  };

  getBaseCurrency = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem("token"),
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
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc,
        });
      }
    } else {
      this.setState(
        {
          baseCurrencyCode: res.data.baseCurrency,
          localCurrency: res.data.baseCurrency,
        },
        () => {
          // this.getCurrencies();
        }
      );
    }
  };

  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token"),
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
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc,
        });
      }
    } else {
      this.setState({
        currencies: res.data.currrencies,
      });
    }
  };

  getCurrencyConversion = async (wallets, stateName, totalStateName) => {
    let currencies = [];
    wallets.forEach((wallet, index) => {
      if (
        this.state.localCurrency !== "" &&
        wallet[stateName + "Currency"] != "" &&
        wallet[stateName + "Amount"] != ""
      ) {
        currencies.push({
          currencyCode: wallet[stateName + "Currency"],
          amount: wallet[stateName + "Amount"],
          tag: "tag" + (index + 1),
        });
      }
    });
    if (currencies.length === 0) {
      //this.setState({ wallets: wallets, totalFunds: formatMoney(totalFunds) });
      return;
    } else {
      let currencyConversionParam = {
        baseCurrency: this.state.localCurrency,
        currencies: currencies,
      };

      const res = await apiHandler({
        method: "POST",
        url: endpoint.CURRENCIES_CONVERSION,
        data: currencyConversionParam,
        authToken: sessionStorage.getItem("token"),
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
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg: res.data.userDesc,
          });
        }
      } else {
        this.setState(
          {
            ["total" + stateName + "Amount"]: res.data.totalConvertedAmount,
            // [stateName + 'ErrorMsg']: [],
          },
          () => {
            this.validateTotal(
              this.state["total" + stateName + "Amount"],
              this.state[totalStateName],
              stateName
            );
          }
        );
      }
    }
  };
  validateTotal = (foreignCurrencyTotal, localCurrecyTotal, stateName) => {
    localCurrecyTotal = localCurrecyTotal.toString().replaceAll(",", "");
    if (foreignCurrencyTotal > localCurrecyTotal) {
      let errorArr = [...this.state[stateName + "ErrorMsg"]];
      errorArr.push(this.error[stateName + "ErrorMsg"].exceed);
      this.setState({
        [stateName + "State"]: "error",
        [stateName + "ErrorMsg"]: [...errorArr],
      });
    } else {
      this.setState({
        [stateName + "State"]: "success",
        [stateName + "ErrorMsg"]: [],
      });
    }
  };

  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };

  changePercentage = (event, stateName, rules) => {
    const value = event.target.value.substring(
      0,
      event.target.value.length - 1
    );
    this.setState(validate(value, stateName, this.state, rules, this.error));
  };

  isLocalValidated = (fromGrossMargin) => {
    // console.log(this.state.totalSalesState)
    // console.log(this.state.totalCostsState)
    // console.log(this.state.fcsSalesState)
    // console.log(this.state.fcsCostsState)
    if (
      !fromGrossMargin &&
      (!this.fcsSalesCurrencyValidate() || !this.fcsCostsCurrencyValidate())
    ) {
      return false;
    }

    if (
      fromGrossMargin &&
      this.state.totalSalesState === "success" &&
      this.state.totalCostsState === "success"
    ) {
      //&& this.state.fcsSalesState === 'success' && this.state.fcsCostsState === 'success'

      return true;
    } else if (
      !fromGrossMargin &&
      this.state.totalSalesState === "success" &&
      this.state.totalCostsState === "success" &&
      this.state.fcsSalesState === "success" &&
      this.state.fcsCostsState === "success"
    ) {
      return true;
    } else {
      if (this.state.totalSalesState !== "success") {
        this.setState({ totalSalesState: "error" });
      }
      if (this.state.totalCostsState !== "success") {
        this.setState({ totalCostsState: "error" });
      }
      if (this.state.fcsSalesState !== "success") {
        this.setState({ fcsSalesState: "error" });
      }
      if (this.state.fcsCostsState !== "success") {
        this.setState({ fcsCostsState: "error" });
      }
    }
    return false;
  };

  fcsSalesCurrencyValidate = () => {
    let arr = this.state.foreignSales.filter(
      (x) => x.fcsSalesCurrency == this.state.localCurrency
    );
    // console.log(this.state.foreignSales)
    // console.log(this.state.foreignCosts)
    let salesCurrency = this.state.foreignSales.map((x) => x.fcsSalesCurrency);
    let costsCurrency = this.state.foreignCosts.map((x) => x.fcsCostsCurrency);
    // console.log(salesCurrency)
    // console.log(costsCurrency)
    // console.log(salesCurrency.every(item => costsCurrency.indexOf(item) !== -1))
    // console.log(arr.length == 0)
    return (
      !salesCurrency.every((item) => costsCurrency.indexOf(item) !== -1) &&
      arr.length == 0
    );
  };
  fcsCostsCurrencyValidate = () => {
    let arr = this.state.foreignCosts.filter(
      (x) => x.fcsCostsCurrency == this.state.localCurrency
    );
    return arr.length == 0;
  };

  getMarginAmount = async () => {
    if (this.isLocalValidated(true) && this.state.localCurrency !== "") {
      const data = {
        currencyCode: this.state.localCurrency,
        totalSale: parseCurrency(this.state.totalSales),
        costOfSale: parseCurrency(this.state.totalCosts),
      };
      const res = await apiHandler({
        method: "POST",
        url: endpoint.CALCULATOR_GROSS_MARGIN,
        data: data,
        authToken: sessionStorage.getItem("token"),
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
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg: res.data.userDesc,
          });
        }
      } else {
        this.setState({
          grossMargin: res.data.grossMargin,
        });
      }
    }
  };

  calculateGrpah = async () => {
    if (this.isLocalValidated(false) && this.state.localCurrency !== "") {
      const parsedFCSales = this.state.foreignSales.reduce(function(
        result,
        fcSales
      ) {
        if (
          fcSales.fcsSalesAmount !== "" &&
          fcSales.fcsSalesCurrency !== "" &&
          fcSales.fcsSalesAmount !== "0"
        ) {
          result.push({
            amount: parseCurrency(fcSales.fcsSalesAmount),
            currencycode: fcSales.fcsSalesCurrency,
          });
        }
        return result;
      },
      []);

      const parsedFCCosts = this.state.foreignCosts.reduce(function(
        result,
        fcCosts
      ) {
        if (
          fcCosts.fcsCostsAmount !== "" &&
          fcCosts.fcsCostsCurrency !== "" &&
          fcCosts.fcsCostsAmount !== "0"
        ) {
          result.push({
            amount: parseCurrency(fcCosts.fcsCostsAmount),
            currencycode: fcCosts.fcsCostsCurrency,
          });
        }
        return result;
      },
      []);

      if (!parsedFCSales.length && !parsedFCCosts.length) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "At least one of the inputs, i.e. either Net Foreign Currency Sales, or Net Foreign Currency Costs is a required input to procced",
        });
        return;
      }
      this.setState({
        disabledPaymentButton: true,
        callInProgress: true,
      });
      const data = {
        currencyCode: this.state.localCurrency,
        totalSale: parseCurrency(this.state.totalSales),
        costOfSale: parseCurrency(this.state.totalCosts),
        hedgingPercentage: this.state.hedgingPercentage,
        hedgingCostPercentage: this.state.hedgingCostPercentage,
        variationPercentage: this.state.impactGrossMargin,
        foreignCurrencySales: parsedFCSales,
        foreignCurrencyCosts: parsedFCCosts,
      };

      const res = await apiHandler({
        method: "POST",
        url: endpoint.CALCULATOR_EXPOSURE,
        data: data,
        authToken: sessionStorage.getItem("token"),
      });
      this.setState({
        callInProgress: false,
        disabledPaymentButton: false,
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
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg: res.data.userDesc,
          });
        }
      } else {
        let withoutHedging = res.data.withoutHedging;
        let grossMarginData = [
          withoutHedging.grossMargin.strengtheningAmount,
          withoutHedging.grossMargin.actualAmount,
          withoutHedging.grossMargin.weakeningAmount,
        ];
        let salesInHomeCurrencyData = [
          withoutHedging.sales.strengtheningAmount,
          withoutHedging.sales.actualAmount,
          withoutHedging.sales.weakeningAmount,
        ];
        let costOfSalesInHomeCurrencyData = [
          withoutHedging.costOfSales.strengtheningAmount,
          withoutHedging.costOfSales.actualAmount,
          withoutHedging.costOfSales.weakeningAmount,
        ];
        let grossMarginPercentageData = [
          withoutHedging.grossMarginPercentage.strengtheningAmount,
          withoutHedging.grossMarginPercentage.actualAmount,
          withoutHedging.grossMarginPercentage.weakeningAmount,
        ];

        let withHedging = res.data.withHedging;
        let grossMarginPercentageHedgingData = [
          withoutHedging.grossMarginPercentage.strengtheningAmount,
          withHedging.grossMarginPercentage.strengtheningAmount,
          withoutHedging.grossMarginPercentage.weakeningAmount,
          withHedging.grossMarginPercentage.weakeningAmount,
        ];
        let grossMarginHedgingData = [
          withoutHedging.grossMargin.strengtheningAmount,
          withHedging.grossMarginNetHedgeCost.strengtheningAmount,
          withoutHedging.grossMargin.weakeningAmount,
          withHedging.grossMarginNetHedgeCost.weakeningAmount,
        ];

        // let yAxisMinWithoutHedging = 0;
        // let yAxisMaxWithoutHedging = 100;
        // if (
        //   withoutHedging.grossMarginPercentage.strengtheningAmount >= 0 &&
        //   withoutHedging.grossMarginPercentage.actualAmount >= 0 &&
        //   withoutHedging.grossMarginPercentage.weakeningAmount >= 0
        // ) {
        //   yAxisMinWithoutHedging = 0;
        //   let maxPercentage = Math.max(
        //     withoutHedging.grossMarginPercentage.strengtheningAmount,
        //     withoutHedging.grossMarginPercentage.actualAmount,
        //     withoutHedging.grossMarginPercentage.weakeningAmount
        //   );

        //   maxPercentage = maxPercentage + maxPercentage / 2;

        //   yAxisMaxWithoutHedging = Math.ceil(maxPercentage);
        //   //yAxisMaxWithoutHedging = Math.ceil(maxPercentage / 100.0) * 100;
        // } else if (
        //   withoutHedging.grossMarginPercentage.strengtheningAmount <= 0 &&
        //   withoutHedging.grossMarginPercentage.actualAmount <= 0 &&
        //   withoutHedging.grossMarginPercentage.weakeningAmount <= 0
        // ) {
        //   yAxisMaxWithoutHedging = 0;
        //   let minPercentage = Math.min(
        //     withoutHedging.grossMarginPercentage.strengtheningAmount,
        //     withoutHedging.grossMarginPercentage.actualAmount,
        //     withoutHedging.grossMarginPercentage.weakeningAmount
        //   );
        //   // yAxisMinWithoutHedging = Math.ceil(-minPercentage / 100.0) * 100;
        //   // yAxisMinWithoutHedging = -yAxisMinWithoutHedging;
        //   minPercentage = Math.ceil(minPercentage + minPercentage / 2);
        //   yAxisMinWithoutHedging = -minPercentage;
        // } else if (
        //   withoutHedging.grossMarginPercentage.strengtheningAmount < 0 ||
        //   withoutHedging.grossMarginPercentage.actualAmount < 0 ||
        //   withoutHedging.grossMarginPercentage.weakeningAmount < 0
        // ) {
        //   let minPercentage = Math.min(
        //     withoutHedging.grossMarginPercentage.strengtheningAmount,
        //     withoutHedging.grossMarginPercentage.actualAmount,
        //     withoutHedging.grossMarginPercentage.weakeningAmount
        //   );
        //   // yAxisMinWithoutHedging = Math.ceil(-minPercentage / 100.0) * 100;
        //   // yAxisMinWithoutHedging = -yAxisMinWithoutHedging;
        //   minPercentage = Math.ceil(minPercentage + minPercentage / 2);
        //   yAxisMinWithoutHedging = -minPercentage;

        //   let maxPercentage = Math.max(
        //     withoutHedging.grossMarginPercentage.strengtheningAmount,
        //     withoutHedging.grossMarginPercentage.actualAmount,
        //     withoutHedging.grossMarginPercentage.weakeningAmount
        //   );

        //   // yAxisMaxWithoutHedging = Math.ceil(maxPercentage / 100.0) * 100;
        //   maxPercentage = maxPercentage + maxPercentage / 2;

        //   yAxisMaxWithoutHedging = Math.ceil(maxPercentage);
        // }

        // Approach II
        let maxPercentage = Math.max(
          withoutHedging.grossMarginPercentage.strengtheningAmount,
          withoutHedging.grossMarginPercentage.actualAmount,
          withoutHedging.grossMarginPercentage.weakeningAmount
        );
        let minPercentage = Math.min(
          withoutHedging.grossMarginPercentage.strengtheningAmount,
          withoutHedging.grossMarginPercentage.actualAmount,
          withoutHedging.grossMarginPercentage.weakeningAmount
        );
        let yAxisMinWithoutHedging = (Math.round(minPercentage / 5) - 1) * 5;
        let yAxisMaxWithoutHedging = (Math.ceil(maxPercentage / 5) + 1) * 5;
        // console.log('yAxisMinWithoutHedging - ', yAxisMinWithoutHedging);
        // console.log('yAxisMaxWithoutHedging - ', yAxisMaxWithoutHedging);

        // let yAxisMinWithHedging = 0;
        // let yAxisMaxWithHedging = 100;
        // if (
        //   withHedging.grossMarginPercentage.strengtheningAmount >= 0 &&
        //   withHedging.grossMarginPercentage.actualAmount >= 0 &&
        //   withHedging.grossMarginPercentage.weakeningAmount >= 0
        // ) {
        //   yAxisMinWithHedging = 0;
        //   let maxPercentage = Math.max(
        //     withHedging.grossMarginPercentage.strengtheningAmount,
        //     withHedging.grossMarginPercentage.actualAmount,
        //     withHedging.grossMarginPercentage.weakeningAmount
        //   );
        //   // yAxisMaxWithHedging = Math.ceil(maxPercentage / 100.0) * 100;
        //   maxPercentage = maxPercentage + maxPercentage / 2;

        //   yAxisMaxWithHedging = Math.ceil(maxPercentage);
        // } else if (
        //   withHedging.grossMarginPercentage.strengtheningAmount <= 0 &&
        //   withHedging.grossMarginPercentage.actualAmount <= 0 &&
        //   withHedging.grossMarginPercentage.weakeningAmount <= 0
        // ) {
        //   yAxisMaxWithHedging = 0;
        //   let minPercentage = Math.min(
        //     withHedging.grossMarginPercentage.strengtheningAmount,
        //     withHedging.grossMarginPercentage.actualAmount,
        //     withHedging.grossMarginPercentage.weakeningAmount
        //   );
        //   // yAxisMinWithHedging = Math.ceil(-minPercentage / 100.0) * 100;
        //   // yAxisMinWithHedging = -yAxisMinWithHedging;
        //   minPercentage = Math.ceil(minPercentage + minPercentage / 2);
        //   yAxisMinWithHedging = -minPercentage;
        // } else if (
        //   withHedging.grossMarginPercentage.strengtheningAmount < 0 ||
        //   withHedging.grossMarginPercentage.actualAmount < 0 ||
        //   withHedging.grossMarginPercentage.weakeningAmount < 0
        // ) {
        //   let minPercentage = Math.min(
        //     withHedging.grossMarginPercentage.strengtheningAmount,
        //     withHedging.grossMarginPercentage.actualAmount,
        //     withHedging.grossMarginPercentage.weakeningAmount
        //   );
        //   // yAxisMinWithHedging = Math.ceil(-minPercentage / 100.0) * 100;
        //   // yAxisMinWithHedging = -yAxisMinWithHedging;
        //   minPercentage = Math.ceil(minPercentage + minPercentage / 2);
        //   yAxisMinWithHedging = -minPercentage;

        //   let maxPercentage = Math.max(
        //     withHedging.grossMarginPercentage.strengtheningAmount,
        //     withHedging.grossMarginPercentage.actualAmount,
        //     withHedging.grossMarginPercentage.weakeningAmount
        //   );

        //   // yAxisMaxWithHedging = Math.ceil(maxPercentage / 100.0) * 100;
        //   maxPercentage = maxPercentage + maxPercentage / 2;

        //   yAxisMaxWithHedging = Math.ceil(maxPercentage);
        // }

        // Approach II
        let maxHedgingPercentage = Math.max(
          withHedging.grossMarginPercentage.strengtheningAmount,
          withHedging.grossMarginPercentage.actualAmount,
          withHedging.grossMarginPercentage.weakeningAmount
        );
        let minHedgingPercentage = Math.min(
          withHedging.grossMarginPercentage.strengtheningAmount,
          withHedging.grossMarginPercentage.actualAmount,
          withHedging.grossMarginPercentage.weakeningAmount
        );
        let yAxisMinWithHedging =
          (Math.round(minHedgingPercentage / 5) - 1) * 5;
        let yAxisMaxWithHedging = (Math.ceil(maxHedgingPercentage / 5) + 1) * 5;
        // console.log('yAxisMinWithHedging - ', yAxisMinWithHedging);
        // console.log('yAxisMaxWithHedging - ', yAxisMaxWithHedging);

        let grossMarginTableData = [];

        // console.log("grossMarginTableData", res.data.hedgings);

        this.state.grossMarginCurrencyFirstColumn.forEach((data, index) => {
          let zeroPercentObj = res.data.hedgings.filter(
            (x) => x.hedgingPercentage == data && x.variationPercentage == 0
          );

          let tenPercentObj = res.data.hedgings.filter(
            (x) => x.hedgingPercentage == data && x.variationPercentage == 10
          );

          let twentyPercentObj = res.data.hedgings.filter(
            (x) => x.hedgingPercentage == data && x.variationPercentage == 20
          );

          let thirtyPercentObj = res.data.hedgings.filter(
            (x) => x.hedgingPercentage == data && x.variationPercentage == 30
          );
          // console.log("checkdata", thirtyPercentObj);
          // console.log("checkdata", twentyPercentObj);

          // console.log("checkdata", tenPercentObj);

          let row = [
            index,
            data + "%",
            formatMoney(
              zeroPercentObj[0].grossMarginPercentage.strengtheningAmount
            ),
            formatMoney(
              tenPercentObj[0].grossMarginPercentage.strengtheningAmount
            ),
            formatMoney(tenPercentObj[0].grossMarginPercentage.weakeningAmount),
            formatMoney(
              twentyPercentObj[0].grossMarginPercentage.strengtheningAmount
            ),
            formatMoney(
              twentyPercentObj[0].grossMarginPercentage.weakeningAmount
            ),
            formatMoney(
              thirtyPercentObj[0].grossMarginPercentage.strengtheningAmount
            ),
            formatMoney(
              thirtyPercentObj[0].grossMarginPercentage.weakeningAmount
            ),
          ];
          grossMarginTableData.push(row);
        });

        const chartsData = {
          salesInHomeCurrencyData,
          costOfSalesInHomeCurrencyData,
          grossMarginData,
          grossMarginHedgingData,
          grossMarginPercentageData,
          grossMarginPercentageHedgingData,
          yAxisMinWithoutHedging,
          yAxisMaxWithoutHedging,
          yAxisMinWithHedging,
          yAxisMaxWithHedging,
          withHedgingKey: this.state.withHedgingKey + 1,
          withoutHedgingKey: this.state.withoutHedgingKey + 1,
          grossMarginTableData,
          grossMarginCurrencyColumns: this.state.grossMarginCurrencyColumns,
        };

        this.setState({
          grossMarginData,
          salesInHomeCurrencyData,
          costOfSalesInHomeCurrencyData,
          grossMarginPercentageData,
          grossMarginPercentageHedgingData,
          grossMarginHedgingData,
          yAxisMinWithoutHedging,
          yAxisMaxWithoutHedging,
          yAxisMinWithHedging,
          yAxisMaxWithHedging,
          chartsData,
          enablePrint: true,
          printData: res.data,
          withHedgingKey: this.state.withHedgingKey + 1,
          withoutHedgingKey: this.state.withoutHedgingKey + 1,
          grossMarginTableData,
        });
      }
    } else {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: "Please provide the valid data to calculate",
      });
    }
  };

  getWithoutHedgingChartData = () => {
    return {
      labels: [
        "Home Currency Strengthening",
        "No Movement",
        "Home Currency Weakening",
      ],
      datasets: [
        {
          yAxisID: "B",
          label: "Gross Margin %",
          type: "line",
          borderColor: "rgba(253,191,45)",
          data: this.state.grossMarginPercentageData,
          fill: false,
        },
        {
          yAxisID: "A",
          label: "Sales in Home Currency",
          type: "bar",
          backgroundColor: "rgba(70,116,193,0.9)",
          data: this.state.salesInHomeCurrencyData,
        },
        {
          yAxisID: "A",
          label: "Cost of Sales in Home Currency",
          type: "bar",
          backgroundColor: "rgba(235,135,60,0.9)",
          backgroundColorHover: "#3e95cd",
          data: this.state.costOfSalesInHomeCurrencyData,
        },
        {
          yAxisID: "A",
          label: "Gross Margin",
          type: "bar",
          backgroundColor: "rgba(165,165,165,0.9)",
          backgroundColorHover: "#3e95cd",
          data: this.state.grossMarginData,
        },
      ],
    };
  };
  getWithHedgingChartData = () => {
    return {
      labels: [
        "No Hedging & Home Currency Strengthening",
        "Hedging & Home Currency Strengthening",
        "No Hedging & Home Currency Weakening",
        "Hedging & Home Currency Weakening",
      ],
      datasets: [
        {
          yAxisID: "B",
          label: "Gross Margin %",
          type: "line",
          borderColor: "rgba(253,191,45)",
          data: this.state.grossMarginPercentageHedgingData,
          fill: false,
        },
        {
          yAxisID: "A",
          label: "Gross Margin",
          type: "bar",
          backgroundColor: "rgba(70,116,193,0.9)",
          data: this.state.grossMarginHedgingData,
        },
      ],
    };
  };

  ResetValues = () => {
    this.setState(this.initialState);
    this.initialzeData();

    let foreignSales = [
      {
        fcsSalesAmount: "",
        fcsSalesCurrency: "",
      },
    ];
    let foreignCosts = [
      {
        fcsCostsAmount: "",
        fcsCostsCurrency: "",
      },
    ];

    this.setState({
      foreignSales,
      foreignCosts,
    });
  };

  handleTotalSalesCurrency = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.getMarginAmount();
    });
  };

  handleTotalCostsCurrency = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.getMarginAmount();
    });
  };

  handleLocalCurrency = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.getMarginAmount();
      this.getCurrencyConversion(
        this.state.foreignSales,
        "fcsSales",
        "totalSales"
      );
      this.getCurrencyConversion(
        this.state.foreignCosts,
        "fcsCosts",
        "totalCosts"
      );
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleFCSChange = (index) => (event) => {
    let foreignSales = this.state.foreignSales;
    foreignSales[index].fcsSalesAmount = event.target.value;
    this.setState({ foreignSales });
  };

  handleFCCChange = (index) => (event) => {
    let foreignCosts = this.state.foreignCosts;
    foreignCosts[index].fcsCostsAmount = event.target.value;
    this.setState({ foreignCosts });
  };

  handleFCSCurrency = (index) => (event) => {
    let foreignSales = this.state.foreignSales;

    foreignSales[index].fcsSalesCurrency = event.target.value;

    this.getCurrencyConversion(foreignSales, "fcsSales", "totalSales");

    this.setState({ foreignSales });
  };
  handleFCCCurrency = (index) => (event) => {
    let foreignCosts = this.state.foreignCosts;
    foreignCosts[index].fcsCostsCurrency = event.target.value;

    this.getCurrencyConversion(foreignCosts, "fcsCosts", "totalCosts");

    this.setState({ foreignCosts });
  };

  addFCSalesHandler = () => {
    let fcsSales = {
      fcsSalesAmount: "",
      fcsSalesCurrency: "",
    };

    let foreignSales = this.state.foreignSales;
    foreignSales.push(fcsSales);
    this.setState({ foreignSales });
  };
  addFCCostsHandler = () => {
    let fcsCosts = {
      fcsCostsAmount: "",
      fcsCostsCurrency: "",
    };

    let foreignCosts = this.state.foreignCosts;
    foreignCosts.push(fcsCosts);
    this.setState({ foreignCosts });
  };

  closeModal = () => {
    // this.setState({ isDealExecuted: false });
    this.setState(this.initialState);
    this.initialzeData();
  };
  handleNoticeModalClose = () => {
    this.setState({
      isNoticeModal: false,
      noticeModalHeaderMsg: "",
      noticeModalMsg: "",
    });
  };

  getSelectHelperText = (currentCostCurrency) => {
    let message = "";
    let salesCurrency = this.state.foreignSales.map((x) => x.fcsSalesCurrency);
    // console.log(salesCurrency);
    if (
      currentCostCurrency !== "" &&
      currentCostCurrency === this.state.localCurrency
    ) {
      message = this.error.fcsCostsCurrencyErrorMsg.localCurrency;
    } else if (
      currentCostCurrency !== "" &&
      salesCurrency.includes(currentCostCurrency)
    ) {
      message = this.error.fcsCostsCurrencyErrorMsg.fcsCostsCurrency;
    }
    return (
      <FormHelperText
        style={{ color: "red", backgroundColor: "white" }}
        hidden={message == ""}
      >
        {message}
      </FormHelperText>
    );
  };

  closeGetStartedModal = () => {
    this.setState({ getStartedModal: false });
  };

  handleGetStarted = (event) => {
    this.setState({ getStartedModal: true });
  };

  render() {
    const { classes } = this.props;
    const { currencies } = this.state;
    return (
      <>
        <form>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={5}>
            <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}
             style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center"
            }}
            >
            <Button
                  onClick={(e) => this.handleGetStarted(e)}
                  style={{
                    color: "white",
                    backgroundColor: "#2391d2",
                    marginLeft: 15,
                    marginBottom: 5,
                    marginTop:0,
                    padding: 5,
                    
                  }}
                >
                  <OndemandVideoIcon style={{ marginRight: 15 }} />
                  WATCH THE VIDEO
                </Button>
                </GridItem>
                </GridContainer>
              <GridContainer>
           
                <GridItem xs={6} sm={6} md={6} lg={6}>
                  <h4>
                    <b>FX Exposure Calculator</b>
                    {/* <Tooltip
                      id="tooltip-heading"
                      style={{textAlign: 'right'}}
                      title={<><span>Hover on </span><InfoOutlined style={{fontSize: 'small'}} /><span> to get additional information.</span></>}
                      placement="top"
                      classes={{ tooltip: classes.tooltipCalculator }}
                    >
                      <InfoOutlined className={classes.info} />
                    </Tooltip> */}
                  </h4>
                </GridItem>
                <GridItem
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
                  style={{
                    textAlign: "right",
                    display: "inline-block",
                  }}
                >
                  <h4>
                    <span>
                      <InfoOutlined style={{ fontSize: "small" }} />
                    </span>{" "}
                    <span style={{ fontSize: "small" }}>
                      Hover on{" "}
                      <span>
                        <InfoOutlined style={{ fontSize: "small" }} />
                      </span>{" "}
                      to get additional information{" "}
                    </span>
                  </h4>
                </GridItem>
                <GridItem xs={12} sm={8} lg={12}>
                  <Card className={cx(classes.exposureCard)}>
                    <CardBody>
                      <div style={{ textAlign: "center", margin: 5 }}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={9} lg={9}>
                            <h5>
                              <b>P & L</b>
                            </h5>
                          </GridItem>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={2}
                            lg={2}
                            className={classes.currencyHeading}
                            style={{ lineHeight: "1.2em" }}
                          >
                            <>
                              <div>Select your</div>
                              <div>Home currency</div>
                            </>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={5} lg={5}>
                            <FormLabel className={cx(classes.currencyLabel)}>
                              Total Sales
                              <Tooltip
                                id="tooltip-totalSales"
                                title="This is total income denominated from your business in your home or functional currency"
                                placement="top"
                                classes={{ tooltip: classes.tooltipCalculator }}
                              >
                                <InfoOutlined className={classes.info} />
                              </Tooltip>
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={7} sm={7} md={4} lg={4}>
                            <CustomNumberFormat
                              success={this.state.totalSalesState === "success"}
                              error={this.state.totalSalesState === "error"}
                              helpText={
                                (this.state.totalSalesState === "error" &&
                                  this.state.totalSalesErrorMsg[0]) ||
                                ""
                              }
                              value={this.state.totalSales}
                              onChange={this.handleChange("totalSales")}
                              id="fec_totalSales"
                              placeholder="500,000"
                              formControlProps={{
                                style: { paddingTop: 0 },
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  this.setState({ totalSalesPristine: false });
                                  this.getCurrencyConversion(
                                    this.state.foreignSales,
                                    "fcsSales",
                                    "totalSales"
                                  );
                                  this.change(event, "totalSales", [
                                    { type: "required" },
                                    { type: "positive" },
                                  ]);
                                },
                                onChange: (event) => {
                                  if (!this.state.totalSalesPristine) {
                                    this.setState({
                                      totalSalesPristine: false,
                                    });
                                    this.change(event, "totalSales", [
                                      { type: "required" },
                                      { type: "positive" },
                                    ]);
                                    this.handleTotalSalesCurrency(event);
                                  }
                                },
                              }}
                            />
                          </GridItem>
                          <GridItem
                            xs={4}
                            sm={4}
                            md={2}
                            lg={2}
                            className={classes.pr0}
                          >
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                value={this.state.localCurrency}
                                onChange={this.handleLocalCurrency}
                                inputProps={{
                                  name: "localCurrency",
                                  id: "localCurrency",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown,
                                  },
                                }}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Choose Local Currency
                                </MenuItem>
                                {currencies &&
                                  currencies.map((item) => (
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected:
                                          classes.selectMenuItemSelected,
                                      }}
                                      value={item.currencyCode}
                                      key={item.currencyCode}
                                    >
                                      {item.currencyCode}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </GridItem>
                          <GridItem xs={1} sm={1} md={1} lg={1} />
                          <GridItem xs={12} sm={12} md={5} lg={5}>
                            <FormLabel className={cx(classes.currencyLabel)}>
                              Cost of Sales
                              <Tooltip
                                id="tooltip-totalCosts"
                                title="This is your total cost of sales denominated in your home or functional currency. Please note that Interest, Tax, Depreciation, and Amortisations are excluded from this cost"
                                placement="top"
                                classes={{ tooltip: classes.tooltipCalculator }}
                              >
                                <InfoOutlined className={classes.info} />
                              </Tooltip>
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={7} sm={7} md={4} lg={4}>
                            <CustomNumberFormat
                              success={this.state.totalCostsState === "success"}
                              error={this.state.totalCostsState === "error"}
                              helpText={
                                (this.state.totalCostsState === "error" &&
                                  this.state.totalCostsErrorMsg[0]) ||
                                ""
                              }
                              value={this.state.totalCosts}
                              placeholder="250,000"
                              onChange={this.handleChange("totalCosts")}
                              id="fec_totalCosts"
                              formControlProps={{
                                style: { paddingTop: 0 },
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  this.setState({ totalCostsPristine: false });
                                  this.getCurrencyConversion(
                                    this.state.foreignCosts,
                                    "fcsCosts",
                                    "totalCosts"
                                  );
                                  this.change(event, "totalCosts", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 100,
                                      },
                                    },
                                  ]);
                                },
                                onChange: (event) => {
                                  if (!this.state.totalCostsPristine) {
                                    this.setState({
                                      totalCostsPristine: false,
                                    });
                                    this.change(event, "totalCosts", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 100,
                                        },
                                      },
                                    ]);
                                    this.handleTotalCostsCurrency(event);
                                  }
                                },
                              }}
                            />
                          </GridItem>
                          <GridItem
                            xs={4}
                            sm={4}
                            md={2}
                            lg={2}
                            className={classes.pr0}
                          >
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                value={this.state.localCurrency}
                                onChange={this.handleLocalCurrency}
                                inputProps={{
                                  name: "localCurrency",
                                  id: "localCurrency",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown,
                                  },
                                }}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Choose Local Currency
                                </MenuItem>
                                {currencies &&
                                  currencies.map((item) => (
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected:
                                          classes.selectMenuItemSelected,
                                      }}
                                      value={item.currencyCode}
                                      key={item.currencyCode}
                                    >
                                      {item.currencyCode}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </GridItem>
                          <GridItem xs={11} sm={1} md={1} lg={1} />
                          <GridItem xs={12} sm={12} md={5} lg={5}>
                            <FormLabel className={cx(classes.currencyLabel)}>
                              Gross Margin*
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={7} sm={7} md={4} lg={4}>
                            <CustomNumberFormat
                              success={
                                this.state.grossMarginState === "success"
                              }
                              error={this.state.grossMarginState === "error"}
                              helpText={
                                (this.state.grossMarginState === "error" &&
                                  this.state.grossMarginErrorMsg[0]) ||
                                ""
                              }
                              value={this.state.grossMargin}
                              onChange={this.handleChange("grossMargin")}
                              id="fec_grossMargin"
                              disabled={true}
                              formControlProps={{
                                style: { paddingTop: 0 },
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                              }}
                            />
                          </GridItem>
                          <GridItem
                            xs={4}
                            sm={4}
                            md={2}
                            lg={2}
                            className={classes.pr0}
                          >
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                value={this.state.localCurrency}
                                onChange={this.handleLocalCurrency}
                                inputProps={{
                                  name: "localCurrency",
                                  id: "localCurrency",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown,
                                  },
                                }}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Choose Local Currency
                                </MenuItem>
                                {currencies &&
                                  currencies.map((item) => (
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected:
                                          classes.selectMenuItemSelected,
                                      }}
                                      value={item.currencyCode}
                                      key={item.currencyCode}
                                    >
                                      {item.currencyCode}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </GridItem>
                          <GridItem xs={1} sm={1} md={1} lg={1} />
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <FormLabel className={cx(classes.footer)}>
                              (*Earning before Interest, Tax, Depreciation, and
                              Amortisation)
                            </FormLabel>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={8} lg={12}>
                  <Card className={cx(classes.exposureCard)}>
                    <CardBody>
                      <div style={{ textAlign: "center", margin: 5 }}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <h5>
                              <b>Foreign Currency Component of P & L</b>
                            </h5>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={9} lg={9}>
                            <FormLabel className={cx(classes.footer)}>
                              (included in Total Sales / Cost of Sales above)
                            </FormLabel>
                          </GridItem>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={2}
                            lg={2}
                            style={{ lineHeight: "1em" }}
                          >
                            <FormLabel className={cx(classes.footer)}>
                              Select Foreign currency
                            </FormLabel>
                          </GridItem>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={1}
                            lg={1}
                            style={{ lineHeight: "1em" }}
                          >
                            <FormLabel className={cx(classes.footer)}>
                              Add More
                            </FormLabel>
                          </GridItem>
                          {this.state.foreignSales &&
                            this.state.foreignSales.map((fcsSales, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <GridItem xs={12} sm={12} md={5} lg={5}>
                                    {index === 0 && (
                                      <FormLabel
                                        className={cx(classes.currencyLabel)}
                                      >
                                        Net Foreign Currency Sales
                                        <Tooltip
                                          id="tooltip-fcsSalesAmount"
                                          title="Please input Net income in each foreign currency (Net of costs in that particular foreign currency). For example, if you have a foreign currency income of USD 2 million and costs of USD 1 million, please input USD 1 million. Please repeat this for each foreign currency where you have net income. These entries cannot be negative"
                                          placement="top"
                                          classes={{
                                            tooltip: classes.tooltipCalculator,
                                          }}
                                        >
                                          <InfoOutlined
                                            className={classes.info}
                                          />
                                        </Tooltip>
                                      </FormLabel>
                                    )}
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={4} lg={4}>
                                    <CustomNumberFormat
                                      success={
                                        this.state.fcsSalesState === "success"
                                      }
                                      error={
                                        this.state.fcsSalesState === "error"
                                      }
                                      helpText={
                                        this.state.fcsSalesState === "error" &&
                                        this.state.fcsSalesErrorMsg[0]
                                      }
                                      value={
                                        this.state.foreignSales[index]
                                          .fcsSalesAmount
                                      }
                                      onChange={this.handleFCSChange(index)}
                                      id={"fcsSalesAmount_" + index}
                                      placeholder="100,000"
                                      formControlProps={{
                                        style: { paddingTop: 0 },
                                        fullWidth: true,
                                        className:
                                          classes.customFormControlClasses,
                                        onBlur: (event) => {
                                          // this.setState({ companyNamePristine: false });
                                          // this.change(event, 'companyName', [{ type: 'required' }]);
                                          this.getCurrencyConversion(
                                            this.state.foreignSales,
                                            "fcsSales",
                                            "totalSales"
                                          );
                                        },
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem
                                    xs={12}
                                    sm={12}
                                    md={2}
                                    lg={2}
                                    className={classes.pr0}
                                  >
                                    <FormControl
                                      fullWidth
                                      className={classes.filledSelect}
                                    >
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu,
                                        }}
                                        value={
                                          this.state.foreignSales[index]
                                            .fcsSalesCurrency
                                        }
                                        onChange={this.handleFCSCurrency(index)}
                                        inputProps={{
                                          name: "fcsSalesCurrency",
                                          id: "fcsSalesCurrency_" + index,
                                          classes: {
                                            icon: classes.white,
                                            root: classes.selectDropDown,
                                          },
                                        }}
                                      >
                                        <MenuItem
                                          disabled
                                          classes={{
                                            root: classes.selectMenuItem,
                                          }}
                                        >
                                          Choose Currency
                                        </MenuItem>
                                        {currencies &&
                                          currencies.map((item) => (
                                            <MenuItem
                                              classes={{
                                                root: classes.selectMenuItem,
                                                selected:
                                                  classes.selectMenuItemSelected,
                                              }}
                                              value={item.currencyCode}
                                              key={item.currencyCode}
                                            >
                                              {item.currencyCode}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                      <FormHelperText
                                        style={{
                                          color: "red",
                                          backgroundColor: "white",
                                        }}
                                        hidden={
                                          !(
                                            this.state.foreignSales[index]
                                              .fcsSalesCurrency !== "" &&
                                            this.state.foreignSales[index]
                                              .fcsSalesCurrency ===
                                              this.state.localCurrency
                                          )
                                        }
                                      >
                                        {
                                          "Choose currency other than local currency"
                                        }
                                      </FormHelperText>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem
                                    xs={1}
                                    sm={1}
                                    md={1}
                                    lg={1}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {index ===
                                      this.state.foreignSales.length - 1 && (
                                      <Add
                                        className={cx(
                                          classes.editIcon,
                                          classes.icon,
                                          classes.addIcon
                                        )}
                                        onClick={this.addFCSalesHandler}
                                      />
                                    )}
                                  </GridItem>
                                </React.Fragment>
                              );
                            })}
                          {this.state.foreignCosts &&
                            this.state.foreignCosts.map((fcsCosts, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <GridItem xs={12} sm={12} md={5} lg={5}>
                                    {index === 0 && (
                                      <FormLabel
                                        className={cx(classes.currencyLabel)}
                                      >
                                        Net Foreign Currency Costs
                                        <Tooltip
                                          id="tooltip-fcsCostsAmount"
                                          title="Please input Net costs in each foreign currency (Net of income in that particular foreign currency). For example, if you have a foreign currency cost of CAD 2 million and income of CAD 1 million, please input CAD 1 million. Please repeat this for each foreign currency where you have net costs. These entries cannot be negative"
                                          placement="top"
                                          classes={{
                                            tooltip: classes.tooltipCalculator,
                                          }}
                                        >
                                          <InfoOutlined
                                            className={classes.info}
                                          />
                                        </Tooltip>
                                      </FormLabel>
                                    )}
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={4} lg={4}>
                                    <CustomNumberFormat
                                      success={
                                        this.state.fcsCostsState === "success"
                                      }
                                      error={
                                        this.state.fcsCostsState === "error"
                                      }
                                      helpText={
                                        this.state.fcsCostsState === "error" &&
                                        this.state.fcsCostsErrorMsg[0]
                                      }
                                      value={
                                        this.state.foreignCosts[index]
                                          .fcsCostsAmount
                                      }
                                      onChange={this.handleFCCChange(index)}
                                      id={"fcsCostsAmount_" + index}
                                      placeholder="50,000"
                                      formControlProps={{
                                        style: { paddingTop: 0 },
                                        fullWidth: true,
                                        className:
                                          classes.customFormControlClasses,
                                        onBlur: (event) => {
                                          // this.setState({ companyNamePristine: false });
                                          // this.change(event, 'companyName', [{ type: 'required' }]);
                                          this.getCurrencyConversion(
                                            this.state.foreignCosts,
                                            "fcsCosts",
                                            "totalCosts"
                                          );
                                        },
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem
                                    xs={12}
                                    sm={12}
                                    md={2}
                                    lg={2}
                                    className={classes.pr0}
                                  >
                                    <FormControl
                                      fullWidth
                                      className={classes.filledSelect}
                                    >
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu,
                                        }}
                                        value={
                                          this.state.foreignCosts[index]
                                            .fcsCostsCurrency
                                        }
                                        onChange={this.handleFCCCurrency(index)}
                                        inputProps={{
                                          name: "fcsCostsCurrency",
                                          id: "fcsCostsCurrency_" + index,
                                          classes: {
                                            icon: classes.white,
                                            root: classes.selectDropDown,
                                          },
                                        }}
                                      >
                                        <MenuItem
                                          disabled
                                          classes={{
                                            root: classes.selectMenuItem,
                                          }}
                                        >
                                          Choose Currency
                                        </MenuItem>
                                        {currencies &&
                                          currencies.map((item) => (
                                            <MenuItem
                                              classes={{
                                                root: classes.selectMenuItem,
                                                selected:
                                                  classes.selectMenuItemSelected,
                                              }}
                                              value={item.currencyCode}
                                              key={item.currencyCode}
                                            >
                                              {item.currencyCode}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                      {/* <FormHelperText
                                        style={{ color: 'red', backgroundColor: 'white' }}
                                        hidden={
                                          !(this.state.foreignCosts[index].fcsCostsCurrency !== '' && this.state.foreignCosts[index].fcsCostsCurrency === this.state.localCurrency)
                                        }
                                      >
                                        {'Choose currency other than local currency'}
                                      </FormHelperText> */}
                                      {this.getSelectHelperText(
                                        fcsCosts.fcsCostsCurrency
                                      )}
                                    </FormControl>
                                  </GridItem>
                                  <GridItem
                                    xs={1}
                                    sm={1}
                                    md={1}
                                    lg={1}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {index ===
                                      this.state.foreignCosts.length - 1 && (
                                      <Add
                                        className={cx(
                                          classes.editIcon,
                                          classes.icon,
                                          classes.addIcon
                                        )}
                                        onClick={this.addFCCostsHandler}
                                      />
                                    )}
                                  </GridItem>
                                </React.Fragment>
                              );
                            })}
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div
                              style={{
                                flexBasis: "auto",
                                display: "flex",
                                marginTop: 25,
                                marginBottom: 0,
                                textAlign: "left",
                              }}
                            >
                              <GridContainer>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={9}
                                  lg={9}
                                  style={{ display: "inline-block" }}
                                >
                                  <FormLabel
                                    className={cx(classes.currencyLabel)}
                                  >
                                    I want to see the impact on Gross Margin for
                                    FX Changes of
                                    <Tooltip
                                      id="tooltip-impactGrossMargin"
                                      title="This is the % of FX changes you want to run the scenario on. You can change this from 0% to 100%. Higher the volatility in foreign currencies with your Home Currency, the higher the percentage you may want to select."
                                      placement="top"
                                      classes={{
                                        tooltip: classes.tooltipCalculator,
                                      }}
                                    >
                                      <InfoOutlined className={classes.info} />
                                    </Tooltip>
                                  </FormLabel>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={2}
                                  lg={2}
                                  style={{ display: "inline-block" }}
                                >
                                  <CustomNumberFormat
                                    success={
                                      this.state.impactGrossMarginState ===
                                      "success"
                                    }
                                    error={
                                      this.state.impactGrossMarginState ===
                                      "error"
                                    }
                                    // helpText={
                                    //   this.state.impactGrossMarginState ===
                                    //     "error" &&
                                    //   this.state.impactGrossMarginErrorMsg[0]
                                    // }
                                    value={this.state.impactGrossMargin}
                                    onChange={this.handleChange(
                                      "impactGrossMargin"
                                    )}
                                    suffix="%"
                                    id="fec_impactGrossMargin"
                                    formControlProps={{
                                      style: { paddingTop: 0, width: 40 },
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: (event) => {
                                        this.setState({
                                          impactGrossMarginPristine: false,
                                        });
                                        this.changePercentage(
                                          event,
                                          "impactGrossMargin",
                                          [
                                            { type: "required" },
                                            {
                                              type: "range",
                                              params: {
                                                min: 0,
                                                max: 100,
                                              },
                                            },
                                          ]
                                        );
                                      },
                                      onChange: (event) => {
                                        if (
                                          !this.state.impactGrossMarginPristine
                                        ) {
                                          this.setState({
                                            impactGrossMarginPristine: false,
                                          });
                                          this.changePercentage(
                                            event,
                                            "impactGrossMargin",
                                            [
                                              { type: "required" },
                                              {
                                                type: "range",
                                                params: {
                                                  min: 0,
                                                  max: 100,
                                                },
                                              },
                                            ]
                                          );
                                          // this.handleImpactGrossMargin(event);
                                        }
                                      },
                                    }}
                                  />
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{ textAlign: "right", color: "red" }}
                                >
                                  {this.state.impactGrossMarginState ===
                                    "error" &&
                                    this.state.impactGrossMarginErrorMsg[0]}
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={9}
                                  lg={9}
                                  style={{ display: "inline-block" }}
                                >
                                  <FormLabel
                                    className={cx(classes.currencyLabel)}
                                  >
                                    I want to see the impact of both, No
                                    Hedging, and when Hedge percentage is
                                    <Tooltip
                                      id="tooltip-hedgingPercentage"
                                      title="This is the Hedge percentage you can change to run the scenario on. You can change this to input greater than 0 to 100%. 0% means No Hedging, and 100% means, full Hedging."
                                      placement="top"
                                      classes={{
                                        tooltip: classes.tooltipCalculator,
                                      }}
                                    >
                                      <InfoOutlined className={classes.info} />
                                    </Tooltip>
                                  </FormLabel>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={2}
                                  lg={2}
                                  style={{ display: "inline-block" }}
                                >
                                  <CustomNumberFormat
                                    success={
                                      this.state.hedgingPercentageState ===
                                      "success"
                                    }
                                    error={
                                      this.state.hedgingPercentageState ===
                                      "error"
                                    }
                                    // helpText={
                                    //   this.state.hedgingPercentageState ===
                                    //     "error" &&
                                    //   this.state.hedgingPercentageErrorMsg[0]
                                    // }
                                    value={this.state.hedgingPercentage}
                                    onChange={this.handleChange(
                                      "hedgingPercentage"
                                    )}
                                    id="fec_hedgingPercentage"
                                    suffix="%"
                                    formControlProps={{
                                      style: { paddingTop: 0, width: 40 },
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: (event) => {
                                        this.setState({
                                          hedgingPercentagePristine: false,
                                        });
                                        this.changePercentage(
                                          event,
                                          "hedgingPercentage",
                                          [
                                            { type: "required" },
                                            {
                                              type: "range",
                                              params: {
                                                min: 0,
                                                max: 100,
                                              },
                                            },
                                          ]
                                        );
                                      },
                                      onChange: (event) => {
                                        if (
                                          !this.state.hedgingPercentagePristine
                                        ) {
                                          this.setState({
                                            hedgingPercentagePristine: false,
                                          });
                                          this.changePercentage(
                                            event,
                                            "hedgingPercentage",
                                            [
                                              { type: "required" },
                                              {
                                                type: "range",
                                                params: {
                                                  min: 0,
                                                  max: 100,
                                                },
                                              },
                                            ]
                                          );
                                          // this.handleHedgingPercentageCurrency(event);
                                        }
                                      },
                                    }}
                                  />
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{ textAlign: "right", color: "red" }}
                                >
                                  {this.state.hedgingPercentageState ===
                                    "error" &&
                                    this.state.hedgingPercentageErrorMsg[0]}
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={9}
                                  lg={9}
                                  style={{ display: "inline-block" }}
                                >
                                  <FormLabel
                                    className={cx(classes.currencyLabel)}
                                  >
                                    I want to see the impact on Gross Margin
                                    when
                                    <a
                                      href="/cms/public/pdfs/FXGuard_Hedging_Cost_Calculation_Guidance.pdf"
                                      target="_blank"
                                    >
                                      {" "}
                                      Hedging Cost{" "}
                                    </a>
                                    in Home Currency is
                                    <Tooltip
                                      id="tooltip-hedgingCostPercentage"
                                      title={
                                        <React.Fragment>
                                          <p>
                                            {
                                              "Hedging Costs = (Hedge Notional in Home Currency X Hedging Cost % chosen by you)."
                                            }
                                          </p>
                                          <br />
                                          <p>
                                            {
                                              "Hedge Notional = Hedge% X (Total FC Sales Income in Home Currency + Total FC Costs in Home Currency)."
                                            }
                                          </p>
                                          <br />
                                          <p>
                                            {
                                              "Hedging Costs % input can be positive or negative from -10.00 to +10.00."
                                            }
                                          </p>
                                          {
                                            "A negative input shows hedging benefit instead of costs."
                                          }
                                        </React.Fragment>
                                      }
                                      placement="top"
                                      classes={{
                                        tooltip: classes.tooltipCalculator,
                                      }}
                                    >
                                      <InfoOutlined className={classes.info} />
                                    </Tooltip>
                                  </FormLabel>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={2}
                                  lg={2}
                                  style={{ display: "inline-block" }}
                                >
                                  <CustomNumberFormat
                                    success={
                                      this.state.hedgingCostPercentageState ===
                                      "success"
                                    }
                                    error={
                                      this.state.hedgingCostPercentageState ===
                                      "error"
                                    }
                                    // helpText={
                                    //   this.state.hedgingCostPercentageState ===
                                    //     "error" &&
                                    //   this.state
                                    //     .hedgingCostPercentageErrorMsg[0]
                                    // }
                                    value={this.state.hedgingCostPercentage}
                                    onChange={this.handleChange(
                                      "hedgingCostPercentage"
                                    )}
                                    id="fec_hedgingCostPercentage"
                                    suffix="%"
                                    formControlProps={{
                                      style: { paddingTop: 0, width: 40 },
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: (event) => {
                                        this.setState({
                                          hedgingCostPercentagePristine: false,
                                        });
                                        this.changePercentage(
                                          event,
                                          "hedgingCostPercentage",
                                          [
                                            { type: "required" },
                                            {
                                              type: "range",
                                              params: {
                                                min: -10,
                                                max: 10,
                                              },
                                            },
                                          ]
                                        );
                                      },
                                      onChange: (event) => {
                                        if (
                                          !this.state
                                            .hedgingCostPercentagePristine
                                        ) {
                                          this.setState({
                                            hedgingCostPercentagePristine: false,
                                          });
                                          this.changePercentage(
                                            event,
                                            "hedgingCostPercentage",
                                            [
                                              { type: "required" },
                                              {
                                                type: "range",
                                                params: {
                                                  min: -10,
                                                  max: 10,
                                                },
                                              },
                                            ]
                                          );
                                          // this.handleHedgingPercentageCurrency(event);
                                        }
                                      },
                                    }}
                                  />
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{ textAlign: "right", color: "red" }}
                                >
                                  {this.state.hedgingCostPercentageState ===
                                    "error" &&
                                    this.state.hedgingCostPercentageErrorMsg[0]}
                                </GridItem>
                              </GridContainer>
                            </div>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
                {/* <GridItem xs={12} sm={8} lg={12} style={{ textAlign: 'center' }}>
                  {this.state.callInProgress ? (
                    <Dialog
                      classes={{
                        root: classes.center + ' ' + classes.modalRoot,
                        paper: classes.modal,
                      }}
                      open={this.state.callInProgress}
                      TransitionComponent={Transition}
                      keepMounted
                      aria-labelledby='notice-modal-slide-title'
                      aria-describedby='notice-modal-slide-description'
                    >
                      <DialogTitle id='waiting-modal-slide-title' disableTypography className={classes.modalHeader}>
                        <h4 className={classes.modalTitle}>{'FX Exposure Calculator is in progress...'}</h4>
                      </DialogTitle>
                      <DialogContent id='waiting-modal-slide-description' className={classes.modalBody} style={{ textAlign: 'center' }}>
                        <CircularProgress />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <React.Fragment>
                      <Button
                        size='lg'
                        style={{
                          backgroundColor: successColor[1],
                          width: 320,
                          marginTop: 20,
                        }}
                        onClick={() => {
                          this.calculateGrpah();
                        }}
                        disabled={this.state.disabledPaymentButton}
                      >
                        <h5>CALCULATE</h5>
                      </Button>
                      <Button
                        size='md'
                        style={{
                          backgroundColor: whiteColor[0],
                          width: 150,
                          marginTop: 20,
                          marginLeft: 50,
                        }}
                        onClick={() => {
                          this.ResetValues();
                        }}
                        disabled={this.state.disabledPaymentButton}
                      >
                        <h5>CLEAR</h5>
                      </Button>
                    </React.Fragment>
                  )}
                </GridItem>
              */}
              </GridContainer>
            </GridItem>
            {this.state.grossMarginData && this.state.grossMarginData.length ? (
              <GridItem xs={12} sm={12} md={12} lg={6}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <Card chart className={cx(classes.exposureCard)}>
                      <CardHeader color="success">
                        <h5>
                          <b>
                            Impact of the FX Movement on the Bottomline - No
                            Hedging
                          </b>
                        </h5>
                      </CardHeader>
                      <CardBody>
                        <Bar
                          key={this.state.withoutHedgingKey}
                          data={this.getWithoutHedgingChartData()}
                          options={{
                            responsive: true,
                            plugins: {
                              labels: {
                                showActualPercentages: false,
                              },
                            },
                            tooltips: {
                              callbacks: {
                                label: (tooltipItems, data) => {
                                  console.log(tooltipItems);
                                  console.log(data);
                                  let value =
                                    tooltipItems.datasetIndex === 0
                                      ? this.state.grossMarginPercentageData[
                                          tooltipItems.index
                                        ] + "%"
                                      : tooltipItems.yLabel;
                                  return (
                                    data.datasets[tooltipItems.datasetIndex]
                                      .label +
                                    ": " +
                                    value
                                  );
                                },
                              },
                            },
                            scales: {
                              yAxes: [
                                {
                                  id: "A",
                                  position: "left",
                                  ticks: {
                                    callback: function(label) {
                                      return formatMoney(label, 0);
                                    },
                                  },
                                },
                                {
                                  id: "B",
                                  type: "linear",
                                  position: "right",
                                  ticks: {
                                    max: this.state.yAxisMaxWithoutHedging,
                                    min: this.state.yAxisMinWithoutHedging,
                                    callback: function(label) {
                                      return label + "%";
                                    },
                                  },
                                },
                              ],
                            },
                          }}
                          width={500}
                          height={200}
                        />
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <Card chart className={cx(classes.exposureCard)}>
                      <CardHeader color="success">
                        <h5>
                          <b>
                            Impact of the FX Movement Compared - With Hedging &
                            No Hedging
                          </b>
                        </h5>
                      </CardHeader>
                      <CardBody>
                        <Bar
                          key={this.state.withHedgingKey}
                          data={this.getWithHedgingChartData()}
                          options={{
                            responsive: true,
                            plugins: {
                              labels: {
                                showActualPercentages: false,
                              },
                            },
                            tooltips: {
                              callbacks: {
                                label: (tooltipItems, data) => {
                                  // console.log(tooltipItems);
                                  // console.log(data);
                                  let value =
                                    tooltipItems.datasetIndex === 0
                                      ? this.state
                                          .grossMarginPercentageHedgingData[
                                          tooltipItems.index
                                        ] + "%"
                                      : tooltipItems.yLabel;
                                  return (
                                    data.datasets[tooltipItems.datasetIndex]
                                      .label +
                                    ": " +
                                    value
                                  );
                                },
                              },
                            },
                            scales: {
                              yAxes: [
                                {
                                  id: "A",
                                  position: "left",
                                  ticks: {
                                    callback: function(label) {
                                      return formatMoney(label, 0);
                                    },
                                  },
                                },
                                {
                                  id: "B",
                                  type: "linear",
                                  position: "right",
                                  ticks: {
                                    max: this.state.yAxisMaxWithHedging,
                                    min: this.state.yAxisMinWithHedging,
                                    callback: function(label) {
                                      return label + "%";
                                    },
                                  },
                                },
                              ],
                            },
                          }}
                          width={500}
                          height={200}
                        />
                      </CardBody>
                      <FormLabel className={cx(classes.graphFooter)}>
                        Hedge% {this.state.hedgingPercentage}%
                      </FormLabel>
                      <FormLabel className={cx(classes.graphFooter)}>
                        {" "}
                        Sales Currency Strengthening or Weakening{" "}
                        {this.state.impactGrossMargin}%{" "}
                      </FormLabel>
                      <FormLabel className={cx(classes.graphFooter)}>
                        Hedging costs {this.state.hedgingCostPercentage}%
                      </FormLabel>
                      <FormLabel className={cx(classes.graphFooter)}>
                        Correlation between currencies not taken into account{" "}
                      </FormLabel>
                      <FormLabel className={cx(classes.graphFooter)}>
                        Timing of Foreign currency inflows and outflows not
                        considered{" "}
                      </FormLabel>
                      <FormLabel className={cx(classes.graphFooter)}>
                        Economic and Translation FX Risks are not covered in
                        this calculator
                      </FormLabel>
                      <FormLabel className={cx(classes.graphFooter)}>
                        Information for indicative purposes only
                      </FormLabel>
                    </Card>
                  </GridItem>
                  {/* <GridItem xs={12} sm={12} md={12} style={{ textAlign: 'center' }}>
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          size='lg'
                          style={{
                            backgroundColor: successColor[1],
                            width: 320,
                            marginTop: 20,
                          }}
                        >
                          <h5>DOWNLOAD REPORT</h5>
                        </Button>
                      )}
                      content={() => this.componentRef}
                    />
                    <div style={{ visibility: 'hidden', height: 0 }}>
                      <FXExposureCalculatorPrint
                        classes={classes}
                        printData={this.state.printData}
                        chartsData={this.state.chartsData}
                        impactGrossMargin={this.state.impactGrossMargin}
                        hedgingCostPercentage={this.state.hedgingCostPercentage}
                        ref={(el) => (this.componentRef = el)}
                      />
                    </div>
                  </GridItem> */}
                </GridContainer>
              </GridItem>
            ) : null}
            <GridItem xs={12} sm={12} md={12} lg={11}>
              <GridContainer style={{ marginTop: "2%" }} justify="center">
                <GridItem xs={3} sm={3} lg={3} style={{ textAlign: "center" }}>
                  {this.state.callInProgress ? (
                    <Dialog
                      classes={{
                        root: classes.center + " " + classes.modalRoot,
                        paper: classes.modal,
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
                        <h4 className={classes.modalTitle}>
                          {"FX Exposure Calculator is in progress..."}
                        </h4>
                      </DialogTitle>
                      <DialogContent
                        id="waiting-modal-slide-description"
                        className={classes.modalBody}
                        style={{ textAlign: "center" }}
                      >
                        <CircularProgress />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <React.Fragment>
                      <Button
                        size="lg"
                        style={{
                          backgroundColor: successColor[1],
                          width: 270,
                          marginTop: 20,
                        }}
                        onClick={() => {
                          this.calculateGrpah();
                        }}
                        disabled={this.state.disabledPaymentButton}
                      >
                        <h5>CALCULATE</h5>
                      </Button>
                      <Button
                        size="md"
                        style={{
                          backgroundColor: whiteColor[0],
                          width: 150,
                          marginTop: 20,
                          // marginLeft: 50,
                        }}
                        onClick={() => {
                          this.ResetValues();
                        }}
                        disabled={this.state.disabledPaymentButton}
                      >
                        <h5>CLEAR</h5>
                      </Button>
                    </React.Fragment>
                  )}
                </GridItem>

                {this.state.grossMarginData &&
                this.state.grossMarginData.length ? (
                  <GridItem
                    xs={6}
                    sm={6}
                    lg={6}
                    style={{ textAlign: "center" }}
                  >
                    <Card chart className={cx(classes.exposureCard)}>
                      <CardHeader color="success">
                        <h5>
                          <b>
                            Gross Margin (%) when the Currency pairs move by
                          </b>
                        </h5>
                      </CardHeader>
                      <CardBody>
                        <Table
                          striped
                          tableHeaderColor="info"
                          tableHead={this.state.grossMarginCurrencyColumns}
                          tableData={this.state.grossMarginTableData}
                          tableSubHead={[
                            "Hedging %",
                            "Home Currency moves by*",
                          ]}
                          tableSubHeadCols={["1", "7"]}
                          tableSubHeadClasses={[
                            classes.tableHedgeHead,
                            classes.tableMarginHead +
                              " " +
                              classes.tableHeadBold,
                          ]}
                          customHeadCellClasses={[
                            classes.tableHedgeHead,
                            classes.tableMarginHead,
                            classes.tableMarginHead,
                            classes.tableMarginHead,
                            classes.tableMarginHead,
                            classes.tableMarginHead,
                            classes.tableMarginHead,
                            classes.tableMarginHead,
                          ]}
                          customHeadClassesForCells={[0, 1, 2, 3, 4, 5, 6, 7]}
                          customCellClasses={[classes.tableHedgeHead]}
                          customClassesForCells={[1]}
                        />
                        <div
                          className={cx(classes.graphFooter)}
                          style={{ marginTop: 20 }}
                        >
                          * -ve sign means Home Currency weakens. +ve sign means
                          Home Currency strengthens.
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                ) : null}
                {this.state.grossMarginData &&
                this.state.grossMarginData.length ? (
                  <GridItem
                    xs={3}
                    sm={3}
                    lg={3}
                    style={{ textAlign: "center" }}
                  >
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          size="lg"
                          style={{
                            backgroundColor: successColor[1],
                            width: 270,
                            marginTop: 20,
                          }}
                        >
                          <h5>DOWNLOAD REPORT</h5>
                        </Button>
                      )}
                      content={() => this.componentRef}
                    />
                  </GridItem>
                ) : null}
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={11}>
              <GridContainer
                style={{ visibility: "hidden", height: 0, overflow: "hidden" }}
              >
                <GridItem xs={12} sm={12} md={12} lg={6}>
                  {this.state.grossMarginData &&
                  this.state.grossMarginData.length ? (
                    <FXExposureCalculatorPrint
                      classes={classes}
                      printData={this.state.printData}
                      chartsData={this.state.chartsData}
                      impactGrossMargin={this.state.impactGrossMargin}
                      hedgingCostPercentage={this.state.hedgingCostPercentage}
                      ref={(el) => (this.componentRef = el)}
                    />
                  ) : null}
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
          {this.state.isNoticeModal && (
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              open={this.state.isNoticeModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => this.handleNoticeModalClose()}
              aria-labelledby="notice-modal-slide-title"
              aria-describedby="notice-modal-slide-description"
            >
              <DialogTitle
                id="notice-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
              >
                <h4 className={classes.modalTitle}>
                  {this.state.noticeModalHeaderMsg}
                </h4>
              </DialogTitle>
              <DialogContent
                id="notice-modal-slide-description"
                className={classes.modalBody}
              >
                <p>{this.state.noticeModalMsg}</p>
              </DialogContent>
              <DialogActions
                style={{ justifyContent: "center" }}
                className={
                  classes.modalFooter + " " + classes.modalFooterCenter
                }
              >
                <Button
                  onClick={() => this.handleNoticeModalClose()}
                  color="info"
                  round
                >
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </form>
        {this.state.getStartedModal && (
          <GetStartedModal
            showModal={this.state.getStartedModal}
            closeModal={this.closeGetStartedModal}
            title={"FX CALCULATOR VIDEO"}
            videoLink={
              "https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/images/Fx+Caculator.mp4"
            }
          />
        )}
      </>
    );
  }
}

// export withStyles(styles)(FXExposureCalculatorComponent);

// class FXExposureCalculator extends React.Component {
//     render() {
//         const { classes } = this.props;
//         return (
//             <div>
//                 <ReactToPrint
//                     trigger={() => (
//                         <Button color="info" round style={{ float: 'right', right: 30, marginBottom: 10 }}>
//                             Print
//                         </Button>
//                     )}
//                     content={() => this.componentRef}
//                 />
//                 <FXExposureCalculatorComponent classes={classes} ref={el => (this.componentRef = el)} />
//             </div>
//         );
//     }
// }

FXExposureCalculator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(FXExposureCalculator));