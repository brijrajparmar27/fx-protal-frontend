import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import cx from "classnames";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";
import { formatMoney } from "../../utils/Utils";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "components/Table/Table.jsx";

import {
  cardTitle,
  roseColor,
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { Bar } from "react-chartjsx";

const styles = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  exposureCard: {
    marginTop: 15,
    marginBottom: 10
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem"
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px"
  },
  footer: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "10px 5px"
  },
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px"
    }
  },
  iconRose: {
    color: roseColor
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  addIcon: {
    marginTop: 0,
    height: 35,
    width: 35,
    borderRadius: 6
  },
  marginTop30: {
    marginTop: "30px"
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px"
    }
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white"
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "black"
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 18,
    marginRight: 5
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999"
  },
  listItemIcon: {
    marginTop: "-3px",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    color: "inherit",
    display: "inline-block"
  },
  filledSelect: {
    backgroundColor: "grey",
    color: "white !important"
  },
  white: {
    color: "white"
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white"
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right"
  },
  currencyLabel: {
    paddingTop: "7px !important",
    float: "left"
  },
  exposureTable: {
    td: {
      margin: "0 10px"
    }
  },
  tableHead20Bold: {
    fontWeight: "bold",
    width: "20%"
  },
  tableHead25Bold: {
    fontWeight: "bold",
    width: "25%"
  },
  tableHeadBold: {
    fontWeight: "bold"
  },
  tooltip123: {
    padding: "10px 15px",
    minWidth: "130px",
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
    maxWidth: "200px",
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
  },
  ...customSelectStyle,
  ...regularFormsStyle
};

class FXExposureCalculatorPrint extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      data: [],
      FCSalesColumns: [
        ["Net FC", <sup>*</sup>, " Sales"],
        "Currency",
        "Spot Rate with Base Currency",
        "Amount in Base Currency"
      ],
      FCCostsColumns: [
        ["Net FC", <sup>*</sup>, " Costs"],
        "Currency",
        "Spot Rate with Base Currency",
        "Amount in Base Currency"
      ],
      HedgingColumns: [
        "",
        "Home Currency Strengthening",
        "No Movement",
        "Home Currency Weakening"
      ]
    };

    this.state = this.initialState;
  }

  getFCData = (foreignCurrency, total, message, percentage) => {
    let data = [];
    foreignCurrency &&
      foreignCurrency.forEach((fs, index) => {
        let row = [
          index,
          formatMoney(fs.amount),
          fs.currencyCode,
          fs.exchangeRate,
          formatMoney(fs.convertedAmount)
        ];
        data.push(row);
      });
    data.push(["", "", "", "Total", formatMoney(total)]);
    data.push(["", "", "", message, percentage + "%"]);
    return data;
  };

  getNoHedgingTableData = withoutHedging => {
    let data = [];
    let index = 0;
    // First Row
    data.push([
      index++,
      "Sales in Home Currency",
      formatMoney(
        withoutHedging &&
          withoutHedging.sales &&
          withoutHedging.sales.strengtheningAmount
      ),
      formatMoney(
        withoutHedging &&
          withoutHedging.sales &&
          withoutHedging.sales.actualAmount
      ),
      formatMoney(
        withoutHedging &&
          withoutHedging.sales &&
          withoutHedging.sales.weakeningAmount
      )
    ]);
    // Second Row
    data.push([
      index++,
      "Cost of Sales in Home Currency",
      formatMoney(
        withoutHedging &&
          withoutHedging.costOfSales &&
          withoutHedging.costOfSales.strengtheningAmount
      ),
      formatMoney(
        withoutHedging &&
          withoutHedging.costOfSales &&
          withoutHedging.costOfSales.actualAmount
      ),
      formatMoney(
        withoutHedging &&
          withoutHedging.costOfSales &&
          withoutHedging.costOfSales.weakeningAmount
      )
    ]);
    // Third Row
    data.push([
      index++,
      "Gross Margin",
      formatMoney(
        withoutHedging &&
          withoutHedging.grossMargin &&
          withoutHedging.grossMargin.strengtheningAmount
      ),
      formatMoney(
        withoutHedging &&
          withoutHedging.grossMargin &&
          withoutHedging.grossMargin.actualAmount
      ),
      formatMoney(
        withoutHedging &&
          withoutHedging.grossMargin &&
          withoutHedging.grossMargin.weakeningAmount
      )
    ]);
    // Fourth Row
    data.push([
      index++,
      "Gross Margin %",
      (withoutHedging &&
        withoutHedging.grossMarginPercentage &&
        withoutHedging.grossMarginPercentage.strengtheningAmount) + "%",
      (withoutHedging &&
        withoutHedging.grossMarginPercentage &&
        withoutHedging.grossMarginPercentage.actualAmount) + "%",
      (withoutHedging &&
        withoutHedging.grossMarginPercentage &&
        withoutHedging.grossMarginPercentage.weakeningAmount) + "%"
    ]);
    return data;
  };

  getHedgingTableData = withHedging => {
    let data = [];
    let index = 0;
    // First Row
    data.push([
      index++,
      "Sales in Home Currency",
      formatMoney(
        withHedging &&
          withHedging.sales &&
          withHedging.sales.strengtheningAmount
      ),
      formatMoney(
        withHedging && withHedging.sales && withHedging.sales.actualAmount
      ),
      formatMoney(
        withHedging && withHedging.sales && withHedging.sales.weakeningAmount
      )
    ]);
    // Second Row
    data.push([
      index++,
      "Cost of Sales in Home Currency",
      formatMoney(
        withHedging &&
          withHedging.costOfSales &&
          withHedging.costOfSales.strengtheningAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.costOfSales &&
          withHedging.costOfSales.actualAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.costOfSales &&
          withHedging.costOfSales.weakeningAmount
      )
    ]);
    // Third Row
    data.push([
      index++,
      "Gross Margin",
      formatMoney(
        withHedging &&
          withHedging.grossMargin &&
          withHedging.grossMargin.strengtheningAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.grossMargin &&
          withHedging.grossMargin.actualAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.grossMargin &&
          withHedging.grossMargin.weakeningAmount
      )
    ]);
    // Fourth Row
    data.push([
      index++,
      "Hedging Costs",
      formatMoney(
        withHedging &&
          withHedging.hedgingCost &&
          withHedging.hedgingCost.strengtheningAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.hedgingCost &&
          withHedging.hedgingCost.actualAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.hedgingCost &&
          withHedging.hedgingCost.weakeningAmount
      )
    ]);
    // Fifth Row
    data.push([
      index++,
      "Gross Margin Net of Hedging Costs",
      formatMoney(
        withHedging &&
          withHedging.grossMarginNetHedgeCost &&
          withHedging.grossMarginNetHedgeCost.strengtheningAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.grossMarginNetHedgeCost &&
          withHedging.grossMarginNetHedgeCost.actualAmount
      ),
      formatMoney(
        withHedging &&
          withHedging.grossMarginNetHedgeCost &&
          withHedging.grossMarginNetHedgeCost.weakeningAmount
      )
    ]);
    // Sixth Row
    data.push([
      index++,
      "Gross Margin %",
      (withHedging &&
        withHedging.grossMarginPercentage &&
        withHedging.grossMarginPercentage.strengtheningAmount) + "%",
      (withHedging &&
        withHedging.grossMarginPercentage &&
        withHedging.grossMarginPercentage.actualAmount) + "%",
      (withHedging &&
        withHedging.grossMarginPercentage &&
        withHedging.grossMarginPercentage.weakeningAmount) + "%"
    ]);
    return data;
  };

  getWithoutHedgingChartData = () => {
    const { chartsData } = this.props;
    return {
      labels: [
        "Home Currency Strengthening",
        "No Movement",
        "Home Currency Weakening"
      ],
      datasets: [
        {
          yAxisID: "B",
          label: "Gross Margin %",
          type: "line",
          borderColor: "rgba(253,191,45)",
          data: chartsData.grossMarginPercentageData,
          fill: false
        },
        {
          yAxisID: "A",
          label: "Sales in Home Currency",
          type: "bar",
          backgroundColor: "rgba(70,116,193,0.9)",
          data: chartsData.salesInHomeCurrencyData
        },
        {
          yAxisID: "A",
          label: "Cost of Sales in Home Currency",
          type: "bar",
          backgroundColor: "rgba(235,135,60,0.9)",
          backgroundColorHover: "#3e95cd",
          data: chartsData.costOfSalesInHomeCurrencyData
        },
        {
          yAxisID: "A",
          label: "Gross Margin",
          type: "bar",
          backgroundColor: "rgba(165,165,165,0.9)",
          backgroundColorHover: "#3e95cd",
          data: chartsData.grossMarginData
        }
      ]
    };
  };
  getWithHedgingChartData = () => {
    const { chartsData } = this.props;
    return {
      labels: [
        "No Hedging & Home Currency Strengthening",
        "Hedging & Home Currency Strengthening",
        "No Hedging & Home Currency Weakening",
        "Hedging & Home Currency Weakening"
      ],
      datasets: [
        {
          yAxisID: "B",
          label: "Gross Margin %",
          type: "line",
          borderColor: "rgba(253,191,45)",
          data: chartsData.grossMarginPercentageHedgingData,
          fill: false
        },
        {
          yAxisID: "A",
          label: "Gross Margin",
          type: "bar",
          backgroundColor: "rgba(70,116,193,0.9)",
          data: chartsData.grossMarginHedgingData
        }
      ]
    };
  };
  render() {
    const {
      classes,
      printData,
      chartsData,
      impactGrossMargin,
      hedgingCostPercentage
    } = this.props;
    return (
      <>
        <div>
          <div style={{ margin: 40 }}>
            <h3>
              <b>FX Exposure Analysis Summary</b>
            </h3>
            <div style={{ marginTop: 60 }}>
              <h4>
                <b>P & L</b>
              </h4>
              <div>
                <span>
                  <h5>
                    Total Sales: {formatMoney(printData.totalSale)}{" "}
                    {printData.currencyCode}
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    Total Costs: {formatMoney(printData.costOfSale)}{" "}
                    {printData.currencyCode}
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    Gross Margin: {formatMoney(printData.grossMargin)}{" "}
                    {printData.currencyCode}{" "}
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    % of Sales Income in Foreign Currency Denominated in Home
                    Currency: {printData.foreignCurrencySalePercentage} {"%"}
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    % of Cost of Sales in Foreign Currency Denominated in Home
                    Currency: {printData.foreignCurrencyCostOfSalePercentage}{" "}
                    {"%"}
                  </h5>
                </span>
              </div>
            </div>
            <div style={{ marginTop: 60 }}>
              <div>
                <span>
                  <h4>
                    <b>Analysis done on </b>
                  </h4>
                </span>
              </div>
              <div>
                <span>
                  <h5>FX Change percentage at {impactGrossMargin}%</h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    Hedging % ={" "}
                    {printData &&
                      printData.withHedging &&
                      printData.withHedging.hedgingPercentage}
                    %
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>Hedging Cost% = {hedgingCostPercentage}%</h5>
                </span>
              </div>
            </div>
            <div style={{ marginTop: 60, pageBreakBefore: "always" }}>
              <h4>
                <b>
                  Details of Sales Income in Foreign Currency Denominated in
                  Home Currency
                </b>
              </h4>
              <div>
                <Table
                  striped
                  tableHeaderColor="info"
                  tableHead={this.state.FCSalesColumns}
                  tableData={this.getFCData(
                    printData.foreignCurrencySales,
                    printData.foreignCurrencySale,
                    "% of Sales Income in FC",
                    printData.foreignCurrencySalePercentage
                  )}
                  customHeadCellClasses={[
                    classes.tableHead25Bold,
                    classes.tableHead25Bold,
                    classes.tableHead25Bold,
                    classes.tableHead25Bold
                  ]}
                  customHeadClassesForCells={[0, 1, 2, 3]}
                />
              </div>
              <div>
                <FormLabel className={cx(classes.footer)}>
                  * FC = Foreign Currency
                </FormLabel>
              </div>
            </div>
            <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                  Details of Cost of Sales in Foreign Currency Denominated in
                  Home Currency
                </b>
              </h4>
              <div>
                <Table
                  striped
                  tableHeaderColor="info"
                  tableHead={this.state.FCCostsColumns}
                  tableData={this.getFCData(
                    printData.foreignCurrencyCosts,
                    printData.foreignCurrencyCostOfSale,
                    "% of Cost of Sales in FC",
                    printData.foreignCurrencyCostOfSalePercentage
                  )}
                  customHeadCellClasses={[
                    classes.tableHead25Bold,
                    classes.tableHead25Bold,
                    classes.tableHead25Bold,
                    classes.tableHead25Bold
                  ]}
                  customHeadClassesForCells={[0, 1, 2, 3]}
                />
              </div>
              <div>
                <FormLabel className={cx(classes.footer)}>
                  * FC = Foreign Currency
                </FormLabel>
              </div>
            </div>
            <div style={{ marginTop: 60 }}>
              <div>
                <span>
                  <h4>
                    <b>Hedging Cost Calculation %</b>
                  </h4>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    Total FC Sales Income denominated in Base Currency:{" "}
                    {formatMoney(printData.foreignCurrencySale)}{" "}
                    {printData.currencyCode}
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    Total FX Costs denominated in Base Currency:{" "}
                    {formatMoney(printData.foreignCurrencyCostOfSale)}{" "}
                    {printData.currencyCode}
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    Hedge Notional in Base Currency:{" "}
                    {formatMoney(
                      printData.withHedging &&
                        printData.withHedging.hedgingNotationInBaseCurrency
                    )}{" "}
                    {printData.currencyCode}
                  </h5>
                </span>
              </div>
              <div>
                <span>
                  <h5>
                    Hedge Costs in Base Currency:{" "}
                    {formatMoney(
                      (hedgingCostPercentage *
                        (printData &&
                          printData.withHedging &&
                          printData.withHedging
                            .hedgingNotationInBaseCurrency)) /
                        100
                    )}{" "}
                    {printData.currencyCode}{" "}
                  </h5>
                </span>
              </div>
            </div>

            <div style={{ marginTop: 60, pageBreakBefore: "always" }}>
              <h4>
                <b>No Hedging</b>
              </h4>
              <div>
                <Table
                  striped
                  tableHeaderColor="info"
                  tableHead={this.state.HedgingColumns}
                  tableData={this.getNoHedgingTableData(
                    printData.withoutHedging
                  )}
                  customHeadCellClasses={[
                    classes.tableHeadBold,
                    classes.tableHead20Bold,
                    classes.tableHead20Bold,
                    classes.tableHead20Bold
                  ]}
                  customHeadClassesForCells={[0, 1, 2, 3]}
                />
              </div>
            </div>
            <div style={{ marginTop: 100 }}>
              <GridItem xs={12} sm={12} md={12}>
                <Card chart className={cx(classes.exposureCard)}>
                  <CardHeader color="success">
                    <h5>
                      <b>
                        Impact of the FX Movement on the Bottomline - No Hedging
                      </b>
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <Bar
                      key={chartsData.withoutHedgingKey}
                      data={this.getWithoutHedgingChartData()}
                      options={{
                        responsive: true,
                        tooltips: {
                          callbacks: {
                            label: (tooltipItems, data) => {
                              // console.log(tooltipItems);
                              // console.log(data);
                              let value =
                                tooltipItems.datasetIndex === 0
                                  ? chartsData.grossMarginPercentageData[
                                      tooltipItems.index
                                    ] + "%"
                                  : tooltipItems.yLabel;
                              return (
                                data.datasets[tooltipItems.datasetIndex].label +
                                ": " +
                                value
                              );
                            }
                          }
                        },
                        scales: {
                          yAxes: [
                            {
                              id: "A",
                              position: "left",
                              ticks: {
                                callback: function(label) {
                                  return formatMoney(label, 0);
                                }
                              }
                            },
                            {
                              id: "B",
                              type: "linear",
                              position: "right",
                              ticks: {
                                max: chartsData.yAxisMaxWithoutHedging,
                                min: chartsData.yAxisMinWithoutHedging,
                                callback: function(label) {
                                  return label + "%";
                                }
                              }
                            }
                          ]
                        }
                      }}
                      width={600}
                      height={300}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </div>
            <div style={{ marginTop: 20, pageBreakBefore: "always" }}>
              <h4>
                <b>Impact of Hedging</b>
              </h4>
              <div>
                <span>Hedging %</span>
                <span>
                  {printData &&
                    printData.withHedging &&
                    printData.withHedging.hedgingPercentage}
                </span>
              </div>
              <div>
                <Table
                  striped
                  tableHeaderColor="info"
                  tableHead={this.state.HedgingColumns}
                  tableData={this.getHedgingTableData(printData.withHedging)}
                  customHeadCellClasses={[
                    classes.tableHeadBold,
                    classes.tableHead20Bold,
                    classes.tableHead20Bold,
                    classes.tableHead20Bold
                  ]}
                  customHeadClassesForCells={[0, 1, 2, 3]}
                />
              </div>
            </div>
            <div style={{ marginTop: 30 }}>
              <GridItem xs={12} sm={12} md={12}>
                <Card chart className={cx(classes.exposureCard)}>
                  <CardHeader color="success">
                    <h5>
                      <b>
                        Impact of the FX Movement Compared - With Hedging & No
                        Hedging
                      </b>
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <Bar
                      key={chartsData.withHedgingKey}
                      data={this.getWithHedgingChartData()}
                      options={{
                        responsive: true,
                        tooltips: {
                          callbacks: {
                            label: (tooltipItems, data) => {
                              // console.log(tooltipItems);
                              // console.log(data);
                              let value =
                                tooltipItems.datasetIndex === 0
                                  ? chartsData.grossMarginPercentageHedgingData[
                                      tooltipItems.index
                                    ] + "%"
                                  : tooltipItems.yLabel;
                              return (
                                data.datasets[tooltipItems.datasetIndex].label +
                                ": " +
                                value
                              );
                            }
                          }
                        },
                        scales: {
                          yAxes: [
                            {
                              id: "A",
                              position: "left",
                              ticks: {
                                callback: function(label) {
                                  return formatMoney(label, 0);
                                }
                              }
                            },
                            {
                              id: "B",
                              type: "linear",
                              position: "right",
                              ticks: {
                                max: chartsData.yAxisMaxWithHedging,
                                min: chartsData.yAxisMinWithHedging,
                                callback: function(label) {
                                  return label + "%";
                                }
                              }
                            }
                          ]
                        }
                      }}
                      width={600}
                      height={300}
                    />
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={6}
                style={{
                  width: "48%",
                  display: "inline-block",
                  textAlign: "left",
                  borderRight: "1px solid #cdcdcd"
                }}
              >
                <ul className={cx(classes.graphFooter)}>
                  <li>
                    Hedge%{" "}
                    {printData &&
                      printData.withHedging &&
                      printData.withHedging.hedgingPercentage}
                    %
                  </li>
                  <li>
                    {" "}
                    Sales Currency Strengthening or Weakening{" "}
                    {impactGrossMargin}%{" "}
                  </li>
                  <li>Hedging costs {hedgingCostPercentage}%</li>
                  <li>
                    Economic and Translation FX Risks are not covered in this
                    calculator
                  </li>
                </ul>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={6}
                style={{
                  width: "48%",
                  display: "inline-block",
                  textAlign: "left"
                }}
              >
                <ul className={cx(classes.graphFooter)}>
                  <li>
                    Timing of Foreign currency inflows and outflows not
                    considered{" "}
                  </li>
                  <li>
                    Correlation between currencies not taken into account{" "}
                  </li>
                  <li>Information for indicative purposes only </li>
                </ul>
              </GridItem>
            </div>

            <div style={{ marginTop: 60, pageBreakBefore: "always" }}>
              <h4>
                <b>Gross Margin (%) when the Currency pairs move by</b>
              </h4>
              <div>
                <Table
                  striped
                  tableHeaderColor="info"
                  tableData={chartsData.grossMarginTableData}
                  tableHead={chartsData.grossMarginCurrencyColumns}
                  tableSubHead={["Hedging %", "Home Currency moves by*"]}
                  tableSubHeadCols={["1", "7"]}
                  tableSubHeadClasses={[
                    classes.tableHedgeHead,
                    classes.tableMarginHead + " " + classes.tableHeadBold
                  ]}
                  customHeadCellClasses={[
                    classes.tableHedgeHead,
                    classes.tableMarginHead,
                    classes.tableMarginHead,
                    classes.tableMarginHead,
                    classes.tableMarginHead,
                    classes.tableMarginHead,
                    classes.tableMarginHead,
                    classes.tableMarginHead
                  ]}
                  customHeadClassesForCells={[0, 1, 2, 3, 4, 5, 6, 7]}
                  customCellClasses={[classes.tableHedgeHead]}
                  customClassesForCells={[1]}
                />
                <div
                  className={cx(classes.graphFooter)}
                  style={{ marginTop: 20 }}
                >
                  * -ve sign means Home Currency weakens. +ve sign means Home
                  Currency strengthens.
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

FXExposureCalculatorPrint.propTypes = {
  classes: PropTypes.object.isRequired,
  printData: PropTypes.object.isRequired,
  chartsData: PropTypes.object.isRequired,
  impactGrossMargin: PropTypes.object.isRequired,
  hedgingCostPercentage: PropTypes.object.isRequired
};

export default withStyles(styles)(FXExposureCalculatorPrint);
