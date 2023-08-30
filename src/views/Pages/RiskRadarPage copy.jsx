import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import * as xlsx from "xlsx";

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import ConfirmationModal from 'views/Components/ConfirmationModal.jsx';

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';
import RiskInput from '../Components/RiskRadar/RiskInput';
import RiskImpact from '../Components/RiskRadar/RiskImpact';
import RiskHorizon from '../Components/RiskRadar/RiskHorizon';
import RiskAlert from '../Components/RiskRadar/RiskAlert';
import RiskRadarReports from '../Components/RiskRadar/RiskRadarReports';
import RiskInputDialog from '../Components/RiskRadar/RiskInput/RiskInputDialog';
import RiskRadarXeroModal from '../Components/RiskRadar/RiskRadarXeroModal';

import { formatDate, formatMoney, parseCurrency } from '../../utils/Utils';
import { validate } from '../../utils/Validator';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
import axios from 'axios';
import { grayColor, whiteColor, hexToRgb, blackColor } from 'assets/jss/material-dashboard-pro-react.jsx';

import moment from 'moment';

import riskradarapidata from 'views/Pages/json/riskradarapidata.json';
import riskradardisplaydata from 'views/Pages/json/riskradardisplaydata.json';
import riskRadarDummyData from 'views/Pages/json/RiskRadarDummyData.json';

const CATEGORIES = ['existingAssets', 'existingLiabilities', 'payables', 'receivables', 'forecastedRevenues', 'forecastedCosts', ''];

const BASE_RISK_DATA = {
  functionalCurrency: 'GBP',
  senstitivityPercentage: 10,
  risks: {
    assets: [],
    assetsDisplay: [],

    liabilities: [],
    liabilitiesDisplay: [],

    payables: [],
    payablesDisplay: [],

    receivables: [],
    receivablesDisplay: [],

    forecastedRevenues: [],
    forecastedRevenuesDisplay: [],

    forecastedCosts: [],
    forecastedCostsDisplay: [],

    externalHedges: [],
    externalHedgesDisplay: [],

    internalHedges: [],
    internalHedgesDisplay: [],
    // },
    hedges: [],
  },
  currencyWiseData: {},
};
const RISK_CATEGORY_INFO = {
  assets: { key: 'assets', type: 'ASSETS' },

  liabilities: { key: 'liabilities', type: 'LIABILITIES' },

  payables: { key: 'payables', type: 'PAYABLES' },

  receivables: { key: 'receivables', type: 'RECEIVABLES' },

  forecastedrevenues: {
    key: 'forecastedRevenues',
    type: 'FORECASTED_REVENUES',
  },

  forecastedcosts: { key: 'forecastedCosts', type: 'FORECASTED_COSTS' },

  // externalHedges: {key:'externalHedges', type:'ASSETS'}
};
const RISKTYPES = {
  assets: 'ASSETS',
  liabilities: 'LIABILITIES',
  payables: 'PAYABLES',
  receivables: 'RECEIVABLES',
  forecastedRevenues: 'FORECASTED_REVENUES',
  forecastedCosts: 'FORECASTED_COSTS',
};
const COLUMNDETAILS = {
  assets: [
    { name: 'Ref ID', dataType: 'string', key: 'referenceId', sort: false },
    { name: 'Amount', dataType: 'number', key: 'amount', sort: false },
    {
      name: 'Expected Sale Date',
      dataType: 'date',
      key: 'date',
      sort: true,
    },
    {
      name: 'Description',
      dataType: 'string',
      key: 'description',
      sort: false,
    },
    {
      name: ' ',
      dataType: 'string',
      key: '',
      sort: false,
    },
  ],
  liabilities: [
    { name: 'Ref ID', dataType: 'string', key: 'referenceId', sort: false },
    { name: 'Amount', dataType: 'number', key: 'amount', sort: false },
    {
      name: 'Expected Payment Date',
      dataType: 'date',
      key: 'date',
      sort: true,
    },
    {
      name: 'Description',
      dataType: 'string',
      key: 'description',
      sort: false,
    },
    {
      name: ' ',
      dataType: 'string',
      key: '',
      sort: false,
    },
  ],
  payables: [
    { name: 'Ref ID', dataType: 'string', key: 'referenceId', sort: false },
    { name: 'Amount', dataType: 'number', key: 'amount', sort: false },
    {
      name: 'Date Payable',
      dataType: 'date',
      key: 'date',
      sort: true,
    },
    {
      name: 'Description',
      dataType: 'string',
      key: 'description',
      sort: false,
    },
    {
      name: ' ',
      dataType: 'string',
      key: '',
      sort: false,
    },
  ],
  receivables: [
    { name: 'Ref ID', dataType: 'string', key: 'referenceId', sort: false },
    { name: 'Amount', dataType: 'number', key: 'amount', sort: false },
    {
      name: 'Date Receivable',
      dataType: 'date',
      key: 'date',
      sort: true,
    },
    {
      name: 'Description',
      dataType: 'string',
      key: 'description',
      sort: false,
    },
    {
      name: ' ',
      dataType: 'string',
      key: '',
      sort: false,
    },
  ],
  forecastedCosts: [
    { name: 'Ref ID', dataType: 'string', key: 'referenceId', sort: false },
    { name: 'Amount', dataType: 'number', key: 'amount', sort: false },
    {
      name: 'Date Forecasted',
      dataType: 'date',
      key: 'date',
      sort: true,
    },
    {
      name: 'Description',
      dataType: 'string',
      key: 'description',
      sort: false,
    },
    {
      name: ' ',
      dataType: 'string',
      key: '',
      sort: false,
    },
  ],
  forecastedRevenues: [
    { name: 'Ref ID', dataType: 'string', key: 'referenceId', sort: false },
    { name: 'Amount', dataType: 'number', key: 'amount', sort: false },
    {
      name: 'Date Expected',
      dataType: 'date',
      key: 'date',
      sort: true,
    },
    {
      name: 'Description',
      dataType: 'string',
      key: 'description',
      sort: false,
    },
    {
      name: ' ',
      dataType: 'string',
      key: '',
      sort: false,
    },
  ],
  externalHedges: [
    { name: 'Deal ID', dataType: 'string', key: 'referenceId', sort: false },
    {
      name: 'Deal Date',
      dataType: 'dealDate',
      key: 'date',
      sort: true,
    },
    {
      name: 'Currency Bought',
      dataType: 'string',
      key: 'boughtCurrencyCode',
      sort: false,
    },
    {
      name: 'Currency Bought Amount',
      dataType: 'number',
      key: 'currencyBought',
      sort: false,
    },
    {
      name: 'Currency Sold',
      dataType: 'string',
      key: 'soldCurrencyCode',
      sort: false,
    },
    {
      name: 'Currency Sold Amount',
      dataType: 'number',
      key: 'currencySold',
      sort: false,
    },
    {
      name: 'Settlement Date',
      dataType: 'settlementDate',
      key: 'date',
      sort: true,
    },

    {
      name: ' ',
      dataType: 'string',
      key: '',
      sort: false,
    },
  ],
};
const ExportDataNonExistingHeaders = [
  { key: "invoiceNumber", value: "Reference ID" },
  { key: "amountDue", value: "Amount" },
  { key: "currencyCode", value: "Currency Code" },
  { key: "description", value: "Description" },
];
const style = (theme) => ({
  icon: {
    color: '#333333',
    margin: '10px auto 0',
    width: '25px',
    height: '25px',
    border: '1px solid #E5E5E5',
    borderRadius: '50%',
    lineHeight: '174px',
    '& svg': {
      width: '55px',
      height: '55px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      width: '55px',
      fontSize: '55px',
    },
  },
  editIcon: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: 3,
  },
  closeIcon: {
    backgroundColor: '#F44336',
    color: 'white',
    padding: 3,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  center: {
    textAlign: 'center ',
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
});
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
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function Transition(props) {
  return <Slide direction="down" {...props} />;
}
class RiskRadar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callInProgress: false,
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',

      baseCurrencyCode: '',
      riskRadarData: {},
      functionalCurrency: 'GBP',
      senstitivityPercentage: 10,

      tabValue: 0,
      riskImpactData: null,
      parsedRiskRadarData: null,
      pastRiskRadarData: null,
      riskRadarFullData: null,
      editObject: { selectedCategory: '' },
      overallHedgeReport: {},
      isChanged: false,

      showEditDialog: false,
      dialogTitle: 'Edit',
      deleteConfirmationModal: false,
      deleteConfirmationModalHeader: '',
      deleteConfirmationModalMsg: '',
      selectedType: '',
      selectedIndex: -1,

      amount: 0,
      amountState: '',
      amountPristine: false,
      amountErrorMsg: [],

      currencyBought: 0,
      currencyBoughtState: '',
      currencyBoughtPristine: false,
      currencyBoughtErrorMsg: [],

      currencySold: 0,
      currencySoldState: '',
      currencySoldPristine: false,
      currencySoldErrorMsg: [],

      dealDate: null,
      dealDateState: '',
      dealDatePristine: false,
      dealDateErrorMsg: [],

      settlementDate: null,
      settlementDateState: '',
      settlementDatePristine: false,
      settlementDateErrorMsg: [],

      date: null,
      dateState: '',
      datePristine: false,
      dateErrorMsg: [],
      description: '',
      descriptionState: '',
      descriptionPristine: false,
      descriptionErrorMsg: [],
      id: '',
      idState: '',
      idPristine: false,
      idErrorMsg: [],
      currencycode: '',
      currencycodeState: '',
      selectedCategoryState: '',
      selectedCategory: '',
      categoryOptionDisabled: false,
      currencies: [],
      boughtCurrencyCode: '',
      boughtCurrencyCodeState: '',
      soldCurrencyCode: '',
      soldCurrencyCodeState: '',
      removeAction: '',
      selectedObj: {},
      xeroInvoices: [],
      invoiceDataRetrieved: false,
      riskRadarXeroModal: false,
      uploadXeroConfirmationModal: false,
      uploadXeroConfirmationModalHeader: "",
      uploadXeroConfirmationModalMsg: '',
      newXeroUploadList: [],
      modifiedXeroUploadList: [],

      openRiskInputDialog: false,
    };
    this.myRef = React.createRef();
  }
  componentDidMount() {
    // Get All Currencies
    this.getCurrencies();

    // Initialize Risk Radar Data
    this.initializeRiskRadarData();
    // this.parseRiskRadarData(riskRadarDummyData, "GBP", 0);
  }
  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          getData: false,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      this.setState({
        currencies: res.data.currrencies,
      });
    }
  };
  initializeRiskRadarData = async () => {
    // Get Base Currency
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem('token'),
    });

    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        this.setState({ callInProgress: false });
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        this.setState({ callInProgress: false });
        return;
      } else {
        this.setState({
          noticeModal: true,
          getData: false,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
          callInProgress: false,
        });
      }
    } else {
      this.setState(
        {
          functionalCurrency: res.data.baseCurrency,
        },
        () => {
          // this.getRiskRadarData(res.data.baseCurrency, 0, false);
          this.getXeroRiskRadarData(res.data.baseCurrency, 0, false);
        }
      );
    }
  };
  handleDeleteNegativeResponse = () => {
    this.setState({
      deleteConfirmationModal: false,
      deleteConfirmationModalHeader: '',
      deleteConfirmationModalMsg: '',
      selectedType: '',
      selectedIndex: -1,
      removeAction: '',
    });
  };
  handleDeletePositiveResponse = () => {
    this.setState({
      deleteConfirmationModal: false,
      deleteConfirmationModalHeader: '',
      deleteConfirmationModalMsg: '',
    });
    if (this.state.removeAction === 'delete') {
      this.removeSelectedRow();
    } else if (this.state.removeAction === 'clear') {
      this.callClearAPI();
    }
  };
  getXeroRiskRadarData = async (baseCurrency, tabValue, showLoading) => {
    if (this.props.location && this.props.location.state && this.props.location.state.from && this.props.location.state.from === 'xero-oauth') {
      console.log('STATE - ', this.props.location.state);
      this.setState({xeroInvoices: null, invoiceDataRetrieved: false, riskRadarXeroModal: true});
      // Clear the state after
      this.props.history.push(this.props.location.pathname, { replace: true });
      this.getRiskRadarData(baseCurrency, tabValue, showLoading);
    } else {
      this.getRiskRadarData(baseCurrency, tabValue, showLoading);
    }
  };
  closeRiskRadarXeroModal = () => {
    this.setState({xeroInvoices: [], invoiceDataRetrieved: false, riskRadarXeroModal: false});
  };
  getXeroInvoices = async () => {
    // Get risk data
    const res = await apiHandler({
      url: endpoint.XERO_GET_INVOICES + this.state.functionalCurrency,
      authToken: sessionStorage.getItem('token'),
    });
    console.log(res);
    if (res) {
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log('Unauthorized Access');
          this.props.history.push('/home/logout');
          return;
        } else if (res.data.errorCode === 403) {
          return;
        } else {
          this.setState({
            noticeModal: true,
            getData: false,
            noticeModalHeader: 'Error',
            noticeModalErrMsg: res.data.userDesc,
          });
        }
      } else {
        console.log('INVOICES FROM XERO - ', res.data);
        const invoices = res.data;

      // const invoices = [{
      //         "invoiceType": "ACCPAY",
      //         "invoiceId": "2175c381-d323-4e20-8c94-7680ea7f85d3",
      //         "invoiceNumber": "RPT445-1",
      //         "currencyCode": "EUR",
      //         "expectedPaymentDate": null,
      //         "plannedPaymentDate": "2022-12-06",
      //         "amountDue": 108.6,
      //         "description": null
      //       },{
      //         "invoiceType": "ACCREC",
      //         "invoiceId": "2175c381-d323-4e20-8c94-7680ea7f85d3",
      //         "invoiceNumber": "RPT445-2",
      //         "currencyCode": "EUR",
      //         "expectedPaymentDate": null,
      //         "plannedPaymentDate": "2022-12-02",
      //         "amountDue": 98.6,
      //         "description": null
      //       },{
      //         "invoiceType": "ACCPAY",
      //         "invoiceId": "2175c381-d323-4e20-8c94-7680ea7f85d3",
      //         "invoiceNumber": "RPT445-3",
      //         "currencyCode": "EUR",
      //         "expectedPaymentDate": null,
      //         "plannedPaymentDate": "2023-01-30",
      //         "amountDue": 108.7,
      //         "description": null
      //       }];

      if (invoices && invoices.length > 0) {
        // SHOW INVOICE MODAL          
        this.setState({xeroInvoices: invoices, invoiceDataRetrieved: true});
      } else {
        console.log('No Invoices');
        this.setState({
          xeroInvoices: invoices, 
          invoiceDataRetrieved: true,
          noticeModal: true,
          getData: false,
          noticeModalHeader: 'Information',
          noticeModalErrMsg: "No foreign currency denominated data returned",
        });
      }
    }
  }
};
  riskRadarUploadNowInvoice = (selectedInvoice) => {
    const invoiceToUpload = Object.values(selectedInvoice).filter(s => s !== null);
    let isAnySameRecord = false, isAnyModifyRecord = false;
    let newList = [], modifiedList = [], repeatedList = [];
    if (invoiceToUpload && invoiceToUpload.length > 0) {
      invoiceToUpload &&
        invoiceToUpload.forEach(async (inv, index) => {
          switch (inv.invoiceType) {
            case "ACCREC":
              {
                const filteredRisks = this.state.riskRadarFullData.risks.receivables.filter(risk => risk.referenceId == inv.invoiceNumber);
                if (filteredRisks.length > 0) {
                  isAnySameRecord = true;
                  filteredRisks.forEach(fr => {
                    if (fr.amount == inv.amountDue && 
                      fr.currencyCode == inv.currencyCode && 
                      fr.description == inv.description && 
                      fr.referenceId == inv.invoiceNumber) {
                        repeatedList.push(inv);
                      } else {
                        isAnyModifyRecord = true;
                        modifiedList(inv);
                      }
                  });
                } else {
                  newList.push(inv);
                }
              }
              break;
            case "ACCPAY": 
              {
                const filteredRisks = this.state.riskRadarFullData.risks.payables.filter(risk => risk.referenceId == inv.invoiceNumber);
                if (filteredRisks.length > 0) {
                  isAnySameRecord = true;
                  filteredRisks.forEach(fr => {
                    if (fr.amount == inv.amountDue && 
                      fr.currencyCode == inv.currencyCode && 
                      fr.description == inv.description && 
                      fr.referenceId == inv.invoiceNumber) {
                        repeatedList.push(inv);
                      } else {
                        isAnyModifyRecord = true;
                        modifiedList(inv);
                      }
                  });
                } else {
                  newList.push(inv);
                }
              }
              break;
            default:
              break;
          }
          if (modifiedList.length > 0 || repeatedList > 0){
            this.setState({
                  uploadXeroConfirmationModal: true,
                  uploadXeroConfirmationModalHeader: 'Xero Invoice Upload',
                  uploadXeroConfirmationModalMsg: 'There are few repeated or modified records. Do you want to upload them again?',
                  newXeroUploadList: newList,
                  modifiedXeroUploadList: modifiedList,
            });
          } else {
            this.riskRadarUploadNewInvoice(newList);
          }
        });
      }
    // compare invoiceNumber with referenceId and if matches, then show confirmation box to upload
    // compare each row with risk full data
    //   yes - break
    //   no - continue
    // if all no, then upload
    // if any yes then popup

    // after popup
      // No - upload only with above no
      // yes - edit the existing one

    console.log("uploadisworking...", invoiceToUpload );
    if (invoiceToUpload && invoiceToUpload.length > 0) {
      invoiceToUpload &&
        invoiceToUpload.forEach(async (inv, index) => {
          if (inv && inv.invoiceType) {
            await this.addUpdateCategoryDetails(
              inv.invoiceType === "ACCPAY" ? "payables" : "receivables",
              inv.invoiceNumber,
              inv.amountDue,
              inv.currencyCode,
              inv.description,
              inv.invoiceType === "ACCPAY"
                ? inv.plannedPaymentDate
                : inv.expectedPaymentDate,
              "",
              "",
              "",
              "",
              "",
              "",
              inv.invoiceId,
              false,
              index === invoiceToUpload.length - 1
            );
          }
        });
       this.closeRiskRadarXeroModal();
      //  this.setState({
      //   noticeModal: true,
      //   getData: false,
      //   noticeModalHeader: 'Information',
      //   noticeModalErrMsg: "Account Payable / Account Receivable records are uploaded",
      // });
    }
  };
  riskRadarUploadNewInvoice = (invoiceToUpload) => {
    console.log("uploadisworking...", invoiceToUpload );
    if (invoiceToUpload && invoiceToUpload.length > 0) {
      invoiceToUpload &&
        invoiceToUpload.forEach(async (inv, index) => {
          if (inv && inv.invoiceType) {
            await this.addUpdateCategoryDetails(
              inv.invoiceType === "ACCPAY" ? "payables" : "receivables",
              inv.invoiceNumber,
              inv.amountDue,
              inv.currencyCode,
              inv.description,
              inv.invoiceType === "ACCPAY"
                ? inv.plannedPaymentDate
                : inv.expectedPaymentDate,
              "",
              "",
              "",
              "",
              "",
              "",
              inv.invoiceId,
              false,
              index === invoiceToUpload.length - 1
            );
          }
        });
      this.closeRiskRadarXeroModal();
      //  this.setState({
      //   noticeModal: true,
      //   getData: false,
      //   noticeModalHeader: 'Information',
      //   noticeModalErrMsg: "Account Payable / Account Receivable records are uploaded",
      // });
    }
  };
  handleUploadXeroNegativeResponse = () => {
    this.riskRadarUploadNewInvoice(this.state.newXeroUploadList);
    this.setState({
      uploadXeroConfirmationModal: false,
      uploadXeroConfirmationModalHeader: '',
      uploadXeroConfirmationModalMsg: '',
    });
  };
  handleUploadXeroPositiveResponse = () => {
    this.riskRadarUploadNewInvoice(this.state.newXeroUploadList);
    this.setState({
      uploadXeroConfirmationModal: false,
      uploadXeroConfirmationModalHeader: '',
      uploadXeroConfirmationModalMsg: '',
    });
  };
  riskRadarUploadLaterInvoice = (selectedInvoice) => {
    this.closeRiskRadarXeroModal();
    let wb = xlsx.utils.book_new();
    let arr = [];
    wb.SheetNames.push("Xero Invoices");
    const invoiceToUpload = Object.values(selectedInvoice);
    invoiceToUpload && invoiceToUpload.forEach((inv, index) => {
      if (inv && inv.invoiceType) {
        let obj = {};
        obj["Category"] = inv.invoiceType === "ACCPAY" ? "Payables" : "Receivables";
        ExportDataNonExistingHeaders.forEach((column) => {
          obj[column.value] = inv[column.key];
        });
        obj["Date"] = inv.invoiceType === "ACCPAY" ? inv.plannedPaymentDate : inv.expectedPaymentDate;
        arr.push(obj);
      }
    });
    let ws = xlsx.utils.json_to_sheet(arr);
    wb.Sheets["Xero Invoices"] = ws;
    xlsx.writeFile(wb, "Risk_Radar_Xero_Invoices.xlsx");    
  };
  getRiskRadarData = async (baseCurrency, tabValue, showLoading) => {
    if (showLoading) {
      this.setState({ callInProgress: showLoading });
    }

    // Get updated Sensitivity Percentage
    let sensitivityResponse = await this.getSenstitivityPercentage();
    if (sensitivityResponse.data.errorCode) {
      if (sensitivityResponse.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else {
        // In case of error, add new sensitivity percentage as 10%
        let res = await this.updateSenstitivityPercentage(this.state.senstitivityPercentage, false, tabValue);
        if (res.data.errorCode) {
          if (res.data.errorCode === 401) {
            console.log('Unauthorized Access');
            this.props.history.push('/home/logout');
            return;
          } else {
            console.error(res.data.userDesc);
          }
        }
      }
    } else {
      // console.log("SENSITIVITY - ", sensitivityResponse.data);
      this.setState({
        senstitivityPercentage: sensitivityResponse.data,
      });
    }

    // Get risk data
    const res = await apiHandler({
      url: endpoint.RISK_RADAR_CALCULATE + '?functionalcurrency=' + baseCurrency,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          getData: false,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      // this.parseRiskRadarData(res.data, baseCurrency, tabValue); //riskRadarDummyData
      this.getPastRiskHedgesData(res.data, baseCurrency, tabValue);
    }
  };
  getPastRiskHedgesData = async (riskRadarData, baseCurrency, tabValue) => {
    // Get risk data
    const res = await apiHandler({
      url: endpoint.RISK_RADAR_PAST_DATA + '?functionalcurrency=' + baseCurrency,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          getData: false,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      console.log(res.data);
      // this.combineRiskRadarData(riskRadarData, res.data);
      this.parseRiskRadarData(riskRadarData, res.data, baseCurrency, tabValue); //riskRadarDummyData
    }
  };
  updateSenstitivityPercentage = async (percentage, refreshData, tabValue) => {
    // set sensitivity percentage
    const data = {
      senstivityPercentage: percentage,
    };
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.RISK_RADAR_UPDATE_SENSITIVITY,
      data: data,
      authToken: sessionStorage.getItem('token'),
    });
    if (refreshData) {
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log('Unauthorized Access');
          this.props.history.push('/home/logout');
          return;
        } else if (res.data.errorCode === 403) {
          return;
        } else {
          this.setState({
            noticeModal: true,
            getData: false,
            noticeModalHeader: 'Error',
            noticeModalErrMsg: res.data.userDesc,
          });
        }
      } else {
        this.getRiskRadarData(this.state.functionalCurrency, tabValue, false);
      }
    } else {
      return res;
    }
  };
  getSenstitivityPercentage = async () => {
    const header = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    return await apiHandler({
      url: endpoint.RISK_RADAR_GET_SENSITIVITY,
      authToken: sessionStorage.getItem('token'),
    });
  };
  getDealObj = (hedges, hedgeId) => {
    let arr = hedges.filter((x) => x.id === hedgeId);
    if (arr.length > 0) {
      return arr[0];
    } else {
      return {};
    }
  };

  parseRiskRadarData = (data, pastData, functionalCurrency, tabValue) => {
    let mappedHedgeIds = [],
      mappedRiskIds = [];
    let parsedRiskRadarData = JSON.parse(JSON.stringify(BASE_RISK_DATA)); //{...BASE_RISK_DATA};
    parsedRiskRadarData.functionalCurrency = functionalCurrency;
    let tableObj = [];
    let currencyWiseData = {};
    // parse Risks
    if (data && data.risks && data.risks.length > 0) {
      data.risks.forEach((risk) => {
        tableObj = [];
        let type = risk.riskType.toLowerCase().replace('_', '');
        let key = RISK_CATEGORY_INFO[type].key;
        // parsedRiskRadarData.risks[key].push({
        //   date: risk.dueDate,
        //   currencycode: risk.currencyCode,
        //   ...risk
        // });
        tableObj = [
          parsedRiskRadarData.risks[key + 'Display'].length,
          risk.referenceId,
          formatMoney(risk.amount) + ' ' + risk.currencyCode,
          formatDate(risk.dueDate),
          risk.description,
          this.getDeleteRowIcon(key, parsedRiskRadarData.risks[key + 'Display'].length, risk),
        ];
        parsedRiskRadarData.risks[key + 'Display'].push(tableObj);
        let riskHedgeModels = [];
        console.log('checkcheck', risk);

        if (risk.riskHedgeModels && risk.riskHedgeModels.length > 0) {
          console.log('checkcheck', risk.riskHedgeModels);

          risk.riskHedgeModels.forEach((y) => {
            let dealObj = this.getDealObj(data.hedges, y.hedgeId);
            console.log('checkcheck', dealObj);
            mappedHedgeIds = [...mappedHedgeIds, y.hedgeId];
            mappedRiskIds = [...mappedRiskIds, risk.id];
            riskHedgeModels.push({
              ...y,
              ...dealObj,
              riskId: risk.id,
            });
            console.log('checkcheckriskHedgeModels', riskHedgeModels);
          });
        }
        parsedRiskRadarData.risks[key].push({
          ...risk,
          date: risk.dueDate,
          currencycode: risk.currencyCode,
          riskHedgeModels: riskHedgeModels,
        });
        if (currencyWiseData[risk.currencyCode]) {
          currencyWiseData[risk.currencyCode].push({
            date: risk.dueDate,
            currencycode: risk.currencyCode,
            riskHedgeModels: riskHedgeModels,
            ...risk,
          });
        } else {
          currencyWiseData = {
            [risk.currencyCode]: [
              {
                date: risk.dueDate,
                currencycode: risk.currencyCode,
                riskHedgeModels: riskHedgeModels,
                ...risk,
              },
            ],
            ...currencyWiseData,
          };
        }
        //}
      });
    }
    //parsedRiskRadarData.hedges = data.hedges;
    parsedRiskRadarData.currencyWiseData = currencyWiseData;
    this.parseHedgesData(parsedRiskRadarData, pastData, tabValue, functionalCurrency, data, mappedHedgeIds, mappedRiskIds);
  };
  parseHedgesData = (parsedRiskRadarData, pastData, tabValue, functionalCurrency, data, mappedHedgeIds, mappedRiskIds) => {
    let parsedHedgesData = [];
    if (data && data.hedges && data.hedges.length > 0) {
      data.hedges.forEach((deal) => {
        let hedgeType = deal.hedgeType.toLowerCase();
        let i = mappedHedgeIds.findIndex((x) => x === deal.id);
        parsedRiskRadarData.risks[hedgeType + 'Hedges'].push({
          isLinkedHedge: mappedHedgeIds.includes(deal.id),
          riskId: i !== -1 ? mappedRiskIds[i] : null,
          ...deal,
        });
        parsedHedgesData.push({
          isLinkedHedge: mappedHedgeIds.includes(deal.id),
          riskId: i !== -1 ? mappedRiskIds[i] : null,
          ...deal,
        });
        parsedRiskRadarData.risks[hedgeType + 'HedgesDisplay'].push([
          parsedRiskRadarData.risks[hedgeType + 'HedgesDisplay'].length,
          deal.dealId,
          formatDate(deal.dealDate),
          deal.boughtCurrencyCode,
          formatMoney(deal.currencyBought),
          deal.soldCurrencyCode,
          formatMoney(deal.currencySold),
          formatDate(deal.settlementDate),
          this.getDeleteRowIcon(hedgeType + 'Hedges', parsedRiskRadarData.risks[hedgeType + 'HedgesDisplay'].length, deal),
        ]);
      });
    }
    parsedRiskRadarData.hedges = parsedHedgesData;
    this.setState(
      {
        parsedRiskRadarData: parsedRiskRadarData,
        isChanged: !this.state.isChanged,
        tabValue: tabValue,
        functionalCurrency: functionalCurrency,
        riskRadarData: data,
        callInProgress: false,
      },
      () => {
        this.combineRiskRadarData(parsedRiskRadarData, pastData);
      }
    );
  };
  combineRiskRadarData = (riskRadarData, pastData) => {
    let mappedHedgeIds = [],
      mappedRiskIds = [];

    let updatedRiskRadarData = JSON.parse(JSON.stringify(BASE_RISK_DATA.risks)); //{...BASE_RISK_DATA};
    // let updatedRiskRadarData = Object.assign({}, { ...risks });
    // let updatedRiskRadarData = { ...riskRadarData.risks };
    if (pastData && pastData.risks && pastData.risks.length > 0) {
      pastData.risks.forEach((risk) => {
        risk.date = risk.dueDate;

        let type = risk.riskType.toLowerCase().replace('_', '');
        let key = RISK_CATEGORY_INFO[type].key;
        let tableObj = [
          updatedRiskRadarData[key + 'Display'].length,
          risk.referenceId,
          formatMoney(risk.amount) + ' ' + risk.currencyCode,
          formatDate(risk.dueDate),
          risk.description,
          this.getDeleteRowIcon(key, updatedRiskRadarData[key + 'Display'].length, risk),
        ];
        updatedRiskRadarData[key + 'Display'] = [...updatedRiskRadarData[key + 'Display'], tableObj];

        // Check mapped Hedges
        const hedgeIds = risk.riskHedgeModels && risk.riskHedgeModels.map((hedge) => hedge.hedgeId);
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
      });
    }
    // Combine Hedges
    let parsedHedgesData = [];
    if (pastData && pastData.hedges && pastData.hedges.length > 0) {
      pastData.hedges.forEach((deal) => {
        let hedgeType = deal.hedgeType.toLowerCase();
        let i = mappedHedgeIds.findIndex((x) => x === deal.id);
        updatedRiskRadarData[hedgeType + 'Hedges'].push({
          isLinkedHedge: mappedHedgeIds.includes(deal.id),
          riskId: i !== -1 ? mappedRiskIds[i] : null,
          ...deal,
        });
        parsedHedgesData.push({
          isLinkedHedge: mappedHedgeIds.includes(deal.id),
          riskId: i !== -1 ? mappedRiskIds[i] : null,
          ...deal,
        });
        updatedRiskRadarData[hedgeType + 'HedgesDisplay'].push([
          updatedRiskRadarData[hedgeType + 'HedgesDisplay'].length,
          deal.dealId,
          formatDate(deal.dealDate),
          deal.boughtCurrencyCode,
          formatMoney(deal.currencyBought),
          deal.soldCurrencyCode,
          formatMoney(deal.currencySold),
          formatDate(deal.settlementDate),
          this.getDeleteRowIcon(hedgeType + 'Hedges', updatedRiskRadarData[hedgeType + 'HedgesDisplay'].length, deal),
        ]);
      });
    }
    const updatedRisks = {
      assets: [...riskRadarData.risks.assets, ...updatedRiskRadarData.assets],
      assetsDisplay: [...riskRadarData.risks.assetsDisplay, ...updatedRiskRadarData.assetsDisplay],

      liabilities: [...riskRadarData.risks.liabilities, ...updatedRiskRadarData.liabilities],
      liabilitiesDisplay: [...riskRadarData.risks.liabilitiesDisplay, ...updatedRiskRadarData.liabilitiesDisplay],

      payables: [...riskRadarData.risks.payables, ...updatedRiskRadarData.payables],
      payablesDisplay: [...riskRadarData.risks.payablesDisplay, ...updatedRiskRadarData.payablesDisplay],

      receivables: [...riskRadarData.risks.receivables, ...updatedRiskRadarData.receivables],
      receivablesDisplay: [...riskRadarData.risks.receivablesDisplay, ...updatedRiskRadarData.receivablesDisplay],

      forecastedRevenues: [...riskRadarData.risks.forecastedRevenues, ...updatedRiskRadarData.forecastedRevenues],
      forecastedRevenuesDisplay: [...riskRadarData.risks.forecastedRevenuesDisplay, ...updatedRiskRadarData.forecastedRevenuesDisplay],

      forecastedCosts: [...riskRadarData.risks.forecastedCosts, ...updatedRiskRadarData.forecastedCosts],
      forecastedCostsDisplay: [...riskRadarData.risks.forecastedCostsDisplay, ...updatedRiskRadarData.forecastedCostsDisplay],

      externalHedges: [...riskRadarData.risks.externalHedges, ...updatedRiskRadarData.externalHedges],
      externalHedgesDisplay: [...riskRadarData.risks.externalHedgesDisplay, ...updatedRiskRadarData.externalHedgesDisplay],

      internalHedges: [...riskRadarData.risks.internalHedges, ...updatedRiskRadarData.internalHedges],
      internalHedgesDisplay: [...riskRadarData.risks.internalHedgesDisplay, ...updatedRiskRadarData.internalHedgesDisplay],
      // },
      hedges: [...riskRadarData.risks.hedges, ...updatedRiskRadarData.hedges],
    };
    this.setState({ pastRiskRadarData: pastData, riskRadarFullData: { ...riskRadarData, risks: updatedRisks }, isChanged: !this.state.isChanged });
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    }, () => {
      if (this.state.getData) {
        this.getRiskRadarData(this.state.functionalCurrency, 0, true);
        this.setState({ getData: false });
      }
    });
  };
  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  removeRow = (type, index, obj) => {
    this.setState({
      deleteConfirmationModal: true,
      deleteConfirmationModalHeader: 'DELETE',
      deleteConfirmationModalMsg: 'Are you sure you want to delete this input?',
      selectedType: type,
      selectedIndex: index,
      removeAction: 'delete',
      selectedObj: { ...obj, selectedCategory: type },
    });
  };
  removeSelectedRow = () => {
    //commented for now
    if (this.state.selectedObj.selectedCategory === 'externalHedges') {
      const param = {
        hedgeId: this.state.selectedObj.id,
      };
      this.callDeleteAPI(endpoint.BASE_URL_STAGING_AXIOS + 'fx-forrex/v1/riskradar/externalhedge/delete', param);
    } else {
      const param = {
        riskId: this.state.selectedObj.id,
      };
      this.callDeleteAPI(endpoint.BASE_URL_STAGING_AXIOS + 'fx-forrex/v1/riskradar/risk/delete', param);
    }
  };
  callDeleteAPI = async (url, param) => {
    this.setState({ callInProgress: true });
    // const res = await apiHandler({
    //   method: "DELETE",
    //   url: url,
    //   data: param,
    //   authToken: sessionStorage.getItem("token")
    // });
    const res = await axios.delete(url, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      data: param,
    });
    if (res.data.errorCode) {
      this.setState({ callInProgress: false });
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          getData: false,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      this.getRiskRadarData(this.state.functionalCurrency, 0, false);
    }
  };
  editRow = (name, index) => {
    let nameDisplay = name + 'Display';

    let lists = this.state.parsedRiskRadarData && this.state.parsedRiskRadarData.risks[name] ? this.state.parsedRiskRadarData.risks[name] : [];
    let listsDisplay = this.state.parsedRiskRadarData && this.state.parsedRiskRadarData.risks[nameDisplay] ? this.state.parsedRiskRadarData.risks[nameDisplay] : [];

    let nodeDisplay = listsDisplay.find((row) => row[0] == index);
    let node = lists[index];

    // Set state Object
    if (nodeDisplay && node) {
      let editObject = {};
      if (name != 'externalHedges') {
        editObject = {
          selectedCategory: name,
          categoryIndex: index,
          currencycode: node.currencycode,
          ...node,
        };
      } else {
        editObject = {
          selectedCategory: name,
          categoryIndex: index,
          ...node,
        };
      }
      editObject = {
        ...editObject,
        amountState: 'success',
        currencycodeState: 'success',
        selectedCategoryState: 'success',
        dateState: 'success',
        descriptionState: 'success',
        idState: 'success',

        dealDateState: 'success',
        boughtCurrencyCodeState: 'success',
        currencyBoughtState: 'success',
        soldCurrencyCodeState: 'success',
        currencySoldState: 'success',
        settlementDateState: 'success',
      };
      this.setState({
        editObject: editObject,
        categoryIndex: index,
        selectedCategory: name,
        categoryOptionDisabled: true,
        showEditDialog: true,
      });
      // if (this.myRef.current) this.myRef.current.onClickEdit(editObject);
      this.onClickEdit(editObject);
    }
  };

  getDeleteRowIcon = (category, index, obj) => {
    return (
      <>
        <Edit onClick={() => this.editRow(category, index)} className={cx(this.props.classes.editIcon, this.props.classes.icon)} />
        <Close onClick={() => this.removeRow(category, index, obj)} className={cx(this.props.classes.closeIcon, this.props.classes.icon)} />
      </>
    );
  };

  getExistingHedgeData = (data) => {
    let externalHedges = [];
    data.externalHedges &&
      data.externalHedges.riskRadarCategory &&
      data.externalHedges.riskRadarCategory.currencyDetails &&
      data.externalHedges.riskRadarCategory.currencyDetails.forEach((row, index) => {
        externalHedges.push({
          ...row.dealDetails[0],
          isExistingHedge: true,
          // uuid: row.uuid
        });
      });
    return externalHedges;
  };
  onClickClear = () => {
    this.setState({
      deleteConfirmationModal: true,
      deleteConfirmationModalHeader: 'CLEAR',
      deleteConfirmationModalMsg:
        'Are you sure you want to delete all Risk Input records? This will clear all past and present risk inputs and cannot be restored. You can alternatively choose to delete individual risk inputs by selecting each of them separately one by one.',
      removeAction: 'clear',
    });
  };

  callClearAPI = async () => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: 'DELETE',
      url: endpoint.RISK_RADAR_CLEAR_INPUT,
      data: null,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      this.setState({ callInProgress: false });
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        this.props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          getData: false,
          noticeModalHeader: 'Error',
          noticeModalErrMsg: res.data.userDesc,
          callInProgress: false,
        });
        return;
      }
    } else {
      this.getRiskRadarData(this.state.functionalCurrency, 0, false);
    }
  };
  toggleRiskInputDialog = (action) => {
    this.setState({
      openRiskInputDialog: action,
    });
  };
  onClickEdit = (editObject) => {
    this.setState({
      editObject: editObject,
      openRiskInputDialog: true,
    });
  };
  addUpdateCategoryDetails = async (
    selectedCategory,
    displayId,
    amount,
    currencyCode,
    description,
    date,
    dealDate,
    boughtCurrencyCode,
    currencyBought,
    soldCurrencyCode,
    currencySold,
    settlementDate,
    id,
    isEdit,
    isLastRecord
  ) => {
    console.log('calladdupdateapi - ', selectedCategory, isLastRecord, this.state.callInProgress);
    if (selectedCategory !== 'externalHedges') {
      let param = {
        riskType: RISKTYPES[selectedCategory],
        currencyCode: currencyCode,
        amount: parseCurrency(amount),
        referenceId: displayId,
        description: description,
        date: date,
      };
      if (isEdit) {
        param = { ...param, id: id };
      }
      this.callAddUpdateAPI(endpoint.RISK_RADAR_UPDATE_BULK_RISKS, param, selectedCategory, isLastRecord);
    } else {
      let param = {
        currencySold: parseCurrency(currencySold),
        currencyBought: parseCurrency(currencyBought),
        soldCurrencyCode: soldCurrencyCode,
        boughtCurrencyCode: boughtCurrencyCode,
        dealDate: dealDate,
        settlementDate: settlementDate,
        dealId: displayId,
        // exchangeRate: 0
      };
      if (isEdit) {
        param = { ...param, id: id };
      }
      this.callAddUpdateAPI(endpoint.RISK_RADAR_UPDATE_BULK_HEDGES, param, selectedCategory, isLastRecord);
    }
  };
  callAddUpdateAPI = async (url, param, selectedCategory, isLastRecord) => {
    // console.log("calladdupdateapi", selectedCategory);
    // console.log("calladdupdateapi", url);
    // console.log("calladdupdateapi", param);

    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: 'POST',
      url: url,
      data: param,
      authToken: sessionStorage.getItem('token'),
    });
    // this.setState({ callInProgress: false });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      this.setState({
        noticeModal: true,
        getData: false,
        noticeModalHeader: 'Error',
        noticeModalErrMsg: res.data.userDesc,
      });
      return;
    } else {
      this.setState({
        selectedCategoryTab: selectedCategory,
        openRiskInputDialog: false,
        columnSortKey: '',
        columnDetails: COLUMNDETAILS[selectedCategory],
      });
      if (isLastRecord) {
        this.setState({
          noticeModal: true,
          callInProgress: false,
          getData: true,
          noticeModalHeader: 'Information',
          noticeModalErrMsg: "Risk Input has been updated",
        });
          // noticeModalErrMsg: "Account Payable / Account Receivable records are uploaded",
        // this.getRiskRadarData(this.state.functionalCurrency, 0, true);
      }
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <h4 style={{ display: 'inline-block', marginLeft: '24px' }}>
                <b>Risk Radar</b>
              </h4>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <div>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} lg={12} className={classes.root}>
                    <GridContainer style={{ paddingRight: '48px' }}>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        //style={{paddingRight:'48px !important'}}
                      >
                        <AppBar position="static" color="default" style={{ margin: '0px 24px 0px 24px' }}>
                          <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="Risk Radar Tabs"
                          >
                            <Tab
                              label={
                                <Tooltip
                                  title="Here you can individually input (or upload) all of your foreign currency receipts, payments, assets and liabilities. This will help you monitor or quantify your risks."
                                  placement="bottom"
                                  classes={{
                                    tooltip: classes.tooltipCalculator,
                                  }}
                                >
                                  <span>
                                    Risk Input <InfoOutlined className={classes.info} />
                                  </span>
                                </Tooltip>
                              }
                              {...a11yProps(0, classes)}
                            />
                            <Tab
                              label={
                                <Tooltip
                                  title="This will show you all your risks and hedges in bubble and bar charts. This will help you monitor your risks and take appropriate action."
                                  placement="bottom"
                                  classes={{
                                    tooltip: classes.tooltipCalculator,
                                  }}
                                >
                                  <span>
                                    Risk Horizon <InfoOutlined className={classes.info} />
                                  </span>
                                </Tooltip>
                              }
                              {...a11yProps(1, classes)}
                            />
                            <Tab
                              label={
                                <Tooltip
                                  title="This shows the worst case impact of FX risks on your profitability or balance sheet in a choosen base currency movement against all foreign currencies in your business."
                                  placement="bottom"
                                  classes={{
                                    tooltip: classes.tooltipCalculator,
                                  }}
                                >
                                  <span>
                                    Risk Impact <InfoOutlined className={classes.info} />
                                  </span>
                                </Tooltip>
                              }
                              {...a11yProps(2, classes)}
                            />
                            <Tab
                              label={
                                <Tooltip
                                  title="You can edit default settings here and classify the Risk Impact from Low to Critical risk categories depending on your own Risk Appetite. You can then also select and enable or disable an alert which will email you everyday in case a Risk Impact threshold set by you is exceeded."
                                  placement="bottom"
                                  classes={{
                                    tooltip: classes.tooltipCalculator,
                                  }}
                                >
                                  <span>
                                    Risk Alert <InfoOutlined className={classes.info} />
                                  </span>
                                </Tooltip>
                              }
                              {...a11yProps(3, classes)}
                            />
                            <Tab
                              label={
                                <Tooltip
                                  title="You can see here various Reports to help you in further analysis and decision making."
                                  placement="bottom"
                                  classes={{
                                    tooltip: classes.tooltipCalculator,
                                  }}
                                >
                                  <span>
                                    Reports <InfoOutlined className={classes.info} />
                                  </span>
                                </Tooltip>
                              }
                              {...a11yProps(4, classes)}
                            />
                          </Tabs>
                        </AppBar>
                      </GridItem>
                    </GridContainer>
                    <TabPanel value={this.state.tabValue} index={0} className={classes.tabPanelClass}>
                      <RiskInput
                        functionalCurrency={this.state.functionalCurrency}
                        parsedRiskRadarData={this.state.riskRadarFullData}
                        riskRadarData={this.state.riskRadarData}
                        senstivityPercentage={this.state.senstitivityPercentage}
                        isChanged={this.state.isChanged}
                        editObject={this.state.editObject}
                        clearData={this.onClickClear}
                        impactData={this.state.riskImpactData}
                        ref={(instance) => {
                          this.myRef = instance;
                        }}
                        getRiskRadarData={this.getRiskRadarData}
                        currencies={this.state.currencies}
                        getDeleteRowIcon={this.getDeleteRowIcon}
                      />
                    </TabPanel>
                    <TabPanel value={this.state.tabValue} index={1} className={classes.tabPanelClass}>
                      <RiskHorizon
                        parsedRiskRadarData={this.state.parsedRiskRadarData}
                        pastRiskRadarData={this.state.pastRiskRadarData}
                        functionalCurrency={this.state.functionalCurrency}
                        getRiskRadarData={this.getRiskRadarData}
                        isChanged={this.state.isChanged}
                        senstivityPercentage={this.state.senstitivityPercentage}
                      />
                    </TabPanel>

                    <TabPanel value={this.state.tabValue} index={2} className={classes.tabPanelClass}>
                      <RiskImpact
                        riskRadarData={this.state.riskRadarData}
                        parsedRiskRadarData={this.state.parsedRiskRadarData}
                        functionalCurrency={this.state.functionalCurrency}
                        senstivityPercentage={this.state.senstitivityPercentage}
                        updateSenstitivityPercentage={this.updateSenstitivityPercentage}
                        isChanged={this.state.isChanged}
                      />
                    </TabPanel>

                    <TabPanel value={this.state.tabValue} index={3} className={classes.tabPanelClass}>
                      <RiskAlert riskRadarData={this.state.riskRadarData} functionalCurrency={this.state.functionalCurrency} />
                    </TabPanel>
                    <TabPanel value={this.state.tabValue} index={4} className={classes.tabPanelClass}>
                      <RiskRadarReports
                        riskRadarData={this.state.riskRadarData}
                        parsedRiskRadarData={this.state.parsedRiskRadarData}
                        getRiskRadarData={this.getRiskRadarData}
                        functionalCurrency={this.state.functionalCurrency}
                        senstivityPercentage={this.state.senstitivityPercentage}
                        isChanged={this.state.isChanged}
                        currencies={this.state.currencies}
                      />
                    </TabPanel>
                  </GridItem>
                </GridContainer>
                {this.state.openRiskInputDialog && (
                  <RiskInputDialog
                    currencies={this.state.currencies}
                    toggleRiskInputDialog={this.toggleRiskInputDialog}
                    onConfirmClick={this.addUpdateCategoryDetails}
                    editObject={this.state.editObject}
                    editCategoryData={true}
                  />
                )}
                {this.state.riskRadarXeroModal && (
                  <RiskRadarXeroModal
                  showModal={this.state.riskRadarXeroModal} 
                  closeModal={this.closeRiskRadarXeroModal}
                  data={this.state.xeroInvoices}
                  getXeroInvoices={this.getXeroInvoices}
                  invoiceDataRetrieved={this.state.invoiceDataRetrieved}
                  uploadNowInvoice={this.riskRadarUploadNowInvoice}
                  uploadLaterInvoice={this.riskRadarUploadLaterInvoice}
                  />
                )}
                <NoticeModal
                  noticeModal={this.state.noticeModal}
                  noticeModalHeader={this.state.noticeModalHeader}
                  noticeModalErrMsg={this.state.noticeModalErrMsg}
                  closeModal={this.closeNoticeModal}
                />
                <ConfirmationModal
                  confirmationModal={this.state.deleteConfirmationModal}
                  confirmationModalHeader={this.state.deleteConfirmationModalHeader}
                  confirmationModalMsg={this.state.deleteConfirmationModalMsg}
                  handleNegativeButton={this.handleDeleteNegativeResponse}
                  handlePositiveButton={this.handleDeletePositiveResponse}
                  positiveButtonText="Yes"
                  negativeButtonText="No"
                />
                <ConfirmationModal
                  confirmationModal={this.state.uploadXeroConfirmationModal}
                  confirmationModalHeader={this.state.uploadXeroConfirmationModalHeader}
                  confirmationModalMsg={this.state.uploadXeroConfirmationModalMsg}
                  handleNegativeButton={this.handleUploadXeroNegativeResponse}
                  handlePositiveButton={this.handleUploadXeroPositiveResponse}
                  positiveButtonText="Yes"
                  negativeButtonText="No"
                />                
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
              </div>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    );
  }
}
RiskRadar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withRouter(withStyles(style)(RiskRadar));
