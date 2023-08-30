import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from "@material-ui/core/MenuItem";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Select from "@material-ui/core/Select";

import cx from "classnames";

// core components
import { withRouter } from "react-router-dom";

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FormControl from "@material-ui/core/FormControl";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import {
  formatMoney,
  formatDate,
  parseDate,
  convertUTCDateToLocalDate
} from "../../utils/Utils";

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
  }
};

const Columns = [
  "Date",
  "Transaction Type",
  "Description",
  "Credit or Debit",
  "Amount",
  "Balance"
  // "Currency"
];

class FundsPage extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
      columns: Columns,
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
      activities: []
    };
  }

  componentDidMount = () => {
    this.getAPIData();
  };

  getAPIData = async () => {
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
    if (
      this.props.location.state &&
      this.props.location.state.currencyCode &&
      this.props.location.state.currencyCode !== ""
    ) {
      queryParam =
        queryParam + "&currency=" + this.props.location.state.currencyCode;
    }
    const res = await apiHandler({
      url: endpoint.WALLET_TRANSACTION + queryParam,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      alert(res.data.userDesc);
      return;
    } else {
      // console.log(res.data);
      this.parseData(res.data);
    }
  };
  parseDate = date => {
    let returnDate = date ? formatDate(date) : "";
    const oDate = new Date(date);
    returnDate =
      returnDate +
      " " +
      (oDate.getHours() < 10 ? "0" : "") +
      oDate.getHours() +
      ":" +
      (oDate.getMinutes() < 10 ? "0" : "") +
      oDate.getMinutes() +
      ":" +
      (oDate.getSeconds() < 10 ? "0" : "") +
      oDate.getSeconds();
    return returnDate;
  };
  parseData = data => {
    let reportData = [];
    // let downloadData = [];
    // downloadData.push(Columns);
    data &&
      data.forEach((row, index) => {
        let tableRow = [
          index,
          this.parseDate(
            convertUTCDateToLocalDate(new Date(row.transationDate))
          ),
          row.transationTypeEnum,
          row.description,
          row.creditOrDebit === "D"
            ? "Debit"
            : row.creditOrDebit === "C"
            ? "Credit"
            : row.creditOrDebit,
          formatMoney(row.amount) + " " + row.currencyCode,
          formatMoney(row.balance) + " " + row.currencyCode
        ];
        reportData.push(tableRow);
      });
    let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState({
      reportList: reportData,
      selectedReportList: selectedList
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

  handleSearchDuration = event => {
    this.setState(
      {
        searchDuration: event.target.value,
        searchFromDate: null,
        searchToDate: null
      },
      () => {
        this.getAPIData();
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
        this.getAPIData();
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
    const { classes, location } = this.props;
    const heading =
      location.state.currencyCode.length === 0
        ? "Full Statement"
        : location.state.currencyCode + " Wallet Account";
    return (
      <GridContainer justify="center">
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <h4 style={{ display: "inline-block" }}>
            <b>{heading}</b>
          </h4>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  color="success"
                  text
                  style={{ marginTop: "25px" }}
                />
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
                          style={{ marginTop: 0 }}
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
                        striped
                        tableHeaderColor="info"
                        tableHead={this.state.columns}
                        tableData={this.state.selectedReportList}
                        customHeadCellClasses={[]}
                        customHeadClassesForCells={[]}
                        customCellClasses={[classes.tableHedgeHead]}
                        customClassesForCells={[1]}
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
        </GridItem>
      </GridContainer>
    );
  }
}

FundsPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(FundsPage));
