import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import ConfirmationModal from 'views/Components/ConfirmationModal.jsx';
import * as Scroll from 'react-scroll';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import { formatDate } from 'utils/Utils';

import PlansInformation from 'views/Components/RiskSubscription/PlansInformation.jsx';
import PlanSubscriptionModal from 'views/Components/RiskSubscription/PlanSubscriptionModal.jsx';
import ContactUsModal from 'views/Components/RiskSubscription/ContactUsModal.jsx';
import CircularProgresss from 'components/CircularProgress/CircularProgresss.jsx';
import GetStartedModal from 'views/Components/GetStartedModal.jsx';


import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
import axios from 'axios';

import regularFormsStyle from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';
import { cardTitle, roseColor } from 'assets/jss/material-dashboard-pro-react.jsx';

const styles = {
  ...regularFormsStyle,
  planName: {
    color: 'inherit',
    fontSize: 19,
    cursor: 'pointer',
    '&.hover': {
      color: '#abc123',
    },
  },
  moreInfoBtn: {
    padding: '20px 40px',
    backgroundColor: '#143e6d',
    color: '#FFFFFF !important',
    cursor: 'pointer',
    fontSize: 19,
    borderRadius: '20px',
    '&.hover': {
      color: '#FFFFFF !important',
      backgroundColor: 'transparent',
    },
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: '#FFFFFF',
    marginTop: '0',
  },
};

const CONTACT_PLAN_INFO = {
  active: true,
  amount: 0,
  currency: 'GBP',
  description: 'Please Call or email Customer Service\r\n ',
  freePlan: 1,
  freePlanUnit: 'Month',
  id: 0,
  maxUserAllowed: 10,
  planFrequency: 'Monthly',
  contactButton: true,
};

const RISK_ITEMS = [
  { name: 'Risk Insight', id: 'risk-insight', video:[] },
  { name: 'FX Exposure Calculator', id: 'fx-calculator' , video:[{title: "FX CALCULATOR VIDEO", link: "https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/images/Fx+Caculator.mp4"}]},
  { name: 'Risk Radar', id: 'risk-radar', video:[{title: "RISK RADAR VIDEO 1", link: "https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/images/Risk+Radar+Video+1.mp4"}, {title: "RISK RADAR VIDEO 2", link: "https://fxguard-cms.s3.eu-west-2.amazonaws.com/cms/public/images/Risk+Radar+Video+Part+2.mp4"}] },
  { name: 'Customisable FX Risk Policy', id: 'risk-policy', video:[] },
  { name: 'Hedging Guidance', id: 'hedge-guidance', video:[] },
  { name: 'Hedge Accounting ', id: 'hedge-accounting', video:[] },
  { name: 'Historical FX Data Download', id: 'historical-rates', video:[] },
  { name: 'Market Intelligence', id: 'market-intelligence', video:[] },
  { name: 'Live Reference Price Check – Spot and Forward', id: 'price-check', video:[] },
];
const RiskSubscription = ({ classes }) => {
  const history = useHistory();

  const [planList, setPlanList] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [countries, setCountries] = useState([]);
  const [cancelledUser, setCancelledUser] = useState(false);
  const [riskStatus, setRiskStatus] = useState({});
  const [callInProgress, setCallInProgress] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('Error');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalHeader, setConfirmationModalHeader] = useState('');
  const [confirmationModalMsg, setConfirmationModalMsg] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [getStartedModal, setGetStartedModal] = useState(false);

  const handleGetStarted = (event, title, link) => {
    setVideoTitle(title);
    setVideoLink(link);
    setGetStartedModal(true);
  };
  const closeGetStartedModal = () => {
    setGetStartedModal(false);
  };

  useEffect(() => {
    getRiskPlanList();
    getCountryList();
    getUserRiskPlanStatus();
  }, []);

  const getRiskPlanList = async () => {
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
      } else if (res.data.errorCode === 404) {
        return;
      }  else {
        setNoticeModalHeader('Error');
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      console.log(res.data);
      setPlanList(res.data.riskPlans);
    }
  };
  const getCountryList = async () => {
    const res = await axios.get(endpoint.BASE_URL_STAGING_AXIOS + 'fx-crm/public/countriesMetaData');
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        // history.push("/home/logout");
        return;
      } else {
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModal(true);
      }
    } else {
      const countries = res.data.countryMetaData;
      await setCountries(countries);
    }
  };
  const getUserRiskPlanStatus = async () => {
    setCallInProgress(true);
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
      } else if (res.data.errorCode === 404) {
        return;
      } else {
        setCancelledUser(false);
      }
    } else {
      console.log(res.data);
      if(res.data && res.data.status==="ACTIVE")
      {
        history.push("/auth/risk-portal");
      }
      setRiskStatus(res.data);
      if (res.data.subsCancelled) setCancelledUser(res.data.subsCancelled);
      else setCancelledUser(false);
    }
  };
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader('');
    setNoticeModalErrMsg('');
  };
  const handleNegativeResponse = () => {};
  const handlePositiveResponse = () => {};
  const onPlanSelection = async (event, plan) => {
    console.log(plan);
    event.preventDefault();
    event.stopPropagation();

    // setCallInProgress(true);
    // // RISK SUBSCRIPTION PLANS
    // const res = await apiHandler({
    //   method: "POST",
    //   url: endpoint.RISK_INITIATE_SUBSCRIPTION,
    //   authToken: sessionStorage.getItem("token"),
    //   data: { riskSubscriptionPlanId: plan.id }
    // });
    // setCallInProgress(false);
    // if (res.data.errorCode) {
    //   if (res.data.errorCode === 401) {
    //     console.log("Unauthorized Access");
    //     history.push("/home/logout");
    //     return;
    //   } else if (res.data.errorCode === 403) {
    //     return;
    //   } else {
    //     setNoticeModalHeader("Error");
    //     setNoticeModalErrMsg(res.data.userDesc);
    //     setNoticeModal(true);
    //   }
    // } else {
    //   console.log(res.data);
    // }
    setSubscriptionDetails({
      amount: plan.amount,
      id: plan.id,
    });
    setShowSubscriptionModal(true);
  };
  const onContactUs = async (event, plan) => {
    setCallInProgress(true);
    const res = await apiHandler({
      url: endpoint.USER_INFO,
      authToken: sessionStorage.getItem('token'),
    });
    setCallInProgress(false);
    if (!res.data.errorCode) {
      const user = res.data;
      setUserDetails(user);
      setShowContactUsModal(true);
    }
  };
  const closeContactUsModal = () => {
    setUserDetails({});
    setShowContactUsModal(false);
  };
  const closeSubscriptionModal = () => {
    setSubscriptionDetails({});
    setShowSubscriptionModal(false);
  };
  return planList.length > 0 ? (
    <>
      <GridContainer justify="center" style={{ textAlign: 'center' }}>
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <h2>FX Risk Management</h2>
          {cancelledUser && riskStatus.status && riskStatus.status !== 'INACTIVE' ? (
            <>
              <h3>{'Reactivate your plan'}</h3>
              <p style={{color: 'red'}}>{'Your access to the FX Risk Management Portal will cease on ' + formatDate(riskStatus.planExpiryDate)}</p>
            </>
          ) : (
            <>
            {riskStatus.freePlanUsed ? <h3>Select your Plan - No Credit Card Required</h3> : <h3>Select your Plan – One Month Free - No Credit Card Required</h3> }
            </>
          )}
        </GridItem>
        <GridItem xs={1} sm={1} md={2} lg={2} />
        <GridItem xs={11} sm={11} md={8} lg={8}>
          <GridContainer justify="flex-start">
            {RISK_ITEMS.map((r, i) => (
              <><div key={i} style={{ width: '50%', textAlign: 'left' }}>
                <DoneIcon />
                <Link className={classes.planName} activeClass="active" to={r.id} spy={true} smooth={true} offset={0} duration={500}>
                  {r.name}
                </Link>
                {/* <a className={classes.planName}>{r.name}</a> */}
                {r.video && r.video.length > 0 &&
              <>
              {r.video.map((v,i) => 
              <Button
              onClick={(e) => handleGetStarted(e, v.title, v.link)}
              style={{
                color: 'white',
                backgroundColor: '#2391d2',
                marginLeft: 15,
                marginBottom: 5,
                padding: "5px",
                fontSize:"8px",
              }}
            >
                <OndemandVideoIcon style={{ marginRight: 8 }} />
                {v.title}
              </Button>
              )}
                </>
                }
                </div>
                </>
            ))}
          </GridContainer>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11} style={{ justifyContent: 'center', marginTop: 40, marginBottom: 20 }}>
          {/* <Button
            size="lg"
            style={{ backgroundColor: "#143e6d" }}
            // onClick={event => onContactUs(event, plan)}
          >
            More Information
          </Button> */}
          <Link className={classes.moreInfoBtn} activeClass="active" to={'risk-insight'} spy={true} smooth={true} offset={-100} duration={500}>
            {'More Information'}
          </Link>
          <span style={{ backgroundColor: "#143e6d", color: '#FFFFFF', borderRadius: '20px', padding: '20px 30px', fontSize: 19, margin: 0, marginLeft: 15, cursor: 'pointer' }}
            onClick={event => onContactUs(event, CONTACT_PLAN_INFO)}>Contact Us for Demo</span>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11} style={{ display: 'flex' }}>
          {planList.map((plan, i) => (
            <PlansInformation key={i} plan={plan} riskStatus={riskStatus} onPlanSelection={onPlanSelection} onContactUs={onContactUs} isAvailable={true} />
          ))}
          <PlansInformation key={planList.length} riskStatus={riskStatus} plan={CONTACT_PLAN_INFO} onPlanSelection={onPlanSelection} onContactUs={onContactUs} isAvailable={true} />
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11} style={{ textAlign: 'left', marginBottom: 20 }}>
          <h4>
            {cancelledUser ? <>{'The plan will automatically renew each month until cancelled. To avoid charges for the next month, please cancel before the renewal date on Manage Account. Also, you can always upgrade your plan (or cancel the plan) anytime by going to Manage Plan page.'}</> 
            : <>{'*Your first month is free. During the trial, if you decide to continue the subscription after the free trial, you can simply provide (add) the payment information on Manage Account section of the web-portal. After the expiry of the trial, if you wish to continue, you will have to resubscribe your chosen plan.'}</>}
          </h4>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11} style={{ textAlign: 'left', marginBottom: 50, borderTop: '2px solid #6E6E6E' }}>
          <center><h3><b>What you get from Risk Management Subscription</b></h3></center>
          <h4 id="risk-insight">
            <b>Risk Insight</b>
          </h4>
          <h4>Risk Insight gives insight into the foreign exchange (FX) risks that exist in your business.</h4>
          <h4>
            This tool helps you identify different types of FX risks in your business. It also allows you to quantify these FX risks. Furthermore, it suggests a way forward for you
            to mitigate and manage FX risks in your business.
          </h4>
          <h4 id="fx-calculator">
            <b>FX Exposure Calculator</b>
          </h4>
          <h4>
            This provides you an easy and intuitive way to look at the impact of FX changes on your bottom line or margins. Furthermore, it also provides a scenario analysis on how
            different level of hedging percentages can protect your gross margin taking in to account certain hedging costs that may be required for hedging.
          </h4>
          <h4 id="risk-radar">
            <b>Risk Radar</b>
          </h4>
          <h4>
            This a key tool that enables you to monitor FX risks in real time by inputting your exposure data and any existing hedging that you may done with hedge providers. It
            calculates the FX Risk impact, and can be set up to alert you beyond a specific level of FX risks. It also provides you “What If” scenario on a particular hedging
            decision that you may consider. Furthermore, it provides you various reports that may further help you in understanding your FX risks and in decision making.
          </h4>
          <h4 id="risk-policy">
            <b>FX Risk Policy</b>
          </h4>
          <h4>This gives you a simple generic template policy framework which when required you can further customise based on your own specific requirements.</h4>
          <h4 id="hedge-guidance">
            <b>Hedging Guidance Q&amp;A</b>
          </h4>
          <h4>This covers a range of most commonly asked questions including how various FX exposures can be hedged using FX Forward contracts.</h4>
          <h4 id="hedge-accounting">
            <b>Hedge Accounting</b>
          </h4>
          <h4>
            Hedge Accounting deals with introduction of hedge accounting, type of hedge accounting, a tool to assess if hedge accounting may be applicable to your hedging situation
            and which type, and sample documentation for the hedge accounting. Accounting entries for the hedge accounting is also expected to be added in the near future.
          </h4>
          <h4 id="historical-rates">
            <b>Historical FX Data Download</b>
          </h4>
          <h4>
            You can get the historical FX Spot data on any chosen currency pair for various information requirements such as for charting, or for accounting. This high quality,
            accurate, and reliable data is provided by the independent provider Xignite which we bring to you in a very simple and easy to access manner.
          </h4>
          <h4 id="market-intelligence">
            <b>Market Intelligence</b>
          </h4>
          <h4>
            Market Intelligence is a key tool to monitor the FX market which helps in decision making on assessing and hedging FX exposure, benchmarking the hedges, and getting the
            required FX data for accounting and other reporting purposes.
          </h4>
          <h4>
            Market Intelligence has a number of components including Live Exchange Rates, Cross Rates, Forward Rates, Economic Calendar and Currency News. Both live and historical
            information and FX data including in chart forms can be obtained in most traded currency pairs. Furthermore, a Live Reference FX Spot and Forward Calculator can be used
            to benchmark the pricing of any hedge provider.
          </h4>
          <h4 id="price-check">
            <b>Live Reference Price Check – Spot and Forward</b>
          </h4>
          <h4>
            Want to compare what value you are getting from any FX provider on Spot and Forward rates? Use the Calculator to get the live, time stamped mid-rate for the
            chosen/available currency pair. The rate obtained from this Reference Price Check is a mid-rate obtained from independent provider Xignite. This is a valuable and handy
            tool to get information on the rates at which the FX market is trading at the time of enquiry.
          </h4>
        </GridItem>
      </GridContainer>
      {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
      {showSubscriptionModal && <PlanSubscriptionModal showModal={showSubscriptionModal} closeModal={closeSubscriptionModal} details={subscriptionDetails} riskStatus={riskStatus} />}
      {showContactUsModal && <ContactUsModal showModal={showContactUsModal} closeModal={closeContactUsModal} countries={countries} userDetails={userDetails} />}
      {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
      {confirmationModal && (
        <ConfirmationModal
          confirmationModal={confirmationModal}
          confirmationModalHeader={confirmationModalHeader}
          confirmationModalMsg={confirmationModalMsg}
          handleNegativeButton={handleNegativeResponse}
          handlePositiveButton={handlePositiveResponse}
        />
      )}
           {getStartedModal && (
            <GetStartedModal
              showModal={getStartedModal}
              closeModal={closeGetStartedModal}
              title={videoTitle}
              videoLink={videoLink}
            />
          )}
    </>
  ) : (
    <div>No Plans information to subscribe. Contact Administartor</div>
  );
};


RiskSubscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(RiskSubscription));
