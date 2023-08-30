import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardText from 'components/Card/CardText.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import CircularProgresss from 'components/CircularProgress/CircularProgresss.jsx';
import cx from 'classnames';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import { Button } from '@material-ui/core';
import { validate } from 'utils/Validator';
import { formatMoney, formatDate } from 'utils/Utils';
import CapturePaymentDetails from 'views/Components/RiskSubscription/CapturePaymentDetails.jsx';
import dialogStyles from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import cardImages from 'assets/img/powered-by-stripe.png';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
// import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
// import customInputStyle from 'assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import { blackColor, hexToRgb } from 'assets/jss/material-dashboard-pro-react.jsx';

import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';
const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const RiskManualPayment = ({ showModal, closeModal }) => {
  const history = useHistory();
  const classes = useStyles();

  const [riskDetails, setRiskDetails] = useState({});
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
  const [nextPlanDate, setnextPlanDate] = useState('');
  const [role, setRole] = useState('');

  const [callInProgress, setCallInProgress] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('Error');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [needToClose, setNeedToClose] = useState(false);
  const [isCardUpdated, setIsCardUpdated] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  // const [timeOutId, setTimeOutId] = useState(null);
  // const [retry, setRetry] = useState(0);

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

  useEffect(() => {
    getRiskSubscriptionDetails();
    setnextPlanDate(getNextMonthDate());
    setRole(sessionStorage.getItem('role'));
  }, []);
  useEffect(() => {
    if (isCardUpdated) {
      doManualPayment();
    }
  }, [isCardUpdated]);
  useEffect(() => {
    if (isPaymentDone) {

    }
  }, [isPaymentDone]);
  const getNextMonthDate = () => {
    let date = new Date();
    return new Date(date.setMonth(date.getMonth() + 1));
  };
  const handleClose = (e) => {
    closeModal();
  };
  const getRiskSubscriptionDetails = async () => {
    setCallInProgress(true);
    // RISK SUBSCRIPTION PLANS
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: sessionStorage.getItem('token'),
    });
    setCallInProgress(false);
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else if (res.data.errorCode === 404) {
        return;
      } else {
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
        setRouteTo('/auth/risk-subscription');
      }
    } else {
      console.log(res.data);
      setRiskDetails(res.data);
    }
  };
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader('');
    setNoticeModalErrMsg('');
    if (routeTo !== '') {
      history.push(routeTo);
    }
    if (needToClose) {
      setNeedToClose(false);
      closeModal();
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
  const isValidated = () => {
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
  };
  let timeOutIdPayment = null, timeOutIdCollect = null;
  let retryPayment = 0, retryCollect = 0;
  const doManualPayment = async () => {
    setCallInProgress(true);
    // RISK SUBSCRIPTION PAYMENT SETUP
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_SUBSCRIPTION_MANUAL_PAY + riskDetails.userEmail,
      authToken: sessionStorage.getItem('token'),
      data: null,
    });
    setIsCardUpdated(false);
    setCallInProgress(false);
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 402) {
        const err = JSON.parse(res.data.userDesc);
        const desc = err.userDesc.split(';')[0];
        setNeedToClose(false);
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(desc);
        setNoticeModal(true);
        return;
      } else {
        setNeedToClose(false);
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data);
      if (res.data.status === 'succeeded') {
        console.log(res.data);
        setNeedToClose(true);
        setNoticeModalHeader('Information');
        setNoticeModalErrMsg('Your Payment has been successful and you can continue to use your subscription.');
        setNoticeModal(true);
        retryCollect = 0;
        timeOutIdCollect = setInterval(getPaymentCollectStatus, 5000, res.data);
      } else if (res.data.status === 'requires_action') {
        console.log(res.data.status);
        window.open(res.data.url, '_self');
      }
    }
  };
  const updateCardDetails = async () => {
    setCallInProgress(true);
    console.log(cardInfo);
    const origin = window.location.origin;
    const cardData = {
      nameOnCard: cardInfo.cardName,
      cardNumber: cardInfo.cardNumber,
      cvc: cardInfo.cvv,
      expMonth: cardInfo.cardValidUptoMM,
      expYear: '20' + cardInfo.cardValidUptoYY,
      returnUrl: origin,
    };
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_SUBSCRIPTION_CARD_UPDATE,
      authToken: sessionStorage.getItem('token'),
      data: cardData,
    });
    setCallInProgress(false);
    if (res.data.errorCode) {
      setCallInProgress(false);
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      console.log(res.data);
      // doManualPayment();
      // setCallInProgress(false);
      retryPayment = 0;
      timeOutIdPayment = setInterval(getPaymentStatus, 5000, res.data);
    }
  };
  const OnSubmitOrder = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isValidated()) {
      setCallInProgress(true);
      updateCardDetails();
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
      setCallInProgress(false);
      if (res.data.status === 'succeeded' || retryPayment === 4) {
        console.log('CARD UPDATE EXPIRE')
        clearInterval(timeOutIdPayment);
        timeOutIdPayment = null;
        retryPayment = 4;
      }
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 402) {
        const err = JSON.parse(res.data.userDesc);
        const desc = err.userDesc.split(';')[0];
        setNeedToClose(false);
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(desc);
        setNoticeModal(true);
        return;
      } else {
        setNeedToClose(false);
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data, retryPayment);
      if (res.data.status === 'succeeded' || retryPayment === 4) {
        setCallInProgress(false);
        console.log('CARD UPDATED')
        clearInterval(timeOutIdPayment);
        timeOutIdPayment = null;
        retryPayment = 4;
        setIsCardUpdated(true);
        // setRouteTo('/auth/risk-portal');
        sessionStorage.setItem('riskStatus', 'ACTIVE');  
      }
      //   }
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
        setNeedToClose(false);
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(desc);
        setNoticeModal(true);
        return;
      } else if (res.data.errorCode === 404) {
        console.log(res.data && res.data.userDesc);
        return;
      } else {
        setNeedToClose(false);
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data, retryCollect);
      // if (riskDetails.freePlanUsed) {
      //   setTimeout(getPaymentCollectStatus, 5000, res.data);
      // } else {
        if (res.data.status === 'succeeded' || retryCollect === 4) {
          clearInterval(timeOutIdCollect);
          timeOutIdCollect = null;
          retryCollect = 4;
          setNeedToClose(true);
          setNoticeModalHeader('Information');
          setNoticeModalErrMsg('Your Payment has been successful and you can continue to use your subscription.');
          setNoticeModal(true);
          sessionStorage.setItem('riskStatus', 'ACTIVE');
        }
      }
    // }
  };
  return (
    <>
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
            <GridContainer justify="center" style={{ textAlign: 'center' }}>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <div>
                  <span
                    style={{
                      fontSize: 20,
                      lineHeight: '25px',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    FX Risk Subscription Payment
                  </span>
                  {role === 'role-prospect-user' && <p>Please make the payment to continue with your subscription</p>}
                </div>
              </GridItem>
            </GridContainer>
          </DialogTitle>
          <DialogContent id="classic-modal-slide-description" className={cx(classes.modalBody, classes.loginMaxWidth)} justify="center">
            <GridContainer justify="center" style={{ textAlign: 'center' }}>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                {role === 'role-prospect-user' ? (
                  <Card style={{ marginTop: 0 }}>
                    <CardBody>
                      <GridContainer justify="center">
                        <GridItem xs={3} sm={3} md={3} lg={3}>
                          <>
                            <GridContainer>
                              <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
                                <div className={classes.heading}>
                                  <strong>Payment Details</strong>
                                </div>
                              </GridItem>
                              <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                                <div>Monthly:</div>
                              </GridItem>
                              <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                                <div>{'£' + formatMoney(riskDetails.amount)}</div>
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                                <div>VAT @20% </div>
                              </GridItem>
                              <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                                <div>{'£' + formatMoney(riskDetails.amount * 0.2)}</div>
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
                                <div>{'£' + formatMoney(riskDetails.amount * 1.2)}</div>
                              </GridItem>
                            </GridContainer>
                          </>
                        </GridItem>
                        <GridItem xs={8} sm={8} md={8} lg={8}>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12} lg={12} style={{ marginLeft: 28, textAlign: 'start' }}>
                              <div className={classes.heading}>
                                <strong>Payment Method</strong>
                              </div>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
                              <GridContainer>
                              <GridItem xs={6} sm={6} md={6} lg={6} style={{ marginLeft: 28, textAlign: 'start' }}>
                              <div>
                                {' '}
                                {'Please share your Credit Card information which can be used to deduct subscription money'} {!riskDetails.freePlanUsed && ' from next month.'}{' '}
                              </div>
                              </GridItem>
                              <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'start' }}>
                              <div style={{ marginLeft: 28 }}>
                                <img src={cardImages} alt="Stripe Cards" style={{width: '100%', marginTop: '-20px'}} />
                              </div>
                              </GridItem>
                              </GridContainer>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                              <CapturePaymentDetails handleChange={handleChange} change={change} />
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                      </GridContainer>

                      <GridContainer justify="center" style={{ marginTop: 10 }}>
                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start', marginLeft: 28 }}>
                          <div className={classes.heading}>
                            <strong>Review Details</strong>
                          </div>
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
                          <div style={{ marginTop: 5 }}>{'-Your plan begins today and renews automatically on ' + formatDate(nextPlanDate)}</div>
                          <div style={{ marginTop: 5 }}>
                            -The plan will automatically renew each month until cancelled, and you will be billed on that renewal date. To avoid charges for the next month, please
                            cancel before the renewal date.
                          </div>
                          <div style={{ marginTop: 5 }}> -You can cancel or upgrade your plan anytime by going to Manage Plan.</div>
                        </GridItem>
                      </GridContainer>
                      <GridContainer justify="center" style={{ marginTop: 5 }}>
                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'center' }}>
                          <Button
                            onClick={(e) => OnSubmitOrder(e)}
                            style={{
                              color: 'white',
                              backgroundColor: '#2391d2',
                            }}
                          >
                            Place Order
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                ) : (
                  <Card style={{ marginTop: 0 }}>
                    <CardBody>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
                          <div className={classes.heading}>
                            <strong>Please contact your Administrator to pay for Risk Subscription Plan</strong>
                          </div>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                )}
              </GridItem>
            </GridContainer>
            {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
            {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

RiskManualPayment.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default RiskManualPayment;
