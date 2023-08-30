import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import { validate } from "../../utils/Validator";
import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import { primaryColor } from "assets/jss/material-dashboard-pro-react.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const ForgotPasswordPage = props => {
  let error = {
    passwordErrorMsg: {
      required: "Password is required",
      range: "Password should be 8 to 16 characters",
      password:
        "Match contain Capital, Alphanumeric character, number and special characters( ~!@#$%^&*()_+)"
    }
  };
  // we use this to make the card to appear after the page has been rendered
  const [forgotPasswordModal, setForgotPasswordModal] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState([]);
  const [otpCode, setOTPCode] = useState("");
  const [isEmailVerified, setEmailVerified] = useState(false);
  const [isNoticeModal, setNoticeModal] = useState(false);
  const [noticeModalMsg, setNoticeModalMsg] = useState("");
  const [noticeModalHeader, setNoticeModalHeader] = useState("");
  const [isCallInProgress, setCallInProgress] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  const { classes } = props;
  let history = useHistory();

  const handleClose = e => {
    e.preventDefault();
    setForgotPasswordModal(false);
    history.go(-1);
  };

  const generateOTP = async e => {
    e.preventDefault();
    const data = {
      username: email
    };
    setCallInProgress(true);

    const res = await apiHandler({
      url: endpoint.FORGET_PASSWORD,
      method: "POST",
      data: data,
      authToken: sessionStorage.getItem("token")
    });
    setCallInProgress(false);
    if (res.data.errorCode) {
      setNoticeModalMsg("Please provide the valid registered Email Address");
      setNoticeModal(true);
    } else {
      setEmailVerified(true);
    }
  };
  const handleResetPasswordSubmit = async e => {
    e.preventDefault();
    if (passwordState === "" || passwordState === "error") {
      setPasswordState("error");
      return;
    }
    const data = {
      username: email,
      password: password,
      otp: otpCode
    };
    setCallInProgress(true);
    // CHANGE_PASSWORD
    const res = await apiHandler({
      url: endpoint.CHANGE_PASSWORD,
      method: "POST",
      data: data,
      authToken: sessionStorage.getItem("token")
    });
    setCallInProgress(false);
    // console.log(response);
    if (res.data.errorCode) {
      setModalClose(false);
      setNoticeModalMsg(
        "Please recheck your Email Id and email for valid OTP code."
      );
      setNoticeModal(true);
    } else {
      setModalClose(true);
      setNoticeModalMsg(
        "your password has been successfully reset, and you can login"
      );
      setNoticeModalHeader("SUCCESS");
      setNoticeModal(true);
      // history.go(-1);
    }
  };
  const getPasswordHelpText = () => {
    let helpText =
      "Password should be between 8 and 16 characters; One upper & lower case letter and must contain alphanumeric as well as special characters ( ~!@#$%^&*()_+)";
    return passwordState === "error" ? passwordErrorMsg[0] : helpText;
  };
  const componentDidUpdate = () => {
    if (!forgotPasswordModal) {
      history.go(-1);
    }
  };
  useEffect(() => {
    componentDidUpdate();
  }, []);

  const changePassword = (value, stateName, setValue, setState, rules) => {
    const vState = validate(value, stateName, setState, rules, error);
    setState(vState.passwordState);
    setValue(vState[stateName]);
    setPasswordErrorMsg(vState.passwordErrorMsg);
  };
  const change = (event, stateName) => {
    stateName(event.target.value);
  };
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalMsg("");
    setNoticeModalHeader("");
    if (modalClose) {
      history.push("/home/login-page");
    }
  };
  return (
    <div className={cx(classes.container)}>
      <Dialog
        classes={{
          root: classes.modalRoot,
          paper: classes.modal + " " + classes.forgotModal
        }}
        open={forgotPasswordModal}
        TransitionComponent={Transition}
        disableBackdropClick
        disableEscapeKeyDown
        keepMounted
        onClose={() => handleClose()}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={cx(classes.modalHeader)}
        >
          <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>
            Reset your Password
          </h3>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={e => handleClose(e)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={cx(classes.modalBody)}
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12} >
              <form>
                <CustomInput
                  labelText="Email address"
                  id="fpp_email"
                  formControlProps={{
                    fullWidth: true,
                    style:{ marginBottom: 5 }
                  }}
                  inputProps={{
                    onChange: event => {
                      change(event, setEmail);
                    },
                    endAdornment: (
                      <InputAdornment position="start">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
                {!isEmailVerified && isCallInProgress && <CircularProgress />}
                {!isEmailVerified && !isCallInProgress && (
                  <Button
                    size="lg"
                    style={{ backgroundColor: primaryColor[5] }}
                    onClick={e => generateOTP(e)}
                  >
                    Verify Email
                  </Button>
                )}

                {isEmailVerified && (
                  <React.Fragment>
                    <div>
                      <h5>
                        Please input new password chosen by you along with the OTP you would have received in your email to reset the password.
                      </h5>
                    </div>
                    <CustomInput
                      success={passwordState === "success"}
                      error={passwordState === "error"}
                      helpText={getPasswordHelpText()}
                      labelText="New Password"
                      id="fpp_password"
                      formControlProps={{
                        fullWidth: true,
                        style:{ marginBottom: 5 },
                        onChange: event => {
                          changePassword(
                            event.target.value,
                            "password",
                            setPassword,
                            setPasswordState,
                            [
                              { type: "required" },
                              {
                                type: "length",
                                params: {
                                  min: 8,
                                  max: 16
                                }
                              },
                              { type: "password" }
                            ]
                          );
                        }
                      }}
                      inputProps={{
                        // onChange: event => {
                        //   change(event, setPassword);
                        // },
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="start">
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="OTP Code"
                      id="fpp_otpcode"
                      formControlProps={{ fullWidth: true, style:{ marginBottom: 5 } }}
                      inputProps={{
                        onChange: event => {
                          change(event, setOTPCode);
                        }
                      }}
                    />
                    <div className={classes.center}>
                      {isCallInProgress ? (
                        <CircularProgress />
                      ) : (
                        <Button
                          round={false}
                          color="info"
                          size="lg"
                          onClick={e => handleResetPasswordSubmit(e)}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                )}
              </form>
            </GridItem>
          </GridContainer>
          {isNoticeModal && (
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal
              }}
              open={isNoticeModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => closeNoticeModal()}
              aria-labelledby="notice-modal-slide-title"
              aria-describedby="notice-modal-slide-description"
            >
              <DialogTitle
                id="notice-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
              >
                <h4 className={classes.modalTitle}>
                  {noticeModalHeader === "" ? "Error" : noticeModalHeader}
                </h4>
              </DialogTitle>
              <DialogContent
                id="notice-modal-slide-description"
                className={classes.modalBody}
              >
                <p>{noticeModalMsg}</p>
              </DialogContent>
              <DialogActions
                style={{ justifyContent: "center" }}
                className={
                  classes.modalFooter + " " + classes.modalFooterCenter
                }
              >
                <Button onClick={() => closeNoticeModal()} color="info" round>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

ForgotPasswordPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(ForgotPasswordPage);
