import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Slide from "@material-ui/core/Slide";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";

import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Search from "@material-ui/icons/Search";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddIcon from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";

import DashboardIndicators from "components/StatusCard/DashboardIndicators.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
import CustomerKYCStatus from "views/Components/CustomerKYCStatus.jsx";
import CustomerRegistrationDialog from "views/Components/CustomerRegistrationDialog.jsx";
import ChangeStatusDialog from "views/Components/ChangeStatusDialog.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import EnquiryDialog from "views/Components/EnquiryDialog.jsx";
import IdCheckDetails from "views/Components/IdCheckDetails.jsx";
import IdCheckPerform from "views/Components/IdCheckPerform.jsx";
import CompanyKYCSanctions from "views/Components/CompanyKYCSanctions.jsx";
import AddDirectors from "../Pages/AddDirectors";
import AddCustomers from "../Components/AddCustomers";
import { IconButton } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CSVLink } from "react-csv";
import * as xlsx from "xlsx";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import {
  formatMoney,
  formatDate,
  parseDate,
  shortenDealId,
  sortArray
} from "../../utils/Utils";
import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import Tooltip from "@material-ui/core/Tooltip";

const styles = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  header: {
    display: "inline-block",
    paddingLeft: 15
  },
  tableFontSize: {
    fontSize: 12
  },
  filledSelect: {
    textAlign: "left",
    margin: "0 12px",
    top: 25
  },
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "25px",
    height: "25px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black",
    borderRadius: 3
  },
  editIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  closeIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  editKycIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  closeKycIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  editSanctionIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  closeSanctionIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  errorIcon: {
    color: "#F44336"
  },
  addIcon: {
    color: "#4CAF50"
  },
  infoIcon: {
    color: "#dfa52b"
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
    minWidth: "100px",
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
  }
};

const ColumnDetails = {
  tasks: [
    { name: "Client ID", dataType: "string", key: "customerId", sort: false },
    {
      name: "Client Name",
      dataType: "string",
      key: "customerName",
      sort: false
    },
    {
      name: "Deal ID",
      dataType: "string",
      key: "taskDescriptionId",
      sort: false
    },
    { name: "Tasks", dataType: "string", key: "taskName", sort: false },
    { name: "Due Date", dataType: "date", key: "dueDate", sort: true },
    { name: "Reason", dataType: "string", key: "reason", sort: false },
    { name: "Status", dataType: "string", key: "status", sort: false }
  ],
  adminPendingTasks: [
    {
      name: "Client Deal ID",
      dataType: "string",
      key: "clientDealId",
      sort: false
    },
    {
      name: "Counterparty Name",
      dataType: "string",
      key: "counterpartyName",
      sort: false
    },
    {
      name: "Deal ID",
      dataType: "string",
      key: "taskDescriptionId",
      sort: false
    },
    { name: "Tasks", dataType: "string", key: "taskName", sort: false },
    { name: "Due Date", dataType: "date", key: "dueDate", sort: true },
    { name: "Reason", dataType: "string", key: "reason", sort: false },
    { name: "Status", dataType: "string", key: "status", sort: false }
  ],
  active: [
    { name: "Client ID", dataType: "string", key: "customerId", sort: false },
    {
      name: "Client Name",
      dataType: "string",
      key: "customerName",
      sort: true
    },
    {
      name: "Client Since",
      dataType: "string",
      key: "clientSince",
      sort: false
    },
    { name: "Address", dataType: "string", key: "address", sort: false },
    { name: "City", dataType: "string", key: "city", sort: false },
    { name: "Country", dataType: "string", key: "country", sort: false },
    { name: "Tel No", dataType: "number", key: "phoneNumber", sort: false }
  ],
  kycPending: [
    {
      name: "Application Date",
      dataType: "date",
      key: "createDate",
      sort: true
    },
    { name: "Client ID", dataType: "string", key: "customerId", sort: false },
    {
      name: "Client Name",
      dataType: "string",
      key: "customerName",
      sort: true
    },
    {
      name: "Incorporation No.",
      dataType: "string",
      key: "incorporationNumber",
      sort: false
    },
    {
      name: "Registered Office Address",
      dataType: "string",
      key: "address",
      sort: false
    },
    { name: "City", dataType: "string", key: "city", sort: false },
    { name: "Country", dataType: "string", key: "country", sort: false }
  ],
  toPay: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    {
      name: "Client Name",
      dataType: "string",
      key: "customerName",
      sort: true
    },
    { name: "Deal Date", dataType: "date", key: "tradeDate", sort: true },
    {
      name: "Payment Date",
      dataType: "date",
      key: "payingAmtDate",
      sort: true
    },
    {
      name: "Reason for Payment",
      dataType: "string",
      key: "tradeType",
      sort: false
    },
    {
      name: "Amount to be Paid",
      dataType: "number",
      key: "payingAmount",
      sort: false
    }
  ],
  toReceive: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    {
      name: "Client Name",
      dataType: "string",
      key: "customerName",
      sort: true
    },
    { name: "Trade Date", dataType: "date", key: "tradeDate", sort: true },
    { name: "Trade Type", dataType: "string", key: "tradeType", sort: true },
    {
      name: "Date of Amount to be Received",
      dataType: "date",
      key: "receiveAmtDate",
      sort: false
    },
    {
      name: "Amount to be Received",
      dataType: "number",
      key: "receiveAmount",
      sort: false
    }
  ],
  marginTopupRequired: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    {
      name: "Client Name",
      dataType: "string",
      key: "customerName",
      sort: true
    },
    { name: "Trade Date", dataType: "date", key: "tradeDate", sort: true },
    { name: "Trade Type", dataType: "string", key: "tradeType", sort: true },
    {
      name: "Settlement Date",
      dataType: "date",
      key: "settlementDate",
      sort: false
    },
    {
      name: "Current Valuation",
      dataType: "number",
      key: "currentValuation",
      sort: false
    },
    {
      name: "Current Margin",
      dataType: "number",
      key: "currentMargin",
      sort: false
    },
    {
      name: "Top-Up required",
      dataType: "number",
      key: "marginToupRequired",
      sort: false
    }
  ],
  upcomingSpotTrade: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    {
      name: "Client Name",
      dataType: "string",
      key: "customerName",
      sort: true
    },
    { name: "Trade Date", dataType: "date", key: "tradeDate", sort: true },
    {
      name: "Settlement Date",
      dataType: "date",
      key: "settlementDate",
      sort: false
    },
    {
      name: "Currency Bought",
      dataType: "number",
      key: "currencyBought",
      sort: false
    },
    {
      name: "Currency Sold",
      dataType: "number",
      key: "currencySold",
      sort: false
    }
  ]
};
const DashboardColumns = {
  tasks: [
    "Client ID",
    "Client Name",
    "Deal ID",
    "Tasks",
    "Due Date",
    "Reason",
    "Status"
  ],
  adminPendingTasks: [
    "Client Deal ID",
    "Counterparty Name",
    "Deal ID",
    "Tasks",
    "Due Date",
    "Reason",
    "Status"
  ],
  active: [
    "Client ID",
    "Client Name",
    "Client Since",
    "Address",
    "City",
    "Country",
    "Tel No"
  ],
  kycPending: [
    "Application Date",
    "Client ID",
    "Client Name",
    "Incorporation No.",
    "Registered Office Address",
    "City",
    "Country"
  ],
  toPay: [
    "Deal ID",
    "Client Name",
    "Deal Date",
    "Payment Date",
    "Reason for Payment",
    "Amount to be Paid"
  ],
  toReceive: [
    "Deal ID",
    "Client Name",
    "Trade Date",
    "Trade Type",
    "Date of Amount to be Received",
    "Amount to be Received"
  ],
  marginTopupRequired: [
    "Deal ID",
    "Client Name",
    "Trade Date",
    "Trade Type",
    "Settlement Date",
    "Current Valuation",
    "Current Margin",
    "Top-Up required"
  ],
  upcomingSpotTrade: [
    "Deal ID",
    "Client Name",
    "Trade Date",
    "Settlement Date",
    "Currency Bought",
    "Currency Sold"
  ]
};
function Transition(props) {
  return <Slide direction="down" {...props} />;
}
class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    // this.csvDownloadLink = React.createRef();
    this.state = {
      anchorReportEl: null,
      isDashboard: true,
      paymentColumns: [
        "Trade ID",
        "To be Made Status",
        "To be Recieved Status"
      ],
      taskColumns: DashboardColumns.tasks,
      searchName: "",
      searchDueDateOption: "All",
      searchTaskType: "All",
      taskTypes: [
        "TRADE",
        "KYC",
        "KYC APPLICATIONS",
        "ENQUIRY",
        "PAYMENT",
        "SPOT",
        "FORWARD"
      ],
      adminTaskTypes: ["PAYMENT", "SPOT", "FORWARD", "OTHERS"],
      dueDateOptions: ["Overdue", "Due Today", "Due This Week"],
      pendingTasksList: [],
      pendingTasksCount: 0,
      activeClientList: [],
      activeClientCount: 0,
      kycPendingList: [],
      kycPendingCount: 0,
      toPayList: [],
      toPayCount: 0,
      upcomingSpotTradeList: [],
      upcomingSpotTradeCount: 0,
      marginTopupList: [],
      marginTopupCount: 0,
      toReceiveList: [],
      toReceiveCount: 0,
      taskList: [],
      filterTaskList: [],
      recordsPerPage: 10,
      selectedIndicatorList: [],
      selectedIndicator: "",
      selectedPageIndex: 1,
      isDealExecuted: false,
      dealDetails: {},
      dealTypeForDlg: "",
      isAdminDeal: false,
      showEnquiryDetails: false,
      enquiryDetails: null,
      showChangeStatusDialog: false,
      taskDetails: {},
      showCustomerRegistrationDetails: false,
      customerRegistrationDetails: null,
      showCustomerKYCStatus: false,
      kycInfo: null,
      showAlertModal: false,
      alertData: null,
      showIDCheckDetails: false,
      showPerformIDCheck: false,
      idCheckDetails: null,
      idCheckRequiredData: null,
      showCompanySanctionsModal: false,
      companySanctionsData: null,
      isAddon: true,
      showAddDirector: false,
      editDirector: null,
      showAddCustomer: false,
      editCompany: null,

      callInProgress: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      deleteCustomerId: "",
      deleteKycEntityId: "",
      exportedFileName: "",
      downloadData: [],
      downloadFilterData: [],
      sortByAscending: true,
      columnSortKey: "",
      columnDetails: ColumnDetails.tasks,
      apiData: [],
      isCurrent: false
    };
  }

  componentDidMount = () => {
    this.getAllIndicatorLists();
  };

  getAllIndicatorLists = async () => {
    this.setState({ callInProgress: true });
    await this.getPendingClientList("active", false);
    await this.getPendingClientList("kycPending", false);
    await this.getPendingForexList("toPay", false);
    await this.getPendingForexList("marginTopupRequired", false);
    await this.getPendingForexList("upcomingSpotTrade", false);
    await this.getPendingForexList("toReceive", false);
    await this.getTasksRows(true);
    this.setState({ callInProgress: false });
  };
  handleClickPendingTasksMenuOpen = event => {
    this.setState({
      anchorReportEl: event.currentTarget
    });
  };
  handleClickPendingTasksMenuClose = () => {
    this.setState({
      anchorReportEl: null
    });
  };
  // handleIndicatorClick = name => {
  //   let indicatorData = [];
  //   switch (name) {
  //     case "tasks":
  //       indicatorData = this.state.pendingTasksList;
  //       break;
  //     case "active":
  //       indicatorData = this.state.activeClientList;
  //       break;
  //     case "kycPending":
  //       indicatorData = this.state.kycPendingList;
  //       break;
  //     case "toPay":
  //       indicatorData = this.state.toPayList;
  //       break;
  //     case "marginTopupRequired":
  //       indicatorData = this.state.marginTopupList;
  //       break;
  //     case "upcomingSpotTrade":
  //       indicatorData = this.state.upcomingSpotTradeList;
  //       break;
  //     case "toReceive":
  //       indicatorData = this.state.toReceiveList;
  //       break;
  //   }
  //   let selectedList = indicatorData.slice(0, this.state.recordsPerPage);
  //   this.setState({
  //     taskColumns: DashboardColumns[name],
  //     taskList: indicatorData,
  //     selectedIndicator: name,
  //     selectedIndicatorList: selectedList
  //   });
  // };
  handleIndicatorClick = name => {
    switch (name) {
      case "tasks":
        this.getTasksRows(true);
        break;
      case "adminPendingTasks":
        this.getAdminPendingTasksList(true);
        break;
      case "active":
        this.getPendingClientList("active", true);
        break;
      case "kycPending":
        this.getPendingClientList("kycPending", true);
        break;
      case "toPay":
        this.getPendingForexList("toPay", true);
        break;
      case "marginTopupRequired":
        this.getPendingForexList("marginTopupRequired", true);
        break;
      case "upcomingSpotTrade":
        this.getPendingForexList("upcomingSpotTrade", true);
        break;
      case "toReceive":
        this.getPendingForexList("toReceive", true);
        break;
      default:
        break;
    }
  };
  closeDealModal = () => {
    this.setState({
      isDealExecuted: false,
      dealDetails: {},
      dealTypeForDlg: "",
      isAdminDeal: false
    });
  };
  getTasksRows = async () => {
    this.setState({ callInProgress: true, searchName: "" });
    const res = await apiHandler({
      url: endpoint.ADMIN_TASK_FINDPENDINGTASK,
      authToken: sessionStorage.getItem("token")
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
          anchorReportEl: null,
          downloadData: [],
          downloadFilterData: [],
          exportedFileName: "Client Pending Tasks",
          apiData: [],
          columnSortKey: ""
        });
      }
    } else {
      this.parsePendingClientData(
        res.data && res.data.tasks ? res.data.tasks : [],
        true
      );
    }
    // let indicatorData = [], downloadData=[DashboardColumns['tasks']];
    // res.data.tasks &&
    //   res.data.tasks.forEach((task) => {
    //     let row = [
    //       task.taskType + '_' + task.id,
    //       task.customerId,
    //       task.customerName,
    //       shortenDealId(task.taskDescriptionId) || '',
    //       task.taskName,
    //       formatDate(task.dueDate),
    //       task.reason,
    //       this.getStatusButton(task.status, {
    //         taskId: task.id,
    //         taskDescriptionId: task.taskDescriptionId,
    //         statusMessage: task.statusMessage,
    //         taskType: task.taskType,
    //         customerId: task.customerId,
    //         customerName: task.customerName,
    //         statusList:
    //           task.taskType === 'TRADE' || task.taskType === 'PAYMENT'
    //             ? ['SETTLED', 'INPROCESS', 'CANCELLED']
    //             : task.taskType === 'KYC'
    //             ? ['APPROVED', 'REJECTED']
    //             : task.taskType === 'ENQUIRY'
    //             ? ['SETTLED', 'INPROCESS']
    //             : ['SETTLED', 'INPROCESS', 'REJECTED', 'CANCELLED'],
    //       }),
    //     ];
    //     downloadData.push([
    //       task.customerId,
    //       task.customerName,
    //       shortenDealId(task.taskDescriptionId) || '',
    //       task.taskName,
    //       formatDate(task.dueDate),
    //       task.reason,task.status
    //     ])
    //     indicatorData.push(row);
    //   });
    // let selectedList = indicatorData.slice(0, this.state.recordsPerPage);
    // this.setState({
    //   searchTaskType: 'All',
    //   taskColumns: DashboardColumns['tasks'],
    //   pendingTasksList: indicatorData,
    //   pendingTasksCount: indicatorData.count,
    //   taskList: indicatorData,
    //   filterTaskList: indicatorData,
    //   selectedIndicator: 'tasks',
    //   selectedIndicatorList: selectedList,
    //   anchorReportEl: null,
    //   downloadData:downloadData,
    //   exportedFileName:'Client Pending Tasks',
    //   apiData:res.data&&res.data.tasks?res.data.tasks:[],
    //   columnSortKey: ""
    // });
  };
  parsePendingClientData = (data, datafetched) => {
    let indicatorData = [],
      downloadData = [DashboardColumns["tasks"]],
      downloadFilterData = [];
    data = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    data.forEach(task => {
      let row = [
        task.taskType + "_" + task.id,
        task.customerId,
        task.customerName,
        shortenDealId(task.taskDescriptionId) || "",
        task.taskName,
        formatDate(task.dueDate),
        task.reason,
        this.getStatusButton(task.status, {
          taskId: task.id,
          taskDescriptionId: task.taskDescriptionId,
          statusMessage: task.statusMessage,
          taskType: task.taskType,
          customerId: task.customerId,
          customerName: task.customerName,
          statusList:
            task.taskType === "TRADE" || task.taskType === "PAYMENT"
              ? ["SETTLED", "INPROCESS", "CANCELLED"]
              : task.taskType === "KYC"
              ? ["APPROVED", "REJECTED"]
              : task.taskType === "ENQUIRY"
              ? ["SETTLED", "INPROCESS"]
              : ["SETTLED", "INPROCESS", "REJECTED", "CANCELLED"]
        })
      ];
      downloadData.push([
        task.taskType + "_" + task.id,
        task.customerId,
        task.customerName,
        shortenDealId(task.taskDescriptionId) || "",
        task.taskName,
        formatDate(task.dueDate),
        task.reason,
        task.status
      ]);
      downloadFilterData.push([
        task.taskType + "_" + task.id,
        task.customerId,
        task.customerName,
        shortenDealId(task.taskDescriptionId) || "",
        task.taskName,
        formatDate(task.dueDate),
        task.reason,
        task.status
      ]);
      indicatorData.push(row);
    });
    let selectedList = indicatorData.slice(0, this.state.recordsPerPage);
    let stateObj = {
      pendingTasksList: indicatorData,
      pendingTasksCount: indicatorData.count,
      taskList: indicatorData,
      filterTaskList: indicatorData,
      selectedIndicatorList: selectedList,
      anchorReportEl: null,
      downloadData: downloadData,
      downloadFilterData: downloadFilterData
    };
    if (datafetched) {
      stateObj = {
        ...stateObj,
        searchTaskType: "All",
        taskColumns: DashboardColumns["tasks"],
        selectedIndicator: "tasks",
        anchorReportEl: null,
        exportedFileName: "Client Pending Tasks",
        apiData: data,
        columnSortKey: "",
        columnDetails: ColumnDetails["tasks"]
      };
    }
    this.setState({
      ...stateObj
    });
  };
  getAdminPendingTasksList = async () => {
    this.setState({ callInProgress: true, searchName: "" });
    const res = await apiHandler({
      url: endpoint.ADMIN_TASK_FINDPENDINGTASK + "?type=ADMIN",
      authToken: sessionStorage.getItem("token")
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
          anchorReportEl: null,
          downloadData: [],
          downloadFilterData: [],
          exportedFileName: "FXG Pending Tasks",
          apiData: [],
          columnSortKey: ""
        });
      }
    } else {
      this.parsePendingFXGData(
        res.data && res.data.tasks ? res.data.tasks : [],
        true
      );
    }
  };
  // let indicatorData = [],downloadData=[DashboardColumns['adminPendingTasks']];
  // res.data.tasks &&
  //   res.data.tasks.forEach((task) => {
  //     let row = [
  //       task.taskType + '_' + task.taskDescriptionId,
  //       this.getDealLink(
  //         task.clientDealId ? shortenDealId(task.clientDealId) : "",
  //         'FXFWD',
  //         'CLIENT'
  //       ),
  //       // task.clientDealId,
  //       task.counterpartyName,
  //       this.getDealLink(
  //         task.taskDescriptionId ? shortenDealId(task.taskDescriptionId) : "",
  //         'FXFWD',
  //         'ADMIN'
  //       ),
  //       // shortenDealId(task.taskDescriptionId) || '',
  //       task.taskName,
  //       formatDate(task.dueDate),
  //       task.reason,
  //       this.getStatusButton(task.status, {
  //         taskId: task.id,
  //         taskDescriptionId: task.taskDescriptionId,
  //         statusMessage: task.statusMessage,
  //         taskType: task.taskType,
  //         customerId: task.customerId,
  //         customerName: task.customerName,
  //         statusList:
  //           task.taskType === 'TRADE' || task.taskType === 'PAYMENT'
  //             ? ['SETTLED', 'INPROCESS', 'CANCELLED']
  //             : task.taskType === 'KYC'
  //             ? ['APPROVED', 'REJECTED']
  //             : task.taskType === 'ENQUIRY'
  //             ? ['SETTLED', 'INPROCESS']
  //             : ['SETTLED', 'INPROCESS', 'REJECTED', 'CANCELLED'],
  //       }),
  //     ];
  //     downloadData.push([
  //       task.clientDealId,
  //       task.counterpartyName,
  //       task.taskDescriptionId,
  //       task.taskName,
  //       formatDate(task.dueDate),
  //       task.reason,task.status
  //     ])
  //     indicatorData.push(row);
  //   });
  // let selectedList = indicatorData.slice(0, this.state.recordsPerPage);
  // this.setState({
  //   searchTaskType: 'All',
  //   taskColumns: DashboardColumns['adminPendingTasks'],
  //   pendingTasksList: indicatorData,
  //   pendingTasksCount: indicatorData.count,
  //   taskList: indicatorData,
  //   filterTaskList: indicatorData,
  //   selectedIndicator: 'tasks',
  //   selectedIndicatorList: selectedList,
  //   anchorReportEl: null,
  //   downloadData:downloadData,
  //   exportedFileName:'FXG Pending Tasks',
  //   apiData:res.data&&res.data.tasks?res.data.tasks:[],
  //   columnSortKey: ""
  // });

  parsePendingFXGData = (data, datafetched) => {
    let indicatorData = [],
      downloadData = [DashboardColumns["adminPendingTasks"]],
      downloadFilterData = [];
    data = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    data.forEach(task => {
      let row = [
        task.taskType + "_" + task.taskDescriptionId,
        this.getDealLink(
          task.clientDealId ? shortenDealId(task.clientDealId) : "",
          "FXFWD",
          "CLIENT"
        ),
        // task.clientDealId,
        task.counterpartyName,
        this.getDealLink(
          task.taskDescriptionId ? shortenDealId(task.taskDescriptionId) : "",
          "FXFWD",
          "ADMIN"
        ),
        // shortenDealId(task.taskDescriptionId) || '',
        task.taskName,
        formatDate(task.dueDate),
        task.reason,
        this.getStatusButton(task.status, {
          taskId: task.id,
          taskDescriptionId: task.taskDescriptionId,
          statusMessage: task.statusMessage,
          taskType: task.taskType,
          customerId: task.customerId,
          customerName: task.customerName,
          statusList:
            task.taskType === "TRADE" || task.taskType === "PAYMENT"
              ? ["SETTLED", "INPROCESS", "CANCELLED"]
              : task.taskType === "KYC"
              ? ["APPROVED", "REJECTED"]
              : task.taskType === "ENQUIRY"
              ? ["SETTLED", "INPROCESS"]
              : ["SETTLED", "INPROCESS", "REJECTED", "CANCELLED"]
        })
      ];
      downloadData.push([
        task.taskType + "_" + task.taskDescriptionId,
        task.clientDealId,
        task.counterpartyName,
        task.taskDescriptionId,
        task.taskName,
        formatDate(task.dueDate),
        task.reason,
        task.status
      ]);
      downloadFilterData.push([
        task.taskType + "_" + task.taskDescriptionId,
        task.clientDealId,
        task.counterpartyName,
        task.taskDescriptionId,
        task.taskName,
        formatDate(task.dueDate),
        task.reason,
        task.status
      ]);
      indicatorData.push(row);
    });
    let selectedList = indicatorData.slice(0, this.state.recordsPerPage);
    let stateObj = {
      pendingTasksList: indicatorData,
      pendingTasksCount: indicatorData.count,
      taskList: indicatorData,
      filterTaskList: indicatorData,
      selectedIndicatorList: selectedList,
      anchorReportEl: null,
      downloadData: downloadData,
      downloadFilterData: downloadFilterData
    };
    if (datafetched) {
      stateObj = {
        ...stateObj,
        searchTaskType: "All",
        taskColumns: DashboardColumns["adminPendingTasks"],

        selectedIndicator: "adminPendingTasks",

        anchorReportEl: null,

        exportedFileName: "FXG Pending Tasks",
        apiData: data,
        columnSortKey: "",
        columnDetails: ColumnDetails["adminPendingTasks"]
      };
    }
    this.setState({
      ...stateObj
    });
  };
  getDealLink = (link, tradeType, type) => {
    return link !== "" ? (
      <a onClick={() => this.onAdminTaskDealDetails(link, tradeType, type)}>
        {link}
      </a>
    ) : null;
  };
  getIcon = color => {
    return <FiberManualRecordIcon style={{ color: color }} />;
  };
  onAdminTaskDealDetails = async (value, tradeType, type) => {
    console.log("value - ", value);
    console.log("Type - ", type);

    let URL = "/fx-forrex/fx/deal";
    let headers = {};
    let isAdminDeal = false;
    switch (type) {
      case "ADMIN":
        URL = "/fx-forrex/admin/deal/" + value;
        headers = {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        };
        isAdminDeal = true;
        break;
      case "CLIENT":
        URL = "/fx-forrex/fx/deal";
        headers = {
          params: {
            type: tradeType,
            dealId: value
          },
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        };
        isAdminDeal = false;
        break;
      default:
        break;
    }
    const res = await apiHandler({
      url: URL,
      authToken: sessionStorage.getItem("token")
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
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      const dealType = res.data.type;
      let dealTypeForDlg = "FxSpot";
      switch (dealType) {
        case "FXSPOT":
          dealTypeForDlg = "FxSpot";
          break;
        case "FXFWD":
          dealTypeForDlg = "FxForward";
          break;
        case "MARGIN":
          dealTypeForDlg = "FxForward";
          break;
        case "PAYMENT":
          dealTypeForDlg = "Payment";
          break;
        default:
          break;
      }
      this.setState({
        isDealExecuted: true,
        dealDetails: res.data,
        dealTypeForDlg: dealTypeForDlg,
        isAdminDeal: isAdminDeal
      });
    }
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  closeChangeStatusDialog = () => {
    this.setState({
      showChangeStatusDialog: false,
      taskDetails: null
    });
  };
  updateTaskStatusButton = (status, taskDetails) => {
    let selectedRow = this.state.pendingTasksList.filter(task => {
      return taskDetails.taskType + "_" + taskDetails.taskId === task[0];
    })[0];
    selectedRow[7] = this.getStatusButton(status, taskDetails);
    this.closeChangeStatusDialog();
  };
  updateTaskStatus = async taskUpdatedInfo => {
    if (taskUpdatedInfo.taskType === "BENEFICIARY") {
      this.updateBeneficiaryStatus(taskUpdatedInfo);
    } else {
      this.setState({ callInProgress: true });
      const res = await apiHandler({
        method: "POST",
        url: endpoint.ADMIN_TASK_UPDATE,
        data: taskUpdatedInfo,
        authToken: sessionStorage.getItem("token")
      });
      // const header = {
      //   headers: {
      //     Authorization: "Bearer " + sessionStorage.getItem("token")
      //   }
      // };
      // ADMIN_TASK_UPDATE
      // console.log('TASK INFO - ', taskUpdatedInfo);
      //API.post("/fx-crm/admin/task/update", taskUpdatedInfo, header).then(

      this.setState({ callInProgress: false });
      if (res.data.errorCode) {
        if (res.data.errorCode === 401) {
          console.log("Unauthorized Access");
          this.props.history.push("/home/logout");
          return;
        } else {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Error",
            noticeModalErrMsg: res.data.userDesc
          });
        }
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Success",
          noticeModalErrMsg:
            "Status has been changed to " + taskUpdatedInfo.status
        });
        this.updateTaskStatusButton(
          taskUpdatedInfo.status,
          this.state.taskDetails
        );
        this.getAllIndicatorLists();
      }

      // );
    }
  };
  handleStatus = async (taskDetails, event) => {
    event.preventDefault();
    event.stopPropagation();

    let spotIndex = taskDetails.statusMessage
      ? taskDetails.statusMessage.toLowerCase().indexOf("FX Spot".toLowerCase())
      : -1;
    let forwardIndex = taskDetails.statusMessage
      ? taskDetails.statusMessage
          .toLowerCase()
          .indexOf("FX Forward".toLowerCase())
      : -1;
    if (
      (taskDetails.taskType === "TRADE" &&
        taskDetails.statusMessage &&
        (spotIndex !== -1 || forwardIndex !== -1)) ||
      taskDetails.taskType === "PAYMENT"
    ) {
      let type =
        taskDetails.taskType === "TRADE"
          ? spotIndex !== -1
            ? "FXSPOT"
            : "FXFWD"
          : "PAYMENT";
      const res = await apiHandler({
        url:
          endpoint.DEAL +
          "?type=" +
          type +
          "&dealId=" +
          taskDetails.taskDescriptionId,
        authToken: sessionStorage.getItem("token")
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
            noticeModalErrMsg: res.data.userDesc
          });
        }
      } else {
        let updatedTaskDetails = taskDetails;

        if (taskDetails.taskType === "TRADE") {
          updatedTaskDetails = {
            ...updatedTaskDetails,
            soldCurrencyCode: res.data.feeCurrencyCode
              ? res.data.feeCurrencyCode
              : res.data.soldCurrencyCode
          };
        }
        this.setState({
          showChangeStatusDialog: true,
          taskDetails: updatedTaskDetails
        });
      }
    } else {
      this.setState({
        showChangeStatusDialog: true,
        taskDetails: taskDetails
      });
    }
  };
  getStatusButton = (status, taskDetails) => {
    let color = "success";
    if (status === "SETTLED" || status === "SETTELED") color = "success";
    else if (status === "PENDING") color = "warning";
    else color = "gray";
    return (
      <>
        <Button
          color={color}
          size="sm"
          round
          onClick={event =>
            taskDetails.taskType === "KYC"
              ? this.openKYCStatus(taskDetails, event)
              : this.handleStatus(taskDetails, event)
          }
        >
          {status}
        </Button>
      </>
    );
  };
  getPendingPaymentRows = () => {
    let tableRow = [
      [0, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [1, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [2, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [3, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [4, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [5, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [6, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [7, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [8, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [9, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [10, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")],
      [11, "PAYM43", this.getIcon("#50ae55"), this.getIcon("#dfa52b")]
    ];
    return tableRow;
  };
  parseIndicatorData = (type, data, isCurrent) => {
    let indicatorData = [];
    let listName = "";
    let listCount = "";
    switch (type) {
      case "tasks" || "adminPendingTasks":
        data.tasks &&
          data.tasks.forEach(task => {
            let row = [
              task.customerId,
              task.customerId,
              shortenDealId(task.taskDescriptionId) || "",
              task.customerName,
              task.taskName,
              formatDate(task.dueDate),
              task.reason,
              this.getStatusButton(task.status)
            ];
            indicatorData.push(row);
            listName = "pendingTasksList";
            listCount = "pendingTasksCount";
          });

        break;
      case "active":
        data.forEach(client => {
          let row = [
            client.customerId,
            client.customerId,
            client.customerName,
            client.clientSince,
            client.address.address,
            client.address.city,
            client.address.country,
            client.phoneNumber
          ];
          indicatorData.push(row);
        });

        listName = "activeClientList";
        listCount = "activeClientCount";
        break;
      case "kycPending":
        data.forEach(client => {
          let row = [
            client.customerId,
            formatDate(client.createDate),
            client.customerId,
            client.customerName,
            client.incorporationNumber,
            client.address.address,
            client.address.city,
            client.address.country
          ];
          indicatorData.push(row);
        });

        listName = "kycPendingList";
        listCount = "kycPendingCount";
        break;
      case "toPay":
        data.forEach(pay => {
          let row = [
            pay.dealId,
            shortenDealId(pay.dealId),
            pay.customerName,
            formatDate(pay.tradeDate),
            formatDate(pay.payingAmtDate),
            pay.tradeType === "PAYMENT" ? "Beneficiary" : pay.tradeType,
            formatMoney(pay.payingAmount) + " " + pay.payingAmtCurrenyCode
          ];
          indicatorData.push(row);
        });

        listName = "toPayList";
        listCount = "toPayCount";
        break;
      case "marginTopupRequired":
        data.forEach(pay => {
          let row = [
            pay.dealId,
            shortenDealId(pay.dealId),
            pay.customerName,
            formatDate(pay.tradeDate),
            pay.tradeType,
            formatDate(pay.settlementDate),
            pay.currentValuation,
            pay.currentMargin,
            pay.marginToupRequired
          ];
          indicatorData.push(row);
        });
        listName = "marginTopupList";
        listCount = "marginTopupCount";

        break;
      case "upcomingSpotTrade":
        data.forEach(pay => {
          let row = [
            pay.dealId,
            shortenDealId(pay.dealId),
            pay.customerName,
            formatDate(pay.tradeDate),
            formatDate(pay.settlementDate),
            formatMoney(pay.currencyBought) + " " + pay.boughtCurrencyCode,
            formatMoney(pay.currencySold) + " " + pay.soldCurrencyCode
          ];
          indicatorData.push(row);
        });

        listName = "upcomingSpotTradeList";
        listCount = "upcomingSpotTradeCount";
        break;
      case "toReceive":
        data.forEach(pay => {
          let row = [
            pay.dealId,
            shortenDealId(pay.dealId),
            pay.customerName,
            formatDate(pay.tradeDate),
            pay.tradeType,
            formatDate(pay.receiveAmtDate),
            formatMoney(pay.receiveAmount) + " " + pay.receiveAmtCurrenyCode
          ];
          indicatorData.push(row);
        });

        listName = "toReceiveList";
        listCount = "toReceiveCount";
        break;
      default:
        break;
    }
    if (isCurrent) {
      let selectedList = indicatorData.slice(0, this.state.recordsPerPage);
      this.setState({
        [listName]: indicatorData,
        [listCount]: indicatorData.length,
        taskColumns: DashboardColumns[type],
        taskList: indicatorData,
        filterTaskList: indicatorData,
        selectedIndicator: type,
        selectedIndicatorList: selectedList,
        apiData: data,
        columnSortKey: "",
        isCurrent: isCurrent,
        columnDetails: ColumnDetails[type]
      });
    } else {
      this.setState({
        [listName]: indicatorData,
        [listCount]: indicatorData.length,
        apiData: data,
        columnSortKey: "",
        isCurrent: isCurrent
      });
    }
  };
  onClickColumnHeader = (columnDetails, index) => {
    let arr = sortArray(
      this.state.apiData,
      columnDetails.key,
      !this.state.sortByAscending,
      columnDetails.dataType
    );
    this.parseDataAfterSorting(
      arr,
      !this.state.sortByAscending,
      columnDetails.name
    );
  };
  parseDataAfterSorting = (data, sortByAscending, columnKey) => {
    // let reportData = [];

    // let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState(
      {
        sortByAscending: sortByAscending,
        columnSortKey: columnKey,
        apiData: data
      },
      () => {
        if (this.state.selectedIndicator === "tasks") {
          this.parsePendingClientData(data, false);
        } else if (this.state.selectedIndicator === "adminPendingTasks") {
          this.parsePendingFXGData(data, false);
        } else {
          this.parseIndicatorData(
            this.state.selectedIndicator,
            data,
            this.state.isCurrent
          );
        }
      }
    );
  };
  getPendingClientList = async (type, isCurrent) => {
    this.setState({ searchName: "" });
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_PENDING_CLIENTLIST + type,
      authToken: sessionStorage.getItem("token")
    });
    // this.setState({ callInProgress: false });
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
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      // console.log(res.data);
      let clientList = res.data && res.data.clients ? res.data.clients : [];
      clientList = clientList.sort((a, b) =>
        a.customerId < b.customerId ? -1 : a.customerId > b.customerId ? 1 : 0
      );
      this.parseIndicatorData(type, clientList, isCurrent);
    }
  };
  //ADMIN_TRADE_PENDING_FOREXLIST
  getPendingForexList = async (type, isCurrent) => {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    let settlementDate = parseDate(currentDate);

    this.setState({ searchName: "" });
    const res = await apiHandler({
      url:
        endpoint.ADMIN_TRADE_PENDING_FOREXLIST +
        type +
        "?settlementDate=" +
        settlementDate,
      authToken: sessionStorage.getItem("token")
    });

    // this.setState({ callInProgress: false });
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
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      // console.log(res.data);
      this.parseIndicatorData(
        type,
        res.data && res.data.customerPaymentDetails
          ? res.data.customerPaymentDetails
          : [],
        isCurrent
      );
    }
  };
  getIndicatorItemRow = selectedID => {
    let selectedRow = this.state.selectedIndicatorList.filter(indicator => {
      return indicator[0] === selectedID;
    });
    return selectedRow.length > 0 ? selectedRow[0] : null;
  };
  getDocumentLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    ) : null;
  };
  showCustomerRegistrationDialog = customerDetails => {
    if (customerDetails.ownershipType !== "") {
      switch (customerDetails.ownershipType) {
        case "2":
          customerDetails.type = "Private";
          break;
        case "3":
          customerDetails.type = "Public";
          break;
        default:
          break;
      }
    }
    if (customerDetails.addresses) {
      customerDetails.business = customerDetails.addresses.filter(addr => {
        return addr.addressType === "BUSINESS_ADDRESS";
      })[0];
      customerDetails.office = customerDetails.addresses.filter(addr => {
        return addr.addressType === "REGISTERED_OFFICE_ADDRESS";
      })[0];
    }
    if (customerDetails.directors) {
      let directorColumn = [
        "First Name",
        "Last Name",
        "Date of Birth",
        "Email",
        "Address",
        "Country Code",
        "City",
        "Postal Code",
        "Address Proof",
        "Utility / Bank Statement"
      ];
      let directorData = [];
      customerDetails.directors.forEach((director, index) => {
        directorData.push([
          index,
          director.firstName,
          director.lastName,
          formatDate(director.dob),
          director.email,
          director.address,
          director.countryCode,
          director.city,
          director.postalCode,
          this.getDocumentLink(director.addressProofLink),
          this.getDocumentLink(director.utilityOrBankStmtLink)
        ]);
      });
      customerDetails.directorsInfo = {
        column: directorColumn,
        data: directorData
      };
    }
    this.setState({
      customerRegistrationDetails: customerDetails,
      showCustomerRegistrationDetails: true
    });
  };
  // ADMIN_CUSTOMER_CUSTOMERDETAILS_CUSTOMERID
  getCustomerDetails = async customerId => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url:
        endpoint.ADMIN_CUSTOMER_CUSTOMERDETAILS_CUSTOMERID +
        "?customerId=" +
        customerId,
      authToken: sessionStorage.getItem("token")
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
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.showCustomerRegistrationDialog(res.data);
    }
  };
  closeCustomerRegistrationDetails = () => {
    this.setState({
      customerRegistrationDetails: null,
      showCustomerRegistrationDetails: false
    });
  };
  showEnquiryDialog = data => {
    this.setState({
      enquiryDetails: data,
      showEnquiryDetails: true
    });
  };
  closeEnquiryDetails = () => {
    this.setState({
      enquiryDetails: null,
      showEnquiryDetails: false
    });
  };
  showPendingTaskDetails = async selectedID => {
    console.log(selectedID);
    let index = selectedID.lastIndexOf("_");

    const taskType = selectedID.substring(0, index);
    const taskID = selectedID.substring(index + 1, selectedID.length);

    if (taskType === "ADMIN_TRADE") {
      const res = await apiHandler({
        url: endpoint.ADMIN_DEAL + taskID,
        authToken: sessionStorage.getItem("token")
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
            noticeModalErrMsg: res.data.userDesc
          });
        }
      } else {
        // Based on Task type, show relevant popup
        this.setState({
          isDealExecuted: true,
          dealDetails: res.data,
          dealTypeForDlg: "FxSpot",
          isAdminDeal: true
        });
      }
    } else {
      this.setState({ callInProgress: true });
      // Get Task details based on task ID
      //ADMIN_TASK_DETAIL
      const res = await apiHandler({
        url: endpoint.ADMIN_TASK_DETAIL + "?taskId=" + taskID,
        authToken: sessionStorage.getItem("token")
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
            noticeModalErrMsg: res.data.userDesc
          });
        }
      } else {
        // Based on Task type, show relevant popup
        switch (res.data.type) {
          case "FXSPOT":
            this.setState({
              isDealExecuted: true,
              dealDetails: res.data,
              dealTypeForDlg: "FxSpot",
              isAdminDeal: false
            });
            break;
          case "FXFWD":
            this.setState({
              isDealExecuted: true,
              dealDetails: res.data,
              dealTypeForDlg: "FxForward",
              isAdminDeal: false
            });
            break;
          case "PAYMENT":
            this.setState({
              isDealExecuted: true,
              dealDetails: res.data,
              dealTypeForDlg: "Payment",
              isAdminDeal: false
            });
            break;
          case "ENQUIRY":
            this.showEnquiryDialog(res.data);
            break;
          case "KYC":
            this.getCustomerDetails(res.data.id);
            break;
          default:
            break;
        }
        // console.log(res.data);
      }
    }
  };
  getDealExecutedDetails = async (dealType, dealId) => {
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url: endpoint.DEAL + "?type=" + dealType + "&dealId=" + dealId,
      authToken: sessionStorage.getItem("token")
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
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      let dealTypeForDlg = "FxSpot";
      switch (dealType) {
        case "FXSPOT":
          dealTypeForDlg = "FxSpot";
          break;
        case "FXFWD":
          dealTypeForDlg = "FxForward";
          break;
        case "MARGIN":
          dealTypeForDlg = "FxForward";
          break;
        case "PAYMENT":
          dealTypeForDlg = "Payment";
          break;
        default:
          break;
      }
      this.setState({
        isDealExecuted: true,
        dealDetails: res.data,
        dealTypeForDlg: dealTypeForDlg,
        isAdminDeal: false
      });
      // console.log(res.data);
    }
  };
  indicatorTableRowClick = selectedID => {
    // console.log(selectedID);
    switch (this.state.selectedIndicator) {
      case "active":
        this.props.history.push(`/auth/admin/customer-info-page/` + selectedID);
        break;
      case "toPay":
        {
          let row = this.getIndicatorItemRow(selectedID);
          if (row) {
            let tradeType = row[5] === "Beneficiary" ? "PAYMENT" : row[5];
            this.getDealExecutedDetails(tradeType, selectedID);
          }
        }
        break;
      case "toReceive":
      case "marginTopupRequired":
        {
          let row = this.getIndicatorItemRow(selectedID);
          if (row) {
            let tradeType = row[4];
            this.getDealExecutedDetails(tradeType, selectedID);
          }
        }
        break;
      case "upcomingSpotTrade":
        this.getDealExecutedDetails("FXSPOT", selectedID);
        break;
      case "kycPending":
        this.getCustomerDetails(selectedID);
        break;
      case "tasks" || "adminPendingTasks":
        this.showPendingTaskDetails(selectedID);
        break;
      default:
        break;
    }
  };
  getPageData = event => {
    let pageIndex = 0;
    let pageCount = Math.ceil(
      this.state.filterTaskList.length / this.state.recordsPerPage
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

    let selectedList = this.state.filterTaskList.slice(
      (pageIndex - 1) * this.state.recordsPerPage,
      pageIndex * this.state.recordsPerPage
    );
    this.setState({
      selectedPageIndex: pageIndex,
      selectedIndicatorList: selectedList
    });
  };
  getPageDetails = () => {
    let DataCount = Math.ceil(
      this.state.filterTaskList.length / this.state.recordsPerPage
    );
    // switch ()
    let pageArray = [];
    Array.from(new Array(DataCount)).forEach((count, index) => {
      if (index + 1 === this.state.selectedPageIndex) {
        pageArray.push({
          text: `${index + 1}`,
          active: true
        });
      } else {
        pageArray.push({
          text: `${index + 1}`
        });
      }
    });
    return pageArray;
  };
  filterPendingTasks = (dueDateOption, taskTypeOption, searchName) => {
    let selectedTasks = this.state.taskList;
    if (
      this.state.selectedIndicator === "tasks" ||
      this.state.selectedIndicator === "adminPendingTasks"
    ) {
      this.filterDownloadData(dueDateOption, taskTypeOption, searchName);

      const paramDueDate = dueDateOption === "All" ? "" : dueDateOption;
      const paramTaskType = taskTypeOption === "All" ? "" : taskTypeOption;
      // Filter based on Due Date
      if (paramDueDate !== "") {
        const today = new Date(formatDate(new Date()));
        switch (paramDueDate) {
          case "Overdue":
            selectedTasks = selectedTasks.filter(task => {
              const taskDueDate = new Date(task[5]);
              if (taskDueDate < today) return true;
              else return false;
            });
            break;
          case "Due Today":
            selectedTasks = selectedTasks.filter(task => {
              const taskDueDate = new Date(task[5]);
              if (formatDate(taskDueDate) === formatDate(today)) return true;
              else return false;
            });
            break;
          case "Due This Week":
            selectedTasks = selectedTasks.filter(task => {
              const taskDueDate = new Date(task[5]);
              let WeekDate = new Date();
              WeekDate.setDate(WeekDate.getDate() + 7);

              if (
                formatDate(taskDueDate) === formatDate(today) ||
                (taskDueDate > today && taskDueDate < WeekDate)
              )
                return true;
              else return false;
            });
            break;
          default:
            break;
        }
      }
      // Filter based on Task Type
      if (paramTaskType !== "") {
        selectedTasks = selectedTasks.filter(task => {
          //const taskType = task[6].substring(0, task[6].indexOf('_'));
          if (taskTypeOption === "KYC APPLICATIONS") {
            const index = task[0]
              .toString()
              .toLowerCase()
              .includes("kyc");
            return index;
          } else {
            const index =
              task[0]
                .toString()
                .toLowerCase()
                .includes(taskTypeOption.toLowerCase()) ||
              task[6]
                .toString()
                .toLowerCase()
                .includes(taskTypeOption.toLowerCase());
            return index;
          }
        });
      }
      // Filter based on Search text
      if (searchName !== "") {
        selectedTasks = selectedTasks.filter(task => {
          const name = task[2] + " " + task[4] + " " + task[6];
          const index = name.toLowerCase().indexOf(searchName.toLowerCase());
          if (index !== -1) return true;
          else return false;
        });
      }
    } else {
      selectedTasks = this.state.taskList.filter(task => {
        let name = "";
        switch (this.state.selectedIndicator) {
          case "active":
          case "marginTopupRequired":
          case "toPay":
          case "upcomingSpotTrade":
          case "toReceive":
            name = task[2];
            break;
          case "kycPending":
            name = task[3];
            break;
          case "tasks" || "adminPendingTasks":
            name = task[2] + " " + task[4] + " " + task[6];
            break;
          default:
            break;
        }
        const index = name.toLowerCase().indexOf(searchName.toLowerCase());
        if (index !== -1) return true;
        else return false;
      });
    }

    let selectedList = selectedTasks.slice(0, this.state.recordsPerPage);
    this.setState({
      filterTaskList: selectedTasks,
      selectedPageIndex: 1,
      selectedIndicatorList: selectedList
    });
  };
  filterDownloadData = (dueDateOption, taskTypeOption, searchName) => {
    let selectedTasks = this.state.downloadData;
    if (
      this.state.selectedIndicator === "tasks" ||
      this.state.selectedIndicator === "adminPendingTasks"
    ) {
      const paramDueDate = dueDateOption === "All" ? "" : dueDateOption;
      const paramTaskType = taskTypeOption === "All" ? "" : taskTypeOption;
      // Filter based on Due Date
      if (paramDueDate !== "") {
        const today = new Date(formatDate(new Date()));
        switch (paramDueDate) {
          case "Overdue":
            selectedTasks = selectedTasks.filter(task => {
              const taskDueDate = new Date(task[5]);
              if (taskDueDate < today) return true;
              else return false;
            });
            break;
          case "Due Today":
            selectedTasks = selectedTasks.filter(task => {
              const taskDueDate = new Date(task[5]);
              if (formatDate(taskDueDate) === formatDate(today)) return true;
              else return false;
            });
            break;
          case "Due This Week":
            selectedTasks = selectedTasks.filter(task => {
              const taskDueDate = new Date(task[5]);
              let WeekDate = new Date();
              WeekDate.setDate(WeekDate.getDate() + 7);

              if (
                formatDate(taskDueDate) === formatDate(today) ||
                (taskDueDate > today && taskDueDate < WeekDate)
              )
                return true;
              else return false;
            });
            break;
          default:
            break;
        }
      }
      // Filter based on Task Type
      if (paramTaskType !== "") {
        selectedTasks = selectedTasks.filter(task => {
          //const taskType = task[6].substring(0, task[6].indexOf('_'));
          if (taskTypeOption === "KYC APPLICATIONS") {
            const index = task[0]
              .toString()
              .toLowerCase()
              .includes("kyc");
            return index;
          } else {
            const index =
              task[0]
                .toString()
                .toLowerCase()
                .includes(taskTypeOption.toLowerCase()) ||
              task[6]
                .toString()
                .toLowerCase()
                .includes(taskTypeOption.toLowerCase());
            return index;
          }
        });
      }
      // Filter based on Search text
      if (searchName !== "") {
        selectedTasks = selectedTasks.filter(task => {
          const name = task[2] + " " + task[4] + " " + task[6];
          const index = name.toLowerCase().indexOf(searchName.toLowerCase());
          if (index !== -1) return true;
          else return false;
        });
      }
    }

    this.setState({
      downloadFilterData: selectedTasks
    });
  };
  handleDueDateOption = event => {
    // const param = event.target.value === "All" ? "" : event.target.value;
    // let selectedTasks = this.state.taskList.filter(task => {
    //   const taskType = task[0].substring(0, task[0].indexOf("_"));
    //   const index = taskType.toLowerCase().indexOf(param.toLowerCase());
    //   if (index != -1) return true;
    //   else return false;
    // });
    // let selectedList = selectedTasks.slice(0, this.state.recordsPerPage);
    this.setState(
      {
        searchDueDateOption: event.target.value
      },
      () => {
        this.filterPendingTasks(
          event.target.value,
          this.state.searchTaskType,
          this.state.searchName
        );
      }
    );
  };
  handleSearchTaskType = event => {
    // const param = event.target.value === "All" ? "" : event.target.value;
    // let selectedTasks = this.state.taskList.filter(task => {
    //   const taskType = task[0].substring(0, task[0].indexOf("_"));
    //   const index = taskType.toLowerCase().indexOf(param.toLowerCase());
    //   if (index != -1) return true;
    //   else return false;
    // });
    // let selectedList = selectedTasks.slice(0, this.state.recordsPerPage);
    this.setState(
      {
        searchTaskType: event.target.value
      },
      () => {
        this.filterPendingTasks(
          this.state.searchDueDateOption,
          event.target.value,
          this.state.searchName
        );
      }
    );
  };
  searchClientList = (name, event) => {
    this.setState(
      {
        searchName: event.target.value
      },
      () => {
        this.filterPendingTasks(
          this.state.searchDueDateOption,
          this.state.searchTaskType,
          this.state.searchName
        );
      }
    );
    // let selectedTasks = this.state.taskList.filter(task => {
    //   let name = "";
    //   switch (this.state.selectedIndicator) {
    //     case "active":
    //     case "marginTopupRequired":
    //     case "toPay":
    //     case "upcomingSpotTrade":
    //     case "toReceive":
    //       name = task[2];
    //       break;
    //     case "kycPending":
    //       name = task[3];
    //       break;
    //     case "tasks":
    //       name = task[2] + " " + task[3] + " " + task[5];
    //       break;
    //   }
    //   const index = name
    //     .toLowerCase()
    //     .indexOf(event.target.value.toLowerCase());
    //   if (index != -1) return true;
    //   else return false;
    // });
    // let selectedList = selectedTasks.slice(0, this.state.recordsPerPage);
    // this.setState({
    //   filterTaskList: selectedTasks,
    //   selectedPageIndex: 1,
    //   selectedIndicatorList: selectedList
    // });
  };
  getRAGStatusIcon = status => {
    let color = "#50ae55";
    switch (status) {
      case "RED":
        color = "#df3d2b";
        break;
      case "AMBER":
        color = "#dfa52b";
        break;
      case "GREEN":
        color = "#50ae55";
        break;
    }
    return (
      <FiberManualRecordIcon
        style={{ color: color, textAlign: "center", width: 50, height: 50 }}
      />
    );
  };
  getCompanyDocLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Detail Report
      </a>
    ) : null;
  };
  getBeneficiaryStatusButton = (status, taskDetails) => {
    return (
      <>
        <Button
          style={{
            backgroundColor:
              status === "APPROVED" || status === "COMPLETED"
                ? "#95c440"
                : status === "PENDING"
                ? "rgb(223,165,43)"
                : "rgb(225,0,0)"
          }}
          size="sm"
          round
          onClick={event => {
            this.showBeneficiaryChangeStatus(taskDetails);
          }}
        >
          {status}
        </Button>
      </>
    );
  };
  getAlertButton = alertData => {
    return (
      <>
        <Button
          size="sm"
          round
          style={{ backgroundColor: "#00acc1" }}
          onClick={() => this.showAlertStatus(alertData)}
        >
          {"Alerts"}
        </Button>
      </>
    );
  };
  getCompanySanctionsButton = companySanctions => {
    return (
      <>
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.showCompanySanctions(companySanctions)}
        >
          {"Sanctions"}
        </Button>
      </>
    );
  };
  getDirectorKYCButton = (
    isDirectorKYCExists,
    isCompanyKYCExists,
    directorId,
    customerRegistrationDetails
  ) => {
    if (!isDirectorKYCExists && !isCompanyKYCExists) {
      return <React.Fragment> </React.Fragment>;
    } else if (!isDirectorKYCExists) {
      return (
        <>
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() =>
              this.performDirectorKYC(directorId, customerRegistrationDetails)
            }
          >
            {"Perform KYC"}
          </Button>
        </>
      );
    } else return <React.Fragment> </React.Fragment>;
  };
  getCompanyKYCButton = (
    isDirectorKYCExists,
    isCompanyKYCExists,
    customerRegistrationDetails
  ) => {
    if (!isDirectorKYCExists && !isCompanyKYCExists) {
      return <React.Fragment> </React.Fragment>;
    } else if (!isCompanyKYCExists) {
      return (
        <>
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() => this.performCompanyKYC(customerRegistrationDetails)}
          >
            {"Perform KYC"}
          </Button>
        </>
      );
    } else return <React.Fragment> </React.Fragment>;
  };
  getInprocessKYCButton = () => {
    return (
      <>
        <Button color={"success"} size="sm" round>
          {"Inprocess"}
        </Button>
      </>
    );
  };
  getDirectorActionButton = (isAdditional, customerId, kycEntityId) => {
    if (isAdditional) {
      return (
        <>
          <Edit
            onClick={() => this.handleEditDirector(customerId, kycEntityId)}
            className={cx(
              this.props.classes.editKycIcon,
              this.props.classes.icon
            )}
          />
          <Close
            onClick={() =>
              this.handleDeleteDirectorCompany(customerId, kycEntityId)
            }
            className={cx(
              this.props.classes.closeKycIcon,
              this.props.classes.icon
            )}
          />
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() => this.executeKYC(customerId, kycEntityId)}
          >
            {"KYC"}
          </Button>
        </>
      );
    } else {
      return (
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.executeKYC(customerId, kycEntityId)}
        >
          {"KYC"}
        </Button>
      );
    }
  };
  getCompanyActionButton = (isAdditional, customerId, kycEntityId) => {
    if (isAdditional) {
      return (
        <>
          <Edit
            onClick={() => this.handleEditCustomer(customerId, kycEntityId)}
            className={cx(
              this.props.classes.editKycIcon,
              this.props.classes.icon
            )}
          />
          <Close
            onClick={() =>
              this.handleDeleteDirectorCompany(customerId, kycEntityId)
            }
            className={cx(
              this.props.classes.closeKycIcon,
              this.props.classes.icon
            )}
          />
          <Button
            color={"success"}
            size="sm"
            round
            onClick={() => this.executeKYC(customerId, kycEntityId)}
          >
            {"KYC"}
          </Button>
        </>
      );
    } else {
      return (
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.executeKYC(customerId, kycEntityId)}
        >
          {"KYC"}
        </Button>
      );
    }
  };
  showIDCheckButton = (idCheckData, documentCheckReport) => {
    let updatedIdCheckData = {
      ...idCheckData,
      documentCheckReport: documentCheckReport
    };
    return (
      <>
        <Button
          color={"success"}
          size="sm"
          round
          onClick={() => this.showIDCheck(updatedIdCheckData)}
        >
          {"Show ID Check Details"}
        </Button>
      </>
    );
  };
  getIDCheckButton = directorDetails => {
    return (
      <>
        <Button
          style={{ backgroundColor: "#00acc1" }}
          size="sm"
          round
          onClick={() => this.performIDCheck(directorDetails)}
        >
          {"Perform ID Check"}
        </Button>
      </>
    );
  };
  isAdditional = flag => {
    return flag ? <AddIcon /> : <React.Fragment />;
  };
  getDirectorKycData = (kycInfo, taskDetails) => {
    let kycData = kycInfo.kycDetails;
    let CustomerRegistrationData = kycInfo.customerRegistrationDetails;
    let companyKycDetailsOrig =
      kycData.companyKycDetails &&
      kycData.companyKycDetails.find(company => {
        return company.additionalCompany === false;
      });

    kycData.isCompanyKYCExists = false;
    kycData.companyKycDetails &&
      kycData.companyKycDetails.forEach(company => {
        if (
          company.kycStatus === null ||
          company.kycStatus === "COMPLETED" ||
          company.kycStatus === "INPROCESS"
        )
          kycData.isCompanyKYCExists = true;
      });
    kycData.isDirectorKYCExists = false;
    kycData.directorKycDetails &&
      kycData.directorKycDetails.forEach(director => {
        if (
          director.kycStatus === null ||
          director.kycStatus === "COMPLETED" ||
          director.kycStatus === "INPROCESS"
        )
          kycData.isDirectorKYCExists = true;
      });
    // Adding Director KYC details
    kycData.directorKycData = [];
    // if (kycData.isDirectorKYCExists) {
    kycData &&
      kycData.directorKycDetails &&
      kycData.directorKycDetails.forEach((director, index) => {
        // reset status for null value
        if (director.kycStatus === null) director.kycStatus = "COMPLETED";

        if (director.kycStatus === "COMPLETED") {
          // KYC completed
          kycData.directorKycData.push([
            index,
            this.isAdditional(director.additionalDirector),
            director.name,
            "Director",
            director.riskScore,
            this.getRAGStatusIcon(director.rag),
            this.getCompanyDocLink(director.pdfreport),
            this.getAlertButton(director.alerts),
            director.idDocumentStatus === "COMPLETED"
              ? this.showIDCheckButton(
                  director.idDocumentCheckData,
                  director.documentCheckReport
                )
              : director.idDocumentStatus === "INPROCESS"
              ? this.getInprocessKYCButton()
              : this.getIDCheckButton({
                  customerId: CustomerRegistrationData.customerId,
                  customerName: CustomerRegistrationData.companyName,
                  kycEntityId: director.kycEntityId,
                  directorId: director.directorId,
                  addressProofType: director.addressProofType,
                  addressProofLink: director.addressProofLink,
                  firstName: director.name.split(" ")[0],
                  lastName: director.name.split(" ")[1]
                })
          ]);
        } else if (director.kycStatus === "INPROCESS") {
          // KYC InProcess
          kycData.directorKycData.push([
            index,
            this.isAdditional(director.additionalDirector),
            director.name,
            "Director",
            "",
            "",
            "",
            this.getInprocessKYCButton(),
            ""
          ]);
        } else {
          // KYC is still pending for this Director
          kycData.directorKycData.push([
            index,
            this.isAdditional(director.additionalDirector),
            director.name,
            "Director",
            "",
            "",
            "",
            this.getDirectorActionButton(
              director.additionalDirector,
              kycData.customerId,
              director.kycEntityId
            ),
            ""
          ]);
        }
      });
    /*} else {
      CustomerRegistrationData &&
        CustomerRegistrationData.directors &&
        CustomerRegistrationData.directors.forEach((director, index) => {
          kycData.directorKycData.push([
            index,
            this.isAdditional(false),
            director.firstName + ' ' + director.lastName,
            'Director',
            '',
            '',
            '',
            this.getDirectorKYCButton(kycData.isDirectorKYCExists, kycData.isCompanyKYCExists, director.directorId, CustomerRegistrationData),
            '',
          ]);
        });
    }*/
    // if (kycData.isCompanyKYCExists) {
    kycData &&
      kycData.companyKycDetails &&
      kycData.companyKycDetails.forEach((company, index) => {
        if (company.kycStatus === null) company.kycStatus = "COMPLETED";

        if (company.kycStatus === "COMPLETED") {
          // KYC completed
          kycData.directorKycData.push([
            kycData.directorKycData.length,
            this.isAdditional(company.additionalCompany),
            company.name,
            "Company",
            company.riskScore,
            this.getRAGStatusIcon(company.rag),
            this.getCompanyDocLink(company.pdfreport),
            this.getAlertButton(company.alerts),
            ""
          ]);
        } else if (company.kycStatus === "INPROCESS") {
          // KYC in process
          kycData.directorKycData.push([
            kycData.directorKycData.length,
            this.isAdditional(company.additionalCompany),
            company.name,
            "Company",
            "",
            "",
            "",
            this.getInprocessKYCButton(),
            ""
          ]);
        } else {
          // KYC is still pending for this Customer
          kycData.directorKycData.push([
            kycData.directorKycData.length,
            this.isAdditional(company.additionalCompany),
            company.name,
            "Company",
            "",
            "",
            "",
            this.getCompanyActionButton(
              company.additionalCompany,
              kycData.customerId,
              company.kycEntityId
            ),
            ""
          ]);
        }
      });
    /*} else {
      // Adding Company status
      kycData.directorKycData.push([
        kycData.directorKycData.length,
        CustomerRegistrationData.companyName,
        this.isAdditional(false),
        'Company',
        '',
        '',
        '',
        this.getCompanyKYCButton(kycData.isDirectorKYCExists, kycData.isCompanyKYCExists, CustomerRegistrationData),
        '',
      ]);
    }*/
    if (kycData.isCompanyKYCExists) {
      // adding Shareholder data
      let shareHolders = [];
      companyKycDetailsOrig &&
        companyKycDetailsOrig.shareHolders &&
        companyKycDetailsOrig.shareHolders.forEach((share, index) =>
          shareHolders.push([index, share])
        );
      kycData.shareHoldersData = shareHolders;
      // adding Director data
      let directors = [];
      companyKycDetailsOrig &&
        companyKycDetailsOrig.directors &&
        companyKycDetailsOrig.directors.forEach((director, index) =>
          directors.push([
            index,
            director.name,
            director.dob,
            director.position,
            director.appointmentDate,
            director.address,
            director.postalCode
          ])
        );
      kycData.directorsData = directors;
      // Adding CreditLimit Data
      kycData.creditLimitData = [];
      if (companyKycDetailsOrig && companyKycDetailsOrig.creditRating) {
        let cl = companyKycDetailsOrig.creditRating;
        kycData.creditLimitData.push([
          0,
          cl.rating,
          cl.ratingType,
          cl.description,
          cl.minRating + " - " + cl.maxRating,
          cl.creditLimit
        ]);
      }

      // adding Company Sanctions data
      const fillButtons = value => {
        if (value === null) {
          return <>No Data</>;
        } else {
          return value ? (
            <CheckIcon
              className={cx(
                this.props.classes.editSanctionIcon,
                this.props.classes.icon
              )}
            />
          ) : (
            <CloseIcon
              className={cx(
                this.props.classes.closeSanctionIcon,
                this.props.classes.icon
              )}
            />
          );
        }
      };

      kycData.companySanction =
        companyKycDetailsOrig && companyKycDetailsOrig.companySanction;
      if (kycData.companySanction) {
        let negativeData = [];
        negativeData.push([
          0,
          "Politically Exposed",
          fillButtons(kycData.companySanction.pep)
        ]);
        negativeData.push([
          1,
          "PEP Level",
          fillButtons(kycData.companySanction.pepLevel || null)
        ]);
        negativeData.push([
          2,
          "Financial Regulator",
          fillButtons(
            kycData.companySanction.notes &&
              kycData.companySanction.notes["Financial Regulator"]
          )
        ]);
        negativeData.push([
          3,
          "Adverse Media",
          fillButtons(
            kycData.companySanction.notes &&
              kycData.companySanction.notes["Adverse Media"]
          )
        ]);
        negativeData.push([
          4,
          "Insolvent",
          fillButtons(kycData.companySanction.insolvent)
        ]);
        negativeData.push([
          5,
          "Disqualified Director",
          fillButtons(kycData.companySanction.disqualifiedDirector)
        ]);
        negativeData.push([
          6,
          "Law Enforcement",
          fillButtons(kycData.companySanction.lawEnforcement)
        ]);
        kycData.companySanction.companySanctionNegativeData = negativeData;

        let typeData = [];
        typeData.push([
          0,
          "AUSTRAC",
          fillButtons(kycData.companySanction.austracPreviousSanction),
          fillButtons(kycData.companySanction.austracCurrentSanction)
        ]);
        typeData.push([
          1,
          "EU",
          fillButtons(kycData.companySanction.eupreviousSanction),
          fillButtons(kycData.companySanction.eucurrentSanction)
        ]);
        typeData.push([
          2,
          "HMT",
          fillButtons(kycData.companySanction.hmtpreviousSanction),
          fillButtons(kycData.companySanction.hmtcurrentSanction)
        ]);
        typeData.push([
          3,
          "OFAC",
          fillButtons(kycData.companySanction.ofacpreviousSanction),
          fillButtons(kycData.companySanction.ofaccurrentSanction)
        ]);
        typeData.push([
          4,
          "UN",
          fillButtons(kycData.companySanction.unpreviousSanction),
          fillButtons(kycData.companySanction.uncurrentSanction)
        ]);
        kycData.companySanction.companySanctionTypeData = typeData;

        let documentsData = [];
        kycData.companySanction.sanctionDocuments &&
          kycData.companySanction.sanctionDocuments.forEach(
            (document, index) => {
              documentsData.push([
                index,
                document.sactionName,
                this.getDocumentLink(document.origionalHref),
                this.getDocumentLink(document.secureHref)
              ]);
            }
          );
        kycData.companySanction.sanctionDocumentsData = documentsData;

        let insolventsData = [];
        kycData.companySanction.insolvents &&
          kycData.companySanction.insolvents.forEach((insolvent, index) => {
            insolventsData.push([
              index,
              this.getDocumentLink(insolvent.origionalHref),
              this.getDocumentLink(insolvent.secureHref)
            ]);
          });
        kycData.companySanction.insolventsData = insolventsData;
      }

      kycData.beneficiaryKYCData = [];
      if (kycData.beneficiaryKycDetails) {
        kycData.beneficiaryKycDetails &&
          kycData.beneficiaryKycDetails.forEach((beneficiary, index) => {
            if (beneficiary.kycStatus === "COMPLETED") {
              kycData.beneficiaryKYCData.push([
                index,
                beneficiary.name,
                // beneficiary.contactDetail,
                // beneficiary.creditRating,
                // beneficiary.registrationNumber,
                beneficiary.riskScore,
                this.getRAGStatusIcon(beneficiary.rag),
                this.getCompanyDocLink(beneficiary.pdfreport),
                this.getAlertButton(beneficiary.alerts),
                this.getCompanySanctionsButton(beneficiary.companySanction),
                this.getBeneficiaryStatusButton(beneficiary.beneficiaryStatus, {
                  taskId: beneficiary.beneficiaryId,
                  // taskDescriptionId: task.taskDescriptionId,
                  // statusMessage: task.statusMessage,
                  taskType: "BENEFICIARY",
                  customerId: kycData.customerId,
                  customerName: companyKycDetailsOrig.name,
                  statusList: ["APPROVED", "REJECTED"]
                })
              ]);
            } else if (beneficiary.kycStatus === "INPROCESS") {
              kycData.beneficiaryKYCData.push([
                index,
                beneficiary.name,
                // beneficiary.contactDetail,
                // '',
                // '',
                "",
                "",
                "",
                this.getInprocessKYCButton(),
                "",
                this.getBeneficiaryStatusButton(beneficiary.beneficiaryStatus, {
                  taskId: beneficiary.beneficiaryId,
                  taskType: "BENEFICIARY",
                  customerId: kycData.customerId,
                  customerName: companyKycDetailsOrig.name,
                  statusList: ["APPROVED", "REJECTED"]
                })
              ]);
            } else {
              kycData.beneficiaryKYCData.push([
                index,
                beneficiary.name,
                //beneficiary.contactDetail, '', '',
                "",
                "",
                "",
                "",
                "",
                ""
              ]);
            }
          });
      }
    }

    this.setState({
      showCustomerKYCStatus: true,
      taskDetails: taskDetails,
      kycInfo: kycData,
      customerRegistrationDetails: CustomerRegistrationData
    });
  };
  getCustomerKYCInfo = async (customerId, cb) => {
    this.setState({ callInProgress: true });
    // ADMIN_CUSTOMER_KYC_DETAILS
    // customerId = 14;
    // API.get("/fx-kyc/kyc/customer/" + customerId, {
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_KYC_DETAILS + customerId,
      authToken: sessionStorage.getItem("token")
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
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      cb(res.data);
    }
  };
  openKYCStatus = (taskDetails, event) => {
    event.preventDefault();
    event.stopPropagation();

    const customerId = taskDetails.customerId;
    this.getCustomerKYCInfo(customerId, data => {
      const kycInfo = data;
      this.getDirectorKycData(kycInfo, taskDetails);
    });
  };
  refreshKycData = customerId => {
    this.getCustomerKYCInfo(customerId, data => {
      this.setState({ showCustomerKYCStatus: false });
      const kycInfo = data;
      this.getDirectorKycData(kycInfo, {});
    });
  };
  updateCustomerKyc = customerId => {};
  closeCustomerKYCStatus = () => {
    this.setState({
      showCustomerKYCStatus: false,
      kycInfo: null,
      customerRegistrationData: null,
      taskDetails: null,
      showAlertModal: false,
      alertData: null
    });
  };
  getAlertTypeIcon = type => {
    switch (type) {
      case "ALERT":
        return (
          <ErrorIcon
            className={cx(
              this.props.classes.errorIcon,
              this.props.classes.icon
            )}
          />
        );
      case "INFO":
        return (
          <InfoIcon
            className={cx(this.props.classes.infoIcon, this.props.classes.icon)}
          />
        );
      case "VERIFICATION":
        return (
          <AddCircleIcon
            className={cx(this.props.classes.addIcon, this.props.classes.icon)}
          />
        );
    }
  };
  showAlertStatus = alertData => {
    let alertTableData = [];
    alertData &&
      alertData.forEach((alert, index) => {
        alertTableData.push([
          index,
          this.getAlertTypeIcon(alert.type),
          alert.ruleId,
          alert.message,
          alert.riskScore
        ]);
      });
    this.setState({
      showAlertModal: true,
      alertData: alertTableData
    });
  };
  closeAlertModal = () => {
    this.setState({
      showAlertModal: false,
      alertData: null
    });
  };
  showCompanySanctions = companySanctions => {
    // adding Company Sanctions data
    const fillButtons = value => {
      if (value === null) {
        return <>No Data</>;
      } else {
        return value ? (
          <CheckIcon
            className={cx(
              this.props.classes.editSanctionIcon,
              this.props.classes.icon
            )}
          />
        ) : (
          <CloseIcon
            className={cx(
              this.props.classes.closeSanctionIcon,
              this.props.classes.icon
            )}
          />
        );
      }
    };

    let beneficiaryCompanySanction = companySanctions;
    if (beneficiaryCompanySanction) {
      beneficiaryCompanySanction.companySanctionNegativeDataColumn = [
        "Negative Data Type",
        "Present"
      ];
      beneficiaryCompanySanction.companySanctionTypeColumn = [
        "Sanction Type",
        "Previously",
        "Currently"
      ];
      beneficiaryCompanySanction.companySanctionDocumentsColumn = [
        "Sanction Name",
        "Original Href",
        "Secure Href"
      ];
      beneficiaryCompanySanction.companyInsolventsColumn = [
        "Original Href",
        "Secure Href"
      ];

      let negativeData = [];
      negativeData.push([
        0,
        "Politically Exposed",
        fillButtons(companySanctions.pep)
      ]);
      negativeData.push([
        1,
        "PEP Level",
        fillButtons(companySanctions.pepLevel || null)
      ]);
      negativeData.push([
        2,
        "Financial Regulator",
        fillButtons(
          companySanctions.notes &&
            companySanctions.notes["Financial Regulator"]
        )
      ]);
      negativeData.push([
        3,
        "Adverse Media",
        fillButtons(companySanctions.notes["Adverse Media"])
      ]);
      negativeData.push([
        4,
        "Insolvent",
        fillButtons(companySanctions.insolvent)
      ]);
      negativeData.push([
        5,
        "Disqualified Director",
        fillButtons(companySanctions.disqualifiedDirector)
      ]);
      negativeData.push([
        6,
        "Law Enforcement",
        fillButtons(companySanctions.lawEnforcement)
      ]);
      beneficiaryCompanySanction.companySanctionNegativeData = negativeData;

      let typeData = [];
      typeData.push([
        0,
        "AUSTRAC",
        fillButtons(companySanctions.austracPreviousSanction),
        fillButtons(companySanctions.austracCurrentSanction)
      ]);
      typeData.push([
        1,
        "EU",
        fillButtons(companySanctions.eupreviousSanction),
        fillButtons(companySanctions.eucurrentSanction)
      ]);
      typeData.push([
        2,
        "HMT",
        fillButtons(companySanctions.hmtpreviousSanction),
        fillButtons(companySanctions.hmtcurrentSanction)
      ]);
      typeData.push([
        3,
        "OFAC",
        fillButtons(companySanctions.ofacpreviousSanction),
        fillButtons(companySanctions.ofaccurrentSanction)
      ]);
      typeData.push([
        4,
        "UN",
        fillButtons(companySanctions.unpreviousSanction),
        fillButtons(companySanctions.uncurrentSanction)
      ]);
      beneficiaryCompanySanction.companySanctionTypeData = typeData;

      let documentsData = [];
      companySanctions.sanctionDocuments &&
        companySanctions.sanctionDocuments.forEach((document, index) => {
          documentsData.push([
            index,
            document.sactionName,
            this.getDocumentLink(document.origionalHref),
            this.getDocumentLink(document.secureHref)
          ]);
        });
      beneficiaryCompanySanction.sanctionDocumentsData = documentsData;

      let insolventsData = [];
      companySanctions.insolvents &&
        companySanctions.insolvents.forEach((insolvent, index) => {
          insolventsData.push([
            index,
            this.getDocumentLink(insolvent.origionalHref),
            this.getDocumentLink(insolvent.secureHref)
          ]);
        });
      beneficiaryCompanySanction.insolventsData = insolventsData;
    }

    this.setState({
      showCompanySanctionsModal: true,
      companySanctionsData: beneficiaryCompanySanction
    });
  };
  closeCompanySanctionsModal = () => {
    this.setState({
      showCompanySanctionsModal: false,
      companySanctionsData: null
    });
  };
  handleDeleteDirectorCompany = (customerId, kycEntityId) => {
    this.setState({
      confirmationModal: true,
      confirmationModalHeader: "KYC Data",
      confirmationModalMsg: "Are you sure you want to delete this entry",
      deleteCustomerId: customerId,
      deleteKycEntityId: kycEntityId
    });
  };
  handleNegativeResponse = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      deleteCustomerId: "",
      deleteKycEntityId: ""
    });
  };
  handlePositiveResponse = async () => {
    const customerId = this.state.deleteCustomerId;
    const kycEntityId = this.state.deleteKycEntityId;
    this.handleNegativeResponse();
    // Call API to delete director and refresh
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "DELETE",
      url:
        endpoint.ADMIN_CUSTOMER_KYC_DELETE +
        "?customerId=" +
        customerId +
        "&kycEntityId=" +
        kycEntityId,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(customerId);
    }
  };
  handleDirectorClose = () => {
    this.setState({ showAddDirector: false, editDirector: null });
  };
  handleEditDirector = async (customerId, kycEntityId) => {
    // Call API to get Director and show popup
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url:
        endpoint.CUSTOMER_FIND +
        "?customerId=" +
        customerId +
        "&kycEntityId=" +
        kycEntityId,
      authToken: sessionStorage.getItem("token")
    });

    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.setState({ showAddDirector: true, editDirector: res.data });
    }
  };
  addDirector = director => {
    // Do Nothing
  };
  updateDirector = async director => {
    console.log(director);
    this.setState({ callInProgress: true });
    let updatedDirector = { ...director };
    updatedDirector.countryCode = updatedDirector.alpha2Code;
    const res = await apiHandler({
      url: endpoint.CUSTOMER_PERSONONLY,
      method: "POST",
      data: updatedDirector,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(director.customerId);
    }
  };
  handleCustomerClose = () => {
    this.setState({ showAddCustomer: false });
  };
  handleEditCustomer = async (customerId, kycEntityId) => {
    // Call API to get Data and Show Edit Customer popup
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url:
        endpoint.CUSTOMER_FIND +
        "?customerId=" +
        customerId +
        "&kycEntityId=" +
        kycEntityId,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.setState({ showAddCustomer: true, editCustomer: res.data });
    }
  };
  addCustomer = company => {
    // Do Nothing
  };
  updateCustomer = async company => {
    console.log(company);
    const addonCompany = {
      customerId: company.customerId,
      additionalCompany: true,
      ...company
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_COMPANY_ONLY,
      data: addonCompany,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.handleCustomerClose();
      this.refreshKycData(company.customerId);
    }
  };
  executeKYC = async (customerId, kycEntityId) => {
    // Call API to delete director and refresh
    this.setState({ callInProgress: true });

    const data = {
      customerId: customerId,
      kycEntityId: kycEntityId
    };
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.KYC_CUSTOMER_EXCUTEKYC,
      data: data,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(customerId);
    }
  };
  performDirectorKYC = async (directorId, customerRegistrationDetails) => {
    this.setState({ callInProgress: true });
    let director = customerRegistrationDetails.directors.find(dir => {
      return dir.directorId === directorId;
    });
    const directorData = {
      customerId: customerRegistrationDetails.customerId,
      companyName: customerRegistrationDetails.companyName,
      additionalDirector: false,
      ...director
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_PERSON_ONLY,
      data: directorData,
      authToken: sessionStorage.getItem("token")
    });

    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(customerRegistrationDetails.customerId);
    }
  };
  performCompanyKYC = async customerRegistrationDetails => {
    this.setState({ callInProgress: true });

    let registeredAddress = customerRegistrationDetails.addresses.find(
      address => {
        return address.addressType === "REGISTERED_OFFICE_ADDRESS";
      }
    );
    let ownershipType = "";
    switch (customerRegistrationDetails.ownershipType) {
      case "2":
        ownershipType = "Private";
        break;
      case "3":
        ownershipType = "Public";
        break;
    }
    const customerData = {
      customerId: customerRegistrationDetails.customerId,
      companyName: customerRegistrationDetails.companyName,
      companyDesc: customerRegistrationDetails.companyDesc,
      email: customerRegistrationDetails.email,
      phoneNumber: customerRegistrationDetails.phoneNumber,
      incorporationNumber: customerRegistrationDetails.incorporationNumber,
      ownershipType: ownershipType,
      registeredOfficeAddress: registeredAddress,
      additionalCompany: false
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_COMPANY_ONLY,
      data: customerData,
      authToken: sessionStorage.getItem("token")
    });

    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(customerRegistrationDetails.customerId);
    }
  };
  performKYC = async customerRegistrationDetails => {
    this.setState({ callInProgress: true });

    let registeredAddress = customerRegistrationDetails.addresses.find(
      address => {
        return address.addressType === "REGISTERED_OFFICE_ADDRESS";
      }
    );
    let ownershipType = "";
    switch (customerRegistrationDetails.ownershipType) {
      case "2":
        ownershipType = "Private";
        break;
      case "3":
        ownershipType = "Public";
        break;
    }
    const customerData = {
      customerId: customerRegistrationDetails.customerId,
      companyName: customerRegistrationDetails.companyName,
      companyDesc: customerRegistrationDetails.companyDesc,
      email: customerRegistrationDetails.email,
      phoneNumber: customerRegistrationDetails.phoneNumber,
      incorporationNumber: customerRegistrationDetails.incorporationNumber,
      ownershipType: ownershipType,
      registeredOfficeAddress: registeredAddress,
      directors: customerRegistrationDetails.directors
    };
    //KYC_CUSTOMER_COMPANYANDDIRECTORS
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_CUSTOMER_COMPANYANDDIRECTORS,
      data: customerData,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(customerRegistrationDetails.customerId);
    }
  };
  closeIDCheck = () => {
    this.setState({
      showIDCheckDetails: false,
      showPerformIDCheck: false,
      idCheckDetails: null,
      idCheckRequiredData: null
    });
  };
  showIDCheck = beneficiaryData => {
    this.setState({
      showIDCheckDetails: true,
      idCheckDetails: beneficiaryData
    });
  };
  updateIDCheck = async record => {
    this.setState({ callInProgress: true });
    console.log(record);
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CUSTOMER_IDENTITYCHECK,
      data: record,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(record.customerId);
    }
  };
  performIDCheck = directorDetails => {
    this.setState({
      showPerformIDCheck: true,
      idCheckRequiredData: directorDetails
    });
  };
  showBeneficiaryChangeStatus = taskDetails => {
    this.setState({
      showChangeStatusDialog: true,
      taskDetails: taskDetails
    });
  };
  updateBeneficiaryStatus = async taskUpdatedInfo => {
    this.closeChangeStatusDialog();
    this.setState({ callInProgress: true });

    const record = {
      memberName: taskUpdatedInfo.memberName,
      reportDate: taskUpdatedInfo.reportDate,
      customerId: taskUpdatedInfo.customerId,
      customerName: taskUpdatedInfo.customerName,
      type: "BENEFICIARY_KYC_STATUS",
      reason: taskUpdatedInfo.reason,
      documentLinks: taskUpdatedInfo.supportingDocs,
      signature: taskUpdatedInfo.signature,
      activityId: taskUpdatedInfo.taskId,
      status: taskUpdatedInfo.status,
      approved: taskUpdatedInfo.status === "APPROVED"
    };
    console.log(record);
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_CUSTOMER_DUEDILIGENCE_CREATE,
      data: record,
      authToken: sessionStorage.getItem("token")
    });

    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      this.refreshKycData(record.customerId);
    }
  };
  showKycChangeStatus = taskDetails => {
    this.setState({
      showCustomerKYCStatus: false,
      kycInfo: null,
      showChangeStatusDialog: true,
      taskDetails: taskDetails
    });
  };
  downloadReport = () => {
    let wb = xlsx.utils.book_new();
    wb.SheetNames.push(this.state.exportedFileName);
    const data = this.getDownloadData();
    let ws = xlsx.utils.aoa_to_sheet(data);
    wb.Sheets[this.state.exportedFileName] = ws;
    xlsx.writeFile(wb, this.getDownloadFile());
  };
  getDownloadData = () => {
    let filterData = [DashboardColumns[this.state.selectedIndicator] || []];
    this.state.downloadFilterData &&
      this.state.downloadFilterData.forEach(task =>
        filterData.push([
          task[1],
          task[2],
          task[3],
          task[4],
          task[5],
          task[6],
          task[7]
        ])
      );
    return filterData;
  };
  getDownloadFile = () => {
    return this.state.exportedFileName + "_" + formatDate(Date.now()) + ".xlsx";
  };
  render() {
    const { classes } = this.props;
    const taskTypes =
      this.state.selectedIndicator === "tasks"
        ? this.state.taskTypes
        : this.state.selectedIndicator === "adminPendingTasks"
        ? this.state.adminTaskTypes
        : [];
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={11} lg={11}>
            <GridContainer justify="center">
              <GridItem xs={4} sm={4} md={2} lg={2}>
                <h4 className={classes.header} style={{ float: "left" }}>
                  <b>Indicators</b>
                </h4>
              </GridItem>
              <GridItem xs={8} sm={8} md={7} lg={7}>
                <Button
                  color="info"
                  size="sm"
                  round
                  style={{ float: "left" }}
                  onClick={this.handleClickPendingTasksMenuOpen}
                >
                  <h4 style={{ margin: 5 }}>
                    <b>Pending Tasks</b>
                  </h4>
                  <ArrowDropDownIcon />
                </Button>
                <Menu
                  id="report-menu"
                  elevation={0}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                  }}
                  MenuListProps={{
                    style: {
                      border: "1px solid #d3d4d5",
                      borderRadius: "3px",
                      boxShadow:
                        "0 2px 5px 0 rgba(' + hexToRgb(blackColor) + ', 0.26)"
                    }
                  }}
                  anchorEl={this.state.anchorReportEl}
                  keepMounted
                  open={Boolean(this.state.anchorReportEl)}
                  onClose={this.handleClickPendingTasksMenuClose}
                >
                  <MenuItem onClick={() => this.handleIndicatorClick("tasks")}>
                    {"Clients"}
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      this.handleIndicatorClick("adminPendingTasks")
                    }
                  >
                    {"FXG"}
                  </MenuItem>
                </Menu>
              </GridItem>
              <GridItem xs={12} sm={12} md={3} lg={3}>
                <h4 className={classes.header} style={{ float: "left" }}>
                  <b>Payment Status</b>
                </h4>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} sm={12} md={11} lg={11}>
            <GridContainer justify="center">
              <GridItem xs={4} sm={4} md={2} lg={2}>
                <GridItem xs={12} sm={12} md={12} lg={11}>
                  <DashboardIndicators
                    headingColor={"info"}
                    heading={" "}
                    icon={"people"}
                    title={"Active Clients"}
                    count={this.state.activeClientCount}
                    toggleName={"To date"}
                    onClick={() => this.handleIndicatorClick("active")}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={11}>
                  <DashboardIndicators
                    headingColor={"info"}
                    heading={" "}
                    icon={"people"}
                    title={"KYC Pending"}
                    count={this.state.kycPendingCount}
                    toggleName={"To date"}
                    onClick={() => this.handleIndicatorClick("kycPending")}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={11}>
                  <DashboardIndicators
                    headingColor={"info"}
                    heading={" "}
                    icon={"people"}
                    title={"To Pay"}
                    count={this.state.toPayCount}
                    toggleName={"This Week"}
                    onClick={() => this.handleIndicatorClick("toPay")}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={11}>
                  <DashboardIndicators
                    headingColor={"info"}
                    heading={" "}
                    icon={"people"}
                    title={"Margin Top-up"}
                    count={this.state.marginTopupCount}
                    toggleName={"All Pending deals"}
                    onClick={() =>
                      this.handleIndicatorClick("marginTopupRequired")
                    }
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={11}>
                  <DashboardIndicators
                    headingColor={"info"}
                    heading={" "}
                    icon={"people"}
                    title={"FX Spot"}
                    count={this.state.upcomingSpotTradeCount}
                    toggleName={"This Week"}
                    onClick={() =>
                      this.handleIndicatorClick("upcomingSpotTrade")
                    }
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={11}>
                  <DashboardIndicators
                    headingColor={"info"}
                    heading={" "}
                    icon={"people"}
                    title={"To Recieve"}
                    count={this.state.toReceiveCount}
                    toggleName={"This Week"}
                    onClick={() => this.handleIndicatorClick("toReceive")}
                  />
                </GridItem>
              </GridItem>
              <GridItem xs={8} sm={8} md={7} lg={7}>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <Card>
                    <CardBody className={classes.cardBody}>
                      <GridContainer justify="flex-end">
                        <GridItem xs={false} sm={false} md={1} lg={false} />
                        <GridItem
                          xs={6}
                          sm={6}
                          md={3}
                          lg={3}
                          style={{ textAlign: "right" }}
                          className={classes.title}
                        >
                          {(this.state.selectedIndicator === "tasks" ||
                            this.state.selectedIndicator ===
                              "adminPendingTasks") && (
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu
                                }}
                                value={this.state.searchDueDateOption}
                                onChange={this.handleDueDateOption}
                                inputProps={{
                                  name: "dueDateOption",
                                  id: "dueDateOption",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown
                                  }
                                }}
                              >
                                <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem
                                  }}
                                  value={"All"}
                                  key={"dueDateOption"}
                                >
                                  All Task
                                </MenuItem>
                                {this.state.dueDateOptions &&
                                  this.state.dueDateOptions.map(item => (
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value={item}
                                      key={item}
                                    >
                                      {item}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          )}
                        </GridItem>
                        <GridItem
                          xs={6}
                          sm={6}
                          md={3}
                          lg={3}
                          style={{ textAlign: "right" }}
                          className={classes.title}
                        >
                          {(this.state.selectedIndicator === "tasks" ||
                            this.state.selectedIndicator ===
                              "adminPendingTasks") && (
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu
                                }}
                                value={this.state.searchTaskType}
                                onChange={this.handleSearchTaskType}
                                inputProps={{
                                  name: "searchTaskType",
                                  id: "searchTaskType",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown
                                  }
                                }}
                              >
                                <MenuItem
                                  classes={{
                                    root: classes.selectMenuItem
                                  }}
                                  value={"All"}
                                  key={"searchTaskType"}
                                >
                                  All Task Types
                                </MenuItem>
                                {taskTypes &&
                                  taskTypes.map(item => (
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value={item}
                                      key={item}
                                    >
                                      {item}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          )}
                        </GridItem>
                        <GridItem
                          xs={6}
                          sm={6}
                          md={5}
                          lg={5}
                          style={{ textAlign: "right" }}
                          className={classes.title}
                        >
                          <div
                            style={{ display: "inline-block", float: "right" }}
                          >
                            <CustomInput
                              labelText="Search"
                              id="search"
                              formControlProps={{
                                className: classes.top + " " + classes.search
                              }}
                              inputProps={{
                                placeholder: "Search",
                                inputProps: {
                                  "aria-label": "Search",
                                  className: classes.searchInput,
                                  value: this.state.searchName,
                                  onChange: event =>
                                    this.searchClientList("search", event)
                                }
                              }}
                            />
                            <Button
                              color="white"
                              aria-label="edit"
                              justIcon
                              round
                              className={classes.searchButton}
                            >
                              <Search
                                className={
                                  classes.headerLinksSvg +
                                  " " +
                                  classes.searchIcon
                                }
                              />
                            </Button>
                            <IconButton
                              aria-label="download report"
                              onClick={() => this.downloadReport()}
                              style={{
                                color: "#53ac57",
                                visibility:
                                  this.state.selectedIndicator === "tasks" ||
                                  this.state.selectedIndicator ===
                                    "adminPendingTasks"
                                    ? ""
                                    : "hidden"
                              }}
                            >
                              <Tooltip
                                id="tooltip-totalSales"
                                title="Download"
                                placement="top"
                                classes={{ tooltip: classes.tooltipCalculator }}
                              >
                                <CloudDownloadIcon />
                              </Tooltip>
                              {/* <CSVLink
                                data={this.getDownloadData()}
                                filename={this.getDownloadFile()}
                                className="hidden"
                                ref={this.csvDownloadLink}
                                target="_blank"
                              /> */}
                            </IconButton>
                          </div>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{ textAlign: "left" }}
                          className={classes.title}
                        >
                          <Table
                            hover
                            tableHeaderColor="gray"
                            tableHead={this.state.taskColumns}
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
                            onClick={this.indicatorTableRowClick}
                            onClickColumnHeader={this.onClickColumnHeader}
                            columnsDetails={this.state.columnDetails}
                            columnSortKey={this.state.columnSortKey}
                            sortByAscending={this.state.sortByAscending}
                          />
                          <Pagination
                            pages={this.getPageDetails()}
                            currentPage={this.state.selectedPageIndex}
                            color="info"
                            onClick={this.getPageData}
                          />
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridItem>
              <GridItem xs={12} sm={12} md={3} lg={3}>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <Card>
                    <CardBody className={classes.cardBody}>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <h5>Showing Last 12 enteries</h5>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <Table
                          striped
                          tableHead={this.state.paymentColumns}
                          tableData={this.getPendingPaymentRows()}
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
                      </GridItem>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridItem>
            </GridContainer>
            <DealExecutedDialog
              showModal={this.state.isDealExecuted}
              trade={this.state.dealDetails}
              dealType={this.state.dealTypeForDlg}
              closeModal={this.closeDealModal}
              isDashboard={this.state.isDashboard}
              isAdminDeal={this.state.isAdminDeal}
            />
            <CustomerRegistrationDialog
              showModal={this.state.showCustomerRegistrationDetails}
              customerRegistrationDetails={
                this.state.customerRegistrationDetails
              }
              closeModal={this.closeCustomerRegistrationDetails}
            />
            <EnquiryDialog
              showModal={this.state.showEnquiryDetails}
              enquiryDetails={this.state.enquiryDetails}
              closeModal={this.closeEnquiryDetails}
            />
            <ChangeStatusDialog
              showModal={this.state.showChangeStatusDialog}
              closeModal={this.closeChangeStatusDialog}
              taskInfo={this.state.taskDetails}
              updateStatus={this.updateTaskStatus}
            />
            <CustomerKYCStatus
              showModal={this.state.showCustomerKYCStatus}
              closeModal={this.closeCustomerKYCStatus}
              taskInfo={this.state.taskDetails}
              updateStatus={this.showKycChangeStatus}
              customerRegistrationDetails={
                this.state.customerRegistrationDetails
              }
              kycInfo={this.state.kycInfo}
              performKYC={this.performKYC}
              refreshKycData={this.refreshKycData}
              updateCustomerKyc={this.updateCustomerKyc}
              showAlertModal={this.state.showAlertModal}
              handleAlertClose={this.closeAlertModal}
              alertData={this.state.alertData}
            />
            <CompanyKYCSanctions
              showModal={this.state.showCompanySanctionsModal}
              closeModal={this.closeCompanySanctionsModal}
              record={this.state.companySanctionsData}
            />
            <IdCheckPerform
              showModal={this.state.showPerformIDCheck}
              closeModal={this.closeIDCheck}
              updateIDCheck={this.updateIDCheck}
              idCheckRequiredData={this.state.idCheckRequiredData}
            />
            <IdCheckDetails
              showModal={this.state.showIDCheckDetails}
              closeModal={this.closeIDCheck}
              record={this.state.idCheckDetails}
            />
            <AddDirectors
              handleClose={this.handleDirectorClose}
              showModal={this.state.showAddDirector}
              addDirector={this.updateDirector}
              directors={this.state.directors}
              editDirector={this.state.editDirector}
              updateDirector={this.updateDirector}
              isAddon={this.state.isAddon}
            />
            <AddCustomers
              handleClose={this.handleCustomerClose}
              showModal={this.state.showAddCustomer}
              addCustomer={this.updateCustomer}
              customers={this.state.customers}
              editCustomer={this.state.editCustomer}
              updateCustomer={this.updateCustomer}
            />
            <NoticeModal
              noticeModal={this.state.noticeModal}
              noticeModalHeader={this.state.noticeModalHeader}
              noticeModalErrMsg={this.state.noticeModalErrMsg}
              closeModal={this.closeNoticeModal}
            />
            <ConfirmationModal
              confirmationModal={this.state.confirmationModal}
              confirmationModalHeader={this.state.confirmationModalHeader}
              confirmationModalMsg={this.state.confirmationModalMsg}
              handleNegativeButton={this.handleNegativeResponse}
              handlePositiveButton={this.handlePositiveResponse}
            />
          </GridItem>
        </GridContainer>

        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
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
        )}
      </>
    );
  }
}

AdminDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.any
};

// export default withStyles(styles)(AdminDashboard);
export default withRouter(withStyles(styles)(AdminDashboard));
