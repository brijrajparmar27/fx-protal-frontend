import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import { Button } from '@material-ui/core';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import { formatDate } from 'utils/Utils';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

import ChangeBaseCurrencyModal from 'views/Components/RiskSubscription/ChangeBaseCurrencyModal.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import ManualPaymentModal from 'views/Components/RiskSubscription/RiskManualPayment.jsx';
import GetStartedModal from 'views/Components/GetStartedModal.jsx';
// import { module } from 'assets/config';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';

// core components
import modalStyle from 'assets/jss/material-dashboard-pro-react/modalStyle.jsx';

import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';

import riskinsightquestions from 'views/Pages/json/riskinsightquestions.json';
import riskinsightapiresponse from 'views/Pages/json/riskinsightapiresponse.json';
import addCustomersStyle from 'assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx';

const style = (theme) => ({
  container: {
    padding: '20px 20px 80px 20px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.14)',
    borderRadius: 22,
  },
  description: {
    fontWeight: 'bold',
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
  horizontalSlider: {
    width: '100%',
    maxWidth: 500,
    height: 50,
    top: 10,

    // border: '1px solid grey',
    '& sliderThumb': {
      top: 1,
      width: 50,
      height: 48,
      lineHeight: 38,
    },
    '& sliderTrack': {
      top: 10,
      height: 10,
    },
  },
  sliderThumb: {
    fontSize: '0.9em',
    textAlign: 'center',
    backgroundColor: '#000',
    color: '#FFF',
    cursor: 'pointer',
    border: '5px solid gray',
    boxSizing: 'border-box',
  },
  sliderTrack: {
    position: 'relative',
    background: '#0000001a',
    top: 10,
    height: 10,
  },
  contentBox: {
    // border: "#ACACAC 1px solid",
    padding: '10px',
    fontWeight: 400,
    fontSize: 20,
  },
  heading: {
    marginTop: 40,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 20,
    lineHeight: '24px',
    color: '#555E67',
  },
  listContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  stepContainer: {
    margin: '10px 5px 50px 5px',
  },
  boxContainer: {
    border: '2px solid #40A8BD',
    boxShadow: '0px 4px 10px rgba(84, 84, 84, 0.1)',
    borderRadius: 10,
    padding: 10,
    display: 'inline-flex',
  },
  stepSize: {
    padding: 5,
    backgroundColor: '#40A8BD',
    borderRadius: '50%',
    fontWeight: 500,
    height: 30,
    width: 30,
  },
  stepName: {
    marginLeft: 15,
    fontWeight: 600,
  },
  linksContainer: {
    marginTop: 5,
    paddingLeft: 20,
    textTransform: 'uppercase',
    backgroundColor: '#40a8bd4d',
    padding: 10,
    boxShadow: '0px 4px 10px #888f90',
    borderRadius: 10,
  },
  linkStyle: {
    color: '#153E6D',
    textDecoration: 'underline',
    fontSize: 15,
    fontWeight: 400,
  },
  subHeading: {
    color: 'red',
    textDecoration: 'none',
    fontSize: 'x-small',
  },
  ...addCustomersStyle,
  ...modalStyle,
  ...customCheckboxRadioSwitch,
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const RiskManagementPortal = (props) => {
  const history = useHistory();

  const [riskStatus, setRiskStatus] = useState({});
  const [getStartedModal, setGetStartedModal] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalHeader, setConfirmationModalHeader] = useState('');
  const [confirmationModalMsg, setConfirmationModalMsg] = useState('');

  const closeNoticeModal = () => {
    setNoticeModal(false);
  };
  const closeGetStartedModal = () => {
    setGetStartedModal(false);
  };
  useEffect(() => {
    if (sessionStorage.getItem('module') === 'RISKS') getUserRiskPlanStatus();
    getBaseCurrency();
  }, []);
  const getBaseCurrency = async () => {
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else {
        setRiskStatus({});
      }
    } else {
      console.log(res.data);
      setBaseCurrency(res.data.baseCurrency);
      // setShowManualPaymentModal(true); // TEMP
    }
  };
  const getUserRiskPlanStatus = async () => {
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 404) {
        setRiskStatus({});
        return;
      } else {
        setRiskStatus({});
      }
    } else {
      console.log(res.data);
      setRiskStatus(res.data);

      let expiry = res.data.planRenewalExpiryDate ? new Date(res.data.planRenewalExpiryDate) : null;
      let date = new Date();
      if (res.data.status === 'INACTIVE' && res.data.paymentDeclined && expiry && expiry > date) {
        setShowManualPaymentModal(true);
      }
    }
  };
  const closeShowManualPaymentModal = () => {
    setShowManualPaymentModal(false);
  };
  const editBaseCurrency = (window) => {
    setConfirmationModalHeader('Change Base Currency');
    setConfirmationModalMsg(
      'Please Note that if Reporting Currency Change is to be done, this is best done one-time in the beginning of your FX Risk Plan. If you change the reporting currency after you have utilised certain risk features (such as Risk Insight, Risk Radar, Risk Horizon, Risk Alert, Risk Reporting, etc.), these may not perform as expected, and you may have to create them again by inputting Risk and Insight data again.'
    );
    setConfirmationModal(true);
  };
  const changeBaseCurrencyPlan = async (currencyCode) => {
    handleNegativeButton();
    const res = await apiHandler({
      method: 'PUT',
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem('token'),
      data: { baseCurrency: currencyCode },
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      }
    } else {
      console.log(res.data);
      setBaseCurrency(res.data.baseCurrency);
      setNoticeModalHeader('Information');
      setNoticeModalErrMsg('Your reporting currency has been successfully changed');
      setNoticeModal(true);
      refreshToken();
    }
  };
  const refreshToken = async () => {
    const response = await apiHandler({
      method: 'POST',
      url: endpoint.LOGIN_OAUTH,
      data: {
        grant_type: 'refresh_token',
        refresh_token: sessionStorage.getItem('refresh_token'),
      },
    });
    // console.log(response);
    if (response.data.access_token) {
      sessionStorage.setItem('token', response.data.access_token);
      sessionStorage.setItem('customerId', response.data.customerId ? response.data.customerId : -1);
      sessionStorage.setItem('role', response.data.role);
      sessionStorage.setItem('tokenTime', Date.now());
      sessionStorage.setItem('view_as_client', response.data.view_as_client);
      sessionStorage.setItem('readonly_customer', response.data.readonly_customer);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      let status = 'prospect';
      if (response.data.view_as_client) status = 'view_as_client';
      else {
        if (response.data.is_user_admin) {
          status = 'admin';
        } else if (response.data.prospectUser) {
          if (response.data.customerId) status = 'registered';
          else status = 'prospect';
        } else status = 'approved';
      }
      sessionStorage.setItem('status', status);
    } else {
      // Auto Logout due to invalid Token
      console.log('Unauthorized Access');
      history.push('/home/logout');
    }
  };
  const handleNegativeButton = () => {
    setConfirmationModal(false);
    setConfirmationModalHeader('');
    setConfirmationModalMsg('');
  };
  const handleGetStarted = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setGetStartedModal(true);
  };

  const { classes } = props;
  return (
    <GridContainer justify="center">
      <GridItem xs={6} sm={6} md={6} lg={6}>
        <h4 style={{ display: 'inline-block' }}>
          <b>FX Risk Management</b>
        </h4>
        <Button
          onClick={(e) => handleGetStarted(e)}
          style={{
            color: 'white',
            backgroundColor: '#2391d2',
            marginLeft: 15,
            marginBottom: 5,
          }}
        >
          <OndemandVideoIcon style={{ marginRight: 15 }} />
          HOW TO NAVIGATE
        </Button>
      </GridItem>
      <GridItem xs={5} sm={5} md={5} lg={5} style={{ textAlign: 'right' }}>
        <h4 style={{ display: 'inline-block' }}>
          <b>My Reporting Currency: {baseCurrency}</b>
        </h4>
        <IconButton onClick={() => editBaseCurrency()} style={{ color: '#2391d2' }}>
          <Tooltip id="tooltip-totalSales" title="Edit Base Currency" placement="top" classes={{ tooltip: classes.tooltipCalculator }}>
            <EditIcon />
          </Tooltip>
        </IconButton>
      </GridItem>
      <GridItem xs={11} sm={11} md={11} lg={11}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.heading}>
                <p style={{ fontWeight: 'bold' }}>FX Risk Management Framework</p>
                {riskStatus.subsCancelled && (
                  <p className={classes.subHeading}>{'Your access to the FX Risk Management Portal will cease on ' + formatDate(riskStatus.planExpiryDate)}</p>
                )}
                <div className={classes.contentBox}>
                  <p>
                    The below steps provide a simple framework to manage FX risks in your business. Each of the steps in the framework will help you focus on FX risks and deal with
                    it as per your own objectives and requirements.
                  </p>
                  <p>
                    We have provided tools for each of these steps to assist you in developing your own approach in managing FX risks. You can click the links below the steps to go
                    to the desired tools, or can select them from the pull down menu on RISK MANAGEMENT menu.
                  </p>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.listContainer}>
                <div className={classes.stepContainer}>
                  <div className={classes.boxContainer}>
                    <div className={classes.stepSize}>01</div>
                    <div className={classes.stepName}>Identify & Understand FX Risks</div>
                  </div>
                  <div className={classes.linksContainer}>
                    <div>TOOLS</div>
                    <div>
                      <Link to={`/auth/risk-insight`} className={classes.linkStyle} activeClassName="active">
                        Risk Insight
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={classes.stepContainer}>
                  <div className={classes.boxContainer}>
                    <div className={classes.stepSize}>02</div>
                    <div className={classes.stepName}>Quantify FX Risks & its impact</div>
                  </div>
                  <div className={classes.linksContainer}>
                    <div>TOOLS</div>
                    <div>
                      <Link to={`/auth/fx-exposure-calculator`} className={classes.linkStyle} activeClassName="active">
                        FX Exposure Calculator
                      </Link>
                    </div>
                    <div>
                      <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                        Risk Radar
                      </Link>
                    </div>
                    <div>
                      <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                        Risk Impact
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={classes.stepContainer}>
                  <div className={classes.boxContainer}>
                    <div className={classes.stepSize}>03</div>
                    <div className={classes.stepName}>Design an FX Policy</div>
                  </div>
                  <div className={classes.linksContainer}>
                    <div>TOOLS</div>
                    <div>
                      <Link to={`/auth/fx-currency-risk-policy`} className={classes.linkStyle} activeClassName="active">
                        Sample FX Policy
                      </Link>
                    </div>
                    <div>
                      <Link to={`/auth/risk-insight`} className={classes.linkStyle} activeClassName="active">
                        Risk Insight
                      </Link>
                    </div>
                  </div>
                </div>
                {sessionStorage.getItem('module') === 'RISKS' ? (
                  <div className={classes.stepContainer}>
                    <div className={classes.boxContainer}>
                      <div className={classes.stepSize}>04</div>
                      <div className={classes.stepName}>Monitor Hedging & Hedge Effectiveness</div>
                    </div>
                    <div className={classes.linksContainer}>
                      <div>TOOLS</div>
                      <div>
                        <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                          Risk Radar
                        </Link>
                      </div>
                      <div>
                        <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                          Risk Alert
                        </Link>
                      </div>
                      <div>
                        <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                          Risk Reports
                        </Link>
                      </div>
                      <div>
                        <Link to={`/auth/portal-hedge`} className={classes.linkStyle} activeClassName="active">
                          Hedge Accounting
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={classes.stepContainer}>
                      <div className={classes.boxContainer}>
                        <div className={classes.stepSize}>04</div>
                        <div className={classes.stepName}>Execute FX Hedges</div>
                      </div>
                      <div className={classes.linksContainer}>
                        <div>TOOLS</div>
                        <div>
                          <Link to={`/auth/fx-forward-deals`} className={classes.linkStyle} activeClassName="active">
                            FX Forward
                          </Link>
                        </div>
                        <div>
                          <Link to={`/auth/hedging-qna`} className={classes.linkStyle} activeClassName="active">
                            Hedging Q&A
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className={classes.stepContainer}>
                      <div className={classes.boxContainer}>
                        <div className={classes.stepSize}>05</div>
                        <div className={classes.stepName}>Monitor Hedging & Hedge Effectiveness</div>
                      </div>
                      <div className={classes.linksContainer}>
                        <div>TOOLS</div>
                        <div>
                          <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                            Risk Radar
                          </Link>
                        </div>
                        <div>
                          <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                            Risk Alert
                          </Link>
                        </div>
                        <div>
                          <Link to={`/auth/risk-radar`} className={classes.linkStyle} activeClassName="active">
                            Risk Reports
                          </Link>
                        </div>
                        <div>
                          <Link to={`/auth/portal-hedge`} className={classes.linkStyle} activeClassName="active">
                            Hedge Accounting
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </GridItem>
            </>
          </GridContainer>
          {showManualPaymentModal && <ManualPaymentModal showModal={showManualPaymentModal} closeModal={closeShowManualPaymentModal} />}
          {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
          {confirmationModal && (
            <ChangeBaseCurrencyModal
              confirmationModal={confirmationModal}
              confirmationModalHeader={confirmationModalHeader}
              confirmationModalMsg={confirmationModalMsg}
              handleNegativeButton={handleNegativeButton}
              handlePositiveButton={changeBaseCurrencyPlan}
            />
          )}
          {getStartedModal && (
            <GetStartedModal
              showModal={getStartedModal}
              closeModal={closeGetStartedModal}
              title={'GET STARTED VIDEO'}
              videoLink={'https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/videos/How+to+Navigate.mp4'}
            />
          )}
        </div>
      </GridItem>
    </GridContainer>
  );
};
RiskManagementPortal.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(RiskManagementPortal);
