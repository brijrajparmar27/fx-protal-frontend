import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import Switch from "@material-ui/core/Switch";
import FormHelperText from "@material-ui/core/FormHelperText";

// @material-ui/icons
import Work from "@material-ui/icons/Work";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";
import Edit from "@material-ui/icons/Edit";
import { validate } from "../../utils/Validator";
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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Table from "components/Table/Table.jsx";
import UpgradeUserSubscriptionPlan from "views/Components/UpgradeUserSubscriptionPlan.jsx";
import ManageSubscription from "views/Components/RiskSubscription/ManageSubscription.jsx";
import ManageSubscriptionCard from "views/Components/RiskSubscription/ManageSubscriptionCard.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import Logout from "views/Components/logout.jsx";
import { formatDate } from "../../utils/Utils";
import EditUsers from "./EditUsers";
import CircularProgress from "@material-ui/core/CircularProgress";
import { registerToken } from "utils/Utils.js";

import {
  cardTitle,
  roseColor,
  primaryColor,
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import TextField from "@mui/material/TextField";

const styles = (theme) => ({
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important",
    //top: 7
  },
  select: {
    padding: "4px 24px",
    fontSize: 14,
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: -15,
    },
  },
  selectFormHelperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "left",
  },
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center",
  },
  title: {
    color: "black",
    position: "absolute",
    marginLeft: 20,
    marginTop: 20,
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0",
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem",
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px",
  },
  filterInput: {
    top: -20,
  },
  detailsRow: {
    marginTop: 10,
    color: "black",
    textAlign: "right",
  },
  floatLeft: {
    float: "left",
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
    color: roseColor,
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
    borderRadius: 3,
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3,
  },
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3,
  },
  marginTop30: {
    marginTop: "30px",
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px",
    },
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white",
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "white",
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46,
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 14,
    marginRight: 5,
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999",
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
    display: "inline-block",
  },
  filledSelect: {
    textAlign: "left",
  },
  white: {
    color: "white",
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white",
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right",
  },
  ...customSelectStyle,
  ...regularFormsStyle,
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class ManageAccount extends React.Component {
  error = {
    firstNameErrorMsg: {
      required: "First name is required",
      range: "First name should be 1 to 100 characters",
    },
    lastNameErrorMsg: {
      required: "Last name is required",
      range: "Last name should be 1 to 100 characters",
    },
    emailErrorMsg: {
      required: "Email is required",
      company: "Please enter a company email",
      valid: "Please enter a valid email",
    },
    phoneNumberErrorMsg: {
      required: "Phone number is required",
      valid: "Please enter phone number in a valid format (xxx-xxx-xxxx)",
    },
    companyNameErrorMsg: {
      required: "Company name is required",
      valid: "Please enter a valid company name",
    },
    currentPasswordErrorMsg: {
      required: "Current Password is required",
    },
    newPasswordErrorMsg: {
      required: "New Password is required",
      range: "Password should be 8 to 16 characters",
      password:
        "Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)",
    },
    confirmNewPasswordErrorMsg: {
      required: "New Password Confirmation is required",
      range: "Password should be 8 to 16 characters",
      password:
        "Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)",
      matchPassword: "Confirm Password should match Password",
    },
    inviteEmailErrorMsg: {
      required: "Invite Email is required",
      valid: "Please enter a valid email",
    },
    inviteRiskEmailErrorMsg: {
      required: "Invite Email is required",
      valid: "Please enter a valid email",
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      users: [],
      phone: true,
      firstName: "",
      firstNameState: "",
      firstNamePristine: false,
      firstNameErrorMsg: [],
      lastName: "",
      lastNameState: "",
      lastNamePristine: false,
      lastNameErrorMsg: [],
      email: "",
      emailState: "",
      emailPristine: true,
      emailErrorMsg: [],
      phoneNumber: "",
      phoneNumberState: "",
      phoneNumberPristine: true,
      phoneNumberHelpMsg: "(xxx-xxx-xxxx)",
      phoneNumberErrorMsg: [],
      companyName: "",
      companyNameState: "",
      companyNamePristine: false,
      companyNameErrorMsg: [],
      customerId: "",
      customerStatus: "",
      kycStatus: "",
      currentPassword: "",
      currentPasswordState: "",
      currentPasswordPristine: false,
      currentPasswordErrorMsg: [],
      newPassword: "",
      newPasswordState: "",
      newPasswordPristine: false,
      newPasswordErrorMsg: [],
      confirmNewPassword: "",
      confirmNewPasswordState: "",
      confirmNewPasswordPristine: false,
      confirmNewPasswordErrorMsg: [],
      subscribedPlanName: "",
      subscribedPlanId: "",
      volumeDesc: "",
      subscriptionPlanExpiryDate: "",
      subscriptionPlanStartDate: "",
      volume: "",
      volumeLimitUsed: "",
      viewClient: false,
      inviteEmail: "",
      inviteEmailState: "",
      inviteEmailErrorMsg: [],
      inviteUserRole: "",
      inviteUserRoleState: "",
      inviteUserRoleErrorMsg: "",
      callInProgress: false,
      noticeModal: false,
      noticeModalErrMsg: "",
      noticeModalHeader: "",
      countries: [],
      countryCode: "",
      countryCodeState: "",
      status: sessionStorage.getItem("status"),
      enableUserList: {},
      showPlanUpgradeDialog: false,
      planOptions: {},
      volumeOptions: [],
      passwordChange: false,
      initiateLogout: false,
      showEditUser: false,
      userData: null,
      riskStatus: null,
      inviteRiskEmail: "",
      inviteRiskEmailState: "",
      inviteRiskEmailErrorMsg: [],
      inviteRiskUserRole: "",
      inviteRiskUserRoleState: "",
      inviteRiskUserRoleErrorMsg: "",
      role: sessionStorage.getItem("role"),
      canInviteUsers: true,
      showManageSubscriptionModal: false,
      showPaymentCardModal: false,

      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1,
    };
  }

  currencies = [
    {
      value: "USD",
      label: "US Dollars",
    },
    {
      value: "EUR",
      label: "European Dollars",
    },
    {
      value: "CAD",
      label: "Canada Dollars",
    },
  ];

  rulesList = {
    firstName: [
      { type: "required" },
      {
        type: "length",
        params: {
          min: 1,
          max: 100,
        },
      },
    ],
    lastName: [
      { type: "required" },
      {
        type: "length",
        params: {
          min: 1,
          max: 100,
        },
      },
    ],
    email: [{ type: "required" }, { type: "email" }],
    phoneNumber: [{ type: "required" }, { type: "phone" }],
    query: [{ type: "required" }],
    countryCode: [{ type: "required" }],
    currentPassword: [{ type: "required" }],
    newPassword: [{ type: "required" }],
    confirmNewPassword: [{ type: "required" }],
  };

  componentDidMount = () => {
    this.getUserInfo();
    this.getRiskPlanInfo();
    this.getCountries();
    this.getExistingUserList();
  };

  handleNegativeButton = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1,
    });
  };

  getUserInfo = async () => {
    const res = await apiHandler({
      url: endpoint.USER_INFO,
      authToken: sessionStorage.getItem("token"),
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
        });
      }
    } else {
      const user = res.data;
      let countryCode = user.phoneNumber && user.phoneNumber.slice(0, -10);
      let phone =
        user.phoneNumber && user.phoneNumber.slice(countryCode.length);
      this.setState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        companyName: user.customerName,
        customerStatus: user.customerStatus,
        kycStatus: user.kycStatus,
        customerId: user.customerId,
        countryCode: countryCode,
        phone: user.phoneNumber,
        subscribedPlanName: user.subscribedPlanName,
        subscribedPlanId: user.subscribedPlanId,
        volumeDesc: user.volumeDesc,
        subscriptionPlanExpiryDate: user.subscriptionPlanExpiryDate,
        subscriptionPlanStartDate: user.subscriptionPlanStartDate,
        volume: user.volume,
        volumeLimitUsed: user.volumeLimitUsed,
        viewClient: sessionStorage.getItem("view_as_client"),
      });
      //this.setState({ countries: countries });
    }
  };
  getRiskPlanInfo = async () => {
    const res = await apiHandler({
      method: "GET",
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: sessionStorage.getItem("token"),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 404) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      // console.log(res.data);
      this.getRiskPaymentInfo(res.data);
      // check if main User then getting Invite User List
      this.getRiskPlanUserList(res.data);
    }
  };
  getRiskPaymentInfo = async (planData) => {
    if (this.state.role === "role-prospect-invite-user") {
      this.setState({ riskStatus: { ...planData } });
    } else {
      const res = await apiHandler({
        method: "GET",
        url: endpoint.RISK_SUBSCRIPTION_PAYMENT_METHOD,
        authToken: sessionStorage.getItem("token"),
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else if (res.data.errorCode === 404) {
          this.setState({ riskStatus: { ...planData } });
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: res.data.userDesc,
          });
          this.setState({ riskStatus: { ...planData } });
        }
      } else {
        // console.log(res.data);
        this.setState({ riskStatus: { ...planData, ...res.data } });
      }
    }
  };
  getRiskPlanUserList = async (user) => {
    if (
      this.state.role !== "role-prospect-user" &&
      (this.state.role !== "role-prospect") &
        (sessionStorage.getItem("ht") &&
          this.state.role !== "role-customer-manager")
    ) {
      this.setState({ riskUsers: [], canInviteUsers: false });
    } else {
      const res = await apiHandler({
        method: "GET",
        url: endpoint.RISK_CLIENT_USERS_LIST + user.userEmail,
        authToken: sessionStorage.getItem("token"),
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: res.data.userDesc,
          });
        }
      } else {
        // console.log(res.data);

        let existingUserCount = res.data.customerUsers.length;
        let maxUserAllowed = user.maxUserAllowed;
        this.setState({
          riskUsers: [...res.data.customerUsers],
          canInviteUsers: existingUserCount < maxUserAllowed - 1,
        });
      }
    }
  };
  closeManageSubscriptionModal = () => {
    this.setState(
      {
        showManageSubscriptionModal: false,
        showPaymentCardModal: false,
      },
      () => {
        this.getRiskPlanInfo();
      }
    );
  };
  updateCardDetails = async (cardInfo) => {
    console.log(cardInfo);
    const origin = window.location.origin;
    const cardData = {
      nameOnCard: cardInfo.cardName,
      cardNumber: cardInfo.cardNumber,
      cvc: cardInfo.cvv,
      expMonth: cardInfo.cardValidUptoMM,
      expYear: "20" + cardInfo.cardValidUptoYY,
      returnUrl: origin + "/#/auth/risk-card-status",
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_SUBSCRIPTION_CARD_UPDATE,
      authToken: sessionStorage.getItem("token"),
      data: cardData,
    });
    this.setState({ callInProgress: false });
    this.closeManageSubscriptionModal();
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      if (res.data.status === "succeeded") {
        console.log(res.data);
        sessionStorage.setItem("P", res.data.paymentMethodId);
        // this.setState({
        //   noticeModal: true,
        //   noticeModalHeader: 'Information',
        //   noticeModalErrMsg: 'Payment Card information is updated successfully',
        // });
        // this.getRiskPlanInfo();
        this.props.history.push("/auth/risk-card-status");
      } else if (res.data.status === "requires_action") {
        sessionStorage.setItem("P", res.data.paymentMethodId);
        console.log(res.data.status);
        window.open(res.data.url, "_self");
      }
    }
  };
  changeRiskPlanSubscription = async () => {
    this.setState({ showManageSubscriptionModal: true });
  };
  changePaymentCard = () => {
    this.setState({ showPaymentCardModal: true });
  };
  closePaymentCardModal = () => {
    this.setState({ showPaymentCardModal: false });
  };
  reactivateRiskPlanSubscription = () => {
    // this.props.history.push(`/auth/risk-subscription`);
    this.setState({
      confirmationModal: true,
      confirmationModalHeader: "Reactivate",
      confirmationModalMsg:
        "Your plan is expiring on " +
        formatDate(this.state.riskStatus.planExpiryDate) +
        ". After plan activation, it will roll-over for the next month. Do you want to Reactivate your Risk Plan ?",
      handlePositiveFunctionName: "reactivateSameRiskPlan",
    });
  };
  reactivateSameRiskPlan = async () => {
    this.handleNegativeButton();
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url: endpoint.RISK_SUBSCRIPTION_ACTIVATE,
      method: "PUT",
      authToken: sessionStorage.getItem("token"),
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      // console.log(res.data);
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Information",
        noticeModalErrMsg:
          "You have successfully reactivated your existing plan.",
      });
      this.getRiskPlanInfo();
    }
  };
  validateRiskEmail = () => {
    // Validate if same email already exists
    const riskUser =
      this.state.riskUsers &&
      this.state.riskUsers.filter((userRow) => {
        // console.log(userRow);
        return (
          this.state.inviteRiskEmail.toLowerCase() ===
          userRow.email.toLowerCase()
        );
      });
    if (riskUser.length > 0) {
      this.setState({ inviteRiskEmailState: "error" });
      return false;
    }

    if (
      this.state.inviteRiskEmailState === "success" &&
      this.state.inviteRiskUserRoleState === "success"
    )
      return true;
    if (this.state.inviteRiskEmailState !== "success") {
      this.setState({ inviteRiskEmailState: "error" });
    }
    if (this.state.inviteRiskUserRoleState !== "success") {
      this.setState({ inviteRiskUserRoleState: "error" });
    }
    return false;
  };
  riskInviteUser = async () => {
    if (this.validateRiskEmail()) {
      let data = {
        email: this.state.inviteRiskEmail,
        role: this.state.inviteRiskUserRole,
      };
      this.setState({ callInProgress: true });
      const res = await apiHandler({
        method: "POST",
        url: endpoint.RISK_INVITE_USERS,
        data: data,
        authToken: sessionStorage.getItem("token"),
      });
      this.setState({ callInProgress: false, inviteRiskEmail: "" });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else if (res.data.errorCode === 403) {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg:
              "You do not have the permission to Invite users. Please contact your Admin.",
          });
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: res.data.userDesc,
          });
        }
      } else {
        this.setState(
          {
            noticeModal: true,
            noticeModalHeader: "Success",
            noticeModalErrMsg: "Invitation Email is sent to user",
          },
          () => {
            this.getRiskPlanInfo();
          }
        );
      }
    }
  };
  handleinviteRiskUserRole = (event) => {
    this.setState(
      validate(
        event.target.value,
        "inviteRiskUserRole",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };
  handleRiskToggle = (event) => {
    this.setState({
      confirmationModal: true,
      confirmationModalHeader: "Confirm",
      confirmationModalMsg: event.target.checked
        ? "Are you sure you want to Enable the User"
        : "Are you sure you want to Disable the User",
      handlePositiveFunctionName: "toggleRiskActionConfirm",
      eventId: event.target.id,
    });
  };
  toggleRiskActionConfirm = async () => {
    // console.log("user account enable");
    let id = this.state.eventId;
    let index = id.lastIndexOf("_");
    if (index !== -1) {
      id = id.substring(index + 1, id.length);
    }
    // let enabledState = this.state.enableUserList;
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1,
    });

    let user = this.state.riskUsers.filter((u) => {
      return u.id.toString() === id.toString();
    });
    // if (enabledState[id]) {
    // Deactivate User
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.RISK_CLIENT_USERS_ENABLE_DISABLE,
      authToken: sessionStorage.getItem("token"),
      data: {
        enabled: !user[0].enabled,
        id: id,
      },
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        return;
      }
    } else {
      this.getRiskPlanUserList(this.state.riskStatus);
    }
  };
  getRiskUserRows = () => {
    const fillButtons = (userID, emailAddress, enabled, isRegistered) => {
      return (
        <>
          {isRegistered ? (
            <FormControlLabel
              className={this.props.classes.center}
              classes={{
                root: this.props.classes.checkboxLabelControl,
                label: this.props.classes.checkboxLabel,
              }}
              control={
                <Switch
                  color="primary"
                  tabIndex={-1}
                  id={"checkbox_" + userID}
                  onChange={this.handleRiskToggle}
                  disabled={this.state.viewClient === "true"}
                  checked={enabled}
                />
              }
              label={<div />}
            />
          ) : (
            <a
              rel="noopener noreferrer"
              onClick={() => this.resendRiskInviteLink(emailAddress)}
              style={{ cursor: "pointer" }}
            >
              Resend Link
            </a>
          )}
        </>
      );
    };
    let users = [];
    this.state.riskUsers &&
      this.state.riskUsers.forEach((userRow) => {
        if (userRow.id) {
          // console.log(userRow.id + "   ___    " + userRow.enabled);
          let user = [
            userRow.id,
            userRow.firstName,
            userRow.lastName,
            userRow.email,
            userRow.companyName,
            userRow.phoneNumber,
            userRow.role === "role-prospect-user" ||
            userRow.role === "role-prospect"
              ? "Risk Main User"
              : userRow.role === "role-prospect-invite-user"
              ? "Risk User"
              : "",
            fillButtons(
              userRow.id,
              userRow.email,
              userRow.enabled,
              userRow.firstName && userRow.phoneNumber
            ),
          ];
          users.push(user);
        }
      });
    return users;
  };
  resendRiskInviteLink = async (email) => {
    const userData = {
      email: email,
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_REINVITE_USERS,
      data: userData,
      authToken: sessionStorage.getItem("token"),
    });
    const data = res.data;
    if (data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: data.userDesc,
        });
      }
    } else {
      this.setState({
        callInProgress: false,
        noticeModal: true,
        noticeModalHeader: "Success",
        noticeModalErrMsg: data.message + " to " + data.username,
      });
    }
  };
  /*********************** RISK API ENDS ***********************/
  getCountries = async () => {
    // COUNTRIES
    const res = await apiHandler({
      url: endpoint.COUNTRIES,
      authToken: sessionStorage.getItem("token"),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      const countries = res.data.countryMetaData;
      this.setState({ countries: countries });
    }
  };

  getExistingUserList = async () => {
    const res = await apiHandler({
      url: endpoint.USER_LIST,
      authToken: sessionStorage.getItem("token"),
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
        });
      }
    } else {
      const users = res.data;
      let enabledState = {};
      users &&
        users.customerUsers &&
        users.customerUsers.forEach((user) => {
          enabledState[user.id] = user.enabled;
        });
      this.setState({
        users: users.customerUsers,
        enableUserList: enabledState,
      });
    }
  };

  handleToggle = (event) => {
    this.setState({
      confirmationModal: true,
      confirmationModalHeader: "Confirm",
      confirmationModalMsg: event.target.checked
        ? "Are you sure you want to Enable the User"
        : "Are you sure you want to Disable the User",
      handlePositiveFunctionName: "toggleActionConfirm",
      eventId: event.target.id,
    });
  };

  toggleActionConfirm = async () => {
    // console.log("user account enable");
    let id = this.state.eventId;
    let index = id.lastIndexOf("_");
    if (index !== -1) {
      id = id.substring(index + 1, id.length);
    }
    let enabledState = this.state.enableUserList;

    let user = this.state.users.filter((u) => {
      return u.id.toString() === id.toString();
    });
    if (enabledState[id]) {
      // Deactivate User
      const res = await apiHandler({
        method: "DELETE",
        url: endpoint.USER_DISABLE + user[0].email,
        authToken: sessionStorage.getItem("token"),
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {
          return;
        }
      }
    } else {
      // Activate User
      const res = await apiHandler({
        method: "PUT",
        url: endpoint.USER_ENABLE + user[0].email,
        data: null,
        authToken: sessionStorage.getItem("token"),
      });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {
          return;
        }
      }
    }

    enabledState[id] = !enabledState[id];
    this.setState({
      enableUserList: enabledState,
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1,
    });
  };
  resendInviteLink = async (email) => {
    const userData = {
      email: email,
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.USER_INVITE_SEND,
      data: userData,
      authToken: sessionStorage.getItem("token"),
    });
    const data = res.data;
    if (data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: data.userDesc,
        });
      }
    } else {
      this.setState({
        callInProgress: false,
        noticeModal: true,
        noticeModalHeader: "Success",
        noticeModalErrMsg: data.message + " to " + data.username,
      });
    }
  };
  getUserRows = () => {
    const fillButtons = (userID, userData, isRegistered) => {
      return (
        <>
          {/* <Close
          //onClick={this.handleDeleteDirector.bind(this, prop.color)}
          className={cx(this.props.classes.closeIcon, this.props.classes.icon)}
        /> */}
          <FormControlLabel
            className={this.props.classes.center}
            classes={{
              root: this.props.classes.checkboxLabelControl,
              label: this.props.classes.checkboxLabel,
            }}
            control={
              <Switch
                color="primary"
                tabIndex={-1}
                id={"checkbox_" + userID}
                onChange={this.handleToggle}
                disabled={this.state.viewClient === "true"}
                checked={this.state.enableUserList[userID]}
                // value={this.state.enableUserList[userID]}
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
          {isRegistered ? (
            <Edit
              onClick={this.handleEditUser.bind(this, userData)}
              className={cx(
                this.props.classes.editIcon,
                this.props.classes.icon
              )}
            />
          ) : (
            <a
              rel="noopener noreferrer"
              onClick={() => this.resendInviteLink(userData.emailAddress)}
              style={{ cursor: "pointer" }}
            >
              Resend Link
            </a>
          )}
        </>
      );
    };
    let users = [];
    this.state.users &&
      this.state.users.forEach((userRow) => {
        if (userRow.id) {
          // console.log(userRow.id + "   ___    " + userRow.enabled);
          let user = [
            userRow.id,
            userRow.firstName,
            userRow.lastName,
            userRow.email,
            userRow.companyName,
            userRow.phoneNumber,
            userRow.role === "role-customer-user"
              ? "Customer User"
              : userRow.role === "role-customer-user-manager"
              ? "Customer Manager"
              : "",
            fillButtons(
              userRow.id,
              {
                id: userRow.id,
                name: userRow.firstName + " " + userRow.lastName,
                emailAddress: userRow.email,
                phoneNumber: userRow.phoneNumber,
                inviteUserRole: userRow.role,
              },
              userRow.firstName && userRow.phoneNumber
            ),
          ];
          users.push(user);
        }
      });
    return users;
  };

  change = (event, stateName, rules) => {
    console.log("Change");
    let value = event.target.value;
    console.log("Validated");
    if (stateName === "phoneNumber") {
      value = value.replace(/-/g, "").trim();
      if (value.length > 10) {
        value = value.substring(1, value.length);
      }
    }

    this.setState(validate(value, stateName, this.state, rules, this.error));
  };

  compareNewPasswordConfirm = () => {
    const { newPassword, confirmNewPassword } = this.state;

    if (newPassword !== confirmNewPassword) {
      this.setState({
        confirmNewPassword: "",
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: "Confirm Password is not matching New Password.",
      });
    }
  };

  saveUser = async () => {
    const userData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      companyName: this.state.companyName,
      phoneNumber:
        this.state.countryCode + this.state.phone,
      username: this.state.email,
      currentPassword:
        this.state.currentPassword !== "" ? this.state.currentPassword : null,
      newPassword:
        this.state.newPassword !== "" ? this.state.newPassword : null,
    };

    console.log(userData, this.isValidated() && this.validatePassword());

    if (this.isValidated() && this.validatePassword()) {
      this.setState({ callInProgress: true });
      const res = await apiHandler({
        method: "POST",
        url: endpoint.USER_INFO_UPDATE,
        data: userData,
        authToken: sessionStorage.getItem("token"),
      });

      let stateVal = { callInProgress: false, noticeModal: true };

      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {
          let errMsg = "Error occured while editing details";
          if (this.state.newPassword !== "") {
            errMsg =
              "There is some error in updating Password. Please check if current password is correct";
          } else {
            errMsg = "Error occured while editing details";
          }
          stateVal = {
            ...stateVal,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            noticeModalHeader: "Error",
            noticeModalErrMsg: errMsg,
          };
        }
      } else {
        if (this.state.newPassword !== "") {
          stateVal = {
            ...stateVal,
            passwordChange: true,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            noticeModalHeader: "Success",
            noticeModalErrMsg: "Password has been changed. Please login again.",
          };
        } else {
          registerToken();
          stateVal = {
            ...stateVal,
            passwordChange: false,
            noticeModalHeader: "Success",
            noticeModalErrMsg: "User Details updated successfully",
          };
        }
      }

      this.setState(stateVal);
    }
  };
  saveUserRole = async (userData) => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.USER_ROLE_UPDATE,
      data: userData,
      authToken: sessionStorage.getItem("token"),
    });
    const data = res.data;

    let stateVal = { callInProgress: false, showEditUser: false };

    if (data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
      } else {
        let errMsg = "Error occured while editing details";
        if (this.state.newPassword !== "") {
          errMsg =
            "There is some error in updating Password. Please check if current password is correct";
        } else {
          errMsg = "Error occured while editing details";
        }
        stateVal = {
          ...stateVal,
          noticeModalHeader: "Error",
          noticeModalErrMsg: errMsg,
        };
      }
    } else {
      this.getExistingUserList();
    }
    this.setState(stateVal);
  };
  validatePassword = () => {
    if (this.state.newPassword === "") return true;

    let states = {};
    if (this.state.currentPasswordState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.currentPassword,
          "currentPassword",
          this.state,
          this.rulesList.currentPassword,
          this.error
        ),
      };
    }
    if (this.state.newPasswordState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.newPassword,
          "newPassword",
          this.state,
          this.rulesList.newPassword,
          this.error
        ),
      };
    }
    if (this.state.confirmNewPasswordState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.confirmNewPassword,
          "confirmNewPassword",
          this.state,
          this.rulesList.confirmNewPassword,
          this.error
        ),
      };
    }

    this.setState(states);

    states = { ...this.state, ...states };
    if (
      states.currentPasswordState === "success" &&
      states.newPasswordState === "success" &&
      states.confirmNewPasswordState === "success"
    ) {
      return true;
    } else {
      return false;
    }
  };
  isValidated = () => {
    let states = {};
    if (this.state.firstNameState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.firstName,
          "firstName",
          this.state,
          this.rulesList.firstName,
          this.error
        ),
      };
    }
    if (this.state.lastNameState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.lastName,
          "lastName",
          this.state,
          this.rulesList.lastName,
          this.error
        ),
      };
    }
    if (this.state.emailState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.email,
          "email",
          this.state,
          this.rulesList.email,
          this.error
        ),
      };
    }
    if (this.state.phoneState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.phone,
          "phone",
          this.state,
          this.rulesList.phone,
          this.error
        ),
      };
    }
    if (this.state.companyNameState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.companyName,
          "companyName",
          this.state,
          this.rulesList.companyName,
          this.error
        ),
      };
    }
    if (this.state.countryCodeState !== "success") {
      states = {
        ...states,
        ...validate(
          this.state.countryCode,
          "countryCode",
          this.state,
          this.rulesList.country,
          this.error
        ),
      };
    }

    this.setState(states);

    states = { ...this.state, ...states };
    if (
      states.firstNameState === "success" &&
      states.lastNameState === "success" &&
      states.emailState === "success" &&
      states.phoneState === "success" &&
      states.companyNameState === "success" &&
      states.countryCodeState === "success"
    ) {
      return true;
    } else {
      return false;
    }
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };
  upgradePlan = async (planInfo) => {
    if (this.state.role === "role-prospect") {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "FXGuard",
        noticeModalErrMsg:
          "You cannot upgrade the plan in the Demo mode. In Live mode, the Plan can be updated.",
      });
      return;
    }

    let uplanInfo = {
      customerId: this.state.customerId,
      customerName: this.state.companyName,
      ...planInfo,
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.USER_PLAN_UPDATE,
      data: uplanInfo,
      authToken: sessionStorage.getItem("token"),
    });
    // console.log(uplanInfo);
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg:
            "You do not have the permission to UPGRADE. Please contact your Admin.",
        });
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
      return;
    } else {
      this.setState(
        {
          noticeModal: true,
          noticeModalHeader: "Success",
          noticeModalErrMsg: "Your Plan is upgraded.",
        },
        () => {
          this.getUserInfo();
        }
      );
    }
  };

  closePlanModal = () => {
    this.setState({ showPlanUpgradeDialog: false });
  };
  closeUserEditModal = () => {
    this.setState({ showEditUser: false, userData: null });
  };

  handleClose = () => {
    this.setState({ noticeModalErrMsg: "" });
    this.setState({ noticeModal: false });
    if (this.state.passwordChange) {
      this.setState({ initiateLogout: true });
      // Logout();
    }
  };

  handleSimple = (event) => {
    this.setState({ countryCode: event.target.value });
    this.change(event, "countryCode", [{ type: "required" }]);
  };

  handleEditUser = (userData) => {
    this.setState(() => {
      return { showEditUser: true, userData: userData };
    });
    // this.setState(state => {
    //   return {
    //     showAddDirector: true,
    //     editDirector: state.directors.filter(director => director.id === id)[0]
    //   };
    // });
  };

  handleUpgradePlanClick = async () => {
    if (this.state.role === "role-prospect") {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "FXGuard",
        noticeModalErrMsg:
          "You cannot upgrade the plan in the Demo mode. In Live mode, the Plan can be updated.",
      });
      return;
    }
    const res = await apiHandler({
      url:
        endpoint.PLAN_UPGRADE +
        "?subscribedPlanId=" +
        this.state.subscribedPlanId,
      authToken: sessionStorage.getItem("token"),
    });

    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      this.getPlanVolumeOptions(res.data.plans);
    }
  };
  getPlanVolumeOptions = async (planOptions) => {
    if (planOptions.length > 0) {
      const planId = planOptions[0].id;
      const res = await apiHandler({
        url:
          endpoint.PLAN_FIND +
          "?id=" +
          planId +
          "&customerId=" +
          this.state.customerId,
        authToken: sessionStorage.getItem("token"),
      });
      this.setState({ callInProgress: false });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: res.data.userDesc,
          });
        }
      } else {
        this.setState({
          showPlanUpgradeDialog: true,
          planOptions: planOptions[0],
          volumeOptions: res.data.volumes,
        });
      }
    } else {
      // No plan to upgrade
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: "No Plan is available to upgrade",
      });
    }
  };
  validateEmail = () => {
    if (
      this.state.inviteEmailState === "success" &&
      this.state.inviteUserRoleState === "success"
    )
      return true;
    if (this.state.inviteEmailState !== "success") {
      this.setState({ inviteEmailState: "error" });
    }
    if (this.state.inviteUserRoleState !== "success") {
      this.setState({ inviteUserRoleState: "error" });
    }
    return false;
  };
  inviteUser = async () => {
    if (this.validateEmail()) {
      let data = {
        email: this.state.inviteEmail,
        role: this.state.inviteUserRole,
      };
      this.setState({ callInProgress: true });
      const res = await apiHandler({
        method: "POST",
        url: endpoint.ADMIN_CUSTOMER_USER_RESGISTER,
        data: data,
        authToken: sessionStorage.getItem("token"),
      });
      this.setState({ callInProgress: false, inviteEmail: "" });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else if (res.data.errorCode === 403) {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg:
              "You do not have the permission to Invite users. Please contact your Admin.",
          });
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: res.data.userDesc,
          });
        }
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Success",
          noticeModalErrMsg: "Invitation Email is sent to user",
        });
      }
    }
  };
  handleInviteUserRole = (event) => {
    this.setState(
      validate(
        event.target.value,
        "inviteUserRole",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };

  render() {
    const { classes } = this.props;
    let phonenumber = this.state.phoneNumber;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10} lg={10}>
            <h4>
              <b>Manage Account</b>
            </h4>
          </GridItem>
          <GridItem xs={12} sm={12} md={11} lg={11}>
            <GridContainer>
              <Card>
                <CardHeader color="warning" text>
                  <CardText color="warning">
                    <Work className={classes.listItemIcon} />
                  </CardText>
                  <span className={classes.title}> User Information </span>
                </CardHeader>
                <CardBody>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <form className={classes.form}>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomInput
                            success={this.state.firstNameState === "success"}
                            error={this.state.firstNameState === "error"}
                            helpText={
                              this.state.firstNameState === "error" &&
                              this.state.firstNameErrorMsg[0]
                            }
                            labelText="First Name*"
                            id="ma_firstName"
                            // inputProps={{
                            //   value: this.state.firstName,
                            //   onChange: this.handleChange
                            // }}
                            inputProps={{
                              value: this.state.firstName,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChange("firstName", event),
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({
                                  firstNamePristine: false,
                                });
                                this.change(event, "firstName", [
                                  { type: "required" },
                                  {
                                    type: "length",
                                    params: {
                                      min: 1,
                                      max: 100,
                                    },
                                  },
                                ]);
                              },
                              onChange: (event) => {
                                if (!this.state.firstNamePristine) {
                                  this.setState({
                                    firstNamePristine: false,
                                  });
                                  this.change(event, "firstName", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 100,
                                      },
                                    },
                                  ]);
                                }
                              },
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomInput
                            success={this.state.lastNameState === "success"}
                            error={this.state.lastNameState === "error"}
                            helpText={
                              this.state.lastNameState === "error" &&
                              this.state.lastNameErrorMsg[0]
                            }
                            labelText="Last Name"
                            id="ma_lastName"
                            // inputProps={{
                            //   value: this.state.lastName,
                            //   onChange: this.handleChange
                            // }}
                            inputProps={{
                              value: this.state.lastName,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChange("lastName", event),
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({
                                  lastNamePristine: false,
                                });
                                this.change(event, "lastName", [
                                  { type: "required" },
                                  {
                                    type: "length",
                                    params: {
                                      min: 1,
                                      max: 100,
                                    },
                                  },
                                ]);
                              },
                              onChange: (event) => {
                                if (!this.state.lastNamePristine) {
                                  this.setState({
                                    lastNamePristine: false,
                                  });
                                  this.change(event, "lastName", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 100,
                                      },
                                    },
                                  ]);
                                }
                              },
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomInput
                            success={this.state.companyNameState === "success"}
                            error={this.state.companyNameState === "error"}
                            helpText={
                              this.state.companyNameState === "error" &&
                              this.state.companyNameErrorMsg[0]
                            }
                            labelText="Company Co."
                            id="ma_companyName"
                            // inputProps={{
                            //   value: this.state.firstName,
                            //   onChange: this.handleChange
                            // }}
                            inputProps={{
                              value: this.state.companyName,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChange("companyName", event),
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({
                                  companyNamePristine: false,
                                });
                                this.change(event, "companyName", [
                                  { type: "required" },
                                  {
                                    type: "length",
                                    params: {
                                      min: 1,
                                      max: 100,
                                    },
                                  },
                                ]);
                              },
                              onChange: (event) => {
                                if (!this.state.companyNamePristine) {
                                  this.setState({
                                    companyNamePristine: false,
                                  });
                                  this.change(event, "companyName", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 100,
                                      },
                                    },
                                  ]);
                                }
                              },
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomInput
                            success={this.state.emailAddressState === "success"}
                            error={this.state.emailAddressState === "error"}
                            helpText={
                              this.state.emailAddressState === "error" &&
                              this.state.emailAddressErrorMsg[0]
                            }
                            labelText="Email Address*"
                            id="ma_email"
                            inputProps={{
                              value: this.state.email,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChange("email", event),
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({
                                  emailAddressPristine: false,
                                });
                                this.change(event, "email", [
                                  { type: "required" },
                                  { type: "email" },
                                ]);
                              },
                              onChange: (event) => {
                                if (!this.state.emailAddressPristine) {
                                  this.setState({
                                    emailAddressPristine: false,
                                  });
                                  this.change(event, "email", [
                                    { type: "required" },
                                    { type: "email" },
                                  ]);
                                }
                              },
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3} lg={3}>
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                          >
                            <InputLabel
                              htmlFor="type"
                              className={classes.selectLabel}
                            >
                              Country Code*
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu,
                              }}
                              classes={{
                                select: classes.select,
                              }}
                              value={this.state.countryCode}
                              onChange={this.handleSimple}
                              inputProps={{
                                name: "countryCode",
                                id: "countryCode",
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem,
                                }}
                              >
                                Choose Country
                              </MenuItem>
                              {this.state.countries.map((item) => (
                                <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected,
                                  }}
                                  value={item.callingCodes[0]}
                                  key={item.callingCodes[0]}
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
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          {/* <CustomInput
                              success={this.state.phoneNumberState === 'success'}
                              error={this.state.phoneNumberState === 'error'}
                              helpText={this.state.phoneNumberState === 'error' && this.state.phoneNumberErrorMsg[0]}
                              id="ma_phoneNumber"
                              labelText="Phone Number*"
                              // format="##########"
                              // value={phonenumber}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  this.setState({ phoneNumberPristine: false });
                                  this.change(event, 'phoneNumber', [{ type: 'required' }]);
                                },
                                onChange: (event) => {
                                  if(!/^[0-9]*$/.test(event.target.value))
                                  {
                                    event.target.value = event.target.value.replace(/\D/g, '');
                                  }
                                  if (!this.state.phoneNumberPristine) {
                                    console.log("changed");
                                    this.setState({
                                      phoneNumberPristine: false,
                                      phoneNumber: event.target.value
                                    });
                                    this.change(event, 'phoneNumber', [{ type: 'required' }]);
                                  }
                                },
                              }}
                            /> */}
                          <TextField
                            id="standard-number"
                            error={!this.state.phone}
                            helperText={!this.state.phone && "Cannot be Empty"}
                            label="Phone Number"
                            type="number"
                            variant="standard"
                            required
                            value={this.state.phone}
                            onChange={(event) => {
                              console.log(event.target.value);
                              // setPhone(event.target.value);
                              this.setState({phone:event.target.value})
                            }}
                          />
                          {/* <CustomInput
                              success={this.state.phoneNumber === "success"}
                              error={this.state.phoneNumber === "error"}
                              helpText={
                                this.state.phoneNumberState === "error" &&
                                this.state.phoneNumberErrorMsg[0]
                              }
                              labelText="Phone Number*"
                              id="ma_phoneNumber"
                              inputProps={{
                                value: this.state.phoneNumber,
                                onChange: event =>
                                  this.handleChange("phoneNumber", event)
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: event => {
                                  this.setState({ phoneNumberPristine: false });
                                  this.change(event, "phoneNumber", [
                                    { type: "required" },
                                    { type: "phone" }
                                  ]);
                                },
                                onChange: event => {
                                  if (!this.state.phoneNumberPristine) {
                                    this.setState({
                                      phoneNumberPristine: false
                                    });
                                    this.change(event, "phoneNumber", [
                                      { type: "required" },
                                      { type: "phone" }
                                    ]);
                                  }
                                }
                              }}
                            /> */}
                        </GridItem>
                        {this.state.viewClient !== "true" && (
                          <>
                            <GridItem
                              xs={10}
                              sm={10}
                              md={12}
                              lg={12}
                              className={classes.alignPadding}
                            >
                              Change Password
                            </GridItem>
                            <GridItem
                              xs={10}
                              sm={10}
                              md={4}
                              lg={4}
                              className={classes.alignPadding}
                            >
                              <CustomInput
                                success={
                                  this.state.currentPasswordState === "success"
                                }
                                error={
                                  this.state.currentPasswordState === "error"
                                }
                                helpText={
                                  this.state.currentPasswordState === "error" &&
                                  this.state.currentPasswordErrorMsg[0]
                                }
                                labelText="Current Password*"
                                id="ma_currentPassword"
                                inputProps={{
                                  value: this.state.currentPassword,
                                  type: "password",
                                  autoComplete: "off",
                                  onChange: (event) =>
                                    this.handleChange("currentPassword", event),
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({
                                      currentPasswordPristine: false,
                                    });
                                    this.change(event, "currentPassword", [
                                      { type: "required" },
                                    ]);
                                  },
                                  onChange: (event) => {
                                    if (!this.state.currentPasswordPristine) {
                                      this.setState({
                                        currentPasswordPristine: false,
                                      });
                                      this.change(event, "currentPassword", [
                                        { type: "required" },
                                      ]);
                                    }
                                  },
                                }}
                              />
                            </GridItem>
                            <GridItem
                              xs={10}
                              sm={10}
                              md={4}
                              lg={4}
                              className={classes.alignPadding}
                            >
                              <CustomInput
                                success={
                                  this.state.newPasswordState === "success"
                                }
                                error={this.state.newPasswordState === "error"}
                                helpText={
                                  this.state.newPasswordState === "error" &&
                                  this.state.newPasswordErrorMsg[0]
                                }
                                labelText="New Password*"
                                id="ma_newPassword"
                                inputProps={{
                                  value: this.state.newPassword,
                                  autoComplete: "off",
                                  type: "password",
                                  onChange: (event) =>
                                    this.handleChange("newPassword", event),
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({
                                      newPasswordPristine: false,
                                    });
                                    this.change(event, "newPassword", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 8,
                                          max: 16,
                                        },
                                      },
                                      { type: "password" },
                                    ]);
                                  },
                                  onChange: (event) => {
                                    if (!this.state.newPasswordPristine) {
                                      this.setState({
                                        newPasswordPristine: false,
                                      });
                                      this.change(event, "newPassword", [
                                        { type: "required" },
                                        {
                                          type: "length",
                                          params: {
                                            min: 8,
                                            max: 16,
                                          },
                                        },
                                        { type: "password" },
                                      ]);
                                    }
                                  },
                                }}
                              />
                            </GridItem>
                            <GridItem
                              xs={10}
                              sm={10}
                              md={4}
                              lg={4}
                              className={classes.alignPadding}
                            >
                              <CustomInput
                                success={
                                  this.state.confirmNewPasswordState ===
                                  "success"
                                }
                                error={
                                  this.state.confirmNewPasswordState === "error"
                                }
                                helpText={
                                  this.state.confirmNewPasswordState ===
                                    "error" &&
                                  this.state.confirmNewPasswordErrorMsg[0]
                                }
                                labelText="New Password Confirmation*"
                                id="ma_confirmNewPassword"
                                inputProps={{
                                  value: this.state.confirmNewPassword,
                                  type: "password",
                                  onChange: (event) =>
                                    this.handleChange(
                                      "confirmNewPassword",
                                      event
                                    ),
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({
                                      confirmNewPasswordPristine: false,
                                    });
                                    this.change(event, "confirmNewPassword", [
                                      { type: "required" },
                                      {
                                        type: "matchPassword",
                                        params: this.state.newPassword,
                                      },
                                      {
                                        type: "length",
                                        params: {
                                          min: 8,
                                          max: 16,
                                        },
                                      },
                                      { type: "password" },
                                    ]);
                                    this.compareNewPasswordConfirm();
                                  },
                                  onChange: (event) => {
                                    if (
                                      !this.state.confirmNewPasswordPristine
                                    ) {
                                      this.setState({
                                        confirmNewPasswordPristine: false,
                                      });
                                      this.change(event, "confirmNewPassword", [
                                        { type: "required" },
                                        {
                                          type: "matchPassword",
                                          params: this.state.newPassword,
                                        },
                                        {
                                          type: "length",
                                          params: {
                                            min: 8,
                                            max: 16,
                                          },
                                        },
                                        { type: "password" },
                                      ]);
                                    }
                                  },
                                }}
                              />
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
                                  onClick={() => this.saveUser()}
                                >
                                  SAVE
                                </Button>
                              </div>
                            </GridItem>
                          </>
                        )}
                      </GridContainer>
                    </form>
                  </GridItem>
                </CardBody>
              </Card>
            </GridContainer>
          </GridItem>
          {(sessionStorage.getItem("module") === "BOTH" ||
            sessionStorage.getItem("module") === "TRANSACTION") && (
            <GridItem xs={12} sm={12} md={11} lg={11}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={10} lg={10}>
                  <h4>
                    <b>Manage Transactional Plan</b>
                  </h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={4} lg={4}>
                  <Card>
                    <CardHeader color="warning" text>
                      <CardText color="warning">
                        <Work className={classes.listItemIcon} />
                      </CardText>
                      <span className={classes.title}>Account Information</span>
                    </CardHeader>
                    <CardBody>
                      <h4>
                        <strong>
                          {"You are on "}
                          {this.state.subscribedPlanName}
                        </strong>
                      </h4>
                      {this.state.subscribedPlanId === 1 && (
                        <>
                          <h5>Fee for each Trade applies</h5>
                          <p>
                            Eliminate extra fees on your operation by joining
                            our subscription plan
                          </p>
                        </>
                      )}
                      {this.state.subscribedPlanId === 2 && (
                        <>
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>Volume</span>
                            <span>{this.state.volumeDesc}</span>
                          </div>
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>
                              Plan Start Date
                            </span>
                            <span>
                              {formatDate(this.state.subscriptionPlanStartDate)}
                            </span>
                          </div>
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>
                              Plan End Date
                            </span>
                            <span>
                              {formatDate(
                                this.state.subscriptionPlanExpiryDate
                              )}
                            </span>
                          </div>
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>
                              Limit Consumed
                            </span>
                            <span>
                              {(
                                (+this.state.volumeLimitUsed /
                                  +this.state.volume) *
                                100
                              ).toFixed(2)}
                              {""}
                              {"%"}
                            </span>
                          </div>
                        </>
                      )}

                      <Button
                        size="lg"
                        disabled={this.state.viewClient === "true"}
                        style={{
                          backgroundColor: primaryColor[5],
                          width: "100%",
                          marginTop: 30,
                        }}
                        onClick={this.handleUpgradePlanClick}
                      >
                        UPGRADE
                      </Button>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={8} lg={8}>
                  {(this.state.status === "approved" ||
                    this.state.viewClient === "true") && (
                    <Card>
                      <CardHeader color="warning" text>
                        <CardText color="warning">
                          <Work className={classes.listItemIcon} />
                        </CardText>
                        <span className={classes.title}>
                          {" "}
                          Transaction Management Users{" "}
                        </span>
                      </CardHeader>
                      <CardBody>
                        <div style={{ textAlign: "right" }}>
                          {this.state.status === "approved" && (
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                              <GridContainer justify="flex-end">
                                <span style={{ marginTop: 15 }}>
                                  Invite User
                                </span>
                                <GridItem xs={12} sm={12} md={6} lg={4}>
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
                                    id="ma_inviteEmail"
                                    inputProps={{
                                      value: this.state.inviteEmail,
                                      onChange: (event) =>
                                        this.handleChange("inviteEmail", event),
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className: classes.filterInput,
                                      onBlur: (event) => {
                                        this.setState({
                                          inviteEmailPristine: false,
                                        });
                                        this.change(event, "inviteEmail", [
                                          { type: "required" },
                                          { type: "email" },
                                        ]);
                                      },
                                      onChange: (event) => {
                                        if (!this.state.inviteEmailPristine) {
                                          this.setState({
                                            inviteEmailPristine: false,
                                          });
                                          this.change(event, "inviteEmail", [
                                            { type: "required" },
                                            { type: "email" },
                                          ]);
                                        }
                                      },
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4} lg={4}>
                                  <FormControl
                                    fullWidth
                                    className={classes.filledSelect}
                                    style={{ marginTop: -25 }}
                                  >
                                    <FormHelperText
                                      className={classes.selectFormHelperText}
                                    >
                                      Role
                                    </FormHelperText>
                                    <Select
                                      MenuProps={{
                                        className: classes.selectMenu,
                                      }}
                                      classes={{
                                        select: classes.select,
                                      }}
                                      value={this.state.inviteUserRole}
                                      onChange={this.handleInviteUserRole}
                                      inputProps={{
                                        name: "inviteUserRole",
                                        id: "inviteUserRole",
                                      }}
                                    >
                                      <MenuItem
                                        disabled
                                        classes={{
                                          root: classes.selectMenuItem,
                                        }}
                                      >
                                        Choose Role
                                      </MenuItem>
                                      <MenuItem
                                        classes={{
                                          root: classes.selectMenuItem,
                                          selected:
                                            classes.selectMenuItemSelected,
                                        }}
                                        value="role-customer-user-manager"
                                      >
                                        Customer Manager
                                      </MenuItem>
                                      <MenuItem
                                        classes={{
                                          root: classes.selectMenuItem,
                                          selected:
                                            classes.selectMenuItemSelected,
                                        }}
                                        value="role-customer-user"
                                      >
                                        Customer User
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
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
                          )}
                        </div>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <Table
                            tableHead={[
                              "First Name",
                              "Last Name",
                              "E-mail",
                              "Company Name",
                              "Phone Number",
                              "Actions",
                            ]}
                            tableData={this.getUserRows()}
                            customCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right,
                            ]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right,
                            ]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{ textAlign: "center" }}
                        >
                          <EditUsers
                            handleClose={this.closeUserEditModal}
                            showModal={this.state.showEditUser}
                            saveUserRole={this.saveUserRole}
                            userData={this.state.userData}
                          />
                        </GridItem>
                      </CardBody>
                    </Card>
                  )}
                </GridItem>
              </GridContainer>
            </GridItem>
          )}
          {(sessionStorage.getItem("module") === "BOTH" ||
            sessionStorage.getItem("module") === "RISKS") && (
            <GridItem xs={12} sm={12} md={11} lg={11}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={10} lg={10}>
                  <h4>
                    <b>Manage Risk Plan</b>
                  </h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={4} lg={4}>
                  <Card>
                    <CardHeader color="warning" text>
                      <CardText color="warning">
                        <Work className={classes.listItemIcon} />
                      </CardText>
                      <span className={classes.title}>
                        FX RISK MANAGEMENT PLAN
                      </span>
                    </CardHeader>
                    <CardBody>
                      {this.state.riskStatus && (
                        <>
                          <h4>
                            <strong>
                              {"Your selected FX Risk Management Plan"}
                            </strong>
                          </h4>
                          {this.state.riskStatus.description &&
                            this.state.riskStatus.description
                              .split("\r\n")
                              .map((d, i) => <p key={i}>{d}</p>)}
                          <>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Max Users
                              </span>
                              <span>
                                {this.state.riskStatus.maxUserAllowed}
                              </span>
                            </div>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Currency
                              </span>
                              <span>{this.state.riskStatus.currency}</span>
                            </div>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Plan Start Date
                              </span>
                              <span>
                                {formatDate(
                                  this.state.riskStatus.planStartDate
                                )}
                              </span>
                            </div>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Plan End Date
                              </span>
                              <span>
                                {formatDate(
                                  this.state.riskStatus.planExpiryDate
                                )}
                              </span>
                            </div>
                            {this.state.riskStatus.cardDetailExists && (
                              <>
                                <div className={classes.detailsRow}>
                                  <span className={classes.floatLeft}>
                                    Frequency
                                  </span>
                                  <span>
                                    {this.state.riskStatus.planFrequency}
                                  </span>
                                </div>
                                {(this.state.role === "role-prospect-user" ||
                                  this.state.role === "role-prospect" ||
                                  (sessionStorage.getItem("ht") &&
                                    this.state.role ===
                                      "role-customer-manager")) && (
                                  <>
                                    <div className={classes.detailsRow}>
                                      <span className={classes.floatLeft}>
                                        Card last 4 digits
                                      </span>
                                      <span>
                                        {this.state.riskStatus.last4Digit}
                                      </span>
                                    </div>
                                    <div className={classes.detailsRow}>
                                      <span className={classes.floatLeft}>
                                        Card Expiry (MM-YYYY)
                                      </span>
                                      <span>
                                        {this.state.riskStatus.expMonth +
                                          " - " +
                                          this.state.riskStatus.expYear}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </>
                          {(this.state.role === "role-prospect-user" ||
                            this.state.role === "role-prospect" ||
                            (sessionStorage.getItem("ht") &&
                              this.state.role === "role-customer-manager")) && (
                            <>
                              {this.state.riskStatus.subsCancelled ? (
                                <Button
                                  size="lg"
                                  disabled={this.state.viewClient === "true"}
                                  style={{
                                    backgroundColor: primaryColor[5],
                                    width: "100%",
                                    marginTop: 30,
                                  }}
                                  onClick={() =>
                                    this.reactivateRiskPlanSubscription()
                                  }
                                >
                                  Reactivate Plan
                                </Button>
                              ) : (
                                <div style={{ display: "flex" }}>
                                  {this.state.riskStatus.cardDetailExists && (
                                    <Button
                                      size="lg"
                                      disabled={
                                        this.state.viewClient === "true"
                                      }
                                      style={{
                                        backgroundColor: primaryColor[5],
                                        width: "100%",
                                        marginTop: 30,
                                        padding: "0.85rem 0.75rem",
                                      }}
                                      onClick={() =>
                                        this.changeRiskPlanSubscription()
                                      }
                                    >
                                      CHANGE PLAN
                                    </Button>
                                  )}
                                  {this.state.riskStatus.cardDetailExists ? (
                                    <Button
                                      size="lg"
                                      disabled={
                                        this.state.viewClient === "true"
                                      }
                                      style={{
                                        backgroundColor: primaryColor[5],
                                        width: "100%",
                                        marginTop: 30,
                                        padding: "0.85rem 0.75rem",
                                      }}
                                      onClick={() => this.changePaymentCard()}
                                    >
                                      CHANGE PAYMENT CARD
                                    </Button>
                                  ) : (
                                    <Button
                                      size="lg"
                                      disabled={
                                        this.state.viewClient === "true"
                                      }
                                      style={{
                                        backgroundColor: primaryColor[5],
                                        width: "100%",
                                        marginTop: 30,
                                        padding: "0.85rem 0.75rem",
                                      }}
                                      onClick={() => this.changePaymentCard()}
                                    >
                                      ADD PAYMENT CARD
                                    </Button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={8} lg={8}>
                  {(this.state.role === "role-prospect" ||
                    this.state.role === "role-prospect-user" ||
                    (sessionStorage.getItem("ht") &&
                      this.state.role === "role-customer-manager")) && (
                    <Card>
                      <CardHeader color="warning" text>
                        <CardText color="warning">
                          <Work className={classes.listItemIcon} />
                        </CardText>
                        <span className={classes.title}>
                          {" "}
                          Risk Management Users{" "}
                        </span>
                      </CardHeader>
                      <CardBody>
                        <div style={{ textAlign: "right" }}>
                          {(this.state.role === "role-prospect" ||
                            this.state.role === "role-prospect-user" ||
                            (sessionStorage.getItem("ht") &&
                              this.state.role === "role-customer-manager")) &&
                            this.state.canInviteUsers && (
                              <GridItem xs={12} sm={12} md={12} lg={12}>
                                <GridContainer justify="flex-end">
                                  <span style={{ marginTop: 15 }}>
                                    Invite User
                                  </span>
                                  <GridItem xs={12} sm={12} md={6} lg={4}>
                                    <CustomInput
                                      success={
                                        this.state.inviteRiskEmailState ===
                                        "success"
                                      }
                                      error={
                                        this.state.inviteRiskEmailState ===
                                        "error"
                                      }
                                      helpText={
                                        this.state.inviteRiskEmailState ===
                                          "error" &&
                                        this.state.inviteRiskEmailErrorMsg[0]
                                      }
                                      labelText="Email address"
                                      id="ma_inviteRiskEmail"
                                      inputProps={{
                                        value: this.state.inviteRiskEmail,
                                        onChange: (event) =>
                                          this.handleChange(
                                            "inviteRiskEmail",
                                            event
                                          ),
                                      }}
                                      formControlProps={{
                                        fullWidth: true,
                                        className: classes.filterInput,
                                        onBlur: (event) => {
                                          this.setState({
                                            inviteRiskEmailPristine: false,
                                          });
                                          this.change(
                                            event,
                                            "inviteRiskEmail",
                                            [
                                              { type: "required" },
                                              { type: "email" },
                                            ]
                                          );
                                        },
                                        onChange: (event) => {
                                          if (
                                            !this.state.inviteRiskEmailPristine
                                          ) {
                                            this.setState({
                                              inviteRiskEmailPristine: false,
                                            });
                                            this.change(
                                              event,
                                              "inviteRiskEmail",
                                              [
                                                { type: "required" },
                                                { type: "email" },
                                              ]
                                            );
                                          }
                                        },
                                      }}
                                    />
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={4} lg={4}>
                                    <FormControl
                                      fullWidth
                                      className={classes.filledSelect}
                                      style={{ marginTop: -25 }}
                                    >
                                      <FormHelperText
                                        className={classes.selectFormHelperText}
                                      >
                                        Role
                                      </FormHelperText>
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu,
                                        }}
                                        classes={{
                                          select: classes.select,
                                        }}
                                        value={this.state.inviteRiskUserRole}
                                        onChange={this.handleinviteRiskUserRole}
                                        inputProps={{
                                          name: "inviteRiskUserRole",
                                          id: "inviteRiskUserRole",
                                        }}
                                      >
                                        <MenuItem
                                          disabled
                                          classes={{
                                            root: classes.selectMenuItem,
                                          }}
                                        >
                                          Choose Role
                                        </MenuItem>
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected:
                                              classes.selectMenuItemSelected,
                                          }}
                                          value="role-prospect-invite-user"
                                        >
                                          Risk User
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem xs={12} sm={12} md={12} lg={2}>
                                    <Button
                                      round={false}
                                      color="info"
                                      size="md"
                                      style={{ lineHeight: "10px" }}
                                      onClick={this.riskInviteUser.bind(this)}
                                    >
                                      invite
                                    </Button>
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                            )}
                        </div>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <Table
                            tableHead={[
                              "First Name",
                              "Last Name",
                              "E-mail",
                              "Company Name",
                              "Phone Number",
                              "Actions",
                            ]}
                            tableData={this.getRiskUserRows()}
                            customCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right,
                            ]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right,
                            ]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{ textAlign: "center" }}
                        >
                          <EditUsers
                            handleClose={this.closeUserEditModal}
                            showModal={this.state.showEditUser}
                            saveUserRole={this.saveUserRole}
                            userData={this.state.userData}
                          />
                        </GridItem>
                      </CardBody>
                    </Card>
                  )}
                </GridItem>
              </GridContainer>
            </GridItem>
          )}
          <GridItem xs={12} sm={12} md={7} lg={7}>
            <UpgradeUserSubscriptionPlan
              showModal={this.state.showPlanUpgradeDialog}
              closeModal={this.closePlanModal}
              planOptions={this.state.planOptions}
              volumeOptions={this.state.volumeOptions}
              countries={this.state.countries}
              upgradePlan={this.upgradePlan}
            />
            {this.state.initiateLogout && <Logout state="Password" />}
          </GridItem>
        </GridContainer>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal,
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
            <h4 className={classes.modalTitle}>
              {this.state.noticeModalHeader}
            </h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <p>
              {this.state.noticeModalErrMsg === ""
                ? "Please click the 'commercial terms & conditions' to submit"
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
        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            open={this.state.callInProgress}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle
              id="waiting-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <h4 className={classes.modalTitle}>{"Processing..."}</h4>
            </DialogTitle>
            <DialogContent
              id="waiting-modal-slide-description"
              className={classes.modalBody}
              style={{ textAlign: "center" }}
            >
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}
        {this.state.showManageSubscriptionModal && (
          <ManageSubscription
            showModal={this.state.showManageSubscriptionModal}
            closeModal={this.closeManageSubscriptionModal}
            planDetails={this.state.riskStatus}
          />
        )}
        {this.state.showPaymentCardModal && (
          <ManageSubscriptionCard
            showModal={this.state.showPaymentCardModal}
            closeModal={this.closeManageSubscriptionModal}
            records={this.state.riskStatus}
            updateRecord={this.updateCardDetails}
          />
        )}
        <ConfirmationModal
          confirmationModal={this.state.confirmationModal}
          confirmationModalHeader={this.state.confirmationModalHeader}
          confirmationModalMsg={this.state.confirmationModalMsg}
          handleNegativeButton={this.handleNegativeButton}
          handlePositiveButton={this[this.state.handlePositiveFunctionName]}
        />
      </>
    );
  }
}

ManageAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ManageAccount));
