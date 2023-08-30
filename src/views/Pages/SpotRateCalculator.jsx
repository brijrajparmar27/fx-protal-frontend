import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
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
import { validate } from "../../utils/Validator";
import Button from "components/CustomButtons/Button.jsx";
import { formatDate, convertUTCDateToLocalDate } from "../../utils/Utils";
import NoticeModal from "views/Components/NoticeModal.jsx";

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
import { formatMoney, parseCurrency } from "../../utils/Utils";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import moment from "moment";

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

class SpotRateCalculator extends React.Component {
  error = {
    fromCurrencyErrorMsg: {
      required: "Please select Currency"
    },
    toCurrencyErrorMsg: {
      required: "Please select Currency"
    },
    amountErrorMsg: {
      required: "Amount is required",
      positive: "Amount should be positive number"
    }
  };
  constructor(props) {
    super(props);
    this.initialState = {
      callInProgress: false,

      fromCurrency: "",
      fromCurrencyState: "",
      fromCurrencyPristine: true,
      fromCurrencyErrorMsg: [],

      toCurrency: "",
      toCurrencyState: "",
      toCurrencyPristine: true,
      toCurrencyErrorMsg: [],

      amount: "",
      amountState: "",
      amountPristine: false,
      amountErrorMsg: [],

      fromConvertedAmount: "",
      toConvertedAmount: "",
      convertedDateTime: "",
      showResults: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
    this.state = { ...this.initialState, currencies: [] };
  }
  componentWillMount() {
    this.getCurrencies();
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  getCurrencies = async () => {
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
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.setState({
        currencies: res.data && res.data.currrencies ? res.data.currrencies : []
      });
    }
  };
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      showResults: false
    });
  };
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };

  handleSimple = event => {
    this.setState({ showResults: false });
    this.setState(
      validate(
        event.target.value,
        event.target.name,
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };
  onClickCalculate = () => {
    if (this.isValidated()) {
      this.setState(
        {
          callInProgress: true,
          toConvertedAmount: "",
          fromConvertedAmount: "",
          showResults: false
        },
        () => {
          this.getSpotRate();
        }
      );
    }
  };
  getSpotRate = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    };
    //MARKET_EXCHANGE_RATE_SINGLELIVE
    const res = await apiHandler({
      url:
        endpoint.MARKET_EXCHANGE_RATE_SINGLELIVE +
        "?currency=" +
        this.state.fromCurrency +
        this.state.toCurrency,
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
      } else {
        return;
      }
    } else {
      if (res.data && res.data.mid) {
        const date = res.data && res.data.date ? res.data.date : "";
        const time = res.data && res.data.time ? res.data.time : "";
        let newDate = "";
        if (date !== "" && time !== "") {
          let utcDate = new Date(date + " " + time);
          newDate = convertUTCDateToLocalDate(utcDate);
          // newDate = new Date(
          //   utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000
          // );
          // newDate =
          //   formatDate(newDate) +
          //   " " +
          //   (newDate.getHours() < 10 ? "0" : "") +
          //   newDate.getHours() +
          //   ":" +
          //   (newDate.getMinutes() < 10 ? "0" : "") +
          //   newDate.getMinutes() +
          //   ":" +
          //   (newDate.getSeconds() < 10 ? "0" : "") +
          //   newDate.getSeconds();
        }
        this.getConvertedValue(res.data.mid, newDate);
      }
    }
  };
  getConvertedValue = (exchangeRate, convertedTime) => {
    let fromExchangeRate = 1 / exchangeRate;
    this.setState({
      toConvertedAmount: (
        parseCurrency(this.state.amount) * exchangeRate
      ).toFixed(2),
      fromConvertedAmount: (
        parseCurrency(this.state.amount) * fromExchangeRate
      ).toFixed(2),
      showResults: true,
      convertedDateTime: moment(convertedTime).format("DD MMM YYYY hh:mm:ss A")
    });
  };
  isValidated = () => {
    if (
      this.state.fromCurrencyState === "success" &&
      this.state.toCurrencyState === "success" &&
      this.state.amountState === "success"
    ) {
      return true;
    } else {
      if (this.state.fromCurrencyState === "") {
        this.setState({ fromCurrencyState: "error" });

        this.state.fromCurrencyErrorMsg.push(
          this.error["fromCurrencyErrorMsg"].required
        );
      }
      if (this.state.toCurrencyState === "") {
        this.setState({ toCurrencyState: "error" });

        this.state.toCurrencyErrorMsg.push(
          this.error["toCurrencyErrorMsg"].required
        );
      }
      if (this.state.amountState === "") {
        this.setState({ amountState: "error" });

        this.state.amountErrorMsg.push(this.error["amountErrorMsg"].required);
      }

      return false;
    }
  };
  onClickClear = () => {
    this.setState({
      ...this.initialState
    });
  };
  render() {
    const { classes } = this.props;
    const { currencies } = this.state;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <h4 style={{ display: "inline-block" }}>
              <b>Spot Rate Calculator</b>
            </h4>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <div className={classes.containerRoot}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer alignItems="center">
                    <GridItem xs={11} sm={11} md={11} lg={11}>
                      <CustomNumberFormat
                        success={this.state.amountState === "success"}
                        error={this.state.amountState === "error"}
                        helpText={
                          this.state.amountState === "error" &&
                          this.state.amountErrorMsg[0]
                        }
                        value={this.state.amount}
                        labelText="Amount*"
                        onChange={this.handleChange}
                        id={"amount"}
                        formControlProps={{
                          name: "amount",
                          style: { paddingTop: 5 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              amountPristine: false
                            });
                            this.change(event, "amount", [
                              { type: "required" },
                              { type: "positive" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.amountPristine) {
                              this.setState({
                                amountPristine: false
                              });
                              this.change(event, "amount", [
                                { type: "required" },
                                { type: "positive" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer alignItems="center">
                    <GridItem xs={6} sm={6} md={6} lg={6}>
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
                          success={this.state.fromCurrencyState === "success"}
                          error={this.state.fromCurrencyState === "error"}
                          helpText={
                            this.state.fromCurrencyState === "error" &&
                            this.state.fromCurrencyErrorMsg
                          }
                        >
                          From*
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
                          value={this.state.fromCurrency}
                          onChange={this.handleSimple}
                          inputProps={{
                            name: "fromCurrency",
                            id: "fromCurrency"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                            value=""
                          >
                            Choose Currency
                          </MenuItem>
                          {currencies &&
                            currencies.map(item => (
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
                        <FormHelperText
                          style={{
                            color: "#FF0000",
                            visibility:
                              this.state.fromCurrencyState === "error"
                                ? "visible"
                                : "hidden"
                          }}
                        >
                          Please select Currency
                        </FormHelperText>
                      </FormControl>
                    </GridItem>

                    <GridItem xs={6} sm={6} md={6} lg={6}>
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
                          success={this.state.toCurrencyState === "success"}
                          error={this.state.toCurrencyState === "error"}
                          helpText={
                            this.state.toCurrencyState === "error" &&
                            this.state.toCurrencyErrorMsg
                          }
                        >
                          To*
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
                          value={this.state.toCurrency}
                          onChange={this.handleSimple}
                          inputProps={{
                            name: "toCurrency",
                            id: "toCurrency"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                            value=""
                          >
                            Choose Currency
                          </MenuItem>
                          {currencies &&
                            currencies.map(item => (
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
                        <FormHelperText
                          style={{
                            color: "#FF0000",
                            visibility:
                              this.state.toCurrencyState === "error"
                                ? "visible"
                                : "hidden"
                          }}
                        >
                          Please select Currency
                        </FormHelperText>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>

                <GridItem xs={12} sm={12} md={12} lg={12}>
                  {" "}
                  <>
                    <GridContainer alignItems="center">
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          visibility: this.state.showResults
                            ? "visible"
                            : "hidden",
                          marginTop: "20px"
                        }}
                      >
                        <label
                          style={{
                            fontWeight: "bold",
                            color: "black"
                          }}
                        >
                          {this.state.amount +
                            " " +
                            this.state.fromCurrency +
                            " = " +
                            formatMoney(this.state.toConvertedAmount) +
                            " " +
                            this.state.toCurrency}
                        </label>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          visibility: this.state.showResults
                            ? "visible"
                            : "hidden"
                        }}
                      >
                        <label style={{ fontWeight: "bold", color: "black" }}>
                          {this.state.amount +
                            " " +
                            this.state.toCurrency +
                            " = " +
                            formatMoney(this.state.fromConvertedAmount) +
                            " " +
                            this.state.fromCurrency}
                        </label>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          visibility: this.state.showResults
                            ? "visible"
                            : "hidden"
                        }}
                      >
                        <label
                          style={{ fontSize: "x-small", textAlign: "right" }}
                        >
                          {this.state.convertedDateTime}
                        </label>
                      </GridItem>
                    </GridContainer>
                  </>
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
                            // width: 270,
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
SpotRateCalculator.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(SpotRateCalculator);
