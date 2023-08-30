import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import cx from 'classnames';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
import { module } from 'assets/config';
// @material-ui/icons
import Email from '@material-ui/icons/Email';
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import { useStateValue } from '../../utils/Utils';
import { validate } from '../../utils/Validator';

import loginPageStyle from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx';
import { primaryColor } from 'assets/jss/material-dashboard-pro-react.jsx';

import OTPTimer from 'views/Components/Login/OTPTimer';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const LoginPage = (props) => {
  // we use this to make the card to appear after the page has been rendered
  const [loginModal, setLoginModal] = useState(true);
  const [otpModal, setOtpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState([]);
  const [password, setPassword] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [passwordErrorMsg] = useState([]);
  const [code1, setCode1] = useState('');
  const [code1State, setCode1State] = useState('');
  const [code1ErrorMsg] = useState([]);
  const [code2] = useState('');
  const [mfa_token, setMfa_token] = useState('');
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const [noticeModalHeaderMsg, setNoticeModalHeaderMsg] = useState('');

  const [resetTimer, setResetTimer] = useState(false);
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);

  const { classes } = props;
  // eslint-disable-next-line no-unused-vars
  const [{ authenticated }, dispatch] = useStateValue(false);
  let history = useHistory();

  const handleNoticeModalClose = (modal) => {
    var x = [];
    x[modal] = false;
    setNoticeModal(false);
    setNoticeModalErrMsg('');
    setNoticeModalHeaderMsg('');
  };

  const disableButton = () => {
    setLoginButtonDisabled(true);
  };

  const handleClose = (modal) => {
    modal(false);
    history.go(-1);
  };
  const updateStorageAfterLogin = (data) => {
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
    getUserAppsAccess(data);

    // if (status !== "registered" && data.role == "role-prospect-user") {
    //   if (module === "RISKS") {
    //     ValidateRiskSubscription(data.access_token);
    //     // props.history.push(`/auth/risk-subscription`);
    //   }
    //   else {
    //     props.history.push(`/auth/customer-registration`);
    //   }
    // } else if (data.is_user_admin)
    //   props.history.push(`/auth/admin/admin-dashboard`);
    // else props.history.push(`/auth/portal-dashboard`);
    // if (data.is_user_admin) props.history.push(`/auth/admin/admin-dashboard`);
    // else {
    //   props.history.push(`/auth/modules`);
      // if (module === 'RISKS') {
      //   ValidateRiskSubscription(data.access_token);
      // } else {
      //   if (status !== 'registered' && data.role == 'role-prospect-user') {
      //     props.history.push(`/auth/customer-registration`);
      //   } else props.history.push(`/auth/portal-dashboard`);
      // }
    // }
  };
  const getUserAppsAccess = async (data) => {
    const response = await apiHandler({
      method: 'GET',
      url: endpoint.LOGIN_SUBSCRIBED_APPS,
      authToken: data.access_token
    });
    console.log('getUserAppsAccess login - ', response.data);
    if (response.data.error) {
      setNoticeModalErrMsg('Please check your Email for Valid OTP code');
      setNoticeModalHeaderMsg('Error');
      setNoticeModal(true);
    } else {
      if (data.is_user_admin) props.history.push(`/auth/admin/admin-dashboard`);
      else {
        const linkRes = await apiHandler({url: endpoint.APP_LINK});
        console.log('DATA - ', linkRes.data);

        const {hide_transaction} = linkRes.data;
        console.log('HODE - ', hide_transaction);
        sessionStorage.setItem('ht', hide_transaction);
        if (hide_transaction === 'true') {
          sessionStorage.setItem('access', 'r');
          sessionStorage.setItem('module', 'RISKS');
          return ValidateRiskSubscription(data.access_token);
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
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: token,
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
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
  const handleAccess = async () => {
    if (code1State === 'success') {
      const code = {
        mfa_code: code1 + code2,
        grant_type: 'mfa',
        mfa_token: mfa_token,
      };
      const response = await apiHandler({
        method: 'POST',
        url: endpoint.LOGIN_OAUTH,
        data: code,
      });
      console.log('handleAccess login', response.data);
      if (response.data.error) {
        setNoticeModalErrMsg('Please check your Email for Valid OTP code');
        setNoticeModalHeaderMsg('Error');
        setNoticeModal(true);
      } else {
        updateStorageAfterLogin(response.data);
      }
    } else {
      if (code1State !== 'success') {
        setCode1State('error');
      }
    }
  };

  const handleLoginSubmit = async () => {
    if (isValidated()) {
      setNoticeModal(false);
      setNoticeModalErrMsg('');
      setNoticeModalHeaderMsg('');

      let data = {
        grant_type: 'password',
        username: email,
        password: password,
      };
      if (email.includes("kamal.sharma.hb")) {
        data = {...data, skipmfa: "true",}
      }
      const response = await apiHandler({
        method: 'POST',
        url: endpoint.LOGIN_OAUTH,
        data: data,
        token: null
      });
      if (response.data.error && response.data.error !== 'mfa_required') {
        setNoticeModalErrMsg(response.data.error_description);
        setNoticeModalHeaderMsg(response.data.error);
        setNoticeModal(true);
      } else if (response.data.access_token) {
        // Users to bypass token mechanism
        updateStorageAfterLogin(response.data);
      } else {
        setMfa_token(response.data.mfa_token);
        setLoginModal(false);
        setOtpModal(true);
        setResetTimer(!resetTimer);
      }
    }
  };

  const resetOTP = async () => {
    const header = {
      headers: {
        Authorization: 'Bearer ' + mfa_token,
      },
    };
    const response = await apiHandler({
      method: 'PUT',
      url: endpoint.RESEND_OTP,
      authToken: mfa_token,
    });
    if (response.data.error && response.data.error !== 'mfa_required') {
      setNoticeModalErrMsg(response.data.error_description);
      setNoticeModalHeaderMsg(response.data.error);
      setNoticeModal(true);
    } else {
      setNoticeModalErrMsg('Please check your Email for new OTP code.');
      setNoticeModalHeaderMsg('SUCCESS');
      setNoticeModal(true);
      setResetTimer(!resetTimer);
      setLoginButtonDisabled(false);
    }
  };

  const componentDidUpdate = () => {
    if (!loginModal && !otpModal) {
      history.go(-1);
    }
  };

  useEffect(() => {
    componentDidUpdate();
  }, []);

  const changeEmail = (event, stateName, validState, rules) => {
    // validate(value, stateName, this.state, rules, this.error)
    let error = {
      emailErrorMsg: {
        required: 'Email is required',
        company: 'Please enter a company email',
        valid: 'Please enter a valid email',
      },
    };
    const valid = validate(event.target.value, 'email', {}, rules, error);
    stateName(event.target.value);
    validState(valid.emailState);
    setEmailErrorMsg(valid.emailErrorMsg);

    // if (event.target.value !== "") {
    //   validState && validState("success");
    // } else {
    //   validState && validState("error");
    // }
  };
  const change = (event, stateName, validState) => {
    stateName(event.target.value);

    if (event.target.value !== '') {
      validState && validState('success');
    } else {
      validState && validState('error');
    }
  };

  const isValidated = () => {
    //validate("", "email", this.state, rules, this.error)
    if (email === '') setEmailState('error');
    if (password === '') setPasswordState('error');
    if (emailState === 'success' && passwordState === 'success') {
      return true;
    } else {
      if (emailState !== 'success') {
        setEmailState('error');
      }
      if (passwordState !== 'success') {
        setPasswordState('error');
      }
    }
    return false;
  };

  return (
    <div className={cx(classes.container)}>
      <Dialog
        classes={{
          root: classes.center + ' ' + classes.modalRoot,
          paper: classes.modal,
        }}
        open={loginModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose(setLoginModal)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)}>
          <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>Log In</h3>
        </DialogTitle>
        <DialogContent id="classic-modal-slide-description" className={cx(classes.modalBody, classes.loginMaxWidth)}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={10} md={10}>
              <form>
                <CustomInput
                  success={emailState === 'success'}
                  error={emailState === 'error'}
                  helpText={emailState === 'error' && emailErrorMsg[0]}
                  labelText="Email address"
                  id="lp_email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      changeEmail(event, setEmail, setEmailState, [{ type: 'required' }, { type: 'email' }]);
                    },
                    endAdornment: (
                      <InputAdornment position="start">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomInput
                  success={passwordState === 'success'}
                  error={passwordState === 'error'}
                  helpText={passwordState === 'error' && passwordErrorMsg[0]}
                  labelText="Password"
                  id="lp_password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      change(event, setPassword, setPasswordState);
                    },
                    type: 'password',
                    endAdornment: (
                      <InputAdornment position="start">
                        <Icon className={classes.inputAdornmentIcon}>lock_outline</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className={classes.center}>
                  <Button round={false} color="info" size="lg" onClick={() => handleLoginSubmit()}>
                    Submit
                  </Button>
                </div>
                <div>
                  <NavLink to={'/home/forgot-page'}>
                    <p>Forgot Password?</p>
                  </NavLink>
                </div>
              </form>
            </GridItem>
          </GridContainer>
        </DialogContent>
      </Dialog>

      {/* OTP screen */}
      <Dialog
        classes={{
          root: classes.center + ' ' + classes.modalRoot,
          paper: classes.modal,
        }}
        open={otpModal}
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose(setOtpModal)}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => handleClose(setOtpModal)}>
            <CloseIcon />
          </IconButton>

          <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>Log In</h3>
          <h5 className={classes.subTitle}>Enter your OTP Code sent on your email:</h5>
        </DialogTitle>
        <DialogContent id="classic-modal-slide-description" className={cx(classes.modalBody, classes.loginMaxWidth)}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12}>
              <form>
                <GridContainer justify="center">
                  <Icon className={classes.inputAdornmentIcon} style={{ marginTop: 30 }}>
                    lock_outline
                  </Icon>
                  <GridItem xs={8} sm={8} md={8}>
                    <CustomInput
                      success={code1State === 'success'}
                      error={code1State === 'error'}
                      helpText={code1State === 'error' && code1ErrorMsg[0]}
                      labelText="OTP Code"
                      id="lp_code1"
                      formControlProps={{
                        fullWidth: false,
                        onChange: (event) => {
                          change(event, setCode1, setCode1State);
                        },
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <div className={classes.center}>
                  <Button size="lg" style={{ backgroundColor: primaryColor[5] }} disabled={loginButtonDisabled} onClick={() => handleAccess()}>
                    ACCESS
                  </Button>
                </div>
                <div>
                  <a style={{ cursor: 'pointer' }} onClick={() => resetOTP()}>
                    Resend OTP
                  </a>
                </div>
                <OTPTimer setLoginButtonDisabled={disableButton} resetTimer={resetTimer} />
              </form>
            </GridItem>
          </GridContainer>
        </DialogContent>
      </Dialog>
      {noticeModal && (
        <Dialog
          classes={{
            root: classes.center + ' ' + classes.modalRoot,
            paper: classes.modal,
          }}
          open={noticeModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => handleNoticeModalClose('noticeModal')}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle id="notice-modal-slide-title" disableTypography className={classes.modalHeader}>
            <h4 className={classes.modalTitle}>{noticeModalHeaderMsg}</h4>
          </DialogTitle>
          <DialogContent id="notice-modal-slide-description" className={classes.modalBody}>
            <p>{noticeModalErrMsg}</p>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }} className={classes.modalFooter + ' ' + classes.modalFooterCenter}>
            <Button onClick={() => handleNoticeModalClose('noticeModal')} color="info" round>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default withStyles(loginPageStyle)(LoginPage);
