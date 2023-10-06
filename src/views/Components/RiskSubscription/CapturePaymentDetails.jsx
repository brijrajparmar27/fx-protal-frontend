import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CustomNumberFormat from 'components/CustomNumberFormat/CustomNumberFormat.jsx';
import NumberFormat from 'react-number-format';

import cx from 'classnames';

// @material-ui/icons
import DescriptionIcon from '@material-ui/icons/Description';
// import LockOutline from "@material-ui/icons/LockOutline";

import { validate } from 'utils/Validator';
// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import signupPageStyle from 'assets/jss/material-dashboard-pro-react/views/signupPageStyle';
import customInputStyle from 'assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx';

const style = (theme) => ({
  ...signupPageStyle,
  ...customSelectStyle,
  ...customInputStyle,
  subTitle: {
    float: 'left',
    paddingTop: 30,
  },
  select: {
    paddingBottom: 10,
    fontSize: 14,
  },
  filledSelect: {
    textAlign: 'left',
    margin: '0 12px',
  },
  termsText: {
    fontSize: 12,
    color: 'darkslategrey',
  },
  mt10neg: {
    marginTop: -10,
  },
  mt35neg: {
    marginTop: -35,
  },
  selectFormControl: {
    [theme.breakpoints.up('lg')]: {
      marginTop: -15,
    },
  },
  countryFormControl: {
    marginTop: 5,
  },
  expiryField: {
    paddingTop: 0,
    width: '30%',
    margin: '0 5px',
  },
  selectLabel: {
    marginTop: 8,
    marginLeft: 9,
    color: '#AAAAAA !important',
    fontSize: 14,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: 400,
    lineHeight: 1.42857,
    transform: 'translate(0, 1.5px) scale(0.75)',
    transformOrigin: 'top left',
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
});

class CapturePaymentDetails extends React.Component {
  error = {
    cardNumberErrorMsg: {
      required: 'Card Number is required',
    },
    cardNameErrorMsg: {
      required: 'Card Name is required',
    },
    cardValidUptoMMErrorMsg: {
      required: 'Invalid',
      range: 'Invalid',
    },
    cardValidUptoYYErrorMsg: {
      required: 'Invalid',
      range: 'Invalid',
    },
    cvvErrorMsg: {
      required: 'CVV Missing',
      range: 'Invalid',
    },
  };

  initialState = {
    noticeModal: false,
    noticeModalErrMsg: '',
    cardNumber: '',
    cardNumberState: '',
    cardNumberPristine: true,
    cardNumberErrorMsg: [],
    cardName: '',
    cardNameState: '',
    cardNamePristine: true,
    cardNameErrorMsg: [],
    cvv: '',
    cvvState: '',
    cvvPristine: true,
    cvvErrorMsg: [],
    cardValidUptoMM: '',
    cardValidUptoMMState: '',
    cardValidUptoMMPristine: true,
    cardValidUptoMMErrorMsg: [],
    cardValidUptoYY: '',
    cardValidUptoYYState: '',
    cardValidUptoYYPristine: true,
    cardValidUptoYYErrorMsg: [],
    callInProgress: false,
  };
  constructor(props) {
    super(props);
    this.fileUploadComponent = React.createRef();
    this.yyInputRef = React.createRef();
    this.cvvInputRef = React.createRef();

    this.state = this.initialState;
  }
  change = (event, stateName, rules) => {
    // if (stateName === "cvv" && this.state.cardType === "Amex") {
    //   rules.push({ type: "validAmex" });
    // }
    let value = event.target.value;
    if (stateName === 'cardNumber') {
      value = value.replace(/-/g, '').trim();
    }
    this.setState(validate(value, stateName, this.state, rules, this.error));
    this.props.change(event, stateName, rules);
  };
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
    this.props.handleChange(name, event);
    if (name === 'cardValidUptoMM' && event.target.value.length > 1) {
      if (this.yyInputRef && this.yyInputRef.current) this.yyInputRef.focus();
    }
  };
  componentDidMount = () => {
    this.initalizeState();
  };
  initalizeState = () => {
    this.setState(this.initialState);
    if (this.fileUploadComponent && this.fileUploadComponent.current) this.fileUploadComponent.current.handleRemove();
  };
  componentWillUnmount() {
    this.initalizeState();
  }
  handleNextInput = (e, name, id) => {
    console.log(this.state.cardNumber, this.state.cardNumber.length);
    switch (name) {
      case "cardNumber":
        if (this.state.cardNumber.length > 15) {
          document.getElementById("uusp_cvv").focus();
        }
        break;
      case "cvv":
        if (this.state.cvv.length > 3) {
          document.getElementById("uusp_cardValidUptoMM").focus();
        }
        break;
      case "cardValidUptoMM":
        if (this.state.cardValidUptoMM.length > 1) {
          document.getElementById("uusp_cardValidUptoYY").focus();
        }
        break;
    }
  };

  render() {
    const { classes, cardChecked } = this.props;
    return (
      <div className={cx(classes.container)}>
        <form className={classes.form}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <GridContainer spacing={1} alignItems="center">
                <GridItem className={classes.customText} xs={11} sm={11} md={11} lg={11}>
                  <CustomInput
                    success={this.state.cardNameState === 'success'}
                    error={this.state.cardNameState === 'error'}
                    helpText={this.state.cardNameState === 'error' && this.state.cardNameErrorMsg[0]}
                    labelText="Name on Card*"
                    id="uusp_cardName"
                    inputProps={{
                      value: this.state.cardName,
                      disabled: cardChecked,
                      onChange: (event) => this.handleChange('cardName', event),
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: (event) => {
                        this.setState({ cardNamePristine: false });
                        this.change(event, 'cardName', [{ type: 'required' }]);
                      },
                      onChange: (event) => {
                        if (!this.state.cardNamePristine) {
                          this.setState({ cardNamePristine: false });
                          this.change(event, 'cardName', [{ type: 'required' }]);
                        }
                      },
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <GridContainer spacing={1} alignItems="center">
                <GridItem className={classes.customText} xs={11} sm={11} md={11} lg={11} style={{ marginLeft: 10 }}>
                  <GridContainer alignItems="center">
                    <GridItem className={classes.customText} xs={8} sm={8} md={5} lg={5}>
                      {/* <CustomInput
                    success={this.state.cardNumberState === 'success'}
                    error={this.state.cardNumberState === 'error'}
                    helpText={this.state.cardNumberState === 'error' && this.state.cardNumberErrorMsg[0]}
                    labelText="Card Number*"
                    id="uusp_cardNumber"
                    inputProps={{
                      value: this.state.cardNumber,
                      onChange: (event) => this.handleChange('cardNumber', event),
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: (event) => {
                        this.setState({ cardNumberPristine: false });
                        this.change(event, 'cardNumber', [{ type: 'required' }]);
                      },
                      onChange: (event) => {
                        if (!this.state.cardNumberPristine) {
                          this.setState({ cardNumberPristine: false });
                          this.change(event, 'cardNumber', [{ type: 'required' }]);
                        }
                      },
                    }}
                  /> */}
                      {/* <FormControl fullWidth className={classes.selectFormControl}> */}
                      <FormHelperText
                        className={classes.selectLabel}
                        success={this.state.cardNumberState === 'success'}
                        error={this.state.cardNumberState === 'error'}
                        helptext={this.state.cardNumberState === 'error' && this.state.cardNumberErrorMsg[0]}
                      >
                        Card Number*
                      </FormHelperText>
                      <CustomNumberFormat
                        helpText={this.state.cardNumberErrorMsg}
                        id="uusp_cardNumber"
                        value={this.state.cardNumber}
                        format="#### #### #### ####"
                        cardFormat="card"
                        className={classes.input}
                        disabled={cardChecked}
                        formControlProps={{
                          fullWidth: true,
                          className: cx(classes.customFormControlClasses, classes.mt10neg),
                          onBlur: (event) => {
                            this.setState({ cardNumberPristine: false });
                            this.change(event, 'cardNumber', [{ type: 'required' }]);
                          },
                          onChange: (event) => {
                            if (!this.state.cardNumberPristine) {
                              this.setState({ cardNumberPristine: false });
                              this.change(event, 'cardNumber', [{ type: 'required' }]);
                            }
                          },
                          onKeyUp: (e) => this.handleNextInput(e, "cardNumber", "uusp_cvv"),
                        }}
                      />
                    </GridItem>
                    <GridItem className={classes.customText} xs={4} sm={4} md={3} lg={3}>
                      <CustomInput
                        success={this.state.cvvState === 'success'}
                        error={this.state.cvvState === 'error'}
                        helpText={this.state.cvvState === 'error' && this.state.cvvErrorMsg[0]}
                        labelText="CVV Number*"
                        id="uusp_cvv"
                        inputProps={{
                          value: this.state.cvv,
                          disabled: cardChecked,
                          onChange: (event) => this.handleChange('cvv', event),
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: (event) => {
                            this.setState({ cvvPristine: false });
                            this.change(event, 'cvv', [
                              { type: 'required' },
                              {
                                type: 'length',
                                params: {
                                  min: 3,
                                  max: 4,
                                },
                              },
                            ]);
                          },
                          onChange: (event) => {
                            if (!this.state.cvvPristine) {
                              this.setState({ cvvPristine: false });
                              this.change(event, 'cvv', [
                                { type: 'required' },
                                {
                                  type: 'length',
                                  params: {
                                    min: 3,
                                    max: 4,
                                  },
                                },
                              ]);
                            }
                          },
                          onKeyUp: (e) => this.handleNextInput(e, "cvv", "uusp_cardValidUptoMM"),
                        }}
                      />
                    </GridItem>
                    <GridItem className={classes.customText} xs={3} sm={3} md={3} lg={3} style={{ margin: '4px 0px 0px 10px' }}>
                      <FormHelperText
                        style={{
                          top: 10,
                          color: '#AAAAAA !important',
                          fontSize: 14,
                          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                          fontWeight: 400,
                          lineHeight: 1.42857,
                          transform: 'translate(0, 1.5px) scale(0.75)',
                          transformOrigin: 'top left',
                          paddingLeft: 25,
                        }}
                        success={this.state.cardValidUptoMMState === 'success'}
                        error={this.state.cardValidUptoMMState === 'error'}
                        helpText={this.state.cardValidUptoMMState === 'error' && this.state.cardValidUptoMMErrorMsg[0]}
                      >
                        Expiry Date*
                      </FormHelperText>
                      <div style={{ display: 'inline-block' }}>
                        <CustomInput
                          success={this.state.cardValidUptoMMState === 'success'}
                          error={this.state.cardValidUptoMMState === 'error'}
                          helpText={this.state.cardValidUptoMMState === 'error' && this.state.cardValidUptoMMErrorMsg[0]}
                          // labelText='Card Number*'
                          id="uusp_cardValidUptoMM"
                          inputProps={{
                            value: this.state.cardValidUptoMM,
                            disabled: cardChecked,
                            style: { paddingLeft: 0 },
                            placeholder: 'MM',
                            onChange: (event) => this.handleChange('cardValidUptoMM', event),
                          }}
                          formControlProps={{
                            // fullWidth: true,
                            className: cx(classes.customFormControlClasses, classes.expiryField),
                            onBlur: (event) => {
                              this.setState({
                                cardValidUptoMMPristine: false,
                              });
                              this.change(event, 'cardValidUptoMM', [
                                { type: 'required' },
                                {
                                  type: 'range',
                                  params: {
                                    min: 1,
                                    max: 12,
                                  },
                                },
                              ]);
                            },
                            onChange: (event) => {
                              if (!this.state.cardValidUptoMMPristine) {
                                this.setState({
                                  cardValidUptoMMPristine: false,
                                });
                                this.change(event, 'cardValidUptoMM', [
                                  { type: 'required' },
                                  {
                                    type: 'range',
                                    params: {
                                      min: 1,
                                      max: 12,
                                    },
                                  },
                                ]);
                              }
                            },
                            onKeyUp: (e) => this.handleNextInput(e, "cardValidUptoMM", "uusp_cardValidUptoYY"),
                          }}
                        />
                        {/* </GridItem> */}
                        <span style={{ marginTop: 30 }}>/</span>
                        {/* <GridItem
                          className={classes.customText}
                          xs={5}
                          sm={5}
                          md={1}
                          lg={1}
                        > */}
                        <CustomInput
                          success={this.state.cardValidUptoYYState === 'success'}
                          error={this.state.cardValidUptoYYState === 'error'}
                          helpText={this.state.cardValidUptoYYState === 'error' && this.state.cardValidUptoYYErrorMsg[0]}
                          // labelText='Card Number*'
                          id="uusp_cardValidUptoYY"
                          inputRef={(ref) => (this.yyInputRef = ref)}
                          inputProps={{
                            value: this.state.cardValidUptoYY,
                            disabled: cardChecked,
                            placeholder: 'YY',
                            onChange: (event) => this.handleChange('cardValidUptoYY', event),
                          }}
                          formControlProps={{
                            // fullWidth: true,
                            className: cx(classes.customFormControlClasses, classes.expiryField),
                            onBlur: (event) => {
                              this.setState({
                                cardValidUptoYYPristine: false,
                              });
                              this.change(event, 'cardValidUptoYY', [
                                {
                                  type: 'length',
                                  params: {
                                    min: 2,
                                    max: 2,
                                  },
                                },
                              ]);
                            },
                            onChange: (event) => {
                              if (!this.state.cardValidUptoYYPristine) {
                                this.setState({
                                  cardValidUptoYYPristine: false,
                                });
                                this.change(event, 'cardValidUptoYY', [
                                  {
                                    type: 'length',
                                    params: {
                                      min: 2,
                                      max: 2,
                                    },
                                  },
                                ]);
                              }
                            },
                          }}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </form>
      </div>
    );
  }
}

CapturePaymentDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  upgradePlan: PropTypes.func.isRequired,
  planOptions: PropTypes.object.isRequired,
  volumeOptions: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
};

export default withRouter(withStyles(style)(CapturePaymentDetails));
