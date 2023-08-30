import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
import Button from "components/CustomButtons/Button.jsx";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import NoticeModal from "views/Components/NoticeModal.jsx";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// core components
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

import riskinsightquestions from "views/Pages/json/riskinsightquestions.json";
import riskinsightapiresponse from "views/Pages/json/riskinsightapiresponse.json";
import addCustomersStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";

import RiskInsightQuestions from "../Components/RiskInsight/RiskInsightQuestions";
import RiskInsightReport from "../Components/RiskInsight/RiskInsightReport";

const style = theme => ({
  container: {
    padding: "20px 20px 80px 20px",
    //paddingBottom: "60px",
    backgroundColor: "#ffffff"
  },
  description: {
    fontWeight: "bold",
    textAlign: "center"
  },
  question: {
    fontSize: 20,
    marginTop: 15,
    padding: 20
  },
  options: {
    marginTop: "25px"
  },
  footer: {
    padding: "20px 15px 0px 15px"
  },
  left: {
    float: "left!important"
  },
  right: {
    float: "right!important"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  horizontalSlider: {
    width: "100%",
    maxWidth: 500,
    height: 50,
    top: 10,

    // border: '1px solid grey',
    "& sliderThumb": {
      top: 1,
      width: 50,
      height: 48,
      lineHeight: 38
    },
    "& sliderTrack": {
      top: 10,
      height: 10
    }
  },
  sliderThumb: {
    fontSize: "0.9em",
    textAlign: "center",
    backgroundColor: "#000",
    color: "#FFF",
    cursor: "pointer",
    border: "5px solid gray",
    boxSizing: "border-box"
  },
  sliderTrack: {
    position: "relative",
    background: "#0000001a",
    top: 10,
    height: 10
  },
  contentBox: {
    border: "#ACACAC 1px solid",
    padding: "10px"
  },
  heading: {
    marginTop: "10px"
  },
  ...addCustomersStyle,
  ...modalStyle,
  ...customCheckboxRadioSwitch
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class RiskInsight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callInProgress: false,

      currentQuestionId: 0,
      currentQuestionIndex: 0,
      question: { question: "", type: "" },
      questionsObj: [], //[...riskinsightapiresponse],
      questions: [], //[...riskinsightapiresponse],

      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      currencies: [],
      reset: false,
      proceedWithMessage: false,
      displayQuestions: true,
      reportReport: {},
      displayContent: "home",
      allQuestionsSubmitted: false,
      functionalCurrency: "",
      reportData: {}
    };
  }
  componentDidMount() {
    this.getBaseCurrency();
    this.getQuestionsSubmitted();
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  getBaseCurrency = async () => {
    // Get Base Currency
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      console.error(res.data.userDesc);
      return;
    } else {
      this.setState({
        functionalCurrency: res.data.baseCurrency
      }, () => {
        this.getReport(false);
      });
    }
  };
  getReport = async openReport => {
    this.toggleLoading(true);
    const res = await apiHandler({
      url: endpoint.RISKINSIGHT_REPORT + "?calculate=" + openReport + "&baseCurrency=" + this.state.functionalCurrency,
      authToken: sessionStorage.getItem("token")
    });
    this.toggleLoading(false);
    if (res.data.errorCode) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: res.data.userDesc
      });
      return;
    } else {
      this.setState({
        displayContent: openReport ? "report" : "home",
        questions: this.parseQuestions(res.data),
        allQuestionsSubmitted: this.checkAllQuestionsSubmitted(res.data),
        reportData: res.data
      });
      console.log("checkcheck getReport", res.data);
    }
  };
  parseQuestions = questions => {
    let arr = [];
    if (
      questions &&
      questions.questionaries &&
      questions.questionaries.length > 0
    ) {
      questions.questionaries.forEach(x => {
        arr.push({
          ...x,
          response:
            x.optionType === "MULTIADD"
              ? x.answerOptions
              : x.answer
              ? x.answer.name
              : ""
        });
      });
    }
    return arr;
  };
  getQuestionsSubmitted = async () => {
    this.toggleLoading(true);
    const res = await apiHandler({
      url: endpoint.RISKINSIGHT_ALL_QUESTIONS,
      authToken: sessionStorage.getItem("token")
    });
    this.toggleLoading(false);
    // this.setState({
    //   allQuestionsSubmitted:this.checkAllQuestionsSubmitted(res.data)
    // })
    console.log("checkcheck getQuestionsSubmitted", res.data);
  };
  checkAllQuestionsSubmitted = response => {
    if (
      response &&
      response.questionaries &&
      response.questionaries.length > 0
    ) {
      let lastNodeQuestionSubmitted = response.questionaries.filter(
        x => x.endNode & (x.answer !== null)
      );
      return lastNodeQuestionSubmitted.length > 0;
    } else {
      return false;
    }
  };

  onClick = obj => {
    this.setState({
      ...obj
    });
  };
  toggleView = name => {
    this.setState({
      displayContent: name
    });
  };
  toggleLoading = value => {
    this.setState({
      callInProgress: value
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <h4 style={{ display: "inline-block" }}>
            <b>Risk Insight</b>
          </h4>
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <div className={classes.container}>
            <GridContainer>
              {this.state.displayContent === "home" ? (
                <>
                  <GridItem
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                    className={classes.heading}
                  >
                    <p style={{ fontWeight: "bold" }}>
                      Risk Insight Description
                    </p>
                    <div className={classes.contentBox}>
                      <p>
                        This tool gives insight into the foreign exchange (FX)
                        risks that exist in your business.
                      </p>
                    </div>
                  </GridItem>
                  <GridItem
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                    className={classes.heading}
                  >
                    <p style={{ fontWeight: "bold" }}>How it will help you</p>
                    <div className={classes.contentBox}>
                      <p>
                        Risk Insight helps you identify different types of FX
                        risks in your business. It also allows you to quantify
                        these FX risks. Furthermore, it suggests a way forward
                        for you to mitigate and manage FX risks in your
                        business.
                      </p>
                    </div>
                  </GridItem>
                  <GridItem
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                    className={classes.heading}
                  >
                    <p style={{ fontWeight: "bold" }}>
                      What information is required
                    </p>
                    <div className={classes.contentBox}>
                      <p>
                        You will be asked several questions related to potential
                        FX exposures you may have in your business. The
                        questionnaire is simple, and it should not take more
                        than 15 minutes to complete. If you do not know the
                        answer to specific questions, you can always come back
                        and edit your responses. Some of the questions are
                        optional and do not require a response.
                      </p>
                    </div>
                  </GridItem>
                  <GridItem
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                    style={{ textAlign: "right", marginTop: 30 }}
                  >
                    <GridContainer>
                      <GridItem
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{ textAlign: "left" }}
                      >
                        <Button
                          color={"success"}
                          className={this.props.finishButtonClasses}
                          onClick={() => this.toggleView("report")}
                          style={{
                            visibility: this.state.allQuestionsSubmitted
                              ? ""
                              : "hidden"
                          }}
                        >
                          View Previous Report
                        </Button>
                      </GridItem>
                      <GridItem
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          color={"success"}
                          className={this.props.finishButtonClasses}
                          onClick={() => this.toggleView("questions")}
                        >
                          {this.state.allQuestionsSubmitted
                            ? "EDIT RISK INSIGHT"
                            : "CREATE RISK INSIGHT"}
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </>
              ) : this.state.displayContent === "questions" ? (
                <RiskInsightQuestions
                  questions={this.state.questionsObj}
                  allQuestionList={this.state.questions}
                  reportData={this.state.reportData}
                  getReport={this.getReport}
                  toggleView={this.toggleView}
                  toggleLoading={this.toggleLoading}
                  functionalCurrency={this.state.functionalCurrency}
                />
              ) : (
                <RiskInsightReport
                  reportObj={this.state.reportObj}
                  onEdit={this.onClick}
                  questionsObj={this.state.questions}
                  toggleView={this.toggleView}
                  toggleLoading={this.toggleLoading}
                  functionalCurrency={this.state.functionalCurrency}
                  reportData={this.state.reportData}
                />
              )}
            </GridContainer>
            <NoticeModal
              noticeModal={this.state.noticeModal}
              noticeModalHeader={this.state.noticeModalHeader}
              noticeModalErrMsg={this.state.noticeModalErrMsg}
              closeModal={this.closeNoticeModal}
            />
          </div>
        </GridItem>
        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
            }}
            open={this.state.callInProgress}
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
        )}{" "}
      </GridContainer>
    );
  }
}
RiskInsight.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(RiskInsight);
