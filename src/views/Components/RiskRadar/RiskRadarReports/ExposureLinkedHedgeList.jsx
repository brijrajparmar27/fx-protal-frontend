import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { formatMoney, formatDate } from "../../../../utils/Utils";

const style = {
  container: {
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
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

class ExposureLinkedHedgeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      displayTable: [],
      apiData: {},
      selectedCategory: "payables"
    };
  }

  componentDidMount() {
    this.handleClickSelectCategory(this.state.selectedCategory);
  }

  getHedgeObject = hedgeId => {
    const { parsedRiskRadarData } = this.props;
    if (parsedRiskRadarData.hedges && parsedRiskRadarData.hedges.length > 0) {
      const hedges = parsedRiskRadarData.hedges.filter(y => y.id === hedgeId);
      console.log("Hedges - ", hedges);
      if (hedges.length > 0) return hedges[0];
      else return null;
    } else return null;
  };
  handleClickSelectCategory = selectedCategory => {
    const { parsedRiskRadarData } = this.props;
    let displayTable = [];
    parsedRiskRadarData &&
      parsedRiskRadarData.risks[selectedCategory] &&
      parsedRiskRadarData.risks[selectedCategory].forEach((x, index) => {
        if (x.riskHedgeModels && x.riskHedgeModels.length > 0) {
          const hedgePercentage =
            ((x.convertedValueBeforeHedge - x.convertedValueAfterHedge) * 100) /
            x.convertedValueBeforeHedge;
          let displayData = [];
          displayData.push([
            index,
            x.riskType,
            x.currencyCode +
              " " +
              formatMoney(x.hedgedAmount) +
              " (" +
              hedgePercentage.toFixed(0) +
              "%)",
            "Date " + formatDate(x.dueDate)
          ]);

          x.riskHedgeModels.forEach((y, idx) => {
            const hedgeDetails = this.getHedgeObject(y.hedgeId);
            if (hedgeDetails) {
              const {
                hedgeType,
                soldCurrencyCode,
                boughtCurrencyCode,
                currencySold,
                currencyBought,
                settlementDate
              } = hedgeDetails;
              displayData.push([
                index + idx + 1,
                hedgeType + " Hedge",
                "Sell " +
                  soldCurrencyCode +
                  " " +
                  formatMoney(currencySold) +
                  " Buy " +
                  boughtCurrencyCode +
                  " " +
                  formatMoney(currencyBought),
                "Settlement Date " + formatDate(settlementDate)
              ]);
            }
          });
          displayTable.push(displayData);
        }
      });
    console.log("handleClickSelectCategory", displayTable);
    this.setState({
      selectedCategory: selectedCategory,
      displayTable: displayTable
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
      </div>
    );
  }
}
ExposureLinkedHedgeList.propTypes = {
  classes: PropTypes.object.isRequired,
  parsedRiskRadarData: PropTypes.object.isRequired
};
export default withStyles(style)(ExposureLinkedHedgeList);
