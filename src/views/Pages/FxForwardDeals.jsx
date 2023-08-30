import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";
import StatusCard from "components/StatusCard/StatusCard.jsx";
import reverseIcon from "assets/img/reverse.png";
// @material-ui/icons
import IconButton from "@material-ui/core/IconButton";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
// import LockOutline from "@material-ui/icons/LockOutline";
import { validate } from "../../utils/Validator";
import {
  formatMoney,
  formatDate,
  parseCurrency,
  parseDate
} from "../../utils/Utils";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import {
  cardTitle,
  roseColor,
  primaryColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const styles = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem"
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px"
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
      height: "55px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px"
    }
  },
  iconRose: {
    color: roseColor
  },
  marginTop30: {
    marginTop: "30px"
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px"
    }
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white"
  },
  inputSec: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white",
    textAlign: "center"
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "black"
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 14,
    marginRight: 5
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999"
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
    display: "inline-block"
  },
  filledSelect: {
    backgroundColor: "grey",
    color: "white !important",
    "&:focus": {
      color: "#999999 !important"
    }
  },
  white: {
    color: "white"
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white"
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right"
  },
  currencyLabel: {
    paddingTop: "7px !important"
  },
  cancelLink: {
    cursor: "Pointer",
    float: "right"
  },
  ...customSelectStyle,
  ...regularFormsStyle
};

const settlementDateOptions = [
  {
    text: "1 week",
    value: "w1"
  },
  {
    text: "2 weeks",
    value: "w2"
  },
  { text: "1 month", value: "m1" },
  {
    text: "2 months",
    value: "m2"
  },
  {
    text: "3 months",
    value: "m3"
  },
  {
    text: "4 months",
    value: "m4"
  },
  {
    text: "5 months",
    value: "m5"
  },
  {
    text: "6 months",
    value: "m6"
  },
  {
    text: "7 months",
    value: "m7"
  },
  {
    text: "8 months",
    value: "m8"
  },
  {
    text: "9 months",
    value: "m9"
  },
  {
    text: "10 months",
    value: "m10"
  },
  {
    text: "11 months",
    value: "m11"
  },
  {
    text: "12 months",
    value: "m12"
  },
  {
    text: "Custom",
    value: "cs"
  }
];

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class FxForwardDeals extends React.Component {
  error = {
    buyErrorMsg: {
      required: "Buy value is required",
      valid: "Please enter a valid company name"
    },
    valueDateErrorMsg: {
      required: "Settlement date value is required",
      valid: "Please select a valid settlement date"
    },
    sellErrorMsg: {
      required: "Sell value is required",
      range: "Incorporation number should be digits"
    },
    companyEmailErrorMsg: {
      required: "Corporate Email is required",
      company: "Please enter a corporate email",
      valid: "Please enter a valid email"
    },
    cityErrorMsg: {
      required: "City is required"
    },
    postalCodeErrorMsg: {
      required: "Postal code is required"
    },
    countryCodeErrorMsg: {
      required: "Country is required"
    },
    typeErrorMsg: {
      required: "Password is required"
    }
  };

  constructor(props) {
    super(props);

    this.initialState = {
      disabledSellBuyCurrency: "",
      disableSellBuyAmount: false,
      baseCurrencyCode: "",
      buyCurrency: "",
      buyCurrencyState: "",
      buy: "",
      buyState: "",
      buyPristine: false,
      buyStateErrorMsg: [],
      sell: "",
      sellState: "",
      sellPristine: false,
      sellStateErrorMsg: [],
      sellCurrency: "",
      settlementDatePeriod: "",
      selectedDate: "",
      valueDateDisable: true,
      valueDate: null,
      minDate: null,
      currencies: [],
      wallets: [],
      preTradeView: true,
      viewCancelOption: false,
      disabledPaymentButton: false,
      disabledGetQuoteButton: false,
      callInProgress: false,
      preTrade: {
        exchageRate: 0,
        fee: 0,
        feeApplicableText:
          "You can remove this Fee by joining our Subscription plan: ",
        feeApplicableLinkText: "Info here",
        feeApplicableLink: "/auth/manage-account"
      },
      trade: {
        amountSold: 0,
        amountBought: 0,
        fee: 0,
        exchageRate: 0
      },
      exhRateSellBuy: true,
      amountBought: "",
      isDealExecuted: false,
      walletStatus: {
        currencies: {
          availableAmount: 0,
          requiredForDeal: 0,
          pendingToPaid: 0,
          remainingAfterDeal: 0
        },
        convertedExchangeRate: 0,
        currencyCode: 0,
        baseCurrency: 0
      },
      intervalId: -1,
      tradePending: false,
      validSeconds: -1,
      currencyMode: "buy",
      isNoticeModal: false,
      noticeModalMsg: "",
      noticeModalHeaderMsg: "",
      fromLocation: "",
      riskRadarData: {},
      riskRadarBuySellAction: "",
      riskRadarType: "",
      holidayList: [],
      disableDatesList: []
    };

    this.state = this.initialState;
  }

  componentDidMount = () => {
    console.log("compoennetdid", this.props.location);
    if (this.props.location.state && this.props.location.state.action) {
      // Get Settlement Date
      let riskRadarDate = this.parseFromString(
        this.props.location.state.riskRadarData.date
      );

      let obj = this.getSettlementDate(riskRadarDate, 1, "c");

      this.setState({
        [this.props.location.state.action]: this.props.location.state.amount,
        [this.props.location.state.action + "Currency"]: this.props.location
          .state.currency,
        [this.props.location.state.action + "State"]: "success",
        disableSellBuyAmount: true,
        disabledSellBuyCurrency: this.props.location.state.action,
        fromLocation: this.props.location.state.fromLocation,
        riskRadarData: this.props.location.state.riskRadarData,
        settlementDatePeriod:
          settlementDateOptions[settlementDateOptions.length - 1],
        valueDate: obj.date,
        riskRadarBuySellAction: this.props.location.state.action,
        riskRadarType: this.props.location.state.riskRadarType
      });
    }
    let viewClient = sessionStorage.getItem("view_as_client");
    let readonly_customer = sessionStorage.getItem("readonly_customer");
    if (viewClient === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg: "You are not authorized to perform the FORWARD Deal"
      });
    } else if (readonly_customer === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg:
          "You cannot perform the FORWARD Deal. Please contact your Admin"
      });
    }
    this.initialzeData();
  };
  initialzeData = () => {
    this.getBaseCurrency();
    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    this.setState({ minDate });
  };
  getBaseCurrency = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc
        });
      }
      return;
    } else {
      if (this.state.fromLocation === "risk-radar") {
        let selectedCurrency = res.data.baseCurrency;
        if (this.props.location.state.action === "sell") {
          selectedCurrency = this.props.location.state.currency;
        }
        this.getAllWallet(selectedCurrency, res.data.baseCurrency);
        this.getCurrencies(selectedCurrency);
      } else {
        this.setState(
          {
            baseCurrencyCode: res.data.baseCurrency,
            sellCurrency: res.data.baseCurrency
          },
          () => {
            this.getAllWallet(res.data.baseCurrency);
            this.getCurrencies(res.data.baseCurrency);
          }
        );
      }
    }
  };
  getAllWallet = async (selectedCurrencyCode, baseCurrencyCode) => {
    if (this.state.wallets.length === 0) {
      const res = await apiHandler({
        url: endpoint.WALLET_FIND,
        authToken: sessionStorage.getItem("token")
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {  
          this.setState({
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg: res.data.userDesc
          });
        }
      } else {
        this.setState(
          {
            wallets: res.data
          },
          () => {
            this.selectWalletForCurrency(
              res.data,
              selectedCurrencyCode,
              baseCurrencyCode
            );
          }
        );
      }
    } else {
      this.selectWalletForCurrency(
        this.state.wallets,
        selectedCurrencyCode,
        baseCurrencyCode
      );
    }
  };
  selectWalletForCurrency = (
    wallets,
    selectedCurrencyCode,
    baseCurrencyCode
  ) => {
    if (selectedCurrencyCode) {
      // check if wallet is available for base currency else first wallet
      let selectedWallet = wallets.filter(wallet => {
        return wallet.currencyCode === selectedCurrencyCode;
      });
      if (selectedWallet.length === 0) {
        selectedWallet = wallets.filter(wallet => {
          return wallet.currencyCode === baseCurrencyCode;
        });
      }
      if (selectedWallet.length > 0) {
        let walletStatus = {
          availableAmount: selectedWallet[0].balanceAmount,
          requiredForDeal: 0,
          pendingToPaid: 0,
          remainingAfterDeal: selectedWallet[0].balanceAmount,
          currencyCode: selectedCurrencyCode
        };
        let preTrade = this.state.preTrade;
        preTrade.walletStatus = walletStatus;
        this.setState({ preTrade });
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "FXGuard says: You can not book this deal as you do not have enough money in your Sell currency Wallet. Kindly top up this Wallet by depositing funds, or do a Spot deal from a currency where you have the funds in Wallet"
        });
      }
    }
  };

  change = (event, stateName, rules) => {
    // this.setState(
    //   validate(event.target.value, stateName, this.state, rules, this.error)
    // );
    if (stateName === "buy" || stateName === "sell") {
      if (this.state[stateName + "Currency"] === "") {
        this.setState({ [stateName]: event.target.value });
      } else {
        this.setState(
          validate(event.target.value, stateName, this.state, rules, this.error)
        );
      }
    } else {
      this.setState(
        validate(event.target.value, stateName, this.state, rules, this.error)
      );
    }
  };

  parseDate(dateObj) {
    if (dateObj === null || dateObj === "") return null;

    var month =
      (dateObj.getMonth() + 1 < 10 ? "0" : "") + (dateObj.getMonth() + 1);
    var date = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate();
    return dateObj.getFullYear() + "-" + month + "-" + date;
  }

  parseFromString(dateStr) {
    if (typeof dateStr === "undefined" || dateStr === null || dateStr === "")
      return null;

    return new Date(new Date(dateStr).toDateString());
  }

  isValidated = () => {
    if (
      this.state.buyState === "success" &&
      this.state.buyCurrencyState === "success" &&
      this.state.sellState === "success" &&
      this.state.sellCurrencyState === "success" &&
      this.state.exchangeRateState === "success" &&
      this.state.fxguardFeeState === "success" &&
      this.state.valueDateState === "success"
    ) {
      return true;
    } else {
      if (this.state.buyState !== "success") {
        this.setState({ buyState: "error" });
      }
      if (this.state.buyCurrencyState !== "success") {
        this.setState({ buyCurrencyState: "error" });
      }
      if (this.state.sellState !== "success") {
        this.setState({ sellState: "error" });
      }
      if (this.state.sellCurrencyState !== "success") {
        this.setState({ sellCurrencyState: "error" });
      }
      if (this.state.exchangeRateState !== "success") {
        this.setState({ exchangeRateState: "error" });
      }
      if (this.state.fxguardFeeState !== "success") {
        this.setState({ fxguardFeeState: "error" });
      }
      if (this.state.valueDateState !== "success") {
        this.setState({ valueDateState: "error" });
      }
    }
    return false;
  };

  getCurrencies = async selectedCurrencyCode => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    let selectedCurrency = res.data.currrencies.filter(currency => {
      return currency.currencyCode === selectedCurrencyCode;
    });
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);
    this.setState({
      currencies: res.data.currrencies,
      selectedDate: new Date(newDate.toDateString())
    });
  };
  cancelTrade = () => {
    clearInterval(this.state.intervalId);
    this.setState(this.initialState);
    this.initialzeData();
  };
  handleTimer = timer => {
    clearInterval(this.state.intervalId);
    var intervalId = setInterval(() => {
      if (timer > 0) this.setState({ validSeconds: timer });
      if (timer < 0 && this.state.tradePending) {
        this.setState({
          viewCancelOption: false,
          validSeconds: -1,
          confirmationModal: true,
          confirmationModalHeader: "FX FORWARD",
          confirmationModalMsg:
            "Your current FX FORWARD quotations are expired. Would you like to renew it again?"
        });
        clearInterval(this.state.intervalId);
      } else --timer;
    }, 1000);
    this.setState({ intervalId: intervalId, viewCancelOption: true });
  };
  handleNegativeResponse = () => {
    let preTrade = this.initialState.preTrade;
    preTrade.exchageRate = 0;
    let buy = 0,
      sell = 0;
    if (this.state.fromLocation === "risk-radar") {
      this.state.riskRadarBuySellAction === "buy"
        ? (buy = this.state.buy)
        : (sell = this.state.sell);
    }
    // Reset the whole data
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      buy,
      sell,
      preTrade,
      preTradeView: true
    });
  };
  handlePositiveResponse = () => {
    this.setState(
      {
        confirmationModal: false,
        confirmationModalHeader: "",
        confirmationModalMsg: ""
      },
      () => {
        // Call for new quotes again
        this.getPreTrade(this.state.currencyMode);
      }
    );
  };

  getPreTrade = currency => {
    if (
      this.state.buyCurrency !== "" &&
      this.state.sellCurrency !== "" &&
      this.state.valueDate &&
      this.state.valueDate !== "" &&
      ((this.state.buy !== "" && this.state.buy !== 0) ||
        (this.state.sell !== "" && this.state.sell !== 0))
    ) {
      let currencyMode = currency;
      if (!currencyMode) {
        currency =
          this.state.buy.length > 1
            ? "buy"
            : this.state.sell.length > 1
            ? "sell"
            : "buy";
      }
      if (this.state.buyCurrency === this.state.sellCurrency) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: "Please select different Buy & Sell currency type."
        });
      } else {
        this.setState({ currencyMode: currencyMode }, () => {
          // this.trade(currencies, "fx-forrex/fx/preTrade", currency);
          this.preTrade1(this.state.currencies, currencyMode);
        });
      }
    }
  };
  preTrade1 = async (currencies, currency = "buy") => {
    const isDealExecuted = false;
    // const url = "/fx-forrex/fx/v2/preTrade";
    // const url = "/fx-forrex/fx/v3/preTrade";
    const url = endpoint.FIND_QUOTE;

    // let settlementDate = currencies.filter(
    //   item => item.currencyCode === "CAD"
    // )[0].earliestSettlement;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() + 3);
    let settlementDate = this.parseDate(today);

    let preTradeParam = {
      tradeType: "FXFWD",
      fromCurrencyCode: this.state.sellCurrency,
      toCurrencyCode: this.state.buyCurrency,
      side: currency === "buy" ? "BUY" : "SELL",
      // buyAmount:
      //   currency === "buy" || this.state.fromLocation === "risk-radar"
      //     ? parseCurrency(this.state.buy)
      //     : "0",
      // sellAmount:
      //   currency === "sell" || this.state.fromLocation === "risk-radar"
      //     ? parseCurrency(this.state.sell)
      //     : "0",
      amount:
        currency === "buy"
          ? parseCurrency(this.state.buy)
          : parseCurrency(this.state.sell),
      settlementDate:
        this.state.fromLocation === "risk-radar"
          ? this.state.riskRadarData.date
          : this.parseDate(this.state.valueDate) || settlementDate
    };
    clearInterval(this.state.intervalId);
    this.setState({ disabledGetQuoteButton: true });
    const res = await apiHandler({
      method: "POST",
      url: url,
      data: preTradeParam,
      authToken: sessionStorage.getItem("token")
    });
    const trade = res.data;
    this.setState({ disabledGetQuoteButton: false });
    if (trade.errorCode === 403) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "You do not have permission to book FX Forward trade. Please contact your Admin."
      });
    } else if (trade.errorCode === 500) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: "There is a timeout issue. Please try after sometime!"
      });
    } else if (res.data.errorCode === 401) {
      console.log("Unauthorized Access");
      this.props.history.push("/home/logout");
      return;
    } else if (trade.errorCode) {
      if (
        this.state.fromLocation === "risk-radar" &&
        trade.userDesc.includes("Wallet does not have balance for currency")
      ) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "You don’t have wallet in specified currency to pay margin amount. Can you first do the spot deal to update wallet for this currency."
        });
      } else {
        if (trade.userDesc.includes("PROVIDER_ABORT")) {
          this.setState({
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg:
              "There seems to be a problem currently. Please try again."
          });
        } else {
          this.setState({
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg: trade.userDesc
          });
        }
      }
    } else {
      let resData = {};
      // Start Timer
      this.handleTimer(trade.quoteTimeout);
      resData.preTradeView = false;
      // Update data on screen
      if (currency === "buy") {
        resData.availableAmount = trade.amountBought;
        //resData.sell = trade.amountSold;
        resData.sell =
          this.state.fromLocation === "risk-radar" &&
          this.state.riskRadarBuySellAction === "sell"
            ? this.state.sell
            : trade.amountSold;
        resData.buy =
          this.state.fromLocation === "risk-radar" &&
          this.state.riskRadarBuySellAction === "buy"
            ? trade.amountBought
            : this.state.buy;

        resData.isDealExecuted = isDealExecuted;
        resData.valueDate = this.parseFromString(trade.settlementDate);
      } else {
        resData.availableAmount = trade.amountBought;
        //resData.buy = trade.amountBought;
        resData.sell =
          this.state.fromLocation === "risk-radar" &&
          this.state.riskRadarBuySellAction === "sell"
            ? trade.amountSold
            : this.state.sell;
        resData.buy =
          this.state.fromLocation === "risk-radar" &&
          this.state.riskRadarBuySellAction === "buy"
            ? this.state.buy
            : trade.amountBought;
        resData.isDealExecuted = isDealExecuted;
        resData.valueDate = this.parseFromString(trade.settlementDate);
      }
      if (isDealExecuted) {
        resData.trade = trade;
        resData.tradePending = false;
        if (this.state.fromLocation === "risk-radar") {
          this.linkDealWithRiskRadar(trade);
        }
      } else {
        resData.preTrade = trade;
        resData.tradePending = true;
        resData.preTrade.feeApplicableText = trade.freeSubscriptionPlan
          ? "You can remove this Fee by joining our Subscription plan: "
          : trade.existingPlanLimitExceed
          ? ""
          : null;
        resData.preTrade.feeApplicableLinkText = trade.freeSubscriptionPlan
          ? "Info here"
          : trade.existingPlanLimitExceed
          ? "Please Upgrade your Plan to remove the Fee"
          : null;
        resData.preTrade.feeApplicableLink = "/auth/manage-account";
      }
      // this.getCurrencyConversion(trade);
      this.setState({ ...resData }, () => {
        console.log("after pretrade", this.state.buy);
        console.log("after pretrade", this.state.sell);
      });
    }
  };
  finalTrade = async (currency = "buy") => {
    //let data = {fromCurrencyCode:"USD",toCurrencyCode:"CAD",amount:"1000"};
    const currencies = this.state.currencies;
    // const url = "fx-forrex/fx/v3/trade";
    const url = endpoint.PLACE_TRADE;

    let isDealExecuted = true;
    let settlementDate = currencies.filter(
      item => item.currencyCode === "CAD"
    )[0].earliestSettlement;

    let tradeParam = {
      quoteRequestId: this.state.preTrade.quoteRequestId
      // tradeType: "FXFWD",
      // fromCurrencyCode: this.state.sellCurrency,
      // toCurrencyCode: this.state.buyCurrency,
      // buyAmount: parseCurrency(this.state.buy),
      // sellAmount: parseCurrency(this.state.sell),
      // settlementDate:
      //   this.state.fromLocation === "risk-radar"
      //     ? this.state.riskRadarData.date
      //     : this.parseDate(this.state.valueDate) || settlementDate,

      // exchangeRate: this.state.preTrade.exchageRate,
      // marginAmount: this.state.preTrade.marginAmount,
      // fee: this.state.preTrade.fee,
      // quoteId: this.state.preTrade.quoteId,
      // quoteRequestId: this.state.preTrade.quoteRequestId,
      // liquidityProvider: this.state.preTrade.liquidityProvider,
      // providerSettlementDate: this.state.preTrade.providerSettlementDate,
      // side: this.state.preTrade.side,
      // offerPrice: this.state.preTrade.offerPrice,
      // offerForwardPoints: this.state.preTrade.offerForwardPoints
    };
    clearInterval(this.state.intervalId);
    this.setState({ tradePending: false });
    const res = await apiHandler({
      method: "POST",
      url: url,
      data: tradeParam,
      authToken: sessionStorage.getItem("token")
    });
    const trade = res.data;
    this.setState({ callInProgress: false, disabledPaymentButton: false });
    if (trade.errorCode === 403) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "You do not have permission to book FX Forward trade. Please contact your Admin."
      });
    } else if (trade.errorCode === 406) {
      this.setState({
        viewCancelOption: false,
        validSeconds: -1,
        confirmationModal: true,
        confirmationModalHeader: "FX FORWARD",
        confirmationModalMsg: trade.userDesc + ". Do you want to get new quote?"
      });
    } else if (trade.errorCode === 412) {
      this.setState({
        viewCancelOption: false,
        validSeconds: -1,
        confirmationModal: true,
        confirmationModalHeader: "FX FORWARD",
        confirmationModalMsg: trade.userDesc + ". Do you want to get new quote?"
      });
    } else if (trade.errorCode) {
      if (
        this.state.fromLocation === "risk-radar" &&
        trade.userDesc.includes("Wallet does not have balance for currency")
      ) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "You don’t have wallet in specified currency to pay margin amount. Can you first do the spot deal to update wallet for this currency."
        });
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: trade.userDesc
        });
      }
    } else if (trade.orderStatus === "4 – Cancelled") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "Something has gone wrong. Your deal is not successful. Please try again."
      });
    } else {
      let resData = {};
      resData.preTradeView = true;
      if (currency === "buy") {
        resData.availableAmount = trade.amountBought;
        //resData.sell = trade.amountSold;
        resData.sell =
          this.state.fromLocation === "risk-radar"
            ? this.state.sell
            : trade.amountSold;
        resData.buy =
          this.state.fromLocation === "risk-radar"
            ? trade.amountBought
            : this.state.buy;

        resData.isDealExecuted = isDealExecuted;
        resData.valueDate = this.parseFromString(trade.settlementDate);
      } else {
        resData.availableAmount = trade.amountBought;
        //resData.buy = trade.amountBought;
        resData.sell =
          this.state.fromLocation === "risk-radar"
            ? trade.amountSold
            : this.state.sell;
        resData.buy =
          this.state.fromLocation === "risk-radar"
            ? this.state.buy
            : trade.amountBought;
        resData.isDealExecuted = isDealExecuted;
        resData.valueDate = this.parseFromString(trade.settlementDate);
      }
      if (isDealExecuted) {
        resData.trade = trade;
        if (this.state.fromLocation === "risk-radar") {
          this.linkDealWithRiskRadar(trade);
        }
      } else {
        resData.preTrade = trade;
        resData.preTrade.feeApplicableText = trade.freeSubscriptionPlan
          ? "You can remove this Fee by joining our Subscription plan: "
          : trade.existingPlanLimitExceed
          ? ""
          : null;
        resData.preTrade.feeApplicableLinkText = trade.freeSubscriptionPlan
          ? "Info here"
          : trade.existingPlanLimitExceed
          ? "Please Upgrade your Plan to remove the Fee"
          : null;
        resData.preTrade.feeApplicableLink = "/auth/manage-account";
      }
      // this.getCurrencyConversion(trade);
      this.setState({ ...resData }, () => {
        console.log("after pretrade", this.state.buy);
        console.log("after pretrade", this.state.sell);
      });
    }
  };
  // trade = (currencies, url, currency = "buy") => {
  //   //let data = {fromCurrencyCode:"USD",toCurrencyCode:"CAD",amount:"1000"};
  //   let isDealExecuted = url === "fx-forrex/fx/preTrade" ? false : true;
  //   let settlementDate = currencies.filter(
  //     item => item.currencyCode === "CAD"
  //   )[0].earliestSettlement;

  //   let preTradeParam = {
  //     tradeType: "FXFWD",
  //     fromCurrencyCode: this.state.sellCurrency,
  //     toCurrencyCode: this.state.buyCurrency,
  //     buyAmount:
  //       currency === "buy" || this.state.fromLocation === "risk-radar"
  //         ? parseCurrency(this.state.buy)
  //         : "0",
  //     sellAmount:
  //       currency === "sell" || this.state.fromLocation === "risk-radar"
  //         ? parseCurrency(this.state.sell)
  //         : "0",
  //     settlementDate:
  //       this.state.fromLocation === "risk-radar"
  //         ? this.state.riskRadarData.date
  //         : this.parseDate(this.state.valueDate) || settlementDate
  //   };
  //   const header = {
  //     headers: {
  //       Authorization: "Bearer " + sessionStorage.getItem("token")
  //     }
  //   };
  //   API.post(url, preTradeParam, header).then(
  //     res => {
  //       const trade = res.data;
  //       this.setState({ callInProgress: false });
  //       if (trade.errorCode === 403) {
  //         this.setState({
  //           isNoticeModal: true,
  //           noticeModalHeaderMsg: "Error",
  //           noticeModalMsg:
  //             "You do not have permission to book FX Forward trade. Please contact your Admin."
  //         });
  //       } else if (trade.errorCode) {
  //         if (
  //           this.state.fromLocation === "risk-radar" &&
  //           trade.userDesc.includes("Wallet does not have balance for currency")
  //         ) {
  //           this.setState({
  //             isNoticeModal: true,
  //             noticeModalHeaderMsg: "Error",
  //             noticeModalMsg:
  //               "You don’t have wallet in specified currency to pay margin amount. Can you first do the spot deal to update wallet for this currency."
  //           });
  //         } else {
  //           this.setState({
  //             isNoticeModal: true,
  //             noticeModalHeaderMsg: "Error",
  //             noticeModalMsg: trade.userDesc
  //           });
  //         }
  //       } else {
  //         let resData = {};
  //         if (currency === "buy") {
  //           resData.availableAmount = trade.amountBought;
  //           //resData.sell = trade.amountSold;
  //           resData.sell =
  //             this.state.fromLocation === "risk-radar"
  //               ? this.state.sell
  //               : trade.amountSold;
  //           resData.buy =
  //             this.state.fromLocation === "risk-radar"
  //               ? trade.amountBought
  //               : this.state.buy;

  //           resData.isDealExecuted = isDealExecuted;
  //           resData.valueDate = this.parseFromString(trade.settlementDate);
  //         } else {
  //           resData.availableAmount = trade.amountBought;
  //           //resData.buy = trade.amountBought;
  //           resData.sell =
  //             this.state.fromLocation === "risk-radar"
  //               ? trade.amountSold
  //               : this.state.sell;
  //           resData.buy =
  //             this.state.fromLocation === "risk-radar"
  //               ? this.state.buy
  //               : trade.amountBought;
  //           resData.isDealExecuted = isDealExecuted;
  //           resData.valueDate = this.parseFromString(trade.settlementDate);
  //         }
  //         if (isDealExecuted) {
  //           resData.trade = trade;
  //           if (this.state.fromLocation === "risk-radar") {
  //             this.linkDealWithRiskRadar(trade);
  //           }
  //         } else {
  //           resData.preTrade = trade;
  //           resData.preTrade.feeApplicableText = trade.freeSubscriptionPlan
  //             ? "You can remove this Fee by joining our Subscription plan: "
  //             : trade.existingPlanLimitExceed
  //             ? ""
  //             : null;
  //           resData.preTrade.feeApplicableLinkText = trade.freeSubscriptionPlan
  //             ? "Info here"
  //             : trade.existingPlanLimitExceed
  //             ? "Please Upgrade your Plan to remove the Fee"
  //             : null;
  //           resData.preTrade.feeApplicableLink = "/auth/manage-account";
  //         }
  //         // this.getCurrencyConversion(trade);
  //         this.setState({ ...resData }, () => {
  //           console.log("after pretrade", this.state.buy);
  //           console.log("after pretrade", this.state.sell);
  //         });
  //       }
  //     },
  //     () => {
  //       // TODO
  //     }
  //   );
  // };
  linkDealWithRiskRadar = async dealDetails => {
    let param = {
      uuid: this.state.riskRadarData.uuid,
      dealId: dealDetails.dealId,
      dealType: "FXFWD",
      amount:
        this.state.riskRadarBuySellAction === "buy"
          ? this.state.buy
          : this.state.sell,
      dealDate: dealDetails.dealDate,
      currencyCode:
        this.state.riskRadarBuySellAction === "buy"
          ? this.state.buyCurrency
          : this.state.sellCurrency,
      transactionType:
        this.state.riskRadarBuySellAction === "buy" ? "BOUGHT" : "SOLD",
      riskRadarType: this.state.riskRadarType,
      boughtCurrencyCode: dealDetails.boughtCurrencyCode,
      currencyBought: dealDetails.currencyBought,
      currencySold: dealDetails.currencySold,
      soldCurrencyCode: dealDetails.soldCurrencyCode,
      settlementDate: dealDetails.settlementDate,
      exchangeRate: dealDetails.exchangeRate
    };
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.CALCULATOR_SENSITIVE_AMOUNT,
      data: param,
      authToken: sessionStorage.getItem("token")
    });
    console.log("updateSensitiveAmt", res);
    this.setState({
      fromLocation: ""
    });
  };
  getCurrencyConversion = async trade => {
    let url = "fx-forrex/fx/currencyConversion";
    const {
      availableAmount,
      requiredForDeal,
      pendingToPaid,
      remainingAfterDeal,
      currencyCode
    } = trade.walletStatus;

    let currencyConversionParam = {
      baseCurrency: currencyCode,
      currencies: [
        {
          currencyCode: trade.boughtCurrencyCode,
          amount: availableAmount
        },
        {
          currencyCode: trade.boughtCurrencyCode,
          amount: requiredForDeal
        },
        {
          currencyCode: trade.boughtCurrencyCode,
          amount: pendingToPaid
        },
        {
          currencyCode: trade.boughtCurrencyCode,
          amount: remainingAfterDeal
        }
      ]
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CURRENCIES_CONVERSION,
      data: currencyConversionParam,
      authToken: sessionStorage.getItem("token")
    });
    const { currencies, baseCurrency } = res.data;

    let walletStatus = {
      currencies: {
        availableAmount: currencies[0].convertedAmount,
        requiredForDeal: currencies[1].convertedAmount,
        pendingToPaid: currencies[2].convertedAmount,
        remainingAfterDeal: currencies[3].convertedAmount
      },
      convertedExchangeRate: currencies[0].exchangeRate,
      currencyCode: currencies[0].currencyCode,
      baseCurrency: baseCurrency
    };

    this.setState({ walletStatus: walletStatus });
  };

  handleSettlementDatePeriod = event => {
    let settlementDate = new Date().toDateString();
    let sd = new Date(new Date(settlementDate).toDateString());
    let obj = this.getSettlementDate(sd, 3, type);
    sd = obj.date;
    let val = event.target.value.slice(1);
    let type = event.target.value[0];

    if (type === "m") {
      this.setState({ valueDateDisable: true });
      sd.setMonth(sd.getMonth() + Number(val));
    } else if (type === "w") {
      this.setState({ valueDateDisable: true });
      sd.setDate(sd.getDate() + Number(val) * 7);
    } else if (type === "c") {
      // sd.setDate(sd.getDate() + 3);
      this.setState({ valueDateDisable: false });
    }
    // if date is weekend then move it forward
    // if (sd.getDay() === 0) {
    //   // i.e Sunday
    //   sd.setDate(sd.getDate() + 1);
    // } else if (sd.getDay() === 6) {
    //   // i.e. Saturday
    //   sd.setDate(sd.getDate() + 2);
    // }
    obj = this.getSettlementDate(sd, 1, type);

    // var month = (sd.getMonth() + 1 < 10 ? "0" : "") + (sd.getMonth() + 1);
    // var date = (sd.getDate() < 10 ? "0" : "") + sd.getDate();
    // let updatedDate = sd.getFullYear() + "-" + month + "-" + date;

    const currency =
      this.state.buy.length > 1
        ? "buy"
        : this.state.sell.length > 1
        ? "sell"
        : "buy";

    this.setState(
      {
        settlementDatePeriod: event.target.value,
        valueDate: obj.date,
        disableDatesList: obj.disableDatesList
      },
      () => {
        // this.getPreTrade(currency);
      }
    );
  };
  getDateAfterXDays = (y, m, d) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    console.log("getDateAfterXDays", year, month, day);
    console.log("getDateAfterXDays", year + y, month + m, day + d);

    var c = new Date(year + y, month + m, day + d);
    c.setHours(0, 0, 0, 0);
    // console.log('getDateAfterXYears',this.state.dayOfYear)

    return c;
  };
  getSettlementDate = (date, moveDateBy, type) => {
    let disableDatesList = [...this.state.holidayList];
    // console.log('getsettlementdate',date)
    // console.log('getsettlementdate',moveDateBy)
    // console.log('getsettlementdate',type)

    while (moveDateBy !== 0) {
      //console.log('getsettlementdate',moveDateBy)
      //console.log('getsettlementdate',this.checkIfHoliday(date, this.state.holidayList))
      if (this.checkIfHoliday(date, this.state.holidayList)) {
        date.setDate(date.getDate() + 1);
      } else if (date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
      } else if (date.getDay() === 6) {
        date.setDate(date.getDate() + 2);
      } else {
        if (moveDateBy !== 1) {
          //  if(type==='c'){
          disableDatesList.push({ date: parseDate(date) });
          // }
          date.setDate(date.getDate() + 1);
        }
        moveDateBy--;
      }
    }
    return {
      date: date,
      disableDatesList: disableDatesList
    };
  };
  disableWeekends = date => {
    return date
      ? date.getDay() === 0 ||
          date.getDay() === 6 ||
          date.getTime() === this.getDateAfterXDays(0, 0, 0).getTime() ||
          date.getTime() === this.getDateAfterXDays(0, 0, 1).getTime() ||
          this.checkIfHoliday(date, this.state.disableDatesList)
      : null;
  };
  checkIfHoliday = (date, holidayList) => {
    let dateString = parseDate(date);
    return holidayList.find(x => x.date === dateString) ? true : false;
  };
  onChangeBuyAmount = event => {
    this.setState({ currencyMode: "buy" });
    if (this.state.sell !== "") {
      this.setState({ sell: "" });
    }
  };
  onChangeSellAmount = event => {
    this.setState({ currencyMode: "sell" });
    if (this.state.buy !== "") {
      this.setState({ buy: "" });
    }
  };

  handleBuyCurrency = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      // this.getPreTrade("buy");
      if (event && event.target && event.target.value) {
        this.getHolidayList(event.target.value, "sell", 2);
      }
    });
  };
  getHolidayList = async (currency, nextCurrencyAction, callAPITimes) => {
    let config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    };
    // let currency=currency
    if (callAPITimes === 1) {
      currency = this.state[nextCurrencyAction + "Currency"];
    }
    if (currency != null && currency !== "") {
      const res = await apiHandler({
        url: endpoint.CALENDAR + currency,
        authToken: sessionStorage.getItem("token")
      });
      // console.log("getapidtacehck", res.data);
      if (
        res.data.errorCode &&
        (res.data.errorCode === 403 || res.data.errorCode === 500)
      ) {
        this.props.setLoading(false);
        return;
      } else if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode) {
        this.props.setLoading(false);
        return;
      } else {
        this.setState(
          {
            holidayList: res.data && res.data.holidays ? res.data.holidays : []
          },
          () => {
            this.setState(
              {
                disableDatesList:
                  res.data && res.data.holidays
                    ? [...this.state.disableDatesList, ...res.data.holidays]
                    : [...this.state.disableDatesList],
                holidayList:
                  res.data && res.data.holidays
                    ? [...this.state.holidayList, ...res.data.holidays]
                    : [...this.state.holidayList],
                settlementDatePeriod: null,
                valueDate:
                  this.state.fromLocation === "risk-radar"
                    ? this.state.valueDate
                    : null
              },
              () => {
                if (callAPITimes !== 1) {
                  this.getHolidayList(
                    currency,
                    nextCurrencyAction,
                    callAPITimes - 1
                  );
                }
              }
            );
          }
        );
      }
    }
  };
  handleSellCurrency = event => {
    const value = event.target.value;
    this.setState({ [event.target.name]: value }, () => {
      if (event && event.target && value) {
        this.getHolidayList(value, "buy", 2);
      }
      // this.getPreTrade("sell");
      // const val = parseCurrency(value) - this.state.preTrade.walletStatus.availableAmount;
      if (
        this.state.preTrade &&
        this.state.preTrade.walletStatus &&
        this.state.preTrade.walletStatus.availableAmount &&
        this.state.preTrade.walletStatus.availableAmount < parseCurrency(value)
      ) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "FXGuard says: You can not book this deal as you do not have enough money in your Sell currency Wallet. Kindly top up this Wallet by depositing funds, or do a Spot deal from a currency where you have the funds in Wallet"
        });
      }
    });
  };

  handleSellCurrencyCode = event => {
    let selectedWallet = this.state.wallets.filter(wallet => {
      return wallet.currencyCode === event.target.value;
    });
    if (selectedWallet.length > 0) {
      this.setState({ [event.target.name]: event.target.value }, () => {
        this.selectWalletForCurrency(
          this.state.wallets,
          event.target.value,
          this.state.baseCurrencyCode
        );
        // this.getPreTrade("sell");
      });
    } else {
      // Wallet is not available so check for Basecurrency wallet
      let baseCurrencyWallet = this.state.wallets.filter(wallet => {
        return wallet.currencyCode === this.state.baseCurrencyCode;
      });
      if (baseCurrencyWallet.length > 0) {
        this.setState({ [event.target.name]: event.target.value }, () => {
          this.selectWalletForCurrency(
            this.state.wallets,
            this.state.baseCurrencyCode,
            this.state.baseCurrencyCode
          );
          // this.getPreTrade("sell");
        });
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "FXGuard says: You can not book this deal as you do not have enough money in your Sell currency Wallet. Kindly top up this Wallet by depositing funds, or do a Spot deal from a currency where you have the funds in Wallet"
        });
      }
    }
  };
  swapCurrencies = () => {
    if (!this.state.preTradeView) return;

    // Check for Wallet in new currency
    let selectedWallet =
      this.state.wallets &&
      this.state.wallets.filter(wallet => {
        return wallet.currencyCode === this.state.buyCurrency;
      });
    if (selectedWallet.length > 0) {
      // Wallet is available
      let buyCurrency = this.state.buyCurrency;
      let buyCurrencyState = this.state.buyCurrencyState;
      let buy = this.state.buy;
      let buyState = this.state.buyState;
      this.setState(
        {
          buyCurrency: this.state.sellCurrency,
          buyCurrencyState: this.state.sellCurrencyState,
          buy: this.state.sell,
          buyState: this.state.sellState,
          sellCurrency: buyCurrency,
          sellCurrencyState: buyCurrencyState,
          sell: buy,
          sellState: buyState
        },
        () => {
          this.selectWalletForCurrency(
            this.state.wallets,
            buyCurrency,
            this.state.baseCurrencyCode
          );
        }
      );

      let sellCurrency = this.state.sellCurrency;
      this.setState({
        sellCurrency: this.state.buyCurrency,
        buyCurrency: sellCurrency
      });
    } else {
      // if Wallet is not available then check for Base Currency wallet
      let baseCurrencyWallet = this.state.wallets.filter(wallet => {
        return wallet.currencyCode === this.state.baseCurrencyCode;
      });
      if (baseCurrencyWallet.length > 0) {
        let buyCurrency = this.state.buyCurrency;
        this.setState(
          {
            buyCurrency: this.state.sellCurrency,
            sellCurrency: buyCurrency
          },
          () => {
            this.selectWalletForCurrency(
              this.state.wallets,
              this.state.baseCurrencyCode,
              this.state.baseCurrencyCode
            );
          }
        );
      } else {
        if (this.state.buyCurrency === "") {
          this.setState({
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg:
              "FXGuard says: You can not swap currencies as you have not selected any Buy currency Wallet."
          });
        } else {
          this.setState({
            isNoticeModal: true,
            noticeModalHeaderMsg: "Error",
            noticeModalMsg:
              "FXGuard says: You can not swap currencies as you do not have enough money in your Buy currency Wallet. Kindly top up this Wallet by depositing funds, or do a Spot deal from a currency where you have the funds in Wallet"
          });
        }
      }
    }
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleDateChange = date => {
    this.setState(
      validate(date, "valueDate", this.state, [{ type: "oldDate" }], this.error)
      // () => this.getPreTrade(this.state.currencyMode)
    );
  };

  closeModal = () => {
    // this.setState({ isDealExecuted: false });
    this.setState(this.initialState);
    this.initialzeData();
  };

  handleNoticeModalClose = () => {
    this.setState(
      {
        isNoticeModal: false,
        noticeModalHeaderMsg: "",
        noticeModalMsg: ""
      },
      () => {
        this.setState(this.initialState);
        this.initialzeData();
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { preTrade, walletStatus, currencies } = this.state;
    return preTrade && walletStatus && currencies ? (
      <>
        <form>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={7}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <h4>
                    <b>FX Forward Deals</b>
                  </h4>
                </GridItem>

                <GridItem xs={12} sm={8} lg={12}>
                  <Card>
                    <CardBody>
                      <div style={{ textAlign: "center", margin: 40 }}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={1} md={1} lg={1}>
                            <FormLabel
                              className={cx(
                                classes.labelHorizontal,
                                classes.currencyLabel
                              )}
                            >
                              Buy
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={2}>
                            <CustomNumberFormat
                              success={this.state.buyState === "success"}
                              error={this.state.buyState === "error"}
                              helpText={
                                this.state.buyState === "error" &&
                                this.state.buyErrorMsg[0]
                              }
                              disabled={
                                this.state.disableSellBuyAmount ||
                                !this.state.preTradeView
                              }
                              id="ffd_buy"
                              value={this.state.buy}
                              onChange={this.handleChange("amountBought")}
                              formControlProps={{
                                style: { paddingTop: 0 },
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: event => {
                                  this.setState({ buyPristine: false });
                                  this.change(event, "buy", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 25
                                      }
                                    }
                                  ]);
                                  this.handleBuyCurrency(event);
                                },
                                onChange: event => {
                                  if (!this.state.buyPristine) {
                                    this.setState({ buyPristine: false });
                                    this.change(event, "buy", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 25
                                        }
                                      }
                                    ]);
                                    this.onChangeBuyAmount(event);
                                  }
                                }
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={2}>
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu
                                }}
                                disabled={
                                  this.state.disabledSellBuyCurrency === "buy"
                                }
                                value={this.state.buyCurrency}
                                onChange={this.handleBuyCurrency}
                                inputProps={{
                                  name: "buyCurrency",
                                  id: "buyCurrency",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown
                                  }
                                }}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem
                                  }}
                                >
                                  Choose Currency
                                </MenuItem>
                                {currencies.map(item => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
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
                          <GridItem xs={12} sm={12} md={12} lg={2}>
                            <SwapHoriz
                              onClick={() => this.swapCurrencies()}
                              style={{
                                fontSize: 38,
                                backgroundColor: "#40A8BD",
                                color: "white",
                                padding: 3,
                                width: 55
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={1} md={1} lg={1}>
                            <FormLabel
                              className={cx(
                                classes.labelHorizontal,
                                classes.currencyLabel
                              )}
                            >
                              Sell
                            </FormLabel>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={2}>
                            <CustomNumberFormat
                              success={this.state.sellState === "success"}
                              error={this.state.sellState === "error"}
                              helpText={
                                this.state.sellState === "error" &&
                                this.state.sellErrorMsg[0]
                              }
                              disabled={
                                this.state.disableSellBuyAmount ||
                                !this.state.preTradeView
                              }
                              id="ffd_sell"
                              value={this.state.sell}
                              onChange={this.handleChange("amountSold")}
                              formControlProps={{
                                style: { paddingTop: 0 },
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: event => {
                                  this.setState({ sellPristine: false });
                                  this.change(event, "sell", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 25
                                      }
                                    }
                                  ]);
                                  this.handleSellCurrency(event);
                                },
                                onChange: event => {
                                  if (!this.state.sellPristine) {
                                    this.setState({ sellPristine: false });
                                    this.change(event, "sell", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 25
                                        }
                                      }
                                    ]);
                                    this.onChangeSellAmount(event);
                                  }
                                }
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={2}>
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu
                                }}
                                disabled={
                                  this.state.disabledSellBuyCurrency === "sell"
                                }
                                classes={{
                                  select: cx(classes.white)
                                }}
                                value={this.state.sellCurrency}
                                onChange={this.handleSellCurrencyCode}
                                inputProps={{
                                  name: "sellCurrency",
                                  id: "sellCurrency",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown
                                  }
                                }}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem
                                  }}
                                >
                                  Choose Currency
                                </MenuItem>
                                {currencies.map(item => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
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
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div
                              style={{
                                flexBasis: "auto",
                                display: "flex"
                              }}
                            >
                              <GridContainer
                                style={{ margin: "0 auto", maxWidth: 500 }}
                              >
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={6}
                                  style={{ textAlign: "end" }}
                                >
                                  <FormControl fullWidth>
                                    <label style={{ textAlign: "left" }}>
                                      Settlement Date
                                    </label>
                                    <Select
                                      MenuProps={{
                                        className: classes.selectMenu
                                      }}
                                      classes={{
                                        select: cx(
                                          classes.white,
                                          classes.filledSelect
                                        )
                                      }}
                                      disabled={!this.state.preTradeView}
                                      value={this.state.settlementDatePeriod}
                                      onChange={this.handleSettlementDatePeriod}
                                      inputProps={{
                                        name: "settlementDatePeriod",
                                        id: "settlementDatePeriod",
                                        classes: {
                                          icon: classes.white,
                                          root: classes.selectDropDown
                                        }
                                      }}
                                    >
                                      <MenuItem
                                        disabled
                                        classes={{
                                          root: classes.selectMenuItem
                                        }}
                                        value=""
                                      >
                                        Choose Settlement Date
                                      </MenuItem>
                                      {settlementDateOptions.map(item => (
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={item.value}
                                          key={item.value}
                                        >
                                          {item.text}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={6}
                                  style={{
                                    marginTop: 10
                                  }}
                                >
                                  {/* <CustomInput
                                  inputProps={{
                                    value: this.state.valueDate,
                                    disabled: true
                                  }}
                                  id="ffd_valueDate"
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses
                                  }}
                                /> */}
                                  <CustomDateSelector
                                    success={
                                      this.state.valueDateState === "success"
                                    }
                                    error={
                                      this.state.valueDateState === "error"
                                    }
                                    helpText={
                                      this.state.valueDateState === "error" &&
                                      this.state.valueDateErrorMsg[0]
                                    }
                                    id="ffd_valueDate"
                                    inputProps={{
                                      format: "dd MMM yyyy",
                                      label: "",
                                      value: this.state.valueDate,
                                      minDate: this.state.minDate,
                                      shouldDisableDate: this.disableWeekends,
                                      disabled: this.state.valueDateDisable,
                                      onChange: this.handleDateChange,
                                      keyboardbuttonprops: {
                                        "aria-label": "change date"
                                      }
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className: cx(
                                        classes.customDateControlClasses,
                                        classes.customFormControlClasses
                                      )
                                    }}
                                  />
                                </GridItem>
                              </GridContainer>
                            </div>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div
                              style={{
                                flexBasis: "auto",
                                display: "flex",
                                margin: 25,
                                marginBottom: 0
                              }}
                            >
                              <GridContainer style={{ margin: "0 auto" }}>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={6}
                                  lg={6}
                                  style={{ textAlign: "end" }}
                                >
                                  <span style={{ verticalAlign: "sub" }}>
                                    Applicable Exchange Rate
                                  </span>
                                  <span style={{ verticalAlign: "sub" }}>
                                    {this.state.preTrade &&
                                    this.state.preTrade.exchageRate
                                      ? this.state.exhRateSellBuy
                                        ? " ( " +
                                          this.state.sellCurrency +
                                          this.state.buyCurrency +
                                          " )"
                                        : " ( " +
                                          this.state.buyCurrency +
                                          this.state.sellCurrency +
                                          " )"
                                      : ""}
                                  </span>
                                </GridItem>
                                <GridItem xs={8} sm={8} md={4} lg={4}>
                                  <CustomInput
                                    success={
                                      this.state.exchangeRateState === "success"
                                    }
                                    error={
                                      this.state.exchangeRateState === "error"
                                    }
                                    classes={{
                                      input: classes.input,
                                      labelRoot: classes.labelRootInfo,
                                      info: classes.info
                                    }}
                                    inputProps={{
                                      disabled: true,
                                      value:
                                        this.state.preTrade &&
                                        this.state.preTrade.exchageRate
                                          ? this.state.exhRateSellBuy
                                            ? this.state.preTrade.exchageRate.toFixed(
                                                5
                                              )
                                            : (
                                                1 /
                                                this.state.preTrade.exchageRate
                                              ).toFixed(5)
                                          : 0
                                    }}
                                    id="ffd_exchangeRate"
                                    formControlProps={{
                                      style: { paddingTop: 0 },
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: event => {
                                        this.setState({
                                          exchangeRatePristine: false
                                        });
                                        this.change(event, "exchangeRate", [
                                          { type: "required" },
                                          {
                                            type: "length",
                                            params: {
                                              min: 1,
                                              max: 25
                                            }
                                          }
                                        ]);
                                      },
                                      onChange: event => {
                                        if (!this.state.exchangeRatePristine) {
                                          this.setState({
                                            exchangeRatePristine: false
                                          });
                                          this.change(event, "exchangeRate", [
                                            { type: "required" },
                                            {
                                              type: "length",
                                              params: {
                                                min: 1,
                                                max: 25
                                              }
                                            }
                                          ]);
                                        }
                                      }
                                    }}
                                  />
                                </GridItem>
                                <GridItem
                                  xs={4}
                                  sm={4}
                                  md={2}
                                  lg={2}
                                  style={{ marginTop: -10, textAlign: "left" }}
                                >
                                  <IconButton
                                    aria-label="close"
                                    className={classes.closeButton}
                                    onClick={() => {
                                      let exhRate = this.state.exhRateSellBuy;
                                      return this.setState({
                                        exhRateSellBuy: !exhRate
                                      });
                                    }}
                                  >
                                    <img
                                      src={reverseIcon}
                                      style={{ width: 32 }}
                                    />
                                  </IconButton>
                                </GridItem>
                              </GridContainer>
                            </div>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div
                              style={{
                                flexBasis: "auto",
                                display: "flex",
                                margin: 25,
                                marginBottom: 0
                              }}
                            >
                              <GridContainer style={{ margin: "0 auto" }}>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={6}
                                  lg={6}
                                  style={{
                                    textAlign: "end"
                                  }}
                                >
                                  <span style={{ verticalAlign: "sub" }}>
                                    {"FXGuard Fee (in "}
                                  </span>
                                  <span style={{ verticalAlign: "sub" }}>
                                    {(this.state.preTrade &&
                                      this.state.preTrade.feeCurrencyCode) ||
                                      this.state.baseCurrencyCode}
                                  </span>
                                  <span style={{ verticalAlign: "sub" }}>
                                    {")"}
                                  </span>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4} lg={4}>
                                  <CustomInput
                                    success={
                                      this.state.fxguardFeeState === "success"
                                    }
                                    error={
                                      this.state.fxguardFeeState === "error"
                                    }
                                    helpText={
                                      this.state.preTrade &&
                                      this.state.preTrade.feeApplicableText
                                    }
                                    helpLinkText={
                                      this.state.preTrade &&
                                      this.state.preTrade.feeApplicableLinkText
                                    }
                                    helpLink={
                                      this.state.preTrade &&
                                      this.state.preTrade.feeApplicableLink
                                    }
                                    classes={{
                                      input: classes.inputGrey,
                                      labelRoot: cx(classes.labelRootInfo, {
                                        marginLeft: -46
                                      }),
                                      info: classes.info
                                    }}
                                    id="ffd_fxguardFee"
                                    inputProps={{
                                      disabled: true,
                                      value: formatMoney(
                                        this.state.preTrade &&
                                          this.state.preTrade.fee
                                      )
                                    }}
                                    formControlProps={{
                                      style: { paddingTop: 0 },
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses
                                    }}
                                  />
                                </GridItem>
                              </GridContainer>
                            </div>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div
                              style={{
                                flexBasis: "auto",
                                display: "flex",
                                marginTop: 25,
                                marginRight: 25
                              }}
                            >
                              <GridContainer
                                style={{ margin: "0 auto", maxWidth: 500 }}
                              >
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={6}
                                  style={{ textAlign: "end" }}
                                >
                                  <span
                                    style={{
                                      verticalAlign: "sub"
                                    }}
                                  >
                                    Margin Required
                                  </span>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={5}>
                                  <span
                                    style={{
                                      verticalAlign: "sub"
                                    }}
                                  >
                                    {formatMoney(
                                      this.state.preTrade &&
                                        this.state.preTrade.marginAmount
                                    )}{" "}
                                    {this.state.preTrade &&
                                      this.state.preTrade.marginCurrencyCode}
                                  </span>
                                </GridItem>
                              </GridContainer>
                              <GridContainer
                                style={{ margin: "0 auto", maxWidth: 500 }}
                              >
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={6}
                                  style={{ textAlign: "end" }}
                                >
                                  <span
                                    style={{
                                      verticalAlign: "sub"
                                    }}
                                  >
                                    Amount Sold
                                  </span>
                                  <br />
                                  {this.state.preTrade.settlementDate && (
                                    <span
                                      style={{
                                        verticalAlign: "sub"
                                      }}
                                    >
                                      (to pay by:{" "}
                                      {formatDate(
                                        this.state.preTrade.settlementDate
                                      )}
                                      )
                                    </span>
                                  )}
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={5}
                                  style={{ textAlign: "left" }}
                                >
                                  <span
                                    style={{
                                      verticalAlign: "sub"
                                    }}
                                  >
                                    {formatMoney(
                                      this.state.preTrade &&
                                        this.state.preTrade.walletStatus &&
                                        this.state.preTrade.walletStatus
                                          .pendingToPaid
                                    )}{" "}
                                    {this.state.sellCurrency}
                                  </span>
                                </GridItem>
                              </GridContainer>
                            </div>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div
                              style={{
                                flexBasis: "auto",
                                display: "flex",
                                marginTop: 25,
                                marginRight: 25
                              }}
                            >
                              <GridContainer
                                style={{ margin: "0 auto", maxWidth: 500 }}
                              >
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={6}
                                  style={{ textAlign: "end" }}
                                >
                                  <span
                                    style={{
                                      verticalAlign: "sub",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    Total Funds Required Now
                                  </span>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={5}>
                                  <span
                                    style={{
                                      verticalAlign: "sub",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    {formatMoney(
                                      this.state.preTrade &&
                                        this.state.preTrade.walletStatus &&
                                        this.state.preTrade.walletStatus
                                          .requiredForDeal
                                    )}{" "}
                                    {(this.state.preTrade &&
                                      this.state.preTrade.marginCurrencyCode) ||
                                      this.state.sellCurrency}
                                  </span>
                                </GridItem>
                              </GridContainer>
                              <GridContainer
                                style={{ margin: "0 auto", maxWidth: 500 }}
                              >
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={6}
                                  style={{ textAlign: "end" }}
                                >
                                  <span
                                    style={{
                                      verticalAlign: "sub"
                                    }}
                                  >
                                    Amount Bought
                                  </span>
                                  <br />
                                  {this.state.preTrade.settlementDate && (
                                    <span
                                      style={{
                                        verticalAlign: "sub"
                                      }}
                                    >
                                      (to recieve by:{" "}
                                      {formatDate(
                                        this.state.preTrade.settlementDate
                                      )}
                                      )
                                    </span>
                                  )}
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={5}
                                  style={{ textAlign: "left" }}
                                >
                                  <span
                                    style={{
                                      verticalAlign: "sub"
                                    }}
                                  >
                                    {formatMoney(
                                      this.state.preTrade &&
                                        this.state.preTrade.receiveAmount
                                    )}{" "}
                                    {this.state.buyCurrency}
                                  </span>
                                </GridItem>
                              </GridContainer>
                            </div>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={3}>
              <h4>
                <b>Wallet Status</b>
              </h4>
              <StatusCard
                title={"Available on Wallet"}
                sellCurrency={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.currencyCode) ||
                  ""
                }
                cad={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.availableAmount) ||
                  0
                }
              />
              <StatusCard
                title={"Required for deal"}
                sellCurrency={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.currencyCode) ||
                  ""
                }
                cad={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.requiredForDeal) ||
                  0
                }
              />
              <StatusCard
                title={"Remaining after deal"}
                sellCurrency={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.currencyCode) ||
                  ""
                }
                cad={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.remainingAfterDeal) ||
                  0
                }
              />
              {/* <StatusCard
                title={"Amount Sold"}
                sellCurrency={this.state.sellCurrency}
                cad={
                  preTrade &&
                  preTrade.walletStatus &&
                  preTrade.walletStatus.pendingToPaid
                }
                toBePaidBy={preTrade.settlementDate}
              />
              <StatusCard
                title={"Amount Bought"}
                sellCurrency={this.state.buyCurrency}
                cad={preTrade && preTrade.receiveAmount}
                toBeRecievedBy={preTrade.settlementDate}
              /> */}
              {this.state.preTradeView ? (
                <Button
                  size="lg"
                  style={{
                    backgroundColor: primaryColor[5],
                    width: "100%",
                    marginTop: 30
                  }}
                  onClick={() => {
                    this.getPreTrade(
                      this.state.fromLocation === "risk-radar"
                        ? this.state.riskRadarBuySellAction
                        : this.state.currencyMode
                    );
                  }}
                  disabled={
                    this.state.disabledGetQuoteButton ||
                    !(
                      (this.state.sell !== "" && this.state.sell !== 0) ||
                      (this.state.buy !== "" && this.state.buy !== 0)
                    ) ||
                    !this.state.valueDate ||
                    this.state.valueDate === ""
                  }
                >
                  GET QUOTE
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    style={{
                      backgroundColor: primaryColor[5],
                      width: "100%",
                      marginTop: 30
                    }}
                    onClick={() => {
                      this.finalTrade(
                        this.state.fromLocation === "risk-radar"
                          ? this.state.riskRadarBuySellAction
                          : "buy"
                      );
                      this.setState({
                        disabledPaymentButton: true,
                        callInProgress: true
                      });
                    }}
                    disabled={
                      this.state.disabledPaymentButton ||
                      this.state.sell === "" ||
                      this.state.sell === 0
                    }
                  >
                    {this.state.validSeconds === -1
                      ? "PLACE ORDER in 20 seconds"
                      : "PLACE ORDER in " +
                        this.state.validSeconds +
                        " seconds"}
                  </Button>
                  {this.state.viewCancelOption && (
                    <div>
                      <a
                        className={classes.cancelLink}
                        onClick={() => this.cancelTrade()}
                      >
                        Cancel
                      </a>
                    </div>
                  )}
                </>
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
                    <h4 className={classes.modalTitle}>
                      {"FX Forward deal is in progress..."}
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
              )}
            </GridItem>
          </GridContainer>
          {this.state.isNoticeModal && (
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal
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
        <DealExecutedDialog
          showModal={this.state.isDealExecuted}
          trade={this.state.trade}
          dealType={"FxForward"}
          closeModal={this.closeModal}
        />
        <ConfirmationModal
          confirmationModal={this.state.confirmationModal}
          confirmationModalHeader={this.state.confirmationModalHeader}
          confirmationModalMsg={this.state.confirmationModalMsg}
          handleNegativeButton={this.handleNegativeResponse}
          handlePositiveButton={this.handlePositiveResponse}
          positiveButtonText="Yes"
          negativeButtonText="No"
        />
      </>
    ) : (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={7}>
            <h4>
              <b>FX Forward Deals</b>
            </h4>
            <GridItem xs={12} sm={8} lg={12}>
              <Card>
                <CardBody>
                  <CircularProgress />
                </CardBody>
              </Card>
            </GridItem>
          </GridItem>
        </GridContainer>
      </>
    );
  }
}

FxForwardDeals.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object
};

export default withRouter(withStyles(styles)(FxForwardDeals));
