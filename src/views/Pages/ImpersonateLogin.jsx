import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import NoticeModal from "views/Components/NoticeModal.jsx";
import { useStateValue } from "../../utils/Utils";
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
// import { module } from 'assets/config';

import axios from "axios";

const ImpersonateLogin = props => {
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState("");
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [{ authenticated }, dispatch] = useStateValue(false);

  const componentDidUpdate = async () => {
    const { match } = props;
    // Login to Client
    const code = {
      grant_type: "view_as_client",
      customer_email: decodeURIComponent(match.params.clientEmail),
      access_token: sessionStorage.getItem("token")
    };
    const response = await apiHandler({
      method: 'POST',
      url: endpoint.LOGIN_OAUTH,
      data: code,
      token: null
    });
    console.log('Impersonate login', response.data);
      if (response.data.error) {
        setNoticeModalHeader("ERROR");
        setNoticeModalErrMsg(response.data.userDesc);
        setNoticeModal(true);
      } else {
        
        sessionStorage.setItem("token", response.data.access_token);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem(
          "customerId",
          response.data.customerId ? response.data.customerId : -1
        );
        sessionStorage.setItem("tokenTime", Date.now());
        sessionStorage.setItem("refresh_token", response.data.refresh_token);
        sessionStorage.setItem("view_as_client", response.data.view_as_client);
        sessionStorage.setItem(
          "readonly_customer",
          response.data.readonly_customer
        );
        sessionStorage.setItem("company_name", response.data.company_name);
        sessionStorage.setItem("status", "view_as_client");

        dispatch({
          type: "changeAuthenticated",
          authenticated: true
        });
        // console.log("Authenticated");
        getUserAppsAccess(response.data);
      }
    // axios({
    //   method: "post",
    //   url: endpoint.BASE_URL_STAGING_AXIOS + "fx-auth-server/oauth/token",
    //   data: code
    // }).then(response => {
    //   if (response.data.error) {
    //     setNoticeModalHeader("ERROR");
    //     setNoticeModalErrMsg(response.data.userDesc);
    //     setNoticeModal(true);
    //   } else {
    //     sessionStorage.setItem("token", response.data.access_token);
    //     sessionStorage.setItem("role", response.data.role);
    //     sessionStorage.setItem(
    //       "customerId",
    //       response.data.customerId ? response.data.customerId : -1
    //     );
    //     sessionStorage.setItem("tokenTime", Date.now());
    //     sessionStorage.setItem("refresh_token", response.data.refresh_token);
    //     sessionStorage.setItem("view_as_client", response.data.view_as_client);
    //     sessionStorage.setItem(
    //       "readonly_customer",
    //       response.data.readonly_customer
    //     );
    //     sessionStorage.setItem("company_name", response.data.company_name);
    //     sessionStorage.setItem("status", "view_as_client");

    //     dispatch({
    //       type: "changeAuthenticated",
    //       authenticated: true
    //     });
    //     // console.log("Authenticated");
    //   getUserAppsAccess(response.data);

    //     // if (sessionStorage.getItem('module') === 'RISKS') {
    //     //   ValidateRiskSubscription(response.data.access_token);
    //     // } else {
    //     //   props.history.push(`/auth/portal-dashboard`);
    //     // }
    //   }
    // });
  };
  const getUserAppsAccess = async (data) => {
    const response = await apiHandler({
      method: 'GET',
      url: endpoint.LOGIN_SUBSCRIBED_APPS,
      authToken: data.access_token
    });
    console.log('getUserAppsAccess login - ', response.data);
    if (response.data.error) {
      setNoticeModalHeader("Error");
      setNoticeModalErrMsg("Please check your Email for Valid OTP code");
      setNoticeModal(true);
    } else {
        const linkRes = await apiHandler({url: endpoint.APP_LINK});
        console.log('DATA - ', linkRes.data);

        const {hide_transaction} = linkRes.data;
        console.log('HODE - ', hide_transaction);
        sessionStorage.setItem('ht', hide_transaction);
        if (hide_transaction === 'true') {
          sessionStorage.setItem('access', 'r');
          sessionStorage.setItem('module', 'RISKS');
          return ValidateRiskSubscription(data.access_token);
        } else {
          if (response.data.riskModule === true && response.data.traansactionModule === true) {
            sessionStorage.setItem('access', 'a');
            sessionStorage.setItem('module', 'BOTH');
            props.history.push(`/auth/portal-dashboard`);
          } else if (response.data.riskModule === true) {
            sessionStorage.setItem('access', 'r');
            props.history.push(`/auth/modules`);
          } else if (response.data.traansactionModule === true) {
            sessionStorage.setItem('access', 't');
            props.history.push(`/auth/modules`);
          } else {
            sessionStorage.setItem('access', 'n');
            props.history.push(`/auth/modules`);
          }
        }
      }
  };
  const ValidateRiskSubscription = async (token) => {
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: token,
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 404) {
        return;
      } else {
        props.history.push(`/auth/risk-subscription`);
      }
    } else {
      console.log(res.data);
      sessionStorage.setItem('riskStatus', res.data.status);
      if (res.data.status === 'ACTIVE') props.history.push(`/auth/risk-portal`);
      else props.history.push(`/auth/risk-subscription`);
    }
  };
  useEffect(() => {
    componentDidUpdate();
  }, []);

  const closeNoticeModal = () => {
    setNoticeModalHeader("");
    setNoticeModalErrMsg("");
    setNoticeModal(false);
    props.history.go(-1);
  };

  return noticeModal ? (
    <div>
      <NoticeModal
        noticeModal={noticeModal}
        noticeModalHeader={noticeModalHeader}
        noticeModalErrMsg={noticeModalErrMsg}
        closeModal={closeNoticeModal}
      />
    </div>
  ) : null;
};

// export default ;
export default withRouter(ImpersonateLogin);
