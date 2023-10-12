import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
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
import { validate } from "../../utils/Validator";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import axios from "axios";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import Phone from "@material-ui/icons/Phone";
import Work from "@material-ui/icons/Work";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import { CMS } from "../../utils/API";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import TextField from "@mui/material/TextField";
import contactUsPageStyle from "assets/jss/material-dashboard-pro-react/views/contactUsPageStyle";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const ContactUsPage = (props) => {
  const [cms, setCms] = useState();
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState("");
  const [countries, setCountries] = useState([]);
  const [phone,setPhone] = useState(true)

  const history = useHistory();

  const error = {
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
      range: "Company Name should be 1 to 200 characters",
    },
    queryErrorMsg: {
      required: "Query is required",
    },
    countryCodeErrorMsg: {
      required: "Country is required",
    },
  };

  const rulesList = {
    firstName: [{ type: "required" }],
    lastName: [{ type: "required" }],
    email: [{ type: "required" }, { type: "email" }],
    // phoneNumber: [{ type: "required" }, { type: "phone" }],
    // companyName: [{ type: "required" }],
    query: [{ type: "required" }],
    countryCode: [{ type: "required" }],
  };

  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNumber: "",
    companyName: "",
    query: "",
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
    queryErrorMsg: [],
  };

  const [contactInfoState, setContactInfoState] = useState(
    contactInfoIntialState
  );
  const { classes } = props;
  const contentPath = "/cms/public/pages/contactUs.json";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClose = (modal) => {
    var x = [];
    x[modal] = false;
    setNoticeModal(false);
    setNoticeModalErrMsg("");
  };

  const isValidated = () => {
    if (
      contactInfoState.firstNameState === "success" &&
      contactInfoState.lastNameState === "success" &&
      contactInfoState.emailState === "success" &&
      contactInfoState.countryCodeState === "success" &&
      // contactInfoState.phoneNumberState === "success" &&
      contactInfoState.companyNameState === "success" &&
      contactInfoState.queryState === "success"
    ) {
      return true;
    } else {
      let currentState = {};
      let currentStateError = {};

      if (contactInfoState.firstNameState !== "success") {
        currentStateError = {
          ...currentStateError,
          ...validate(
            contactInfo.firstName,
            "firstName",
            contactInfoState,
            rulesList.firstName,
            error
          ),
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
          ),
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
          ),
        };
      }
      // if (contactInfoState.countryCodeState !== "success") {
      //   currentStateError = {
      //     ...currentStateError,
      //     ...validate(
      //       contactInfo.countryCode,
      //       "countryCode",
      //       contactInfoState,
      //       rulesList.countryCode,
      //       error
      //     ),
      //   };
      // }
      // if (contactInfoState.phoneNumberState !== "success") {
      //   let value = contactInfo.phoneNumber;
      //   value = value.replace(/-/g, "").trim();
      //   if (value.length > 10) {
      //     value = value.substring(1, value.length);
      //   }
      //   currentStateError = {
      //     ...currentStateError,
      //     ...validate(
      //       value,
      //       "phoneNumber",
      //       contactInfoState,
      //       rulesList.phoneNumber,
      //       error
      //     ),
      //   };
      // }
      if (contactInfoState.companyNameState !== "success") {
        currentStateError = {
          ...currentStateError,
          ...validate(
            contactInfo.companyName,
            "companyName",
            contactInfoState,
            rulesList.companyName,
            error
          ),
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
          ),
        };
      }

      setContactInfoState({
        ...contactInfoState,
        ...currentState,
        ...currentStateError,
      });
    }
    return false;
  };

  const handleSubmit = async () => {
    if (agreeDisclaimer && isValidated()) {
      let contactInfoData = {
        ...contactInfo,
        phoneNumber: contactInfo.countryCode || "" + phone,
      };
      setCallInProgress(true);
      const res = await apiHandler({
        method: "POST",
        url: endpoint.CONTACTUS,
        data: contactInfoData,
        authToken: sessionStorage.getItem("token"),
      });
      setCallInProgress(false);
      const data = res.data;
      if (data.errorCode) {
        if (data.errorCode === 401) {
          console.log("Unauthorized Access");
          // history.push("/home/logout");
          return;
        } else {
          setNoticeModalErrMsg(res.data.userDesc);
          setNoticeModal(true);
        }
      } else {
        setNoticeModal(true);
        setContactInfoState(contactInfoIntialState);
        setContactInfo({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phoneNumber: "",
          companyName: "",
          query: "",
        });
        setAgreeDisclaimer(false);
      }
    } else if (!agreeDisclaimer) {
      setNoticeModal(true);
      setNoticeModalErrMsg(
        "Please check the box to agree to our terms and procced"
      );
    }
  };

  async function componentDidMount() {
    await CMS.get(contentPath).then((res) => {
      const cms = res.data;
      setCms(cms);
    });
    const res = await axios.get(
      endpoint.BASE_URL_STAGING_AXIOS + "fx-crm/public/countriesMetaData"
    );
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        // history.push("/home/logout");
        return;
      } else {
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      const countries = res.data.countryMetaData;
      await setCountries(countries);
    }
  }

  useEffect(() => {
    componentDidMount();
  }, []);

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
      ...validate(value, stateName, contactInfoState, rules, error),
    });
  };

  const handleSimple = (event) => {
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
      [name]: value,
    });
  };

  const handleToggle = () => {
    setAgreeDisclaimer(!agreeDisclaimer);
  };

  const labelCodeClasses = classNames({
    [" " + classes.labelRootError]:
      contactInfoState.countryCodeState === "error",
    [" " + classes.labelRootSuccess]:
      contactInfoState.countryCodeState === "success",
  });
  const labelPhoneClasses = classNames({
    [" " + classes.labelRootError]:
      contactInfoState.phoneNumberState === "error",
    [" " + classes.labelRootSuccess]:
      contactInfoState.phoneNumberState === "success",
  });

  return cms ? (
    <div className={classes.container}>
      <GridContainer className={classes.marginLeft}>
        <GridItem xs={12} sm={12} md={12} lg={10}>
          <h3 className={cx(classes.modalTitle, classes.signupModalTitle)}>
            Contact Us
          </h3>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={6}>
              <address className={cx(classes.modalTitle)}>
                <p>
                  <h4>{cms.body.address.companyName}</h4>
                </p>
                <p>{cms.body.address.line1}</p>
                <p>{cms.body.address.line2}</p>
                <p>{cms.body.address.country}</p>
                <p>
                  {cms.body.email.label + ": "}
                  <a href={"mailto:" + cms.body.email.content}>
                    {cms.body.email.content}
                  </a>
                </p>
                <p>
                  {cms.body.phone.label + ": "}
                  <a href={"tel:" + cms.body.phone.content}>
                    {cms.body.phone.content}
                  </a>
                </p>
              </address>
            </GridItem>
          </GridContainer>
          <h4 className={cx(classes.modalTitle, classes.signupModalTitle)}>
            {cms.body.enquiry.title}
          </h4>
          <div className={classes.termsText}>
            {cms.body.enquiry.description}
          </div>
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
                      success={contactInfoState.firstNameState === "success"}
                      error={contactInfoState.firstNameState === "error"}
                      helpText={
                        contactInfoState.firstNameState === "error" &&
                        contactInfoState.firstNameErrorMsg[0]
                      }
                      labelText={cms.body.enquiry.form.labels.firstName + "*"}
                      id="cu_firstName"
                      inputProps={{
                        value: contactInfo.firstName,
                        onChange: (event) => handleChange("firstName", event),
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: (event) => {
                          setContactInfoState({
                            ...contactInfoState,
                            firstNamePristine: false,
                          });
                          change(event, "firstName", [
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
                          if (!contactInfoState.firstNamePristine) {
                            setContactInfoState({
                              ...contactInfoState,
                              firstNamePristine: false,
                            });
                            change(event, "firstName", [
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
                      success={contactInfoState.lastNameState === "success"}
                      error={contactInfoState.lastNameState === "error"}
                      helpText={
                        contactInfoState.lastNameState === "error" &&
                        contactInfoState.lastNameErrorMsg[0]
                      }
                      labelText={cms.body.enquiry.form.labels.lastName + "*"}
                      id="cu_lastName"
                      inputProps={{
                        value: contactInfo.lastName,
                        onChange: (event) => handleChange("lastName", event),
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: (event) => {
                          setContactInfoState({
                            ...contactInfoState,
                            lastNamePristine: false,
                          });
                          change(event, "lastName", [
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
                          if (!contactInfoState.lastNamePristine) {
                            setContactInfoState({
                              ...contactInfoState,
                              lastNamePristine: false,
                            });
                            change(event, "lastName", [
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
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={5}>
                <GridContainer spacing={1} alignItems="flex-end">
                  <GridItem xs={1} sm={1} md={1} className={classes.textIcon}>
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
                      labelText={
                        cms.body.enquiry.form.labels.corporateEmail + "*"
                      }
                      id="cu_email"
                      inputProps={{
                        value: contactInfo.email,
                        onChange: (event) => handleChange("email", event),
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: (event) => {
                          setContactInfoState({
                            ...contactInfoState,
                            emailPristine: false,
                          });
                          change(event, "email", [
                            { type: "required" },
                            { type: "email" },
                          ]);
                        },
                        onChange: (event) => {
                          if (!contactInfo.email) {
                            setContactInfoState({
                              ...contactInfoState,
                              emailPristine: false,
                            });
                            change(event, "email", [
                              { type: "required" },
                              { type: "email" },
                            ]);
                          }
                        },
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={3}>
                <GridContainer spacing={1} alignItems="flex-end">
                  <GridItem xs={1} sm={1} md={1} className={classes.textIcon} />
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
                        className={classes.selectLabel + " " + labelCodeClasses}
                      >
                        Country Code*
                      </InputLabel>
                      {console.log(contactInfo)}
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={contactInfo.countryCode}
                        onChange={handleSimple}
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
                        {countries.map((item) => (
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
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={4}>
                <GridContainer spacing={1} alignItems="flex-end">
                  <GridItem xs={1} sm={1} md={1} className={classes.textIcon}>
                    {/* <Phone className={classes.inputAdornmentIcon} /> */}
                  </GridItem>
                  <GridItem
                    className={classes.customText}
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                  >
                    {/* <InputLabel
                      htmlFor="type"
                      className={classes.selectLabel + " " + labelPhoneClasses}
                    >
                      {cms.body.enquiry.form.labels.phoneNumber + "*"}
                    </InputLabel> */}
                    {/* <CustomInput
                      success={contactInfoState.phoneNumberState === "success"}
                      error={contactInfoState.phoneNumberState === "error"}
                      helpText={
                        contactInfoState.phoneNumberState === "error"
                          ? contactInfoState.phoneNumberErrorMsg[0]
                          : ""
                      }
                      // labelText={cms.body.enquiry.form.labels.phoneNumber + "*"}
                      id="cu_phoneNumber"
                      // value={contactInfo.phoneNumber}
                      // format="###-###-####"
                      // value={contactInfo.phoneNumber}
                      onChange={event => handleChange("phoneNumber", event)}
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
                            // { type: "phone" }
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
                    /> */}
                    <TextField
                      id="standard-number"
                      error={!phone}
                      helperText={!phone && "Cannot be Empty"}
                      label="Phone Number"
                      type="number"
                      variant="standard"
                      required
                      onChange={(event) => {
                        console.log(event.target.value);
                        setPhone(event.target.value);
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
                      success={contactInfoState.companyNameState === "success"}
                      error={contactInfoState.companyNameState === "error"}
                      helpText={
                        contactInfoState.companyNameState === "error" &&
                        contactInfoState.companyNameErrorMsg[0]
                      }
                      labelText={cms.body.enquiry.form.labels.companyName + "*"}
                      id="cu_companyName"
                      inputProps={{
                        value: contactInfo.companyName,
                        onChange: (event) => handleChange("companyName", event),
                      }}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: (event) => {
                          setContactInfoState({
                            ...contactInfoState,
                            companyNamePristine: false,
                          });
                          change(event, "companyName", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 200,
                              },
                            },
                          ]);
                        },
                        onChange: (event) => {
                          if (!contactInfo.companyName) {
                            setContactInfoState({
                              ...contactInfoState,
                              companyNamePristine: false,
                            });
                            change(event, "companyName", [
                              { type: "required" },
                              {
                                type: "length",
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
              <GridItem xs={10} sm={10} md={11} lg={11}>
                <CustomInput
                  success={contactInfoState.queryState === "success"}
                  error={contactInfoState.queryState === "error"}
                  helpText={
                    contactInfoState.queryState === "error" &&
                    contactInfoState.queryErrorMsg[0]
                  }
                  labelText={cms.body.enquiry.form.labels.requirement + "*"}
                  id="cu_query"
                  inputProps={{
                    multiline: true,
                    rows: 2,
                    value: contactInfo.query,
                    onChange: (event) => handleChange("query", event),
                  }}
                  formControlProps={{
                    fullWidth: true,
                    onBlur: (event) => {
                      setContactInfoState({
                        ...contactInfoState,
                        queryPristine: false,
                      });
                      change(event, "query", [{ type: "required" }]);
                    },
                    onChange: (event) => {
                      if (!contactInfo.query) {
                        setContactInfoState({
                          ...contactInfoState,
                          queryPristine: false,
                        });
                        change(event, "query", [{ type: "required" }]);
                      }
                    },
                  }}
                />
              </GridItem>
              <div className={classes.buttonContainer}>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <FormControlLabel
                    className={classes.center}
                    classes={{
                      root: classes.checkboxLabelControl,
                      label: classes.checkboxLabel,
                    }}
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle()}
                        checked={agreeDisclaimer}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot,
                        }}
                        autocomplete="off"
                      />
                    }
                    label={
                      <div className={classes.termsText}>
                        {cms.body.agreement}
                      </div>
                    }
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
                      {cms.body.buttons[0].label}
                    </Button>
                  </div>
                </GridItem>
              </div>
            </GridContainer>
          </form>
        </GridItem>
      </GridContainer>
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal,
        }}
        open={noticeModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose("noticeModal")}
        aria-labelledby="notice-modal-slide-title"
        aria-describedby="notice-modal-slide-description"
      >
        <DialogTitle
          id="notice-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <h4 className={classes.modalTitle}>
            {noticeModalErrMsg === "" ? "Success" : "Error"}
          </h4>
        </DialogTitle>
        <DialogContent
          id="notice-modal-slide-description"
          className={classes.modalBody}
        >
          <p>
            {noticeModalErrMsg === ""
              ? "We have noted your query and will get back to you soon"
              : noticeModalErrMsg}
          </p>
        </DialogContent>
        <DialogActions
          className={classes.modalFooter + " " + classes.modalFooterCenter}
        >
          <Button onClick={() => handleClose("noticeModal")} color="info" round>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {callInProgress && (
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal,
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
    </div>
  ) : (
    ""
  );
};

ContactUsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(contactUsPageStyle)(ContactUsPage);
