import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Edit from "@material-ui/icons/Edit";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import IconButton from "@material-ui/core/IconButton";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import Table from "components/Table/Table.jsx";
import {
  formatMoney,
  formatDate,
  sortArray,
  sortByNumber
} from "../../../../utils/Utils";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const RISK_CATEGORY_INFO = [
  { name: "Payables", key: "payables", type: "PAYABLES" },
  { name: "Receivables", key: "receivables", type: "RECEIVABLES" },
  {
    name: "Forecasted Revenues",
    key: "forecastedRevenues",
    type: "FORECASTED_REVENUES"
  },
  {
    name: "Forecasted Costs",
    key: "forecastedCosts",
    type: "FORECASTED_COSTS"
  },
  { name: "Asset or Investments", key: "assets", type: "ASSETS" },
  { name: "Liabilities", key: "liabilities", type: "LIABILITIES" }
  // { name: "External Hedges", key: "externalHedges" }
];

const style = {
  container: {
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
  },
  mincontainer: {
    backgroundColor: "#ffffff",
    padding: "10px 0px"
  },
  tableHeadBold: {
    fontWeight: "bold"
  },
  tableHedgeHead: {
    //backgroundColor: "#5882c780",
    fontWeight: "bold"
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
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black"
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  currencyPairTag: {
    cursor: "pointer"
  },
  elemGreen: {
    color: "#53ac57"
  },
  elemRed: {
    color: "red"
  },
  elemBlack: {
    color: "#000000de"
  },
  closeButton: {
    visibility: "hidden"
  },
  currencyPair: {
    "&:hover": {
      "& button": {
        visibility: "visible"
      }
    }
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

const CATEGORIES = [
  { name: "Payables", key: "payables" },
  { name: "Receivables", key: "receivables" },
  { name: "Forecasted Revenues", key: "forecastedRevenues" },
  { name: "Forecasted Costs", key: "forecastedCosts" },
  { name: "Asset or Investments", key: "existingAssets" },
  { name: "Liabilities", key: "existingLiabilities" }
];

class ExposuresList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: {},
      displayData: [],
      keyRiskItems: [],
      columns: [],
      displayCategoryData: []
    };
  }

  componentDidMount() {
    //this.getAPIData()
    this.getData();
  }

  getData = () => {
    const parsedRiskRadarData =
      this.props.parsedRiskRadarData && this.props.parsedRiskRadarData.risks
        ? this.props.parsedRiskRadarData.risks
        : [];
    const risks =
      this.props.riskRadarData && this.props.riskRadarData.risks
        ? this.props.riskRadarData.risks
        : [];
    let totalRiskAmount = 0;
    totalRiskAmount =
      risks.reduce(function(_this, val) {
        return _this + val.convertedValueAfterHedge;
      }, 0) + totalRiskAmount;
    // console.log('checkcheck', parsedRiskRadarData)
    // console.log('checkcheck', risks)
    // console.log('checkcheck', totalRiskAmount)
    // {
    //   name: "Forecasted Costs",
    //   key: "forecastedCosts",
    //   type: "FORECASTED_COSTS"
    // }
    let risksData = [];
    RISK_CATEGORY_INFO.forEach((x, index) => {
      if (parsedRiskRadarData[x.key]) {
        let arr = parsedRiskRadarData[x.key].filter(
          x => x.convertedValueAfterHedge > 0
        );
        //console.log('checkcheck', arr)
        //console.log('checkcheck', x)
        //console.log('checkcheck', parsedRiskRadarData[x.key])
        let riskAmount = 0;
        riskAmount =
          arr.reduce(function(_this, val) {
            return _this + val.convertedValueAfterHedge;
          }, 0) + riskAmount;
        //  console.log('checkcheck', riskAmount)

        let riskPercent =
          totalRiskAmount > 0 ? (riskAmount / totalRiskAmount) * 100 : 0;
        //console.log('checkcheck', riskPercent)
        risksData.push({
          riskAmount: riskAmount,
          category: x.key,
          displayName: x.name,
          riskPercent: riskPercent
        });
      }
    });

    let arr = sortByNumber(risksData, "riskAmount", false);
    // arr = arr.filter(x => x.riskPercent > 80);

    let displayData = [],
      totalRiskPercent = 0;
    arr.forEach((x, index) => {
      if (x.riskPercent !== 0) {
        totalRiskPercent += x.riskPercent;
        displayData.push([
          index + 1,
          x.displayName,
          this.props.functionalCurrency +
            " " +
            formatMoney(
              ((x.riskAmount * this.props.senstivityPercentage) / 100).toFixed(
                2
              )
            ),
          "Risk " + x.riskPercent ? x.riskPercent.toFixed(2) + "%" : 0 + "%"
        ]);
      }
    });
    displayData = [
      [
        0,
        "",
        "Total Risks: " +
          this.props.functionalCurrency +
          " " +
          formatMoney(
            ((totalRiskAmount * this.props.senstivityPercentage) / 100).toFixed(
              2
            )
          ),
        ""
      ],
      ...displayData
    ];

    // Getting Key Risks
    // Calculating 80% of total Risks
    const RiskPercentage80 = totalRiskAmount * 0.8;

    // Sort risk based on unhedge amount
    let riskArr = risks.sort(
      (a, b) => b.convertedValueAfterHedge - a.convertedValueAfterHedge
    );
    let keyRiskItems = [];
    let riskAmount = 0;
    riskArr.forEach((item, index) => {
      // if (riskAmount < RiskPercentage80) {
      if (item.amount - item.hedgedAmount > 0) {
        keyRiskItems.push([
          index,
          this.getRiskCategoryName(item.riskType),
          item.currencyCode +
            " " +
            formatMoney(item.amount - item.hedgedAmount),
          item.convertedValueCurrencyCode +
            " " +
            formatMoney(
              (item.convertedValueAfterHedge *
                this.props.senstivityPercentage) /
                100
            ),
          formatDate(item.dueDate)
        ]);
        riskAmount = riskAmount + item.convertedValueAfterHedge;
      }
    });
    this.setState({
      //displayData:displayData,
      displayData: displayData,
      keyRiskItems: keyRiskItems
    });
  };
  getRiskCategoryName = type => {
    const cat = RISK_CATEGORY_INFO.filter(cat => cat.type === type);
    if (cat.length > 0) {
      return cat[0].name;
    } else {
      return type;
    }
  };
  getAPIData = async () => {
    this.props.setLoading(true);

    //CALCULATOR_RISK_EXPOSURE
    const res = await apiHandler({
      url: endpoint.CALCULATOR_RISK_EXPOSURE,
      authToken: sessionStorage.getItem("token")
    });

    console.log("getapidtacehck", res.data);
    if (
      res.data.errorCode &&
      (res.data.errorCode === 403 || res.data.errorCode === 500)
    ) {
      this.props.setLoading(false);
      return;
    } else if (res.data.errorCode) {
      this.props.setLoading(false);

      return;
    } else {
      this.setState({
        apiData: res.data
      });
      this.parseData(res.data);
    }
  };

  parseData = apiData => {
    let functionalCurrency = apiData.functionalCurrency
      ? apiData.functionalCurrency
      : "";
    let displayData = [
      [
        0,
        "Total Exposure",
        apiData.totalExposure
          ? formatMoney(apiData.totalExposure) + " " + functionalCurrency
          : 0
      ],
      [
        1,
        "Total Risk",
        apiData.eightyPercent
          ? formatMoney(apiData.eightyPercent) + " " + functionalCurrency
          : 0
      ]
    ];

    let categoryData = [],
      categoryDisplayData = [];

    CATEGORIES.forEach((x, index) => {
      if (apiData && apiData[x.key]) {
        apiData[x.key].forEach(y => {
          categoryData = [...categoryData, { ...y, category: x.name }];
        });
      }
    });

    let sortedArr = sortArray(categoryData, "convertedAmount", false, "number");
    sortedArr.forEach((x, index) => {
      categoryDisplayData = [
        ...categoryDisplayData,
        [
          index,
          x.category,
          formatMoney(x.convertedAmount) + " " + functionalCurrency,
          x.date ? formatDate(x.date) : ""
        ]
      ];
    });
    console.log("datacheck", categoryDisplayData);

    this.setState({
      displayData: displayData,
      displayCategoryData: categoryDisplayData
    });
  };
  render() {
    const { classes, display } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridContainer justify="center">
              <GridItem xs={3} sm={3} md={3} lg={3} />
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <Table
                  striped
                  tableHeaderColor="info"
                  tableHead={this.state.columns}
                  tableData={this.state.displayData}
                  customHeadCellClasses={[]}
                  customHeadClassesForCells={[]}
                  customCellClasses={[]}
                  customClassesForCells={[]}
                  isMarketData={false}
                />
              </GridItem>
              <GridItem xs={3} sm={3} md={3} lg={3} />
            </GridContainer>
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ marginTop: "20px" }}
          >
            <Table
              striped
              tableHeaderColor="info"
              tableHead={this.state.columns}
              tableData={this.state.displayCategoryData}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[]}
              customClassesForCells={[]}
              isMarketData={false}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ marginTop: "20px" }}
          >
            <Table
              striped
              tableHeaderColor="info"
              tableHead={["Type", "Unhedged Amount", "Risk Amount", "Due Date"]}
              tableData={this.state.keyRiskItems}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[]}
              customClassesForCells={[]}
              isMarketData={false}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
ExposuresList.propTypes = {
  classes: PropTypes.object.isRequired,
  setLoading: PropTypes.func.isRequired,
  parsedRiskRadarData: PropTypes.object,
  riskRadarData: PropTypes.object,
  functionalCurrency: PropTypes.object,
  senstivityPercentage: PropTypes.object
};
export default withStyles(style)(ExposuresList);
