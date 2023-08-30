import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
import CloseIcon from "@material-ui/icons/Close";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Select from "@material-ui/core/Select";

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FormControl from "@material-ui/core/FormControl";
import Button from "components/CustomButtons/Button.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
import LPPayments from "./LPPayments.jsx";
import StatusActivityTrackingDialog from "views/Components/StatusActivityTrackingDialog.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import UnschedulePaymentModal from "./UnschedulePaymentModal.jsx";

import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import {
  formatMoney,
  formatDate,
  parseDate,
  shortenDealId,
  sortArray
} from "utils/Utils";
import Tooltip from "@material-ui/core/Tooltip";

import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";

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
  customDateControlClasses: {
    paddingTop: 0
  },
  filterRow: {
    marginBottom: 15
  },
  filterLabel: {
    textAlign: "right",
    marginTop: 10
  },
  flr: {
    float: "right"
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
  },
  loginMaxWidth: {
    maxWidth: 380
  }
};
const DealsColumnsDetails = [
  { name: "Deal ID", dataType: "string", key: "dealId", sort: true },
  { name: "LP Name", dataType: "string", key: "customerName", sort: true },
  { name: "Deal Date", dataType: "date", key: "dealDate", sort: true },
  {
    name: "Settlement Date",
    dataType: "date",
    key: "settlementDate",
    sort: true
  },
  {
    name: "Amount Due from Client",
    dataType: "number",
    key: "expectedFromCustomer",
    sort: true
  },
  {
    name: "Amount Received from Client",
    dataType: "number",
    key: "receivedFromCustomer",
    sort: true
  },
  {
    name: "Amount To be Paid to LP",
    dataType: "number",
    key: "sellAmount",
    sort: true
  },
  {
    name: "Amount Paid to LP",
    dataType: "number",
    key: "sellAmount",
    sort: true
  },
  {
    name: "Amount Due from LP",
    dataType: "number",
    key: "buyAmount",
    sort: true
  },
  {
    name: "Amount Received from LP",
    dataType: "number",
    key: "buyAmount",
    sort: true
  },
  // { name: "Status", dataType: "", key: "sellAmountStatus", sort: false },
  { name: "Action", dataType: "", key: "", sort: false }
];
const DealColumns = [
  "Deal ID",
  "LP Name",
  "Deal Date",
  "Settlement Date",
  "Amount Due from Client",
  "Amount Received from Client",
  "Amount To be Paid to LP",
  "Amount Paid to LP",
  "Amount Due from LP",
  "Amount Received from LP",
  // "Status",
  "Action"
];

class PaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
      showModal: true,
      dealColumns: DealColumns,
      downloadReportData: [],
      reportList: [],
      recordsPerPage: 10,
      selectedPageIndex: 1,
      selectedReportList: [],
      batchDealList: {},
      searchDuration: "This Week",
      durations: ["Today", "Yesterday", "This Week", "This Month"],
      searchFromDate: null,
      searchToDate: null,
      isDashboard: true,
      isDealExecuted: false,
      dealDetails: {},
      dealTypeForDlg: "",
      showActivityTrackingDialog: false,
      activities: [],
      sortByAscending: true,
      columnSortKey: "",
      apiData: [],
      showPayments: false,
      dealPaymentsList: [],
      dealPaymentsBatchId: "",
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      unscheduleModal: false,
      unscheduleModalHeader: "",
      unscheduleModalMsg: "",
      selectedDealId: -1
    };
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  closePaymentModal = () => {
    this.setState({
      showPayments: false,
      dealPaymentsList: [],
      dealPaymentsBatchId: ""
    });
  };
  componentDidMount = () => {
    this.getPaymentList();
  };
  handleNegativeButton = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      unscheduleModal: false,
      unscheduleModalHeader: "",
      unscheduleModalMsg: "",
      selectedDealId: -1
    });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let beneficiary = {};
      //   if (props.showModal) {
      //     beneficiary = PaymentList.initialState;
      //     if (props.showEditBeneficiary) {
      //       beneficiary = { ...beneficiary, ...props.beneficiary };
      //     }
      //   }

      return {
        showModal: props.showModal,
        ...beneficiary
      };
    }
    return null;
  }
  closeActivityTrackingDetails = () => {
    this.setState({
      activities: null,
      showActivityTrackingDialog: false
    });
  };
  getNetAmount = async (batchId) => {

    const { lpName } = this.props;
    // ADMIN_TRADE_FIND
    const res = await apiHandler({
      url:
        endpoint.ADMIN_LP_NET_AMOUNT_STATUS +
        "?batchId=" +
        batchId +
        "&lp=" +
        lpName,
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
      this.parseIndicatorPaymentsData(batchId, res.data);
    }
  };
  parseIndicatorPaymentsData = (batchId, data) => {
    let reportData = [];
    data.forEach(pay => {
      let row = [
        pay.id,
        pay.liquidityProvider,
        formatDate(pay.settlementDate),
        pay.currency,
        pay.status === "TOPAY"
          ? formatMoney(pay.amount) + " " + pay.currency
          : "0.00",
        pay.status === "PAID"
          ? formatMoney(pay.amount) + " " + pay.currency
          : "0.00",
        pay.status === "TORECEIVE"
          ? formatMoney(pay.amount) + " " + pay.currency
          : "0.00",
        pay.status === "RECEIVED"
          ? formatMoney(pay.amount) + " " + pay.currency
          : "0.00",
        pay.status,
        this.getPaymentActionButton(pay.status, pay.id)
      ];
      reportData.push(row);
    });
    this.setState({
      dealPaymentsList: reportData,
      dealPaymentsBatchId: batchId,
      showPayments: true
    });
  };
  getPaymentActionButton = (status, id) => {
    let color = "success";
    if (status === "TOPAY") {
      return (
        <Button
          color={color}
          size="sm"
          round
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            return this.setState({
              confirmationModal: true,
              confirmationModalHeader: "Confirm",
              confirmationModalMsg:
                "Do you want to PAY for this net payment now ?",
              handlePositiveFunctionName: "payNetPaymentNow",
              selectedDealId: id
            });
          }}
        >
          {"Pay Now"}
        </Button>
      );
    } else return null;
  };
  payNetPaymentNow = async () => {
    const res = await apiHandler({
      url: endpoint.ADMIN_LP_NET_PAYOUT,
      method: "POST",
      data: { liquidityProviderPaymentTransferId: this.state.selectedDealId },
      authToken: sessionStorage.getItem("token")
    });
    this.handleNegativeButton();
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
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Success",
        noticeModalErrMsg: "Selected Net Payment is successfully paid"
      });
      this.getNetAmount(this.state.dealPaymentsBatchId);
    }
  };
  handleStatus = async (activityId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const res = await apiHandler({
      url:
        endpoint.ADMIN_ACTIVITY_DETAILS +
        "?type=PAYMENT&activityId=" +
        activityId,
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
      // console.log(res.data);
      if (res.data.activities && res.data.activities.length) {
        this.setState({
          showActivityTrackingDialog: true,
          activities: res.data.activities
        });
      }
    }
  };
  getStatusButton = (status, activityId) => {
    let color = "success";
    if (status === "SCHEDULED") color = "success";
    else if (status === "TOPAY") color = "warning";
    else color = null;
    return (
      <Button
        color={color}
        size="sm"
        round
        onClick={event => this.handleStatus(activityId, event)}
      >
        {status}
      </Button>
    );
  };
  getActionButton = id => {
    let color = "success";
    if (this.props.type === "SCHEDULED") {
      return (
        <Button
          color={color}
          size="sm"
          round
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            return this.setState({
              unscheduleModal: true,
              unscheduleModalHeader: "Confirm",
              unscheduleModalMsg:
                "Are you sure you want to Unschedule this deal ?",
              selectedDealId: id
            });
          }}
        >
          {"Unschedule"}
        </Button>
      );
    } else if (
      this.props.type === "TOPAY" ||
      this.props.type === "UNSCHEDULED"
    ) {
      return (
        <Button
          color={color}
          size="sm"
          round
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            return this.setState({
              confirmationModal: true,
              confirmationModalHeader: "Confirm",
              confirmationModalMsg:
                "Do you want to PAY for this deal now ?",
              handlePositiveFunctionName: "payDealNow",
              selectedDealId: id
            });
          }}
        >
          {"Pay Now"}
        </Button>
      );
    } else return null;
  };
  UnScheduleDeal = async (unscheduleReason) => {
    const res = await apiHandler({
      url: endpoint.ADMIN_LP_UNSCHEDULE_DEAL,
      method: "POST",
      data: {
        id: this.state.selectedDealId,
        status: unscheduleReason
      },
      authToken: sessionStorage.getItem("token")
    });
    this.handleNegativeButton();
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
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Success",
        noticeModalErrMsg: "Selected Deal is successfully Unschedule"
      });
      this.getPaymentList();
    }
  };
  payDealNow = async () => {
    const res = await apiHandler({
      url: endpoint.ADMIN_LP_DEAL_PAYOUT,
      method: "POST",
      data: { liquidityProviderPaymentId: this.state.selectedDealId },
      authToken: sessionStorage.getItem("token")
    });
    this.handleNegativeButton();
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
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Success",
        noticeModalErrMsg: "Selected Deal is successfully Paid"
      });
      this.getPaymentList();
    }
  };
  getPaymentButton = batchId => {
    return batchId ? (
      <Button
        color={"success"}
        size="sm"
        round
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          return this.getNetAmount(batchId)
        }}
      >
        {"Show"}
      </Button>
    ) : null;
  };
  getPaymentList = async () => {
    let fromDate = "";
    let toDate = "";
    let queryParam = "";
    // Check for Filter
    if (this.state.searchDuration !== "") {
      let currentDate = new Date();
      switch (this.state.searchDuration) {
        case "Today":
          fromDate = toDate = parseDate(currentDate);
          break;
        case "Yesterday":
          currentDate.setDate(currentDate.getDate() - 1);
          fromDate = toDate = parseDate(currentDate);
          break;
        case "This Week":
          currentDate.setDate(currentDate.getDate() - 7);
          fromDate = parseDate(currentDate);
          toDate = parseDate(new Date());
          break;
        case "This Month":
          currentDate.setMonth(currentDate.getMonth() - 1);
          fromDate = parseDate(currentDate);
          toDate = parseDate(new Date());
          break;
        default:
          break;
      }
      queryParam = "&dateFrom=" + fromDate + "&dateTo=" + toDate;
    } else if (
      this.state.searchFromDate !== null &&
      this.state.searchToDate !== null
    ) {
      fromDate = parseDate(new Date(this.state.searchFromDate));
      toDate = parseDate(new Date(this.state.searchToDate));
      queryParam = "&dateFrom=" + fromDate + "&dateTo=" + toDate;
    } else {
      let currentDate = new Date();
      let toDate = parseDate(currentDate);
      currentDate.setDate(currentDate.getDate() - 7);
      let fromDate = parseDate(currentDate);

      queryParam = "&dateFrom=" + fromDate + "&dateTo=" + toDate;
    }
    // ADMIN_TRADE_FIND
    const res = await apiHandler({
      url:
        this.props.type === "BATCH_RECEIVED"
          ? endpoint.ADMIN_LP_DEALS +
            "?limit=2000&receivedFromLpStatus=" +
            this.props.type
          : endpoint.ADMIN_LP_DEALS + "?limit=2000&status=" + this.props.type,
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
      this.setState({
        apiData: res.data ? res.data : [],
        columnSortKey: ""
      });
      this.parseIndicatorData(res.data);
    }
  };
  parseIndicatorData = data => {
    let batchList = {};
    let reportData = [];
    let downloadData = [];
    downloadData.push(DealColumns);
    data.forEach(pay => {
      let row = [
        pay.dealId,
        pay.dealId,
        pay.lpName,
        formatDate(pay.dealDate),
        formatDate(pay.settlementDate),
        formatMoney(pay.expectedFromCustomer) + " " + pay.sellCurrencyCode,
        formatMoney(pay.receivedFromCustomer) + " " + pay.sellCurrencyCode,
        formatMoney(pay.sellAmount) + " " + pay.sellCurrencyCode,
        pay.sellAmountStatus === "BATCH_PAID" || pay.sellAmountStatus === "PAID"
          ? formatMoney(pay.sellAmount) + " " + pay.sellCurrencyCode
          : "0.00",
        formatMoney(pay.buyAmount) + " " + pay.buyCurrencyCode,
        pay.buyAmountStatus === "RECEIVED" || pay.buyAmountStatus === "BATCH_RECEIVED"
          ? formatMoney(pay.buyAmount) + " " + pay.buyCurrencyCode
          : "0.00",
        // this.getStatusButton(pay.sellAmountStatus, pay.dealId),
        this.getActionButton(pay.id)
      ];
      if (batchList[pay.batchId]) {
        batchList[pay.batchId] = [...batchList[pay.batchId], row];
      } else {
        batchList[pay.batchId] = [row];
      }
      reportData.push(row);
      downloadData.push([
        pay.dealId,
        pay.lpName,
        formatDate(pay.dealDate),
        formatDate(pay.settlementDate),
        formatMoney(pay.expectedFromCustomer) + " " + pay.sellCurrencyCode,
        formatMoney(pay.receivedFromCustomer) + " " + pay.sellCurrencyCode,
        formatMoney(pay.sellAmount) + " " + pay.sellCurrencyCode,
        pay.sellAmountStatus === "BATCH_PAID"
          ? formatMoney(pay.sellAmount) + " " + pay.sellCurrencyCode
          : "0.00",
        formatMoney(pay.buyAmount) + " " + pay.buyCurrencyCode,
        pay.buyAmountStatus === "RECEIVED"
          ? formatMoney(pay.buyAmount) + " " + pay.buyCurrencyCode
          : "0.00",
        pay.sellAmountStatus
      ]);
    });
    let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState({
      downloadReportData: downloadData,
      reportList: reportData,
      selectedReportList: selectedList,
      batchDealList: batchList
    });
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
  onClickDealsColumnHeader = (columnDetails, index) => {
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
    let reportData = [];

    data &&
      data.forEach(pay => {
        let row = [
          pay.dealId,
          shortenDealId(pay.dealId),
          pay.lpName,
          formatDate(pay.dealDate),
          formatDate(pay.settlementDate),
          pay.beneficiaryName,
          formatMoney(pay.amountPaid) + " " + pay.currencyCode,
          formatMoney(pay.amountPaid) + " " + pay.currencyCode,
          this.getStatusButton(pay.status, pay.dealId)
        ];

        reportData.push(row);
      });
    let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState({
      reportList: reportData,
      selectedReportList: selectedList,
      selectedPageIndex: 1,
      sortByAscending: sortByAscending,
      columnSortKey: columnKey
    });
  };
  getPageData = event => {
    let pageIndex = 0;
    let pageCount = Math.ceil(
      this.state.reportList.length / this.state.recordsPerPage
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

    let selectedList = this.state.reportList.slice(
      (pageIndex - 1) * this.state.recordsPerPage,
      pageIndex * this.state.recordsPerPage
    );
    this.setState({
      selectedPageIndex: pageIndex,
      selectedReportList: selectedList
    });
  };
  getPageDetails = () => {
    let DataCount = Math.ceil(
      this.state.reportList.length / this.state.recordsPerPage
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
  handleTableRowClick = async selectedID => {
    // let selectedRow = this.state.selectedReportList.filter(report => {
    //   return report[0] === selectedID;
    // });
    // return selectedRow.length > 0 ? selectedRow[0] : null;
    const res = await apiHandler({
      url: endpoint.ADMIN_DEAL + selectedID,
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
      let dealTypeForDlg =
        res.data.tradeType === "FXSPOT"
          ? "FxSpot"
          : res.data.tradeType === "FXFWD"
          ? "FxForward"
          : "Payment";
      this.setState({
        isDealExecuted: true,
        dealDetails: res.data,
        dealTypeForDlg: dealTypeForDlg
      });
    }
  };
  downloadReport = () => {
    this.csvDownloadLink.current.link.click();
  };
  handleSearchDuration = event => {
    this.setState(
      {
        searchDuration: event.target.value,
        searchFromDate: null,
        searchToDate: null
      },
      () => {
        this.getPaymentList();
      }
    );
  };
  handleDateChange = (name, date) => {
    // console.log(name);
    // console.log(date);
    this.setState(
      {
        [name]: date,
        searchDuration: ""
      },
      () => {
        this.getPaymentList();
      }
    );
  };
  closeDealModal = () => {
    this.setState({
      isDealExecuted: false,
      dealDetails: {},
      dealTypeForDlg: ""
    });
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={cx(classes.container)}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardBody className={classes.cardBody}>
                <GridContainer justify="flex-end">
                  <GridItem
                    xs={12}
                    sm={12}
                    md={5}
                    lg={5}
                    style={{ textAlign: "left" }}
                  >
                    <h4>DEALS</h4>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={7}
                    lg={7}
                    style={{ textAlign: "right" }}
                    className={classes.filterRow}
                  >
                    <GridContainer justify="center">
                      <GridItem
                        xs={6}
                        sm={6}
                        md={2}
                        lg={2}
                        className={classes.filterLabel}
                      >
                        <FormLabel className={cx(classes.currencyLabel)}>
                          Trade Date
                        </FormLabel>
                      </GridItem>
                      <GridItem
                        xs={6}
                        sm={6}
                        md={2}
                        lg={2}
                        style={{ textAlign: "right" }}
                      >
                        <FormControl fullWidth className={classes.filledSelect}>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            value={this.state.searchDuration}
                            onChange={this.handleSearchDuration}
                            inputProps={{
                              name: "searchDuration",
                              id: "searchDuration",
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
                              value={""}
                              key={"searchDuration"}
                            >
                              Clear search filter
                            </MenuItem>
                            {this.state.durations &&
                              this.state.durations.map(item => (
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
                      </GridItem>
                      <GridItem
                        xs={4}
                        sm={4}
                        md={2}
                        lg={2}
                        className={classes.filterLabel}
                        style={{ marginTop: 3 }}
                      >
                        <FormLabel className={cx(classes.currencyLabel)}>
                          CUSTOM
                          <DateRangeIcon />
                        </FormLabel>
                      </GridItem>
                      <GridItem
                        xs={4}
                        sm={4}
                        md={2}
                        lg={2}
                        style={{ textAlign: "right" }}
                      >
                        <CustomDateSelector
                          id="pr_searchFromDate"
                          inputProps={{
                            format: "dd MMM yyyy",
                            value: this.state.searchFromDate,
                            onChange: (date, event) =>
                              this.handleDateChange(
                                "searchFromDate",
                                date,
                                event
                              ),
                            keyboardbuttonprops: {
                              "aria-label": "change date"
                            }
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: cx(
                              classes.customDateControlClasses,
                              classes.customFormControlClasses
                            )
                          }}
                        />
                      </GridItem>{" "}
                      <GridItem
                        xs={2}
                        sm={2}
                        md={1}
                        lg={1}
                        className={classes.filterLabel}
                      >
                        <FormLabel className={cx(classes.currencyLabel)}>
                          To
                        </FormLabel>
                      </GridItem>{" "}
                      <GridItem
                        xs={4}
                        sm={4}
                        md={2}
                        lg={2}
                        style={{ textAlign: "right" }}
                      >
                        <CustomDateSelector
                          id="pr_searchToDate"
                          inputProps={{
                            format: "dd MMM yyyy",
                            value: this.state.searchToDate,
                            onChange: (date, event) =>
                              this.handleDateChange(
                                "searchToDate",
                                date,
                                event
                              ),
                            keyboardbuttonprops: {
                              "aria-label": "change date"
                            }
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: cx(
                              classes.customDateControlClasses,
                              classes.customFormControlClasses
                            )
                          }}
                        />
                      </GridItem>
                      {this.state.reportList.length > 0 && (
                        <GridItem
                          xs={4}
                          sm={4}
                          md={1}
                          lg={1}
                          style={{ textAlign: "right" }}
                        >
                          <IconButton
                            aria-label="download report"
                            onClick={() => this.downloadReport()}
                            style={{ color: "#53ac57" }}
                          >
                            <Tooltip
                              id="tooltip-totalSales"
                              title="Download"
                              placement="top"
                              classes={{
                                tooltip: classes.tooltipCalculator
                              }}
                            >
                              <CloudDownloadIcon />
                            </Tooltip>
                            <CSVLink
                              data={this.state.downloadReportData}
                              filename={
                                "Payment_" + formatDate(Date.now()) + ".csv"
                              }
                              className="hidden"
                              ref={this.csvDownloadLink}
                              target="_blank"
                            />
                          </IconButton>
                        </GridItem>
                      )}
                    </GridContainer>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ textAlign: "left" }}
                  >
                    {Object.keys(this.state.batchDealList).map(
                      (batchId, index) => (
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          key={index}
                          style={{
                            border: "2px solid #6A6A6A",
                            marginBottom: 10
                          }}
                        >
                          {batchId && batchId !== "null" ? (
                            <div style={{ display: "flex" }}>
                              <h3>Batch ID - {shortenDealId(batchId)}</h3>
                              <Button
                                color={"success"}
                                round
                                size="sm"
                                onClick={event =>
                                  {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return this.getNetAmount(batchId)
                                  }
                                }
                                style={{ marginLeft: 20 }}
                              >
                                Payments
                              </Button>
                            </div>
                          ) : null}
                          <Table
                            hover
                            tableHeaderColor="gray"
                            tableHead={this.state.dealColumns}
                            tableData={this.state.batchDealList[batchId]}
                            columnsDetails={DealsColumnsDetails}
                            columnSortKey={this.state.columnSortKey}
                            sortByAscending={this.state.sortByAscending}
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
                            onClick={this.handleTableRowClick}
                            onClickColumnHeader={this.onClickColumnHeader}
                          />
                        </GridItem>
                      )
                    )}
                    {/* <Table
                      hover
                      tableHeaderColor="gray"
                      tableHead={this.state.dealColumns}
                      tableData={this.state.selectedReportList}
                      columnsDetails={DealsColumnsDetails}
                      columnSortKey={this.state.columnSortKey}
                      sortByAscending={this.state.sortByAscending}
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
                      onClick={this.handleTableRowClick}
                      onClickColumnHeader={this.onClickColumnHeader}
                    />
                    <Pagination
                      pages={this.getPageDetails()}
                      currentPage={this.state.selectedPageIndex}
                      color="info"
                      onClick={this.getPageData}
                    /> */}
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
            {/* <StatusActivityTrackingDialog
            showModal={this.state.showActivityTrackingDialog}
            activities={this.state.activities}
            closeModal={this.closeActivityTrackingDetails}
          /> */}
            {this.state.isDealExecuted && (
              <DealExecutedDialog
                showModal={this.state.isDealExecuted}
                trade={this.state.dealDetails}
                dealType={this.state.dealTypeForDlg}
                closeModal={this.closeDealModal}
                isDashboard={this.state.isDashboard}
                isAdminDeal={true}
              />
            )}
            {this.state.showPayments && (
              <LPPayments
                showModal={this.state.showPayments}
                payments={this.state.dealPaymentsList}
                batchId={this.state.dealPaymentsBatchId}
                closeModal={this.closePaymentModal}
              />
            )}
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
                handleNegativeButton={this.handleNegativeButton}
                handlePositiveButton={
                  this[this.state.handlePositiveFunctionName]
                }
              />
            )}
            {this.state.unscheduleModal && (
              <UnschedulePaymentModal
                confirmationModal={this.state.unscheduleModal}
                confirmationModalHeader={this.state.unscheduleModalHeader}
                confirmationModalMsg={this.state.unscheduleModalMsg}
                handleNegativeButton={this.handleNegativeButton}
                handlePositiveButton={this.UnScheduleDeal}
              />
            )}
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

PaymentList.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  lpName: PropTypes.string
};

export default withRouter(withStyles(styles)(PaymentList));
