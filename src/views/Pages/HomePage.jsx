import React, { useState, useEffect } from "react";
import { Switch, NavLink, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import { Helmet } from "react-helmet";

// @material-ui/icons
// import Weekend from "@material-ui/icons/Weekend";
import cx from "classnames";
import { CMSPrefix } from "../../utils/API";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
//import Snackbar from '../../components/Snackbar/Snackbar.jsx';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
// import home from "assets/img/home.png";
// import excel from "assets/img/excel.png";
import AUD from "assets/img/landing/graph-AUD.png";
import BRL from "assets/img/landing/graph-BRL.png";
import CAD from "assets/img/landing/graph-CAD.png";
import CNY from "assets/img/landing/graph-CNY.png";
import EUR from "assets/img/landing/graph-EUR.png";
import GBP from "assets/img/landing/graph-GBP.png";
import INR from "assets/img/landing/graph-INR.png";
import JPY from "assets/img/landing/graph-JPY.png";
import RUB from "assets/img/landing/graph-RUB.png";
import ZAR from "assets/img/landing/graph-ZAR.png";
import MButton from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import corporateValues from "assets/img/landing/corporateValues.png";
import features from "assets/img/landing/features.png";
import videoImg from "assets/img/landing/FXGuardPoster.png";
import InputBase from "@material-ui/core/InputBase";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import GetStartedModal from "views/Components/GetStartedModal.jsx";
import Card from "components/Card/Card.jsx";
import routes from "routes.js";
import Slide from "@material-ui/core/Slide";
import { TrackPage } from "views/Components/Tracking";

import homePageStyle from "assets/jss/material-dashboard-pro-react/views/homePageStyle.jsx";

const verifyEmail = (value) => {
  var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailRex.test(value)) {
    return true;
  }
  return false;
};

const HomePage = (props) => {
  const [readMore, setReadMore] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(AUD);
  const [email, setEmail] = useState("");
  const [getStartedModal, setGetStartedModal] = useState(false);
  const [callInProgress, setcallInProgress] = useState(false);
  const [noticeModalMsg, setNoticeModalMsg] = React.useState("");
  const [noticeModalHeaderMsg, setNoticeModalHeaderMsg] = React.useState("");
  const [noticeModal, setNoticeModal] = React.useState(false);

  const { classes, cms } = props;
  const backgroundImgArray = [AUD, BRL, CAD, CNY, EUR, GBP, INR, JPY, RUB, ZAR];
  let history = useHistory();

  backgroundImgArray.forEach((imageSrc) => {
    let backgroundImage = new Image();
    backgroundImage.src = imageSrc;
  });
  const closeGetStartedModal = () => {
    setGetStartedModal(false);
  };

  const changeBackgroundImage = (change) => {
    const currentIndex = backgroundImgArray.indexOf(backgroundImg);
    const nextIndex = (currentIndex + 1) % backgroundImgArray.length;
    change && setBackgroundImg(backgroundImgArray[nextIndex]);
  };
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // console.log('isLoggedOutForcefully',sessionStorage.getItem('isLoggedOutForcefully'))
    const interval = setInterval(() => {
      changeBackgroundImage(!noticeModal);
    }, 5000);
    componentDidUpdate();

    return () => clearInterval(interval);
  });

  const componentDidUpdate = () => {
    if (sessionStorage.getItem("logout") === "timeout") {
      setNoticeModal(true);
      setNoticeModalHeaderMsg("FXGuard");
      setNoticeModalMsg(
        "You have been logged out due to inactivity, please login again"
      );
      sessionStorage.removeItem("logout");
    }
    if (sessionStorage.getItem("logout") === "unauthorized") {
      setNoticeModal(true);
      setNoticeModalHeaderMsg("FXGuard");
      setNoticeModalMsg(
        // "You have been logged out due to login in another session."
        "Sorry, We had to log your out due to unexpected error. Please log back in"
      );
      sessionStorage.removeItem("logout");
    }
    if (sessionStorage.getItem("isLoggedOutForcefully") === "newsession") {
      setNoticeModal(true);
      setNoticeModalHeaderMsg("FXGuard");
      setNoticeModalMsg(
        "You are logout because another instance is open at other place."
      );
      sessionStorage.removeItem("isLoggedOutForcefully");
    }
    sessionStorage.setItem("module", "RISKS");
    TrackPage();
    // ReactGA.initialize('UA-186725923-1');
    // ReactGA.pageview(window.location.pathname + window.location.hash);
  };

  const readMoreHandler = () => {
    setReadMore(!readMore);
  };

  const keepMeUpdatedHandler = async () => {
    if (email === "" || !verifyEmail(email)) {
      setNoticeModal(true);
      setNoticeModalHeaderMsg("Error");
      setNoticeModalMsg("Please provide a valid email");
      return;
    }
    setcallInProgress(true);
    //KEEP_ME_UPDATE
    const res = await apiHandler({
      url: endpoint.KEEP_ME_UPDATE,
      method: "POST",
      data: { email: email },
      authToken: sessionStorage.getItem("token"),
    });
    if (res.data.errorCode === 409) {
      setNoticeModal(true);
      setNoticeModalHeaderMsg("Information");
      setNoticeModalMsg("You are already registered. Thank you");
      setcallInProgress(false);
      setEmail("");
    } else {
      if (res.data.indexOf("errorCode") !== -1) {
        const data = JSON.parse(res.data);
        if (data.errorCode) {
          setNoticeModal(true);
          setNoticeModalHeaderMsg("Thank You");
          setNoticeModalMsg(data.userDesc);
        }
      } else {
        setNoticeModal(true);
        setNoticeModalHeaderMsg("Thank You");
        setNoticeModalMsg(
          "We have noted your email details and will keep you informed from time to time."
        );
      }
      setcallInProgress(false);
      setEmail("");
    }
  };

  const handleClose = () => {
    //setOpen(false);
    setNoticeModal(false);
    setNoticeModalHeaderMsg("");
    setNoticeModalMsg("");

    changeBackgroundImage(true);
  };

  const handlePlanInformation = (link) => {
    history.push(link);
  };

  const change = (event) => {
    setEmail(event.target.value);
  };

  const Transition = (props) => {
    return <Slide direction="down" {...props} />;
  };

  // const successAlert = () => {
  //   this.setState({
  //     alert: (
  //       <SweetAlert
  //         success
  //         style={{ display: "block", marginTop: "-100px" }}
  //         title="Good job!"
  //         onConfirm={() => this.hideAlert()}
  //         onCancel={() => this.hideAlert()}
  //         confirmBtnCssClass={
  //           this.props.classes.button + " " + this.props.classes.success
  //         }
  //       >
  //         You clicked the button!
  //       </SweetAlert>
  //     )
  //   });
  // }
  const SEO = ({ title, description, name, type }) => {
    // console.log('SEO - ', title, description, name, type);
    return (
      <Helmet>
        {/* Standard metadata tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* End standard metadata tags */}
        {/* Facebook tags */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* End Facebook tags */}
        {/* Twitter tags */}
        <meta name="twitter:creator" content={name} />}
        <meta name="twitter:card" content={type} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* End Twitter tags */}
      </Helmet>
    );
  };
  return (
    <div>
      <Switch>{getRoutes(routes, cms)}</Switch>
      <div className={classes.fullPage}>
        <div
          className={classes.fullPage}
          style={{
            backgroundImage: "url(" + backgroundImg + ")",
            position: "absolute",
            width: "101%",
            backgroundSize: "cover",
            margin: "0 auto",
            transition: "background-image 1s ease-in-out",
          }}
        />
        <NavLink to={"/home/contact-us"}>
          <Button
            round={false}
            style={{
              backgroundColor: "#0e61ab",
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
              zIndex: 1,
            }}
            size="lg"
          >
            {"Ask for Free Demo"}
          </Button>
        </NavLink>
        <div
          className={classes.fullPage}
          style={{
            background:
              "linear-gradient(rgba(20,20,20, .5), rgba(20,20,20, .5))",
            position: "absolute",
            width: "101%",
            backgroundSize: "cover",
            margin: "0 auto",
          }}
        />
        {/* </Slide> */}
        {/* <Stepper /> */}
        <GridContainer justify="center" className={classes.homeTitle}>
          <GridItem xs={10} sm={10} md={10} lg={8}>
            <h2 className={classes.title}>{cms.body.banner.heading.content}</h2>
            <h5 className={classes.description}>
              {cms.body.banner.subHeading.content}
            </h5>
          </GridItem>
          {window.innerWidth < 600 ? (
            <>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <NavLink to={"/home/learn-more"}>
                  <Button round={false} color="github" size="lg">
                    {cms.body.banner.buttons[0].label}
                  </Button>
                </NavLink>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <Button
                  round={false}
                  size="lg"
                  onClick={() => setGetStartedModal(true)}
                  style={{ backgroundColor: "#0e61ab" }}
                >
                  <OndemandVideoIcon style={{ marginRight: 15 }} />
                  {"WATCH"}
                </Button>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <NavLink to={"/home/signup-page"}>
                  <Button round={false} color="info" size="lg">
                    {cms.body.banner.buttons[1].label}
                  </Button>
                </NavLink>
              </GridItem>
            </>
          ) : (
            <GridItem
              xs={12}
              sm={12}
              md={10}
              lg={12}
              style={{ marginTop: 50, top: 500 }}
            >
              <NavLink to={"/home/learn-more"}>
                <Button
                  round={false}
                  color="github"
                  size="lg"
                  style={{ marginRight: 50 }}
                >
                  {cms.body.banner.buttons[0].label}
                </Button>
              </NavLink>
              <Button
                round={false}
                size="lg"
                onClick={() => setGetStartedModal(true)}
                style={{ marginRight: 50, backgroundColor: "#0e61ab" }}
              >
                <OndemandVideoIcon style={{ marginRight: 15 }} />
                {"WATCH"}
              </Button>
              <NavLink to={"/home/signup-page"}>
                <Button round={false} color="info" size="lg">
                  {cms.body.banner.buttons[1].label}
                </Button>
              </NavLink>
            </GridItem>
          )}
        </GridContainer>
      </div>
      {/* {console.log('HOME PAGE - ', cms)} */}
      {cms.seo && (
        <SEO
          title={cms.seo.title}
          description={cms.seo.description}
          name={cms.seo.name}
          type={cms.seo.type}
        />
      )}
      {/* Feature title section */}
      <GridContainer justify="center" className={classes.featureContainer}>
        {cms.body.featureSection.map((feature, index) => {
          return (
            <GridItem xs={10} sm={10} md={5} lg={5} key={index}>
              <Card pricing plain style={{ marginBottom: 0 }}>
                <CardHeader pricing="true" plain>
                  {" "}
                  <img
                    src={CMSPrefix + feature.image.url}
                    alt={"title"}
                    className={classes.titleImage}
                  />
                  <h3 className={classes.featureTitleHeader}>
                    {feature.heading.content}
                  </h3>
                </CardHeader>
                <CardBody pricing plain>
                  <p className={classes.featureContent}>
                    {feature.subHeading.content.map((contentText, i) => (
                      <p key={i}>{contentText}</p>
                    ))}
                    {feature.subHeading.moreContent && (
                      <>
                        {!readMore && <span id="dots">...</span>}
                        {readMore && (
                          <p id="more" style={{ fontStyle: "italic" }}>
                            {feature.subHeading.moreContent}
                          </p>
                        )}
                      </>
                    )}
                    {feature.subHeading.moreContent && (
                      <MButton
                        onClick={readMoreHandler}
                        style={{ textTransform: "none", float: "right" }}
                      >
                        {readMore ? "Read Less" : "Read More"}
                        {readMore ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                      </MButton>
                    )}
                  </p>
                </CardBody>
              </Card>
            </GridItem>
          );
        })}
      </GridContainer>
      {/* Corporate Values */}
      <GridContainer justify="center" className={classes.groupContainer}>
        <GridItem xs={10} sm={10} md={4} lg={4}>
          <h3 className={cx(classes.groupHeader, classes.featureTitleHeader)}>
            {cms.body.contentBox[0].heading.content}
          </h3>
          <p className={classes.groupSubtext}>
            {cms.body.contentBox[0].subHeading.content}
          </p>
          <p className={classes.grouptext}>
            {cms.body.contentBox[0].body.content}
          </p>
        </GridItem>
        <GridItem xs={10} sm={10} md={6} lg={5}>
          {/* <img
            src={corporateValues}
            alt={"corporateValues"}
            className={classes.sideImage}
            style={{ paddingLeft: 50 }}
          /> */}
          <video
            src={
              "https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/images/FXG+Movie+2.mp4"
            }
            alt={"corporateValues"}
            controls
            poster={videoImg}
            className={classes.sideImage}
            style={{ paddingLeft: 50 }}
          />
        </GridItem>
      </GridContainer>
      {/* Features and values */}
      <GridContainer
        justify="center"
        className={classes.groupContainer}
        style={{ paddingBottom: 150 }}
        direction={window.innerWidth <= 992 ? "column-reverse" : "row"}
        alignItems={"center"}
      >
        <GridItem xs={10} sm={10} md={6} lg={5}>
          <img
            src={features}
            alt={"features"}
            className={classes.sideImage}
            style={{ paddingRight: 50 }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={4} lg={4}>
          <h3 className={cx(classes.groupHeader, classes.featureTitleHeader)}>
            {cms.body.contentBox[1].heading.content}
          </h3>
          <p className={classes.groupSubtext}>
            {cms.body.contentBox[1].subHeading.content}
          </p>
          <p className={classes.grouptext}>
            {cms.body.contentBox[1].body.content}
          </p>
        </GridItem>
      </GridContainer>
      {/* See FXGuard in action */}
      {/* BELOW CODE IS REMOVED FROM TRANSACTION VERION ONLY */}
      {/* <GridContainer justify="center" className={classes.registerDemoContainer}>
        <GridItem xs={10} sm={10} lg={10} style={{ textAlign: "Center" }}>
          <video
            style={{
              width: window.innerWidth <= 992 ? "100%" : 700,
              top: 40,
              position: "relative"
            }}
            poster={videoImg}
            controls
          >
            <source src={"https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/images/FXGuard251120.mp4"} type="video/mp4" />
          </video>
        </GridItem>
        <GridItem xs={12} sm={12} md={10} lg={4}>
          <GridContainer justify="center">
            <GridItem
              xs={10}
              sm={10}
              md={10}
              lg={12}
              style={{ textAlign: "Center" }}
              className={classes.featureContent}
            >
              <h3
                className={cx(classes.groupHeader, classes.featureTitleHeader)}
                style={{
                  textAlign: "Center",
                  paddingBottom: 20,
                  marginTop: 0
                }}
              >
                See FXGuard in action
              </h3>
              <p>Check it out and see for yourself how it all works!</p>
              <NavLink
                to={{
                  pathname: "/home/signup-page",
                  state: { notProspectDemoUser: false }
                }}
              >
                <Button round={false} color="github" size="lg">
                  REGISTER FOR A DEMO
                </Button>
              </NavLink>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer> */}
      {/* Eliminate extra charges */}
      {cms.body.planOptionsRisks && (
        <GridContainer
          justify="center"
          style={{ backgroundColor: "#eeeeee" }}
          className={classes.planContainer}
        >
          <GridItem
            xs={10}
            sm={10}
            md={10}
            lg={8}
            style={{ textAlign: "Center" }}
            className={classes.featureContent}
          >
            <h3
              className={cx(classes.groupHeader, classes.featureTitleHeader)}
              style={{ textAlign: "Center", paddingBottom: 20 }}
            >
              {cms.body.planOptionsRisks.heading.content}
            </h3>
            <p className={classes.grouptext}>
              {cms.body.planOptionsRisks.subHeading.content}
            </p>
            <p className={classes.grouptext} style={{ fontStyle: "italic" }}>
              {cms.body.planOptionsRisks.subHeading.content2}
            </p>
          </GridItem>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <GridContainer justify="center">
              {cms.body.planOptionsRisks.plans.map((plan, index) => {
                return (
                  <GridItem xs={10} sm={10} md={4} key={index}>
                    <Card pricing {...plan.cardType} className={classes.card}>
                      <CardBody pricing {...plan.cardType}>
                        <h6 className={classes.cardCategory}>
                          {plan.heading.content}
                        </h6>
                        <div className={classes.icon}>
                          <Icon
                            className={
                              plan.cardType.plain
                                ? classes.iconGray
                                : classes.iconRose
                            }
                          >
                            {plan.icon}
                          </Icon>
                        </div>
                        <h3
                          className={`${classes.cardTitle} ${
                            classes.marginTop30
                          }`}
                        >
                          {plan.price}
                        </h3>
                        <p className={classes.cardDescription}>
                          {plan.body.content}
                        </p>
                        {/* <div className={classes.buttonContainer}>
                      <Button round color={plan.buttons[0].color}>
                        {plan.buttons[0].label}
                      </Button>
                      </div> */}
                      </CardBody>
                    </Card>
                  </GridItem>
                );
              })}
            </GridContainer>
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={10}
            style={{ textAlign: "Center" }}
          >
            {cms.body.planOptionsRisks.buttons.map((btn, index) => (
              <Button
                round={false}
                key={index}
                color={btn.color}
                size="lg"
                onClick={() => handlePlanInformation(btn.link)}
              >
                {btn.label}
              </Button>
            ))}
          </GridItem>
        </GridContainer>
      )}
      <GridContainer
        justify="center"
        style={{ backgroundColor: "#d9edf7" }}
        className={classes.planContainer}
      />
      {cms.body.planOptionsDeals && (
        <GridContainer
          justify="center"
          style={{ backgroundColor: "#eeeeee" }}
          className={classes.planContainer}
        >
          <GridItem
            xs={10}
            sm={10}
            md={10}
            lg={8}
            style={{ textAlign: "Center" }}
            className={classes.featureContent}
          >
            <h3
              className={cx(classes.groupHeader, classes.featureTitleHeader)}
              style={{ textAlign: "Center", paddingBottom: 20 }}
            >
              {cms.body.planOptionsDeals.heading.content}
            </h3>
            <div className={classes.launchBtn}>
              <NavLink to={"/home/register-interest"}>
                <Button
                  round={false}
                  color="info"
                  size="lg"
                  style={{ zIndex: 1, fontWeight: 900, marginBottom: 20 }}
                >
                  {"Register your interest"}
                </Button>
              </NavLink>
            </div>
            <p className={classes.grouptext}>
              {cms.body.planOptionsDeals.subHeading.content}
            </p>
            <p className={classes.grouptext} style={{ fontStyle: "italic" }}>
              {cms.body.planOptionsDeals.subHeading.content2}
            </p>
          </GridItem>
          <GridItem xs={10} sm={10} md={10} lg={10}>
            <GridContainer justify="center">
              {cms.body.planOptionsDeals.plans.map((plan, index) => {
                return (
                  <GridItem xs={10} sm={10} md={4} key={index}>
                    <Card pricing {...plan.cardType} className={classes.card}>
                      <CardBody pricing {...plan.cardType}>
                        <h6 className={classes.cardCategory}>
                          {plan.heading.content}
                        </h6>
                        <div className={classes.icon}>
                          <Icon
                            className={
                              plan.cardType.plain
                                ? classes.iconGray
                                : classes.iconRose
                            }
                          >
                            {plan.icon}
                          </Icon>
                        </div>
                        <h3
                          className={`${classes.cardTitle} ${
                            classes.marginTop30
                          }`}
                        >
                          {plan.price}
                        </h3>
                        <p className={classes.cardDescription}>
                          {plan.body.content}
                        </p>
                        {/* <div className={classes.buttonContainer}>
                      <Button round color={plan.buttons[0].color}>
                        {plan.buttons[0].label}
                      </Button>
                      </div> */}
                      </CardBody>
                    </Card>
                  </GridItem>
                );
              })}
            </GridContainer>
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={10}
            style={{ textAlign: "Center" }}
          >
            {cms.body.planOptionsDeals.buttons.map((btn, index) => (
              <Button
                round={false}
                key={index}
                color="github"
                size="lg"
                onClick={() => handlePlanInformation(btn.link)}
              >
                {btn.label}
              </Button>
            ))}
          </GridItem>
        </GridContainer>
      )}
      <GridContainer justify="center" style={{ backgroundColor: "white" }}>
        <GridItem xs={10} sm={10} md={10} lg={4}>
          <h3
            className={cx(classes.groupHeader, classes.featureTitleHeader)}
            style={{ textAlign: "left", marginTop: 20 }}
          >
            {cms.body.subscription.heading.content}
          </h3>
          <p className={classes.grouptext}>
            {cms.body.subscription.subHeading.content}
          </p>
        </GridItem>
        <GridItem
          xs={12}
          sm={12}
          md={12}
          lg={3}
          style={{ textAlign: "Center", margin: 20 }}
        >
          <div
            style={{
              backgroundColor: "rgba(64,168,189,0.3)",
              paddingBottom: 15,
            }}
          >
            <InputBase
              placeholder="Your email"
              id="home_email"
              value={email}
              onChange={(event) => {
                change(event, "email", [
                  { type: "required" },
                  { type: "email" },
                ]);
              }}
              fullWidth={true}
              className={classes.customInputBase}
            />
            {callInProgress ? (
              <CircularProgress />
            ) : (
              <Button
                round={false}
                color="github"
                size="lg"
                style={{ width: "90%", height: 52 }}
                onClick={keepMeUpdatedHandler}
              >
                {cms.body.subscription.buttons[0].label}
              </Button>
            )}
          </div>
        </GridItem>
      </GridContainer>
      {noticeModal && (
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
            <h4 className={classes.modalTitle}>{noticeModalHeaderMsg}</h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <p>{noticeModalMsg}</p>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button
              onClick={() => handleClose("noticeModal")}
              color="info"
              round
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {getStartedModal && (
        <GetStartedModal
          showModal={getStartedModal}
          closeModal={closeGetStartedModal}
          title={"Know more about FXGuard"}
          videoLink={
            "https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/images/FXGuard251120.mp4"
          }
        />
      )}
    </div>
  );
};

const getRoutes = (routes, cms) => {
  return routes.map((prop) => {
    if (prop.collapse) {
      return getRoutes(prop.views, cms);
    } else {
      return null;
    }
    // if (prop.layout === "/homePage") {
    //   return (
    //     <Route
    //       path={"/home" + (prop.path === "" ? "landing" : prop.path)}
    //       key={key}
    //       render={() => <prop.component cms={cms} />}
    //     />
    //   );
    // } else {
    //   return null;
    // }
  });
};

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  cms: PropTypes.object,
};

export default withStyles(homePageStyle)(HomePage);