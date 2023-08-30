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
  cardTitle,
  roseColor,
  successColor,
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";

import Tooltip from "@material-ui/core/Tooltip";

const ColumnsDetails=[
  {name:"Trade ID",dataType:'string', key:'clientDealId', sort:true},
  {name:'Client Name',dataType:'string',key:'customerName', sort:true},
  {name:'Deal Date / Settlement Date',dataType:'date',key:'clientDealDate', sort:true},
  {name:'Buy / Sell',dataType:'number',key:'clientCurrencyBought', sort:true},
  {name:'Status',dataType:'',key:'clientStatus', sort:false},
  {name:"Trade ID 2",dataType:'string', key:'adminDealId', sort:true},
  {name:'LP',dataType:'string',key:'liquidityProvider', sort:true},
  {name:'Deal Date / Settlement Date',dataType:'date',key:'adminDealDate', sort:true},
  {name:'Buy / Sell',dataType:'number',key:'adminCurrencySold', sort:true},
  {name:'Status',dataType:'',key:'adminStatus', sort:false},
  {name:'Net Buy / Net Sell',dataType:'number',key:'currencyBoughtDiff', sort:true}
]

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
  cellFontSize: {
    fontSize: "0.75em !important"
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

const Columns = [
  "Trade ID",
  "Client Name",
  "Deal Date / Settlement Date",
  "Buy / Sell",
  "Status",
  "Trade ID 2",
  "LP",
  "Deal Date / Settlement Date",
  "Buy / Sell",
  "Status",
  "Net Buy / Net Sell"
];

class RiskManagement extends React.Component {
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
      isAdminDeal: false,
      showActivityTrackingDialog: false,
      activities: [],
      sortByAscending:true,
      columnSortKey:'',
      apiData:[]
    };
  }

  componentDidMount = () => {
    this.getRiskManagementReport();
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
      url: endpoint.ADMIN_ACTIVITY_DETAILS + "?type=TRADE&activityId=" + activityId,
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
    if (status) {
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
    } else return null;
  };
  getRiskManagementReport = async () => {
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
      queryParam = "?from=" + fromDate + "&to=" + toDate;
    } else if (
      this.state.searchFromDate !== null &&
      this.state.searchToDate !== null
    ) {
      fromDate = parseDate(new Date(this.state.searchFromDate));
      toDate = parseDate(new Date(this.state.searchToDate));
      queryParam = "?from=" + fromDate + "&to=" + toDate;
    } else {
      let currentDate = new Date();
      let toDate = parseDate(currentDate);
      currentDate.setDate(currentDate.getDate() - 7);
      let fromDate = parseDate(currentDate);

      queryParam = "?from=" + fromDate + "&to=" + toDate;
    }
    const res = await apiHandler({
      url: endpoint.ADMIN_DEALS + queryParam,
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
      data.forEach(dealRow => {
        const { adminDeal, clientDeal } = dealRow;
        let row = [
          clientDeal.dealId,
          this.getDealLink(
            clientDeal.dealId ? shortenDealId(clientDeal.dealId) : "",
            clientDeal.tradeType,
            "CLIENT"
          ),
          clientDeal.customerName,
          this.getDoubleCellRow(
            formatDate(clientDeal.dealDate),
            formatDate(clientDeal.settlementDate)
          ),
          this.getDoubleCellRow(
            formatMoney(clientDeal.currencyBought) +
              " " +
              clientDeal.boughtCurrencyCode,
            formatMoney(clientDeal.currencySold) +
              " " +
              clientDeal.soldCurrencyCode
          ),
          this.getStatusButton(clientDeal.status, clientDeal.dealId),
          this.getDealLink(
            adminDeal.dealId ? shortenDealId(adminDeal.dealId) : "",
            adminDeal.tradeType,
            "ADMIN"
          ),
          adminDeal.liquidityProvider,
          this.getDoubleCellRow(
            formatDate(adminDeal.dealDate),
            formatDate(adminDeal.settlementDate)
          ),
          this.getDoubleCellRow(
            formatMoney(adminDeal.currencyBought) +
              " " +
              adminDeal.boughtCurrencyCode,
            formatMoney(adminDeal.currencySold) +
              " " +
              adminDeal.soldCurrencyCode
          ),
          this.getStatusButton(adminDeal.status, adminDeal.dealId),
          this.getDoubleCellRow(
            formatMoney(adminDeal.currencyBought - clientDeal.currencyBought),
            formatMoney(adminDeal.currencySold - clientDeal.currencySold)
          )
        ];
        let obj = {
          clientDealId:clientDeal.dealId,
          clientTradeType:clientDeal.tradeType,
          customerName:clientDeal.customerName,
          clientDealDate:clientDeal.dealDate,
          clientSettlementDate: clientDeal.settlementDate,
          clientCurrencyBought:clientDeal.currencyBought,
          clientBoughtCurrencyCode: clientDeal.boughtCurrencyCode,
          clientCurrencySold:clientDeal.currencySold,
          clientSoldCurrencyCode:clientDeal.soldCurrencyCode,
          clientStatus:clientDeal.status,

          adminDealId:adminDeal.dealId,
          adminTradeType:adminDeal.tradeType,
          liquidityProvider:adminDeal.liquidityProvider,
          adminDealDate:adminDeal.dealDate,
          adminSettlementDate: adminDeal.settlementDate,
          adminCurrencyBought:adminDeal.currencyBought,
          adminBoughtCurrencyCode: adminDeal.boughtCurrencyCode,
          adminCurrencySold:adminDeal.currencySold,
          adminSoldCurrencyCode:adminDeal.soldCurrencyCode,
          adminStatus:adminDeal.status,
          currencyBoughtDiff:adminDeal.currencyBought - clientDeal.currencyBought,
          currencySoldDiff:adminDeal.currencySold - clientDeal.currencySold

        };
        reportData.push(row);
        apiData.push(obj);

        downloadData.push([
          clientDeal.dealId,
          clientDeal.customerName,
          formatDate(clientDeal.dealDate),
          formatDate(clientDeal.settlementDate),
          formatMoney(clientDeal.currencySold) +
            " " +
            clientDeal.soldCurrencyCode,
          formatMoney(clientDeal.currencyBought) +
            " " +
            clientDeal.boughtCurrencyCode,
          clientDeal.status,
          adminDeal.dealId,
          adminDeal.liquidityProvider,
          formatDate(adminDeal.dealDate),
          formatDate(adminDeal.settlementDate),
          formatMoney(adminDeal.currencyBought) +
            " " +
            adminDeal.boughtCurrencyCode,
          formatMoney(adminDeal.currencySold) +
            " " +
            adminDeal.soldCurrencyCode,
          adminDeal.status,
          formatMoney(adminDeal.currencyBought - clientDeal.currencyBought),
          formatMoney(adminDeal.currencySold - clientDeal.currencySold)
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
  onClickColumnHeader=(columnDetails, index)=>{
    let arr=sortArray(this.state.apiData, columnDetails.key, !this.state.sortByAscending,columnDetails.dataType)
    this.parseDataAfterSorting(arr,  !this.state.sortByAscending, columnDetails.name)
  }
  parseDataAfterSorting=(data, sortByAscending, columnKey)=>{
    let reportData = [];

    data &&
      data.forEach(dealRow => {

        let row = [
          dealRow.clientDealId,
          this.getDealLink(
            dealRow.clientDealId ? shortenDealId(dealRow.clientDealId) : "",
            dealRow.clientTradeType,
            "CLIENT"
          ),
          dealRow.customerName,
          this.getDoubleCellRow(
            formatDate(dealRow.clientDealDate),
            formatDate(dealRow.clientSettlementDate)
          ),
          this.getDoubleCellRow(
            formatMoney(dealRow.clientCurrencyBought) +
              " " +
              dealRow.clientBoughtCurrencyCode,
            formatMoney(dealRow.clientCurrencySold) +
              " " +
              dealRow.clientSoldCurrencyCode
          ),
          this.getStatusButton(dealRow.clientStatus, dealRow.clientDealId),
          this.getDealLink(
            dealRow.adminDealId ? shortenDealId(dealRow.adminDealId) : "",
            dealRow.adminTradeType,
            "ADMIN"
          ),
          dealRow.liquidityProvider,
          this.getDoubleCellRow(
            formatDate(dealRow.adminDealDate),
            formatDate(dealRow.adminSettlementDate)
          ),
          this.getDoubleCellRow(
            formatMoney(dealRow.adminCurrencyBought) +
              " " +
              dealRow.adminBoughtCurrencyCode,
            formatMoney(dealRow.adminCurrencySold) +
              " " +
              dealRow.adminSoldCurrencyCode
          ),
          this.getStatusButton(dealRow.adminStatus, dealRow.adminDealId),
          this.getDoubleCellRow(
            formatMoney(dealRow.currencyBoughtDiff),
            formatMoney(dealRow.currencySoldDiff)
          )
        ];

        reportData.push(row);

      });
    let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState({
      reportList: reportData,
      selectedReportList: selectedList,
      selectedPageIndex: 1,
      sortByAscending:sortByAscending,
      columnSortKey:columnKey
    });
  }
  getDealLink = (link, tradeType, type) => {
    return link !== "" ? (
      <a onClick={() => this.onDealDetails(link, tradeType, type)}>{link}</a>
    ) : null;
  };
  getDoubleCellRow = (text1, text2) => {
    return (
      <>
        <div>{text1}</div>
        <div>{text2}</div>
      </>
    );
  };
  onDealDetails = async (value, tradeType, type) => {
    console.log('value - ', value);
    console.log('Type - ', type);

    let URL = endpoint.ADMIN_DEAL;
    let headers = {};
    let isAdminDeal = false;
    switch (type) {
      case 'ADMIN': 
        URL = endpoint.ADMIN_DEAL + value;
        isAdminDeal = true;
        break;
      case 'CLIENT':
        URL = endpoint.DEAL + "?type=" + tradeType + "&dealId=" + value;
        isAdminDeal = false;
        break;
      default:
        break;
    }
    const res = await apiHandler({
      url: URL,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      // No details for Deal
      return;
    } else if (res.data.errorCode) {
      alert(res.data.userDesc);
      return;
    } else {
      const dealType = res.data.tradeType;
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
        this.getRiskManagementReport();
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
        this.getRiskManagementReport();
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
              <Card>
                <CardHeader color="success" text>
                  <CardText color="success" style={{ float: "left" }}>
                    <BarChartIcon className={classes.listItemIcon} />
                  </CardText>
                  <h4
                    className={classes.header}
                    style={{ marginLeft: 20, color: "#3c4858" }}
                  >
                    Risk Management
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
                            id="ffr_searchFromDate"
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
                            id="ffr_searchToDate"
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
                                  "FxForward_" + formatDate(Date.now()) + ".csv"
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
                        customCellClasses={[]}
                        customClassesForCells={[]}
                        customHeadCellClasses={[
                          classes.center,
                          classes.right,
                          classes.right
                        ]}
                        customHeadClassesForCells={[0, 4, 5]}
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
          {/* <StatusActivityTrackingDialog
            showModal={this.state.showActivityTrackingDialog}
            activities={this.state.activities}
            closeModal={this.closeActivityTrackingDetails}
          /> */}
          <DealExecutedDialog
            showModal={this.state.isDealExecuted}
            trade={this.state.dealDetails}
            dealType={this.state.dealTypeForDlg}
            closeModal={this.closeDealModal}
            isDashboard={this.state.isDashboard}
            isAdminDeal={this.state.isAdminDeal}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

RiskManagement.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RiskManagement);
