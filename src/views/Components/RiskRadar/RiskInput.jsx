import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Add from "@material-ui/icons/Add";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import { FormControl, IconButton } from "@material-ui/core";
import Table from "components/Table/Table.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import PrintIcon from "@material-ui/icons/Print";
import ReactToPrint from "react-to-print";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import moment from "moment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import { validate } from "../../../utils/Validator";
import {
  formatDate,
  parseCurrency,
  formatMoney,
  sortArray,
} from "../../../utils/Utils";
import * as xlsx from "xlsx";
import RiskRadarPrint from "./RiskRadarPrint";
import Pagination from "components/Pagination/Pagination.jsx";

import {
  cardTitle,
  roseColor,
  successColor,
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor,
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import RiskInputDialog from "./RiskInput/RiskInputDialog";
import RiskRadarFileUploadModal from "./RiskRadarFileUploadModal.jsx";
import RiskRadarModal from "./RiskRadarModal";

let RISKTYPES = {
  assets: "ASSETS",
  liabilities: "LIABILITIES",
  payables: "PAYABLES",
  receivables: "RECEIVABLES",
  forecastedRevenues: "FORECASTED_REVENUES",
  forecastedCosts: "FORECASTED_COSTS",
};
const RISKTYPES1 = {
  "ASSETS": "assets",
  "LIABILITIES": "liabilities",
  "PAYABLES": "payables",
  "RECEIVABLES": "receivables",
  "FORECASTED_REVENUES": "forecastedRevenues",
  "FORECASTED_COSTS": "forecastedCosts",
};
function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center",
  },
  exposureCard: {
    marginTop: 15,
    marginBottom: 10,
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0",
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem",
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px",
  },
  footer: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "5px 25px",
  },
  pr0: {
    paddingRight: "0px !important;",
  },
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "25px",
    height: "25px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px",
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px",
    },
  },
  iconRose: {
    color: roseColor,
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3,
  },
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3,
  },
  addIcon: {
    marginTop: 0,
    height: 35,
    width: 35,
    borderRadius: 6,
  },
  marginTop30: {
    marginTop: "30px",
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px",
    },
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white",
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "black",
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46,
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 18,
    marginRight: 5,
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999",
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
    display: "inline-block",
  },
  filledSelect: {
    // backgroundColor: 'grey',
    // color: 'white !important',
  },
  white: {
    color: "#999999",
  },
  selectDropDown: {
    paddingTop: 0,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "14px",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right",
  },
  currencyLabel: {
    float: "left",
    backgroundColor: "white",
    fontSize: 16,
    fontWeight: 400,
    color: "black",
  },
  customFormControlClasses: {
    margin: "0px",
  },
  customDateControlClasses: {
    paddingTop: 6,
  },
  boxInput: {
    border: "1px solid #757575",
    padding: 5,
  },
  tooltipCalculator: {
    padding: "10px 15px",
    minWidth: "200px",
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
    maxWidth: "400px",
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
    lineBreak: "auto",
  },
  ...customSelectStyle,
  ...regularFormsStyle,
};

const COLUMNDETAILS = {
  assets: [
    { name: "Ref ID", dataType: "string", key: "referenceId", sort: false },
    { name: "Amount", dataType: "number", key: "amount", sort: false },
    {
      name: "Expected Sale Date",
      dataType: "date",
      key: "date",
      sort: true,
    },
    {
      name: "Description",
      dataType: "string",
      key: "description",
      sort: false,
    },
    {
      name: "Type",
      dataType: "string",
      key: "notExpired",
      sort: false,
    },
    {
      name: " ",
      dataType: "string",
      key: "",
      sort: false,
    },
  ],
  liabilities: [
    { name: "Ref ID", dataType: "string", key: "referenceId", sort: false },
    { name: "Amount", dataType: "number", key: "amount", sort: false },
    {
      name: "Expected Payment Date",
      dataType: "date",
      key: "date",
      sort: true,
    },
    {
      name: "Description",
      dataType: "string",
      key: "description",
      sort: false,
    },
    {
      name: " ",
      dataType: "string",
      key: "",
      sort: false,
    },
  ],
  payables: [
    { name: "Ref ID", dataType: "string", key: "referenceId", sort: false },
    { name: "Amount", dataType: "number", key: "amount", sort: false },
    {
      name: "Date Payable",
      dataType: "date",
      key: "date",
      sort: true,
    },
    {
      name: "Description",
      dataType: "string",
      key: "description",
      sort: false,
    },
    {
      name: " ",
      dataType: "string",
      key: "",
      sort: false,
    },
  ],
  receivables: [
    { name: "Ref ID", dataType: "string", key: "referenceId", sort: false },
    { name: "Amount", dataType: "number", key: "amount", sort: false },
    {
      name: "Date Receivable",
      dataType: "date",
      key: "date",
      sort: true,
    },
    {
      name: "Description",
      dataType: "string",
      key: "description",
      sort: false,
    },
    {
      name: " ",
      dataType: "string",
      key: "",
      sort: false,
    },
  ],
  forecastedCosts: [
    { name: "Ref ID", dataType: "string", key: "referenceId", sort: false },
    { name: "Amount", dataType: "number", key: "amount", sort: false },
    {
      name: "Date Forecasted",
      dataType: "date",
      key: "date",
      sort: true,
    },
    {
      name: "Description",
      dataType: "string",
      key: "description",
      sort: false,
    },
    {
      name: " ",
      dataType: "string",
      key: "",
      sort: false,
    },
  ],
  forecastedRevenues: [
    { name: "Ref ID", dataType: "string", key: "referenceId", sort: false },
    { name: "Amount", dataType: "number", key: "amount", sort: false },
    {
      name: "Date Expected",
      dataType: "date",
      key: "date",
      sort: true,
    },
    {
      name: "Description",
      dataType: "string",
      key: "description",
      sort: false,
    },
    {
      name: " ",
      dataType: "string",
      key: "",
      sort: false,
    },
  ],
  externalHedges: [
    { name: "Deal ID", dataType: "string", key: "referenceId", sort: false },
    {
      name: "Deal Date",
      dataType: "dealDate",
      key: "date",
      sort: true,
    },
    {
      name: "Currency Bought",
      dataType: "string",
      key: "boughtCurrencyCode",
      sort: false,
    },
    {
      name: "Currency Bought Amount",
      dataType: "number",
      key: "currencyBought",
      sort: false,
    },
    {
      name: "Currency Sold",
      dataType: "string",
      key: "soldCurrencyCode",
      sort: false,
    },
    {
      name: "Currency Sold Amount",
      dataType: "number",
      key: "currencySold",
      sort: false,
    },
    {
      name: "Settlement Date",
      dataType: "settlementDate",
      key: "date",
      sort: true,
    },

    {
      name: " ",
      dataType: "string",
      key: "",
      sort: false,
    },
  ],
};

const categoryOptions = [
  { name: "Payables", value: "payables" },
  { name: "Receivables", value: "receivables" },
  { name: "Forecasted Revenues", value: "forecastedRevenues" },
  { name: "Forecasted Costs", value: "forecastedCosts" },
  { name: "Asset or Investments", value: "assets" },
  { name: "Liabilities", value: "liabilities" },
  { name: "External Hedges", value: "externalHedges" },
];

const ExportDataNonExistingHeaders = [
  // { key: "category", value: "Category" },
  { key: "referenceId", value: "Reference ID" },
  { key: "amount", value: "Amount" },
  { key: "currencycode", value: "Currency Code" },
  { key: "description", value: "Description" },
  { key: "date", value: "Date" },
  // { key: "boughtCurrencyCode", value: "Bought Currency Code" },
  // { key: "currencyBought", value: "Currency Bought Amount" },
  // { key: "soldCurrencyCode", value: "Sold Currency Code" },
  // { key: "currencySold", value: "Sold Currency Amount" },
  // { key: "dealDate", value: "Deal Date" },
  // { key: "settlementdate", value: "Settlement Date" }
];
const ExportDataExistingHeaders = [
  // { key: "category", value: "Category" },
  { key: "dealId", value: "Deal ID" },
  // { key: "amount", value: "Amount" },
  // { key: "currencycode", value: "Currency Code" },
  // { key: "description", value: "Description" },
  // { key: "date", value: "Date" },
  { key: "boughtCurrencyCode", value: "Bought Currency Code" },
  { key: "currencyBought", value: "Currency Bought Amount" },
  { key: "soldCurrencyCode", value: "Sold Currency Code" },
  { key: "currencySold", value: "Sold Currency Amount" },
  { key: "dealDate", value: "Deal Date" },
  { key: "settlementDate", value: "Settlement Date" },
];

const RISK_CATEGORY_INFO = [
  { name: "Payables", key: "payables", type: "PAYABLES" },
  { name: "Receivables", key: "receivables", type: "RECEIVABLES" },
  {
    name: "Forecasted Revenues",
    key: "forecastedRevenues",
    type: "FORECASTED_REVENUES",
  },
  {
    name: "Forecasted Costs",
    key: "forecastedCosts",
    type: "FORECASTED_COSTS",
  },
  { name: "Asset or Investments", key: "assets", type: "ASSETS" },
  { name: "Liabilities", key: "liabilities", type: "LIABILITIES" },
  { name: "External Hedges", key: "externalHedges" },
];

const initialState = {
  callInProgress: false,
  noticeModal: false,
  noticeModalHeader: "",
  noticeModalErrMsg: "",
  confirmationModal: false,
  confirmationModalHeader: "",
  confirmationModalMsg: "",
  confirmationXeroModal: false,
  confirmationMXeroodalHeader: "",
  confirmationXeroModalMsg: "",

  externalHedgesColumn: [
    "Deal ID",
    "Deal Date",
    "Currency Bought",
    "Currency Bought Amount",
    "Currency Sold",
    "Currency Sold Amount",
    "Settlement Date",
    " ",
  ],
  assetsColumn: ["Ref ID", "Amount", "Expected Sale Date", "Description", " "],
  liabilitiesColumn: [
    "Ref ID",
    "Amount",
    "Expected Payment Date",
    "Description",
    " ",
  ],

  payablesColumn: ["Ref ID", "Amount", "Date Payable", "Description", " "],
  receivablesColumn: [
    "Ref ID",
    "Amount",
    "Date Receivable",
    "Description",
    " ",
  ],
  forecastedRevenuesColumn: [
    "Ref ID",
    "Amount",
    "Date Expected",
    "Description",
    " ",
  ],
  forecastedCostsColumn: [
    "Ref ID",
    "Amount",
    "Date Forecasted",
    "Description",
    " ",
  ],
  isBlank: true,
  isChanged: false,
  externalHedges: [],
  assets: [],
  liabilities: [],
  payables: [],
  receivables: [],
  forecastedRevenues: [],
  forecastedCosts: [],
  externalHedgesDisplay: [],
  assetsDisplay: [],
  liabilitiesDisplay: [],
  payablesDisplay: [],
  receivablesDisplay: [],
  forecastedRevenuesDisplay: [],
  forecastedCostsDisplay: [],

  selectedCategory: "",
  selectedCategoryTab: "payables",
  sortByAscending: true,
  columnSortKey: "",
  columnDetails: COLUMNDETAILS["payables"],
  functionalCurrency: "",
  senstitivityPercentage: "10",
  profitAmount: "0",
  profitName: "",

  currencycode: "",
  amount: 0,
  amountState: "",
  amountPristine: false,
  amountErrorMsg: [],
  date: null,
  dateState: "",
  datePristine: false,
  dateErrorMsg: [],
  description: "",
  descriptionState: "",
  descriptionPristine: false,
  descriptionErrorMsg: [],

  boughtCurrencyCode: "",
  soldCurrencyCode: "",
  dealDate: null,
  dealDateState: "",
  dealDatePristine: false,
  dealDateErrorMsg: [],

  settlementDate: null,
  settlementDateState: "",
  settlementDatePristine: false,
  settlementDateErrorMsg: [],

  currencyBought: 0,
  currencyBoughtState: "",
  currencyBoughtPristine: false,
  currencyBoughtErrorMsg: [],

  currencySold: 0,
  currencySoldState: "",
  currencySoldPristine: false,
  currencySoldErrorMsg: [],

  id: "",
  idState: "",
  idPristine: false,
  idErrorMsg: [],
  uploadedFileName: "",
  tabValue: 0,
  selectedPageIndex: 1,
  recordsPerPage: 10,
  selectedIndicatorList: [],
  openRiskInputDialog: false,
  editObject: {},
  isOpen: false,
  OpenXeroAccount: null,

  uploadFiles: [],
  confirmationUploadRiskFile: false,
  confirmationUploadRiskFileHeader: "",
  confirmationUploadRiskFileMsg: "",

  riskRadarFileUploadModal: false,
  fileUploadInvoices: [],
  uploadFileConfirmationModal: false,
  uploadFileConfirmationModalHeader: "",
  uploadFileConfirmationModalMsg: '',
  newFileUploadList: [],
  modifiedFileUploadList: [],
  externalHedgeFileUploadList: [],
};

class RiskInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.fileInput = React.createRef();
  }

  componentDidMount = () => {
    //this.initialzeData();
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
    });
  };
  uploadFile = () => {
    this.fileInput.current.click();
  };
  fileUploadConfirmation = (e) => {
    e.preventDefault();
    if (e.target.files.length) {
      this.setState({
        uploadFiles: e.target.files,
        confirmationUploadRiskFile: true,
        confirmationUploadRiskFileHeader: "Risk Input Upload",
        confirmationUploadRiskFileMsg: "Do you want to upload New Risks from selected Excel File?"
      });
    }    
  };
  handlePositiveResponseUploadRiskFile = () => {
    this.handleNegativeResponse();
    this.fileHandler();
  };
  fileHandler = () => {
    if (this.state.uploadFiles.length) {
      let fileObj = this.state.uploadFiles[0];
      let fileName = fileObj.name;
      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx") {
        var reader = new FileReader();
        reader.onload = (e) => {
          var data = e.target.result;
          // console.log("fileHandler inside", data);

          let readedData = xlsx.read(data, { type: "binary" });
          const wsname = readedData.SheetNames[0];
          const ws = readedData.Sheets[wsname];

          /* Convert array to json*/
          const dataParse = xlsx.utils.sheet_to_json(ws, { header: 1 });

          this.vaidateExcelData(dataParse);
          // console.log("fileHandler", dataParse);
          //setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(fileObj);
      } else {
        this.setState({
          isFormInvalid: true,
          uploadedFileName: "",
        });
      }
    }
  };
  vaidateExcelData = (excelData) => {
    let riskData = [],
      externalHedgeData = [];
    for (let i = 1; i < excelData.length; i++) {
      const data = excelData[i];
      if (data.length > 4) {
        console.log("EXCEL DATA _ ", data);
        const category = this.getCategory(data[0], i);
        const date = data.length < 8 && data[5] ? this.getDate(data[5], i) : "";
        const dealDate =
          category.key === "externalHedges" && data.length > 9
            ? this.getDate(data[10], i)
            : null;
        const settlementDate =
          category.key === "externalHedges" && data.length > 10
            ? this.getDate(data[11], i)
            : null;

        if (
          category.key != "" &&
          category.key !== "externalHedges" &&
          date != null
        ) {
          riskData.push({
            riskType: category.type,
            currencyCode: data[3],
            amount: data[2],
            referenceId: data[1],
            description: data[4],
            date: date,
          });
          console.log("EXCEL DATA - ", category, riskData);
        }
        if (
          category.key != "" &&
          category.key === "externalHedges" &&
          dealDate != null &&
          settlementDate != null
        ) {
          externalHedgeData.push({
            riskType: category.type,
            referenceId: data[1],
            description: data[4],
            currencySold: data[9],
            currencyBought: data[7],
            soldCurrencyCode: data[8],
            boughtCurrencyCode: data[6],
            dealDate: dealDate,
            settlementDate: settlementDate,
            dealId: data[1],
          });
          console.log("EXCEL DATA - ", category, externalHedgeData);
        }
      }
    }
    console.log(riskData, externalHedgeData);
    if (riskData.length > 0 || externalHedgeData.length > 0) {
      // this.bulkUploadRiskData(riskData, externalHedgeData);
      this.checkDuplicates(riskData, externalHedgeData);
    }
  };
  isPayment = (riskType) => riskType === 'Payables' || riskType === 'Forecasted Revenues' || riskType === 'Asset or Investments';
  checkDuplicates = (riskData, externalHedgeData) => {
    const riskToUpload = Object.values(riskData).filter(s => s !== null);
    let isAnySameRecord = false, isAnyModifyRecord = false;
    let newList = [], modifiedList = [], repeatedList = [], fileUploadInvoices = [];
    if (externalHedgeData && externalHedgeData.length > 0) {
      externalHedgeData &&
        externalHedgeData.forEach(async (hedge, index) => {
          const type = RISK_CATEGORY_INFO.filter((x) => x.type === hedge.riskType);
          if (type.length === 0) {
            return;
          }
          let data = {
            invoiceType: 'EXTERNAL_HEDGES',
            referenceId: hedge.referenceId,
            dealId: hedge.referenceId,
            description: hedge.description,
            amount: "",
            currencyCode: "",
            date: "",
            currencyBought: hedge.currencyBought,
            boughtCurrencyCode: hedge.boughtCurrencyCode,
            currencySold: hedge.currencySold,
            soldCurrencyCode: hedge.soldCurrencyCode,
            dealDate: hedge.dealDate,
            settlementDate: hedge.settlementDate,
          };
          const filteredRisks = this.props.parsedRiskRadarData && this.props.parsedRiskRadarData.hedges.filter(r => hedge.referenceId !== "" && hedge.referenceId === r.dealId);
          if (filteredRisks && filteredRisks.length > 0) {
            isAnySameRecord = true;
            filteredRisks.forEach(fr => {
              if (fr.boughtCurrencyCode == hedge.boughtCurrencyCode && 
                fr.currencyBought == hedge.currencyBought && 
                fr.soldCurrencyCode == hedge.soldCurrencyCode && 
                fr.currencySold == hedge.currencySold && 
                fr.description == hedge.description && 
                fr.dealId == hedge.dealId) {
                  hedge = {...hedge, id: fr.id}
                  repeatedList.push(hedge);
                  data = {...data, id: fr.id, status: 'EXISTING'}
                  fileUploadInvoices.push(data);
                } else {
                  isAnyModifyRecord = true;
                  hedge = {...hedge, id: fr.id}
                  modifiedList.push(hedge);
                  data = {...data, id: fr.id, status: 'MODIFIED'}
                  fileUploadInvoices.push(data);
                }
            });
          } else {
            newList.push(hedge);
            data = {...data, status: 'NEW'}
            fileUploadInvoices.push(data);
          }
        });
    }
    if (riskToUpload && riskToUpload.length > 0) {
      riskToUpload &&
        riskToUpload.forEach(async (inv, index) => {
          const type = RISK_CATEGORY_INFO.filter((x) => x.type === inv.riskType);
          if (type.length === 0) {
            return;
          }
    
          const filteredRisks = this.props.parsedRiskRadarData && this.props.parsedRiskRadarData.risks[type[0].key].filter(r => inv.referenceId !== "" && inv.referenceId === r.referenceId);
          if (filteredRisks && filteredRisks.length > 0) {
            isAnySameRecord = true;
            filteredRisks.forEach(fr => {
              let data = {
                invoiceType: inv.riskType,
                referenceId: inv.referenceId,
                description: inv.description,
                amount: inv.amount,
                currencyCode: inv.currencyCode,
                date: inv.date,
                currencyBought: "",
                boughtCurrencyCode: "",
                currencySold: "",
                soldCurrencyCode: "",
                dealDate: "",
                settlementDate: "",
              };
              if (fr.amount == inv.amount && 
                fr.currencyCode == inv.currencyCode && 
                fr.description == inv.description && 
                fr.referenceId == inv.referenceId) {
                  inv = {...inv, id: fr.id}
                  repeatedList.push(inv);
                  data = {...data, id: fr.id, status: "EXISTING"}
                  fileUploadInvoices.push(data);
                } else {
                  isAnyModifyRecord = true;
                  inv = {...inv, id: fr.id}
                  modifiedList.push(inv);
                  data = {...data, id: fr.id, status: "MODIFIED"}
                  fileUploadInvoices.push(data);
                }
            });
          } else {
            newList.push(inv);
            let data = {
              invoiceType: inv.riskType,
              referenceId: inv.referenceId,
              description: inv.description,
              amount: inv.amount,
              currencyCode: inv.currencyCode,
              date: inv.date,
              currencyBought: "",
              boughtCurrencyCode: "",
              currencySold: "",
              soldCurrencyCode: "",
              dealDate: "",
              settlementDate: "", 
              status: "NEW"
            };
            fileUploadInvoices.push(data);
          }
        });
        console.log(fileUploadInvoices);
        this.setState({
          riskRadarFileUploadModal: true,
          fileUploadInvoices: fileUploadInvoices,
          newFileUploadList: newList,
          modifiedFileUploadList: modifiedList,
          externalHedgeFileUploadList: externalHedgeData
        });
    }
  };
  closeRiskRadarFileUploadModal = () => {
    this.setState({
      riskRadarFileUploadModal: false,
      newFileUploadList: [],
      modifiedFileUploadList: [],
      externalHedgeFileUploadList: []
    });
  };
  uploadNowInput = (selectedRisks) => {
    let risks = Object.values(selectedRisks).filter(f => f !== null);
    console.log(risks);
    const newRisks = risks && risks.filter((r) => r.status === "NEW" && r.invoiceType !== 'EXTERNAL_HEDGES');
    const modifiedRisks = risks && risks.filter((r) => r.status === "MODIFIED" && r.invoiceType !== 'EXTERNAL_HEDGES');
    const hedgesList = risks && risks.filter((r) => r.status === "NEW" && r.invoiceType === 'EXTERNAL_HEDGES');
    console.log(newRisks, modifiedRisks, hedgesList);
    this.bulkUploadRiskData(newRisks, modifiedRisks, hedgesList);
    this.closeRiskRadarFileUploadModal();
  };
  bulkUploadRiskData = async (riskData, modifiedRiskData, externalHedgeData) => {
    // console.log(riskData, modifiedRiskData, externalHedgeData);
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_RADAR_ADD_BULK_RISKS,
      data: riskData.map(r => {
        return {
          amount: r.amount,
          currencyCode: r.currencyCode,
          date: new Date(r.date),
          description: r.description,
          referenceId: r.referenceId,
          riskType: r.invoiceType,
        }
      }),
      authToken: sessionStorage.getItem("token"),
    });
    if (modifiedRiskData.length === 0 && externalHedgeData.length === 0) {
      this.setState({ callInProgress: false });
    }
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      this.setState({
        noticeModal: true,  
        noticeModalHeader: "Error",
        noticeModalErrMsg: res.data.userDesc,
      });
      return;
    } else {
      if (modifiedRiskData.length > 0) {
        this.bulkUploadModifiedRisks(modifiedRiskData);
      } else {
        if (externalHedgeData.length > 0) {
          this.bulkUploadExternalHedgeData(externalHedgeData);
        } else {
          this.props.getRiskRadarData(this.props.functionalCurrency, 0, true);
        }
      }
    }
  };
  bulkUploadModifiedRisks = async (modifiedRiskData) => {
    modifiedRiskData &&
        modifiedRiskData.forEach(async (inv, index) => {
          if (inv && inv.invoiceType) {
            await this.addUpdateCategoryDetails(
              RISKTYPES1[inv.invoiceType],
              inv.referenceId,
              inv.amount,
              inv.currencyCode,
              inv.description,
              inv.date,
              "",
              "",
              "",
              "",
              "",
              "",
              inv.id ? inv.id : "",
              inv.id ? true : false,
              false
            );
          }
        });
  };
  bulkUploadExternalHedgeData = async (externalHedgeData) => {
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_RADAR_ADD_BULK_HEDGES,
      data: externalHedgeData,
      authToken: sessionStorage.getItem("token"),
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: res.data.userDesc,
      });
      return;
    } else {
      this.props.getRiskRadarData(this.props.functionalCurrency, 0, true);
    }
  };
  getCategory = (name, rowIndex) => {
    let obj = RISK_CATEGORY_INFO.filter((x) => x.name === name);
    if (obj.length > 0) {
      return obj[0];
    } else {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg:
          "Category in row " + rowIndex + " cell A is not valid",
      });
      return { key: "" };
    }
  };
  ExcelDateToJSDate = (serial) => {
    var utc_days = Math.floor(serial - 25567.5);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );

    // const daysIn4Years = 1461;
    // const daysIn70years = Math.round(25567.5 + 1); // +1 because of the leap-year bug
    // const daysFrom1900 = serial + (daysIn4Years + 1);
    // const daysFrom1970 = daysFrom1900 - daysIn70years;
    // const secondsFrom1970 = daysFrom1970 * (3600 * 24);
    // const utc = new Date(secondsFrom1970 * 1000);
    // return !isNaN(utc) ? utc : null;
  };
  getDate = (date, rowIndex) => {
    // console.log("getdate", date.toString());

    // console.log("getdate", moment("22/10/2022", "DD/MM/YYYY", true).isValid());
    // console.log("getdate", formatDate("22/10/2022"));
    // console.log("getdate", new Date("22/10/2022"));

    // var responseDate = moment(new Date(date), "DD/MM/YYYY", true);
    var responseDate = this.ExcelDateToJSDate(date); // new Date(date);
    // console.log("getdate - ", responseDate, formatDate(responseDate));
    if (!moment(responseDate).isValid()) {
      // if (!moment(date, "DD/MM/YYYY").isValid()) {
      // console.log('DATE - ', date);
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg:
          "Date in row " +
          rowIndex +
          " is not valid. Please enter date in DD/MM/YYYY format.",
      });
      return null;
    } else {
      return responseDate;
    }
  };
  initialzeData = () => {
    if (this.state.functionalCurrency === "") {
      this.getBaseCurrency();
    } else {
      this.getCurrencies(this.state.functionalCurrency);
    }
  };
  today = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  static getDerivedStateFromProps(props, state) {
    // console.log("getDerivedStateFromProps");
    if (props.isChanged !== state.isChanged || state.isBlank) {
      // console.log(props.inputData);
      let editRow = {};

      let parsedRiskRadarData = {};
      if (props.parsedRiskRadarData === null) {
        parsedRiskRadarData = { ...initialState };
      } else {
        parsedRiskRadarData = { ...props.parsedRiskRadarData.risks };
      }
      // if (props.isEditFlag) {
      editRow = { ...props.editObject };
      // }
      const today = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      return {
        ...parsedRiskRadarData,
        ...editRow,
        isBlank: false,
        isChanged: props.isChanged,

        columnSortKey: "",
        columnDetails: COLUMNDETAILS[state.selectedCategoryTab],
        selectedPageIndex: 1,
        recordsPerPage: 10,
        selectedIndicatorList: parsedRiskRadarData[
          state.selectedCategoryTab + "Display"
        ]
          .slice(0, state.recordsPerPage)
          .map((s) => {
            if (state.selectedCategoryTab === "externalHedges") {
              if (new Date(s[7]) < today(new Date())) {
                return {
                  data: s,
                  color: "gray",
                };
              } else return s;
            } else {
              if (new Date(s[3]) < today(new Date())) {
                return {
                  data: s,
                  color: "gray",
                };
              } else return s;
            }
          }),
      };
    }
    return null;
  }

  getBaseCurrency = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem("token"),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      this.setState(
        {
          functionalCurrency: res.data.baseCurrency,
          functionalCurrencyState: "success",
        },
        () => {
          this.getCurrencies(res.data.baseCurrency);
        }
      );
    }
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
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };
  onChange = (stateArr, index, name) => (event) => {
    // console.log("onchange", stateArr);
    // console.log("onchange", index);

    // console.log("onchange", event.target.name);

    let arr = this.state[stateArr];
    if (index != null) {
      arr[index][name] = event.target.value;
      // console.log("onchange314", arr);
    } else {
      if (stateArr == "profit") {
        // if(event.target.value=='other'){
        //   arr.amount=''
        // }else{
        //   arr.amount=event.target.value
        // }
        arr[name] = event.target.value;
      } else {
        arr = event.target.value;
      }
    }

    this.setState({ [stateArr]: arr }, () => {
      // console.log(stateArr);
      // console.log(arr);
      // console.log(this.state.senstitivityPercentage);
    });
  };
  isValidateSensitivityData = () => {
    if (this.state.functionalCurrencyState === "success") {
      // if (this.state.profitName === "Other") {
      //   if (this.state.profitOtherNameState === "success") {
      //     return true;
      //   } else {
      //     if (this.state.profitOtherNameState !== "success") {
      //       if (this.state.profitOtherName === "") {
      //         this.state.profitOtherNameErrorMsg.push(
      //           this.error["profitOtherNameErrorMsg"].required
      //         );
      //       }
      //       this.setState({ profitOtherNameState: "error" });
      //     }
      //     return false;
      //   }
      // }
      // if (this.state.senstitivitySelected === "specify") {
      //   if (this.state.senstitivityPercentageState === "success") {
      //     return true;
      //   } else {
      //     if (this.state.senstitivityPercentageState !== "success") {
      //       if (this.state.senstitivityPercentage === "") {
      //         this.state.senstitivityPercentageErrorMsg.push(
      //           this.error["senstitivityPercentageErrorMsg"].required
      //         );
      //       }
      //       this.setState({ senstitivityPercentageState: "error" });
      //     }
      //     return false;
      //   }
      // }
      return true;
    } else {
      // if (this.state.hedgingPercentageState !== "success") {
      //   if (this.state.hedgingPercentage === "") {
      //     this.state.hedgingPercentageErrorMsg.push(
      //       this.error["hedgingPercentageErrorMsg"].required
      //     );

      //   }
      //   this.setState({ hedgingPercentageState: "error" });
      // }
      // if (this.state.senstitivitySelectedState !== "success") {
      //   this.setState({ senstitivitySelectedState: "error" });
      // }
      if (this.state.functionalCurrencyState !== "success") {
        if (this.state.functionalCurrency === "") {
          this.state.functionalCurrencyErrorMsg.push(
            this.error["functionalCurrencyErrorMsg"].required
          );
        }
        this.setState({ functionalCurrencyState: "error" });
      }
      // if (this.state.profitNameState !== "success") {
      //   this.setState({ profitNameState: "error" });
      // }
      // if (this.state.profitAmountState !== "success") {
      //   if (this.state.profitAmount === "") {
      //     this.state.profitAmountErrorMsg.push(
      //       this.error["profitAmountErrorMsg"].required
      //     );
      //   }
      //   this.setState({ profitAmountState: "error" });
      // }
    }
    return false;
  };
  onClickColumnHeader = (columnDetails, index) => {
    let arr = sortArray(
      this.state[this.state.selectedCategoryTab],
      columnDetails.key,
      !this.state.sortByAscending,
      columnDetails.dataType
    );

    this.parseDataAfterSorting(
      arr,
      !this.state.sortByAscending,
      columnDetails.name,
      this.state.selectedCategoryTab
    );
  };
  parseDataAfterSorting = (
    data,
    sortByAscending,
    columnKey,
    selectedCategoryTab
  ) => {
    let displayArr = [];
    if (selectedCategoryTab !== "externalHedges") {
      data.forEach((risk, index) => {
        let tableObj = [
          index,
          risk.referenceId,
          formatMoney(risk.amount) + " " + risk.currencyCode,
          formatDate(risk.dueDate),
          risk.description,
          this.props.getDeleteRowIcon(selectedCategoryTab, index, risk),
        ];
        displayArr.push(tableObj);
      });
    } else {
      data.forEach((deal, index) => {
        let tableObj = [
          index,
          deal.dealId,
          formatDate(deal.dealDate),
          deal.boughtCurrencyCode,
          formatMoney(deal.currencyBought),
          deal.soldCurrencyCode,
          formatMoney(deal.currencySold),
          formatDate(deal.settlementDate),
          this.props.getDeleteRowIcon("externalHedges", index, deal),
        ];
        displayArr.push(tableObj);
      });
    }

    this.setState({
      sortByAscending: sortByAscending,
      columnSortKey: columnKey,
      [selectedCategoryTab + "Display"]: displayArr,
      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: displayArr.slice(0, 10),
    });
  };
  toggleRiskInputDialog = (action) => {
    this.setState({
      openRiskInputDialog: action,
    });
  };
  onAddClick = () => {
    this.setState({
      openRiskInputDialog: true,
      editCategoryData: false,
    });
  };
  handleNegativeResponse = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      confirmationXeroModal: false,
      confirmationXeroModalHeader: "",
      confirmationXeroModalMsg: "",
      confirmationUploadRiskFile: false,
      confirmationUploadRiskFileHeader: "",
      confirmationUploadRiskFileMsg: "",
      uploadFileConfirmationModal: false,
      uploadFileConfirmationModalHeader: '',
      uploadFileConfirmationModalMsg: '',
      newFileUploadList: [],
      modifiedFileUploadList: []
    });
  };
  handlePositiveResponse = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      confirmationXeroModal: false,
      confirmationXeroModalHeader: "",
      confirmationXeroModalMsg: "",
    });
  };
  handlePositiveResponseXero = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      confirmationXeroModal: false,
      confirmationXeroModalHeader: "",
      confirmationXeroModalMsg: "",
    });
    this.connectXeroAccount();
  };
  openXeroConfimationModal = () => {
    this.setState({
      confirmationXeroModal: true,
      confirmationXeroModalHeader: "Xero Account",
      confirmationXeroModalMsg: "You will be redirected to Xero account page to login and get your data. Do you want to continue?",
    });
  };
  onClickEdit = (editObject) => {
    this.setState({
      editObject: editObject,
      openRiskInputDialog: true,
      editCategoryData: true,
    });
  };
  addUpdateCategoryDetails = (
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
    notExpired,
  ) => {
    console.log("calladdupdateapi", selectedCategory, notExpired);
    if (selectedCategory !== "externalHedges") {
      let param = {
        riskType: RISKTYPES[selectedCategory],
        currencyCode: currencyCode,
        amount: parseCurrency(amount),
        referenceId: displayId,
        description: description,
        notExpired: selectedCategory != "assets" ? false : notExpired,
        date: date,
      };
      if (isEdit) {
        param = { ...param, id: id };
      }
      this.callAddUpdateAPI(
        endpoint.RISK_RADAR_UPDATE_BULK_RISKS,
        param,
        selectedCategory
      );
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
      this.callAddUpdateAPI(
        endpoint.RISK_RADAR_UPDATE_BULK_HEDGES,
        param,
        selectedCategory
      );
    }
  };
  callAddUpdateAPI = async (url, param, selectedCategory) => {
    // console.log("calladdupdateapi", selectedCategory);
    // console.log("calladdupdateapi", url);
    // console.log("calladdupdateapi", param);

    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: url,
      data: param,
      authToken: sessionStorage.getItem("token"),
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: res.data.userDesc,
      });
      return;
    } else {
      this.setState({
        selectedCategoryTab: selectedCategory,
        openRiskInputDialog: false,
        columnSortKey: "",
        columnDetails: COLUMNDETAILS[selectedCategory],
      });
      this.props.getRiskRadarData(this.props.functionalCurrency, 0, true);
    }
  };
  getExistingHedgeObject = () => {
    let externalHedges = [];
    this.state.externalHedges.forEach((x, index) => {
      externalHedges = [
        ...externalHedges,
        {
          id: index,
          currencycode: "",
          amount: 0,
          dealDetails: [{ ...x }],
        },
      ];
    });
    return externalHedges;
  };
  onChangeSelect = (e, name, text) => {
    this.setState(validate(e.target.value, name, this.state, [], this.error));

    // console.log(e.target.value);

    // console.log(name);
    // console.log(text);
    // let obj = this.state[name];
    // let otherState = {};

    // if (name == "profit") {
    //   if (e.target.value == "Other") {
    //     obj.amount = "";
    //     otherState = { ...otherState, selectedProfit: e.target.value };
    //   } else {
    //     obj.amount = e.target.value;
    //     otherState = { ...otherState, selectedProfit: e.target.value };
    //   }
    //   obj.name = text;
    // }
    // if(name=='profit'){
    //   if(e.target.value=='other'){
    //     obj.amount=''
    //     otherState={...otherState,showProfitOther:true}
    //     }else{
    //       obj.amount=e.target.value
    //       otherState={...otherState,showProfitOther:false}
    //     }
    //     obj.name=text
    //   }
    // if (name == "senstitivitySelected") {
    //   obj = e.target.value;
    //   if (e.target.value == "specify") {
    //     otherState = { ...otherState, senstitivityPercentage: "" };
    //   } else {
    //     otherState = { ...otherState, senstitivityPercentage: e.target.value };
    //   }
    // }
    // this.setState(
    //   {
    //     [name]: obj,
    //     ...otherState
    //   },
    //   () => {
    //     console.log(this.state[name]);
    //     console.log(this.state.senstitivityPercentage);
    //   }
    // );
  };
  onClickClear = () => {
    this.props.clearData();
  };
  onClickExportData = () => {
    let wb = xlsx.utils.book_new();
    let parsedRiskRadarData = { ...this.props.parsedRiskRadarData.risks };
    let arr = [];
    wb.SheetNames.push("Risk Radar Data");
    RISK_CATEGORY_INFO.forEach((x, index) => {
      //apiData.existingAssets.riskRadarCategory.currencyDetails
      if (x.value !== "externalHedges" && parsedRiskRadarData[x.key]) {
        let currencyDetails = parsedRiskRadarData[x.key];
        if (currencyDetails.length > 0) {
          currencyDetails.forEach((currencyDetail, idx) => {
            let obj = {};
            obj["Category"] = x.name;
            ExportDataNonExistingHeaders.forEach((column) => {
              obj[column.value] = currencyDetail[column.key];
            });
            arr.push(obj);
          });
        }
      }
    });
    if (
      parsedRiskRadarData.externalHedges &&
      parsedRiskRadarData.externalHedges.length > 0
    ) {
      parsedRiskRadarData.externalHedges.forEach((currencyDetail) => {
        let obj = {};
        obj["Category"] = "External Hedges";

        ExportDataExistingHeaders.forEach((column) => {
          obj[column.value] = currencyDetail[column.key];
        });
        arr.push(obj);
      });
    }

    let ws = xlsx.utils.json_to_sheet(arr);
    wb.Sheets["Risk Radar Data"] = ws;
    xlsx.writeFile(wb, "Risk_Radar_Data.xlsx");
  };
  getPageDetails = () => {
    let DataCount = Math.ceil(
      this.state[this.state.selectedCategoryTab + "Display"].length /
        this.state.recordsPerPage
    );
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
    let pageCount = Math.ceil(
      this.state[this.state.selectedCategoryTab + "Display"].length /
        this.state.recordsPerPage
    );
    switch (event.target.innerText) {
      case "FIRST":
        pageIndex = 1;
        break;
      case "PREVIOUS":
        pageIndex = this.state.selectedPageIndex - 1;
        break;
      case "LAST":
        pageIndex = pageCount;
        break;
      case "NEXT":
        pageIndex = this.state.selectedPageIndex + 1;
        break;
      default:
        pageIndex = parseInt(event.target.innerText);
        break;
    }
    if (pageIndex < 1) pageIndex = 1;
    else if (pageIndex > pageCount) pageIndex = pageCount;

    let selectedList = this.state[this.state.selectedCategoryTab + "Display"]
      .slice(
        (pageIndex - 1) * this.state.recordsPerPage,
        pageIndex * this.state.recordsPerPage
      )
      .map((s) => {
        if (this.state.selectedCategoryTab === "externalHedges") {
          if (new Date(s[7]) < this.today(new Date())) {
            return {
              data: s,
              color: "gray",
            };
          } else return s;
        } else {
          if (new Date(s[3]) < this.today(new Date())) {
            return {
              data: s,
              color: "gray",
            };
          } else return s;
        }
      });
    this.setState({
      selectedPageIndex: pageIndex,
      selectedIndicatorList: selectedList,
    });
  };
  handleClickSelectCategory = (selectedCategory) => {
    // let displayData=[]
    // this.state.apiData&&this.state.apiData[selectedCategory].forEach((x,index)=>{
    //   let arr=[index, CATEGORYKEY[selectedCategory],x.currencycode+' '+formatMoney(x.amount), 'Date '+formatDate(x.date)]
    //   displayData.push(arr)

    //   x.dealDetails.map((y,idx)=>{
    //     let hedges=[index+idx+1,'Hedge','Sell '+y.soldCurrencyCode+' '+formatMoney(y.currencySold)+' Buy '+y.boughtCurrencyCode+' '+formatMoney(y.currencyBought),'Settlement Date '+formatDate(y.settlementDate)]
    //     displayData.push(hedges)
    //   })

    // })
    // console.log('handleClickSelectCategory',displayData)
    let selectedIndicatorList = this.state[selectedCategory + "Display"]
      .slice(0, this.state.recordsPerPage)
      .map((s) => {
        if (this.state.selectedCategoryTab === "externalHedges") {
          if (new Date(s[7]) < this.today(new Date())) {
            return {
              data: s,
              color: "gray",
            };
          } else return s;
        } else {
          if (new Date(s[3]) < this.today(new Date())) {
            return {
              data: s,
              color: "gray",
            };
          } else return s;
        }
      });
    this.setState({
      selectedCategoryTab: selectedCategory,
      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: selectedIndicatorList,
      columnSortKey: "",
      columnDetails: COLUMNDETAILS[selectedCategory],
      // displayData:displayData
    });
  };
  getCategoryTabs = () => {
    const { classes, parsedRiskRadarData } = this.props;

    return RISK_CATEGORY_INFO.map((obj, index) => {
      // if (
      //   parsedRiskRadarData &&
      //   parsedRiskRadarData.risks &&
      //   parsedRiskRadarData.risks[obj.key] &&
      //   parsedRiskRadarData.risks[obj.key].length > 0
      // ) {
      return this.state.selectedCategoryTab !== obj.key ? (
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            marginRight: 25,
            cursor: "pointer",
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
            marginRight: 20,
          }}
          size="sm"
          className={classes.marginRight}
        >
          {obj.name}
        </Button>
      );
      // } else {
      //   return null;
      // }
    });
  };

  openModal = () => this.setState({ isOpen: true });
  closeXeroModal = () => this.setState({ isOpen: false });
  handleIconClick = event => {
    this.setState({
      OpenXeroAccount: event.currentTarget
    });
  };
  handleMenuClose = () => {
    this.setState({
      OpenXeroAccount: null
    });
  };

  connectXeroAccount = async () => {
    const URL = endpoint.XERO_CONNECT + window.location.origin + "/xero-oauth";
    // const URL = endpoint.XERO_CONNECT + "http://localhost:3000/xero-oauth";
    // alert(URL);

    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url: URL,
      authToken: sessionStorage.getItem("token"),
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc,
        });
      }
    } else {
      console.log(res.data);
      window.location.href = res.data.redirect_uri;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <form>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card className={cx(classes.exposureCard)}>
                <CardBody>
                  <GridContainer>
                    <GridItem
                      xs={4}
                      sm={4}
                      md={4}
                      lg={4}
                      style={{
                        marginBottom: 20,
                        // textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      {"Functional Currency: "} {this.props.functionalCurrency}
                    </GridItem>
                    <GridItem
                      xs={4}
                      sm={4}
                      md={4}
                      lg={4}
                      style={{
                        marginBottom: 20,
                        textAlign: "center",
                        alignSelf: "center",
                      }}
                    >
                      Risk Assessment
                    </GridItem>
               
                    <GridItem
                      xs={4}
                      sm={4}
                      md={4}
                      lg={4}
                      style={{ marginBottom: 20, textAlign: "right" }}
                    >
                      <GridContainer>
                        <GridItem xs={2} sm={2} md={2} lg={2} />
                        <GridItem xs={1} sm={1} md={1} lg={1}>
                          <IconButton
                            aria-label="add"
                            // onClick={() => this.connectXeroAccount()}
                            // onClick={this.openModal}
                            // onClick={() => this.openXeroConfimationModal()}
                            onClick={(e) => this.handleIconClick(e)}
                            style={{ color: "#53ac57" }}
                          >
                            <Tooltip
                              id="tooltip-xero"
                              title="Click here to import data from your accounting software"
                              placement="top"
                              classes={{ tooltip: classes.tooltipCalculator }}
                            >
                              <AccountBalanceIcon />
                            </Tooltip>
                          </IconButton>
                          <Menu
                            id="report-menu"
                            elevation={0}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                            MenuListProps={{
                              style: {
                                border: "1px solid #d3d4d5",
                                borderRadius: "3px",
                                backgroundColor: "#51ac56",
                                color: "#FFFFFF",
                                boxShadow:
                                  "0 2px 5px 0 rgba(' + hexToRgb(blackColor) + ', 0.26)",
                              },
                            }}
                            anchorEl={this.state.OpenXeroAccount}
                            keepMounted
                            open={Boolean(this.state.OpenXeroAccount)}
                            onClose={this.handleMenuClose}
                          >
                            <MenuItem onClick={() => this.openXeroConfimationModal()}>
                              {"Download from Xero Account"}
                            </MenuItem>
                          </Menu>
                        </GridItem>
                        {this.state.isOpen
                         && (
                          <RiskRadarModal
                            showModal={this.state.isOpen}
                            closeModal={this.closeXeroModal}
                          />
                        )}
                  
                        <GridItem xs={1} sm={1} md={1} lg={1}>
                          <IconButton
                            aria-label="add"
                            onClick={() => this.onAddClick()}
                            style={{ color: "#53ac57" }}
                          >
                            <Tooltip
                              id="tooltip-totalSales"
                              title="You can input any risk form the pull-down menu"
                              placement="top"
                              classes={{ tooltip: classes.tooltipCalculator }}
                            >
                              <Add />
                            </Tooltip>
                          </IconButton>
                        </GridItem>
                        <GridItem xs={1} sm={1} md={1} lg={1}>
                          <IconButton
                            aria-label="upload report"
                            onClick={() => this.uploadFile()}
                            style={{ color: "#53ac57" }}
                          >
                            <Tooltip
                              id="tooltip-totalSales"
                              title="Please refer sample template. You can use this template to upload many or all items in a risk category or all risk categories together."
                              placement="top"
                              classes={{
                                tooltip: classes.tooltipCalculator,
                              }}
                            >
                              <CloudUploadIcon />
                            </Tooltip>
                            {/* <CSVLink
                                  data={this.state.downloadReportData}
                                  filename={'CRA_' + formatDate(Date.now()) + '.csv'}
                                  className='hidden'
                                  ref={this.csvDownloadLink}
                                  target='_blank'
                                /> */}
                            <input
                              type="file"
                              hidden
                              onChange={this.fileUploadConfirmation}
                              ref={this.fileInput}
                              onClick={(event) => {
                                event.target.value = null;
                              }}
                              style={{ padding: "10px" }}
                            />
                          </IconButton>
                        </GridItem>
                        <GridItem xs={1} sm={1} md={1} lg={1}>
                          <IconButton
                            aria-label="download report"
                            onClick={() => this.onClickExportData()}
                            style={{ color: "#53ac57" }}
                          >
                            <Tooltip
                              id="tooltip-totalSales"
                              title="You can download here all risk items in all categories you have input."
                              placement="top"
                              classes={{ tooltip: classes.tooltipCalculator }}
                            >
                              <CloudDownloadIcon />
                            </Tooltip>
                          </IconButton>
                        </GridItem>
                        <GridItem xs={1} sm={1} md={1} lg={1}>
                          <IconButton
                            aria-label="download report"
                            //onClick={() => this.uploadFile()}
                            style={{ color: "#53ac57" }}
                          >
                            <ReactToPrint
                              trigger={() => (
                                <Tooltip
                                  id="tooltip-totalSales"
                                  title="You can Print all Risk Radar data and reports by clicking this."
                                  placement="top"
                                  classes={{
                                    tooltip: classes.tooltipCalculator,
                                  }}
                                >
                                  <PrintIcon />
                                </Tooltip>
                              )}
                              content={() => this.componentRef}
                            />
                          </IconButton>
                        </GridItem>
                        <GridItem
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          style={{
                            textAlign: "right",
                            alignSelf: "center",
                          }}
                        > 
                          <a href={window.location.origin + "/" + "sample_file.xlsx"} download>
                            Sample Template
                          </a>
                          <Tooltip
                            id="tooltip-totalSales"
                            title="You can use this template to fill risk input and then upload."
                            placement="top"
                            classes={{ tooltip: classes.tooltipCalculator }}
                          >
                            <InfoOutlined className={classes.info} />
                          </Tooltip>
                        </GridItem>
                      </GridContainer>
                 
                    </GridItem>
                    <GridItem xs={3} sm={3} md={3} lg={3} />
                    <GridItem
                      xs={6}
                      sm={6}
                      md={6}
                      lg={6}
                      style={{
                        textAlign: "left",
                        alignSelf: "center",
                      }}
                    > 
                      Please Input Risks by any of these methods
                      <div><span>1. Click <span style={{ color: "#53ac57", paddingLeft: "5px", paddingRight:"5px" }}> <Add /></span>  to manual input</span></div>
                      <div><span>2. Click <span style={{ color: "#53ac57", paddingLeft: "5px", paddingRight:"5px" }}><CloudUploadIcon /></span>  to  upload excel file</span></div>
                      <div><span>3. Click <span style={{ color: "#53ac57", paddingLeft: "5px", paddingRight:"5px" }}> <AccountBalanceIcon /></span>  to upload your Risk inputs from accounting software</span></div>
                    </GridItem>
                    <GridItem xs={3} sm={3} md={3} lg={3} />
                  </GridContainer>
                  <hr />
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer className={classes.boxInput}>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ marginBottom: 20, textAlign: "center" }}
                      >
                        Category Details
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer style={{ marginBottom: 30 }}>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            style={{ alignSelf: "center" }}
                          >
                            {this.getCategoryTabs()}
                          </GridItem>
                          {this.state.selectedCategoryTab && (
                            <GridItem
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              style={{ textAlign: "center" }}
                            >
                              <Table
                                hover
                                tableHeaderColor="gray"
                                tableHead={
                                  this.state[
                                    this.state.selectedCategoryTab + "Column"
                                  ]
                                }
                                tableData={this.state.selectedIndicatorList}
                                customCellClasses={[
                                  classes.center,
                                  classes.right,
                                  classes.right,
                                ]}
                                customClassesForCells={[0, 4, 5]}
                                customHeadCellClasses={[
                                  classes.center,
                                  classes.right,
                                  classes.right,
                                ]}
                                customHeadClassesForCells={[0, 4, 5]}
                                onClickColumnHeader={this.onClickColumnHeader}
                                columnsDetails={this.state.columnDetails}
                                columnSortKey={this.state.columnSortKey}
                                sortByAscending={this.state.sortByAscending}
                              />
                              {/* <div style={{ height: 0.5, backgroundColor: '#000'}} />  
                              <Table
                                hover
                                tableHeaderColor="gray"
                                tableHead={[]}
                                tableData={this.state.selectedIndicatorList}
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
                                onClickColumnHeader={this.onClickColumnHeader}
                                columnsDetails={this.state.columnDetails}
                                columnSortKey={this.state.columnSortKey}
                                sortByAscending={this.state.sortByAscending}
                              /> */}
                              <Pagination
                                pages={this.getPageDetails()}
                                currentPage={this.state.selectedPageIndex}
                                color="info"
                                onClick={this.getPageData}
                              />
                            </GridItem>
                          )}
                        </GridContainer>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <>
                            <GridContainer>
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                style={{
                                  textAlign: "center",
                                  alignSelf: "center",
                                }}
                              >
                                <Button
                                  size="sm"
                                  style={{
                                    backgroundColor: grayColor[1],
                                    width: 150,
                                    marginTop: 20,
                                  }}
                                  onClick={() => {
                                    this.onClickClear();
                                  }}
                                >
                                  <h5>CLEAR</h5>
                                </Button>
                              </GridItem>
                            </GridContainer>
                          </>
                        </GridItem>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <GridContainer
                          style={{
                            visibility: "hidden",
                            height: 0,
                            overflow: "hidden",
                          }}
                        >
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <RiskRadarPrint
                              parsedRiskRadarData={
                                this.props.parsedRiskRadarData
                              }
                              riskRadarData={this.props.riskRadarData}
                              functionalCurrency={this.props.functionalCurrency}
                              senstivityPercentage={
                                this.props.senstitivityPercentage
                              }
                              isChanged={this.props.isChanged}
                              ref={(el) => (this.componentRef = el)}
                              externalHedgesDisplay={
                                this.state.externalHedgesDisplay
                              }
                              existingAssetsDisplay={
                                this.state.existingAssetsDisplay
                              }
                              existingLiabilitiesDisplay={
                                this.state.existingLiabilitiesDisplay
                              }
                              payablesDisplay={this.state.payablesDisplay}
                              receivablesDisplay={this.state.receivablesDisplay}
                              forecastedRevenuesDisplay={
                                this.state.forecastedRevenuesDisplay
                              }
                              forecastedCostsDisplay={
                                this.state.forecastedCostsDisplay
                              }
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
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
          {this.state.confirmationXeroModal && (
            <ConfirmationModal
              confirmationModal={this.state.confirmationXeroModal}
              confirmationModalHeader={this.state.confirmationXeroModalHeader}
              confirmationModalMsg={this.state.confirmationXeroModalMsg}
              handleNegativeButton={this.handleNegativeResponse}
              handlePositiveButton={this.handlePositiveResponseXero}
              positiveButtonText="Yes"
              negativeButtonText="No"
            />
          )}
          {this.state.confirmationUploadRiskFile && (
            <ConfirmationModal
              confirmationModal={this.state.confirmationUploadRiskFile}
              confirmationModalHeader={this.state.confirmationUploadRiskFileHeader}
              confirmationModalMsg={this.state.confirmationUploadRiskFileMsg}
              handleNegativeButton={this.handleNegativeResponse}
              handlePositiveButton={this.handlePositiveResponseUploadRiskFile}
              positiveButtonText="Yes"
              negativeButtonText="No"
            />
          )}
          {this.state.uploadFileConfirmationModal && 
            <ConfirmationModal
              confirmationModal={this.state.uploadFileConfirmationModal}
              confirmationModalHeader={this.state.uploadFileConfirmationModalHeader}
              confirmationModalMsg={this.state.uploadFileConfirmationModalMsg}
              handleNegativeButton={this.handleNegativeResponse}
              handlePositiveButton={this.handleUploadFilePositiveResponse}
              positiveButtonText="Yes"
              negativeButtonText="No"
            />
          }
          {this.state.openRiskInputDialog && (
            <RiskInputDialog
              currencies={this.props.currencies}
              toggleRiskInputDialog={this.toggleRiskInputDialog}
              onConfirmClick={this.addUpdateCategoryDetails}
              editObject={this.state.editObject}
              editCategoryData={this.state.editCategoryData}
            />
          )}
          {this.state.riskRadarFileUploadModal && (
            <RiskRadarFileUploadModal
              showModal={this.state.riskRadarFileUploadModal} 
              closeModal={this.closeRiskRadarFileUploadModal}
              data={this.state.fileUploadInvoices}
              uploadNowInput={this.uploadNowInput}
            />
          )}
          {this.state.callInProgress && (
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              open={this.state.callInProgress}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="notice-modal-slide-title"
              aria-describedby="notice-modal-slide-description"
            >
              <DialogTitle
                id="waiting-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
              >
                <h4 className={classes.modalTitle}>{"Processing..."}</h4>
              </DialogTitle>
              <DialogContent
                id="waiting-modal-slide-description"
                className={classes.modalBody}
                style={{ textAlign: "center" }}
              >
                <CircularProgress />
              </DialogContent>
            </Dialog>
          )}{" "}
        </form>
      </>
    );
  }
}

RiskInput.propTypes = {
  classes: PropTypes.object.isRequired,
  parsedRiskRadarData: PropTypes.object,
  inputData: PropTypes.object,
  isChanged: PropTypes.bool,
  editObject: PropTypes.object,
  clearData: PropTypes.func,
  currencies: PropTypes.object,
};

export default withRouter(withStyles(style)(RiskInput));
