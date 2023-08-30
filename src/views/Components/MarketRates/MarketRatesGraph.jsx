import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";
import { Line } from "react-chartjs-2";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CSVLink } from "react-csv";
import { apiHandler } from "api";
import { formatDate } from "../../../utils/Utils";
import { validate } from "../../../utils/Validator";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import Tooltip from "@material-ui/core/Tooltip";

import moment from "moment";

import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";

import addDirectorsStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";
const style = {
  ...addDirectorsStyle,
  downloadButton: {
    color: "rgb(83, 172, 87)",
    position: "absolute",
    top: 8,
    right: 64
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "5px 25px"
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
    minWidth: "100px",
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
  }
};

const DATERANGE = [
  { key: "oneday", text: "One Day" },
  { key: "oneweek", text: "One Week" },
  { key: "onemonth", text: "One Month" },
  { key: "threemonths", text: "Three Months" },
  { key: "sixmonths", text: "Six Months" },
  { key: "oneyear", text: "One Year" },
  { key: "fiveyears", text: "Five Years" },
  { key: "custom", text: "Custom" }
];

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class MarketRatesGraph extends React.Component {
  error = {
    fromDateErrorMsg: {
      required: "From Date is required"
    },
    toDateErrorMsg: {
      required: "To Date is required"
    }
  };
  initialState = {};

  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();

    this.initialState = {
      downloadReportData: [],
      key: 0,
      fromDate: null,
      fromDateState: "",
      fromDatePristine: false,
      fromDateErrorMsg: [],
      toDate: null,
      toDateState: "",
      toDatePristine: false,
      toDateErrorMsg: [],
      cardAnimaton: "cardHidden",
      currencyPair: "",
      selectedDatePeriod: "oneyear",
      graphData: {
        labels: [],
        datasets: [
          {
            label: this.props.graphAttribute
              ? this.props.graphAttribute
              : "close",
            data: [],
            fill: false,
            backgroundColor: "red",
            borderColor: "red",
            lineTension: 0,
            borderWidth: 1,
            pointRadius: 0.5
          }
        ]
      }
    };

    this.state = this.initialState;
  }
  componentDidMount() {
    this.setState({
      currencyPair:
        this.props.selectedObject && this.props.selectedObject.currencyPair
          ? this.props.selectedObject.currencyPair
          : ""
    });
    this.getGraphData(this.props.selectedObject.currencyPair);
  }
  downloadReport = () => {
    this.csvDownloadLink.current.link.click();
  };
  getGraphData = async currencyPair => {
    let fromDate = this.state.fromDate;
    let toDate = this.state.toDate;
    if (this.state.selectedDatePeriod !== "custom") {
      console.log("getGraphData", this.state.selectedDatePeriod);

      let dateRange = this.getDateRange(this.state.selectedDatePeriod);
      console.log("getGraphData", dateRange);
      fromDate = dateRange.fromDate;
      toDate = dateRange.toDate;
    }
    let url = "";
    if (this.state.selectedDatePeriod === "oneday") {
      url =
        "/fx-forrex/exchangeRate/getBars?currency=" +
        currencyPair +
        "&date=" +
        this.getDateString(new Date()) +
        "&startTime=00:10" +
        "&endTime=" +
        moment()
          .subtract(5, "minutes")
          .format("HH:mm") +
        "&tickPrecision=Minutes&tickPeriods=1";
    } else {
      url =
        "/fx-forrex/exchangeRate/historical?currency=" +
        currencyPair +
        "&startDate=" +
        fromDate +
        "&endDate=" +
        toDate;
    }
    if (this.props.setLoading) {
      this.props.setLoading(true);
    }

    const res = await apiHandler({
      url: url,
      authToken: sessionStorage.getItem("token")
    });

    if (this.props.setLoading) {
      this.props.setLoading(false);
    }
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        return;
      }
    } else {
      this.parseData(res.data);
    }
  };
  getGraphWeekData = async (currencyPair, selectedDatePeriod) => {
    let fromDays = selectedDatePeriod === "onemonth" ? 30 : 6;
    let tickPrecision = selectedDatePeriod === "onemonth" ? "Hour" : "Minutes";
    let apiData = [];
    for (let i = -fromDays; i <= 0; i++) {
      let fromDate = this.getDateString(this.getDateAfterXDays(0, 0, i));
      // let toDate=this.getDateString(this.getDateAfterXDays(0, 0, i+1))
      let url =
        "/fx-forrex/exchangeRate/getBars?currency=" +
        currencyPair +
        "&date=" +
        fromDate +
        "&startTime=00:10" +
        "&endTime=23:59" +
        "&tickPrecision=" +
        tickPrecision +
        "&tickPeriods=1";

      if (i === -6) {
        this.props.setLoading(true);
      }

      const res = await apiHandler({
        url: url,
        authToken: sessionStorage.getItem("token")
      });

      if (i === 0) {
        this.props.setLoading(false);
      }
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {
          return;
        }
      } else {
        let response =
          res.data && res.data.exchangeRates ? res.data.exchangeRates : [];
        apiData = [...apiData, ...response];
        console.log("apiresponse", res.data);
        if (i === 0) {
          this.sortRecords([...apiData]);
        }
      }
    }
  };
  sortRecords = apiData => {
    apiData = apiData.filter(x => x.endTime !== null && x.endDate !== null);
    // apiData.sort
    apiData.sort((a, b) => {
      let adate = a.endDate.split("-");

      let bdate = b.endDate.split("-");
      let atime = a.endTime.split(":");
      let btime = b.endTime.split(":");
      //  return  new Date(a['date'])  < new Date(b['date'])
      // console.log('apiresponse sortRecords', new Date(adate[0],adate[1],adate[0],atime[0],atime[2],atime[2]))
      // console.log('apiresponse sortRecords', new Date(adate[0],adate[1],adate[0],atime[0],atime[2],atime[2]).getTime())
      // console.log('apiresponse sortRecords', new Date(adate[0],adate[1],adate[0],atime[0],atime[2],atime[2]).getTime() - new Date(bdate[0],bdate[1],bdate[0],btime[0],btime[2],btime[2]).getTime())
      // console.log('apiresponse sortRecords', new Date(adate[0],adate[1],adate[0],atime[0],atime[2],atime[2]) - new Date(bdate[0],bdate[1],bdate[0],btime[0],btime[2],btime[2]))

      return (
        new Date(
          adate[0],
          adate[1],
          adate[2],
          atime[0],
          atime[1],
          atime[2]
        ).getTime() -
        new Date(
          bdate[0],
          bdate[1],
          bdate[2],
          btime[0],
          btime[1],
          btime[2]
        ).getTime()
      );
    });

    this.parseData({
      exchangeRates: [...apiData]
    });
  };
  parseData = data => {
    console.log("apiresponse parsedata", data);
    let graphAttribute = this.props.graphAttribute
      ? this.props.graphAttribute
      : "close";
    let labels = [],
      points = [],
      downloadReportData = [
        [
          "Date Time",
          graphAttribute.charAt(0).toUpperCase() + graphAttribute.slice(1)
        ]
      ];
    data &&
      data.exchangeRates &&
      data.exchangeRates.forEach((obj, index) => {
        if (obj.endTime !== null && obj.endDate !== null) {
          labels.push(
            this.state.selectedDatePeriod === "oneday"
              ? obj.endTime
              : this.state.selectedDatePeriod === "oneweek" ||
                this.state.selectedDatePeriod === "onemonth"
              ? formatDate(obj.endDate) + " " + obj.endTime
              : formatDate(obj.endDate)
          );
          points.push(obj[graphAttribute]);
          downloadReportData.push([obj.endDate, obj[graphAttribute]]);
        }
      });
    let graphData = this.state.graphData;
    graphData.labels = labels;
    let dataset = graphData.datasets;
    dataset[0].data = points;
    graphData.datasets = dataset;
    console.log(graphData);
    this.setState({
      graphData: graphData,
      key: this.state.key + 1,
      downloadReportData: downloadReportData
    });
  };
  nonSelectedButton = (text, key) => {
    return (
      <span
        style={{
          fontWeight: 500,
          fontSize: 12,
          marginLeft: 30,
          cursor: "pointer"
        }}
        onClick={() => this.toggleSelectedDatePeriod(key)}
      >
        {text}
      </span>
    );
  };

  selectedButton = (text, key) => {
    const { classes } = this.props;

    return (
      <Button
        color="success"
        round
        className={classes.marginRight}
        style={{
          marginLeft: 30
        }}
      >
        {text}
      </Button>
    );
  };
  toggleSelectedDatePeriod = key => {
    if (key !== this.state.selectedDatePeriod) {
      this.setState(
        {
          selectedDatePeriod: key
        },
        () => {
          if (key !== "custom") {
            this.getGraphData(this.props.selectedObject.currencyPair);
            // } else if (key === "oneweek" || key === "onemonth") {
            //   this.getGraphWeekData(this.props.selectedObject.currencyPair, key);
          } else {
            this.setState({
              fromDate: null,
              fromDateState: "",
              fromDatePristine: false,
              fromDateErrorMsg: [],
              toDate: null,
              toDateState: "",
              toDatePristine: false,
              toDateErrorMsg: []
            });
          }
        }
      );
    }
  };
  getDateRange = key => {
    let currentDate = new Date();
    if (key === "oneday") {
      return {
        fromDate: this.getDateString(this.getDateAfterXDays(0, 0, -1)),
        toDate: this.getDateString(new Date())
      };
    } else if (key === "oneweek") {
      return {
        fromDate: this.getDateString(this.getDateAfterXDays(0, 0, -7)),
        toDate: this.getDateString(new Date())
      };
    } else if (key === "onemonth") {
      return {
        fromDate: this.getDateString(this.getDateAfterXDays(0, -1, 0)),
        toDate: this.getDateString(new Date())
      };
    } else if (key === "threemonths") {
      return {
        fromDate: this.getDateString(this.getDateAfterXDays(0, -3, 0)),
        toDate: this.getDateString(new Date())
      };
    } else if (key === "sixmonths") {
      return {
        fromDate: this.getDateString(this.getDateAfterXDays(0, -6, 0)),
        toDate: this.getDateString(new Date())
      };
    } else if (key === "oneyear") {
      console.log("oneyear", this.getDateAfterXDays(-1, 0, 0));
      console.log(
        "oneyear",
        this.getDateString(this.getDateAfterXDays(-1, 0, 0))
      );
      return {
        fromDate: this.getDateString(this.getDateAfterXDays(-1, 0, 0)),
        toDate: this.getDateString(new Date())
      };
    } else if (key === "fiveyears") {
      return {
        fromDate: this.getDateString(this.getDateAfterXDays(-5, 0, 0)),
        toDate: this.getDateString(new Date())
      };
    } else if (key === "lastworkingday") {
      let date = this.getLastBusinessDay();
      return {
        fromDate: this.getDateString(date.businessDay),
        toDate: this.getDateString(date.nextDay)
      };
    }
  };
  getLastBusinessDay = () => {
    let date = new Date();

    while (!this.isBusinessDay(date)) {
      date.setDate(date.getDate() - 1);
    }
    return {
      businessDay: date,
      nextDay: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    };
  };
  isBusinessDay = date => {
    var day = date.getDay();
    if (day == 0 || day == 6) {
      return false;
    }
    return true;
  };
  getDateString = date => {
    console.log("datestring", date);
    // return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    return moment(date).format("YYYY-MM-DD");
  };
  getDateAfterXDays = (y, m, d) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    console.log("getDateAfterXDays", year, month, day);
    console.log("getDateAfterXDays", year + y, month + m, day + d);

    var c = new Date(year + y, month + m, day + d);
    // console.log('getDateAfterXYears',this.state.dayOfYear)

    return c;
  };
  handleDateChange = (name, date) => {
    // console.log(moment(date).format("DD-MM-YYYY"));
    this.setState(
      validate(
        moment(date).format("YYYY-MM-DD"),
        name,
        this.state,
        [],
        this.error
      ),
      () => {
        this.callAPIonDateChange();
      }
    );
  };
  callAPIonDateChange = () => {
    if (this.isValidated()) {
      this.getGraphData(this.props.selectedObject.currencyPair);
    }
  };
  isValidated = () => {
    if (
      this.state.fromDateState === "success" &&
      this.state.toDateState === "success"
    ) {
      return true;
    } else {
      if (this.state.fromDateState !== "success") {
        this.setState({ fromDateState: "error" });
      }
      if (this.state.toDateState !== "success") {
        this.setState({ toDateState: "error" });
      }

      return false;
    }
  };
  render() {
    console.log("checkcheck", this.state.selectedDatePeriod === "oneday");
    const { classes } = this.props;
    return (
      <div className={cx(classes.container)}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot
          }}
          maxWidth="lg"
          fullWidth
          open
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.props.handleClose("showGraphModal")}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
          >
            <IconButton
              aria-label="download report"
              onClick={() => this.downloadReport()}
              className={classes.downloadButton}
              style={{ color: "#53ac57" }}
            >
              <Tooltip
                id="tooltip-totalSales"
                title="Download"
                placement="top"
                classes={{ tooltip: classes.tooltipCalculator }}
              >
                <CloudDownloadIcon />
              </Tooltip>
              <CSVLink
                data={this.state.downloadReportData}
                filename={
                  "MarketRates_" +
                  this.state.currencyPair +
                  "_" +
                  this.state.selectedDatePeriod +
                  formatDate(Date.now()) +
                  ".csv"
                }
                className="hidden"
                ref={this.csvDownloadLink}
                target="_blank"
              />
            </IconButton>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.props.handleClose("showGraphModal")}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>
              {"Market Rates " + this.state.currencyPair}
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <GridContainer justify="center">
              {/* <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                      <GridItem xs={1} sm={1} md={1} lg={1} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='oneday' ? (
                          this.selectedButton('1 Day', 'oneday')
                        ) : (
                          this.nonSelectedButton('1 Day', 'oneday')
                        )}
                      </GridItem>
                      <GridItem xs={1} sm={1} md={1} lg={1} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='oneweek' ? (
                          this.selectedButton('1 Week', 'oneweek')
                          ) : (
                            this.nonSelectedButton('1 Week', 'oneweek')
                        )
                        }
                      </GridItem>
                      <GridItem xs={2} sm={2} md={2} lg={2} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='onemonth' ? (
                          this.selectedButton('1 Month', 'onemonth')
                          ) : (
                            this.nonSelectedButton('1 Month', 'onemonth')
                        )}
                      </GridItem>
                      <GridItem xs={2} sm={2} md={2} lg={2} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='threemonths' ? (
                          this.selectedButton('3 Months', 'threemonths')
                          ) : (
                            this.nonSelectedButton('3 Months', 'threemonths')
                        )}
                      </GridItem>
                      <GridItem xs={2} sm={2} md={2} lg={2} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='sixmonths' ? (
                          this.selectedButton('6 Months', 'sixmonths')
                          ) : (
                            this.nonSelectedButton('6 Months', 'sixmonths')
                        )}
                      </GridItem>
                      <GridItem xs={2} sm={2} md={2} lg={2} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='oneyear' ? (
                          this.selectedButton('1 Year', 'oneyear')
                          ) : (
                            this.nonSelectedButton('1 Year', 'oneyear')
                        )}
                      </GridItem>
                      <GridItem xs={1} sm={1} md={1} lg={1} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='fiveyear' ? (
                          this.selectedButton('5 Years', 'fiveyear')
                          ) : (
                            this.nonSelectedButton('5 Years', 'fiveyear')
                        )}
                      </GridItem>
                      <GridItem xs={1} sm={1} md={1} lg={1} style={{alignSelf:'center'}}>
                        {this.state.selectedDatePeriod==='custom' ? (
                          this.selectedButton('Custom', 'custom')
                          ) : (
                            this.nonSelectedButton('Custom', 'custom')
                        )}
                      </GridItem>
                      
                    </GridContainer>
                    
                  </GridItem>
                  */}
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ alignSelf: "center" }}
              >
                <GridContainer>
                  <GridItem
                    xs={8}
                    sm={8}
                    md={8}
                    lg={8}
                    style={{ alignSelf: "center" }}
                  >
                    {DATERANGE.map((obj, index) => {
                      console.log("daterange", obj);
                      console.log("daterange", this.state.selectedDatePeriod);
                      return this.state.selectedDatePeriod !== obj.key ? (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            marginRight: 25,
                            cursor: "pointer"
                          }}
                          onClick={() => this.toggleSelectedDatePeriod(obj.key)}
                        >
                          {obj.text}
                        </span>
                      ) : (
                        <Button
                          style={{
                            textAlign: "center",
                            backgroundColor: "#1D64B0"
                          }}
                          size="sm"
                          className={classes.marginRight}
                        >
                          {obj.text}
                        </Button>
                      );
                    })}
                  </GridItem>

                  <GridItem xs={2} sm={2} md={2} lg={2}>
                    {this.state.selectedDatePeriod === "custom" && (
                      <CustomDateSelector
                        success={this.state.fromDateState === "success"}
                        error={this.state.fromDateState === "error"}
                        helpText={
                          this.state.fromDateState === "error" &&
                          this.state.fromDateErrorMsg
                        }
                        id="rr_date"
                        inputProps={{
                          format: "yyyy-MM-dd",
                          label: "From Date",
                          value: this.state.fromDate,
                          onChange: date =>
                            this.handleDateChange("fromDate", date),
                          keyboardbuttonprops: {
                            "aria-label": "change date"
                          }
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: cx(
                            classes.customDateControlClasses,
                            classes.customFormControlClasses
                          )
                        }}
                      />
                    )}
                  </GridItem>
                  <GridItem xs={2} sm={2} md={2} lg={2}>
                    {this.state.selectedDatePeriod === "custom" && (
                      <CustomDateSelector
                        success={this.state.toDateState === "success"}
                        error={this.state.toDateState === "error"}
                        helpText={
                          this.state.toDateState === "error" &&
                          this.state.toDateErrorMsg
                        }
                        id="rr_date"
                        inputProps={{
                          format: "yyyy-MM-dd",
                          label: "To Date",
                          value: this.state.toDate,
                          onChange: date =>
                            this.handleDateChange("toDate", date),
                          keyboardbuttonprops: {
                            "aria-label": "change date"
                          }
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: cx(
                            classes.customDateControlClasses,
                            classes.customFormControlClasses
                          )
                        }}
                      />
                    )}
                  </GridItem>

                  {/* <span
                      style={{ fontSize: 12, fontWeight: 500, marginRight: 25 }}
                    >
                      1 DAY
                    </span>
                    <Button
                      style={{
                        textAlign: "center",
                        backgroundColor: "#1D64B0"
                      }}
                      size="sm"
                      className={classes.marginRight}
                    >
                      1 WEEK
                    </Button>
                    <span
                      style={{ fontSize: 12, fontWeight: 500, marginLeft: 25 }}
                    >
                      1 MONTH
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 500, marginLeft: 25 }}
                    >
                      1 YEAR
                    </span>
                  */}
                </GridContainer>
              </GridItem>
              {/* <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                    <GridItem xs={8} sm={8} md={8} lg={8}>
                      </GridItem>
                      {this.state.selectedDatePeriod==='custom' &&
          <>
                      <GridItem xs={2} sm={2} md={2} lg={2}>
                      <CustomDateSelector
                                    success={
                                      this.state.fromDateState === "success"
                                    }
                                    error={this.state.fromDateState === "error"}
                                    helpText={
                                      this.state.fromDateState === "error" &&
                                      this.state.fromDateErrorMsg
                                    }
                                    id="rr_date"
                                    inputProps={{
                                      format: "yyyy-MM-dd",
                                      label: "From Date",
                                      value: this.state.fromDate,
                                      onChange: date =>
                                        this.handleDateChange("fromDate", date),
                                      keyboardbuttonprops: {
                                        "aria-label": "change date"
                                      }
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className: cx(
                                        classes.customDateControlClasses,
                                        classes.customFormControlClasses
                                      )
                                    }}
                                  />
</GridItem>
<GridItem xs={2} sm={2} md={2} lg={2}>
                      <CustomDateSelector
                                    success={
                                      this.state.toDateState === "success"
                                    }
                                    error={this.state.toDateState === "error"}
                                    helpText={
                                      this.state.toDateState === "error" &&
                                      this.state.toDateErrorMsg
                                    }
                                    id="rr_date"
                                    inputProps={{
                                      format: "yyyy-MM-dd",
                                      label: "To Date",
                                      value: this.state.toDate,
                                      onChange: date =>
                                        this.handleDateChange("toDate", date),
                                      keyboardbuttonprops: {
                                        "aria-label": "change date"
                                      }
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className: cx(
                                        classes.customDateControlClasses,
                                        classes.customFormControlClasses
                                      )
                                    }}
                                  />
</GridItem>
</>
  }
                      </GridContainer>
                      </GridItem> */}
              <GridItem xs={12} sm={12} md={6} lg={12}>
                <Line
                  data={this.state.graphData}
                  key={this.state.key}
                  options={{
                    legend: {
                      display: false
                    },
                    tooltips: {
                      callbacks: {
                        label: (tooltipItems, data) => {
                          return "Rate : " + tooltipItems.value;
                        }
                      }
                    },
                    scales: {
                      xAxes: [
                        {
                          // type: "timeseries",
                          autoSkip: true,
                          maxTicksLimit: 20
                          // ticks: {
                          //   userCallback: (item, index) => {
                          //     return "";
                          //   }
                          // }
                        }
                      ],
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: false
                          }
                        }
                      ]
                    },
                    elements: {
                      point: {
                        radius: 0
                      }
                    }
                  }}
                  width={"80%"}
                  height={"30vh"}
                />
              </GridItem>
              <GridItem
                xs={11}
                sm={11}
                md={11}
                lg={11}
                style={{ textAlign: "center" }}
              >
                <FormLabel className={cx(classes.graphFooter)}>
                  {"*Date and Time are in Universal Time Zone"}
                </FormLabel>
              </GridItem>
              {/* <GridItem xs={12} sm={12} md={6} lg={12}>
                <Button
                  style={{
                    textAlign: "center",
                    backgroundColor: "#1D64B0",
                    cursor: "pointer"
                  }}
                  size="sm"
                  className={classes.marginRight}
                  onClick={() =>
                    this.toggleSelectedDatePeriod("lastworkingday")
                  }
                >
                  Last Working Day
                </Button>
                );
              </GridItem> */}
            </GridContainer>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

MarketRatesGraph.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(style)(MarketRatesGraph));
