import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  successColor,
  dangerColor,
  blackColor,
  hexToRgb
} from "assets/jss/material-dashboard-pro-react.jsx";

// @material-ui/icons
import Check from "@material-ui/icons/Check";

import ReactCookieConsent from "react-cookie-consent";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const styles = theme => ({
  ...customCheckboxRadioSwitch,
  cc_container: {
    position: "fixed ! important", // fixed position to relative not fixed
    overflow: "hidden",
    animationName: "slideDown",
    animationDuration: "1s",
    transitionTimingFunction: "cubic-bezier(0, 1, 0.5, 1)",
    background: "#FFF",
    color: "#555555",
    width: "80%",
    border: 0,
    zIndex: 1029,
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.3)",
    transition: "all 150ms ease 1s",
    paddingBottom: "2px",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  checkboxLabelControl: {
    margin: "0"
  },
  checkboxLabel: {
    marginLeft: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)"
  },
  acceptButton: {
    background: successColor[1],
    padding: "10px 40px",
    color: "#FFF",
    fontSize: "16px",
    [theme.breakpoints.up("lg")]: {
      right: "170px",
      position: "absolute",
      top: "10px"
    }
  },
  rejectButton: {
    background: dangerColor[1],
    padding: "10px 40px",
    color: "#FFF",
    fontSize: "16px",
    [theme.breakpoints.up("lg")]: {
      right: "20px",
      position: "absolute",
      top: "10px"
    }
  },
  uploadLabel: {
    margin: 0
  }
});

class CookieConsent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedAllCookie: true,
      checkedFewCookie: false,
      checkedNecessaryCookie: true,
      checkedFunctionalCookie: true,
      checkedPerformanceCookie: true,
      checkedMarketingCookie: true,
      fewCookieDisabled: true,
      showSpecificCookie: false
    };
  }

  componentDidMount() {}

  onAccept = () => {
    // console.log("Consents given");
  };

  handleALLToggle() {
    if (!this.state.checkedAllCookie) {
      this.setState({
        checkedNecessaryCookie: true,
        checkedFunctionalCookie: true,
        checkedPerformanceCookie: true,
        checkedMarketingCookie: true
      });
    }
    this.setState({
      checkedAllCookie: !this.state.checkedAllCookie,
      checkedFewCookie: !this.state.checkedFewCookie,
      showSpecificCookie: !this.state.showSpecificCookie,
      fewCookieDisabled: true
    });
  }

  handleFEWToggle() {
    this.setState({
      checkedAllCookie: !this.state.checkedAllCookie,
      checkedFewCookie: !this.state.checkedFewCookie,
      fewCookieDisabled: false,
      showSpecificCookie: !this.state.showSpecificCookie
    });
  }

  handlePerformanceToggle() {
    if (!this.state.checkedAllCookie) {
      this.setState({
        checkedPerformanceCookie: !this.state.checkedPerformanceCookie
      });
    }
  }
  handleMarketingToggle() {
    if (!this.state.checkedAllCookie) {
      this.setState({
        checkedMarketingCookie: !this.state.checkedMarketingCookie
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={10}>
            <ReactCookieConsent
              location="bottom"
              buttonText="accept"
              enableDeclineButton
              declineButtonText="decline"
              flipButtons
              disableStyles
              onAccept={this.onAccept()}
              containerClasses={classes.cc_container}
              contentClasses="cookie-content d-flex align-items-center"
              buttonClasses={classes.acceptButton}
              declineButtonClasses={classes.rejectButton}
            >
              <GridContainer>
                <GridItem
                  xs={11}
                  sm={11}
                  md={11}
                  lg={11}
                  style={{ marginLeft: 10 }}
                >
                  <h4>
                    <b>Cookies Consent</b>
                  </h4>
                  <p className={classes.uploadLabel}>
                    We collect some data when you use our website to make sure
                    it works and it is secure.
                  </p>
                  <p className={classes.uploadLabel}>
                    We would like your consent to collect data for improving our
                    services and tailor-making our products and services offered
                    on our website and portal.
                  </p>
                  <p className={classes.uploadLabel}>
                    Please accept all cookies or click Manage Cookies below to
                    choose the types of cookies we can use. You can change your
                    mind at any time.
                  </p>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <form id="cookieConsentId" className={classes.form}>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={6} lg={6}>
                        <FormControlLabel
                          className={classes.center}
                          classes={{
                            root: classes.checkboxLabelControl,
                            label: classes.checkboxLabel
                          }}
                          control={
                            <Checkbox
                              tabIndex={-1}
                              onClick={() => this.handleALLToggle()}
                              checkedIcon={
                                <Check className={classes.checkedIcon} />
                              }
                              checked={this.state.checkedAllCookie}
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{
                                checked: classes.checked,
                                root: classes.checkRoot
                              }}
                            />
                          }
                          label={
                            <div className={classes.termsText}>
                              ACCEPT ALL COOKIES
                            </div>
                          }
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6} lg={6}>
                        <FormControlLabel
                          className={classes.center}
                          classes={{
                            root: classes.checkboxLabelControl,
                            label: classes.checkboxLabel
                          }}
                          control={
                            <Checkbox
                              tabIndex={-1}
                              onClick={() => this.handleFEWToggle()}
                              checkedIcon={
                                <Check className={classes.checkedIcon} />
                              }
                              checked={this.state.checkedFewCookie}
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{
                                checked: classes.checked,
                                root: classes.checkRoot
                              }}
                            />
                          }
                          label={
                            <div className={classes.termsText}>
                              MANAGE COOKIES
                            </div>
                          }
                        />
                      </GridItem>
                      {this.state.showSpecificCookie && (
                        <React.Fragment>
                          <GridItem xs={12} sm={6} md={3} lg={3}>
                            <FormControlLabel
                              className={classes.center}
                              classes={{
                                root: classes.checkboxLabelControl,
                                label: classes.checkboxLabel
                              }}
                              control={
                                <Checkbox
                                  tabIndex={-1}
                                  // onClick={() => this.handleToggle()}
                                  checkedIcon={
                                    <Check className={classes.checkedIcon} />
                                  }
                                  icon={
                                    <Check className={classes.uncheckedIcon} />
                                  }
                                  checked={this.state.checkedNecessaryCookie}
                                  classes={{
                                    checked: classes.checked,
                                    root: classes.checkRoot
                                  }}
                                />
                              }
                              label={
                                <div className={classes.termsText}>
                                  Necessary Cookies
                                </div>
                              }
                            />
                            <p style={{ fontSize: "x-small" }}>
                              These cookies are needed to run our website and
                              keep it secure and for us to follow regulations
                              that apply to us.
                            </p>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={3} lg={3}>
                            <FormControlLabel
                              className={classes.center}
                              classes={{
                                root: classes.checkboxLabelControl,
                                label: classes.checkboxLabel
                              }}
                              control={
                                <Checkbox
                                  tabIndex={-1}
                                  // onClick={() => this.handleToggle()}
                                  checkedIcon={
                                    <Check className={classes.checkedIcon} />
                                  }
                                  checked={this.state.checkedFunctionalCookie}
                                  icon={
                                    <Check className={classes.uncheckedIcon} />
                                  }
                                  classes={{
                                    checked: classes.checked,
                                    root: classes.checkRoot
                                  }}
                                />
                              }
                              label={
                                <div className={classes.termsText}>
                                  {"Functional Cookies"} 
                                </div>
                              }
                            />
                            <p style={{ fontSize: "x-small" }}>
                              These cookies remember your region/country,
                              language, accessibility options, and your
                              settings. These may also include your User ID on
                              the logon page.
                            </p>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={3} lg={3}>
                            <FormControlLabel
                              className={classes.center}
                              classes={{
                                root: classes.checkboxLabelControl,
                                label: classes.checkboxLabel
                              }}
                              control={
                                <Checkbox
                                  tabIndex={-1}
                                  // onClick={() => this.handlePerformanceToggle()}
                                  checkedIcon={
                                    <Check className={classes.checkedIcon} />
                                  }
                                  checked={this.state.checkedPerformanceCookie}
                                  icon={
                                    <Check className={classes.uncheckedIcon} />
                                  }
                                  classes={{
                                    checked: classes.checked,
                                    root: classes.checkRoot
                                  }}
                                />
                              }
                              label={
                                <div className={classes.termsText}>
                                  {"Performance Cookies"} 
                                </div>
                              }
                            />
                            <p style={{ fontSize: "x-small" }}>
                              These cookies tell us how customers use our
                              website. We study and profile this data to help us
                              our products and performance.
                            </p>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={3} lg={3}>
                            <FormControlLabel
                              className={classes.center}
                              classes={{
                                root: classes.checkboxLabelControl,
                                label: classes.checkboxLabel
                              }}
                              control={
                                <Checkbox
                                  tabIndex={-1}
                                  onClick={() => this.handleMarketingToggle()}
                                  checkedIcon={
                                    <Check className={classes.checkedIcon} />
                                  }
                                  checked={this.state.checkedMarketingCookie}
                                  icon={
                                    <Check className={classes.uncheckedIcon} />
                                  }
                                  classes={{
                                    checked: classes.checked,
                                    root: classes.checkRoot
                                  }}
                                />
                              }
                              label={
                                <div className={classes.termsText}>
                                  Marketing Cookies
                                </div>
                              }
                            />
                            <p style={{ fontSize: "x-small" }}>
                              These cookies help us decide which products,
                              services and offers may be relevant for you. We
                              may use this data to tailor the ads you see on our
                              own and other websites and apps.
                            </p>
                          </GridItem>
                        </React.Fragment>
                      )}
                    </GridContainer>
                  </form>
                </GridItem>
              </GridContainer>
            </ReactCookieConsent>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

CookieConsent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(CookieConsent));
