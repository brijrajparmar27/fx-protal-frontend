import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CloseIcon from "@material-ui/icons/Close";
import cx from "classnames";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import PlanVolume from "views/Components/PlanVolume.jsx";

import { validate } from "../../utils/Validator";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import {
  container,
  cardTitle,
  successColor,
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
  volumesBox: {
    fontSize: 16,
    height: 100,
    backgroundColor: "#efefef",
    boxShadow: "6px 11px 8px 0px rgba(0, 0, 0, 0.14)",
    marginTop: 15,
    marginBottom: 15
  },
  gridIcon: {
    textAlign: "right",
    zIndex: "5",
    padding: "0px 0px !important"
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
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  addIcon: {
    marginTop: 25,
    height: 35,
    width: 35,
    borderRadius: 6,
    backgroundColor: "grey"
  },
  ...modalStyle(theme)
});

class CommonSettings extends React.Component {
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
      range: "Fx PAYMENT Limit should be 1 to 25 characters"
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
    }
  };

  initialState = {
    settings: {},
    planInformation: {},
    VolumeInformation: [],
    clientEdit: false,

    alertCountryList: [],
    feeLimit: "",
    fxMarginLimit: "",
    fxPaymentLimit: "",
    fxPaymentLimitCurrencyCode: "",
    noOfPaymentFrequency: "",
    paymentFrequencyDays: "",
    paymentAlertDuration: "Days",
    paymentPerTxnLimit: "",
    paymentPerTxnLimitCurrencyCode: "",
    planExpired: false,
    showAddPlanVolume: false,
    showEditPlanVolume: false,
    selectedPlanVolume: null,
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
    callInProgress: false,
    noticeModal: false,
    noticeModalHeader: "",
    noticeModalErrMsg: ""
  };

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered

    this.state = this.initialState;
  }
  componentDidMount() {
    this.initalizeState();
  }
  initalizeState = () => {
    this.setState(this.initialState);
    this.getCountries();
    // this.getCurrencies();
    this.getCommonSettings();
    this.getPlanInformation();
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
          callInProgress: false,
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
          callInProgress: false,
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
  getCommonSettings = async () => {
    const res = await apiHandler({
      url: endpoint.ADMIN_SETTINGS,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      let settings = res.data;
      if (settings.paymentFrequencyDays) {
        if (settings.paymentFrequencyDays % 30 === 0) {
          settings.paymentFrequencyDays = settings.paymentFrequencyDays / 30;
          settings.paymentAlertDuration = "Months";
        } else if (settings.paymentFrequencyDays % 7 === 0) {
          settings.paymentFrequencyDays = settings.paymentFrequencyDays / 7;
          settings.paymentAlertDuration = "weeks";
        } else {
          settings.paymentAlertDuration = "Days";
        }
      }
      this.setState({
        ...this.state,
        ...settings
      });
    }
  };
  getPlanInformation = async () => {
    const res = await apiHandler({
      url: endpoint.PLAN_UPGRADE,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      let plans = res.data.plans;
      this.setState({ planInformation: plans[0] });
      this.getPlanVolumeOptions(plans[0].id);
    }
  };
  getPlanVolumeOptions = async id => {
    const res = await apiHandler({
      url: endpoint.PLAN_FIND + "?id=" + id,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      const volumes = res.data.volumes.sort((a, b) =>
        a.id < b.id ? -1 : a.id > b.id ? 1 : 0
      );
      this.setState({ VolumeInformation: volumes });
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
  isValidated = () => {
    if (
      this.state.fxPaymentLimitState === "success" &&
      this.state.fxMarginLimitState === "success" &&
      this.state.feeLimitState === "success"
    ) {
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
  isClientValidated = () => {
    return true;
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose = () => {
    this.setState({ showAddPlanVolume: false, showEditPlanVolume: false });
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  saveClientDefaultSettings = async () => {
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
    if (this.isClientValidated()) {
      const data = {
        fxPaymentLimit: this.state.fxPaymentLimit,
        fxPaymentLimitCurrencyCode: this.state.fxPaymentLimitCurrencyCode,
        fxMarginLimit: this.state.fxMarginLimit,
        alertCountryList: this.state.alertCountryList,
        noOfPaymentFrequency: this.state.noOfPaymentFrequency,
        paymentFrequencyDays: paymentFrequencyDays,
        paymentPerTxnLimit: this.state.paymentPerTxnLimit,
        paymentPerTxnLimitCurrencyCode: this.state
          .paymentPerTxnLimitCurrencyCode,
        feeLimit: this.state.feeLimit,
        planExpired: false
      };
      //ADMIN_SETTING_UPDATE
      const res = await apiHandler({
        method: "POST",
        url: endpoint.ADMIN_SETTING_UPDATE,
        data: data,
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
        // SUCCESS CASES
        this.setState({
          clientEdit: false,
          noticeModal: true,
          noticeModalHeader: "Success",
          noticeModalErrMsg:
            "New Default Client Settings have been saved and are effective now"
        });
      }
    }
  };

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
    if (!this.state.clientEdit) return;

    let alertCountry = this.state.alertCountryList.filter(
      chip => chip !== chipToDelete
    );
    this.setState({
      alertCountryList: alertCountry
    });
  };
  showAddVolumeHandler = () => {
    this.setState({
      showAddPlanVolume: true,
      showEditPlanVolume: false,
      selectedPlanVolume: null
    });
  };
  handleEditVolume = id => {
    let selectedVolume = this.state.VolumeInformation.filter(
      volume => volume.id === id
    )[0];
    this.setState({
      showAddPlanVolume: true,
      showEditPlanVolume: true,
      selectedPlanVolume: selectedVolume
    });
  };
  handleDeleteVolume = id => {
    this.setState(state => {
      return {
        VolumeInformation: state.VolumeInformation.filter(
          volume => volume.id !== id
        )
      };
    });
  };
  addPlanVolume = () => {};
  updatePlanVolume = async planVolume => {
    const res = await apiHandler({
      method: "POST",
      url: endpoint.PLAN_VOLUME_UPDATE,
      data: planVolume,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.getPlanInformation();
    }
  };
  render() {
    const { classes } = this.props;
    const { settings, planInformation, currencies } = this.state;

    return settings && planInformation && currencies ? (
      <>
        <form className={classes.form}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={11} lg={11}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <h4>
                    <b>Common Settings</b>
                  </h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={5} lg={5}>
                  <Card>
                    <CardBody>
                      <div style={{ textAlign: "center", margin: 40 }}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <GridContainer justify="center">
                              <GridItem
                                xs={12}
                                sm={12}
                                md={6}
                                lg={6}
                                style={{ marginBottom: 40 }}
                              >
                                <h4>
                                  <b>Client Default settings</b>
                                </h4>
                              </GridItem>
                              <GridItem
                                xs={12}
                                sm={12}
                                md={6}
                                lg={6}
                                style={{ marginBottom: 40 }}
                              >
                                {this.state.clientEdit ? (
                                  <Button
                                    size="lg"
                                    color="Prima"
                                    style={{
                                      backgroundColor: successColor[1],
                                      width: "100px",
                                      float: "right",
                                      marginRight: 10
                                    }}
                                    onClick={this.saveClientDefaultSettings}
                                  >
                                    SAVE
                                  </Button>
                                ) : (
                                  <Button
                                    aria-controls="report-menu"
                                    aria-haspopup="true"
                                    variant="contained"
                                    size="lg"
                                    style={{
                                      width: "100px",
                                      float: "right",
                                      marginRight: 10
                                    }}
                                    onClick={() => {
                                      this.setState({ clientEdit: true });
                                    }}
                                  >
                                    EDIT
                                  </Button>
                                )}
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
                                <FormControl
                                  fullWidth
                                  className={classes.filledSelect}
                                >
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    disabled={!this.state.clientEdit}
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
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={item.countryCode}
                                          key={item.countryCode}
                                        >
                                          {item.countryCode} -{" "}
                                          {item.countryName}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={12} lg={12}>
                                <Paper
                                  component="ul"
                                  className={classes.rootChip}
                                >
                                  {this.state.alertCountryList.map(
                                    (data, index) => {
                                      return (
                                        <li key={index}>
                                          <Chip
                                            label={data}
                                            deleteIcon={<CloseIcon />}
                                            onDelete={this.handleDeleteCountryAlert(
                                              data
                                            )}
                                            className={classes.chip}
                                          />
                                        </li>
                                      );
                                    }
                                  )}
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
                              <GridItem xs={12} sm={12} md={12} lg={12}>
                                <GridContainer justify="center">
                                  <GridItem xs={4} sm={4} md={2} lg={2}>
                                    <CustomNumberFormat
                                      value={this.state.noOfPaymentFrequency}
                                      disabled={!this.state.clientEdit}
                                      onChange={event =>
                                        this.handleChange(
                                          "noOfPaymentFrequency",
                                          event
                                        )
                                      }
                                      id="csp_noOfPaymentFrequency"
                                      formControlProps={{
                                        style: { paddingTop: 0 },
                                        fullWidth: true,
                                        className:
                                          classes.customFormControlClasses
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={8} sm={8} md={4} lg={4}>
                                    <FormLabel
                                      className={cx(classes.currencyLabel)}
                                    >
                                      payments in
                                    </FormLabel>
                                  </GridItem>
                                  <GridItem xs={4} sm={4} md={2} lg={2}>
                                    <CustomNumberFormat
                                      value={this.state.paymentFrequencyDays}
                                      disabled={!this.state.clientEdit}
                                      onChange={event =>
                                        this.handleChange(
                                          "paymentFrequencyDays",
                                          event
                                        )
                                      }
                                      id="csp_paymentFrequencyDays"
                                      formControlProps={{
                                        style: { paddingTop: 0 },
                                        fullWidth: true,
                                        className:
                                          classes.customFormControlClasses
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
                                        disabled={!this.state.clientEdit}
                                        onChange={
                                          this.handlePaymentAlertDuration
                                        }
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
                                                selected:
                                                  classes.selectMenuItemSelected
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
                                <GridContainer justify="flex-start">
                                  <GridItem xs={12} sm={12} md={5} lg={5}>
                                    <FormLabel
                                      className={cx(classes.currencyLabel)}
                                    >
                                      Single Payment larger than should be
                                      alerted
                                    </FormLabel>
                                  </GridItem>
                                  <GridItem xs={4} sm={4} md={4} lg={4}>
                                    <CustomNumberFormat
                                      value={this.state.paymentPerTxnLimit}
                                      disabled={!this.state.clientEdit}
                                      onChange={event =>
                                        this.handleChange(
                                          "paymentPerTxnLimit",
                                          event
                                        )
                                      }
                                      id="csp_paymentPerTxnLimit"
                                      formControlProps={{
                                        style: { paddingTop: 0 },
                                        fullWidth: true,
                                        className:
                                          classes.customFormControlClasses
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
                                        value={
                                          this.state
                                            .paymentPerTxnLimitCurrencyCode
                                        }
                                        disabled={!this.state.clientEdit}
                                        onChange={event =>
                                          this.handlecurrencyCode(
                                            "paymentPerTxnLimitCurrencyCode",
                                            event
                                          )
                                        }
                                        inputProps={{
                                          name:
                                            "paymentPerTxnLimitCurrencyCode",
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
                                                selected:
                                                  classes.selectMenuItemSelected
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
                              <GridItem xs={12} sm={12} md={8} lg={8}>
                                <FormLabel
                                  className={cx(classes.currencyLabel)}
                                >
                                  Margins Limit (for Bought Currency)
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={4} lg={4}>
                                <CustomNumberFormat
                                  success={
                                    this.state.fxMarginLimitState === "success"
                                  }
                                  error={
                                    this.state.fxMarginLimitState === "error"
                                  }
                                  helpText={
                                    this.state.fxMarginLimitState === "error" &&
                                    this.state.fxMarginLimitErrorMsg[0]
                                  }
                                  value={this.state.fxMarginLimit}
                                  disabled={!this.state.clientEdit}
                                  onChange={event =>
                                    this.handleChange("fxMarginLimit", event)
                                  }
                                  id="csp_fxMarginLimit"
                                  suffix="%"
                                  formControlProps={{
                                    style: { paddingTop: 0 },
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: event => {
                                      this.setState({
                                        fxMarginLimitPristine: false
                                      });
                                      this.changePercentage(
                                        event,
                                        "fxMarginLimit",
                                        [
                                          { type: "required" },
                                          {
                                            type: "range",
                                            params: {
                                              min: 0,
                                              max: 100
                                            }
                                          }
                                        ]
                                      );
                                    },
                                    onChange: event => {
                                      if (!this.state.fxMarginLimitPristine) {
                                        this.setState({
                                          fxMarginLimitPristine: false
                                        });
                                        this.changePercentage(
                                          event,
                                          "fxMarginLimit",
                                          [
                                            { type: "required" },
                                            {
                                              type: "range",
                                              params: {
                                                min: 0,
                                                max: 100
                                              }
                                            }
                                          ]
                                        );
                                        // this.handlefxMarginLimitCurrency(event);
                                      }
                                    }
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={12} md={8} lg={8}>
                                <FormLabel
                                  className={cx(classes.currencyLabel)}
                                >
                                  Fee Limit (for FREE PLAN)
                                </FormLabel>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={4} lg={4}>
                                <CustomNumberFormat
                                  success={
                                    this.state.feeLimitState === "success"
                                  }
                                  error={this.state.feeLimitState === "error"}
                                  helpText={
                                    this.state.feeLimitState === "error" &&
                                    this.state.feeLimitErrorMsg[0]
                                  }
                                  value={this.state.feeLimit}
                                  disabled={!this.state.clientEdit}
                                  onChange={event =>
                                    this.handleChange("feeLimit", event)
                                  }
                                  id="csp_feeLimit"
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
                                        this.changePercentage(
                                          event,
                                          "feeLimit",
                                          [
                                            { type: "required" },
                                            {
                                              type: "range",
                                              params: {
                                                min: 0,
                                                max: 100
                                              }
                                            }
                                          ]
                                        );
                                        // this.handlefeeLimitCurrency(event);
                                      }
                                    }
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={7} lg={7}>
                  <Card>
                    <CardBody>
                      <div style={{ textAlign: "center", margin: 40 }}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <GridContainer justify="center">
                              <GridItem
                                xs={12}
                                sm={12}
                                md={6}
                                lg={6}
                                style={{ marginBottom: 40 }}
                              >
                                <h4>
                                  <b>Pricing Plan settings</b>
                                </h4>
                              </GridItem>
                              <GridItem
                                xs={12}
                                sm={12}
                                md={6}
                                lg={6}
                                style={{ marginBottom: 40 }}
                              />
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                className={classes.header}
                              >
                                <span>
                                  Subscription Plan Volume Information
                                </span>
                              </GridItem>
                              {this.state.VolumeInformation &&
                                this.state.VolumeInformation.map(
                                  (volume, index) => (
                                    <GridItem
                                      xs={12}
                                      sm={12}
                                      md={6}
                                      lg={6}
                                      key={index}
                                    >
                                      <Card className={classes.volumesBox}>
                                        <CardBody style={{ top: -30 }}>
                                          <GridContainer direction="row">
                                            <GridItem
                                              xs={6}
                                              sm={6}
                                              md={12}
                                              lg={12}
                                              style={{
                                                textAlign: "left",
                                                marginTop: 20
                                              }}
                                            >
                                              <GridContainer direction="row">
                                                <GridItem
                                                  lg={9}
                                                  className={classes.LabelText}
                                                />
                                                <GridItem
                                                  lg={3}
                                                  className={classes.gridIcon}
                                                >
                                                  <Edit
                                                    onClick={this.handleEditVolume.bind(
                                                      this,
                                                      volume.id
                                                    )}
                                                    className={cx(
                                                      classes.editIcon,
                                                      classes.icon
                                                    )}
                                                  />
                                                  {/* <Close onClick={this.handleDeleteVolume.bind(this, volume.id)} className={cx(classes.closeIcon, classes.icon)} /> */}
                                                </GridItem>
                                              </GridContainer>
                                            </GridItem>
                                            <GridItem
                                              xs={6}
                                              sm={6}
                                              md={12}
                                              lg={12}
                                              style={{
                                                textAlign: "left",
                                                marginTop: 5
                                              }}
                                            >
                                              <GridContainer direction="row">
                                                <GridItem
                                                  lg={4}
                                                  className={classes.LabelText}
                                                >
                                                  <span>Volume:</span>
                                                </GridItem>
                                                <GridItem lg={8}>
                                                  <span
                                                    className={classes.ellipses}
                                                  >
                                                    {volume.volumeDesc}
                                                  </span>
                                                </GridItem>
                                              </GridContainer>
                                            </GridItem>
                                            <GridItem
                                              xs={6}
                                              sm={6}
                                              md={12}
                                              lg={12}
                                              style={{
                                                textAlign: "left",
                                                marginTop: 5
                                              }}
                                            >
                                              <GridContainer direction="row">
                                                <GridItem
                                                  lg={4}
                                                  className={classes.LabelText}
                                                >
                                                  <span>Price: </span>
                                                </GridItem>
                                                <GridItem lg={8}>
                                                  <span
                                                    className={classes.ellipses}
                                                  >
                                                    {volume.planPriceDesc}
                                                  </span>
                                                </GridItem>
                                              </GridContainer>
                                            </GridItem>
                                          </GridContainer>
                                        </CardBody>
                                      </Card>
                                    </GridItem>
                                  )
                                )}
                              {/* <GridItem xs={12} sm={12} md={6} lg={6}>
                                <Card pricing className={classes.volumesBox}>
                                  <CardBody>
                                    <Add className={cx(classes.editIcon, classes.icon, classes.addIcon)} onClick={this.showAddVolumeHandler} />
                                  </CardBody>
                                </Card>
                              </GridItem> */}
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
              <PlanVolume
                handleClose={this.handleClose}
                showModal={this.state.showAddPlanVolume}
                currencies={currencies}
                showEditPlanVolume={this.state.showEditPlanVolume}
                planVolume={this.state.selectedPlanVolume}
                addPlanVolume={this.addPlanVolume}
                updatePlanVolume={this.updatePlanVolume}
              />
              {this.state.noticeModal && (
                <NoticeModal
                  noticeModal={this.state.noticeModal}
                  noticeModalHeader={this.state.noticeModalHeader}
                  noticeModalErrMsg={this.state.noticeModalErrMsg}
                  closeModal={this.closeNoticeModal}
                />
              )}
            </GridItem>
          </GridContainer>
        </form>
      </>
    ) : (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={7}>
            <h4>
              <b>General Settings</b>
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

CommonSettings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(CommonSettings));
