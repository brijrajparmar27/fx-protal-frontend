import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import { Button } from '@material-ui/core';
import axios from "axios";
import NoticeModal from 'views/Components/NoticeModal.jsx';
import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';
import { endpoint } from "api/endpoint";
import { apiHandler } from "api";
import risk from "assets/img/landing/Money.png";
import transaction from "assets/img/landing/Exchange.png";
import { formatDate } from '../../utils/Utils';

const useStyles = makeStyles(styles);

export default function ModuleSelectionPage(props) {
  const classes = useStyles();
  let history = useHistory();

  const [moduleList, setModuleList] = useState([
    {
      imageName: risk,
      nameHeading: "FX Risk Management",
      namesubtitle: "Set of easy and intuitive tools For Risk Management",
      name: "open Module",
      url: "/auth/risk-portal",
      type: 'RISKS',
    },
    {
      imageName: transaction,
      nameHeading: "FX Deals and Payments",
      namesubtitle: "Manage your foreign exchange Risks",
      name: "open Module",
      url: "/auth/portal-dashboard",
      type: 'TRANSACTION',
    },
  ]);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState("");
  const [noticeModalHeaderMsg, setNoticeModalHeaderMsg] = useState("");
  const [userInfo, setUserInfo] = React.useState({});

  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalErrMsg("");
    setNoticeModalHeaderMsg("");
  };

  useEffect(() => {
    getUserInformation();
    sessionStorage.removeItem('module');
  }, []);
  const getUserInformation = async () => {
    const res = await apiHandler({
      url: endpoint.USER_INFO,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        history.push('/home/logout');
        return;
      } else {
        return;
      }
    } else {
      const user = res.data;
      if (user && user.customerRegistrationAppliedDate) {
        sessionStorage.setItem('customerRegistrationAppliedDate', formatDate(user.customerRegistrationAppliedDate));
      }
      setUserInfo(user);
    }
  };
  const getUserDetails = async () => {
    // const header = {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //   },
    // };
    // const result = await axios("loan-service/v1/admin/user/detail", header);
    // console.log(result.data);
    // setBranchName(result.data.branchName);
    // setUserName(result.data.username);
    // localStorage.setItem("branchId", result.data.branchId);
    // localStorage.setItem("branchCode", result.data.branchCode);
    // localStorage.setItem("id", result.data.id);
    // localStorage.setItem("mobileNumber", result.data.mobileNumber);

    // const result = await apiHandler({
    //   url: endpoint.USER_DETAIL,
    //   authToken: sessionStorage.getItem('token'),
    // });

    // setBranchName(result.data.branchName);
    // setUserName(result.data.username);
    // setRole(result.data.role);
  };
  // useEffect(() => {
  //     GetModuleList();
  // }, []);
  // const GetModuleList = async () => {
  //     const header = {
  //         headers: {
  //             Authorization: 'Bearer ' + localStorage.getItem('token'),
  //         },
  //     };

  //     const list = await axios('loan-service/url', header);
  //     console.log(list.data);

  //     setModuleData(list.data);
  //     parseIndicatorData(list.data);
  // };
  // const parseIndicatorData = (list) => {
  //     let reportData = [];
  //     list &&
  //         Object.keys(list) &&
  //         Object.keys(list).forEach((module) => {
  //             reportData.push({
  //                 name: module,
  //                 url: list[module],
  //             });
  //         });
  //     setModuleList(reportData);
  // };
  const ValidateRiskSubscription = async () => {
    sessionStorage.setItem('module', 'RISKS');
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
      } else {
        history.push(`/auth/risk-subscription`);
      }
    } else {
      console.log(res.data);
      sessionStorage.setItem('riskStatus', res.data.status);
      if (res.data.status === 'ACTIVE') {
        history.push(`/auth/risk-portal`);
      } else {
        let expiry = res.data.planRenewalExpiryDate ? new Date(res.data.planRenewalExpiryDate) : null;
        let date = new Date();
        // date.setDate(date.getDate() - 15);
        if (res.data.status === 'INACTIVE' && res.data.paymentDeclined && expiry && expiry > date) {
          sessionStorage.setItem('riskStatus', 'INACTIVE_TIMEOUT');
          // history.push(`/auth/risk-payment`);
          history.push(`/auth/risk-portal`);
        } else {
          history.push(`/auth/risk-subscription`);
        }
      }
    }
  };
  const validateTransactionSubscription = () => {
    const status = sessionStorage.getItem('status');
    const role = sessionStorage.getItem('role');
    sessionStorage.setItem('module', 'TRANSACTION');
    if (status !== 'registered' && role == 'role-prospect-user') {
          history.push(`/auth/customer-registration`);
        } else history.push(`/auth/portal-dashboard`);
  }
  const openModule = (type) => {
    // window.open(URL);
    switch (type) {
      case 'RISKS': 
        ValidateRiskSubscription();
        break;
      case 'TRANSACTION': 
        validateTransactionSubscription();
        break;
    }
    // console.log(props);
    // history.push(URL);
  };
  const getModuleList = () => {
    return (
      moduleList &&
      moduleList.map((module, index) => 
            <div
              key={index}
              style={{
                margin: 5,
                width: 400,
                padding: 20,
                display: "inline-block",
                textAlign: "center",
                backgroundColor: "#E0E0E0",
                // fontSize: "xx-large",
              }}
            >
              <div>
                <img style={{height: 100}} src={module.imageName} />
              </div>
              <div>
                {" "}
                <div
                  style={{
                    fontWeight: 500,
                    lineHeight: "1.8em",
                    fontSize: "1.8em",
                  }}
                >
                  <span>{module.nameHeading}</span>
                </div>{" "}
              </div>

              <div style={{ marginBottom: 20 }}>
                <span>{module.namesubtitle}</span>
              </div>

              <Button
                className={classes.buttonstyle}
                // classes="overbutton buttonstyle "
                // color="secondary"
                // className="bg-gradient-theme-left border-0"
                onClick={() => openModule(module.type)}
              >
                {module.name}
              </Button>
            </div>
      )
    );
  };
  return (
    <div>
      <GridContainer justify="center">
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 200, margin: 9 }}>
              Welcome <span style={{ fontWeight: "bold" }}>{userInfo.firstName + " " + userInfo.lastName}</span> to
              FXGUARD
            </div>
          </GridItem>
        </GridContainer>
        {/* <hr></hr> */}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
            {getModuleList()}

            {/* <Link to="dashboard" target="_blank" rel="noopener noreferrer" >
        <Button
            style={{ margin: "5px" }}
            size="xsmall"
            color="info"
            className="bg-gradient-theme-left border-0"
          >
            IFL Admin
          </Button>
          </Link>
          <Button
            style={{ margin: "5px" }}
            size="xsmall"
            color="info"
            className="bg-gradient-theme-left border-0"
            onClick={() => openLMS()}
          >
            IFL LMS
          </Button> */}
          </GridItem>
          <NoticeModal
            noticeModal={noticeModal}
            noticeModalHeader={noticeModalHeaderMsg}
            noticeModalErrMsg={noticeModalErrMsg}
            closeModal={closeNoticeModal}
          />
        </GridContainer>
      </GridContainer>
    </div>
  );
}
