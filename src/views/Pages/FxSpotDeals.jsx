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

// @material-ui/icons
import IconButton from "@material-ui/core/IconButton";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
import reverseIcon from "assets/img/reverse.png";
// import LockOutline from "@material-ui/icons/LockOutline";
import { validate } from "../../utils/Validator";
import { formatDate, formatMoney, parseCurrency } from "../../utils/Utils";

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
import DaySelector from "components/DaySelector/DaySelector.jsx";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
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
    color: "white !important"
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

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class FxSpotDeals extends React.Component {
  error = {
    buyErrorMsg: {
      required: "Buy value is required",
      valid: "Please enter a valid amount"
    },
    sellErrorMsg: {
      required: "Sell value is required",
      range: "Incorporation number should be digits"
    },
    valueDateErrorMsg: {
      required: "Value date is required",
      range: "First name should be 1 to 100 characters"
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
      buyCurrency: "",
      buyCurrencyState: "",
      numberformat: "1320",
      buy: "",
      buyState: "",
      buyPristine: false,
      buyStateErrorMsg: [],
      sell: "",
      sellState: "",
      sellPristine: false,
      sellStateErrorMsg: [],
      sellCurrency: "",
      dates: [],
      selectedDate: null,
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
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: ""
    };

    this.state = this.initialState;
  }

  componentDidMount = () => {
    let viewClient = sessionStorage.getItem("view_as_client");
    let readonly_customer = sessionStorage.getItem("readonly_customer");
    if (viewClient === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg: "You are not authorized to perform the SPOT Deal"
      });
    } else if (readonly_customer === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg:
          "You cannot perform the SPOT Deal. Please contact your Admin"
      });
    }
    this.initialzeData();
  };
  initialzeData = () => {
    let dates = [];
    let i = 0;
    while (dates.length < 5) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() + i);
      if (today.getDay() !== 0 && today.getDay() !== 6) {
        // i.e Not Sunday and Saturday
        dates.push(today);
      }
      i++;
    }
    this.setState({ dates: dates });
    this.getBaseCurrency();
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
          baseCurrencyCode: res.data.baseCurrency,
          sellCurrency: res.data.baseCurrency,
          sellCurrencyState: "success"
        },
        () => {
          this.getAllWallet(res.data.baseCurrency);
          this.getCurrencies(res.data.baseCurrency);
        }
      );
    }
  };
  getAllWallet = async selectedCurrencyCode => {
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
            this.selectWalletForCurrency(res.data, selectedCurrencyCode);
          }
        );
      }
    } else {
      this.selectWalletForCurrency(this.state.wallets, selectedCurrencyCode);
    }
  };
  selectWalletForCurrency = (wallets, selectedCurrencyCode) => {
    if (selectedCurrencyCode) {
      // check if wallet is available for base currency else first wallet
      let selectedWallet =
        wallets &&
        wallets.filter(wallet => {
          return wallet.currencyCode === selectedCurrencyCode;
        });
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

  isValidated = () => {
    if (
      this.state.buyState === "success" &&
      this.state.buyCurrencyState === "success" &&
      this.state.sellState === "success" &&
      this.state.sellCurrencyState === "success" &&
      this.state.settlementDateState === "success" &&
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
      if (this.state.settlementDateState !== "success") {
        this.setState({ settlementDateState: "error" });
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
    let config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    };
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    let selectedCurrency =
      res.data.currrencies &&
      res.data.currrencies.filter(currency => {
        return currency.currencyCode === selectedCurrencyCode;
      });
    let earliestSettlement = new Date(
      new Date(selectedCurrency[0].earliestSettlement).toDateString()
    );
    if (earliestSettlement.getDay() === 0) {
      // For Sunday
      earliestSettlement.setDate(earliestSettlement.getDate() + 1);
    } else if (earliestSettlement.getDay() === 6) {
      // For Saturday
      earliestSettlement.setDate(earliestSettlement.getDate() + 2);
    }
    this.setState({
      currencies: res.data.currrencies
      // selectedDate: earliestSettlement
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
          confirmationModalHeader: "FX SPOT",
          confirmationModalMsg:
            "Your current FX SPOT quotations are expired. Would you like to renew it again?"
        });
        clearInterval(this.state.intervalId);
      } else --timer;
    }, 1000);
    this.setState({ intervalId: intervalId, viewCancelOption: true });
  };
  handleNegativeResponse = () => {
    let preTrade = this.state.preTrade;
    preTrade.exchageRate = 0;
    // Reset the whole data
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      buy: "",
      sell: "",
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
      ((this.state.buy !== "" && this.state.buy.length > 1) ||
        (this.state.sell !== "" && this.state.sell.length > 1))
    ) {
      if (this.state.buyCurrency === this.state.sellCurrency) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: "Please select different Buy & Sell currency type."
        });
      } else {
        this.setState({ currencyMode: currency }, () => {
          // this.trade(currencies, "fx-forrex/fx/preTrade", currency);
          this.preTrade1(this.state.currencies, currency);
        });
      }
    } else {
      this.isValidated();
    }
  };
  preTrade1 = async (currencies, currency = "buy") => {
    const isDealExecuted = false;
    // const url = "/fx-forrex/fx/v2/preTrade";
    // const url = "/fx-forrex/fx/v3/preTrade";

    let settlementDate =
      currencies &&
      currencies.filter(item => item.currencyCode === "EUR")[0]
        .earliestSettlement;

    // Check for Wallet Amount
    let walletAmount =
      this.state.preTrade &&
      this.state.preTrade.walletStatus &&
      this.state.preTrade.walletStatus.availableAmount;

    if (walletAmount && parseCurrency(this.state.sell) > walletAmount) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "FXGuard says: Please top-up wallet by doing deposit or exchange deal from another currency which you have in Wallet"
      });
      return;
    }
    // let selectedDate = this.state.selectedDate;
    let selectedDate = new Date(settlementDate);
    if (selectedDate) {
      var month =
        (selectedDate.getMonth() + 1 < 10 ? "0" : "") +
        (selectedDate.getMonth() + 1);
      var date =
        (selectedDate.getDate() < 10 ? "0" : "") + selectedDate.getDate();
      settlementDate = selectedDate.getFullYear() + "-" + month + "-" + date;
    }
    let preTradeParam = {
      tradeType: "FXSPOT",
      fromCurrencyCode: this.state.sellCurrency,
      toCurrencyCode: this.state.buyCurrency,
      side: currency === "buy" ? "BUY" : "SELL",
      amount:
        currency === "buy"
          ? parseCurrency(this.state.buy)
          : parseCurrency(this.state.sell),
      settlementDate: settlementDate
    };
    clearInterval(this.state.intervalId);
    this.setState({ disabledGetQuoteButton: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.FIND_QUOTE,
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
          "You do not have permission to book FX Spot trade. Please contact your Admin."
      });
    } else if (trade.errorCode === 500) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: "There is a timeout issue. Please try after sometime!"
      });
    } else if (trade.errorCode) {
      if (trade.userDesc.includes("PROVIDER_ABORT")) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "There seems to be a problem currently. Please try again."
        });
      } else if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: trade.userDesc
        });
      }
    } else {
      let resData = {};
      // Start Timer
      this.handleTimer(trade.quoteTimeout);
      resData.preTradeView = false;
      // Update data on screen
      if (currency === "buy") {
        resData.availableAmount = trade.amountBought;
        resData.sell = trade.amountSold;
        resData.isDealExecuted = isDealExecuted;
      } else {
        resData.availableAmount = trade.amountBought;
        resData.buy = trade.amountBought;
        resData.isDealExecuted = isDealExecuted;
      }
      if (isDealExecuted) {
        resData.trade = trade;
        resData.tradePending = false;
      } else {
        resData.tradePending = true;
        // set SettlementDate
        let sd = new Date(trade.settlementDate);
        sd.setHours(0, 0, 0, 0);
        resData.selectedDate = new Date(sd);
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
      this.setState(resData);
    }
  };

  finalTrade = async (currency = "buy") => {
    //let data = {fromCurrencyCode:"USD",toCurrencyCode:"CAD",amount:"1000"};
    const currencies = this.state.currencies;
    // const url = "fx-forrex/fx/v3/trade";

    let isDealExecuted = true;
    let settlementDate =
      currencies &&
      currencies.filter(item => item.currencyCode === "EUR")[0]
        .earliestSettlement;

    // Check for Wallet Amount
    let walletAmount =
      this.state.preTrade &&
      this.state.preTrade.walletStatus &&
      this.state.preTrade.walletStatus.availableAmount;
    if (walletAmount && this.state.sell > walletAmount) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "FXGuard says: Please top-up wallet by doing deposit or exchange deal from another currency which you have in Wallet"
      });
      return;
    }
    let selectedDate = this.state.selectedDate;
    if (selectedDate) {
      var month =
        (selectedDate.getMonth() + 1 < 10 ? "0" : "") +
        (selectedDate.getMonth() + 1);
      var date =
        (selectedDate.getDate() < 10 ? "0" : "") + selectedDate.getDate();
      settlementDate = selectedDate.getFullYear() + "-" + month + "-" + date;
    }
    let tradeParam = {
      quoteRequestId: this.state.preTrade.quoteRequestId
      // tradeType: "FXSPOT",
      // fromCurrencyCode: this.state.sellCurrency,
      // toCurrencyCode: this.state.buyCurrency,
      // buyAmount: parseCurrency(this.state.buy),
      // sellAmount: parseCurrency(this.state.sell),
      // settlementDate: settlementDate,

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

    // console.log("tradeParam - ", tradeParam);
    clearInterval(this.state.intervalId);
    this.setState({ tradePending: false });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.PLACE_TRADE,
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
          "You do not have permission to book FX Spot trade. Please contact your Admin."
      });
    } else if (trade.errorCode === 406) {
      this.setState({
        viewCancelOption: false,
        validSeconds: -1,
        confirmationModal: true,
        confirmationModalHeader: "FX SPOT",
        confirmationModalMsg: trade.userDesc + ". Do you want to get new quote?"
      });
    } else if (trade.errorCode === 412) {
      this.setState({
        viewCancelOption: false,
        validSeconds: -1,
        confirmationModal: true,
        confirmationModalHeader: "FX SPOT",
        confirmationModalMsg: trade.userDesc + ". Do you want to get new quote?"
      });
    } else if (res.data.errorCode === 401) {
      console.log("Unauthorized Access");
      this.props.history.push("/home/logout");
      return;
    } else if (trade.errorCode) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: trade.userDesc
      });
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
        resData.sell = trade.amountSold;
        resData.isDealExecuted = isDealExecuted;
      } else {
        resData.availableAmount = trade.amountBought;
        resData.buy = trade.amountBought;
        resData.isDealExecuted = isDealExecuted;
      }
      if (isDealExecuted) {
        resData.trade = trade;
      }
      // this.getCurrencyConversion(trade);
      this.setState(resData);
    }
  };
  // trade = async (currencies, url, currency = "buy") => {
  //   //let data = {fromCurrencyCode:"USD",toCurrencyCode:"CAD",amount:"1000"};
  //   // let isDealExecuted = url === "fx-forrex/fx/preTrade" ? false : true;
  //   let isDealExecuted = url === "fx-forrex/fx/v2/preTrade" ? false : true;
  //   let settlementDate =
  //     currencies &&
  //     currencies.filter(item => item.currencyCode === "EUR")[0]
  //       .earliestSettlement;

  //   // Check for Wallet Amount
  //   let walletAmount =
  //     this.state.preTrade &&
  //     this.state.preTrade.walletStatus &&
  //     this.state.preTrade.walletStatus.availableAmount;
  //   if (walletAmount && this.state.sell > walletAmount) {
  //     this.setState({
  //       isNoticeModal: true,
  //       noticeModalHeaderMsg: "Error",
  //       noticeModalMsg:
  //         "FXGuard says: Please top-up wallet by doing deposit or exchange deal from another currency which you have in Wallet"
  //     });
  //     return;
  //   }
  //   let selectedDate = this.state.selectedDate;
  //   if (selectedDate) {
  //     var month =
  //       (selectedDate.getMonth() + 1 < 10 ? "0" : "") +
  //       (selectedDate.getMonth() + 1);
  //     var date =
  //       (selectedDate.getDate() < 10 ? "0" : "") + selectedDate.getDate();
  //     settlementDate = selectedDate.getFullYear() + "-" + month + "-" + date;
  //   }
  //   let preTradeParam = {
  //     tradeType: "FXSPOT",
  //     fromCurrencyCode: this.state.sellCurrency,
  //     toCurrencyCode: this.state.buyCurrency,
  //     buyAmount: currency === "buy" ? parseCurrency(this.state.buy) : "0",
  //     sellAmount: currency === "sell" ? parseCurrency(this.state.sell) : "0",
  //     settlementDate: settlementDate
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
  //             "You do not have permission to book FX Spot trade. Please contact your Admin."
  //         });
  //       } else if (trade.errorCode) {
  //         this.setState({
  //           isNoticeModal: true,
  //           noticeModalHeaderMsg: "Error",
  //           noticeModalMsg: trade.userDesc
  //         });
  //       } else {
  //         let resData = {};
  //         if (currency === "buy") {
  //           resData.availableAmount = trade.amountBought;
  //           resData.sell = trade.amountSold;
  //           resData.isDealExecuted = isDealExecuted;
  //         } else {
  //           resData.availableAmount = trade.amountBought;
  //           resData.buy = trade.amountBought;
  //           resData.isDealExecuted = isDealExecuted;
  //         }
  //         if (isDealExecuted) {
  //           resData.trade = trade;
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
  //         this.setState(resData);
  //       }
  //     },
  //     () => {}
  //   );

  //   //return data;
  // };

  getCurrencyConversion = async trade => {
    const {
      availableAmount,
      requiredForDeal,
      pendingToPaid,
      remainingAfterDeal,
      currencyCode
    } = trade && trade.walletStatus;

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
    this.setState({ settlementDatePeriod: event.target.value });
  };

  // handleSelectedDate = value => {
  //   this.setState({ selectedDate: value }, () => {
  //     this.getPreTrade(this.state.currencyMode);
  //   });
  // };
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
    this.setState(
      {
        [event.target.name]: event.target.value,
        [event.target.name + "State"]: "success"
      },
      () => {
        // Reset Sell Currency Amount
      }
    );
  };

  handleSellCurrency = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      // this.getPreTrade("sell");
    });
  };

  handleSellCurrencyCode = event => {
    let selectedWallet =
      this.state.wallets &&
      this.state.wallets.filter(wallet => {
        return wallet.currencyCode === event.target.value;
      });
    if (selectedWallet.length > 0) {
      this.setState(
        {
          [event.target.name]: event.target.value,
          [event.target.name + "State"]: "success"
        },
        () => {
          this.selectWalletForCurrency(this.state.wallets, event.target.value);
          // this.getPreTrade("sell");
        }
      );
    } else {
      // Wallet is not available
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "FXGuard says: You can not book this deal as you do not have enough money in your Sell currency Wallet. Kindly top up this Wallet by depositing funds, or do a Spot deal from a currency where you have the funds in Wallet"
      });
    }
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
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
          this.selectWalletForCurrency(this.state.wallets, buyCurrency);
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
        // Wallet is not available
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "FXGuard says: You can not swap currencies as you do not have enough money in your Buy currency Wallet. Kindly top up this Wallet by depositing funds, or do a Spot deal from a currency where you have the funds in Wallet"
        });
      }
    }
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
                    <b>FX Spot Deal</b>
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
                            {/* <CustomInput
                              success={this.state.buyState === "success"}
                              error={this.state.buyState === "error"}
                              helpText={
                                this.state.buyState === "error" &&
                                this.state.buyErrorMsg[0]
                              }
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    Buy
                                  </InputAdornment>
                                )
                              }}
                              id="fsd_buy"
                              inputProps={{
                                value: this.state.buy,
                                onChange: event =>
                                  this.handleChange("amountBought", event)
                              }}
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
                                    this.handleBuyCurrency(event);
                                  }
                                }
                              }}
                            /> */}
                            <CustomNumberFormat
                              success={this.state.buyState === "success"}
                              error={this.state.buyState === "error"}
                              helpText={
                                (this.state.buyState === "error" &&
                                  this.state.buyErrorMsg &&
                                  this.state.buyErrorMsg[0]) ||
                                ""
                              }
                              value={this.state.buy}
                              onChange={this.handleChange("buy")}
                              disabled={!this.state.preTradeView}
                              id="fsd_buy"
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
                                value={this.state.buyCurrency}
                                onChange={this.handleBuyCurrency}
                                disabled={!this.state.preTradeView}
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
                            {this.state.buyCurrencyState === "error" && (
                              <FormHelperText style={{ color: "red" }}>
                                {"Buy Currency type is required"}
                              </FormHelperText>
                            )}
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
                                (this.state.sellState === "error" &&
                                  this.state.sellErrorMsg &&
                                  this.state.sellErrorMsg[0]) ||
                                ""
                              }
                              id="fsd_sell"
                              value={this.state.sell}
                              onChange={this.handleChange("amountSold")}
                              disabled={!this.state.preTradeView}
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
                                classes={{
                                  select: cx(classes.white)
                                }}
                                value={this.state.sellCurrency}
                                onChange={this.handleSellCurrencyCode}
                                disabled={!this.state.preTradeView}
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
                            {this.state.sellCurrencyState === "error" && (
                              <FormHelperText style={{ color: "red" }}>
                                {"Sell Currency type is required"}
                              </FormHelperText>
                            )}
                          </GridItem>
                          {/* <GridItem xs={12} sm={12} md={12} lg={12}>
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
                                    >
                                      Choose Settlement Date
                                    </MenuItem>
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value="1"
                                    >
                                      6 months
                                    </MenuItem>
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value="2"
                                    >
                                      9 months
                                    </MenuItem>
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
                                <CustomInput
                                  labelText="Value Date"
                                  inputProps={{
                                    value: this.state.preTrade.settlementDate,
                                    disabled: true
                                  }}
                                  id="fsd_valueDate"
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          </div>
                        </GridItem>*/}
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div style={{ flexBasis: "auto", display: "flex" }}>
                              <DaySelector
                                dates={this.state.dates}
                                selectedDate={
                                  this.state.selectedDate ||
                                  new Date(
                                    preTrade.settlementDate + " 00:00:00"
                                  )
                                }
                                // handleSelectedDate={this.handleSelectedDate}
                              />
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
                                    id="fsd_exchangeRate"
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
                                  style={{ textAlign: "end" }}
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
                                <GridItem xs={8} sm={8} md={4} lg={4}>
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
                                      info: classes.info
                                    }}
                                    id="fsd_fxguardFee"
                                    inputProps={{
                                      disabled: true,
                                      value: formatMoney(
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
                          {/* 
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <div
                            style={{
                              flexBasis: "auto",
                              display: "flex",
                              margin: 25,
                              marginBottom: 0
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
                                  {this.state.preTrade.marginAmount} CAD
                                </span>
                              </GridItem>
                            </GridContainer>
                          </div>
                        </GridItem>
                        */}
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <div
                              style={{
                                flexBasis: "auto",
                                display: "flex",
                                margin: 25,
                                marginBottom: 0
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
                                    Total Funds Required
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
                                    {this.state.sellCurrency}
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
                title={"Pending to be paid"}
                sellCurrency={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.currencyCode) ||
                  ""
                }
                cad={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.pendingToPaid) ||
                  0
                }
                toBePaidBy={preTrade.settlementDate}
              />
              <StatusCard
                title={"Remaining after deal"}
                sellCurrency={this.state.sellCurrency || ""}
                cad={
                  (preTrade &&
                    preTrade.walletStatus &&
                    preTrade.walletStatus.remainingAfterDeal) ||
                  0
                }
              />
              {this.state.preTradeView ? (
                <Button
                  size="lg"
                  style={{
                    backgroundColor: primaryColor[5],
                    width: "100%",
                    marginTop: 30
                  }}
                  onClick={() => {
                    this.getPreTrade(this.state.currencyMode);
                  }}
                  disabled={
                    this.state.disabledGetQuoteButton ||
                    !(
                      (this.state.sell !== "" && this.state.sell !== 0) ||
                      (this.state.buy !== "" && this.state.buy !== 0)
                    )
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
                      // this.trade(this.state.currencies, "fx-forrex/fx/trade");
                      this.finalTrade();
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
            </GridItem>
          </GridContainer>
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
                  {"FX SPOT deal is in progress..."}
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
          dealType={"FxSpot"}
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
              <b>FX Spot Deals</b>
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

FxSpotDeals.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(FxSpotDeals));
