import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";


import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";

import cx from "classnames";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import { formatDate, formatMoney, parseCurrency } from "../../../utils/Utils";



function Transition(props) {
  return <Slide direction="down" {...props} />;
}
const style = theme => ({
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
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
    margin: "5px 25px"
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
  iconButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: "#53ac57",
    float: "right"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
});



class RiskInputPrint extends React.Component {
  error = {
    // profitOtherNameErrorMsg: {
    //   required: "Specify Name of Profit"
    // },
  };

  constructor(props) {
    super(props);
    this.state = {
        existingHedgeLiabilityColumn: [
            "ID",
            "Deal Date",
            "Currency Bought",
            "Currency Bought Amount",
            "Currency Sold",
            "Currency Sold Amount",
            "Settlement Date"
          ],
          assetLiabilityColumn: ["ID", "Amount", "Description"],
          payableColumn: ["ID", "Amount", "Date Payable", "Description"],
          receivableColumn: ["ID", "Amount", "Date Receivable", "Description"],
          forecastedRevenuesColumn: [
            "ID",
            "Amount",
            "Date Expected",
            "Description"
          ],
          forecastedCostsColumn: [
            "ID",
            "Amount",
            "Date Forecasted",
            "Description"
          ],
          externalHedgesDisplay: [],
          internalHedgesDisplay: [],
          existingAssetsDisplay: [],
          existingLiabilitiesDisplay: [],
          payablesDisplay: [],
          receivablesDisplay: [],
          forecastedRevenuesDisplay: [],
          forecastedCostsDisplay: [],
    };
  }
  componentDidMount() {
    let obj=this.getHedgesDisplayData(this.props.parsedRiskRadarData)
    this.setState({
    externalHedgesDisplay:obj.externalHedges,
    internalHedgesDisplay:obj.internalHedges,

    existingAssetsDisplay:this.getTableData(this.props.existingAssetsDisplay,'existingAssetsDisplay'),
    existingLiabilitiesDisplay:this.getTableData(this.props.existingLiabilitiesDisplay,'existingLiabilitiesDisplay'),
    payablesDisplay:this.getTableData(this.props.payablesDisplay,'payablesDisplay'),
    receivablesDisplay:this.getTableData(this.props.receivablesDisplay,'receivablesDisplay'),
    forecastedRevenuesDisplay:this.getTableData(this.props.forecastedRevenuesDisplay,'forecastedRevenuesDisplay'),
    forecastedCostsDisplay:this.getTableData(this.props.forecastedCostsDisplay,'forecastedCostsDisplay')
  })
}
  componentWillReceiveProps(newProps) {
    if (this.props.isChanged !== newProps.isChanged) {
      let obj=this.getHedgesDisplayData(newProps.parsedRiskRadarData)

        this.setState({
          externalHedgesDisplay:obj.externalHedges,
          internalHedgesDisplay:obj.internalHedges,
            existingAssetsDisplay:this.getTableData(newProps.existingAssetsDisplay,'existingAssetsDisplay'),
            existingLiabilitiesDisplay:this.getTableData(newProps.existingLiabilitiesDisplay,'existingLiabilitiesDisplay'),
            payablesDisplay:this.getTableData(newProps.payablesDisplay,'payablesDisplay'),
            receivablesDisplay:this.getTableData(newProps.receivablesDisplay,'receivablesDisplay'),
            forecastedRevenuesDisplay:this.getTableData(newProps.forecastedRevenuesDisplay,'forecastedRevenuesDisplay'),
            forecastedCostsDisplay:this.getTableData(newProps.forecastedCostsDisplay,'forecastedCostsDisplay')
          })
    }
  }
  getHedgesDisplayData=(parsedRiskRadarData)=>{
    let impactData= parsedRiskRadarData&&parsedRiskRadarData.hedges&&parsedRiskRadarData.hedges.length>0?parsedRiskRadarData.hedges:[]

    let externalHedgesDisplay=[],internalHedgesDisplay=[]
    let externalHedges=impactData.filter(x=>x.hedgeType.toLowerCase()==='external')
    let internalHedges=impactData.filter(x=>x.hedgeType.toLowerCase()==='internal')
    console.log('getHedgesDisplayData',externalHedges)
    console.log('getHedgesDisplayData',internalHedges)
    externalHedges.forEach((row, index) => {

      externalHedgesDisplay.push([
      index,
      row.dealId,
      formatDate(row.dealDate),
      row.boughtCurrencyCode,
      formatMoney(row.currencyBought),
      row.soldCurrencyCode,
      formatMoney(row.currencySold),
      formatDate(row.settlementDate)
    ]);
  })
  internalHedges.forEach((row, index) => {

      internalHedgesDisplay.push([
      index,
      row.dealId,
      formatDate(row.dealDate),
      row.boughtCurrencyCode,
      formatMoney(row.currencyBought),
      row.soldCurrencyCode,
      formatMoney(row.currencySold),
      formatDate(row.settlementDate)
    ]);
  })
    return{
      externalHedges:externalHedgesDisplay,
      internalHedges:internalHedgesDisplay
    }
  
  }
  getTableData=(arr, item)=>{
    let newArr=[]
    arr&&arr.length>0 && arr.forEach((x,index)=>{
        
            newArr.push(x.filter((y,index)=>x.length-1!=index))
        
    })
    return newArr
  }
  render() {
    const { classes, impactData } = this.props;

    return (
      <div className={classes.container}>
            <GridContainer justify="center">
            <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    className={
                      (classes.groupHeader, classes.featureTitleHeader)
                    }
                  >
                    Risk Input
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >

                  <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                  Payables
                </b>
              </h4>
              <div>
                          <Table
                                         striped
                                         tableHeaderColor="info"
                                        tableHead={this.state.payableColumn}
                                        tableData={this.state.payablesDisplay}
                                        customCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customClassesForCells={[0, 4, 5]}
                                        customHeadCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customHeadClassesForCells={[0, 4, 5]}
                                      />
                      </div></div>
                      </GridItem>
                      <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                      <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                Receivables
                </b>
              </h4>
              <div>
                          <Table
                                         striped
                                         tableHeaderColor="info"
                                        tableHead={this.state.receivableColumn}
                                        tableData={
                                          this.state.receivablesDisplay
                                        }
                                        customCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customClassesForCells={[0, 4, 5]}
                                        customHeadCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customHeadClassesForCells={[0, 4, 5]}
                                      />
                      </div></div>
                      </GridItem>
                      <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                      <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                Forecasted Revenues
                </b>
              </h4>
              <div>
                      <Table
                                         striped
                                         tableHeaderColor="info"
                                        tableHead={
                                          this.state.forecastedRevenuesColumn
                                        }
                                        tableData={
                                          this.state.forecastedRevenuesDisplay
                                        }
                                        customCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customClassesForCells={[0, 4, 5]}
                                        customHeadCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customHeadClassesForCells={[0, 4, 5]}
                                      />
                      </div></div>
                      </GridItem>
                      <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                      <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                  Forecasted Costs
                </b>
              </h4>
              <div>
                      <Table
                                         striped
                                         tableHeaderColor="info"
                                        tableHead={
                                          this.state.forecastedCostsColumn
                                        }
                                        tableData={
                                          this.state.forecastedCostsDisplay
                                        }
                                        customCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customClassesForCells={[0, 4, 5]}
                                        customHeadCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customHeadClassesForCells={[0, 4, 5]}
                                      />
                      </div></div>
                      </GridItem>
                      <GridItem
                   xs={12}
                   sm={12}
                   md={12}
                   lg={12}
                  >
                      <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                Asset or Investments
                </b>
              </h4>
              <div>
                      <Table
                   striped
                   tableHeaderColor="info"
                  tableHead={
                    this.state.assetLiabilityColumn
                  }
                  tableData={
                    this.state.existingAssetsDisplay
                  }
                  customCellClasses={[
                    classes.center,
                    classes.right,
                    classes.right
                  ]}
                  customClassesForCells={[0, 4, 5]}
                  customHeadCellClasses={[
                    classes.center,
                    classes.right,
                    classes.right
                  ]}
                  customHeadClassesForCells={[0, 4, 5]}
                />
                      </div></div>
                      </GridItem>
                      <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                      <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                  Liabilities
                </b>
              </h4>
              <div>
                      <Table
                                         striped
                                         tableHeaderColor="info"
                                        tableHead={
                                          this.state.assetLiabilityColumn
                                        }
                                        tableData={
                                          this.state.existingLiabilitiesDisplay
                                        }
                                        customCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customClassesForCells={[0, 4, 5]}
                                        customHeadCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customHeadClassesForCells={[0, 4, 5]}
                                      />
                      </div></div>
                      </GridItem>
                      <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                      <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                  External Hedges
                </b>
              </h4>
              <div>
                      <Table
                                         striped
                                         tableHeaderColor="info"
                                        tableHead={
                                          this.state
                                            .existingHedgeLiabilityColumn
                                        }
                                        tableData={
                                          this.state.externalHedgesDisplay
                                        }
                                        customCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customClassesForCells={[0, 4, 5]}
                                        customHeadCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customHeadClassesForCells={[0, 4, 5]}
                                      />
                      </div></div>
                    
                      <div style={{ marginTop: 60 }}>
              <h4>
                <b>
                  Internal Hedges
                </b>
              </h4>
              <div>
                      <Table
                                         striped
                                         tableHeaderColor="info"
                                        tableHead={
                                          this.state
                                            .existingHedgeLiabilityColumn
                                        }
                                        tableData={
                                          this.state.internalHedgesDisplay
                                        }
                                        customCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customClassesForCells={[0, 4, 5]}
                                        customHeadCellClasses={[
                                          classes.center,
                                          classes.right,
                                          classes.right
                                        ]}
                                        customHeadClassesForCells={[0, 4, 5]}
                                      />
                      </div></div>
                    
                      </GridItem>
            </GridContainer>    
        
      </div>
    );
  }
}
RiskInputPrint.propTypes = {
  classes: PropTypes.object.isRequired,
  impactData: PropTypes.object.isRequired,
  calculateGraph: PropTypes.func,
  isChanged: PropTypes.bool
};
export default withStyles(style)(RiskInputPrint);
