import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import IconButton from "@material-ui/core/IconButton";
import HedgeEffectivenessGraph from "./HedgeEffectivenessGraph";
// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { formatMoney, formatDate } from "../../../../utils/Utils";

import cx from "classnames";

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
  { name: "Asset or Investments", key: "assets" },
  { name: "Liabilities", key: "liabilities" }
];

class HedgeEffectiveness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      displayTable: [],
      apiData: {},
      selectedCategory: "payables",
      showTable: false,
      showGraphModal: false,
      categoryData: null,
      dealData: null,
      hedgeGraphData: null,
      functionalCurrency: ""
    };
  }

  componentDidMount() {
    this.handleClickSelectCategory(this.state.selectedCategory);
  }

  displayGraphView = (categoryDataId, dealId) => {
    return (
      <div>
        <IconButton
          aria-label="close"
          // className={this.props.classes.graphIcon}
          onClick={() => this.onClickDisplayGraph(categoryDataId, dealId)}
        >
          <TrendingUpIcon />
        </IconButton>
      </div>
    );
  };
  onClickDisplayGraph = (categoryDataId, dealId) => {
    const data = {
      functionalCurrency: this.state.functionalCurrency,
      riskId: categoryDataId,
      hedgeId: dealId
    };
    this.setState({
      showGraphModal: true,
      hedgeGraphData: data
    });
  };
  getHedgeObject = hedgeId => {
    const { parsedRiskRadarData } = this.props;
    if (parsedRiskRadarData.hedges && parsedRiskRadarData.hedges.length > 0) {
      const hedges = parsedRiskRadarData.hedges.filter(y => y.id === hedgeId);
      if (hedges.length > 0) return hedges[0];
      else return null;
    } else return null;
  };
  handleClickSelectCategory = selectedCategory => {
    const { parsedRiskRadarData } = this.props;
    const { functionalCurrency, risks, hedges } = parsedRiskRadarData;

    let columns = [
      "Risk & Hedge",
      "Hedge Date",
      "Maturity Date",
      "Forward Rate on hedge",
      "Amount",
      "Current Valuation on spot basis in " +
        functionalCurrency +
        " (Functional currency) "
    ];

    let displayTable = [];
    risks &&
      risks[selectedCategory] &&
      risks[selectedCategory].forEach((x, index) => {
        if (x) {
          const {
            hedgeType,
            dueDate,
            currencyCode,
            amount,
            exchangeRate,
            riskHedgeModels
          } = x;

          if (riskHedgeModels && riskHedgeModels.length > 0) {
            let displayData = [];
            displayData.push([
              index,
              hedgeType,
              "",
              formatDate(dueDate),
              "",
              currencyCode + " " + formatMoney(amount),
              this.getAmount(amount, exchangeRate),
              ""
            ]);

            riskHedgeModels.forEach((y, idx) => {
              const {
                hedgeType,
                soldCurrencyCode,
                boughtCurrencyCode,
                currencySold,
                currencyBought,
                dealDate,
                settlementDate,
                convertedValueInFunCurrency,
                convertedValueCurrencyCode
              } = this.getHedgeObject(y.hedgeId);
              displayData.push([
                index + idx + 1,
                "Associated Hedge " + hedgeType,
                formatDate(dealDate),
                formatDate(settlementDate),
                formatMoney(y.amount),
                "Sell " +
                  soldCurrencyCode +
                  " " +
                  formatMoney(currencySold) +
                  " Buy " +
                  boughtCurrencyCode +
                  " " +
                  formatMoney(currencyBought),
                convertedValueInFunCurrency > 0
                  ? formatMoney(convertedValueInFunCurrency)
                  : "",
                this.displayGraphView(x.id, y.hedgeId)
              ]);
            });
            displayTable.push(displayData);
          }
        }
      });
    console.log("handleClickSelectCategory", displayTable);
    this.setState({
      selectedCategory: selectedCategory,
      displayTable: displayTable,
      columns: columns,
      functionalCurrency: functionalCurrency
    });
  };

  getAmount = (amount, exchangeRate) => {
    return formatMoney(amount * exchangeRate);
  };
  handleCloseDialog = stateName => {
    this.setState({
      [stateName]: false
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ alignSelf: "center" }}
              >
                {CATEGORIES.map((obj, index) => {
                  return this.state.selectedCategory !== obj.key ? (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        marginRight: 25,
                        cursor: "pointer"
                      }}
                      onClick={() => this.handleClickSelectCategory(obj.key)}
                    >
                      {obj.name}
                    </span>
                  ) : (
                    <Button
                      style={{
                        textAlign: "center",
                        backgroundColor: "#1D64B0",
                        marginRight: 20
                      }}
                      size="sm"
                      className={classes.marginRight}
                    >
                      {obj.name}
                    </Button>
                  );
                })}
              </GridItem>

              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "20px" }}
              >
                {this.state.displayTable && this.state.displayTable.length
                  ? this.state.displayTable.map((data, index) => (
                      <div
                        key={index}
                        style={{ marginTop: 10, border: "1px solid #ACACAC" }}
                      >
                        <Table
                          striped
                          tableHeaderColor="info"
                          tableHead={this.state.columns}
                          tableData={data}
                          customHeadCellClasses={[]}
                          customHeadClassesForCells={[]}
                          customCellClasses={[]}
                          customClassesForCells={[]}
                          isMarketData={false}
                        />
                      </div>
                    ))
                  : null}
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>

        {this.state.showGraphModal && this.state.hedgeGraphData !== null && (
          <HedgeEffectivenessGraph
            showModal={this.state.showGraphModal}
            handleClose={this.handleCloseDialog}
            hedgeGraphData={this.state.hedgeGraphData}
          />
        )}
      </div>
    );
  }
}
HedgeEffectiveness.propTypes = {
  classes: PropTypes.object.isRequired,
  parsedRiskRadarData: PropTypes.object.isRequired
};
export default withStyles(style)(HedgeEffectiveness);
