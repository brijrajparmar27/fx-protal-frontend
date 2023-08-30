import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";
import FileUpload from "components/FileUpload/FileUpload.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
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
import addDirectorsStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class AddDirectors extends React.Component {
  error = {
    firstNameErrorMsg: {
      required: "First name is required",
      range: "First name should be 1 to 100 characters"
    },
    lastNameErrorMsg: {
      required: "Last name is required",
      range: "First name should be 1 to 100 characters"
    },
    dobErrorMsg: {
      required: "Date of birth is required"
    },
    addressErrorMsg: {
      required: "Address is required"
    },
    emailErrorMsg: {
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
    designationErrorMsg: {
      required: "Designation is required"
    },
    otherDesignationErrorMsg: {
      required: "Designation is required"
    },
    otherUtilityOrBankStmtErrorMsg: {
      required: "Document Name is required"
    },
    addressProofTypeErrorMsg: {
      required: "Please Select Document Type",
      sameDocumentType:
        "Driving License is seleted for both the Documents. Please select different document type"
    },
    otherAddressProofTypeErrorMsg: {
      required: "Document Name is required"
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
      otpModal: false,
      directors: this.props.directors,
      firstName: "",
      firstNameState: "",
      firstNamePristine: true,
      firstNameErrorMsg: [],
      lastName: "",
      lastNameState: "",
      lastNamePristine: true,
      lastNameErrorMsg: [],
      dob: null,
      dobState: "",
      dobPristine: true,
      dobErrorMsg: [],
      address: "",
      addressState: "",
      addressPristine: true,
      addressErrorMsg: [],
      email: "",
      emailState: "",
      emailPristine: true,
      emailErrorMsg: [],
      city: "",
      cityState: "",
      cityPristine: true,
      cityErrorMsg: [],
      postalCode: "",
      postalCodeState: "",
      postalCodePristine: true,
      postalCodeErrorMsg: [],
      countryCode: "",
      countryCodeState: "",
      countryCodePristine: true,
      countryCodeErrorMsg: [],
      addressProofLink: "",
      utilityOrBankStmtLink: "",
      countries: [],
      designation: "",
      designationState: "",
      designationPristine: true,
      designationErrorMsg: [],
      showOther: false,
      otherDesignation: "",
      otherDesignationState: "",
      otherDesignationPristine: true,
      otherDesignationErrorMsg: [],
      addressProofType: null,
      addressProofTypeState: "",
      addressProofTypeUpload: false,

      showOtherAddressProofType: false,
      otherAddressProofType: "",
      otherAddressProofTypeState: "",
      otherAddressProofTypePristine: true,
      otherAddressProofTypeErrorMsg: [],

      utilityOrBankStmtType: null,
      utilityOrBankStmtTypeUpload: false,
      utilityOrBankStmtTypeState: "",
      showOtherUtilityOrBankStmt: false,
      otherUtilityOrBankStmt: "",
      otherUtilityOrBankStmtState: "",
      otherUtilityOrBankStmtPristine: true,
      otherUtilityOrBankStmtErrorMsg: [],
      availableDesignations: [
        "Director",
        "Shareholder",
        "Director & Shareholder"
      ],
      availableAddressProofType: [
        { value: "passport", label: "Passport" },
        { value: "driving_license", label: "Driving License" },
        { value: "residence_permit", label: "Resident Permit" },
        { value: "id_card", label: "National Govt. ID" },
        { value: "other", label: "Other Acceptable ( - Please Specify - )" }
      ],
      utilityOrBankStmtProofType: [
        { value: "utility_bills", label: "Utility Bills" },
        { value: "bank_statement", label: "Bank Statement" },
        { value: "driving_license", label: "Driving License" },
        { value: "council_bill", label: "Council Bill" },
        { value: "tenancy_agreement", label: "Tenancy Agreement" },
        { value: "other", label: "Other Acceptable ( - Please Specify - )" }
      ],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };

    this.state = this.initialState;
  }

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
  componentWillUnmount = () => {
    this.setState(this.initialState);
  };

  initializeData = async () => {
    const { editDirector } = this.props;
    if (!editDirector) {
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
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };

  isValidated = () => {
    let status = true;
    if (this.state.designation === "Other") {
      if (this.state.otherDesignationState === "success") status = true;
      else {
        if (this.state.otherDesignationState !== "success") {
          status = false;
          this.setState({ otherDesignationState: "error" });
        }
      }
    }
    if (this.state.utilityOrBankStmtType === "other") {
      if (this.state.otherUtilityOrBankStmtState === "success") status = true;
      else {
        if (this.state.otherUtilityOrBankStmtState !== "success") {
          status = false;
          this.setState({ otherUtilityOrBankStmtState: "error" });
          //return false;
        }
      }
    }
    if (this.state.addressProofType === "other") {
      if (this.state.otherAddressProofTypeState === "success") status = true;
      else {
        if (this.state.otherAddressProofTypeState !== "success") {
          status = false;
          this.setState({ otherAddressProofTypeState: "error" });
          //return false;
        }
      }
    }
    if (
      this.state.utilityOrBankStmtType === "driving_license" &&
      this.state.addressProofType === "driving_license"
    ) {
      status = false;
      this.setState({ addressProofTypeState: "error" });
    }
    if (
      status &&
      this.state.firstNameState === "success" &&
      this.state.lastNameState === "success" &&
      this.state.designationState === "success" &&
      this.state.dobState === "success" &&
      this.state.addressState === "success" &&
      this.state.cityState === "success" &&
      this.state.postalCodeState === "success" &&
      this.state.countryCodeState === "success"
    ) {
      // return true;
    } else {
      if (this.state.firstNameState !== "success") {
        this.setState({ firstNameState: "error" });
      }
      if (this.state.lastNameState !== "success") {
        this.setState({ lastNameState: "error" });
      }
      if (this.state.designationState !== "success") {
        this.setState({ designationState: "error" });
      }
      if (this.state.dobState !== "success") {
        this.setState({ dobState: "error" });
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
      return false;
    }
    // if (
    //   (this.state.addressProofType === null && (this.addressUploadComponent.current.state.file != null||(this.state.addressProofLink&&this.state.addressProofLink!=''))) ||
    //   (this.state.addressProofType != null && (this.addressUploadComponent.current.state.file === null||(this.state.addressProofLink&&this.state.addressProofLink=='')))
    // )
    if (
      (this.state.addressProofType === null &&
        (this.state.addressProofLink &&
          (this.state.addressProofLink != "" ||
            this.state.addressProofLink != null))) ||
      (this.state.addressProofType != null &&
        (!this.state.addressProofLink ||
          this.state.addressProofLink === "" ||
          this.state.addressProofLink == null))
    ) {
      let addressProofTypeState =
        this.addressUploadComponent.current.state.file != null
          ? "select"
          : "file";
      this.setState({ addressProofTypeState });
      return false;
    }
    if (
      !this.props.isAddon &&
      ((this.state.utilityOrBankStmtType === null &&
        (this.state.utilityOrBankStmtLink &&
          (this.state.utilityOrBankStmtLink != "" ||
            this.state.utilityOrBankStmtLink != null))) ||
        (this.state.utilityOrBankStmtType != null &&
          (!this.state.utilityOrBankStmtLink ||
            this.state.utilityOrBankStmtLink === "" ||
            this.state.utilityOrBankStmtLink == null)))
    ) {
      let utilityOrBankStmtTypeState =
        this.utilityUploadComponent.current.state.file != null
          ? "select"
          : "file";
      this.setState({ utilityOrBankStmtTypeState });
      return false;
    }

    return true;
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose() {
    // var x = [];
    // x[modal] = false;
    this.initializeData();
    this.setState(this.initialState);
    this.addressUploadComponent &&
      this.addressUploadComponent.current &&
      this.addressUploadComponent.current.handleRemove();
    this.utilityUploadComponent &&
      this.utilityUploadComponent.current &&
      this.utilityUploadComponent.current.handleRemove();
    this.props.handleClose();
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };

  parseDate(dateObj) {
    if (dateObj === null || dateObj === "") return null;

    var month =
      (dateObj.getMonth() + 1 < 10 ? "0" : "") + (dateObj.getMonth() + 1);
    var date = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate();
    return dateObj.getFullYear() + "-" + month + "-" + date;
  }

  static parseFromString(dateStr) {
    if (dateStr === null || dateStr === "") return null;

    return new Date(new Date(dateStr).toDateString());
  }

  uploadAddressProofLink = async director => {
    if (
      this.state.addressProofTypeUpload &&
      this.addressUploadComponent.current.state.file != null
    ) {
      const formData = new FormData();
      formData.append("file", this.addressUploadComponent.current.state.file);

      const res = await apiHandler({
        method: "POST",
        url: endpoint.UPLOAD_FILE,
        data: formData
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
        const uploadDoc = res.data;
        director = {
          ...director,
          addressProofLink: uploadDoc.name
        };
        this.uploadUtilityOrBankStmtLink(director);
      }
    } else {
      this.uploadUtilityOrBankStmtLink(director);
    }
  };

  uploadUtilityOrBankStmtLink = async director => {
    if (
      this.state.utilityOrBankStmtTypeUpload &&
      this.utilityUploadComponent.current.state.file != null
    ) {
      const formData = new FormData();
      formData.append("file", this.utilityUploadComponent.current.state.file);

      const res = await apiHandler({
        method: "POST",
        url: endpoint.UPLOAD_FILE,
        data: formData
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
        const uploadDoc = res.data;
        director = {
          ...director,
          utilityOrBankStmtLink: uploadDoc.name
        };
        this.props.editDirector
          ? this.props.updateDirector(director)
          : this.props.addDirector(director);
        this.initializeData();
        this.addressUploadComponent &&
          this.addressUploadComponent.current &&
          this.addressUploadComponent.current.handleRemove();
        this.utilityUploadComponent &&
          this.utilityUploadComponent.current &&
          this.utilityUploadComponent.current.handleRemove();
        this.handleClose();
      }
    } else {
      this.props.editDirector
        ? this.props.updateDirector(director)
        : this.props.addDirector(director);
      this.initializeData();
      this.addressUploadComponent &&
        this.addressUploadComponent.current &&
        this.addressUploadComponent.current.handleRemove();
      this.utilityUploadComponent &&
        this.utilityUploadComponent.current &&
        this.utilityUploadComponent.current.handleRemove();
      this.handleClose();
    }
  };
  getAlpha2Code = code => {
    let alpha2 = this.state.countries.filter(item => {
      return item.countryCode === code;
    })[0];
    return alpha2;
  };
  addDirector = () => {
    let alpha2 = this.getAlpha2Code(this.state.countryCode);

    const directorDetails = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      designation: this.props.isAddon
        ? this.state.showOther
          ? this.state.otherDesignation
          : this.state.designation
        : this.state.designation,
      dob: this.parseDate(this.state.dob),
      address: this.state.address,
      email: this.state.email,
      city: this.state.city,
      postalCode: this.state.postalCode,
      countryCode: this.state.countryCode,
      alpha2Code: alpha2 && alpha2.alpha2Code ? alpha2.alpha2Code : "",
      // addressProofType: this.state.addressProofType,
      //utilityOrBankStmtType: this.state.utilityOrBankStmtType,
      addressProofType: this.state.showOtherAddressProofType
        ? this.state.otherAddressProofType
        : this.state.addressProofType,

      utilityOrBankStmtType: this.state.showOtherUtilityOrBankStmt
        ? this.state.otherUtilityOrBankStmt
        : this.state.utilityOrBankStmtType,
      addressProofLink: this.addressUploadComponent.current.state.file, //'',
      utilityOrBankStmtLink: this.props.isAddon
        ? ""
        : this.utilityUploadComponent.current.state.file //'',
    };

    if (this.isValidated()) {
      // this.props.addDirector();
      // this.initializeData();
      // this.addressUploadComponent.current.handleRemove();
      // this.utilityUploadComponent.current.handleRemove();
      // this.props.handleClose();
      this.uploadAddressProofLink(directorDetails);
    } else if (this.state.dob === null) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: "Please provide valid Date of Birth"
      });
    }
  };

  updateDirector = () => {
    let alpha2 = this.getAlpha2Code(this.state.countryCode);

    if (this.isValidated()) {
      let director = {
        id: this.state.id,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        designation: this.props.isAddon
          ? this.state.showOther
            ? this.state.otherDesignation
            : this.state.designation
          : this.state.designation,
        dob: this.parseDate(this.state.dob),
        address: this.state.address,
        email: this.state.email,
        city: this.state.city,
        postalCode: this.state.postalCode,
        countryCode: this.state.countryCode,
        alpha2Code: alpha2 && alpha2.alpha2Code ? alpha2.alpha2Code : "",
        // addressProofType: this.state.addressProofType,
        addressProofLink: this.state.addressProofLink,
        //utilityOrBankStmtType: this.state.utilityOrBankStmtType,
        addressProofType: this.state.showOtherAddressProofType
          ? this.state.otherAddressProofType
          : this.state.addressProofType,

        utilityOrBankStmtType: this.state.showOtherUtilityOrBankStmt
          ? this.state.otherUtilityOrBankStmt
          : this.state.utilityOrBankStmtType,
        utilityOrBankStmtLink: this.state.utilityOrBankStmtLink
      };
      let utilityOrBankStmtTypeUpload = false;
      let addressProofTypeUpload = false;
      if (this.props.isAddon) {
        director.alreadyUploaded =
          this.addressUploadComponent.current.state.file ===
          this.props.editDirector.addressProofLink;
        director.kycEntityId = this.props.editDirector.kycEntityId;
        director.customerId = this.props.editDirector.customerId;
        director.companyName = this.props.editDirector.companyName;
        director.additionalDirector = true;
        utilityOrBankStmtTypeUpload =
          this.utilityUploadComponent.current.state.file ===
          this.props.editDirector.utilityOrBankStmtLink;
        addressProofTypeUpload =
          this.addressUploadComponent.current.state.file ===
          this.props.editDirector.addressProofLink;

        if (utilityOrBankStmtTypeUpload && addressProofTypeUpload) {
          director.addressProofLink = this.addressUploadComponent.current.state.file;
          this.props.updateDirector(director);
          this.initializeData();
          this.addressUploadComponent &&
            this.addressUploadComponent.current &&
            this.addressUploadComponent.current.handleRemove();
          this.utilityUploadComponent &&
            this.utilityUploadComponent.current &&
            this.utilityUploadComponent.current.handleRemove();
          this.handleClose();
        } else {
          this.setState(
            {
              utilityOrBankStmtTypeUpload: !utilityOrBankStmtTypeUpload,
              addressProofTypeUpload: !addressProofTypeUpload
            },
            () => {
              this.uploadAddressProofLink(director);
            }
          );
        }
      } else {
        this.setState(
          {
            utilityOrBankStmtTypeUpload: !utilityOrBankStmtTypeUpload,
            addressProofTypeUpload: !addressProofTypeUpload
          },
          () => {
            this.uploadAddressProofLink(director);
          }
        );
      }
    } else if (this.state.dob === null) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: "Please provide valid Date of Birth"
      });
    }
  };

  getFile = (name, file, stateName) => {
    let errorState = stateName + "State";
    let uploadState = stateName + "Upload";
    this.setState({ [name]: file, [errorState]: "", [uploadState]: true });
  };
  removeFile = name => {
    this.setState({ [name]: null });
  };

  handleLoginSubmit() {
    this.setState({
      showModal: false,
      otpModal: true
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let director = {};
      let pristineState = {};
      if (props.showModal) {
        director = AddDirectors.initialState || {};
        director.availableDesignations = props.isAddon
          ? ["Director", "Shareholder", "Director & Shareholder", "Other"]
          : ["Director", "Shareholder", "Director & Shareholder"];
        if (props.editDirector) {
          director = { ...director, ...props.editDirector };
          director.dob = AddDirectors.parseFromString(director.dob);
          if (props.editDirector.designation) {
            director.designationState = "success";
          }
          if (
            props.isAddon &&
            props.editDirector.designation.indexOf(
              director.availableDesignations
            ) === -1
          ) {
            director.showOther = true;
            director.otherDesignation = director.designation;
            director.otherDesignationState = "success";
            director.designationState = "success";
            director.designation = "Other";
          }
          if (
            props.editDirector &&
            props.editDirector.utilityOrBankStmtType &&
            state.utilityOrBankStmtProofType.findIndex(
              obj => obj.value === props.editDirector.utilityOrBankStmtType
            ) === -1
          ) {
            director.showOtherUtilityOrBankStmt = true;
            director.otherUtilityOrBankStmt = director.utilityOrBankStmtType;
            director.otherUtilityOrBankStmtState = "success";
            director.utilityOrBankStmtType = "other";
          }
          if (
            props.editDirector &&
            props.editDirector.addressProofType &&
            state.availableAddressProofType.findIndex(
              obj => obj.value === props.editDirector.addressProofType
            ) === -1
          ) {
            director.showOtherAddressProofType = true;
            director.otherAddressProofType = director.addressProofType;
            director.otherAddressProofTypeState = "success";
            director.addressProofType = "other";
          }
          pristineState = {
            firstNameState: "success",
            lastNameState: "success",
            dobState: "success",
            addressState: "success",
            emailState: "success",
            cityState: "success",
            postalCodeState: "success",
            countryCodeState: "success"
          };
        }
      }

      return {
        showModal: props.showModal,
        ...director,
        ...pristineState
      };
    }
    return null;
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };

  handleDesignation = event => {
    this.setState(
      validate(
        event.target.value,
        event.target.name,
        this.state,
        event.target.name === "designation" ? [{ type: "required" }] : [],
        this.error
      )
    );
    // this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "designation") {
      if (event.target.value === "Other") this.setState({ showOther: true });
      else this.setState({ showOther: false });
    }
    if (event.target.name === "addressProofType") {
      this.setState({ addressProofTypeState: "" });
      if (event.target.value === "other") {
        this.setState({
          showOtherAddressProofType: true,
          addressProofLink: null
        });
      } else {
        this.setState({
          showOtherAddressProofType: false,
          addressProofLink: null
        });
      }
    }
    if (event.target.name === "utilityOrBankStmtType") {
      this.setState({ utilityOrBankStmtTypeState: "select" });
      if (event.target.value === "other") {
        this.setState({
          showOtherUtilityOrBankStmt: true,
          uploadAddressProofLink: null
        });
      } else {
        this.setState({
          showOtherUtilityOrBankStmt: false,
          uploadAddressProofLink: null
        });
      }
    }
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

  handleDateChange = date => {
    this.setState(validate(date, "dob", this.state, [], this.error));
  };
  getDocumentLink = link => {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    );
  };

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
                Add Director / Shareholder
              </h3>
            </DialogTitle>
            <DialogContent
              id="classic-modal-slide-description"
              className={cx(classes.addDirectorsMaxWidth)}
            >
              <form className={classes.form}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6} lg={6}>
                    <CustomInput
                      success={this.state.firstNameState === "success"}
                      error={this.state.firstNameState === "error"}
                      helpText={
                        this.state.firstNameState === "error" &&
                        this.state.firstNameErrorMsg[0]
                      }
                      labelText="First Name*"
                      id="ad_firstName"
                      inputProps={{
                        value: this.state.firstName,
                        onChange: event => this.handleChange("firstName", event)
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
                  <GridItem xs={12} sm={12} md={6} lg={6}>
                    <CustomInput
                      success={this.state.lastNameState === "success"}
                      error={this.state.lastNameState === "error"}
                      helpText={
                        this.state.lastNameState === "error" &&
                        this.state.lastNameErrorMsg[0]
                      }
                      labelText="Last Name*"
                      id="ad_lastName"
                      inputProps={{
                        value: this.state.lastName,
                        onChange: event => this.handleChange("lastName", event)
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
                  <GridItem xs={12} sm={12} md={6} lg={6}>
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
                        success={this.state.designationState === "success"}
                        error={this.state.designationState === "error"}
                        helpText={
                          this.state.designationState === "error" &&
                          this.state.designationErrorMsg[0]
                        }
                      >
                        Designation*
                      </FormHelperText>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state.designation}
                        onChange={this.handleDesignation}
                        inputProps={{
                          name: "designation",
                          id: "designation"
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
                        {this.state.availableDesignations &&
                          this.state.availableDesignations.map(item => (
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
                  <GridItem xs={12} sm={12} md={6} lg={6}>
                    {this.state.showOther && (
                      <CustomInput
                        success={this.state.otherDesignationState === "success"}
                        error={this.state.otherDesignationState === "error"}
                        helpText={
                          this.state.otherDesignationState === "error" &&
                          this.state.otherDesignationErrorMsg[0]
                        }
                        labelText="Other Designation*"
                        id="otherDesignation"
                        inputProps={{
                          value: this.state.otherDesignation,
                          onChange: event =>
                            this.handleChange("otherDesignation", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ otherDesignationPristine: false });
                            this.change(event, "otherDesignation", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.otherDesignationPristine) {
                              this.setState({
                                otherDesignationPristine: false
                              });
                              this.change(event, "otherDesignation", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    )}
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3} lg={3}>
                    <CustomDateSelector
                      success={this.state.dobState === "success"}
                      error={this.state.dobState === "error"}
                      helpText={
                        this.state.dobState === "error" &&
                        this.state.dobErrorMsg[0]
                      }
                      id="ad_dob"
                      inputProps={{
                        format: "dd MMM yyyy",
                        label: "Date of Birth*",
                        value: this.state.dob,
                        maxDate: Date.now(),
                        onChange: this.handleDateChange,
                        KeyboardButtonProps: {
                          "aria-label": "change date"
                        },
                        className: classes.input
                      }}
                      year={true}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customDateControlClasses
                      }}
                    />
                    <p>
                      {this.state.dobState === "error" &&
                        this.state.dobErrorMsg[0]}
                    </p>
                  </GridItem>
                  <GridItem
                    xs={10}
                    sm={10}
                    md={5}
                    lg={5}
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
                      id="ad_address"
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
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    <CustomInput
                      success={this.state.emailState === "success"}
                      error={this.state.emailState === "error"}
                      helpText={
                        this.state.emailState === "error" &&
                        this.state.emailErrorMsg[0]
                      }
                      labelText="email address"
                      id="ad_email"
                      inputProps={{
                        value: this.state.email,
                        onChange: event => this.handleChange("email", event)
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({ emailPristine: false });
                          this.change(event, "email", [{ type: "email" }]);
                        },
                        onChange: event => {
                          if (!this.state.emailPristine) {
                            this.setState({ emailPristine: false });
                            this.change(event, "email", [{ type: "email" }]);
                          }
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
                      <GridItem xs={10} sm={10} md={4} lg={4}>
                        <CustomInput
                          success={this.state.cityState === "success"}
                          error={this.state.cityState === "error"}
                          helpText={
                            this.state.cityState === "error" &&
                            this.state.cityErrorMsg[0]
                          }
                          labelText="City*"
                          id="ad_city"
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
                      <GridItem xs={10} sm={10} md={4} lg={4}>
                        <CustomInput
                          success={this.state.postalCodeState === "success"}
                          error={this.state.postalCodeState === "error"}
                          helpText={
                            this.state.postalCodeState === "error" &&
                            this.state.postalCodeErrorMsg[0]
                          }
                          labelText="Postal Code*"
                          id="ad_postalCode"
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
                      <GridItem xs={10} sm={10} md={4} lg={4}>
                        {/* <CustomInput
                        success={this.state.countryCodeState === "success"}
                        error={this.state.countryCodeState === "error"}
                        helpText={
                          this.state.countryCodeState === "error" &&
                          this.state.countryCodeErrorMsg[0]
                        }
                        labelText="Country*"
                        id="ad_countryCode"
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
                      /> */}
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          {/* <InputLabel
                            htmlFor="type"
                            className={classes.selectLabel}
                          >
                            Country*
                          </InputLabel> */}
                          <FormHelperText
                            style={{
                              backgroundColor: "white",
                              paddingTop: 5,
                              marginTop: 0,
                              textAlign: "left"
                            }}
                            success={this.state.countryCodeState === "success"}
                            error={this.state.countryCodeState === "error"}
                            helpText={
                              this.state.countryCodeState === "error" &&
                              this.state.countryCodeErrorMsg[0]
                            }
                          >
                            Country*
                          </FormHelperText>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            style={{
                              marginBottom: -16
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
                    <b className={classes.subTitle}>
                      Please attach acceptable Photo ID document
                    </b>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                      <GridItem xs={12} sm={10} md={6} lg={6}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                          style={{ borderRight: "1px solid #c8d5db" }}
                        >
                          <InputLabel
                            htmlFor="type"
                            className={classes.selectLabel}
                          >
                            Photo ID Document Type
                          </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            style={{ marginRight: "10px" }}
                            value={this.state.addressProofType}
                            onChange={this.handleDesignation}
                            inputProps={{
                              name: "addressProofType",
                              id: "addressProofType"
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem
                              }}
                            >
                              Choose Document Type
                            </MenuItem>
                            {this.state.availableAddressProofType &&
                              this.state.availableAddressProofType.map(item => (
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
                              ))}
                          </Select>
                          <FormHelperText
                            style={{ color: "red" }}
                            hidden={
                              !(
                                this.state.addressProofTypeState === "select" ||
                                this.state.addressProofTypeState === "error"
                              )
                            }
                          >
                            {this.state.addressProofTypeState === "select"
                              ? this.error.addressProofTypeErrorMsg["required"]
                              : this.error.addressProofTypeErrorMsg[
                                  "sameDocumentType"
                                ]}
                          </FormHelperText>
                        </FormControl>
                      </GridItem>
                      {!this.props.isAddon && (
                        <GridItem xs={12} sm={10} md={6} lg={6}>
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                          >
                            <InputLabel
                              htmlFor="type"
                              className={classes.selectLabel}
                            >
                              Address Proof document type
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              classes={{
                                select: classes.select
                              }}
                              value={this.state.utilityOrBankStmtType}
                              onChange={this.handleDesignation}
                              inputProps={{
                                name: "utilityOrBankStmtType",
                                id: "utilityOrBankStmtType"
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                Choose Document Type
                              </MenuItem>
                              {this.state.utilityOrBankStmtProofType &&
                                this.state.utilityOrBankStmtProofType.map(
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
                            <FormHelperText
                              style={{ color: "red" }}
                              hidden={
                                this.state.utilityOrBankStmtTypeState !=
                                "select"
                              }
                            >
                              Please select New Address Proof Document
                            </FormHelperText>
                          </FormControl>
                        </GridItem>
                      )}
                    </GridContainer>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    className={classes.alignPadding}
                  >
                    <GridContainer>
                      <GridItem
                        xs={12}
                        sm={10}
                        md={6}
                        lg={6}
                        style={{ borderRight: "1px solid #c8d5db" }}
                      >
                        <GridContainer spacing={1} alignItems="flex-end">
                          {this.state.showOtherAddressProofType && (
                            <GridItem
                              className={classes.uploadContainer}
                              xs={10}
                              sm={10}
                              md={11}
                              lg={11}
                            >
                              <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                              >
                                <CustomInput
                                  success={
                                    this.state.otherAddressProofTypeState ===
                                    "success"
                                  }
                                  error={
                                    this.state.otherAddressProofTypeState ===
                                    "error"
                                  }
                                  helpText={
                                    this.state.otherAddressProofTypeState ===
                                      "error" &&
                                    this.state.otherAddressProofTypeErrorMsg[0]
                                  }
                                  labelText="Other Document*"
                                  id="otherAddressProofType"
                                  inputProps={{
                                    value: this.state.otherAddressProofType,
                                    onChange: event =>
                                      this.handleChange(
                                        "otherAddressProofType",
                                        event
                                      )
                                  }}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: event => {
                                      this.setState({
                                        otherAddressProofTypePristine: false
                                      });
                                      this.change(
                                        event,
                                        "otherAddressProofType",
                                        [{ type: "required" }]
                                      );
                                    },
                                    onChange: event => {
                                      if (
                                        !this.state
                                          .otherAddressProofTypePristine
                                      ) {
                                        this.setState({
                                          otherAddressProofTypePristine: false
                                        });
                                        this.change(
                                          event,
                                          "otherAddressProofType",
                                          [{ type: "required" }]
                                        );
                                      }
                                    }
                                  }}
                                />
                              </FormControl>
                            </GridItem>
                          )}

                          {this.state.addressProofLink &&
                            typeof this.state.addressProofLink == "string" && (
                              <GridItem
                                className={classes.uploadContainer}
                                xs={10}
                                sm={10}
                                md={11}
                                lg={11}
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px"
                                }}
                              >
                                {this.getDocumentLink(
                                  this.state.addressProofLink
                                )}
                              </GridItem>
                            )}
                          <GridItem
                            className={classes.uploadContainer}
                            xs={10}
                            sm={10}
                            md={11}
                            lg={11}
                          >
                            {/* <label className={classes.uploadLabel}>Photo ID Document</label> */}
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
                                this.getFile(
                                  "addressProofLink",
                                  file,
                                  "addressProofType"
                                )
                              }
                              removeFile={() =>
                                this.removeFile("addressProofLink")
                              }
                              ref={this.addressUploadComponent}
                            />
                            <FormHelperText
                              style={{ color: "red" }}
                              hidden={
                                this.state.addressProofTypeState != "file"
                              }
                            >
                              Please select file
                            </FormHelperText>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      {!this.props.isAddon && (
                        <GridItem xs={12} sm={10} md={6} lg={6}>
                          <GridContainer spacing={1} alignItems="flex-end">
                            {this.state.showOtherUtilityOrBankStmt && (
                              <GridItem
                                className={classes.uploadContainer}
                                xs={10}
                                sm={10}
                                md={11}
                                lg={11}
                              >
                                <FormControl
                                  fullWidth
                                  className={classes.selectFormControl}
                                >
                                  <CustomInput
                                    success={
                                      this.state.otherUtilityOrBankStmtState ===
                                      "success"
                                    }
                                    error={
                                      this.state.otherUtilityOrBankStmtState ===
                                      "error"
                                    }
                                    helpText={
                                      this.state.otherUtilityOrBankStmtState ===
                                        "error" &&
                                      this.state
                                        .otherUtilityOrBankStmtErrorMsg[0]
                                    }
                                    labelText="Other Document*"
                                    id="otherUtilityOrBankStmt"
                                    inputProps={{
                                      value: this.state.otherUtilityOrBankStmt,
                                      onChange: event =>
                                        this.handleChange(
                                          "otherUtilityOrBankStmt",
                                          event
                                        )
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: event => {
                                        this.setState({
                                          otherUtilityOrBankStmtPristine: false
                                        });
                                        this.change(
                                          event,
                                          "otherUtilityOrBankStmt",
                                          [{ type: "required" }]
                                        );
                                      },
                                      onChange: event => {
                                        if (
                                          !this.state
                                            .otherUtilityOrBankStmtPristine
                                        ) {
                                          this.setState({
                                            otherUtilityOrBankStmtPristine: false
                                          });
                                          this.change(
                                            event,
                                            "otherUtilityOrBankStmt",
                                            [{ type: "required" }]
                                          );
                                        }
                                      }
                                    }}
                                  />
                                </FormControl>
                              </GridItem>
                            )}
                            {this.state.utilityOrBankStmtLink &&
                              typeof this.state.utilityOrBankStmtLink ==
                                "string" && (
                                <GridItem
                                  className={classes.uploadContainer}
                                  xs={10}
                                  sm={10}
                                  md={11}
                                  lg={11}
                                  style={{
                                    marginTop: "10px",
                                    marginBottom: "10px"
                                  }}
                                >
                                  {this.getDocumentLink(
                                    this.state.utilityOrBankStmtLink
                                  )}
                                </GridItem>
                              )}
                            <GridItem
                              className={classes.uploadContainer}
                              xs={10}
                              sm={10}
                              md={11}
                              lg={11}
                            >
                              <label className={classes.uploadLabel}>
                                Address Proof Document
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
                                  this.getFile(
                                    "utilityOrBankStmtLink",
                                    file,
                                    "utilityOrBankStmtType"
                                  )
                                }
                                removeFile={() =>
                                  this.removeFile("utilityOrBankStmtLink")
                                }
                                ref={this.utilityUploadComponent}
                              />
                              <FormHelperText
                                style={{ color: "red" }}
                                hidden={
                                  this.state.utilityOrBankStmtTypeState !=
                                  "file"
                                }
                              >
                                Please select file
                              </FormHelperText>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                      )}
                    </GridContainer>
                  </GridItem>
                  <div className={classes.buttonContainer}>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <div className={classes.center}>
                        {this.props.editDirector ? (
                          <Button
                            round={false}
                            color="info"
                            size="lg"
                            onClick={this.updateDirector}
                          >
                            UPDATE
                          </Button>
                        ) : (
                          <Button
                            round={false}
                            color="info"
                            size="lg"
                            onClick={this.addDirector}
                          >
                            ADD
                          </Button>
                        )}
                      </div>
                    </GridItem>
                  </div>
                </GridContainer>
              </form>
              {this.state.noticeModal && (
                <NoticeModal
                  noticeModal={this.state.noticeModal}
                  noticeModalHeader={this.state.noticeModalHeader}
                  noticeModalErrMsg={this.state.noticeModalErrMsg}
                  closeModal={this.closeNoticeModal}
                />
              )}
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
        </div>
      )
    );
  }
}

AddDirectors.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  directors: PropTypes.any,
  editDirector: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  addDirector: PropTypes.func,
  updateDirector: PropTypes.func,
  isAddon: PropTypes.bool
};

export default withRouter(withStyles(addDirectorsStyle)(AddDirectors));
