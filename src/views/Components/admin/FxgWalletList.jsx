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
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ListAltIcon from "@material-ui/icons/ListAlt";
import BarChartIcon from "@material-ui/icons/BarChart";
import Edit from "@material-ui/icons/Edit";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Select from "@material-ui/core/Select";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Search from "@material-ui/icons/Search";

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FormControl from "@material-ui/core/FormControl";
import Button from "components/CustomButtons/Button.jsx";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import Tooltip from "@material-ui/core/Tooltip";
import NoticeModal from "views/Components/NoticeModal.jsx";
import StatementRecordModal from "views/Components/admin/StatementRecordModal.jsx";

import {
  formatMoney,
  formatDate,
  parseDate,
  convertUTCDateToLocalDate,
  shortenDealId,
  sortArray
} from "../../../utils/Utils";

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

const COLUMNS = [
  "Provider",
  "Account Name",
  "Account Number",
  "iBAN",
  "Sort Code",
  "Swift BIC",
  "Currency",
  "Amount",
  "Statement"
];
const ColumnsDetails = [
  { name: "Provider", dataType: "string", key: "provider", sort: true },
  { name: "Account Name", dataType: "string", key: "accountName", sort: true },
  { name: "Account No", dataType: "string", key: "accountNumber", sort: true },
  { name: "iBAN", dataType: "string", key: "iban", sort: true },
  { name: "Sort Code", dataType: "string", key: "sortCode", sort: true },
  { name: "Swift BIC", dataType: "string", key: "swiftBic", sort: true },
  { name: "Currency", dataType: "string", key: "currency", sort: true },
  { name: "Amount", dataType: "string", key: "balance", sort: true },
  { name: "Statement", dataType: "icon", key: "", sort: false }
];

class FxgWalletsList extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
      columns: COLUMNS,
      recordsPerPage: 10,
      downloadReportData: [],
      reportList: [],
      selectedReportList: [],
      selectedPageIndex: 1,
      sortByAscending: true,
      columnSortKey: "",
      apiData: [],
      showStatementRecordModal: false,
      statementHeading: "",
      accountStatement: []
    };
  }
  componentDidMount = () => {
    this.getWalletList();
  };
  closeStatementRecordModal = () => {
    this.setState({
      showStatementRecordModal: false,
      statementHeading: "",
      accountStatement: []
    });
  };
  handleStatement = async (accountId, provider) => {
    console.log(endpoint.ADMIN_WALLET_STATEMENT, accountId, provider);
    const res = await apiHandler({
      url: endpoint.ADMIN_WALLET_STATEMENT + provider + "/" + accountId,
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
      this.parseStatementData(provider, res.data.statement);
    }
  };
  parseStatementData = (provider, data) => {
    let reportData = [];
    data &&
      data.forEach((row, index) => {
        let tableRow = [
          index,
          row.transactionId,
          parseDate(convertUTCDateToLocalDate(new Date(row.transactionDate))),
          row.reference,
          row.creditDebit,
          row.counterPartyAccountName,
          formatMoney(row.amount) + " " + row.currency,
          formatMoney(row.balance) + " " + row.currency
        ];
        reportData.push(tableRow);
      });
    this.setState({
      showStatementRecordModal: true,
      accountStatement: reportData,
      statementHeading: provider + " Wallet - Statement of Account"
    });
  };
  getIcons = (accountId, provider) => (
    <>
      <ListAltIcon
        onClick={this.handleStatement.bind(this, accountId, provider)}
        className={cx(this.props.classes.editIcon, this.props.classes.icon)}
      />
    </>
  );
  getWalletList = async () => {
    const { type } = this.props;
    const URL =
      type === "Operational"
        ? endpoint.ADMIN_OP_WALLETS_LIST
        : endpoint.ADMIN_PARENT_WALLETS_LIST;
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
      console.log(res.data);
      this.parseData(res.data);
    }

    // const result = await apiHandler({
    //   url: endpoint.ADMIN_PARENT_WALLETS_LIST,
    //   authToken: sessionStorage.getItem("token")
    // });
    // if (result.data.errorCode) {
    //   if (result.data.errorCode === 401) {
    //     console.log("Unauthorized Access");
    //     this.props.history.push("/home/logout");
    //     return;
    //   } else if (result.data.errorCode === 403) {
    //     return;
    //   } else {
    //     this.setState({
    //       noticeModal: true,
    //       noticeModalHeader: "Error",
    //       noticeModalErrMsg: result.data.userDesc
    //     });
    //   }
    // } else {
    //   console.log(result.data);
    //   this.parsePAData(result.data);
    // }
  };
  parseData = data => {
    let reportData = [];
    let downloadData = [];
    let apiData = [];
    let index = 0;
    downloadData.push(this.state.columns);
    data &&
      data.forEach(wallet => {
        wallet.balances &&
          wallet.balances.forEach(b => {
            let row = [
              index++,
              wallet.provider,
              wallet.accountName,
              wallet.accountNumber,
              wallet.iban,
              wallet.sortCode,
              wallet.swiftBic,
              b.currency,
              formatMoney(b.balance) + " " + b.currency,
              // b.balance,
              this.getIcons(wallet.accountId, wallet.provider)
            ];
            reportData.push(row);
            apiData.push(wallet);
            downloadData.push([
              wallet.provider,
              wallet.accountName,
              wallet.accountNumber,
              wallet.iban,
              wallet.sortCode,
              wallet.swiftBic,
              b.currency,
              formatMoney(b.balance) + " " + b.currency,
              ""
            ]);
          });
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
      data.forEach((wallet, index) => {
        let row = [
          index,
          wallet.provider,
          wallet.accountName,
          wallet.accountNumber,
          wallet.iban,
          wallet.sortCode,
          wallet.swiftBic,
          this.getActionButton(wallet.balances)
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
    const { classes, type } = this.props;

    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={11} lg={11}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4} lg={4}>
              <h4
                className={classes.header}
                style={{
                  fontStyle: "bold",
                  color: "#3c4858"
                }}
              >
                {type + " Wallets"}
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
                      onChange: event => this.searchClientList("search", event)
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
                    classes={{
                      tooltip: classes.tooltipCalculator
                    }}
                  >
                    <CloudDownloadIcon />
                  </Tooltip>
                  <CSVLink
                    data={this.state.downloadReportData}
                    filename={"FxForward_" + formatDate(Date.now()) + ".csv"}
                    className="hidden"
                    ref={this.csvDownloadLink}
                    target="_blank"
                  />
                </IconButton>
              )}
              <IconButton
                aria-label="Add LP"
                onClick={() =>
                  this.setState({
                    showCreateSARDialog: true
                  })
                }
                style={{ color: "#53ac57" }}
              >
                <Tooltip
                  id="tooltip-totalSales"
                  title="You can add Wallets from here"
                  placement="top"
                  classes={{
                    tooltip: classes.tooltipCalculator
                  }}
                >
                  <Add />
                </Tooltip>
              </IconButton>
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
                tableHead={this.state.columns}
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
          {/* <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader color="success" text>
                  <GridContainer justify="center">
                    <GridItem xs={11} sm={11} md={11} lg={11}>
                      
                    </GridItem>
                  </GridContainer>
                </CardHeader>
              </Card>
            </GridItem>
          </GridContainer> */}
          {this.state.noticeModal && (
            <NoticeModal
              noticeModal={this.state.noticeModal}
              noticeModalHeader={this.state.noticeModalHeader}
              noticeModalErrMsg={this.state.noticeModalErrMsg}
              closeModal={this.closeNoticeModal}
            />
          )}
          {this.state.showStatementRecordModal && (
            <StatementRecordModal
              showModal={this.state.showStatementRecordModal}
              closeModal={this.closeStatementRecordModal}
              heading={this.state.statementHeading}
              statementOfWallets={this.state.accountStatement}
            />
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

FxgWalletsList.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

export default withStyles(styles)(FxgWalletsList);
