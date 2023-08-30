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
import NoticeModal from "views/Components/NoticeModal.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import { formatMoney, formatDate, parseDate } from "../../../../utils/Utils";
import { validate } from "../../../../utils/Validator";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";

import moment from "moment";

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

class HedgeEffectivenessGraph extends React.Component {
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
            label:
              "Underlying change in " + props.hedgeGraphData.functionalCurrency,
            data: [],
            fill: false,
            backgroundColor: "blue",
            borderColor: "blue",
            lineTension: 0,
            borderWidth: 1,
            pointRadius: 0.5
          },
          {
            label: "Hedge Change in " + props.hedgeGraphData.functionalCurrency,
            data: [],
            fill: false,
            backgroundColor: "orange",
            borderColor: "orange",
            lineTension: 0,
            borderWidth: 1,
            pointRadius: 0.5
          },
          {
            label: "Net Change in " + props.hedgeGraphData.functionalCurrency,
            data: [],
            fill: false,
            backgroundColor: "gray",
            borderColor: "gray",
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
    this.getGraphData();
  }
  downloadReport = () => {
    this.csvDownloadLink.current.link.click();
  };
  getGraphData = async () => {
    const data = this.props.hedgeGraphData;
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_RADAR_HEDGE_EFFECTIVENESS,
      data: data,
      authToken: sessionStorage.getItem("token")
    });
    console.log("getGraphData", res.data);
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.parseData(res.data);
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

    let labels = [],
      underlyingChangePoints = [],
      hedgeChangePoints = [],
      netChangeChangePoints = [];
    // downloadReportData = [
    //   [
    //     "Date Time",
    //     graphAttribute.charAt(0).toUpperCase() + graphAttribute.slice(1)
    //   ]
    // ];
    data &&
      data.effectivnesses &&
      data.effectivnesses.forEach((obj, index) => {
        if (obj.date !== null) {
          labels.push(formatDate(obj.date));
          underlyingChangePoints.push(obj.underlyingChange);
          hedgeChangePoints.push(obj.currentValuationForHedge);
          netChangeChangePoints.push(obj.netChange);
          //downloadReportData.push([obj.endDate, obj[graphAttribute]]);
        }
      });
    let graphData = this.state.graphData;
    graphData.labels = labels;
    let dataset = graphData.datasets;
    dataset[0].data = underlyingChangePoints;
    dataset[1].data = hedgeChangePoints;
    dataset[2].data = netChangeChangePoints;

    graphData.datasets = dataset;
    console.log(graphData);
    this.setState({
      graphData: graphData,
      key: this.state.key + 1
      //downloadReportData: downloadReportData
    });
  };

  getDateString = date => {
    console.log("datestring", date);
    // return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    return moment(date).format("YYYY-MM-DD");
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
            {/* <IconButton
              aria-label="download report"
              onClick={() => this.downloadReport()}
              className={classes.downloadButton}
              style={{ color: "#53ac57" }}
            >
              <CloudDownloadIcon />
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
            </IconButton> */}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.props.handleClose("showGraphModal")}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>
              {"Hedge Effectiveness"}
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
              {/* <GridItem
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
              {/*</GridContainer>
              </GridItem>
               */}

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
                      display: true
                    },
                    tooltips: {
                      callbacks: {
                        label: (tooltipItems, data) => {
                          console.log("tooltipitems", data, tooltipItems);
                          return (
                            "Amount : " +
                            formatMoney(tooltipItems.value) +
                            " " +
                            this.props.hedgeGraphData.functionalCurrency
                          );
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
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
      </div>
    );
  }
}

HedgeEffectivenessGraph.propTypes = {
  classes: PropTypes.object.isRequired,
  hedgeGraphData: PropTypes.object.isRequired
};

export default withRouter(withStyles(style)(HedgeEffectivenessGraph));
