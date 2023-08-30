import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
//import Wizard from "components/Wizard/Wizard.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";

import wizardStyle from "assets/jss/material-dashboard-pro-react/components/wizardStyle.jsx";

class Wizard extends React.Component {
  constructor(props) {
    super(props);
    var width;
    if (this.props.steps.length === 1) {
      width = "100%";
    } else {
      if (window.innerWidth < 600) {
        if (this.props.steps.length !== 3) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      } else {
        if (this.props.steps.length === 2) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      }
    }
    this.state = {
      currentStep: 0,
      color: this.props.color,
      nextButton: this.props.steps.length > 1 ? true : false,
      previousButton: false,
      finishButton: this.props.steps.length === 1 ? true : false,
      width: width,
      movingTabStyle: {
        transition: "transform 0s"
      },
      allStates: {},
      apiDataFetched: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
    this.navigationStepChange = this.navigationStepChange.bind(this);
    this.refreshAnimation = this.refreshAnimation.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.finishButtonClick = this.finishButtonClick.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  componentDidMount() {
    this.refreshAnimation(0);
    window.addEventListener("resize", this.updateWidth);
    this.getRegistrationData();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }
  getRegistrationData = async () => {
    const res = await apiHandler({
      url: endpoint.CUSTOMER_REGISTRATION,
      authToken: sessionStorage.getItem("token")
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
      this.parseData(res.data);
    }
  };
  parseData = apiData => {
    if (!Object.keys(apiData).length) {
      this.setState({
        allStates: {}
      });
    } else {
      let data = {};
      if (apiData && apiData.companyName) {
        // means user has completed 1st step. CompanyName is first mandatory field in step 1
        data = { ...data, ...this.parseStep1Data(apiData) };
        console.log("parseStep1Data", data);
      }
      if (apiData && apiData.directors && apiData.directors.length > 0) {
        // means user has completed 2ndt step. directors is mandatory field in step 2
        data = { ...data, ...this.parseStep2Data(apiData) };
      }

      if (apiData && apiData.companyDesc) {
        // means user has completed 3 step. companyDesc is first mandatory field in step 3
        data = { ...data, ...this.parseStep3Data(apiData) };
      }
      if (apiData && apiData.companyName) {
        // means user has completed 1st step. CompanyName is first mandatory field in step 1
        data = { ...data, ...this.parseStep4Data(apiData) };
      }
      this.setState({
        allStates: data,
        apiDataFetched: true
      });
    }
  };
  parseStep1Data = apiData => {
    return {
      companyName: apiData.companyName,
      companyNameState: "success",
      incorporationNumber: apiData.incorporationNumber,
      incorporationNumberState: "success",
      companyEmail: apiData.companyEmail
        ? apiData.companyEmail
        : apiData.contactEmail,
      companyEmailState: "success",

      address: apiData.registeredOfficeAddress.address,
      addressState: "success",

      city: apiData.registeredOfficeAddress.city,
      cityState: "success",

      postalCode: apiData.registeredOfficeAddress.postalCode,
      postalCodeState: "success",

      countryCode: apiData.registeredOfficeAddress.countryCode,
      countryCodeState: "success",

      type: apiData.ownershipType ? apiData.ownershipType : "",
      typeState: "success",

      mainStockMarket: apiData.mainStockMarket ? apiData.mainStockMarket : "",
      mainStockMarketState:
        apiData.ownershipType && apiData.ownershipType == "Private"
          ? "success"
          : "",

      secondaryStockMarket: apiData.secondaryStockMarket
        ? apiData.secondaryStockMarket
        : "",
      secondaryStockMarketState:
        apiData.ownershipType && apiData.ownershipType == "Private"
          ? "success"
          : ""
    };
  };
  parseStep2Data = apiData => {
    return { directors: [...apiData.directors] };
  };

  parseStep3Data = apiData => {
    return {
      companyDesc: apiData.companyDesc,
      companyDescState: "success",
      contactName: apiData.contactName,
      contactNameState: "success",

      contactEmail: apiData.contactEmail,
      contactEmailState: "success",

      contactTitle: apiData.contactTitle,
      contactTitleState: "success",

      contactAddress: apiData.businessAddress.address,
      contactAddressState: "success",

      contactCity: apiData.businessAddress.city,
      contactCityState: "success",

      contactPostalCode: apiData.businessAddress.postalCode,
      contactPostalCodeState: "success",

      countryCode: apiData.businessAddress.countryCode,
      countryCodeState: "success",

      platform: apiData.platformUsage,
      platformState: "success",

      turnover: apiData.turnover,
      turnoverState: "success",

      payments: apiData.payments,
      paymentsState: "success"
    };
  };
  parseStep4Data = apiData => {
    return {
      skipKyc: apiData.skipKyc
    };
  };

  updateWidth() {
    this.refreshAnimation(this.state.currentStep);
  }
  navigationStepChange(key) {
    if (this.props.steps) {
      var validationState = true;
      if (key > this.state.currentStep) {
        for (var i = this.state.currentStep; i < key; i++) {
          if (this[this.props.steps[i].stepId].sendState !== undefined) {
            this.setState({
              allStates: {
                ...this.state.allStates,
                [this.props.steps[i].stepId]: this[
                  this.props.steps[i].stepId
                ].sendState()
              }
            });
          }
          if (
            this[this.props.steps[i].stepId].isValidated !== undefined &&
            this[this.props.steps[i].stepId].isValidated() === false
          ) {
            validationState = false;
            break;
          }
        }
      }
      if (validationState) {
        this.setState({
          currentStep: key,
          nextButton: this.props.steps.length > key + 1 ? true : false,
          previousButton: key > 0 ? true : false,
          finishButton: this.props.steps.length === key + 1 ? true : false
        });
        this.refreshAnimation(key);
      }
    }
  }
  nextButtonClick() {
    if (
      (this.props.validate &&
        ((this[this.props.steps[this.state.currentStep].stepId].isValidated !==
          undefined &&
          this[
            this.props.steps[this.state.currentStep].stepId
          ].isValidated()) ||
          this[this.props.steps[this.state.currentStep].stepId].isValidated ===
            undefined)) ||
      this.props.validate === undefined
    ) {
      if (
        this[this.props.steps[this.state.currentStep].stepId].sendState !==
        undefined
      ) {
        this.setState(
          {
            allStates: {
              ...this.state.allStates,
              [this.props.steps[this.state.currentStep].stepId]: this[
                this.props.steps[this.state.currentStep].stepId
              ].sendState()
            }
          },
          () => {
            this.saveRegistrationData(this.state.allStates);
          }
        );
      }
      // var key = this.state.currentStep + 1;
      // this.setState({
      //   dataChangeKey:this.state.dataChangeKey+1,
      //   currentStep: key,
      //   nextButton: this.props.steps.length > key + 1 ? true : false,
      //   previousButton: key > 0 ? true : false,
      //   finishButton: this.props.steps.length === key + 1 ? true : false
      // });
      // this.refreshAnimation(key);
    }
  }
  getAlpha2Code = data => {
    if (data.countryCode && data.countryCode) {
      let alpha2 = data.countries.filter(item => {
        return item.countryCode === data.countryCode;
      })[0];
      return alpha2;
    } else {
      return "";
    }
  };
  getValue = (data, key) => {
    return data[key] ? data[key] : "";
  };
  saveRegistrationData = (data, stepIndex) => {
    let apiData = {};
    let ci = data.companyInformation;
    let ci_alpha = this.getAlpha2Code(ci);

    let customerRegistration = {
      companyName: this.getValue(ci, "companyName"),
      incorporationNumber: this.getValue(ci, "incorporationNumber"),
      companyEmail: this.getValue(ci, "companyEmail"),
      registeredOfficeAddress: {
        address: this.getValue(ci, "address"),
        city: this.getValue(ci, "city"),
        postalCode: this.getValue(ci, "postalCode"),
        countryCode: this.getValue(ci, "countryCode"),
        alpha2Code: ci_alpha && ci_alpha.alpha2Code ? ci_alpha.alpha2Code : ""
      },
      ownershipType: this.getValue(ci, "type"),
      mainStockMarket: this.getValue(ci, "mainStockMarket"),
      secondaryStockMarket: this.getValue(ci, "secondaryStockMarket")
    };
    apiData = { ...apiData, ...customerRegistration };

    // if(this.state.currentStep>0){
    if (data.directors && data.directors.directors) {
      apiData = { ...apiData, directors: data.directors.directors };
    } else if (data.directors) {
      apiData = { ...apiData, directors: data.directors };
    }
    //&&data.directors.directors? data.directors.directors:[]

    if (data.additionalInformation) {
      let ai = data.additionalInformation;
      if (ai.otherReason && ai.otherReason !== "") {
        ai.platform.push(ai.otherReason);
      }
      let ai_alpha = this.getAlpha2Code(ai.countries, ai.countryCode);

      let customerRegistration = {
        companyDesc: ai.companyDesc,
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
        payments: ai.payments
      };
      apiData = { ...apiData, ...customerRegistration };
    } else if (data.companyDesc) {
      let ai = data;
      if (ai.otherReason && ai.otherReason !== "") {
        ai.platform.push(ai.otherReason);
      }
      let ai_alpha = ai.alpha2Code;

      let customerRegistration = {
        companyDesc: ai.companyDesc,
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
        payments: ai.payments
      };
      apiData = { ...apiData, ...customerRegistration };
    }
    console.log("callRegistrationAPI", apiData);
    console.log("callRegistrationAPI", this.state.currentStep);

    this.callRegistrationAPI(apiData);
  };
  callRegistrationAPI = async data => {
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CUSTOMER_REGISTRATION,
      data: data,
      authToken: sessionStorage.getItem("token")
    });
    // const cms = res.data;
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
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      // setViewType(3);
      // sessionStorage.setItem('customerRegistrationAppliedDate', formatDate(new Date()));
      // registerToken();
      var key = this.state.currentStep + 1;
      this.setState({
        currentStep: key,
        nextButton: this.props.steps.length > key + 1 ? true : false,
        previousButton: key > 0 ? true : false,
        finishButton: this.props.steps.length === key + 1 ? true : false
      });
      this.refreshAnimation(key);
    }
  };
  previousButtonClick() {
    if (
      this[this.props.steps[this.state.currentStep].stepId].sendState !==
      undefined
    ) {
      this.setState({
        allStates: {
          ...this.state.allStates,
          [this.props.steps[this.state.currentStep].stepId]: this[
            this.props.steps[this.state.currentStep].stepId
          ].sendState()
        }
      });
    }
    var key = this.state.currentStep - 1;
    if (key >= 0) {
      this.setState({
        currentStep: key,
        nextButton: this.props.steps.length > key + 1 ? true : false,
        previousButton: key > 0 ? true : false,
        finishButton: this.props.steps.length === key + 1 ? true : false
      });
      this.refreshAnimation(key);
    }
  }
  finishButtonClick() {
    if (
      (this.props.validate === false &&
        this.props.finishButtonClick !== undefined) ||
      (this.props.validate &&
        ((this[this.props.steps[this.state.currentStep].stepId].isValidated !==
          undefined &&
          this[
            this.props.steps[this.state.currentStep].stepId
          ].isValidated()) ||
          this[this.props.steps[this.state.currentStep].stepId].isValidated ===
            undefined) &&
        this.props.finishButtonClick !== undefined)
    ) {
      this.setState(
        {
          allStates: {
            ...this.state.allStates,
            [this.props.steps[this.state.currentStep].stepId]: this[
              this.props.steps[this.state.currentStep].stepId
            ].sendState()
          }
        },
        () => {
          this.props.finishButtonClick(this.state.allStates);
        }
      );
    }
  }
  refreshAnimation(index) {
    var total = this.props.steps.length;
    var li_width = 100 / total;
    var total_steps = this.props.steps.length;
    var move_distance = this.refs.wizard.children[0].offsetWidth / total_steps;
    var index_temp = index;
    var vertical_level = 0;

    var mobile_device = window.innerWidth < 600 && total > 3;

    if (mobile_device) {
      move_distance = this.refs.wizard.children[0].offsetWidth / 2;
      index_temp = index % 2;
      li_width = 50;
    }

    this.setState({ width: li_width + "%" });

    var step_width = move_distance;
    move_distance = move_distance * index_temp;

    var current = index + 1;

    if (current === 1 || (mobile_device === true && index % 2 === 0)) {
      move_distance -= 8;
    } else if (
      current === total_steps ||
      (mobile_device === true && index % 2 === 1)
    ) {
      move_distance += 8;
    }

    if (mobile_device) {
      vertical_level = parseInt(index / 2, 10);
      vertical_level = vertical_level * 38;
    }
    var movingTabStyle = {
      width: step_width,
      transform:
        "translate3d(" + move_distance + "px, " + vertical_level + "px, 0)",
      transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)"
    };
    this.setState({ movingTabStyle: movingTabStyle });
  }
  render() {
    const { classes, title, subtitle, color, steps } = this.props;
    return (
      <div className={classes.wizardContainer} ref="wizard">
        <Card className={classes.card}>
          {(title || subtitle) && (
            <div className={classes.wizardHeader}>
              <h3 className={classes.title}>{title}</h3>
              <h5 className={classes.subtitle}>{subtitle}</h5>
            </div>
          )}
          <div className={classes.wizardNavigation}>
            <ul className={classes.nav}>
              {steps.map((prop, key) => {
                return (
                  <li
                    className={classes.steps}
                    key={key}
                    style={{ width: this.state.width }}
                  >
                    <a
                      href="#pablo"
                      className={classes.stepsAnchor}
                      onClick={e => {
                        e.preventDefault();
                        this.navigationStepChange(key);
                      }}
                    >
                      {prop.stepName}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div
              className={classes.movingTab + " " + classes[color]}
              style={this.state.movingTabStyle}
            >
              {steps[this.state.currentStep].stepName}
            </div>
          </div>
          <div className={classes.content}>
            {steps.map((prop, key) => {
              const stepContentClasses = cx({
                [classes.stepContentActive]: this.state.currentStep === key,
                [classes.stepContent]: this.state.currentStep !== key
              });
              return (
                <div className={stepContentClasses} key={key}>
                  <prop.stepComponent
                    innerRef={node => (this[prop.stepId] = node)}
                    allStates={this.state.allStates}
                    apiDataFetched={this.state.apiDataFetched}
                  />
                </div>
              );
            })}
          </div>
          <div className={classes.footer}>
            <div className={classes.left}>
              {this.state.previousButton ? (
                <Button
                  className={this.props.previousButtonClasses}
                  onClick={() => this.previousButtonClick()}
                >
                  {this.props.previousButtonText}
                </Button>
              ) : null}
            </div>
            <div className={classes.right}>
              {this.state.nextButton ? (
                <Button
                  color="rose"
                  className={this.props.nextButtonClasses}
                  onClick={() => this.nextButtonClick()}
                >
                  {this.props.nextButtonText}
                </Button>
              ) : null}
              {this.state.finishButton ? (
                <Button
                  color="rose"
                  className={this.finishButtonClasses}
                  onClick={() => this.finishButtonClick()}
                >
                  {this.props.finishButtonText}
                </Button>
              ) : null}
            </div>
            <div className={classes.clearfix} />
          </div>
        </Card>
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
      </div>
    );
  }
}

Wizard.defaultProps = {
  color: "rose",
  title: "Here should go your title",
  subtitle: "And this would be your subtitle",
  previousButtonText: "Previous",
  previousButtonClasses: "",
  nextButtonClasses: "",
  nextButtonText: "Next",
  finishButtonClasses: "",
  finishButtonText: "Finish"
};

Wizard.propTypes = {
  classes: PropTypes.object.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      stepName: PropTypes.string.isRequired,
      stepComponent: PropTypes.func.isRequired,
      stepId: PropTypes.string.isRequired
    })
  ).isRequired,
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose"
  ]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  previousButtonClasses: PropTypes.string,
  previousButtonText: PropTypes.string,
  nextButtonClasses: PropTypes.string,
  nextButtonText: PropTypes.string,
  finishButtonClasses: PropTypes.string,
  finishButtonText: PropTypes.string,
  finishButtonClick: PropTypes.func,
  validate: PropTypes.bool
};

export default withRouter(withStyles(wizardStyle)(Wizard));
