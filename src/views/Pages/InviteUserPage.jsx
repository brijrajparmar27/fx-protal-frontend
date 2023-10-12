import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import { module } from "assets/config";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import axios from "axios";

// @material-ui/icons
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import Phone from "@material-ui/icons/Phone";
import Lock from "@material-ui/icons/Lock";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";

import { validate } from "../../utils/Validator";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import signupPageStyle from "assets/jss/material-dashboard-pro-react/views/signupPageStyle";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const style = (theme) => ({
  ...signupPageStyle,
  ...customSelectStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important",
    //top: 7
  },
  select: {
    paddingBottom: 10,
    fontSize: 14,
  },
  selectFormControl: {
    marginTop: 5,
  },
  modalCloseButton: {
    float: "right",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  emptyIcon: {
    paddingLeft: "40px !important",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class InviteUserPage extends React.Component {
  error = {
    firstNameErrorMsg: {
      required: "First name is required",
      range: "First name should be 1 to 100 characters",
    },
    lastNameErrorMsg: {
      required: "Last name is required",
      range: "Last name should be 1 to 100 characters",
    },
    emailErrorMsg: {
      required: "Email is required",
      company: "Please enter a company email",
      valid: "Please enter a valid email",
    },
    callingCodeErrorMsg: {
      required: "Country Code is required",
    },
    phoneNumberErrorMsg: {
      required: "Phone number is required",
      valid: "Please enter phone number in a valid format (xxx-xxx-xxxx)",
    },
    inviteCodeErrorMsg: {
      required: "Invite Code is required",
    },
    passwordErrorMsg: {
      required: "New Password is required",
      range: "Password should be 8 to 16 characters",
      password:
        "Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)",
    },
    passwordConfirmationErrorMsg: {
      required: "Password confirmation is required",
      range: "Password should be 8 to 16 characters",
      password:
        "Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)",
      matchPassword: "Confirm Password should match Password",
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      inviteModal: true,
      noticeModal: false,
      noticeModalErrMsg: "",
      checked: false,
      preRegisteredUser: false,
      firstName: "",
      firstNameState: "",
      firstNamePristine: true,
      firstNameErrorMsg: [],
      lastName: "",
      lastNameState: "",
      lastNamePristine: true,
      lastNameErrorMsg: [],
      email: "",
      emailState: "",
      emailPristine: true,
      emailErrorMsg: [],
      callingCode: "",
      callingCodeState: "",
      callingCodeErrorMsg: [],
      phoneNumber: "",
      phoneNumberState: "",
      phoneNumberPristine: true,
      phoneNumberHelpMsg: "(xxx-xxx-xxxx)",
      phoneNumberErrorMsg: [],
      inviteCode: "",
      inviteCodeState: "",
      inviteCodePristine: true,
      inviteCodeErrorMsg: [],
      password: "",
      passwordState: "",
      passwordPristine: true,
      passwordErrorMsg: [],
      passwordConfirmation: "",
      passwordConfirmationState: "",
      passwordConfirmationPristine: true,
      passwordConfirmationErrorMsg: [],
      countries: [],
      callInProgress: false,
      phone: true,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  change = (event, stateName, rules) => {
    let value = event.target.value;
    if (stateName === "phoneNumber") {
      value = value.replace(/-/g, "").trim();
      if (value.length > 10) {
        value = value.substring(1, value.length);
      }
    }
    this.setState(validate(value, stateName, this.state, rules, this.error));
  };

  submit = async () => {
    const state = this.state;
    if (!state.checked) {
      this.setState({
        noticeModal: true,
        noticeModalErrMsg: "Please click the 'terms and conditions' checkbox",
      });
      return;
    }

    if (this.isValidated()) {
      const user = {
        firstName: this.state.firstName,
        lastName: state.lastName,
        email: this.state.email,
        phoneNumber: this.state.phone,
        inviteCode: this.state.inviteCode,
        password: this.state.password,
      };
      if (module === "RISKS") {
        user.prospect = true;
      }
      this.setState({ callInProgress: true });
      //  UPDATE_USER_DETAIL
      const res = await axios.post(
        endpoint.BASE_URL_STAGING_AXIOS + endpoint.UPDATE_USER_DETAIL,
        user
      );
      const data = res.data;
      if (data.errorCode) {
        this.setState({
          callInProgress: false,
          inviteModal: false,
          noticeModal: true,
          noticeModalErrMsg: data.userDesc,
        });
      } else {
        this.setState({
          callInProgress: false,
          inviteModal: false,
          noticeModal: true,
          noticeModalErrMsg: "",
        });
      }
    }
  };

  isValidated = () => {
    if (
      this.state.firstNameState === "success" &&
      this.state.lastNameState === "success" &&
      this.state.emailState === "success" &&
      this.state.callingCodeState === "success" &&
      // this.state.phoneNumberState === "success" &&
      this.state.inviteCodeState === "success" &&
      this.state.passwordState === "success" &&
      this.state.passwordConfirmationState === "success"
    ) {
      return true;
    } else {
      if (this.state.firstNameState !== "success") {
        this.setState({ firstNameState: "error" });
      }
      if (this.state.lastNameState !== "success") {
        this.setState({ lastNameState: "error" });
      }
      if (this.state.emailState !== "success") {
        this.setState({ emailState: "error" });
      }
      if (this.state.callingCodeState !== "success") {
        this.setState({ callingCodeState: "error" });
      }
      // if (this.state.phoneNumberState !== "success") {
      //   this.setState({ phoneNumberState: "error" });
      // }
      if (this.state.inviteCodeState !== "success") {
        this.setState({ inviteCodeState: "error" });
      }
      if (this.state.passwordState !== "success") {
        this.setState({ passwordState: "error" });
      }
      if (this.state.passwordConfirmationState !== "success") {
        this.setState({ passwordConfirmationState: "error" });
      }
    }
    return false;
  };
  getPasswordHelpText = () => {
    let helpText =
      "Password should be between 8 and 16 characters; One upper & lower case letter and must contain alphanumeric as well as special characters ( ~!@#$%^&*()_+)";
    return this.state.passwordState === "error"
      ? this.state.passwordErrorMsg[0]
      : helpText;
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    if (this.state.checked && modal === "noticeModal") {
      x["inviteModal"] = false;
    }
    this.setState(x);
  }
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };
  handleSimple = (event) => {
    //this.setState({ [event.target.name]: event.target.value });
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
  handleCallingCode = (event) => {
    let obj = event.target.value;
    console.log(obj);
    this.setState({ [event.target.name]: obj});
    this.setState(
      validate(
        obj,
        "callingCode",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };

  handleToggle() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  componentDidMount = async () => {
    const { match } = this.props;
    if (match.params.emailId) {
      this.setState(
        validate(
          match.params.emailId,
          "email",
          this.state,
          [{ type: "required" }, { type: "email" }],
          this.error
        )
      );
      this.setState({ preRegisteredUser: true });
    }
    //COUNTRIES
    const res = await axios.get(
      endpoint.BASE_URL_STAGING_AXIOS + "fx-crm/public/countriesMetaData"
    );
    if (res.data.errorCode) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: res.data.userDesc,
      });
    } else {
      let countries = res.data.countryMetaData;
      let index = -1;
      let currentCountry = countries.find((country, i) => {
        if (country.alpha2Code === "GB") {
          index = i;
          return true;
        }
      });
      if (currentCountry && index !== -1) {
        countries.splice(index, 1);
        countries.unshift(currentCountry);
      }
      this.setState({ countries: countries });

      // // Get country http://ip-api.com/json
      // axios.get("http://ip-api.com/json").then(
      //   response => {
      //     const countryCode = response.data.countryCode;
      //   });
    }
  };

  componentDidUpdate(e) {
    if (!this.state.inviteModal && !this.state.noticeModal) {
      e.history.push("/");
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={cx(classes.container, classes.cardSignup)}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal,
          }}
          open={this.state.inviteModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("inviteModal")}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.handleClose("inviteModal")}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.inviteModalTitle)}>
              Your Invitation to Register
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.modalBody, classes.loginMaxWidth)}
          >
            <form className={classes.form}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem className={classes.textIcon}>
                      <Face className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={12}
                      sm={12}
                      md={9}
                      lg={9}
                    >
                      <CustomInput
                        success={this.state.firstNameState === "success"}
                        error={this.state.firstNameState === "error"}
                        helpText={
                          this.state.firstNameState === "error" &&
                          this.state.firstNameErrorMsg[0]
                        }
                        labelText="First Name*"
                        id="iup_firstName"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: (event) => {
                            this.setState({ firstNamePristine: false });
                            this.change(event, "firstName", [
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
                            if (!this.state.firstNamePristine) {
                              this.setState({ firstNamePristine: false });
                              this.change(event, "firstName", [
                                { type: "required" },
                                {
                                  type: "length",
                                  params: {
                                    min: 1,
                                    max: 100,
                                  },
                                },
                              ]);
                            }
                          },
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem lg={0}>
                      {/* <Icon className={classes.inputAdornmentIcon} /> */}
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={9}
                      lg={9}
                    >
                      <CustomInput
                        success={this.state.lastNameState === "success"}
                        error={this.state.lastNameState === "error"}
                        helpText={
                          this.state.lastNameState === "error" &&
                          this.state.lastNameErrorMsg[0]
                        }
                        labelText="Last Name*"
                        id="iup_lastName"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: (event) => {
                            this.setState({ lastNamePristine: false });
                            this.change(event, "lastName", [
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
                            if (!this.state.lastNamePristine) {
                              this.setState({ lastNamePristine: false });
                              this.change(event, "lastName", [
                                { type: "required" },
                                {
                                  type: "length",
                                  params: {
                                    min: 1,
                                    max: 100,
                                  },
                                },
                              ]);
                            }
                          },
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem className={classes.textIcon}>
                      <Email className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                    >
                      <CustomInput
                        success={this.state.emailState === "success"}
                        error={this.state.emailState === "error"}
                        helpText={
                          this.state.emailState === "error" &&
                          this.state.emailErrorMsg[0]
                        }
                        labelText="Corporate email address*"
                        id="iup_email"
                        inputProps={{
                          value: this.state.email,
                          disabled: this.state.preRegisteredUser,
                          onChange: (event) =>
                            this.handleChange("email", event),
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: (event) => {
                            this.setState({ emailPristine: false });
                            this.change(event, "email", [
                              { type: "required" },
                              { type: "email" },
                            ]);
                          },
                          onChange: (event) => {
                            if (!this.state.emailPristine) {
                              this.setState({ emailPristine: false });
                              this.change(event, "email", [
                                { type: "required" },
                                { type: "email" },
                              ]);
                            }
                          },
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer>
                    <GridItem
                      className={cx(classes.textIcon, classes.emptyIcon)}
                    >
                      {/* <Face className={classes.inputAdornmentIcon} /> */}
                    </GridItem>
                    <GridItem xs={6} sm={6} md={4} lg={4}>
                      {/* <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      > */}
                      {/* <InputLabel
                          htmlFor="type"
                          className={classes.selectLabel}
                        >
                          Country Code*
                        </InputLabel> */}
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <FormHelperText
                          style={{
                            backgroundColor: "white",
                            paddingTop: 5,
                            marginTop: 0,
                            textAlign: "left",
                          }}
                          success={this.state.callingCodeState === "success"}
                          error={this.state.callingCodeState === "error"}
                          helpText={
                            this.state.callingCodeState === "error" &&
                            this.state.callingCodeErrorMsg[0]
                          }
                        >
                          Country Code*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          value={this.state.callingCodeObj}
                          onChange={this.handleCallingCode}
                          inputProps={{
                            name: "callingCodeObj",
                            id: "callingCodeObj",
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Choose Code
                          </MenuItem>
                          {this.state.countries.map((item) => (
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value={item.callingCodes[0]}
                              // value={item}
                              key={item.countryCode}
                            >
                              {item.countryName +
                                " (" +
                                item.callingCodes[0] +
                                ")"}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <GridContainer spacing={1} alignItems="center">
                        <GridItem className={classes.textIcon}>
                          {/* <Phone className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={9}
                          lg={9}
                        >
                          <TextField
                            id="standard-number"
                            error={!this.state.phone}
                            helperText={!this.state.phone && "Cannot be Empty"}
                            label="Phone Number"
                            type="number"
                            variant="standard"
                            required
                            onChange={(event) => {
                              console.log(event.target.value);
                              // setPhone(event.target.value);
                              this.setState({
                                phone: event.target.value,
                              });
                            }}
                          />
                          {/* <FormHelperText
                            style={{
                              backgroundColor: "white",
                              margin: "5px 12px 0px 12px",
                              textAlign: "left",
                            }}
                            success={this.state.phoneNumberState === "success"}
                            error={this.state.phoneNumberState === "error"}
                          >
                            Phone Number*
                          </FormHelperText>
                          <CustomInput
                            success={this.state.phoneNumberState === "success"}
                            error={this.state.phoneNumberState === "error"}
                            helpText={
                              this.state.phoneNumberState === "error"
                                ? this.state.phoneNumberErrorMsg[0]
                                : this.state.phoneNumberHelpMsg
                            }
                            id="iup_phoneNumber"
                            // value={this.state.phoneNumber}
                            // format="###-###-####"
                            formControlProps={{
                              fullWidth: true,
                              className: cx(
                                classes.customFormControlClasses,
                                classes.phoneFormControl
                              ),
                              onBlur: (event) => {
                                this.setState({ phoneNumberPristine: false });
                                this.change(event, "phoneNumber", [
                                  { type: "required" },
                                  // { type: "phone" }
                                ]);
                              },
                              onChange: (event) => {
                                if (!/^[0-9]*$/.test(event.target.value)) {
                                  event.target.value = event.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                }
                                if (!this.state.phoneNumberPristine) {
                                  this.setState({ phoneNumberPristine: false });
                                  this.change(event, "phoneNumber", [
                                    { type: "required" },
                                    // { type: "phoneNumber" }
                                  ]);
                                }
                              },
                            }}
                          /> */}
                          {/* <CustomInput
                            success={this.state.phoneNumberState === "success"}
                            error={this.state.phoneNumberState === "error"}
                            helpText={
                              this.state.phoneNumberState === "error"
                                ? this.state.phoneNumberErrorMsg[0]
                                : this.state.phoneNumberHelpMsg
                            }
                            labelText="Phone Number*"
                            id="iup_phoneNumber"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ phoneNumberPristine: false });
                                this.change(event, "phoneNumber", [
                                  { type: "required" },
                                  { type: "phone" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.phoneNumberPristine) {
                                  this.setState({ phoneNumberPristine: false });
                                  this.change(event, "phoneNumber", [
                                    { type: "required" },
                                    { type: "phoneNumber" }
                                  ]);
                                }
                              }
                            }}
                          /> */}
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={classes.alignPadding}
                >
                  <GridContainer>
                    <GridItem xs={12} sm={10} md={8} lg={8}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem className={classes.textIcon}>
                          <Lock className={classes.inputAdornmentIcon} />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={9}
                          lg={9}
                        >
                          <CustomInput
                            success={this.state.inviteCodeState === "success"}
                            error={this.state.inviteCodeState === "error"}
                            helpText={
                              this.state.inviteCodeState === "error" &&
                              this.state.inviteCodeErrorMsg[0]
                            }
                            labelText="Invite Code*"
                            id="iup_inviteCode"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({ inviteCodePristine: false });
                                this.change(event, "inviteCode", [
                                  { type: "required" },
                                ]);
                              },
                              onChange: (event) => {
                                if (!this.state.inviteCodePristine) {
                                  this.setState({ inviteCodePristine: false });
                                  this.change(event, "inviteCode", [
                                    { type: "required" },
                                  ]);
                                }
                              },
                            }}
                            inputProps={{ type: "password" }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={10} md={6} lg={6}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem className={classes.textIcon}>
                          <Lock className={classes.inputAdornmentIcon} />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={9}
                          lg={9}
                        >
                          <CustomInput
                            success={this.state.passwordState === "success"}
                            error={this.state.passwordState === "error"}
                            helpText={
                              this.state.passwordState === "error" &&
                              this.state.passwordErrorMsg[0]
                            }
                            labelText="New Password*"
                            id="iup_password"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({ passwordPristine: false });
                                this.change(event, "password", [
                                  { type: "required" },
                                  {
                                    type: "length",
                                    params: {
                                      min: 8,
                                      max: 16,
                                    },
                                  },
                                  { type: "password" },
                                ]);
                              },
                              onChange: (event) => {
                                if (!this.state.passwordPristine) {
                                  this.setState({ passwordPristine: false });
                                  this.change(event, "password", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 8,
                                        max: 16,
                                      },
                                    },
                                    { type: "password" },
                                  ]);
                                }
                              },
                            }}
                            inputProps={{ type: "password" }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={10} md={6} lg={6}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={9}
                          lg={9}
                        >
                          <CustomInput
                            success={
                              this.state.passwordConfirmationState === "success"
                            }
                            error={
                              this.state.passwordConfirmationState === "error"
                            }
                            helpText={
                              this.state.passwordConfirmationState ===
                                "error" &&
                              this.state.passwordConfirmationErrorMsg[0]
                            }
                            labelText="Password Confirmation*"
                            id="iup_passwordConfirmation"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({ passwordPristine: false });
                                this.change(event, "passwordConfirmation", [
                                  { type: "required" },
                                  {
                                    type: "matchPassword",
                                    params: this.state.password,
                                  },
                                  {
                                    type: "length",
                                    params: {
                                      min: 8,
                                      max: 16,
                                    },
                                  },
                                  { type: "password" },
                                ]);
                              },
                              onChange: (event) => {
                                if (!this.state.passwordConfirmationPristine) {
                                  this.setState({
                                    passwordConfirmationPristine: false,
                                  });
                                  this.change(event, "passwordConfirmation", [
                                    { type: "required" },
                                    {
                                      type: "matchPassword",
                                      params: this.state.password,
                                    },
                                    {
                                      type: "length",
                                      params: {
                                        min: 8,
                                        max: 16,
                                      },
                                    },
                                    { type: "password" },
                                  ]);
                                }
                              },
                            }}
                            inputProps={{ type: "password" }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <div className={classes.buttonContainer}>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <FormControlLabel
                      className={classes.center}
                      classes={{
                        root: classes.checkboxLabelControl,
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => this.handleToggle()}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      }
                      label={
                        <div className={classes.termsText}>
                          I agree to the{" "}
                          <NavLink target="_blank" to={"/home/privacy-policy"}>
                            Privacy Policy *
                          </NavLink>{" "}
                          and{" "}
                          <a
                            href="/cms/public/pdfs/Terms_and_Conditions_FXGuard.pdf"
                            target="_blank"
                          >
                            Terms and Conditions *
                          </a>
                          {/* <NavLink
                            target="_blank"
                            to={"/home/terms-and-conditions"}
                          >
                            
                          </NavLink> */}
                          .
                        </div>
                      }
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <div className={classes.center}>
                      {this.state.callInProgress ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          round={false}
                          color="info"
                          size="lg"
                          onClick={this.submit}
                        >
                          SUBMIT
                        </Button>
                      )}
                    </div>
                  </GridItem>
                </div>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal,
          }}
          open={this.state.noticeModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("noticeModal")}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle
            id="notice-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            {/* <Button
              justIcon
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="transparent"
              onClick={() => this.handleClose("noticeModal")}
            >
              <Close className={classes.modalClose} />
            </Button> */}
            <h4 className={classes.modalTitle}>
              {this.state.noticeModalErrMsg === "" ? "Success" : "Error"}
            </h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <p>
              {this.state.noticeModalErrMsg === ""
                ? "You have successfully registered, and you can now login with the new password you have just setup. Login at: www.fxguard.co.uk"
                : this.state.noticeModalErrMsg}
            </p>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button
              onClick={() => this.handleClose("noticeModal")}
              color="info"
              round
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

InviteUserPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(InviteUserPage);
