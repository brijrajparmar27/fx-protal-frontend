import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
import styles from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const PlanSubscriptionModal = ({ showModal, closeModal,   details }) => {
    const classes = useStyles();
    const history = useHistory();
    const [nextPlanDate, setnextPlanDate] = useState('');
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

    useEffect(() => {
        setnextPlanDate(getNextMonthDate());
    }, []);
    const getNextMonthDate = () => {
        let date = new Date();
        return new Date(date.setMonth(date.getMonth() + 1));
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
                    cardNumberState: 'error',
                });
            }
            if (cardInfoState.cardNameState !== 'success') {
                setCardInfoState({
                    ...cardInfoState,
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
            return false;
        }
    };
    const OnSubmitOrder = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(cardInfo);
        if (true) {
            setCallInProgress(true);
            // RISK SUBSCRIPTION PAYMENT SETUP
            console.log(cardInfo);
            const res = await apiHandler({
                method: 'POST',
                url: endpoint.RISK_SUBSCRIPTION_PAYMENT_SETUP,
                authToken: sessionStorage.getItem('token'),
                data: {
                    nameOnCard: cardInfo.cardName,
                    cardNumber: cardInfo.cardNumber,
                    // cardNumber: "4242-4242-4242-4242",
                    cvc: cardInfo.cvv,
                    expMonth: cardInfo.cardValidUptoMM,
                    expYear: cardInfo.cardValidUptoYY,
                    returnUrl: 'https://devui.fxguard.co.uk/#/auth/risk-payment-status',
                    riskSubscriptionPlanId: details.id,
                },
            });
            setCallInProgress(false);
            if (res.data.errorCode) {
                if (res.data.errorCode === 401) {
                    console.log('Unauthorized Access');
                    history.push('/home/logout');
                    return;
                } else if (res.data.errorCode === 403) {
                    return;
                } else {
                    setNoticeModalHeader('Error');
                    setNoticeModalErrMsg(res.data.userDesc);
                    setNoticeModal(true);
                }
            } else {
                console.log(res.data);
                if (res.data.status === "succeeded") {
                    console.log(res.data.status);
                    setNoticeModalHeader('Information');
                    setNoticeModalErrMsg("Your selected Plan has been subscribed. You can start using FX Risk Management Portal.");
                    setNoticeModal(true);
                    setRouteTo('/auth/risk-portal');
                    history.push("/auth/risk-portal");
                    sessionStorage.setItem("riskStatus", "ACTIVE");
                    closeModal();
                } else if (res.data.status === "requires_action") {
                    console.log(res.data.status);
                    window.open(res.data.url, "_self");
                }
            }
        }
    };
    function calculateVAT(number) {
        return number * 0.2;
    }
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
                                    {/* <GridContainer>
                                        <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                                            <div>1st Month Free</div>
                                        </GridItem>
                                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                                            <div>{'- £' + formatMoney(details.amount)}</div>
                                        </GridItem>
                                    </GridContainer> */}
                                    <GridContainer>
                                        <GridItem xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'start' }}>
                                            <div>VAT @20% </div>
                                        </GridItem>
                                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'end' }}>
                                            <div>{`£${formatMoney(calculateVAT(details.amount))}`}</div>
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
                                            <div>{`£${formatMoney(calculateVAT(details.amount)+details.amount)}`}</div>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>
                                <GridItem xs={8} sm={8} md={8} lg={8}>
                                    <GridContainer style={{ marginTop: 20 }}>
                                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ marginLeft: 28, textAlign: 'start' }}>
                                            <div className={classes.heading}>Payment Method</div>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
                                            <div style={{ marginLeft: 28 }}> Please share your Credit Card information which can be used to deduct subscription money from next month. </div>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={12} lg={12}>
                                            <CapturePaymentDetails handleChange={handleChange} change={change} setCardInfo={setCardInfo}/>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>
                            </GridContainer>

                            <GridContainer style={{ marginTop: 28 }}>
                                <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
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
                                    <div style={{ marginTop: 10 }}>{'-Your plan begins today and renews automatically on ' + formatDate(nextPlanDate)}</div>
                                    <div style={{ marginTop: 10 }}>
                                        -The plan will automatically renew each month until cancelled, and you will be billed on that renewal date. To avoid charges for the next month, please cancel
                                        before the renewal date.
                                    </div>
                                    <div style={{ marginTop: 10 }}> -You can cancel,upgrade or downgrade your plan anytime by going to Manage Plan.</div>
                                </GridItem>
                            </GridContainer>
                            <GridContainer style={{ marginTop: 28 }}>
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
                        </GridItem>
                        {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
                        {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
                    </GridContainer>
                </DialogContent>
            </Dialog>
        </div>
    );
};

PlanSubscriptionModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    details: PropTypes.object.isRequired,
};

export default PlanSubscriptionModal;
