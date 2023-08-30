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

import { formatMoney, formatDate } from "../../../../utils/Utils";
import { Bubble } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import moment from "moment";
import Fullscreen from "react-full-screen";

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
const DAYSINONEYEAR = 366,
  DAYSINTWOYEARS = 732;

const HEDGECOLOR = "#0DFF00";

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

const categoriesInfo = {
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
    hedgeColor: "#04ECFF80"
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
  fullScreen: {
    height: "100%",
    position: "absolute",
    left: 0,
    width: "100%",
    overflow: "hidden"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
});

class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      deLinkDeal: {},
      hedgingPercentage: "",

      hedgeAmount: "",
      hedgeAmountState: "",
      hedgeAmountPristine: false,
      hedgeAmountErrorMsg: [],
      modalRadioChecked: "hedgingPercentage",
      key: 0,
      showModal: false,
      dialogTitle: "",
      modalData: {},
      bubbleChartData: {
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
      maxX: 734,
      minY: 0,
      maxY: 0,
      riskRadarType: "",
      tabValue: 0,
      isChanged: false,
      remainingHedgePercent: 100,
      remainingHedgeAmount: 0,
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
    this.setState(
      {
        dayOfYear: this.getDayofYear()
      },
      () => {
        if (
          this.props.parsedRiskRadarData &&
          this.props.parsedRiskRadarData.risks
        ) {
          this.createDataSet(this.props.parsedRiskRadarData.risks, this.props);
        }
      }
    );
    // if(this.myChartRef&&this.myChartRef.current){
    //   this.myChartRef.current.chartInstance.ctx.canvas.addEventListener('wheel', this.myChartRef.current.chartInstance['$zoom']._wheelHandler);
    // }
  }

  componentWillReceiveProps(newProps) {
    // console.log("BubbleChartcheck", newProps);
    if (
      this.props.isChanged !== newProps.isChanged ||
      this.props.chartCurrentView !== newProps.chartCurrentView
    ) {
      if (newProps.parsedRiskRadarData && newProps.parsedRiskRadarData.risks) {
        this.createDataSet(newProps.parsedRiskRadarData.risks, newProps);
      }
    }
  }

  openFullScreen = () => {
    //handle.enter()
    this.setState({
      isFullScreen: true
    });
  };

  createDataSet = (apiData, newProps) => {
    //if (apiData) this.getFutureAssetsData(apiData, []);

    if (apiData) {
      const maxAmount = this.getMaxSensitiveAmount(apiData);
      this.getCurrentYearAssetsData(apiData, [], maxAmount, newProps);
    }
  };

  monthDiff = (dateFrom, dateTo, min) => {
    // dateFrom = new Date();
    let diff =
      dateTo.getMonth() -
      dateFrom.getMonth() +
      12 * (dateTo.getFullYear() - dateFrom.getFullYear()) +
      (dateTo.getDate() - dateFrom.getDate());

    //  return diff <= 0 ? Math.floor(diff / 12) : Math.ceil(diff / 12) - 2;
    return this.getYearDifference(dateFrom, dateTo, min);
  };

  getMaxSensitiveAmount = apiData => {
    let categories = [
      "assets",
      "liabilities",
      "payables",
      "receivables",
      "forecastedRevenues",
      "forecastedCosts"
    ];
    let maxAmount = 0;
    for (let i = 0; i < categories.length; i++) {
      if (apiData[categories[i]]) {
        apiData[categories[i]].forEach(x => {
          maxAmount = Math.max(maxAmount, x.convertedValueBeforeHedge);
        });
      }
    }
    return maxAmount;
  };

  getYear = date => {
    return new Date(date).getFullYear();
  };
  getMonth = date => {
    return {
      numeric: new Date(date).getMonth(),
      name: date.toLocaleString("default", { month: "short" })
    };
  };
  getDayofYear = () => {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  };
  getDateDifference = (prev, next) => {
    var now = prev; //new Date();
    var start = new Date(next);

    var diff = start - now;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  };

  getDaysBetweenTwoDates = (first, second) => {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  };
  getLinkedDealsData = (riskHedgeModels, props) => {
    let hedgeData = [];
    // console.log("getLinkedDealsData", props.parsedRiskRadarData);
    riskHedgeModels.forEach(row => {
      let arr = props.parsedRiskRadarData.hedges.filter(
        hedge => hedge.id === row.hedgeId
      );
      hedgeData = [...hedgeData, ...arr];
    });
    return hedgeData;
  };
  getCurrentYearAssetsData = (apiData, dataSet, maxAmount, newProps) => {
    let totalConvertedAmount = 0;
    let hedgingDataset = [];

    //if (this.state.year == 0) {
    let dataArr = apiData.assets.filter(x => {
      if (
        x.currencyCode !== this.props.functionalCurrency &&
        new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
        new Date(x.date) < this.getDateAfterXYears(2 + this.state.year) || x.notExpired
      ) {
        return x;
      }
    });

    let dateVisited = [];
    let data = [];
    for (let i = 0; i < dataArr.length; i++) {
      if (!dateVisited.includes(dataArr[i].date)) {
        dateVisited = [...dateVisited, dataArr[i].date];
        
        let arrReceivables = dataArr.filter(x => x.date === dataArr[i].date);

        let totalConvertedAmount = 0;
        let totalAmount = 0;

        totalConvertedAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.convertedValueBeforeHedge;
          }, 0) + totalConvertedAmount;

        totalAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.amount;
          }, 0) + totalAmount;

        let hedgeAmount = 0,
          hedgeToolTip = "";
        for (let i = 0; i < arrReceivables.length; i++) {
          if (arrReceivables[i].riskHedgeModels) {
            let hedgeData = this.getLinkedDealsData(
              arrReceivables[i].riskHedgeModels,
              newProps
            );
            hedgeAmount = arrReceivables[i].hedgedAmount;
              // hedgeData.reduce(function(_this, val) {
              //   return _this + val.currencySold;
              // }, 0) + hedgeAmount;
            hedgeToolTip = this.getHedgeToolTip(hedgeData);
          }
        }

        const radiusObj = this.calculateRadius(
          totalConvertedAmount,
          maxAmount,
          "assets"
        );

        if (hedgeAmount > 0) {
          const hedgingRadiusObj = this.calculateHedgeRadius(
            hedgeAmount,
            totalAmount,
            radiusObj,
            "assets"
          );

          hedgingDataset = [
            ...hedgingDataset,
            {
              x: this.getDateDifference(this.state.startDate, dataArr[i].date),

              y: totalConvertedAmount,
              r: hedgingRadiusObj.hedgeRadius,
              toolTip:
                // "Receivables\n" +
                this.getDate(dataArr[i].date) +
                "\n" +
                hedgingRadiusObj.hedgePercent.toFixed(2) +
                "% Hedged" +
                "\nAmount Asset or Investments \n" +
                // hedgeAmount +
                // " " +
                hedgeToolTip +
                "\n* Not to Scale",
              name: "hedge",
              year: this.getYear(dataArr[i].date),
              date: dataArr[i].date,
              categoryName: "assets"
            }
          ];
        }
        data = [
          ...data,
          {
            x: this.getDateDifference(this.state.startDate, dataArr[i].date),
            y: totalConvertedAmount,
            r: radiusObj,
            toolTip:
              this.getDate(dataArr[i].date) +
              "\nAmount \n" +
              this.getAmountToolTip(arrReceivables), //+ radiusObj.toolTip
            name: "assets",
            year: this.getYear(dataArr[i].date),
            date: dataArr[i].date,
            categoryName: "assets"
          }
        ];
      }
    }

    dataSet = [
      ...dataSet,
      {
        order: 7,

        label: ["Asset or Investments"],
        backgroundColor: categoriesInfo.assets.color, // "#26A9EB",
        borderColor: categoriesInfo.assets.color, //"#26A9EB",
        data: [...data]
      }
    ];
    // }
    this.getCurrentYearLiabilitiesData(
      apiData,
      dataSet,
      totalConvertedAmount,
      0,
      maxAmount,
      hedgingDataset,
      newProps
    );
  };
  getCurrentYearLiabilitiesData = (
    apiData,
    dataSet,
    maxY,
    maxX,
    maxAmount,
    hedgingDataset,
    newProps
  ) => {
    let totalConvertedAmount = 0;

    //if (this.state.year == 0) {
    let dataArr = apiData.liabilities.filter(x => {
      if (
        x.currencyCode !== this.props.functionalCurrency &&
        new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
        new Date(x.date) < this.getDateAfterXYears(2 + this.state.year)
      ) {
        return x;
      }
    });

    let dateVisited = [];
    let data = [];

    for (let i = 0; i < dataArr.length; i++) {
      if (!dateVisited.includes(dataArr[i].date)) {
        dateVisited = [...dateVisited, dataArr[i].date];

        let arrReceivables = dataArr.filter(x => x.date === dataArr[i].date);

        let totalConvertedAmount = 0;
        let totalAmount = 0;

        totalConvertedAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.convertedValueBeforeHedge;
          }, 0) + totalConvertedAmount;

        totalAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.amount;
          }, 0) + totalAmount;

        let hedgeAmount = 0,
          hedgeToolTip = "";
        for (let i = 0; i < arrReceivables.length; i++) {
          if (arrReceivables[i].riskHedgeModels) {
            let hedgeData = this.getLinkedDealsData(
              arrReceivables[i].riskHedgeModels,
              newProps
            );

            hedgeAmount = arrReceivables[i].hedgedAmount;
              // hedgeData.reduce(function(_this, val) {
              //   return _this + val.currencyBought;
              // }, 0) + hedgeAmount;
            hedgeToolTip = this.getHedgeToolTip(hedgeData);
          }
        }

        const radiusObj = this.calculateRadius(
          totalConvertedAmount,
          maxAmount,
          "liabilities"
        );

        if (hedgeAmount > 0) {
          const hedgingRadiusObj = this.calculateHedgeRadius(
            hedgeAmount,
            totalAmount,
            radiusObj,
            "liabilities"
          );

          hedgingDataset = [
            ...hedgingDataset,
            {
              x: this.getDateDifference(this.state.startDate, dataArr[i].date),

              y: -totalConvertedAmount,
              r: hedgingRadiusObj.hedgeRadius,
              toolTip:
                // "Receivables\n" +
                this.getDate(dataArr[i].date) +
                "\n" +
                hedgingRadiusObj.hedgePercent.toFixed(2) +
                "% Hedged" +
                "\nAmount Liabilities \n" +
                // hedgeAmount +
                // " " +
                hedgeToolTip +
                "\n* Not to Scale",
              name: "hedge",
              year: this.getYear(dataArr[i].date),
              date: dataArr[i].date,
              categoryName: "liabilities"
            }
          ];
        }
        data = [
          ...data,
          {
            x: this.getDateDifference(this.state.startDate, dataArr[i].date),

            y: -totalConvertedAmount,
            r: radiusObj,
            toolTip:
              this.getDate(dataArr[i].date) +
              "\nAmount \n" +
              this.getAmountToolTip(arrReceivables), //+ radiusObj.toolTip
            name: "liabilities",
            year: this.getYear(dataArr[i].date),
            date: dataArr[i].date,
            categoryName: "liabilities"
          }
        ];
      }
    }

    dataSet = [
      ...dataSet,
      {
        order: 9,
        label: ["Liabilities"],
        backgroundColor: categoriesInfo.liabilities.color, //"#f7a7f7",
        borderColor: categoriesInfo.liabilities.color, //"#f7a7f7",
        data: [...data]
      }
    ];

    this.getExternalHedgesData(
      apiData,
      dataSet,
      maxX,
      maxY,
      0,
      totalConvertedAmount,
      maxAmount,
      hedgingDataset,
      newProps
    );
  };
  getHedgeAmount = (amount, hedgePercentage) => {
    let hedgingAmount = (amount * hedgePercentage) / 100;
    return hedgingAmount;
  };
  getDateAfterXYears = y => {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + y, month, day);

    return c;
  };
  getExternalHedgeBubblePosition = dealObj => {
    if (dealObj.boughtCurrencyCode === this.props.functionalCurrency) {
      return -dealObj.currencyBought;
    } else if (dealObj.soldCurrencyCode === this.props.functionalCurrency) {
      return dealObj.currencySold;
    } else {
      let y =
        dealObj.sellConvertedValueInFunCurrency -
        dealObj.buyConvertedValueInFunCurrency;
      return y;
    }
  };
  getExternalHedgesData = (
    apiData,
    dataSet,
    maxX,
    maxY,
    minX,
    minY,
    maxAmount,
    hedgingDataset,
    newProps
  ) => {
    let dataArr = [];

    // dataArr =
    //   apiData.externalHedges &&
    //   apiData.externalHedges.filter(x => {
    //     if (
    //       new Date(x.settlementDate) >=
    //         this.getDateAfterXYears(0 + this.state.year) &&
    //       new Date(x.settlementDate) <
    //         this.getDateAfterXYears(2 + this.state.year)
    //     ) {
    //       return x;
    //     }
    //   });

    if (newProps.chartCurrentView !== "linkedHedges") {
      dataArr =
        apiData.externalHedges &&
        apiData.externalHedges.filter(x => {
          if (
            new Date(x.settlementDate) >=
              this.getDateAfterXYears(0 + this.state.year) &&
            new Date(x.settlementDate) <
              this.getDateAfterXYears(2 + this.state.year)
          ) {
            return x;
          }
        });
    } else {
      dataArr =
        apiData.externalHedges &&
        apiData.externalHedges.filter(x => {
          if (
            new Date(x.settlementDate) >=
              this.getDateAfterXYears(0 + this.state.year) &&
            new Date(x.settlementDate) <
              this.getDateAfterXYears(2 + this.state.year) &&
              !x.isLinkedHedge
          ) {
            return x;
          }
        });
    }
    let data = [];
    for (let i = 0; i < dataArr.length; i++) {
      let yPosition = this.getExternalHedgeBubblePosition(dataArr[i]);
      let currencySold = dataArr[i].currencySold,
        currencyBought = dataArr[i].currencyBought;

      const radiusObj = this.calculateRadius(currencySold, maxAmount, "hedges");

      data = [
        ...data,
        {
          x: this.getDateDifference(
            this.state.startDate,
            dataArr[i].settlementDate
          ),
          y: yPosition,
          r: radiusObj,
          toolTip:
            this.getDate(dataArr[i].settlementDate) +
            "\nCurrency Sold Amount \n" +
            formatMoney(currencySold) +
            " " +
            dataArr[i].soldCurrencyCode +
            "\nCurrency Bought Amount \n" +
            formatMoney(currencyBought) +
            " " +
            dataArr[i].boughtCurrencyCode, //+  radiusObj.toolTip
          name: "externalHedges",
          year: this.getYear(dataArr[i].settlementDate),
          date: dataArr[i].settlementDate
        }
      ];
      // }
    }
    dataSet = [
      ...dataSet,
      {
        label: ["External Hedges"],

        order: 8,

        backgroundColor: categoriesInfo.externalHedges.color, //"rgb(1, 155, 24, 1)",
        borderColor: categoriesInfo.externalHedges.color, //"rgb(1, 155, 24, 0.6)",
        data: [...data]
      }
    ];

    this.getFXForwardData(
      apiData,
      dataSet,
      maxX,
      maxY,
      minX,
      minY,
      maxAmount,
      hedgingDataset,
      newProps
    );
  };

  getFXForwardData = (
    apiData,
    dataSet,
    maxX,
    maxY,
    minX,
    minY,
    maxAmount,
    hedgingDataset,
    newProps
  ) => {
    let dataArr = [];
    // dataArr =
    //   apiData.internalHedges &&
    //   apiData.internalHedges.filter(x => {
    //     if (
    //       new Date(x.settlementDate) >=
    //         this.getDateAfterXYears(0 + this.state.year) &&
    //       new Date(x.settlementDate) <
    //         this.getDateAfterXYears(2 + this.state.year)
    //     ) {
    //       return x;
    //     }
    //   });
    if (newProps.chartCurrentView !== "linkedHedges") {
      dataArr =
        apiData.internalHedges &&
        apiData.internalHedges.filter(x => {
          if (
            new Date(x.settlementDate) >=
              this.getDateAfterXYears(0 + this.state.year) &&
            new Date(x.settlementDate) <
              this.getDateAfterXYears(2 + this.state.year)
          ) {
            return x;
          }
        });
    } else {
      dataArr =
        apiData.internalHedges &&
        apiData.internalHedges.filter(x => {
          if (
            new Date(x.settlementDate) >=
              this.getDateAfterXYears(0 + this.state.year) &&
            new Date(x.settlementDate) <
              this.getDateAfterXYears(2 + this.state.year) &&
            !x.isLinkedHedge
          ) {
            return x;
          }
        });
    }
    let dateVisited = [];
    let data = [];
    for (let i = 0; i < dataArr.length; i++) {
      let isCurrencyBought =
        dataArr[i].boughtCurrencyCode === apiData.functionalCurrency;
      let currencySold = dataArr[i].currencySold,
        currencyBought = dataArr[i].currencyBought;

      const radiusObj = this.calculateRadius(currencySold, maxAmount, "hedges");

      data = [
        ...data,
        {
          x: this.getDateDifference(
            this.state.startDate,
            dataArr[i].settlementDate
          ),
          // this.getX(
          //   month.numeric,
          //   this.getYear(dataArr[i].settlementDate) - this.currentYear
          // ),
          y: isCurrencyBought ? currencySold : -currencySold,
          r: radiusObj,
          toolTip:
            // "Receivables\n" +
            this.getDate(dataArr[i].settlementDate) +
            "\nCurrency Sold Amount \n" +
            formatMoney(currencySold) +
            " " +
            dataArr[i].soldCurrencyCode +
            "\nCurrency Bought Amount \n" +
            formatMoney(currencyBought) +
            " " +
            dataArr[i].boughtCurrencyCode, //+  radiusObj.toolTip
          name: "externalHedges",
          year: this.getYear(dataArr[i].settlementDate),
          date: dataArr[i].settlementDate
        }
      ];
      // }
    }
    dataSet = [
      ...dataSet,
      {
        label: ["FX Forward Deals"],

        order: 8,

        backgroundColor: categoriesInfo.fxForwardDeals.color, //"rgb(11, 218, 81,1)",
        borderColor: categoriesInfo.fxForwardDeals.color, //"rgb(11, 218, 81, 0.6)",
        data: [...data]
      }
    ];

    this.getReceivablesData(
      apiData,
      dataSet,
      maxX,
      maxY,
      minX,
      minY,
      maxAmount,
      hedgingDataset,
      newProps
    );
  };

  getDate = date => {
    return moment(date).format("DD MMM YYYY");
  };
  getReceivablesData = (
    apiData,
    dataSet,
    maxX,
    maxY,
    minX,
    minY,
    maxAmount,
    hedgingDataset,
    newProps
  ) => {
    let dataArr = [];
    dataArr = apiData.receivables.filter(x => {
      if (
        x.currencyCode !== this.props.functionalCurrency &&
        new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
        new Date(x.date) < this.getDateAfterXYears(2 + this.state.year)
      ) {
        return x;
      }
    });

    let dateVisited = [];
    let data = [];
    for (let i = 0; i < dataArr.length; i++) {
      if (!dateVisited.includes(dataArr[i].date)) {
        dateVisited = [...dateVisited, dataArr[i].date];
        let arrReceivables = dataArr.filter(x => x.date === dataArr[i].date);

        let totalConvertedAmount = 0;
        let totalAmount = 0;

        totalConvertedAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.convertedValueBeforeHedge;
          }, 0) + totalConvertedAmount;
        //totalConvertedAmount = this.getSensitivityAmount(totalConvertedAmount);

        totalAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.amount;
          }, 0) + totalAmount;

        let hedgeAmount = 0,
          hedgeToolTip = "";
        for (let i = 0; i < arrReceivables.length; i++) {
          if (arrReceivables[i].riskHedgeModels) {
            let hedgeData = this.getLinkedDealsData(
              arrReceivables[i].riskHedgeModels,
              newProps
            );

            hedgeAmount = arrReceivables[i].hedgedAmount;
              // hedgeData.reduce(function(_this, val) {
              //   return _this + val.currencySold;
              // }, 0) + hedgeAmount;
            hedgeToolTip = this.getHedgeToolTip(hedgeData);
          }
        }

        // let totalAmount = 0;

        // totalAmount =
        //   arrReceivables.reduce(function (_this, val) {
        //     return _this + val.amount;
        //   }, 0) + totalAmount;

        maxY = Math.max(maxY, totalConvertedAmount);
        maxX = Math.max(maxX, this.getYear(dataArr[i].date) - this.currentYear);
        const radiusObj = this.calculateRadius(
          totalConvertedAmount,
          maxAmount,
          "receivalbles"
        );

        if (hedgeAmount > 0) {
          const hedgingRadiusObj = this.calculateHedgeRadius(
            hedgeAmount,
            totalAmount,
            radiusObj,
            "receivalbles"
          );

          hedgingDataset = [
            ...hedgingDataset,
            {
              x: this.getDateDifference(this.state.startDate, dataArr[i].date),

              y: totalConvertedAmount,
              r: hedgingRadiusObj.hedgeRadius,
              toolTip:
                // "Receivables\n" +
                this.getDate(dataArr[i].date) +
                "\n" +
                hedgingRadiusObj.hedgePercent.toFixed(2) +
                "% Hedged" +
                "\nAmount Receivables \n" +
                // hedgeAmount +
                // " " +
                hedgeToolTip +
                "\n* Not to Scale",
              name: "hedge",
              year: this.getYear(dataArr[i].date),
              date: dataArr[i].date,
              categoryName: "receivables"
            }
          ];
        }
        data = [
          ...data,
          {
            // x: this.getX(
            //   month.numeric,
            //   this.getYear(dataArr[i].date) - this.currentYear
            // ),
            x: this.getDateDifference(this.state.startDate, dataArr[i].date),

            y: totalConvertedAmount,
            r: radiusObj,
            toolTip:
              // "Receivables\n" +
              // month.name +
              // ", " +
              // this.getYear(dataArr[i].date)
              this.getDate(dataArr[i].date) +
              "\nAmount \n" +
              this.getAmountToolTip(arrReceivables), //+ radiusObj.toolTip
            name: "receivables",
            year: this.getYear(dataArr[i].date),
            date: dataArr[i].date,
            categoryName: "receivables"
          }
        ];
      }
    }
    dataSet = [
      ...dataSet,
      {
        label: ["Receivables"],

        order: 3,

        backgroundColor: categoriesInfo.receivables.color, //"#00EDCD",
        borderColor: categoriesInfo.receivables.color, //"#00EDCD",
        data: [...data]
      }
    ];

    this.getForecastedRevenuesData(
      apiData,
      dataSet,
      maxX,
      maxY,
      minX,
      minY,
      maxAmount,
      hedgingDataset,
      newProps
    );
  };

  getForecastedRevenuesData = (
    apiData,
    dataSet,
    maxX,
    maxY,
    minX,
    minY,
    maxAmount,
    hedgingDataset,
    newProps
  ) => {
    let dataArr = [];

    dataArr = apiData.forecastedRevenues.filter(x => {
      if (
        x.currencyCode !== this.props.functionalCurrency &&
        new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
        new Date(x.date) < this.getDateAfterXYears(2 + this.state.year)
      ) {
        return x;
      }
    });

    let dateVisited = [];
    let data = [];
    for (let i = 0; i < dataArr.length; i++) {
      if (!dateVisited.includes(dataArr[i].date)) {
        dateVisited = [...dateVisited, dataArr[i].date];
        let arrReceivables = dataArr.filter(x => x.date === dataArr[i].date);

        let totalConvertedAmount = 0;
        let totalAmount = 0;

        totalConvertedAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.convertedValueBeforeHedge;
          }, 0) + totalConvertedAmount;
        totalAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.amount;
          }, 0) + totalAmount;
        //totalConvertedAmount = this.getSensitivityAmount(totalConvertedAmount);

        let hedgeAmount = 0,
          hedgeToolTip = "";
        for (let i = 0; i < arrReceivables.length; i++) {
          if (arrReceivables[i].riskHedgeModels) {
            let hedgeData = this.getLinkedDealsData(
              arrReceivables[i].riskHedgeModels,
              newProps
            );

            hedgeAmount = arrReceivables[i].hedgedAmount;
              // hedgeData.reduce(function(_this, val) {
              //   return _this + val.currencySold;
              // }, 0) + hedgeAmount;
            hedgeToolTip = this.getHedgeToolTip(hedgeData);
          }
        }

        maxY = Math.max(maxY, totalConvertedAmount);
        maxX = Math.max(maxX, this.getYear(dataArr[i].date) - this.currentYear);
        const radiusObj = this.calculateRadius(
          totalConvertedAmount,
          maxAmount,
          "forecastedRevenues"
        );
        if (hedgeAmount > 0) {
          const hedgingRadiusObj = this.calculateHedgeRadius(
            hedgeAmount,
            totalAmount,
            radiusObj,
            "forecastedRevenues"
          );

          hedgingDataset = [
            ...hedgingDataset,
            {
              x: this.getDateDifference(this.state.startDate, dataArr[i].date),

              y: totalConvertedAmount,
              r: hedgingRadiusObj.hedgeRadius,
              toolTip:
                // "Receivables\n" +
                this.getDate(dataArr[i].date) +
                "\n" +
                hedgingRadiusObj.hedgePercent.toFixed(2) +
                "% Hedged" +
                "\nAmount Forecasted Revenues \n" +
                // hedgeAmount +
                // " " +
                hedgeToolTip +
                "\n* Not to Scale",
              name: "hedge",
              year: this.getYear(dataArr[i].date),
              date: dataArr[i].date,
              categoryName: "forecastedRevenues"
            }
          ];
        }

        data = [
          ...data,
          {
            // x: this.getX(
            //   month.numeric,
            //   this.getYear(dataArr[i].date) - this.currentYear
            // ),
            x: this.getDateDifference(this.state.startDate, dataArr[i].date),
            y: totalConvertedAmount,
            r: radiusObj,
            toolTip:
              // "Forecasted Revenues \n" +
              this.getDate(dataArr[i].date) +
              "\nAmount \n" +
              this.getAmountToolTip(arrReceivables), //+       radiusObj.toolTip
            name: "forecastedRevenues",
            year: this.getYear(dataArr[i].date),
            date: dataArr[i].date,
            categoryName: "forecastedRevenues"
          }
        ];
      }
    }
    dataSet = [
      ...dataSet,
      {
        label: ["Forecasted Revenues"],
        order: 4,
        backgroundColor: categoriesInfo.forecastedRevenues.color, //"#FFFB04",
        borderColor: categoriesInfo.forecastedRevenues.color, //"#FFFB04",
        data: [...data]
      }
    ];
    this.getForecastedCostsData(
      apiData,
      dataSet,
      maxX,
      maxY,
      minX,
      minY,
      maxAmount,
      hedgingDataset,
      newProps
    );
  };

  getForecastedCostsData = (
    apiData,
    dataSet,
    maxX,
    maxY,
    minX,
    minY,
    maxAmount,
    hedgingDataset,
    newProps
  ) => {
    let dataArr = [];

    dataArr = apiData.forecastedCosts.filter(x => {
      if (
        x.currencyCode !== this.props.functionalCurrency &&
        new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
        new Date(x.date) < this.getDateAfterXYears(2 + this.state.year)
      ) {
        return x;
      }
    });

    let dateVisited = [];
    let data = [];

    for (let i = 0; i < dataArr.length; i++) {
      if (!dateVisited.includes(dataArr[i].date)) {
        dateVisited = [...dateVisited, dataArr[i].date];
        let arrReceivables = dataArr.filter(x => x.date === dataArr[i].date);

        let totalConvertedAmount = 0;
        let totalAmount = 0;
        totalConvertedAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.convertedValueBeforeHedge;
          }, 0) + totalConvertedAmount;
        //totalConvertedAmount = this.getSensitivityAmount(totalConvertedAmount);

        totalAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.amount;
          }, 0) + totalAmount;

        let hedgeAmount = 0,
          hedgeToolTip = "";
        for (let i = 0; i < arrReceivables.length; i++) {
          if (arrReceivables[i].riskHedgeModels) {
            let hedgeData = this.getLinkedDealsData(
              arrReceivables[i].riskHedgeModels,
              newProps
            );

            hedgeAmount = arrReceivables[i].hedgedAmount;
              // hedgeData.reduce(function(_this, val) {
              //   return _this + val.currencyBought;
              // }, 0) + hedgeAmount;
            hedgeToolTip = this.getHedgeToolTip(hedgeData);
          }
        }

        // let totalAmount = 0;

        // totalAmount =
        //   arrReceivables.reduce(function (_this, val) {
        //     return _this + val.amount;
        //   }, 0) + totalAmount;

        minY = Math.max(minY, totalConvertedAmount);
        maxX = Math.max(maxX, this.getYear(dataArr[i].date) - this.currentYear);

        const radiusObj = this.calculateRadius(totalConvertedAmount, maxAmount);

        if (hedgeAmount > 0) {
          // let hedgeAmount = this.getHedgeAmount(
          //   totalConvertedAmount,
          //   apiData.forecastedCosts.hedgePercentage
          // );

          const hedgingRadiusObj = this.calculateHedgeRadius(
            hedgeAmount,
            totalAmount,
            radiusObj,
            "forecastedCosts"
          );

          hedgingDataset = [
            ...hedgingDataset,
            {
              x: this.getDateDifference(this.state.startDate, dataArr[i].date),

              y: -totalConvertedAmount,
              r: hedgingRadiusObj.hedgeRadius,
              toolTip:
                // "Receivables\n" +
                this.getDate(dataArr[i].date) +
                "\n" +
                hedgingRadiusObj.hedgePercent.toFixed(2) +
                "% Hedged" +
                "\nAmount Forecasted Costs \n" +
                // hedgeAmount +
                // " " +
                hedgeToolTip +
                "\n* Not to Scale",
              name: "hedge",
              year: this.getYear(dataArr[i].date),
              date: dataArr[i].date,
              categoryName: "forecastedCosts"
            }
          ];
        }

        data = [
          ...data,
          {
            x: this.getDateDifference(this.state.startDate, dataArr[i].date),

            y: -totalConvertedAmount,
            r: radiusObj,
            toolTip:
              // "Forecasted Cost \n" +
              this.getDate(dataArr[i].date) +
              "\nAmount \n" +
              this.getAmountToolTip(arrReceivables), //+       radiusObj.toolTip
            name: "forecastedCosts",
            year: this.getYear(dataArr[i].date),
            date: dataArr[i].date,
            categoryName: "forecastedCosts"
          }
        ];
      }
    }
    dataSet = [
      ...dataSet,
      {
        label: ["Forecasted Costs"],
        order: 5,
        backgroundColor: categoriesInfo.forecastedCosts.color, //"#04ECFF",
        borderColor: categoriesInfo.forecastedCosts.color, //"#04ECFF",
        data: [...data]
      }
    ];

    this.getPayablesRevenuesData(
      apiData,
      dataSet,
      maxX,
      maxY,
      minX,
      minY,
      maxAmount,
      hedgingDataset,
      newProps
    );
  };

  getHedgeToolTip = arr => {
    let toolTip = "";

    arr.forEach(x => {
      toolTip =
        toolTip +
        "Bought " +
        formatMoney(x.currencyBought) +
        " " +
        x.boughtCurrencyCode +
        " Sold " +
        formatMoney(x.currencySold) +
        " " +
        x.soldCurrencyCode +
        "\n";
    });
    return toolTip;
  };

  getPayablesRevenuesData = (
    apiData,
    dataSet,
    maxX,
    maxY,
    minX,
    minY,
    maxAmount,
    hedgingDataset,
    newProps
  ) => {
    let dataArr = [];

    dataArr = apiData.payables.filter(x => {
      if (
        x.currencyCode !== this.props.functionalCurrency &&
        new Date(x.date) >= this.getDateAfterXYears(0 + this.state.year) &&
        new Date(x.date) < this.getDateAfterXYears(2 + this.state.year)
      ) {
        return x;
      }
    });

    let dateVisited = [];
    let data = [];

    for (let i = 0; i < dataArr.length; i++) {
      if (!dateVisited.includes(dataArr[i].date)) {
        dateVisited = [...dateVisited, dataArr[i].date];
        let arrReceivables = dataArr.filter(x => x.date === dataArr[i].date);

        let convertedValueBeforeHedge = 0;
        let totalAmount = 0;
        convertedValueBeforeHedge =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.convertedValueBeforeHedge;
          }, 0) + convertedValueBeforeHedge;

        totalAmount =
          arrReceivables.reduce(function(_this, val) {
            return _this + val.amount;
          }, 0) + totalAmount;

        let hedgeAmount = 0,
          hedgeToolTip = "";
        for (let i = 0; i < arrReceivables.length; i++) {
          if (arrReceivables[i].riskHedgeModels) {
            let hedgeData = this.getLinkedDealsData(
              arrReceivables[i].riskHedgeModels,
              newProps
            );

            hedgeAmount = arrReceivables[i].hedgedAmount;
              // hedgeData.reduce(function(_this, val) {
              //   return _this + val.currencyBought;
              // }, 0) + hedgeAmount;
            hedgeToolTip = this.getHedgeToolTip(hedgeData);
          }
        }

        minY = Math.max(minY, convertedValueBeforeHedge);
        maxX = Math.max(maxX, this.getYear(dataArr[i].date) - this.currentYear);
        const radiusObj = this.calculateRadius(
          convertedValueBeforeHedge,
          maxAmount
        );

        if (hedgeAmount > 0) {
          const hedgingRadiusObj = this.calculateHedgeRadius(
            hedgeAmount,
            totalAmount,
            radiusObj,
            "payables"
          );

          hedgingDataset = [
            ...hedgingDataset,
            {
              x: this.getDateDifference(this.state.startDate, dataArr[i].date),

              y: -convertedValueBeforeHedge,
              r: hedgingRadiusObj.hedgeRadius,
              toolTip:
                // "Receivables\n" +
                this.getDate(dataArr[i].date) +
                "\n" +
                hedgingRadiusObj.hedgePercent.toFixed(2) +
                "% Hedged" +
                "\nAmount Payables \n" +
                // hedgeAmount +
                // " " +
                // hedgeCurrency +
                hedgeToolTip +
                "\n* Not to Scale",
              name: "hedge",
              year: this.getYear(dataArr[i].date),
              date: dataArr[i].date,
              categoryName: "payables"
            }
          ];
        }

        data = [
          ...data,
          {
            x: this.getDateDifference(this.state.startDate, dataArr[i].date),

            y: -convertedValueBeforeHedge,
            r: radiusObj,
            toolTip:
              // "Payables \n" +
              this.getDate(dataArr[i].date) +
              "\nAmount \n" +
              this.getAmountToolTip(arrReceivables), //+       radiusObj.toolTip
            name: "payables",
            year: this.getYear(dataArr[i].date),
            date: dataArr[i].date,
            categoryName: "payables"
          }
        ];
      }
    }
    dataSet = [
      ...dataSet,
      {
        label: ["Payables"],
        order: 2,
        backgroundColor: categoriesInfo.payables.color, //"#6161ea",
        borderColor: categoriesInfo.payables.color, //"#6161ea",
        data: [...data]
      }
    ];
    if (newProps.chartCurrentView === "linkedHedges") {
      dataSet.push({
        label: ["Hedge"],
        order: 1,
        backgroundColor: HEDGECOLOR, //"#11FF00",
        borderColor: HEDGECOLOR, //"#11FF00",
        data: [...hedgingDataset]
      });
    }

    this.getMinMax(apiData, dataSet, maxX, maxY, minX, minY);
  };

  getAmountToolTip = data => {
    const toolTip = data.map(obj => {
      return formatMoney(obj.amount) + " " + obj.currencyCode;
    });
    return toolTip.join("\n");
  };
  getMinMax = (apiData, dataSet, maxX, maxY, minX, minY) => {
    let bubbleChartData = { ...this.state.bubbleChartData };
    bubbleChartData.datasets = dataSet;
    maxX = maxX + 1;

    this.setState({
      bubbleChartData,
      // maxX,
      minX,
      minY: -this.getMax(minY),
      maxY: this.getMax(maxY),
      key: this.state.key + 1
    });
  };

  getMax = value => {
    return value + value / 4;
  };

  calculateHedgeRadius = (
    hedgeAmount,
    categoryAmount,
    categoryRadius,
    category
  ) => {
    let percent = (hedgeAmount / categoryAmount) * 100;
    let hedgeRadius = 0;

    if (percent === 0) {
      hedgeRadius = 0;
    } else if (percent > 0 && percent <= 90) {
      hedgeRadius = (categoryRadius * 30) / 100;
    } else if (percent > 90) {
      hedgeRadius = (categoryRadius * 70) / 100;
    }
    // let hedgeRadius = (categoryRadius * percent) / 100;

    return { hedgeRadius: hedgeRadius, hedgePercent: percent };
  };
  calculateRadius = (totalAmount, maxAmount, category) => {
    let percent = (totalAmount / maxAmount) * 100;
    // r=r>0?Math.max(r, 2):0
    // return r
    if (percent === 0) {
      return 0;
    } else if (percent > 0 && percent <= 30) {
      return 5;
    } else if (percent >= 31 && percent <= 60) {
      return 9;
    } else if (percent >= 61 && percent <= 99) {
      return 12;
    } else {
      return 15;
    }
  };

  zoom = zoomIn => {
    let rect = this.chartRef.current.chartInstance.canvas.getBoundingClientRect();

    if (zoomIn) {
      this.chartRef.current.chartInstance["$zoom"].zoomChart(rect, 0.1);
    } else {
      this.chartRef.current.chartInstance["$zoom"].zoomChart(rect, -0.1);
    }
  };
  resetZoom = () => {
    this.chartRef.current.chartInstance.resetZoom();
  };
  changeYear = increment => {
    let year = this.state.year + increment;
    let monthsEscaped = this.state.monthsEscaped;

    let maxX = 366;
    if (year == 0) {
      maxX = 732;
      monthsEscaped = 0;
    } else if (year < 0) {
      maxX = 732;
      monthsEscaped = monthsEscaped - 12;
    } else {
      maxX = 732;
      monthsEscaped = monthsEscaped + 12;
    }

    this.setState(
      {
        year: year,

        maxX: maxX,
        startDate: this.getDateAfterXYears(year),
        monthsEscaped: monthsEscaped
      },
      () => {
        this.createDataSet(this.props.parsedRiskRadarData.risks, this.props);
      }
    );
  };
  render() {
    const { classes } = this.props;

    return (
      <>
        <GridContainer justify="center">
          <GridContainer>
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
              style={{ textAlign: "center", backgroundColor: "black" }}
            >
              {/* <GridContainer>
             
            
              <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ textAlign: "center", backgroundColor: "black" }}

            >  */}
              <Fullscreen
                enabled={this.state.isFullScreen}
                onChange={isFull => this.setState({ isFullScreen: isFull })}
              >
                <Bubble
                  ref={this.chartRef}
                  key={this.state.key}
                  data={this.state.bubbleChartData}
                  options={{
                    legend: {
                      display: false,
                      labels: {
                        fontColor: "#ffffff"
                      },
                      onClick: () => {}
                    },
                    plugins: {
                      zoom: {
                        // Container for pan options
                        pan: {
                          enabled: true,
                          mode: "xy",
                          speed: 1
                        },
                        zoom: {
                          enabled: true,
                          //drag:true,
                          mode: "xy"
                        }
                      }
                    },

                    responsive: !this.props.printComponent,
                    maintainAspectRatio: !this.props.printComponent,

                    tooltips: {
                      callbacks: {
                        label: (tooltipItems, data) => {
                          return data.datasets[tooltipItems.datasetIndex]
                            .label[0];
                          // let value =
                          //   tooltipItems.datasetIndex === 0
                          //     ? chartsData.grossMarginPercentageData[
                          //         tooltipItems.index
                          //       ] + "%"
                          //     : tooltipItems.yLabel;
                          // return (
                          //   data.datasets[tooltipItems.datasetIndex].label +
                          //   ": " +
                          //   value
                          // );
                        },
                        afterLabel: (tooltipItems, data) => {
                          return data.datasets[tooltipItems.datasetIndex].data[
                            tooltipItems.index
                          ].toolTip.split("\n");
                        }
                      }
                    },
                    scales: {
                      xAxes: [
                        {
                          id: "0",
                          type: "linear",
                          gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                            zeroLineColor: "white"
                          },
                          ticks: {
                            fontColor: "#ffffff",
                            max: this.state.maxX,
                            min: 0,
                            stepSize: 1,
                            autoSkip: true,

                            maxTicksLimit: 766,
                            userCallback: (item, index) => {
                              let month = item / 30;
                              if (0 == item) {
                                return this.state.year + " yr";
                              } else if (DAYSINONEYEAR == item) {
                                // let yr=this.state.year<0?'':this.state.year==0?(this.state.year+1+' yr'):(this.state.year+2+' yr')
                                let yr = this.state.year + 1 + " yr";

                                return yr;
                              } else if (DAYSINTWOYEARS == item) {
                                let yr = this.state.year + 2;
                                return yr + " yr";
                              } else if (
                                month % 3 == 0 &&
                                (month != 12 && month != 24)
                              ) {
                                return this.state.monthsEscaped + month + " m";
                              }
                            }
                            //  callback: (label)=> {
                            // //   // let xLabel=DAYSINONEYEAR-this.state.dayOfYear

                            // //   //return label % 1 != 0 ? "" : xLabel + "y";
                            // //   // if(label==xLabel){
                            // //   //   return '1 yr'
                            // //   // }
                            // //   // else if(label==DAYSINTWOYEARS){
                            // //   //   return '2 yr'
                            // //   // }
                            // //   // else{
                            //     return label
                            // //   // }
                            // //   //return ''
                            //  }
                          }
                        }
                      ],
                      yAxes: [
                        {
                          id: "1",
                          type: "linear",
                          gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                            zeroLineColor: "white"
                          },
                          scaleLabel: {
                            display: true,
                            fontColor: "#ffffff",
                            labelString:
                              "All amounts in " + this.props.functionalCurrency
                          },
                          ticks: {
                            fontColor: "#ffffff",
                            // max: this.state.maxY,
                            // min: this.state.minY,
                            callback: function(label) {
                              return formatMoney(label);
                            }
                          }
                        }
                      ]
                    },
                    onClick: (e, item) => {
                      if (item.length > 0) {
                        const datasets = this.state.bubbleChartData.datasets;
                        var data = datasets[item[0]._datasetIndex];

                        if (
                          data.data[item[0]._index].name != "externalHedges"
                        ) {
                          const dataset = data.data[item[0]._index];
                          this.props.displayTable(
                            dataset,
                            dataset.categoryName,
                            true
                          );
                        } else {
                          this.props.resetDataHideTable();
                        }
                      }
                    }
                  }}
                  width={this.props.printComponent ? 700 : 600}
                  height={this.props.printComponent ? 400 : 300}
                />
              </Fullscreen>
            </GridItem>

            {/* </GridContainer>
          </GridItem> */}
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
          <GridContainer justify="center">
            <GridItem
              xs={10}
              sm={10}
              md={10}
              lg={10}
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              {CATEGORYKEYS.map((y, i) => {
                let x = categoriesInfo[y];
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block"
                    }}
                  >
                    <span
                      style={{
                        width: "40px",
                        height: "10px",
                        backgroundColor: x.color,
                        display: "inline-block",
                        marginRight: 10
                      }}
                    />
                    <span style={{ marginRight: 22, fontSize: 12 }}>
                      {x.label}
                    </span>
                  </span>
                );
              })}
            </GridItem>
          </GridContainer>
        </GridContainer>
      </>
    );
  }
}
BubbleChart.propTypes = {
  classes: PropTypes.object.isRequired,
  parsedRiskRadarData: PropTypes.object,
  pastRiskRadarData: PropTypes.object,
  isChanged: PropTypes.any,
  functionalCurrency: PropTypes.object
};
export default withRouter(withStyles(style)(BubbleChart));
