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
import GestureIcon from "@material-ui/icons/Gesture";
// import LockOutline from "@material-ui/icons/LockOutline";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class CreateCustomerActivityRecord extends React.Component {
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
    typeErrorMsg: {
      required: "Activity Type is required"
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
    type: "",
    typeState: "",
    typePristine: true,
    typeErrorMsg: [],
    reason: "",
    reasonState: "",
    reasonPristine: true,
    reasonErrorMsg: [],
    documentLinks: "",
    signature: "",
    signatureState: "",
    signaturePristine: true,
    signatureErrorMsg: [],
    activityTypes: this.props.type === "RISKS" ? ["CUSTOMER_STATUS", "MEETING"] : ["CUSTOMER_STATUS", "MEETING", "KYC", "SAR"],
    callInProgress: false
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
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
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
        let doclink = JSON.parse(res.data).name
        record = {
          ...record,
          documentLinks: [doclink]
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
        customerId: this.props.customerId,
        customerName: this.props.customerName,
        reason: this.state.reason,
        type: this.state.type,
        signature: this.state.signature
      };

      this.uploadSupportingDocument(record);
    }
  };
  isValidated = () => {
    if (
      this.state.memberNameState === "success" &&
      this.state.reportDateState === "success" &&
      this.state.typeState === "success" &&
      this.state.reasonState === "success" &&
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
      if (this.state.typeState !== "success") {
        this.setState({ typeState: "error" });
      }
      if (this.state.reasonState !== "success") {
        this.setState({ reasonState: "error" });
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
  handleDocType = event => {
    const value = event.target.value;
    this.setState(
      validate(value, "type", this.state, [{ type: "required" }], this.error)
    );
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
              ADD CUSTOMER ACTIVITY
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
                        id="activity_memberName"
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
                        id="activity_reportDate"
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
                        labelText="Customer Name*"
                        id="activity_customerName"
                        inputProps={{
                          value: this.props.customerName,
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
                      md={5}
                      lg={5}
                    >
                      <CustomInput
                        labelText="Customer ID*"
                        id="activity_customerId"
                        inputProps={{
                          value: this.props.customerId,
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
                      {/* <Face className={classes.inputAdornmentIcon} /> */}
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
                          success={this.state.typeState === "success"}
                          error={this.state.typeState === "error"}
                          helpText={
                            this.state.typeState === "error" &&
                            this.state.typeErrorMsg[0]
                          }
                        >
                          Type*
                        </FormHelperText>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          value={this.state.type}
                          onChange={this.handleDocType}
                          inputProps={{
                            name: "type",
                            id: "activity_type",
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
                            Choose Activity Type
                          </MenuItem>
                          {this.state.activityTypes &&
                            this.state.activityTypes.map(item => (
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
                    >
                      <label className={classes.uploadLabel}>
                        Upload Document
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
                        sendFile={file => this.getFile("documentLinks", file)}
                        ref={this.fileUploadComponent}
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
                        id="activity_reason"
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
                        id="activity_signature"
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
            id="activity_notice-modal-slide-title"
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
            id="activity_notice-modal-slide-description"
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

CreateCustomerActivityRecord.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  addRecord: PropTypes.func,
  customerId: PropTypes.object,
  customerName: PropTypes.object,
  type: PropTypes.string, 
  closeModal: PropTypes.func.isRequired
};

export default withRouter(withStyles(style)(CreateCustomerActivityRecord));
