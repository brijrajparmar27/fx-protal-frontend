import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";

import cx from "classnames";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import Phone from "@material-ui/icons/Phone";
// import LockOutline from "@material-ui/icons/LockOutline";

import { validate } from "../../utils/Validator";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import signupPageStyle from "assets/jss/material-dashboard-pro-react/views/signupPageStyle";
import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

const style = theme => ({
  ...signupPageStyle,
  ...customSelectStyle,
  ...customInputStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important"
    //top: 7
  },
  select: {
    paddingBottom: 10,
    fontSize: 14
  },
  selectFormControl: {
    // [theme.breakpoints.up("md")]: {
    //   marginTop: -15
    // }
  },
  countryFormControl: {
    marginTop: 5
  },
  modalCloseButton: {
    float: "right"
  },
  loginMaxWidth: {
    maxWidth: 650
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  emptyIcon: {
    [theme.breakpoints.up("lg")]: {
      display: "none"
    }
  }
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class CreateAdminUser extends React.Component {
  error = {
    firstNameErrorMsg: {
      required: "First name is required",
      range: "First name should be 1 to 100 characters"
    },
    lastNameErrorMsg: {
      required: "Last name is required",
      range: "Last name should be 1 to 100 characters"
    },
    emailErrorMsg: {
      required: "Email is required",
      company: "Please enter a company email",
      valid: "Please enter a valid email"
    },
    callingCodeErrorMsg: {
      required: "Country Code is required"
    },
    phoneNumberErrorMsg: {
      required: "Phone number is required",
      valid: "Please enter phone number in a valid format (xxx-xxx-xxxx)"
    },
    roleErrorMsg: {
      required: "Role is required",
    },
    passwordErrorMsg: {
      required: "Password is required",
      range: "Password should be 8 to 16 characters",
      password:
        "Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)"
    },
    passwordConfirmationErrorMsg: {
      required: "Password confirmation is required",
      range: "Password should be 8 to 16 characters",
      password:
        "Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)",
      matchPassword: "Confirm Password should match Password"
    }
  };

  initialState = {
    showAdminUserModal: false,
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
    role: "",
    roleState: "",
    roleErrorMsg: [],
    password: "",
    passwordState: "",
    passwordPristine: true,
    passwordErrorMsg: [],
    passwordConfirmation: "",
    passwordConfirmationState: "",
    passwordConfirmationPristine: true,
    passwordConfirmationErrorMsg: [],
    roles: [
      "role-fxguard-adminstrator",
      "role-admin-manager",
      "role-customer-administrator"
    ],
    callInProgress: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showAdminUserModal) {
      return {
        showAdminUserModal: props.showModal
      };
    }
    return null;
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

  submit = () => {
    if (this.isValidated()) {
      const user = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        username: this.state.email,
        role: this.state.role,
        phoneNumber:
          this.state.callingCode + this.state.phoneNumber.replace(/-/g, ""),
        password: this.state.password,
        mfaEnabled: true,
        mfaChannel: "EMAIL"
      };
      this.props.addRecord(user);
      this.closeModal();
    }
  };

  isValidated = () => {
    if (
      this.state.firstNameState === "success" &&
      this.state.lastNameState === "success" &&
      this.state.emailState === "success" &&
      this.state.callingCodeState === "success" &&
      this.state.phoneNumberState === "success" &&
      this.state.roleState === "success" &&
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
      if (this.state.phoneNumberState !== "success") {
        this.setState({ phoneNumberState: "error" });
      }
      if (this.state.roleState !== "success") {
        this.setState({ roleState: "error" });
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
  closeModal() {
    this.setState(this.initialState);
    this.props.closeModal();
  }
  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };
  handleSimple = event => {
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
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  componentDidMount = () => {
    this.initalizeState();
  };

  initalizeState = () => {
    this.setState(this.initialState);
  };

  componentWillUnmount() {
    this.initalizeState();
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={cx(classes.container)}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal + " " + classes.loginMaxWidth
          }}
          open={this.state.showAdminUserModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.closeModal()}
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
              onClick={() => this.closeModal()}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.signupModalTitle)}>
              Create Admin User
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
          >
            <form className={classes.form}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem
                      xs={1}
                      sm={1}
                      md={1}
                      lg={1}
                      className={classes.textIcon}
                    >
                      <Face className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={5}
                    >
                      <CustomInput
                        success={this.state.firstNameState === "success"}
                        error={this.state.firstNameState === "error"}
                        helpText={
                          this.state.firstNameState === "error" &&
                          this.state.firstNameErrorMsg[0]
                        }
                        labelText="First Name*"
                        id="cau_firstName"
                        inputProps={{
                          value: this.state.firstName,
                          onChange: event =>
                            this.handleChange("firstName", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ firstNamePristine: false });
                            this.change(event, "firstName", [
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
                            if (!this.state.firstNamePristine) {
                              this.setState({ firstNamePristine: false });
                              this.change(event, "firstName", [
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
                    <GridItem
                      className={classes.emptyIcon}
                      xs={1}
                      sm={1}
                      md={0}
                      lg={0}
                    />
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={5}
                    >
                      <CustomInput
                        success={this.state.lastNameState === "success"}
                        error={this.state.lastNameState === "error"}
                        helpText={
                          this.state.lastNameState === "error" &&
                          this.state.lastNameErrorMsg[0]
                        }
                        labelText="Last Name*"
                        id="cau_lastName"
                        inputProps={{
                          value: this.state.lastName,
                          onChange: event =>
                            this.handleChange("lastName", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ lastNamePristine: false });
                            this.change(event, "lastName", [
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
                            if (!this.state.lastNamePristine) {
                              this.setState({ lastNamePristine: false });
                              this.change(event, "lastName", [
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
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem
                      xs={1}
                      sm={1}
                      md={1}
                      lg={1}
                      className={classes.textIcon}
                    >
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
                        id="cau_email"
                        inputProps={{
                          value: this.state.email,
                          onChange: event => this.handleEmailChange(event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ emailPristine: false });
                            this.change(event, "email", [
                              { type: "required" },
                              { type: "email" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.emailPristine) {
                              this.setState({ emailPristine: false });
                              this.change(event, "email", [
                                { type: "required" },
                                { type: "email" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>

                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem
                      xs={1}
                      sm={1}
                      md={1}
                      lg={1}
                      style={{ marginTop: 10 }}
                      className={classes.textIcon}
                    >
                      <Phone className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={5}
                    >
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <FormHelperText
                          style={{
                            backgroundColor: "white",
                            paddingTop: 5,
                            marginTop: 0,
                            textAlign: "left"
                          }}
                          success={this.state.callingCodeState === "success"}
                          error={this.state.callingCodeState === "error"}
                          helptext={
                            this.state.callingCodeState === "error" &&
                            this.state.callingCodeErrorMsg[0]
                          }
                        >
                          Country Code*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.callingCode}
                          onChange={this.handleSimple}
                          inputProps={{
                            name: "callingCode",
                            id: "callingCode"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Code
                          </MenuItem>
                          {this.props.countries.map((item, index) => (
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={item.callingCodes[0]}
                              key={index}
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
                    <GridItem
                      className={classes.emptyIcon}
                      xs={1}
                      sm={1}
                      md={0}
                      lg={0}
                    />
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={5}
                    >
                      <FormHelperText
                        style={{
                          backgroundColor: "white",
                          paddingTop: 5,
                          marginTop: 0,
                          textAlign: "left"
                        }}
                        success={this.state.phoneNumberState === "success"}
                        error={this.state.phoneNumberState === "error"}
                      >
                        Phone Number*
                      </FormHelperText>
                      <CustomNumberFormat
                        success={this.state.phoneNumberState === "success"}
                        error={this.state.phoneNumberState === "error"}
                        helptext={
                          this.state.phoneNumberState === "error"
                            ? this.state.phoneNumberErrorMsg[0]
                            : this.state.phoneNumberHelpMsg
                        }
                        id="cau_phoneNumber"
                        // value={this.state.phoneNumber}
                        // labelText="Phone Number*"
                        // format="###-###-####"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ phoneNumberPristine: false });
                            this.change(event, "phoneNumber", [
                              { type: "required" },
                              // { type: "phone" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.phoneNumberPristine) {
                              this.setState({ phoneNumberPristine: false });
                              this.change(event, "phoneNumber", [
                                { type: "required" },
                                // { type: "phoneNumber" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem
                      xs={1}
                      sm={1}
                      md={1}
                      lg={1}
                      style={{ marginTop: 10 }}
                      className={classes.textIcon}
                    />
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={5}
                    >
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <FormHelperText
                          style={{
                            backgroundColor: "white",
                            paddingTop: 5,
                            marginTop: 0,
                            textAlign: "left"
                          }}
                          success={this.state.roleState === "success"}
                          error={this.state.roleState === "error"}
                          helptext={
                            this.state.roleState === "error" &&
                            this.state.roleErrorMsg[0]
                          }
                        >
                          Role*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.role}
                          onChange={this.handleSimple}
                          inputProps={{
                            name: "role",
                            id: "role"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Code
                          </MenuItem>
                          {this.state.roles.map(item => (
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
                      className={classes.emptyIcon}
                      xs={1}
                      sm={1}
                      md={0}
                      lg={0}
                    />
                  </GridContainer>
                </GridItem>
                <GridItem
                  xs={10}
                  sm={10}
                  md={11}
                  lg={11}
                  className={classes.alignPadding}
                >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem
                          className={classes.customText}
                          xs={12}
                          sm={12}
                          md={11}
                          lg={11}
                        >
                          <CustomInput
                            success={this.state.passwordState === "success"}
                            error={this.state.passwordState === "error"}
                            helpText={this.getPasswordHelpText()}
                            labelText="Password*"
                            id="cau_password"
                            inputProps={{
                              value: this.state.password,
                              type: "password",
                              onChange: event =>
                                this.handleChange("password", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ passwordPristine: false });
                                this.change(event, "password", [
                                  { type: "required" },
                                  {
                                    type: "length",
                                    params: {
                                      min: 8,
                                      max: 16
                                    }
                                  },
                                  { type: "password" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.passwordPristine) {
                                  this.setState({ passwordPristine: false });
                                  this.change(event, "password", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 8,
                                        max: 16
                                      }
                                    },
                                    { type: "password" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem
                          className={classes.customText}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
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
                            id="cau_passwordConfirmation"
                            inputProps={{
                              value: this.state.passwordConfirmation,
                              type: "password",
                              onChange: event =>
                                this.handleChange("passwordConfirmation", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ passwordPristine: false });
                                this.change(event, "passwordConfirmation", [
                                  { type: "required" },
                                  {
                                    type: "matchPassword",
                                    params: this.state.password
                                  },
                                  {
                                    type: "length",
                                    params: {
                                      min: 8,
                                      max: 16
                                    }
                                  },
                                  { type: "password" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.passwordConfirmationPristine) {
                                  this.setState({
                                    passwordConfirmationPristine: false
                                  });
                                  this.change(event, "passwordConfirmation", [
                                    { type: "required" },
                                    {
                                      type: "matchPassword",
                                      params: this.state.password
                                    },
                                    {
                                      type: "length",
                                      params: {
                                        min: 8,
                                        max: 16
                                      }
                                    },
                                    { type: "password" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer
                    spacing={1}
                    style={{ textAlign: "center", marginTop: 20 }}
                  >
                    <GridItem
                      className={classes.customText}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
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
                            CREATE
                          </Button>
                        )}
                      </div>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer style={{ textAlign: "left" }}>
                    <GridItem
                      className={classes.customText}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <div>
                        <em>* Required</em>
                      </div>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

CreateAdminUser.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  addRecord: PropTypes.func,
  countries: PropTypes.array
};

export default withRouter(withStyles(style)(CreateAdminUser));
