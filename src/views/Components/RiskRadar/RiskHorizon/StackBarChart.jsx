import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Fullscreen from "react-full-screen";

import { formatMoney, formatDate } from "../../../../utils/Utils";

import { Bar } from "react-chartjs-2";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </div>
  );
}

const MONTHS = [
  {
    monthName: "Jan",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Feb",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Mar",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Apr",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "May",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Jun",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Jul",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Aug",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Sep",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Oct",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Nov",
    year: 0,
    monthYear: "",
    month: 1
  },
  {
    monthName: "Dec",
    year: 0,
    monthYear: "",
    month: 1
  }
];

const HEDGECOLOR = "#0DFF00";

const CATEGORIES = [
  "assets",
  "liabilities",
  "payables",
  "receivables",
  "forecastedRevenues",
  "forecastedCosts",
  ""
];
const POSITIVE_Y_AXIS_CATEGORIES = [
  "assets",
  "receivables",
  "forecastedRevenues"
];
const NEGATIVE_Y_AXIS_CATEGORIES = [
  "liabilities",
  "payables",
  "forecastedCosts"
];
const CATEGORYKEYS = [
  "assets",
  "liabilities",
  "payables",
  "receivables",
  "forecastedRevenues",
  "forecastedCosts",
  "externalHedges",
  "fxForwardDeals"
];
const CATEGORYINFO = {
  assets: {
    color: "#26A9EB",
    label: "Asset or Investments",
    hedgeColor: "#26A9EB80"
  },
  liabilities: {
    color: "#f7a7f7",
    label: "Liabilities",
    hedgeColor: "#f7a7f7cc"
  },
  externalHedges: {
    color: "#068032",
    label: "External Hedges",
    hedgeColor: "rgb(1, 155, 24, 0.6)"
  },
  fxForwardDeals: {
    color: "#8BFAA9",
    label: "FX Forward Deals",
    hedgeColor: "rgb(11, 218, 81,0.6)"
  },
  payables: { color: "#6161ea", label: "Payables", hedgeColor: "#6161ea80" },
  receivables: {
    color: "#750c26",
    label: "Receivables",
    hedgeColor: "#750c2680"
  },
  forecastedRevenues: {
    color: "#FFA500",
    label: "Forecasted Revenues",
    hedgeColor: "#FFA50080"
  },
  forecastedCosts: {
    color: "#AE88FF",
    label: "Forecasted Costs",
    hedgeColor: "#AE88FF80"
  }
};

const CURRENCYINFO = {
  INR: {
    color: "#26A9EB",
    label: "INR",
    hedgeColor: "#26A9EB80"
  },
  GBP: {
    color: "#f7a7f7",
    label: "GBP",
    hedgeColor: "#f7a7f7cc"
  },
  EUR: {
    color: "#F4D03F",
    label: "EUR",
    hedgeColor: "rgb(11, 218, 81,0.6)"
  },
  CAD: { color: "#6161ea", label: "CAD", hedgeColor: "#6161ea80" },
  CHF: {
    color: "#ff3579",
    label: "CHF",
    hedgeColor: "#ff357980"
  },
  USD: {
    color: "#FFA500",
    label: "USD",
    hedgeColor: "#FFA50080"
  },
  forecastedCosts: {
    color: "#AE88FF",
    label: "Forecasted Costs",
    hedgeColor: "#AE88FF80"
  }
};

// const arrKeys=['assets','liabilities''forecastedCosts']
// const arrAngle=[150,90,30]
const style = theme => ({
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
    // , textAlign: "center"
  },

  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  iconButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
    // float:'right'
  },
  center: {
    textAlign: "center "
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
  addDirectorsMaxWidth: {
    maxWidth: 600
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
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
});

class StackBarChart extends React.Component {
  error = {
    hedgingPercentageErrorMsg: {
      required: "Hedging Percentage value is required",
      range: "Hedging percentage value should be between 0 to 100"
    },
    hedgeAmountErrorMsg: {
      required: "Profit Amount is required",
      positive: "Profit Amount should be positive number"
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      callInProgress: false,

      hedgingPercentage: "",
      hedgingPercentageState: "",
      hedgingPercentagePristine: false,
      hedgingPercentageErrorMsg: [],
      hedgeAmount: "",
      hedgeAmountState: "",
      hedgeAmountPristine: false,
      hedgeAmountErrorMsg: [],
      modalRadioChecked: "hedgingPercentage",
      key: 0,
      showModal: false,
      dialogTitle: "",
      modalData: {},
      chartData: {
        labels: [],
        datasets: []
      },
      //category table
      tableColumns: [],
      tableData: [],
      tableTitle: "",

      //hedge link table
      hedgeTableColumns: ["Currency Bought", "Currency Sold", "Deal Date", ""],
      hedgeTableData: [],

      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      riskRadarType: "",
      tabValue: 0,
      isChanged: false,
      year: 0,
      currentYear: new Date().getFullYear(),
      nextMaxYear: new Date().getFullYear() + 2,
      minYear: 0,
      maxYear: 0,
      dayOfYear: "", //this.getDayofYear(),
      startDate: this.getDateAfterXYears(0),

      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      monthsEscaped: 0,
      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: [],
      isFullScreen: false
    };

    this.todaysDate = new Date().setHours(0, 0, 0, 0);
    this.currentYear = new Date().getFullYear();
    this.chartRef = React.createRef();
  }
  componentDidMount() {
    if (
      this.props.parsedRiskRadarData &&
      this.props.parsedRiskRadarData.risks
    ) {
      this.getDates(this.props.parsedRiskRadarData, this.props);
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.isChanged !== newProps.isChanged ||
      this.props.chartCurrentView !== newProps.chartCurrentView
    ) {
      if (newProps.parsedRiskRadarData && newProps.parsedRiskRadarData.risks) {
        this.getDates(newProps.parsedRiskRadarData, newProps);
      }
    }
  }

  openFullScreen = () => {
    // if (
    //   this.props.parsedRiskRadarData &&
    //   this.props.parsedRiskRadarData.risks
    // ) {
    //   this.getDates(this.props.parsedRiskRadarData, this.props);
    // }

    //handle.enter()
    this.setState({
      isFullScreen: true
    });
  };

  zoom = zoomIn => {
    let rect = this.chartRef.current.chartInstance.canvas.getBoundingClientRect();

    if (zoomIn) {
      this.chartRef.current.chartInstance["$zoom"].zoomChart(rect, 0.1);
    } else {
      this.chartRef.current.chartInstance["$zoom"].zoomChart(rect, -0.1);
    }
  };
  isValidateHedgeAssetsData = () => {
    if (
      this.state.modalRadioChecked === "hedgingPercentage" &&
      this.state.hedgingPercentage > this.state.remainingHedgePercent
    ) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg:
          "Hedge Percentage should be less than " +
          this.state.remainingHedgePercent
      });
      return false;
    }
    if (
      this.state.modalRadioChecked === "hedgeAmount" &&
      this.state.hedgeAmount > this.state.remainingHedgeAmount
    ) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg:
          "Hedge Amount should be less than " +
          formatMoney(this.state.remainingHedgeAmount)
      });
      return false;
    }
    if (
      (this.state.modalRadioChecked === "hedgingPercentage" &&
        this.state.hedgingPercentageState === "success") ||
      (this.state.modalRadioChecked === "hedgeAmount" &&
        this.state.hedgeAmountState === "success")
    ) {
      return true;
    } else {
      if (
        this.state.modalRadioChecked === "hedgingPercentage" &&
        this.state.hedgingPercentageState !== "success"
      ) {
        if (this.state.hedgingPercentage === "") {
          this.state.hedgingPercentageErrorMsg.push(
            this.error["hedgingPercentageErrorMsg"].required
          );
        }
        this.setState({ hedgingPercentageState: "error" });
      }
      if (
        this.state.modalRadioChecked === "hedgeAmount" &&
        this.state.hedgeAmountState !== "success"
      ) {
        if (this.state.hedgeAmount === "") {
          this.state.hedgeAmountErrorMsg.push(
            this.error["hedgeAmountErrorMsg"].required
          );
        }
        this.setState({ hedgeAmountState: "error" });
      }
    }
  };

  getDates = (parsedRiskRadarData, newProps) => {
    //if (apiData) this.getFutureAssetsData(apiData, []);

    if (parsedRiskRadarData.risks) {
      // this.getCurrentYearAssetsData(apiData, [], maxAmount);
      const dateObj = this.getAllDates(parsedRiskRadarData.risks);
      this.createDataSet(parsedRiskRadarData, dateObj, newProps);
    }
  };

  getAllDates = apiData => {
    let labels = [],
      monthsYear = [];

    let currentMonth = this.getMonth(new Date()).numeric;
    let index = 0;
    for (let i = currentMonth; i < MONTHS.length; i++) {
      index++;
      let obj = MONTHS[i];
      labels[i - currentMonth] =
        obj.monthName + ", " + (this.state.currentYear + this.state.year);
      labels[i - currentMonth + 12] =
        obj.monthName + ", " + (this.state.currentYear + this.state.year + 1);
      monthsYear[i - currentMonth] = {
        monthName: obj.monthName,
        monthYear:
          obj.monthName + ", " + (this.state.currentYear + this.state.year),
        year: this.state.currentYear + this.state.year,
        month: obj.month
      };
      monthsYear[i - currentMonth + 12] = {
        monthName: obj.monthName,
        monthYear:
          obj.monthName + ", " + (this.state.currentYear + this.state.year + 1),
        year: this.state.currentYear + this.state.year + 1,
        month: obj.month
      };
    }

    for (let i = 0; i < currentMonth; i++) {
      let obj = MONTHS[i];
      labels[index] =
        obj.monthName + ", " + (this.state.currentYear + this.state.year + 1);
      labels[index + 12] =
        obj.monthName + ", " + (this.state.currentYear + this.state.year + 2);
      monthsYear[index] = {
        monthName: obj.monthName,
        monthYear:
          obj.monthName + ", " + (this.state.currentYear + this.state.year + 1),
        year: this.state.currentYear + this.state.year,
        month: obj.month
      };
      monthsYear[index + 12] = {
        monthName: obj.monthName,
        monthYear:
          obj.monthName + ", " + (this.state.currentYear + this.state.year + 2),
        year: this.state.currentYear + this.state.year + 1,
        month: obj.month
      };
      index++;
    }

    // if (this.state.year == 0) {
    //   dates = [...dates, "Current"];
    // }

    // CATEGORIES.forEach(category => {
    //   let dataArr =
    //     apiData[category] && apiData[category] ? apiData[category] : [];
    //   dataArr.filter(x => {
    //     if (
    //       new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
    //       new Date(x.date) < this.getDateAfterXYears(2 + this.state.year)
    //     ) {
    //       return x;
    //     }
    //   });
    //   dataArr.forEach(x => {
    //     if (
    //       new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
    //       new Date(x.date) < this.getDateAfterXYears(2 + this.state.year)
    //     ) {
    //       let monthYear =
    //         this.getMonth(x.date).name + ", " + new Date(x.date).getFullYear();
    //         let index=monthsYear.findIndex(y=>y.monthYear===monthYear)
    //       // if (!dates.includes(monthYear)) {
    //       //   dates = [...dates, monthYear];
    //       // }
    //       if(index!==-1){
    //         monthsYear[index]={
    //           ...monthsYear[index],
    //           dataExists:true
    //         }
    //       }
    //     }
    //   });
    // });
    // let dataArr = apiData.externalHedges ? apiData.externalHedges : [];
    // dataArr.filter(x => {
    //   if (
    //     new Date(x.settlementDate) >=
    //       this.getDateAfterXYears(0 + this.state.year) &&
    //     new Date(x.settlementDate) <
    //       this.getDateAfterXYears(2 + this.state.year)
    //   ) {
    //     return x;
    //   }
    // });
    // dataArr.forEach(x => {
    //   if (
    //     new Date(x.settlementDate) >=
    //       this.getDateAfterXYears(0 + this.state.year) &&
    //     new Date(x.settlementDate) <
    //       this.getDateAfterXYears(2 + this.state.year)
    //   ) {
    //     let monthYear =
    //       this.getMonth(x.settlementDate).name +
    //       ", " +
    //       new Date(x.settlementDate).getFullYear();
    //     // if (!dates.includes(monthYear)) {
    //     //   dates = [...dates, monthYear];
    //     // }
    //     let index=monthsYear.findIndex(y=>y.monthYear===monthYear)
    //     // if (!dates.includes(monthYear)) {
    //     //   dates = [...dates, monthYear];
    //     // }
    //     if(index!==-1){
    //       monthsYear[index]={
    //         ...monthsYear[index],
    //         dataExists:true
    //       }
    //     }
    //   }
    // });

    // dates.sort(function(a, b) {
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(a) - new Date(b);
    // });
    return { monthsYear: monthsYear, labels: labels };
  };

  getDateAfterXYears = y => {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + y, month, day);
    // console.log('getDateAfterXYears',this.state.dayOfYear)

    return c;
  };
  createDataSet = (parsedRiskRadarData, dateObj, newProps) => {
    //this.createCurrentAssetsDataset(apiData, dates, newProps);
    this.createBarChartDataset(parsedRiskRadarData, dateObj, newProps);
  };

  createBarChartDataset = (parsedRiskRadarData, dateObj, newProps) => {
    let dataSets = [];
    let parsedData =
      newProps.chartCurrentView === "currencyWise"
        ? parsedRiskRadarData.currencyWiseData
        : parsedRiskRadarData.risks;
    let categoryInfo =
      newProps.chartCurrentView === "currencyWise"
        ? CURRENCYINFO
        : CATEGORYINFO;
    let categories =
      newProps.chartCurrentView === "currencyWise"
        ? Object.keys(parsedData)
        : CATEGORIES;
    categories.forEach(category => {
      if (category !== "") {
        let labelColorInfo = categoryInfo[category]
          ? categoryInfo[category]
          : { label: category, color: "#f7a7f7", hedgeColor: "#f7a7f7cc" }; //default
        let data = parsedData[category];
        let toolTip = [];
        let barchartData = [];
        let hedgeToolTip = [];
        let hedgeBarchartData = [];

        const dates = dateObj.monthsYear;
        // console.log("getalldatescate", dates);

        if (data.length > 0) {
          for (let j = 0; j < dates.length; j++) {
            let date = dates[j];
            // console.log("getalldatesfor", date);

            let categoryData = [];
            if (category === 'assets') {
              categoryData = data.filter(x => {
                if (x.notExpired && j === 0) return true;
                else if (!x.notExpired) {
                  const val = this.getMonth(x.date).name + ", " + new Date(x.date).getFullYear();
                  console.log('LOG _ ', val, date.monthYear);
                  return (
                    val == date.monthYear
                  );
                }
              });
            } else {
              categoryData = data.filter(x => {
                const val = this.getMonth(x.date).name + ", " + new Date(x.date).getFullYear();
                // console.log('LOG _ ', val, date.monthYear);
                return (
                  val == date.monthYear
                );
              });
            }

            let totalRiskAmount = 0;
            let totalCashAmount = 0;
            let hedgeAmount = 0;
            categoryData.map(obj => {
              let hedge =
                obj.convertedValueBeforeHedge - obj.convertedValueAfterHedge;
              let risk = obj.convertedValueBeforeHedge;
              // if(newProps.chartCurrentView==='currencyWise'){
              //   hedge=this.getAmountBasedOnCategory(hedge, obj.riskType)
              //   risk=this.getAmountBasedOnCategory(risk, obj.riskType)
              // }
              if (category === 'assets' && obj.notExpired) {
                totalCashAmount = totalCashAmount + risk;
              }
              totalRiskAmount = totalRiskAmount + risk;
              hedgeAmount = hedgeAmount + hedge;
            });
            if (totalCashAmount > 0) {
              toolTip = [
                ...toolTip,
                "Total Amount\n" +
                  formatMoney(totalRiskAmount) +
                  " " +
                  this.props.functionalCurrency + "\n" +
                  "Total Cash\n" +
                  formatMoney(totalCashAmount) +
                  " " +
                  this.props.functionalCurrency
              ];
            } else {
              toolTip = [
                ...toolTip,
                "Total Amount\n" +
                  formatMoney(totalRiskAmount) +
                  " " +
                  this.props.functionalCurrency
              ];
            }
            barchartData = [...barchartData, Math.abs(totalRiskAmount)];

            hedgeBarchartData = [...hedgeBarchartData, Math.abs(hedgeAmount)];
            hedgeToolTip = [
              ...hedgeToolTip,
              "Hedged Amount\n" +
                formatMoney(hedgeAmount) +
                " " +
                this.props.functionalCurrency
            ];
          }
        }
        dataSets = [
          ...dataSets,
          {
            label: labelColorInfo.label,
            data: barchartData,
            backgroundColor: labelColorInfo.color,
            toolTip: toolTip,
            name: labelColorInfo.label,
            stack: 1
          },
          {
            label: labelColorInfo.label,
            data: hedgeBarchartData,
            backgroundColor: HEDGECOLOR,
            toolTip: hedgeToolTip,
            name: labelColorInfo.label,
            stack: 2
          }
        ];
        // console.log('BAR CHART DATASET ', dataSets);
      }
    });

    // OtherHedges
    this.getOtherHedgesData(dateObj, dataSets, parsedRiskRadarData);
  };

  getOtherHedgesData = (dateObj, dataSets, apiData) => {
    let toolTip = [];
    let barchartData = [];

    if (apiData.hedges) {
      let data = apiData.hedges;
      const dates = dateObj.monthsYear;

      if (data.length > 0) {
        for (let j = 0; j < dates.length; j++) {
          let date = dates[j];

          let categoryData = [];
          categoryData = data.filter(x => {
            return (
              this.getMonth(x.settlementDate).name +
                ", " +
                new Date(x.settlementDate).getFullYear() ==
                date.monthYear && !x.isLinkedHedge
            );
          });
          let totalConvertedAmount = 0;
          categoryData.map(data => {
            totalConvertedAmount =
              totalConvertedAmount + this.getHedgeAmountBasedOnCategory(data);
          });

          toolTip = [...toolTip, this.getExternalHedgesTooltip(categoryData)];
          barchartData = [...barchartData, totalConvertedAmount];
        }
      }
    }
    dataSets = [
      ...dataSets,
      {
        label: "Other Hedges",
        data: barchartData,
        backgroundColor: CATEGORYINFO.externalHedges.color,
        toolTip: toolTip,
        name: "otherHedges",
        stack: 2
      }
    ];

    this.setState({
      chartData: {
        labels: dateObj.labels,
        datasets: dataSets
      },
      key: this.state.key + 1
    });
  };
  getHedgeAmountBasedOnCategory = dealObj => {
    if (dealObj.boughtCurrencyCode === this.props.functionalCurrency) {
      return dealObj.currencyBought;
    } else if (dealObj.soldCurrencyCode === this.props.functionalCurrency) {
      return dealObj.currencySold;
    } else {
      return dealObj.sellConvertedValueInFunCurrency;
    }
  };
  getAmountBasedOnCategory = (amount, riskType) => {
    if (riskType === "RECEIVABLES" || riskType === "FORECASTED_REVENUES") {
      return -amount;
    } else {
      return amount;
    }
  };
  createCurrentAssetsDataset = (apiData, dates, newProps) => {
    let dataSets = [];
    if (apiData.externalHedges) {
      let data = apiData.externalHedges;
      let toolTip = [""];
      let barchartData = [0];

      if (data.length > 0) {
        for (let j = 1; j < dates.length; j++) {
          let categoryData = [];
          if (newProps.chartCurrentView !== "linkedHedges") {
            categoryData = data.filter(x => {
              return (
                this.getMonth(x.settlementDate).name +
                  ", " +
                  new Date(x.settlementDate).getFullYear() ==
                dates[j]
              );
            });
          } else {
            categoryData = data.filter(x => {
              return (
                this.getMonth(x.settlementDate).name +
                  ", " +
                  new Date(x.settlementDate).getFullYear() ==
                  dates[j] && !x.isLinkedHedge
              );
            });
          }

          let totalConvertedAmount = 0;
          categoryData.map((data, index) => {
            totalConvertedAmount = totalConvertedAmount + data.currencySold;
          });

          toolTip = [...toolTip, this.getExternalHedgesTooltip(categoryData)];
          barchartData = [...barchartData, totalConvertedAmount];
        }
      }

      dataSets = [
        ...dataSets,
        {
          label: CATEGORYINFO.externalHedges.label,
          data: barchartData,
          backgroundColor: CATEGORYINFO.externalHedges.color,
          toolTip: toolTip,
          name: "externalHedges"
        }
      ];
      //fx forward deals below
      data = apiData.internalHedges;
      toolTip = [""];
      barchartData = [0];

      if (data.length > 0) {
        for (let j = 1; j < dates.length; j++) {
          let categoryData = data.filter(x => {
            return (
              this.getMonth(x.settlementDate).name +
                ", " +
                new Date(x.settlementDate).getFullYear() ==
              dates[j]
            );
          });

          let totalConvertedAmount = 0;
          categoryData.map((data, index) => {
            totalConvertedAmount = totalConvertedAmount + data.currencySold;
          });

          // toolTip=[...toolTip,'Amount:'+formatMoney(totalConvertedAmount)]
          toolTip = [...toolTip, this.getExternalHedgesTooltip(categoryData)];
          barchartData = [...barchartData, totalConvertedAmount];
        }
      }

      dataSets = [
        ...dataSets,
        {
          label: CATEGORYINFO.fxForwardDeals.label,
          data: barchartData,
          backgroundColor: CATEGORYINFO.fxForwardDeals.color,
          toolTip: toolTip,
          name: "externalHedges"
        }
      ];
    }
    this.createCategoryDataSet(apiData, dates, dataSets, newProps);
  };
  getExternalHedgesTooltip = arr => {
    let toolTip = "";
    arr.forEach(x => {
      toolTip =
        toolTip +
        "Sold Amount: " +
        formatMoney(x.currencySold) +
        " " +
        x.soldCurrencyCode +
        " Bought Amount: " +
        formatMoney(x.currencyBought) +
        " " +
        x.boughtCurrencyCode +
        "\n";
    });
    return toolTip;
  };
  createCategoryDataSet = (apiData, dates, dataSets, newProps) => {
    for (let i = 0; i < POSITIVE_Y_AXIS_CATEGORIES.length; i++) {
      if (apiData[POSITIVE_Y_AXIS_CATEGORIES[i]]) {
        let data = apiData[POSITIVE_Y_AXIS_CATEGORIES[i]];
        let toolTip = [""];
        let barchartData = [0];
        let hedgeToolTip = [""];
        let hedgeBarchartData = [0];
        if (data.length > 0) {
          for (let j = 1; j < dates.length; j++) {
            let categoryData = data.filter(x => {
              return (
                this.getMonth(x.date).name +
                  ", " +
                  new Date(x.date).getFullYear() ==
                dates[j]
              );
            });

            let totalConvertedAmount = 0;
            let hedgeAmount = 0;
            categoryData.map((data, index) => {
              let hedgeAmountWithSensitity = this.getHedgeAmount(
                data.convertedValueBeforeHedge,
                data.amount,
                data,
                POSITIVE_Y_AXIS_CATEGORIES[i]
              );

              totalConvertedAmount =
                totalConvertedAmount + data.convertedValueBeforeHedge;
              hedgeAmount = hedgeAmount + hedgeAmountWithSensitity;

              //totalConvertedAmount = this.getSensitivityAmount(totalConvertedAmount)-hedgeAmountWithSensitity;
              totalConvertedAmount =
                totalConvertedAmount - hedgeAmountWithSensitity;
            });

            toolTip = [
              ...toolTip,
              "Unhedged Amount\n" + this.getAmountToolTip(categoryData)
            ];
            barchartData = [...barchartData, totalConvertedAmount];

            hedgeBarchartData = [...hedgeBarchartData, hedgeAmount];
            hedgeToolTip = [
              ...hedgeToolTip,
              "Hedged Amount\n" + formatMoney(hedgeAmount)
            ];
          }
        }
        dataSets = [
          ...dataSets,
          {
            label: CATEGORYINFO[POSITIVE_Y_AXIS_CATEGORIES[i]].label,
            data: barchartData,
            backgroundColor: CATEGORYINFO[POSITIVE_Y_AXIS_CATEGORIES[i]].color,
            toolTip: toolTip,
            name: POSITIVE_Y_AXIS_CATEGORIES[i]
          }
        ];

        if (newProps.chartCurrentView === "linkedHedges") {
          dataSets.push({
            label: CATEGORYINFO[POSITIVE_Y_AXIS_CATEGORIES[i]].label + "-Hedge",
            data: hedgeBarchartData,
            backgroundColor:
              CATEGORYINFO[POSITIVE_Y_AXIS_CATEGORIES[i]].hedgeColor,
            toolTip: hedgeToolTip,
            name: POSITIVE_Y_AXIS_CATEGORIES[i]
          });
        }
      }
    }
    for (let i = 0; i < NEGATIVE_Y_AXIS_CATEGORIES.length; i++) {
      if (apiData[NEGATIVE_Y_AXIS_CATEGORIES[i]]) {
        let data = apiData[NEGATIVE_Y_AXIS_CATEGORIES[i]];
        let toolTip = [""];
        let barchartData = [0];
        let hedgeToolTip = [""];
        let hedgeBarchartData = [0];
        if (data.length > 0) {
          for (let j = 1; j < dates.length; j++) {
            let categoryData = data.filter(x => {
              return (
                this.getMonth(x.date).name +
                  ", " +
                  new Date(x.date).getFullYear() ==
                dates[j]
              );
            });
            let totalConvertedAmount = 0;
            let hedgeAmount = 0;
            categoryData.map((data, index) => {
              let hedgeAmountWithSensitity = this.getHedgeAmount(
                data.convertedValueBeforeHedge,
                data.amount,
                data,
                NEGATIVE_Y_AXIS_CATEGORIES[i]
              );

              totalConvertedAmount =
                totalConvertedAmount + data.convertedValueBeforeHedge;
              hedgeAmount = hedgeAmount + hedgeAmountWithSensitity;

              //totalConvertedAmount = this.getSensitivityAmount(totalConvertedAmount)-hedgeAmountWithSensitity;
              totalConvertedAmount =
                totalConvertedAmount - hedgeAmountWithSensitity;
            });
            // totalConvertedAmount =
            // categoryData.reduce(function(_this, val) {
            //     return _this + val.convertedValueBeforeHedge;
            //   }, 0) + totalConvertedAmount;
            toolTip = [
              ...toolTip,
              "Unhedged Amount\n" + this.getAmountToolTip(categoryData)
            ];

            barchartData = [...barchartData, totalConvertedAmount];

            hedgeBarchartData = [...hedgeBarchartData, hedgeAmount];
            hedgeToolTip = [
              ...hedgeToolTip,
              "Hedged Amount\n" + formatMoney(hedgeAmount)
            ];
          }
        }
        dataSets = [
          ...dataSets,
          {
            label: CATEGORYINFO[NEGATIVE_Y_AXIS_CATEGORIES[i]].label,
            data: barchartData,
            backgroundColor: CATEGORYINFO[NEGATIVE_Y_AXIS_CATEGORIES[i]].color,
            toolTip: toolTip,
            name: NEGATIVE_Y_AXIS_CATEGORIES[i]
          }
        ];

        if (newProps.chartCurrentView === "linkedHedges") {
          dataSets.push({
            label: CATEGORYINFO[NEGATIVE_Y_AXIS_CATEGORIES[i]].label + "-Hedge",
            data: hedgeBarchartData,
            backgroundColor:
              CATEGORYINFO[NEGATIVE_Y_AXIS_CATEGORIES[i]].hedgeColor,
            toolTip: hedgeToolTip,
            name: NEGATIVE_Y_AXIS_CATEGORIES[i]
          });
        }
      }
    }

    this.setState({
      chartData: {
        labels: [...dates],
        datasets: dataSets
      },
      key: this.state.key + 1
    });
  };
  getLinkedDealsData = riskHedgeModels => {
    let hedgeData = [];
    riskHedgeModels.forEach(row => {
      let arr = this.props.parsedRiskRadarData.hedges.filter(
        hedge => hedge.id === row.hedgeId
      );
      hedgeData = [...hedgeData, ...arr];
    });
    return hedgeData;
  };
  getHedgeAmount = (
    convertedValueBeforeHedge,
    amount,
    categoryData,
    category
  ) => {
    const amountAttribute =
      category === "payables" || "forecastedCosts"
        ? "currencyBought"
        : "currencySold";
    let hedgeAmount = 0;
    // currencyDetails.map((categoryData, index)=>{
    if (
      categoryData.riskHedgeModels &&
      categoryData.riskHedgeModels.length > 0
    ) {
      let hedgeData = this.getLinkedDealsData(categoryData.riskHedgeModels);
      hedgeAmount =
        hedgeData.reduce(function(_this, val) {
          return _this + val[amountAttribute];
        }, 0) + hedgeAmount;
    }
    // })
    let convertedHedgeAmount =
      (convertedValueBeforeHedge / amount) * hedgeAmount;
    return convertedHedgeAmount; //this.getSensitivityAmount(convertedHedgeAmount)
  };

  getMonth = date => {
    return {
      numeric: new Date(date).getMonth(),
      name: new Date(date).toLocaleString("default", { month: "short" })
    };
  };

  getYear = date => {
    return new Date(date).getFullYear();
  };

  getAmountToolTip = data => {
    const toolTip = data.map(obj => {
      return formatMoney(obj.amount) + " " + obj.currencyCode;
    });
    return toolTip.join("\n");
  };

  getGetAmountOfPercent = (percentage, amount) => {
    return (amount * percentage) / 100;
  };

  changeYear = increment => {
    let year = this.state.year + increment;

    this.setState(
      {
        year: year
      },
      () => {
        this.getDates(this.props.parsedRiskRadarData, this.props);
      }
    );
  };

  render() {
    const { classes } = this.props;
    // console.log('CHART DATA - ', this.state.chartData);
    return (
      <>
        <GridContainer justify="center">
          <GridItem
            xs={1}
            sm={1}
            md={1}
            lg={1}
            style={{
              alignSelf: "center",
              textAlign: "center",
              display: this.props.printComponent ? "none" : ""
            }}
          >
            <IconButton
              disabled={this.props.minYear == this.state.year}
              aria-label="close"
              className={classes.iconButton}
              onClick={() => this.changeYear(-1)}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          </GridItem>
          <GridItem
            xs={this.props.printComponent ? 12 : 10}
            sm={this.props.printComponent ? 12 : 10}
            md={this.props.printComponent ? 12 : 10}
            lg={this.props.printComponent ? 12 : 10}
            style={{ textAlign: "center" }}
          >
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ textAlign: "center" }}
              >
                <Fullscreen
                  enabled={this.state.isFullScreen}
                  onChange={isFull => this.setState({ isFullScreen: isFull })}
                >
                  <Bar
                    ref={this.chartRef}
                    key={this.state.key}
                    data={this.state.chartData}
                    options={{
                      tooltips: {
                        //mode: 'x',
                        callbacks: {
                          label: function(tooltipItem, data) {
                            return data.datasets[
                              tooltipItem.datasetIndex
                            ].label.split("-")[0]; //+ ": " + formatMoney(Math.abs(tooltipItem.yLabel));
                            //return 'Amount'
                          },
                          afterLabel: (tooltipItem, data) => {
                            return data.datasets[tooltipItem.datasetIndex]
                              .toolTip[tooltipItem.index];
                          }
                        }
                      },
                      //  plugins: {
                      //   zoom: {
                      //     // Container for pan options
                      //     pan: {
                      //       enabled: true,
                      //       mode: 'xy',
                      //       speed:1
                      //       },
                      //       zoom:{
                      //           enabled:true,
                      //           //drag:true,
                      //           mode:'xy'
                      //       }
                      //       }
                      // },
                      responsive: !this.props.printComponent,
                      maintainAspectRatio: !this.props.printComponent,
                      // events: ['click'],

                      scales: {
                        xAxes: [
                          {
                            stacked: true,
                            gridLines: { display: false },
                            //maxBarThickness: 40,
                            barPercentage: 1,
                            categoryPercentage: 0.8,
                            scaleLabel: {
                              display: true,
                              labelString:
                                "All amounts in " +
                                this.props.functionalCurrency
                            }
                          }
                        ],
                        yAxes: [
                          {
                            stacked: true,
                            ticks: {
                              callback: function(value) {
                                return formatMoney(value);
                              }
                            }
                          }
                        ]
                      }, // scales
                      legend: {
                        display: false

                        //onClick: () => {}
                      },
                      onClick: (event, item) => {
                        // if (item.length > 0) {
                        //   const chart = item[0]._chart;
                        //   const element = chart.getElementAtEvent(event)[0];
                        //   const dataset =
                        //     chart.data.datasets[element._datasetIndex];
                        //   const xLabel = chart.data.labels[element._index];
                        //   if (dataset.name != "otherHedges") {
                        //     this.props.displayTable(
                        //       dataset,
                        //       dataset.name,
                        //       false,
                        //       xLabel
                        //     );
                        //   } else {
                        //     this.props.resetDataHideTable();
                        //   }
                        // }
                      }
                    }}
                    width={this.props.printComponent ? 700 : 600}
                    height={this.props.printComponent ? 400 : 300}
                  />
                </Fullscreen>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ textAlign: "center", display: "none" }}
              >
                {CATEGORYKEYS.map(y => {
                  let x = CATEGORYINFO[y];
                  return (
                    <>
                      <span
                        style={{
                          width: "40px",
                          height: "10px",
                          backgroundColor: x.color,
                          display: "inline-block",
                          marginRight: 10
                        }}
                      />
                      <span style={{ marginRight: 10, fontSize: 12 }}>
                        {x.label}
                      </span>
                    </>
                  );
                })}
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem
            xs={1}
            sm={1}
            md={1}
            lg={1}
            style={{
              alignSelf: "center",
              textAlign: "center",
              display: this.props.printComponent ? "none" : ""
            }}
          >
            <IconButton
              disabled={this.props.maxYear == this.state.year}
              aria-label="close"
              className={classes.iconButton}
              onClick={() => this.changeYear(1)}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </GridItem>
        </GridContainer>
      </>
    );
  }
}
StackBarChart.propTypes = {
  classes: PropTypes.object.isRequired,
  parsedRiskRadarData: PropTypes.object,
  isChanged: PropTypes.any
};
export default withRouter(withStyles(style)(StackBarChart));
