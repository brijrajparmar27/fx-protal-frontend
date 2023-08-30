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
import BarChartIcon from "@material-ui/icons/BarChart";
import DateRangeIcon from "@material-ui/icons/DateRange";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
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
import StatusActivityTrackingDialog from "views/Components/StatusActivityTrackingDialog.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import { formatDate, parseDate, sortArray } from "../../utils/Utils";

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
  }
};
const ColumnsDetails = [
  { name: "Date", dataType: "date", key: "createdDate", sort: true },
  { name: "First Name", dataType: "string", key: "firstName", sort: true },
  { name: "Last Name", dataType: "string", key: "lastName", sort: true },
  { name: "Email", dataType: "string", key: "email", sort: true },
  { name: "Phone", dataType: "string", key: "phoneNumber", sort: true },
  { name: "Company Name", dataType: "string", key: "companyName", sort: true },
  { name: "Query", dataType: "string", key: "query", sort: true },
  { name: "Status", dataType: "", key: "status", sort: false }
];

const Columns = [
  "Date",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Company Name",
  "Query",
  "Status"
];

class EnquiryReport extends React.Component {
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

  componentDidMount = () => {
    this.getEnquiryReport();
  };
  closeActivityTrackingDetails = () => {
    this.setState({
      activities: null,
      showActivityTrackingDialog: false
    });
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  handleStatus = async (activityId, event) => {
    event.preventDefault();
    event.stopPropagation();
    // ADMIN_ACTIVITY_DETAIL_ACTIVITYID
    const res = await apiHandler({
      url: endpoint.ADMIN_ACTIVITY_DETAIL_ACTIVITYID + activityId,
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
        return;
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
  getEnquiryReport = async () => {
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
    // ADMIN_CONTACTUS_FIND
    const res = await apiHandler({
      url: endpoint.ADMIN_CONTACTUS_FIND + queryParam,
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
        apiData: res.data && res.data.contactUs ? res.data.contactUs : [],
        columnSortKey: ""
      });
      // console.log(res.data);
      this.parseIndicatorData(res.data);
    }
  };
  parseIndicatorData = data => {
    let reportData = [];
    let downloadData = [];
    downloadData.push(Columns);
    data.contactUs &&
      data.contactUs.forEach(contact => {
        let row = [
          contact.id,
          formatDate(contact.createdDate),
          contact.firstName,
          contact.lastName,
          contact.email,
          contact.phoneNumber,
          contact.companyName,
          contact.query,
          this.getStatusButton(contact.status, contact.id)
        ];
        reportData.push(row);
        downloadData.push([
          formatDate(contact.createdDate),
          contact.firstName,
          contact.lastName,
          contact.email,
          contact.phoneNumber,
          contact.companyName,
          contact.query,
          contact.status
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
      data.forEach(contact => {
        let row = [
          contact.id,
          formatDate(contact.createdDate),
          contact.firstName,
          contact.lastName,
          contact.email,
          contact.phoneNumber,
          contact.companyName,
          contact.query,
          this.getStatusButton(contact.status, contact.id)
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
        this.getEnquiryReport();
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
        this.getEnquiryReport();
      }
    );
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
                    ENQUIRY
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
                            Enquiry Date
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
                            id="er_searchFromDate"
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
                            id="er_searchToDate"
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
                                  "Enquiry_" + formatDate(Date.now()) + ".csv"
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
                  <StatusActivityTrackingDialog
                    showModal={this.state.showActivityTrackingDialog}
                    activities={this.state.activities}
                    closeModal={this.closeActivityTrackingDetails}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
      </GridContainer>
    );
  }
}

EnquiryReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(EnquiryReport));
