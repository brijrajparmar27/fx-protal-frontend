import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import { FormControl, IconButton } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { formatDate, formatMoney, parseCurrency } from "../../../utils/Utils";
import { validate } from "../../../utils/Validator";
import Radio from "@material-ui/core/Radio";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import { Doughnut, HorizontalBar } from "react-chartjs-2";
import ReactSlider from "react-slider";
import cx from "classnames";
// import "chartjs-plugin-labels";
import ChartDataLabels from "chartjs-plugin-datalabels";
// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

const GREEN_HEDGE_COLOR = "#5cd65c"; //'#0af205'

const CATEGORIESINFO = [
  // {key :'existingAssets',color:"#04b7f380",label:'Asset or Investments',hedgeColor:'#04b7f3', displayName:'Asset or Investments'},
  // {key :'existingLiabilities',color:"#f7a7f7cc",label:'Liabilities',hedgeColor:'#f7a7f7', displayName:'Asset or Investments'},
  {
    key: "ASSETS",
    label: "Asset or Investments",
    displayName: "Asset or Investments",
    color: "#26A9EB"
  },
  {
    key: "LIABILITIES",
    label: "Liabilities",
    displayName: "Liabilities",
    color: "#f7a7f7"
  },
  {
    key: "PAYABLES",
    label: "Payables",
    displayName: "Payables",
    color: "#6161ea"
  },
  {
    key: "RECEIVABLES",
    label: "Receivables",
    displayName: "Receivables",
    color: "#750c26" // "#ff3579"
  },
  {
    key: "FORECASTED_REVENUES",
    label: "Forecasted Revenues",
    displayName: "Forecasted Revenues",
    color: "#FFA500"
  },
  {
    key: "FORECASTED_COSTS",
    label: "Forecasted Costs",
    displayName: "Forecasted Costs",
    color: "#AE88FF"
  }
];

const categoriesColor = [
  "#26A9EB",
  "#f7a7f7",
  "#6161ea",
  "#750c26", // "#ff3579",
  "#FFA500",
  "#AE88FF"
];
const hedgeColor = [
  "#26A9EB80",
  "#f7a7f7cc",
  "#6161ea80",
  "#750c2680",
  "#FFA50080",
  "#AE88FF80"
];
const COLORCODE = [
  "#FFA07A",
  "#FA8072",
  "#E9967A",
  "#F08080",
  "#CD5C5C",
  "#DC143C",
  "#B22222",
  "#FF0000",
  "#8B0000",
  "#FF6347",
  "#DB7093",
  "#FF2400",
  "#FA8072",
  "#7C0A02",
  "#ED2939",
  "#CD5C5C",
  "#E0115F",
  "#960018"
  // "#eb7d3c",
  // "#fdbf2d",
  // "#5e9cd3",
  // "#7248b1",
  // "#284576",
  // "#9c4819",
  // "#636363",
  // "#987217",
  // "#285f8f",
  // "#44672e",
  // "#6b8fce",
  // "#ef9760"
];
const TABLECOLUMNKEYDATE = [
  "amount",
  "hedgedAmount",
  "exchangeRate",
  "convertedValueBeforeHedge",
  "convertedValueHedge",
  "appreciatedRiskAmt",
  "depreciatedRiskAmt",
  "dueDate"
];
const TABLECOLUMNNAMEDATE = [
  "Amount",
  "Hedge",
  "Exchange Rate",
  "Converted Amount",
  "Converted Hedge",
  "Appreciated Risk Amount",
  "Depreciated Risk Amount",
  "Date"
];

const RISK_CATEGORY_INFO = {
  assets: {
    key: "assets",
    type: "ASSETS",
    hedgingPercentageKey: "hedgingPercentageAssets",
    operator: "minus"
  },

  liabilities: {
    key: "liabilities",
    type: "LIABILITIES",
    hedgingPercentageKey: "hedgingPercentageLiabilities",
    operator: "plus"
  },

  payables: {
    key: "payables",
    type: "PAYABLES",
    hedgingPercentageKey: "hedgingPercentagePayables",
    operator: "plus"
  },

  receivables: {
    key: "receivables",
    type: "RECEIVABLES",
    hedgingPercentageKey: "hedgingPercentageReceivables",
    operator: "minus"
  },

  forecastedrevenues: {
    key: "forecastedRevenues",
    type: "FORECASTED_REVENUES",
    hedgingPercentageKey: "hedgingPercentageForecastedRevenues",
    operator: "minus"
  },

  forecastedcosts: {
    key: "forecastedCosts",
    type: "FORECASTED_COSTS",
    hedgingPercentageKey: "hedgingPercentageForecastedCosts",
    operator: "plus"
  }

  // externalHedges: {key:'externalHedges', type:'ASSETS'}
};

const senstitivityOptions = [
  { name: "1%", value: "1", disabled: false },
  { name: "2%", value: "2", disabled: false },
  { name: "5%", value: "5", disabled: false },
  { name: "10%", value: "10", disabled: false },
  { name: "20%", value: "20", disabled: false },
  { name: "25%", value: "25", disabled: false },
  // { name: "Specify a %", value: "specify", disabled: false },
  // { name: "Current Volatility", value: "-1", disabled: true }
];
// const arrKeys=['existingAssets','existingLiabilities''forecastedCosts']
// const arrAngle=[150,90,30]
const style = {
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff"
    // padding: "50px 30px 60px 50px"
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
    paddingRight: 20
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
  horizontalSlider: {
    width: "95%",
    maxWidth: 500,
    height: 50,
    top: 10,
    // border: '1px solid grey',
    "& sliderThumb": {
      top: 1,
      width: 50,
      height: 48,
      lineHeight: 38
    },
    "& sliderTrack": {
      top: 10,
      height: 10
    }
  },
  sliderThumb: {
    fontSize: "0.9em",
    textAlign: "center",
    backgroundColor: "#000",
    color: "#FFF",
    cursor: "pointer",
    border: "5px solid gray",
    boxSizing: "border-box"
  },
  sliderTrack: {
    position: "relative",
    background: "#0000001a",
    top: 10,
    height: 10
  },
  legendBox: {
    margin: 6,
    padding: "3px !important",
    background: "#F5F5F5",
    fontSize: "15px"
  },

  ...customInputStyle,
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class RiskImpact extends React.Component {
  error = {
    profitOtherNameErrorMsg: {
      required: "Specify Name of Profit"
    },
    profitAmountErrorMsg: {
      required: "Profit Amount is required",
      positive: "Profit Amount should be positive number"
    },
    senstitivityPercentageErrorMsg: {
      required: "Senstitivity Percentage value is required",
      range: "Senstitivity percentage value should be between 0 to 100"
    },
    modelSenstitivityPercentageErrorMsg: {
      required: "Senstitivity Percentage value is required",
      range: "Senstitivity percentage value should be between 0 to 100"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      legendData: [...CATEGORIESINFO],
      riskScenarioLegendDisplayData: [],
      legendDisplayData: [],
      showLegend: true,
      riskScenarioLegendData: [...CATEGORIESINFO],
      showRiskScenarioLegend: false,

      checkedIndividualHedgeSlider: true,
      totalConvertedAmount: 0,
      horizontalBarKey: 0,
      horizontalBarDataset: { labels: ["Profit"], datasets: [] },
      horizontalBarToolTip: "",
      key: 0,
      doughnutScenarioChartKey: 0,
      canvasWidth: "600",
      canvasHeight: "600",
      offsetX: 0,
      offsetY: 0,
      circles: [],
      showTable: false,
      tableColumns: [],
      tableData: [],
      tableTitle: "",
      legendTableData: [
        [0, "Total Profit Amount ", ""],
        [1, "Inward Profit Amount ", ""],
        [2, "Outward Profit Amount ", ""]
      ],
      doughnutChartData: {
        labels: [],
        datasets: []
      },
      doughnutScenarioChartData: {
        labels: [],
        datasets: []
      },
      currencyImpactChartData: {
        labels: [],
        datasets: []
      },
      barChartData: {
        labels: [],
        datasets: []
      },
      barChartKey: 0,
      barChartScenarioBasedData: {
        labels: [],
        datasets: []
      },
      barChartScenarioBasedKey: 0,
      currencyScenarioBasedImpactChartData: {
        labels: [],
        datasets: []
      },
      currencyScenarioBasedImpactChartKey: 0,
      currencyColorCode: [],
      colorIndex: 0,

      currencyImpactChartKey: 0,
      riskAmount: "0",
      hedgeAmount: "0",
      riskScenarioAmount: "0",
      hedgeScenarioAmount: "0",
      isChanged: false,

      functionalCurrency: "",
      senstitivitySelected: "",
      senstitivitySelectedState: "",
      senstivityPercentage: "",
      senstitivityPercentageState: "",
      senstitivityPercentagePristine: false,
      senstitivityPercentageErrorMsg: [],

      modelSenstitivitySelected: "",
      modelSenstitivitySelectedState: "",
      modelSenstitivityPercentage: "",
      modelSenstitivityPercentageState: "",
      modelSenstitivityPercentagePristine: false,
      modelSenstitivityPercentageErrorMsg: [],

      hedgingPercentagePayables: "",
      hedgingPercentageReceivables: "",
      hedgingPercentageForecastedRevenues: "",
      hedgingPercentageAllCategories: "",
      hedgingPercentageForecastedCosts: "",
      hedgingPercentageAssets: "",
      hedgingPercentageLiabilities: "",

      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      tempSenstivityPercentageSelected: ""
    };
    this.canvasRef = React.createRef();
    this.canvasParent = React.createRef();
    this.toolTipRef = React.createRef();
  }
  componentDidMount() {
    // console.log("RiskImpact - componentDidMount");
    const {
      riskRadarData,
      functionalCurrency,
      senstivityPercentage,
      parsedRiskRadarData
    } = this.props;
    //adding heding amount
    if (parsedRiskRadarData && riskRadarData && riskRadarData.risks) {
      this.setState(
        {
          totalConvertedAmount: this.getTotalSenstivityAmount(riskRadarData)
        },
        () => {
          this.getSensitivityHedgingData(
            riskRadarData,
            functionalCurrency,
            senstivityPercentage,
            parsedRiskRadarData
          );
        }
      );
    }
  }
  getSensitivityHedgingData = (
    riskRadarData,
    functionalCurrency,
    senstivityPercentage,
    parsedRiskRadarData
  ) => {
    const { convertedRiskBeforeHedge, convertedRiskHedge } = riskRadarData;

    const stateData = {
      functionalCurrency: functionalCurrency,
      senstitivitySelected: senstivityPercentage,
      senstivityPercentage: senstivityPercentage,

      modelSenstitivitySelected: senstivityPercentage,
      modelSenstitivityPercentage: senstivityPercentage,

      // hedgingPercentagePayables:
      //   convertedRiskBeforeHedge.PAYABLES && convertedRiskHedge.PAYABLES
      //     ? (convertedRiskHedge.PAYABLES * 100) /
      //       convertedRiskBeforeHedge.PAYABLES
      //     : 0,
      // hedgingPercentageReceivables:
      //   convertedRiskBeforeHedge.RECEIVABLES && convertedRiskHedge.RECEIVABLES
      //     ? (convertedRiskHedge.RECEIVABLES * 100) /
      //       convertedRiskBeforeHedge.RECEIVABLES
      //     : 0,
      // hedgingPercentageForecastedRevenues:
      //   convertedRiskBeforeHedge.FORECASTED_REVENUES &&
      //   convertedRiskHedge.FORECASTED_REVENUES
      //     ? (convertedRiskHedge.FORECASTED_REVENUES * 100) /
      //       convertedRiskBeforeHedge.FORECASTED_REVENUES
      //     : 0,
      // hedgingPercentageForecastedCosts:
      //   convertedRiskBeforeHedge.FORECASTED_COSTS &&
      //   convertedRiskHedge.FORECASTED_COSTS
      //     ? (convertedRiskHedge.FORECASTED_COSTS * 100) /
      //       convertedRiskBeforeHedge.FORECASTED_COSTS
      //     : 0,
      // hedgingPercentageAssets:
      //   convertedRiskBeforeHedge.ASSETS && convertedRiskHedge.ASSETS
      //     ? (convertedRiskHedge.ASSETS * 100) / convertedRiskBeforeHedge.ASSETS
      //     : 0,
      // hedgingPercentageLiabilities:
      //   convertedRiskBeforeHedge.LIABILITIES && convertedRiskHedge.LIABILITIES
      //     ? (convertedRiskHedge.LIABILITIES * 100) /
      //       convertedRiskBeforeHedge.LIABILITIES
      //     : 0
      hedgingPercentagePayables: 0,
      hedgingPercentageReceivables: 0,
      hedgingPercentageForecastedRevenues: 0,
      hedgingPercentageForecastedCosts: 0,
      hedgingPercentageAssets: 0,
      hedgingPercentageLiabilities: 0
    };
    this.setState(stateData, async () => {
      await this.createCategoriesCircleDataSet(riskRadarData);
      await this.createScenarioBasedCircleDataSet(
        riskRadarData,
        parsedRiskRadarData
      );
      await this.createCurrencyRiskPieChart(riskRadarData, parsedRiskRadarData);
      // await this.createScenarioBasedCurrencyRiskPieChart(
      //   parsedRiskRadarData,
      //   riskRadarData
      // );
    });
  };
  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      this.props.isChanged !== newProps.isChanged &&
      newProps.parsedRiskRadarData &&
      newProps.riskRadarData &&
      newProps.riskRadarData.risks
    ) {
      const {
        riskRadarData,
        functionalCurrency,
        senstivityPercentage,
        parsedRiskRadarData
      } = newProps;
      this.setState(
        {
          totalConvertedAmount: this.getTotalSenstivityAmount(riskRadarData)
        },
        () => {
          // this.createCategoriesCircleDataSet(riskRadarData);
          this.getSensitivityHedgingData(
            riskRadarData,
            functionalCurrency,
            senstivityPercentage,
            parsedRiskRadarData
          );
          // this.createScenarioBasedCircleDataSet(this.props.riskRadarData);
        }
      );
    }
  }
  getTotalSenstivityAmount = apiData => {
    //return totalConvertedAmount;
    let totalConvertedAmount =
      apiData && apiData.totalRiskBeforeHedging
        ? apiData.totalRiskBeforeHedging
        : 0;

    return (totalConvertedAmount * this.props.senstivityPercentage) / 100;
  };
  createScenarioBasedCurrencyRiskPieChart = (apiData, riskRadarData) => {
    let currencyImpactData = this.getCurrencyImpactScenarioBasedData(
      apiData,
      riskRadarData
    );
    let currencyImpactChartData = {
      maintainAspectRatio: false,
      responsive: false,
      labels: currencyImpactData.labels,
      datasets: [
        {
          labels: currencyImpactData.labels,
          label: currencyImpactData.label,
          data: currencyImpactData.data,
          backgroundColor: currencyImpactData.backgroundColor,
          borderColor: currencyImpactData.borderColor,
          hoverBackgroundColor: currencyImpactData.hoverBackgroundColor,
          gridDataHeading: currencyImpactData.gridDataHeading,
          gridData: currencyImpactData.gridData,
          toolTip: currencyImpactData.toolTip,
          datalabels: {
            formatter: (value, ctx) => {
              //return null; // returning null to hide name
              let data = ctx.dataset.data[ctx.dataIndex];
              if (data !== 0) return ctx.dataset.labels[ctx.dataIndex];
              else return null;
            },
            align: "top",
            textAlign: "center",
            anchor: "end",
            display: "auto",
            clamp: true,
            color: "#000000",
            font: {
              size: "10",
              weight: "600"
            }
          }
        }
      ]
    };
    this.setState({
      riskScenarioAmount: formatMoney(currencyImpactData.riskImpact, 0),
      currencyScenarioBasedImpactChartData: currencyImpactChartData,
      currencyScenarioBasedImpactChartKey:
        this.state.currencyScenarioBasedImpactChartKey + 1,
      barChartScenarioBasedData: {
        labels: currencyImpactData.labels,
        datasets: currencyImpactData.dataSets
      },
      barChartScenarioBasedDatah: this.state.barChartScenarioBasedDatah + 1
    });
    return {
      commonTooltip: currencyImpactData.commonTooltip,
      riskAmount: currencyImpactData.riskImpact
    };
  };
  createCategoriesCircleDataSet = apiData => {
    let data = this.getData(apiData, this.state.totalConvertedAmount);
    console.log("DATA - ", data);
    let hedgeAmount = apiData.totalHedges;

    let newDoughnutChartData = {
      maintainAspectRatio: false,
      responsive: false,
      labels: data.labels,
      datasets: [
        {
          labels: data.labels,
          label: data.labels,
          data: data.amount,
          backgroundColor: data.color,
          borderColor: data.color,
          hoverBackgroundColor: data.color,
          gridDataHeading: data.gridDataHeading,
          gridData: data.gridData,
          toolTip: data.toolTip,
          datalabels: {
            formatter: (value, ctx) => {
              // let datasets = ctx.chart.data.datasets;
              // let data = ctx.dataset.data[ctx.dataIndex];
              // if (data !== 0) return ctx.dataset.labels[ctx.dataIndex];
              // else return null;
              return null;
            },
            align: "start",
            offset: -40,
            textAlign: "center",
            anchor: "end",
            // display: "auto",
            clamp: true,
            color: "#000000",
            font: {
              size: "12",
              weight: "600"
            }
          }
        }
      ]
    };

    // Setting Data for internal Pie Chart
    let currencyImpactData = this.getCurrencyImpactData(apiData, true);

    newDoughnutChartData.datasets = [
      ...newDoughnutChartData.datasets,
      {
        labels: [], // currencyImpactData.labels,
        label: [], // currencyImpactData.label,
        data: currencyImpactData.data,
        backgroundColor: currencyImpactData.backgroundColor,
        borderColor: currencyImpactData.borderColor,
        hoverBackgroundColor: currencyImpactData.hoverBackgroundColor,
        gridDataHeading: currencyImpactData.gridDataHeading,
        gridData: currencyImpactData.gridData,
        toolTip: currencyImpactData.toolTip,
        datalabels: {
          formatter: (value, ctx) => {
            return null; // returning null to hide name
            // let data = ctx.dataset.data[ctx.dataIndex];
            // if (data !== 0) return ctx.dataset.labels[ctx.dataIndex];
            // else return null;
          },
          align: "top",
          textAlign: "center",
          // anchor: "end",
          // display: "auto",
          clamp: true,
          color: "#000000",
          font: {
            size: "10",
            weight: "600"
          }
        }
      }
    ];
    // console.log("datasetcheck", newDoughnutChartData);
    // console.log("datasetcheck", data);
    //let legendData = this.getLegendData(true);

    this.setState({
      riskAmount:
        formatMoney(apiData.totalRiskImpact, 0) +
        " " +
        this.props.functionalCurrency, //+ " " + apiData.functionalCurrency,
      hedgeAmount:
        formatMoney(hedgeAmount, 0) + " " + apiData.functionalCurrency,
      doughnutChartData: newDoughnutChartData,
      key: this.state.key + 1,
      legendDisplayData: data.legendData
      // showLegend: true
    });
  };
  getContentInColor = (color, text) => {
    return <div style={{ color: color }}>{text}</div>;
  };
  getLegendData = showRiskAmount => {
    const { riskRadarData } = this.props;
    const {
      totalRiskBeforeHedging,
      convertedRiskBeforeHedge,
      totalHedges,
      riskWithoutHedging
    } = riskRadarData;

    let legendDisplayData = [];
    CATEGORIESINFO.forEach((x, index) => {
      if (convertedRiskBeforeHedge[x.key]) {
        let percent =
          convertedRiskBeforeHedge[x.key] === 0
            ? "0 %"
            : this.calculatePercent(
                totalRiskBeforeHedging,
                convertedRiskBeforeHedge[x.key]
              );
        legendDisplayData.push([
          index,
          this.getContentInColor(x.color, x.displayName),
          this.getContentInColor(
            x.color,
            formatMoney(convertedRiskBeforeHedge[x.key]) +
              " ( " +
              percent +
              " )"
          )
        ]);
      }
    });
    if (showRiskAmount) {
      let percentHedgeAmount =
        totalHedges == 0
          ? "0 %"
          : this.calculatePercent(totalRiskBeforeHedging, totalHedges);
      legendDisplayData.push([
        legendDisplayData.length + 1,
        this.getContentInColor("green", "Amount Hedged"),
        this.getContentInColor(
          "green",
          formatMoney(totalHedges) + " ( " + percentHedgeAmount + " )"
        )
      ]);
      let percentRiskAmount =
        riskWithoutHedging == 0
          ? "0 %"
          : this.calculatePercent(totalRiskBeforeHedging, riskWithoutHedging);
      legendDisplayData.push([
        legendDisplayData.length,
        this.getContentInColor("red", "Risk Amount"),
        this.getContentInColor(
          "red",
          formatMoney(riskWithoutHedging) + " ( " + percentRiskAmount + " )"
        )
      ]);
    }
    return legendDisplayData;
  };
  calculatePercent = (total, value) => {
    return ((value / total) * 100).toFixed(2) + " %";
  };
  getData = (apiData, totalSenstivityAmount) => {
    let categories = [
      "ASSETS",
      "LIABILITIES",
      "PAYABLES",
      "RECEIVABLES",
      "FORECASTED_REVENUES",
      "FORECASTED_COSTS",
      ""
    ];
    let categoriesLabel = [
      "Asset\nor\nInvestments",
      "Liabilities",
      "Payables",
      "Receivables",
      "Forecasted\nRevenue",
      "Forecasted\nCosts",
      ""
    ];

    let amount = [];
    let color = [];
    let labels = [];
    let gridDataHeading = [];
    let gridData = [];
    let toolTip = [],
      legendData = [];
    let totalHedgeAmount = apiData.totalHedges,
      totalRiskAmount = apiData.totalRiskImpact;

    for (let i = 0; i < categories.length - 1; i++) {
      let riskAmount = 0;
      let hedgeAmount = 0;
      let hedgePercentage = apiData.riskHedgingPercentage[categories[i]]
        ? apiData.riskHedgingPercentage[categories[i]]
        : 0;
      let unHedgePercent = 100 - hedgePercentage;
      if (
        apiData.convertedRiskHedge &&
        apiData.convertedRiskHedge[categories[i]]
      )
        hedgeAmount = apiData.convertedRiskHedge[categories[i]];

      if (
        apiData.convertedRiskBeforeHedge &&
        apiData.convertedRiskBeforeHedge[categories[i]]
      ) {
        riskAmount =
          apiData.convertedRiskBeforeHedge[categories[i]] - hedgeAmount;
      }
      if (
        apiData.convertedRiskBeforeHedge &&
        apiData.convertedRiskBeforeHedge[categories[i]]
      ) {
        if (apiData.convertedRiskHedge[categories[i]] !== 0) {
          amount = [
            ...amount,
            riskAmount,
            hedgeAmount,
            apiData.convertedRiskBeforeHedge[categories[i]] > 0
              ? (totalSenstivityAmount * 1) / 100
              : 0
          ];
          color = [...color, categoriesColor[i], hedgeColor[i], "white"];
          labels = [
            ...labels,
            "Unhedged \n" +
              categoriesLabel[i] +
              " (" +
              unHedgePercent.toFixed(2) +
              "%)",
            "Hedged \n" +
              categoriesLabel[i] +
              " (" +
              hedgePercentage.toFixed(2) +
              "%)",
            " "
          ];
          gridDataHeading = [
            ...gridDataHeading,
            categoriesLabel[i],
            categoriesLabel[i],
            " "
          ];
          gridData = [...gridData, categories[i], categories[i], null];
          legendData = [
            ...legendData,
            [
              legendData.length,
              this.getContentInColor(
                categoriesColor[i],
                "Hedged " + categoriesLabel[i]
              ),
              this.getContentInColor(
                categoriesColor[i],
                formatMoney(hedgeAmount) +
                  " ( " +
                  hedgePercentage.toFixed(2) +
                  "% )"
              )
            ]
          ];

          toolTip = [
            ...toolTip,
            //categoriesLabel[i] +
            " Un-Hedged Amount : " +
              formatMoney(riskAmount) +
              " " +
              this.props.functionalCurrency,
            //categoriesLabel[i] +
            " Hedged Amount : " +
              formatMoney(hedgeAmount) +
              " " +
              this.props.functionalCurrency,
            null
          ];
        } else {
          amount = [
            ...amount,
            riskAmount,
            riskAmount ? (totalSenstivityAmount * 1) / 100 : 0
          ];
          color = [...color, categoriesColor[i], "white"];
          labels = [
            ...labels,
            "Unhedged \n" + categoriesLabel[i] + " (100%)",
            " "
          ];
          gridDataHeading = [...gridDataHeading, categoriesLabel[i], " "];
          gridData = [...gridData, categories[i], null];
          legendData = [
            ...legendData,
            [
              legendData.length,
              this.getContentInColor(
                categoriesColor[i],
                "Hedged " + categoriesLabel[i]
              ),
              this.getContentInColor(
                categoriesColor[i],
                formatMoney(hedgeAmount) +
                  " ( " +
                  hedgePercentage.toFixed(2) +
                  "% )"
              )
            ]
          ];

          toolTip = [
            ...toolTip,
            //categoriesLabel[i] +
            " UnHedged Amount : " +
              formatMoney(riskAmount) +
              " " +
              this.props.functionalCurrency,
            null
          ];
        }
      }
    }
    legendData = [
      ...legendData,
      [
        legendData.length,
        this.getContentInColor("green", "Other Hedges"),
        this.getContentInColor("green", formatMoney(apiData.unLinkedHedges))
      ],
      [
        legendData.length,
        this.getContentInColor("green", "Total Amount Hedged"),
        this.getContentInColor("green", formatMoney(totalHedgeAmount))
      ],
      [
        legendData.length + 1,
        this.getContentInColor("red", "Total Risk Amount"),
        this.getContentInColor("red", formatMoney(totalRiskAmount))
      ]
    ];
    return {
      amount: amount,
      color: color,
      labels: labels,
      gridDataHeading: gridDataHeading,
      gridData: gridData,
      hedgeAmount: totalHedgeAmount,
      toolTip: toolTip,
      legendData: legendData
    };
  };
  createCurrencyRiskPieChart = (apiData, parsedRiskRadarData) => {
    let currencyImpactData = this.getCurrencyImpactData(apiData, false);
    this.getCurrencyCategoryBarChartData(
      parsedRiskRadarData,
      currencyImpactData.currencyColorMap
    );

    let currencyImpactChartData = {
      maintainAspectRatio: false,
      responsive: false,
      labels: currencyImpactData.labels,
      datasets: [
        {
          labels: currencyImpactData.labels,
          label: currencyImpactData.label,
          data: currencyImpactData.data,
          backgroundColor: currencyImpactData.backgroundColor,
          borderColor: currencyImpactData.borderColor,
          hoverBackgroundColor: currencyImpactData.hoverBackgroundColor,
          gridDataHeading: currencyImpactData.gridDataHeading,
          gridData: currencyImpactData.gridData,
          toolTip: currencyImpactData.toolTip,
          datalabels: {
            formatter: (value, ctx) => {
              //return null; // returning null to hide name
              let data = ctx.dataset.data[ctx.dataIndex];
              if (data !== 0) return ctx.dataset.labels[ctx.dataIndex];
              else return null;
            },
            align: "top",
            textAlign: "center",
            anchor: "end",
            display: "auto",
            clamp: true,
            color: "#000000",
            font: {
              size: "10",
              weight: "600"
            }
          }
        }
      ]
    };
    this.setState({
      currencyImpactChartData: currencyImpactChartData,
      currencyImpactChartKey: this.state.currencyImpactChartKey + 1,
      currencyColorCode: currencyImpactData.currencyColorMap
    });
  };
  getCurrencyImpactData = (apiData, innerPieChart) => {
    let labels = [],
      label = [],
      data = [],
      backgroundColor = [],
      borderColor = [],
      hoverBackgroundColor = [],
      gridDataHeading = [],
      gridData = [],
      toolTip = [];
    let currencyColorMap =
      Object.keys(this.state.currencyColorCode).length === 0
        ? new Map()
        : this.state.currencyColorCode;

    const { riskImpacts, totalRiskImpact } = apiData;

    let currencyImpactTooltip = [];
    let commonLabel = "";
    //
    if (riskImpacts.length !== 0) {
      riskImpacts.forEach(currency => {
        let currencyImpactPercentage =
          (currency.absoluteRiskAmt * 100) / totalRiskImpact;

        currencyImpactTooltip.push({
          currencyImpactPercentage,
          absoluteRiskAmt: currency.absoluteRiskAmt,
          tooltip:
            currency.currencyCode +
            " " +
            formatMoney(currency.absoluteRiskAmt) +
            " (" +
            currencyImpactPercentage.toFixed(2) +
            "%)"
        });
        if (currency.absoluteRiskAmt === 0) {
          if (commonLabel !== "") {
            commonLabel = commonLabel + " \n";
          }
          commonLabel = commonLabel + currency.currencyCode + " (0.00%)";
        }
      });
    }
    let commonTooltip = "";
    // Get Tooltip with all currency code
    if (currencyImpactTooltip.length > 0) {
      // Sort Tooltip based on RiskPercentage
      currencyImpactTooltip = currencyImpactTooltip.sort(
        (a, b) => b.currencyImpactPercentage - a.currencyImpactPercentage
      );
      commonTooltip = "Risk Impact Contributed by - \n";
      currencyImpactTooltip.forEach(currency => {
        if (commonTooltip !== "") {
          commonTooltip = commonTooltip + " \n";
        }
        commonTooltip = commonTooltip + currency.tooltip;
      });
    }
    let colorIndex = Object.keys(this.state.currencyColorCode).length;
    if (riskImpacts.length !== 0) {
      if (commonLabel !== "") {
        labels.push(commonLabel);
        label.push(commonLabel);
        data.push(1);
        backgroundColor.push("#FF0000");
        borderColor.push("#FF0000");
        hoverBackgroundColor.push("#FF0000");
        gridDataHeading.push("");
        gridData.push(1);
        toolTip.push("");
      }
      riskImpacts.forEach(currency => {
        if (currency.absoluteRiskAmt !== 0) {
          let color = "#FF0000";
          let currencyImpactPercentage =
            (currency.absoluteRiskAmt * 100) / totalRiskImpact;
          if (!innerPieChart) {
            if (currencyColorMap[currency.currencyCode]) {
              color = currencyColorMap[currency.currencyCode];
            } else {
              color = COLORCODE[colorIndex];
              currencyColorMap[currency.currencyCode] = COLORCODE[colorIndex];
              colorIndex++;
            }
          }
          labels.push(
            currency.currencyCode +
              " (" +
              currencyImpactPercentage.toFixed(2) +
              "%)"
          );
          label.push(
            currency.currencyCode +
              " (" +
              currencyImpactPercentage.toFixed(2) +
              "%)"
          );
          data.push(currency.absoluteRiskAmt ? currency.absoluteRiskAmt : 1);
          backgroundColor.push(color);
          // borderColor.push("#00000033");
          borderColor.push(color);
          hoverBackgroundColor.push(color);
          gridDataHeading.push(currency.currencyCode);
          gridData.push(currency.absoluteRiskAmt);
          const impact = currency.appreciatedRiskAmt > 0 ? "+" : "-";
          toolTip.push(
            innerPieChart
              ? commonTooltip
              : "With " +
                  this.props.senstivityPercentage +
                  "% appreciation of " +
                  currency.functionalCurrency +
                  " Vs " +
                  currency.currencyCode +
                  ", \nRisk impact is " +
                  impact +
                  " " +
                  currency.functionalCurrency +
                  " " +
                  formatMoney(currency.absoluteRiskAmt)
          );
          // toolTip.push(commonTooltip);
        }
      });
    } else {
      labels.push("");
      label.push("");
      data.push(1);
      backgroundColor.push(COLORCODE[0]);
      borderColor.push("#00000033");
      hoverBackgroundColor.push(COLORCODE[0]);
      gridDataHeading.push("");
      gridData.push(1);
      toolTip.push("");
    }

    return {
      labels: labels,
      label: label,
      data: data,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      hoverBackgroundColor: hoverBackgroundColor,
      gridDataHeading: gridDataHeading,
      gridData: gridData,
      toolTip: toolTip,
      currencyColorMap: currencyColorMap
    };
  };
  getAppreciatedAmountBasedOnCategory = (
    amount,
    category,
    hedgePercentage,
    modelSenstivityPercentage
  ) => {
    let riskAmountWithSentivity = (amount * modelSenstivityPercentage) / 100;

    let hedgeAmountWithSentivity =
      (riskAmountWithSentivity * hedgePercentage) / 100;
    riskAmountWithSentivity =
      riskAmountWithSentivity - hedgeAmountWithSentivity;
    let hedgeAmount = (amount * hedgePercentage) / 100;
    let riskAmount = amount - hedgeAmount;
    if (
      category === "RECEIVABLES" ||
      category === "FORECASTED_REVENUES" ||
      category === "ASSETS"
    ) {
      return {
        riskAmount: -riskAmount,
        hedgeAmount: hedgeAmount,
        unhedgeAmount: riskAmount,
        hedgeAmountWithSentivity: hedgeAmountWithSentivity,
        unhedgeAmountWithSentivity: riskAmountWithSentivity,
        riskAmountWithSentivity: -riskAmountWithSentivity
      };
    } else {
      return {
        riskAmount: riskAmount,
        hedgeAmount: hedgeAmount,
        unhedgeAmount: riskAmount,
        hedgeAmountWithSentivity: hedgeAmountWithSentivity,
        unhedgeAmountWithSentivity: riskAmountWithSentivity,
        riskAmountWithSentivity: riskAmountWithSentivity
      };
    }
  };
  getRiskAndHedgeAmountBasedOnCategory = obj => {
    let hedgeAmount =
      obj.convertedValueBeforeHedge - obj.convertedValueAfterHedge;
    // if (
    //   obj.riskType === "RECEIVABLES" ||
    //   obj.riskType === "FORECASTED_REVENUES" ||
    //   obj.riskType === "ASSETS"
    // ) {
    //   return {
    //     hedgeAmount: -hedgeAmount,
    //     unHedgeAmount: -obj.convertedValueAfterHedge
    //   };
    // } else {
    return {
      hedgeAmount: hedgeAmount,
      unHedgeAmount: obj.convertedValueAfterHedge
    };
    // }
  };
  getCurrencyCategoryBarChartData = (apiData, currencyColorMap) => {
    let currencyData = {};
    const risks = apiData && apiData.risks ? apiData.risks : null;
    let unHedgedData = [],
      hedgedData = [],
      labels = [],
      toolTipsHedgeData = [],
      toolTipsUnHedgeData = [],
      dataSetCurrencies = [];
    let colorIndex = Object.keys(currencyColorMap).length;
    if (risks) {
      Object.keys(RISK_CATEGORY_INFO).forEach(y => {
        let x = RISK_CATEGORY_INFO[y];
        let data = risks[x.key];

        data.forEach(category => {
          if (category.currencyCode !== this.props.functionalCurrency) {
            let obj = this.getRiskAndHedgeAmountBasedOnCategory(category);
            let color = "#FF0000";
            if (currencyData[category.currencycode]) {
              let unHedgeAmount =
                currencyData[category.currencycode].unHedgeAmount;
              unHedgeAmount = unHedgeAmount + obj.unHedgeAmount;
              let hedgeAmount = currencyData[category.currencycode].hedgeAmount;
              hedgeAmount = hedgeAmount + obj.hedgeAmount;
              let data = {
                unHedgeAmount: unHedgeAmount,
                hedgeAmount: hedgeAmount,
                color: currencyData[category.currencycode].color
              };
              currencyData[category.currencycode] = data;
            } else {
              //  color=COLORCODE[colorIndex]
              if (currencyColorMap[category.currencycode]) {
                color = currencyColorMap[category.currencycode];
              } else {
                color = COLORCODE[colorIndex];
                currencyColorMap[category.currencycode] = COLORCODE[colorIndex];
                colorIndex++;
              }
              obj = {
                ...obj,
                color: color
              };
              currencyData[category.currencycode] = obj;
            }
          }
        });
      });
      Object.keys(currencyData).map((x, index) => {
        let currencyInfo = currencyData[x];
        labels.push(x);
        // unHedgedData.push(Math.abs(currency.unHedgeAmount))
        hedgedData.push(Math.abs(currencyInfo.hedgeAmount));
        toolTipsHedgeData.push(
          "Hedge Amount " +
            formatMoney(Math.abs(currencyInfo.hedgeAmount)) +
            " " +
            this.props.functionalCurrency
        );
        // toolTipsUnHedgeData.push('Un-Hedge Amount '+formatMoney(Math.abs(currency.unHedgeAmount))+' '+this.props.functionalCurrency)

        let arr = [],
          toolTip = [];

        arr[index] = Math.abs(currencyInfo.unHedgeAmount);
        toolTip[index] =
          "Un-Hedge Amount " +
          formatMoney(Math.abs(currencyInfo.unHedgeAmount)) +
          " " +
          this.props.functionalCurrency;
        dataSetCurrencies.push({
          label:
            "Un-Hedge Amount in " +
            this.props.functionalCurrency +
            " for currency " +
            x,
          data: [...arr],
          hoverBackgroundColor: currencyInfo.color,
          backgroundColor: currencyInfo.color,
          toolTip: toolTip
        });
      });
      // let dataSetCurrencies=[]
      // labels.forEach((currency, index)=>{

      // })
    }
    let dataSets = [
      // {
      //   label:'Un-Hedge Amount in '+this.props.functionalCurrency,
      //   data:unHedgedData,
      //   hoverBackgroundColor:'#26A9EB',
      //   backgroundColor:'#26A9EB80',
      //   toolTip:toolTipsUnHedgeData

      // },
      ...dataSetCurrencies,
      {
        label: "Hedge Amount in " + this.props.functionalCurrency,
        data: hedgedData,
        backgroundColor: "#46745d",
        hoverBackgroundColor: "#46745d",
        toolTip: toolTipsHedgeData
      }
    ];
    this.setState({
      barChartData: {
        labels: [...labels],
        datasets: dataSets
      },
      barChartKey: this.state.barChartKey + 1,
      currencyColorMap
    });
  };
  getCurrencyImpactScenarioBasedData = (apiData, riskRadarData) => {
    let labels = [],
      label = [],
      data = [],
      backgroundColor = [],
      borderColor = [],
      hoverBackgroundColor = [],
      gridDataHeading = [],
      gridData = [],
      toolTip = [];
    let currencyData = {},
      currencyDataArr = [];

    let currencyColorCode = this.state.currencyColorCode;

    const risks = apiData && apiData.risks ? apiData.risks : null;
    let colorIndex = Object.keys(this.state.currencyColorCode).length;
    let hedgedData = [],
      toolTipsHedgeData = [],
      dataSetCurrencies = [];

    let modelSenstitivitySelected =
      this.state.modelSenstitivitySelected === ""
        ? this.props.senstivityPercentage
        : this.state.modelSenstitivitySelected;

    let totalRiskAmt = 0;
    let totalRiskAmtImpact = 0;

    if (risks) {
      Object.keys(RISK_CATEGORY_INFO).forEach(y => {
        let x = RISK_CATEGORY_INFO[y];
        let data = risks[x.key];
        let hedgePercentage =
          this.state.checkedIndividualHedgeSlider &&
          this.state[x.hedgingPercentageKey] === ""
            ? riskRadarData.riskHedgingPercentage[x.key]
            : this.state.checkedIndividualHedgeSlider
            ? this.state[x.hedgingPercentageKey]
            : this.state.hedgingPercentageAllCategories;
        data &&
          data.forEach(category => {
            // Skip risk if in Base Currency
            if (category.currencyCode !== this.props.functionalCurrency) {
              let amountInfo = this.getAppreciatedAmountBasedOnCategory(
                category.convertedValueBeforeHedge,
                category.riskType,
                hedgePercentage,
                modelSenstitivitySelected
              );
              let color = "#FF0000";

              if (currencyData[category.currencycode]) {
                color = currencyData[category.currencycode].color;
                // let a = currencyData[category.currencycode].amount
                // a=a+amount
                totalRiskAmt = totalRiskAmt + Math.abs(amountInfo.riskAmount);
                // totalRiskAmtImpact =
                //   totalRiskAmtImpact + amountInfo.riskAmountWithSentivity;
                let obj = {
                  color: color,
                  riskAmount:
                    currencyData[category.currencycode].riskAmount +
                    amountInfo.riskAmount,
                  hedgeAmount:
                    currencyData[category.currencycode].hedgeAmount +
                    amountInfo.hedgeAmount,
                  unhedgeAmount:
                    currencyData[category.currencycode].unhedgeAmount +
                    amountInfo.unhedgeAmount,
                  hedgeAmountWithSentivity:
                    currencyData[category.currencycode]
                      .hedgeAmountWithSentivity +
                    amountInfo.hedgeAmountWithSentivity,
                  unhedgeAmountWithSentivity:
                    currencyData[category.currencycode]
                      .unhedgeAmountWithSentivity +
                    amountInfo.unhedgeAmountWithSentivity,
                  riskAmountWithSentivity:
                    currencyData[category.currencycode]
                      .riskAmountWithSentivity +
                    amountInfo.riskAmountWithSentivity,
                  unhedgePercentage: 100 - hedgePercentage,
                  unhedgeAmountWithSentivityAbsolute:
                    currencyData[category.currencycode]
                      .unhedgeAmountWithSentivityAbsolute +
                    Math.abs(amountInfo.unhedgeAmountWithSentivityAbsolute)
                };
                currencyData[category.currencycode] = obj;
              } else {
                if (currencyColorCode[category.currencyCode]) {
                  color = currencyColorCode[category.currencyCode];
                } else {
                  color = COLORCODE[colorIndex];
                  colorIndex++;
                }
                let obj = {
                  color: color,
                  unhedgePercentage: 100 - hedgePercentage,
                  unhedgeAmountWithSentivityAbsolute: Math.abs(
                    amountInfo.unhedgeAmountWithSentivityAbsolute
                  ),
                  ...amountInfo
                };
                currencyData[category.currencycode] = obj;
                totalRiskAmt = totalRiskAmt + Math.abs(amountInfo.riskAmount);
                // totalRiskAmtImpact =
                //   totalRiskAmtImpact + amountInfo.riskAmountWithSentivity;
              }
            }
          });
      });

      Object.keys(currencyData).map((x, index) => {
        let currencyInfo = currencyData[x];
        currencyDataArr[index] = {
          ...currencyInfo,
          currencyCode: x
        };
        let currencyImpactPercentage = totalRiskAmt
          ? (Math.abs(currencyInfo.riskAmount) * 100) / totalRiskAmt
          : 0;

        labels.push(x + " (" + currencyImpactPercentage.toFixed(2) + "% )");
        label.push(x + " (" + currencyImpactPercentage.toFixed(2) + "% )");
        data.push(
          currencyInfo.riskAmountWithSentivity
            ? Math.abs(currencyInfo.riskAmountWithSentivity)
            : 1
        );
        backgroundColor.push(currencyInfo.color);
        borderColor.push(currencyInfo.color);
        hoverBackgroundColor.push(currencyInfo.color);
        gridDataHeading.push(x);
        gridData.push(
          currencyInfo.riskAmountWithSentivity
            ? Math.abs(currencyInfo.riskAmountWithSentivity)
            : 1
        );
        const impact = currencyInfo.riskAmountWithSentivity > 0 ? "+" : "-";
        toolTip.push(
          "With " +
            modelSenstitivitySelected +
            "% appreciation of " +
            this.props.functionalCurrency +
            " Vs " +
            x +
            ", \nRisk impact is " +
            impact +
            " " +
            this.props.functionalCurrency +
            " " +
            formatMoney(Math.abs(currencyInfo.riskAmountWithSentivity))
        );
        hedgedData.push(Math.abs(currencyInfo.hedgeAmount));
        toolTipsHedgeData.push(
          "Hedge Amount " +
            formatMoney(Math.abs(currencyInfo.hedgeAmount)) +
            " " +
            this.props.functionalCurrency
        );

        let arr = [],
          toolTipBarChart = [];

        arr[index] = Math.abs(currencyInfo.unhedgeAmount);
        toolTipBarChart[index] =
          "Un-Hedge Amount " +
          formatMoney(Math.abs(currencyInfo.unhedgeAmount)) +
          " " +
          this.props.functionalCurrency;
        dataSetCurrencies.push({
          label:
            "Un-Hedge Amount in " +
            this.props.functionalCurrency +
            " for currency " +
            x,
          data: arr,
          hoverBackgroundColor: currencyInfo.color,
          backgroundColor: currencyInfo.color,
          toolTip: toolTipBarChart
        });
        totalRiskAmtImpact =
          totalRiskAmtImpact + Math.abs(currencyInfo.riskAmountWithSentivity);
      });
    } else {
      labels.push("");
      label.push("");
      data.push(1);
      backgroundColor.push(COLORCODE[0]);
      borderColor.push(COLORCODE[0]);
      hoverBackgroundColor.push(COLORCODE[0]);
      gridDataHeading.push("");
      gridData.push(1);
      toolTip.push("");
    }
    let dataSets = [
      ...dataSetCurrencies,
      {
        label: "Hedge Amount in " + this.props.functionalCurrency,
        data: hedgedData,
        backgroundColor: "#46745d",
        hoverBackgroundColor: "#46745d",
        toolTip: toolTipsHedgeData
      }
    ];
    let currencyImpactTooltip = [];
    currencyDataArr &&
      currencyDataArr.forEach(currency => {
        let percentage = (
          (currency.unhedgeAmountWithSentivity * 100) /
          this.state.totalConvertedAmount
        ).toFixed(2);
        currencyImpactTooltip.push({
          percentage,
          absoluteRiskAmt: currency.unhedgeAmountWithSentivity,
          tooltip:
            currency.currencyCode +
            " " +
            formatMoney(currency.unhedgeAmountWithSentivity) +
            " (" +
            percentage +
            "%)"
        });
      });
    currencyImpactTooltip = currencyImpactTooltip.sort(
      (a, b) => b.percentage - a.percentage
    );

    let commonTooltip = "Risk Impact Contributed by - \n";
    currencyImpactTooltip &&
      currencyImpactTooltip.forEach(impact => {
        if (commonTooltip !== "") {
          commonTooltip = commonTooltip + " \n";
        }
        commonTooltip = commonTooltip + impact.tooltip;
      });

    return {
      labels: labels,
      label: label,
      data: data,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      hoverBackgroundColor: hoverBackgroundColor,
      gridDataHeading: gridDataHeading,
      gridData: gridData,
      toolTip: toolTip,
      commonTooltip: commonTooltip,
      riskImpact: Math.abs(totalRiskAmtImpact),
      dataSets
    };
  };
  getRiskAmount = (totalRiskAmt, hedgeAmount) => {
    return totalRiskAmt - (hedgeAmount * this.props.senstivityPercentage) / 100;
  };
  createScenarioBasedCircleDataSet = (apiData, parsedRiskRadarData) => {
    let doughnutScenarioChartData = { ...this.state.doughnutScenarioChartData };
    doughnutScenarioChartData.labels = [];
    doughnutScenarioChartData.datasets = [];

    let currencyRiskPieChartData = this.createScenarioBasedCurrencyRiskPieChart(
      parsedRiskRadarData,
      apiData
    );
    let data = this.getScenarioBasedData(
      apiData,
      this.state.totalConvertedAmount,
      currencyRiskPieChartData.riskAmount
    );

    // let legendData = this.getLegendData(false);

    let cargoryDataset = {
      backgroundColor: data.color,
      data: data.amount,
      borderWidth: 0,
      borderColor: "white",
      labels: data.labels,
      gridData: data.gridData,
      toolTip: data.toolTip
    };
    doughnutScenarioChartData.datasets = [
      ...doughnutScenarioChartData.datasets,
      cargoryDataset
    ];
    doughnutScenarioChartData.datasets = [
      ...doughnutScenarioChartData.datasets,
      {
        labels: [], // currencyImpactData.labels,
        label: [], // currencyImpactData.label,
        data: [
          currencyRiskPieChartData.riskAmount
            ? currencyRiskPieChartData.riskAmount
            : 1
        ],
        backgroundColor: ["red"],
        borderColor: ["red"],
        hoverBackgroundColor: ["red"],
        gridDataHeading: [],
        gridData: [],
        toolTip: [currencyRiskPieChartData.commonTooltip],
        datalabels: {
          formatter: (value, ctx) => {
            return null; // returning null to hide name
            // let data = ctx.dataset.data[ctx.dataIndex];
            // if (data !== 0) return ctx.dataset.labels[ctx.dataIndex];
            // else return null;
          },
          align: "top",
          textAlign: "center",
          // anchor: "end",
          // display: "auto",
          clamp: true,
          color: "#000000",
          font: {
            size: "10",
            weight: "600"
          }
        }
      }
    ];

    this.setState({
      ...data.hedgingPercentageObj,
      doughnutScenarioChartKey: this.state.doughnutScenarioChartKey + 1,
      // riskScenarioAmount: formatMoney(data.riskAmount, 0), // + " " + this.props.functionalCurrency,
      hedgeScenarioAmount: formatMoney(data.hedgeAmount, 0),
      doughnutScenarioChartData: doughnutScenarioChartData,
      riskScenarioLegendDisplayData: data.legendData,
      showRiskScenarioLegend: true
    });
  };
  getScenarioBasedData = (apiData, totalSenstivityAmount, totalRiskAmount) => {
    let categories = [
      "ASSETS",
      "LIABILITIES",
      "PAYABLES",
      "RECEIVABLES",
      "FORECASTED_REVENUES",
      "FORECASTED_COSTS",
      ""
    ];
    const categoriesLabel = [
      "Asset or Investments",
      "Liabilities",
      "Payables",
      "Receivables",
      "Forecasted Revenue",
      "Forecasted Costs",
      ""
    ];
    const hedgingState = [
      "hedgingPercentageAssets",
      "hedgingPercentageLiabilities",
      "hedgingPercentagePayables",
      "hedgingPercentageReceivables",
      "hedgingPercentageForecastedRevenues",
      "hedgingPercentageForecastedCosts",
      ""
    ];
    let hedgingPercentageObj = {
      hedgingPercentageAssets: 0,
      hedgingPercentageLiabilities: 0,
      hedgingPercentagePayables: 0,
      hedgingPercentageReceivables: 0,
      hedgingPercentageForecastedRevenues: 0,
      hedgingPercentageForecastedCosts: 0
    };

    let amount = [];
    let legendData = [];
    let color = [];
    let labels = [];
    let gridData = [];
    let toolTip = [];
    let totalHedgeAmount = 0;

    for (let i = 0; i < categories.length - 1; i++) {
      let riskAmount = 0;
      let hedgeAmount = 0;

      if (
        !(
          apiData.convertedRiskBeforeHedge &&
          apiData.convertedRiskBeforeHedge[categories[i]]
        )
      )
        continue;

      // Get Hedge Percentage
      let hedgePercentage =
        this.state.checkedIndividualHedgeSlider &&
        this.state[hedgingState[i]] === ""
          ? apiData.riskHedgingPercentage[categories[i]]
          : this.state.checkedIndividualHedgeSlider
          ? this.state[hedgingState[i]]
          : this.state.hedgingPercentageAllCategories;

      hedgingPercentageObj[hedgingState[i]] = hedgePercentage;

      // Get Risk Amount before Hedge
      if (
        apiData.convertedRiskBeforeHedge &&
        apiData.convertedRiskBeforeHedge[categories[i]]
      ) {
        riskAmount = apiData.convertedRiskBeforeHedge[categories[i]];
      }
      if (hedgePercentage) {
        hedgeAmount = (riskAmount * hedgePercentage) / 100;
        riskAmount = riskAmount - hedgeAmount;
        totalHedgeAmount = totalHedgeAmount + hedgeAmount;
        amount = [
          ...amount,
          riskAmount,
          hedgeAmount,
          apiData.convertedRiskBeforeHedge[categories[i]] > 0
            ? (totalSenstivityAmount * 1) / 100
            : 0
        ];
        legendData = [
          ...legendData,
          [
            legendData.length,
            this.getContentInColor(
              categoriesColor[i],
              "Hedged " + categoriesLabel[i]
            ),
            this.getContentInColor(
              categoriesColor[i],
              formatMoney(hedgeAmount) +
                " ( " +
                hedgePercentage.toFixed(2) +
                "% )"
            )
          ]
        ];
        color = [...color, categoriesColor[i], hedgeColor[i], "white"];
        labels = [
          ...labels,
          categoriesLabel[i],
          categoriesLabel[i], //+ " Hedge",
          " "
        ];
        gridData = [...gridData, apiData, apiData, null];
        let unHedgePercent = 100 - hedgePercentage;
        toolTip = [
          ...toolTip,
          // categoriesLabel[i] +
          " Hedge Percent " +
            hedgePercentage.toFixed(2) +
            "%" +
            " Un-Hedge Percent " +
            unHedgePercent.toFixed(2) +
            "%" +
            " \nUn-Hedged Amount : " +
            formatMoney(riskAmount) +
            " " +
            this.props.functionalCurrency,
          // categoriesLabel[i] +
          " Hedge Percent " +
            hedgePercentage.toFixed(2) +
            "%" +
            " Un-Hedge Percent " +
            unHedgePercent.toFixed(2) +
            "%" +
            " \nHedged Amount : " +
            formatMoney(hedgeAmount) +
            " " +
            this.props.functionalCurrency,
          null
        ];
      } else {
        amount = [
          ...amount,
          riskAmount,
          riskAmount ? (totalSenstivityAmount * 1) / 100 : 0
        ];
        legendData = [
          ...legendData,
          [
            legendData.length,
            this.getContentInColor(
              categoriesColor[i],
              "Hedged " + categoriesLabel[i]
            ),
            this.getContentInColor(
              categoriesColor[i],
              formatMoney(hedgeAmount) + " ( 0% )"
            )
          ]
        ];
        color = [...color, categoriesColor[i], "white"];
        labels = [...labels, categoriesLabel[i], " "];
        gridData = [...gridData, apiData, null];
        toolTip = [
          ...toolTip,
          //categoriesLabel[i] +
          " Hedge Percent 0%" +
            " Un-Hedge Percent 100%" +
            " \n UnHedged Amount : " +
            formatMoney(riskAmount) +
            " " +
            this.props.functionalCurrency,
          null
        ];
      }
    }
    legendData = [
      ...legendData,
      [
        legendData.length,
        this.getContentInColor("green", "Total Amount Hedged"),
        this.getContentInColor("green", formatMoney(totalHedgeAmount))
      ],
      [
        legendData.length + 1,
        this.getContentInColor("red", "Risk Amount"),
        this.getContentInColor("red", formatMoney(totalRiskAmount))
      ]
    ];

    return {
      amount: amount,
      color: color,
      labels: labels,
      gridData: gridData,
      riskAmount: totalRiskAmount,
      hedgeAmount: totalHedgeAmount,
      toolTip: toolTip,
      hedgingPercentageObj: hedgingPercentageObj,
      legendData: legendData
    };
  };
  getGradient = (hedgingPercentage, categoryColor) => {
    var ctx = document
      .getElementsByClassName("chartjs-render-monitor")[0]
      .getContext("2d");
    let gradient = ctx.createLinearGradient(0, 0, 170, 0);
    gradient.addColorStop(hedgingPercentage / 100, GREEN_HEDGE_COLOR); //hedgingPercentage/100

    gradient.addColorStop(1, categoryColor);
    return gradient;
  };
  getSensitivityAmount = (sensitivityPercent, amount) => {
    return (amount * sensitivityPercent) / 100;
  };
  getTableTitle = (categoryLabel, hedgingPercentage) => {
    hedgingPercentage = hedgingPercentage == null ? 0 : hedgingPercentage;
    return categoryLabel + "\t\t" + hedgingPercentage + "% Hedged";
  };
  showTable = (dataset, index) => {
    console.log("SHOW TABLE - ", index, dataset);
    const { riskRadarData } = this.props;

    let dataArr = riskRadarData.risks.filter(
      risk => risk.riskType === dataset.gridData[index]
    );

    let tableData = [
      {
        title: this.getTableTitle(
          dataset.gridDataHeading[index],
          riskRadarData.riskHedgingPercentage[dataset.gridData[index]]
        ),
        data: dataArr
      }
    ];

    const tableKey = [...TABLECOLUMNKEYDATE];
    const tableName = [...TABLECOLUMNNAMEDATE];
    this.renderTable(tableKey, tableName, tableData);
    // };
  };
  renderTable = (columnsKey, columnName, tableData) => {
    tableData.forEach((data, index) => {
      let grid = [];
      data.data.forEach((row, index) => {
        let rowData = [index];
        columnsKey.forEach(cell => {
          if (cell === "dueDate") {
            rowData = [...rowData, formatDate(row[cell])];
          } else if (
            cell === "convertedValueBeforeHedge" ||
            cell === "appreciatedRiskAmt" ||
            cell === "depreciatedRiskAmt"
          ) {
            rowData = [
              ...rowData,
              formatMoney(row[cell]) + " " + row.convertedValueCurrencyCode
            ];
          } else if (cell === "amount" || cell === "hedgedAmount") {
            rowData = [
              ...rowData,
              formatMoney(row[cell]) + " " + row.currencyCode
            ];
          } else if (cell === "convertedValueHedge") {
            rowData = [
              ...rowData,
              formatMoney(
                row.convertedValueBeforeHedge - row.convertedValueAfterHedge
              ) +
                " " +
                row.convertedValueCurrencyCode
            ];
          } else if (cell === "exchangeRate") {
            rowData = [...rowData, formatMoney(row[cell])];
          }
        });
        grid = [...grid, rowData];
      });
      tableData[index].data = grid;
    });

    this.setState(
      {
        tableData,
        tableColumns: columnName,
        showTable: true
      },
      () => {
        document.getElementById("risk-radar-table").scrollIntoView();
      }
    );
  };
  getThirtyPercentOfCircle = radius => {
    return (radius * 30) / 100;
  };
  onChange = (stateArr, index, name) => event => {
    let arr = this.state[stateArr];
    if (index != null) {
      arr[index][name] = event.target.value;
    } else {
      if (stateArr == "profit") {
        arr[name] = event.target.value;
      } else {
        arr = event.target.value;
      }
    }
    this.setState({ [stateArr]: arr });
  };
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };
  changePercentage = (event, stateName, rules) => {
    const value = event.target.value.substring(
      0,
      event.target.value.length - 1
    );
    this.setState(validate(value, stateName, this.state, rules, this.error));
  };
  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value }, () => {
      if (
        name.includes("hedgingPercentage") &&
        event.target.value >= 0 &&
        event.target.value <= 100
      ) {
        this.createScenarioBasedCircleDataSet(
          this.props.riskRadarData,
          this.props.parsedRiskRadarData
        );
        // this.createScenarioBasedCurrencyRiskPieChart(
        //   this.props.parsedRiskRadarData,
        //   this.props.riskRadarData
        // );
      }
    });
  };
  handleToggle = stateName => {
    this.setState({
      [stateName]: !this.state[stateName]
    });
  };
  handleRadioButtonChange = (name, value) => {
    this.setState({
      [name]: value
    });
  };
  handleSliderChange = (name, value) => {
    this.setState({ [name]: value }, () => {
      if (name.includes("hedgingPercentage") && value >= 0 && value <= 100) {
        this.createScenarioBasedCircleDataSet(
          this.props.riskRadarData,
          this.props.parsedRiskRadarData
        );
        // this.createScenarioBasedCurrencyRiskPieChart(
        //   this.props.parsedRiskRadarData,
        //   this.props.riskRadarData
        // );
      }
    });
  };
  handleNegativeResponse = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      tempSenstivityPercentageSelected: ""
    });
  };
  handlePositiveResponse = () => {
    this.setState(
      {
        confirmationModal: false,
        confirmationModalHeader: "",
        confirmationModalMsg: ""
      },
      () => {
        this.calculateGraphWithSensitivity(
          this.state.tempSenstivityPercentageSelected
        );
      }
    );
  };
  onChangeSelect = (e, name) => {
    let obj = validate(e.target.value, name, this.state, [], this.error);

    if (name === "senstitivitySelected") {
      this.setState({
        tempSenstivityPercentageSelected: e.target.value,
        confirmationModal: true,
        confirmationModalHeader: "Update Senstivity Percentage",
        confirmationModalMsg:
          "Are you sure, you want to update Senstivity Percentage?"
      });
    } else if (name === "modelSenstitivitySelected") {
      this.setState(
        {
          ...obj
        },
        () => {
          this.createScenarioBasedCircleDataSet(
            this.props.riskRadarData,
            this.props.parsedRiskRadarData
          );
        }
      );
    }
  };
  calculateGraphWithSensitivity = senstivityPercentage => {
    this.props.updateSenstitivityPercentage(senstivityPercentage, true, 2);
  };

  render() {
    const { classes, riskRadarData } = this.props;
    const {
      totalConvertedAmount,
      horizontalBarDataset,
      horizontalBarToolTip
    } = this.state;

    const options = {
      responsive: true,

      tooltips: {
        mode: "x",
        callbacks: {
          label: function(tooltipItem, data) {
            return ""; //'Risk Amount In '+this.props.functionalCurrency//data.datasets[tooltipItem.datasetIndex].label.split('-')[0] + ": " + formatMoney(Math.abs(tooltipItem.xLabel));
            //return 'Amount'
          },
          afterLabel: (tooltipItem, data) => {
            return horizontalBarToolTip.split("\n");
          }
        }
      },
      legend: { display: false },
      scales: {
        xAxes: [
          {
            ticks: {
              min: -totalConvertedAmount,
              max: totalConvertedAmount,
              callback: function(label) {
                if (label < 0) {
                  return formatMoney(label - totalConvertedAmount);
                } else {
                  return formatMoney(label + totalConvertedAmount);
                }
              }
            },
            stacked: true
          }
        ],
        yAxes: [{ barPercentage: 0.2, stacked: true }]
      },
      elements: {
        rectangle: {
          borderWidth: 4,
          borderColor: "rgb(255, 255, 0)"
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
    return (
      <>
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: this.props.printComponent ? "" : "50px 30px 60px 50px"
          }}
        >
          {riskRadarData &&
          riskRadarData.risks &&
          riskRadarData.risks.length > 0 ? (
            <GridContainer justify="center">
              <GridContainer>
                <GridItem
                  xs={this.props.printComponent ? 12 : 6}
                  sm={this.props.printComponent ? 12 : 6}
                  md={this.props.printComponent ? 12 : 6}
                  lg={this.props.printComponent ? 12 : 6}
                >
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
                      Risk Impact
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer>
                        <GridItem
                          xs={3}
                          sm={3}
                          md={3}
                          lg={3}
                          style={{ marginTop: 50, marginBottom: 55 }}
                        >
                          <FormControl fullWidth style={{ paddingTop: 3 }}>
                            <InputLabel
                              htmlFor="type"
                              className={classes.selectLabelRisk}
                            >
                              Choose Senstitivity
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              value={this.state.senstitivitySelected}
                              onChange={e =>
                                this.onChangeSelect(e, "senstitivitySelected")
                              }
                              inputProps={{
                                name: "senstitivitySelected",
                                id: "senstitivitySelected",
                                classes: {
                                  icon: classes.white,
                                  root: classes.selectDropDown
                                }
                              }}
                            >
                              <MenuItem
                                disabled
                                key={"senstitivitySelected"}
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                Choose Option
                              </MenuItem>
                              {senstitivityOptions.map((item, index) => (
                                <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected
                                  }}
                                  value={item.value}
                                  key={index}
                                >
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText
                              style={{ color: "red" }}
                              hidden={
                                this.state.senstitivitySelectedState !== "error"
                              }
                            >
                              Select appropriate Senstitivity
                            </FormHelperText>
                          </FormControl>
                        </GridItem>
                        {this.state.senstitivitySelected == "specify" && (
                          <GridItem
                            xs={4}
                            sm={4}
                            md={4}
                            lg={4}
                            style={{
                              marginTop: 50,
                              placeContent: this.props.printComponent
                                ? "center"
                                : ""
                            }}
                          >
                            <CustomNumberFormat
                              success={
                                this.state.senstitivityPercentageState ===
                                "success"
                              }
                              error={
                                this.state.senstitivityPercentageState ===
                                "error"
                              }
                              helpText={
                                this.state.senstitivityPercentageState ===
                                  "error" &&
                                this.state.senstitivityPercentageErrorMsg[0]
                              }
                              value={this.state.senstivityPercentage}
                              onChange={this.onChange(
                                "senstivityPercentage",
                                null,
                                ""
                              )}
                              labelText="Senstitivity Percentage"
                              suffix="%"
                              id="rr_senstitivityPercentage"
                              formControlProps={{
                                style: { paddingTop: 5 },
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: event => {
                                  this.setState({
                                    senstitivityPercentagePristine: false
                                  });
                                  this.changePercentage(
                                    event,
                                    "senstivityPercentage",
                                    [
                                      { type: "required" },
                                      {
                                        type: "range",
                                        params: {
                                          min: 0,
                                          max: 100
                                        }
                                      }
                                    ]
                                  );
                                },
                                onChange: event => {
                                  if (
                                    !this.state.senstitivityPercentagePristine
                                  ) {
                                    this.setState({
                                      senstitivityPercentagePristine: false
                                    });
                                    this.changePercentage(
                                      event,
                                      "senstivityPercentage",
                                      [
                                        { type: "required" },
                                        {
                                          type: "range",
                                          params: {
                                            min: 0,
                                            max: 100
                                          }
                                        }
                                      ]
                                    );
                                  }
                                }
                              }}
                            />
                          </GridItem>
                        )}
                        <GridItem
                          xs={5}
                          sm={5}
                          md={5}
                          lg={5}
                          style={{ alignSelf: "center", textAlign: "right" }}
                        >
                          {/* <FormControlLabel
                          className={this.props.classes.center}
                          classes={{
                            root: this.props.classes.checkboxLabelControl,
                            label: this.props.classes.checkboxLabel
                          }}
                          control={
                            <Switch
                              color="primary"
                              tabIndex={-1}
                              id={"checkbox"}
                              onChange={() => this.handleToggle("showLegend")}
                              checked={this.state.showLegend}
                            />
                          }
                          label={"Show Table Data"}
                        /> */}
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={1} sm={1} md={1} lg={1} />
                    <GridItem
                      xs={this.props.printComponent ? 5 : 10}
                      sm={this.props.printComponent ? 5 : 10}
                      md={this.props.printComponent ? 5 : 10}
                      lg={this.props.printComponent ? 5 : 10}
                      style={{ textAlign: "center" }}
                    >
                      <Doughnut
                        key={this.state.key}
                        data={this.state.doughnutChartData}
                        options={{
                          // segmentShowStroke: false,
                          elements: {
                            arc: {
                              borderWidth: 1
                            },

                            center: {
                              text: "Risk Amount " + this.state.riskAmount,
                              color: "white", // Default is #000000
                              fontStyle: "Arial", // Default is Arial
                              sidePadding: 15, // Default is 20 (as a percentage)
                              minFontSize: 16, // Default is 20 (in px), set to false and text will not wrap.
                              lineHeight: 20 // Default is 25 (in px), used for when text wraps
                            }
                          },
                          layout: {
                            padding: {
                              left: 60,
                              right: 60,
                              top: 60,
                              bottom: 60
                            }
                          },
                          cutoutPercentage: 0,
                          outlabels: {
                            text: "%l %p",
                            color: "white",
                            stretch: 45,
                            font: {
                              resizable: true,
                              minSize: 12,
                              maxSize: 18
                            }
                          },
                          legend: {
                            display: false,
                            position: "bottom"
                          },
                          plugins: {
                            labels: [
                              {
                                render: "label",
                                position: "outside",
                                outsidePadding: 4,
                                fontSize: 12,
                                fontStyle: "bold"
                              }
                            ]
                          },
                          responsive: true,
                          tooltips: {
                            callbacks: {
                              label: (tooltipItems, data) => {
                                const item =
                                  data.datasets[tooltipItems.datasetIndex];
                                return item.toolTip[tooltipItems.index] === null
                                  ? null
                                  : item.labels[tooltipItems.index];
                              },
                              afterLabel: (tooltipItems, data) => {
                                const item =
                                  data.datasets[tooltipItems.datasetIndex];
                                return item.toolTip[tooltipItems.index] === null
                                  ? null
                                  : item.toolTip[tooltipItems.index].split(
                                      "\n"
                                    );
                              }
                            }
                          },
                          onClick: (e, item) => {
                            if (item.length > 0) {
                              const datasets = this.state.doughnutChartData
                                .datasets;

                              var data = datasets[item[0]._datasetIndex];
                              if (
                                data.gridData &&
                                data.gridData != null &&
                                data.gridData[item[0]._index] != null
                              ) {
                                this.showTable(data, item[0]._index);
                              }
                            }
                          }
                        }}
                        plugins={[
                          {
                            afterDatasetsDraw: function(chart) {
                              if (chart.config.options.elements.center) {
                                // Get ctx from string
                                var ctx = chart.chart.ctx;
                                ctx.beginPath();
                                // ctx.arc(
                                //   chart.chart.width / 2,
                                //   (chart.chart.height +
                                //     chart.chart.chartArea.top) /
                                //     //+chart.chart.chartArea.bottom
                                //     2,
                                //   chart.chart.innerRadius,
                                //   0,
                                //   2 * Math.PI,
                                //   false
                                // );
                                //  ctx.fillStyle = "red";
                                //  ctx.fill();
                                // Get options from the center object in options
                                var centerConfig =
                                  chart.config.options.elements.center;
                                var fontStyle =
                                  centerConfig.fontStyle || "Arial";
                                var txt = centerConfig.text;
                                var color = centerConfig.color || "#000";
                                var maxFontSize =
                                  centerConfig.maxFontSize || 60;
                                var sidePadding =
                                  centerConfig.sidePadding || 20;
                                var sidePaddingCalculated =
                                  (sidePadding / 100) * (chart.innerRadius * 2);
                                // Start with a base font of 30px
                                ctx.font = "30px " + fontStyle;

                                // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                                var stringWidth = ctx.measureText(txt).width;
                                var elementWidth =
                                  chart.innerRadius * 2 - sidePaddingCalculated;

                                // Find out how much the font can grow in width.
                                var widthRatio = elementWidth / stringWidth;
                                var newFontSize = Math.floor(30 * widthRatio);
                                var elementHeight = chart.innerRadius * 2;

                                // Pick a new font size so it will not be larger than the height of label.
                                var fontSizeToUse = Math.min(
                                  newFontSize,
                                  elementHeight,
                                  maxFontSize
                                );
                                var minFontSize = centerConfig.minFontSize;
                                var lineHeight = centerConfig.lineHeight || 25;
                                var wrapText = false;

                                if (minFontSize === undefined) {
                                  minFontSize = 15;
                                }

                                if (
                                  minFontSize &&
                                  fontSizeToUse < minFontSize
                                ) {
                                  fontSizeToUse = minFontSize;
                                  wrapText = true;
                                }

                                // Set font settings to draw it correctly.
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                // console.log("before check", chart);
                                var centerX =
                                  (chart.chartArea.left +
                                    chart.chartArea.right) /
                                  2;
                                var centerY =
                                  (chart.chartArea.top +
                                    chart.chartArea.bottom) /
                                  2;
                                // centerY=centerY+20
                                ctx.font = fontSizeToUse + "px " + fontStyle;
                                ctx.fillStyle = color;

                                if (!wrapText) {
                                  ctx.fillText(txt, centerX, centerY);
                                  return;
                                }

                                var words = txt.split(" ");
                                var line = "";
                                var lines = [];

                                // Break words up into multiple lines if necessary
                                for (var n = 0; n < words.length; n++) {
                                  var testLine = line + words[n] + " ";
                                  var metrics = ctx.measureText(testLine);
                                  var testWidth = metrics.width;
                                  if (testWidth > elementWidth && n > 0) {
                                    lines.push(line);
                                    line = words[n] + " ";
                                  } else {
                                    line = testLine;
                                  }
                                }

                                // Move the center up depending on line height and number of lines
                                centerY -= (lines.length / 2) * lineHeight;

                                for (var n = 0; n < lines.length; n++) {
                                  ctx.fillText(lines[n], centerX, centerY);
                                  centerY += lineHeight;
                                }

                                //Draw text in center
                                ctx.fillText(line, centerX, centerY);
                              }
                            }
                          },
                          ChartDataLabels
                        ]}
                        width={600}
                        height={600}
                      />
                    </GridItem>
                    <GridItem xs={1} sm={1} md={1} lg={1} />
                    <GridItem
                      xs={11}
                      sm={11}
                      md={11}
                      lg={11}
                      style={{ textAlign: "center" }}
                    >
                      <FormLabel className={cx(classes.graphFooter)}>
                        {
                          "*Which can impact P&L, or Balance Sheet in a chosen Scenario"
                        }
                      </FormLabel>
                    </GridItem>
                    {/* <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      padding: "30 px !important",
                      justify: "center",
                      display: this.state.showLegend ? "block" : "none"
                    }}
                  >
                    <div
                      style={{
                        margin: 40,
                        border: "1px solid #ACACAC",
                        borderRadius: 5
                      }}
                    >
                      <Table
                        striped
                        tableHeaderColor="info"
                        tableHead={[]}
                        tableData={this.state.legendDisplayData}
                        customHeadCellClasses={[]}
                        customHeadClassesForCells={[]}
                        customCellClasses={[]}
                        customClassesForCells={[]}
                      />
                    </div>
                  </GridItem> */}
                  </GridContainer>
                </GridItem>
                {!this.props.printComponent && (
                  <GridItem
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    style={{
                      backgroundColor: "aliceblue",
                      placeContent: this.props.printComponent ? "center" : ""
                    }}
                  >
                    <GridContainer>
                      <GridItem
                        xs={11}
                        sm={11}
                        md={11}
                        lg={11}
                        className={
                          (classes.groupHeader, classes.featureTitleHeader)
                        }
                      >
                        Scenario Analysis - Adjust Hedge ratio
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <p className={cx(classes.graphFooter)}>
                          *This is based on proportionate and gross amount of
                          each currency exposures. In the Risk Impact
                          Calculations on the left, same currency exposures on
                          the opposite sides are netted off. In the Scenario
                          Analysis, they are grossed up.
                        </p>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer>
                          <GridItem xs={6} sm={6} md={6} lg={6}>
                            <FormControl fullWidth style={{ paddingTop: 3 }}>
                              <InputLabel
                                htmlFor="type"
                                className={classes.selectLabelRisk}
                              >
                                Modelled Senstitivity Percentage
                              </InputLabel>
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu
                                }}
                                value={this.state.modelSenstitivitySelected}
                                onChange={e =>
                                  this.onChangeSelect(
                                    e,
                                    "modelSenstitivitySelected"
                                  )
                                }
                                inputProps={{
                                  name: "modelSenstitivitySelected",
                                  id: "modelSenstitivitySelected",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown
                                  }
                                }}
                              >
                                <MenuItem
                                  disabled
                                  key={"modelSenstitivitySelected"}
                                  classes={{
                                    root: classes.selectMenuItem
                                  }}
                                >
                                  Choose Option
                                </MenuItem>
                                {senstitivityOptions.map((item, index) => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value={item.value}
                                    key={index}
                                  >
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText
                                style={{ color: "red" }}
                                hidden={
                                  this.state.modelSenstitivitySelectedState !==
                                  "error"
                                }
                              >
                                Select appropriate Senstitivity
                              </FormHelperText>
                            </FormControl>
                          </GridItem>
                          {this.state.modelSenstitivitySelected ==
                            "specify" && (
                            <GridItem xs={6} sm={6} md={6} lg={6}>
                              <CustomNumberFormat
                                success={
                                  this.state
                                    .modelSenstitivityPercentageState ===
                                  "success"
                                }
                                error={
                                  this.state
                                    .modelSenstitivityPercentageState ===
                                  "error"
                                }
                                helpText={
                                  this.state
                                    .modelSenstitivityPercentageState ===
                                    "error" &&
                                  this.state
                                    .modelSenstitivityPercentageErrorMsg[0]
                                }
                                value={this.state.modelSenstitivityPercentage}
                                onChange={this.onChange(
                                  "modelSenstitivityPercentage",
                                  null,
                                  ""
                                )}
                                labelText="Senstitivity Percentage"
                                suffix="%"
                                id="rr_modelSenstitivityPercentage"
                                formControlProps={{
                                  style: { paddingTop: 5 },
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: event => {
                                    this.setState({
                                      modelSenstitivityPercentagePristine: false
                                    });
                                    this.changePercentage(
                                      event,
                                      "modelSenstitivityPercentage",
                                      [
                                        { type: "required" },
                                        {
                                          type: "range",
                                          params: {
                                            min: 0,
                                            max: 100
                                          }
                                        }
                                      ]
                                    );
                                  },
                                  onChange: event => {
                                    if (
                                      !this.state
                                        .modelSenstitivityPercentagePristine
                                    ) {
                                      this.setState({
                                        modelSenstitivityPercentagePristine: false
                                      });
                                      this.changePercentage(
                                        event,
                                        "modelSenstitivityPercentage",
                                        [
                                          { type: "required" },
                                          {
                                            type: "range",
                                            params: {
                                              min: 0,
                                              max: 100
                                            }
                                          }
                                        ]
                                      );
                                    }
                                  }
                                }}
                              />
                            </GridItem>
                          )}
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        Modelled Hedge percentage for various Risk Categories
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <div
                              className={
                                classes.checkboxAndRadio +
                                " " +
                                classes.checkboxAndRadioHorizontal
                              }
                            >
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={
                                      this.state.checkedIndividualHedgeSlider
                                    }
                                    onChange={() =>
                                      this.handleRadioButtonChange(
                                        "checkedIndividualHedgeSlider",
                                        true
                                      )
                                    }
                                    name="checkedIndividualHedgeSlider"
                                    value="checkedIndividualHedgeSlider"
                                    aria-label="A"
                                    icon={
                                      <FiberManualRecord
                                        className={classes.radioUnchecked}
                                      />
                                    }
                                    checkedIcon={
                                      <FiberManualRecord
                                        className={classes.radioChecked}
                                      />
                                    }
                                    classes={{
                                      checked: classes.radio,
                                      root: classes.radioRoot
                                    }}
                                  />
                                }
                                classes={{
                                  label: classes.label
                                }}
                                label="Individual Hedge %"
                              />
                            </div>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <div
                              className={
                                classes.checkboxAndRadio +
                                " " +
                                classes.checkboxAndRadioHorizontal
                              }
                            >
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={
                                      !this.state.checkedIndividualHedgeSlider
                                    }
                                    onChange={() =>
                                      this.handleRadioButtonChange(
                                        "checkedIndividualHedgeSlider",
                                        false
                                      )
                                    }
                                    name="checkedOverallHedgeSlider"
                                    value="checkedOverallHedgeSlider"
                                    aria-label="A"
                                    icon={
                                      <FiberManualRecord
                                        className={classes.radioUnchecked}
                                      />
                                    }
                                    checkedIcon={
                                      <FiberManualRecord
                                        className={classes.radioChecked}
                                      />
                                    }
                                    classes={{
                                      checked: classes.radio,
                                      root: classes.radioRoot
                                    }}
                                  />
                                }
                                classes={{
                                  label: classes.label
                                }}
                                label="Overall Hedge %"
                              />
                            </div>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      {this.state.checkedIndividualHedgeSlider ? (
                        <>
                          <GridItem xs={4} sm={4} md={4} lg={4}>
                            <InputLabel
                              className={classes.labelRoot}
                              htmlFor={"imp_payable"}
                              // {...labelProps}
                            >
                              {"Payables"}
                            </InputLabel>
                            <ReactSlider
                              id={"imp_payables"}
                              value={
                                typeof this.state.hedgingPercentagePayables ===
                                "number"
                                  ? this.state.hedgingPercentagePayables
                                  : 0
                              }
                              onChange={val =>
                                this.handleSliderChange(
                                  "hedgingPercentagePayables",
                                  val
                                )
                              }
                              className={classes.horizontalSlider}
                              thumbClassName={classes.sliderThumb}
                              trackClassName={classes.sliderTrack}
                              renderThumb={(props, state) => (
                                <div {...props}>{state.valueNow + "%"}</div>
                              )}
                            />
                            {/* <CustomNumberFormat
                      success={
                        this.state.hedgingPercentagePayablesState === "success"
                      }
                      error={
                        this.state.hedgingPercentagePayablesState === "error"
                      }
                      helpText={
                        this.state.hedgingPercentagePayablesState === "error" &&
                        this.state.hedgingPercentagePayablesErrorMsg[0]
                      }
                      value={this.state.hedgingPercentagePayables}
                      onChange={event =>
                        this.handleChange("hedgingPercentagePayables", event)
                      }
                      labelText="Payables"
                      suffix="%"
                      id="rr_hedgingPercentagePayables"
                      formControlProps={{
                        style: { paddingTop: 0, margin: 0 },
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({
                            hedgingPercentagePayablesPristine: false
                          });
                          this.changePercentage(
                            event,
                            "hedgingPercentagePayables",
                            [
                              //{ type: "required" },
                              {
                                type: "range",
                                params: {
                                  min: 0,
                                  max: 100
                                }
                              }
                            ]
                          );
                        },
                        onChange: event => {
                          if (!this.state.hedgingPercentagePayablesPristine) {
                            this.setState({
                              hedgingPercentagePayablesPristine: false
                            });
                            this.changePercentage(
                              event,
                              "hedgingPercentagePayables",
                              [
                                //{ type: "required" },
                                {
                                  type: "range",
                                  params: {
                                    min: 0,
                                    max: 100
                                  }
                                }
                              ]
                            );
                          }
                        }
                      }}
                    /> */}
                          </GridItem>
                          <GridItem xs={4} sm={4} md={4} lg={4}>
                            <InputLabel
                              className={classes.labelRoot}
                              htmlFor={"imp_receivables"}
                              // {...labelProps}
                            >
                              {"Receivables"}
                            </InputLabel>
                            <ReactSlider
                              id={"imp_receivables"}
                              value={
                                typeof this.state
                                  .hedgingPercentageReceivables === "number"
                                  ? this.state.hedgingPercentageReceivables
                                  : 0
                              }
                              onChange={val =>
                                this.handleSliderChange(
                                  "hedgingPercentageReceivables",
                                  val
                                )
                              }
                              className={classes.horizontalSlider}
                              thumbClassName={classes.sliderThumb}
                              trackClassName={classes.sliderTrack}
                              renderThumb={(props, state) => (
                                <div {...props}>{state.valueNow + "%"}</div>
                              )}
                            />
                          </GridItem>

                          <GridItem xs={4} sm={4} md={4} lg={4}>
                            <InputLabel
                              className={classes.labelRoot}
                              htmlFor={"imp_forecastedRevenues"}
                              // {...labelProps}
                            >
                              {"Forecasted Revenues"}
                            </InputLabel>
                            <ReactSlider
                              id={"imp_forecastedRevenues"}
                              value={
                                typeof this.state
                                  .hedgingPercentageForecastedRevenues ===
                                "number"
                                  ? this.state
                                      .hedgingPercentageForecastedRevenues
                                  : 0
                              }
                              onChange={val =>
                                this.handleSliderChange(
                                  "hedgingPercentageForecastedRevenues",
                                  val
                                )
                              }
                              className={classes.horizontalSlider}
                              thumbClassName={classes.sliderThumb}
                              trackClassName={classes.sliderTrack}
                              renderThumb={(props, state) => (
                                <div {...props}>{state.valueNow + "%"}</div>
                              )}
                            />
                          </GridItem>
                          <GridItem xs={4} sm={4} md={4} lg={4}>
                            <InputLabel
                              className={classes.labelRoot}
                              htmlFor={"imp_forecastedCosts"}
                              // {...labelProps}
                            >
                              {"Forecasted Costs"}
                            </InputLabel>
                            <ReactSlider
                              id={"imp_forecastedCosts"}
                              value={
                                typeof this.state
                                  .hedgingPercentageForecastedCosts === "number"
                                  ? this.state.hedgingPercentageForecastedCosts
                                  : 0
                              }
                              onChange={val =>
                                this.handleSliderChange(
                                  "hedgingPercentageForecastedCosts",
                                  val
                                )
                              }
                              className={classes.horizontalSlider}
                              thumbClassName={classes.sliderThumb}
                              trackClassName={classes.sliderTrack}
                              renderThumb={(props, state) => (
                                <div {...props}>{state.valueNow + "%"}</div>
                              )}
                            />
                          </GridItem>
                          <GridItem xs={4} sm={4} md={4} lg={4}>
                            <InputLabel
                              className={classes.labelRoot}
                              htmlFor={"imp_existingAssets"}
                              // {...labelProps}
                            >
                              {"Asset or Investments"}
                            </InputLabel>
                            <ReactSlider
                              id={"imp_existingAssets"}
                              value={
                                typeof this.state.hedgingPercentageAssets ===
                                "number"
                                  ? this.state.hedgingPercentageAssets
                                  : 0
                              }
                              onChange={val =>
                                this.handleSliderChange(
                                  "hedgingPercentageAssets",
                                  val
                                )
                              }
                              className={classes.horizontalSlider}
                              thumbClassName={classes.sliderThumb}
                              trackClassName={classes.sliderTrack}
                              renderThumb={(props, state) => (
                                <div {...props}>{state.valueNow + "%"}</div>
                              )}
                            />
                          </GridItem>
                          <GridItem xs={4} sm={4} md={4} lg={4}>
                            <InputLabel
                              className={classes.labelRoot}
                              htmlFor={"imp_existingLiabilities"}
                              // {...labelProps}
                            >
                              {"Liabilities"}
                            </InputLabel>
                            <ReactSlider
                              id={"imp_existingLiabilities"}
                              value={
                                typeof this.state
                                  .hedgingPercentageLiabilities === "number"
                                  ? this.state.hedgingPercentageLiabilities
                                  : 0
                              }
                              onChange={val =>
                                this.handleSliderChange(
                                  "hedgingPercentageLiabilities",
                                  val
                                )
                              }
                              className={classes.horizontalSlider}
                              thumbClassName={classes.sliderThumb}
                              trackClassName={classes.sliderTrack}
                              renderThumb={(props, state) => (
                                <div {...props}>{state.valueNow + "%"}</div>
                              )}
                            />
                          </GridItem>
                        </>
                      ) : (
                        <>
                          <GridItem xs={4} sm={4} md={4} lg={4} />
                          <GridItem xs={4} sm={4} md={4} lg={4}>
                            <InputLabel
                              className={classes.labelRoot}
                              htmlFor={"imp_receivables"}
                              // {...labelProps}
                            >
                              {"Overall Categories"}
                            </InputLabel>
                            <ReactSlider
                              id={"imp_receivables"}
                              value={
                                typeof this.state
                                  .hedgingPercentageAllCategories === "number"
                                  ? this.state.hedgingPercentageAllCategories
                                  : 0
                              }
                              onChange={val =>
                                this.handleSliderChange(
                                  "hedgingPercentageAllCategories",
                                  val
                                )
                              }
                              className={classes.horizontalSlider}
                              thumbClassName={classes.sliderThumb}
                              trackClassName={classes.sliderTrack}
                              renderThumb={(props, state) => (
                                <div {...props}>{state.valueNow + "%"}</div>
                              )}
                            />
                          </GridItem>
                        </>
                      )}
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ textAlign: "center" }}
                      >
                        <Doughnut
                          key={this.state.doughnutScenarioChartKey}
                          backgroundColor="red"
                          // key={this.state.key}
                          data={this.state.doughnutScenarioChartData}
                          options={{
                            //segmentShowStroke: false,
                            elements: {
                              arc: {
                                borderWidth: 0
                              },

                              center: {
                                text:
                                  "Risk Amount* " +
                                  this.state.riskScenarioAmount +
                                  " " +
                                  this.props.functionalCurrency,
                                color: "white", // Default is #000000
                                fontStyle: "Arial", // Default is Arial
                                sidePadding: 15, // Default is 20 (as a percentage)
                                minFontSize: 12, // Default is 20 (in px), set to false and text will not wrap.
                                lineHeight: 20 // Default is 25 (in px), used for when text wraps
                              }
                            },

                            cutoutPercentage: 0,

                            legend: {
                              display: false,
                              // labels: {
                              //   fontColor: '#ffffff',
                              // },
                              onClick: () => {}
                            },
                            plugins: {
                              labels: [
                                {
                                  render: "label",
                                  position: "outside",
                                  outsidePadding: 4,
                                  fontSize: 12,
                                  fontStyle: "bold"
                                }
                              ]
                            },
                            responsive: true,
                            tooltips: {
                              callbacks: {
                                label: (tooltipItems, data) => {
                                  const item =
                                    data.datasets[tooltipItems.datasetIndex];
                                  return item.toolTip[tooltipItems.index] ===
                                    null
                                    ? null
                                    : item.labels[tooltipItems.index];
                                },
                                afterLabel: (tooltipItems, data) => {
                                  const item =
                                    data.datasets[tooltipItems.datasetIndex];
                                  return item.toolTip[tooltipItems.index] ===
                                    null
                                    ? null
                                    : item.toolTip[tooltipItems.index].split(
                                        "\n"
                                      );
                                }
                              }
                            }
                          }}
                          plugins={[
                            {
                              afterDatasetsDraw: function(chart) {
                                if (chart.config.options.elements.center) {
                                  // Get ctx from string
                                  var ctx = chart.chart.ctx;
                                  ctx.beginPath();
                                  // ctx.arc(
                                  //   chart.chart.width / 2,
                                  //   (chart.chart.height +
                                  //     chart.chart.chartArea.top) /
                                  //     2,
                                  //   chart.chart.innerRadius - 10,
                                  //   0,
                                  //   2 * Math.PI,
                                  //   false
                                  // );
                                  // ctx.fillStyle = "red";
                                  // ctx.fill();
                                  // Get options from the center object in options
                                  var centerConfig =
                                    chart.config.options.elements.center;
                                  var fontStyle =
                                    centerConfig.fontStyle || "Arial";
                                  var txt = centerConfig.text;
                                  var color = centerConfig.color || "#000";
                                  var maxFontSize =
                                    centerConfig.maxFontSize || 60;
                                  var sidePadding =
                                    centerConfig.sidePadding || 20;
                                  var sidePaddingCalculated =
                                    (sidePadding / 100) *
                                    (chart.innerRadius * 2);
                                  // Start with a base font of 30px
                                  ctx.font = "30px " + fontStyle;

                                  // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                                  var stringWidth = ctx.measureText(txt).width;
                                  var elementWidth =
                                    chart.innerRadius * 2 -
                                    sidePaddingCalculated;

                                  // Find out how much the font can grow in width.
                                  var widthRatio = elementWidth / stringWidth;
                                  var newFontSize = Math.floor(30 * widthRatio);
                                  var elementHeight = chart.innerRadius * 2;

                                  // Pick a new font size so it will not be larger than the height of label.
                                  var fontSizeToUse = Math.min(
                                    newFontSize,
                                    elementHeight,
                                    maxFontSize
                                  );
                                  var minFontSize = centerConfig.minFontSize;
                                  var lineHeight =
                                    centerConfig.lineHeight || 25;
                                  var wrapText = false;

                                  if (minFontSize === undefined) {
                                    minFontSize = 15;
                                  }

                                  if (
                                    minFontSize &&
                                    fontSizeToUse < minFontSize
                                  ) {
                                    fontSizeToUse = minFontSize;
                                    wrapText = true;
                                  }

                                  // Set font settings to draw it correctly.
                                  ctx.textAlign = "center";
                                  ctx.textBaseline = "middle";
                                  // console.log("before check", chart);
                                  var centerX =
                                    (chart.chartArea.left +
                                      chart.chartArea.right) /
                                    2;
                                  var centerY =
                                    (chart.chartArea.top +
                                      chart.chartArea.bottom) /
                                    2;
                                  ctx.font = fontSizeToUse + "px " + fontStyle;
                                  ctx.fillStyle = color;

                                  if (!wrapText) {
                                    ctx.fillText(txt, centerX, centerY);
                                    return;
                                  }

                                  var words = txt.split(" ");
                                  var line = "";
                                  var lines = [];

                                  // Break words up into multiple lines if necessary
                                  for (var n = 0; n < words.length; n++) {
                                    var testLine = line + words[n] + " ";
                                    var metrics = ctx.measureText(testLine);
                                    var testWidth = metrics.width;
                                    if (testWidth > elementWidth && n > 0) {
                                      lines.push(line);
                                      line = words[n] + " ";
                                    } else {
                                      line = testLine;
                                    }
                                  }

                                  // Move the center up depending on line height and number of lines
                                  centerY -= (lines.length / 2) * lineHeight;

                                  for (var n = 0; n < lines.length; n++) {
                                    ctx.fillText(lines[n], centerX, centerY);
                                    centerY += lineHeight;
                                  }

                                  //Draw text in center
                                  ctx.fillText(line, centerX, centerY);
                                }
                              }
                            }
                          ]}
                          width={1000}
                          height={600}
                        />
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                )}
              </GridContainer>
              {/* <GridContainer style={{ float: "right" }}>
              <GridItem
                xs={6}
                sm={6}
                md={6}
                lg={6}
                style={{ textAlign: "center" }}
              />
              <GridItem
                xs={5}
                sm={5}
                md={5}
                lg={5}
                style={{ textAlign: "center" }}
              >
                <Table
                  striped
                  tableHeaderColor="info"
                  // tableHead={this.state.tableColumns}
                  tableData={this.state.legendTableData}
                />
              </GridItem>
            </GridContainer> */}

              {this.state.showTable &&
                this.state.tableData.map((data, index) => {
                  return (
                    <GridContainer
                      id="risk-radar-table"
                      style={{ marginTop: "50px" }}
                      key={index}
                    >
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <h4>
                          <b>{data.title}</b>
                        </h4>
                      </GridItem>
                      <GridItem
                        xs={11}
                        sm={11}
                        md={11}
                        lg={11}
                        style={{ textAlign: "center" }}
                      >
                        <Table
                          striped
                          tableHeaderColor="info"
                          tableHead={this.state.tableColumns}
                          tableData={data.data}
                          customHeadCellClasses={[]}
                          customHeadClassesForCells={[]}
                          customCellClasses={[]}
                          customClassesForCells={[]}
                        />
                      </GridItem>
                    </GridContainer>
                  );
                })}
            </GridContainer>
          ) : (
            <GridContainer justify="center">
              Provide data in First Tab to see Risk Impact
            </GridContainer>
          )}
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeResponse}
            handlePositiveButton={this.handlePositiveResponse}
            positiveButtonText="Yes"
            negativeButtonText="No"
          />
        </div>
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: this.props.printComponent ? "" : "50px 30px 60px 50px",
            marginTop: "25px"
          }}
        >
          <GridContainer>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ textAlign: "center" }}
            >
              <h3>Currency Composition of Risk Impact</h3>
            </GridItem>
            <GridItem
              xs={1}
              sm={1}
              md={1}
              lg={1}
              style={{ textAlign: "center" }}
            />
            <GridItem
              xs={4}
              sm={4}
              md={4}
              lg={4}
              style={{ textAlign: "center" }}
            >
              <Doughnut
                key={this.state.currencyImpactChartKey}
                data={this.state.currencyImpactChartData}
                options={{
                  // segmentShowStroke: false,
                  elements: {
                    arc: {
                      borderWidth: 1
                    }
                  },
                  layout: {
                    padding: {
                      left: 60,
                      right: 60,
                      top: 60,
                      bottom: 60
                    }
                  },
                  cutoutPercentage: 0,
                  outlabels: {
                    text: "%l %p",
                    color: "white",
                    stretch: 45,
                    font: {
                      resizable: true,
                      minSize: 12,
                      maxSize: 18
                    }
                  },
                  legend: {
                    display: false,
                    position: "bottom"
                  },
                  plugins: {
                    labels: [
                      {
                        render: "label",
                        position: "outside",
                        outsidePadding: 4,
                        fontSize: 12,
                        fontStyle: "bold"
                      }
                    ]
                  },
                  responsive: true,
                  tooltips: {
                    callbacks: {
                      label: (tooltipItems, data) => {
                        const item = data.datasets[tooltipItems.datasetIndex];
                        return item.toolTip[tooltipItems.index] === null
                          ? null
                          : item.labels[tooltipItems.index];
                      },
                      afterLabel: (tooltipItems, data) => {
                        const item = data.datasets[tooltipItems.datasetIndex];
                        return item.toolTip[tooltipItems.index] === null
                          ? null
                          : item.toolTip[tooltipItems.index].split("\n");
                      }
                    }
                  },
                  onClick: (e, item) => {}
                }}
                plugins={[ChartDataLabels]}
                width={400}
                height={400}
              />
            </GridItem>
            {!this.props.printComponent && (
              <>
                <GridItem
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ textAlign: "center" }}
                />
                <GridItem
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  style={{ textAlign: "center" }}
                >
                  <Doughnut
                    key={this.state.currencyScenarioBasedImpactChartKey}
                    data={this.state.currencyScenarioBasedImpactChartData}
                    options={{
                      // segmentShowStroke: false,
                      elements: {
                        arc: {
                          borderWidth: 1
                        }
                      },
                      layout: {
                        padding: {
                          left: 60,
                          right: 60,
                          top: 60,
                          bottom: 60
                        }
                      },
                      cutoutPercentage: 0,
                      outlabels: {
                        text: "%l %p",
                        color: "white",
                        stretch: 45,
                        font: {
                          resizable: true,
                          minSize: 12,
                          maxSize: 18
                        }
                      },
                      legend: {
                        display: false,
                        position: "bottom"
                      },
                      plugins: {
                        labels: [
                          {
                            render: "label",
                            position: "outside",
                            outsidePadding: 4,
                            fontSize: 12,
                            fontStyle: "bold"
                          }
                        ]
                      },
                      responsive: true,
                      tooltips: {
                        callbacks: {
                          label: (tooltipItems, data) => {
                            const item =
                              data.datasets[tooltipItems.datasetIndex];
                            return item.toolTip[tooltipItems.index] === null
                              ? null
                              : item.labels[tooltipItems.index];
                          },
                          afterLabel: (tooltipItems, data) => {
                            const item =
                              data.datasets[tooltipItems.datasetIndex];
                            return item.toolTip[tooltipItems.index] === null
                              ? null
                              : item.toolTip[tooltipItems.index].split("\n");
                          }
                        }
                      },
                      onClick: (e, item) => {}
                    }}
                    plugins={[ChartDataLabels]}
                    width={400}
                    height={400}
                  />
                </GridItem>

                <GridItem
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  style={{ textAlign: "center" }}
                />
              </>
            )}
            <GridContainer>
              {/* <GridItem
              xs={2}
              sm={2}
              md={2}
              lg={2}
              style={{ textAlign: "center"}}
            > </GridItem> */}
              <GridItem
                xs={this.props.printComponent ? 12 : 6}
                sm={this.props.printComponent ? 12 : 6}
                md={this.props.printComponent ? 12 : 6}
                lg={this.props.printComponent ? 12 : 6}
                style={{ textAlign: "center" }}
              >
                <HorizontalBar
                  key={this.state.barChartKey}
                  data={this.state.barChartData}
                  options={{
                    tooltips: {
                      //mode: 'x',
                      callbacks: {
                        label: function(tooltipItem, data) {
                          return data.datasets[tooltipItem.datasetIndex]
                            .toolTip[tooltipItem.index]; //+ ": " + formatMoney(Math.abs(tooltipItem.yLabel));
                          //return 'Amount'
                        }
                        // afterLabel: (tooltipItem, data) => {
                        //   return data.datasets[tooltipItem.datasetIndex].toolTip[tooltipItem.index]

                        // }
                      }
                    },
                    indexAxis: "y",
                    responsive: !this.props.printComponent,
                    maintainAspectRatio: !this.props.printComponent,
                    legend: { display: false },

                    scales: {
                      xAxes: [
                        {
                          stacked: true,
                          ticks: {
                            callback: function(value) {
                              return formatMoney(value);
                            }
                          },
                          scaleLabel: {
                            display: true,
                            labelString:
                              "All amounts in " + this.props.functionalCurrency
                          }
                        }
                      ],
                      yAxes: [
                        {
                          stacked: true,
                          maxBarThickness: 20,
                          gridLines: { display: false }
                        }
                      ]
                    },
                    onClick: (event, item) => {}
                  }}
                  width={this.props.printComponent ? 700 : 400}
                  height={this.props.printComponent ? 400 : 200}
                />
              </GridItem>
              {!this.props.printComponent && (
                <GridItem
                  xs={this.props.printComponent ? 12 : 6}
                  sm={this.props.printComponent ? 12 : 6}
                  md={this.props.printComponent ? 12 : 6}
                  lg={this.props.printComponent ? 12 : 6}
                  style={{ textAlign: "center" }}
                >
                  <HorizontalBar
                    key={this.state.barChartScenarioBasedKey}
                    data={this.state.barChartScenarioBasedData}
                    options={{
                      tooltips: {
                        //mode: 'x',
                        callbacks: {
                          label: function(tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex]
                              .toolTip[tooltipItem.index]; //+ ": " + formatMoney(Math.abs(tooltipItem.yLabel));
                            //return 'Amount'
                          }
                          // afterLabel: (tooltipItem, data) => {
                          //   return data.datasets[tooltipItem.datasetIndex].toolTip[tooltipItem.index]

                          // }
                        }
                      },
                      indexAxis: "y",
                      responsive: !this.props.printComponent,
                      maintainAspectRatio: !this.props.printComponent,
                      legend: { display: false },

                      scales: {
                        xAxes: [
                          {
                            stacked: true,
                            ticks: {
                              callback: function(value) {
                                return formatMoney(value);
                              }
                            },
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
                            maxBarThickness: 20,
                            gridLines: { display: false }
                          }
                        ]
                      },
                      onClick: (event, item) => {}
                    }}
                    width={this.props.printComponent ? 700 : 400}
                    height={this.props.printComponent ? 400 : 200}
                  />
                </GridItem>
              )}
              {/* <GridItem
              xs={2}
              sm={2}
              md={2}
              lg={2}
              style={{ textAlign: "center"}}
            > </GridItem> */}
            </GridContainer>
          </GridContainer>
        </div>
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: this.props.printComponent ? "" : "50px 30px 60px 50px",
            marginTop: "25px"
          }}
        >
          <GridContainer>
            <GridItem
              xs={6}
              sm={6}
              md={6}
              lg={6}
              style={{
                padding: "30 px !important",
                justify: "center",
                display: this.state.showLegend ? "block" : "none"
              }}
            >
              <div
                style={{
                  margin: 40,
                  border: "1px solid #ACACAC",
                  borderRadius: 5
                }}
              >
                <Table
                  striped
                  tableHeaderColor="info"
                  tableHead={[
                    "Category",
                    "Amounts in " + this.props.functionalCurrency
                  ]}
                  tableData={this.state.legendDisplayData}
                  customHeadCellClasses={[]}
                  customHeadClassesForCells={[]}
                  customCellClasses={[]}
                  customClassesForCells={[]}
                />
              </div>
            </GridItem>
            {!this.props.printComponent && (
              <GridItem
                xs={6}
                sm={6}
                md={6}
                lg={6}
                style={{
                  padding: "30px !important",
                  justify: "center",
                  visibility: this.state.showRiskScenarioLegend ? "" : "hidden"
                }}
              >
                <div
                  style={{
                    margin: 40,
                    border: "1px solid #ACACAC",
                    borderRadius: 5
                  }}
                >
                  <Table
                    striped
                    tableHeaderColor="info"
                    tableHead={[
                      "Category",
                      "Amounts in " + this.props.functionalCurrency
                    ]}
                    tableData={this.state.riskScenarioLegendDisplayData}
                    customHeadCellClasses={[]}
                    customHeadClassesForCells={[]}
                    customCellClasses={[]}
                    customClassesForCells={[]}
                  />
                </div>
              </GridItem>
            )}
          </GridContainer>
        </div>
      </>
    );
  }
}
RiskImpact.propTypes = {
  classes: PropTypes.object.isRequired,
  riskRadarData: PropTypes.object.isRequired,
  functionalCurrency: PropTypes.object.isRequired,
  senstivityPercentage: PropTypes.object.isRequired,
  updateSenstitivityPercentage: PropTypes.func,
  printComponent: PropTypes.object,
  isChanged: PropTypes.bool
};
export default withStyles(style)(RiskImpact);
