import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { validate } from "../../../utils/Validator";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import FormHelperText from "@material-ui/core/FormHelperText";

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  ...customSelectStyle,
  ...regularFormsStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important",
    top: 0,
    marginTop: 4
  },
  select: {
    fontSize: 14,
    fontWeight: 400,
    marginTop: 3
  }
};

const platformList = [
  "Convert payables in foreign currency",
  "Convert receivables to home currency",
  "Convert dividends paid or received",
  "Make payments to suppliers",
  "Other reasons not listed"
];
const GBPRange = [
  "0 - 1 Million GBP",
  "1 - 5 Million GBP",
  "5 - 10 Million GBP",
  "10 - 100 Million GBP",
  "Above 100 Million GBP"
];

class Step3 extends React.Component {
  error = {
    companyDescErrorMsg: {
      required: "Company description is required",
      valid: "Please enter a valid company name"
    },
    contactNameErrorMsg: {
      required: "Contact name is required",
      range: "Contact Name should be digits"
    },
    contactTitleErrorMsg: {
      required: "Contact title is required",
      range: "Contact title should be digits"
    },
    contactEmailErrorMsg: {
      required: "Contact email address is required",
      company: "Please enter a corporate email",
      valid: "Please enter a valid email"
    },
    contactAddressErrorMsg: {
      required: "Address is required",
      range: "First name should be 1 to 100 characters"
    },
    contactCityErrorMsg: {
      required: "City is required"
    },
    contactPostalCodeErrorMsg: {
      required: "Postal code is required"
    },
    contactCountryErrorMsg: {
      required: "Country is required"
    },
    platformErrorMsg: {
      required: "Platform is required"
    },
    turnoverErrorMsg: {
      required: "Turnover is required"
    },
    paymentsErrorMsg: {
      required: "Payments is required"
    },
    otherReasonErrorMsg: {
      required: "Other reason is required"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      companyDescState: "",
      companyDescPristine: true,
      companyDescErrorMsg: [],
      contactNameState: "",
      contactNamePristine: true,
      contactNameErrorMsg: [],
      contactTitleState: "",
      contactTitlePristine: true,
      contactTitleErrorMsg: [],
      contactAddressState: "",
      contactAddressPristine: true,
      contactAddressErrorMsg: [],
      contactEmailState: "",
      contactEmailPristine: true,
      contactEmailErrorMsg: [],
      contactCityState: "",
      contactCityPristine: true,
      contactCityErrorMsg: [],
      contactPostalCodeState: "",
      contactPostalCodePristine: true,
      contactPostalCodeErrorMsg: [],
      countryCodeState: "",
      countryCodePristine: true,
      countryCodeErrorMsg: [],
      platformState: "",
      platformPristine: true,
      platformErrorMsg: [],
      turnoverState: "",
      turnoverPristine: true,
      turnoverErrorMsg: [],
      paymentsState: "",
      paymentsPristine: true,
      paymentsErrorMsg: [],
      companyDesc: "",
      contactName: "",
      contactTitle: "",
      contactAddress: "",
      contactEmail: "",
      contactCity: "",
      contactPostalCode: "",
      countryCode: "",
      platform: [],
      turnover: "",
      payments: "",
      desgin: false,
      code: false,
      develop: false,
      othersChecked: false,
      countries: [],
      otherReason: "",
      otherReasonState: "",
      otherReasonPristine: true,
      otherReasonErrorMsg: []
    };
  }

  componentDidMount = async () => {
    if (this.props.apiDataFetched) {
      this.setState({ ...this.props.allStates });
    }
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
        return;
      }
    } else {
      const countries = res.data.countryMetaData;
      this.setState({ countries: countries });
    }
  };
  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      this.props.apiDataFetched != newProps.apiDataFetched &&
      newProps.apiDataFetched
    ) {
      this.setState(this.setState({ ...newProps.allStates }));
    }
  }

  handleSimple = event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "State"]: "success"
    });
  };

  sendState() {
    return this.state;
  }
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  handleGBPRange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "State"]: "success"
    });
  };
  isValidated() {
    // return true;

    if (
      this.state.companyDescState === "success" &&
      this.state.contactNameState === "success" &&
      this.state.contactTitleState === "success" &&
      this.state.contactAddressState === "success" &&
      this.state.contactEmailState === "success" &&
      this.state.contactCityState === "success" &&
      this.state.contactPostalCodeState === "success" &&
      this.state.countryCodeState === "success" &&
      this.state.turnoverState === "success" &&
      this.state.paymentsState === "success"
    ) {
      if (this.state.othersChecked) {
        if (this.state.otherReasonState === "success") return true;
        else {
          if (this.state.otherReasonState !== "success") {
            this.setState({ otherReasonState: "error" });
          }
          return false;
        }
      } else return true;
    } else {
      if (this.state.companyDescState !== "success") {
        this.setState({ companyDescState: "error" });
      }
      if (this.state.contactNameState !== "success") {
        this.setState({ contactNameState: "error" });
      }
      if (this.state.contactTitleState !== "success") {
        this.setState({ contactTitleState: "error" });
      }
      if (this.state.contactAddressState !== "success") {
        this.setState({ contactAddressState: "error" });
      }
      if (this.state.contactEmailState !== "success") {
        this.setState({ contactEmailState: "error" });
      }
      if (this.state.contactCityState !== "success") {
        this.setState({ contactCityState: "error" });
      }
      if (this.state.contactPostalCodeState !== "success") {
        this.setState({ contactPostalCodeState: "error" });
      }

      if (this.state.countryCodeState !== "success") {
        this.setState({ countryCodeState: "error" });
      }
      if (this.state.turnoverState !== "success") {
        this.setState({ turnoverState: "error" });
      }
      if (this.state.paymentsState !== "success") {
        this.setState({ paymentsState: "error" });
      }
    }
    return false;
  }
  handleToggle(value, event) {
    const { platform } = this.state;

    if (value === 4) {
      this.setState({ othersChecked: !this.state.othersChecked });
    } else {
      if (event.target.checked) {
        platform.push(platformList[value]);
      } else {
        platform.splice(platform.indexOf(platformList[value]), 1);
      }
    }
  }
  copyAddress = () => {
    let ci = this.props.allStates.companyInformation;
    this.setState({
      contactAddress: ci.address,
      contactCity: ci.city,
      contactPostalCode: ci.postalCode,
      countryCode: ci.countryCode,
      contactAddressState: "success",
      contactCityState: "success",
      contactPostalCodeState: "success",
      countryCodeState: "success"
    });
  };

  render() {
    const { classes } = this.props;
    return (
      this.state.countries && (
        <form>
          <GridContainer justify="space-between">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <CustomInput
                success={this.state.companyDescState === "success"}
                error={this.state.companyDescState === "error"}
                helpText={
                  this.state.companyDescState === "error" &&
                  this.state.companyDescErrorMsg[0]
                }
                labelText="Provide a brief description of your company*"
                id="s3_companyDesc"
                inputProps={{
                  value: this.state.companyDesc
                  //onChange: (event) => this.handleChange('companyName', event),
                }}
                formControlProps={{
                  fullWidth: true,
                  className: classes.customFormControlClasses,

                  onBlur: event => {
                    this.setState({ companyDescPristine: false });
                    this.change(event, "companyDesc", [
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
                    // if (!this.state.companyDescPristine) {
                    this.setState({ companyDescPristine: false });
                    this.change(event, "companyDesc", [
                      { type: "required" },
                      {
                        type: "length",
                        params: {
                          min: 1,
                          max: 100
                        }
                      }
                    ]);
                    // }
                  }
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={6}>
              <CustomInput
                success={this.state.contactNameState === "success"}
                error={this.state.contactNameState === "error"}
                helpText={
                  this.state.contactNameState === "error" &&
                  this.state.contactNameErrorMsg[0]
                }
                labelText="Contact Name*"
                id="s3_contactName"
                inputProps={{
                  value: this.state.contactName
                  //onChange: (event) => this.handleChange('companyName', event),
                }}
                formControlProps={{
                  fullWidth: true,
                  className: classes.customFormControlClasses,
                  onBlur: event => {
                    this.setState({ contactNamePristine: false });
                    this.change(event, "contactName", [
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
                    // if (!this.state.contactNamePristine) {
                    this.setState({ contactNamePristine: false });
                    this.change(event, "contactName", [
                      { type: "required" },
                      {
                        type: "length",
                        params: {
                          min: 1,
                          max: 100
                        }
                      }
                    ]);
                    //   }
                  }
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={6}>
              <CustomInput
                success={this.state.contactTitleState === "success"}
                error={this.state.contactTitleState === "error"}
                helpText={
                  this.state.contactTitleState === "error" &&
                  this.state.contactTitleErrorMsg[0]
                }
                labelText="Position in Company*"
                placeholder="e.g. Director, Owner, ..."
                id="s3_contactTitle"
                inputProps={{
                  value: this.state.contactTitle,
                  onChange: event => this.handleChange("contactTitle", event)
                }}
                formControlProps={{
                  fullWidth: true,
                  className: classes.customFormControlClasses,
                  onBlur: event => {
                    this.setState({ contactTitlePristine: false });
                    this.change(event, "contactTitle", [
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
                    if (!this.state.contactTitlePristine) {
                      this.setState({ contactTitlePristine: false });
                      this.change(event, "contactTitle", [
                        { type: "required" },
                        {
                          type: "length",
                          params: {
                            min: 1,
                            max: 100
                          }
                        }
                      ]);
                    }
                  }
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={10} md={12} lg={12}>
              <b className={classes.subTitle}>
                Business address (same as registered office address)
              </b>
              <Checkbox
                tabIndex={-1}
                onClick={() => this.copyAddress()}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot
                }}
              />
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={6}
              className={classes.alignPadding}
            >
              <CustomInput
                success={this.state.contactAddressState === "success"}
                error={this.state.contactAddressState === "error"}
                helpText={
                  this.state.contactAddressState === "error" &&
                  this.state.contactAddressErrorMsg[0]
                }
                labelText="Address*"
                id="s3_contactAddress"
                inputProps={{
                  value: this.state.contactAddress,
                  onChange: event => this.handleChange("contactAddress", event)
                }}
                formControlProps={{
                  fullWidth: true,
                  className: classes.customFormControlClasses,
                  onBlur: event => {
                    this.setState({ contactAddressPristine: false });
                    this.change(event, "contactAddress", [
                      { type: "required" }
                    ]);
                  },
                  onChange: event => {
                    if (!this.state.contactAddressPristine) {
                      this.setState({ contactAddressPristine: false });
                      this.change(event, "contactAddress", [
                        { type: "required" }
                      ]);
                    }
                  }
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={6}>
              <CustomInput
                success={this.state.contactEmailState === "success"}
                error={this.state.contactEmailState === "error"}
                helpText={
                  this.state.contactEmailState === "error" &&
                  this.state.contactEmailErrorMsg[0]
                }
                labelText="Contact email address*"
                id="s3_contactEmail"
                inputProps={{
                  value: this.state.contactEmail,
                  onChange: event => this.handleChange("contactEmail", event)
                }}
                formControlProps={{
                  fullWidth: true,
                  className: classes.customFormControlClasses,
                  onBlur: event => {
                    this.setState({ contactEmailPristine: false });
                    this.change(event, "contactEmail", [
                      { type: "required" },
                      { type: "email" }
                    ]);
                  },
                  onChange: event => {
                    if (!this.state.contactEmailPristine) {
                      this.setState({ contactEmailPristine: false });
                      this.change(event, "contactEmail", [
                        { type: "required" },
                        { type: "email" }
                      ]);
                    }
                  }
                }}
              />
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={classes.alignPadding}
            >
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    success={this.state.contactCityState === "success"}
                    error={this.state.contactCityState === "error"}
                    helpText={
                      this.state.contactCityState === "error" &&
                      this.state.contactCityErrorMsg[0]
                    }
                    labelText="City*"
                    id="s3_contactCity"
                    inputProps={{
                      value: this.state.contactCity,
                      onChange: event => this.handleChange("contactCity", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ contactCityPristine: false });
                        this.change(event, "contactCity", [
                          { type: "required" }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.contactCityPristine) {
                          this.setState({ contactCityPristine: false });
                          this.change(event, "contactCity", [
                            { type: "required" }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    success={this.state.contactPostalCodeState === "success"}
                    error={this.state.contactPostalCodeState === "error"}
                    helpText={
                      this.state.contactPostalCodeState === "error" &&
                      this.state.contactPostalCodeErrorMsg[0]
                    }
                    labelText="Postal Code*"
                    id="s3_contactPostalCode"
                    inputProps={{
                      value: this.state.contactPostalCode,
                      onChange: event =>
                        this.handleChange("contactPostalCode", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ contactPostalCodePristine: false });
                        this.change(event, "contactPostalCode", [
                          { type: "required" }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.contactPostalCodePristine) {
                          this.setState({ contactPostalCodePristine: false });
                          this.change(event, "contactPostalCode", [
                            { type: "required" }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                {/* <GridItem xs={12} sm={10} md={4}>
                <CustomInput
                  success={this.state.contactCountryState === "success"}
                  error={this.state.contactCountryState === "error"}
                  helpText={
                    this.state.contactCountryState === "error" &&
                    this.state.contactCountryErrorMsg[0]
                  }
                  labelText="Country*"
                  id="s3_contactCountry"
                  inputProps={{
                    value: this.state.contactCountry,
                    onChange: event => this.handleChange("contactCountry", event)
                  }}
                  formControlProps={{
                    fullWidth: true,
                    className: classes.customFormControlClasses,
                    onBlur: event => {
                      this.setState({ contactCountryPristine: false });
                      this.change(event, "contactCountry", [{ type: "required" }]);
                    },
                    onChange: event => {
                      if (!this.state.contactCountryPristine) {
                        this.setState({ contactCountryPristine: false });
                        this.change(event, "contactCountry", [{ type: "required" }]);
                      }
                    }
                  }}
                />
              </GridItem> */}

                <GridItem xs={12} sm={12} md={12} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel htmlFor="type" className={classes.selectLabel}>
                      Country*
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state.countryCode}
                      onChange={this.handleSimple}
                      inputProps={{
                        name: "countryCode",
                        id: "countryCode"
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
                      {this.state.countries.map(item => (
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value={item.countryCode}
                          key={item.countryCode}
                        >
                          {item.countryName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      style={{ color: "red" }}
                      hidden={this.state.countryCodeState !== "error"}
                    >
                      {this.error.contactCountryErrorMsg["required"]}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={10} md={12} lg={12}>
              <b className={classes.subTitle}>How you may use our platform ?</b>
            </GridItem>
            <GridItem xs={12} sm={12}>
              <GridContainer justify="flex-start">
                <GridItem xs={12} sm={12} md={12} lg={5}>
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={event => this.handleToggle(0, event)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      classes={{
                        label: classes.label
                      }}
                      label="Convert payables in foreign currency"
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={5}>
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={event => this.handleToggle(1, event)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      classes={{
                        label: classes.label
                      }}
                      label="Convert receivables to home currency"
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12}>
              <GridContainer justify="flex-start">
                <GridItem xs={12} sm={12} md={12} lg={5}>
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={event => this.handleToggle(2, event)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      classes={{
                        label: classes.label
                      }}
                      label="Convert dividends paid or received"
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={5}>
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={event => this.handleToggle(3, event)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      classes={{
                        label: classes.label
                      }}
                      label="Make payments to suppliers"
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <GridContainer justify="flex-start">
                <GridItem xs={12} sm={12} md={12} lg={5}>
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={event => this.handleToggle(4, event)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                        />
                      }
                      classes={{
                        label: classes.label
                      }}
                      label="Other reasons not listed"
                    />
                  </div>
                </GridItem>
                {this.state.othersChecked && (
                  <GridItem xs={12} sm={12} md={12} lg={5}>
                    <CustomInput
                      success={this.state.otherReasonState === "success"}
                      error={this.state.otherReasonState === "error"}
                      helpText={
                        this.state.otherReasonState === "error" &&
                        this.state.otherReasonErrorMsg[0]
                      }
                      labelText="Other reason*"
                      id="s3_otherReason"
                      inputProps={{
                        value: this.state.otherReason,
                        onChange: event =>
                          this.handleChange("otherReason", event)
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({ otherReasonPristine: false });
                          this.change(event, "otherReason", [
                            { type: "required" }
                          ]);
                        },
                        onChange: event => {
                          if (!this.state.otherReasonPristine) {
                            this.setState({ otherReasonPristine: false });
                            this.change(event, "otherReason", [
                              { type: "required" }
                            ]);
                          }
                        }
                      }}
                    />
                  </GridItem>
                )}
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                      htmlFor="turnover"
                      className={classes.selectLabel}
                    >
                      Expected FX Turnover in a year*
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state.turnover}
                      onChange={this.handleGBPRange}
                      inputProps={{
                        name: "turnover",
                        id: "turnover"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Turnover
                      </MenuItem>
                      {GBPRange.map(item => (
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
                      style={{ color: "red" }}
                      hidden={this.state.turnoverState !== "error"}
                    >
                      {this.error.turnoverErrorMsg["required"]}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={6}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                      htmlFor="payments"
                      className={classes.selectLabel}
                    >
                      Expected 3rd Party Payments in a year*
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state.payments}
                      onChange={this.handleGBPRange}
                      inputProps={{
                        name: "payments",
                        id: "payments"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Payments
                      </MenuItem>
                      {GBPRange.map(item => (
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
                      style={{ color: "red" }}
                      hidden={this.state.paymentsState !== "error"}
                    >
                      {this.error.paymentsErrorMsg["required"]}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </form>
      )
    );
  }
}
Step3.propTypes = {
  classes: PropTypes.object.isRequired,
  allStates: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(Step3));
