import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import NoticeModal from "views/Components/NoticeModal.jsx";
import { endpoint } from "api/endpoint";

import cx from "classnames";
import axios from "axios";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import Phone from "@material-ui/icons/Phone";
import Work from "@material-ui/icons/Work";
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
import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

const yourInterestOptions = [
  { key: "Customer", name: "Customer" },
  { key: "Investor", name: "Investor" },
  { key: "Others", name: "Others" }
];

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
    padding: "4px 24px",
    fontSize: 14
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: -15
    }
  },
  selectFormHelperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "left"
  },
  footer: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5
  },
  countryFormControl: {
    marginTop: 5
  },
  phoneFormControl: {
    paddingTop: 0
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class RegisterYourInterest extends React.Component {
  error = {
    nameErrorMsg: {
      required: "Name is required",
      range: "Name should be 1 to 100 characters"
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
    yourInterestErrorMsg: {
      required: "Your Interest is required"
    },
    otherInterestErrorMsg: {
      required: "Other Interest is required"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      signUpModal: true,
      checked: false,
      preRegisteredUser: false,
      name: "",
      nameState: "",
      namePristine: true,
      nameErrorMsg: [],
      email: "",
      emailState: "",
      emailPristine: true,
      emailErrorMsg: [],
      selectedCallingCode: {},
      callingCode: "",
      callingCodeState: "",
      callingCodeErrorMsg: [],
      phoneNumber: "",
      phoneNumberState: "",
      phoneNumberPristine: true,
      phoneNumberHelpMsg: "(xxx-xxx-xxxx)",
      phoneNumberErrorMsg: [],

      yourInterest: "",
      yourInterestState: "",
      yourInterestErrorMsg: [],

      otherInterest: "",
      otherInterestState: "",
      otherInterestPristine: true,
      otherInterestErrorMsg: [],
      countries: [],
      callInProgress: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
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
  getAlpha2Code = code => {
    let alpha2 = this.state.countries.filter(item => {
      return item.countryCode === code;
    })[0];
    return alpha2;
  };
  submit = () => {
    const state = this.state;

    if (this.isValidated()) {
      let alpha2 = this.getAlpha2Code(state.country);
      let nameArr = state.name.toString().split(" ");
      const contactInfoData = {
        firstName: nameArr[0],
        lastName: nameArr.length > 0 ? nameArr[1] : " ",
        email: state.email,
        countryCode: state.callingCode,
        phoneNumber: state.callingCode + state.phoneNumber.replace(/-/g, ""),
        companyName: "",
        query:
          state.yourInterest === "Others"
            ? state.otherInterest
            : state.yourInterest
      };
      const header = {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      };
      this.setState({ callInProgress: true });
      axios.post(endpoint.BASE_URL_STAGING_AXIOS + "fx-crm/public/contactus", contactInfoData, header).then(
        res => {
          if (res.data.indexOf("errorCode") !== -1) {
            const data = JSON.parse(res.data);
            this.setState({
              callInProgress: false,
              signUpModal: false,
              noticeModal: true,
              noticeModalHeader: "Error",
              noticeModalErrMsg: data.userDesc
            });
          } else {
            this.setState({
              callInProgress: false,
              signUpModal: false,
              noticeModal: true,
              noticeModalHeader: "Thank You",
              noticeModalErrMsg:
                "We have noted your interest and will be in touch with you shortly."
            });
          }
        },
        error => {
          this.setState({
            callInProgress: false,
            signUpModal: false
            // noticeModal: true,
            // noticeModalErrMsg: error.data.userDesc,
          });
        }
      );
    }
  };

  isValidated = () => {
    if (
      // this.state.nameState === 'success' &&
      this.state.emailState === "success"
      //   this.state.callingCodeState === 'success' &&
      //   this.state.phoneNumberState === 'success' &&
      //   this.state.yourInterestState === 'success' &&
      //   this.state.otherInterestState === 'success'
    ) {
      return true;
    } else {
      //   if (this.state.nameState !== 'success') {
      //     this.setState({ nameState: 'error' });
      //   }

      if (this.state.emailState !== "success") {
        this.setState({ emailState: "error" });
      }
      //   if (this.state.callingCodeState !== 'success') {
      //     this.setState({ callingCodeState: 'error' });
      //   }
      //   if (this.state.phoneNumberState !== 'success') {
      //     this.setState({ phoneNumberState: 'error' });
      //   }

      //   if (this.state.yourInterestState !== 'success') {
      //     this.setState({ yourInterestState: 'error' });
      //   }

      //   if (this.state.otherInterestState !== 'success') {
      //     this.setState({ otherInterestState: 'error' });
      //   }
    }
    return false;
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    // if (this.state.checked && modal === "noticeModal") {
    //   x["signUpModal"] = false;
    // }
    this.setState(x);
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  handleLoginSubmit() {
    this.setState({
      signUpModal: false
    });
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
  handleCallingCode = event => {
    const value = event.target.value;
    this.setState({ selectedCallingCode: value });
    this.setState(
      validate(
        value.callingCodes[0],
        "callingCode",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };

  handleToggle() {
    this.setState({
      checked: !this.state.checked
    });
  }

  componentDidMount = () => {
    const { match } = this.props;
    if (match.params.emailId) {
      this.setState({ email: match.params.emailId, preRegisteredUser: true });
    }

    axios.get(endpoint.BASE_URL_STAGING_AXIOS + "fx-crm/public/countriesMetaData").then(
      res => {
        let countries = res.data.countryMetaData;

        // Setting up UK as default country on Top
        const countryCode = "GB";
        let index = -1;
        let currentCountry = countries.find((country, i) => {
          if (country.alpha2Code === countryCode) {
            index = i;
            return true;
          }
        });
        if (currentCountry && index !== -1) {
          countries.splice(index, 1);
          countries.unshift(currentCountry);
        }

        // // Get country http://ip-api.com/json
        // axios.get('http://ip-api.com/json').then(
        //   (response) => {
        //     const countryCode = response.data.countryCode;
        //     let index = -1;
        //     let currentCountry = countries.find((country, i) => {
        //       if (country.alpha2Code === countryCode) {
        //         index = i;
        //         return true;
        //       }
        //     });
        //     if (currentCountry && index !== -1) {
        //       countries.splice(index, 1);
        //       countries.unshift(currentCountry);
        //     }
        this.setState({ countries: countries });
        //   },
        //   () => {}
        // );
      },
      () => {}
    );
  };

  componentDidUpdate(e) {
    if (!this.state.signUpModal && !this.state.noticeModal) {
      e.history.go(-1);
    }
  }

  render() {
    const { classes } = this.props;
    // const callingCodeLabelClasses = classNames({
    //   [" " + classes.labelRootError]: this.state.callingCodeState === "error",
    //   [" " + classes.labelRootSuccess]:
    //     this.state.callingCodeState === "success" &&
    //     !(this.state.callingCodeState === "error")
    // });
    return (
      <div className={cx(classes.container, classes.cardSignup)}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal + " " + classes.loginMaxWidth
          }}
          open={this.state.signUpModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("signUpModal")}
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
              onClick={() => this.handleClose("signUpModal")}
            >
              <CloseIcon />
            </IconButton>
            <>
              <h3 className={cx(classes.modalTitle, classes.signupModalTitle)}>
                Register Your Interest
              </h3>
            </>
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
                      lg={10}
                    >
                      <CustomInput
                        success={this.state.nameState === "success"}
                        error={this.state.nameState === "error"}
                        helpText={
                          this.state.nameState === "error" &&
                          this.state.nameErrorMsg[0]
                        }
                        labelText="Name"
                        id="sp_name"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ namePristine: false });
                            this.change(event, "name", [
                              //  { type: 'required' },
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
                            if (!this.state.namePristine) {
                              this.setState({ namePristine: false });
                              this.change(event, "name", [
                                // { type: 'required' },
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
                        labelText="Email address*"
                        id="sp_email"
                        inputProps={{
                          value: this.state.email,
                          disabled: this.state.preRegisteredUser,
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
                      md={5}
                      lg={5}
                    >
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <FormHelperText
                          className={classes.selectFormHelperText}
                        >
                          Country Code
                        </FormHelperText>

                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.selectedCallingCode}
                          onChange={this.handleCallingCode}
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
                          {this.state.countries.map(item => (
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={item}
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
                    <GridItem
                      className={classes.emptyIcon}
                      xs={1}
                      sm={1}
                      md={1}
                      lg={1}
                    />
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={5}
                      lg={5}
                    >
                      <FormHelperText
                        style={{
                          backgroundColor: "white",
                          paddingTop: 3,
                          margin: "5px 12px 0px 12px",
                          textAlign: "left"
                        }}
                        success={this.state.phoneNumberState === "success"}
                        error={this.state.phoneNumberState === "error"}
                      >
                        Phone Number
                      </FormHelperText>
                      <CustomNumberFormat
                        success={this.state.phoneNumberState === "success"}
                        error={this.state.phoneNumberState === "error"}
                        helpText={
                          this.state.phoneNumberState === "error"
                            ? this.state.phoneNumberErrorMsg[0]
                            : this.state.phoneNumberHelpMsg
                        }
                        id="sp_phoneNumber"
                        // value={this.state.phoneNumber}
                        // labelText="Phone Number*"
                        // format="###-###-####"
                        formControlProps={{
                          fullWidth: true,
                          className: cx(
                            classes.customFormControlClasses,
                            classes.phoneFormControl
                          ),
                          onBlur: event => {
                            this.setState({ phoneNumberPristine: false });
                            this.change(event, "phoneNumber", [
                              // { type: "phone" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.phoneNumberPristine) {
                              this.setState({ phoneNumberPristine: false });
                              this.change(event, "phoneNumber", [
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
                          className={classes.selectFormHelperText}
                        >
                          Your Interest
                        </FormHelperText>

                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.yourInterest}
                          onChange={this.handleSimple}
                          inputProps={{
                            name: "yourInterest",
                            id: "yourInterest"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Option
                          </MenuItem>
                          {yourInterestOptions.map(item => (
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={item.key}
                              key={item.name}
                            >
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem
                      className={classes.emptyIcon}
                      xs={1}
                      sm={1}
                      md={false}
                      lg={false}
                    />

                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={5}
                      style={{
                        visibility:
                          this.state.yourInterest === "Others"
                            ? "visible"
                            : "hidden"
                      }}
                    >
                      <CustomInput
                        success={this.state.otherInterestState === "success"}
                        error={this.state.otherInterestState === "error"}
                        helpText={
                          this.state.otherInterestState === "error" &&
                          this.state.otherInterestErrorMsg[0]
                        }
                        labelText="Other Interest"
                        id="sp_otherInterest"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ otherInterestPristine: false });
                            this.change(event, "otherInterest", [
                              // { type: 'required' }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.otherInterestPristine) {
                              this.setState({ otherInterestPristine: false });
                              this.change(event, "otherInterest", [
                                // { type: 'required' }
                              ]);
                            }
                          }
                        }}
                      />
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
                            SUBMIT
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
        <NoticeModal
          noticeModal={this.state.noticeModal}
          noticeModalHeader={this.state.noticeModalHeader}
          noticeModalErrMsg={this.state.noticeModalErrMsg}
          closeModal={this.closeNoticeModal}
        />
      </div>
    );
  }
}

RegisterYourInterest.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object
};

export default withStyles(style)(RegisterYourInterest);
