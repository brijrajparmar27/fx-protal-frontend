import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";

const style = {
  container: {
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
  }
};

class ActualHedge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: {},
      columns: [],
      displayData: []
    };
  }

  componentDidMount() {
    this.parseData(this.props.riskRadarData);
  }
  // getNoHedgePercentage = () => {
  //   const { riskRadarData, functionalCurrency } = this.props;
  //   const { hedges, totalHedges } = riskRadarData;
  //   let noHedgeAmount = 0;

  //   hedges &&
  //     hedges.forEach(hedge => {
  //       if (hedge.soldCurrencyCode === functionalCurrency) {
  //         noHedgeAmount =
  //           noHedgeAmount +
  //           hedge.currencyBoughtBalance * hedge.buyExchangeRateInFunCurrency;
  //       } else if (hedge.boughtCurrencyCode === functionalCurrency) {
  //         noHedgeAmount =
  //           noHedgeAmount +
  //           hedge.currencySoldBalance * hedge.sellExchangeRateInFunCurrency;
  //       } else {
  //         noHedgeAmount =
  //           noHedgeAmount +
  //           hedge.currencyBoughtBalance * hedge.buyExchangeRateInFunCurrency;
  //       }
  //     });

  //   return (noHedgeAmount * 100) / totalHedges;
  // };
  parseData = apiData => {
    const {
      overallHedgingPercentage,
      riskHedgingPercentage,
      unLinkedHedgingPercentage
    } = apiData;
    const displayData = [
      [
        0,
        "Overall Hedge %",
        overallHedgingPercentage && overallHedgingPercentage !== "NA"
          ? overallHedgingPercentage + "%"
          : 0 + "%"
      ],
      [
        1,
        "Receivable Hedge %",
        riskHedgingPercentage.RECEIVABLES &&
        riskHedgingPercentage.RECEIVABLES !== "NA"
          ? riskHedgingPercentage.RECEIVABLES + "%"
          : 0 + "%"
      ],
      [
        2,
        "Payable Hedge %",
        riskHedgingPercentage.PAYABLES &&
        riskHedgingPercentage.PAYABLES !== "NA"
          ? riskHedgingPercentage.PAYABLES + "%"
          : 0 + "%"
      ],
      [
        3,
        "Forecasted Revenue Hedge %",
        riskHedgingPercentage.FORECASTED_REVENUES &&
        riskHedgingPercentage.FORECASTED_REVENUES !== "NA"
          ? riskHedgingPercentage.FORECASTED_REVENUES + "%"
          : 0 + "%"
      ],
      [
        4,
        "Forecasted Cost Hedge %",
        riskHedgingPercentage.FORECASTED_COSTS &&
        riskHedgingPercentage.FORECASTED_COSTS !== "NA"
          ? riskHedgingPercentage.FORECASTED_COSTS + "%"
          : 0 + "%"
      ],
      [
        5,
        "Asset Hedge %",
        riskHedgingPercentage.ASSETS && riskHedgingPercentage.ASSETS !== "NA"
          ? riskHedgingPercentage.ASSETS + "%"
          : 0 + "%"
      ],
      [
        6,
        "Liability Hedge %",
        riskHedgingPercentage.LIABILITIES &&
        riskHedgingPercentage.LIABILITIES !== "NA"
          ? riskHedgingPercentage.LIABILITIES + "%"
          : 0 + "%"
      ],
      [7, "Hedges Not Linked %", unLinkedHedgingPercentage + "%"]
    ];
    this.setState({
      displayData
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
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
      </div>
    );
  }
}
ActualHedge.propTypes = {
  classes: PropTypes.object.isRequired,
  riskRadarData: PropTypes.object.isRequired,
  functionalCurrency: PropTypes.object.isRequired
};
export default withStyles(style)(ActualHedge);
