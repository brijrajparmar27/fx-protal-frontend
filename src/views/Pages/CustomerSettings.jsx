import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";

import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import NoticeModal from "views/Components/NoticeModal.jsx";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";

import { validate } from "../../utils/Validator";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import {
  container,
  cardTitle,
  whiteColor,
  grayColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

const styles = theme => ({
  currencyLabel: {
    paddingTop: "7px !important",
    float: "left"
  },
  filledSelect: {
    backgroundColor: "grey",
    color: "white !important"
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white"
  },
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  inputUpload: {
    display: "none"
  },
  header: {
    fontSize: 18,
    textAlign: "left",
    marginTop: 30,
    marginBottom: 10
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  // cardTitle: {
  //   ...cardTitle,
  //   color: whiteColor
  // },
  modalTitle: {
    textAlign: "left",
    fontSize: 20
  },
  subTitle: {
    fontWeight: 400,
    fontSize: "16px",
    float: "left",
    paddingBottom: 20
  },
  center: {
    textAlign: "center",
    margin: 20,
    marginTop: 40
  },
  cardTitle: {
    ...cardTitle,
    marginTop: "0",
    marginBottom: "3px",
    color: grayColor[2],
    fontSize: "18px"
  },
  cardHeader: {
    zIndex: "3",
    marginBottom: "20px"
  },
  cardSubtitle: {
    color: grayColor[0],
    fontSize: "14px",
    margin: "0 0 10px"
  },
  textCenter: {
    textAlign: "center"
  },
  justifyContentCenter: {
    justifyContent: "center !important"
  },
  customButtonClass: {
    "&,&:focus,&:hover": {
      color: whiteColor
    },
    marginLeft: "5px",
    marginRight: "5px"
  },
  inputAdornment: {
    marginRight: "18px"
  },
  inputAdornmentIcon: {
    color: grayColor[6]
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  socialLine: {
    padding: "0.9375rem 0"
  },
  textLeft: {
    textAlgin: "left",
    float: "left"
  },
  uploadLabel: {
    alignSelf: "center",
    paddingRight: 20
  },
  uploadContainer: {
    display: "flex"
  },
  rootChip: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: "rgb(223,166,50)",
    borderRadius: 0,
    color: "white",
    fontWeight: 600
  },
  ...modalStyle(theme)
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class CustomerSettings extends React.Component {
  error = {
    fxMarginLimitErrorMsg: {
      required: "Margin Limit is required",
      range: "Margin Limit percentage value should be between 0 to 100"
    },
    feeLimitErrorMsg: {
      required: "Fee Limit is required",
      range: "Fee Limit percentage value should be between 0 to 100"
    },
    fxPaymentLimitErrorMsg: {
      required: "Fx PAYMENT Limit is required",
      range: "Fx PAYMENT Limit should be 1 to 100 characters"
    },
    bankNameErrorMsg: {
      required: "Date of birth is required"
    },
    addressErrorMsg: {
      required: "Address is required"
    },
    cityErrorMsg: {
      required: "City is required"
    },
    postalCodeErrorMsg: {
      required: "Postal code is required"
    },
    riskLevelErrorMsg: {
      required: "Risk Level is required"
    },
    exchangeRateChangeBelow6MonthErrorMsg: {
      required: "Trade Margin Limit for Less than 6 months is required",
      range: "Trade Margin Limit percentage value should be between 0 to 20"
    },
    exchangeRateChangeAbove6MonthErrorMsg: {
      required: "Trade Margin Limit for More than 6 months is required",
      range: "Trade Margin Limit percentage value should be between 0 to 20"
    }
  };

  initialState = {
    isDirty: false,
    subscriptionPlanId: "",
    subscriptionPlanName: "",
    tradeLimit: "",
    tradeLimitCurrencyCode: "",
    fxPaymentLimitCurrencyCode: "",
    currencyCode: "",
    fxPaymentLimit: "",
    fxPaymentLimitState: "success",
    fxPaymentLimitPristine: true,
    fxPaymentLimitErrorMsg: [],
    fxMarginLimit: "",
    fxMarginLimitState: "success",
    fxMarginLimitPristine: true,
    fxMarginLimitErrorMsg: [],
    feeLimit: "",
    feeLimitState: "success",
    feeLimitPristine: true,
    feeLimitErrorMsg: [],
    alertCountryList: [],
    noOfPaymentFrequency: "",
    paymentFrequencyDays: "",
    paymentAlertDuration: "",
    paymentPerTxnLimit: "",
    paymentPerTxnLimitCurrencyCode: "",
    countryCode: "",
    countries: [],
    currencies: [
      { currencyCode: "INR", earliestSettlement: "2020-05-10" },
      { currencyCode: "GBP", earliestSettlement: "2020-05-10" },
      { currencyCode: "USD", earliestSettlement: "2020-05-10" },
      { currencyCode: "EUR", earliestSettlement: "2020-05-10" },
      { currencyCode: "CAD", earliestSettlement: "2020-05-10" }
    ],
    durations: ["Days", "weeks", "Months"],
    riskLevel: "",
    riskLevelState: "",
    riskLevelPristine: true,
    riskLevelErrorMsg: [],
    RiskLevelList: ["LOW", "MEDIUM", "HIGH"],

    confirmationModal: false,
    confirmationModalHeader: "",
    confirmationModalMsg: "",
    checkedA: true,
    cardAnimaton: "cardHidden",
    showModal: false,
    marginNotRequired: false,
    exchangeRateChangeBelow6Month: "",
    exchangeRateChangeBelow6MonthState: "success",
    exchangeRateChangeBelow6MonthPristine: true,
    exchangeRateChangeBelow6MonthErrorMsg: [],
    exchangeRateChangeAbove6Month: "",
    exchangeRateChangeAbove6MonthState: "success",
    exchangeRateChangeAbove6MonthPristine: true,
    exchangeRateChangeAbove6MonthErrorMsg: [],
    noticeModal: false,
    noticeModalHeader: "",
    noticeModalErrMsg: ""
  };

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered

    this.state = this.initialState;
  }

  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
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
  isAnyParamChanged = () => {
    if (
      this.state.subscriptionPlanId ===
        this.props.settings.subscriptionPlanId &&
      this.state.fxPaymentLimit === this.props.settings.fxPaymentLimit &&
      this.state.fxMarginLimit === this.props.settings.fxMarginLimit &&
      this.state.feeLimit === this.props.settings.feeLimit &&
      this.state.tradeLimitCurrencyCode ===
        this.props.settings.tradeLimitCurrencyCode &&
      this.state.fxPaymentLimitCurrencyCode ===
        this.props.settings.fxPaymentLimitCurrencyCode &&
      this.state.paymentPerTxnLimitCurrencyCode ===
        this.props.settings.paymentPerTxnLimitCurrencyCode &&
      this.state.alertCountryList === this.props.settings.alertCountryList &&
      this.state.noOfPaymentFrequency ===
        this.props.settings.noOfPaymentFrequency &&
      this.state.paymentFrequencyDays ===
        this.props.settings.paymentFrequencyDays &&
      this.state.paymentPerTxnLimit ===
        this.props.settings.paymentPerTxnLimit &&
      this.state.marginNotRequired === this.props.settings.marginNotRequired &&
      this.state.exchangeRateChangeBelow6Month ===
        this.props.settings.exchangeRateChangeBelow6Month &&
      this.state.exchangeRateChangeAbove6Month ===
        this.props.settings.exchangeRateChangeAbove6Month &&
      this.state.riskLevel === this.props.settings.riskLevel
    )
      return false;
    else return true;
  };
  isValidated = () => {
    if (
      this.state.fxPaymentLimitState === "success" &&
      this.state.fxMarginLimitState === "success" &&
      this.state.feeLimitState === "success"
    ) {
      if (this.state.marginNotRequired) {
        if (
          this.state.exchangeRateChangeBelow6MonthState === "success" &&
          this.state.exchangeRateChangeAbove6MonthState === "success"
        ) {
          return true;
        } else {
          if (this.state.exchangeRateChangeBelow6MonthState !== "success") {
            this.setState({ exchangeRateChangeBelow6MonthState: "error" });
          }
          if (this.state.exchangeRateChangeAbove6MonthState !== "success") {
            this.setState({ exchangeRateChangeAbove6MonthState: "error" });
          }
          return false;
        }
      }
      return true;
    } else {
      if (this.state.fxPaymentLimitState !== "success") {
        this.setState({ fxPaymentLimitState: "error" });
      }
      if (this.state.fxMarginLimitState !== "success") {
        this.setState({ fxMarginLimitState: "error" });
      }
      if (this.state.feeLimitState !== "success") {
        this.setState({ feeLimitState: "error" });
      }
    }
    return false;
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose() {
    // var x = [];
    // x[modal] = false;
    this.initalizeState();
    this.props.handleClose();
  }
  handleRiskLevel = event => {
    const value = event.target.value;
    this.setState(
      validate(
        value,
        "riskLevel",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };
  handleNegativeResponse = () => {
    this.setState({
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      confirmationModal: false
    });
  };
  handlePositiveResponse = () => {
    this.handleNegativeResponse();
    let paymentFrequencyDays = this.state.paymentFrequencyDays;
    switch (this.state.paymentAlertDuration) {
      case "weeks":
        paymentFrequencyDays = paymentFrequencyDays * 7;
        break;
      case "Months":
        paymentFrequencyDays = paymentFrequencyDays * 30;
        break;
      default:
        break;
    }

    this.props.updateSettings({
      subscriptionPlanId: this.state.subscriptionPlanId,
      fxPaymentLimit: this.state.fxPaymentLimit,
      fxMarginLimit: this.state.fxMarginLimit,
      feeLimit: this.state.feeLimit,
      // currencyCode: this.state.currencyCode,
      tradeLimitCurrencyCode: this.state.tradeLimitCurrencyCode,
      fxPaymentLimitCurrencyCode: this.state.fxPaymentLimitCurrencyCode,
      paymentPerTxnLimitCurrencyCode: this.state.paymentPerTxnLimitCurrencyCode,
      alertCountryList: this.state.alertCountryList,
      noOfPaymentFrequency: this.state.noOfPaymentFrequency,
      paymentFrequencyDays: paymentFrequencyDays,
      paymentPerTxnLimit: this.state.paymentPerTxnLimit,
      riskLevel: this.state.riskLevel ? this.state.riskLevel : null,
      marginNotRequired: this.state.marginNotRequired,
      exchangeRateChangeBelow6Month: this.state.marginNotRequired
        ? this.state.exchangeRateChangeBelow6Month
        : 0,
      exchangeRateChangeAbove6Month: this.state.marginNotRequired
        ? this.state.exchangeRateChangeAbove6Month
        : 0
    });
    this.initalizeState();
    this.props.handleClose();
  };
  updateSettings = () => {
    if (this.isValidated()) {
      if (this.isAnyParamChanged()) {
        this.setState({
          confirmationModalHeader: "SETTINGS",
          confirmationModalMsg: "Are you sure you want to save new settings?",
          confirmationModal: true
        });
      } else {
        this.initalizeState();
        this.props.handleClose();
      }
    }
  };

  componentDidMount() {
    // const { editBeneficiary } = this.props;
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.initalizeState();
  }
  initalizeState = () => {
    this.setState(this.initialState);
    this.getCountries();
    // this.getCurrencies();
  };

  getCountries = async () => {
    const res = await apiHandler({
      url: endpoint.COUNTRIES,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      const countries = res.data.countryMetaData;
      this.setState({ countries: countries });
    }
  };

  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.setState({
        currencies: res.data.currrencies
      });
    }
  };
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let settings = {};
      if (props.showModal) {
        settings = CustomerSettings.initialState;
        if (props.showEditSettings) {
          settings = { ...settings, ...props.settings };
        }
      }

      return {
        showModal: props.showModal,
        ...settings
      };
    }
    return null;
  }

  handlecurrencyCode = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  handlePaymentAlertDuration = event => {
    this.setState({
      paymentAlertDuration: event.target.value
    });
  };
  handleCountryAlertChange = event => {
    let alertCountry = this.state.alertCountryList;
    if (alertCountry.indexOf(event.target.value) === -1) {
      alertCountry.push(event.target.value);

      this.setState({
        countryCode: event.target.value,
        alertCountryList: alertCountry
      });
    }
  };
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  handleDeleteCountryAlert = chipToDelete => () => {
    let alertCountry = this.state.alertCountryList.filter(
      chip => chip !== chipToDelete
    );
    this.setState({
      alertCountryList: alertCountry
    });
  };
  //   handleChecked = name => event => {
  //     this.setState({ [name]: event.target.checked });
  //   };
  //   componentWillUnmount() {
  //     clearTimeout(this.timeOutFunction);
  //     this.timeOutFunction = null;
  //     this.initalizeState();
  //   }
  handleToggle = event => {
    this.setState({
      marginNotRequired: event.target.checked
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={cx(classes.container)}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot
          }}
          maxWidth="md"
          open={this.state.showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
            style={{ textAlign: "left" }}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.handleClose()}
            >
              <CloseIcon />
            </IconButton>
            <h3 style={{ textAlign: "left", fontSize: 20, display: "inline" }}>
              SETTINGS
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <form className={classes.form}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <GridContainer justify="center">
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginBottom: 40 }}
                    >
                      <h4>
                        <b>Customer Limits</b>
                      </h4>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <FormLabel className={cx(classes.currencyLabel)}>
                        Plan Name
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <CustomInput
                        inputProps={{
                          value: this.state.subscriptionPlanName,
                          disabled: true,
                          onChange: event =>
                            this.handleChange("subscriptionPlanName", event)
                        }}
                        id="cs_subscriptionPlanName"
                        formControlProps={{
                          style: { paddingTop: 0 },
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={5} lg={5}>
                      <FormLabel className={cx(classes.currencyLabel)}>
                        FX Trade Limit
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={4} sm={4} md={3} lg={3}>
                      <FormControl fullWidth className={classes.filledSelect}>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.tradeLimitCurrencyCode}
                          onChange={event =>
                            this.handlecurrencyCode(
                              "tradeLimitCurrencyCode",
                              event
                            )
                          }
                          inputProps={{
                            name: "tradeLimitCurrencyCode",
                            id: "tradeLimitCurrencyCode",
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
                            Choose FX Spot Currency
                          </MenuItem>
                          {this.state.currencies &&
                            this.state.currencies.map(item => (
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
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomNumberFormat
                        value={this.state.tradeLimit}
                        disabled
                        onChange={event =>
                          this.handleChange("tradeLimit", event)
                        }
                        id="cs_tradeLimit"
                        formControlProps={{
                          style: { paddingTop: 0 },
                          fullWidth: true
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={5} lg={5}>
                      <FormLabel className={cx(classes.currencyLabel)}>
                        Payment Limit
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={4} sm={4} md={3} lg={3}>
                      <FormControl fullWidth className={classes.filledSelect}>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.fxPaymentLimitCurrencyCode}
                          onChange={event =>
                            this.handlecurrencyCode(
                              "fxPaymentLimitCurrencyCode",
                              event
                            )
                          }
                          inputProps={{
                            name: "fxPaymentLimitCurrencyCode",
                            id: "fxPaymentLimitCurrencyCode",
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
                            Choose Payments Currency
                          </MenuItem>
                          {this.state.currencies &&
                            this.state.currencies.map(item => (
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
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomNumberFormat
                        success={this.state.fxPaymentLimitState === "success"}
                        error={this.state.fxPaymentLimitState === "error"}
                        helpText={
                          this.state.fxPaymentLimitState === "error" &&
                          this.state.fxPaymentLimitErrorMsg[0]
                        }
                        value={this.state.fxPaymentLimit}
                        onChange={event =>
                          this.handleChange("fxPaymentLimit", event)
                        }
                        id="cs_fxPaymentLimit"
                        formControlProps={{
                          style: { paddingTop: 0 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              fxPaymentLimitPristine: false
                            });
                            this.change(event, "fxPaymentLimit", [
                              { type: "required" },
                              {
                                type: "length",
                                params: {
                                  min: 1,
                                  max: 100
                                }
                              }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.fxPaymentLimitPristine) {
                              this.setState({
                                fxPaymentLimitPristine: false
                              });
                              this.change(event, "fxPaymentLimit", [
                                { type: "required" },
                                {
                                  type: "length",
                                  params: {
                                    min: 1,
                                    max: 100
                                  }
                                }
                              ]);
                              // this.handlefxPaymentLimitCurrency(event);
                            }
                          }
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8} lg={8}>
                      <FormLabel className={cx(classes.currencyLabel)}>
                        Margins Limit (for Bought Currency)
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomNumberFormat
                        success={this.state.fxMarginLimitState === "success"}
                        error={this.state.fxMarginLimitState === "error"}
                        helpText={
                          this.state.fxMarginLimitState === "error" &&
                          this.state.fxMarginLimitErrorMsg[0]
                        }
                        value={this.state.fxMarginLimit}
                        onChange={event =>
                          this.handleChange("fxMarginLimit", event)
                        }
                        id="cs_fxMarginLimit"
                        suffix="%"
                        formControlProps={{
                          style: { paddingTop: 0 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              fxMarginLimitPristine: false
                            });
                            this.changePercentage(event, "fxMarginLimit", [
                              { type: "required" },
                              {
                                type: "range",
                                params: {
                                  min: 0,
                                  max: 100
                                }
                              }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.fxMarginLimitPristine) {
                              this.setState({
                                fxMarginLimitPristine: false
                              });
                              this.changePercentage(event, "fxMarginLimit", [
                                { type: "required" },
                                {
                                  type: "range",
                                  params: {
                                    min: 0,
                                    max: 100
                                  }
                                }
                              ]);
                              // this.handlefxMarginLimitCurrency(event);
                            }
                          }
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8} lg={8}>
                      <FormLabel className={cx(classes.currencyLabel)}>
                        Fee Limit (for FREE PLAN)
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomNumberFormat
                        success={this.state.feeLimitState === "success"}
                        error={this.state.feeLimitState === "error"}
                        helpText={
                          this.state.feeLimitState === "error" &&
                          this.state.feeLimitErrorMsg[0]
                        }
                        value={this.state.feeLimit}
                        disabled
                        onChange={event => this.handleChange("feeLimit", event)}
                        id="cs_feeLimit"
                        suffix="%"
                        formControlProps={{
                          style: { paddingTop: 0 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              feeLimitPristine: false
                            });
                            this.changePercentage(event, "feeLimit", [
                              { type: "required" },
                              {
                                type: "range",
                                params: {
                                  min: 0,
                                  max: 100
                                }
                              }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.feeLimitPristine) {
                              this.setState({
                                feeLimitPristine: false
                              });
                              this.changePercentage(event, "feeLimit", [
                                { type: "required" },
                                {
                                  type: "range",
                                  params: {
                                    min: 0,
                                    max: 100
                                  }
                                }
                              ]);
                              // this.handlefeeLimitCurrency(event);
                            }
                          }
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8} lg={8}>
                      <FormLabel className={cx(classes.currencyLabel)}>
                        Risk Level
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <FormControl fullWidth className={classes.filledSelect}>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.riskLevel}
                          onChange={this.handleRiskLevel}
                          inputProps={{
                            name: "riskLevel",
                            id: "riskLevel",
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"riskLevelText"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Risk Level
                          </MenuItem>
                          {this.state.RiskLevelList.map(item => (
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={item}
                              key={item}
                            >
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={8}
                      lg={8}
                      style={{ marginTop: 27, textAlign: "left" }}
                    >
                      <FormLabel className={cx(classes.currencyLabel)}>
                        Enable Customer to trade without Margin on Forward Deals
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <FormControlLabel
                        className={this.props.classes.center}
                        classes={{
                          root: this.props.classes.checkboxLabelControl,
                          label: this.props.classes.checkboxLabel
                        }}
                        control={
                          <Switch
                            color="primary"
                            tabIndex={-1}
                            id={"checkbox_marginNotRequired"}
                            onChange={this.handleToggle}
                            checked={this.state.marginNotRequired}
                          />
                        }
                        label={<div />}
                      />
                    </GridItem>
                    {this.state.marginNotRequired && (
                      <>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <FormLabel className={cx(classes.currencyLabel)}>
                            Credit Margin chargeable:
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={8} lg={8}>
                          <FormLabel className={cx(classes.currencyLabel)}>
                            Up to 6 months
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomNumberFormat
                            success={
                              this.state.exchangeRateChangeBelow6MonthState ===
                              "success"
                            }
                            error={
                              this.state.exchangeRateChangeBelow6MonthState ===
                              "error"
                            }
                            helpText={
                              this.state.exchangeRateChangeBelow6MonthState ===
                                "error" &&
                              this.state
                                .exchangeRateChangeBelow6MonthErrorMsg[0]
                            }
                            value={this.state.exchangeRateChangeBelow6Month}
                            onChange={event =>
                              this.handleChange(
                                "exchangeRateChangeBelow6Month",
                                event
                              )
                            }
                            id="cs_exchangeRateChangeBelow6Month"
                            suffix="%"
                            formControlProps={{
                              style: { paddingTop: 0 },
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({
                                  exchangeRateChangeBelow6MonthPristine: false
                                });
                                this.changePercentage(
                                  event,
                                  "exchangeRateChangeBelow6Month",
                                  [
                                    { type: "required" },
                                    {
                                      type: "range",
                                      params: {
                                        min: 0,
                                        max: 20
                                      }
                                    }
                                  ]
                                );
                              },
                              onChange: event => {
                                if (
                                  !this.state
                                    .exchangeRateChangeBelow6MonthPristine
                                ) {
                                  this.setState({
                                    exchangeRateChangeBelow6MonthPristine: false
                                  });
                                  this.changePercentage(
                                    event,
                                    "exchangeRateChangeBelow6Month",
                                    [
                                      { type: "required" },
                                      {
                                        type: "range",
                                        params: {
                                          min: 0,
                                          max: 20
                                        }
                                      }
                                    ]
                                  );
                                }
                              }
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={8} lg={8}>
                          <FormLabel className={cx(classes.currencyLabel)}>
                            Longer than 6 months
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomNumberFormat
                            success={
                              this.state.exchangeRateChangeAbove6MonthState ===
                              "success"
                            }
                            error={
                              this.state.exchangeRateChangeAbove6MonthState ===
                              "error"
                            }
                            helpText={
                              this.state.exchangeRateChangeAbove6MonthState ===
                                "error" &&
                              this.state
                                .exchangeRateChangeAbove6MonthErrorMsg[0]
                            }
                            value={this.state.exchangeRateChangeAbove6Month}
                            onChange={event =>
                              this.handleChange(
                                "exchangeRateChangeAbove6Month",
                                event
                              )
                            }
                            id="cs_exchangeRateChangeAbove6Month"
                            suffix="%"
                            formControlProps={{
                              style: { paddingTop: 0 },
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({
                                  exchangeRateChangeAbove6MonthPristine: false
                                });
                                this.changePercentage(
                                  event,
                                  "exchangeRateChangeAbove6Month",
                                  [
                                    { type: "required" },
                                    {
                                      type: "range",
                                      params: {
                                        min: 0,
                                        max: 20
                                      }
                                    }
                                  ]
                                );
                              },
                              onChange: event => {
                                if (
                                  !this.state
                                    .exchangeRateChangeAbove6MonthPristine
                                ) {
                                  this.setState({
                                    exchangeRateChangeAbove6MonthPristine: false
                                  });
                                  this.changePercentage(
                                    event,
                                    "exchangeRateChangeAbove6Month",
                                    [
                                      { type: "required" },
                                      {
                                        type: "range",
                                        params: {
                                          min: 0,
                                          max: 20
                                        }
                                      }
                                    ]
                                  );
                                }
                              }
                            }}
                          />
                        </GridItem>
                      </>
                    )}
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <h4>
                        <b>Transaction Monitoring Limits</b>
                      </h4>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={classes.header}
                    >
                      <span>Country Alert</span>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <FormControl fullWidth className={classes.filledSelect}>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.countryCode}
                          onChange={this.handleCountryAlertChange}
                          inputProps={{
                            name: "countriesAlerts",
                            id: "countriesAlerts",
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
                            Choose Country
                          </MenuItem>
                          {this.state.countries &&
                            this.state.countries.map(item => (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={item.countryCode}
                                key={item.countryCode}
                              >
                                {item.countryCode} - {item.countryName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <Paper component="ul" className={classes.rootChip}>
                        {this.state.alertCountryList.map((data, index) => {
                          return (
                            <li key={index}>
                              <Chip
                                label={data}
                                deleteIcon={<CloseIcon />}
                                onDelete={this.handleDeleteCountryAlert(data)}
                                className={classes.chip}
                              />
                            </li>
                          );
                        })}
                      </Paper>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={classes.header}
                    >
                      <span>Payment Frequency Alert</span>
                    </GridItem>
                    {/* <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginBottom: 15 }}
                    >
                      <FormLabel className={cx(classes.currencyLabel)}>
                        <b>Payment Frequency Alert</b>
                      </FormLabel>
                    </GridItem> */}
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer justify="center">
                        <GridItem xs={4} sm={4} md={2} lg={2}>
                          <CustomNumberFormat
                            value={this.state.noOfPaymentFrequency}
                            onChange={event =>
                              this.handleChange("noOfPaymentFrequency", event)
                            }
                            id="cs_noOfPaymentFrequency"
                            formControlProps={{
                              style: { paddingTop: 0 },
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={8} sm={8} md={4} lg={4}>
                          <FormLabel className={cx(classes.currencyLabel)}>
                            payments in
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={4} sm={4} md={2} lg={2}>
                          <CustomNumberFormat
                            value={this.state.paymentFrequencyDays}
                            onChange={event =>
                              this.handleChange("paymentFrequencyDays", event)
                            }
                            id="cs_paymentFrequencyDays"
                            formControlProps={{
                              style: { paddingTop: 0 },
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={8} sm={8} md={4} lg={4}>
                          <FormControl
                            fullWidth
                            className={classes.filledSelect}
                          >
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              value={this.state.paymentAlertDuration}
                              onChange={this.handlePaymentAlertDuration}
                              inputProps={{
                                name: "paymentAlertDuration",
                                id: "paymentAlertDuration",
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
                                Choose Duration
                              </MenuItem>
                              {this.state.durations &&
                                this.state.durations.map(item => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value={item}
                                    key={item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={classes.header}
                    >
                      <span>Payment Amount Alert</span>
                    </GridItem>
                    {/* <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginBottom: 15 }}
                    >
                      <FormLabel className={cx(classes.currencyLabel)}>
                        <b>Payment Amount Alert</b>
                      </FormLabel>
                    </GridItem> */}
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer justify="left">
                        <GridItem xs={12} sm={12} md={5} lg={5}>
                          <FormLabel className={cx(classes.currencyLabel)}>
                            Single Payment larger than should be alerted
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={4} sm={4} md={4} lg={4}>
                          <CustomNumberFormat
                            value={this.state.paymentPerTxnLimit}
                            onChange={event =>
                              this.handleChange("paymentPerTxnLimit", event)
                            }
                            id="cs_paymentPerTxnLimit"
                            formControlProps={{
                              style: { paddingTop: 0 },
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={8} sm={8} md={3} lg={3}>
                          <FormControl
                            fullWidth
                            className={classes.filledSelect}
                          >
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              value={this.state.paymentPerTxnLimitCurrencyCode}
                              onChange={event =>
                                this.handlecurrencyCode(
                                  "paymentPerTxnLimitCurrencyCode",
                                  event
                                )
                              }
                              inputProps={{
                                name: "paymentPerTxnLimitCurrencyCode",
                                id: "paymentPerTxnLimitCurrencyCode",
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
                              {this.state.currencies &&
                                this.state.currencies.map(item => (
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
                        {/* <GridItem xs={12} sm={12} md={5} lg={5}>
                          <FormLabel className={cx(classes.currencyLabel)}></FormLabel>
                        </GridItem> */}
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div
                    className={classes.center}
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      round={false}
                      size="lg"
                      style={{
                        fontSize: 20,
                        borderRadius: 10,
                        backgroundColor: "#95c440"
                      }}
                      onClick={this.updateSettings}
                      disabled={!this.state.subscriptionPlanId}
                    >
                      PROCEED TO SAVE SETTINGS
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
        {this.state.confirmationModal && (
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeResponse}
            handlePositiveButton={this.handlePositiveResponse}
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

CustomerSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  settings: PropTypes.object,
  showEditSettings: PropTypes.bool,
  updateSettings: PropTypes.func
};

export default withRouter(withStyles(styles)(CustomerSettings));
