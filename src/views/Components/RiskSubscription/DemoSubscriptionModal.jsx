import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';
import Check from '@material-ui/icons/Check';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import cardImages from 'assets/img/powered-by-stripe.png';

import CircularProgresss from 'components/CircularProgress/CircularProgresss.jsx';
import cx from 'classnames';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import { Button } from '@material-ui/core';
import { validate } from 'utils/Validator';
import { formatMoney, formatDate } from 'utils/Utils';
// import CapturePaymentDetails from 'views/Components/RiskSubscription/CapturePaymentDetails.jsx';
import dialogStyles from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
// import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
// import customInputStyle from 'assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import { blackColor, hexToRgb } from 'assets/jss/material-dashboard-pro-react.jsx';

const styles = (theme) => ({
  ...dialogStyles,
  ...customCheckboxRadioSwitch,
  checkboxLabelControl: {
    margin: '0',
  },
  checkboxLabel: {
    marginLeft: '6px',
    color: 'rgba(' + hexToRgb(blackColor) + ', 0.26)',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    zIndex: 2,
    color: theme.palette.grey[500],
  },
  heading: {
    fontWeight: 'bold',
    fontSize: '1.05em',
    lineHeight: '1.5em',
  },
  center: {
    textAlign: 'center',
    margin: 20,
    marginTop: 40,
  },
});

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

let timeoutIdPayment = null, timeOutIdCollect = null; 
let retryPayment = 0, retryCollect = 0;

const DemoSubscriptionModal = ({ showModal, closeModal, details, riskStatus}) => {
  const classes = useStyles();
  const history = useHistory();
  const [nextPlanDate, setnextPlanDate] = useState('');
  const [nextPlanExpiryDate, setnextPlanExpiryDate] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [callInProgress, setCallInProgress] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('Error');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const error = {
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
      validAmex: 'Please enter 4 digit number on the front of the your card',
    },
  };

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    cvv: '',
    cardValidUptoMM: '',
    cardValidUptoYY: '',
  });

  const cardInfoIntialState = {
    cardNumberState: '',
    cardNumberPristine: true,
    cardNumberErrorMsg: [],
    cardNameState: '',
    cardNamePristine: true,
    cardNameErrorMsg: [],
    cvvState: '',
    cvvPristine: true,
    cvvErrorMsg: [],
    cardValidUptoMMState: '',
    cardValidUptoMMPristine: true,
    cardValidUptoMMErrorMsg: [],
    cardValidUptoYYState: '',
    cardValidUptoYYPristine: true,
    cardValidUptoYYErrorMsg: [],
  };

  const [cardInfoState, setCardInfoState] = useState(cardInfoIntialState);
  const [checked, setChecked] = useState(false);
  const [cardChecked, setCardChecked] = useState(true);
  const [disclaimer, setDisclaimer] = useState(true);

  useEffect(() => {
    setnextPlanDate(getNextMonthDate());
    setnextPlanExpiryDate(getnextPlanExpiryDate());
  }, []);
  const getNextMonthDate = () => {
    let date = new Date();
    return new Date(date.setMonth(date.getMonth() + 1));
  };
  const getnextPlanExpiryDate = () => {
    const nextMonth = getNextMonthDate();
    return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate() - 1);
  };
  const handleClose = (e) => {
    closeModal();
  };
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader('');
    setNoticeModalErrMsg('');
    if (routeTo !== '') {
      history.push(routeTo);
    }
  };
  const handleChange = (name, event) => {
    setCardInfo({ ...cardInfo, [name]: event.target.value });
  };
  const change = (event, stateName, rules) => {
    let value = event.target.value;
    if (stateName === 'cardNumber') {
      value = value.replace(/-/g, '').trim();
    }
    setCardInfo({ ...cardInfo, [stateName]: value });
    setCardInfoState({
      ...cardInfoState,
      ...validate(value, stateName, cardInfoState, rules, error),
    });
  };

  const handleCardCheck = (e) => {
    setCardChecked(!cardChecked);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setChecked(!checked);
  };
  const disclaimerClick = () => {
    setDisclaimer(true);
  };

  const isValidated = () => {
    if (!checked) {
      setNoticeModalHeader('Error');
      setNoticeModalErrMsg("Please click the 'terms and conditions' checkbox");
      setNoticeModal(true);
      return false;
    }
    if (cardChecked) {
      return true;
    } else {
      if (
        cardInfoState.cardNumberState === 'success' &&
        cardInfoState.cardNameState === 'success' &&
        cardInfoState.cvvState === 'success' &&
        cardInfoState.cardValidUptoMMState === 'success' &&
        cardInfoState.cardValidUptoYYState === 'success'
      ) {
        return true;
      } else {
        if (cardInfoState.cardNumberState !== 'success') {
          setCardInfoState({
            ...cardInfoState,
            cardNumberErrorMsg: ['Card Number is required'],
            cardNumberState: 'error',
          });
        }
        if (cardInfoState.cardNameState !== 'success') {
          setCardInfoState({
            ...cardInfoState,
            cardNameErrorMsg: ['Card Name is required'],
            cardNameState: 'error',
          });
        }
        if (cardInfoState.cvvState !== 'success') {
          setCardInfoState({
            ...cardInfoState,
            cvvState: 'error',
          });
        }
        if (cardInfoState.cardValidUptoMMState !== 'success') {
          setCardInfoState({
            ...cardInfoState,
            cardValidUptoMMState: 'error',
          });
        }
        if (cardInfoState.cardValidUptoYYState !== 'success') {
          setCardInfoState({
            ...cardInfoState,
            cardValidUptoYYState: 'error',
          });
        }
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg('Please provide all the required information.');
        setNoticeModal(true);
        return false;
      }
    }
  };
  const OnSubmitOrder = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isValidated()) {
      setCallInProgress(true);
      console.log('host1 - ', window.location.origin);
      const origin = window.location.origin;
      // RISK SUBSCRIPTION PAYMENT SETUP
      const res = await apiHandler({
        method: 'POST',
        url: endpoint.RISK_SUBSCRIPTION_PAYMENT_SETUP,
        authToken: sessionStorage.getItem('token'),
        data: {
          nameOnCard: cardInfo.cardName,
          cardNumber: cardInfo.cardNumber,
          cvc: cardInfo.cvv,
          expMonth: cardInfo.cardValidUptoMM,
          expYear: '20' + cardInfo.cardValidUptoYY,
          returnUrl: origin + '/#/auth/risk-payment-status',
          riskSubscriptionPlanId: details.id,
          skipPaymentMethod: cardChecked,
        },
      });
      setCallInProgress(false);
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log('Unauthorized Access');
          history.push('/home/logout');
          return;
        } else if (res.data.errorCode === 402) {
          const err = JSON.parse(res.data.userDesc);
          const desc = err.userDesc.split(';')[0];
          setNoticeModalHeader('Error');
          setNoticeModalErrMsg(desc);
          setNoticeModal(true);
          return;
        } else {
          setNoticeModalHeader('Error');
          setNoticeModalErrMsg(res.data.userDesc);
          setNoticeModal(true);
        }
      } else {
        console.log(res.data);
        if (res.data.status === 'succeeded') {
          if (cardChecked) {
            setNoticeModalHeader('Information');
            setNoticeModalErrMsg('Your selected trial Plan has been subscribed. You can start using FX Risk Management Portal.');
            setNoticeModal(true);
            setRouteTo('/auth/risk-portal');
            sessionStorage.setItem('riskStatus', 'ACTIVE');
          } else {
            console.log(res.data);
            retryPayment = 0;
            timeoutIdPayment = setInterval(getPaymentStatus, 2000, res.data);
          }
        } else if (res.data.status === 'requires_action') {
          console.log(res.data.status);
          window.open(res.data.url, '_self');
        }
      }
    }
  };
  const getPaymentStatus = async (payment) => {
    setCallInProgress(true);
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_PAYMENT_SETUP_STATUS + payment.id,
      authToken: sessionStorage.getItem('token'),
    });
    setCallInProgress(false);
    retryPayment = retryPayment + 1;
    if (res.data.errorCode) {
      if (res.data.status === 'succeeded' || retryPayment === 4) {
        console.log('CARD UPDATE EXPIRE')
        clearInterval(timeoutIdPayment);
        timeoutIdPayment = null;
        retryPayment = 4;
      }
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 402) {
        const err = JSON.parse(res.data.userDesc);
        const desc = err.userDesc.split(';')[0];
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(desc);
        setNoticeModal(true);
        return;
      } else {
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data);
      if (riskStatus.freePlanUsed) {
        if (res.data.status === 'succeeded' || retryPayment === 4) {
          console.log('CARD UPDATED')
          clearInterval(timeoutIdPayment);
          timeoutIdPayment = null;
          retryPayment = 4;  
          retryCollect = 0;
          timeOutIdCollect = setInterval(getPaymentCollectStatus, 5000, payment);
        }
      } else {
        setNoticeModalHeader('Information');
        setNoticeModalErrMsg('Your selected Plan has been subscribed. You can start using FX Risk Management Portal.');
        setNoticeModal(true);
        setRouteTo('/auth/risk-portal');
        sessionStorage.setItem('riskStatus', 'ACTIVE');
      }
    }
  };
  const getPaymentCollectStatus = async (payment) => {
    setCallInProgress(true);
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_PAYMENT_COLLECT_STATUS + payment.id,
      authToken: sessionStorage.getItem('token'),
    });
    setCallInProgress(false);
    retryCollect = retryCollect + 1;
    if (res.data.errorCode) {
      if (retryCollect === 4) {
        clearInterval(timeOutIdCollect);
        timeOutIdCollect = null;
        retryCollect = 4;
      }
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 402) {
        const err = JSON.parse(res.data.userDesc);
        const desc = err.userDesc.split(';')[0];
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(desc);
        setNoticeModal(true);
        return;
      } else {
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data);
      // if (riskStatus.freePlanUsed) {
        // timeOutIdCollect = setInterval(getPaymentCollectStatus, 5000, res.data);
        if (res.data.status === 'succeeded' || retryCollect === 4) {
          clearInterval(timeOutIdCollect);
          timeOutIdCollect = null;
          retryCollect = 4;
      // } else {
        setNoticeModalHeader('Information');
        setNoticeModalErrMsg('Your selected Plan has been subscribed. You can start using FX Risk Management Portal.');
        setNoticeModal(true);
        setRouteTo('/auth/risk-portal');
        sessionStorage.setItem('riskStatus', 'ACTIVE');
      }
      // }
    }
  };
  return (
    <div className={classes.container}>
      <Dialog
        classes={{
          root: classes.center,
        }}
        maxWidth="md"
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={(e) => handleClose(e)}>
            <CloseIcon />
          </IconButton>
          <div className={classes.modalTitle}>
            <span
              style={{
                fontSize: 20,
                lineHeight: '25px',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              FX Risk Management Subscription
            </span>
          </div>
        </DialogTitle>

        <DialogContent id="classic-modal-slide-description" className={cx(classes.modalBody, classes.loginMaxWidth)} justify="center">
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              {/* <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5em",
                      lineHeight: "2em"
                    }}
                  >
                    FX Risk Management Subscription
                  </div>
                </GridItem>
              </GridContainer> */}

              <GridContainer>
                <GridItem
                  xs={3}
                  sm={3}
                  md={3}
                  lg={3}
                  style={{
                    marginLeft: 28,
                    marginTop: 20,
                  }}
                >
                  {riskStatus.freePlanUsed ? (
                    <>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
                          <div className={classes.heading}>First Month Payment</div>
                        </GridItem>
                        <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                          <div>Monthly:</div>
                        </GridItem>
                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                          <div>{'£' + formatMoney(details.amount)}</div>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                          <div>VAT @20% </div>
                        </GridItem>
                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                          <div>{'£' + formatMoney(details.amount * 0.2)}</div>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem
                          xs={7}
                          sm={7}
                          md={7}
                          lg={7}
                          style={{
                            textAlign: 'start',
                            borderTop: '1px solid #6a6a6a',
                            borderBottom: '1px solid #6a6a6a',
                          }}
                        >
                          <div>Total</div>
                        </GridItem>
                        <GridItem
                          xs={5}
                          sm={5}
                          md={5}
                          lg={5}
                          style={{
                            textAlign: 'end',
                            borderTop: '1px solid #6a6a6a',
                            borderBottom: '1px solid #6a6a6a',
                          }}
                        >
                          <div>{'£' + formatMoney(details.amount * 1.2)}</div>
                        </GridItem>
                      </GridContainer>
                    </>
                  ) : (
                    <>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
                          <div className={classes.heading}>First Month Free Trial</div>
                        </GridItem>
                        <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                          <div>Monthly:</div>
                        </GridItem>
                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                          <div>{'£' + formatMoney(details.amount)}</div>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                          <div>1st Month Free</div>
                        </GridItem>
                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                          <div>{'- £' + formatMoney(details.amount)}</div>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                          <div>VAT @20% </div>
                        </GridItem>
                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                          <div>{'£0.00'}</div>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem
                          xs={7}
                          sm={7}
                          md={7}
                          lg={7}
                          style={{
                            textAlign: 'start',
                            borderTop: '1px solid #6a6a6a',
                            borderBottom: '1px solid #6a6a6a',
                          }}
                        >
                          <div>Total</div>
                        </GridItem>
                        <GridItem
                          xs={5}
                          sm={5}
                          md={5}
                          lg={5}
                          style={{
                            textAlign: 'end',
                            borderTop: '1px solid #6a6a6a',
                            borderBottom: '1px solid #6a6a6a',
                          }}
                        >
                          <div>{'£0.00'}</div>
                        </GridItem>
                      </GridContainer>
                    </>
                  )}
                </GridItem>
                <GridItem xs={8} sm={8} md={8} lg={8}>
                  <GridContainer style={{ marginTop: 20 }}>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer>
                      <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start', marginLeft: 28 }}>
                  <div className={classes.heading}>Review Your order</div>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{
                    textAlign: 'start',
                    marginLeft: 28,
                  }}
                >
                    <div style={{ marginTop: 10 }}>{'-Your plans begins today and will expire on ' + formatDate(nextPlanExpiryDate)}</div>
                    <div style={{ marginTop: 10 }}>
                      -During the trial, if you decide to continue the subscription after the free trial, you can simply provide (add) the payment information on Manage Account section of the web-portal.
                    </div>
                    <div style={{ marginTop: 10 }}> -After the expiry of the trial, if you wish to continue, you will have to resubscribe your chosen plan.</div>
                </GridItem>
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer spacing={1} style={{ textAlign: 'center', marginTop: 20 }}>
                    <GridItem className={classes.customText} xs={12} sm={12} md={12} lg={12}>
                      <FormControlLabel
                        className={classes.center}
                        style={{margin: 0}}
                        classes={{
                          root: classes.checkboxLabelControl,
                          label: classes.checkboxLabel,
                        }}
                        this
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={(e) => handleToggle(e)}
                            disabled={!disclaimer}
                            checked={checked}
                            checkedIcon={<Check className={classes.checkedIcon} />}
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot,
                            }}
                          />
                        }
                        label={
                          <div className={classes.termsText}>
                            Please make sure to review and accept our{' '}
                            <a onClick={disclaimerClick} href="/cms/public/pdfs/Terms_and_Conditions_FXGuard.pdf" target="_blank">
                              commercial terms & conditions*
                            </a>{' '}
                            first.
                          </div>
                        }
                      />
                      {/* <div style={{fontSize: "small"}}>* Please click to read before you can accept the Terms and conditions</div> */}
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
              <GridContainer style={{ marginTop: 28 }}>
                <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'center' }}>
                  <Button
                    onClick={(e) => OnSubmitOrder(e)}
                    disabled={!disclaimer}
                    style={{
                      color: 'white',
                      backgroundColor: '#2391d2',
                    }}
                  >
                    Place Order
                  </Button>
                </GridItem>
              </GridContainer>
            </GridItem>
            {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
            {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
          </GridContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

DemoSubscriptionModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
};

export default DemoSubscriptionModal;
