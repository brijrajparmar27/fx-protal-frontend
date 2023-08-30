import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

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

class SignupPage extends React.Component {
  error = {
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
  initialState = {
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
    callInProgress: false,
    showVerifyOTPModal: false,
    emailOTPCode: '',
    emailOTPCodeState: '',
    emailOTPCodePristine: true,
    emailOTPCodeErrorMsg: [],
    isEmailVerified: false,
    isOTPDialog: false,
  };
  // ^(?=.*[0-9]+.*)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z]+.*)(?=.*[~!@#$%^&*()_+]+.*)[0-9a-zA-Z~!@#$%^&*()_+]{8,15}$
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.handleToggle = this.handleToggle.bind(this);
  }

  change = (event, stateName, rules) => {
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
    this.setState(validate(value, stateName, this.state, rules, this.error));
  };
  submitUser = async () => {
    const state = this.state;
    let alpha2 = this.getAlpha2Code(state.country);

    // Validate Test User
    const reg = /test[a-z,A-Z,0-9]+@dgcrowd.com/gm;
    const isTestUser = reg.test(state.email);

    const user = {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phoneNumber: state.callingCode + state.phoneNumber.replace(/-/g, ''),
      companyName: state.companyName,
      address: state.address,
      city: state.city,
      postalCode: state.postalCode,
      countryCode: state.country,
      alpha2Code: alpha2 ? alpha2.alpha2Code : '',
      password: state.password,
      mfaEnabled: isTestUser ? false : true,
      mfaChannel: 'EMAIL',
      notProspectDemoUser: this.props.location.state != null ? this.props.location.state.notProspectDemoUser : false,
    };
    // console.log("Submit Data - ", user);
    // this.setState({ callInProgress: true });
    const res = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_SIGNUP, user);
    const data = res.data;
    if (data.errorCode) {
      this.setState({
        callInProgress: false,
        signUpModal: false,
        noticeModal: true,
        noticeModalErrMsg: data.userDesc,
      });
    } else {
      this.setState({
        callInProgress: false,
        signUpModal: false,
        noticeModal: true,
        noticeModalErrMsg: '',
      });
    }
  };
  getAlpha2Code = (code) => {
    let alpha2 = this.state.countries.filter((item) => {
      return item.countryCode === code;
    })[0];
    return alpha2;
  };
  submit = () => {
    const state = this.state;
    if (!state.checked) {
      this.setState({
        noticeModal: true,
        noticeModalErrMsg: "Please click the 'terms and conditions' checkbox",
      });

      return;
    }
    // Validate Test User
    const reg = /test[a-z,A-Z,0-9]+@dgcrowd.com/gm;
    const isTestUser = reg.test(state.email);

    if (this.isValidated()) {
      if (isTestUser || DUMMY_EMAIL_TO_SKIP.includes(this.state.email)) {
        this.submitUser();
      } else {
        this.getEmailOTP();
      }
    } 
  };
  ValidateExistingEmailId = async (email) => {
    const res = await axios.get(endpoint.BASE_URL_STAGING_AXIOS + endpoint.VALIDATE_EMAIL + encodeURIComponent(email));
    console.log(res.data);
    if (res.data) {
      this.setState({
        emailState: 'error',
        emailErrorMsg: ['User with this email already exists']
      });
    }
  };
  isValidated = () => {
    if (
      this.state.firstNameState === 'success' &&
      this.state.lastNameState === 'success' &&
      this.state.emailState === 'success' &&
      this.state.callingCodeState === 'success' &&
      this.state.phoneNumberState === 'success' &&
      this.state.companyNameState === 'success' &&
      this.state.countryState === 'success' &&
      this.state.passwordState === 'success' &&
      this.state.passwordConfirmationState === 'success'
    ) {
      return true;
    } else {
      if (this.state.firstNameState !== 'success') {
        this.setState({ firstNameState: 'error' });
      }
      if (this.state.lastNameState !== 'success') {
        this.setState({ lastNameState: 'error' });
      }
      if (this.state.emailState !== 'success') {
        this.setState({ emailState: 'error' });
      }
      if (this.state.callingCodeState !== 'success') {
        this.setState({ callingCodeState: 'error' });
      }
      if (this.state.phoneNumberState !== 'success') {
        this.setState({ phoneNumberState: 'error' });
      }
      if (this.state.companyNameState !== 'success') {
        this.setState({ companyNameState: 'error' });
      }
      if (this.state.countryState !== 'success') {
        this.setState({ countryState: 'error' });
      }
      if (this.state.passwordState !== 'success') {
        this.setState({ passwordState: 'error' });
      }
      if (this.state.passwordConfirmationState !== 'success') {
        this.setState({ passwordConfirmationState: 'error' });
      }
    }
    return false;
  };
  getPasswordHelpText = () => {
    let helpText = 'Password should be between 8 and 16 characters; One upper & lower case letter and must contain alphanumeric as well as special characters ( ~!@#$%^&*()_+)';
    return this.state.passwordState === 'error' ? this.state.passwordErrorMsg[0] : helpText;
  };
  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal, isAutoLogin) {
    var x = [];
    x[modal] = false;
    if (this.state.checked && modal === 'noticeModal') {
      x['signUpModal'] = false;
    }
    this.setState(x);
    // if (isAutoLogin) this.handleLoginSubmit();
  }
  handleLoginSubmit = async () => {
    const data = {
      grant_type: 'password',
      username: this.state.email,
      password: this.state.password,
      skipmfa: true,
    };
    const response = await apiHandler({
      method: 'POST',
      url: endpoint.LOGIN_OAUTH,
      data: data,
      token: null
    });
    if (response.data.error && response.data.error !== 'mfa_required') {
      this.setState({
        noticeModal: true,
        noticeModalErrMsg: response.data.error_description,
      });
    } else if (response.data.access_token) {
      // Users to bypass token mechanism
      this.updateStorageAfterLogin(response.data);
    } else {
      // NEED A MESSAGE TO SHOW ERROR
      this.setState({
        noticeModal: true,
        noticeModalErrMsg: "Please login into system",
      });
    }
  };
  updateStorageAfterLogin = (data) => {
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

    // dispatch({
    //   type: 'changeAuthenticated',
    //   authenticated: true,
    // });
    // Check logged in user role access
    this.getUserAppsAccess(data);
  };
  getUserAppsAccess = async (data) => {
    const response = await apiHandler({
      method: 'GET',
      url: endpoint.LOGIN_SUBSCRIBED_APPS,
      authToken: data.access_token
    });
    console.log('getUserAppsAccess login - ', response.data);
    if (response.data.error) {
      this.setState({
        noticeModal: true,
        noticeModalErrMsg: "Please check your Email for Valid OTP code",
      });
    } else {
      if (data.is_user_admin) this.props.history.push(`/auth/admin/admin-dashboard`);
      else {
        const linkRes = await apiHandler({url: endpoint.APP_LINK});
        console.log('DATA - ', linkRes.data);

        const {hide_transaction} = linkRes.data;
        console.log('HODE - ', hide_transaction);
        sessionStorage.setItem('ht', hide_transaction);
        if (hide_transaction === 'true') {
          sessionStorage.setItem('access', 'r');
          sessionStorage.setItem('module', 'RISKS');
          return this.ValidateRiskSubscription(data.access_token);
        } else {
          if (response.data.riskModule === true && response.data.traansactionModule === true) {
            sessionStorage.setItem('access', 'a');
            sessionStorage.setItem('module', 'BOTH');
            this.props.history.push(`/auth/portal-dashboard`);
          } else if (response.data.riskModule === true) {
            sessionStorage.setItem('access', 'r');
            this.props.history.push(`/auth/modules`);
          } else if (response.data.traansactionModule === true) {
            sessionStorage.setItem('access', 't');
            this.props.history.push(`/auth/modules`);
          } else {
            sessionStorage.setItem('access', 'n');
            this.props.history.push(`/auth/modules`);
          }
        }
      }
    }
  };
  ValidateRiskSubscription = async (token) => {
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: token,
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else {
        this.props.history.push(`/auth/risk-subscription`);
      }
    } else {
      console.log(res.data);
      sessionStorage.setItem('riskStatus', res.data.status);
      if (res.data.status === 'ACTIVE') {
        this.props.history.push(`/auth/risk-portal`);
      } else {
        let expiry = res.data.planRenewalExpiryDate ? new Date(res.data.planRenewalExpiryDate) : null;
        let date = new Date();
        // date.setDate(date.getDate() - 15);
        if (res.data.status === 'INACTIVE' && res.data.paymentDeclined && expiry && expiry > date) {
          sessionStorage.setItem('riskStatus', 'INACTIVE_TIMEOUT');
          // this.props.history.push(`/auth/risk-payment`);
          this.props.history.push(`/auth/risk-portal`);
        } else {
          this.props.history.push(`/auth/risk-subscription`);
        }
      }
    }
  };
  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };
  handleSimple = (event) => {
    this.setState(validate(event.target.value, event.target.name, this.state, [{ type: 'required' }], this.error));
  };
  handleCallingCode = (event) => {
    let obj = event.target.value;
    this.setState({ [event.target.name]: obj.callingCodes[0] });
    this.setState(validate(obj.callingCodes[0], 'callingCode', this.state, [{ type: 'required' }], this.error));
  };
  handleToggle() {
    this.setState({
      checked: !this.state.checked,
    });
  }
  handleOTPClose = () => {
    this.setState(this.initialState);
    this.setState({ showVerifyOTPModal: false, isOTPDialog: false });
  };
  getEmailOTP = async () => {
    if (this.state.email !== '') {
      const data = { source: this.state.email, type: 'EMAIL' };
      this.setState({ callInProgress: true });
      const res = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_EMAIL_SEND_OTP, data);
      // const res = await apiHandler({
      //   method: "POST",
      //   url: endpoint.USER_EMAIL_SEND_OTP,
      //   data: data
      // });
      this.setState({ callInProgress: false });
      if (res.data.errorCode) {
        this.setState({
          noticeModal: true,
          noticeModalErrMsg: res.data.userDesc,
        });
        return;
      } else {
        this.setState({ showVerifyOTPModal: true, isOTPDialog: true });
      }
    } else {
      this.setState({
        noticeModal: true,
        noticeModalErrMsg: 'Please provide Email ID to get OTP',
      });

      return;
    }
  };
  verifyOTP = async () => {
    const data = { source: this.state.email, otp: this.state.emailOTPCode };
    this.setState({ callInProgress: true });
    const res = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_EMAIL_VERIFY_OTP, data);
    // const res = await apiHandler({
    //   method: "POST",
    //   url: endpoint.USER_EMAIL_VERIFY_OTP,
    //   data: data
    // });
    if (res.data.errorCode) {
      this.setState({
        callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: res.data.userDesc,
      });
      return;
    } else {
      this.setState(
        {
          showVerifyOTPModal: false,
          isEmailVerified: true,
          isOTPDialog: false,
        },
        () => {
          this.submitUser();
        }
      );
    }
  };
  resetOTP = async () => {
    const data = { source: this.state.email, type: 'EMAIL' };
    this.setState({ callInProgress: true });
    const response = await axios.post(endpoint.BASE_URL_STAGING_AXIOS + endpoint.USER_EMAIL_SEND_OTP, data);
    this.setState({ callInProgress: false });
    if (response.data.error) {
      this.setState({
        callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: response.data.error_description,
      });
    } else {
      this.setState({
        callInProgress: false,
        noticeModal: true,
        noticeModalErrMsg: 'Please check your Email for new OTP code.',
      });
    }
  };
  componentDidMount = async () => {
    const { match } = this.props;
    if (match.params.emailId) {
      this.setState({ email: match.params.emailId, preRegisteredUser: true });
    }
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
    this.setState({ countries: countries });

    // // Get country http://ip-api.com/json
    // axios.get("http://ip-api.com/json").then(
    //   response => {
    //     const countryCode = response.data.countryCode;
    //   });
    //   },
    //   () => {}
    // );
  };

  componentDidUpdate(e) {
    if (!this.state.signUpModal && !this.state.noticeModal) {
      e.history.go(-1);
    }
  }

  render() {
    const { classes } = this.props;
    // const callingCodeLabelClasses = classNames({
    //   [" " + classes.labelRootError]: this.state.callingCodeState === "error",
    //   [" " + classes.labelRootSuccess]:
    //     this.state.callingCodeState === "success" &&
    //     !(this.state.callingCodeState === "error")
    // });
    const module = sessionStorage.getItem('module');
    return (
      <div className={cx(classes.container, classes.cardSignup)}>
        {this.state.isOTPDialog ? (
          <>
            {this.state.callInProgress ? (
              <CircularProgresss callInProgress={this.state.callInProgress} />
            ) : (
              <>
                {/* OTP screen */}
                <Dialog
                  classes={{
                    root: classes.center + ' ' + classes.modalRoot,
                    paper: classes.modal,
                  }}
                  open={this.state.showVerifyOTPModal}
                  disableBackdropClick
                  disableEscapeKeyDown
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={() => this.handleOTPClose()}
                  aria-labelledby="classic-modal-slide-title"
                  aria-describedby="classic-modal-slide-description"
                >
                  <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)}>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.handleOTPClose()}>
                      <CloseIcon />
                    </IconButton>

                    <h3 className={cx(classes.modalTitle, classes.otpModalTitle)}>Signup</h3>
                    <h5 className={classes.subTitleOTP}>{"Enter your OTP Code sent on your email: " + this.state.email}</h5>
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
                                success={this.state.emailOTPCodeState === 'success'}
                                error={this.state.emailOTPCodeState === 'error'}
                                helpText={this.state.emailOTPCodeState === 'error' && this.state.emailOTPCodeErrorMsg[0]}
                                labelText="OTP Code"
                                id="lp_emailOTPCode"
                                formControlProps={{
                                  fullWidth: false,
                                  onChange: (event) => {
                                    this.change(event, 'emailOTPCode', [{ type: 'required' }]);
                                  },
                                }}
                              />
                            </GridItem>
                          </GridContainer>
                          <div className={classes.center}>
                            <Button size="lg" style={{ backgroundColor: primaryColor[5] }} onClick={() => this.verifyOTP()}>
                              VERIFY
                            </Button>
                          </div>
                          <div>
                            <a style={{ cursor: 'pointer' }} onClick={() => this.resetOTP()}>
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
            {this.state.callInProgress ? (
              <CircularProgresss callInProgress={this.state.callInProgress} />
            ) : (
              <>
                <Dialog
                  classes={{
                    root: classes.center + ' ' + classes.modalRoot,
                    paper: classes.modal + ' ' + classes.loginMaxWidth,
                  }}
                  open={this.state.signUpModal}
                  disableBackdropClick
                  disableEscapeKeyDown
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={() => this.handleClose('signUpModal')}
                  aria-labelledby="classic-modal-slide-title"
                  aria-describedby="classic-modal-slide-description"
                >
                  <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)}>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.handleClose('signUpModal')}>
                      <CloseIcon />
                    </IconButton>
                    {this.props.location.state && this.props.location.state.notProspectDemoUser ? (
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
                                success={this.state.firstNameState === 'success'}
                                error={this.state.firstNameState === 'error'}
                                helpText={this.state.firstNameState === 'error' && this.state.firstNameErrorMsg[0]}
                                labelText="First Name*"
                                id="sp_firstName"
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({ firstNamePristine: false });
                                    this.change(event, 'firstName', [
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
                                    if (!this.state.firstNamePristine) {
                                      this.setState({
                                        firstNamePristine: false,
                                      });
                                      this.change(event, 'firstName', [
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
                                success={this.state.lastNameState === 'success'}
                                error={this.state.lastNameState === 'error'}
                                helpText={this.state.lastNameState === 'error' && this.state.lastNameErrorMsg[0]}
                                labelText="Last Name*"
                                id="sp_lastName"
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({ lastNamePristine: false });
                                    this.change(event, 'lastName', [
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
                                    if (!this.state.lastNamePristine) {
                                      this.setState({
                                        lastNamePristine: false,
                                      });
                                      this.change(event, 'lastName', [
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
                                success={this.state.emailState === 'success'}
                                error={this.state.emailState === 'error'}
                                helpText={this.state.emailState === 'error' && this.state.emailErrorMsg[0]}
                                labelText="Corporate email address*"
                                id="sp_email"
                                inputProps={{
                                  value: this.state.email,
                                  disabled: this.state.preRegisteredUser || this.state.isEmailVerified,
                                  onChange: (event) => this.handleEmailChange(event),
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({ emailPristine: false });
                                    this.change(event, 'email', [{ type: 'required' }, { type: 'email' }]);
                                    this.ValidateExistingEmailId(event.target.value);
                                  },
                                  onChange: (event) => {
                                    if (!this.state.emailPristine) {
                                      this.setState({ emailPristine: false });
                                      this.change(event, 'email', [{ type: 'required' }, { type: 'email' }]);
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
                                  success={this.state.callingCodeState === 'success'}
                                  error={this.state.callingCodeState === 'error'}
                                  helpText={this.state.callingCodeState === 'error' && this.state.callingCodeErrorMsg[0]}
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
                                  value={this.state.callingCodeObj}
                                  onChange={this.handleCallingCode}
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
                                  {this.state.countries.map((item) => (
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
                                success={this.state.phoneNumberState === 'success'}
                                error={this.state.phoneNumberState === 'error'}
                              >
                                Phone Number*
                              </FormHelperText>
                              <CustomNumberFormat
                                success={this.state.phoneNumberState === 'success'}
                                error={this.state.phoneNumberState === 'error'}
                                helpText={this.state.phoneNumberState === 'error' ? this.state.phoneNumberErrorMsg[0] : this.state.phoneNumberHelpMsg}
                                id="sp_phoneNumber"
                                value={this.state.phoneNumber}
                                // labelText="Phone Number*"
                                format="###-###-####"
                                formControlProps={{
                                  fullWidth: true,
                                  className: cx(classes.customFormControlClasses, classes.phoneFormControl),
                                  onBlur: (event) => {
                                    this.setState({
                                      phoneNumberPristine: false,
                                    });
                                    this.change(event, 'phoneNumber', [{ type: 'required' }, { type: 'phone' }]);
                                  },
                                  onChange: (event) => {
                                    if (!this.state.phoneNumberPristine) {
                                      this.setState({
                                        phoneNumberPristine: false,
                                      });
                                      this.change(event, 'phoneNumber', [{ type: 'required' }, { type: 'phoneNumber' }]);
                                    }
                                  },
                                }}
                              /> */}
                              <CustomInput
                                success={this.state.phoneNumberState === 'success'}
                                error={this.state.phoneNumberState === 'error'}
                                helpText={this.state.phoneNumberState === 'error' && this.state.phoneNumberErrorMsg[0]}
                                labelText="Phone Number*"
                                id="sp_phoneNumber"
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({ phoneNumberPristine: false });
                                    this.change(event, 'phoneNumber', [{ type: 'required' }]);
                                  },
                                  onChange: (event) => {
                                    if (!this.state.phoneNumberPristine) {
                                      this.setState({ phoneNumberPristine: false });
                                      this.change(event, 'phoneNumber', [{ type: 'required' }]);
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
                                success={this.state.companyNameState === 'success'}
                                error={this.state.companyNameState === 'error'}
                                helpText={this.state.companyNameState === 'error' && this.state.companyNameErrorMsg[0]}
                                labelText="Company Name*"
                                id="sp_companyName"
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({
                                      companyNamePristine: false,
                                    });
                                    this.change(event, 'companyName', [
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
                                    if (!this.state.companyNamePristine) {
                                      this.setState({
                                        companyNamePristine: false,
                                      });
                                      this.change(event, 'companyName', [
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
                            success={this.state.addressState === 'success'}
                            error={this.state.addressState === 'error'}
                            helpText={this.state.addressState === 'error' && this.state.addressErrorMsg[0]}
                            labelText="Address"
                            id="sp_address"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: (event) => {
                                this.setState({ companyNamePristine: false });
                                this.change(event, 'address', []);
                              },
                              onChange: (event) => {
                                if (!this.state.companyNamePristine) {
                                  this.setState({ companyNamePristine: false });
                                  this.change(event, 'address', []);
                                }
                              },
                            }}
                          />
                        </GridItem>
                        <GridItem xs={11} sm={11} md={11} lg={11} className={classes.alignPadding}>
                          <GridContainer>
                            <GridItem xs={12} sm={10} md={4}>
                              <CustomInput
                                success={this.state.cityState === 'success'}
                                error={this.state.cityState === 'error'}
                                helpText={this.state.cityState === 'error' && this.state.cityErrorMsg[0]}
                                labelText="City"
                                id="sp_city"
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({ cityPristine: false });
                                    this.change(event, 'city', []);
                                  },
                                  onChange: (event) => {
                                    if (!this.state.cityPristine) {
                                      this.setState({ cityPristine: false });
                                      this.change(event, 'city', []);
                                    }
                                  },
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={10} md={4}>
                              <CustomInput
                                success={this.state.postalCodeState === 'success'}
                                error={this.state.postalCodeState === 'error'}
                                helpText={this.state.postalCodeState === 'error' && this.state.postalCodeErrorMsg[0]}
                                labelText="Postal Code"
                                id="sp_postalCode"
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: (event) => {
                                    this.setState({
                                      postalCodePristine: false,
                                    });
                                    this.change(event, 'postalCode', []);
                                  },
                                  onChange: (event) => {
                                    if (!this.state.postalCodePristine) {
                                      this.setState({
                                        postalCodePristine: false,
                                      });
                                      this.change(event, 'postalCode', []);
                                    }
                                  },
                                }}
                              />
                            </GridItem>
                            {/* <GridItem xs={12} sm={10} md={4}>
                      <CustomInput
                        success={this.state.countryState === "success"}
                        error={this.state.countryState === "error"}
                        helpText={
                          this.state.countryState === "error" &&
                          this.state.countryErrorMsg[0]
                        }
                        labelText="Country*"
                        id="sp_country"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({ countryPristine: false });
                            this.change(event, "country", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.countryPristine) {
                              this.setState({ countryPristine: false });
                              this.change(event, "country", [
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
                                  success={this.state.countryState === 'success'}
                                  error={this.state.countryState === 'error'}
                                  helpText={this.state.countryState === 'error' && this.state.countryErrorMsg[0]}
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
                                  value={this.state.country}
                                  onChange={this.handleSimple}
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
                                  {this.state.countries.map((item) => (
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
                                    success={this.state.passwordState === 'success'}
                                    error={this.state.passwordState === 'error'}
                                    helpText={this.getPasswordHelpText()}
                                    labelText="Password*"
                                    id="sp_password"
                                    formControlProps={{
                                      fullWidth: true,
                                      className: classes.customFormControlClasses,
                                      onBlur: (event) => {
                                        this.setState({
                                          passwordPristine: false,
                                        });
                                        this.change(event, 'password', [
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
                                        if (!this.state.passwordPristine) {
                                          this.setState({
                                            passwordPristine: false,
                                          });
                                          this.change(event, 'password', [
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
                                    success={this.state.passwordConfirmationState === 'success'}
                                    error={this.state.passwordConfirmationState === 'error'}
                                    helpText={this.state.passwordConfirmationState === 'error' && this.state.passwordConfirmationErrorMsg[0]}
                                    labelText="Password Confirmation*"
                                    id="sp_passwordConfirmation"
                                    formControlProps={{
                                      fullWidth: true,
                                      className: classes.customFormControlClasses,
                                      onBlur: (event) => {
                                        this.setState({
                                          passwordPristine: false,
                                        });
                                        this.change(event, 'passwordConfirmation', [
                                          { type: 'required' },
                                          {
                                            type: 'matchPassword',
                                            params: this.state.password,
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
                                        if (!this.state.passwordConfirmationPristine) {
                                          this.setState({
                                            passwordConfirmationPristine: false,
                                          });
                                          this.change(event, 'passwordConfirmation', [
                                            { type: 'required' },
                                            {
                                              type: 'matchPassword',
                                              params: this.state.password,
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
                                    onClick={() => this.handleToggle()}
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
                                <Button round={false} color="info" size="lg" onClick={this.submit}>
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
          open={this.state.noticeModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose('noticeModal')}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle id="notice-modal-slide-title" disableTypography className={classes.modalHeader}>
            <h4 className={classes.modalTitle}>{this.state.noticeModalErrMsg === '' ? 'Success' : 'Error'}</h4>
          </DialogTitle>
          <DialogContent id="notice-modal-slide-description" className={classes.modalBody}>
            {this.props.location.state && this.props.location.state.notProspectDemoUser ? (
              <p>
                {this.state.noticeModalErrMsg === ''
                  ? module === 'RISKS'
                    ? 'You have successfully signed up. You will now receive an email from us and then you can login and proceed to select your plan.'
                    : 'You have successfully signed up. You will now receive an email from us and then you can login and register as customer. Please check your email'
                  : this.state.noticeModalErrMsg}
              </p>
            ) : (
              <p>
                {this.state.noticeModalErrMsg === ''
                  ? 'You have successfully signed up for Demo. You will now receive an email from us and then you can login. Please check your email'
                  : this.state.noticeModalErrMsg}
              </p>
            )}
          </DialogContent>
          <DialogActions className={classes.modalFooter + ' ' + classes.modalFooterCenter}>
            <Button onClick={() => this.handleClose('noticeModal')} color="info" round>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SignupPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  history:  PropTypes.object,
  match: PropTypes.object,
};

export default withStyles(style)(SignupPage);
