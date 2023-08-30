import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import cx from "classnames";
import { validate } from "utils/Validator";
import classNames from "classnames";
import NoticeModal from "views/Components/NoticeModal.jsx";
import { useHistory } from "react-router-dom";
import axios from "axios";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import Phone from "@material-ui/icons/Phone";
import Work from "@material-ui/icons/Work";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import contactUsPageStyle from "assets/jss/material-dashboard-pro-react/views/contactUsPageStyle";
import { formatMoney, formatDate } from "utils/Utils";
import styles from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ContactUsModal = ({ showModal, closeModal, countries, userDetails }) => {
  const classes = useStyles();
  const [callInProgress, setCallInProgress] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState("");
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState("");
  const [needToCloseModal, setNneedToCloseModal] = useState(false);

  const error = {
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
      valid: "Please enter a valid company name",
      range: "Company Name should be 1 to 200 characters"
    },
    queryErrorMsg: {
      required: "Query is required"
    },
    countryCodeErrorMsg: {
      required: "Country is required"
    }
  };

  const rulesList = {
    firstName: [{ type: "required" }],
    lastName: [{ type: "required" }],
    email: [{ type: "required" }, { type: "email" }],
    phoneNumber: [{ type: "required" }, { type: "phone" }],
    companyName: [{ type: "required" }],
    query: [{ type: "required" }],
    countryCode: [{ type: "required" }]
  };

  const [contactInfo, setContactInfo] = useState({
    firstName: userDetails.firstName ? userDetails.firstName : "",
    lastName: userDetails.lastName ? userDetails.lastName : "",
    email: userDetails.email ? userDetails.email : "",
    countryCode: userDetails.phoneNumber ? userDetails.phoneNumber.length > 10 ? userDetails.phoneNumber.substring(0,userDetails.phoneNumber.length-10) : "" : "",
    phoneNumber: userDetails.phoneNumber ? userDetails.phoneNumber.length > 10 ? userDetails.phoneNumber.substring(userDetails.phoneNumber.length-10, userDetails.phoneNumber.length) : userDetails.phoneNumber : "",
    companyName: userDetails.customerName ? userDetails.customerName : "",
    query: ""
  });

  const contactInfoIntialState = {
    firstNameState: "",
    firstNamePristine: true,
    firstNameErrorMsg: [],
    lastNameState: "",
    lastNamePristine: true,
    lastNameErrorMsg: [],
    emailState: "",
    emailPristine: true,
    emailErrorMsg: [],
    countryCodeState: "",
    countryCodePristine: true,
    countryCodeErrorMsg: [],
    phoneNumberState: "",
    phoneNumberPristine: true,
    phoneNumberHelpMsg: "(xxx-xxx-xxxx)",
    phoneNumberErrorMsg: [],
    companyNameState: "",
    companyNamePristine: true,
    companyNameErrorMsg: [],
    queryState: "",
    queryPristine: true,
    queryErrorMsg: []
  };

  const [contactInfoState, setContactInfoState] = useState(
    contactInfoIntialState
  );
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader("");
    setNoticeModalErrMsg("");
    if (needToCloseModal) closeModal();
  };
  const change = (event, stateName, rules) => {
    let value = event.target.value;
    if (stateName === "phoneNumber") {
      value = value.replace(/-/g, "").trim();
      if (value.length > 10) {
        value = value.substring(1, value.length);
      }
    }
    setContactInfoState({
      ...contactInfoState,
      ...validate(value, stateName, contactInfoState, rules, error)
    });
  };

  const handleSimple = event => {
    setContactInfo({ ...contactInfo, countryCode: event.target.value });
    change(event, "countryCode", [{ type: "required" }]);
  };

  const handleChange = (name, event) => {
    let value = event.target.value;
    if (name === "phoneNumber") {
      value = value.replace(/-/g, "").trim();
      if (value.length > 10) {
        value = value.substring(1, value.length);
      }
    }

    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };
  const handleClose = e => {
    closeModal();
  };
  const isValidated = () => {
    let currentState = {};
    let currentStateError = {...contactInfoState};
    if (contactInfoState.firstNameState !== "success") {        
      currentStateError = {
        ...currentStateError,
        ...validate(
          contactInfo.firstName,
          "firstName",
          contactInfoState,
          rulesList.firstName,
          error
        )
      };
    }
    if (contactInfoState.lastNameState !== "success") {
      currentStateError = {
        ...currentStateError,
        ...validate(
          contactInfo.lastName,
          "lastName",
          contactInfoState,
          rulesList.lastName,
          error
        )
      };
    }
    if (contactInfoState.emailState !== "success") {
      currentStateError = {
        ...currentStateError,
        ...validate(
          contactInfo.email,
          "email",
          contactInfoState,
          rulesList.email,
          error
        )
      };
    }
    if (contactInfoState.countryCodeState !== "success") {
      currentStateError = {
        ...currentStateError,
        ...validate(
          contactInfo.countryCode,
          "countryCode",
          contactInfoState,
          rulesList.countryCode,
          error
        )
      };
    }
    if (contactInfoState.phoneNumberState !== "success") {
      let value = contactInfo.phoneNumber;
      value = value.replace(/-/g, "").trim();
      if (value.length > 10) {
        value = value.substring(1, value.length);
      }
      currentStateError = {
        ...currentStateError,
        ...validate(
          value,
          "phoneNumber",
          contactInfoState,
          rulesList.phoneNumber,
          error
        )
      };
    }
    if (contactInfoState.companyNameState !== "success") {
      currentStateError = {
        ...currentStateError,
        ...validate(
          contactInfo.companyName,
          "companyName",
          contactInfoState,
          rulesList.companyName,
          error
        )
      };
    }
    if (contactInfoState.queryState !== "success") {
      currentStateError = {
        ...currentStateError,
        ...validate(
          contactInfo.query,
          "query",
          contactInfoState,
          rulesList.query,
          error
        )
      };
    }
    setContactInfoState({
      ...contactInfoState,
      ...currentState,
      ...currentStateError
    });

    if (
      currentStateError.firstName !== "" &&
      currentStateError.lastName !== "" &&
      currentStateError.email !== "" &&
      currentStateError.countryCode !== "" &&
      currentStateError.phoneNumber !== "" &&
      currentStateError.companyName !== "" &&
      currentStateError.query !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const handleSubmit = async () => {
    if (isValidated()) {
      let contactInfoData = {
        ...contactInfo,
        phoneNumber: contactInfo.countryCode + contactInfo.phoneNumber
      };
      setCallInProgress(true);
      const res = await apiHandler({
        method: "POST",
        url: endpoint.CONTACTUS, 
        data: contactInfoData,
        authToken: sessionStorage.getItem("token")
      });
      setCallInProgress(false);
      const data = res.data;
      if (data.errorCode) {
        if (data.errorCode === 401) {
          console.log("Unauthorized Access");
          // history.push("/home/logout");
          return;
        } else {
          setNoticeModalHeader("Error");
          setNoticeModalErrMsg(data.userDesc);
          setNoticeModal(true);   
          setNneedToCloseModal(false); 
        }
      } else {
        setContactInfoState(contactInfoIntialState);
        setContactInfo({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phoneNumber: "",
          companyName: "",
          query: ""
        });
        setNoticeModalHeader("Information");
        setNoticeModalErrMsg("Thank you for your recent enquiry. We are dealing with it, and will get in touch with you as soon as possible");
        setNoticeModal(true);
        setNneedToCloseModal(true); 
      }
    }
  };
  const labelCodeClasses = classNames({
    [" " + classes.labelRootError]:
      contactInfoState.countryCodeState === "error",
    [" " + classes.labelRootSuccess]:
      contactInfoState.countryCodeState === "success"
  });
  const labelPhoneClasses = classNames({
    [" " + classes.labelRootError]:
      contactInfoState.phoneNumberState === "error",
    [" " + classes.labelRootSuccess]:
      contactInfoState.phoneNumberState === "success"
  });

  return (
    <div className={classes.container}>
      <Dialog
        classes={{
          root: classes.center
        }}
        maxWidth="md"
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
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
            onClick={e => handleClose(e)}
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.modalTitle}>
            <span
              style={{
                fontSize: 20,
                lineHeight: "25px",
                textAlign: "center",
                fontWeight: 600
              }}
            >
              Contact Us
            </span>
          </div>
        </DialogTitle>

        <DialogContent
          id="classic-modal-slide-description"
          className={cx(classes.modalBody, classes.loginMaxWidth)}
          justify="center"
        >
          <div className={classes.container}>
            <GridContainer className={classes.marginLeft}>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <form className={classes.form}>
                  <GridContainer justify="center" className={cx(classes.form)}>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem className={classes.textIcon}>
                          <Face
                            xs={1}
                            sm={1}
                            className={classes.inputAdornmentIcon}
                          />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <CustomInput
                            success={
                              contactInfoState.firstNameState === "success"
                            }
                            error={contactInfoState.firstNameState === "error"}
                            helpText={
                              contactInfoState.firstNameState === "error" &&
                              contactInfoState.firstNameErrorMsg[0]
                            }
                            labelText={"First Name*"}
                            id="cu_firstName"
                            inputProps={{
                              value: contactInfo.firstName,
                              onChange: event =>
                                handleChange("firstName", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                setContactInfoState({
                                  ...contactInfoState,
                                  firstNamePristine: false
                                });
                                change(event, "firstName", [
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
                                if (!contactInfoState.firstNamePristine) {
                                  setContactInfoState({
                                    ...contactInfoState,
                                    firstNamePristine: false
                                  });
                                  change(event, "firstName", [
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
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                      <GridContainer spacing={1} alignItems="flex-start">
                        <GridItem xs={1} sm={1} className={classes.textIcon}>
                          {/* <Icon className={classes.inputAdornmentIcon} /> */}
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <CustomInput
                            success={
                              contactInfoState.lastNameState === "success"
                            }
                            error={contactInfoState.lastNameState === "error"}
                            helpText={
                              contactInfoState.lastNameState === "error" &&
                              contactInfoState.lastNameErrorMsg[0]
                            }
                            labelText={"Last Name*"}
                            id="cu_lastName"
                            inputProps={{
                              value: contactInfo.lastName,
                              onChange: event => handleChange("lastName", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                setContactInfoState({
                                  ...contactInfoState,
                                  lastNamePristine: false
                                });
                                change(event, "lastName", [
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
                                if (!contactInfoState.lastNamePristine) {
                                  setContactInfoState({
                                    ...contactInfoState,
                                    lastNamePristine: false
                                  });
                                  change(event, "lastName", [
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
                    <GridItem xs={12} sm={12} md={12} lg={5}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem
                          xs={1}
                          sm={1}
                          md={1}
                          className={classes.textIcon}
                        >
                          <Email className={classes.inputAdornmentIcon} />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <CustomInput
                            success={contactInfoState.emailState === "success"}
                            error={contactInfoState.emailState === "error"}
                            helpText={
                              contactInfoState.emailState === "error" &&
                              contactInfoState.emailErrorMsg[0]
                            }
                            labelText={"Corporate Email*"}
                            id="cu_email"
                            inputProps={{
                              value: contactInfo.email,
                              onChange: event => handleChange("email", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                setContactInfoState({
                                  ...contactInfoState,
                                  emailPristine: false
                                });
                                change(event, "email", [
                                  { type: "required" },
                                  { type: "email" }
                                ]);
                              },
                              onChange: event => {
                                if (!contactInfo.email) {
                                  setContactInfoState({
                                    ...contactInfoState,
                                    emailPristine: false
                                  });
                                  change(event, "email", [
                                    { type: "required" },
                                    { type: "email" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={3}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem
                          xs={1}
                          sm={1}
                          md={1}
                          className={classes.textIcon}
                        />
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                            style={{ marginLeft: 10 }}
                          >
                            <InputLabel
                              htmlFor="type"
                              className={
                                classes.selectLabel + " " + labelCodeClasses
                              }
                            >
                              Country Code*
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              classes={{
                                select: classes.select
                              }}
                              value={contactInfo.countryCode}
                              onChange={(e) => handleSimple(e)}
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
                              {countries.map(item => (
                                <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected
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
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={4}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem
                          xs={1}
                          sm={1}
                          md={1}
                          className={classes.textIcon}
                        >
                          <Phone className={classes.inputAdornmentIcon} />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={10}
                          lg={10}
                        >
                          <InputLabel
                            htmlFor="type"
                            className={
                              classes.selectLabel + " " + labelPhoneClasses
                            }
                          >
                            {"Phone Number*"}
                          </InputLabel>
                          <CustomNumberFormat
                            success={
                              contactInfoState.phoneNumberState === "success"
                            }
                            error={
                              contactInfoState.phoneNumberState === "error"
                            }
                            helpText={
                              contactInfoState.phoneNumberState === "error"
                                ? contactInfoState.phoneNumberErrorMsg[0]
                                : contactInfoState.phoneNumberHelpMsg
                            }
                            id="cu_phoneNumber"
                            // value={contactInfo.phoneNumber}
                            format="###-###-####"
                            value={contactInfo.phoneNumber}
                            onChange={event =>
                              handleChange("phoneNumber", event)
                            }
                            // inputProps={{
                            //   value: contactInfo.phoneNumber,
                            //   onChange: event => handleChange("phoneNumber", event)
                            // }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                setContactInfoState({
                                  ...contactInfoState,
                                  phoneNumberPristine: false
                                });
                                change(event, "phoneNumber", [
                                  { type: "required" },
                                  { type: "phone" }
                                ]);
                              },
                              onChange: event => {
                                if (!contactInfo.phoneNumber) {
                                  setContactInfoState({
                                    ...contactInfoState,
                                    phoneNumberPristine: false
                                  });
                                  change(event, "phoneNumber", [
                                    { type: "required" },
                                    { type: "phoneNumber" }
                                  ]);
                                }
                              }
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer spacing={1} alignItems="flex-end">
                        <GridItem className={classes.textIcon}>
                          <Work className={classes.inputAdornmentIcon} />
                        </GridItem>
                        <GridItem
                          className={classes.customText}
                          xs={10}
                          sm={10}
                          md={11}
                          lg={11}
                        >
                          <CustomInput
                            success={
                              contactInfoState.companyNameState === "success"
                            }
                            error={
                              contactInfoState.companyNameState === "error"
                            }
                            helpText={
                              contactInfoState.companyNameState === "error" &&
                              contactInfoState.companyNameErrorMsg[0]
                            }
                            labelText={"Company Name*"}
                            id="cu_companyName"
                            inputProps={{
                              value: contactInfo.companyName,
                              onChange: event =>
                                handleChange("companyName", event)
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                              onBlur: event => {
                                setContactInfoState({
                                  ...contactInfoState,
                                  companyNamePristine: false
                                });
                                change(event, "companyName", [
                                  { type: "required" },
                                  {
                                    type: "length",
                                    params: {
                                      min: 1,
                                      max: 200
                                    }
                                  }
                                ]);
                              },
                              onChange: event => {
                                if (!contactInfo.companyName) {
                                  setContactInfoState({
                                    ...contactInfoState,
                                    companyNamePristine: false
                                  });
                                  change(event, "companyName", [
                                    { type: "required" },
                                    {
                                      type: "length",
                                      params: {
                                        min: 1,
                                        max: 200
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
                    <GridItem xs={10} sm={10} md={11} lg={11}>
                      <CustomInput
                        success={contactInfoState.queryState === "success"}
                        error={contactInfoState.queryState === "error"}
                        helpText={
                          contactInfoState.queryState === "error" &&
                          contactInfoState.queryErrorMsg[0]
                        }
                        labelText={"Query*"}
                        id="cu_query"
                        inputProps={{
                          multiline: true,
                          rows: 2,
                          value: contactInfo.query,
                          onChange: event => handleChange("query", event)
                        }}
                        formControlProps={{
                          fullWidth: true,
                          onBlur: event => {
                            setContactInfoState({
                              ...contactInfoState,
                              queryPristine: false
                            });
                            change(event, "query", [{ type: "required" }]);
                          },
                          onChange: event => {
                            if (!contactInfo.query) {
                              setContactInfoState({
                                ...contactInfoState,
                                queryPristine: false
                              });
                              change(event, "query", [{ type: "required" }]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div className={classes.center}>
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      onClick={handleSubmit}
                    >
                      {"Submit"}
                    </Button>
                  </div>
                </GridItem>

                  </GridContainer>
                </form>
              </GridItem>
            </GridContainer>
          </div>
        </DialogContent>
      </Dialog>
      {callInProgress && (
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal
          }}
          open={callInProgress}
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
      {noticeModal && (
        <NoticeModal
          noticeModal={noticeModal}
          noticeModalHeader={noticeModalHeader}
          noticeModalErrMsg={noticeModalErrMsg}
          closeModal={closeNoticeModal}
        />
      )}
    </div>
  );
};

ContactUsModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  userDetails: PropTypes.object
};

export default ContactUsModal;
