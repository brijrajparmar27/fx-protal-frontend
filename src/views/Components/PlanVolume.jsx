import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import cx from 'classnames';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import CustomNumberFormat from 'components/CustomNumberFormat/CustomNumberFormat.jsx';

import { validate } from '../../utils/Validator';
import addBeneficiaryStyle from 'assets/jss/material-dashboard-pro-react/views/addBeneficiaryStyle.jsx';
import { parseCurrency } from '../../utils/Utils';

function Transition(props) {
  return <Slide direction='down' {...props} />;
}

class PlanVolume extends React.Component {
  error = {
    planPriceErrorMsg: {
      required: 'Plan Price is required',
      range: 'Plan Price should be greater than 0',
    },
    planPriceDescErrorMsg: {
      required: 'Plan Price Description is required',
    },
    volumeErrorMsg: {
      required: 'Volume Price is required',
      range: 'Volume Price should be greater than 0',
    },
    volumeDescErrorMsg: {
      required: 'Volume Description is required',
    },
    currencyCodeErrorMsg: {
      required: 'Currency Code is required',
    },
  };

  static editState = {
    planPriceState: 'success',
    planPriceDescState: 'success',
    volumeState: 'success',
    volumeDescState: 'success',
    currencyCodeState: 'success',
  };

  initialState = {
    cardAnimaton: 'cardHidden',
    showModal: true,
    id: -1,
    planPrice: '',
    planPriceState: '',
    planPricePristine: true,
    planPriceErrorMsg: [],
    planPriceDesc: '',
    planPriceDescState: '',
    planPriceDescPristine: true,
    planPriceDescErrorMsg: [],
    volume: '',
    volumeState: '',
    volumePristine: true,
    volumeErrorMsg: [],
    bankCurrency: '',
    volumeDesc: '',
    volumeDescState: '',
    volumeDescPristine: true,
    volumeDescErrorMsg: [],
    currencyCode: '',
    currencyCodeState: '',
    currencyCodePristine: true,
    currencyCodeErrorMsg: [],
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  change = (event, stateName, rules) => {
    this.setState(validate(event.target.value, stateName, this.state, rules, this.error));
  };

  isValidated = () => {
    if (
      this.state.planPriceState === 'success' &&
      this.state.planPriceDescState === 'success' &&
      this.state.volumeState === 'success' &&
      this.state.volumeDescState === 'success'
    ) {
      return true;
    } else {
      if (this.state.planPriceState !== 'success') {
        this.setState({ planPriceState: 'error' });
      }
      if (this.state.planPriceDescState !== 'success') {
        this.setState({ planPriceDescState: 'error' });
      }
      if (this.state.volumeState !== 'success') {
        this.setState({ volumeState: 'error' });
      }
      if (this.state.volumeDescState !== 'success') {
        this.setState({ volumeDescState: 'error' });
      }
    }
    return false;
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose() {
    this.initalizeState();
    this.props.handleClose();
  }

  addPlanVolume = () => {
    if (this.isValidated()) {
      this.props.addPlanVolume({
        planPrice: parseCurrency(this.state.planPrice),
        planPriceDesc: this.state.planPriceDesc,
        volume: parseCurrency(this.state.volume),
        volumeDesc: this.state.volumeDesc,
        currencyCode: this.state.currencyCode,
      });
      this.initalizeState();
      this.props.handleClose();
    }
  };
  updatePlanVolume = () => {
    if (this.isValidated()) {
      this.props.updatePlanVolume({
        id: this.state.id,
        planPrice: parseCurrency(this.state.planPrice),
        planPriceDesc: this.state.planPriceDesc,
        volume: parseCurrency(this.state.volume),
        volumeDesc: this.state.volumeDesc,
        currencyCode: this.state.currencyCode,
      });
      this.initalizeState();
      this.props.handleClose();
    }
  };
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: '' });
      }.bind(this),
      700
    );
    this.initalizeState();
  }
  initalizeState = () => {
    this.setState(this.initialState);
  };

  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let planVolume = {};
      if (props.showModal) {
        planVolume = PlanVolume.initialState;
        if (props.showEditPlanVolume) {
          planVolume = {
            ...planVolume,
            ...PlanVolume.editState,
            ...props.planVolume,
          };
        }
      }

      return {
        showModal: props.showModal,
        ...planVolume,
      };
    }
    return null;
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
    this.initalizeState();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={cx(classes.container)}>
        <Dialog
          classes={{
            root: classes.center + ' ' + classes.modalRoot,
          }}
          maxWidth='md'
          open={this.state.showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby='classic-modal-slide-title'
          aria-describedby='classic-modal-slide-description'
        >
          <DialogTitle id='classic-modal-slide-title' disableTypography className={cx(classes.modalHeader)} style={{ textAlign: 'left' }}>
            <IconButton aria-label='close' className={classes.closeButton} onClick={() => this.handleClose()}>
              <CloseIcon />
            </IconButton>
            <h3 style={{ textAlign: 'left', fontSize: 20, display: 'inline' }}>Plan Volume Information</h3>
          </DialogTitle>
          <DialogContent id='classic-modal-slide-description' className={cx(classes.addDirectorsMaxWidth)}>
            <form className={classes.form}>
              <GridContainer justify='center'>
                <GridItem xs={4} sm={4} md={3} lg={3}>
                  <FormControl fullWidth className={classes.filledSelect}>
                    <FormHelperText
                      style={{
                        backgroundColor: 'white',
                        paddingTop: 5,
                        marginTop: 0,
                        textAlign: 'left',
                      }}
                      success={this.state.currencyCodeState === 'success'}
                      error={this.state.currencyCodeState === 'error'}
                    >
                      Currency Code*
                    </FormHelperText>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      value={this.state.currencyCode}
                      onChange={(event) => this.handleChange('currencyCode', event)}
                      inputProps={{
                        name: 'currencyCode',
                        id: 'currencyCode',
                        classes: {
                          icon: classes.white,
                          root: classes.selectDropDown,
                        },
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Choose Currency
                      </MenuItem>
                      {this.props.currencies &&
                        this.props.currencies.map((item) => (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
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
                <GridItem xs={12} sm={12} md={3} lg={3}>
                  <CustomNumberFormat
                    success={this.state.planPriceState === 'success'}
                    error={this.state.planPriceState === 'error'}
                    helpText={this.state.planPriceState === 'error' && this.state.planPriceErrorMsg[0]}
                    labelText='Plan Price*'
                    value={this.state.planPrice}
                    onChange={(event) => this.handleChange('planPrice', event)}
                    id='pv_planPrice'
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: (event) => {
                        this.setState({
                          planPricePristine: false,
                        });
                        this.change(event, 'planPrice', [
                          { type: 'required' },
                          {
                            type: 'length',
                            params: {
                              min: 1,
                              max: 100,
                            },
                          },
                        ]);
                      },
                      onChange: (event) => {
                        if (!this.state.planPricePristine) {
                          this.setState({
                            planPricePristine: false,
                          });
                          this.change(event, 'planPrice', [
                            { type: 'required' },
                            {
                              type: 'length',
                              params: {
                                min: 1,
                                max: 100,
                              },
                            },
                          ]);
                          // this.handleplanPriceCurrency(event);
                        }
                      },
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <CustomInput
                    success={this.state.planPriceDescState === 'success'}
                    error={this.state.planPriceDescState === 'error'}
                    helpText={this.state.planPriceDescState === 'error' && this.state.planPriceDescErrorMsg[0]}
                    labelText='Plan Price Description*'
                    id='pv_planPriceDesc'
                    inputProps={{
                      value: this.state.planPriceDesc,
                      disabled: this.props.isDisabled ? this.props.isDisabled : false,
                      onChange: (event) => this.handleChange('planPriceDesc', event),
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: (event) => {
                        this.setState({ planPriceDescPristine: false });
                        this.change(event, 'planPriceDesc', [{ type: 'required' }]);
                      },
                      onChange: (event) => {
                        if (!this.state.planPriceDescPristine) {
                          this.setState({ planPriceDescPristine: false });
                          this.change(event, 'planPriceDesc', [{ type: 'required' }]);
                        }
                      },
                    }}
                  />
                </GridItem>
                <GridItem xs={4} sm={4} md={3} lg={3}>
                  <FormControl fullWidth className={classes.filledSelect}>
                    <FormHelperText
                      style={{
                        backgroundColor: 'white',
                        paddingTop: 5,
                        marginTop: 0,
                        textAlign: 'left',
                      }}
                      success={this.state.currencyCodeState === 'success'}
                      error={this.state.currencyCodeState === 'error'}
                    >
                      Currency Code*
                    </FormHelperText>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      value={this.state.currencyCode}
                      onChange={(event) => this.handleChange('currencyCode', event)}
                      inputProps={{
                        name: 'currencyCode',
                        id: 'currencyCode',
                        classes: {
                          icon: classes.white,
                          root: classes.selectDropDown,
                        },
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Choose Currency
                      </MenuItem>
                      {this.props.currencies &&
                        this.props.currencies.map((item) => (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
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
                <GridItem xs={12} sm={12} md={3} lg={3}>
                  <CustomNumberFormat
                    success={this.state.volumeState === 'success'}
                    error={this.state.volumeState === 'error'}
                    helpText={this.state.volumeState === 'error' && this.state.volumeErrorMsg[0]}
                    labelText='Plan Price'
                    value={this.state.volume}
                    onChange={(event) => this.handleChange('volume', event)}
                    id='pv_volume'
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: (event) => {
                        this.setState({
                          volumePristine: false,
                        });
                        this.change(event, 'volume', [
                          { type: 'required' },
                          {
                            type: 'length',
                            params: {
                              min: 1,
                              max: 100,
                            },
                          },
                        ]);
                      },
                      onChange: (event) => {
                        if (!this.state.volumePristine) {
                          this.setState({
                            volumePristine: false,
                          });
                          this.change(event, 'volume', [
                            { type: 'required' },
                            {
                              type: 'length',
                              params: {
                                min: 1,
                                max: 100,
                              },
                            },
                          ]);
                          // this.handlevolumeCurrency(event);
                        }
                      },
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <CustomInput
                    success={this.state.volumeDescState === 'success'}
                    error={this.state.volumeDescState === 'error'}
                    helpText={this.state.volumeDescState === 'error' && this.state.volumeDescErrorMsg[0]}
                    labelText='Volume Description*'
                    id='pv_volumeDesc'
                    inputProps={{
                      value: this.state.volumeDesc,
                      disabled: this.props.isDisabled ? this.props.isDisabled : false,
                      onChange: (event) => this.handleChange('volumeDesc', event),
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: (event) => {
                        this.setState({ volumeDescPristine: false });
                        this.change(event, 'volumeDesc', [{ type: 'required' }]);
                      },
                      onChange: (event) => {
                        if (!this.state.volumeDescPristine) {
                          this.setState({ volumeDescPristine: false });
                          this.change(event, 'volumeDesc', [{ type: 'required' }]);
                        }
                      },
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div className={classes.center} style={{ textAlign: 'right' }}>
                    {this.props.showEditPlanVolume ? (
                      this.props.isDisabled ? (
                        <Button round={false} color='info' size='lg' onClick={this.handleClose}>
                          CLOSE
                        </Button>
                      ) : (
                        <Button round={false} color='info' size='lg' onClick={this.updatePlanVolume}>
                          EDIT
                        </Button>
                      )
                    ) : (
                      <Button round={false} color='info' size='lg' onClick={this.addPlanVolume}>
                        ADD
                      </Button>
                    )}
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

PlanVolume.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  showEditPlanVolume: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  addPlanVolume: PropTypes.func.isRequired,
  updatePlanVolume: PropTypes.func.isRequired,
  currencies: PropTypes.array.isRequired,
  planVolume: PropTypes.object.isRequired,
};

export default withRouter(withStyles(addBeneficiaryStyle)(PlanVolume));
