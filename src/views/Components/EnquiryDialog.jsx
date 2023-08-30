import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import cx from 'classnames';

// @material-ui/icons
import Face from '@material-ui/icons/Face';
import Email from '@material-ui/icons/Email';
import Phone from '@material-ui/icons/Phone';
import Work from '@material-ui/icons/Work';
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import signupPageStyle from 'assets/jss/material-dashboard-pro-react/views/signupPageStyle';
import customInputStyle from 'assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx';

const style = (theme) => ({
  ...signupPageStyle,
  ...customSelectStyle,
  ...customInputStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: 'none',
    color: '#AAAAAA !important',
    //top: 7
  },
  select: {
    paddingBottom: 10,
    fontSize: 14,
  },
  selectFormControl: {
    [theme.breakpoints.up('lg')]: {
      marginTop: -15,
    },
  },
  countryFormControl: {
    marginTop: 5,
  },
  modalCloseButton: {
    float: 'right',
  },
  loginMaxWidth: {
    maxWidth: 650,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  emptyIcon: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  alignRight: {
    textAlign: 'right',
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

class EnquiryDialog extends React.Component {
  error = {
    firstNameErrorMsg: {
      required: 'First name is required',
      range: 'First name should be 1 to 100 characters',
    },
    lastNameErrorMsg: {
      required: 'Last name is required',
      range: 'Last name should be 1 to 100 characters',
    },
    emailErrorMsg: {
      required: 'Email is required',
      company: 'Please enter a company email',
      valid: 'Please enter a valid email',
    },
  };

  initialState = {
    showModal: false,
    preRegisteredUser: false,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    query: '',
    callInProgress: false,
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let enquiryDetails = {};
      if (props.showModal) {
        enquiryDetails = EnquiryDialog.initialState;
        enquiryDetails = {
          ...enquiryDetails,
          ...props.enquiryDetails,
        };
      }

      return {
        showModal: props.showModal,
        ...enquiryDetails,
      };
    }
    return null;
  }
  closeModal() {
    this.setState({
      ...this.initialState,
    });
    this.props.closeModal();
  }
  componentDidMount = () => {
    this.initalizeState();
  };
  initalizeState = () => {
    this.setState(this.initialState);
  };
  componentWillUnmount() {
    this.initalizeState();
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={cx(classes.container)}>
        <Dialog
          classes={{
            root: classes.center + ' ' + classes.modalRoot,
            paper: classes.modal + ' ' + classes.loginMaxWidth,
          }}
          open={this.state.showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.closeModal()}
          aria-labelledby='classic-modal-slide-title'
          aria-describedby='classic-modal-slide-description'
        >
          <DialogTitle id='classic-modal-slide-title' disableTypography className={cx(classes.modalHeader)}>
            <IconButton aria-label='close' className={classes.closeButton} onClick={() => this.closeModal()}>
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.signupModalTitle)}>Enquiry</h3>
          </DialogTitle>
          <DialogContent id='classic-modal-slide-description' className={classes.modalBody}>
            <form className={classes.form}>
              <GridContainer className={cx(classes.form)}>
                <GridItem xs={12} sm={12} md={12} lg={6}>
                  <GridContainer spacing={1} alignItems='flex-end'>
                    <GridItem className={classes.textIcon}>
                      <Face xs={1} sm={1} className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem className={classes.customText} xs={9} sm={9} md={9} lg={9}>
                      <CustomInput
                        labelText={'First Name*'}
                        id='ed_firstName'
                        inputProps={{
                          value: this.state.firstName,
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={6}>
                  <GridContainer spacing={1} alignItems='flex-start'>
                    <GridItem xs={1} sm={1} className={classes.textIcon}>
                      {/* <Icon className={classes.inputAdornmentIcon} /> */}
                    </GridItem>
                    <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={10}>
                      <CustomInput
                        labelText={'Last Name*'}
                        id='ed_lastName'
                        inputProps={{
                          value: this.state.lastName,
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={6}>
                  <GridContainer spacing={1} alignItems='flex-end'>
                    <GridItem xs={1} sm={1} className={classes.textIcon}>
                      <Email xs={1} sm={1} className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem className={classes.customText} xs={9} sm={9} md={9} lg={9}>
                      <CustomInput
                        labelText={'Corporate Email*'}
                        id='ed_email'
                        inputProps={{
                          value: this.state.email,
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={6}>
                  <GridContainer spacing={1} alignItems='flex-end'>
                    <GridItem xs={1} sm={1} className={classes.textIcon}>
                      <Phone className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={10}>
                      <CustomInput
                        labelText={'Phone Number*'}
                        id='ed_phoneNumber'
                        inputProps={{
                          value: this.state.phoneNumber,
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} alignItems='flex-end'>
                    <GridItem className={classes.textIcon}>
                      <Work className={classes.inputAdornmentIcon} />
                    </GridItem>
                    <GridItem className={classes.customText} xs={10} sm={10} md={10} lg={10}>
                      <CustomInput
                        labelText={'Company Name*'}
                        id='ed_companyName'
                        inputProps={{
                          value: this.state.companyName,
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={10} sm={10} md={11} lg={11}>
                  <CustomInput
                    labelText={'Requirement*'}
                    id='ed_query'
                    inputProps={{
                      multiline: true,
                      rows: 5,
                      value: this.state.query,
                      disabled: true,
                    }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={10} md={10} lg={12} className={classes.buttonContainer}>
                  <div className={classes.alignRight}>
                    <Button round={false} color='github' size='lg' className={classes.button} onClick={() => this.closeModal()}>
                      CLOSE
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

EnquiryDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  enquiryDetails: PropTypes.object,
};

export default withRouter(withStyles(style)(EnquiryDialog));
