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
    width: 210,
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

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class CustomerInfoPage extends React.Component {
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

  dealStatusColumns = {
    FXFWD: [
      "Deal ID",
      "Trade Date",
      "Settlement Date",
      "Currency Bought",
      "Currency Sold",
      "Current Valuation",
      "Status"
    ],
    FXSPOT: [
      "Deal ID",
      "Trade Date",
      "Settlement Date",
      "Currency Bought",
      "Currency Sold",
      "Status"
    ],
    MARGINS: [
      "Deal ID",
      "Trade Date",
      "Settlement Date",
      "Current Valuation",
      "Initial Margin",
      "Status",
      " "
    ],
    PAYMENTS: [
      "Deal ID",
      "Payment Date",
      "Beneficiary",
      "Amount Paid",
      "Status"
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorReportEl: null,
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
      address: {},
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
      currentReportName: "FX SPOT Report",
      dealColumns: this.dealStatusColumns["FXSPOT"],
      dealAllData: [],
      dealSelectedData: [],
      selectedPageIndex: 1,
      spotDealData: [],
      forwardDealData: [],
      marginsDealData: [],
      paymentsDealData: [],
      recordsPerPage: 10,
      isDealExecuted: false,
      dealDetails: {},
      showChangeStatusDialog: false,
      taskDetails: {},
      showActivityTrackingDialog: false,
      activities: [],
      showCustomerKYCStatus: false,
      kycInfo: null,
      customerRegistrationDetails: null,
      showAlertModal: false,
      alertData: null,
      showIDCheckDetails: false,
      showPerformIDCheck: false,
      idCheckDetails: null,
      idCheckRequiredData: null,
      showCompanySanctionsModal: false,
      companySanctionsData: null,

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
    this.getUserInfo();
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

  getUserInfo = async () => {
    const { match } = this.props;
    if (match.params.customerId) {
      this.setState({ callInProgress: true });
      const res = await apiHandler({
        url:
          endpoint.ADMIN_CUSTOMER_PENDING_CLIENTLIST + match.params.customerId,
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
        const user = res.data;
        let enabledState = {};
        user.customerUsers &&
          user.customerUsers.forEach(user => {
            enabledState[user.id] = user.enabled;
          });
        this.setState(
          {
            callInProgress: false,
            customerName: user.customerName,
            customerId: user.customerId,
            customerStatus: user.customerStatus,
            kycStatus: user.kycStatus,
            riskLevel: user.riskLevel || "",
            hiredPlan: user.hiredPlan,
            hiredPlanId: user.hiredPlanId,
            customerEmail: user.customerEmail,
            phoneNumber: user.phoneNumber,
            createDate: user.createDate,
            address: user.address,
            customerUsers: user.customerUsers,
            enableUserList: enabledState
          },
          () => {
            this.getCustomerSettings(user.customerId);
            this.getDealStatus(user.customerId);
            this.getCustomerActivityDetails(user.customerId);
          }
        );
      }
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
  getCustomerActivityDetails = async customerId => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url:
        endpoint.ADMIN_CUSTOMER_DUEDILIGENCE_FIND + "?customerId=" + customerId,
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
            fileObj.reason,
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
  handleToggle = event => {
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
  };

  toggleActionConfirm = async () => {
    let id = this.state.eventId;
    let index = id.lastIndexOf("_");
    if (index !== -1) {
      id = id.substring(index + 1, id.length);
    }
    let enabledState = this.state.enableUserList;

    let user = this.state.customerUsers.filter(u => {
      return u.id === +id;
    });
    const header = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    };
    if (enabledState[id]) {
      // Deactivate User
      const res = await apiHandler({
        method: "DELETE",
        url: endpoint.USER_DISABLE + encodeURIComponent(user[0].email),
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
      }
    } else {
      // Activate User
      const res = await apiHandler({
        method: "PUT",
        url: endpoint.USER_ENABLE + encodeURIComponent(user[0].email),
        data: null,
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
      }
    }

    enabledState[id] = !enabledState[id];
    this.setState({
      enableUserList: enabledState,
      confirmationModal: false,
      confirmationKycModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1
    });
  };

  getUserRows = () => {
    const fillButtons = userID => {
      return (
        <>
          {/* <Edit
          onClick={this.handleEditUser.bind(this)}
          className={cx(this.props.classes.editIcon, this.props.classes.icon)}
        />
        <Close
          //onClick={this.handleDeleteDirector.bind(this, prop.color)}
          className={cx(this.props.classes.closeIcon, this.props.classes.icon)}
        /> */}
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
                id={"checkbox_" + userID}
                onChange={this.handleToggle}
                checked={this.state.enableUserList[userID]}
                //value={this.state.enableUserList[userID]}
                // checkedIcon={<Check className={this.props.classes.checkedIcon} />}
                // icon={<Check className={this.props.classes.uncheckedIcon} />}
                // classes={{
                //   checked: this.props.classes.checked,
                //   root: this.props.classes.checkRoot,
                // }}
              />
            }
            label={<div />}
          />
        </>
      );
    };
    let users = [];
    this.state.customerUsers &&
      this.state.customerUsers.forEach(userRow => {
        if (userRow.id) {
          let user = [
            userRow.id,
            userRow.email,
            userRow.firstName
              ? userRow.firstName
              : "" + " " + userRow.lastName
              ? userRow.lastName
              : "",
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

  updateSettings = async updatedSettings => {
    let data = {
      ...updatedSettings,
      customerId: this.state.customerId
      // subscriptionPlanId: this.state.hiredPlanId
    };

    // console.log("settings - ", this.state.settings);
    // console.log("updatedSettings - ", updatedSettings);
    let settings = {
      ...this.state.settings,
      ...updatedSettings
    };
    // ADMIN_CUSTOMER_SETTING_UPDATE
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_CUSTOMER_SETTING_UPDATE,
      data: data,
      authToken: sessionStorage.getItem("token")
    });
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
      this.setState(
        {
          settings: settings,
          noticeModal: true,
          noticeModalHeader: "Success",
          noticeModalErrMsg:
            "New Settings have been saved and are effective now"
        },
        () => {
          // Update Page for new Settings
          this.getUserInfo();
        }
      );
    }
  };
  // DEALS
  getDealStatus = async customerId => {
    const dealType = ["FXSPOT", "FXFWD", "MARGIN", "PAYMENT"];
    dealType.forEach(async type => {
      const res = await apiHandler({
        url: endpoint.DEALS + "?type=" + type + "&customerId=" + customerId,
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
        this.parseDealData(type, res.data.deals);
      }
    });
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
  shortenDealId = dealId => {
    let newDealId = dealId;
    let index = dealId.lastIndexOf("-");
    if (index !== -1) {
      newDealId = dealId.substring(index + 1, dealId.length);
    }
    return newDealId;
  };
  parseDealData = (dealType, deals) => {
    let dealState = [];
    switch (dealType) {
      case "FXSPOT":
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              "FXSPOT_" + deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              formatMoney(deal.currencyBought) + " " + deal.boughtCurrencyCode,
              formatMoney(deal.currencySold) + " " + deal.soldCurrencyCode,
              this.getStatusButton(deal.status, "TRADE", deal.dealId)
            ];
            dealState.push(dealRow);
          });

        this.setState({
          currentReportName: "FX SPOT Report",
          spotDealData: dealState,
          dealAllData: dealState,
          selectedPageIndex: 1,
          dealSelectedData: dealState.slice(0, 10)
        });
        break;
      case "FXFWD":
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              "FXFWD_" + deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              formatMoney(deal.currencyBought) + " " + deal.boughtCurrencyCode,
              formatMoney(deal.currencySold) + " " + deal.soldCurrencyCode,
              deal.currentValuation
                ? formatMoney(deal.currentValuation) +
                  " " +
                  deal.currencyValuationCurrencyCode
                : "",
              this.getStatusButton(deal.status, "TRADE", deal.dealId)
            ];
            dealState.push(dealRow);
          });
        this.setState({ forwardDealData: dealState });
        break;
      case "MARGIN":
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              "MARGIN_" + deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              deal.currentValuation
                ? formatMoney(deal.currentValuation) +
                  " " +
                  deal.currencyValuationCurrencyCode
                : "",
              formatMoney(deal.marginDeposit) +
                " " +
                deal.marginDepositCurrencyCode,
              this.getStatusButton(deal.status, "TRADE", deal.dealId),
              this.getStatusButton("TOP UP MARGIN", "TRADE", deal.dealId)
            ];
            dealState.push(dealRow);
          });
        this.setState({ marginsDealData: dealState });
        break;
      case "PAYMENT":
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              "PAYMENT_" + deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              deal.beneficiaryName,
              formatMoney(deal.transferAmount) +
                " " +
                deal.transferAmountCurrencyCode,
              this.getStatusButton(deal.status, "PAYMENT", deal.dealId)
            ];
            dealState.push(dealRow);
          });
        this.setState({ paymentsDealData: dealState });
        break;
      default:
        break;
    }
  };
  showSpotDeal = () => {
    this.setState({
      currentReportName: "FX SPOT Report",
      dealColumns: this.dealStatusColumns["FXSPOT"],
      dealAllData: this.state.spotDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.spotDealData.slice(
        0,
        this.state.recordsPerPage
      )
    });
    this.handleMenuClose();
  };
  showForwardDeal = () => {
    this.setState({
      currentReportName: "FX FORWARD Report",
      dealColumns: this.dealStatusColumns["FXFWD"],
      dealAllData: this.state.forwardDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.forwardDealData.slice(
        0,
        this.state.recordsPerPage
      )
    });
    this.handleMenuClose();
  };
  showMarginsDeal = () => {
    this.setState({
      currentReportName: "MARGINS Report",
      dealColumns: this.dealStatusColumns["MARGINS"],
      dealAllData: this.state.marginsDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.marginsDealData.slice(
        0,
        this.state.recordsPerPage
      )
    });
    this.handleMenuClose();
  };
  showPaymentsDeal = () => {
    this.setState({
      currentReportName: "PAYMENT Report",
      dealColumns: this.dealStatusColumns["PAYMENTS"],
      dealAllData: this.state.paymentsDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.paymentsDealData.slice(
        0,
        this.state.recordsPerPage
      )
    });
    this.handleMenuClose();
  };
  dealTableRowClick = async dealId => {
    // console.log(dealId);
    let index = dealId.indexOf("_");

    const dealType = dealId.substring(0, index);
    const ID = dealId.substring(index + 1, dealId.length);
    const res = await apiHandler({
      url: endpoint.DEAL + "?type=" + dealType + "&dealId=" + ID,
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
      let dealTypeForDlg = "FxSpot";
      switch (dealType) {
        case "FXSPOT":
          dealTypeForDlg = "FxSpot";
          break;
        case "FXFWD":
          dealTypeForDlg = "FxForward";
          break;
        case "MARGIN":
          dealTypeForDlg = "FxForward";
          break;
        case "PAYMENT":
          dealTypeForDlg = "Payment";
          break;
        default:
          break;
      }
      this.setState({
        isDealExecuted: true,
        dealDetails: res.data,
        dealType: dealTypeForDlg
      });
      // console.log(res.data);
    }
  };
  handleStatusTracker = async (activityId, type, event) => {
    event.preventDefault();
    event.stopPropagation();
    const res = await apiHandler({
      url:
        endpoint.ADMIN_ACTIVITY_DETAILS +
        "?type=" +
        type +
        "&activityId=" +
        activityId,
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
      // console.log(res.data);
      if (res.data.activities && res.data.activities.length) {
        this.setState({
          showActivityTrackingDialog: true,
          activities: res.data.activities
        });
      }
    }
  };
  closeActivityTrackingDetails = () => {
    this.setState({
      activities: null,
      showActivityTrackingDialog: false
    });
  };
  closeDealModal = () => {
    this.setState({
      isDealExecuted: false,
      dealDetails: {},
      dealType: ""
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
  /**************** CUSTOMER ACTIVITY START ****************/
  addCustomerActivity = async record => {
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

    let query = "?id=" + ID + "&type=" + type;
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

  getRAGStatusIcon = status => {
    let color = "#50ae55";
    switch (status) {
      case "RED":
        color = "#df3d2b";
        break;
      case "AMBER":
        color = "#dfa52b";
        break;
      case "GREEN":
        color = "#50ae55";
        break;
    }
    return (
      <FiberManualRecordIcon
        style={{ color: color, textAlign: "center", width: 50, height: 50 }}
      />
    );
  };
  getCompanyDocLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Detail Report
      </a>
    ) : null;
  };
  getBeneficiaryStatusButton = (status, taskDetails) => {
    return (
      <>
        <Button
          style={{
            backgroundColor:
              status === "APPROVED" || status === "COMPLETED"
                ? "#95c440"
                : status === "PENDING"
                ? "rgb(223,165,43)"
                : "rgb(225,0,0)"
          }}
          size="sm"
          round
          onClick={event => {
            this.showBeneficiaryChangeStatus(taskDetails);
          }}
        >
          {status}
        </Button>
      </>
    );
  };
  getAlertButton = alertData => {
    return (
      <>
        <Button
          size="sm"
          round
          style={{ backgroundColor: "#00acc1" }}
          onClick={() => this.showAlertStatus(alertData)}
        >
          {"Alerts"}
        </Button>
      </>
    );
  };
  getCompanySanctionsButton = companySanctions => {
    return (
      <>
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.showCompanySanctions(companySanctions)}
        >
          {"Sanctions"}
        </Button>
      </>
    );
  };
  getDirectorKYCButton = (
    isDirectorKYCExists,
    isCompanyKYCExists,
    directorId,
    customerRegistrationDetails
  ) => {
    if (!isDirectorKYCExists && !isCompanyKYCExists) {
      return <React.Fragment> </React.Fragment>;
    } else if (!isDirectorKYCExists) {
      return (
        <>
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() =>
              this.performDirectorKYC(directorId, customerRegistrationDetails)
            }
          >
            {"Perform KYC"}
          </Button>
        </>
      );
    } else return <React.Fragment> </React.Fragment>;
  };
  getCompanyKYCButton = (
    isDirectorKYCExists,
    isCompanyKYCExists,
    customerRegistrationDetails
  ) => {
    if (!isDirectorKYCExists && !isCompanyKYCExists) {
      return <React.Fragment> </React.Fragment>;
    } else if (!isCompanyKYCExists) {
      return (
        <>
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() => this.performCompanyKYC(customerRegistrationDetails)}
          >
            {"Perform KYC"}
          </Button>
        </>
      );
    } else return <React.Fragment> </React.Fragment>;
  };
  getInprocessKYCButton = () => {
    return (
      <>
        <Button color={"success"} size="sm" round>
          {"Inprocess"}
        </Button>
      </>
    );
  };
  getDirectorActionButton = (isAdditional, customerId, kycEntityId) => {
    if (isAdditional) {
      return (
        <>
          <Edit
            onClick={() => this.handleEditDirector(customerId, kycEntityId)}
            className={cx(
              this.props.classes.editKycIcon,
              this.props.classes.icon
            )}
          />
          <Close
            onClick={() =>
              this.handleDeleteDirectorCompany(customerId, kycEntityId)
            }
            className={cx(
              this.props.classes.closeKycIcon,
              this.props.classes.icon
            )}
          />
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() => this.executeKYC(customerId, kycEntityId)}
          >
            {"KYC"}
          </Button>
        </>
      );
    } else {
      return (
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.executeKYC(customerId, kycEntityId)}
        >
          {"KYC"}
        </Button>
      );
    }
  };
  getCompanyActionButton = (isAdditional, customerId, kycEntityId) => {
    if (isAdditional) {
      return (
        <>
          <Edit
            onClick={() => this.handleEditCustomer(customerId, kycEntityId)}
            className={cx(
              this.props.classes.editKycIcon,
              this.props.classes.icon
            )}
          />
          <Close
            onClick={() =>
              this.handleDeleteDirectorCompany(customerId, kycEntityId)
            }
            className={cx(
              this.props.classes.closeKycIcon,
              this.props.classes.icon
            )}
          />
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() => this.executeKYC(customerId, kycEntityId)}
          >
            {"KYC"}
          </Button>
        </>
      );
    } else {
      return (
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.executeKYC(customerId, kycEntityId)}
        >
          {"KYC"}
        </Button>
      );
    }
  };
  showIDCheckButton = (idCheckData, documentCheckReport) => {
    let updatedIdCheckData = {
      ...idCheckData,
      documentCheckReport: documentCheckReport
    };
    return (
      <>
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.showIDCheck(updatedIdCheckData)}
        >
          {"Show ID Check Details"}
        </Button>
      </>
    );
  };
  getIDCheckButton = directorDetails => {
    return (
      <>
        <Button
          style={{ backgroundColor: "#00acc1" }}
          size="sm"
          round
          onClick={() => this.performIDCheck(directorDetails)}
        >
          {"Perform ID Check"}
        </Button>
      </>
    );
  };
  isAdditional = flag => {
    return flag ? <AddIcon /> : <React.Fragment />;
  };
  getDirectorKycData = (kycInfo, taskDetails) => {
    let kycData = kycInfo.kycDetails;
    let CustomerRegistrationData = kycInfo.customerRegistrationDetails;
    let companyKycDetailsOrig =
      kycData.companyKycDetails &&
      kycData.companyKycDetails.find(company => {
        return company.additionalCompany === false;
      });

    kycData.isCompanyKYCExists = false;
    kycData.companyKycDetails &&
      kycData.companyKycDetails.forEach(company => {
        if (
          company.kycStatus === null ||
          company.kycStatus === "COMPLETED" ||
          company.kycStatus === "INPROCESS"
        )
          kycData.isCompanyKYCExists = true;
      });
    kycData.isDirectorKYCExists = false;
    kycData.directorKycDetails &&
      kycData.directorKycDetails.forEach(director => {
        if (
          director.kycStatus === null ||
          director.kycStatus === "COMPLETED" ||
          director.kycStatus === "INPROCESS"
        )
          kycData.isDirectorKYCExists = true;
      });
    // Adding Director KYC details
    kycData.directorKycData = [];
    // if (kycData.isDirectorKYCExists) {
    kycData &&
      kycData.directorKycDetails &&
      kycData.directorKycDetails.forEach((director, index) => {
        // reset status for null value
        if (director.kycStatus === null) director.kycStatus = "COMPLETED";

        if (director.kycStatus === "COMPLETED") {
          // KYC completed
          kycData.directorKycData.push([
            index,
            this.isAdditional(director.additionalDirector),
            director.name,
            "Director",
            director.riskScore,
            this.getRAGStatusIcon(director.rag),
            this.getCompanyDocLink(director.pdfreport),
            this.getAlertButton(director.alerts),
            director.idDocumentStatus === "COMPLETED"
              ? this.showIDCheckButton(
                  director.idDocumentCheckData,
                  director.documentCheckReport
                )
              : director.idDocumentStatus === "INPROCESS"
              ? this.getInprocessKYCButton()
              : this.getIDCheckButton({
                  customerId: CustomerRegistrationData.customerId,
                  customerName: CustomerRegistrationData.companyName,
                  kycEntityId: director.kycEntityId,
                  directorId: director.directorId,
                  addressProofType: director.addressProofType,
                  addressProofLink: director.addressProofLink,
                  firstName: director.name.split(" ")[0],
                  lastName: director.name.split(" ")[1]
                })
          ]);
        } else if (director.kycStatus === "INPROCESS") {
          // KYC InProcess
          kycData.directorKycData.push([
            index,
            this.isAdditional(director.additionalDirector),
            director.name,
            "Director",
            "",
            "",
            "",
            this.getInprocessKYCButton(),
            ""
          ]);
        } else {
          // KYC is still pending for this Director
          kycData.directorKycData.push([
            index,
            this.isAdditional(director.additionalDirector),
            director.name,
            "Director",
            "",
            "",
            "",
            this.getDirectorActionButton(
              director.additionalDirector,
              kycData.customerId,
              director.kycEntityId
            ),
            ""
          ]);
        }
      });
    /*} else {
      CustomerRegistrationData &&
        CustomerRegistrationData.directors &&
        CustomerRegistrationData.directors.forEach((director, index) => {
          kycData.directorKycData.push([
            index,
            this.isAdditional(false),
            director.firstName + ' ' + director.lastName,
            'Director',
            '',
            '',
            '',
            this.getDirectorKYCButton(kycData.isDirectorKYCExists, kycData.isCompanyKYCExists, director.directorId, CustomerRegistrationData),
            '',
          ]);
        });
    }*/
    // if (kycData.isCompanyKYCExists) {
    kycData &&
      kycData.companyKycDetails &&
      kycData.companyKycDetails.forEach((company, index) => {
        if (company.kycStatus === null) company.kycStatus = "COMPLETED";

        if (company.kycStatus === "COMPLETED") {
          // KYC completed
          kycData.directorKycData.push([
            kycData.directorKycData.length,
            this.isAdditional(company.additionalCompany),
            company.name,
            "Company",
            company.riskScore,
            this.getRAGStatusIcon(company.rag),
            this.getCompanyDocLink(company.pdfreport),
            this.getAlertButton(company.alerts),
            ""
          ]);
        } else if (company.kycStatus === "INPROCESS") {
          // KYC in process
          kycData.directorKycData.push([
            kycData.directorKycData.length,
            this.isAdditional(company.additionalCompany),
            company.name,
            "Company",
            "",
            "",
            "",
            this.getInprocessKYCButton(),
            ""
          ]);
        } else {
          // KYC is still pending for this Customer
          kycData.directorKycData.push([
            kycData.directorKycData.length,
            this.isAdditional(company.additionalCompany),
            company.name,
            "Company",
            "",
            "",
            "",
            this.getCompanyActionButton(
              company.additionalCompany,
              kycData.customerId,
              company.kycEntityId
            ),
            ""
          ]);
        }
      });
    /*} else {
      // Adding Company status
      kycData.directorKycData.push([
        kycData.directorKycData.length,
        CustomerRegistrationData.companyName,
        this.isAdditional(false),
        'Company',
        '',
        '',
        '',
        this.getCompanyKYCButton(kycData.isDirectorKYCExists, kycData.isCompanyKYCExists, CustomerRegistrationData),
        '',
      ]);
    }*/
    if (kycData.isCompanyKYCExists) {
      // adding Shareholder data
      let shareHolders = [];
      companyKycDetailsOrig &&
        companyKycDetailsOrig.shareHolders &&
        companyKycDetailsOrig.shareHolders.forEach((share, index) =>
          shareHolders.push([index, share])
        );
      kycData.shareHoldersData = shareHolders;
      // adding Director data
      let directors = [];
      companyKycDetailsOrig &&
        companyKycDetailsOrig.directors &&
        companyKycDetailsOrig.directors.forEach((director, index) =>
          directors.push([
            index,
            director.name,
            director.dob,
            director.position,
            director.appointmentDate,
            director.address,
            director.postalCode
          ])
        );
      kycData.directorsData = directors;
      // Adding CreditLimit Data
      kycData.creditLimitData = [];
      if (companyKycDetailsOrig && companyKycDetailsOrig.creditRating) {
        let cl = companyKycDetailsOrig.creditRating;
        kycData.creditLimitData.push([
          0,
          cl.rating,
          cl.ratingType,
          cl.description,
          cl.minRating + " - " + cl.maxRating,
          cl.creditLimit
        ]);
      }

      // adding Company Sanctions data
      const fillButtons = value => {
        if (value === null) {
          return <>No Data</>;
        } else {
          return value ? (
            <CheckIcon
              className={cx(
                this.props.classes.editSanctionIcon,
                this.props.classes.icon
              )}
            />
          ) : (
            <CloseIcon
              className={cx(
                this.props.classes.closeSanctionIcon,
                this.props.classes.icon
              )}
            />
          );
        }
      };

      kycData.companySanction =
        companyKycDetailsOrig && companyKycDetailsOrig.companySanction;
      if (kycData.companySanction) {
        let negativeData = [];
        negativeData.push([
          0,
          "Politically Exposed",
          fillButtons(kycData.companySanction.pep)
        ]);
        negativeData.push([
          1,
          "PEP Level",
          fillButtons(kycData.companySanction.pepLevel || null)
        ]);
        negativeData.push([
          2,
          "Financial Regulator",
          fillButtons(
            kycData.companySanction.notes &&
              kycData.companySanction.notes["Financial Regulator"]
          )
        ]);
        negativeData.push([
          3,
          "Adverse Media",
          fillButtons(
            kycData.companySanction.notes &&
              kycData.companySanction.notes["Adverse Media"]
          )
        ]);
        negativeData.push([
          4,
          "Insolvent",
          fillButtons(kycData.companySanction.insolvent)
        ]);
        negativeData.push([
          5,
          "Disqualified Director",
          fillButtons(kycData.companySanction.disqualifiedDirector)
        ]);
        negativeData.push([
          6,
          "Law Enforcement",
          fillButtons(kycData.companySanction.lawEnforcement)
        ]);
        kycData.companySanction.companySanctionNegativeData = negativeData;

        let typeData = [];
        typeData.push([
          0,
          "AUSTRAC",
          fillButtons(kycData.companySanction.austracPreviousSanction),
          fillButtons(kycData.companySanction.austracCurrentSanction)
        ]);
        typeData.push([
          1,
          "EU",
          fillButtons(kycData.companySanction.eupreviousSanction),
          fillButtons(kycData.companySanction.eucurrentSanction)
        ]);
        typeData.push([
          2,
          "HMT",
          fillButtons(kycData.companySanction.hmtpreviousSanction),
          fillButtons(kycData.companySanction.hmtcurrentSanction)
        ]);
        typeData.push([
          3,
          "OFAC",
          fillButtons(kycData.companySanction.ofacpreviousSanction),
          fillButtons(kycData.companySanction.ofaccurrentSanction)
        ]);
        typeData.push([
          4,
          "UN",
          fillButtons(kycData.companySanction.unpreviousSanction),
          fillButtons(kycData.companySanction.uncurrentSanction)
        ]);
        kycData.companySanction.companySanctionTypeData = typeData;

        let documentsData = [];
        kycData.companySanction.sanctionDocuments &&
          kycData.companySanction.sanctionDocuments.forEach(
            (document, index) => {
              documentsData.push([
                index,
                document.sactionName,
                this.getDocumentLink(document.origionalHref),
                this.getDocumentLink(document.secureHref)
              ]);
            }
          );
        kycData.companySanction.sanctionDocumentsData = documentsData;

        let insolventsData = [];
        kycData.companySanction.insolvents &&
          kycData.companySanction.insolvents.forEach((insolvent, index) => {
            insolventsData.push([
              index,
              this.getDocumentLink(insolvent.origionalHref),
              this.getDocumentLink(insolvent.secureHref)
            ]);
          });
        kycData.companySanction.insolventsData = insolventsData;
      }
      kycData.beneficiaryKYCData = [];
      if (kycData.beneficiaryKycDetails) {
        kycData.beneficiaryKycDetails &&
          kycData.beneficiaryKycDetails.forEach((beneficiary, index) => {
            if (beneficiary.kycStatus === "COMPLETED") {
              kycData.beneficiaryKYCData.push([
                index,
                beneficiary.name,
                // beneficiary.contactDetail,
                // beneficiary.creditRating,
                // beneficiary.registrationNumber,
                beneficiary.riskScore,
                this.getRAGStatusIcon(beneficiary.rag),
                this.getCompanyDocLink(beneficiary.pdfreport),
                this.getAlertButton(beneficiary.alerts),
                this.getCompanySanctionsButton(beneficiary.companySanction),
                this.getBeneficiaryStatusButton(beneficiary.beneficiaryStatus, {
                  taskId: beneficiary.beneficiaryId,
                  taskType: "BENEFICIARY",
                  customerId: kycData.customerId,
                  customerName: companyKycDetailsOrig.name,
                  statusList: ["APPROVED", "REJECTED"]
                })
              ]);
            } else if (beneficiary.kycStatus === "INPROCESS") {
              kycData.beneficiaryKYCData.push([
                index,
                beneficiary.name,
                // beneficiary.contactDetail,
                // '',
                // '',
                "",
                "",
                "",
                this.getInprocessKYCButton(),
                "",
                this.getBeneficiaryStatusButton(beneficiary.beneficiaryStatus, {
                  taskId: beneficiary.beneficiaryId,
                  taskType: "BENEFICIARY",
                  customerId: kycData.customerId,
                  customerName: companyKycDetailsOrig.name,
                  statusList: ["APPROVED", "REJECTED"]
                })
              ]);
            } else {
              kycData.beneficiaryKYCData.push([
                index,
                beneficiary.name,
                //beneficiary.contactDetail, '', '',
                "",
                "",
                "",
                "",
                "",
                ""
              ]);
            }
          });
      }
    }

    this.setState({
      showCustomerKYCStatus: true,
      taskDetails: taskDetails,
      kycInfo: kycData,
      customerRegistrationDetails: CustomerRegistrationData
    });
  };
  getCustomerKYCInfo = async (customerId, event) => {
    if (event && event !== null) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ callInProgress: true });
    // customerId = 14;
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_KYC_DETAILS + customerId,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
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
      this.setState({ showCustomerKYCStatus: false });
      this.getDirectorKycData(res.data);
    }
  };
  refreshKycData = customerId => {
    this.getCustomerKYCInfo(customerId, null);
  };
  updateCustomerKyc = customerId => {};
  closeCustomerKYCStatus = () => {
    this.setState({
      showCustomerKYCStatus: false,
      kycInfo: null,
      customerRegistrationData: null,
      taskDetails: null,
      showAlertModal: false,
      alertData: null
    });
  };
  getAlertTypeIcon = type => {
    switch (type) {
      case "ALERT":
        return (
          <ErrorIcon
            className={cx(
              this.props.classes.errorIcon,
              this.props.classes.icon
            )}
          />
        );
      case "INFO":
        return (
          <InfoIcon
            className={cx(this.props.classes.infoIcon, this.props.classes.icon)}
          />
        );
      case "VERIFICATION":
        return (
          <AddCircleIcon
            className={cx(this.props.classes.addIcon, this.props.classes.icon)}
          />
        );
    }
  };
  showAlertStatus = alertData => {
    let alertTableData = [];
    alertData &&
      alertData.forEach((alert, index) => {
        alertTableData.push([
          index,
          this.getAlertTypeIcon(alert.type),
          alert.ruleId,
          alert.message,
          alert.riskScore
        ]);
      });
    this.setState({
      showAlertModal: true,
      alertData: alertTableData
    });
  };
  closeAlertModal = () => {
    this.setState({
      showAlertModal: false,
      alertData: null
    });
  };
  showCompanySanctions = companySanctions => {
    // adding Company Sanctions data
    const fillButtons = value => {
      if (value === null) {
        return <>No Data</>;
      } else {
        return value ? (
          <CheckIcon
            className={cx(
              this.props.classes.editSanctionIcon,
              this.props.classes.icon
            )}
          />
        ) : (
          <CloseIcon
            className={cx(
              this.props.classes.closeSanctionIcon,
              this.props.classes.icon
            )}
          />
        );
      }
    };

    let beneficiaryCompanySanction = companySanctions;
    if (beneficiaryCompanySanction) {
      beneficiaryCompanySanction.companySanctionNegativeDataColumn = [
        "Negative Data Type",
        "Present"
      ];
      beneficiaryCompanySanction.companySanctionTypeColumn = [
        "Sanction Type",
        "Previously",
        "Currently"
      ];
      beneficiaryCompanySanction.companySanctionDocumentsColumn = [
        "Sanction Name",
        "Original Href",
        "Secure Href"
      ];
      beneficiaryCompanySanction.companyInsolventsColumn = [
        "Original Href",
        "Secure Href"
      ];

      let negativeData = [];
      negativeData.push([
        0,
        "Politically Exposed",
        fillButtons(companySanctions.pep)
      ]);
      negativeData.push([
        1,
        "PEP Level",
        fillButtons(companySanctions.pepLevel || null)
      ]);
      negativeData.push([
        2,
        "Financial Regulator",
        fillButtons(
          companySanctions.notes &&
            companySanctions.notes["Financial Regulator"]
        )
      ]);
      negativeData.push([
        3,
        "Adverse Media",
        fillButtons(
          companySanctions.notes && companySanctions.notes["Adverse Media"]
        )
      ]);
      negativeData.push([
        4,
        "Insolvent",
        fillButtons(companySanctions.insolvent)
      ]);
      negativeData.push([
        5,
        "Disqualified Director",
        fillButtons(companySanctions.disqualifiedDirector)
      ]);
      negativeData.push([
        6,
        "Law Enforcement",
        fillButtons(companySanctions.lawEnforcement)
      ]);
      beneficiaryCompanySanction.companySanctionNegativeData = negativeData;

      let typeData = [];
      typeData.push([
        0,
        "AUSTRAC",
        fillButtons(companySanctions.austracPreviousSanction),
        fillButtons(companySanctions.austracCurrentSanction)
      ]);
      typeData.push([
        1,
        "EU",
        fillButtons(companySanctions.eupreviousSanction),
        fillButtons(companySanctions.eucurrentSanction)
      ]);
      typeData.push([
        2,
        "HMT",
        fillButtons(companySanctions.hmtpreviousSanction),
        fillButtons(companySanctions.hmtcurrentSanction)
      ]);
      typeData.push([
        3,
        "OFAC",
        fillButtons(companySanctions.ofacpreviousSanction),
        fillButtons(companySanctions.ofaccurrentSanction)
      ]);
      typeData.push([
        4,
        "UN",
        fillButtons(companySanctions.unpreviousSanction),
        fillButtons(companySanctions.uncurrentSanction)
      ]);
      beneficiaryCompanySanction.companySanctionTypeData = typeData;

      let documentsData = [];
      companySanctions.sanctionDocuments &&
        companySanctions.sanctionDocuments.forEach((document, index) => {
          documentsData.push([
            index,
            document.sactionName,
            this.getDocumentLink(document.origionalHref),
            this.getDocumentLink(document.secureHref)
          ]);
        });
      beneficiaryCompanySanction.sanctionDocumentsData = documentsData;

      let insolventsData = [];
      companySanctions.insolvents &&
        companySanctions.insolvents.forEach((insolvent, index) => {
          insolventsData.push([
            index,
            this.getDocumentLink(insolvent.origionalHref),
            this.getDocumentLink(insolvent.secureHref)
          ]);
        });
      beneficiaryCompanySanction.insolventsData = insolventsData;
    }

    this.setState({
      showCompanySanctionsModal: true,
      companySanctionsData: beneficiaryCompanySanction
    });
  };
  closeCompanySanctionsModal = () => {
    this.setState({
      showCompanySanctionsModal: false,
      companySanctionsData: null
    });
  };

  handleDeleteDirectorCompany = (customerId, kycEntityId) => {
    this.setState({
      confirmationModal: false,
      confirmationKycModal: true,
      confirmationModalHeader: "KYC Data",
      confirmationModalMsg: "Are you sure you want to delete this entry",
      deleteCustomerId: customerId,
      deleteKycEntityId: kycEntityId
    });
  };
  handleKycNegativeResponse = () => {
    this.setState({
      confirmationModal: false,
      confirmationKycModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      deleteCustomerId: "",
      deleteKycEntityId: ""
    });
  };
  handleKycPositiveResponse = async () => {
    const customerId = this.state.deleteCustomerId;
    const kycEntityId = this.state.deleteKycEntityId;
    // Call API to delete director and refresh
    this.setState({ callInProgress: true });
    // ADMIN_CUSTOMER_KYC_DELETE
    const res = await apiHandler({
      method: "DELETE",
      url:
        endpoint.ADMIN_CUSTOMER_KYC_DELETE +
        "?customerId=" +
        customerId +
        "&kycEntityId=" +
        kycEntityId,
      // data: code,
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
      this.refreshKycData(customerId);
    }
  };
  handleDirectorClose = () => {
    this.setState({ showAddDirector: false, editDirector: null });
  };
  handleEditDirector = async (customerId, kycEntityId) => {
    // Call API to get Director and show popup
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
      this.setState({ showAddDirector: true, editDirector: res.data });
    }
  };
  addDirector = director => {
    // Do Nothing
  };
  updateDirector = async director => {
    console.log(director);
    this.setState({ callInProgress: true });

    let updatedDirector = { ...director };
    updatedDirector.countryCode = updatedDirector.alpha2Code;
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CUSTOMER_PERSONONLY,
      data: updatedDirector,
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
      this.refreshKycData(director.customerId);
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

  executeKYC = async (customerId, kycEntityId) => {
    // Call API to delete director and refresh
    this.setState({ callInProgress: true });
    const data = {
      customerId: customerId,
      kycEntityId: kycEntityId
    };
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.KYC_COMPANY_EXECUTEKYC,
      data: data,
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
      this.refreshKycData(customerId);
    }
  };
  performDirectorKYC = async (directorId, customerRegistrationDetails) => {
    this.setState({ callInProgress: true });

    let director = customerRegistrationDetails.directors.find(dir => {
      return dir.directorId === directorId;
    });
    const directorData = {
      customerId: customerRegistrationDetails.customerId,
      companyName: customerRegistrationDetails.companyName,
      additionalDirector: false,
      ...director
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CUSTOMER_PERSONONLY,
      data: directorData,
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
      this.refreshKycData(customerRegistrationDetails.customerId);
    }
  };
  performCompanyKYC = async customerRegistrationDetails => {
    this.setState({ callInProgress: true });

    let registeredAddress = customerRegistrationDetails.addresses.find(
      address => {
        return address.addressType === "REGISTERED_OFFICE_ADDRESS";
      }
    );
    let ownershipType = "";
    switch (customerRegistrationDetails.ownershipType) {
      case "2":
        ownershipType = "Private";
        break;
      case "3":
        ownershipType = "Public";
        break;
    }
    const customerData = {
      customerId: customerRegistrationDetails.customerId,
      companyName: customerRegistrationDetails.companyName,
      companyDesc: customerRegistrationDetails.companyDesc,
      email: customerRegistrationDetails.email,
      phoneNumber: customerRegistrationDetails.phoneNumber,
      incorporationNumber: customerRegistrationDetails.incorporationNumber,
      ownershipType: ownershipType,
      registeredOfficeAddress: registeredAddress,
      additionalCompany: false
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_COMPANY_ONLY,
      data: customerData,
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
      this.refreshKycData(customerRegistrationDetails.customerId);
    }
  };
  performKYC = async customerRegistrationDetails => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_CUSTOMER_COMPANYANDDIRECTORS,
      data: customerRegistrationDetails,
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
      this.refreshKycData(customerRegistrationDetails.customerId);
    }
  };
  closeIDCheck = () => {
    this.setState({
      showIDCheckDetails: false,
      showPerformIDCheck: false,
      idCheckDetails: null,
      idCheckRequiredData: null
    });
  };
  showIDCheck = beneficiaryData => {
    this.setState({
      showIDCheckDetails: true,
      idCheckDetails: beneficiaryData
    });
  };
  updateIDCheck = async record => {
    this.setState({ callInProgress: true });
    console.log(record);
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CUSTOMER_IDENTITYCHECK,
      data: record,
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
      this.refreshKycData(record.customerId);
    }
  };
  performIDCheck = directorDetails => {
    this.setState({
      showPerformIDCheck: true,
      idCheckRequiredData: directorDetails
    });
  };
  showBeneficiaryChangeStatus = taskDetails => {
    this.setState({
      showChangeStatusDialog: true,
      taskDetails: taskDetails
    });
  };
  updateBeneficiaryStatus = async taskUpdatedInfo => {
    this.closeChangeStatusDialog();
    this.setState({ callInProgress: true });

    const record = {
      memberName: taskUpdatedInfo.memberName,
      reportDate: taskUpdatedInfo.reportDate,
      customerId: taskUpdatedInfo.customerId,
      customerName: taskUpdatedInfo.customerName,
      type: "BENEFICIARY_KYC_STATUS",
      reason: taskUpdatedInfo.reason,
      documentLinks: taskUpdatedInfo.supportingDocs,
      signature: taskUpdatedInfo.signature,
      activityId: taskUpdatedInfo.taskId,
      status: taskUpdatedInfo.status,
      approved: taskUpdatedInfo.status === "APPROVED"
    };
    console.log(record);
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_CUSTOMER_DUEDILIGENCE_CREATE,
      data: record,
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
      this.refreshKycData(record.customerId);
    }
  };
  showKycChangeStatus = taskDetails => {
    this.setState({
      showCustomerKYCStatus: false,
      kycInfo: null,
      showChangeStatusDialog: true,
      taskDetails: taskDetails
    });
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
                  <b>Client Info</b>
                </h4>
              </GridItem>
              <GridItem xs={12} sm={12} md={9} lg={9}>
                <NavLink
                  to={
                    "/auth/admin/impersonate-login/" + encodeURIComponent(this.state.customerEmail)
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
                <Button
                  size="lg"
                  style={{
                    width: "200px",
                    float: "right",
                    marginRight: 10
                  }}
                  onClick={() => {
                    this.setState({ showCustomerSettings: true });
                  }}
                >
                  SETTINGS
                </Button>
                <Button
                  aria-controls="report-menu"
                  aria-haspopup="true"
                  variant="contained"
                  onClick={this.handleReportClick}
                  size="lg"
                  style={{
                    width: "200px",
                    float: "right",
                    marginRight: 10
                  }}
                >
                  REPORTS
                  <ArrowDropDownIcon />
                </Button>
                <Menu
                  id="report-menu"
                  elevation={0}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                  }}
                  MenuListProps={{
                    style: {
                      border: "1px solid #d3d4d5",
                      borderRadius: "3px",
                      boxShadow:
                        "0 2px 5px 0 rgba(' + hexToRgb(blackColor) + ', 0.26)"
                    }
                  }}
                  anchorEl={this.state.anchorReportEl}
                  keepMounted
                  open={Boolean(this.state.anchorReportEl)}
                  onClose={this.handleMenuClose}
                >
                  <MenuItem onClick={this.showSpotDeal}>{"FX SPOT"}</MenuItem>
                  <MenuItem onClick={this.showForwardDeal}>
                    {"FX FORWARD"}
                  </MenuItem>
                  <MenuItem onClick={this.showMarginsDeal}>{"MARGIN"}</MenuItem>
                  <MenuItem onClick={this.showPaymentsDeal}>
                    {"PAYMENTS"}
                  </MenuItem>
                </Menu>
                <Button
                  size="lg"
                  style={{
                    backgroundColor: "#00acc1",
                    width: "200px",
                    float: "right",
                    marginRight: 10
                  }}
                  onClick={event => {
                    this.getCustomerKYCInfo(this.state.customerId, event);
                  }}
                >
                  KYC Details
                </Button>
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
                          <strong>{this.state.customerName}</strong>
                        </h4>
                        <GridContainer
                          direction="row"
                          style={{
                            borderBottom: "1px solid #d2d2d2",
                            paddingBottom: 10
                          }}
                        >
                          <GridItem
                            xs={6}
                            sm={6}
                            md={6}
                            lg={6}
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
                            xs={6}
                            sm={6}
                            md={6}
                            lg={6}
                            style={{
                              textAlign: "left",
                              marginTop: 15
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem lg={8} style={{}}>
                                <span>Risk Level</span>
                              </GridItem>
                            </GridContainer>
                            <GridContainer direction="row">
                              <GridItem lg={8}>
                                <span className={classes.ellipses}>
                                  {this.state.riskLevel}
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
                                <span>HIRED PLAN</span>
                              </GridItem>
                            </GridContainer>
                            <GridContainer direction="row">
                              <GridItem lg={12}>
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
                                <span
                                  className={classes.ellipses}
                                  style={{ marginLeft: 15, cursor: "pointer" }}
                                >
                                  <a
                                    aria-controls="status-menu"
                                    aria-haspopup="true"
                                    onClick={() =>
                                      this.handleStatusClick("CLIENT")
                                    }
                                  >
                                    Change Status
                                  </a>
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
                              <GridItem
                                xs={6}
                                sm={6}
                                md={6}
                                lg={6}
                                style={{
                                  color:
                                    this.state.kycStatus === "APPROVED"
                                      ? "#95c440"
                                      : this.state.kycStatus === "PENDING"
                                      ? "rgb(223,165,43)"
                                      : "rgb(225,0,0)"
                                }}
                              >
                                <span>KYC Status</span>
                                <span>
                                  {this.getClientStatusButton(
                                    this.state.kycStatus
                                  )}
                                </span>
                                {/* <span>
                                  {this.state.kycStatus === "APPROVED" && (
                                    <CheckCircleOutlineOutlinedIcon
                                      style={{ marginLeft: 10 }}
                                    />
                                  )}
                                  {this.state.kycStatus === "PENDING" && (
                                    <AdjustOutlinedIcon
                                      style={{ marginLeft: 10 }}
                                    />
                                  )}
                                  {this.state.kycStatus === "REJECTED" && (
                                    <CancelOutlinedIcon
                                      style={{ marginLeft: 10 }}
                                    />
                                  )}
                                </span> */}
                                <span
                                  className={classes.ellipses}
                                  style={{
                                    marginLeft: 10,
                                    width: "auto",
                                    cursor: "pointer"
                                  }}
                                >
                                  <a
                                    aria-controls="status-kyc-menu"
                                    aria-haspopup="true"
                                    onClick={() =>
                                      this.handleStatusClick("KYC")
                                    }
                                  >
                                    Change Status
                                  </a>
                                </span>
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
                                      <span>Country</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.address &&
                                          this.state.address.country}
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
                                        {this.state.address &&
                                          this.state.address.city}
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
                                      <span>Address</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.address &&
                                          this.state.address.address}
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
                                        {this.state.address &&
                                          this.state.address.postalCode}
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
                                      <span>Phone Number</span>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer direction="row">
                                    <GridItem lg={8}>
                                      <span className={classes.ellipses}>
                                        {this.state.phoneNumber}
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
                        </div> */}
                        {this.state.customerUsers.length > 0 && (
                          <>
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
                          </>
                        )}
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <Card>
                      <CardHeader color="success" text>
                        <CardText style={{ backgroundColor: "#95c440" }}>
                          <FaceIcon className={classes.listItemIcon} />
                        </CardText>
                        <span className={classes.title}>
                          {" "}
                          {this.state.currentReportName}{" "}
                        </span>
                      </CardHeader>
                      <CardBody>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{ textAlign: "center" }}
                        >
                          <Table
                            hover
                            tableHeaderColor="gray"
                            tableHead={this.state.dealColumns}
                            tableData={this.state.dealSelectedData}
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
                            onClick={this.dealTableRowClick}
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
                          pages={this.getPageDetails()}
                          currentPage={this.state.selectedPageIndex}
                          color="info"
                          onClick={this.getPageData}
                        />
                      </GridItem>
                    </Card>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
        {this.state.showCustomerSettings && (
          <CustomerSettings
            handleClose={this.handleSettingsClose}
            showModal={this.state.showCustomerSettings}
            showEditSettings={true}
            settings={this.state.settings}
            updateSettings={this.updateSettings}
          />
        )}
        {this.state.isDealExecuted && (
          <DealExecutedDialog
            showModal={this.state.isDealExecuted}
            trade={this.state.dealDetails}
            dealType={this.state.dealType}
            closeModal={this.closeDealModal}
            isDashboard={true}
          />
        )}
        {this.state.showChangeStatusDialog && (
          <ChangeStatusDialog
            showModal={this.state.showChangeStatusDialog}
            closeModal={this.closeChangeStatusDialog}
            taskInfo={this.state.taskDetails}
            updateStatus={this.updateStatus}
          />
        )}
        {this.state.showCreateCustomerActivity && (
          <CreateCustomerActivityRecord
            type={"TRANSACTION"}
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
        {this.state.showCustomerKYCStatus && (
          <CustomerKYCStatus
            showModal={this.state.showCustomerKYCStatus}
            closeModal={this.closeCustomerKYCStatus}
            taskInfo={this.state.taskDetails}
            updateStatus={this.showKycChangeStatus}
            customerRegistrationDetails={this.state.customerRegistrationDetails}
            kycInfo={this.state.kycInfo}
            performKYC={this.performKYC}
            refreshKycData={this.refreshKycData}
            updateCustomerKyc={this.updateCustomerKyc}
            showAlertModal={this.state.showAlertModal}
            handleAlertClose={this.closeAlertModal}
            alertData={this.state.alertData}
          />
        )}
        {this.state.showCompanySanctionsModal && (
          <CompanyKYCSanctions
            showModal={this.state.showCompanySanctionsModal}
            closeModal={this.closeCompanySanctionsModal}
            record={this.state.companySanctionsData}
          />
        )}
        {this.state.showPerformIDCheck && (
          <IdCheckPerform
            showModal={this.state.showPerformIDCheck}
            closeModal={this.closeIDCheck}
            updateIDCheck={this.updateIDCheck}
            idCheckRequiredData={this.state.idCheckRequiredData}
          />
        )}
        {this.state.showIDCheckDetails && (
          <IdCheckDetails
            showModal={this.state.showIDCheckDetails}
            closeModal={this.closeIDCheck}
            record={this.state.idCheckDetails}
          />
        )}
        {this.state.showAddDirector && (
          <AddDirectors
            handleClose={this.handleDirectorClose}
            showModal={this.state.showAddDirector}
            addDirector={this.updateDirector}
            directors={this.state.directors}
            editDirector={this.state.editDirector}
            updateDirector={this.updateDirector}
            isAddon={this.state.isAddon}
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
        {this.state.confirmationKycModal && (
          <ConfirmationKycModal
            confirmationModal={this.state.confirmationKycModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleKycNegativeResponse}
            handlePositiveButton={this.handleKycPositiveResponse}
          />
        )}
        {this.state.showActivityTrackingDialog && (
          <StatusActivityTrackingDialog
            showModal={this.state.showActivityTrackingDialog}
            activities={this.state.activities}
            closeModal={this.closeActivityTrackingDetails}
          />
        )}
      </>
    );
  }
}

CustomerInfoPage.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object
};

export default withRouter(withStyles(styles)(CustomerInfoPage));
