import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
import Button from "components/CustomButtons/Button.jsx";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import ReactSlider from "react-slider";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// core components
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

import riskinsightquestions from "views/Pages/json/riskinsightquestions.json";
import addCustomersStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";
import {
  AddCircleOutline,
  HighlightOff,
  IndeterminateCheckBox,
  RemoveCircleOutline
} from "@material-ui/icons";

const style = theme => ({
  container: {
    paddingTop: "50px",
    paddingBottom: "60px",
    backgroundColor: "#ffffff",
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
    padding: "40px 0px 0px 0px"
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
  ...addCustomersStyle,
  ...modalStyle,
  ...customCheckboxRadioSwitch
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class RiskInsightQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionId: 0,
      currentQuestionIndex: -1,
      question: { question: "", optionType: "" },
      questions: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      currencies: [],
      dropDownCurrencies: [],
      reset: false,
      proceedWithMessage: false,
      reportObj: {},
      dislaySingleButton: false,
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: ""
    };
  }
  componentDidMount() {
    this.getCurrencies();
    this.getFirstQuestion();
    // this.setState({
    //   question: this.props.questions[0],
    //   currentQuestionId: this.props.questions[0].id,
    //   currentQuestionIndex: 0,
    //   questions: [...this.props.questions],
    //   reportObj: { ...this.props.reportObj }
    // });
  }

  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({
      currencies: res.data.currrencies,
      dropDownCurrencies: res.data.currrencies
    });
  };
  getFirstQuestion = async () => {
    this.props.toggleLoading(true);
    const res = await apiHandler({
      url: endpoint.RISKINSIGHT_FIRST_QUESTIONS,
      authToken: sessionStorage.getItem("token")
    });
    // console.log("checkcheck", res.data);
    this.props.toggleLoading(false);
    let question = {
      action: res.data && res.data.optionType === "CHECKBOX" ? false : true,
      previousQuestionId: -1,
      response: res.data && res.data.answer ? res.data.answer.name : "",
      addmore: res.data && res.data.optionType === "MULTIADD",

      // response:question&&question.optionType==='MULTIADD'?[{
      //   "amount":"",
      //   "currencyCode":""
      // }]:"",
      ...res.data
    };
    let dropDownCurrencies = this.state.currencies;
    if (question && question.optionType === "MULTIADD") {
      let answers = this.getMultiAddConfirmedAnswers(
        question && question.answer && question.answer.currencyAmounts
          ? question.answer.currencyAmounts
          : [] //,
        //0
      );
      if (answers.length === 0) {
        answers.push({
          amount: "",
          currencyCode: ""
        });
      }

      question.response = [...answers];
      dropDownCurrencies = question.showFunctionalCurrency
        ? this.state.currencies.filter(
            x => x.currencyCode === this.props.functionalCurrency
          )
        : this.state.currencies.filter(
            x => x.currencyCode !== this.props.functionalCurrency
          );

      if (question.showFunctionalCurrency) {
        let response = question.response[0];
        response['currencyCode'] = this.props.functionalCurrency;
        question.response[0] = response;
      }
    }
    this.setState({
      question: question,
      currentQuestionId: question.questionId,
      currentQuestionIndex: this.state.currentQuestionIndex + 1,
      questions: [...this.state.questions, question],
      dropDownCurrencies: dropDownCurrencies
      //reportObj: { ...this.props.reportObj }
    });
  };
  getQuestion = async (questionId, previousQuestionId, showLoading) => {
    if (showLoading) {
      this.props.toggleLoading(true);
    }
    const res = await apiHandler({
      url: endpoint.RISKINSIGHT_NEXT_QUESTIONS + "?questionid=" + questionId,
      authToken: sessionStorage.getItem("token")
    });

    this.props.toggleLoading(false);
    if (res.data && res.data.optionType) {
      let question = {
        action: res.data && res.data.optionType === "CHECKBOX" ? false : true,
        previousQuestionId: previousQuestionId,
        response:
          res.data && res.data.answer && res.data.answer.name
            ? res.data.answer.name
            : "",
        addmore: res.data && res.data.optionType === "MULTIADD",
        // response:question&&question.optionType==='MULTIADD'?[{
        //   "amount":"",
        //   "currencyCode":""
        // }]:"",
        ...res.data
      };
      console.log("checkcheckquestion", question);
      let dropDownCurrencies = this.state.currencies;
      if (question && question.optionType === "MULTIADD") {
        let answers = this.getMultiAddConfirmedAnswers(
          question && question.answer && question.answer.currencyAmounts
            ? question.answer.currencyAmounts
            : [] //,
          //0
        );
        if (answers.length === 0) {
          answers.push({
            amount: "",
            currencyCode: ""
          });
        }
        question.response = [...answers];
        dropDownCurrencies = question.showFunctionalCurrency
          ? this.state.currencies.filter(
              x => x.currencyCode === this.props.functionalCurrency
            )
          : this.state.currencies.filter(
              x => x.currencyCode !== this.props.functionalCurrency
            );
        if (question.showFunctionalCurrency) {
          let response = question.response[0];
          response['currencyCode'] = this.props.functionalCurrency;
          question.response[0] = response;
        }      
      }
      this.setState({
        question: question,
        currentQuestionId: question.questionId,
        currentQuestionIndex: this.state.currentQuestionIndex + 1,
        questions: [...this.state.questions, question],
        dropDownCurrencies: dropDownCurrencies
        //reportObj: { ...this.props.reportObj }
      });
    }
  };

  parseMultiAddAnswers = (answerOptions, index) => {
    if (
      answerOptions[index].amount !== null ||
      answerOptions[index].amount !== "" ||
      answerOptions[index].currencyCode !== null ||
      answerOptions[index].currencyCode !== ""
    ) {
      return answerOptions;
    } else {
      return [];
    }
  };

  handleClose = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      dislaySingleButton: false
    });
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      dislaySingleButton: false
    });
  };
  handleValueChange = (value, selectedOption) => {
    let question = { ...this.state.question };
    question.response = value;
    question.nextQuestionId =
      selectedOption && selectedOption.nextQuestionId
        ? selectedOption.nextQuestionId
        : question.nextQuestionId;
    this.setState({ question: question });
  };
  isValid = question => {
    console.log("isvalid", question);
    let response = "";
    if (
      (question.optionType === "CHECKBOX" ||
        question.optionType === "BUTTON" ||
        question.optionType === "SLIDER") &&
      question.response.toString() === ""
    ) {
      response = false;
    }
    if (question.optionType === "MULTIADD") {
      if (question.showFunctionalCurrency) {
        if (
          question.response.length > 0 &&
          (question.response[0].amount === "" ||
            question.response[0].amount === null)
        ) {
          response = false;
        } else {
          response = true;
        }  
      } else {
        if (
          question.response.length > 0 &&
          (question.response[0].amount === "" ||
            question.response[0].amount === null) &&
          (question.response[0].currencyCode === "" ||
            question.response[0].currencyCode === null)
        ) {
          // question.response.forEach(x => {
          //   if (x.amount === "" || x.currencyCode === "") {
          response = false;
          //   }
          // });
        } else {
          response = true;
        }
      }
    }
    return response === "" ? true : response;
  };
  confirmButtonClick = validate => {
    let question = { ...this.state.question };
    console.log("confirmButtonClick", this.state.question);
    if (
      question.questionId == 1 &&
      question.response === "I am an Investment Manager"
    ) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Message",
        noticeModalErrMsg:
          "FX Risk Insight for your business is under development",
        dislaySingleButton: true
      });
    } else if (
      validate &&
      question.action &&
      !this.isValid(this.state.question)
    ) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Message",
        noticeModalErrMsg: question.questionId == 1 && question.message === "" ? "Please make a selection. If you do not make a selection, we would assume that you are a corporate." : question.message,
        dislaySingleButton: question.showFunctionalCurrency ? true : false
      });
    } else if (
      validate &&
      question.optionType === "CHECKBOX" &&
      question.answer &&
      question.answer.name !== null &&
      question.answer.name !== question.response
    ) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Message",
        noticeModalErrMsg:
          "Your change in option will reset data for it's subsequent questions.",
        dislaySingleButton: false
      });
    } else {
      //if (!question.endNode) {
      this.setState(
        {
          noticeModal: false,
          noticeModalHeader: "Message",
          noticeModalErrMsg: "",
          dislaySingleButton: false
        },
        () => {
          this.proceedToNextQuestion();
        }
      );
      // } else {
      //   let questions = [...this.state.questions];
      //   questions[this.state.currentQuestionIndex] = { ...question };
      //   this.props.onSubmit({
      //     displayContent: "report",
      //     reportObj: this.state.reportObj,
      //     questionsObj: this.state.questions
      //   });
      //   //last question
      // }
    }
    //   }
    //   else{
    //     //last
    //   }
    //}
  };
  proceedToNextQuestion = () => {
    let question = { ...this.state.question };
    let questions = [...this.state.questions];
    // //let nextQuestionId=question.optionType==='multiadd'||question.optionType==='slider'?question.nextQuestionId:this.state.selectedOption.nextQuestionId
    // let nextQuestionId = question.nextQuestionId;

    // let index = this.state.questions.findIndex(x => x.id === nextQuestionId);
    // let nextQuestion = {
    //   ...this.state.questions[index],
    //   prevQuestionId: question.id
    // };
    questions[this.state.currentQuestionIndex] = { ...question };
    this.setState(
      {
        questions: questions
      },
      () => {
        this.callAPISubmitResponse(question);
      }
    );
  };
  getMultiAddConfirmedAnswers = response => {
    let answers = [];
    response.forEach(x => {
      if (
        x.amount !== null &&
        x.amount !== "" &&
        x.currencyCode !== null &&
        x.currencyCode !== ""
      ) {
        answers.push(x);
      }
    });
    return answers;
  };
  resetSubQuestions = async (nextQuestionId, question, skipQuestionId) => {
    const questionId = skipQuestionId ? skipQuestionId : question.questionId;
    // Find All Sub-Question Ids
    const { allQuestionList } = this.props;
    const newQuestionId = questionId + ".";
    const filterQuestion = allQuestionList.filter(
      ques =>
        ques.questionId.substr(0, newQuestionId.length).toUpperCase() ===
        newQuestionId.toUpperCase()
    );
    let selectedQuestionIds = [];
    if (filterQuestion && filterQuestion.length > 0) {
      selectedQuestionIds = filterQuestion.map(ques => ques.questionId);
    }
    if (skipQuestionId) {
      selectedQuestionIds = [skipQuestionId, ...selectedQuestionIds];
    }
    console.log("selectedQuestionIds - ", selectedQuestionIds);
    if (selectedQuestionIds.length > 0) {
      const res = await apiHandler({
        method: "DELETE",
        url:
          endpoint.RISKINSIGHT_DELETE_QUESTIONS +
          "?questionIds=" +
          selectedQuestionIds.join(","),
        authToken: sessionStorage.getItem("token")
      });
      console.log("checkcheck", res.data);
      this.callSubmitAPI(nextQuestionId, question);
    } else {
      this.callSubmitAPI(nextQuestionId, question);
    }
  };
  callAPISubmitResponse = question => {
    let checkboxOptionChanged = false;
    if (question.optionType === "MULTIADD") {
      question = {
        ...question,
        answer: {
          currencyAmounts: this.getMultiAddConfirmedAnswers(
            question.response //,
            //question.response.length - 1
          ) //[...question.response]
        }
      };
    } else if (question.optionType === "CHECKBOX") {
      let nextQuesId = question.nextQuestionId;
      // Get correct Answer option
      const correctAnsOption = question.answerOptions.filter(
        opt => opt.name === question.response
      );
      if (correctAnsOption) {
        nextQuesId = correctAnsOption[0].nextQuestionId;
      }
      if (
        question.answer &&
        question.answer.name !== null &&
        question.answer.name !== question.response
      ) {
        checkboxOptionChanged = true;
      }
      question = {
        ...question,
        nextQuestionId: nextQuesId,
        answer: {
          name: question.response
        }
      };
    } else {
      question = {
        ...question,
        answer: {
          name: question.response
        }
      };
    }
    console.log("callAPISubmitResponse", question);
    this.props.toggleLoading(true);

    //let nextQuestionId=(question.questionId==='5'||question.questionId==='6')&&question.response==='No'?'8':question.nextQuestionId
    let nextQuestionId = question.nextQuestionId;
    if (question.questionId === "7" && question.response === "No") {
      let question6 = this.state.questions.filter(x => x.questionId === "6");
      if (question6 && question6.length > 0 && question6[0].response === "No") {
        // Skip question question 8
        nextQuestionId = "9";
        this.resetSubQuestions(nextQuestionId, question, 8);
        return;
      } else {
        nextQuestionId = question.nextQuestionId;
      }
    }
    if (checkboxOptionChanged) {
      this.resetSubQuestions(nextQuestionId, question, null);
    } else {
      this.callSubmitAPI(nextQuestionId, question);
    }
  };
  callSubmitAPI = async (nextQuestionId, question) => {
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISKINSIGHT_SUBMIT_ANSWER,
      data: question,
      authToken: sessionStorage.getItem("token")
    });
    // console.log("checkcheck", res.data);
    if (question.endNode) {
      if (this.props.reportData && this.props.reportData.reportCreatedDate) {
        this.setState({
          confirmationModalHeader: "Confirmation",
          confirmationModalMsg:
            "This will replace your old Risk Insight Report otherwise download the old report and Finish questions later. Do you want to proceed?",
          confirmationModal: true
        });
      } else {
        this.props.getReport(true);
      }
    } else {
      this.getQuestion(nextQuestionId, question.questionId, false);
    }
  };
  previousButtonClick = () => {
    let previousQuestionId = this.state.question.previousQuestionId;
    let index = this.state.questions.findIndex(
      x => x.questionId === previousQuestionId
    );
    let questions = [...this.state.questions];
    questions.splice(questions.length - 1, 1);
    console.log("previousButtonClick", index);
    console.log("previousButtonClick", questions);
    console.log("previousButtonClick", questions[index]);
    console.log("previousButtonClick", previousQuestionId);
    this.setState({
      questions: questions,
      question: questions[index],
      currentQuestionId: questions[index].questionId,
      currentQuestionIndex: index
    });
  };
  getOptions = optionType => {
    console.log("checkcheck", optionType);
    console.log("checkcheck", this.state.question);
    switch (optionType) {
      case "CHECKBOX":
        return this.getCheckBoxOptions();
        break;
      case "BUTTON":
        return this.getButtonOptions();
        break;
      case "MULTIADD":
        return this.renderMultiAddOptions();
        break;
      case "SLIDER":
        return this.renderSliderOptions();
        break;
    }
  };
  getCheckBoxOptions = () => {
    const { classes } = this.props;
    return (
      <div className={classes.options}>
        {this.state.question.answerOptions.map((obj, index) => {
          return (
            <FormControlLabel
              key={index}
              className={classes.center}
              classes={{
                root: classes.checkboxLabelControl,
                label: classes.checkboxLabel
              }}
              control={
                <Checkbox
                  tabIndex={-1}
                  onClick={e => this.handleValueChange(e.target.name, obj)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  checked={this.state.question.response === obj.name}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot
                  }}
                  name={obj.name}
                />
              }
              label={<div className={classes.termsText}>{obj.name}</div>}
            />
          );
        })}
        {/*         
        <FormControlLabel
          className={classes.center}
          classes={{
            root: classes.checkboxLabelControl,
            label: classes.checkboxLabel,
          }}
          control={
            <Checkbox
              tabIndex={-1}
              onClick={(e) => this.handleValueChange(e.target.name)}
              checkedIcon={<Check className={classes.checkedIcon} />}
              checked={this.state.question.response === 'no'}
              icon={<Check className={classes.uncheckedIcon} />}
              classes={{
                checked: classes.checked,
                root: classes.checkRoot,
              }}
              name='no'
            />
          }
          label={<div className={classes.termsText}>No</div>}
        /> */}
      </div>
    );
  };
  getButtonOptions = () => {
    const { classes } = this.props;
    return (
      <div className={classes.options}>
        {this.state.question.answerOptions.map((obj, index) => {
          return (
            // <span
            //   style={{
            //     fontSize: 12,
            //     fontWeight: 500,
            //     marginRight: 25,
            //     cursor: "pointer"
            //   }}
            //   onClick={() => this.handleValueChange(obj.name, obj)}
            // >
            //   {obj.name}
            // </span>
            <Button
              key={index}
              style={
                this.state.question.response !== obj.name
                  ? {
                      textAlign: "center",
                      backgroundColor: "#ffffff",
                      color: "black",
                      border: "1px solid #1D64B0",
                      marginRight: "10px",
                      marginLeft: "10px"
                    }
                  : {
                      textAlign: "center",
                      backgroundColor: "#1D64B0",
                      marginRight: "10px",
                      marginLeft: "10px"
                    }
              }
              size="sm"
              className={classes.marginRight}
              onClick={() =>
                this.state.question.response !== obj.name
                  ? this.handleValueChange(obj.name, obj)
                  : {}
              }
            >
              {obj.name}
            </Button>
            //   ) : (
            //     <Button
            //       style={}
            //       size="sm"
            //       className={classes.marginRight}
            //     >
            //       {obj.name}
            //     </Button>
            //   );
          );
        })}
      </div>
    );
  };
  renderMultiAddOptions = () => {
    const response = this.state.question.response;
    const { classes } = this.props;
    const { currencies, dropDownCurrencies } = this.state;
    console.log("rendermultiadd", this.state.question);
    console.log("rendermultiadd", response);
    return (
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <GridContainer>
          {response.map((obj, index) => {
            return (
              <GridContainer key={index}>
                {/* <GridItem xs={12} sm={12} md={12} lg={12}> */}
                <GridItem xs={2} sm={2} md={2} lg={2} />
                <GridItem xs={3} sm={3} md={3} lg={3}>
                  <FormControl
                    fullWidth
                    style={{
                      paddingTop: 9
                    }}
                  >
                    <InputLabel
                      htmlFor="type"
                      className={classes.selectLabelRisk}
                    >
                      Currency
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      value={obj.currencyCode}
                      onChange={e =>
                        this.handleChange(
                          e.target.value,
                          "currencyCode",
                          index
                        )
                      }
                      inputProps={{
                        name: "currencycode",
                        id: "rr_currencycode",
                        classes: {
                          icon: classes.white,
                          root: classes.selectDropDown
                        }
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Currency
                      </MenuItem>
                      {dropDownCurrencies &&
                        dropDownCurrencies.map(item => (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={item.currencyCode}
                            key={item.currencyCode}
                          >
                            {item.currencyCode}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <FormControl fullWidth>
                    <CustomNumberFormat
                      value={obj.amount}
                      labelText="Amount"
                      onChange={event =>
                        this.handleChange(event.target.value, "amount", index)
                      }
                      name="amount"
                      id={"amount"}
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses
                      }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  style={{ alignSelf: "center", textAlign: "left" }}
                >
                  <IconButton
                    edge="end"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.addRangeRow(index, false);
                    }}
                    style={{
                      color: "red",
                      display: this.state.question.showFunctionalCurrency
                        ? "none"
                        : ""
                    }}
                  >
                    <HighlightOff />
                  </IconButton>
                  {response.length - 1 == index && (
                    <IconButton
                      edge="end"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        this.addRangeRow(index, true);
                      }}
                      style={{
                        color: "green",
                        display: this.state.question.showFunctionalCurrency
                          ? "none"
                          : ""
                      }}
                    >
                      <AddCircleOutline />
                    </IconButton>
                  )}
                </GridItem>
                <GridItem xs={2} sm={2} md={2} lg={2} />
                {/* </GridItem> */}
              </GridContainer>
            );
          })}
        </GridContainer>
      </GridItem>
    );
  };

  renderSliderOptions = () => {
    const { classes } = this.props;
    const { question } = this.state;

    let response = question.response === "" ? 0 : parseInt(question.response);
    return (
      <div className={classes.options}>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <GridContainer>
            <GridItem xs={2} sm={2} md={2} lg={2} />
            <GridItem
              xs={8}
              sm={8}
              md={8}
              lg={8}
              style={{ textAlign: "-webkit-center" }}
            >
              <ReactSlider
                id={"slider"}
                value={response}
                onChange={val => this.handleValueChange(val)}
                className={classes.horizontalSlider}
                thumbClassName={classes.sliderThumb}
                trackClassName={classes.sliderTrack}
                renderThumb={(props, state) => (
                  <div {...props}>{state.valueNow + "%"}</div>
                )}
              />
            </GridItem>
            <GridItem xs={2} sm={2} md={2} lg={2} />
          </GridContainer>
        </GridItem>
      </div>
    );
  };

  addRangeRow = (index, add) => {
    let arr = this.state.question.response;
    let question = this.state.question;

    if (add) {
      arr = [
        ...arr,
        {
          amount: "",
          currencyCode: ""
        }
      ];
    } else {
      arr.splice(index, 1);
      if (arr.length === 0) {
        arr = [
          ...arr,
          {
            amount: "",
            currencyCode: ""
          }
        ];
      }
    }
    question.response = [...arr];
    this.setState({
      question
    });
  };
  handleChange = (value, name, index) => {
    let question = this.state.question;
    let response = question.response[index];
    response[name] = value;
    question.response[index] = response;
    this.setState({
      question
    });
  };
  handleNegativeResponse = () => {
    this.props.toggleLoading(false);
    this.setState({
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      confirmationModal: false
    });
  };
  handlePositiveResponse = () => {
    this.setState({
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      confirmationModal: false
    });
    this.props.getReport(true);
  };
  render() {
    const { classes } = this.props;
    return (
      <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: "center" }}>
        {/* <h5 style={{ fontWeight: 500 }}>Can we achieve Hedge Accounting and which type?</h5> */}
        <div className={classes.question}>{this.state.question.question}</div>
        {this.getOptions(this.state.question.optionType)}
        <div className={classes.footer}>
          <div className={classes.left}>
            <Button
              className={this.props.previousButtonClasses}
              onClick={() =>
                this.state.currentQuestionIndex === 0 ||
                this.state.currentQuestionIndex === -1
                  ? this.props.toggleView("home")
                  : this.previousButtonClick()
              }
              color={
                this.state.currentQuestionIndex === 0 ||
                this.state.currentQuestionIndex === -1
                  ? "success"
                  : ""
              }
            >
              {this.state.currentQuestionIndex === 0 ||
              this.state.currentQuestionIndex === -1
                ? "Go back to Homepage"
                : "Previous"}
            </Button>
          </div>
          <div className={classes.right}>
            {/* {this.state.nextButton ? (
                <Button
                  color="rose"
                  className={this.props.nextButtonClasses}
                  onClick={() => this.confirmButtonClick()}
                >
                  Next
                </Button>
              ) : null} */}
            {(this.state.question.optionType === "CHECKBOX" &&
              this.state.question.response === "") ||
            !this.state.question ? (
              <></>
            ) : (
              <Button
                color={this.state.question.last ? "success" : "rose"}
                className={
                  this.state.question.last
                    ? this.props.finishButtonClasses
                    : this.props.nextButtonClasses
                }
                onClick={() => this.confirmButtonClick(true)}
              >
                {this.state.question.endNode ? "Finish" : "Next"}
              </Button>
            )}
          </div>
          <div className={classes.clearfix} />
        </div>
        {this.state.confirmationModal && (
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeResponse}
            handlePositiveButton={this.handlePositiveResponse}
          />
        )}
        {/* <NoticeModal
          noticeModal={this.state.noticeModal}
          noticeModalHeader={this.state.noticeModalHeader}
          noticeModalErrMsg={this.state.noticeModalErrMsg}
          closeModal={this.closeNoticeModal}
        /> */}
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal
          }}
          open={this.state.noticeModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle
            id="notice-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.handleClose()}
            >
              <CloseIcon />
            </IconButton>
            <h4 className={classes.modalTitle}>
              {this.state.noticeModalHeader}
            </h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <p>{this.state.noticeModalErrMsg}</p>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            {this.state.dislaySingleButton ? (
              <Button
                onClick={() => this.closeNoticeModal()}
                color="info"
                round
              >
                OK
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => this.closeNoticeModal()}
                  color="info"
                  round
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => this.confirmButtonClick(false)}
                  color="info"
                  round
                >
                  Proceed
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </GridItem>
    );
  }
}
RiskInsightQuestions.propTypes = {
  classes: PropTypes.object.isRequired,
  questions: PropTypes.object,
  reportData:  PropTypes.object,
  allQuestionList: PropTypes.object,
  toggleLoading: PropTypes.func,
  getReport: PropTypes.func
};
export default withStyles(style)(RiskInsightQuestions);
