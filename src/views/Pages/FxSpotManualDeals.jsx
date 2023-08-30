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
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// @material-ui/icons
import IconButton from "@material-ui/core/IconButton";
import SettingsBackupRestore from "@material-ui/icons/SettingsBackupRestore";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
import { validate } from "../../utils/Validator";
import { formatMoney, parseCurrency } from "../../utils/Utils";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
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
  ...customSelectStyle,
  ...regularFormsStyle
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class FxSpotManualDeals extends React.Component {
  error = {
    buyErrorMsg: {
      required: "Buy value is required",
      valid: "Please enter a valid company name"
    },
    sellErrorMsg: {
      required: "Sell value is required",
      range: "Incorporation number should be digits"
    },
    valueDateErrorMsg: {
      required: "Value date is required",
      range: "Value date should be 1 to 25 characters"
    },
    fxguardFeeErrorMsg: {
      required: "Fee Limit is required",
      range: "Fee Limit percentage value should be between 0 to 100"
    },
    exchangeRateErrorMsg: {
      required: "Exchange Rate value is required"
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
      settlementDate: null,
      currencies: [],
      wallets: [],
      disabledPaymentButton: false,
      callInProgress: false,
      exchangeRate: "",
      exchangeRateState: "",
      exchangeRatePristine: false,
      exchangeRateErrorMsg: [],
      fxguardFee: "",
      fxguardFeeState: "",
      fxguardFeePristine: false,
      fxguardFeeErrorMsg: [],
      preTrade: {
        feeApplicableText: "Fee is applicable as per the plan chosen by client",
        feeApplicableLinkText: "Info here",
        feeApplicableLink: "/auth/manage-account"
      },
      trade: {
        amountSold: 0,
        amountBought: 0,
        fee: 0,
        exchangeRate: 0
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
      isNoticeModal: false,
      noticeModalMsg: "",
      noticeModalHeaderMsg: ""
    };

    this.state = this.initialState;
  }

  componentDidMount = () => {
    this.initialzeData();
  };
  initialzeData = () => {
    let dates = [];
    // for (var i = 0; i < 5; i++) {
    //   let today = new Date();
    //   today.setHours(0, 0, 0, 0);
    //   today.setDate(today.getDate() + i);
    //   if (today.getDay() !== 0 && today.getDay() !== 6) {
    //     // i.e Not Sunday and Saturday
    //     dates.push(today);
    //   }
    // }
    let i = 0;
    while (dates.length < 3) {
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
    //CURRENCIES_BASE
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
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
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc
        });
      }
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
  };
  getAllWallet = async selectedCurrencyCode => {
    if (this.state.wallets.length === 0) {
      // WALLET_FIND
      const res = await apiHandler({
        url: endpoint.WALLET_FIND,
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
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
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
          noticeModalMsg: res.data.userDesc
        });
      }
    } else {
      let selectedCurrency =
        res.data.currrencies &&
        res.data.currrencies.filter(currency => {
          return currency.currencyCode === selectedCurrencyCode;
        });
      let earliestSettlement = new Date(
        new Date(selectedCurrency[0].earliestSettlement).toDateString()
      );
      if (earliestSettlement.getDay() === 0) {
        earliestSettlement.setDate(earliestSettlement.getDate() + 1);
      } else if (earliestSettlement.getDay() === 6) {
        earliestSettlement.setDate(earliestSettlement.getDate() + 2);
      }
      this.setState({
        currencies: res.data.currrencies,
        selectedDate: earliestSettlement
      });
    }
  };

  getPreManualTrade = currency => {
    if (
      this.state.buyCurrency !== "" &&
      this.state.sellCurrency !== "" &&
      this.state.selectedDate !== "" &&
      this.state.exchangeRate !== "" &&
      this.state.exchangeRate != 0 &&
      (this.state.buy !== "" || this.state.sell !== "")
    )
      this.performManualTrade(false, currency);
  };

  performManualTrade = async (isDealExecuted, currency = "buy") => {
    if (this.state.exchangeRate == "" || this.state.exchangeRate == 0) {
      this.setState({
        disabledPaymentButton: false,
        callInProgress: false,
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg: "Exchange Rate cannot be blank or Zero"
      });
      return;
    }
    let url = isDealExecuted
      ? "fx-forrex/fx/manualTrade"
      : "fx-forrex/fx/preManualTrade";

    let settlementDate =
      this.state.currencies &&
      this.state.currencies.filter(item => item.currencyCode === "EUR")[0]
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
    this.setState({
      disabledPaymentButton: true,
      callInProgress: true
    });
    let preTradeParam = {
      tradeType: "FXSPOT",
      fromCurrencyCode: this.state.sellCurrency,
      toCurrencyCode: this.state.buyCurrency,
      buyAmount: parseCurrency(this.state.buy),
      sellAmount: parseCurrency(this.state.sell),
      settlementDate: settlementDate,
      fee: parseCurrency(this.state.fxguardFee),
      exchangeRate: this.state.exchangeRate
    };
    const res = await apiHandler({
      method: "POST",
      url: url,
      data: preTradeParam,
      authToken: sessionStorage.getItem("token")
    });
    const trade = res.data;
    this.setState({ callInProgress: false });
    if (trade.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else if (trade.userDesc.includes("PROVIDER_ABORT")) {
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
    } else {
      let resData = {};
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
      } else {
        resData.preTrade = trade;
        resData.fxguardFee =
          typeof trade.fee != "undefined" ? trade.fee : this.state.fxguardFee;
        resData.preTrade.feeApplicableText = trade.freeSubscriptionPlan
          ? "Fee is applicable as per the plan chosen by client"
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
      this.setState(resData);
    }
  };

  handleSettlementDatePeriod = event => {
    this.setState({ settlementDatePeriod: event.target.value });
  };

  handleSelectedDate = value => {
    this.setState({ selectedDate: value }, () => {
      this.getPreManualTrade("buy");
    });
  };

  handleBuyCurrency = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.getPreManualTrade("buy");
    });
  };

  handleSellCurrency = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.getPreManualTrade("sell");
    });
  };

  handleSellCurrencyCode = event => {
    let selectedWallet =
      this.state.wallets &&
      this.state.wallets.filter(wallet => {
        return wallet.currencyCode === event.target.value;
      });
    if (selectedWallet.length > 0) {
      this.setState({ [event.target.name]: event.target.value }, () => {
        this.selectWalletForCurrency(this.state.wallets, event.target.value);
        this.getPreManualTrade("sell");
      });
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
  swapCurrencies = () => {
    // Check for Wallet in new currency
    let selectedWallet =
      this.state.wallets &&
      this.state.wallets.filter(wallet => {
        return wallet.currencyCode === this.state.buyCurrency;
      });
    if (selectedWallet.length > 0) {
      // Wallet is available
      let buyCurrency = this.state.buyCurrency;
      this.setState(
        {
          buyCurrency: this.state.sellCurrency,
          sellCurrency: buyCurrency
        },
        () => {
          this.selectWalletForCurrency(this.state.wallets, buyCurrency);
        }
      );
    } else {
      // Wallet is not available
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "FXGuard says: You can not swap currencies as you do not have enough money in your Buy currency Wallet. Kindly top up this Wallet by depositing funds, or do a Spot deal from a currency where you have the funds in Wallet"
      });
    }
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  closeModal = () => {
    this.setState({ isDealExecuted: false });
    this.setState(this.initialState);
    this.initialzeData();
  };
  handleNoticeModalClose = () => {
    this.setState({
      disabledPaymentButton: false,
      callInProgress: false,
      isNoticeModal: false,
      noticeModalHeaderMsg: "",
      noticeModalMsg: ""
    });
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
                    <b>FX Spot Manual Deal</b>
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
                              id="fsmd_buy"
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
                                this.state.buyState === "error" &&
                                this.state.buyErrorMsg[0]
                              }
                              value={this.state.buy}
                              onChange={this.handleChange("buy")}
                              id="fsmd_buy"
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
                              id="fsmd_sell"
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
                                    this.handleSellCurrency(event);
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
                            <div style={{ flexBasis: "auto", display: "flex" }}>
                              <DaySelector
                                dates={this.state.dates}
                                selectedDate={
                                  this.state.selectedDate ||
                                  new Date(
                                    this.state.settlementDate + " 00:00:00"
                                  )
                                }
                                handleSelectedDate={this.handleSelectedDate}
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
                                  <CustomNumberFormat
                                    success={
                                      this.state.exchangeRateState === "success"
                                    }
                                    error={
                                      this.state.exchangeRateState === "error"
                                    }
                                    helpText={
                                      "Please input actual exchange rate."
                                    }
                                    classes={{
                                      input: classes.input,
                                      labelRoot: classes.labelRootInfo,
                                      info: classes.info
                                    }}
                                    value={this.state.exchangeRate}
                                    onChange={this.handleChange("exchangeRate")}
                                    id="fsmd_exchangeRate"
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
                                          this.handleSellCurrency(event);
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
                                    <SettingsBackupRestore />
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
                                  md={12}
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
                                <GridItem xs={12} sm={12} md={12} lg={5}>
                                  <CustomNumberFormat
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
                                    value={this.state.fxguardFee}
                                    onChange={event =>
                                      this.handleChange("fxguardFee", event)
                                    }
                                    id="fsmd_fxguardFee"
                                    formControlProps={{
                                      style: { paddingTop: 0 },
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: event => {
                                        this.setState({
                                          fxguardFeePristine: false
                                        });
                                        this.change(event, "fxguardFee", [
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
                                        if (!this.state.fxguardFeePristine) {
                                          this.setState({
                                            fxguardFeePristine: false
                                          });
                                          this.change(event, "fxguardFee", [
                                            { type: "required" },
                                            {
                                              type: "length",
                                              params: {
                                                min: 1,
                                                max: 25
                                              }
                                            }
                                          ]);
                                          // this.handleSellCurrency(event);
                                        }
                                      }
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
                                      preTrade &&
                                        preTrade.walletStatus &&
                                        preTrade.walletStatus.requiredForDeal
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
                sellCurrency={this.state.sellCurrency}
                cad={
                  preTrade &&
                  preTrade.walletStatus &&
                  preTrade.walletStatus.availableAmount
                }
              />
              <StatusCard
                title={"Required for deal"}
                sellCurrency={this.state.sellCurrency}
                cad={
                  preTrade &&
                  preTrade.walletStatus &&
                  preTrade.walletStatus.requiredForDeal
                }
              />
              <StatusCard
                title={"Pending to be paid"}
                sellCurrency={this.state.sellCurrency}
                cad={
                  preTrade &&
                  preTrade.walletStatus &&
                  preTrade.walletStatus.pendingToPaid
                }
                toBePaidBy={this.state.settlementDate}
              />
              <StatusCard
                title={"Remaining after deal"}
                sellCurrency={this.state.sellCurrency}
                cad={
                  preTrade &&
                  preTrade.walletStatus &&
                  preTrade.walletStatus.remainingAfterDeal
                }
              />
              {this.state.callInProgress ? (
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
              ) : (
                <Button
                  size="lg"
                  style={{
                    backgroundColor: primaryColor[5],
                    width: "100%",
                    marginTop: 30
                  }}
                  onClick={() => {
                    this.performManualTrade(true);
                  }}
                  disabled={
                    this.state.disabledPaymentButton ||
                    this.state.sell === "" ||
                    this.state.sell === 0
                  }
                >
                  PLACE ORDER
                </Button>
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
          dealType={"FxSpot"}
          closeModal={this.closeModal}
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

FxSpotManualDeals.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(FxSpotManualDeals));
