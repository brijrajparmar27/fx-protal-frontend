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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import cx from "classnames";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import DescriptionIcon from "@material-ui/icons/Description";
// import LockOutline from "@material-ui/icons/LockOutline";

import { validate } from "../../utils/Validator";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import signupPageStyle from "assets/jss/material-dashboard-pro-react/views/signupPageStyle";
import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

const style = theme => ({
  ...signupPageStyle,
  ...customSelectStyle,
  ...customInputStyle,
  subTitle: {
    float: "left",
    paddingTop: 30
  },
  select: {
    paddingBottom: 10,
    fontSize: 14
  },
  filledSelect: {
    textAlign: "left",
    margin: "0 12px"
  },
  termsText: {
    fontSize: 12,
    color: "darkslategrey"
  },
  mt20neg: {
    marginTop: -20
  },
  mt35neg: {
    marginTop: -35
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: -15
    }
  },
  countryFormControl: {
    marginTop: 5
  },
  expiryField: {
    paddingTop: 0,
    width: "30%",
    margin: "0 5px"
  },
  selectLabel: {
    marginTop: 8,
    color: "#AAAAAA !important",
    fontSize: 14,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: 400,
    lineHeight: 1.42857,
    transform: "translate(0, 1.5px) scale(0.75)",
    transformOrigin: "top left"
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

class UpgradeUserSubscriptionPlan extends React.Component {
  error = {
    volumeNameErrorMsg: {
      required: "volume Name is required"
    },
    planPriceErrorMsg: {
      required: "Plan Price is required"
    },
    paymentMethodErrorMsg: {
      required: "payment Method is required"
    },
    cardTypeErrorMsg: {
      required: "Card Type is required"
    },
    cardNumberErrorMsg: {
      required: "Card Number is required"
    },
    cardNameErrorMsg: {
      required: "Card Name is required"
    },
    cardValidUptoMMErrorMsg: {
      required: "Invalid",
      range: "Invalid"
    },
    cardValidUptoYYErrorMsg: {
      required: "Invalid",
      range: "Invalid"
    },
    cvvErrorMsg: {
      required: "CVV Missing",
      validAmex: "Please enter 4 digit number on the front of the your card"
    },
    cardAddressErrorMsg: {
      required: "Card Registered Address is required"
    },
    cardCityErrorMsg: {
      required: "City is required"
    },
    cardPostalCodeErrorMsg: {
      required: "Postal Code is required"
    },
    cardCountryCodeErrorMsg: {
      required: "Country Code is required"
    },
    cardAccountNameErrorMsg: {
      required: "Account Name is required"
    },
    cardBankNameErrorMsg: {
      required: "Bank Name is required"
    },
    cardAccountNoErrorMsg: {
      required: "Account Number is required"
    },
    cardSortCodeErrorMsg: {
      required: "Sort Code is required"
    }
  };

  initialState = {
    showModal: false,
    noticeModal: false,
    noticeModalErrMsg: "",
    selectedVolume: {
      currencyCode: "",
      id: 0,
      planPrice: "",
      planPriceDesc: "",
      volume: "",
      volumeDesc: ""
    },
    selectedVolumeState: "",
    selectedVolumePristine: true,
    selectedVolumeErrorMsg: [],
    volumeName: "",
    planPrice: "",
    planPriceState: "",
    planPricePristine: true,
    planPriceErrorMsg: [],
    paymentMethod: "",
    paymentMethodState: "",
    paymentMethodPristine: true,
    paymentMethodErrorMsg: [],
    cardType: "",
    cardTypeState: "",
    cardTypePristine: true,
    cardTypeErrorMsg: [],
    cardNumber: "",
    cardNumberState: "",
    cardNumberPristine: true,
    cardNumberErrorMsg: [],
    cardName: "",
    cardNameState: "",
    cardNamePristine: true,
    cardNameErrorMsg: [],
    cvv: "",
    cvvState: "",
    cvvPristine: true,
    cvvErrorMsg: [],
    cardValidUptoMM: "",
    cardValidUptoMMState: "",
    cardValidUptoMMPristine: true,
    cardValidUptoMMErrorMsg: [],
    cardValidUptoYY: "",
    cardValidUptoYYState: "",
    cardValidUptoYYPristine: true,
    cardValidUptoYYErrorMsg: [],
    cardAddress: "",
    cardAddressState: "",
    cardAddressPristine: true,
    cardAddressErrorMsg: [],
    cardCity: "",
    cardCityState: "",
    cardCityPristine: true,
    cardCityErrorMsg: [],
    cardPostalCode: "",
    cardPostalCodeState: "",
    cardPostalCodePristine: true,
    cardPostalCodeErrorMsg: [],
    cardCountryCode: "",
    cardCountryCodeState: "",
    cardCountryCodePristine: true,
    cardCountryCodeErrorMsg: [],
    cardAccountName: "",
    cardAccountNameState: "",
    cardAccountNamePristine: true,
    cardAccountNameErrorMsg: [],
    cardBankName: "",
    cardBankNameState: "",
    cardBankNamePristine: true,
    cardBankNameErrorMsg: [],
    cardAccountNo: "",
    cardAccountNoState: "",
    cardAccountNoPristine: true,
    cardAccountNoErrorMsg: [],
    cardSortCode: "",
    cardSortCodeState: "",
    cardSortCodePristine: true,
    cardSortCodeErrorMsg: [],
    paymentMethodOptions: ["Credit card", "Direct Debit"],
    cardTypeOptions: ["MasterCard", "Visa", "Amex", "Debit"],
    countries: [],
    role: "",
    callInProgress: false
  };
  constructor(props) {
    super(props);
    this.fileUploadComponent = React.createRef();

    this.state = this.initialState;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let role = "";
      if (props.showModal) {
        role = sessionStorage.getItem("role");
      }
      return {
        showModal: props.showModal,
        role: role
      };
    }
    return null;
  }
  change = (event, stateName, rules) => {
    if (stateName === "cvv" && this.state.cardType === "Amex") {
      rules.push({ type: "validAmex" });
    }
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };
  submit = () => {
    if (this.isValidated()) {
      let record = {
        subscriptionPlanId: this.props.planOptions.id,
        subscriptionPlanVolumeId: this.state.selectedVolume.id,
        subscriptionPlanName: this.props.planOptions.name
      };

      if (this.state.paymentMethod === "Credit card") {
        record = {
          ...record,
          paymentMethod: "Credit card",
          typeOfCard: this.state.cardType,
          cardNumber: this.state.cardNumber,
          name: this.state.cardName,
          cvv: this.state.cvv,
          validUpTo:
            this.state.cardValidUptoMM + "/" + this.state.cardValidUptoYY,
          address: {
            address: this.state.cardAddress,
            city: this.state.cardCity,
            postalCode: this.state.cardPostalCode,
            countryCode: this.state.cardCountryCode,
            addressType: "REGISTERED_ADDRESS"
          }
        };
      } else {
        record = {
          ...record,
          paymentMethod: "Debit card",
          accountNumber: this.state.cardAccountNo,
          bankName: this.state.cardBankName,
          name: this.state.cardAccountName,
          sortCode: this.state.cardSortCode
        };
      }

      // res.data.path
      this.props.upgradePlan(record);
      this.closeModal();
    }
  };
  isValidated = () => {
    if (
      this.state.selectedVolumeState === "success" &&
      this.state.cardTypeState === "success" &&
      this.state.paymentMethodState === "success" &&
      ((this.state.paymentMethod === "Credit card" &&
        this.state.cardNumberState === "success" &&
        this.state.cardNameState === "success" &&
        this.state.cvvState === "success" &&
        this.state.cardValidUptoMMState === "success" &&
        this.state.cardValidUptoYYState === "success" &&
        this.state.cardAddressState === "success" &&
        this.state.cardCityState === "success" &&
        this.state.cardPostalCodeState === "success" &&
        this.state.cardCountryCodeState === "success") ||
        (this.state.paymentMethod === "Direct Debit" &&
          this.state.cardAccountNameState === "success" &&
          this.state.cardBankNameState === "success" &&
          this.state.cardAccountNoState === "success" &&
          this.state.cardSortCodeState === "success"))
    ) {
      return true;
    } else {
      if (this.state.selectedVolumeState !== "success") {
        this.setState({ selectedVolumeState: "error" });
      }
      if (this.state.paymentMethodState !== "success") {
        this.setState({ paymentMethodState: "error" });
      }
      if (this.state.cardTypeState !== "success") {
        this.setState({ cardTypeState: "error" });
      }
      if (this.state.paymentMethod === "Credit card") {
        if (this.state.cardNumberState !== "success") {
          this.setState({ cardNumberState: "error" });
        }
        if (this.state.cardNameState !== "success") {
          this.setState({ cardNameState: "error" });
        }
        if (this.state.cvvState !== "success") {
          this.setState({ cvvState: "error" });
        }
        if (this.state.cardValidUptoMMState !== "success") {
          this.setState({ cardValidUptoMMState: "error" });
        }
        if (this.state.cardValidUptoYYState !== "success") {
          this.setState({ cardValidUptoYYState: "error" });
        }
        if (this.state.cardAddressState !== "success") {
          this.setState({ cardAddressState: "error" });
        }
        if (this.state.cardCityState !== "success") {
          this.setState({ cardCityState: "error" });
        }
        if (this.state.cardPostalCodeState !== "success") {
          this.setState({ cardPostalCodeState: "error" });
        }
        if (this.state.cardCountryCodeState !== "success") {
          this.setState({ cardCountryCodeState: "error" });
        }
      }
      if (this.state.paymentMethod === "Direct Debit") {
        if (this.state.cardBankNameState !== "success") {
          this.setState({ cardBankNameState: "error" });
        }
        if (this.state.cardAccountNameState !== "success") {
          this.setState({ cardAccountNameState: "error" });
        }
        if (this.state.cardAccountNoState !== "success") {
          this.setState({ cardAccountNoState: "error" });
        }
        if (this.state.cardSortCodeState !== "success") {
          this.setState({ cardSortCodeState: "error" });
        }
      }
    }
    return false;
  };
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }
  closeModal() {
    this.setState({
      ...this.initialState
    });
    if (this.fileUploadComponent && this.fileUploadComponent.current)
      this.fileUploadComponent.current.handleRemove();
    this.props.closeModal();
  }
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  componentDidMount = () => {
    this.initalizeState();
  };

  initalizeState = () => {
    this.setState(this.initialState);
    if (this.fileUploadComponent && this.fileUploadComponent.current)
      this.fileUploadComponent.current.handleRemove();
  };
  getFile = (name, file) => {
    this.setState({ [name]: file });
  };
  handleDateChange = date => {
    this.setState(
      validate(
        date,
        "reportDate",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };
  handleDocType = (name, event) => {
    const value = event.target.value;
    if (name === "selectedVolume") {
      this.setState(
        validate(value.volumeDesc, name, this.state, [{ type: "required" }], this.error)
      );
      this.setState({ selectedVolume: value });
      this.setState({ volumeName: value.volumeDesc });
      this.setState({ planPrice: value.planPriceDesc });
    } else {
      this.setState(
        validate(value, name, this.state, [{ type: "required" }], this.error)
      );
    }
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
          open={this.state.showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.closeModal()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="activity_classic-modal-slide-title"
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
              UPGRADE SUBSCRIPTION PLAN
            </h3>
          </DialogTitle>
          <DialogContent
            id="activity_classic-modal-slide-description"
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
                      md={7}
                      lg={7}
                    >
                      <CustomInput
                        labelText="Plan Name"
                        id="uusp_planName"
                        inputProps={{
                          value:
                            this.props.planOptions &&
                            this.props.planOptions.name
                              ? this.props.planOptions.name
                              : "",
                          disabled: true
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                      />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={3}
                      lg={3}
                    >
                      <CustomInput
                        labelText="Validity (in days)"
                        id="uusp_validity"
                        inputProps={{
                          value:
                            this.props.planOptions &&
                            this.props.planOptions.validatyInDays
                              ? this.props.planOptions.validatyInDays
                              : "",
                          disabled: true
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
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
                      <Face className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={5}
                      lg={5}
                    >
                      <FormControl fullWidth className={classes.filledSelect}>
                        <FormHelperText
                          style={{
                            top: 10,
                            color: "#AAAAAA !important",
                            fontSize: 14,
                            fontFamily:
                              "'Roboto', 'Helvetica', 'Arial', sans-serif",
                            fontWeight: 400,
                            lineHeight: 1.42857,
                            transform: "translate(0, 1.5px) scale(0.75)",
                            transformOrigin: "top left"
                          }}
                          success={this.state.selectedVolumeState === "success"}
                          error={this.state.selectedVolumeState === "error"}
                          helpText={
                            this.state.selectedVolumeState === "error" &&
                            this.state.selectedVolumeErrorMsg[0]
                          }
                        >
                          Choose your FX volume per year:
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.selectedVolume}
                          onChange={event =>
                            this.handleDocType("selectedVolume", event)
                          }
                          inputProps={{
                            name: "selectedVolume",
                            id: "selectedVolume",
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"docType"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose FX Volume
                          </MenuItem>
                          {this.props.volumeOptions &&
                            this.props.volumeOptions.map(item => (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={item}
                                key={item.id}
                              >
                                {item.volumeDesc}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={5}
                      lg={5}
                    >
                      <CustomInput
                        labelText="price*"
                        id="uusp_planPrice"
                        inputProps={{
                          value: this.state.planPrice,
                          disabled: true
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
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
                      <LocalMallIcon className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={5}
                      lg={5}
                    >
                      <FormControl fullWidth className={classes.filledSelect}>
                        <FormHelperText
                          style={{
                            top: 10,
                            color: "#AAAAAA !important",
                            fontSize: 14,
                            fontFamily:
                              "'Roboto', 'Helvetica', 'Arial', sans-serif",
                            fontWeight: 400,
                            lineHeight: 1.42857,
                            transform: "translate(0, 1.5px) scale(0.75)",
                            transformOrigin: "top left"
                          }}
                          success={this.state.paymentMethodState === "success"}
                          error={this.state.paymentMethodState === "error"}
                          helpText={
                            this.state.paymentMethodState === "error" &&
                            this.state.paymentMethodErrorMsg[0]
                          }
                        >
                          Payment Method:
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.paymentMethod}
                          onChange={event =>
                            this.handleDocType("paymentMethod", event)
                          }
                          disabled={this.state.role === "role-prospect"}
                          inputProps={{
                            name: "paymentMethod",
                            id: "paymentMethod",
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"paymentMethod"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Card
                          </MenuItem>
                          {this.state.paymentMethodOptions &&
                            this.state.paymentMethodOptions.map(item => (
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
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={5}
                      lg={5}
                    />
                  </GridContainer>
                </GridItem>
                {this.state.paymentMethod === "Credit card" && (
                  <>
                    {/* Credit Card payment method is choosen */}
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer spacing={1} alignItems="center">
                        <GridItem
                          xs={1}
                          sm={1}
                          md={1}
                          lg={1}
                          className={classes.textIcon}
                        >
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
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
                            className={classes.filledSelect}
                          >
                            <FormHelperText
                              style={{
                                top: 10,
                                color: "#AAAAAA !important",
                                fontSize: 14,
                                fontFamily:
                                  "'Roboto', 'Helvetica', 'Arial', sans-serif",
                                fontWeight: 400,
                                lineHeight: 1.42857,
                                transform: "translate(0, 1.5px) scale(0.75)",
                                transformOrigin: "top left"
                              }}
                              success={this.state.cardTypeState === "success"}
                              error={this.state.cardTypeState === "error"}
                              helpText={
                                this.state.cardTypeState === "error" &&
                                this.state.cardTypeErrorMsg[0]
                              }
                            >
                              Card Type*
                            </FormHelperText>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              value={this.state.cardType}
                              onChange={event =>
                                this.handleDocType("cardType", event)
                              }
                              inputProps={{
                                name: "cardType",
                                id: "cardType",
                                classes: {
                                  icon: classes.white,
                                  root: classes.selectDropDown
                                }
                              }}
                            >
                              <MenuItem
                                disabled
                                key={"cardType"}
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                Choose Card Type
                              </MenuItem>
                              {this.state.cardTypeOptions &&
                                this.state.cardTypeOptions.map(item => (
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
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer spacing={1} alignItems="center">
                        <GridItem
                          xs={1}
                          sm={1}
                          md={1}
                          lg={1}
                          className={classes.textIcon}
                        >
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <CustomInput
                            success={this.state.cardNameState === "success"}
                            error={this.state.cardNameState === "error"}
                            helpText={
                              this.state.cardNameState === "error" &&
                              this.state.cardNameErrorMsg[0]
                            }
                            labelText="Name on Card*"
                            id="uusp_cardName"
                            inputProps={{
                              value: this.state.cardName,
                              onChange: event =>
                                this.handleChange("cardName", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ cardNamePristine: false });
                                this.change(event, "cardName", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardNamePristine) {
                                  this.setState({ cardNamePristine: false });
                                  this.change(event, "cardName", [
                                    { type: "required" }
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
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={8}
                          sm={8}
                          md={5}
                          lg={5}
                        >
                          <CustomInput
                            success={this.state.cardNumberState === "success"}
                            error={this.state.cardNumberState === "error"}
                            helpText={
                              this.state.cardNumberState === "error" &&
                              this.state.cardNumberErrorMsg[0]
                            }
                            labelText="Card Number*"
                            id="uusp_cardNumber"
                            inputProps={{
                              value: this.state.cardNumber,
                              onChange: event =>
                                this.handleChange("cardNumber", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ cardNumberPristine: false });
                                this.change(event, "cardNumber", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardNumberPristine) {
                                  this.setState({ cardNumberPristine: false });
                                  this.change(event, "cardNumber", [
                                    { type: "required" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={4}
                          sm={4}
                          md={2}
                          lg={2}
                        >
                          <CustomInput
                            success={this.state.cvvState === "success"}
                            error={this.state.cvvState === "error"}
                            helpText={
                              this.state.cvvState === "error" &&
                              this.state.cvvErrorMsg[0]
                            }
                            labelText="CVV Number*"
                            id="uusp_cvv"
                            inputProps={{
                              value: this.state.cvv,
                              onChange: event => this.handleChange("cvv", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ cvvPristine: false });
                                this.change(event, "cvv", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cvvPristine) {
                                  this.setState({ cvvPristine: false });
                                  this.change(event, "cvv", [
                                    { type: "required" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={5}
                          sm={5}
                          md={3}
                          lg={3}
                        >
                          <FormHelperText
                            style={{
                              top: 10,
                              color: "#AAAAAA !important",
                              fontSize: 14,
                              fontFamily:
                                "'Roboto', 'Helvetica', 'Arial', sans-serif",
                              fontWeight: 400,
                              lineHeight: 1.42857,
                              transform: "translate(0, 1.5px) scale(0.75)",
                              transformOrigin: "top left"
                            }}
                            success={
                              this.state.cardValidUptoMMState === "success"
                            }
                            error={this.state.cardValidUptoMMState === "error"}
                            helpText={
                              this.state.cardValidUptoMMState === "error" &&
                              this.state.cardValidUptoMMErrorMsg[0]
                            }
                          >
                            Expiry Date*
                          </FormHelperText>
                          <div style={{ display: "inline-block" }}>
                            <CustomInput
                              success={
                                this.state.cardValidUptoMMState === "success"
                              }
                              error={
                                this.state.cardValidUptoMMState === "error"
                              }
                              helpText={
                                this.state.cardValidUptoMMState === "error" &&
                                this.state.cardValidUptoMMErrorMsg[0]
                              }
                              // labelText='Card Number*'
                              id="uusp_cardValidUptoMM"
                              inputProps={{
                                value: this.state.cardValidUptoMM,
                                placeholder: "MM",
                                onChange: event =>
                                  this.handleChange("cardValidUptoMM", event)
                              }}
                              formControlProps={{
                                // fullWidth: true,
                                className: cx(
                                  classes.customFormControlClasses,
                                  classes.expiryField
                                ),
                                onBlur: event => {
                                  this.setState({
                                    cardValidUptoMMPristine: false
                                  });
                                  this.change(event, "cardValidUptoMM", [
                                    { type: "required" },
                                    {
                                      type: "range",
                                      params: {
                                        min: 1,
                                        max: 12
                                      }
                                    }
                                  ]);
                                },
                                onChange: event => {
                                  if (!this.state.cardValidUptoMMPristine) {
                                    this.setState({
                                      cardValidUptoMMPristine: false
                                    });
                                    this.change(event, "cardValidUptoMM", [
                                      { type: "required" },
                                      {
                                        type: "range",
                                        params: {
                                          min: 1,
                                          max: 12
                                        }
                                      }
                                    ]);
                                  }
                                }
                              }}
                            />
                            {/* </GridItem> */}
                            <span style={{ marginTop: 30 }}>/</span>
                            {/* <GridItem
                          className={classes.customText}
                          xs={5}
                          sm={5}
                          md={1}
                          lg={1}
                        > */}
                            <CustomInput
                              success={
                                this.state.cardValidUptoYYState === "success"
                              }
                              error={
                                this.state.cardValidUptoYYState === "error"
                              }
                              helpText={
                                this.state.cardValidUptoYYState === "error" &&
                                this.state.cardValidUptoYYErrorMsg[0]
                              }
                              // labelText='Card Number*'
                              id="uusp_cardValidUptoYY"
                              inputProps={{
                                value: this.state.cardValidUptoYY,
                                placeholder: "YY",
                                onChange: event =>
                                  this.handleChange("cardValidUptoYY", event)
                              }}
                              formControlProps={{
                                // fullWidth: true,
                                className: cx(
                                  classes.customFormControlClasses,
                                  classes.expiryField
                                ),
                                onBlur: event => {
                                  this.setState({
                                    cardValidUptoYYPristine: false
                                  });
                                  this.change(event, "cardValidUptoYY", [
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 2
                                      }
                                    }
                                  ]);
                                },
                                onChange: event => {
                                  if (!this.state.cardValidUptoYYPristine) {
                                    this.setState({
                                      cardValidUptoYYPristine: false
                                    });
                                    this.change(event, "cardValidUptoYY", [
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 2
                                        }
                                      }
                                    ]);
                                  }
                                }
                              }}
                            />
                          </div>
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
                          <DescriptionIcon
                            className={classes.inputAdornmentIcon}
                          />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <b className={classes.subTitle}>
                            Card Registered Address
                          </b>
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
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          xs={10}
                          sm={10}
                          md={7}
                          lg={7}
                          className={classes.customText}
                        >
                          <CustomInput
                            success={this.state.cardAddressState === "success"}
                            error={this.state.cardAddressState === "error"}
                            helpText={
                              this.state.cardAddressState === "error" &&
                              this.state.cardAddressErrorMsg[0]
                            }
                            labelText="Address*"
                            id="uusp_cardAddress"
                            inputProps={{
                              value: this.state.cardAddress,
                              onChange: event =>
                                this.handleChange("cardAddress", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ cardAddressPristine: false });
                                this.change(event, "cardAddress", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardAddressPristine) {
                                  this.setState({ cardAddressPristine: false });
                                  this.change(event, "cardAddress", [
                                    { type: "required" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                        <GridItem xs={10} sm={10} md={3} lg={3}>
                          <CustomInput
                            success={
                              this.state.cardPostalCodeState === "success"
                            }
                            error={this.state.cardPostalCodeState === "error"}
                            helpText={
                              this.state.cardPostalCodeState === "error" &&
                              this.state.cardPostalCodeErrorMsg[0]
                            }
                            labelText="Postal Code*"
                            id="uusp_cardPostalCode"
                            inputProps={{
                              value: this.state.cardPostalCode,
                              onChange: event =>
                                this.handleChange("cardPostalCode", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({
                                  cardPostalCodePristine: false
                                });
                                this.change(event, "cardPostalCode", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardPostalCodePristine) {
                                  this.setState({
                                    cardPostalCodePristine: false
                                  });
                                  this.change(event, "cardPostalCode", [
                                    { type: "required" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer spacing={1} alignItems="left">
                        <GridItem
                          xs={1}
                          sm={1}
                          md={1}
                          lg={1}
                          className={classes.textIcon}
                        >
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem xs={12} sm={10} md={5} lg={5}>
                          <CustomInput
                            success={this.state.cardCityState === "success"}
                            error={this.state.cardCityState === "error"}
                            helpText={
                              this.state.cardCityState === "error" &&
                              this.state.cardCityErrorMsg[0]
                            }
                            labelText="City*"
                            id="uusp_cardCity"
                            inputProps={{
                              value: this.state.cardCity,
                              onChange: event =>
                                this.handleChange("cardCity", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ cardCityPristine: false });
                                this.change(event, "cardCity", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardCityPristine) {
                                  this.setState({ cardCityPristine: false });
                                  this.change(event, "cardCity", [
                                    { type: "required" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={10} md={5} lg={5}>
                          <FormControl
                            fullWidth
                            className={classes.countryFormControl}
                          >
                            <FormHelperText
                              style={{
                                top: 10,
                                color: "#AAAAAA !important",
                                fontSize: 14,
                                fontFamily:
                                  "'Roboto', 'Helvetica', 'Arial', sans-serif",
                                fontWeight: 400,
                                lineHeight: 1.42857,
                                transform: "translate(0, 1.5px) scale(0.75)",
                                transformOrigin: "top left"
                              }}
                              success={
                                this.state.cardCountryCodeState === "success"
                              }
                              error={
                                this.state.cardCountryCodeState === "error"
                              }
                              helpText={
                                this.state.cardCountryCodeState === "error" &&
                                this.state.cardCountryCodeErrorMsg[0]
                              }
                            >
                              Country*
                            </FormHelperText>
                            {/* <InputLabel
                              htmlFor="type"
                              style={{
                                top: 10,
                                color: "#AAAAAA !important",
                                fontSize: 14,
                                fontFamily:
                                  "'Roboto', 'Helvetica', 'Arial', sans-serif",
                                fontWeight: 400,
                                lineHeight: 1.42857,
                                transform: "translate(0, 1.5px) scale(0.75)",
                                transformOrigin: "top left"
                              }}
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
                              value={this.state.cardCountryCode}
                              onChange={event =>
                                this.handleDocType("cardCountryCode", event)
                              }
                              inputProps={{
                                name: "cardCountryCode",
                                id: "cardCountryCode"
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
                              {this.props.countries.map(item => (
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
                          </FormControl>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </>
                )}
                {this.state.paymentMethod === "Direct Debit" && (
                  <>
                    {/* Direct Debit payment method is choosen */}
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer spacing={1} alignItems="center">
                        <GridItem
                          xs={1}
                          sm={1}
                          md={1}
                          lg={1}
                          className={classes.textIcon}
                        >
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <CustomInput
                            success={
                              this.state.cardAccountNameState === "success"
                            }
                            error={this.state.cardAccountNameState === "error"}
                            helpText={
                              this.state.cardAccountNameState === "error" &&
                              this.state.cardAccountNameErrorMsg[0]
                            }
                            labelText="Account Name*"
                            id="uusp_cardAccountName"
                            inputProps={{
                              value: this.state.cardAccountName,
                              onChange: event =>
                                this.handleChange("cardAccountName", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({
                                  cardAccountNamePristine: false
                                });
                                this.change(event, "cardAccountName", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardAccountNamePristine) {
                                  this.setState({
                                    cardAccountNamePristine: false
                                  });
                                  this.change(event, "cardAccountName", [
                                    { type: "required" }
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
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <CustomInput
                            success={this.state.cardBankNameState === "success"}
                            error={this.state.cardBankNameState === "error"}
                            helpText={
                              this.state.cardBankNameState === "error" &&
                              this.state.cardBankNameErrorMsg[0]
                            }
                            labelText="Bank Name*"
                            id="uusp_cardBankName"
                            inputProps={{
                              value: this.state.cardBankName,
                              onChange: event =>
                                this.handleChange("cardBankName", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ cardBankNamePristine: false });
                                this.change(event, "cardBankName", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardBankNamePristine) {
                                  this.setState({
                                    cardBankNamePristine: false
                                  });
                                  this.change(event, "cardBankName", [
                                    { type: "required" }
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
                          {/* <Face className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={7}
                          sm={7}
                          md={7}
                          lg={7}
                        >
                          <CustomInput
                            success={
                              this.state.cardAccountNoState === "success"
                            }
                            error={this.state.cardAccountNoState === "error"}
                            helpText={
                              this.state.cardAccountNoState === "error" &&
                              this.state.cardAccountNoErrorMsg[0]
                            }
                            labelText="Account Number*"
                            id="uusp_cardAccountNo"
                            inputProps={{
                              value: this.state.cardAccountNo,
                              onChange: event =>
                                this.handleChange("cardAccountNo", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({ cardAccountNoPristine: false });
                                this.change(event, "cardAccountNo", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardAccountNoPristine) {
                                  this.setState({
                                    cardAccountNoPristine: false
                                  });
                                  this.change(event, "cardAccountNo", [
                                    { type: "required" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={3}
                          sm={3}
                          md={3}
                          lg={3}
                        >
                          <CustomInput
                            success={this.state.cardSortCodeState === "success"}
                            error={this.state.cardSortCodeState === "error"}
                            helpText={
                              this.state.cardSortCodeState === "error" &&
                              this.state.cardSortCodeErrorMsg[0]
                            }
                            labelText="Sort Code*"
                            id="uusp_cardSortCode"
                            inputProps={{
                              value: this.state.cardSortCode,
                              onChange: event =>
                                this.handleChange("cardSortCode", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                this.setState({
                                  cardSortCodePristine: false
                                });
                                this.change(event, "cardSortCode", [
                                  { type: "required" }
                                ]);
                              },
                              onChange: event => {
                                if (!this.state.cardSortCodePristine) {
                                  this.setState({
                                    cardSortCodePristine: false
                                  });
                                  this.change(event, "cardSortCode", [
                                    { type: "required" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </>
                )}
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div
                    className={classes.center}
                    style={{ textAlign: "center", paddingTop: 20 }}
                  >
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      onClick={this.submit}
                    >
                      PAY & ACCEPT PLAN
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

UpgradeUserSubscriptionPlan.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  upgradePlan: PropTypes.func.isRequired,
  planOptions: PropTypes.object.isRequired,
  volumeOptions: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired
};

export default withRouter(withStyles(style)(UpgradeUserSubscriptionPlan));
