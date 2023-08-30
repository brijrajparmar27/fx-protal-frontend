import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import BarChartIcon from "@material-ui/icons/BarChart";
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
import StatusActivityTrackingDialog from "views/Components/StatusActivityTrackingDialog.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import {
  formatDate,
  parseDate,
  shortenDealId,
  sortArray,
  formatMoney
} from "../../utils/Utils";
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

const ColumnsDetails = [
  { name: "Deal ID", dataType: "string", key: "dealId", sort: true },
  { name: "Client Name", dataType: "string", key: "customerName", sort: true },
  { name: "Trade Type", dataType: "string", key: "tradeType", sort: true },

  { name: "Trade Date", dataType: "date", key: "tradeDate", sort: true },
  {
    name: "Settlement Date",
    dataType: "date",
    key: "settlementDate",
    sort: true
  },
  {
    name: "Current Valuation",
    dataType: "number",
    key: "currentValuation",
    sort: true
  },
  {
    name: "Margin Deposited",
    dataType: "number",
    key: "currentMargin",
    sort: true
  },
  { name: "Topup room", dataType: "number", key: "topupRoom", sort: true },

  { name: "Status", dataType: "", key: "status", sort: false }
];
const Columns = [
  "Deal ID",
  "Client Name",
  "Trade Type",
  "Trade Date",
  "Settlement Date",
  "Current Valuation",
  "Margin Deposited",
  "Topup room",
  "Status"
];

class MarginReport extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
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
      isDashboard: true,
      isDealExecuted: false,
      dealDetails: {},
      dealTypeForDlg: "",
      showActivityTrackingDialog: false,
      activities: [],
      sortByAscending: true,
      columnSortKey: "",
      apiData: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }

  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  componentDidMount = () => {
    this.getMarginReport();
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
    //ADMIN_ACTIVITY_DETAILS
    const res = await apiHandler({
      url:
        endpoint.ADMIN_ACTIVITY_DETAILS +
        "?type=TRADE&activityId=" +
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
    if (status === "SETTLED" || status === "SETTELED") color = "success";
    else if (status === "PENDING") color = "warning";
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
  getMarginReport = async () => {
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
      queryParam = "&from=" + fromDate + "&to=" + toDate;
    } else if (
      this.state.searchFromDate !== null &&
      this.state.searchToDate !== null
    ) {
      fromDate = parseDate(new Date(this.state.searchFromDate));
      toDate = parseDate(new Date(this.state.searchToDate));
      queryParam = "&from=" + fromDate + "&to=" + toDate;
    } else {
      let currentDate = new Date();
      let toDate = parseDate(currentDate);
      currentDate.setDate(currentDate.getDate() - 7);
      let fromDate = parseDate(currentDate);

      queryParam = "&from=" + fromDate + "&to=" + toDate;
    }
    //ADMIN_TRADE_FIND
    const res = await apiHandler({
      url: endpoint.ADMIN_TRADE_FIND + "?type=MARGIN" + queryParam,
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
        apiData:
          res.data && res.data.customerPaymentDetails
            ? res.data.customerPaymentDetails
            : [],
        columnSortKey: ""
      });
      this.parseIndicatorData(res.data);
    }
  };
  parseIndicatorData = data => {
    let reportData = [];
    let downloadData = [];
    downloadData.push(Columns);
    data.customerPaymentDetails &&
      data.customerPaymentDetails.forEach(pay => {
        let row = [
          pay.dealId,
          shortenDealId(pay.dealId),
          pay.customerName,
          pay.tradeType,
          formatDate(pay.tradeDate),
          formatDate(pay.settlementDate),
          pay.currentValuation
            ? formatMoney(pay.currentValuation) + " " + pay.soldCurrencyCode
            : "",
          formatMoney(pay.currentMargin) + " " + pay.soldCurrencyCode,
          formatMoney(pay.topupRoom) + " " + pay.soldCurrencyCode,
          this.getStatusButton(pay.status, pay.dealId)
        ];
        reportData.push(row);
        downloadData.push([
          pay.dealId,
          pay.customerName,
          pay.tradeType,
          formatDate(pay.tradeDate),
          formatDate(pay.settlementDate),
          pay.currentValuation,
          pay.currentMargin,
          pay.topupRoom,
          pay.status
        ]);
      });
    let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState({
      downloadReportData: downloadData,
      reportList: reportData,
      selectedReportList: selectedList
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
  parseDataAfterSorting = (data, sortByAscending, columnKey) => {
    let reportData = [];

    data &&
      data.forEach(pay => {
        let row = [
          pay.dealId,
          shortenDealId(pay.dealId),
          pay.customerName,
          pay.tradeType,
          formatDate(pay.tradeDate),
          formatDate(pay.settlementDate),
          pay.currentValuation,
          pay.currentMargin,
          pay.topupRoom,
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
      url: endpoint.DEAL + "?type=MARGIN&dealId=" + selectedID,
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
      let dealTypeForDlg = "FxForward";
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
        this.getMarginReport();
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
        this.getMarginReport();
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
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={11} lg={11}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <h4 className={classes.header} style={{ float: "left" }}>
                <b>General Report</b>
              </h4>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader color="success" text>
                  <CardText color="success" style={{ float: "left" }}>
                    <BarChartIcon className={classes.listItemIcon} />
                  </CardText>
                  <h4
                    className={classes.header}
                    style={{ marginLeft: 20, color: "#3c4858" }}
                  >
                    MARGIN
                  </h4>
                </CardHeader>

                <CardBody className={classes.cardBody}>
                  <GridContainer justify="flex-end">
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
                          <FormControl
                            fullWidth
                            className={classes.filledSelect}
                          >
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
                            id="mr_searchFromDate"
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
                            id="mr_searchToDate"
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
                                classes={{ tooltip: classes.tooltipCalculator }}
                              >
                                <CloudDownloadIcon />
                              </Tooltip>
                              <CSVLink
                                data={this.state.downloadReportData}
                                filename={
                                  "Margin_" + formatDate(Date.now()) + ".csv"
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
          <StatusActivityTrackingDialog
            showModal={this.state.showActivityTrackingDialog}
            activities={this.state.activities}
            closeModal={this.closeActivityTrackingDetails}
          />
          <DealExecutedDialog
            showModal={this.state.isDealExecuted}
            trade={this.state.dealDetails}
            dealType={this.state.dealTypeForDlg}
            closeModal={this.closeDealModal}
            isDashboard={this.state.isDashboard}
          />
          {this.state.noticeModal && (
            <NoticeModal
              noticeModal={this.state.noticeModal}
              noticeModalHeader={this.state.noticeModalHeader}
              noticeModalErrMsg={this.state.noticeModalErrMsg}
              closeModal={this.closeNoticeModal}
            />
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

MarginReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(MarginReport));
