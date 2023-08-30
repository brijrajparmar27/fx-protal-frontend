import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddIcon from "@material-ui/icons/Add";
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

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import { parseDate } from "../../utils/Utils";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import DescriptionIcon from "@material-ui/icons/Description";
import AssignmentIcon from "@material-ui/icons/Assignment";
import GestureIcon from "@material-ui/icons/Gesture";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";

import { validate } from "../../utils/Validator";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import FileUpload from "components/FileUpload/FileUpload.jsx";

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
  customDateControlClasses: {
    paddingTop: 0
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: -15
    }
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

const otherDeal = {
  dealID: "other",
  dealIDLabel: "Other",
  date: ""
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class CreateSARRecord extends React.Component {
  error = {
    memberNameErrorMsg: {
      required: "Member Name is required",
      range: "Member Name should be 1 to 100 characters"
    },
    reportDateErrorMsg: {
      required: "Report Date is required"
    },
    customerIdErrorMsg: {
      required: "customer Id is required"
    },
    customerNameErrorMsg: {
      required: "Customer Name is required"
    },
    suspectErrorMsg: {
      required: "Suspect is required",
      range: "Suspect should be 1 to 100 characters"
    },
    suspiciousActivityErrorMsg: {
      required: "Suspicious Activity is required",
      range: "Suspicious Activity should be 1 to 100 characters"
    },
    transactionIdErrorMsg: {
      required: "Transaction Id is required",
      range: "Transaction Id should be 1 to 100 characters"
    },
    otherDetailsErrorMsg: {
      required: "Other Details is required",
      range: "Other Details should be 1 to 100 characters"
    },
    transactionDateErrorMsg: {
      required: "Transaction Date is required"
    },
    reasonErrorMsg: {
      required: "Reason is required"
    },
    referToNcaErrorMsg: {
      required: "Refer To NCA is required"
    },
    ncaReasonErrorMsg: {
      required: "Reason for Not to refer to NCA is required",
      range: "Reason for Not to refer to NCA should be 1 to 100 characters"
    },
    ncaReferredDateErrorMsg: {
      required: "NCA Referred Date is required"
    },
    signatureErrorMsg: {
      required: "Signature is required",
      range: "Signature should be 1 to 100 characters"
    }
  };

  initialState = {
    showModal: false,
    noticeModal: false,
    noticeModalErrMsg: "",
    memberName: "",
    memberNameState: "",
    memberNamePristine: true,
    memberNameErrorMsg: [],
    reportDate: Date.now(),
    reportDateState: "success",
    reportDatePristine: true,
    reportDateErrorMsg: [],
    customerId: "",
    customerIdState: "",
    customerIdPristine: true,
    customerIdErrorMsg: [],
    customerName: "",
    customerNameState: "",
    customerNamePristine: true,
    customerNameErrorMsg: [],
    suspect: "",
    suspectState: "",
    suspectPristine: true,
    suspectErrorMsg: [],
    suspiciousActivity: "",
    suspiciousActivityState: "",
    suspiciousActivityPristine: true,
    suspiciousActivityErrorMsg: [],
    transactions: [],
    transactionId: "",
    transactionIdState: "",
    transactionIdPristine: true,
    transactionIdErrorMsg: [],
    otherDetails: "",
    otherDetailsState: "",
    otherDetailsPristine: true,
    otherDetailsErrorMsg: [],
    transactionDate: Date.now(),
    transactionDateState: "",
    transactionDatePristine: true,
    transactionDateErrorMsg: [],
    reason: "",
    reasonState: "",
    reasonPristine: true,
    reasonErrorMsg: [],
    documentLinks: "",
    referToNca: false,
    ncaReason: "",
    ncaReasonState: "",
    ncaReasonPristine: true,
    ncaReasonErrorMsg: [],
    ncaReferredDate: null,
    ncaReferredDateState: "",
    ncaReferredDatePristine: true,
    ncaReferredDateErrorMsg: [],
    signature: "",
    signatureState: "",
    signaturePristine: true,
    signatureErrorMsg: [],
    clients: [],
    callInProgress: false,
    selectCustomerName: {
      customerName: "",
      customerId: -1
    },
    selectedDeal: {
      dealID: -1,
      dealIDLabel: -1,
      date: Date.now()
    }
  };
  constructor(props) {
    super(props);
    this.fileUploadComponent = React.createRef();

    this.state = this.initialState;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      return {
        showModal: props.showModal
      };
    }
    return null;
  }
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };
  uploadSupportingDocument = async record => {
    if (this.state.documentLinks !== "") {
      const formData = new FormData();
      formData.append("file", this.state.documentLinks);

      const res = await apiHandler({
        method: "POST",
        url: endpoint.UPLOAD_FILE,
        data: formData
      });
      if (res.data.errorCode) {
        this.setState({
          callInProgress: false,
          waitHeader: "",
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc
        });
      } else {
        record = {
          ...record,
          documentLinks: [res.data.name]
        };
        // res.data.path
        this.props.addRecord(record);
        this.closeModal();
      }
    } else {
      record = {
        ...record,
        documentLinks: []
      };
      // res.data.path
      this.props.addRecord(record);
      this.closeModal();
    }
  };
  submit = () => {
    if (this.isValidated()) {
      const record = {
        memberName: this.state.memberName,
        reportDate: parseDate(this.state.reportDate),
        customerId: this.state.customerId,
        customerName: this.state.customerName,
        suspect: this.state.suspect,
        suspiciousActivity: this.state.suspiciousActivity,
        transactionId: this.state.transactionId,
        otherDetails: this.state.otherDetails,
        transactionDate: parseDate(this.state.transactionDate),
        reason: this.state.reason,
        referToNca: this.state.referToNca,
        ncaReason: this.state.referToNca ? "" : this.state.ncaReason,
        ncaReferredDate: parseDate(this.state.ncaReferredDate),
        signature: this.state.signature
      };

      this.uploadSupportingDocument(record);
    }
  };
  isValidated = () => {
    if (
      this.state.memberNameState === "success" &&
      this.state.reportDateState === "success" &&
      this.state.customerNameState === "success" &&
      this.state.suspectState === "success" &&
      this.state.suspiciousActivityState === "success" &&
      this.state.transactionIdState === "success" &&
      this.state.otherDetailsState === "success" &&
      this.state.reasonState === "success" &&
      (this.state.ncaReasonState === "success" ||
        this.state.ncaReferredDateState === "success") &&
      this.state.signatureState === "success"
    ) {
      return true;
    } else {
      if (this.state.memberNameState !== "success") {
        this.setState({ memberNameState: "error" });
      }
      if (this.state.reportDateState !== "success") {
        this.setState({ reportDateState: "error" });
      }
      if (this.state.customerNameState !== "success") {
        this.setState({ customerNameState: "error" });
      }
      if (this.state.suspectState !== "success") {
        this.setState({ suspectState: "error" });
      }
      if (this.state.suspiciousActivityState !== "success") {
        this.setState({ suspiciousActivityState: "error" });
      }
      if (this.state.transactionIdState !== "success") {
        this.setState({ transactionIdState: "error" });
      }
      if (this.state.otherDetailsState !== "success") {
        this.setState({ otherDetailsState: "error" });
      }
      if (this.state.reasonState !== "success") {
        this.setState({ reasonState: "error" });
      }
      if (
        this.state.referToNca &&
        this.state.ncaReferredDateState !== "success"
      ) {
        this.setState({ ncaReasonState: "", ncaReferredDateState: "error" });
      } else if (
        !this.state.referToNca &&
        this.state.ncaReasonState !== "success"
      ) {
        this.setState({ ncaReasonState: "error", ncaReferredDateState: "" });
      }
      if (this.state.signatureState !== "success") {
        this.setState({ signatureState: "error" });
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
    // const file = event.target.files[0];
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
  handleNCADateChange = date => {
    this.setState(
      validate(
        date.toString(),
        "ncaReferredDate",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };
  handleDocCategory = event => {
    const value = event.target.value;
    this.setState(
      validate(
        value.customerName,
        "customerName",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
    this.setState(
      validate(
        "" + value.customerId,
        "customerId",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
    this.setState({ selectCustomerName: value }, () => {
      this.getTransactionDetails(value.customerId);
    });
  };
  handleTransactionChange = event => {
    const value = event.target.value;
    if (value.dealID === "other") {
      this.setState({
        transactionId: "",
        selectedDeal: value
      });
    } else {
      this.setState(
        validate(
          value.dealID,
          "transactionId",
          this.state,
          [{ type: "required" }],
          this.error
        )
      );
      this.setState({
        transactionDate: value.date,
        selectedDeal: value
      });
    }
  };
  getTransactionDetails = async customerId => {
    const res = await apiHandler({
      url: endpoint.FX_DEALS_GET + "?type=PAYMENT&customerId" + customerId,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      return;
    } else {
      this.parseDealData(res.data.deals);
    }
  };
  shortenDealId = dealId => {
    let newDealId = dealId;
    let index = dealId.lastIndexOf("-");
    if (index !== -1) {
      newDealId = dealId.substring(index + 1, dealId.length);
    }
    return newDealId;
  };
  parseDealData = deals => {
    let clientDeals = [];
    deals &&
      deals.forEach(deal => {
        clientDeals.push({
          dealID: deal.dealId,
          dealIDLabel: this.shortenDealId(deal.dealId),
          date: deal.dealDate
        });
      });
    this.setState({ transactions: clientDeals });
  };
  handleCheckboxToggle() {
    this.setState({
      referToNca: !this.state.referToNca
    });
  }
  componentWillUnmount() {
    this.initalizeState();
    // this.fileUploadComponent.current.handleRemove();
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
              <AddIcon />
              ADD
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
                      md={5}
                      lg={5}
                    >
                      <CustomInput
                        success={this.state.memberNameState === "success"}
                        error={this.state.memberNameState === "error"}
                        helpText={
                          this.state.memberNameState === "error" &&
                          this.state.memberNameErrorMsg[0]
                        }
                        labelText="Name of Member of Staff*"
                        id="sar_memberName"
                        inputProps={{
                          value: this.state.memberName,
                          onChange: event =>
                            this.handleChange("memberName", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ memberNamePristine: false });
                            this.change(event, "memberName", [
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
                            if (!this.state.memberNamePristine) {
                              this.setState({ memberNamePristine: false });
                              this.change(event, "memberName", [
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
                      md={5}
                      lg={5}
                      style={{ marginTop: 11 }}
                    >
                      <CustomDateSelector
                        success={this.state.reportDateState === "success"}
                        error={this.state.reportDateState === "error"}
                        helpText={
                          this.state.reportDateState === "error" &&
                          this.state.reportDateErrorMsg[0]
                        }
                        id="sar_reportDate"
                        inputProps={{
                          format: "dd MMM yyyy",
                          label: "Date*",
                          value: this.state.reportDate,
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
                            backgroundColor: "white",
                            paddingTop: 5,
                            marginTop: 0,
                            textAlign: "left"
                          }}
                          success={this.state.customerNameState === "success"}
                          error={this.state.customerNameState === "error"}
                          helpText={
                            this.state.customerNameState === "error" &&
                            this.state.customerNameErrorMsg[0]
                          }
                        >
                          Client Name*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.selectCustomerName}
                          onChange={this.handleDocCategory}
                          inputProps={{
                            name: "customerName",
                            id: "customerName",
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"clientNameText"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose client Name
                          </MenuItem>
                          {this.props.clients &&
                            this.props.clients.map(item => (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={item}
                                key={item.customerId}
                              >
                                {item.customerName}
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
                        labelText="Customer ID"
                        id="sar_customerId"
                        inputProps={{
                          value: this.state.customerId,
                          disabled: true,
                          onChange: event =>
                            this.handleChange("customerId", event)
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
                      {/* <Face className={classes.inputAdornmentIcon} /> */}
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={5}
                      lg={5}
                    >
                      <CustomInput
                        success={this.state.suspectState === "success"}
                        error={this.state.suspectState === "error"}
                        helpText={
                          this.state.suspectState === "error" &&
                          this.state.suspectErrorMsg[0]
                        }
                        labelText="Suspect*"
                        id="sar_suspect"
                        inputProps={{
                          value: this.state.suspect,
                          onChange: event => this.handleChange("suspect", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ suspectPristine: false });
                            this.change(event, "suspect", [
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
                            if (!this.state.suspectPristine) {
                              this.setState({ suspectPristine: false });
                              this.change(event, "suspect", [
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
                      md={5}
                      lg={5}
                    >
                      <CustomInput
                        success={
                          this.state.suspiciousActivityState === "success"
                        }
                        error={this.state.suspiciousActivityState === "error"}
                        helpText={
                          this.state.suspiciousActivityState === "error" &&
                          this.state.suspiciousActivityErrorMsg[0]
                        }
                        labelText="Suspicious Activity*"
                        id="sar_suspiciousActivity"
                        inputProps={{
                          value: this.state.suspiciousActivity,
                          onChange: event =>
                            this.handleChange("suspiciousActivity", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              suspiciousActivityPristine: false
                            });
                            this.change(event, "suspiciousActivity", [
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
                            if (!this.state.suspiciousActivityPristine) {
                              this.setState({
                                suspiciousActivityPristine: false
                              });
                              this.change(event, "suspiciousActivity", [
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
                      {/* <Face className={classes.inputAdornmentIcon} /> */}
                    </GridItem>
                    {this.state.transactions &&
                      this.state.transactions.length > 0 && (
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
                                backgroundColor: "white",
                                marginTop: -13,
                                textAlign: "left"
                              }}
                              success={
                                this.state.transactionIdState === "success"
                              }
                              error={this.state.transactionIdState === "error"}
                              helpText={
                                this.state.transactionIdState === "error" &&
                                this.state.transactionIdErrorMsg[0]
                              }
                            >
                              Transaction Details / ID*
                            </FormHelperText>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              value={this.state.selectedDeal}
                              onChange={this.handleTransactionChange}
                              inputProps={{
                                name: "transactionId",
                                id: "sar_transactionId",
                                classes: {
                                  icon: classes.white,
                                  root: classes.selectDropDown
                                }
                              }}
                            >
                              <MenuItem
                                disabled
                                key={"transactionId"}
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                Choose Transaction ID
                              </MenuItem>
                              {this.state.transactions &&
                                this.state.transactions.map(deal => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value={deal}
                                    key={deal.dealID}
                                  >
                                    {deal.dealIDLabel}
                                  </MenuItem>
                                ))}
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={otherDeal}
                                key={otherDeal.dealID}
                              >
                                {otherDeal.dealIDLabel}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </GridItem>
                      )}
                    {this.state.selectedDeal.dealID === "other" ||
                    (this.state.transactions &&
                      this.state.transactions.length <= 0) ? (
                      <GridItem
                        className={classes.customText}
                        xs={10}
                        sm={10}
                        md={5}
                        lg={5}
                      >
                        <CustomInput
                          success={this.state.transactionIdState === "success"}
                          error={this.state.transactionIdState === "error"}
                          helpText={
                            this.state.transactionIdState === "error" &&
                            this.state.transactionIdErrorMsg[0]
                          }
                          labelText="Transaction Details / ID*"
                          id="sar_transactionId"
                          inputProps={{
                            value: this.state.transactionId,
                            onChange: event =>
                              this.handleChange("transactionId", event)
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: event => {
                              this.setState({ transactionIdPristine: false });
                              this.change(event, "transactionId", [
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
                              if (!this.state.transactionIdPristine) {
                                this.setState({ transactionIdPristine: false });
                                this.change(event, "transactionId", [
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
                    ) : null}
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
                        success={this.state.otherDetailsState === "success"}
                        error={this.state.otherDetailsState === "error"}
                        helpText={
                          this.state.otherDetailsState === "error" &&
                          this.state.otherDetailsErrorMsg[0]
                        }
                        labelText="Other Details*"
                        id="sar_otherDetails"
                        inputProps={{
                          value: this.state.otherDetails,
                          onChange: event =>
                            this.handleChange("otherDetails", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ otherDetailsPristine: false });
                            this.change(event, "otherDetails", [
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
                            if (!this.state.otherDetailsPristine) {
                              this.setState({ otherDetailsPristine: false });
                              this.change(event, "otherDetails", [
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
                      <DescriptionIcon className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                    >
                      <b className={classes.subTitle}>Reason</b>
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
                        success={this.state.reasonState === "success"}
                        error={this.state.reasonState === "error"}
                        helpText={
                          this.state.reasonState === "error" &&
                          this.state.reasonErrorMsg[0]
                        }
                        id="sar_reason"
                        inputProps={{
                          multiline: true,
                          rows: 2,
                          value: this.state.reason,
                          onChange: event => this.handleChange("reason", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          onBlur: event => {
                            this.setState({ reasonPristine: false });
                            this.change(event, "reason", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.reasonPristine) {
                              this.setState({ reasonPristine: false });
                              this.change(event, "reason", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem
                  className={classes.uploadContainer}
                  xs={10}
                  sm={10}
                  md={11}
                  lg={11}
                >
                  <label className={classes.uploadLabel}>Upload Document</label>
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
                    sendFile={file => this.getFile("documentLinks", file)}
                    ref={this.fileUploadComponent}
                  />
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
                      <AssignmentIcon className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                    >
                      <b className={classes.subTitle}>NCA</b>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem
                  className={classes.customText}
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                >
                  <FormControlLabel
                    className={classes.center}
                    classes={{
                      root: classes.checkboxLabelControl,
                      label: classes.checkboxLabel
                    }}
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleCheckboxToggle()}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        checked={this.state.referToNca}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    label={
                      <div className={classes.termsText}>Refer to NCA</div>
                    }
                  />
                </GridItem>
                <GridItem
                  className={classes.customText + " " + classes.mt20neg}
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                >
                  <CustomInput
                    success={this.state.ncaReasonState === "success"}
                    error={this.state.ncaReasonState === "error"}
                    helpText={
                      this.state.ncaReasonState === "error" &&
                      this.state.ncaReasonErrorMsg[0]
                    }
                    labelText="Don't Refer to NCA Reason for decision*"
                    placeholder="Reason"
                    id="sar_ncaReason"
                    inputProps={{
                      value: this.state.ncaReason,
                      disabled: this.state.referToNca,
                      onChange: event => this.handleChange("ncaReason", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ ncaReasonPristine: false });
                        this.change(event, "ncaReason", []);
                      },
                      onChange: event => {
                        if (!this.state.ncaReasonPristine) {
                          this.setState({ ncaReasonPristine: false });
                          this.change(event, "ncaReason", []);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem
                  className={classes.customText + " " + classes.mt20neg}
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                >
                  <FormHelperText
                    style={{
                      backgroundColor: "white",
                      paddingTop: 7,
                      marginTop: 0,
                      textAlign: "left"
                    }}
                    success={this.state.ncaReferredDateState === "success"}
                    error={this.state.ncaReferredDateState === "error"}
                    helpText={
                      this.state.ncaReferredDateState === "error" &&
                      this.state.ncaReferredDateErrorMsg[0]
                    }
                  >
                    Date referred to NCA*
                  </FormHelperText>
                  <CustomDateSelector
                    id="sar_ncaReferredDate"
                    inputProps={{
                      format: "dd MMM yyyy",
                      // label: "Date referred to NCA*",
                      value: this.state.ncaReferredDate,
                      disabled: !this.state.referToNca,
                      onChange: this.handleNCADateChange,
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
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem
                      xs={1}
                      sm={1}
                      md={1}
                      lg={1}
                      className={classes.textIcon}
                    >
                      <GestureIcon className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                    >
                      <b className={classes.subTitle}>Signature</b>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem
                  className={classes.customText}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                >
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem
                      xs={1}
                      sm={1}
                      md={1}
                      lg={1}
                      className={classes.textIcon}
                    >
                      {/* <GestureIcon className={classes.inputAdornmentIcon} /> */}
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                    >
                      <CustomInput
                        success={this.state.signatureState === "success"}
                        error={this.state.signatureState === "error"}
                        helpText={
                          this.state.signatureState === "error" &&
                          this.state.signatureErrorMsg[0]
                        }
                        labelText="Signature*"
                        id="sar_signature"
                        inputProps={{
                          value: this.state.signature,
                          onChange: event =>
                            this.handleChange("signature", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ signaturePristine: false });
                            this.change(event, "signature", [
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
                            if (!this.state.signaturePristine) {
                              this.setState({ signaturePristine: false });
                              this.change(event, "signature", [
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
                  <div
                    className={classes.center}
                    style={{ textAlign: "right" }}
                  >
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      onClick={this.submit}
                    >
                      SUBMIT
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal
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
                ? "New Admin user is created sucessfully"
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

CreateSARRecord.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  addRecord: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  clients: PropTypes.array.isRequired
};

export default withRouter(withStyles(style)(CreateSARRecord));
