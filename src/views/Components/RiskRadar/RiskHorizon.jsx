import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import IconButton from '@material-ui/core/IconButton';
import BarChartIcon from '@material-ui/icons/EqualizerSharp';
import BubbleChartIcon from '@material-ui/icons/BubbleChartSharp';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Check from '@material-ui/icons/Check';
import { FormControl, Tooltip } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
// core components

import { cardTitle, roseColor, successColor, grayColor, whiteColor, hexToRgb, blackColor } from 'assets/jss/material-dashboard-pro-react.jsx';
import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import { formatMoney, formatDate } from '../../../utils/Utils';
import { validate } from '../../../utils/Validator';

import ConfirmationModal from 'views/Components/ConfirmationModal.jsx';
import CustomNumberFormat from 'components/CustomNumberFormat/CustomNumberFormat.jsx';
import Pagination from 'components/Pagination/Pagination.jsx';
import Table from 'components/Table/Table.jsx';

import BubbleChart from './RiskHorizon/BubbleChart';
import StackBarChart from './RiskHorizon/StackBarChart';
import WhatIfModal from './WhatIfModal.jsx';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
import cx from 'classnames';
import moment from 'moment';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { module } from 'assets/config';

const TABLECOLUMNKEYDATE = [
  //"currencyCode",
  'amount',
  'convertedValueBeforeHedge',
  'sensitivityAmount',
  'date',
  'exchangeRate',
  'externalHedge',
];
const TABLECOLUMNNAMEDATE = [
  //"Currency Code",
  'Amount',
  'Converted Amount',
  'Risk Impact if not hedged',
  'Date',
  'Exchange Rate',
  '',
];
const MULTISELECTTABLECOLUMNKEYDATE = [
  //"currencyCode",
  'checkbox',
  'amount',
  'convertedValueBeforeHedge',
  'sensitivityAmount',
  'date',
  'exchangeRate',
];
const MULTISELECTTABLECOLUMNNAMEDATE = [
  //"Currency Code",
  'Select',
  'Amount',
  'Converted Amount',
  'Risk Impact if not hedged',
  'Date',
  'Exchange Rate',
];
const CHARTOPTIONS = [
  {
    name: 'allRisk',
    value: 'All Risks & Hedges',
  },
  {
    name: 'linkedHedges',
    value: 'Linked and Unlinked Risks & Hedges',
  },
];
const BARCHARTOPTIONS = [
  {
    name: 'categoryWise',
    value: 'Type Of Exposure & Hedges',
  },
  {
    name: 'currencyWise',
    value: 'Currency Wise Exposure & Hedges',
  },
];
const HEDGETABLECOLUMNKEY = [
  //"currencyCode",
  'currencyBought',
  'currencySold',
  'dealDate',
  'settlementDate',
  'transactionType',
  'delinkHedge',
];
const HEDGETABLECOLUMNNAME = [
  //"Currency Code",
  'Bought Amount',
  'Sold Amount',
  'Deal Date',
  'Settlement Date',
  'Transaction Type',
  '',
];
let CATEGORIESNAME = {
  assets: 'Asset or Investments',
  liabilities: 'Liabilities',
  payables: 'Payables',
  receivables: 'Receivables',
  forecastedRevenues: 'Forecasted Revenues',
  forecastedCosts: 'Forecasted Costs',
};
const CATEGORIES = [
  { name: 'Payables', key: 'payables' },
  { name: 'Receivables', key: 'receivables' },
  { name: 'Forecasted Revenues', key: 'forecastedRevenues' },
  { name: 'Forecasted Costs', key: 'forecastedCosts' },
  { name: 'Asset or Investments', key: 'assets' },
  { name: 'Liabilities', key: 'liabilities' },
];
let RISKTYPES = {
  'Asset or Investments': 'EXISTING_ASSETS',
  Liabilities: 'EXISTING_LIABILITIES',
  Payables: 'PAYABLES',
  Receivables: 'RECEIVABLES',
  'Forecasted Revenues': 'FORECASTED_REVENUES',
  'Forecasted Costs': 'FORECASTED_COSTS',
};

const AccordionDetails = withStyles((theme) => ({
  root: {
    display: 'flow-root',
    padding: '8px 16px 16px',
  },
}))(MuiAccordionDetails);

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </div>
  );
}

const style = (theme) => ({
  container: {
    backgroundColor: '#ffffff',
    padding: '50px 0px 60px 10px',
  },
  closeButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: '#53ac57',
    float: 'right',
  },
  alignNone: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#53ac57',
  },
  zoomOutButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: '#53ac57',
    float: 'left',
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
  addDirectorsMaxWidth: {
    width: 600,
  },
  tooltipCalculator: {
    padding: '10px 15px',
    minWidth: '200px',
    color: whiteColor,
    lineHeight: '1.7em',
    background: 'rgba(' + hexToRgb(grayColor[6]) + ',0.9)',
    border: 'none',
    borderRadius: '3px',
    opacity: '1!important',
    boxShadow:
      '0 8px 10px 1px rgba(' + hexToRgb(blackColor) + ', 0.14), 0 3px 14px 2px rgba(' + hexToRgb(blackColor) + ', 0.12), 0 5px 5px -3px rgba(' + hexToRgb(blackColor) + ', 0.2)',
    maxWidth: '400px',
    textAlign: 'center',
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
  colWidth: {
    width: '30%',
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
});

class RiskHorizon extends React.Component {
  error = {
    hedgingPercentageErrorMsg: {
      required: 'Hedging Percentage value is required',
      range: 'Hedging percentage value should be between 0 to 100',
    },
    hedgeAmountErrorMsg: {
      required: 'Profit Amount is required',
      positive: 'Profit Amount should be positive number',
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
      callInProgress: false,
      displayBubbleGraph: true,
      hedgingPercentage: '',
      hedgingPercentageState: '',
      hedgingPercentagePristine: false,
      hedgingPercentageErrorMsg: [],
      hedgeAmount: '',
      hedgeAmountState: '',
      hedgeAmountPristine: false,
      hedgeAmountErrorMsg: [],
      modalRadioChecked: 'hedgingPercentage',
      key: 0,
      showModal: false,
      dialogTitle: '',
      modalData: {},
      bubbleChartData: {
        datasets: [],
      },
      showTable: false,
      //category table
      tableColumns: [],
      tableDisplayData: [],
      multiSelectedTableData: [],
      tableTitle: '',
      showHedgeTableTab: true,
      //hedge link table
      hedgeTableColumns: ['Currency Bought', 'Currency Sold', 'Settlement Date', ''],
      hedgeTableData: [],
      showWhatIfModal: false,
      riskAnalysis: null,

      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      riskRadarType: '',
      tabValue: 0,
      isChanged: false,
      remainingHedgePercent: 100,
      remainingHedgeAmount: 0,
      year: 0,
      currentYear: new Date().getFullYear(),
      nextMaxYear: new Date().getFullYear() + 2,
      minYear: 0,
      maxYear: 0,
      dayOfYear: '', //this.getDayofYear(),
      startDate: this.getDateAfterXYears(0),

      confirmationModal: false,
      confirmationModalHeader: '',
      confirmationModalMsg: '',
      monthsEscaped: 0,
      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: [],
      multiSelectedCategoryPayables: false,
      multiSelectedCategories: [],
      chartCurrentView: 'allRisk',
      dropDownOption: CHARTOPTIONS,
      selectedCategory: 'payables',
      probableDealsDisplayData: [],
      probableDealsColumns: [],
      riskRadarFullData: {},
    };

    this.todaysDate = new Date().setHours(0, 0, 0, 0);
    this.currentYear = new Date().getFullYear();
    this.riskHorizonChartRef = React.createRef();
  }
  componentDidMount() {
    if (this.props.parsedRiskRadarData && this.props.pastRiskRadarData) {
      const combineData = this.combineRiskRadarData(this.props.parsedRiskRadarData, this.props.pastRiskRadarData);
      let riskData = this.props.parsedRiskRadarData && this.props.parsedRiskRadarData.risks ? this.props.parsedRiskRadarData.risks : {};
      let hedgeData = this.props.parsedRiskRadarData && this.props.parsedRiskRadarData.hedges ? this.props.parsedRiskRadarData.hedges : [];
      let riskPastData = this.props.pastRiskRadarData && this.props.pastRiskRadarData.risks ? this.props.pastRiskRadarData.risks : [];
      let hedgePastData = this.props.pastRiskRadarData && this.props.pastRiskRadarData.hedges ? this.props.pastRiskRadarData.hedges : [];

      let minMaxYear = this.getMinMaxYear(riskData, riskPastData, [...hedgeData, ...hedgePastData]);
      // if (this.props.parsedRiskRadarData && this.props.parsedRiskRadarData.risks) {
      //   let pastMinMaxYear = this.getMinMaxYear(this.props.pastRiskRadarData);
      console.log('PAST DATA - ', minMaxYear);
      // }
      this.setState({
        ...minMaxYear,
      });
      this.handleClickSelectCategory(this.state.selectedCategory, combineData);
    }
    // if (
    //   this.props.parsedRiskRadarData &&
    //   this.props.parsedRiskRadarData.risks
    // ) {
    //   let minMaxYear = this.getMinMaxYear(this.props.parsedRiskRadarData, this.props.pastRiskRadarData);
    //   // if (this.props.parsedRiskRadarData && this.props.parsedRiskRadarData.risks) {
    //   //   let pastMinMaxYear = this.getMinMaxYear(this.props.pastRiskRadarData);
    //     console.log('PAST DATA - ', minMaxYear);
    //   // }
    //   this.setState({
    //     ...minMaxYear
    //   });
    //   this.handleClickSelectCategory(
    //     this.state.selectedCategory,
    //     this.props.parsedRiskRadarData
    //   );
    // }
  }
  combineRiskRadarData = (riskRadarData, pastData) => {
    let mappedHedgeIds = [], mappedRiskIds = [], currencyWiseData = { ...riskRadarData.currencyWiseData };
    // Risks
    let updatedRiskRadarData = { ...riskRadarData.risks };
    if (pastData && pastData.risks && pastData.risks.length > 0) {
      pastData.risks.forEach((risk) => {
        risk.date = risk.dueDate;
        // Check mapped Hedges
        const hedgeIds = risk.riskHedgeModels && risk.riskHedgeModels.map(hedge => hedge.hedgeId);
        mappedHedgeIds = [...mappedHedgeIds, ...hedgeIds];

        if (risk.riskType === 'PAYABLES') {
          updatedRiskRadarData.payables = [...updatedRiskRadarData.payables, risk];
        } else if (risk.riskType === 'RECEIVABLES') {
          updatedRiskRadarData.receivables = [...updatedRiskRadarData.receivables, risk];
        } else if (risk.riskType === 'FORECASTED_REVENUES') {
          updatedRiskRadarData.forecastedRevenues = [...updatedRiskRadarData.forecastedRevenues, risk];
        } else if (risk.riskType === 'FORECASTED_COSTS') {
          updatedRiskRadarData.forecastedCosts = [...updatedRiskRadarData.forecastedCosts, risk];
        } else if (risk.riskType === 'EXISTING_ASSETS') {
          updatedRiskRadarData.existingAssets = [...updatedRiskRadarData.existingAssets, risk];
        } else if (risk.riskType === 'EXISTING_LIABILITIES') {
          updatedRiskRadarData.existingLiabilities = [...updatedRiskRadarData.existingLiabilities, risk];
        }

        // Currency wise Data
        if (currencyWiseData[risk.currencyCode]) {
          currencyWiseData[risk.currencyCode].push({
            date: risk.dueDate,
            currencycode: risk.currencyCode,
            riskHedgeModels: risk.riskHedgeModels,
            ...risk
          });
        } else {
          currencyWiseData = {
            [risk.currencyCode]: [
              {
                date: risk.dueDate,
                currencycode: risk.currencyCode,
                riskHedgeModels: risk.riskHedgeModels,
                ...risk
              }
            ],
            ...currencyWiseData
          };
        }
      });
    }
    // Combine Hedges
    let parsedHedgesData = [];
    if (pastData && pastData.hedges && pastData.hedges.length > 0) {
      pastData.hedges.forEach(deal => {
        let i = mappedHedgeIds.findIndex(x => x === deal.id);
        deal = {riskId: i !== -1 ? mappedRiskIds[i] : null, isLinkedHedge: mappedHedgeIds.includes(deal.id), ...deal}
        parsedHedgesData.push(deal);
      });
    }
    // Hedges
    let updatedRiskRadarHedgeData = [ ...riskRadarData.hedges, ...parsedHedgesData ];
    this.setState({ riskRadarFullData: {...riskRadarData, risks: updatedRiskRadarData, hedges: updatedRiskRadarHedgeData, currencyWiseData: currencyWiseData } });
    return {...riskRadarData, risks: updatedRiskRadarData};
  };
  componentWillReceiveProps(newProps) {
    if (this.props.isChanged !== newProps.isChanged) {
      // if (newProps.parsedRiskRadarData && newProps.parsedRiskRadarData.risks) {
      // let riskData = newProps.parsedRiskRadarData && newProps.parsedRiskRadarData.risks ? newProps.parsedRiskRadarData.risks : [];
      // let hedgeData = newProps.parsedRiskRadarData && newProps.parsedRiskRadarData.hedges ? newProps.parsedRiskRadarData.hedges : [];
      // let riskPastData = newProps.pastRiskRadarData && newProps.pastRiskRadarData.risks ? newProps.pastRiskRadarData.risks : [];
      // let hedgePastData = newProps.pastRiskRadarData && newProps.pastRiskRadarData.hedges ? newProps.pastRiskRadarData.hedges : [];
      // let minMaxYear = this.getMinMaxYear([...riskData, ...riskPastData], [...hedgeData, ...hedgePastData]);
      // // let minMaxYear = this.getMinMaxYear(newProps.parsedRiskRadarData, newProps.pastRiskRadarData);
      // this.setState({
      //   ...minMaxYear,
      //   showTable: false,
      //   tableDisplayData: [],
      //   multiSelectedCategoryPayables: false,
      //   multiSelectedTableData: [],
      //   multiSelectedCategories: []
      // });
      // this.handleClickSelectCategory(
      //   this.state.selectedCategory,
      //   newProps.parsedRiskRadarData
      // );
      // }
    }
  }
  getYearDifference = (nextDate, minYear) => {
    let days = this.getDateDifference(new Date(), nextDate);

    return minYear ? Math.floor(days / 365) : Math.ceil(days / 365) - 1;
  };
  getMinMaxYear = (apiData, pastRisks, hedges) => {
    // let apiData = [...parsedRiskRadarData.risks, ...pastRiskRadarData.risks];
    // let hedges = [...parsedRiskRadarData.hedges, ...pastRiskRadarData.hedges];
    let currencyDetails = [];
    let categories = [
      // "existingAssets",
      // "existingLiabilities",
      'payables',
      'receivables',
      'forecastedRevenues',
      'forecastedCosts',
    ];
    for (let i = 0; i < categories.length; i++) {
      if (apiData[categories[i]]) {
        currencyDetails = [...currencyDetails, ...apiData[categories[i]]];
      }
    }
    currencyDetails = [...currencyDetails, ...pastRisks];
    currencyDetails.sort((a, b) => {
      //  return  new Date(a['date'])  < new Date(b['date'])
      // return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    hedges &&
      hedges.sort((a, b) => {
        // return  new Date(a['settlementDate'])  < new Date(b['settlementDate'])
        // return (
        //   new Date(a.settlementDate).getTime() -
        //   new Date(b.settlementDate).getTime()
        // );
        return new Date(a.settlementDate) - new Date(b.settlementDate);
      });

    if (currencyDetails.length > 0 && hedges && hedges.length > 0) {
      let minYear =
        new Date(currencyDetails[0].dueDate) < new Date(hedges[0].settlementDate)
          ? this.getYearDifference(new Date(currencyDetails[0].dueDate), true)
          : this.getYearDifference(new Date(hedges[0].settlementDate), true);
      let maxYear =
        new Date(currencyDetails[currencyDetails.length - 1].dueDate) > new Date(hedges[hedges.length - 1].settlementDate)
          ? this.getYearDifference(new Date(currencyDetails[currencyDetails.length - 1].dueDate), false)
          : this.getYearDifference(new Date(hedges[hedges.length - 1].settlementDate), false);

      return {
        minYear: minYear,
        maxYear: maxYear,
      };
    } else if (currencyDetails.length > 0 && !hedges.length > 0) {
      return {
        minYear: this.getYearDifference(new Date(currencyDetails[0].dueDate), true),
        maxYear: this.getYearDifference(new Date(currencyDetails[currencyDetails.length - 1].dueDate), false),
      };
    } else if (!currencyDetails.length > 0 && hedges.length > 0) {
      return {
        minYear: this.getYearDifference(new Date(hedges[0].settlementDate), true),
        maxYear: this.getYearDifference(new Date(hedges[hedges.length - 1].settlementDate), false),
      };
    } else {
      return {
        minYear: this.getYearDifference(new Date(), true),
        maxYear: this.getYearDifference(new Date(), false),
      };
    }
  };
  getDateDifference = (prev, next) => {
    var now = prev; //new Date();
    var start = new Date(next);

    var diff = start - now;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  };

  onClick = (rowData, title, linkHedge) => {
    console.log('onClick hedge', rowData);

    if (sessionStorage.getItem('module') === 'RISKS') {
      this.setState({
        noticeModal: true,
        noticeModalHeader: 'Information',
        noticeModalErrMsg: 'For hedging transactions, please sign up FX Deals and Payment which will be launched soon.',
      });
    } else {
      if (!linkHedge) {
        if (rowData.convertedValueAfterHedge > 0) {
          let amountAttribute = title === 'Payables' || title === 'Forecasted Costs' || title === 'Liabilities' ? 'currencyBought' : 'currencySold';
          let remainingHedgeDetails = this.getRemainingHedgeAmount(rowData, amountAttribute);

          this.setState({
            showModal: true,
            dialogTitle: title,
            modalData: rowData,
            action: title === 'Payables' || title === 'Forecasted Costs' || title === 'Liabilities' ? 'buy' : 'sell',
            riskRadarType: RISKTYPES[title],
            hedgeTableData: [],
            tabValue: 0,
            remainingHedgeAmount: remainingHedgeDetails.remainingHedgeAmount,
            remainingHedgePercent: remainingHedgeDetails.remainingHedgePercent,
            showHedgeTableTab: true,
          });
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: 'Information',
            noticeModalErrMsg: 'This risk is fully hedged.',
          });
        }
      } else {
        console.log(rowData);
        this.linkDealWithRiskRadar(rowData, title);
      }
    }
  };
  handleClose = () => {
    this.setState({
      showModal: false,
    });
  };
  getRemainingHedgeAmount = (data, amountAttribute) => {
    if (data.riskHedgeModels) {
      let hedgeAmount = 0;
      hedgeAmount =
        data.riskHedgeModels.reduce(function(_this, val) {
          return _this + val[amountAttribute];
        }, 0) + hedgeAmount;
      let remainingHedgeAmount = data.amount - hedgeAmount;
      let remainingHedgePercent = (remainingHedgeAmount / data.amount) * 100;
      //remainingHedgePercent == 0 ? 100 : remainingHedgePercent
      return {
        remainingHedgeAmount: remainingHedgeAmount,
        remainingHedgePercent: remainingHedgePercent,
      };
    } else {
      return {
        remainingHedgeAmount: data.amount,
        remainingHedgePercent: 100,
      };
    }
  };
  linkDealWithRiskRadar = async (dealDetails, dialogTitle) => {
    console.log('linkDealWithRiskRadar', dealDetails);
    this.setState({ callInProgress: true });
    const param = {
      hedgeId: dealDetails.id,
      riskId: dealDetails.riskId,
    };
    console.log('linkDealWithRiskRadar', param);
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_RADAR_LINK_HEDGE,
      data: param,
      authToken: sessionStorage.getItem('token'),
    });
    this.setState({ callInProgress: false });

    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 404) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      this.setState({
        showModal: false,
      });
      this.props.getRiskRadarData(this.props.functionalCurrency, 1, true);
    }
  };

  deLinkDealWithRiskRadar = async (deal) => {
    console.log('deLinkDealWithRiskRadar', deal);
    this.setState({ callInProgress: true });
    const param = {
      riskId: deal.riskId,
      hedgeId: deal.hedgeId,
    };
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_RADAR_DELINK_HEDGE,
      data: param,
      authToken: sessionStorage.getItem('token'),
    });
    this.setState({ callInProgress: false });

    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 404) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      this.props.getRiskRadarData(this.props.functionalCurrency, 1, true);
    }
  };
  changePercentage = (event, stateName, rules) => {
    const value = event.target.value.substring(0, event.target.value.length - 1);
    this.setState(validate(value, stateName, this.state, rules, this.error));
  };

  change = (event, stateName, rules) => {
    this.setState(validate(event.target.value, stateName, this.state, rules, this.error));
  };
  isValidateHedgeAssetsData = () => {
    if (this.state.modalRadioChecked === 'hedgingPercentage' && this.state.hedgingPercentage > this.state.remainingHedgePercent) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: 'Error',
        noticeModalErrMsg: 'Hedge Percentage should be less than ' + this.state.remainingHedgePercent,
      });
      return false;
    }
    if (this.state.modalRadioChecked === 'hedgeAmount' && this.state.hedgeAmount > this.state.remainingHedgeAmount) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: 'Error',
        noticeModalErrMsg: 'Hedge Amount should be less than ' + formatMoney(this.state.remainingHedgeAmount),
      });
      return false;
    }
    if (
      (this.state.modalRadioChecked === 'hedgingPercentage' && this.state.hedgingPercentageState === 'success') ||
      (this.state.modalRadioChecked === 'hedgeAmount' && this.state.hedgeAmountState === 'success')
    ) {
      return true;
    } else {
      if (this.state.modalRadioChecked === 'hedgingPercentage' && this.state.hedgingPercentageState !== 'success') {
        if (this.state.hedgingPercentage === '') {
          this.state.hedgingPercentageErrorMsg.push(this.error['hedgingPercentageErrorMsg'].required);
        }
        this.setState({ hedgingPercentageState: 'error' });
      }
      if (this.state.modalRadioChecked === 'hedgeAmount' && this.state.hedgeAmountState !== 'success') {
        if (this.state.hedgeAmount === '') {
          this.state.hedgeAmountErrorMsg.push(this.error['hedgeAmountErrorMsg'].required);
        }
        this.setState({ hedgeAmountState: 'error' });
      }
    }
  };
  onClickExistingHedge = () => {
    if (!this.state.multiSelectRecords && this.isValidateHedgeAssetsData()) {
      const amount =
        this.state.modalRadioChecked === 'hedgeAmount' ? this.state.hedgeAmount : this.getGetAmountOfPercent(this.state.hedgingPercentage, this.state.modalData.amount);
      this.props.history.push({
        pathname: `/auth/fx-forward-deals`,
        state: {
          amount: amount,
          currency: this.state.modalData.currencyCode,
          action: this.state.action,
          riskRadarData: this.state.modalData,
          riskRadarType: this.state.riskRadarType.replace(' ', '_').toUpperCase(),
          fromLocation: 'risk-radar',
        },
      });
    } else if (this.state.multiSelectRecords) {
      alert('api to be called');
    }
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    });
  };
  onClickDeLinkHedge = (deal) => {
    this.setState({
      confirmationModal: true,
      confirmationModalHeader: 'De-Link Hedge',
      confirmationModalMsg: 'Are you sure, you want to De-Link this Hedge?',
      deLinkDeal: deal,
    });
  };
  handleNegativeResponse = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: '',
      confirmationModalMsg: '',
      deLinkDeal: {},
    });
  };
  handlePositiveResponse = () => {
    this.setState(
      {
        confirmationModal: false,
        confirmationModalHeader: '',
        confirmationModalMsg: '',
      },
      () => {
        this.deLinkDealWithRiskRadar(this.state.deLinkDeal);
      }
    );
  };
  closeWhatIfModal = () => {
    this.setState({
      showWhatIfModal: false,
      riskAnalysis: null,
    });
  };
  showRiskAnalysisDetail = async (rowData) => {
    console.log('Row Data - ', rowData);
    const param = {
      riskId: rowData.riskId ? rowData.riskId : rowData.id,
    };
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_RADAR_RISK_ANALYSIS,
      data: param,
      authToken: sessionStorage.getItem('token'),
    });
    this.setState({ callInProgress: false });

    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else if (res.data.errorCode === 406) {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Information',
          noticeModalErrMsg: 'This risk is fully hedged.',
        });
        return;
      } else if (res.data.userDesc.includes('PROVIDER_ABORT')) {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: 'There seems to be a problem currently. Please try again.',
        });
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      this.setState({
        showWhatIfModal: true,
        riskAnalysis: res.data,
      });
    }
  };
  checkBoxButton = (rowData, title, linkHedge) => {
    const { classes } = this.props;
    return (
      <>
        <IconButton aria-label="close" className={classes.alignNone} onClick={() => this.showRiskAnalysisDetail(rowData)}>
          <Tooltip
            id="tooltip-whatIf"
            title="If you consider hedging this risk, you can see the current Indicative Forward Rate, Indicative Hedging cost or benefit based on forward rates, and Risk Impact and Hedge Percentage before and after hedging. This will help you in deciding to hedge or not to hedge this risk"
            placement="top"
            classes={{ tooltip: classes.tooltipCalculator }}
          >
            <HelpIcon />
          </Tooltip>
        </IconButton>
        <Button
          size="sm"
          style={{
            backgroundColor: successColor[1],
          }}
          onClick={() => this.onClick(rowData, title, linkHedge)}
        >
          {linkHedge ? <h5>Link It</h5> : <h5>Hedge It</h5>}
        </Button>
      </>
    );
  };
  handleToggle = (stateName) => {
    this.setState({
      [stateName]: !this.state[stateName],
      showTable: false,
      tableDisplayData: [],
      multiSelectedCategoryPayables: false,
      multiSelectedTableData: [],
      multiSelectedCategories: [],
      dropDownOption: !this.state[stateName] ? CHARTOPTIONS : BARCHARTOPTIONS,
      chartCurrentView: !this.state[stateName] ? 'allRisk' : 'categoryWise',
    });
  };
  resetDataHideTable = () => {
    this.setState({
      showTable: false,
      tableDisplayData: [],
      multiSelectedCategoryPayables: false,
      multiSelectedTableData: [],
      multiSelectedCategories: [],
    });
  };

  getPageDetails = () => {
    let DataCount = Math.ceil(this.state.hedgeTableData.length / this.state.recordsPerPage);
    // switch ()
    let pageArray = [];
    Array.from(new Array(DataCount)).forEach((count, index) => {
      if (index + 1 === this.state.selectedPageIndex) {
        pageArray.push({
          text: `${index + 1}`,
          active: true,
        });
      } else {
        pageArray.push({
          text: `${index + 1}`,
        });
      }
    });
    return pageArray;
  };
  getPageData = (event) => {
    let pageIndex = 0;
    let pageCount = Math.ceil(this.state.hedgeTableData.length / this.state.recordsPerPage);
    switch (event.target.innerText) {
      case 'FIRST':
        pageIndex = 1;
        break;
      case 'PREVIOUS':
        pageIndex = this.state.selectedPageIndex - 1;
        break;
      case 'LAST':
        pageIndex = pageCount;
        break;
      case 'NEXT':
        pageIndex = this.state.selectedPageIndex + 1;
        break;
      default:
        pageIndex = parseInt(event.target.innerText);
        break;
    }
    if (pageIndex < 1) pageIndex = 1;
    else if (pageIndex > pageCount) pageIndex = pageCount;

    let selectedList = this.state.hedgeTableData.slice((pageIndex - 1) * this.state.recordsPerPage, pageIndex * this.state.recordsPerPage);
    this.setState({
      selectedPageIndex: pageIndex,
      selectedIndicatorList: selectedList,
    });
  };
  getDateAfterXYears = (y) => {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + y, month, day);
    // console.log('getDateAfterXYears',this.state.dayOfYear)

    return c;
  };
  displayTable = (data, categoryName, isBubbleChart, date) => {
    let arr = isBubbleChart ? this.getBubbleChartTableData(data) : this.getBarChartTableData(data, date);
    let multiSelectedTableData = this.state.multiSelectRecords ? [...this.state.multiSelectedTableData] : [];
    console.log('displayTable', multiSelectedTableData);

    console.log('displayTable arr', arr);

    if (this.state.multiSelectRecords) {
      if (multiSelectedTableData.length > 0 && this.checkIfSimilarCategory(categoryName)) {
        let obj = {
          title: multiSelectedTableData[0].title.includes(multiSelectedTableData[0].title)
            ? multiSelectedTableData[0].title
            : multiSelectedTableData[0].title + ', ' + CATEGORIESNAME[categoryName],
          data: [...multiSelectedTableData[0].data, ...arr],
          categoryData: [...multiSelectedTableData[0].categoryData, ...arr],
          columnsKeys: [...MULTISELECTTABLECOLUMNKEYDATE],
          columnName: [...MULTISELECTTABLECOLUMNNAMEDATE],
          name: CATEGORIESNAME[categoryName],
        };
        multiSelectedTableData[0] = obj;
        console.log('displayTable'.multiSelectedTableData);
      } else {
        multiSelectedTableData = [
          {
            title: CATEGORIESNAME[categoryName],
            data: [...arr],
            categoryData: [...arr],
            columnsKeys: [...MULTISELECTTABLECOLUMNKEYDATE],
            columnName: [...MULTISELECTTABLECOLUMNNAMEDATE],
            name: CATEGORIESNAME[categoryName],
          },
        ];
        console.log('displayTable'.multiSelectedTableData);
      }
    } else {
      multiSelectedTableData.push({
        title: CATEGORIESNAME[categoryName],
        data: [...arr],
        categoryData: [...arr],
        columnsKeys: [...TABLECOLUMNKEYDATE],
        columnName: [...TABLECOLUMNNAMEDATE],
        name: CATEGORIESNAME[categoryName],
      });
    }
    this.setState(
      {
        multiSelectedTableData: multiSelectedTableData,
        multiSelectedCategoryPayables: categoryName === 'payables' || categoryName === 'forecastedCosts' || categoryName === 'liabilities',
      },
      () => {
        this.renderTable(multiSelectedTableData, categoryName);
      }
    );
    //  }
  };
  onChangeSelect = (e, name, text) => {
    this.setState({
      ...validate(e.target.value, name, this.state, [], this.error),
      showTable: false,
      tableDisplayData: [],
      multiSelectedCategoryPayables: false,
      multiSelectedTableData: [],
      multiSelectedCategories: [],
    });
  };
  checkIfSimilarCategory = (categoryName) => {
    if ((categoryName === 'payables' || categoryName === 'forecastedCosts' || categoryName === 'liabilities') && this.state.multiSelectedCategoryPayables) {
      return true;
    } else if ((categoryName === 'receivables' || categoryName === 'forecastedRevenues' || categoryName === 'assets') && !this.state.multiSelectedCategoryPayables) {
      return true;
    }
    return false;
  };
  getSensitivityAmount = (amount) => {
    const sensitivityPercent = this.props.senstivityPercentage;
    return (amount * sensitivityPercent) / 100;
  };
  renderTable = (tableData, categoryName) => {
    const parsedRiskRadarData = this.props.parsedRiskRadarData.risks;
    let tableDisplayData = [...tableData];
    let riskHedgeModels = [],
      dealDetailsProbable = [];
    tableDisplayData &&
      tableDisplayData.forEach((data, index) => {
        let grid = [];
        data &&
          data.categoryData &&
          data.categoryData.forEach((row, index) => {
            let rowData = [index];
            data.columnsKeys &&
              data.columnsKeys.forEach((cell) => {
                if (cell === 'date') {
                  rowData = [...rowData, formatDate(row[cell])];
                } else if (cell === 'convertedValueBeforeHedge') {
                  rowData = [...rowData, formatMoney(row[cell]) + ' ' + row.convertedValueCurrencyCode];
                } else if (cell === 'amount') {
                  rowData = [...rowData, formatMoney(row[cell]) + ' ' + row.currencyCode];
                } else if (cell === 'sensitivityAmount') {
                  rowData = [
                    ...rowData,
                    formatMoney(
                      this.getSensitivityAmount(row.convertedValueBeforeHedge)
                      //row.convertedValueBeforeHedge
                    ) +
                      ' ' +
                      row.convertedValueCurrencyCode,
                  ];
                } else if (cell === 'exchangeRate') {
                  rowData = [...rowData, row[cell]];
                } else if (cell === 'externalHedge') {
                  rowData = [...rowData, this.checkBoxButton(row, data.title, false)];
                } else if (cell === 'checkbox') {
                  rowData = [...rowData, this.checkbox(row, data.title, false)];
                }
              });
            if (row.riskHedgeModels && row.riskHedgeModels.length > 0) {
              // riskHedgeModels = [...riskHedgeModels, {...row.riskHedgeModels, categoryTitle:title, uuid:row.uuid}];
              let deals = [],
                probableDeals = [];
              row.riskHedgeModels.forEach((obj) => {
                // deals = [
                //   ...deals,
                //   {
                //     ...riskHedgeModels,
                //     categoryTitle: row.categoryTitle,
                //     categoryUUID: row.uuid
                //   }
                // ];
                if (obj.probable) {
                  probableDeals.push({
                    ...obj,
                    // ...riskHedgeModels,
                    categoryTitle: row.categoryTitle,
                    riskId: row.id,
                  });
                } else {
                  deals.push({
                    ...obj,
                    // ...riskHedgeModels,
                    categoryTitle: row.categoryTitle,
                    riskId: row.id,
                  });
                }
              });
              if (deals.length > 0) {
                riskHedgeModels = [...riskHedgeModels, deals];
              }
              if (probableDeals.length > 0) {
                dealDetailsProbable = [...dealDetailsProbable, probableDeals];
              }

              // riskHedgeModels.push(deals)
              // dealDetailsProbable.push(probableDeals)
            }
            grid = [...grid, rowData];
          });

        tableDisplayData[index].data = grid;
      });

    if (riskHedgeModels.length > 0) {
      let grid = [];

      riskHedgeModels.forEach((deals, index) => {
        deals.forEach((row, index) => {
          let rowData = [index];
          let hedgeData = this.props.parsedRiskRadarData.hedges.filter((hedge) => hedge.id === row.hedgeId);
          if (hedgeData && hedgeData.length > 0) {
            const hedgeDataObj = hedgeData[0];
            HEDGETABLECOLUMNKEY.forEach((cell) => {
              if (cell === 'dealDate' || cell === 'settlementDate') {
                rowData = [...rowData, formatDate(hedgeDataObj[cell])];
              } else if (cell === 'currencyBought') {
                rowData = [...rowData, formatMoney(hedgeDataObj[cell]) + ' ' + hedgeDataObj.boughtCurrencyCode];
              } else if (cell === 'currencySold') {
                rowData = [...rowData, formatMoney(hedgeDataObj[cell]) + ' ' + hedgeDataObj.soldCurrencyCode];
              } else if (cell === 'exchangeRate') {
                rowData = [...rowData, formatMoney(hedgeDataObj[cell])];
              } else if (cell === 'delinkHedge') {
                rowData = [...rowData, this.delinkHedgeButton(row)];
              } else {
                rowData = [...rowData, hedgeDataObj[cell]];
              }
            });
          }
          grid = [...grid, rowData];
        });
      });
      let hedgeData = {
        title: 'Mapped Hedges',
        data: grid,
        columnsKeys: [...HEDGETABLECOLUMNKEY],
        columnName: [...HEDGETABLECOLUMNNAME],
      };
      tableDisplayData = [...tableDisplayData, hedgeData];
    }
    console.log('dealDetailsProbable', dealDetailsProbable);
    if (dealDetailsProbable.length > 0) {
      let grid = [];

      dealDetailsProbable.forEach((deals, index) => {
        deals.forEach((row, index) => {
          let rowData = [index];
          HEDGETABLECOLUMNKEY.forEach((cell) => {
            if (cell === 'dealDate' || cell === 'settlementDate') {
              rowData = [...rowData, formatDate(row[cell])];
            } else if (cell === 'currencyBought') {
              rowData = [...rowData, formatMoney(row[cell]) + ' ' + row.boughtCurrencyCode];
            } else if (cell === 'currencySold') {
              rowData = [...rowData, formatMoney(row[cell]) + ' ' + row.soldCurrencyCode];
            } else if (cell === 'exchangeRate') {
              rowData = [...rowData, formatMoney(row[cell])];
            } else if (cell === 'delinkHedge') {
              rowData = [...rowData, this.checkBoxButton(row, CATEGORIESNAME[row.categoryTitle], true)];
            } else {
              rowData = [...rowData, row[cell]];
            }
          });
          grid = [...grid, rowData];
        });
      });
      let hedgeData = {
        title: 'Probable Hedges',
        data: grid,
        columnsKeys: [...HEDGETABLECOLUMNKEY],
        columnName: [...HEDGETABLECOLUMNNAME],
      };
      tableDisplayData = [...tableDisplayData, hedgeData];
    }

    this.setState(
      {
        tableDisplayData: tableDisplayData,
        //tableColumns: columnName,
        showTable: true,
      },
      () => {
        document.getElementById('risk-radar-table').scrollIntoView();
      }
    );
  };
  handleCheckboxToggle = (e, checked, row, selectedRowIndex) => {
    let data = [...this.state.multiSelectedCategories];
    if (checked) {
      data = [...data, row];
    } else {
      data.splice(selectedRowIndex, 1);
    }
    console.log('handleCheckboxToggle', data);
    this.setState({ multiSelectedCategories: [...data] }, () => {
      this.renderTable(this.state.multiSelectedTableData);
    });
  };
  checkbox = (data) => {
    const selectedRowIndex = this.state.multiSelectedCategories.findIndex((x) => x.uuid === data.uuid);

    return (
      <FormControlLabel
        className={this.props.classes.center}
        classes={{
          root: this.props.classes.checkboxLabelControl,
          label: this.props.classes.checkboxLabel,
        }}
        control={
          <Checkbox
            tabIndex={-1}
            onClick={(e) => this.handleCheckboxToggle(e, selectedRowIndex === -1, data, selectedRowIndex)}
            checkedIcon={<Check className={this.props.classes.checkedIcon} />}
            checked={selectedRowIndex !== -1}
            icon={<Check className={this.props.classes.uncheckedIcon} />}
            classes={{
              checked: this.props.classes.checked,
              root: this.props.classes.checkRoot,
            }}
          />
        }
        label={''}
      />
    );
  };
  getBarChartTableData = (data, date) => {
    let arr =
      this.props.parsedRiskRadarData &&
      this.props.parsedRiskRadarData.risks &&
      this.props.parsedRiskRadarData.risks[data.name] &&
      this.props.parsedRiskRadarData.risks[data.name].filter((x) => {
        return this.getMonth(x.date).name + ', ' + new Date(x.date).getFullYear() == date;
      });
    let returnArr = [];
    arr.forEach((x) => {
      returnArr.push({
        categoryTitle: data.categoryName,
        ...x,
      });
    });
    return arr;
  };
  getMonth = (date) => {
    return {
      numeric: new Date(date).getMonth(),
      name: new Date(date).toLocaleString('default', { month: 'short' }),
    };
  };
  getBubbleChartTableData = (data) => {
    let arr =
      this.props.parsedRiskRadarData &&
      this.props.parsedRiskRadarData.risks &&
      this.props.parsedRiskRadarData.risks[data.categoryName] &&
      this.props.parsedRiskRadarData.risks[data.categoryName].filter((x) => x.date == data.date);
    let returnArr = [];
    arr.forEach((x) => {
      returnArr.push({
        categoryTitle: data.categoryName,
        ...x,
      });
    });
    return returnArr;
  };
  delinkHedgeButton = (rowData) => {
    const { classes } = this.props;
    return (
      <Button
        size="sm"
        style={{
          backgroundColor: successColor[1],
        }}
        onClick={() => this.onClickDeLinkHedge(rowData)}
      >
        <h5>DeLink Hedge</h5>
      </Button>
    );
  };

  linkHedgeButton = (rowData) => {
    const { classes } = this.props;
    return (
      <Button
        size="sm"
        style={{
          backgroundColor: successColor[1],
        }}
        //onClick={() => this.onClickDeLinkHedge(rowData)}
      >
        <h5>Link It</h5>
      </Button>
    );
  };

  getGetAmountOfPercent = (percentage, amount) => {
    return (amount * percentage) / 100;
  };
  handleTabChange = (event, newValue) => {
    if (newValue == 1) {
      this.renderLinkHedgeTable();
    }
    this.setState({ tabValue: newValue });
  };
  renderLinkHedgeTable = () => {
    let action = this.state.dialogTitle === 'Payables' || this.state.dialogTitle === 'Forecasted Costs' || this.state.dialogTitle === 'Liabilities' ? 'buy' : 'sell';
    let hedgeTableColumns = action === 'buy' ? ['Currency Bought', 'Settlement Date', ''] : ['Currency Sold', 'Settlement Date', ''];
    let currency = action === 'buy' ? 'boughtCurrencyCode' : 'soldCurrencyCode';
    let amount = action === 'buy' ? 'currencyBought' : 'currencySold';
    //let modalDateMonth = new Date(this.state.modalData.date).getMonth();
    //let modalDateYear = new Date(this.state.modalData.date).getYear();
    let modalDate = moment(this.state.modalData.date);
    let nearestDeals = [];
    let otherDeals = [];
    let arr = [];
    if (this.state.remainingHedgeAmount > 0) {
      arr = this.props.parsedRiskRadarData.hedges.filter(
        (x) =>
          // !x.isLinkedHedge && x[currency] == this.state.modalData.currencyCode
          x[amount] >= x[amount + 'Balance'] && x[currency] == this.state.modalData.currencyCode
      );

      arr.sort(function(a, b) {
        var distancea = Math.abs(new Date() - new Date(a));
        var distanceb = Math.abs(new Date() - new Date(b));
        return distancea - distanceb; // sort a before b when the distance is smaller
      });
      // arr.forEach(x=>{
      //   nearestDeals.push({
      //     ...x,
      //     riskId: this.state.modalData.id
      //   })
      // })
    }
    // this.props.parsedRiskRadarData.hedges.filter(x=> !x.isLinkedHedge).forEach(data => {
    //   if (
    //     data[currency] == this.state.modalData.currencyCode &&
    //     //data[amount] <= this.state.remainingHedgeAmount
    //     this.state.remainingHedgeAmount>0
    //   ) {

    //     if (
    //       modalDate.diff(moment(data.settlementDate), "days") <= 2 ||
    //       modalDate.diff(moment(data.settlementDate), "days") >= -2
    //     ) {
    //       nearestDeals = [
    //         ...nearestDeals,
    //         { ...data, riskId: this.state.modalData.id }
    //       ];
    //     } else {
    //       otherDeals = [
    //         ...otherDeals,
    //         { ...data, riskId: this.state.modalData.uuid }
    //       ];
    //     }
    //   }
    // });

    //nearestDeals = [...nearestDeals, ...otherDeals];

    let tableDeals = [];
    arr.map((data, index) => {
      nearestDeals.push({
        ...data,
        riskId: this.state.modalData.id,
      });
      tableDeals = [
        ...tableDeals,
        [
          index,
          action === 'buy' ? formatMoney(data.currencyBought) + ' ' + data.boughtCurrencyCode : formatMoney(data.currencySold) + ' ' + data.soldCurrencyCode,
          formatDate(data.settlementDate),
          this.checkBoxButton({ ...data, riskId: this.state.modalData.id }, this.state.dialogTitle, true),
        ],
      ];
    });
    let selectedIndicatorList = tableDeals.slice(0, this.state.recordsPerPage);
    this.setState({
      hedgeTableData: tableDeals,
      hedgeTableColumns: hedgeTableColumns,
      selectedIndicatorList: selectedIndicatorList,
    });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onClickMultiHedge = () => {
    if (this.isValidateMultiHedge(this.state.multiSelectedCategories)) {
      this.setState({
        showModal: true,
        dialogTitle: 'Multi Hedge',

        // riskRadarType: title,
        hedgeTableData: [],
        tabValue: 0,
        showHedgeTableTab: false,
        // remainingHedgeAmount: remainingHedgeDetails.remainingHedgeAmount,
        // remainingHedgePercent: remainingHedgeDetails.remainingHedgePercent
      });
    }
  };
  isValidateMultiHedge = (multiSelectedCategories) => {
    if (multiSelectedCategories.length === 0) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: 'Error',
        noticeModalErrMsg: 'Please select atleast one category',
      });
      return false;
    }
    return true;
  };

  zoom = (zoomIn) => {
    console.log(this.riskHorizonChartRef);
    if (this.riskHorizonChartRef && this.riskHorizonChartRef.current) {
      this.riskHorizonChartRef.current.zoom(zoomIn);
    }
  };

  openFullScreen = () => {
    if (this.riskHorizonChartRef && this.riskHorizonChartRef.current) {
      this.riskHorizonChartRef.current.openFullScreen();
    }
  };

  resetZoom = () => {
    if (this.riskHorizonChartRef && this.riskHorizonChartRef.current) {
      this.riskHorizonChartRef.current.resetZoom();
    }
  };
  onClickLinkHedge = (dealDetails, title, linkHedge, categoryDetails) => {
    this.setState(
      {
        modalData: categoryDetails,
      },
      () => {
        this.checkBoxButton(dealDetails, title, linkHedge);
      }
    );
  };
  handleClickSelectCategory = (selectedCategory, parsedRiskRadarData) => {
    let displayTableData = [];
    parsedRiskRadarData &&
      parsedRiskRadarData.risks &&
      parsedRiskRadarData.risks[selectedCategory].forEach((x, index) => {
        let displayData = [];
        let arr = [index, CATEGORIESNAME[selectedCategory], x.currencyCode + ' ' + formatMoney(x.amount), 'Date ' + formatDate(x.date), ''];
        displayData.push(arr);
        if (x.riskHedgeModels) {
          x.riskHedgeModels.map((y, idx) => {
            let obj = {
              ...y,
              riskId: x.id,
              categoryTitle: CATEGORIESNAME[selectedCategory],
            };
            // dealDetailsWithProbable = true;
            if (y.probable) {
              let hedges = [
                index + idx + 1,
                'Hedge',

                y.currencyCode + ' ' + formatMoney(y.amount),
                'Linking Date ' + formatDate(y.linkingDate),
                this.checkBoxButton(obj, CATEGORIESNAME[selectedCategory], true),
              ];
              displayData.push(hedges);
            } else {
              let hedges = [index + idx + 1, 'Hedge', y.currencyCode + ' ' + formatMoney(y.amount), 'Linking Date ' + formatDate(y.linkingDate), this.delinkHedgeButton(obj)];
              displayData.push(hedges);
            }
          });
        }
        //if (dealDetailsWithProbable) {
        // displayTableData = [...displayTableData, ...displayData];
        // }
        // displayTableData.push(...displayData);
        displayTableData = [...displayTableData, displayData];
      });
    this.setState({
      selectedCategory: selectedCategory,
      probableDealsDisplayData: displayTableData,
    });
  };
  getTableData = () => {
    const { classes } = this.props;
    if (this.state.probableDealsDisplayData && this.state.probableDealsDisplayData.length) {
      return this.state.probableDealsDisplayData.map((data, index) => {
        console.log(data);
        return (
          <div key={index} style={{ marginTop: 10, border: '1px solid #ACACAC' }}>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={this.state.probableDealsColumns}
              tableData={data}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[classes.colWidth, classes.colWidth]}
              customClassesForCells={[1, 2]}
              isMarketData={false}
            />
          </div>
        );
      });
    } else {
      return null;
    }
  };
  render() {
    const { classes, parsedRiskRadarData } = this.props;
    const { displayBubbleGraph, dropDownOption } = this.state;

    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={1} sm={1} md={1} lg={1} />
          <GridItem xs={2} sm={2} md={2} lg={2}>
            <h2 className={(classes.groupHeader, classes.featureTitleHeader)}>Risk Horizon</h2>
          </GridItem>
          <GridItem xs={2} sm={2} md={2} lg={2} style={{ alignSelf: 'center' }}>
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
                  onChange={() => this.handleToggle("multiSelectRecords")}
                  checked={this.state.multiSelectRecords}
                />
              }
              label={"Multi select"}
            /> */}
          </GridItem>
          <GridItem xs={2} sm={2} md={2} lg={2}>
            <FormControl
              fullWidth
              style={{
                paddingTop: 9,
              }}
            >
              <InputLabel htmlFor="type" className={classes.selectLabelRisk}>
                Current View
              </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu,
                }}
                value={this.state.chartCurrentView}
                onChange={(e) => this.onChangeSelect(e, 'chartCurrentView')}
                inputProps={{
                  name: 'chartCurrentView',
                  id: 'rr_chartCurrentView',
                  classes: {
                    icon: classes.white,
                    root: classes.selectDropDown,
                  },
                }}
              >
                {dropDownOption.map((item) => (
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value={item.name}
                    key={item.name}
                  >
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </GridItem>
          <GridItem
            xs={1}
            sm={1}
            md={1}
            lg={1}
            style={{
              visibility: parsedRiskRadarData && parsedRiskRadarData.risks && !displayBubbleGraph ? 'hidden' : 'visible',
            }}
          >
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.zoom(true)}>
              <ZoomInIcon />
            </IconButton>
          </GridItem>
          <GridItem
            xs={1}
            sm={1}
            md={1}
            lg={1}
            style={{
              visibility: parsedRiskRadarData && parsedRiskRadarData.risks && !displayBubbleGraph ? 'hidden' : 'visible',
            }}
          >
            <IconButton aria-label="close" className={classes.zoomOutButton} onClick={() => this.zoom(false)}>
              <ZoomOutIcon />
            </IconButton>
          </GridItem>
          <GridItem
            xs={1}
            sm={1}
            md={1}
            lg={1}
            style={{
              visibility: parsedRiskRadarData && parsedRiskRadarData.risks && !displayBubbleGraph ? 'hidden' : 'visible',
            }}
          >
            <IconButton aria-label="close" className={classes.zoomOutButton} onClick={() => this.resetZoom()}>
              <FullscreenIcon />
            </IconButton>
          </GridItem>
          <GridItem xs={1} sm={1} md={1} lg={1}>
          {displayBubbleGraph && 
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.openFullScreen()}>
              <ZoomOutMapIcon />
            </IconButton>
          }
          </GridItem>
          <GridItem xs={1} sm={1} md={1} lg={1}>
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.handleToggle('displayBubbleGraph')}>
              {displayBubbleGraph ? <BarChartIcon /> : <BubbleChartIcon />}
            </IconButton>
          </GridItem>
        </GridContainer>
        <WhatIfModal showModal={this.state.showWhatIfModal} closeModal={this.closeWhatIfModal} riskAnalysis={this.state.riskAnalysis} />
        {parsedRiskRadarData && parsedRiskRadarData.risks && displayBubbleGraph ? (
          <BubbleChart
            parsedRiskRadarData={this.state.riskRadarFullData}
            pastRiskRadarData={this.props.pastRiskRadarData}
            isChanged={this.props.isChanged}
            displayTable={this.displayTable}
            minYear={this.state.minYear}
            maxYear={this.state.maxYear}
            innerRef={this.riskHorizonChartRef}
            chartCurrentView={this.state.chartCurrentView}
            resetDataHideTable={this.resetDataHideTable}
            functionalCurrency={this.props.functionalCurrency}
          />
        ) : parsedRiskRadarData && parsedRiskRadarData.risks && !displayBubbleGraph ? (
          <StackBarChart
            chartCurrentView={this.state.chartCurrentView}
            parsedRiskRadarData={this.state.riskRadarFullData}
            isChanged={this.props.isChanged}
            displayTable={this.displayTable}
            minYear={this.state.minYear}
            maxYear={this.state.maxYear}
            innerRef={this.riskHorizonChartRef}
            resetDataHideTable={this.resetDataHideTable}
            functionalCurrency={this.props.functionalCurrency}
          />
        ) : (
          <GridContainer justify="center">Provide data in First Tab to see Risk horizon</GridContainer>
        )}
        {this.state.showTable &&
          this.state.tableDisplayData.map((data, index) => {
            return (
              <>
                <GridContainer id="risk-radar-table" key={index} style={{ marginTop: index === 0 ? 50 : 10 }}>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <h5>
                      <b>{data.title}</b>
                    </h5>
                  </GridItem>
                  <GridItem xs={11} sm={11} md={11} lg={11} style={{ textAlign: 'center' }}>
                    <Table
                      striped
                      tableHeaderColor="info"
                      tableHead={data.columnName}
                      tableData={data.data}
                      customHeadCellClasses={[]}
                      customHeadClassesForCells={[]}
                      customCellClasses={[classes.colWidth, classes.colWidth]}
                      customClassesForCells={[1, 2]}
                    />
                  </GridItem>
                </GridContainer>
                {this.state.multiSelectRecords && this.state.multiSelectedTableData.length > 0 && index === 0 && (
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'center' }}>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: successColor[1],
                        }}
                        onClick={() => this.onClickMultiHedge()}
                      >
                        {<h5>Hedge It</h5>}
                      </Button>
                    </GridItem>
                  </GridContainer>
                )}
              </>
            );
          })}
        <GridContainer id="risk-radar-table">
          <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'center', marginTop: '30px' }}>
            {!this.state.showTable && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                  Risk Item Details
                </AccordionSummary>
                <AccordionDetails>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12} lg={12} style={{ alignSelf: 'center' }}>
                        {CATEGORIES.map((obj, index) => {
                          return this.state.selectedCategory !== obj.key ? (
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                marginRight: 25,
                                cursor: 'pointer',
                              }}
                              onClick={() => this.handleClickSelectCategory(obj.key, this.state.riskRadarFullData)}
                            >
                              {obj.name}
                            </span>
                          ) : (
                            <Button
                              style={{
                                textAlign: 'center',
                                backgroundColor: '#1D64B0',
                                marginRight: 20,
                              }}
                              size="sm"
                              className={classes.marginRight}
                            >
                              {obj.name}
                            </Button>
                          );
                        })}
                      </GridItem>

                      <GridItem xs={12} sm={12} md={12} lg={12} style={{ marginTop: '20px' }}>
                        {this.getTableData()}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </AccordionDetails>
              </Accordion>
            )}
          </GridItem>
        </GridContainer>
        <>
          <Dialog
            classes={{
              root: classes.modalRoot,
            }}
            open={this.state.showModal}
            style={{ zIndex: 1032 }}
            maxWidth="md"
            disableBackdropClick
            disableEscapeKeyDown
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleClose()}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
            <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.center, classes.modalHeader)}>
              <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.handleClose()}>
                <CloseIcon />
              </IconButton>
              <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>{this.state.dialogTitle}</h3>
            </DialogTitle>
            <DialogContent id="classic-modal-slide-description" className={cx(classes.addDirectorsMaxWidth)}>
              <AppBar position="static" color="default">
                <Tabs value={this.state.tabValue} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" aria-label="Risk Horizon Tabs">
                  <Tab label="Create Hedge" {...a11yProps(0)} />
                  {this.state.showHedgeTableTab && <Tab label="Link with Existing Hedge" {...a11yProps(1)} />}
                </Tabs>
              </AppBar>
              <TabPanel value={this.state.tabValue} index={0} className={classes.tabPanelClass}>
                <form className={classes.form}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <b>Amount</b> {' ' + formatMoney(this.state.modalData.amount)} {' ' + this.state.modalData.currencyCode}
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} lg={6}>
                      <div className={classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal}>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={this.state.modalRadioChecked === 'hedgingPercentage'}
                              onChange={this.handleChange}
                              name="modalRadioChecked"
                              value="hedgingPercentage"
                              aria-label="A"
                              icon={<FiberManualRecord className={classes.radioUnchecked} />}
                              checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                              classes={{
                                checked: classes.radio,
                                root: classes.radioRoot,
                              }}
                            />
                          }
                          classes={{
                            label: classes.label,
                          }}
                          label="Hedge Percentage"
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={6}>
                      <div className={classes.checkboxAndRadio + ' ' + classes.checkboxAndRadioHorizontal}>
                        <FormControlLabel
                          control={
                            <Radio
                              checked={this.state.modalRadioChecked === 'hedgeAmount'}
                              onChange={this.handleChange}
                              name="modalRadioChecked"
                              value="hedgeAmount"
                              aria-label="A"
                              icon={<FiberManualRecord className={classes.radioUnchecked} />}
                              checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                              classes={{
                                checked: classes.radio,
                                root: classes.radioRoot,
                              }}
                            />
                          }
                          classes={{
                            label: classes.label,
                          }}
                          label="Hedge Amount"
                        />
                      </div>
                    </GridItem>
                    {this.state.modalRadioChecked === 'hedgingPercentage' && (
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <CustomNumberFormat
                          success={this.state.hedgingPercentageState === 'success'}
                          error={this.state.hedgingPercentageState === 'error'}
                          helpText={this.state.hedgingPercentageState === 'error' && this.state.hedgingPercentageErrorMsg[0]}
                          value={this.state.hedgingPercentage}
                          onChange={this.handleChange}
                          name={'hedgingPercentage'}
                          labelText="Hedge Percentage"
                          suffix="%"
                          id="rr_hedgingPercentage"
                          formControlProps={{
                            style: { paddingTop: 5 },
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: (event) => {
                              this.setState({
                                hedgingPercentagePristine: false,
                              });
                              this.changePercentage(event, 'hedgingPercentage', [
                                { type: 'required' },
                                {
                                  type: 'range',
                                  params: {
                                    min: 0,
                                    max: 100,
                                  },
                                },
                              ]);
                            },
                            onChange: (event) => {
                              if (!this.state.hedgingPercentagePristine) {
                                this.setState({
                                  hedgingPercentagePristine: false,
                                });
                                this.changePercentage(event, 'hedgingPercentage', [
                                  { type: 'required' },
                                  {
                                    type: 'range',
                                    params: {
                                      min: 0,
                                      max: 100,
                                    },
                                  },
                                ]);
                              }
                            },
                          }}
                        />
                      </GridItem>
                    )}
                    {this.state.modalRadioChecked === 'hedgeAmount' && (
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <CustomNumberFormat
                          success={this.state.hedgeAmountState === 'success'}
                          error={this.state.hedgeAmountState === 'error'}
                          helpText={this.state.hedgeAmountState === 'error' && this.state.hedgeAmountErrorMsg[0]}
                          value={this.state.hedgeAmount}
                          labelText="Hedge Amount"
                          onChange={this.handleChange}
                          id={'hedgeAmount'}
                          formControlProps={{
                            name: 'hedgeAmount',
                            style: { paddingTop: 5 },
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: (event) => {
                              this.setState({
                                hedgeAmountPristine: false,
                              });
                              this.change(event, 'hedgeAmount', [{ type: 'required' }, { type: 'positive' }]);
                            },
                            onChange: (event) => {
                              if (!this.state.hedgeAmountPristine) {
                                this.setState({
                                  hedgeAmountPristine: false,
                                });
                                this.change(event, 'hedgeAmount', [{ type: 'required' }, { type: 'positive' }]);
                              }
                            },
                          }}
                        />
                      </GridItem>
                    )}

                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <div className={cx(classes.buttonContainer, classes.center)}>
                        <Button round={false} color="info" size="lg" onClick={() => this.onClickExistingHedge()}>
                          PROCEED
                        </Button>
                      </div>
                    </GridItem>
                  </GridContainer>
                </form>
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={1} className={classes.tabPanelClass}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <Table
                      striped
                      tableHeaderColor="info"
                      tableHead={this.state.hedgeTableColumns}
                      tableData={this.state.selectedIndicatorList}
                      customHeadCellClasses={[]}
                      customHeadClassesForCells={[]}
                      customCellClasses={[]}
                      customClassesForCells={[]}
                    />
                    <Pagination pages={this.getPageDetails()} currentPage={this.state.selectedPageIndex} color="info" onClick={this.getPageData} />
                  </GridItem>
                </GridContainer>
              </TabPanel>
            </DialogContent>
          </Dialog>
        </>
        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + ' ' + classes.modalRoot,
              paper: classes.modal,
            }}
            open={this.state.callInProgress}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle id="waiting-modal-slide-title" disableTypography className={classes.modalHeader}>
              <h4 className={classes.modalTitle}>{'Processing...'}</h4>
            </DialogTitle>
            <DialogContent id="waiting-modal-slide-description" className={classes.modalBody} style={{ textAlign: 'center' }}>
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}{' '}
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
        {this.state.confirmationModal && (
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeResponse}
            handlePositiveButton={this.handlePositiveResponse}
            positiveButtonText="Yes"
            negativeButtonText="No"
          />
        )}
      </div>
    );
  }
}
RiskHorizon.propTypes = {
  classes: PropTypes.object.isRequired,
  parsedRiskRadarData: PropTypes.object,
  pastRiskRadarData: PropTypes.object,
  senstivityPercentage: PropTypes.object,
  isChanged: PropTypes.any,
};
export default withRouter(withStyles(style)(RiskHorizon));
