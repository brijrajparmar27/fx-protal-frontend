import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
import { CSVLink } from "react-csv";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Add from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import BarChartIcon from "@material-ui/icons/BarChart";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Select from "@material-ui/core/Select";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Search from "@material-ui/icons/Search";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FormControl from "@material-ui/core/FormControl";
import Button from "components/CustomButtons/Button.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import BeneficiaryDetails from "views/Components/admin/BeneficiaryDetails.jsx";
import PaymentModal from "views/Components/admin/PaymentModal.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import Tooltip from "@material-ui/core/Tooltip";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import StatementRecordModal from "views/Components/admin/StatementRecordModal.jsx";

import {
  formatMoney,
  formatDate,
  parseDate,
  convertUTCDateToLocalDate,
  shortenDealId,
  sortArray
} from "../../utils/Utils";

import {
  cardTitle,
  roseColor,
  successColor,
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
    marginTop: -30,
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
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black"
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
  closeDIcon: {
    backgroundColor: "#A6A6A6",
    color: "white",
    padding: 3
  },
  addIcon: {
    marginTop: 40,
    height: 45,
    width: 45,
    borderRadius: 6,
    backgroundColor: "grey"
  }
};

const Columns = [
  "ID",
  "Name",
  "Bank Name",
  "Currency Code",
  "Account ID",
  "iBAN",
  "Swift / Sort Code",
  "BIC",
  "Action"
];
const ColumnsDetails = [
  { name: "ID", dataType: "bumber", key: "fxgBeneficiaryId", sort: true },
  { name: "Name", dataType: "string", key: "name", sort: true },
  { name: "Bank Name", dataType: "string", key: "bankName", sort: true },
  { name: "Currency", dataType: "string", key: "currency", sort: true },
  {
    name: "Account ID",
    dataType: "number",
    key: "fxgBeneficiaryAccountId",
    sort: true
  },
  { name: "iBAN", dataType: "string", key: "iban", sort: true },
  {
    name: "Swift / Sort Code",
    dataType: "string",
    key: "sortCode",
    sort: true
  },
  { name: "BIC", dataType: "string", key: "swiftBic", sort: true },
  { name: "Action", dataType: "component", key: "currencySold", sort: false }
];

class FxgBeneficiaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
      currencies: [],
      Columns: Columns,
      downloadReportData: [],
      reportList: [],
      recordsPerPage: 10,
      selectedPageIndex: 1,
      selectedReportList: [],
      searchDuration: "This Week",
      durations: ["Today", "Yesterday", "This Week", "This Month"],
      searchFromDate: null,
      searchToDate: null,
      showActivityTrackingDialog: false,
      activities: [],
      sortByAscending: true,
      columnSortKey: "",
      apiData: [],
      showBeneficiaryDetails: false,
      beneficiaryDetails: null,
      wallets: {},
      showPaymentModal: false,
      selectedBeneficiary: {},
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      showStatementRecordModal: false,
      statementHeading: "",
      accountStatement: [],
      statementColumns: [
        "Transaction Id",
        "Date",
        "Reference",
        "Reason",
        "To Account Name",
        "Doc Type",
        "Doc Link",
        "Amount"
      ]
    };
  }
  handleNegativeButton = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      selectedBeneficiary: {}
    });
  };
  closeStatementRecordModal = () => {
    this.setState({
      showStatementRecordModal: false,
      statementHeading: "",
      accountStatement: []
    });
  };
  componentDidMount = () => {
    this.getBeneficiaryList();
    this.getCurrencies();
    this.getWallets();
  };
  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ currencies: res.data.currrencies });
  };
  getWallets = async () => {
    const res = await apiHandler({
      url: endpoint.ADMIN_PARENT_WALLETS_LIST,
      authToken: sessionStorage.getItem("token")
    });
    // this.setState({ currencies: res.data.currrencies });
    // Parse Wallets based on currencyCode
    let wallets = {};
    const list = res.data;
    list &&
      list[0] &&
      list.forEach(wallet => {
        wallet.balances &&
          wallet.balances.forEach(b => {
            if (wallets[b.currency]) {
              wallets[b.currency] = [...wallets[b.currency], wallet.provider];
            } else {
              wallets[b.currency] = [wallet.provider];
            }
          });
      });
    this.setState({ wallets: wallets });
  };
  closeActivityTrackingDetails = () => {
    this.setState({
      activities: null,
      showActivityTrackingDialog: false
    });
  };
  handleStatus = async (activityId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const res = await apiHandler({
      url:
        endpoint.ADMIN_ACTIVITY_DETAILS +
        "?type=TRADE&activityId=" +
        activityId,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      alert(res.data.userDesc);
      return;
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
    if (status === "SETTLED" || status === "SETTELED") color = "success";
    else if (status === "PENDING") color = "warning";
    else color = null;
    return status ? (
      <Button
        color={color}
        size="sm"
        round
        onClick={event => this.handleStatus(activityId, event)}
      >
        {status}
      </Button>
    ) : null;
  };
  getBeneficiaryList = async () => {
    // let fromDate = "";
    // let toDate = "";
    // let queryParam = "";
    // // Check for Filter
    // if (this.state.searchDuration !== "") {
    //   let currentDate = new Date();
    //   switch (this.state.searchDuration) {
    //     case "Today":
    //       fromDate = toDate = parseDate(currentDate);
    //       break;
    //     case "Yesterday":
    //       currentDate.setDate(currentDate.getDate() - 1);
    //       fromDate = toDate = parseDate(currentDate);
    //       break;
    //     case "This Week":
    //       currentDate.setDate(currentDate.getDate() - 7);
    //       fromDate = parseDate(currentDate);
    //       toDate = parseDate(new Date());
    //       break;
    //     case "This Month":
    //       currentDate.setMonth(currentDate.getMonth() - 1);
    //       fromDate = parseDate(currentDate);
    //       toDate = parseDate(new Date());
    //       break;
    //     default:
    //       break;
    //   }
    //   queryParam = "?from=" + fromDate + "&to=" + toDate;
    // } else if (
    //   this.state.searchFromDate !== null &&
    //   this.state.searchToDate !== null
    // ) {
    //   fromDate = parseDate(new Date(this.state.searchFromDate));
    //   toDate = parseDate(new Date(this.state.searchToDate));
    //   queryParam = "?from=" + fromDate + "&to=" + toDate;
    // } else {
    //   let currentDate = new Date();
    //   let toDate = parseDate(currentDate);
    //   currentDate.setDate(currentDate.getDate() - 7);
    //   let fromDate = parseDate(currentDate);

    //   queryParam = "?from=" + fromDate + "&to=" + toDate;
    // }
    const res = await apiHandler({
      url: endpoint.ADMIN_FXG_BENEFICIARY_LIST,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      alert(res.data.userDesc);
      return;
    } else {
      // console.log(res.data);
      this.parseIndicatorData(res.data);
    }
  };
  parseIndicatorData = data => {
    let reportData = [];
    let downloadData = [];
    let apiData = [];
    downloadData.push(Columns);
    data &&
      data.forEach((benef, index) => {
        let row = [
          index,
          benef.fxgBeneficiaryId ? benef.fxgBeneficiaryId : "",
          benef.name ? benef.name : "",
          benef.bankName ? benef.bankName : "",
          benef.currency,
          benef.fxgBeneficiaryAccountId,
          benef.iban,
          benef.sortCode,
          benef.swiftBic,
          this.getActionButton(benef)
        ];
        let obj = {
          fxgBeneficiaryId: benef.fxgBeneficiaryId,
          name: benef.name,
          bankName: benef.bankName,
          currency: benef.currency,
          fxgBeneficiaryAccountId: benef.fxgBeneficiaryAccountId,
          iban: benef.iban,
          sortCode: benef.sortCode,
          swiftBic: benef.swiftBic
        };
        reportData.push(row);
        apiData.push(obj);
        downloadData.push([
          benef.fxgBeneficiaryId,
          benef.name ? benef.name : "",
          benef.bankName ? benef.bankName : "",
          benef.currency,
          benef.fxgBeneficiaryAccountId,
          benef.iban,
          benef.sortCode,
          benef.swiftBic
        ]);
      });
    let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState({
      downloadReportData: downloadData,
      reportList: reportData,
      selectedReportList: selectedList,
      apiData: apiData,
      columnSortKey: ""
    });
  };
  handleStatement = async beneficiaryId => {
    const res = await apiHandler({
      url:
        endpoint.ADMIN_FXG_BENEFICIARY_STATEMENT +
        "?fxgBeneficiaryId=" +
        beneficiaryId,
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
      console.log("Statement - ", res.data);
      this.parseStatementData(res.data.transactions);
    }
  };
  getDocumentLink = link => {
    return link && link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    ) : null;
  };
  parseStatementData = data => {
    let reportData = [];
    data &&
      data.forEach((row, index) => {
        let tableRow = [
          index,
          row.transactionId,
          parseDate(convertUTCDateToLocalDate(new Date(row.createdDate))),
          row.reference,
          row.reason,
          row.creditor,
          row.supportedDocType,
          this.getDocumentLink(row.supportedDocLink),
          formatMoney(row.amount) + " " + row.currency
        ];
        reportData.push(tableRow);
      });
    this.setState({
      showStatementRecordModal: true,
      accountStatement: reportData,
      statementHeading: "Beneficiary Wallet - Statement of Account"
    });
  };
  getActionButton = benef => {
    const { classes } = this.props;
    return (
      <>
        {benef.enabled ? (
          <Check
            onClick={event =>
              this.handleEnableDisableClick(
                event,
                benef.fxgBeneficiaryId,
                benef.enabled
              )
            }
            className={cx(classes.editIcon, classes.icon)}
          />
        ) : (
          <Close
            onClick={event =>
              this.handleEnableDisableClick(
                event,
                benef.fxgBeneficiaryId,
                benef.enabled
              )
            }
            className={cx(classes.closeDIcon, classes.icon)}
          />
        )}
        <ListAltIcon
          onClick={this.handleStatement.bind(this, benef.fxgBeneficiaryId)}
          className={cx(classes.editIcon, classes.icon)}
        />
        <AccountBalanceWalletIcon
          onClick={this.initiatePayment.bind(this, benef)}
          className={cx(classes.editIcon, classes.icon)}
        />
      </>
    );
  };
  handleEnableDisableClick = (event, id, enabled) => {
    event.preventDefault();
    event.stopPropagation();
    return this.setState({
      handlePositiveFunctionName: "enableDisableBeneficiary",
      confirmationModalHeader: "Confirm",
      confirmationModalMsg: enabled
        ? "Do you want to Disable this Beneficiary now ?"
        : "Do you want to Enable this Beneficiary now ?",
      selectedBeneficiary: { id, enabled },
      confirmationModal: true
    });
  };
  enableDisableBeneficiary = async () => {
    const { id, enabled } = this.state.selectedBeneficiary;
    const record = {
      fxgBeneficiaryId: id,
      enabled: !enabled,
      remarks: enabled
        ? "Disabling the Beneficiary"
        : "Enabling the Beneficiary"
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_FXG_BENEFICIARY_UPDATE_STATUS,
      data: record,
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
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Information",
        noticeModalErrMsg:
          "Liquidity Provider is successfuly " + enabled
            ? "Disabled"
            : "Enabled"
      });
      this.getBeneficiaryList();
    }
  };
  initiatePayment = benef => {
    this.setState({
      showPaymentModal: true,
      beneficiaryDetails: {
        selecetdBeneficiary: {
          id: benef.fxgBeneficiaryId,
          name: benef.name,
          bankName: benef.bankName,
          currencyCode: benef.currency,
          iban: benef.iban,
          sortCode: benef.sortCode,
          swiftBic: benef.swiftBic
        }
      }
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
  closeBeneficiryModal = () => {
    this.setState({
      showBeneficiaryDetails: false,
      beneficiaryDetails: null
    });
  };
  addBeneficiry = async record => {
    console.log("ADD Beneficiary - ", record);
    this.closeBeneficiryModal();

    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_FXG_BENEFICIARY_CREATE,
      data: record,
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
        noticeModal: true,
        noticeModalHeader: "Information",
        noticeModalErrMsg: "New FXG Beneficiary is successfuly Created."
      });
      this.getBeneficiaryList();
    }
  };
  closePaymentModal = () => {
    this.setState({
      showPaymentModal: false,
      beneficiaryDetails: null
    });
  };
  addPayment = async record => {
    console.log("ADD Payment - ", record);
    this.closePaymentModal();

    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_FXG_BENEFICIARY_TRANSFER_FUNDS,
      data: record,
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
        noticeModal: true,
        noticeModalHeader: "Information",
        noticeModalErrMsg: "Payment is done for selected Beneficiary"
      });
      this.getBeneficiaryList();
    }
  };
  handleTableRowClick = async selectedID => {};
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
        this.getBeneficiaryList();
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
        this.getBeneficiaryList();
      }
    );
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
    let reportData = [];

    data &&
      data.forEach((benef, index) => {
        let row = [
          index,
          benef.fxgBeneficiaryId ? benef.fxgBeneficiaryId : "",
          benef.name ? benef.name : "",
          benef.bankName ? benef.bankName : "",
          benef.currency,
          benef.fxgBeneficiaryAccountId,
          benef.iban,
          benef.sortCode,
          benef.swiftBic,
          this.getActionButton(benef)
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

  render() {
    const { classes } = this.props;

    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={11} lg={11}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader color="success" text>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CardText color="success" style={{ float: "left" }}>
                        <BarChartIcon className={classes.listItemIcon} />
                      </CardText>
                      <h4
                        className={classes.header}
                        style={{ fontStyle: "bold", color: "#3c4858" }}
                      >
                        FXG Beneficiary
                      </h4>
                    </GridItem>

                    <GridItem
                      xs={4}
                      sm={4}
                      md={4}
                      lg={4}
                      style={{ textAlign: "right" }}
                    >
                      <div style={{ display: "flex", float: "right" }}>
                        <CustomInput
                          labelText="Search"
                          id="search"
                          formControlProps={{
                            className: classes.top + " " + classes.search,
                            fullWidth: true
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
                              classes.headerLinksSvg + " " + classes.searchIcon
                            }
                          />
                        </Button>
                      </div>
                    </GridItem>
                    <GridItem
                      xs={2}
                      sm={2}
                      md={2}
                      lg={2}
                      style={{ textAlign: "right", marginTop: 10 }}
                    >
                      {this.state.reportList.length > 0 && (
                        <IconButton
                          aria-label="download report"
                          onClick={() => this.downloadReport()}
                          style={{ color: "#53ac57" }}
                        >
                          <Tooltip
                            id="tooltip-totalSales"
                            title="Download"
                            placement="top"
                            classes={{ tooltip: classes.tooltipCalculator }}
                          >
                            <CloudDownloadIcon />
                          </Tooltip>
                          <CSVLink
                            data={this.state.downloadReportData}
                            filename={
                              "FxForward_" + formatDate(Date.now()) + ".csv"
                            }
                            className="hidden"
                            ref={this.csvDownloadLink}
                            target="_blank"
                          />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Add LP"
                        onClick={() =>
                          this.setState({ showBeneficiaryDetails: true })
                        }
                        style={{ color: "#53ac57" }}
                      >
                        <Tooltip
                          id="tooltip-totalSales"
                          title="You can add FXG Beneficiary details"
                          placement="top"
                          classes={{ tooltip: classes.tooltipCalculator }}
                        >
                          <Add />
                        </Tooltip>
                      </IconButton>
                    </GridItem>
                  </GridContainer>
                </CardHeader>

                <CardBody className={classes.cardBody}>
                  <GridContainer justify="flex-end">
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ textAlign: "left" }}
                    >
                      <Table
                        hover
                        tableHeaderColor="gray"
                        tableHead={this.state.Columns}
                        tableData={this.state.selectedReportList}
                        columnsDetails={ColumnsDetails}
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
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          {this.state.showPaymentModal && (
            <PaymentModal
              showModal={this.state.showPaymentModal}
              record={this.state.beneficiaryDetails}
              addPayment={this.addPayment}
              closeModal={this.closePaymentModal}
              wallets={this.state.wallets}
            />
          )}
          {this.state.showBeneficiaryDetails && (
            <BeneficiaryDetails
              showModal={this.state.showBeneficiaryDetails}
              record={this.state.beneficiaryDetails}
              type={"FXG_BENF"}
              addBeneficiary={this.addBeneficiry}
              closeModal={this.closeBeneficiryModal}
              currencies={this.state.currencies}
              wallets={this.state.wallets}
            />
          )}
          {this.state.showStatementRecordModal && (
            <StatementRecordModal
              showModal={this.state.showStatementRecordModal}
              closeModal={this.closeStatementRecordModal}
              heading={this.state.statementHeading}
              statementOfWallets={this.state.accountStatement}
              columnHeadings={this.state.statementColumns}
            />
          )}
          {this.state.confirmationModal && (
            <ConfirmationModal
              confirmationModal={this.state.confirmationModal}
              confirmationModalHeader={this.state.confirmationModalHeader}
              confirmationModalMsg={this.state.confirmationModalMsg}
              handleNegativeButton={this.handleNegativeButton}
              handlePositiveButton={this[this.state.handlePositiveFunctionName]}
            />
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

FxgBeneficiaryPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FxgBeneficiaryPage);
