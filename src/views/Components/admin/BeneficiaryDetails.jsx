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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";
import cx from "classnames";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NoticeModal from "views/Components/NoticeModal.jsx";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { validate } from "utils/Validator";
import addBeneficiaryStyle from "assets/jss/material-dashboard-pro-react/views/addBeneficiaryStyle.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class BeneficiaryDetails extends React.Component {
  error = {
    bankCodeErrorMsg: {
      required: "Company name is required",
      range: "Company name should be 1 to 100 characters"
    },
    emailAddressErrorMsg: {
      required: "Email Address is required",
      valid: "Please enter a valid email"
    },
    nameErrorMsg: {
      required: "Beneficiary Name is required"
    },
    bankNameErrorMsg: {
      required: "Bank Name is required"
    },
    bankCurrencyErrorMsg: {
      required: "Currency is required"
    },
    bankWalletErrorMsg: {
      required: "Wallet is required"
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
    countryCodeErrorMsg: {
      required: "Country is required"
    },
    bicNumberErrorMsg: {
      required: "BIC Number is required"
    },
    accountNumberErrorMsg: {
      required: "Account Number is required"
    }
  };
  initialState = {
    cardAnimaton: "cardHidden",
    showModal: true,
    bankCode: "",
    bankCodeState: "",
    bankCodePristine: true,
    bankCodeErrorMsg: [],
    emailAddress: "",
    emailAddressState: "",
    emailAddressPristine: true,
    emailAddressErrorMsg: [],
    name: "",
    nameState: "",
    namePristine: true,
    nameErrorMsg: [],
    bankName: "",
    bankNameState: "",
    bankNamePristine: true,
    bankNameErrorMsg: [],
    bankCurrency: "",
    bankCurrencyState: "",
    bankCurrencyErrorMsg: [],
    bankWallet: "",
    bankWalletState: "",
    bankWalletErrorMsg: [],
    address: "",
    addressState: "",
    addressPristine: true,
    addressErrorMsg: [],
    address2: "",
    city: "",
    cityState: "",
    cityPristine: true,
    cityErrorMsg: [],
    postalCode: "",
    postalCodeState: "",
    postalCodePristine: true,
    postalCodeErrorMsg: [],
    countries: [],
    countryCode: "",
    countryCodeState: "",
    // countryCodePristine: true,
    countryCodeErrorMsg: [],
    countryName: "",
    bicNumber: "",
    bicNumberState: "",
    bicNumberPristine: true,
    bicNumberErrorMsg: [],
    accountNumber: "",
    accountNumberState: "",
    accountNumberPristine: true,
    accountNumberErrorMsg: [],
    sortCode: "",
    sortCodeState: "",
    sortCodePristine: true,
    sortCodeErrorMsg: [],
    iban: "",
    ibanState: "",
    ibanPristine: true,
    ibanErrorMsg: [],
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
  isValidated = () => {
    if (
      this.state.emailAddressState === "success" &&
      this.state.nameState === "success" &&
      this.state.bankNameState === "success" &&
      this.state.bankCurrencyState === "success" &&
      this.state.addressState === "success" &&
      this.state.cityState === "success" &&
      this.state.countryCodeState === "success" &&
      this.state.postalCodeState === "success" &&
      // this.state.bicNumberState === "success" &&
      // this.state.accountNumberState === "success" &&
      // this.state.sortCodeState === "success" &&
      this.state.ibanState === "success"
    ) {
      if (this.props.type === "FXG_LP") {
        if (this.state.bankCodeState === "success") return true;
        else {
          if (this.state.bankCodeState !== "success") {
            this.setState({ bankCodeState: "error" });
          }
          return false;
        }
      } else return true;
    } else {
      if (this.state.emailAddressState !== "success") {
        this.setState({ emailAddressState: "error" });
      }
      if (this.state.nameState !== "success") {
        this.setState({ nameState: "error" });
      }
      if (this.state.bankNameState !== "success") {
        this.setState({ bankNameState: "error" });
      }
      if (this.state.bankCurrencyState !== "success") {
        this.setState({ bankCurrencyState: "error" });
      }
      if (this.state.addressState !== "success") {
        this.setState({ addressState: "error" });
      }
      if (this.state.cityState !== "success") {
        this.setState({ cityState: "error" });
      }
      if (this.state.countryCodeState !== "success") {
        this.setState({ countryCodeState: "error" });
      }
      if (this.state.postalCodeState !== "success") {
        this.setState({ postalCodeState: "error" });
      }
      // if (this.state.bicNumberState !== "success") {
      //   this.setState({ bicNumberState: "error" });
      // }
      // if (this.state.accountNumberState !== "success") {
      //   this.setState({ accountNumberState: "error" });
      // }
      // if (this.state.sortCodeState !== "success") {
      //   this.setState({ sortCodeState: "error" });
      // }
      if (this.state.ibanState !== "success") {
        this.setState({ ibanState: "error" });
      }
    }
    return false;
  };
  validateRule = rules => {
    if (rules.length > 0) {
      let status = false;
      rules.forEach(rule => {
        let ls = true;
        let ruleArr = rule.split(",");
        ruleArr.forEach(r => (ls = ls && this.state[r] !== ""));
        status = status || ls;
      });
      return status;
    } else return false;
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
    this.props.closeModal();
  }
  getAlpha2Code = code => {
    let alpha2 = this.state.countries.filter(item => {
      return item.countryCode === code;
    })[0];
    return alpha2;
  };
  addBeneficiary = async () => {
    if (this.isValidated()) {
      let alpha2 = this.getAlpha2Code(this.state.countryCode);

      // Get Account Validation
      const res = await apiHandler({
        url:
          endpoint.ADMIN_LP_ADD_RULE +
          alpha2.alpha2Code +
          "/" +
          this.state.bankCurrency,
        authToken: sessionStorage.getItem("token")
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
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
        const rule = res.data;
        if (this.validateRule(rule)) {
          let data = {
            name: this.state.name,
            bankName: this.state.bankName,
            email: this.state.emailAddress,
            addressLine1: this.state.address,
            addressLine2: this.state.address2,
            city: this.state.city,
            postalCode: this.state.postalCode,
            country: alpha2 ? alpha2.alpha2Code : "",
            currency: this.state.bankCurrency,
            iban: this.state.iban,
            swiftBic:
              this.state.bicNumber && this.state.bicNumber !== ""
                ? this.state.bicNumber
                : null,
            fxgBeneficiary: true
          };
          if (this.props.type === "FXG_LP") {
            data = {
              ...data,
              code: this.state.bankCode,
              accountNumber:
                this.state.accountNumber && this.state.accountNumber !== ""
                  ? this.state.accountNumber
                  : null,
              sortCode:
                this.state.sortCode && this.state.sortCode !== ""
                  ? this.state.sortCode
                  : null
            };
          }
          this.props.addBeneficiary(data);
          this.initalizeState();
          this.props.closeModal();
        }
      }
    }
  };
  componentDidMount() {
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
  };
  getCountries = async () => {
    const res = await apiHandler({
      url: endpoint.COUNTRIES,
      authToken: sessionStorage.getItem("token")
    });
    const countries = res.data.countryMetaData;
    this.setState({ countries: countries });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let beneficiary = {};
      if (props.showModal) {
        beneficiary = BeneficiaryDetails.initialState;
        // if (props.showEditBeneficiary) {
        beneficiary = { ...beneficiary, ...props.beneficiary };
        // }
      }

      return {
        showModal: props.showModal,
        ...beneficiary
      };
    }
    return null;
  }
  handleSimpleChange = event => {
    // this.setState({ [event.target.name]: event.target.value });
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
  handleCountryChange = event => {
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
  handleChecked = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
    this.initalizeState();
  }
  render() {
    const { classes, type } = this.props;

    const walletCurrencies =
      type === "FXG_BENF" ? Object.keys(this.props.wallets) : [];
    // const currencyWallets =
    //   type !== "FXG_BENF"
    //     ? []
    //     : this.props.wallets[this.state.bankCurrency]
    //     ? this.props.wallets[this.state.bankCurrency]
    //     : [];

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
            {type === "FXG_BENF" ? (
              <h3
                style={{ textAlign: "left", fontSize: 20, display: "inline" }}
              >
                New FXG Benefeciary
              </h3>
            ) : (
              <h3
                style={{ textAlign: "left", fontSize: 20, display: "inline" }}
              >
                New Liquidity Provider
              </h3>
            )}
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <form className={classes.form}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={3} lg={3}>
                  <CustomInput
                    success={this.state.nameState === "success"}
                    error={this.state.nameState === "error"}
                    helpText={
                      this.state.nameState === "error" &&
                      this.state.nameErrorMsg[0]
                    }
                    labelText="Name*"
                    id="nb_name"
                    inputProps={{
                      value: this.state.name,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event => this.handleChange("name", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ namePristine: false });
                        this.change(event, "name", [{ type: "required" }]);
                      },
                      onChange: event => {
                        if (!this.state.namePristine) {
                          this.setState({ namePristine: false });
                          this.change(event, "name", [{ type: "required" }]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3} lg={3}>
                  <CustomInput
                    success={this.state.bankNameState === "success"}
                    error={this.state.bankNameState === "error"}
                    helpText={
                      this.state.bankNameState === "error" &&
                      this.state.bankNameErrorMsg[0]
                    }
                    labelText="Bank Name*"
                    id="nb_bankName"
                    inputProps={{
                      value: this.state.bankName,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event => this.handleChange("bankName", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ bankNamePristine: false });
                        this.change(event, "bankName", [{ type: "required" }]);
                      },
                      onChange: event => {
                        if (!this.state.bankNamePristine) {
                          this.setState({ bankNamePristine: false });
                          this.change(event, "bankName", [
                            { type: "required" }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                {type === "FXG_LP" ? (
                  <>
                    <GridItem xs={12} sm={12} md={3} lg={3}>
                      <CustomInput
                        success={this.state.bankCodeState === "success"}
                        error={this.state.bankCodeState === "error"}
                        helpText={
                          this.state.bankCodeState === "error" &&
                          this.state.bankCodeErrorMsg[0]
                        }
                        labelText="Bank Code*"
                        id="nb_bankCode"
                        inputProps={{
                          value: this.state.bankCode,
                          disabled: this.props.isDisabled
                            ? this.props.isDisabled
                            : false,
                          onChange: event =>
                            this.handleChange("bankCode", event)
                        }}
                        formControlProps={{
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ bankCodePristine: false });
                            this.change(event, "bankCode", [
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
                            if (!this.state.bankCodePristine) {
                              this.setState({ bankCodePristine: false });
                              this.change(event, "bankCode", [
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
                      <FormControl style={{ paddingTop: 2 }}>
                        <FormHelperText
                          className={classes.selectLabel}
                          success={this.state.bankCurrencyState === "success"}
                          error={this.state.bankCurrencyState === "error"}
                          helpText={
                            this.state.bankCurrencyState === "error" &&
                            this.state.bankCurrencyErrorMsg[0]
                          }
                        >
                          Currency*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.bankCurrency}
                          onChange={this.handleSimpleChange}
                          inputProps={{
                            name: "bankCurrency",
                            id: "bankCurrency",
                            disabled: this.props.isDisabled
                              ? this.props.isDisabled
                              : false,
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"currencyText"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Currency
                          </MenuItem>
                          {this.props.currencies.map(item => (
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
                  </>
                ) : (
                  //   <CustomInput
                  //   success={this.state.bankCodeState === "success"}
                  //   error={this.state.bankCodeState === "error"}
                  //   helpText={
                  //     this.state.bankCodeState === "error" &&
                  //     this.state.bankCodeErrorMsg[0]
                  //   }
                  //   labelText="Bank Code*"
                  //   id="nb_bankCode"
                  //   inputProps={{
                  //     value: this.state.bankCode,
                  //     disabled: this.props.isDisabled
                  //       ? this.props.isDisabled
                  //       : false,
                  //     onChange: event => this.handleChange("bankCode", event)
                  //   }}
                  //   formControlProps={{
                  //     fullWidth: true,
                  //     className: classes.customFormControlClasses,
                  //     onBlur: event => {
                  //       this.setState({ bankCodePristine: false });
                  //       this.change(event, "bankCode", [
                  //         { type: "required" },
                  //         {
                  //           type: "length",
                  //           params: {
                  //             min: 1,
                  //             max: 100
                  //           }
                  //         }
                  //       ]);
                  //     },
                  //     onChange: event => {
                  //       if (!this.state.bankCodePristine) {
                  //         this.setState({ bankCodePristine: false });
                  //         this.change(event, "bankCode", [
                  //           { type: "required" },
                  //           {
                  //             type: "length",
                  //             params: {
                  //               min: 1,
                  //               max: 100
                  //             }
                  //           }
                  //         ]);
                  //       }
                  //     }
                  //   }}
                  // />
                  <>
                    <GridItem xs={12} sm={12} md={3} lg={3}>
                      <FormControl fullWidth style={{ paddingTop: 2 }}>
                        {/* <InputLabel htmlFor="type" className={classes.selectLabel}>
                      Currency*
                    </InputLabel> */}
                        <FormHelperText
                          className={classes.selectLabel}
                          success={this.state.bankCurrencyState === "success"}
                          error={this.state.bankCurrencyState === "error"}
                          helpText={
                            this.state.bankCurrencyState === "error" &&
                            this.state.bankCurrencyErrorMsg[0]
                          }
                        >
                          Currency*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.bankCurrency}
                          onChange={this.handleSimpleChange}
                          inputProps={{
                            name: "bankCurrency",
                            id: "bankCurrency",
                            disabled: this.props.isDisabled
                              ? this.props.isDisabled
                              : false,
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"currencyText"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Currency
                          </MenuItem>
                          {walletCurrencies.map(item => (
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
                    {/* <GridItem xs={12} sm={12} md={3} lg={3}>
                      <FormControl fullWidth style={{ paddingTop: 2 }}>
                        <FormHelperText
                          className={classes.selectLabel}
                          success={this.state.bankWalletState === "success"}
                          error={this.state.bankWalletState === "error"}
                          helpText={
                            this.state.bankWalletState === "error" &&
                            this.state.bankWalletErrorMsg[0]
                          }
                        >
                          Wallet*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.bankWallet}
                          onChange={this.handleSimpleChange}
                          inputProps={{
                            name: "bankWallet",
                            id: "bankWallet",
                            disabled: this.props.isDisabled
                              ? this.props.isDisabled
                              : false,
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"currencyText"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose Wallet
                          </MenuItem>
                          {currencyWallets.map(item => (
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
                    </GridItem> */}
                  </>
                )}
                <GridItem xs={12} sm={12} md={3} lg={3}>
                  <CustomInput
                    success={this.state.emailAddressState === "success"}
                    error={this.state.emailAddressState === "error"}
                    helpText={
                      this.state.emailAddressState === "error" &&
                      this.state.emailAddressErrorMsg[0]
                    }
                    labelText="Email Address*"
                    id="nb_emailAddress"
                    inputProps={{
                      value: this.state.emailAddress,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event =>
                        this.handleChange("emailAddress", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ emailAddressPristine: false });
                        this.change(event, "emailAddress", [
                          { type: "required" },
                          { type: "email" }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.emailAddressPristine) {
                          this.setState({ emailAddressPristine: false });
                          this.change(event, "emailAddress", [
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
                  md={6}
                  lg={6}
                  className={classes.alignPadding}
                >
                  <CustomInput
                    success={this.state.addressState === "success"}
                    error={this.state.addressState === "error"}
                    helpText={
                      this.state.addressState === "error" &&
                      this.state.addressErrorMsg[0]
                    }
                    labelText="Address Line 1*"
                    id="nb_address"
                    inputProps={{
                      value: this.state.address,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event => this.handleChange("address", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ addressPristine: false });
                        this.change(event, "address", [{ type: "required" }]);
                      },
                      onChange: event => {
                        if (!this.state.addressPristine) {
                          this.setState({ addressPristine: false });
                          this.change(event, "address", [{ type: "required" }]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  className={classes.alignPadding}
                >
                  <CustomInput
                    labelText="Address Line 2"
                    id="nb_address2"
                    inputProps={{
                      value: this.state.address2,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event => this.handleChange("address2", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.change(event, "address2", []);
                      },
                      onChange: event => {
                        this.change(event, "address2", []);
                      }
                    }}
                  />
                </GridItem>
                <GridItem
                  xs={10}
                  sm={10}
                  md={12}
                  lg={12}
                  className={classes.alignPadding}
                >
                  <GridContainer>
                    <GridItem xs={12} sm={10} md={4}>
                      <CustomInput
                        success={this.state.cityState === "success"}
                        error={this.state.cityState === "error"}
                        helpText={
                          this.state.cityState === "error" &&
                          this.state.cityErrorMsg[0]
                        }
                        labelText="City*"
                        id="nb_city"
                        inputProps={{
                          value: this.state.city,
                          disabled: this.props.isDisabled
                            ? this.props.isDisabled
                            : false,
                          onChange: event => this.handleChange("city", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ cityPristine: false });
                            this.change(event, "city", [{ type: "required" }]);
                          },
                          onChange: event => {
                            if (!this.state.cityPristine) {
                              this.setState({ cityPristine: false });
                              this.change(event, "city", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={10} md={4}>
                      <CustomInput
                        success={this.state.postalCodeState === "success"}
                        error={this.state.postalCodeState === "error"}
                        helpText={
                          this.state.postalCodeState === "error" &&
                          this.state.postalCodeErrorMsg[0]
                        }
                        labelText="Postal Code*"
                        id="nb_postalCode"
                        inputProps={{
                          value: this.state.postalCode,
                          disabled: this.props.isDisabled
                            ? this.props.isDisabled
                            : false,
                          onChange: event =>
                            this.handleChange("postalCode", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ postalCodePristine: false });
                            this.change(event, "postalCode", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.postalCodePristine) {
                              this.setState({ postalCodePristine: false });
                              this.change(event, "postalCode", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={10} md={4}>
                      <FormControl fullWidth>
                        <FormHelperText
                          // style={{
                          //   backgroundColor: "white",
                          //   paddingTop: 5,
                          //   marginTop: 0,
                          //   textAlign: "left"
                          // }}
                          className={classes.selectLabel}
                          success={this.state.countryCodeState === "success"}
                          error={this.state.countryCodeState === "error"}
                          helpText={
                            this.state.countryCodeState === "error" &&
                            this.state.countryCodeErrorMsg[0]
                          }
                        >
                          Country*
                        </FormHelperText>
                        {/* <InputLabel htmlFor='type' className={classes.selectLabel}>
                          Country*
                        </InputLabel> */}
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={this.state.countryCode}
                          onChange={this.handleCountryChange}
                          inputProps={{
                            name: "countryCode",
                            id: "countryCode",
                            disabled: this.props.isDisabled
                              ? this.props.isDisabled
                              : false
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
                      </FormControl>
                      {/*<CustomInput
                        success={this.state.countryCodeState === "success"}
                        error={this.state.countryCodeState === "error"}
                        helpText={
                          this.state.countryCodeState === "error" &&
                          this.state.countryCodeErrorMsg[0]
                        }
                        labelText="Country*"
                        id="nb_countryCode"
                        inputProps={{
                          value: this.state.countryCode,
                          onChange: event => this.handleChange("countryCode", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ countryCodePristine: false });
                            this.change(event, "countryCode", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.countryCodePristine) {
                              this.setState({ countryCodePristine: false });
                              this.change(event, "countryCode", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />*/}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={8}>
                  <CustomInput
                    success={this.state.bicNumberState === "success"}
                    error={this.state.bicNumberState === "error"}
                    helpText={
                      this.state.bicNumberState === "error" &&
                      this.state.bicNumberErrorMsg[0]
                    }
                    labelText="Swift / BIC*"
                    id="nb_bicNumber"
                    // inputProps={{
                    //   value: this.state.firstName,
                    //   onChange: this.handleChange
                    // }}
                    inputProps={{
                      value: this.state.bicNumber,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event => this.handleChange("bicNumber", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ bicNumberPristine: false });
                        this.change(event, "bicNumber", [
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
                        if (!this.state.bicNumberPristine) {
                          this.setState({ bicNumberPristine: false });
                          this.change(event, "bicNumber", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 25
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={4}>
                  <CustomInput
                    success={this.state.accountNumberState === "success"}
                    error={this.state.accountNumberState === "error"}
                    helpText={
                      this.state.accountNumberState === "error" &&
                      this.state.accountNumberErrorMsg[0]
                    }
                    labelText="Account Number*"
                    id="nb_accountNumber"
                    inputProps={{
                      value: this.state.accountNumber,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event =>
                        this.handleChange("accountNumber", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ accountNumberPristine: false });
                        this.change(event, "accountNumber", [
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
                        if (!this.state.accountNumberPristine) {
                          this.setState({ accountNumberPristine: false });
                          this.change(event, "accountNumber", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 25
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={8}>
                  <CustomInput
                    success={this.state.ibanState === "success"}
                    error={this.state.ibanState === "error"}
                    helpText={
                      this.state.ibanState === "error" &&
                      this.state.ibanErrorMsg[0]
                    }
                    labelText="IBAN*"
                    id="nb_iban"
                    // inputProps={{
                    //   value: this.state.firstName,
                    //   onChange: this.handleChange
                    // }}
                    inputProps={{
                      value: this.state.iban,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event => this.handleChange("iban", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ ibanPristine: false });
                        this.change(event, "iban", [
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
                        if (!this.state.ibanPristine) {
                          this.setState({ ibanPristine: false });
                          this.change(event, "iban", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 25
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={4}>
                  <CustomInput
                    success={this.state.sortCodeState === "success"}
                    error={this.state.sortCodeState === "error"}
                    helpText={
                      this.state.sortCodeState === "error" &&
                      this.state.sortCodeErrorMsg[0]
                    }
                    labelText="Sort Code*"
                    id="nb_sortCode"
                    inputProps={{
                      value: this.state.sortCode,
                      disabled: this.props.isDisabled
                        ? this.props.isDisabled
                        : false,
                      onChange: event => this.handleChange("sortCode", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ sortCodePristine: false });
                        this.change(event, "sortCode", [
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
                        if (!this.state.sortCodePristine) {
                          this.setState({ sortCodePristine: false });
                          this.change(event, "sortCode", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 25
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={12} lg={12}>
                  <FormLabel className={cx(classes.graphFooter)}>
                    <em>
                      * Payment can only be made to a Business Customer and not
                      an Individual
                    </em>
                  </FormLabel>
                </GridItem> */}
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div
                    className={classes.center}
                    style={{ textAlign: "right" }}
                  >
                    {this.props.isDisabled ? (
                      <Button
                        round={false}
                        color="info"
                        size="lg"
                        onClick={() => this.handleClose()}
                      >
                        CLOSE
                      </Button>
                    ) : (
                      <Button
                        round={false}
                        color="info"
                        size="lg"
                        onClick={this.addBeneficiary}
                      >
                        ADD
                      </Button>
                    )}
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
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

BeneficiaryDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  addBeneficiary: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  beneficiary: PropTypes.object,
  type: PropTypes.string,
  isDisabled: PropTypes.bool,
  currencies: PropTypes.array,
  wallets: PropTypes.object
};

export default withRouter(withStyles(addBeneficiaryStyle)(BeneficiaryDetails));
