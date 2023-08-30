import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import NoticeModal from "views/Components/NoticeModal";
import CircularProgresss from 'components/CircularProgress/CircularProgresss.jsx';
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import Cookies from "js-cookie";

const XeroOauth = () => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  console.log('LOCATON - ', location);
  console.log('SEARCH - ', searchParams);

  const [callInProgress, setCallInProgress] = useState(false); 
  const [noticeModal, setNoticeModal] = useState(false); 
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState("");
  const [noticeModalHeaderMsg, setNoticeModalHeaderMsg] = useState("");

  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalErrMsg("");
    setNoticeModalHeaderMsg("");
  };

  useEffect(() => {
    getUserToken();
  }, []);

  const getUserToken = async () => {
    if (location.search.includes("error=access_denied")) {
      history.push("/auth/risk-radar");
    } else {
      setCallInProgress(true);
      const result = await apiHandler({
        url: endpoint.XERO_AUTH_LOGIN + location.search,
        authToken: sessionStorage.getItem("token")
      });
      setCallInProgress(false);
      console.log("DATA - ", result.data);
      if (result.data.errorCode) {
          setNoticeModalErrMsg(result.data.userDesc);
          setNoticeModalHeaderMsg("Error");
          setNoticeModal(true);
          history.push("/auth/risk-radar", {from: "xero-oauth"});
      } else {
      //   // store Login Credentials
      //   dispatch(
      //     saveAuthData({
      //       authToken: result.data.access_token,
      //       refreshToken: result.data.refresh_token,
      //       tokenTime: Date.now(),
      //       isAuthenticated: true,
      //     })
      //   );
      //   dispatch(
      //     saveUserData({
      //       role: result.data.role ? result.data.role : "",
      //       username: result.data.username ? result.data.username : "",
      //       email: result.data.email ? result.data.email : "",
      //       name: result.data.name ? result.data.name : "",
      //     })
      //   );
      //   sessionStorage.setItem('session', uuid());
        history.push("/auth/risk-radar", {from: "xero-oauth"});
      }
    }
  };
  return (
    <>
      {noticeModal && (
        <NoticeModal
          noticeModal={noticeModal}
          noticeModalHeader={noticeModalHeaderMsg}
          noticeModalErrMsg={noticeModalErrMsg}
          closeModal={closeNoticeModal}
        />
      )}
      {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
    </>
  );
};

export default XeroOauth;
