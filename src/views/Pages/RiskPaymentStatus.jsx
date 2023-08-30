import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import CircularProgresss from 'components/CircularProgress/CircularProgresss.jsx';

import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

let timeoutIdPayment = null, retryPayment = 0; 

const RiskPaymentStatus = ({ classes }) => {
  const history = useHistory();

  const [callInProgress, setCallInProgress] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('Error');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [routeTo, setRouteTo] = useState('');

  useEffect(() => {
    getRiskPlanList();
    retryPayment = 0;
    timeoutIdPayment = setInterval(getRiskPlanList, 2000);
    return () => {
      if (timeoutIdPayment) {
        clearInterval(timeoutIdPayment);
        timeoutIdPayment = null;
      }
    }
  }, []);

  const getRiskPlanList = async () => {
    setCallInProgress(true);
    // RISK SUBSCRIPTION PLANS
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: sessionStorage.getItem('token'),
    });
    retryPayment = retryPayment + 1;
    setCallInProgress(false);
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403 || res.data.errorCode === 404) {
        if (retryPayment === 4) {
          console.log('RISK SUBSCRIPTION HAS ISSUES');
          clearInterval(timeoutIdPayment);
          timeoutIdPayment = null;
          retryPayment = 4;  
          setNoticeModalHeader('Error');
          setNoticeModalErrMsg("Risk subscription not successful. Please try again.");
          setNoticeModal(true);
          setRouteTo('/auth/risk-subscription');
        }
        return;
      } else {
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg("Risk subscription not successful. Please try again.");
        setNoticeModal(true);
        setRouteTo('/auth/risk-subscription');
      }
    } else {
      console.log(res.data);
      clearInterval(timeoutIdPayment);
      timeoutIdPayment = null;
      retryPayment = 4;  
      sessionStorage.setItem("riskStatus", res.data.status);
      if (res.data.active) {
        setNoticeModalHeader('Information');
        setNoticeModalErrMsg("Your selected Plan has been subscribed. You can start using FX Risk Management Portal.");
        setNoticeModal(true);
        setRouteTo('/auth/risk-portal');
      }
      // setPaymentStatus(JSON.stringify(res.data));
    }
  };
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader('');
    setNoticeModalErrMsg('');
    if (routeTo !== '') {
      history.push(routeTo);
    }
  };
 
  return (
    <>
      <GridContainer justify="center" style={{ textAlign: 'center' }}>
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <h2>FX Risk Subscription Payment Status</h2>
        </GridItem>
        {/* <GridItem xs={11} sm={11} md={11} lg={11}>
        {paymentStatus}     
        </GridItem> */}
      </GridContainer>
      {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
      {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
    </>
  );
};

RiskPaymentStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(RiskPaymentStatus));
