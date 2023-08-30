import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Check from '@material-ui/icons/Check';
import Button from 'components/CustomButtons/Button.jsx';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';

// core components
import cx from 'classnames';
import modalStyle from 'assets/jss/material-dashboard-pro-react/modalStyle.jsx';

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';

import hedgeaccountingquestions from 'views/Pages/json/hedgeaccountingquestions.json';
import addCustomersStyle from 'assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx';

const style = (theme) => ({
  container: {
    paddingTop: '50px',
    paddingBottom: '60px',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    marginTop: 15,
    padding: 20,
  },
  options: {
    marginTop: '25px',
  },
  footer: {
    padding: '20px 15px 0px 15px',
  },
  left: {
    float: 'left!important',
  },
  right: {
    float: 'right!important',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  ...addCustomersStyle,
  ...modalStyle,
  ...customCheckboxRadioSwitch,
});

function Transition(props) {
  return <Slide direction='down' {...props} />;
}

class HedgeAccountingQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionId: 0,
      currentQuestionIndex: 0,
      question: { question: '' },
      questions: [...hedgeaccountingquestions.questions],

      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',

      reset: false,
      proceedWithMessage: false,
    };
  }
  componentDidMount() {
    // console.log(this.props.questions[0].id)
    this.setState({
      question: this.state.questions[0],
      currentQuestionId: this.state.questions[0].id,
      currentQuestionIndex: 0,
    });
  }
  handleClose = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    });
  };
  closeNoticeModal = () => {
    this.setState(
      {
        noticeModal: false,
        noticeModalHeader: '',
        noticeModalErrMsg: '',
      },
      () => {
        if (this.state.proceedWithMessage) {
          this.proceedToNextQuestion();
        }
        if (this.state.reset) {
          this.setState({
            question: [...hedgeaccountingquestions.questions][0],
            currentQuestionId: [...hedgeaccountingquestions.questions][0].id,
            currentQuestionIndex: 0,
            questions: [...hedgeaccountingquestions.questions],
          });
        }
      }
    );
  };
  handleCheckboxToggle = (e) => {
    let question = { ...this.state.question };
    console.log(question);
    question.response = e.target.name;

    this.setState({ question });
  };
  confirmButtonClick = (lastQuestion) => {
    let question = { ...this.state.question };
    let proceedWithMessage = question[question.response + 'Action'] == 'proceedWithMessage';
    let reset = question[question.response + 'Action'] == 'reset';
    //   if(!lastQuestion){
    if (proceedWithMessage || reset || question[question.response + 'Action'] == 'message') {
      this.setState({
        reset: reset,
        proceedWithMessage: proceedWithMessage,
        noticeModal: true,
        noticeModalHeader: 'Message',
        noticeModalErrMsg: question[this.state.question.response + 'Message'],
      });
    }
    if (question[this.state.question.response + 'Action'] == 'proceed') {
      this.proceedToNextQuestion();
    }

    //}
  };
  proceedToNextQuestion = () => {
    let question = { ...this.state.question };
    let questions = [...this.state.questions];
    console.log('questions', questions);
    let index = this.state.questions.findIndex((x) => x.id === question[question.response + 'NextQuestionId']);
    console.log(index);
    console.log(question);
    // console.log(index);
    questions[this.state.currentQuestionIndex] = { ...question };
    // console.log(questions);
    // console.log(question);
    this.setState({
      questions,
    });
    this.setState({
      question: this.state.questions[index],
      currentQuestionId: this.state.questions[index].id,
      currentQuestionIndex: index,
    });
  };

  previousButtonClick = () => {
    let index = this.state.questions.findIndex((x) => x.id === this.state.question.prevQuestionId);

    this.setState({
      question: this.state.questions[index],
      currentQuestionId: this.state.questions[index].id,
      currentQuestionIndex: index,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <h5 style={{ fontWeight: 500 }}>Can we achieve Hedge Accounting and which type?</h5>
        <div className={classes.question}>{this.state.question.question}</div>
        <div className={classes.options}>
          <FormControlLabel
            className={classes.center}
            classes={{
              root: classes.checkboxLabelControl,
              label: classes.checkboxLabel,
            }}
            control={
              <Checkbox
                tabIndex={-1}
                onClick={(e) => this.handleCheckboxToggle(e)}
                checkedIcon={<Check className={classes.checkedIcon} />}
                checked={this.state.question.response === 'yes'}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot,
                }}
                name='yes'
              />
            }
            label={<div className={classes.termsText}>Yes</div>}
          />
          <FormControlLabel
            className={classes.center}
            classes={{
              root: classes.checkboxLabelControl,
              label: classes.checkboxLabel,
            }}
            control={
              <Checkbox
                tabIndex={-1}
                onClick={(e) => this.handleCheckboxToggle(e)}
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
          />
        </div>
        <div className={classes.footer}>
          <div className={classes.left}>
            {this.state.currentQuestionIndex !== 0 ? (
              <Button className={this.props.previousButtonClasses} onClick={() => this.previousButtonClick()}>
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
            {this.state.question.response !== '' && (
              <Button
                color='rose'
                className={this.state.question.last ? this.props.finishButtonClasses : this.props.nextButtonClasses}
                onClick={() => this.confirmButtonClick(this.state.question.last)}
              >
                {this.state.question.last ? 'Finish' : 'Next'}
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
            root: classes.center + ' ' + classes.modalRoot,
            paper: classes.modal,
          }}
          open={this.state.noticeModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby='notice-modal-slide-title'
          aria-describedby='notice-modal-slide-description'
        >
          <DialogTitle id='notice-modal-slide-title' disableTypography className={classes.modalHeader}>
            <IconButton aria-label='close' className={classes.closeButton} onClick={() => this.handleClose()}>
              <CloseIcon />
            </IconButton>
            <h4 className={classes.modalTitle}>{this.state.noticeModalHeader}</h4>
          </DialogTitle>
          <DialogContent id='notice-modal-slide-description' className={classes.modalBody}>
            <p>{this.state.noticeModalErrMsg}</p>
          </DialogContent>
          <DialogActions className={classes.modalFooter + ' ' + classes.modalFooterCenter}>
            <Button onClick={() => this.closeNoticeModal()} color='info' round>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
HedgeAccountingQuestions.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(HedgeAccountingQuestions);
