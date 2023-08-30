import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { NavLink, useLocation, useHistory } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
// import CircularProgress from '@material-ui/core/CircularProgress';
import CircularProgresss from 'components/CircularProgress/CircularProgresss.jsx';
import { useStateValue } from '../../utils/Utils';

import { primaryColor } from 'assets/jss/material-dashboard-pro-react.jsx';
import cx from 'classnames';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
import axios from 'axios';

// @material-ui/icons
import Face from '@material-ui/icons/Face';
import Email from '@material-ui/icons/Email';
import Phone from '@material-ui/icons/Phone';
import Work from '@material-ui/icons/Work';
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from '@material-ui/icons/Check';
// import { module } from 'assets/config';

import { validate } from '../../utils/Validator';
// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import CustomNumberFormat from 'components/CustomNumberFormat/CustomNumberFormat.jsx';

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import signupPageStyle from 'assets/jss/material-dashboard-pro-react/views/signupPageStyle';
import customInputStyle from 'assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx';
import loginPageStyle from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx';

const style = (theme) => ({
  ...signupPageStyle,
  ...customSelectStyle,
  ...customInputStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: 'none',
    color: '#AAAAAA !important',
    //top: 7
  },
  select: {
    padding: '4px 24px',
    fontSize: 14,
  },
  selectFormControl: {
    [theme.breakpoints.up('lg')]: {
      marginTop: -15,
    },
  },
  selectFormHelperText: {
    backgroundColor: 'white',
    paddingTop: 5,
    marginTop: 0,
    textAlign: 'left',
  },
  footer: {
    fontSize: 'x-small',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  countryFormControl: {
    marginTop: 5,
  },
  phoneFormControl: {
    paddingTop: 0,
  },
  modalCloseButton: {
    float: 'right',
  },
  loginMaxWidth: {
    maxWidth: 650,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  emptyIcon: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  otpModalBody: {
    overflow: 'visible',
    position: 'relative',
    padding: '24px 24px 16px 24px',
  },
  otpModalTitle: {
    fontWeight: 900,
    textAlign: 'center',
  },
  subTitleOTP: {
    fontWeight: 400,
    fontSize: '16px',
  },
  ...loginPageStyle,
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DUMMY_EMAIL_TO_SKIP = ['test4@dgcrowd.com', 'test1@dgcrowd.com', 'test7@dgcrowd.com', 'test8@dgcrowd.com'];
// const [{ authenticated }, dispatch] = useStateValue(false);

const SignupPage = (props) => {
  const { classes } = props;
  const location = useLocation();
  const history = useHistory();
  
  const [{ authenticated }, dispatch] = useStateValue(false);

    let initialState = {
        signUpModal: true,
        noticeModal: false,
        noticeModalErrMsg: '',
        checked: false,
        preRegisteredUser: false,
        firstName: '',
        firstNameState: '',
        firstNamePristine: true,
        firstNameErrorMsg: [],
        lastName: '',
        lastNameState: '',
        lastNamePristine: true,
        lastNameErrorMsg: [],
        email: '',
        emailState: '',
        emailPristine: true,
        emailErrorMsg: [],
        callingCode: '',
        callingCodeState: '',
        callingCodeErrorMsg: [],
        phoneNumber: '',
        phoneNumberState: '',
        phoneNumberPristine: true,
        phoneNumberHelpMsg: '(xxx-xxx-xxxx)',
        phoneNumberErrorMsg: [],
        companyName: '',
        companyNameState: '',
        companyNamePristine: true,
        companyNameErrorMsg: [],
        address: '',
        addressState: '',
        addressPristine: true,
        addressErrorMsg: [],
        city: '',
        cityState: '',
        cityPristine: true,
        cityErrorMsg: [],
        postalCode: '',
        postalCodeState: '',
        postalCodePristine: true,
        postalCodeErrorMsg: [],
        country: '',
        countryState: '',
        countryPristine: true,
        countryErrorMsg: [],
        password: '',
        passwordState: '',
        passwordPristine: true,
        passwordErrorMsg: [],
        passwordConfirmation: '',
        passwordConfirmationState: '',
        passwordConfirmationPristine: true,
        passwordConfirmationErrorMsg: [],
        countries: [],
        // callInProgress: true,
        // ProgressMSG:"Processing",
        showVerifyOTPModal: false,
        emailOTPCode: '',
        emailOTPCodeState: '',
        emailOTPCodePristine: true,
        emailOTPCodeErrorMsg: [],
        isEmailVerified: false,
        isOTPDialog: false,
        isAutoLogin: false,
      };
      const [initial, setIntial] = useState(initialState);

      const [ProgressBar,setProgressBar] = useState(false);
      const [ProgressBarMSG,setProgressBarMSG] = useState("Processing...");

  const error = {
    firstNameErrorMsg: {
      required: 'First name is required',
      range: 'First name should be 1 to 100 characters',
      special: 'Special Character is not allowed',
    },
    lastNameErrorMsg: {
      required: 'Last name is required',
      range: 'Last name should be 1 to 100 characters',
      special: 'Special Character is not allowed',
    },
    emailErrorMsg: {
      required: 'Email is required',
      company: 'Please enter a company email',
      valid: 'Please enter a valid email',
      existingEmail: 'User with this email already exists'
    },
    callingCodeErrorMsg: {
      required: 'Country Code is required',
    },
    phoneNumberErrorMsg: {
      required: 'Phone number is required',
      valid: 'Please enter phone number in a valid format (xxx-xxx-xxxx)',
    },
    companyNameErrorMsg: {
      required: 'Company name is required',
      range: 'Company name should be 1 to 200 characters',
      valid: 'Please enter a valid company name',
    },
    addressErrorMsg: {
      required: 'Address is required',
    },
    cityErrorMsg: {
      required: 'City is required',
    },
    postalCodeErrorMsg: {
      required: 'Postal code is required',
    },
    countryErrorMsg: {
      required: 'Country is required',
    },
    passwordErrorMsg: {
      required: 'Password is required',
      range: 'Password should be 8 to 16 characters',
      password: 'Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)',
    },
    passwordConfirmationErrorMsg: {
      required: 'Password confirmation is required',
      range: 'Password should be 8 to 16 characters',
      password: 'Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)',
      matchPassword: 'Confirm Password should match Password',
    },
  };

  // ^(?=.*[0-9]+.*)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z]+.*)(?=.*[~!@#$%^&*()_+]+.*)[0-9a-zA-Z~!@#$%^&*()_+]{8,15}$
  // constructor(props) {
  //   super(props);
    // const state = initialState;
  //   handleToggle = handleToggle.bind(this);
  // }

  const setState = async (val) => {
    console.log('VAL - ', val);
    await setIntial({
      ...initial,
      ...val
    });
  }
  const change = (event, stateName, rules) => {
    let value = event.target.value;
    if (stateName === 'phoneNumber') {
      value = value.replace(/-/g, '').trim();
      if (value.length > 10) {
        value = value.substring(1, value.length);
      }
      //  else if (value.length === 9) {
      //   value = "0" + value;
      // }
    }
    setState(validate(value, stateName, initial, rules, error));
  };
  const submitUser = async () => {
    const state = initial;
    let alpha2 = getAlpha2Code(initial.country);

    // Validate Test User
    const reg = /test[a-z,A-Z,0-9]+@dgcrowd.com/gm;
    const isTestUser = reg.test(initial.email);

    const user = {
      firstName: initial.firstName,
      lastName: initial.lastName,
      email: initial.email,
      phoneNumber: initial.callingCode + initial.phoneNumber.replace(/-/g, ''),
      companyName: initial.companyName,
      address: initial.address,
      city: initial.city,
      postalCode: initial.postalCode,
      countryCode: initial.country,
      alpha2Code: alpha2 ? alpha2.alpha2Code : '',
      password: initial.password,
      mfaEnabled: isTestUser ? false : true,
      mfaChannel: 'EMAIL',
      notProspectDemoUser: location.state != null ? location.state.notProspectDemoUser : false,
    };
    console.log("Submit Data - ", user);
    // setState({ callInProgress: true, ProgressMSG: "Signing you In..." });
    setProgressBar(true);
    setProgressBarMSG("Signing you In...")
    const res = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_SIGNUP, user);
    const data = res.data;
    // const data = {
    //   status: "message"
    // }
    if (data.errorCode) {
      setProgressBar(false)
      await setState({
        // callInProgress: false,
        signUpModal: false,
        noticeModal: true,
        noticeModalErrMsg: data.userDesc,
        isAutoLogin: false,
        showVerifyOTPModal: false,
        isOTPDialog: false,
      });
    } else {
      await setState({
        // callInProgress: false,
        signUpModal: false,
        noticeModal: true,
        noticeModalErrMsg: '',
        isAutoLogin: true,
        showVerifyOTPModal: false,
        isOTPDialog: false,
      });
      handleLoginSubmit();
    }
  };
  const getAlpha2Code = (code) => {
    let alpha2 = initial.countries.filter((item) => {
      return item.countryCode === code;
    })[0];
    return alpha2;
  };
  const submit = () => {
    const state = state;
    if (!initial.checked) {
      setState({
        noticeModal: true,
        noticeModalErrMsg: "Please click the 'terms and conditions' checkbox",
      });
      return;
    }
    // Validate Test User
    const reg = /test[a-z,A-Z,0-9]+@dgcrowd.com/gm;
    const isTestUser = reg.test(initial.email);

    if (isValidated()) {
      if (isTestUser || DUMMY_EMAIL_TO_SKIP.includes(initial.email)) {
        submitUser();
      } else {
        getEmailOTP();
      }
    }
  };
  const ValidateExistingEmailId = async (email) => {
    const res = await axios.get(endpoint.BASE_URL_STAGING_AXIOS + endpoint.VALIDATE_EMAIL + encodeURIComponent(email));
    console.log(res.data);
    if (res.data) {
      setState({
        emailState: 'error',
        emailErrorMsg: ['User with this email already exists']
      });
    }
  };
  const isValidated = () => {
    if (
      initial.firstNameState === 'success' &&
      initial.lastNameState === 'success' &&
      initial.emailState === 'success' &&
      initial.callingCodeState === 'success' &&
      initial.phoneNumberState === 'success' &&
      initial.companyNameState === 'success' &&
      initial.countryState === 'success' &&
      initial.passwordState === 'success' &&
      initial.passwordConfirmationState === 'success'
    )

    {
      return true;
    }

     else {
      if (initial.firstNameState !== 'success') {
        setState({ firstNameState: 'error' });
      }
      if (initial.lastNameState !== 'success') {
        setState({ lastNameState: 'error' });
      }
      if (initial.emailState !== 'success') {
        setState({ emailState: 'error' });
      }
      if (initial.callingCodeState !== 'success') {
        setState({ callingCodeState: 'error' });
      }
      if (initial.phoneNumberState !== 'success') {
        setState({ phoneNumberState: 'error' });
      }
      if (initial.companyNameState !== 'success') {
        setState({ companyNameState: 'error' });
      }
      if (initial.countryState !== 'success') {
        setState({ countryState: 'error' });
      }
      if (initial.passwordState !== 'success') {
        setState({ passwordState: 'error' });
      }
      if (initial.passwordConfirmationState !== 'success') {
        setState({ passwordConfirmationState: 'error' });
      }
    }
    return false;
  };
  const getPasswordHelpText = () => {
    let helpText = 'Password should be between 8 and 16 characters; One upper & lower case letter and must contain alphanumeric as well as special characters ( ~!@#$%^&*()_+)';
    return initial.passwordState === 'error' ? initial.passwordErrorMsg[0] : helpText;
  };
  const handleClickOpen = (modal) => {
    var x = [];
    x[modal] = true;
    setState(x);
  }
  const handleClose = (modal, isSignup) => {
    var x = {};
    x[modal] = false;
    if (initial.checked && modal === 'noticeModal') {
      x['signUpModal'] = false;
      // x['isAutoLogin'] = false;
    }
    console.log('isAutoLogin - ', isSignup, initial.isAutoLogin);
    if (initial.isAutoLogin)
      handleLoginSubmit();
    setState({...x});
  }
  const handleLoginSubmit = async () => {
    const data = {
      grant_type: 'password',
      username: initial.email,
      password: initial.password,
      skipmfa: "true",
    };
    // setState({ callInProgress: true });
    const response = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.LOGIN_OAUTH, data);
    // const response = await apiHandler({
    //   method: 'POST',
    //   url: endpoint.LOGIN_OAUTH,
    //   data: data,
    //   token: null
    // });
    console.log('LOGIN - ', response);
    if (response.data.error && response.data.error !== 'mfa_required') {
      setProgressBar(false)
      setState({
        // callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: response.data.error_description,
        showVerifyOTPModal: false
      });
    } else if (response.data.access_token) {
      setProgressBar(false)
      // Users to bypass token mechanism
      setState({ 
        //  callInProgress: false,
         noticeModal: false,
         showVerifyOTPModal: false,
         isOTPDialog: false,
         signUpModal:false });
      await updateStorageAfterLogin(response.data);
    } else {
      // NEED A MESSAGE TO SHOW ERROR
      setProgressBar(false)
      setState({
        // callInProgress: false,
        showVerifyOTPModal: false,
        isOTPDialog: false,
        signUpModal: false,
        noticeModal: true,
        noticeModalErrMsg: "Please login into system",
      });
    }
  };
  const updateStorageAfterLogin = async (data) => {
    console.log('updateStorageAfterLogin - ', data);
    sessionStorage.setItem('token', data.access_token);
    sessionStorage.setItem('role', data.role);
    sessionStorage.setItem('customerId', data.customerId ? data.customerId : -1);
    sessionStorage.setItem('tokenTime', Date.now());
    sessionStorage.setItem('lastLoginTime', data.last_login);

    sessionStorage.setItem('refresh_token', data.refresh_token);
    sessionStorage.setItem('view_as_client', data.view_as_client);
    sessionStorage.setItem('readonly_customer', data.readonly_customer);
    let status = 'prospect';
    if (data.view_as_client) status = 'view_as_client';
    else {
      if (data.is_user_admin) {
        status = 'admin';
      } else if (data.prospectUser) {
        if (data.customerId) status = 'registered';
        else status = 'prospect';
      } else status = 'approved';
    }
    sessionStorage.setItem('status', status);

    dispatch({
      type: 'changeAuthenticated',
      authenticated: true,
    });
    // Check logged in user role access
    await getUserAppsAccess(data);
  };
  const getUserAppsAccess = async (data) => {
    console.log('getUserAppsAccess - ', data);
    // setState({callInProgress: true})
    const response = await apiHandler({
      method: 'GET',
      url: endpoint.LOGIN_SUBSCRIBED_APPS,
      authToken: data.access_token
    });
    console.log('getUserAppsAccess Signup - ', response.data);
    if (response.data.error) {
      setProgressBar(false)
      setState({
        // callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: "Please check your Email for Valid OTP code",
      });
    } else {
      // setState({callInProgress: false})
      setProgressBar(false)
      if (data.is_user_admin) props.history.push(`/auth/admin/admin-dashboard`);
      else {
        const linkRes = await apiHandler({ url: endpoint.APP_LINK });

        const { hide_transaction } = linkRes.data;
        sessionStorage.setItem('ht', hide_transaction);
        if (hide_transaction === 'true') {
          sessionStorage.setItem('access', 'r');
          sessionStorage.setItem('module', 'RISKS');
          return await ValidateRiskSubscription(data.access_token);
        } else {
          if (response.data.riskModule === true && response.data.traansactionModule === true) {
            sessionStorage.setItem('access', 'a');
            sessionStorage.setItem('module', 'BOTH');
            props.history.push(`/auth/portal-dashboard`);
          } else if (response.data.riskModule === true) {
            sessionStorage.setItem('access', 'r');
            props.history.push(`/auth/modules`);
          } else if (response.data.traansactionModule === true) {
            sessionStorage.setItem('access', 't');
            props.history.push(`/auth/modules`);
          } else {
            sessionStorage.setItem('access', 'n');
            props.history.push(`/auth/modules`);
          }
        }
      }
    }
  };
  const ValidateRiskSubscription = async (token) => {
    console.log('ValidateRiskSubscription - ');
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: token,
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        props.history.push('/home/logout');
        return;
      } else {
        props.history.push(`/auth/risk-subscription`);
      }
    } else {
      console.log(res.data);
      sessionStorage.setItem('riskStatus', res.data.status);
      if (res.data.status === 'ACTIVE') {
        props.history.push(`/auth/risk-portal`);
      } else {
        let expiry = res.data.planRenewalExpiryDate ? new Date(res.data.planRenewalExpiryDate) : null;
        let date = new Date();
        // date.setDate(date.getDate() - 15);
        if (res.data.status === 'INACTIVE' && res.data.paymentDeclined && expiry && expiry > date) {
          sessionStorage.setItem('riskStatus', 'INACTIVE_TIMEOUT');
          // props.history.push(`/auth/risk-payment`);
          props.history.push(`/auth/risk-portal`);
        } else {
          props.history.push(`/auth/risk-subscription`);
        }
      }
    }
  };
  const handleEmailChange = (event) => {
    setState({ email: event.target.value });
  };
  const handleSimple = (event) => {
    setState(validate(event.target.value, event.target.name, initial, [{ type: 'required' }], error));
  };
  const handleCallingCode = (event) => {
    let obj = event.target.value;
    setState({ [event.target.name]: obj.callingCodes[0] });
    setState(validate(obj.callingCodes[0], 'callingCode', initial, [{ type: 'required' }], error));
  };
  const handleToggle = () => {
    setState({
      checked: !initial.checked,
    });
  }
  const handleOTPClose = () => {
    setState(initialState);
    setState({ showVerifyOTPModal: false, isOTPDialog: false });
  };
  const getEmailOTP = async () => {
    if (initial.email !== '') {
      const data = { source: initial.email, type: 'EMAIL' };
      setProgressBar(true);
      setProgressBarMSG("Processing...");
      // setState({ callInProgress: true, ProgressMSG:"Processing..." });
      const res = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_EMAIL_SEND_OTP, data);
      // const res = await apiHandler({
      //   method: "POST",
      //   url: endpoint.USER_EMAIL_SEND_OTP,
      //   data: data
      // });
      setProgressBar(false);
      // setState({ callInProgress: false });
      if (res.data.errorCode) {
        setState({
          noticeModal: true,
          noticeModalErrMsg: res.data.userDesc,
        });
        return;
      } else {
        setState({ showVerifyOTPModal: true, isOTPDialog: true });
      }
    } else {
      setState({
        noticeModal: true,
        noticeModalErrMsg: 'Please provide Email ID to get OTP',
      });

      return;
    }
  };
  const verifyOTP = async () => {
    const data = { source: initial.email, otp: initial.emailOTPCode };
    setProgressBar(true)
    setProgressBarMSG("Verifying OTP...")
    // setState({ callInProgress: true, ProgressMSG:"Verifying OTP..." });
    const res = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_EMAIL_VERIFY_OTP, data);
    // const res = await apiHandler({
    //   method: "POST",
    //   url: endpoint.USER_EMAIL_VERIFY_OTP,
    //   data: data
    // });
    if (res.data.errorCode) {
      setProgressBar(false);
      setState({
        // callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: res.data.userDesc,
      });
      return;
    } else {
      setState(
        {
          showVerifyOTPModal: false,
          isEmailVerified: true,
          isOTPDialog: false,
        }
      );
      submitUser();
    }
  };
  const resetOTP = async () => {
    const data = { source: initial.email, type: 'EMAIL' };
    // setState({ callInProgress: true });
    setProgressBar(true)
    const response = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_EMAIL_SEND_OTP, data);
    // setState({ callInProgress: false });
    setProgressBar(false)
    if (response.data.error) {
      setProgressBar(false)
      setState({
        // callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: response.data.error_description,
      });
    } else {
      setProgressBar(false)
      setState({
        // callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: 'Please check your Email for new OTP code.',
      });
    }
  };
  const getCountryData = async () => {
    console.log('getCountryData')
    // const res = await apiHandler({
    //   method: 'GET',
    //   url: endpoint.COUNTRIES,
    //   authToken: null,
    // });
    const res = await axios.get(endpoint.BASE_URL_STAGING_AXIOS + 'fx-crm/public/countriesMetaData');
    //   res => {
    let countries = res.data.countryMetaData;
    let index = -1;
    let currentCountry = countries.find((country, i) => {
      if (country.alpha2Code === 'GB') {
        index = i;
        return true;
      }
    });
    if (currentCountry && index !== -1) {
      countries.splice(index, 1);
      countries.unshift(currentCountry);
    }
    setState({ countries: countries });

    // // Get country http://ip-api.com/json
    // axios.get("http://ip-api.com/json").then(
    //   response => {
    //     const countryCode = response.data.countryCode;
    //   });
    //   },
    //   () => {}
    // );
  };
  useEffect(() => {
    const { match } = props;
    if (match.params.emailId) {
      setState({ email: match.params.emailId, preRegisteredUser: true });
    }
    getCountryData();
  }, []);

  const componentDidUpdate = (e) => {
    if (!initial.signUpModal && !initial.noticeModal) {
      e.history.go(-1);
    }
  }


  // const callingCodeLabelClasses = classNames({
  //   [" " + classes.labelRootError]: initial.callingCodeState === "error",
  //   [" " + classes.labelRootSuccess]:
  //     initial.callingCodeState === "success" &&
  //     !(initial.callingCodeState === "error")
  // });
  const module = sessionStorage.getItem('module');
  return (
    <div className={cx(classes.container, classes.cardSignup)}>
      {initial.isOTPDialog ? (
        <>
          {ProgressBar ? (
            <CircularProgresss callInProgress={ProgressBar} text={ProgressBarMSG} />
          ) : (
            <>
              {/* OTP screen */}
              <Dialog
                classes={{
                  root: classes.center + ' ' + classes.modalRoot,
                  paper: classes.modal,
                }}
                open={initial.showVerifyOTPModal}
                disableBackdropClick
                disableEscapeKeyDown
                TransitionComponent={Transition}
                keepMounted
                onClose={() => handleOTPClose()}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
              >
                <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)}>
                  <IconButton aria-label="close" className={classes.closeButton} onClick={() => handleOTPClose()}>
                    <CloseIcon />
                  </IconButton>

                  <h3 className={cx(classes.modalTitle, classes.otpModalTitle)}>Signup</h3>
                  <h5 className={classes.subTitleOTP}>{"Enter your OTP Code sent on your email: " + initial.email}</h5>
                </DialogTitle>
                <DialogContent id="classic-modal-slide-description" className={cx(classes.otpModalBody, classes.loginMaxWidth)}>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={12}>
                      <form>
                        <GridContainer justify="center">
                          <Icon className={classes.inputAdornmentIcon} style={{ marginTop: 30 }}>
                            lock_outline
                          </Icon>
                          <GridItem xs={8} sm={8} md={8}>
                            <CustomInput
                              success={initial.emailOTPCodeState === 'success'}
                              error={initial.emailOTPCodeState === 'error'}
                              helpText={initial.emailOTPCodeState === 'error' && initial.emailOTPCodeErrorMsg[0]}
                              labelText="OTP Code"
                              id="lp_emailOTPCode"
                              formControlProps={{
                                fullWidth: false,
                                onChange: (event) => {
                                  change(event, 'emailOTPCode', [{ type: 'required' }]);
                                },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                        <div className={classes.center}>
                          <Button size="lg" style={{ backgroundColor: primaryColor[5] }} onClick={() => verifyOTP()}>
                            VERIFY
                          </Button>
                        </div>
                        <div>
                          <a style={{ cursor: 'pointer' }} onClick={() => resetOTP()}>
                            Resend OTP
                          </a>
                        </div>
                      </form>
                    </GridItem>
                  </GridContainer>
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      ) : (
        <>
          {ProgressBar ? (
            <CircularProgresss callInProgress={ProgressBar} text={ProgressBarMSG}/> //initial.ProgressMSG
          ) : (
            <>
              <Dialog
                classes={{
                  root: classes.center + ' ' + classes.modalRoot,
                  paper: classes.modal + ' ' + classes.loginMaxWidth,
                }}
                open={initial.signUpModal}
                disableBackdropClick
                disableEscapeKeyDown
                TransitionComponent={Transition}
                keepMounted
                onClose={() => handleClose('signUpModal', initial.isAutoLogin)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
              >
                <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)}>
                  <IconButton aria-label="close" className={classes.closeButton} onClick={() => handleClose('signUpModal', initial.isAutoLogin)}>
                    <CloseIcon />
                  </IconButton>
                  {location.state && location.state.notProspectDemoUser ? (
                    <>
                      <h3 className={cx(classes.modalTitle, classes.signupModalTitle)}>{module === 'RISKS' ? 'Free Sign Up' : 'Free Sign Up and Customer Registration'}</h3>
                      {/* <FormLabel className={cx(classes.footer)}>This is Free to test drive our portal</FormLabel> */}
                    </>
                  ) : (
                    <>
                      <h3 className={cx(classes.modalTitle, classes.signupModalTitle)}>Sign Up for Demo</h3>
                      <FormLabel className={cx(classes.footer)}>This is Free to test drive our portal</FormLabel>
                    </>
                  )}
                </DialogTitle>
                <DialogContent id="classic-modal-slide-description" className={classes.modalBody}>
                  <form className={classes.form}>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer spacing={1} alignItems="center">
                          <GridItem xs={1} sm={1} md={1} lg={1} className={classes.textIcon}>
                            <Face className={classes.inputAdornmentIcon} />
                          </GridItem>
                          <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={5}>
                            <CustomInput
                              success={initial.firstNameState === 'success'}
                              error={initial.firstNameState === 'error'}
                              helpText={initial.firstNameState === 'error' && initial.firstNameErrorMsg[0]}
                              labelText="First Name*"
                              id="sp_firstName"
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  setState({ firstNamePristine: false });
                                  change(event, 'firstName', [
                                    { type: 'required' },
                                    { type: 'special' },
                                    {
                                      type: 'length',
                                      params: {
                                        min: 1,
                                        max: 100,
                                      },
                                    },
                                  ]);
                                },
                                onChange: (event) => {
                                  if (!initial.firstNamePristine) {
                                    setState({
                                      firstNamePristine: false,
                                    });
                                    change(event, 'firstName', [
                                      { type: 'required' },
                                      { type: 'special' },
                                      {
                                        type: 'length',
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
                          <GridItem className={classes.emptyIcon} xs={1} sm={1} md={false} lg={false} />
                          <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={5}>
                            <CustomInput
                              success={initial.lastNameState === 'success'}
                              error={initial.lastNameState === 'error'}
                              helpText={initial.lastNameState === 'error' && initial.lastNameErrorMsg[0]}
                              labelText="Last Name*"
                              id="sp_lastName"
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  setState({ lastNamePristine: false });
                                  change(event, 'lastName', [
                                    { type: 'required' },
                                    { type: 'special' },
                                    {
                                      type: 'length',
                                      params: {
                                        min: 1,
                                        max: 100,
                                      },
                                    },
                                  ]);
                                },
                                onChange: (event) => {
                                  if (!initial.lastNamePristine) {
                                    setState({
                                      lastNamePristine: false,
                                    });
                                    change(event, 'lastName', [
                                      { type: 'required' },
                                      { type: 'special' },
                                      {
                                        type: 'length',
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
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer spacing={1} alignItems="center">
                          <GridItem xs={1} sm={1} md={1} lg={1} className={classes.textIcon}>
                            <Email className={classes.inputAdornmentIcon} />
                          </GridItem>
                          <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={10}>
                            <CustomInput
                              success={initial.emailState === 'success'}
                              error={initial.emailState === 'error'}
                              helpText={initial.emailState === 'error' && initial.emailErrorMsg[0]}
                              labelText="Corporate email address*"
                              id="sp_email"
                              inputProps={{
                                value: initial.email,
                                disabled: initial.preRegisteredUser || initial.isEmailVerified,
                                onChange: (event) => handleEmailChange(event),
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  setState({ emailPristine: false });
                                  change(event, 'email', [{ type: 'required' }, { type: 'email' }]);
                                  ValidateExistingEmailId(event.target.value);
                                },
                                onChange: (event) => {
                                  if (!initial.emailPristine) {
                                    setState({ emailPristine: false });
                                    change(event, 'email', [{ type: 'required' }, { type: 'email' }]);
                                  }
                                },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer spacing={1} alignItems="center">
                          <GridItem xs={1} sm={1} md={1} lg={1} className={classes.textIcon}>
                            <Phone className={classes.inputAdornmentIcon} />
                          </GridItem>
                          <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={5}>
                            <FormControl fullWidth className={classes.selectFormControl}>
                              <FormHelperText
                                style={{
                                  backgroundColor: 'white',
                                  paddingBottom: 5,
                                  marginTop: -3,
                                  textAlign: 'left',
                                }}
                                success={initial.callingCodeState === 'success'}
                                error={initial.callingCodeState === 'error'}
                                helpText={initial.callingCodeState === 'error' && initial.callingCodeErrorMsg[0]}
                              >
                                Country Code*
                              </FormHelperText>
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                classes={{
                                  select: classes.select,
                                }}
                                value={initial.callingCodeObj}
                                onChange={handleCallingCode}
                                inputProps={{
                                  name: 'callingCodeObj',
                                  id: 'callingCodeObj',
                                }}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Choose Code
                                </MenuItem>
                                {initial.countries.map((item) => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
                                    }}
                                    value={item}
                                    key={item.countryCode}
                                  >
                                    {item.countryName + ' (' + item.callingCodes[0] + ')'}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </GridItem>
                          <GridItem className={classes.emptyIcon} xs={1} sm={1} md={false} lg={false} />
                          <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={5}>
                            {/* <FormHelperText
                                style={{
                                  backgroundColor: 'white',
                                  margin: '5px 12px 0px 12px',
                                  textAlign: 'left',
                                }}
                                success={initial.phoneNumberState === 'success'}
                                error={initial.phoneNumberState === 'error'}
                              >
                                Phone Number*
                              </FormHelperText>
                              <CustomNumberFormat
                                success={initial.phoneNumberState === 'success'}
                                error={initial.phoneNumberState === 'error'}
                                helpText={initial.phoneNumberState === 'error' ? initial.phoneNumberErrorMsg[0] : initial.phoneNumberHelpMsg}
                                id="sp_phoneNumber"
                                value={initial.phoneNumber}
                                // labelText="Phone Number*"
                                format="###-###-####"
                                formControlProps={{
                                  fullWidth: true,
                                  className: cx(classes.customFormControlClasses, classes.phoneFormControl),
                                  onBlur: (event) => {
                                    setState({
                                      phoneNumberPristine: false,
                                    });
                                    change(event, 'phoneNumber', [{ type: 'required' }, { type: 'phone' }]);
                                  },
                                  onChange: (event) => {
                                    if (!initial.phoneNumberPristine) {
                                      setState({
                                        phoneNumberPristine: false,
                                      });
                                      change(event, 'phoneNumber', [{ type: 'required' }, { type: 'phoneNumber' }]);
                                    }
                                  },
                                }}
                              /> */}
                            <CustomInput
                              success={initial.phoneNumberState === 'success'}
                              error={initial.phoneNumberState === 'error'}
                              helpText={initial.phoneNumberState === 'error' && initial.phoneNumberErrorMsg[0]}
                              labelText="Phone Number*"
                              id="sp_phoneNumber"
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  setState({ phoneNumberPristine: false });
                                  change(event, 'phoneNumber', [{ type: 'required' }]);
                                },
                                onChange: (event) => {
                                  if (!initial.phoneNumberPristine) {
                                    setState({ phoneNumberPristine: false });
                                    change(event, 'phoneNumber', [{ type: 'required' }]);
                                  }
                                },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer spacing={1} alignItems="center">
                          <GridItem xs={1} sm={1} md={1} lg={1} className={classes.textIcon}>
                            <Work className={classes.inputAdornmentIcon} />
                          </GridItem>
                          <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={10}>
                            <CustomInput
                              success={initial.companyNameState === 'success'}
                              error={initial.companyNameState === 'error'}
                              helpText={initial.companyNameState === 'error' && initial.companyNameErrorMsg[0]}
                              labelText="Company Name*"
                              id="sp_companyName"
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  setState({
                                    companyNamePristine: false,
                                  });
                                  change(event, 'companyName', [
                                    { type: 'required' },
                                    { type: 'companyName' },
                                    {
                                      type: 'length',
                                      params: {
                                        min: 1,
                                        max: 200,
                                      },
                                    },
                                  ]);
                                },
                                onChange: (event) => {
                                  if (!initial.companyNamePristine) {
                                    setState({
                                      companyNamePristine: false,
                                    });
                                    change(event, 'companyName', [
                                      { type: 'required' },
                                      {
                                        type: 'length',
                                        params: {
                                          min: 1,
                                          max: 200,
                                        },
                                      },
                                    ]);
                                  }
                                },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <b className={classes.subTitle}>Business Address</b>
                      </GridItem>
                      <GridItem xs={11} sm={11} md={11} lg={11} className={classes.alignPadding}>
                        <CustomInput
                          success={initial.addressState === 'success'}
                          error={initial.addressState === 'error'}
                          helpText={initial.addressState === 'error' && initial.addressErrorMsg[0]}
                          labelText="Address"
                          id="sp_address"
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: (event) => {
                              setState({ companyNamePristine: false });
                              change(event, 'address', []);
                            },
                            onChange: (event) => {
                              if (!initial.companyNamePristine) {
                                setState({ companyNamePristine: false });
                                change(event, 'address', []);
                              }
                            },
                          }}
                        />
                      </GridItem>
                      <GridItem xs={11} sm={11} md={11} lg={11} className={classes.alignPadding}>
                        <GridContainer>
                          <GridItem xs={12} sm={10} md={4}>
                            <CustomInput
                              success={initial.cityState === 'success'}
                              error={initial.cityState === 'error'}
                              helpText={initial.cityState === 'error' && initial.cityErrorMsg[0]}
                              labelText="City"
                              id="sp_city"
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  setState({ cityPristine: false });
                                  change(event, 'city', []);
                                },
                                onChange: (event) => {
                                  if (!initial.cityPristine) {
                                    setState({ cityPristine: false });
                                    change(event, 'city', []);
                                  }
                                },
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={10} md={4}>
                            <CustomInput
                              success={initial.postalCodeState === 'success'}
                              error={initial.postalCodeState === 'error'}
                              helpText={initial.postalCodeState === 'error' && initial.postalCodeErrorMsg[0]}
                              labelText="Postal Code"
                              id="sp_postalCode"
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: (event) => {
                                  setState({
                                    postalCodePristine: false,
                                  });
                                  change(event, 'postalCode', []);
                                },
                                onChange: (event) => {
                                  if (!initial.postalCodePristine) {
                                    setState({
                                      postalCodePristine: false,
                                    });
                                    change(event, 'postalCode', []);
                                  }
                                },
                              }}
                            />
                          </GridItem>
                          {/* <GridItem xs={12} sm={10} md={4}>
                      <CustomInput
                        success={initial.countryState === "success"}
                        error={initial.countryState === "error"}
                        helpText={
                          initial.countryState === "error" &&
                          initial.countryErrorMsg[0]
                        }
                        labelText="Country*"
                        id="sp_country"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            setState({ countryPristine: false });
                            change(event, "country", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!initial.countryPristine) {
                              setState({ countryPristine: false });
                              change(event, "country", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem> */}

                          <GridItem xs={12} sm={12} md={12} lg={4}>
                            <FormControl fullWidth className={classes.countryFormControl}>
                              <FormHelperText
                                style={{
                                  backgroundColor: 'white',
                                  paddingTop: 5,
                                  marginTop: 0,
                                  textAlign: 'left',
                                }}
                                success={initial.countryState === 'success'}
                                error={initial.countryState === 'error'}
                                helpText={initial.countryState === 'error' && initial.countryErrorMsg[0]}
                              >
                                Country*
                              </FormHelperText>
                              {/* <InputLabel
                          htmlFor="type"
                          className={classes.selectLabel}
                        >
                          Country*
                        </InputLabel> */}
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                classes={{
                                  select: classes.select,
                                }}
                                value={initial.country}
                                onChange={handleSimple}
                                inputProps={{
                                  name: 'country',
                                  id: 'country',
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
                                {initial.countries.map((item) => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
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
                      <GridItem xs={10} sm={10} md={11} lg={11} className={classes.alignPadding}>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <GridContainer spacing={1} alignItems="flex-end">
                              <GridItem className={classes.customText} xs={12} sm={12} md={11} lg={11}>
                                <CustomInput
                                  success={initial.passwordState === 'success'}
                                  error={initial.passwordState === 'error'}
                                  helpText={getPasswordHelpText()}
                                  labelText="Password*"
                                  id="sp_password"
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: (event) => {
                                      setState({
                                        passwordPristine: false,
                                      });
                                      change(event, 'password', [
                                        { type: 'required' },
                                        {
                                          type: 'length',
                                          params: {
                                            min: 8,
                                            max: 16,
                                          },
                                        },
                                        { type: 'password' },
                                      ]);
                                    },
                                    onChange: (event) => {
                                      if (!initial.passwordPristine) {
                                        setState({
                                          passwordPristine: false,
                                        });
                                        change(event, 'password', [
                                          { type: 'required' },
                                          {
                                            type: 'length',
                                            params: {
                                              min: 8,
                                              max: 16,
                                            },
                                          },
                                          { type: 'password' },
                                        ]);
                                      }
                                    },
                                  }}
                                  inputProps={{ type: 'password' }}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <GridContainer spacing={1} alignItems="flex-end">
                              <GridItem className={classes.customText} xs={12} sm={12} md={12} lg={12}>
                                <CustomInput
                                  success={initial.passwordConfirmationState === 'success'}
                                  error={initial.passwordConfirmationState === 'error'}
                                  helpText={initial.passwordConfirmationState === 'error' && initial.passwordConfirmationErrorMsg[0]}
                                  labelText="Password Confirmation*"
                                  id="sp_passwordConfirmation"
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: (event) => {
                                      setState({
                                        passwordPristine: false,
                                      });
                                      change(event, 'passwordConfirmation', [
                                        { type: 'required' },
                                        {
                                          type: 'matchPassword',
                                          params: initial.password,
                                        },
                                        {
                                          type: 'length',
                                          params: {
                                            min: 8,
                                            max: 16,
                                          },
                                        },
                                        { type: 'password' },
                                      ]);
                                    },
                                    onChange: (event) => {
                                      if (!initial.passwordConfirmationPristine) {
                                        setState({
                                          passwordConfirmationPristine: false,
                                        });
                                        change(event, 'passwordConfirmation', [
                                          { type: 'required' },
                                          {
                                            type: 'matchPassword',
                                            params: initial.password,
                                          },
                                          {
                                            type: 'length',
                                            params: {
                                              min: 8,
                                              max: 16,
                                            },
                                          },
                                          { type: 'password' },
                                        ]);
                                      }
                                    },
                                  }}
                                  inputProps={{ type: 'password' }}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer spacing={1} style={{ textAlign: 'center', marginTop: 20 }}>
                          <GridItem className={classes.customText} xs={12} sm={12} md={12} lg={12}>
                            <FormControlLabel
                              className={classes.center}
                              classes={{
                                root: classes.checkboxLabelControl,
                                label: classes.checkboxLabel,
                              }}
                              this
                              control={
                                <Checkbox
                                  tabIndex={-1}
                                  onClick={() => handleToggle()}
                                  checkedIcon={<Check className={classes.checkedIcon} />}
                                  icon={<Check className={classes.uncheckedIcon} />}
                                  classes={{
                                    checked: classes.checked,
                                    root: classes.checkRoot,
                                  }}
                                />
                              }
                              label={
                                <div className={classes.termsText}>
                                  I agree to FXGuard{' '}
                                  <NavLink target="_blank" to={'privacy-policy'}>
                                    Privacy Policy *
                                  </NavLink>
                                  .
                                </div>
                              }
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer spacing={1} style={{ textAlign: 'center', marginTop: 20 }}>
                          <GridItem className={classes.customText} xs={12} sm={12} md={12} lg={12}>
                            <div className={classes.center}>
                              <Button round={false} color="info" size="lg" onClick={submit}>
                                SUBMIT
                              </Button>
                            </div>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer style={{ textAlign: 'left' }}>
                          <GridItem className={classes.customText} xs={12} sm={12} md={12} lg={12}>
                            <div>
                              <em>* Required</em>
                            </div>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      )}
      <Dialog
        classes={{
          root: classes.center + ' ' + classes.modalRoot,
          paper: classes.modal,
        }}
        open={initial.noticeModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose('noticeModal', initial.isAutoLogin)}
        aria-labelledby="notice-modal-slide-title"
        aria-describedby="notice-modal-slide-description"
      >
        <DialogTitle id="notice-modal-slide-title" disableTypography className={classes.modalHeader}>
          <h4 className={classes.modalTitle}>{initial.noticeModalErrMsg === '' ? 'Success' : 'Error'}</h4>
        </DialogTitle>
        <DialogContent id="notice-modal-slide-description" className={classes.modalBody}>
          {location.state && location.state.notProspectDemoUser ? (
            <p>
              {initial.noticeModalErrMsg === ''
                ? module === 'RISKS'
                  ? 'You have successfully signed up. You will now receive an email from us and then you can login and proceed to select your plan.'
                  : 'You have successfully signed up. You will now receive an email from us and then you can login and register as customer. Please check your email'
                : initial.noticeModalErrMsg}
            </p>
          ) : (
            <p>
              {initial.noticeModalErrMsg === ''
                ? 'You have successfully signed up for Demo. You will now receive an email from us and then you can login. Please check your email'
                : initial.noticeModalErrMsg}
            </p>
          )}
        </DialogContent>
        <DialogActions className={classes.modalFooter + ' ' + classes.modalFooterCenter}>
          <Button onClick={() => handleClose('noticeModal', initial.isAutoLogin)} color="info" round>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

}

SignupPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
};

export default withStyles(style)(SignupPage);