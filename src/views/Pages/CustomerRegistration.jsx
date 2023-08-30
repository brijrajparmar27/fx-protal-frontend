import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";
import routes from "routes.js";
import { Switch, Route, NavLink } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

// @material-ui/icons
import Work from "@material-ui/icons/Work";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { CMS } from "../../utils/API";
import { registerToken, formatDate } from "../../utils/Utils.js";

import Wizard from "../../components/Wizard/Wizard.jsx";
import Step1 from "../Forms/WizardSteps/Step1.jsx";
import Step2 from "../Forms/WizardSteps/Step2.jsx";
import Step3 from "../Forms/WizardSteps/Step3.jsx";
import Step4 from "../Forms/WizardSteps/Step4.jsx";

import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import {
  cardTitle,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
const styles = {
  ...regularFormsStyle,
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  modalCloseButton: {
    float: "right"
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
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px"
    }
  },
  iconRose: {
    color: roseColor
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
  }
};

//import contactUsPageStyle from "assets/jss/material-dashboard-pro-react/views/contactUsPageStyle";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const CustomerRegistration = props => {
  // const [checked, setChecked] = useState(false);
  // const [disclaimer, setDisclaimer] = useState(false);
  const [cms, setCms] = useState();
  const [viewType, setViewType] = useState(1);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState("");
  const { classes } = props;
  const contentPath = "/cms/public/pages/contactUs.json";
  // const [param, setParam] = useState();
  const [callInProgress, setCallInProgress] = useState(false);

  async function componentDidMount() {
    await CMS.get(contentPath).then(res => {
      const cms = res.data;
      setCms(cms);
    });
  }

  const handleClose = modal => {
    var x = [];
    x[modal] = false;
    setNoticeModal(false);
    setNoticeModalErrMsg("");
  };

  useEffect(() => {
    componentDidMount();
  }, []);

  // const disclaimerClick = () => {
  //   setDisclaimer(true);
  // };

  const getAlpha2Code = (countries, code) => {
    let alpha2 = countries.filter(item => {
      return item.countryCode === code;
    })[0];
    return alpha2;
  };
  const getData = data => {
    let ci = data.companyInformation;
    let ai = data.additionalInformation;
    let cni = data.consentInformation;

    console.log("Customer Registration - ");
    if (ai.otherReason && ai.otherReason !== "") {
      ai.platform.push(ai.otherReason);
    }
    if (ai.contactEmail === "") {
      setNoticeModal(true);
      setNoticeModalErrMsg("Please provide Contact Email Address");
      return;
    } else {
      // setViewType(2);

      let ci_alpha = getAlpha2Code(ci.countries, ci.countryCode);
      let ai_alpha = getAlpha2Code(ai.countries, ai.countryCode);

      let customerRegistration = {
        companyName: ci.companyName,
        incorporationNumber: ci.incorporationNumber,
        companyEmail: ci.companyEmail,
        registeredOfficeAddress: {
          address: ci.address,
          city: ci.city,
          postalCode: ci.postalCode,
          countryCode: ci.countryCode,
          alpha2Code: ci_alpha && ci_alpha.alpha2Code ? ci_alpha.alpha2Code : ""
        },
        ownershipType: ci.type,
        mainStockMarket: ci.mainStockMarket,
        secondaryStockMarket: ci.secondaryStockMarket,
        companyDesc: ai.companyDesc,
        directors: data.directors.directors,
        contactName: ai.contactName,
        contactTitle: ai.contactTitle,
        contactEmail: ai.contactEmail,
        businessAddress: {
          address: ai.contactAddress,
          city: ai.contactCity,
          postalCode: ai.contactPostalCode,
          countryCode: ai.countryCode,
          alpha2Code: ai_alpha && ai_alpha.alpha2Code ? ai_alpha.alpha2Code : ""
        },
        platformUsage: ai.platform,
        turnover: ai.turnover,
        payments: ai.payments,
        skipKyc: cni.skipKYC
      };
      console.log("Customer Registration Data - ", customerRegistration);
      registerCustomer(customerRegistration, cni);
    }
  };
  const registerCustomer = async (data, cni) => {
    if (cni.disclaimer && cni.checked) {
      setNoticeModal(false);
      setNoticeModalErrMsg("");
      setCallInProgress(true);
      // CUSTOMER_REGISTER
      const res = await apiHandler({
        method: "POST",
        url: endpoint.CUSTOMER_REGISTER,
        data: data,
        authToken: sessionStorage.getItem("token")
      });
      setCallInProgress(false);
      const cms = res.data;
      if (cms.errorCode) {
        if (cms.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else if (cms.errorCode === 403) {
          return;
        } else {
          setNoticeModal(true);
          setNoticeModalErrMsg(cms.userDesc);
        }
      } else {
        setViewType(3);
        sessionStorage.setItem(
          "customerRegistrationAppliedDate",
          formatDate(new Date())
        );
        registerToken();
      }
    } else {
      setNoticeModal(true);
      cni.disclaimer
        ? setNoticeModalErrMsg(
            "Please click the checkbox for 'commercial terms & conditions' to submit"
          )
        : setNoticeModalErrMsg(
            "Please click the 'commercial terms & conditions' to submit"
          );
    }

    //return data;
  };

  // const handleToggle = value => {
  //   setChecked(!checked);
  // };

  function getRoutes(routes, cms) {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views, cms);
      }
      if (prop.layout === "/auth/customer-registration" && !prop.overlay) {
        return (
          <Route
            path={prop.layout + prop.path}
            key={key}
            render={() => (
              <prop.component cms={cms} contentPath={prop.contentPath} />
            )}
          />
        );
      } else {
        return null;
      }
    });
  }
  const status = sessionStorage.getItem("status");
  const role = sessionStorage.getItem("role");
  return cms ? (
    <>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} lg={8}>
          <h4>
            <b>Customer Registration</b>
          </h4>
        </GridItem>
        <GridItem xs={12} sm={8}>
          {viewType === 1 && (
            <Card>
              <CardHeader color="warning" text>
                <CardText color="warning">
                  <Work className={classes.listItemIcon} />
                </CardText>
              </CardHeader>
              <CardBody style={{ paddingLeft: 100, top: -60 }}>
                <Wizard
                  validate
                  steps={[
                    {
                      stepName: "Company Information",
                      stepComponent: Step1,
                      stepId: "companyInformation"
                    },
                    {
                      stepName: "Directors & Beneficial Owners",
                      stepComponent: Step2,
                      stepId: "directors"
                    },
                    {
                      stepName: "Additional Information",
                      stepComponent: Step3,
                      stepId: "additionalInformation"
                    },
                    {
                      stepName: "Consent Information",
                      stepComponent: Step4,
                      stepId: "consentInformation"
                    }
                  ]}
                  title={null}
                  subtitle={null}
                  color={"primary"}
                  finishButtonClick={getData}
                />
              </CardBody>
            </Card>
          )}
          {/* {viewType == 2 && (
            <Card>
              <CardHeader color="warning" text>
                <CardText color="warning">
                  <CheckCircleOutline className={classes.listItemIcon} />
                </CardText>
              </CardHeader>
              <CardBody>
                <div style={{ textAlign: "center" }}>
                  <h5 style={{ fontWeight: 500 }}>
                    You are about to submit your customer application to FXGuard
                  </h5>
                  <p>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          tabIndex={-1}
                          onClick={handleToggle}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot
                          }}
                          disabled={!disclaimer}
                        />
                      }
                    />
                    Please make sure to review our{" "}
                    <a
                      onClick={disclaimerClick}
                      href="/cms/public/pdfs/FXGuard_Customer_Terms_and_Conditions_of_Business.pdf"
                      target="_blank"
                    >
                      commercial terms & conditions
                    </a>
                  </p>
                  <Button
                    size="lg"
                    style={{ backgroundColor: primaryColor[5] }}
                    onClick={registerCustomer}
                    //disabled={checked}
                  >
                    SUBMIT
                  </Button>
                </div>
              </CardBody>
            </Card>
          )} */}
          {viewType === 3 && (
            <Card>
              <CardHeader color="warning" text>
                <CardText color="warning">
                  <CheckCircleOutline className={classes.listItemIcon} />
                </CardText>
              </CardHeader>
              <CardBody>
                <div style={{ textAlign: "center" }}>
                  <h5 style={{ fontWeight: 500 }}>
                    Thanks for your application
                  </h5>
                  <p
                    style={{
                      width: 400,
                      margin: "auto",
                      marginTop: 30,
                      marginBottom: 30
                    }}
                  >
                    We will contact you as soon as possible by email or a call.
                    Please keep an eye on any email including at your spam
                    folder just in case it has landed there.
                  </p>
                  <NavLink
                    to={"/auth/portal-dashboard"}
                    className={cx(classes.navLink)}
                  >
                    {role === "role-prospect" ? (
                      <Button round={false} color="info" size="lg">
                        RETURN TO DEMO
                      </Button>
                    ) : (
                      <Button round={false} color="info" size="lg">
                        RETURN TO DASHBOARD
                      </Button>
                    )}
                  </NavLink>
                </div>
              </CardBody>
            </Card>
          )}
        </GridItem>
      </GridContainer>
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal
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
          <h4 className={classes.modalTitle}>{"Error"}</h4>
        </DialogTitle>
        <DialogContent
          id="notice-modal-slide-description"
          className={classes.modalBody}
        >
          <p>
            {noticeModalErrMsg === ""
              ? "Please click the 'commercial terms & conditions' to submit"
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
      <Switch>{getRoutes(routes, null)}</Switch>
    </>
  ) : (
    ""
  );
};

CustomerRegistration.propTypes = {
  classes: PropTypes.object.isRequired
};

//export default withStyles(contactUsPageStyle)(CustomerRegistration);
export default withRouter(withStyles(styles)(CustomerRegistration));
