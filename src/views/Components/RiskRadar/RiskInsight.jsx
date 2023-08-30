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
import ReactSlider from "react-slider";

// core components
import cx from "classnames";
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";

import riskinsightquestions from "views/Pages/json/riskinsightquestions.json";
import addCustomersStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";
import {
  AddCircleOutline,
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
      currentQuestionId: 0,
      currentQuestionIndex: 0,
      question: { question: "", type: "" },
      questions: [...riskinsightquestions.questions],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",

      reset: false,
      proceedWithMessage: false
    };
  }
  componentDidMount() {
    this.setState({
      question: this.state.questions[0],
      currentQuestionId: this.state.questions[0].id,
      currentQuestionIndex: 0
    });
  }
  handleClose = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  closeNoticeModal = () => {
    this.setState(
      {
        noticeModal: false,
        noticeModalHeader: "",
        noticeModalErrMsg: ""
      },
      () => {
        if (this.state.proceedWithMessage) {
          this.proceedToNextQuestion();
        }
        if (this.state.reset) {
          this.setState({
            question: [...riskinsightquestions.questions][0],
            currentQuestionId: [...riskinsightquestions.questions][0].id,
            currentQuestionIndex: 0,
            questions: [...riskinsightquestions.questions]
          });
        }
      }
    );
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
  confirmButtonClick = lastQuestion => {
    let question = { ...this.state.question };
    if (!question.last) {
      let proceedWithMessage =
        question[question.response + "Action"] == "proceedWithMessage";
      let reset = question[question.response + "Action"] == "reset";
      //   if(!lastQuestion){
      if (
        (proceedWithMessage ||
          reset ||
          question[question.response + "Action"] == "message") &&
        question.action
      ) {
        this.setState({
          reset: reset,
          proceedWithMessage: proceedWithMessage,
          noticeModal: true,
          noticeModalHeader: "Message",
          noticeModalErrMsg: question[this.state.question.response + "Message"]
        });
      }
      if (
        question[this.state.question.response + "Action"] == "proceed" ||
        !question.action
      ) {
        this.proceedToNextQuestion();
      }
    } else {
      //last
    }
    //}
  };
  proceedToNextQuestion = () => {
    let question = { ...this.state.question };
    let questions = [...this.state.questions];
    //let nextQuestionId=question.type==='multiadd'||question.type==='slider'?question.nextQuestionId:this.state.selectedOption.nextQuestionId
    let nextQuestionId = question.nextQuestionId;

    let index = this.state.questions.findIndex(x => x.id === nextQuestionId);
    let nextQuestion = {
      ...this.state.questions[index],
      prevQuestionId: question.id
    };
    questions[this.state.currentQuestionIndex] = { ...question };
    this.setState({
      question: nextQuestion,
      currentQuestionId: nextQuestion.id,
      currentQuestionIndex: index,
      questions: questions
    });
  };

  previousButtonClick = () => {
    let prevQuestionID = this.state.question.prevQuestionId;
    let index = this.state.questions.findIndex(x => x.id === prevQuestionID);
    this.setState({
      question: this.state.questions[index],
      currentQuestionId: this.state.questions[index].id,
      currentQuestionIndex: index
    });
  };
  getOptions = type => {
    switch (type) {
      case "checkbox":
        return this.getCheckBoxOptions();
      case "button":
        return this.getButtonOptions();
      case "multiadd":
        return this.renderMultiAddOptions();
      case "slider":
        return this.renderSliderOptions();
    }
  };
  getCheckBoxOptions = () => {
    const { classes } = this.props;
    return (
      <div className={classes.options}>
        {this.state.question.options.map((obj, index) => {
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
              label={<div className={classes.termsText}>{obj.displayName}</div>}
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
        {this.state.question.options.map((obj, index) => {
          return this.state.question.response !== obj.name ? (
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                marginRight: 25,
                cursor: "pointer"
              }}
              onClick={() => this.handleValueChange(obj.name, obj)}
            >
              {obj.displayName}
            </span>
          ) : (
            <Button
              style={{
                textAlign: "center",
                backgroundColor: "#1D64B0"
              }}
              size="sm"
              className={classes.marginRight}
            >
              {obj.displayName}
            </Button>
          );
        })}
      </div>
    );
  };
  renderMultiAddOptions = () => {
    const response = this.state.question.response;
    const { classes, currencies } = this.props;

    return (
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <GridContainer>
          {response.map((obj, index) => {
            return (
              <GridContainer key={index}>
                {/* <GridItem xs={12} sm={12} md={12} lg={12}> */}

                <GridItem xs={5} sm={5} md={5} lg={5}>
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
                      {currencies &&
                        currencies.map(item => (
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
                <GridItem xs={5} sm={5} md={5} lg={5}>
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
                        style: { marginTop: -5 },
                        fullWidth: true,
                        className: classes.customFormControlClasses
                      }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ alignSelf: "center" }}
                >
                  <IconButton
                    edge="end"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.addRangeRow(index, response.length - 1 == index);
                    }}
                    style={{
                      display: !this.state.question.addmore ? "none" : ""
                    }}
                  >
                    {response.length - 1 == index ? (
                      <AddCircleOutline />
                    ) : (
                      <RemoveCircleOutline />
                    )}
                  </IconButton>
                </GridItem>

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
    return (
      <div className={classes.options}>
        <ReactSlider
          id={"slider"}
          value={question.response}
          onChange={val => this.handleValueChange(val)}
          className={classes.horizontalSlider}
          thumbClassName={classes.sliderThumb}
          trackClassName={classes.sliderTrack}
          renderThumb={(props, state) => (
            <div {...props}>{state.valueNow + "%"}</div>
          )}
        />
      </div>
    );
  };

  addRangeRow = (index, add) => {
    let arr = this.state.question.response;
    let question = this.state.question;

    if (add) {
      arr = [...arr, { ...question.defaultOption }];
    } else {
      arr.splice(index, 1);
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
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {/* <h5 style={{ fontWeight: 500 }}>Can we achieve Hedge Accounting and which type?</h5> */}
        <div className={classes.question}>{this.state.question.question}</div>
        {this.getOptions(this.state.question.type)}
        <div className={classes.footer}>
          <div className={classes.left}>
            {this.state.currentQuestionIndex !== 0 ? (
              <Button
                className={this.props.previousButtonClasses}
                onClick={() => this.previousButtonClick()}
              >
                Previous
              </Button>
            ) : null}
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
            {this.state.question.response !== "" && (
              <Button
                color={this.state.question.last ? "success" : "rose"}
                className={
                  this.state.question.last
                    ? this.props.finishButtonClasses
                    : this.props.nextButtonClasses
                }
                onClick={() =>
                  this.confirmButtonClick(this.state.question.last)
                }
              >
                {this.state.question.last ? "GET FX RISK INSIGHT" : "Next"}
              </Button>
            )}
          </div>
          <div className={classes.clearfix} />
        </div>
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
            <Button onClick={() => this.closeNoticeModal()} color="info" round>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
RiskInsight.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(RiskInsight);
