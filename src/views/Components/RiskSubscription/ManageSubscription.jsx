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
import styles from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';

import ConfirmationModal from 'views/Components/ConfirmationModal.jsx';
import ConfirmationCancelModal from 'views/Components/ConfirmationModal.jsx';
import { cardTitle, roseColor, primaryColor } from 'assets/jss/material-dashboard-pro-react.jsx';

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ManageSubscription = ({ showModal, closeModal, planDetails }) => {
  const classes = useStyles();
  const history = useHistory();
  const [callInProgress, setCallInProgress] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [needToCloseModal, setNeedToCloseModal] = useState(false);
  const [planChanging, setPlanChanging] = useState(false);
  const [planList, setPlanList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [selectedPlanAmount, setSelectedPlanAmount] = useState({});

  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('Error');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalHeader, setConfirmationModalHeader] = useState('');
  const [confirmationModalMsg, setConfirmationModalMsg] = useState('');
  const [confirmationCancelModal, setConfirmationCancelModal] = useState(false);
  const [confirmationCancelModalHeader, setConfirmationCancelModalHeader] = useState('');
  const [confirmationCancelModalMsg, setConfirmationCancelModalMsg] = useState('');

  const handleClose = (e) => {
    closeModal();
  };
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader('');
    setNoticeModalErrMsg('');
    if (needToCloseModal) closeModal();
  };
  const handleNegativeButton = () => {
    setConfirmationModal(false);
    setConfirmationModalHeader('');
    setConfirmationModalMsg('');
    setConfirmationCancelModal(false);
    setConfirmationCancelModalHeader('');
    setConfirmationCancelModalMsg('');
  };
  const handleSimple = async (event) => {
    setSelectedPlan(event.target.value);
    setCallInProgress(true);
    // RISK SUBSCRIPTION PLANS
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_SUBSCRIPTION_CALCULATE_NEW,
      authToken: sessionStorage.getItem('token'),
      data: {
        email: planDetails.email,
        riskSubscriptionPlanId: event.target.value.id,
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
      const totalAmount = res.data.calculatedAmount + res.data.calculatedVat;
      setSelectedPlanAmount({
        amount: res.data.calculatedAmount,
        vat: res.data.calculatedVat,
        total: totalAmount
      });
    }
  };
  const changeRiskPlanSubscription = async () => {
    setCallInProgress(true);
    // RISK SUBSCRIPTION PLANS
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_ACTIVE_PLANS,
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
      } else {
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data);
      const riskPlans = res.data.riskPlans.filter((p) => p.maxUserAllowed > planDetails.maxUserAllowed);
      setPlanList(riskPlans);
    }
    setPlanChanging(true);
  };
  const validateChangePlan = () => {
    if (!(selectedPlan && selectedPlan.id)) {
      setNoticeModalHeader('Error');
      setNoticeModalErrMsg('Please select New Risk Plan');
      setNoticeModal(true);
      return false;
    }
    return true;
  };
  const saveNewRiskPlanSubscription = async () => {
    if (validateChangePlan()) {
      setConfirmationModalHeader('Subscription');
      setConfirmationModalMsg(
        'If you confirm new Plan, £' +
          formatMoney(selectedPlanAmount.total) +
          ' will be deducted from your account. Are you sure you want to Upgrade to New Risk Subscription?'
      );
      setConfirmationModal(true);
    }
  };
  const upgradePlan = async () => {
    setCallInProgress(true);
    handleNegativeButton();

    // RISK SUBSCRIPTION PLANS
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_SUBSCRIPTION_UPGRADE,
      authToken: sessionStorage.getItem('token'),
      data: {
        email: planDetails.email, // user email
        riskSubscriptionPlanId: selectedPlan.id, // new plan id
        amount: selectedPlanAmount.amount, // calculated amount
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
      setNeedToCloseModal(true);
      setNoticeModalHeader('Information');
      setNoticeModalErrMsg('Your selected Plan has been subscribed. You can continue using FX Risk Management Portal.');
      setNoticeModal(true);
    }
  };
  const cancelRiskPlanSubscription = () => {
    console.log('cancelRiskPlanSubscription');
    setConfirmationCancelModalHeader('Subscription');
    setConfirmationCancelModalMsg(
      'If you cancel, Plan will expire on ' + formatDate(planDetails.planExpiryDate) + ' and it will not roll-over. Are you sure you want to Cancel the current Risk Subscription?'
    );
    setConfirmationCancelModal(true);
  };
  const cancelAndRouteToRiskPlanPage = async () => {
    console.log('cancelAndRouteToRiskPlanPage');
    handleNegativeButton();
    setCallInProgress(true);
    const res = await apiHandler({
      url: endpoint.RISK_SUBSCRIPTION_CANCEL,
      method: 'PUT',
      authToken: sessionStorage.getItem('token'),
    });
    setCallInProgress(false);
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else {
        setNeedToCloseModal(false);
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data);
      setNeedToCloseModal(true);
      setNoticeModalHeader('Information');
      setNoticeModalErrMsg('Your Plan has been cancelled. You can activate anytime by going to Manage Account before the expiry date of the cancelled Plan.');
      setNoticeModal(true);
    }
  };
  const getRolloverDate = (date) => {
    return formatDate(new Date(date.setMonth(date.getMonth() + 1)));
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
        <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)} style={{ width: 600 }}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={(e) => handleClose(e)}>
            <CloseIcon />
          </IconButton>
          <div className={classes.modalTitle}>
            {planChanging ? (
              <>
                {selectedPlanAmount && selectedPlanAmount.total && selectedPlanAmount.total !== '' ? (
                  <span
                    style={{
                      fontSize: 20,
                      lineHeight: '25px',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    New FX Risk Management Plan
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 20,
                      lineHeight: '25px',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    Select New FX Risk Management Plan
                  </span>
                )}
              </>
            ) : (
              <span
                style={{
                  fontSize: 20,
                  lineHeight: '25px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Existing FX Risk Management Subscription Plan
              </span>
            )}
          </div>
        </DialogTitle>

        <DialogContent id="classic-modal-slide-description" className={cx(classes.modalBody, classes.loginMaxWidth)} justify="center">
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              {planChanging ? (
                <>
                  <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                    <span className={classes.floatLeft} style={{ width: '50%' }}>
                      New Risk Plan
                    </span>
                    <span>
                      {planList && planList.length > 0 ? (
                        <FormControl className={classes.selectFormControl} style={{ width: 200 }}>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu,
                            }}
                            classes={{
                              select: classes.select,
                            }}
                            value={selectedPlan}
                            onChange={handleSimple}
                            inputProps={{
                              name: 'planList',
                              id: 'ac_planList',
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose Risk Plan
                            </MenuItem>
                            {planList.map((item) => (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected,
                                }}
                                value={item}
                                key={item.id}
                              >
                                {item.maxUserAllowed === 1 ? 'Up to ' + item.maxUserAllowed + ' User' : 'Up to ' + item.maxUserAllowed + ' Users'}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <p style={{ color: 'red' }}>Please Call or email Customer Service</p>
                      )}
                    </span>
                  </div>
                  <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                    <span className={classes.floatLeft} style={{ width: '50%' }}>
                      New Plan Start Date
                    </span>
                    <span>{formatDate(new Date())}</span>
                  </div>
                  <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                    <span className={classes.floatLeft} style={{ width: '50%' }}>
                      Next Plan Rollover Date
                    </span>
                    <span>{getRolloverDate(new Date())}</span>
                  </div>
                  {selectedPlanAmount && selectedPlanAmount.total && selectedPlanAmount.total !== '' && (
                    <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                      <span className={classes.floatLeft} style={{ width: '50%' }}>
                        Payment to be made now
                      </span>
                      <span>{'£' + selectedPlanAmount.total + ' (including VAT, if applicable)'}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                  <span className={classes.floatLeft} style={{ width: '50%' }}>
                    Max Users
                  </span>
                  <span>{planDetails.maxUserAllowed}</span>
                </div>
              )}
              <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                <span className={classes.floatLeft} style={{ width: '50%' }}>
                  Card Type
                </span>
                <span>{planDetails.funding === 'credit' ? 'Credit' : planDetails.funding === 'debit' ? 'Debit' : 'Others'}</span>
              </div>
              <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                <span className={classes.floatLeft} style={{ width: '50%' }}>
                  Card Brand
                </span>
                <span style={{ textTransform: 'capitalize' }}>{planDetails.country + ' - ' + planDetails.cardBrand}</span>
              </div>
              <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                <span className={classes.floatLeft} style={{ width: '50%' }}>
                  Name on Card
                </span>
                <span>{planDetails.name}</span>
              </div>
              <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                <span className={classes.floatLeft} style={{ width: '50%' }}>
                  Card last 4 digits
                </span>
                <span>{planDetails.last4Digit}</span>
              </div>
              <div className={classes.detailsRow} style={{ textAlign: 'left' }}>
                <span className={classes.floatLeft} style={{ width: '50%' }}>
                  Card Expiry (MM-YYYY)
                </span>
                <span>{planDetails.expMonth + ' - ' + planDetails.expYear}</span>
              </div>
              {planChanging ? (
                <>
                  {selectedPlanAmount && selectedPlanAmount.total && selectedPlanAmount.total !== '' && (
                    <>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start', marginTop: 28 }}>
                          <div className={classes.heading}>Review Your order</div>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{
                            textAlign: 'start',
                          }}
                        >
                          <div style={{ marginTop: 10 }}>- The plan will automatically renew each month until cancelled, and you will be billed on that renewal date.</div>
                          <div style={{ marginTop: 10 }}>- To avoid charges for the next month, please cancel before the renewal date on Manage Account.</div>
                          <div style={{ marginTop: 10 }}>- You can cancel, upgrade or downgrade your plan anytime by going to Manage Plan.</div>
                        </GridItem>
                      </GridContainer>
                      <div>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: primaryColor[5],
                            width: '80%',
                            margin: '30px 10px',
                          }}
                          onClick={() => saveNewRiskPlanSubscription()}
                        >
                          CONFIRM NEW PLAN
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex' }}>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: primaryColor[5],
                      width: '80%',
                      margin: '30px 10px',
                    }}
                    onClick={() => changeRiskPlanSubscription()}
                  >
                    SELECT NEW PLAN
                  </Button>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: primaryColor[5],
                      width: '80%',
                      margin: '30px 10px',
                    }}
                    onClick={() => cancelRiskPlanSubscription()}
                  >
                    CANCEL PLAN
                  </Button>
                </div>
              )}
            </GridItem>
            {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
            {confirmationModal && (
              <ConfirmationModal
                confirmationModal={confirmationModal}
                confirmationModalHeader={confirmationModalHeader}
                confirmationModalMsg={confirmationModalMsg}
                handleNegativeButton={handleNegativeButton}
                handlePositiveButton={upgradePlan}
              />
            )}
            {confirmationCancelModal && (
              <ConfirmationCancelModal
                confirmationModal={confirmationCancelModal}
                confirmationModalHeader={confirmationCancelModalHeader}
                confirmationModalMsg={confirmationCancelModalMsg}
                handleNegativeButton={handleNegativeButton}
                handlePositiveButton={cancelAndRouteToRiskPlanPage}
              />
            )}
            {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
          </GridContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ManageSubscription.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  planDetails: PropTypes.object.isRequired,
};

export default ManageSubscription;
