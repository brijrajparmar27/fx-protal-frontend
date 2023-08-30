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

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import { shortenDealId, parseDate } from "../../utils/Utils";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import DescriptionIcon from "@material-ui/icons/Description";
import GestureIcon from "@material-ui/icons/Gesture";
// import LockOutline from "@material-ui/icons/LockOutline";

import { validate } from "../../utils/Validator";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import FileUpload from "components/FileUpload/FileUpload.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";

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
    paddingTop: 15
  },
  select: {
    paddingBottom: 10,
    fontSize: 14
  },
  filledSelect: {
    textAlign: "left",
    margin: "0 12px"
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: -15
    }
  },
  FeeFormControl: {
    marginTop: 15
  },
  modalCloseButton: {
    float: "right"
  },
  loginMaxWidth: {
    maxWidth: 650
  },
  uploadLabel: {
    marginRight: 20
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

class ChangeStatusDialog extends React.Component {
  error = {
    memberNameErrorMsg: {
      required: "Member Name is required",
      range: "Member Name should be 1 to 100 characters"
    },
    reportDateErrorMsg: {
      required: "Report Date is required"
    },
    reasonErrorMsg: {
      required: "Reason is required"
    },
    statusErrorMsg: {
      required: "Updated Status is required"
    },
    riskLevelErrorMsg: {
      required: "Risk Level is required"
    },
    signatureErrorMsg: {
      required: "Signature is required",
      range: "Signature should be 1 to 100 characters"
    }
  };

  initialState = {
    showModal: false,
    memberName: "",
    memberNameState: "",
    memberNamePristine: true,
    memberNameErrorMsg: [],
    reportDate: Date.now(),
    reportDateState: "success",
    reportDatePristine: true,
    reportDateErrorMsg: [],
    reason: "",
    reasonState: "",
    reasonPristine: true,
    reasonErrorMsg: [],
    documentLinks: "",
    signature: "",
    signatureState: "",
    signaturePristine: true,
    signatureErrorMsg: [],
    status: "",
    statusState: "",
    statusPristine: true,
    statusErrorMsg: [],
    customerId: "",
    customerName: "",
    soldCurrencyCode: "",
    showCancellationFee: false,
    cancellationFee: "",
    taskId: "",
    taskType: "",
    statusList: [],
    riskLevel: "",
    riskLevel2: "",
    riskLevelState: "",
    riskLevelPristine: true,
    riskLevelErrorMsg: [],
    RiskLevelList: ["LOW", "MEDIUM", "HIGH"],
    callInProgress: false,
    noticeModal: false,
    noticeModalHeader: "",
    noticeModalErrMsg: ""
  };
  constructor(props) {
    super(props);
    this.fileUploadComponent = React.createRef();

    this.state = this.initialState;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let statusDetails = {};
      if (props.showModal) {
        statusDetails = ChangeStatusDialog.initialState;
        statusDetails = {
          ...statusDetails,
          ...props.taskInfo,
          taskId: props.taskInfo.taskId,
          taskType: props.taskInfo.taskType,
          statusList: props.taskInfo.statusList,
          soldCurrencyCode: props.taskInfo.soldCurrencyCode,
          riskLevel2: props.taskInfo.riskLevel,
          riskLevelState: props.taskInfo.riskLevel ? "success" : ""
        };
      }

      return {
        showModal: props.showModal,
        ...statusDetails
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
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      } else {
        record = {
          ...record,
          supportingDocs: [res.data.name]
        };
        // res.data.path
        this.props.updateStatus(record);
        this.initalizeState();
        // this.props.closeModal();
      }
    } else {
      record = {
        ...record,
        supportingDocs: []
      };
      // res.data.path
      this.props.updateStatus(record);
      this.initalizeState();
      // this.props.closeModal();
    }
  };
  submit = () => {
    if (this.state.taskType === "KYC" && this.state.documentLinks === "") {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: "Supporting Document is mandatory for KYC update."
      });
      return;
    }

    if (this.isValidated()) {
      let record = {
        taskId: this.props.taskInfo.taskId,
        taskType: this.props.taskInfo.taskType,
        memberName: this.state.memberName,
        reportDate: parseDate(this.state.reportDate),
        reason: this.state.reason,
        signature: this.state.signature,
        status: this.state.status
      };

      if (this.state.taskType === "BENEFICIARY") {
        record = {
          customerId: this.state.customerId,
          customerName: this.state.customerName,
          ...record
        };
      }

      if (
        this.state.status === "CANCELLED" &&
        this.state.taskType === "TRADE"
      ) {
        record = {
          ...record,
          cancellationFee: this.state.cancellationFee
        };
      }

      if (this.state.taskType === "KYC") {
        record = {
          ...record,
          riskLevel: this.state.riskLevel
        };
      }

      this.uploadSupportingDocument(record);
    }
  };
  isValidated = () => {
    if (
      this.state.memberNameState === "success" &&
      this.state.reportDateState === "success" &&
      this.state.reasonState === "success" &&
      this.state.statusState === "success" &&
      this.state.signatureState === "success"
    ) {
      {
        if (this.state.taskType === "KYC") {
          if (this.state.riskLevelState === "success") return true;
          else {
            if (this.state.riskLevelState !== "success") {
              this.setState({ riskLevelState: "error" });
            }
            return false;
          }
        } else {
          return true;
        }
      }
    } else {
      if (this.state.memberNameState !== "success") {
        this.setState({ memberNameState: "error" });
      }
      if (this.state.reportDateState !== "success") {
        this.setState({ reportDateState: "error" });
      }
      if (this.state.reasonState !== "success") {
        this.setState({ reasonState: "error" });
      }
      if (this.state.statusState !== "success") {
        this.setState({ statusState: "error" });
      }
      if (this.state.riskLevelState !== "success") {
        this.setState({ riskLevelState: "error" });
      }
      if (this.state.signatureState !== "success") {
        this.setState({ signatureState: "error" });
      }
    }
    return false;
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  closeModal = () => {
    this.setState(this.initialState);
    this.props.closeModal();
  };
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  getFeeCancellationText = () => {
    let message =
      "Margin will go to client and only SPOT deposit will be returned";
    if (
      +this.state.cancellationFee &&
      +this.state.cancellationFee !== "" &&
      +this.state.cancellationFee < 0
    ) {
      message =
        "Negative Fees means that there will be a refund for the customer for the amount entered here";
    }
    return message;
  };
  componentDidMount = () => {
    this.initalizeState();
  };

  initalizeState = () => {
    this.setState(this.initialState);
  };
  getFile = (name, file) => {
    this.setState({ [name]: file });
  };
  handleStatus = event => {
    const value = event.target.value;
    this.setState(
      validate(value, "status", this.state, [{ type: "required" }], this.error)
    );
    if (value === "CANCELLED" && this.state.taskType === "TRADE") {
      this.setState({ showCancellationFee: true });
    } else {
      this.setState({ showCancellationFee: false, cancellationFee: 0 });
    }
  };
  handleRiskLevel = event => {
    const value = event.target.value;
    this.setState(
      validate(
        value,
        "riskLevel",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
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
  componentWillUnmount() {
    this.initalizeState();
    this.fileUploadComponent &&
      this.fileUploadComponent.current &&
      this.fileUploadComponent.current.handleRemove();
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
          // style={{ zIndex: 1301 }}
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
              Reason and Support for the Action
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
                        id="changeStatus_memberName"
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
                    >
                      <CustomDateSelector
                        success={this.state.reportDateState === "success"}
                        error={this.state.reportDateState === "error"}
                        helpText={
                          this.state.reportDateState === "error" &&
                          this.state.reportDateErrorMsg[0]
                        }
                        id="changeStatus_reportDate"
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
                      <CustomInput
                        labelText="Client Name"
                        id="changeStatus_clientName"
                        inputProps={{
                          value: this.state.customerName,
                          disabled: true,
                          onChange: event =>
                            this.handleChange("customerName", event)
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
                      md={5}
                      lg={5}
                    >
                      <CustomInput
                        labelText="Customer ID"
                        id="changeStatus_customerId"
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
                      md={3}
                      lg={3}
                    >
                      <CustomInput
                        labelText="Task Type"
                        id="changeStatus_taskType"
                        inputProps={{
                          value: this.state.taskType,
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
                      {this.state.taskType === "TRADE" && (
                        <CustomInput
                          labelText="Deal ID"
                          id="changeStatus_taskDescriptionId"
                          inputProps={{
                            value: shortenDealId(this.state.taskDescriptionId),
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      )}
                      {this.state.taskType === "KYC" && (
                        <FormControl fullWidth className={classes.filledSelect}>
                          <FormHelperText
                            style={{
                              backgroundColor: "white",
                              paddingTop: 5,
                              marginTop: 0,
                              textAlign: "left"
                            }}
                            error={this.state.riskLevelState === "error"}
                          >
                            Updated Risk Level*
                          </FormHelperText>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            disabled={this.state.riskLevel2 ? true : false}
                            value={this.state.riskLevel}
                            onChange={this.handleRiskLevel}
                            inputProps={{
                              name: "riskLevel",
                              id: "riskLevel",
                              classes: {
                                icon: classes.white,
                                root: classes.selectDropDown
                              }
                            }}
                          >
                            <MenuItem
                              disabled
                              key={"riskLevelText"}
                              classes={{
                                root: classes.selectMenuItem
                              }}
                            >
                              Choose Risk Level
                            </MenuItem>
                            {this.state.RiskLevelList.map(item => (
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
                      )}
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={10}
                      sm={10}
                      md={4}
                      lg={4}
                    >
                      <FormControl fullWidth className={classes.filledSelect}>
                        <FormHelperText
                          style={{
                            backgroundColor: "white",
                            paddingTop: 5,
                            marginTop: 0,
                            textAlign: "left"
                          }}
                          // success={this.state.statusState === "success"}
                          error={this.state.statusState === "error"}
                          // helpText={
                          //   this.state.statusState === "error" &&
                          //   this.state.statusErrorMsg[0]
                          // }
                        >
                          Updated Status*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.status}
                          onChange={this.handleStatus}
                          inputProps={{
                            name: "status",
                            id: "status",
                            classes: {
                              icon: classes.white,
                              root: classes.selectDropDown
                            }
                          }}
                        >
                          <MenuItem
                            disabled
                            key={"statusText"}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Choose updated Status
                          </MenuItem>
                          {this.state.statusList.map(item => (
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
                {this.state.showCancellationFee && (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    className={classes.FeeFormControl}
                  >
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
                        <CustomNumberFormat
                          helpText={this.getFeeCancellationText()}
                          value={this.state.cancellationFee}
                          onChange={event =>
                            this.handleChange("cancellationFee", event)
                          }
                          id="changeStatus_cancellationFee"
                          labelText="Cancellation Fee"
                          formControlProps={{
                            style: { paddingTop: 0 },
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem
                        className={classes.customText}
                        xs={10}
                        sm={10}
                        md={5}
                        lg={5}
                        style={{ marginTop: -32 }}
                      >
                        <CustomInput
                          helpText={" "}
                          labelText="Currency Code"
                          id="changeStatus_currencyCode"
                          inputProps={{
                            value: this.state.soldCurrencyCode || "",
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
                )}
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
                        id="changeStatus_reason"
                        labelText="Reason"
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
                  {this.state.taskType === "KYC" ? (
                    <label className={classes.uploadLabel}>
                      Upload Document*
                    </label>
                  ) : (
                    <label className={classes.uploadLabel}>
                      Upload Document
                    </label>
                  )}
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
                        id="changeStatus_signature"
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

ChangeStatusDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  taskInfo: PropTypes.object,
  updateStatus: PropTypes.func,
  closeModal: PropTypes.func.isRequired
};

export default withRouter(withStyles(style)(ChangeStatusDialog));
