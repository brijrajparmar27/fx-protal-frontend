import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import StatusCard from "components/StatusCard/StatusCard.jsx";
import FileUpload from "components/FileUpload/FileUpload.jsx";
import { formatMoney, parseCurrency } from "../../../utils/Utils";
import { validate } from "../../../utils/Validator";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// @material-ui/icons
import Work from "@material-ui/icons/Work";

import { primaryColor } from "assets/jss/material-dashboard-pro-react.jsx";
import confirmationModalStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const style = {
  modal: {
    margin: "auto",
    maxWidth: "70%"
  },
  ...confirmationModalStyle
};

const documentTypes = [
  {
    value: "Invoice",
    label: "Invoice from Beneficiary"
  },
  {
    value: "Contract",
    label: "Contractual Agreement"
  },
  {
    value: "Other",
    label: "Any Other"
  }
];

class PaymentModal extends React.Component {
  error = {
    paymentReasonErrorMsg: {
      required: "Payment reason is required",
      range: "Reason should be 1 to 100 characters"
    },
    referenceErrorMsg: {
      required: "Payment reference is required",
      range: "Reason should be 1 to 100 characters"
    },
    amountErrorMsg: {
      required: "Payment amount is required"
    },
    transactionDateErrorMsg: {
      required: "Payment date value is required",
      valid: "Old Dates are not allowed. Please select a valid Payment date"
    },
    docCategoryErrorMsg: {
      required: "Document Category is required"
    },
    otherDocCategoryErrorMsg: {
      required: "Document Category is required"
    },
    paymentCurrencyErrorMsg: {
      required: "Payment date value is required"
    }
  };

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: false,
      paymentReason: "",
      paymentReasonState: "",
      paymentReasonPristine: true,
      paymentReasonErrorMsg: [],
      reference: "",
      referenceState: "",
      referencePristine: true,
      referenceErrorMsg: [],
      supportingDocFile: "",
      isOtherCategory: false,
      otherDocCategory: "",
      otherDocCategoryState: "",
      otherDocCategoryPristine: true,
      otherDocCategoryErrorMsg: [],
      transactionDate: null,
      transactionDateState: "",
      transactionDateErrorMsg: [],
      amount: "0",
      amountState: "",
      amountPristine: true,
      amountErrorMsg: [],
      amountValue: "0",
      docCategory: "",
      docCategoryState: "",
      docCategoryErrorMsg: "",
      paymentCurrency: "",
      paymentCurrencyState: "",
      paymentCurrencyErrorMsg: [],
      isDealExecuted: false,
      paymentId: "",
      disabledPaymentButton: false,
      callInProgress: false,
      waitHeader: "",
      reason: "",
      supportedDocLink: "",
      supportedDocType: ""
    };
  }
  isPaymentValidated = () => {
    if (
      this.state.paymentReasonState === "success" &&
      this.state.referenceState === "success" &&
      this.state.transactionDateState === "success" &&
      this.state.amountState === "success"
    ) {
      return true;
    } else {
      if (this.state.paymentReasonState !== "success") {
        this.setState({ paymentReasonState: "error" });
      }
      if (this.state.referenceState !== "success") {
        this.setState({ referenceState: "error" });
      }
      if (this.state.transactionDateState !== "success") {
        this.setState({ transactionDateState: "error" });
      }
      if (this.state.amountState !== "success") {
        this.setState({ amountState: "error" });
      }
    }
    return false;
  };
  createPayment = () => {
    if (!this.isPaymentValidated()) return;

    const paymentDetails = {
      paymentSender: "FXG_OPERATION",
      fxgBeneficiaryId: this.state.selecetdBeneficiary.id,
      amount: this.state.amountValue,
      currency: this.state.paymentCurrency,
      reference: this.state.reference,
      reason: this.state.paymentReason,
      supportedDocType: this.state.isOtherCategory
        ? this.state.otherDocCategory
        : this.state.docCategory
    };
    this.uploadSupportingDocument(paymentDetails);
  };
  uploadSupportingDocument = async paymentDetails => {
    if (this.state.supportingDocFile !== "") {
      const formData = new FormData();
      formData.append("file", this.state.supportingDocFile);

      const res = await apiHandler({
        method: "POST",
        url: endpoint.UPLOAD_FILE,
        data: formData,
        authToken: sessionStorage.getItem("token")
      });
      if (res.data.errorCode) {
      } else {
        paymentDetails = {
          ...paymentDetails,
          supportedDocLink: res.data.name
        };
        // res.data.path
        this.addPayment(paymentDetails);
      }
    } else {
      paymentDetails = {
        ...paymentDetails,
        supportedDocLink: null
      };
      // res.data.path
      this.addPayment(paymentDetails);
    }
  };
  getFile = (name, file) => {
    // const file = event.target.files[0];
    this.setState({ [name]: file });
  };
  addPayment = paymentDetails => {
    if (this.props.addPayment) {
      this.props.addPayment(paymentDetails);
    }
  };
  closeModal() {
    this.props.closeModal();
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
    this.initialzeData();
  }
  initialzeData = () => {
    this.setState({
      transactionDate: this.getNextWorkingday(new Date())
    });
  };
  getNextWorkingday(date) {
    var tomorrow = new Date(date.setDate(date.getDate() + 1));
    return tomorrow.getDay() % 6 ? tomorrow : this.getNextWorkingday(tomorrow);
  }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let statusDetails = {};
      if (props.showModal) {
        statusDetails = {
          ...props.record
        };
      }
      return {
        showModal: props.showModal,
        ...statusDetails
      };
    }
    return null;
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  onSelectUnscheduleType = event => {
    console.log(event.target.value);
    this.setState({ unscheduleReason: event.target.value });
  };
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };
  disableWeekends = date => {
    return date ? date.getDay() === 0 || date.getDay() === 6 : null;
  };
  handleDateChange = date => {
    // console.log(date);
    this.setState(
      validate(
        date,
        "transactionDate",
        this.state,
        [{ type: "oldDate" }],
        this.error
      )
    );
    // this.setState({
    //   transactionDate: date
    // });
  };
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  handleAmountChange = name => event => {
    let amountValue = parseCurrency(event.target.value);
    let fee = 0;
    if (+event.target.value > 0) fee = 10;
    this.setState(
      { [name]: event.target.value, fee: fee, amountValue: amountValue },
      () => {
        // this.getCurrencyConversion(this.state.selectedWallet);
      }
    );
  };
  handleDocCategory = event => {
    let isOtherCategory = false;
    if (event.target.value === "Other") {
      isOtherCategory = true;
    }
    this.setState(
      validate(
        event.target.value,
        "docCategory",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
    this.setState({
      isOtherCategory: isOtherCategory
    });
  };
  parseDate = dateObj => {
    if (dateObj === null || dateObj === "") return null;

    var month =
      (dateObj.getMonth() + 1 < 10 ? "0" : "") + (dateObj.getMonth() + 1);
    var date = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate();
    return dateObj.getFullYear() + "-" + month + "-" + date;
  };
  render() {
    const { classes, wallets } = this.props;
    const walletCurrencies = Object.keys(wallets);

    return (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal
          }}
          open={this.state.showModal}
          maxWidth="lg"
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.closeModal()}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle
            id="notice-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.closeModal()}
            >
              <CloseIcon />
            </IconButton>
            <h4 className={classes.modalTitle}>{"Payment"}</h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={3} lg={3} className={classes.title}>
                Beneficiary Information
              </GridItem>
              <GridItem xs={12} sm={12} md={9} lg={9}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    <label className={classes.uploadLabel}>Name: </label>
                    <label className={classes.uploadLabel}>
                      {this.state.selecetdBeneficiary.name}
                    </label>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    <label className={classes.uploadLabel}>Bank Name: </label>
                    <label className={classes.uploadLabel}>
                      {this.state.selecetdBeneficiary.bankName}
                    </label>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    <label className={classes.uploadLabel}>Currency: </label>
                    <label className={classes.uploadLabel}>
                      {this.state.selecetdBeneficiary.currencyCode}
                    </label>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} lg={6}>
                    <label className={classes.uploadLabel}>iBAN: </label>
                    <label className={classes.uploadLabel}>
                      {this.state.selecetdBeneficiary.iban}
                    </label>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3} lg={3}>
                    <label className={classes.uploadLabel}>Swift/Bic: </label>
                    <label className={classes.uploadLabel}>
                      {this.state.selecetdBeneficiary.swiftBic}
                    </label>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3} lg={3}>
                    <label className={classes.uploadLabel}>Sort Code: </label>
                    <label className={classes.uploadLabel}>
                      {this.state.selecetdBeneficiary.sortCode}
                    </label>
                  </GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <Card>
                  <CardHeader color="warning" text>
                    <CardText color="warning">
                      <Work className={classes.listItemIcon} />
                    </CardText>
                    <span className={classes.title}>Payment Details</span>
                  </CardHeader>
                  <CardBody>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <form className={classes.form}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <CustomInput
                              success={
                                this.state.paymentReasonState === "success"
                              }
                              error={this.state.paymentReasonState === "error"}
                              helpText={
                                this.state.paymentReasonState === "error" &&
                                this.state.paymentReasonErrorMsg[0]
                              }
                              labelText="Reason*"
                              id="np_paymentReason"
                              // inputProps={{
                              //   value: this.state.firstName,
                              //   onChange: this.handleChange
                              // }}
                              inputProps={{
                                value: this.state.paymentReason,
                                onChange: event =>
                                  this.handleChange("paymentReason", event)
                              }}
                              formControlProps={{
                                className: classes.customFormControlClasses,
                                fullWidth: true,
                                onBlur: event => {
                                  this.setState({
                                    paymentReasonPristine: false
                                  });
                                  this.change(event, "paymentReason", [
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
                                  if (!this.state.paymentReasonPristine) {
                                    this.setState({
                                      paymentReasonPristine: false
                                    });
                                    this.change(event, "paymentReason", [
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
                            <GridItem xs={12} sm={12} md={6} lg={6}>
                            <CustomInput
                              success={this.state.referenceState === "success"}
                              error={this.state.referenceState === "error"}
                              helpText={
                                this.state.referenceState === "error" &&
                                this.state.referenceErrorMsg[0]
                              }
                              labelText="Reference*"
                              id="np_reference"
                              inputProps={{
                                value: this.state.reference,
                                onChange: event =>
                                  this.handleChange("reference", event)
                              }}
                              formControlProps={{
                                className: classes.customFormControlClasses,
                                fullWidth: true,
                                onBlur: event => {
                                  this.setState({
                                    referencePristine: false
                                  });
                                  this.change(event, "reference", [
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
                                  if (!this.state.referencePristine) {
                                    this.setState({
                                      referencePristine: false
                                    });
                                    this.change(event, "reference", [
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
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            className={classes.alignPadding}
                          >
                            <GridContainer>
                              <GridItem xs={12} sm={10} md={5} lg={5}>
                                <GridContainer
                                  spacing={8}
                                  alignItems="flex-end"
                                >
                                  <GridItem
                                    className={classes.uploadContainer}
                                    xs={10}
                                    sm={10}
                                    md={12}
                                    lg={12}
                                  >
                                    <label className={classes.uploadLabel}>
                                      Supporting Document
                                    </label>
                                    <FileUpload
                                      avatar
                                      addButtonProps={{
                                        color: "rose",
                                        round: true
                                      }}
                                      changeButtonProps={{
                                        color: "rose",
                                        round: true
                                      }}
                                      removeButtonProps={{
                                        color: "danger",
                                        round: true
                                      }}
                                      sendFile={file =>
                                        this.getFile("supportingDocFile", file)
                                      }
                                      ref={this.fileUploadComponent}
                                    />
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={4} lg={4}>
                                <FormControl
                                  fullWidth
                                  className={classes.filledSelect}
                                >
                                  <FormHelperText
                                    style={{
                                      backgroundColor: "white",
                                      paddingTop: 5,
                                      marginTop: 0,
                                      textAlign: "left"
                                    }}
                                    success={
                                      this.state.docCategoryState === "success"
                                    }
                                    error={
                                      this.state.docCategoryState === "error"
                                    }
                                    helpText={
                                      this.state.docCategoryState === "error" &&
                                      this.state.docCategoryErrorMsg[0]
                                    }
                                  >
                                    Document Category
                                  </FormHelperText>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    value={this.state.docCategory}
                                    onChange={this.handleDocCategory}
                                    inputProps={{
                                      name: "docCategory",
                                      id: "docCategory",
                                      classes: {
                                        icon: classes.white,
                                        root: classes.selectDropDown
                                      }
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      key={"mainDocText"}
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose Document Category
                                    </MenuItem>
                                    {documentTypes.map(item => (
                                      <MenuItem
                                        classes={{
                                          root: classes.selectMenuItem,
                                          selected:
                                            classes.selectMenuItemSelected
                                        }}
                                        value={item.value}
                                        key={item.value}
                                      >
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </GridItem>
                              {this.state.isOtherCategory && (
                                <GridItem xs={12} sm={12} md={3} lg={3}>
                                  <FormControl
                                    fullWidth
                                    className={classes.filledSelect}
                                  >
                                    <CustomInput
                                      success={
                                        this.state.docCategoryState ===
                                        "success"
                                      }
                                      error={
                                        this.state.docCategoryState === "error"
                                      }
                                      helpText={
                                        this.state.docCategoryState ===
                                          "error" &&
                                        this.state.docCategoryErrorMsg[0]
                                      }
                                      labelText="Other Category*"
                                      id="np_otherDocCategory"
                                      inputProps={{
                                        value: this.state.otherDocCategory,
                                        onChange: event =>
                                          this.handleChange(
                                            "otherDocCategory",
                                            event
                                          )
                                      }}
                                      formControlProps={{
                                        fullWidth: true,
                                        className:
                                          classes.customFormControlClasses,
                                        onBlur: event => {
                                          this.setState({
                                            otherDocCategoryPristine: false
                                          });
                                          this.change(event, "docCategory", [
                                            { type: "required" }
                                          ]);
                                        },
                                        onChange: event => {
                                          if (
                                            !this.state.paymentReasonPristine
                                          ) {
                                            this.setState({
                                              paymentReasonPristine: false
                                            });
                                            this.change(event, "docCategory", [
                                              { type: "required" }
                                            ]);
                                          }
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </GridItem>
                              )}
                            </GridContainer>
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
                                <CustomDateSelector
                                  success={
                                    this.state.transactionDateState ===
                                    "success"
                                  }
                                  error={
                                    this.state.transactionDateState === "error"
                                  }
                                  helpText={
                                    this.state.transactionDateState ===
                                      "error" &&
                                    this.state.transactionDateErrorMsg[0]
                                  }
                                  id="np_transactionDate"
                                  inputProps={{
                                    format: "dd MMM yyyy",
                                    label: "Payment Date*",
                                    value: this.state.transactionDate,
                                    shouldDisableDate: this.disableWeekends,
                                    minDate: Date.now(),
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
                              <GridItem
                                xs={12}
                                sm={10}
                                md={4}
                                style={{ marginTop: "30px" }}
                              >
                                <CustomNumberFormat
                                  success={this.state.amountState === "success"}
                                  error={this.state.amountState === "error"}
                                  helpText={
                                    this.state.amountState === "error" &&
                                    this.state.amountErrorMsg[0]
                                  }
                                  id="np_amount"
                                  value={this.state.amount}
                                  onChange={this.handleAmountChange("amount")}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: event => {
                                      this.setState({
                                        amountPristine: false
                                      });
                                      this.change(event, "amount", [
                                        { type: "required" }
                                      ]);
                                    },
                                    onChange: event => {
                                      if (!this.state.amountPristine) {
                                        this.setState({
                                          amountPristine: false
                                        });
                                        this.change(event, "amount", [
                                          { type: "required" }
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
                                lg={4}
                                style={{ marginTop: "20px" }}
                              >
                                <FormControl
                                  fullWidth
                                  className={classes.filledSelect}
                                >
                                  <FormHelperText
                                    style={{
                                      backgroundColor: "white",
                                      paddingTop: 5,
                                      marginTop: 0,
                                      textAlign: "left"
                                    }}
                                  >
                                    Payment Currency*
                                  </FormHelperText>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    value={this.state.paymentCurrency}
                                    onChange={event =>
                                      this.setState({
                                        paymentCurrency: event.target.value
                                      })
                                    }
                                    inputProps={{
                                      name: "paymentCurrency",
                                      id: "paymentCurrency",
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
                        </GridContainer>
                      </form>
                    </GridItem>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button
              size="lg"
              style={{
                backgroundColor: primaryColor[5],
                width: 200,
                marginTop: 30
              }}
              disabled={
                this.state.disabledPaymentButton || this.state.amountValue === 0
              }
              onClick={() => this.createPayment()}
            >
              CREATE PAYMENT
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

PaymentModal.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  record: PropTypes.object,
  addPayment: PropTypes.func,
  closeModal: PropTypes.func,
  wallets: PropTypes.object
};

export default withStyles(style)(PaymentModal);
