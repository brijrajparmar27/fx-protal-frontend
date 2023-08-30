import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Input from '@material-ui/core/Input';
import Edit from '@material-ui/icons/Edit';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlined from '@material-ui/icons/InfoOutlined';

// core components
import CustomNumberFormat from 'components/CustomNumberFormat/CustomNumberFormat.jsx';
import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import Table from 'components/Table/Table.jsx';
import { formatMoney } from '../../../../utils/Utils';
import { grayColor, whiteColor, hexToRgb, blackColor } from 'assets/jss/material-dashboard-pro-react.jsx';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';

import cx from 'classnames';

const RISK_CATEGORY_INFO = [
  { name: 'Payables', key: 'payables', type: 'PAYABLES' },
  { name: 'Receivables', key: 'receivables', type: 'RECEIVABLES' },
  {
    name: 'Forecasted Revenues',
    key: 'forecastedRevenues',
    type: 'FORECASTED_REVENUES',
  },
  {
    name: 'Forecasted Costs',
    key: 'forecastedCosts',
    type: 'FORECASTED_COSTS',
  },
  { name: 'Asset or Investments', key: 'assets', type: 'ASSETS' },
  { name: 'Liabilities', key: 'liabilities', type: 'LIABILITIES' },
  // { name: "External Hedges", key: "externalHedges" }
];

const style = {
  container: {
    backgroundColor: '#ffffff',
    padding: '50px 30px 60px 50px',
  },
  mincontainer: {
    backgroundColor: '#ffffff',
    padding: '10px 0px',
  },
  tableHeadBold: {
    fontWeight: 'bold',
  },
  tableHedgeHead: {
    //backgroundColor: "#5882c780",
    fontWeight: 'bold',
  },
  tableBorder: {
    border: '1px solid #ACACAC',
    marginBottom: 10,
  },
  center: {
    textAlign: 'center ',
  },
  groupHeader: {
    textAlign: 'left',
    fontSize: 30,
    marginTop: 0,
  },
  featureTitleHeader: {
    //height: 35,
    color: '#3c4858',
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: 'bold',
    // textAlign: "center"
    //marginTop: 0
  },
  icon: {
    //marginTop: "-3px",
    cursor: 'pointer',
    top: '0px',
    position: 'relative',
    marginRight: '3px',
    width: '20px',
    height: '20px',
    verticalAlign: 'middle',
    display: 'inline-block',
    color: 'black',
  },
  editIcon: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: 3,
  },
  currencyPairTag: {
    cursor: 'pointer',
  },
  elemGreen: {
    color: '#53ac57',
  },
  elemRed: {
    color: 'red',
  },
  elemBlack: {
    color: '#000000de',
  },
  closeButton: {
    visibility: 'hidden',
  },
  currencyPair: {
    '&:hover': {
      '& button': {
        visibility: 'visible',
      },
    },
  },
  info: {
    display: "inline-block",
    fontSize: 15,
  },
  tooltipCalculator: {
    padding: '10px 15px',
    minWidth: '200px',
    color: whiteColor,
    lineHeight: '1.7em',
    background: 'rgb(' + hexToRgb(grayColor[6]) + ')',
    border: 'none',
    borderRadius: '3px',
    opacity: '1!important',
    boxShadow:
      '0 8px 10px 1px rgba(' + hexToRgb(blackColor) + ', 0.14), 0 3px 14px 2px rgba(' + hexToRgb(blackColor) + ', 0.12), 0 5px 5px -3px rgba(' + hexToRgb(blackColor) + ', 0.2)',
    maxWidth: '400px',
    textAlign: 'top',
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '400',
    textShadow: 'none',
    textTransform: 'none',
    letterSpacing: 'normal',
    wordBreak: 'normal',
    wordSpacing: 'normal',
    wordWrap: 'normal',
    whiteSpace: 'normal',
    lineBreak: 'auto',
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
};

const CATEGORIES = [
  { name: 'Payables', key: 'payables' },
  { name: 'Receivables', key: 'receivables' },
  { name: 'Forecasted Revenues', key: 'forecastedRevenues' },
  { name: 'Forecasted Costs', key: 'forecastedCosts' },
  { name: 'Asset or Investments', key: 'existingAssets' },
  { name: 'Liabilities', key: 'existingLiabilities' },
];

class HedgeAnalysisReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: {},
      paymentData: [],
      receiptData: [],
      paymentColumns: [
        'Payment currnecy',
        'Unhedged amounts in respective currency',
        'Mid hedging costs or benefit',
        // "Credit and other costs",
        <Tooltip
          title="Please enter negative % for costs, and positive % for benefit if any"
          placement="top"
          classes={{
            tooltip: props.classes.tooltipCalculator,
          }}
        >
          <span>
            Credit and other costs {" "}
            <InfoOutlined className={props.classes.info} />
          </span>
        </Tooltip>,
        'Total',
      ],
      receiptColumns: [
        'Receipt currnecy',
        'Unhedged amounts in respective currency',
        'Mid hedging costs or benefit',
        // "Credit and other costs",
        <Tooltip
          title="Please enter negative % for costs, and positive % for benefit if any"
          placement="top"
          classes={{
            tooltip: props.classes.tooltipCalculator,
          }}
        >
            <span>Credit and other costs {" "}
            <InfoOutlined className={props.classes.info} /></span>
        </Tooltip>,
        'Total',
      ],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.props.setLoading(true);
    const result = await apiHandler({
      url: endpoint.RISK_RADAR_MID_HEDGING_REPORT + '?functionalcurrency=' + this.props.functionalCurrency,
      authToken: sessionStorage.getItem('token'),
    });

    if (!result.data.errorCode) {
      this.parseData(result.data);
    } else {
      this.props.setLoading(false);
    }
  };
  parseData = (apiData) => {
    const { paymentCurrencies, receiptCurrencies } = apiData;

    let paymentTableData = [];
    paymentCurrencies.forEach((row, index) => {
      paymentTableData.push([
        index,
        row.currencyCode,
        formatMoney(row.unhedgeAmount),
        row.midgeHedgePercentage + '%',
        this.getCreditInput('PAYMENT', index, row.unhedgeAmount, row.midgeHedgePercentage, row.exchangeRate),
        row.midgeHedgePercentage + '%',
        formatMoney((row.unhedgeAmount * row.midgeHedgePercentage) / (row.exchangeRate * 100)),
      ]);
    });

    let receiptTableData = [];
    receiptCurrencies.forEach((row, index) => {
      receiptTableData.push([
        index,
        row.currencyCode,
        formatMoney(row.unhedgeAmount),
        row.midgeHedgePercentage + '%',
        this.getCreditInput('RECEIPT', index, row.unhedgeAmount, row.midgeHedgePercentage, row.exchangeRate),
        row.midgeHedgePercentage + '%',
        formatMoney((row.unhedgeAmount * row.midgeHedgePercentage) / (row.exchangeRate * 100)),
      ]);
    });

    this.setState({
      paymentData: paymentTableData,
      receiptData: receiptTableData,
    });
    this.props.setLoading(true);
  };
  getCreditInput = (type, index, amount, percentage, exchangeRate) => {
    return (
      <CustomNumberFormat
        id={index}
        suffix="%"
        formControlProps={{
          style: { paddingTop: 0 },
          fullWidth: false,
          onBlur: (event) => this.onBlurInput(event, type, index, amount, percentage, exchangeRate),
        }}
      />
    );
  };
  onBlurInput = (event, type, index, amount, percentage, exchangeRate) => {
    let value = event.target.value;
    value = value.substring(0, value.length - 1);

    const total = Number(value) + Number(percentage);
    const indicativePrice = (amount * total) / (exchangeRate * 100);

    let tableData = type === 'PAYMENT' ? this.state.paymentData : this.state.receiptData;
    tableData[index][5] = total.toFixed(2) + '%';
    tableData[index][6] = formatMoney(indicativePrice);
    if (type === 'PAYMENT') {
      this.setState({
        paymentData: tableData,
      });
    } else if (type === 'RECEIPT') {
      this.setState({
        receiptData: tableData,
      });
    }
  };
  getPaymentColumns = () => {
    let colNames = [...this.state.paymentColumns];
    console.log('COLS - ', colNames);
    colNames.push("Indicative Hedging costs or benefits in " + this.props.functionalCurrency);
    return colNames;
  };
  getReceiptColumns = () => {
    let colNames = [... this.state.receiptColumns];
    colNames.push("Indicative Hedging costs or benefits in " + this.props.functionalCurrency);
    return colNames;
  };
  render() {
    const { classes, display } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridContainer justify="center">
              <GridItem xs={11} sm={11} md={11} lg={11}>
                <h5>My currencies and Indicative mid hedging costs (for 12 month hedging)</h5>
              </GridItem>
              {this.state.paymentData.length > 0 && (
                <GridItem xs={11} sm={11} md={11} lg={11} className={classes.tableBorder}>
                  <Table
                    striped
                    tableHeaderColor="info"
                    tableHead={this.getPaymentColumns()}
                    tableData={this.state.paymentData}
                    customHeadCellClasses={[]}
                    customHeadClassesForCells={[]}
                    customCellClasses={[]}
                    customClassesForCells={[]}
                    isMarketData={false}
                  />
                </GridItem>
              )}
              {this.state.receiptData.length > 0 && (
                <GridItem xs={11} sm={11} md={11} lg={11} className={classes.tableBorder}>
                  <Table
                    striped
                    tableHeaderColor="info"
                    tableHead={this.getReceiptColumns()}
                    tableData={this.state.receiptData}
                    customHeadCellClasses={[]}
                    customHeadClassesForCells={[]}
                    customCellClasses={[]}
                    customClassesForCells={[]}
                    isMarketData={false}
                  />
                </GridItem>
              )}
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
HedgeAnalysisReport.propTypes = {
  classes: PropTypes.object.isRequired,
  setLoading: PropTypes.func.isRequired,
  parsedRiskRadarData: PropTypes.object,
  riskRadarData: PropTypes.object,
  functionalCurrency: PropTypes.object,
  senstivityPercentage: PropTypes.object,
};
export default withStyles(style)(HedgeAnalysisReport);
