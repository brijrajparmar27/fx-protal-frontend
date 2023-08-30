import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import { format } from "date-fns";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import { validate } from "../../utils/Validator";
import Button from "components/CustomButtons/Button.jsx";
import { formatDate, parseDate, convertUTCDateToLocalDate } from "../../utils/Utils";

import {
  successColor,
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import signupPageStyle from "assets/jss/material-dashboard-pro-react/views/signupPageStyle";
import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import moment from "moment";
import cx from "classnames";

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

const style = {
  containerRoot: {
    // backgroundColor: "#ffffff",
    // padding: "20px 30px 60px 50px"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
  // ...signupPageStyle,
  // ...customInputStyle
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

class ForwardRateCalculator extends React.Component {
  error = {
    currencyPairErrorMsg: {
      required: "Select Currency Pair"
    },
    valueDateErrorMsg: {
      required: "Settlement date value is required",
      valid: "Please select a valid settlement date"
    },
    settlementDatePeriodState: {
      required: "Select Option"
    }
  };
  constructor(props) {
    super(props);
    this.initialState = {
      callInProgress: false,

      currencyPair: "",
      currencyPairState: "",
      currencyPairPristine: true,
      currencyPairErrorMsg: [],

      valueDateState: "",
      valueDatePristine: false,
      valueDateErrorMsg: [],

      forwardRate: "",
      forwardRateDate: "",
      spotRate: "",
      spotRateDate: "",
      valueDateDisable: true,
      valueDate: null,
      minDate: null,
      settlementDatePeriod: "",
      settlementDatePeriodState: "",
      holidayList: [],
      disableDatesList: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
    this.state = { ...this.initialState, currencyPairs: [] };
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  componentDidMount() {
    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    this.setState({ minDate });
    this.getCurrencyPairs();
  }
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
  onChangeCurrencyPair = event => {
    this.setState(
      validate(
        event.target.value,
        event.target.name,
        this.state,
        [{ type: "required" }],
        this.error
      ),
      () => {
        this.getHolidayList(event.target.value, 2);
      }
    );
  };

  getHolidayList = async (currencyPair, callAPITimes) => {
    let currency = currencyPair.substring(0, 3);
    if (callAPITimes === 1) {
      currency = currencyPair.substring(3, 6);
    }
    //CALENDAR
    const res = await apiHandler({
      url: endpoint.CALENDAR + currency,
      authToken: sessionStorage.getItem("token")
    });

    console.log("getapidtacehck", res.data);
    if (res.data.errorCode) {
      this.props.setLoading(false);
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403 || res.data.errorCode === 500) {
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
          disableDatesList:
            res.data && res.data.holidays
              ? [...this.state.disableDatesList, ...res.data.holidays]
              : [...this.state.disableDatesList],
          holidayList:
            res.data && res.data.holidays
              ? [...this.state.holidayList, ...res.data.holidays]
              : [...this.state.holidayList],
          settlementDatePeriod: null,
          valueDate: null,
          settlementDatePeriodState: "",
          valueDateState: ""
        },
        () => {
          if (callAPITimes !== 1) {
            this.getHolidayList(currencyPair, 1);
          }
        }
      );
    }
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
  handleDateChange = date => {
    this.setState(
      validate(date, "valueDate", this.state, [{ type: "oldDate" }], this.error)
    );
  };

  getCurrencyPairs = async () => {
    this.setState({
      callInProgress: true
    });
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
      const currencyPairs =
        res.data && res.data.currencyPairs ? res.data.currencyPairs : [];
      this.setState({
        currencyPairs: currencyPairs,
        callInProgress: false
      });
    }
  };

  onClickCalculate = () => {
    if (this.isValidated()) {
      this.setState(
        {
          callInProgress: true,
          forwardRate: "",
          spotRate: ""
        },
        () => {
          this.getForwardRate();
          // this.getSpotRate();
        }
      );
    }
  };
  handleSettlementDatePeriod = value => {
    let settlementDate = new Date().toDateString();
    let sd = new Date(new Date(settlementDate).toDateString());
    let obj = this.getSettlementDate(sd, 3, type);
    sd = obj.date;
    let val = value.slice(1);
    let type = value[0];

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
    obj = this.getSettlementDate(sd, 1, type);
    // if (sd.getDay() === 0) {
    //   // i.e Sunday
    //   sd.setDate(sd.getDate() + 1);
    // } else if (sd.getDay() === 6) {
    //   // i.e. Saturday
    //   sd.setDate(sd.getDate() + 2);
    // }
    // var month = (sd.getMonth() + 1 < 10 ? "0" : "") + (sd.getMonth() + 1);
    // var date = (sd.getDate() < 10 ? "0" : "") + sd.getDate();
    // let updatedDate = sd.getFullYear() + "-" + month + "-" + date;

    this.setState({
      settlementDatePeriod: value,
      valueDate: obj.date,
      settlementDatePeriodState: "success",
      valueDateState: "success",
      disableDatesList: obj.disableDatesList
    });
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
    //console.log('getsettlementdate',disableDatesList)
    return {
      date: date,
      disableDatesList: disableDatesList
    };
  };
  getForwardRate = async spotRate => {
    let params = {
      boughtCurrencyCode: this.state.currencyPair.substring(0, 3),
      soldCurrencyCode: this.state.currencyPair.substring(3, 6),
      settlementDate: this.parseDate(this.state.valueDate)
    };
    //CALCULATE_HEDGING_COST 
    const res = await apiHandler({
      url: endpoint.CALCULATE_HEDGING_COST,
      method: "POST",
      data: params,
      authToken: sessionStorage.getItem("token")
    });
    console.log("response", res);
    this.setState({
      callInProgress: false
    });

    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        this.setState({
          forwardRate: "Not Available"
        });
        return;
      } else {
        this.setState({
          forwardRate: "Not Available"
        });
        return;
      }
    } else {
      const interpolatedRates =
        res.data && res.data.interpolateRate
          ? res.data.interpolateRate.toFixed(5)
          : "";
      const spotRate =
        res.data && res.data.spotRate ? res.data.spotRate.toFixed(5) : "";
      const date =
        res.data && res.data.forwardRateDate
          ? formatDate(res.data.forwardRateDate)
          : "";
      const time =
        res.data && res.data.forwardRateTime ? res.data.forwardRateTime : "";
      
      let newDate = null;
      if (date !== "" && time !== "") {
        let utcDate = new Date(date + " " + time);
        newDate = convertUTCDateToLocalDate(utcDate);
      }
      this.setState({
        spotRate: spotRate,
        forwardRate: interpolatedRates,
        forwardRateDate: moment(newDate).format("DD MMM YYYY hh:mm:ss A") //date + " " + time
      });
    }
  };
  getSpotRate = async () => {
    //MARKET_EXCHANGE_RATE_SINGLELIVE
    const res = await apiHandler({
      url:
        endpoint.MARKET_EXCHANGE_RATE_SINGLELIVE +
        "?currency=" +
        this.state.currencyPair,
      authToken: sessionStorage.getItem("token")
    });

    console.log("response exchangeRate", res);
    this.setState({
      callInProgress: false
    });

    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        this.setState({
          spotRate: "Not Available",
          spotRateDate: ""
        });
        return;
      } else {
        this.setState({
          spotRate: "Not Available",
          spotRateDate: ""
        });
        return;
      }
    } else {
      const mid = res.data && res.data.mid ? res.data.mid.toFixed(5) : "";
      const date = res.data && res.data.date ? res.data.date : "";
      const time = res.data && res.data.time ? res.data.time : "";
      let newDate = "";
      if (date !== "" && time !== "") {
        let utcDate = new Date(date + " " + time);
        newDate = new Date(
          utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000
        );
        newDate = formatDate(newDate) + " " + time;
      }

      this.setState(
        {
          spotRate: mid,
          spotRateDate: newDate
        },
        () => {
          this.getForwardRate(res.data.mid);
        }
      );
    }
  };
  isValidated = () => {
    if (
      this.state.currencyPairState === "success" &&
      this.state.valueDateState === "success" &&
      this.state.settlementDatePeriodState === "success"
    ) {
      return true;
    } else {
      if (this.state.currencyPairState === "") {
        this.setState({ currencyPairState: "error" });

        this.state.currencyPairErrorMsg.push(
          this.error["currencyPairErrorMsg"].required
        );
      }
      if (this.state.settlementDatePeriodState === "") {
        this.setState({ settlementDatePeriodState: "error" });

        this.state.currencyPairErrorMsg.push(
          this.error["currencyPairErrorMsg"].required
        );
      }
      if (this.state.valueDateState === "success") {
        if (this.state.valueDateState === "") {
          this.state.valueDateErrorMsg.push(
            this.error["valueDateErrorMsg"].required
          );
        }
        this.setState({ valueDateState: "error" });
      }
      // if (this.state.valueDateState !== "success") {
      //   this.setState({ valueDateState: "error" });
      // }

      return false;
    }
  };
  onClickClear = () => {
    this.setState({
      ...this.initialState
    });
  };
  parseDate(dateObj) {
    if (dateObj === null || dateObj === "") return null;

    var month =
      (dateObj.getMonth() + 1 < 10 ? "0" : "") + (dateObj.getMonth() + 1);
    var date = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate();
    return dateObj.getFullYear() + "-" + month + "-" + date;
  }
  render() {
    const { classes } = this.props;
    const { currencyPairs } = this.state;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <h4 style={{ display: "inline-block" }}>
              <b>Forward Rate Calculator</b>
            </h4>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <div className={classes.containerRoot}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <FormControl
                        fullWidth
                        className={classes.countryFormControl}
                      >
                        <FormHelperText
                          style={{
                            backgroundColor: "white",
                            paddingTop: 5,
                            marginTop: 0,
                            textAlign: "left"
                          }}
                          success={this.state.currencyPairState === "success"}
                          error={this.state.currencyPairState === "error"}
                          helpText={
                            this.state.currencyPairState === "error" &&
                            this.state.currencyPairErrorMsg[0]
                          }
                        >
                          Currency Pair*
                        </FormHelperText>
                        {/* <InputLabel
                          htmlFor="type"
                          className={classes.selectLabel}
                        >
                          Country*
                        </InputLabel> */}
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.currencyPair}
                          onChange={this.onChangeCurrencyPair}
                          inputProps={{
                            name: "currencyPair",
                            id: "currencyPair"
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
                          {currencyPairs &&
                            currencyPairs.map(item => (
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
                        <FormHelperText
                          style={{
                            color: "#FF0000",
                            visibility:
                              this.state.currencyPairState === "error"
                                ? "visible"
                                : "hidden"
                          }}
                        >
                          Select Currency Pair
                        </FormHelperText>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem xs={6} sm={6} md={6} lg={6}>
                      <FormControl fullWidth>
                        <label style={{ textAlign: "left" }}>
                          Settlement Date
                        </label>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: cx(classes.white, classes.filledSelect)
                          }}
                          value={this.state.settlementDatePeriod}
                          onChange={event =>
                            this.handleSettlementDatePeriod(event.target.value)
                          }
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
                                selected: classes.selectMenuItemSelected
                              }}
                              value={item.value}
                              key={item.value}
                            >
                              {item.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormHelperText
                        style={{
                          color: "#FF0000",
                          visibility:
                            this.state.settlementDatePeriodState === "error"
                              ? "visible"
                              : "hidden"
                        }}
                      >
                        Select Option
                      </FormHelperText>
                    </GridItem>
                    <GridItem
                      xs={6}
                      sm={6}
                      md={6}
                      lg={6}
                      style={{
                        marginTop: 10
                      }}
                    >
                      <CustomDateSelector
                        success={this.state.valueDateState === "success"}
                        error={this.state.valueDateState === "error"}
                        helpText={
                          this.state.valueDateState === "error" &&
                          this.state.valueDateErrorMsg[0]
                        }
                        id="ffd_valueDate"
                        inputProps={{
                          format: "dd MMM yyyy",
                          label: "Settlement Date",
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
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem xs={6} sm={6} md={6} lg={6}>
                      <CustomInput
                        labelText="Spot Rate"
                        helpText={this.state.spotRateDate}
                        id="sp_spotrate"
                        value={this.state.spotRate}
                        formControlProps={{
                          disabled: true,
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                      />
                    </GridItem>
                    <GridItem xs={6} sm={6} md={6} lg={6}>
                      <CustomInput
                        labelText="Forward Rate"
                        helpText={this.state.forwardRateDate}
                        id="sp_frwdrate"
                        value={this.state.forwardRate}
                        formControlProps={{
                          disabled: true,
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <>
                    <GridContainer>
                      <GridItem
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{ textAlign: "right", alignSelf: "center" }}
                      >
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: successColor[1],
                            // width: 150,
                            marginTop: 20
                          }}
                          onClick={() => {
                            this.onClickCalculate();
                          }}
                        >
                          <h5>CALCULATE</h5>
                        </Button>
                      </GridItem>
                      <GridItem
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{ textAlign: "left", alignSelf: "center" }}
                      >
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: grayColor[1],
                            // width: 150,
                            marginTop: 20
                          }}
                          onClick={() => {
                            this.onClickClear();
                          }}
                        >
                          <h5>CLEAR</h5>
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
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
              <h4 className={classes.modalTitle}>{"Processing..."}</h4>
            </DialogTitle>
            <DialogContent
              id="waiting-modal-slide-description"
              className={classes.modalBody}
              style={{ textAlign: "center" }}
            >
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}{" "}
      </>
    );
  }
}
ForwardRateCalculator.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(ForwardRateCalculator));
