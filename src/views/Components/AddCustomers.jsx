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
import FormHelperText from "@material-ui/core/FormHelperText";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";
import FileUpload from "components/FileUpload/FileUpload.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NoticeModal from "views/Components/NoticeModal.jsx";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { validate } from "../../utils/Validator";
import addCustomersStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class AddCustomers extends React.Component {
  error = {
    companyNameErrorMsg: {
      required: "Company name is required"
    },
    companyDescErrorMsg: {
      required: "Company Description is required"
    },
    incorporationNumberErrorMsg: {
      required: "Incorporation Number is required"
    },
    phoneNumberErrorMsg: {
      required: "Phone number is required",
      valid: "Please enter phone number in a valid format (xxx-xxx-xxxx)"
    },
    addressErrorMsg: {
      required: "Address is required"
    },
    companyEmailErrorMsg: {
      valid: "Please enter a valid email"
    },
    cityErrorMsg: {
      required: "City is required"
    },
    postalCodeErrorMsg: {
      required: "Postal code is required"
    },
    countryCodeErrorMsg: {
      required: "Country is required"
    }
  };

  initialState = {};

  constructor(props) {
    super(props);
    this.addressUploadComponent = React.createRef();
    this.utilityUploadComponent = React.createRef();
    // we use this to make the card to appear after the page has been rendered

    this.initialState = {
      cardAnimaton: "cardHidden",
      showModal: true,
      companyNameState: "",
      companyNamePristine: true,
      companyNameErrorMsg: [],
      companyDescState: "",
      companyDescPristine: true,
      companyDescErrorMsg: [],
      incorporationNumberState: "",
      incorporationNumberPristine: true,
      incorporationNumberErrorMsg: [],
      companyEmailState: "",
      companyEmailPristine: true,
      companyEmailErrorMsg: [],
      phoneNumberHelpMsg: "(xxx-xxx-xxxx)",
      addressState: "",
      addressPristine: true,
      addressErrorMsg: [],
      cityState: "",
      cityPristine: true,
      cityErrorMsg: [],
      postalCodeState: "",
      postalCodePristine: true,
      postalCodeErrorMsg: [],
      countryCodeState: "",
      countryCodePristine: true,
      countryCodeErrorMsg: [],
      ownershipTypeState: "",
      ownershipTypePristine: true,
      ownershipTypeErrorMsg: [],
      mainStockMarketState: "",
      mainStockMarketPristine: true,
      mainStockMarketErrorMsg: [],
      secondaryStockMarketState: "",
      secondaryStockMarketPristine: true,
      secondaryStockMarketErrorMsg: [],

      companyName: "",
      companyDesc: "",
      callingCode: "",
      phoneNumber: "",
      incorporationNumber: "",
      companyEmail: "",
      ownershipType: "",
      mainStockMarket: "",
      secondaryStockMarket: "",
      address: "",
      city: "",
      postalCode: "",
      countryCode: "",
      countries: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };

    this.state = this.initialState;
  }

  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  componentDidMount = () => {
    this.initializeData();
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  };

  initializeData = async () => {
    const { editCustomer } = this.props;
    if (!editCustomer) {
      this.setState(this.initialState);
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
      const countries = res.data.countryMetaData;
      this.setState({ countries: countries });
    }
  };

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

  isValidated = () => {
    if (
      this.state.companyNameState === "success" &&
      this.state.companyDescState === "success" &&
      this.state.incorporationNumberState === "success" &&
      this.state.addressState === "success" &&
      this.state.cityState === "success" &&
      this.state.postalCodeState === "success" &&
      this.state.countryCodeState === "success"
    ) {
      return true;
    } else {
      if (this.state.companyNameState !== "success") {
        this.setState({ companyNameState: "error" });
      }
      if (this.state.companyDescState !== "success") {
        this.setState({ companyDescState: "error" });
      }
      if (this.state.incorporationNumberState !== "success") {
        this.setState({ incorporationNumberState: "error" });
      }
      if (this.state.addressState !== "success") {
        this.setState({ addressState: "error" });
      }
      if (this.state.cityState !== "success") {
        this.setState({ cityState: "error" });
      }
      if (this.state.postalCodeState !== "success") {
        this.setState({ postalCodeState: "error" });
      }
      if (this.state.countryCodeState !== "success") {
        this.setState({ countryCodeState: "error" });
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
    this.initializeData();
    this.props.handleClose();
  }

  getAlpha2Code = code => {
    let alpha2 = this.state.countries.filter(item => {
      return item.countryCode === code;
    })[0];
    return alpha2;
  };
  addCustomer = () => {
    let alpha2 = this.getAlpha2Code(this.state.countryCode);

    if (this.isValidated()) {
      this.props.addCustomer({
        companyName: this.state.companyName,
        companyDesc: this.state.companyDesc,
        phoneNumber:
          this.state.callingCode + this.state.phoneNumber.replace(/-/g, ""),
        incorporationNumber: this.state.incorporationNumber,
        email: this.state.companyEmail,
        ownershipType: this.state.ownershipType,
        mainStockMarket: this.state.mainStockMarket,
        secondaryStockMarket: this.state.secondaryStockMarket,
        registeredOfficeAddress: {
          address: this.state.address,
          city: this.state.city,
          postalCode: this.state.postalCode,
          countryCode: alpha2.alpha2Code
        }
      });
      this.initializeData();
    }
  };

  updateCustomer = () => {
    let alpha2 = this.getAlpha2Code(this.state.countryCode);

    if (this.isValidated()) {
      this.props.updateCustomer({
        id: this.state.id,
        kycEntityId: this.props.editCustomer.kycEntityId,
        customerId: this.props.editCustomer.customerId,
        companyName: this.state.companyName,
        companyDesc: this.state.companyDesc,
        phoneNumber:
          this.state.callingCode + this.state.phoneNumber.replace(/-/g, ""),
        incorporationNumber: this.state.incorporationNumber,
        email: this.state.companyEmail,
        ownershipType: this.state.ownershipType,
        mainStockMarket: this.state.mainStockMarket,
        secondaryStockMarket: this.state.secondaryStockMarket,
        registeredOfficeAddress: {
          address: this.state.address,
          city: this.state.city,
          postalCode: this.state.postalCode,
          countryCode: alpha2.alpha2Code
        }
      });
      this.initializeData();
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let customer = {};
      let pristineState = {};
      if (props.showModal) {
        customer = AddCustomers.initialState;
        if (props.editCustomer) {
          customer = { ...customer, ...props.editCustomer };
          let country = state.countries.filter(item => {
            return item.alpha2Code === customer.countryCode;
          })[0];
          customer.countryCode = country.countryCode;
          customer.companyEmail = customer.email;
          pristineState = {
            companyNameState: "success",
            companyDescState: "success",
            incorporationNumberState: "success",
            companyEmailState: "success",
            addressState: "success",
            cityState: "success",
            postalCodeState: "success",
            countryCodeState: "success"
          };
        }
      }

      return {
        showModal: props.showModal,
        ...customer,
        ...pristineState
      };
    }
    return null;
  }
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };

  handleSimple = event => {
    this.setState(
      validate(
        event.target.value,
        event.target.name,
        this.state,
        [],
        this.error
      )
    );
    this.setState({ [event.target.name]: event.target.value });
  };

  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }

  render() {
    const { classes } = this.props;
    return (
      this.state.countries && (
        <div className={cx(classes.container)}>
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot
            }}
            maxWidth="md"
            open={this.state.showModal}
            style={{ zIndex: 1032 }}
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
            >
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={() => this.handleClose()}
              >
                <CloseIcon />
              </IconButton>
              <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>
                Add Company
              </h3>
            </DialogTitle>
            <DialogContent
              id="classic-modal-slide-description"
              className={cx(classes.addDirectorsMaxWidth)}
            >
              <form className={classes.form}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} lg={6}>
                    <CustomInput
                      success={this.state.companyNameState === "success"}
                      error={this.state.companyNameState === "error"}
                      helpText={
                        this.state.companyNameState === "error" &&
                        this.state.companyNameErrorMsg[0]
                      }
                      labelText="Company Name*"
                      id="ac_companyName"
                      inputProps={{
                        value: this.state.companyName,
                        onChange: event =>
                          this.handleChange("companyName", event)
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({ companyNamePristine: false });
                          this.change(event, "companyName", [
                            { type: "required" }
                          ]);
                        },
                        onChange: event => {
                          if (!this.state.companyNamePristine) {
                            this.setState({ companyNamePristine: false });
                            this.change(event, "companyName", [
                              { type: "required" }
                            ]);
                          }
                        }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={6}>
                    <CustomInput
                      success={
                        this.state.incorporationNumberState === "success"
                      }
                      error={this.state.incorporationNumberState === "error"}
                      helpText={
                        this.state.incorporationNumberState === "error" &&
                        this.state.incorporationNumberErrorMsg[0]
                      }
                      labelText="Incorporation Number*"
                      id="ac_incorporationNumber"
                      inputProps={{
                        value: this.state.incorporationNumber,
                        onChange: event =>
                          this.handleChange("incorporationNumber", event)
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({ incorporationNumberPristine: false });
                          this.change(event, "incorporationNumber", [
                            { type: "required" }
                          ]);
                        },
                        onChange: event => {
                          if (!this.state.incorporationNumberPristine) {
                            this.setState({
                              incorporationNumberPristine: false
                            });
                            this.change(event, "incorporationNumber", [
                              { type: "required" }
                            ]);
                          }
                        }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <CustomInput
                      success={this.state.companyDescState === "success"}
                      error={this.state.companyDescState === "error"}
                      helpText={
                        this.state.companyDescState === "error" &&
                        this.state.companyDescErrorMsg[0]
                      }
                      labelText="Provide a brief description of your company*"
                      id="s3_companyDescription"
                      inputProps={{
                        value: this.state.companyDesc,
                        onChange: event =>
                          this.handleChange("companyDesc", event)
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
                          if (!this.state.companyDescPristine) {
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
                          }
                        }
                      }}
                    />
                  </GridItem>
                  <GridItem
                    className={classes.customText}
                    xs={10}
                    sm={10}
                    md={6}
                    lg={6}
                  >
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <FormHelperText className={classes.selectFormHelperText}>
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
                          id: "ac_callingCode"
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
                            value={item.callingCodes[0]}
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
                    className={classes.customText}
                    xs={10}
                    sm={10}
                    md={6}
                    lg={6}
                  >
                    <FormHelperText
                      style={{
                        backgroundColor: "white",
                        paddingTop: 10,
                        margin: "5px 12px 0px 12px",
                        textAlign: "left"
                      }}
                    >
                      Phone Number
                    </FormHelperText>
                    <CustomNumberFormat
                      helpText={this.state.phoneNumberHelpMsg}
                      id="phoneNumber"
                      value={this.state.phoneNumber}
                      format="###-###-####"
                      formControlProps={{
                        fullWidth: true,
                        className: cx(
                          classes.customFormControlClasses,
                          classes.phoneFormControl
                        ),
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
                    />
                  </GridItem>
                  <GridItem xs={12} sm={10} md={12} lg={12}>
                    <b className={classes.subTitle}>
                      Registered Office Address
                    </b>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
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
                      labelText="Address*"
                      id="ac_address"
                      inputProps={{
                        value: this.state.address,
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
                            this.change(event, "address", [
                              { type: "required" }
                            ]);
                          }
                        }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={6}>
                    <CustomInput
                      success={this.state.companyEmailState === "success"}
                      error={this.state.companyEmailState === "error"}
                      helpText={
                        this.state.companyEmailState === "error" &&
                        this.state.companyEmailErrorMsg[0]
                      }
                      labelText="Company email address"
                      id="ac_companyEmail"
                      inputProps={{
                        value: this.state.companyEmail,
                        onChange: event =>
                          this.handleChange("companyEmail", event)
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({ companyEmailPristine: false });
                          this.change(event, "companyEmail", [
                            { type: "email" }
                          ]);
                        },
                        onChange: event => {
                          if (!this.state.companyEmailPristine) {
                            this.setState({ companyEmailPristine: false });
                            this.change(event, "companyEmail", [
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
                      <GridItem xs={12} sm={12} md={2}>
                        <CustomInput
                          success={this.state.cityState === "success"}
                          error={this.state.cityState === "error"}
                          helpText={
                            this.state.cityState === "error" &&
                            this.state.cityErrorMsg[0]
                          }
                          labelText="City*"
                          id="ac_city"
                          inputProps={{
                            value: this.state.city,
                            onChange: event => this.handleChange("city", event)
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: event => {
                              this.setState({ cityPristine: false });
                              this.change(event, "city", [
                                { type: "required" }
                              ]);
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
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          success={this.state.postalCodeState === "success"}
                          error={this.state.postalCodeState === "error"}
                          helpText={
                            this.state.postalCodeState === "error" &&
                            this.state.postalCodeErrorMsg[0]
                          }
                          labelText="Postal Code*"
                          id="ac_postalCode"
                          inputProps={{
                            value: this.state.postalCode,
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
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="type"
                            className={classes.selectLabel}
                          >
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
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={10} md={12} lg={12}>
                    <b className={classes.subTitle}>Ownership</b>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="type"
                            className={classes.selectLabel}
                          >
                            Type
                          </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            value={this.state.ownershipType}
                            onChange={this.handleSimple}
                            inputProps={{
                              name: "ownershipType",
                              id: "ownershipType"
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem
                              }}
                            >
                              Choose Type
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Private"
                            >
                              Private
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Public"
                            >
                              Public
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6} />
                    </GridContainer>
                  </GridItem>
                  {this.state.ownershipType === "Public" && (
                    <>
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <CustomInput
                          success={
                            this.state.mainStockMarketState === "success"
                          }
                          error={this.state.mainStockMarketState === "error"}
                          helpText={
                            this.state.mainStockMarketState === "error" &&
                            this.state.mainStockMarketErrorMsg[0]
                          }
                          labelText="Main Stock Market*"
                          id="ac_mainStockMarket"
                          inputProps={{
                            value: this.state.mainStockMarket,
                            onChange: event =>
                              this.handleChange("mainStockMarket", event)
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: event => {
                              this.setState({ mainStockMarketPristine: false });
                              this.change(event, "mainStockMarket", [
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
                              if (!this.state.mainStockMarketPristine) {
                                this.setState({
                                  mainStockMarketPristine: false
                                });
                                this.change(event, "mainStockMarket", [
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
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        {/* <GridContainer spacing={1} alignItems="center">
            <GridItem className={classes.textIcon}>
              <Face className={classes.inputAdornmentIcon} />
            </GridItem>
            <GridItem
              className={classes.customText}
              xs={12}
              sm={12}
              md={10}
              lg={10}
            > */}
                        <CustomInput
                          success={
                            this.state.secondaryStockMarketState === "success"
                          }
                          error={
                            this.state.secondaryStockMarketState === "error"
                          }
                          helpText={
                            this.state.secondaryStockMarketState === "error" &&
                            this.state.secondaryStockMarketErrorMsg[0]
                          }
                          labelText="Second Stock Market, if any"
                          id="ac_secondaryStockMarket"
                          inputProps={{
                            value: this.state.secondaryStockMarket,
                            onChange: event =>
                              this.handleChange("secondaryStockMarket", event)
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: event => {
                              this.setState({
                                secondaryStockMarketPristine: false
                              });
                              this.change(event, "secondaryStockMarket", []);
                            },
                            onChange: event => {
                              if (!this.state.secondaryStockMarketPristine) {
                                this.setState({
                                  secondaryStockMarketPristine: false
                                });
                                this.change(event, "secondaryStockMarket", []);
                              }
                            }
                          }}
                        />
                      </GridItem>
                    </>
                    // <GridItem xs={12} sm={12} md={12}>
                    //   <GridContainer>
                    //     <GridItem xs={12} sm={12} md={12} lg={6}>
                    //       <FormControl fullWidth className={classes.selectFormControl}>
                    //         <InputLabel
                    //           htmlFor="mainStockMarket"
                    //           className={classes.selectLabel}
                    //         >
                    //           Main Stock Market
                    //         </InputLabel>
                    //         <Select
                    //           MenuProps={{
                    //             className: classes.selectMenu
                    //           }}
                    //           classes={{
                    //             select: classes.select
                    //           }}
                    //           value={this.state.mainStockMarket}
                    //           onChange={this.handleSimple}
                    //           inputProps={{
                    //             name: "mainStockMarket",
                    //             id: "mainStockMarket"
                    //           }}
                    //         >
                    //           <MenuItem
                    //             disabled
                    //             classes={{
                    //               root: classes.selectMenuItem
                    //             }}
                    //           >
                    //             Choose City
                    //           </MenuItem>
                    //           <MenuItem
                    //             classes={{
                    //               root: classes.selectMenuItem,
                    //               selected: classes.selectMenuItemSelected
                    //             }}
                    //             value="2"
                    //           >
                    //             Paris
                    //           </MenuItem>
                    //           <MenuItem
                    //             classes={{
                    //               root: classes.selectMenuItem,
                    //               selected: classes.selectMenuItemSelected
                    //             }}
                    //             value="3"
                    //           >
                    //             Bucharest
                    //           </MenuItem>
                    //         </Select>
                    //       </FormControl>
                    //     </GridItem>
                    //     <GridItem xs={12} sm={12} md={12} lg={6}>
                    //       <FormControl fullWidth className={classes.selectFormControl}>
                    //         <InputLabel
                    //           htmlFor="secondaryStockMarket"
                    //           className={classes.selectLabel}
                    //         >
                    //           Secondary Stock Market
                    //         </InputLabel>
                    //         <Select
                    //           MenuProps={{
                    //             className: classes.selectMenu
                    //           }}
                    //           classes={{
                    //             select: classes.select
                    //           }}
                    //           value={this.state.secondaryStockMarket}
                    //           onChange={this.handleSimple}
                    //           inputProps={{
                    //             name: "secondaryStockMarket",
                    //             id: "secondaryStockMarket"
                    //           }}
                    //         >
                    //           <MenuItem
                    //             disabled
                    //             classes={{
                    //               root: classes.selectMenuItem
                    //             }}
                    //           >
                    //             Choose City
                    //           </MenuItem>
                    //           <MenuItem
                    //             classes={{
                    //               root: classes.selectMenuItem,
                    //               selected: classes.selectMenuItemSelected
                    //             }}
                    //             value="2"
                    //           >
                    //             Paris
                    //           </MenuItem>
                    //           <MenuItem
                    //             classes={{
                    //               root: classes.selectMenuItem,
                    //               selected: classes.selectMenuItemSelected
                    //             }}
                    //             value="3"
                    //           >
                    //             Bucharest
                    //           </MenuItem>
                    //         </Select>
                    //       </FormControl>
                    //     </GridItem>
                    //   </GridContainer>
                    // </GridItem>
                  )}{" "}
                  <div className={classes.buttonContainer}>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <div className={classes.center}>
                        {this.props.editCustomer ? (
                          <Button
                            round={false}
                            color="info"
                            size="lg"
                            onClick={this.updateCustomer}
                          >
                            UPDATE
                          </Button>
                        ) : (
                          <Button
                            round={false}
                            color="info"
                            size="lg"
                            onClick={this.addCustomer}
                          >
                            ADD
                          </Button>
                        )}
                      </div>
                    </GridItem>
                  </div>
                </GridContainer>
              </form>
              {/* <GridContainer justify="center"> */}
              {/* <Card>
              <CardHeader color="warning" text>
                <CardText color="warning">
                  <Work className={classes.listItemIcon} />
                </CardText>
              </CardHeader>
              <CardBody style={{ paddingLeft: 100, top: -60 }}>

              </CardBody>
            </Card> */}
              {/* </GridContainer> */}
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
      )
    );
  }
}

AddCustomers.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  customers: PropTypes.any,
  editCustomer: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  addCustomer: PropTypes.func,
  updateCustomer: PropTypes.func
};

export default withRouter(withStyles(addCustomersStyle)(AddCustomers));
