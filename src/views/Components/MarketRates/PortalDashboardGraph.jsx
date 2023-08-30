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
import "chartjs-plugin-streaming";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CSVLink } from "react-csv";

import { formatMoney, formatDate, parseDate } from "../../../utils/Utils";
import { validate } from "../../../utils/Validator";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import moment from "moment";

import addDirectorsStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";
const REFRESHTIME = 5 * 1000; // 5 Seconds

const GRAPH_BUTTONS = [
  { key: "current", text: "Live" },
  { key: "today", text: "Today" },
  { key: "lastworkingday", text: "Last Business Day" }
];

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

class PortalDashboardGraph extends React.Component {
  initialState = {};

  constructor(props) {
    super(props);

    this.initialState = {
      key: 0,
      fromDate: null,
      toDate: null,
      currencyPair: "",
      selectedDatePeriod: "current",
      newGraphData: [],
      buttonText: "Last Working Day",
      graphData: {
        labels: [],
        datasets: [
          {
            label: "Close",
            data: [],
            fill: false,
            backgroundColor: "red",
            borderColor: "red",
            lineTension: 0,
            borderWidth: 1,
            pointRadius: 0.5
          }
        ]
      },
      selectedDate: ""
    };

    this.state = this.initialState;
  }
  componentDidMount() {
    this.setState({
      currencyPair: this.props.baseCurrency + this.props.quoteCurrency
    });
    this.getGraphData(this.props.baseCurrency, this.props.quoteCurrency);
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.baseCurrency !== newProps.baseCurrency ||
      this.props.quoteCurrency !== newProps.quoteCurrency
    ) {
      if (this.state.selectedDatePeriod === "current") {
        this.getGraphData(newProps.baseCurrency, newProps.quoteCurrency);
      } else {
        this.getLastWorkDayData(
          newProps.baseCurrency + newProps.quoteCurrency,
          this.state.selectedDatePeriod
        );
      }
      // this.getGraphData(newProps.baseCurrency + newProps.quoteCurrency);
    }
  }
  componentWillUnmount() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }
  getGraphData = async (baseCurrency, quoteCurrency) => {
    // this.setState({
    //   currencyPair: currencyPair,
    //   newGraphData: [],
    //   key: this.state.key + 1
    // });

    // COMMENTED TO SHOW 15 MIN OLD DATA BEFORE LIVE SESSION

    if (baseCurrency !== "" && quoteCurrency !== "") {
      let currencyPair = baseCurrency + quoteCurrency;

      const url =
        endpoint.MARKET_EXCHANGE_RATE_BARS +
        "?currency=" +
        currencyPair +
        "&date=" +
        moment()
          .utc()
          .format("YYYY-MM-DD") +
        "&startTime=" +
        moment()
          .utc()
          .subtract(20, "minutes")
          .format("HH:mm") +
        "&endTime=" +
        moment()
          .utc()
          .subtract(0, "minutes")
          .format("HH:mm") +
        "&tickPrecision=Minutes&tickPeriods=1";

      const res = await apiHandler({
        url: url,
        authToken: sessionStorage.getItem("token")
      });
      if (this.props.setLoading) {
        this.props.setLoading(false);
      }
      if (res.data.errorCode && res.data.errorCode === 403) {
        return;
      } else if (res.data.errorCode) {
        return;
      } else {
        this.parseData(currencyPair, res.data);
      }
    }
  };
  getLastBusinessDay = () => {
    let date = new Date();
    date.setDate(date.getDate() - 1);
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
  parseData = (currencyPair, data) => {
    let graphData = [];
    data &&
      data.exchangeRates &&
      data.exchangeRates.forEach((obj, index) => {
        let utcDate = new Date(obj.endDate + " " + obj.endTime);
        let newDate = new Date(
          utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000
        );

        // let localTime=moment(utcDate).toDate()
        // localTime=moment(localTime).format('YYYY-MM-DD HH:mm:ss')
        graphData.push({
          x: newDate, //localTime, //new Date(obj.endDate + " " + obj.endTime), //obj.endTime,
          y: obj.close
        });
      });
    this.setState({
      currencyPair: currencyPair,
      newGraphData: graphData,
      key: this.state.key + 1
    });
  };
  getLastWorkDayData = async (currencyPair, selectedDatePeriod) => {
    let date =
      selectedDatePeriod === "lastworkingday"
        ? this.getLastBusinessDay().businessDay
        : new Date();
    let endTime =
      selectedDatePeriod === "lastworkingday"
        ? "23:59"
        : moment()
            .subtract(0, "minutes")
            .format("HH:mm");
    this.setState({
      selectedDate: date
    });
    const url =
      endpoint.MARKET_EXCHANGE_RATE_BARS +
      "?currency=" +
      currencyPair +
      "&date=" +
      this.getDateString(date) +
      "&startTime=00:10" +
      "&endTime=" +
      endTime +
      "&tickPrecision=Minutes&tickPeriods=1";
    const res = await apiHandler({
      url: url,
      authToken: sessionStorage.getItem("token")
    });
    if (this.props.setLoading) {
      this.props.setLoading(false);
    }
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      return;
    } else {
      this.parseLastWorkDayData(currencyPair, res.data);
    }
  };
  parseLastWorkDayData = (currencyPair, data) => {
    let labels = [],
      points = [];
    data &&
      data.exchangeRates &&
      data.exchangeRates.forEach((obj, index) => {
        labels.push(obj.endTime);
        points.push(obj.close);
      });
    let graphData = this.state.graphData;
    graphData.labels = labels;
    let dataset = graphData.datasets;
    dataset[0].data = points;
    graphData.datasets = dataset;
    this.setState({
      currencyPair: currencyPair,
      graphData: graphData,
      key: this.state.key + 1
    });
  };
  getDateRange = key => {
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
    }
  };
  getDateString = date => {
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
  getliveExchangeRateData = async dataset => {
    if (!this.state.currencyPair) return;
  // console.log(dataset.data[dataset.data.length-1]);
    const res = await apiHandler({
      url:
        endpoint.MARKET_EXCHANGE_RATE_LIVE +
        "?currency=" +
        this.state.currencyPair,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 403 || res.data.errorCode === 500) return;
      // else if (res.data.errorCode === 401) {
      //   console.log("Unauthorized Access");
      //   this.props.history.push("/home/logout");
      // }
      return;
    } else {
      let exchangeRates =
        res.data && res.data.exchangeRates && res.data.exchangeRates.length > 0
          ? res.data.exchangeRates[0]
          : {mid: dataset.data[dataset.data.length-1]};
      // console.log("exchangeRates - ", exchangeRates);

      if (exchangeRates) {
        let newGraphData = this.state.newGraphData;

        newGraphData.push({
          x: Date.now(), //new Date(exchangeRates.date + " " + exchangeRates.time + " UTC"),
          y: exchangeRates.mid
        });

        this.setState({
          newGraphData
        });
      }

      // this.setState(
      //   {
      //     apiLiveExchangeRatesData: exchangeRates
      //   },
      //   () => {
      //     this.getLatestHistoricData(
      //       exchangeRates,
      //       currencyPairs,
      //       loading
      //     );
      //   }
      // );
    }
  };
  onRefreshSpotData = chart => {
    const _this = this;
    // if (_this.state.selectedDatePeriod === "current") {
    chart.data.datasets.forEach(function(dataset) {
      if (_this.state.currencyPair !== "") {
        _this.getliveExchangeRateData(dataset);
      } else {
        // console.log('No Currency Pair - ', _this.state.newGraphData);
        if (_this.state.newGraphData.length === 0) {
          let newGraphData = [
            {
              x: Date.now(),
              y: 0
            }
          ];
          _this.setState({
            newGraphData
          });
        } else {
          let newGraphData = _this.state.newGraphData;
          newGraphData.push(newGraphData[newGraphData.length - 1]);
          _this.setState({
            newGraphData
          });
        }
      }

      // dataset.data.push({
      //   x: Date.now(),
      //   y: Math.random()
      // });
    });
    //}
  };
  toggleGraph = selectedDatePeriod => {
    this.setState(
      {
        selectedDatePeriod: selectedDatePeriod
      },
      () => {
        if (selectedDatePeriod === "current") {
          this.getGraphData(this.props.baseCurrency, this.props.quoteCurrency);
        } else {
          this.getLastWorkDayData(
            this.props.baseCurrency + this.props.quoteCurrency,
            selectedDatePeriod
          );
        }
      }
    );
  };
  render() {
    const { classes } = this.props;
    const { newGraphData } = this.state;
    const _this = this;
    return (
      <>
        {this.state.selectedDatePeriod !== "current" ? (
          <Line
            data={this.state.graphData}
            key={this.state.key}
            options={{
              legend: {
                display: false
              },
              responsive: true,
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
                    maxTicksLimit: 15
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
          />
        ) : (
          <Line
            // data={this.state.graphData}
            key={this.state.key}
            data={{
              datasets: [
                {
                  label: "Rate",
                  data: this.state.newGraphData,
                  fill: false,
                  backgroundColor: "red",
                  borderColor: "red",
                  lineTension: 0,
                  borderWidth: 1,
                  pointRadius: 0.5
                }
              ]
            }}
            options={{
              legend: {
                display: false
              },
              responsive: true,

              scales: {
                xAxes: [
                  {
                    type: "realtime",
                    realtime: {
                      duration: 1000000,
                      ttl: 1000000,
                      refresh: 1000,
                      delay: 2000,
                      pause: false,
                      onRefresh: function(chart) {
                        _this.onRefreshSpotData(chart);
                      }
                    }
                  }
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: false,
                      labelString: "value"
                    }
                  }
                ]
              },
              tooltips: {
                mode: "nearest",
                intersect: false,
                callbacks: {
                  label: (tooltipItems, data) => {
                    return "Rate : " + tooltipItems.value;
                  }
                }
              },
              hover: {
                mode: "nearest",
                intersect: false
              }
            }}
          />
        )}
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <GridContainer>
            <GridItem xs={9} sm={9} md={9} lg={9} style={{ textAlign: "left" }}>
              {GRAPH_BUTTONS.map(x => {
                return x.key !== this.state.selectedDatePeriod ? (
                  <Button
                    color="success"
                    size="sm"
                    round
                    onClick={() => this.toggleGraph(x.key)}
                  >
                    {x.text}
                  </Button>
                ) : null;
              })}
            </GridItem>
            {this.state.selectedDatePeriod !== "current" && (
              <GridItem
                xs={3}
                sm={3}
                md={3}
                lg={3}
                style={{ textAlign: "right", alignSelf: "center" }}
              >
                <b>
                  {this.state.selectedDate === ""
                    ? ""
                    : formatDate(this.state.selectedDate)}
                </b>
              </GridItem>
            )}
          </GridContainer>
        </GridItem>
      </>
    );
  }
}

PortalDashboardGraph.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(addDirectorsStyle)(PortalDashboardGraph));
