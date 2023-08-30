import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import AdjustOutlinedIcon from "@material-ui/icons/AdjustOutlined";
import FaceIcon from "@material-ui/icons/Face";
import FolderIcon from "@material-ui/icons/Folder";
import AddIcon from "@material-ui/icons/Add";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";
import { validate } from "../../utils/Validator";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomerSettings from "./CustomerSettings";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
import StatusActivityTrackingDialog from "views/Components/StatusActivityTrackingDialog.jsx";
import ChangeStatusDialog from "views/Components/ChangeStatusDialog.jsx";
import CustomerActivityRecordDialog from "views/Components/CustomerActivityRecordDialog.jsx";
import CreateCustomerActivityRecord from "views/Components/CreateCustomerActivityRecord.jsx";
import CustomerKYCStatus from "views/Components/CustomerKYCStatus.jsx";
import IdCheckDetails from "views/Components/IdCheckDetails.jsx";
import IdCheckPerform from "views/Components/IdCheckPerform.jsx";
import CompanyKYCSanctions from "views/Components/CompanyKYCSanctions.jsx";
import AddDirectors from "../Pages/AddDirectors";
import AddCustomers from "../Components/AddCustomers";
import NoticeModal from "views/Components/NoticeModal.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import ConfirmationKycModal from "views/Components/ConfirmationModal.jsx";
import { formatMoney, formatDate } from "../../utils/Utils";

import {
  cardTitle,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
const styles = theme => ({
  ellipses: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "rgb(60,72,87)",
    display: "inline-block",
    width: 200,
    verticalAlign: "middle",
    fontSize: "1.2em",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
    fontWeight: 300,
    lineHeight: 1.42857143
  },
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  title: {
    color: "black",
    position: "absolute",
    marginLeft: 20,
    marginTop: 20
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem"
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px"
  },
  filterInput: {
    top: -20
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  linkButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    display: "inline",
    margin: 0,
    padding: 0,
    "&:hover": {
      textDecoration: "none"
    },
    "&:focus": {
      textDecoration: "none"
    }
  },

  // icon: {
  //   color: "#333333",
  //   margin: "10px auto 0",
  //   width: "130px",
  //   height: "130px",
  //   border: "1px solid #E5E5E5",
  //   borderRadius: "50%",
  //   lineHeight: "174px",
  //   "& svg": {
  //     width: "55px",
  //     height: "55px"
  //   },
  //   "& .fab,& .fas,& .far,& .fal,& .material-icons": {
  //     width: "55px",
  //     fontSize: "55px"
  //   }
  // },
  iconRose: {
    color: roseColor
  },
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "25px",
    height: "25px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black",
    borderRadius: 3
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  editKycIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  closeKycIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  editSanctionIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  closeSanctionIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  errorIcon: {
    color: "#F44336"
  },
  addIcon: {
    color: "#4CAF50"
  },
  infoIcon: {
    color: "#dfa52b"
  },
  marginTop30: {
    marginTop: "30px"
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px"
    }
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white"
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "white"
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 14,
    marginRight: 5
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999"
  },
  listItemIcon: {
    marginTop: "-3px",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    color: "inherit",
    display: "inline-block"
  },
  filledSelect: {
    backgroundColor: "grey",
    color: "white !important"
  },
  white: {
    color: "white"
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white"
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right"
  },
  headerLabel: {
    color: "rgb(60,72,87)",
    fontWeight: 300
  },
  clientsCardLabel: {
    color: "#AAAAAA !important",
    fontSize: 14,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
    fontWeight: 400,
    lineHeight: 1.42857
  },
  kyc_label: {
    color: "#95c440",
    textAlign: "end"
  },
  kyc_ellipses: {
    marginLeft: 10,
    color: "green",
    fontSize: 15,
    fontWeight: 400
  },
  ...customSelectStyle,
  ...regularFormsStyle
});

class RiskUserInfoPage extends React.Component {
  error = {
    firstNameErrorMsg: {
      required: "First name is required",
      range: "First name should be 1 to 100 characters"
    },
    lastNameErrorMsg: {
      required: "Last name is required",
      range: "Last name should be 1 to 100 characters"
    },
    emailErrorMsg: {
      required: "Email is required",
      company: "Please enter a company email",
      valid: "Please enter a valid email"
    },
    phoneNumberErrorMsg: {
      required: "Phone number is required",
      valid: "Please enter phone number in a valid format (xxx-xxx-xxxx)"
    },
    companyNameErrorMsg: {
      required: "Company name is required",
      valid: "Please enter a valid company name"
    },
    currentPasswordErrorMsg: {
      required: "Current Password is required"
    },
    newPasswordErrorMsg: {
      required: "New Password is required"
    },
    confirmNewPasswordErrorMsg: {
      required: "New Password Confirmation is required"
    },
    queryErrorMsg: {
      required: "KYC Change Message is required"
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      anchorReportEl: null,
      countries: [],
      customerName: "",
      customerId: "",
      customerStatus: "",
      kycStatus: "",
      riskLevel: "",
      hiredPlan: "",
      hiredPlanId: 0,
      customerEmail: "",
      phoneNumber: "",
      createDate: "",
      expiryDate: "",
      userInfo: {},
      customerUsers: [],
      enableUserList: {},
      showCustomerSettings: false,
      settings: {},
      query: "",
      fileList: [
        {
          id: 1,
          date: "25 MAY 2020",
          summary: "Customer Status Changed"
        },
        {
          id: 2,
          date: "26 MAY 2020",
          summary: "KYC Status Updated",
          link: "dummy.doc"
        },
        {
          id: 3,
          date: "27 MAY 2020",
          summary: "Customer Meeting",
          link: "dummy2.doc"
        }
      ],
      activityColumns: [
        "Date of Entry ",
        "Type",
        "Brief Summary",
        "Any Attachment?"
      ],
      activityData: [],
      selectedActivityData: [],
      activityPageIndex: 1,
      activityRecordsPerPage: 5,
      showCreateCustomerActivity: false,
      showCustomerActivityRecord: false,
      customerActivityDetails: {},
      recordsPerPage: 10,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      confirmationModal: false,
      confirmationKycModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1
    };
  }
  rulesList = {
    firstName: [
      { type: "required" },
      {
        type: "length",
        params: {
          min: 1,
          max: 100
        }
      }
    ],
    lastName: [
      { type: "required" },
      {
        type: "length",
        params: {
          min: 1,
          max: 100
        }
      }
    ],
    email: [{ type: "required" }, { type: "email" }],
    phoneNumber: [{ type: "required" }, { type: "phone" }],
    companyName: [{ type: "required" }],
    query: [{ type: "required" }],
    countryCode: [{ type: "required" }],
    currentPassword: [{ type: "required" }],
    newPassword: [{ type: "required" }],
    confirmNewPassword: [{ type: "required" }]
  };

  componentDidMount = () => {
    this.getCountryList();
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  handleNegativeButton = () => {
    this.setState({
      confirmationModal: false,
      confirmationKycModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1
    });
  };
  getCountryList = async () => {
    const res = await axios.get(endpoint.BASE_URL_STAGING_AXIOS + 'fx-crm/public/countriesMetaData');
    //   res => {
    let countries = res.data.countryMetaData;
    this.setState({ countries: countries }, () => {
      this.getRiskCustomerList();
    });
  };
  getRiskCustomerList = async () => {
    const { match } = this.props;
    if (match.params.customerId) {
      this.setState({ callInProgress: true });
      const res = await apiHandler({
        url: endpoint.RISK_ADMIN_USERS_LIST,
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
        const user = res.data.users.filter(u => u.prospectId == match.params.customerId);
        if (user[0]) {
            this.setState({
                callInProgress: false,
                customerName: user[0].name,
                customerId: user[0].prospectId,
                customerStatus: user[0].status,
                hiredPlan: user[0].planName,
                hiredPlanId: user[0].hiredPlanId,
                customerEmail: user[0].email,
                createDate: user[0].startDate,
                expiryDate: user[0].expiryDate,
            }, () => {
              this.getRiskPlanUserList(user[0].email);
              this.getRiskUserInfo(user[0].email);
              this.getCustomerActivityDetails(user[0].prospectId);
            });
        }
      }
    }
  };
  getRiskUserInfo = async (userEmail) => {
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_ADMIN_USERS_INFO + encodeURIComponent(userEmail),
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      console.log(res.data);
      let country = "";
      const selCountry = this.state.countries.filter(c => c.countryCode === res.data.countryCode);
      if (selCountry.length > 0) {
        country = selCountry[0].countryName
      }
      this.setState({userInfo: { ...res.data, country: country } });
    }
  };
  getRiskPlanUserList = async (userEmail) => {
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_CLIENT_USERS_LIST + userEmail,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      console.log(res.data);      
      this.setState({customerUsers: [ ...res.data.customerUsers ] });
    }
  };
  getCustomerSettings = async customerId => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_SETTINGS + "?customerId=" + customerId,
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
      let settings = res.data;
      if (settings.paymentFrequencyDays) {
        if (settings.paymentFrequencyDays % 30 === 0) {
          settings.paymentFrequencyDays = settings.paymentFrequencyDays / 30;
          settings.paymentAlertDuration = "Months";
        } else if (settings.paymentFrequencyDays % 7 === 0) {
          settings.paymentFrequencyDays = settings.paymentFrequencyDays / 7;
          settings.paymentAlertDuration = "weeks";
        } else {
          settings.paymentAlertDuration = "Days";
        }
      }
      this.setState({
        callInProgress: false,
        settings: settings
      });
    }
  };
  handleRiskToggle = event => {
    if (event.target.id === 'checkbox_0') {
      this.setState({
        noticeModal: true,
        noticeModalHeader: 'Error',
        noticeModalErrMsg: "Main User cannot be Disabled",
      });
    } else {
      // console.log("user account enable");
      this.setState({
        confirmationModal: true,
        confirmationKycModal: false,
        confirmationModalHeader: "Confirm",
        confirmationModalMsg: event.target.checked
          ? "Are you sure you want to Enable the User"
          : "Are you sure you want to Disable the User",
        handlePositiveFunctionName: "toggleActionConfirm",
        eventId: event.target.id
      });
    }
  };
  toggleActionConfirm = async () => {
    // console.log("user account enable");
    let id = this.state.eventId;
    let index = id.lastIndexOf('_');
    if (index !== -1) {
      id = id.substring(index + 1, id.length);
    }
    // let enabledState = this.state.enableUserList;
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: '',
      confirmationModalMsg: '',
      handlePositiveFunctionName: undefined,
      eventId: -1,
    });

    let user = this.state.customerUsers.filter((u) => {
      return u.id.toString() === id.toString();
    });
    // if (enabledState[id]) {
      // Deactivate User
      const res = await apiHandler({
        method: 'PUT',
        url: endpoint.RISK_CLIENT_USERS_ENABLE_DISABLE,
        authToken: sessionStorage.getItem('token'),
        data: {
          enabled: !user[0].enabled,
          id: id
        }
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log('Unauthorized Access');
          this.props.history.push('/home/logout');
          return;
        } else {
          return;
        }
      } else {
        this.getRiskPlanUserList(this.state.customerEmail);
      }
  };

  /**************** CUSTOMER ACTIVITY START ****************/
  getCustomerActivityDetails = async customerId => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url:
        endpoint.ADMIN_CUSTOMER_DUEDILIGENCE_FIND + "?customerId=" + customerId + "&prospect=true",
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
      let activities = res.data;
      let fileList = [];
      activities &&
        activities.items &&
        activities.items.forEach(fileObj => {
          fileList.push([
            fileObj.type + "_" + fileObj.id,
            formatDate(fileObj.reportDate),
            fileObj.type,
            this.getActivityReason(fileObj.reason),
            fileObj.documentLinks && fileObj.documentLinks.length > 0
              ? this.getDocumentLink(fileObj.documentLinks[0])
              : ""
          ]);
        });
      let selectedList = fileList.slice(0, this.state.activityRecordsPerPage);
      this.setState({
        callInProgress: false,
        activityData: fileList,
        selectedActivityData: selectedList,
        activityPageIndex: 1
      });
    }
  };
  getActivityReason = (str) => {
    return (
      <div style={{ maxWidth: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{str}</div>
    )
  };
  addCustomerActivity = async record => {
    record = {...record, prospect: true};
    //ADMIN_CUSTOMER_DUEDILIGENCE_CREATE
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_CUSTOMER_DUEDILIGENCE_CREATE,
      data: record,
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
      this.getCustomerActivityDetails(record.customerId);
    }
  };
  activityTableRowClick = async selectedID => {
    let index = selectedID.lastIndexOf("_");

    const type = selectedID.substring(0, index);
    const ID = selectedID.substring(index + 1, selectedID.length);

    let query = "?prospect=true&id=" + ID + "&type=" + type;
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_DUEDILIGENCE_GET + query,
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
      this.setState({
        showCustomerActivityRecord: true,
        customerActivityDetails: res.data
      });
    }
  };
  getActivityPageDetails = () => {
    let DataCount = Math.ceil(
      this.state.activityData.length / this.state.activityRecordsPerPage
    );
    // switch ()
    let pageArray = [];
    Array.from(new Array(DataCount)).forEach((count, index) => {
      if (index + 1 === this.state.activityPageIndex) {
        pageArray.push({
          text: `${index + 1}`,
          active: true
        });
      } else {
        pageArray.push({
          text: `${index + 1}`
        });
      }
    });
    return pageArray;
  };
  getActivityPageData = event => {
    let pageIndex = 0;
    let pageCount = Math.ceil(
      this.state.activityData.length / this.state.activityRecordsPerPage
    );
    switch (event.target.innerText) {
      case "FIRST":
        pageIndex = 1;
        break;
      case "PREVIOUS":
        pageIndex = this.state.activityPageIndex - 1;
        break;
      case "LAST":
        pageIndex = pageCount;
        break;
      case "NEXT":
        pageIndex = this.state.activityPageIndex + 1;
        break;
      default:
        pageIndex = parseInt(event.target.innerText);
        break;
    }
    if (pageIndex < 1) pageIndex = 1;
    else if (pageIndex > pageCount) pageIndex = pageCount;

    let selectedList = this.state.activityData.slice(
      (pageIndex - 1) * this.state.activityRecordsPerPage,
      pageIndex * this.state.activityRecordsPerPage
    );
    this.setState({
      activityPageIndex: pageIndex,
      selectedActivityData: selectedList
    });
  };
  closeCreateActivityDialog = () => {
    this.setState({ showCreateCustomerActivity: false });
  };
  closeCustomerActivityDetailsModal = () => {
    this.setState({
      showCustomerActivityRecord: false,
      customerActivityDetails: {}
    });
  };
  /**************** CUSTOMER ACTIVITY ENDS  ****************/

  getUserRows = () => {
    const fillButtons = (id, enabled) => {
      return (
        <>
          <FormControlLabel
            className={this.props.classes.center}
            classes={{
              root: this.props.classes.checkboxLabelControl,
              label: this.props.classes.checkboxLabel
            }}
            control={
              <Switch
                color="primary"
                tabIndex={-1}
                id={'checkbox_' + id}
                onChange={this.handleRiskToggle}
                checked={enabled}
              />
            }
            label={<div />}
          />
        </>
      );
    };
    // return this.state.customerEmail !== "" ? [[
    //   0,
    //   this.state.customerEmail,
    //   this.state.customerName,
    //   this.state.phoneNumber,
    //   fillButtons()
    // ]] : [];
    let users = [[
      0,
      this.state.customerEmail,
      this.state.customerName,
      this.state.userInfo && this.state.userInfo.phoneNumber ? this.state.userInfo.phoneNumber : "",
      fillButtons(0, true)
    ]];
    this.state.customerUsers &&
      this.state.customerUsers.forEach(userRow => {
        if (userRow.id) {
          let user = [
            userRow.id,
            userRow.email,
            (userRow.firstName
              ? userRow.firstName
              : "") + " " + (userRow.lastName
              ? userRow.lastName
              : ""),
            userRow.phoneNumber,
            fillButtons(userRow.id, userRow.enabled)
          ];
          users.push(user);
        }
      });
    return users;
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

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  closeModal = () => {
    this.setState({ isDealExecuted: false });
  };

  handleSimple = event => {
    this.setState({ countryCode: event.target.value });
    this.change(event, "countryCode", [{ type: "required" }]);
  };

  handleEditUser = () => {
    this.setState(() => {
      return { showEditUser: true };
    });
    // this.setState(state => {
    //   return {
    //     showAddDirector: true,
    //     editDirector: state.directors.filter(director => director.id === id)[0]
    //   };
    // });
  };

  inviteUser = async () => {
    const data = {
      email: this.state.inviteEmail
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_CUSTOMER_USER_RESGISTER,
      data: data,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false, inviteEmail: "" });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Success",
        noticeModalErrMsg: "Invitation Email is sent to user"
      });
    }
  };

  getClientStatusButton = status => {
    // console.log(status);
    if (!status) return;
    if (
      status.toLowerCase() === "approved" ||
      status.toLowerCase() === "active"
    ) {
      return (
        <Button
          size="sm"
          style={{
            fontSize: 20,
            borderRadius: 10,
            padding: "0.40625rem 0.7rem",
            backgroundColor: "#95c440"
          }}
        >
          {status} <CheckCircleOutlineOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    } else if (status.toLowerCase() === "pending") {
      return (
        <Button
          size="sm"
          style={{
            fontSize: 20,
            borderRadius: 10,
            padding: "0.40625rem 0.7rem",
            backgroundColor: "rgb(223,165,43)"
          }}
        >
          {status} <AdjustOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    } else {
      return (
        <Button
          color="danger"
          size="sm"
          style={{
            fontSize: 20,
            borderRadius: 10,
            padding: "0.40625rem 0.7rem"
          }}
        >
          {status} <CancelOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    }
  };

  getFileIcon = type => {
    if (type.toLowerCase() === "pdf") {
      return <PictureAsPdfIcon />;
    } else if (type.toLowerCase() === "image") {
      return <ImageIcon />;
    } else {
      return <DescriptionIcon />;
    }
  };
  getDocumentLink = link => {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    );
  };
  handleReportClick = event => {
    this.setState({
      anchorReportEl: event.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorReportEl: null
    });
  };

  handleSettingsClose = () => {
    this.setState({ showCustomerSettings: false });
  };

  getPageData = event => {
    let pageIndex = 0;
    let pageCount = Math.ceil(
      this.state.dealAllData.length / this.state.recordsPerPage
    );
    switch (event.target.innerText) {
      case "FIRST":
        pageIndex = 1;
        break;
      case "PREVIOUS":
        pageIndex = this.state.selectedPageIndex - 1;
        break;
      case "LAST":
        pageIndex = pageCount;
        break;
      case "NEXT":
        pageIndex = this.state.selectedPageIndex + 1;
        break;
      default:
        pageIndex = parseInt(event.target.innerText);
        break;
    }
    if (pageIndex < 1) pageIndex = 1;
    else if (pageIndex > pageCount) pageIndex = pageCount;

    let selectedList = this.state.dealAllData.slice(
      (pageIndex - 1) * this.state.recordsPerPage,
      pageIndex * this.state.recordsPerPage
    );
    this.setState({
      dealSelectedData: selectedList
    });
  };
  getPageDetails = () => {
    let DataCount = Math.ceil(
      this.state.dealAllData.length / this.state.recordsPerPage
    );
    // switch ()
    let pageArray = [];
    Array.from(new Array(DataCount)).forEach((count, index) => {
      if (index + 1 === this.state.selectedPageIndex) {
        pageArray.push({
          text: `${index + 1}`,
          active: true
        });
      } else {
        pageArray.push({
          text: `${index + 1}`
        });
      }
    });
    return pageArray;
  };
  getStatusButton = (status, type, activityId) => {
    let color = "success";
    if (status === "SETTLED" || status === "SETTELED") color = "success";
    else if (status === "PENDING") color = "warning";
    else color = null;
    return (
      <Button
        color={color}
        size="sm"
        round
        onClick={event => this.handleStatusTracker(activityId, type, event)}
      >
        {status}
      </Button>
    );
  };
  
  closeActivityTrackingDetails = () => {
    this.setState({
      activities: null,
      showActivityTrackingDialog: false
    });
  };
  closeChangeStatusDialog = () => {
    this.setState({
      showChangeStatusDialog: false,
      taskDetails: null
    });
  };
  updateStatus = updatedInfo => {
    switch (updatedInfo.taskType) {
      case "CLIENT":
        this.changeClientStatus(updatedInfo);
        break;
      case "KYC":
        this.changeKycStatus(updatedInfo);
        break;
      case "BENEFICIARY":
        this.updateBeneficiaryStatus(updatedInfo);
        break;
      default:
        break;
    }
  };
  handleStatusClick = name => {
    let statusList = [];
    switch (name) {
      case "CLIENT":
        statusList = ["ACTIVE", "PENDING", "DISABLED"].filter(
          status => status !== this.state.customerStatus
        );
        break;
      case "KYC":
        statusList = ["APPROVED", "PENDING", "REJECTED"].filter(
          status => status !== this.state.kycStatus
        );
        break;
      default:
        break;
    }

    const taskDetails = {
      taskId: this.state.customerId,
      taskType: name,
      customerId: this.state.customerId,
      customerName: this.state.customerName,
      statusList: statusList,
      riskLevel: this.state.riskLevel
    };

    this.setState({
      taskDetails: taskDetails,
      showChangeStatusDialog: true
    });
  };

  changeClientStatus = async updatedInfo => {
    const data = {
      customerEmail: this.state.customerEmail,
      customerId: this.state.customerId,
      status: updatedInfo.status,
      memberName: updatedInfo.memberName,
      reportDate: updatedInfo.reportDate,
      reason: updatedInfo.reason,
      signature: updatedInfo.signature,
      supportingDocs: updatedInfo.supportingDocs
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.ADMIN_CUSTOMER_UPDATE_STATUS,
      data: data,
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
          noticeModalErrMsg: res.data.userDesc,
          anchorReportEl: null,
          downloadData: [],
          exportedFileName: "FXG Pending Tasks",
          apiData: [],
          columnSortKey: ""
        });
      }
    } else {
      this.setState(
        {
          customerStatus: updatedInfo.status,
          callInProgress: false,
          taskDetails: {},
          showChangeStatusDialog: false
        },
        () => this.getUserInfo()
      );
    }
    //ADMIN_CUSTOMER_UPDATE_STATUS
  };

  changeKycStatus = async updatedInfo => {
    const data = {
      customerEmail: this.state.customerEmail,
      customerId: this.state.customerId,
      kycStatus: updatedInfo.status,
      memberName: updatedInfo.memberName,
      reportDate: updatedInfo.reportDate,
      reason: updatedInfo.reason,
      signature: updatedInfo.signature,
      supportingDocs: updatedInfo.supportingDocs
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.ADMIN_CUSTOMER_UPDATE_KYC_STATUS,
      data: data,
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
      this.setState(
        {
          kycStatus: updatedInfo.status,
          callInProgress: false,
          taskDetails: {},
          showChangeStatusDialog: false
        },
        () => this.getUserInfo()
      );
    }
  };

  handleCustomerClose = () => {
    this.setState({ showAddCustomer: false, editCustomer: null });
  };

  handleEditCustomer = async (customerId, kycEntityId) => {
    // Call API to get Data and Show Edit Customer popup
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url:
        endpoint.CUSTOMER_FIND +
        "?customerId=" +
        customerId +
        "&kycEntityId=" +
        kycEntityId,
      authToken: sessionStorage.getItem("token")
    });

    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc
        });
      }
    } else {
      this.setState({ showAddCustomer: true, editCustomer: res.data });
    }
  };
  addCustomer = company => {
    // Do Nothing
  };
  updateCustomer = async company => {
    console.log(company);
    const addonCompany = {
      customerId: company.customerId,
      additionalCompany: true,
      ...company
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_COMPANY_ONLY,
      data: addonCompany,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc
        });
      }
    } else {
      this.handleCustomerClose();
      this.refreshKycData(company.customerId);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={11} lg={11}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={3} lg={3}>
                <h4>
                  <b>Risk Client Info</b>
                </h4>
              </GridItem>
              <GridItem xs={12} sm={12} md={9} lg={9}>
                <NavLink
                  to={
                    "/auth/admin/impersonate-login/" + this.state.customerEmail
                  }
                  className={classes.navLink}
                >
                  <Button
                    size="lg"
                    style={{
                      width: "200px",
                      float: "right",
                      backgroundColor: "rgb(236, 246, 248)",
                      color: "grey"
                    }}
                  >
                    VIEW AS CLIENT
                  </Button>
                </NavLink>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} sm={12} md={11} lg={11}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={5} lg={5}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <Card className={classes.clientsCardLabel}>
                      <CardBody>
                        <h4 className={classes.headerLabel}>
                          <strong>{this.state.userInfo &&
                                    this.state.userInfo.customerName}</strong>
                        </h4>
                        <p>{this.state.customerEmail}</p>
                        <GridContainer
                          direction="row"
                          style={{
                            borderBottom: "1px solid #d2d2d2",
                            paddingBottom: 10
                          }}
                        >
                          <GridItem
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 15
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem lg={8} style={{}}>
                                <span>Customer ID</span>
                              </GridItem>
                            </GridContainer>
                            <GridContainer direction="row">
                              <GridItem lg={8}>
                                <span className={classes.ellipses}>
                                  {this.state.customerId}
                                </span>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 15
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem xs={12} sm={12} md={12}lg={12}>
                                <span>RISK PLAN</span>
                              </GridItem>
                            </GridContainer>
                            <GridContainer direction="row">
                            <GridItem xs={12} sm={12} md={12}lg={12}>
                                <span className={classes.ellipses}>
                                  {this.state.hiredPlan}
                                </span>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 15
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem lg={12} style={{}}>
                                <span>Client Status</span>
                              </GridItem>
                            </GridContainer>
                            <GridContainer direction="row">
                              <GridItem lg={12}>
                                <span
                                  className={classes.ellipses}
                                  style={{ width: "auto" }}
                                >
                                  {this.getClientStatusButton(
                                    this.state.customerStatus
                                  )}
                                </span>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                        <GridContainer
                          direction="row"
                          style={{
                            paddingBottom: 10
                          }}
                        >
                          <GridItem
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 15
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem xs={6} sm={6} md={6} lg={6}>
                                <h4>Account Information</h4>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <GridContainer direction="row">
                              <GridItem xs={12} sm={12} md={5} lg={5}>
                              <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={8} style={{}}>
                                      <span>Name</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.customerName}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={8} style={{}}>
                                      <span>Country</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.userInfo &&
                                          this.state.userInfo.country}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={8} style={{}}>
                                      <span>City</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.userInfo &&
                                          this.state.userInfo.city}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={12} style={{}}>
                                      <span>Client Since</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={10}>
                                      <span className={classes.ellipses}>
                                        {formatDate(this.state.createDate)}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={7} lg={7}>
                                
                              <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={8} style={{}}>
                                      <span>Phone Number</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.userInfo &&
                                          this.state.userInfo.phoneNumber}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={8} style={{}}>
                                      <span>Address</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.userInfo &&
                                          this.state.userInfo.address}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>
                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={8} style={{}}>
                                      <span>Postal Code</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.userInfo &&
                                          this.state.userInfo.postalCode}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>

                                <GridItem
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  style={{
                                    textAlign: "left",
                                    marginTop: 15
                                  }}
                                >
                                  <GridContainer direction="row">
                                    <GridItem lg={8} style={{}}>
                                      <span>Current Plan valid till</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {formatDate(this.state.expiryDate)}
                                      </span>
                                    </GridItem>
                                  </GridContainer>
                                </GridItem>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <Card>
                      <CardHeader color="success" text>
                        <CardText style={{ backgroundColor: "#95c440" }}>
                          <FolderIcon className={classes.listItemIcon} />
                        </CardText>
                        <span className={classes.title}>
                          {" "}
                          Customer Activity{" "}
                        </span>
                        <Button
                          size="lg"
                          color="info"
                          style={{
                            width: "200px",
                            float: "right"
                          }}
                          onClick={() => {
                            this.setState({ showCreateCustomerActivity: true });
                          }}
                        >
                          <AddIcon />
                          ADD
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{
                            textAlign: "left",
                            marginTop: 10,
                            borderBottom: "1px solid #d2d2d2"
                          }}
                        >
                          <Table
                            hover
                            tableHeaderColor="gray"
                            tableHead={this.state.activityColumns}
                            tableData={this.state.selectedActivityData}
                            customCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customHeadClassesForCells={[0, 4, 5]}
                            onClick={this.activityTableRowClick}
                          />
                        </GridItem>
                      </CardBody>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          textAlign: "right",
                          borderBottom: "1px solid #d2d2d2"
                        }}
                      >
                        <Pagination
                          pages={this.getActivityPageDetails()}
                          currentPage={this.state.activityPageIndex}
                          color="info"
                          onClick={this.getActivityPageData}
                        />
                      </GridItem>
                    </Card>
                  </GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={7} lg={7}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <Card>
                      <CardHeader color="success" text>
                        <CardText style={{ backgroundColor: "#95c440" }}>
                          <FaceIcon className={classes.listItemIcon} />
                        </CardText>
                        <span className={classes.title}> User Management </span>
                      </CardHeader>
                      <CardBody>
                        {/* <div style={{ textAlign: "right" }}>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <GridContainer justify="flex-end">
                              <span style={{ marginTop: 15 }}>Invite User</span>
                              <GridItem xs={12} sm={12} md={5} lg={3}>
                                <CustomInput
                                  success={
                                    this.state.inviteEmailState === "success"
                                  }
                                  error={
                                    this.state.inviteEmailState === "error"
                                  }
                                  helpText={
                                    this.state.inviteEmailState === "error" &&
                                    this.state.inviteEmailErrorMsg[0]
                                  }
                                  labelText="Email address"
                                  id="inviteEmail"
                                  inputProps={{
                                    value: this.state.inviteEmail,
                                    onChange: event =>
                                      this.handleChange("inviteEmail", event)
                                  }}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.filterInput,
                                    onBlur: event => {
                                      this.setState({
                                        inviteEmailPristine: false
                                      });
                                      this.change(event, "inviteEmail", []);
                                    },
                                    onChange: event => {
                                      if (!this.state.inviteEmailPristine) {
                                        this.setState({
                                          inviteEmailPristine: false
                                        });
                                        this.change(event, "inviteEmail", []);
                                      }
                                    }
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={12} sm={12} md={12} lg={2}>
                                <Button
                                  round={false}
                                  color="info"
                                  size="md"
                                  style={{ lineHeight: "10px" }}
                                  onClick={this.inviteUser.bind(this)}
                                >
                                  invite
                                </Button>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </div>
                        {this.state.customerUsers.length > 0 && (
                          <> */}
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                              <Table
                                tableHead={[
                                  "E-mail",
                                  "Name",
                                  "Phone Number",
                                  "Actions"
                                ]}
                                tableData={this.getUserRows()}
                                customCellClasses={[
                                  classes.center,
                                  classes.right,
                                  classes.right
                                ]}
                                customClassesForCells={[0, 4, 5]}
                                customHeadCellClasses={[
                                  classes.center,
                                  classes.right,
                                  classes.right
                                ]}
                                customHeadClassesForCells={[0, 4, 5]}
                              />
                            </GridItem>
                          {/* </>
                        )} */}
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
        {this.state.showChangeStatusDialog && (
          <ChangeStatusDialog
            showModal={this.state.showChangeStatusDialog}
            closeModal={this.closeChangeStatusDialog}
            taskInfo={this.state.taskDetails}
            updateStatus={this.updateStatus}
          />
        )}
        {this.state.showAddCustomer && (
          <AddCustomers
            handleClose={this.handleCustomerClose}
            showModal={this.state.showAddCustomer}
            addCustomer={this.updateCustomer}
            customers={this.state.customers}
            editCustomer={this.state.editCustomer}
            updateCustomer={this.updateCustomer}
          />
        )}
        {this.state.showCreateCustomerActivity && (
          <CreateCustomerActivityRecord
            type={"RISKS"}
            showModal={this.state.showCreateCustomerActivity}
            closeModal={this.closeCreateActivityDialog}
            customerName={this.state.customerName}
            customerId={this.state.customerId}
            addRecord={this.addCustomerActivity}
          />
        )}
        {this.state.showCustomerActivityRecord && (
          <CustomerActivityRecordDialog
            showModal={this.state.showCustomerActivityRecord}
            record={this.state.customerActivityDetails}
            closeModal={this.closeCustomerActivityDetailsModal}
          />
        )}
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
        {this.state.confirmationModal && (
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeButton}
            handlePositiveButton={this[this.state.handlePositiveFunctionName]}
          />
        )}
      </>
    );
  }
}

RiskUserInfoPage.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object
};

export default withRouter(withStyles(styles)(RiskUserInfoPage));
