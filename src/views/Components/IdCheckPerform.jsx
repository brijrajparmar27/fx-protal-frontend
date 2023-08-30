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
import InputLabel from "@material-ui/core/InputLabel";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class IdCheckPerform extends React.Component {
  error = {
    customerIdErrorMsg: {
      required: "customer Id is required"
    },
    customerNameErrorMsg: {
      required: "Customer Name is required"
    },
    firstNameErrorMsg: {
      required: "First Name is required"
    },
    lastNameErrorMsg: {
      required: "Last Name is required"
    },
    kycEntityIdErrorMsg: {
      required: "KYC Entity Id is required"
    },
    directorIdErrorMsg: {
      required: "Director ID is required"
    },
    addressProofTypeErrorMsg: {
      required: "Address Proof Type is required"
    },
    addressProofLinkErrorMsg: {
      required: "Address Proof Document is required"
    }
  };

  initialState = {
    showModal: false,
    noticeModal: false,
    noticeModalHeader: "",
    noticeModalErrMsg: "",
    customerId: "",
    customerIdState: "",
    customerIdPristine: true,
    customerIdErrorMsg: [],
    customerName: "",
    customerNameState: "",
    customerNamePristine: true,
    customerNameErrorMsg: [],
    firstName: "",
    firstNameState: "",
    firstNamePristine: true,
    firstNameErrorMsg: [],
    lastName: "",
    lastNameState: "",
    lastNamePristine: true,
    lastNameErrorMsg: [],
    kycEntityId: "",
    kycEntityIdState: "",
    kycEntityIdPristine: true,
    kycEntityIdErrorMsg: [],
    directorId: "",
    directorIdState: "",
    directorIdPristine: true,
    directorIdErrorMsg: [],
    alreadyUploaded: true,
    addressProofType: "",
    addressProofTypeState: "",
    addressProofTypePristine: true,
    addressProofTypeErrorMsg: [],
    addressProofLink: "",
    addressProofLinkState: "",
    addressProofLinkPristine: true,
    addressProofLinkErrorMsg: [],
    newAddressProofType: "",
    uploadedFile: "",
    callInProgress: false,
    selectCustomerName: {
      customerName: "",
      customerId: -1
    },
    availableAddressProofType: [
      { value: "passport", label: "Passport" },
      { value: "driving_licence", label: "Driving Licence" },
      { value: "residence_permit", label: "Resident Permit" },
      { value: "visa", label: "Other Acceptable" },
      { value: "id_card", label: "National Govt. ID" }
    ]
  };
  constructor(props) {
    super(props);
    this.fileUploadComponent = React.createRef();

    this.state = this.initialState;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let director = {};
      let pristineState = {};
      if (props.showModal) {
        director = IdCheckPerform.initialState;
        director = { ...director, ...props.idCheckRequiredData };
        director.alreadyUploaded =
          props.idCheckRequiredData.addressProofLink !== "";
        pristineState = {
          firstNameState: "success",
          lastNameState: "success",
          customerIdState: "success",
          customerNameState: "success",
          kycEntityIdState: "success",
          directorIdState: "success",
          addressProofTypeState: "success",
          addressProofLinkState: "success"
        };
      }

      return {
        showModal: props.showModal,
        ...director,
        ...pristineState
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
    if (this.state.uploadedFile !== "" && !this.state.alreadyUploaded) {
      const formData = new FormData();
      formData.append("file", this.state.uploadedFile);

      const res = await apiHandler({
        method: "POST",
        url: endpoint.UPLOAD_FILE,
        data: formData
      });
      if (res.data.errorCode) {
        this.setState({
          callInProgress: false,
          waitHeader: "",
          noticeModal: false,
          noticeModalHeader: "",
          noticeModalErrMsg: res.data.userDesc
        });
      } else {
        record = {
          ...record,
          file: res.data.name
        };
        // res.data.path
        this.props.updateIDCheck(record);
        this.closeModal();
      }
    } else {
      record = {
        ...record,
        file: this.state.addressProofLink
      };
      // res.data.path
      this.props.updateIDCheck(record);
      this.closeModal();
    }
  };
  submit = () => {
    if (this.isValidated()) {
      if (
        (this.state.alreadyUploaded && this.state.addressProofLink === "") ||
        (!this.state.alreadyUploaded && this.state.uploadedFile === "")
      ) {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg:
            this.state.newAddressProofType !== ""
              ? "Please attach the selected document"
              : "Please select the document to check"
        });
        return;
      }
      const record = {
        customerId: this.state.customerId,
        customerName: this.state.customerName,
        kycEntityId: this.state.kycEntityId,
        alreadyUploaded: this.state.alreadyUploaded,
        type: this.state.alreadyUploaded
          ? this.state.addressProofType
          : this.state.newAddressProofType,
        directorId: this.state.directorId,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      };

      this.uploadSupportingDocument(record);
    }
  };
  isValidated = () => {
    if (
      this.state.customerIdState === "success" &&
      this.state.customerNameState === "success" &&
      this.state.firstNameState === "success" &&
      this.state.lastNameState === "success" &&
      this.state.kycEntityIdState === "success" &&
      this.state.directorIdState === "success" &&
      this.state.addressProofLinkState === "success"
    ) {
      return true;
    } else {
      if (this.state.customerIdState !== "success") {
        this.setState({ customerIdState: "error" });
      }
      if (this.state.reportDateState !== "success") {
        this.setState({ reportDateState: "error" });
      }
      if (this.state.customerNameState !== "success") {
        this.setState({ customerNameState: "error" });
      }
      if (this.state.firstNameState !== "success") {
        this.setState({ firstNameState: "error" });
      }
      if (this.state.lastNameState !== "success") {
        this.setState({ lastNameState: "error" });
      }
      if (this.state.kycEntityIdState !== "success") {
        this.setState({ kycEntityIdState: "error" });
      }
      if (this.state.directorIdState !== "success") {
        this.setState({ directorIdState: "error" });
      }
      if (this.state.addressProofType !== "success") {
        this.setState({ addressProofType: "error" });
      }
      if (this.state.addressProofLinkState !== "success") {
        this.setState({ addressProofLinkState: "error" });
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
  handleDocCategory = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleCheckboxToggle() {
    if (this.state.addressProofLink === "" && !this.state.alreadyUploaded) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg:
          "You cannot select Already Uploaded when No document was uploaded previously"
      });
      return;
    }
    this.setState({
      alreadyUploaded: !this.state.alreadyUploaded
    });
  }
  getDocumentLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Uploaded Document
      </a>
    ) : (
      <></>
    );
  };
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
              PERFORM ID CHECK
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
                      className={classes.customText}
                      xs={11}
                      sm={11}
                      md={11}
                      lg={11}
                    >
                      <CustomInput
                        labelText="Customer Name"
                        id="icp_customerName"
                        inputProps={{
                          value: this.state.customerName || "",
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
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems="center">
                    <GridItem
                      className={classes.customText}
                      xs={11}
                      sm={11}
                      md={6}
                      lg={6}
                    >
                      <CustomInput
                        labelText="First Name*"
                        id="icp_firstName"
                        inputProps={{
                          value: this.state.firstName || "",
                          disabled: true,
                          onChange: event =>
                            this.handleChange("firstName", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                      />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={11}
                      sm={11}
                      md={6}
                      lg={6}
                    >
                      <CustomInput
                        labelText="Last Name"
                        id="icp_lastName"
                        inputProps={{
                          value: this.state.lastName || "",
                          disabled: true,
                          onChange: event =>
                            this.handleChange("lastName", event)
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
                  <GridContainer alignItems="center">
                    <GridItem
                      className={classes.customText}
                      xs={11}
                      sm={11}
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
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            checked={this.state.alreadyUploaded}
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot
                            }}
                          />
                        }
                        label={
                          <div className={classes.termsText}>
                            Use uploaded File
                          </div>
                        }
                      />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={11}
                      sm={11}
                      md={4}
                      lg={4}
                    >
                      <CustomInput
                        labelText="File Type"
                        id="icp_addressProofType"
                        inputProps={{
                          value: this.state.addressProofType || "",
                          disabled: true,
                          onChange: event =>
                            this.handleChange("addressProofType", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                      />
                    </GridItem>
                    <GridItem
                      className={classes.customText}
                      xs={11}
                      sm={11}
                      md={5}
                      lg={5}
                    >
                      {/* <CustomInput
                        labelText='Uploaded Document'
                        id='sar_addressProofLink'
                        inputProps={{
                          value: this.state.addressProofLink || '',
                          disabled: true,
                          onChange: (event) => this.handleChange('addressProofLink', event),
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      /> */}
                      {this.getDocumentLink(this.state.addressProofLink || "")}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                {!this.state.alreadyUploaded && (
                  <>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <b className={classes.subTitle}>New Address Proof File</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer alignItems="center">
                        <GridItem
                          className={classes.customText}
                          xs={11}
                          sm={11}
                          md={6}
                          lg={6}
                        >
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                          >
                            <InputLabel
                              htmlFor="newAddressProofType"
                              className={classes.selectLabel}
                            >
                              Document Type*
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              classes={{
                                select: classes.select
                              }}
                              value={this.state.newAddressProofType}
                              onChange={this.handleDocCategory}
                              inputProps={{
                                name: "newAddressProofType",
                                id: "newAddressProofType"
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                Choose Designation
                              </MenuItem>
                              {this.state.availableAddressProofType &&
                                this.state.availableAddressProofType.map(
                                  item => (
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value={item.value}
                                      key={item.value}
                                    >
                                      {item.label}
                                    </MenuItem>
                                  )
                                )}
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={11}
                          sm={11}
                          md={6}
                          lg={6}
                        >
                          <label className={classes.uploadLabel}>
                            Govt. ID/ Passport / Driving License
                          </label>
                          <FileUpload
                            avatar
                            supportedMimeType={[
                              "image/jpeg",
                              "image/bmp",
                              "image/png",
                              "application/pdf",
                              "image/tiff"
                            ]}
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
                              this.getFile("uploadedFile", file)
                            }
                            ref={this.fileUploadComponent}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </>
                )}
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

IdCheckPerform.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  updateIDCheck: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  idCheckRequiredData: PropTypes.object.isRequired
};

export default withRouter(withStyles(style)(IdCheckPerform));
