import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import SettingsIcon from "@material-ui/icons/Settings";
import ReactSpeedometer from "react-d3-speedometer";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";

import Button from "components/CustomButtons/Button.jsx";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

import { formatMoney, parseCurrency } from "../../../utils/Utils";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";

import SettingsDialog from "./RiskAlert/SettingsDialog";
import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// core components

import {
  cardTitle,
  roseColor,
  successColor,
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
const style = theme => ({
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
    // , textAlign: "center"
  },
  question: {
    marginTop: "35px",
    fontSize: "20px"
  },
  options: {
    marginTop: "25px"
  },
  footer: {
    padding: "20px 15px 0px 15px"
  },
  subTitle: {
    float: "left",
    paddingTop: 30
  },
  center: {
    textAlign: "center "
  },
  boxInput: {
    border: "1px solid #757575",
    padding: 5
  },
  groupHeader: {
    textAlign: "left",
    fontSize: 30,
    marginTop: 0
  },
  featureTitleHeader: {
    //height: 35,
    color: "#3c4858",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold"
    // textAlign: "center"
    //marginTop: 0
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "5px 25px"
  },
  currencyHeading: {
    marginTop: 25, 
    fontSize: 'x-small'
  },
  circleTooltiptext: {
    visibility: "hidden",
    width: "auto",
    backgroundColor: "#555",
    color: "#fff",
    textAlign: "center",
    borderRadius: "6px",
    padding: "5px ",
    position: "absolute",
    zIndex: "1",
    top: "125%",
    left: "50%",
    opacity: "0",
    transition: "opacity 0.3s"
  },
  iconButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: "#53ac57",
    float: "right"
  },
  info: {
    display: "inline-block",
    verticalAlign: "super",
    fontSize: 14,
    marginRight: 5
  },
  tooltipCalculator: {
    padding: "10px 15px",
    minWidth: "200px",
    color: whiteColor,
    lineHeight: "1.7em",
    background: "rgba(" + hexToRgb(grayColor[6]) + ",0.9)",
    border: "none",
    borderRadius: "3px",
    opacity: "1!important",
    boxShadow:
      "0 8px 10px 1px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 3px 14px 2px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 5px 5px -3px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
    maxWidth: "400px",
    textAlign: "center",
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "400",
    textShadow: "none",
    textTransform: "none",
    letterSpacing: "normal",
    wordBreak: "normal",
    wordSpacing: "normal",
    wordWrap: "normal",
    whiteSpace: "normal",
    lineBreak: "auto"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
});

class RiskAlert extends React.Component {
  error = {
    // profitOtherNameErrorMsg: {
    //   required: "Specify Name of Profit"
    // },
  };

  constructor(props) {
    super(props);
    this.state = {
      callInProgress: false,
      actualRiskValue: 0,
      riskAlertPercentage: 0,
      minRiskAmount: 0,
      maxRiskAmount: 100,
      nonRiskAmount: 0,
      lowRiskAmount: 0,
      mediumRiskAmount: 0,
      highRiskAmount: 0,
      unbearableRiskAmount: 0,
      showSpeedometer: false,
      showSettingsDialog: false,
      isChanged: false,
      thresoldRiskAmount: "",
      emailIDs: "",
      sendEmail: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  componentDidMount() {
    if (this.props.riskRadarData) {
      this.getRiskAlertData(this.props.riskRadarData);
    }
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.isChanged !== newProps.isChanged && newProps.riskRadarData) {
      this.getRiskAlertData(newProps.riskRadarData);
    }
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  getRiskAlertData = apiData => {
    // console.log('getRiskAlertData', apiData)
    let minRiskValue = 0,
      maxRiskValue = 0,
      actualRiskValue = 0;

    // Get min risk value
    minRiskValue = this.getRiskValue(apiData, 0);
    // Get max risk value
    maxRiskValue = this.getRiskValue(apiData, 100);
    // Get actual risk value
    actualRiskValue = this.getRiskValue(apiData, null);

    // console.log('getRiskAlertData', minRiskValue)
    // console.log('getRiskAlertData', maxRiskValue)
    // console.log('getRiskAlertData', actualRiskValue)
    // Calculate percentage
    // const riskPercentage =
    //   (actualRiskValue - minRiskValue) / (maxRiskValue - minRiskValue);
    //   console.log('getriskalertvalue', riskPercentage)

    this.setState(
      {
        nonRiskAmount: Math.ceil(maxRiskValue - actualRiskValue),
        minRiskAmount: Math.ceil(minRiskValue),
        maxRiskAmount: Math.ceil(maxRiskValue),
        actualRiskValue: actualRiskValue
      },
      () => {
        this.getRiskAlertAPIData(minRiskValue, maxRiskValue);
      }
    );
  };

  getRiskAlertAPIData = async (minRiskValue, maxRiskValue) => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url: endpoint.RISK_ALERT_GET,
      authToken: sessionStorage.getItem('token')
    });
    // console.log("RISK ALERT DATA - ", res.data);
    if (res.data.errorCode && res.data.errorCode === 404) {
      this.setDefaultData(minRiskValue, maxRiskValue);

      return;
    } else if (res.data.errorCode) {
      this.setDefaultData(minRiskValue, maxRiskValue);
      return;
    } else {
      let updatedMaxRiskValue = maxRiskValue;
      if (res.data.highRiskAmount > maxRiskValue) {
        updatedMaxRiskValue =
          res.data.highRiskAmount +
          (res.data.highRiskAmount - res.data.mediumRiskAmount);
      } else if (res.data.highRiskAmount < maxRiskValue/2) {
        updatedMaxRiskValue =
          res.data.highRiskAmount +
          (res.data.highRiskAmount - res.data.mediumRiskAmount);
      }

      this.setState({
        maxRiskAmount: updatedMaxRiskValue,
        lowRiskAmount: res.data.lowRiskAmount,
        mediumRiskAmount: res.data.mediumRiskAmount,
        highRiskAmount: res.data.highRiskAmount,
        thresoldRiskAmount: res.data.thresholdAmount,
        emailIDs: res.data.email,
        sendEmail: res.data.enabled,
        callInProgress: false,
        showSpeedometer: true,
        isChanged: !this.state.isChanged
      });
    }
  };

  setDefaultData = (minRiskValue, maxRiskValue) => {
    let interval = (maxRiskValue - minRiskValue) / 4;
    if (interval === 0) interval = 1000000;
    this.setState({
      lowRiskAmount: Math.ceil(interval * 1),
      mediumRiskAmount: Math.ceil(interval * 2),
      highRiskAmount: Math.ceil(interval * 3),
      // unbearableRiskAmount: Math.ceil((interval * 4)),

      callInProgress: false,
      showSpeedometer: true,
      isChanged: !this.state.isChanged
    });
  };

  getRiskValue = (apiData, hedgingPercentage) => {
    const useActualHedging = hedgingPercentage === null;
    return useActualHedging
      ? apiData.totalRiskImpact
      : (apiData.totalRiskBeforeHedging * +hedgingPercentage) / 100;

    // let riskAmount = 0;
    // apiData.risks &&
    //   apiData.risks.forEach(risk => {
    //     const unhedgeAmount = useActualHedging
    //       ? risk.amount - risk.hedgedAmount
    //       : risk.amount - (risk.amount * hedgingPercentage) / 100;

    //     riskAmount = riskAmount + (unhedgeAmount * +hedgingPercentage) / 100;
    //   });
    // return riskAmount;
  };

  // getHedgeUnHedgeAmount = (
  //   currencyDetails,
  //   hedgingPercentage,
  //   senstivityPercentage
  // ) => {
  //   let todayDate = new Date().setHours(0, 0, 0, 0);
  //   let convertedAmount = 0;
  //   currencyDetails.forEach(record => {
  //     // if future date
  //     if (!record.date || todayDate <= new Date(record.date)) {
  //       convertedAmount = convertedAmount + record.convertedAmount;
  //     }
  //   });
  //   convertedAmount = (convertedAmount * senstivityPercentage) / 100;
  //   let hedgingAmount = (convertedAmount * +hedgingPercentage) / 100;

  //   return {
  //     unhedgeAmount: convertedAmount - hedgingAmount,
  //     hedgeAmount: hedgingAmount
  //   };
  // };

  toggleSettingsDialog = action => {
    this.setState({
      showSettingsDialog: action
    });
  };
  setRiskAlertData = async (data) => {
    // data = { ...data, customerId: sessionStorage.getItem('customerId') }
    // this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_ALERT_SAVE,
      data: data,
      authToken: sessionStorage.getItem('token')
    });
    this.setState({ callInProgress: false });
      if (res.data.errorCode && res.data.errorCode === 403) {
        return;
      } else if (res.data.errorCode) {
        // this.setState({
        //   noticeModal: true,
        //   noticeModalHeader: "Error",
        //   noticeModalErrMsg: res.data.userDesc
        // });
        return;
      } else {
      }
  };

  onConfirmClick = async (
    lowRiskAmount,
    mediumRiskAmount,
    highRiskAmount,
    thresoldRiskAmount,
    emailIDs,
    sendEmail

    // unbearableRiskAmount
  ) => {
    const data = {
      lowRiskAmount: parseCurrency(lowRiskAmount),
      mediumRiskAmount: parseCurrency(mediumRiskAmount),
      highRiskAmount: parseCurrency(highRiskAmount),
      thresholdAmount: sendEmail ? parseCurrency(thresoldRiskAmount) : 0,
      email: emailIDs,
      enabled: sendEmail
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_ALERT_SAVE,
      data: data,
      authToken: sessionStorage.getItem('token')
    });
    this.setState({ callInProgress: false });
      if (res.data.errorCode && res.data.errorCode === 403) {
        return;
      } else if (res.data.errorCode) {
        // this.setState({
        //   noticeModal: true,
        //   noticeModalHeader: "Error",
        //   noticeModalErrMsg: res.data.userDesc
        // });
        return;
      } else {
        let updatedMaxRiskValue = this.state.maxRiskAmount;
        if (parseCurrency(highRiskAmount) > this.state.maxRiskAmount) {
          updatedMaxRiskValue =
            parseInt(parseCurrency(highRiskAmount)) +
            (parseInt(parseCurrency(highRiskAmount)) -
              parseInt(parseCurrency(mediumRiskAmount)));
        } else if (
          parseCurrency(highRiskAmount) <
          this.state.maxRiskAmount / 2
        ) {
          updatedMaxRiskValue =
            parseInt(parseCurrency(highRiskAmount)) +
            (parseInt(parseCurrency(highRiskAmount)) -
              parseInt(parseCurrency(mediumRiskAmount)));
        }
        this.setState({
          maxRiskAmount: updatedMaxRiskValue,
          lowRiskAmount: parseCurrency(lowRiskAmount),
          mediumRiskAmount: parseCurrency(mediumRiskAmount),
          highRiskAmount: parseCurrency(highRiskAmount),
          showSettingsDialog: false,
          thresoldRiskAmount,
          emailIDs,
          sendEmail,
          noticeModal: true,
          noticeModalHeader: "INFO",
          noticeModalErrMsg: "New Settings are in place."
        });
      }
  };

  render() {
    const { classes, riskRadarData } = this.props;
    const {
      minRiskAmount,
      maxRiskAmount,
      lowRiskAmount,
      mediumRiskAmount,
      highRiskAmount,
      unbearableRiskAmount,
      nonRiskAmount,
      showSpeedometer,
      showSettingsDialog,
      isChanged,
      thresoldRiskAmount,
      emailIDs,
      sendEmail,
      actualRiskValue
    } = this.state;

    const ratioLow = ((lowRiskAmount - minRiskAmount) * 100) / maxRiskAmount;
    const ratioMedium =
      ((mediumRiskAmount - lowRiskAmount) * 100) / maxRiskAmount;
    const ratioHigh =
      ((highRiskAmount - mediumRiskAmount) * 100) / maxRiskAmount;
    const ratioCritical =
      ((maxRiskAmount - highRiskAmount) * 100) / maxRiskAmount;

    return (
      <div className={classes.container}>
        {riskRadarData&&riskRadarData.risks&&riskRadarData.risks.length > 0 ? (
          <GridContainer justify="center">
             <GridContainer>
                 <GridItem xs={12} sm={12} md={12} lg={12} className={classes.currencyHeading}
                style={{                
                  float: "right",
                  marginRight: 10,
                  textAlign: "right"
                }}>
                    <div>You can edit these settings based on your own</div>
                    <div> risk appetite and can also set risk alert.</div>
                </GridItem>
                </GridContainer>
            <GridContainer>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    className={
                      (classes.groupHeader, classes.featureTitleHeader)
                    }
                  >
                    Risk Alert
                  </GridItem>
             
                </GridContainer>
              </GridItem>   
                  
              <GridItem
                xs={6}
                sm={6}
                md={6}
                lg={6}
                style={{ display: this.props.printComponent ? "none" : "" }}
              >
                {/* <IconButton
                  aria-label="close"
                  className={classes.iconButton}
                  onClick={() => this.toggleSettingsDialog(true)}
                >
                  <SettingsIcon />
                </IconButton> */}
            
                <Button
                  size="lg"
                  style={{
                    backgroundColor: "#50ae55",
                    width: "90px",
                    float: "right",
                    marginRight: 10,
                    textAlign: "right"
                  }}
                  onClick={() => this.toggleSettingsDialog(true)}
                >
                  <SettingsIcon />
                  EDIT
                </Button>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                xs={10}
                sm={10}
                md={7}
                lg={7}
                style={{ textAlign: "center" }}
              >
                {/* <GaugeChart
                      id="risk-alert-gauge-chart1"
                      percent={this.state.riskAlertPercentage}
                      arcPadding={0.02}
                      arcWidth={0.9}
                      textColor="#000"
                    /> */}
                {showSpeedometer && (
                  <div
                    style={{
                      width: "500px",
                      height: "300px"
                    }}
                  >
                    <ReactSpeedometer
                      fluidWidth
                      forceRender
                      minValue={minRiskAmount}
                      maxValue={maxRiskAmount}
                      value={actualRiskValue}
                      //currentValueText={"Risk Alert"+this.props.apiData&&this.props.apiData.functionalCurrency?' in '+this.props.apiData.functionalCurrency:''}
                      currentValueText={
                        formatMoney(actualRiskValue, 0) +
                        " " +
                        this.props.functionalCurrency
                      }
                      customSegmentStops={[
                        minRiskAmount,
                        lowRiskAmount,
                        mediumRiskAmount,
                        highRiskAmount,
                        //unbearableRiskAmount,
                        maxRiskAmount
                      ]}
                      segmentColors={[
                        // "green",
                        "limegreen",
                        "gold",
                        "tomato",
                        "firebrick"
                      ]}
                      customSegmentLabels={[
                        {
                          text: "Low",
                          position: ratioLow < 5 ? "OUTSIDE" : "INSIDE",
                          color: "#555"
                        },
                        {
                          text: "Medium",
                          position:
                            ratioMedium < 5 && ratioLow > 5
                              ? "OUTSIDE"
                              : "INSIDE",
                          color: "#555"
                        },
                        {
                          text: "High",
                          position: ratioHigh < 5 ? "OUTSIDE" : "INSIDE",
                          color: "#ececec"
                        },
                        {
                          text: "Critical",
                          position: ratioCritical < 5 ? "OUTSIDE" : "INSIDE",
                          color: "#ececec"
                        }
                      ]}
                    />
                  </div>
                )}
              </GridItem>
              <GridItem
                xs={this.props.printComponent ? 12 : 5}
                sm={this.props.printComponent ? 12 : 5}
                md={this.props.printComponent ? 12 : 5}
                lg={this.props.printComponent ? 12 : 5}
              >
                {/* <Tooltip
                    id="tooltip-totalSales"
                    title="You can edit these settings based on your own risk appetite and can also set risk alert."
                    placement="top"
                    classes={{ tooltip: classes.tooltipCalculator }}
                    > */}
                <div>
                  <b>Your Current Settings</b>{" "}
                  {/* <InfoOutlined className={classes.info} /> */}
                </div>
                {/* </Tooltip> */}
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer style={{ fontSize: 12 }}>
                    <GridItem xs={3} sm={3} md={3} lg={3}>
                      {"Low Risk"}
                    </GridItem>
                    <GridItem xs={8} sm={8} md={8} lg={8}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: "limegreen",
                          display: "inline-block",
                          marginRight: 10
                        }}
                      />
                      {formatMoney(this.state.minRiskAmount, 0) +
                        " - " +
                        formatMoney(this.state.lowRiskAmount, 0) +
                        " " +
                        this.props.functionalCurrency}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer style={{ fontSize: 12 }}>
                    <GridItem xs={3} sm={3} md={3} lg={3}>
                      {"Medium Risk"}
                    </GridItem>
                    <GridItem xs={8} sm={8} md={8} lg={8}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: "gold",
                          display: "inline-block",
                          marginRight: 10
                        }}
                      />
                      {formatMoney(this.state.lowRiskAmount, 0) +
                        " - " +
                        formatMoney(this.state.mediumRiskAmount, 0) +
                        " " +
                        this.props.functionalCurrency}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer style={{ fontSize: 12 }}>
                    <GridItem xs={3} sm={3} md={3} lg={3}>
                      {"High Risk"}
                    </GridItem>
                    <GridItem xs={8} sm={8} md={8} lg={8}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: "tomato",
                          display: "inline-block",
                          marginRight: 10
                        }}
                      />
                      {formatMoney(this.state.mediumRiskAmount, 0) +
                        " - " +
                        formatMoney(this.state.highRiskAmount, 0) +
                        " " +
                        this.props.functionalCurrency}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer style={{ fontSize: 12 }}>
                    <GridItem xs={3} sm={3} md={3} lg={3}>
                      {"Critical"}
                    </GridItem>
                    <GridItem xs={8} sm={8} md={8} lg={8}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor: "firebrick",
                          display: "inline-block",
                          marginRight: 10
                        }}
                      />

                      {"Greater than " +
                        formatMoney(this.state.highRiskAmount, 0) +
                        " " +
                        this.props.functionalCurrency}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={12} lg={12} className={classes.currencyHeading}>
                    <div>* You can edit these settings based on your own</div>
                    <div> risk appetite and can also set risk alert.</div>
                </GridItem> */}
              </GridItem>
            </GridContainer>
            <SettingsDialog
              lowRiskAmount={lowRiskAmount}
              mediumRiskAmount={mediumRiskAmount}
              highRiskAmount={highRiskAmount}
              unbearableRiskAmount={unbearableRiskAmount}
              maxRiskAmount={maxRiskAmount}
              minRiskAmount={minRiskAmount}
              showSettingsDialog={showSettingsDialog}
              toggleSettingsDialog={this.toggleSettingsDialog}
              isChanged={isChanged}
              onConfirmClick={this.onConfirmClick}
              thresoldRiskAmount={thresoldRiskAmount}
              emailIDs={emailIDs}
              sendEmail={sendEmail}
              functionalCurrency={this.props.functionalCurrency}
            />
          </GridContainer>
        ) : (
          <GridContainer justify="center">
            Provide data in First Tab to see Risk Impact
          </GridContainer>
        )}
        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
            }}
            open={this.state.callInProgress}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle
              id="waiting-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <h4 className={classes.modalTitle}>{"Processing..."}</h4>
            </DialogTitle>
            <DialogContent
              id="waiting-modal-slide-description"
              className={classes.modalBody}
              style={{ textAlign: "center" }}
            >
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}{" "}
        <NoticeModal
          noticeModal={this.state.noticeModal}
          noticeModalHeader={this.state.noticeModalHeader}
          noticeModalErrMsg={this.state.noticeModalErrMsg}
          closeModal={this.closeNoticeModal}
        />
      </div>
    );
  }
}
RiskAlert.propTypes = {
  classes: PropTypes.object.isRequired,
  riskRadarData: PropTypes.object.isRequired,
  functionalCurrency: PropTypes.object.isRequired
};
export default withStyles(style)(RiskAlert);
