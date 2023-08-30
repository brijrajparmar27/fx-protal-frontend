import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
import * as xlsx from "xlsx";

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
import Edit from "@material-ui/icons/Edit";
import ListAltIcon from "@material-ui/icons/ListAlt";
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
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import Tooltip from "@material-ui/core/Tooltip";
import BeneficiaryDetails from "views/Components/admin/BeneficiaryDetails.jsx";
import PaymentSchedule from "views/Components/admin/PaymentSchedule.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";

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
  "Code",
  "Name",
  "Bank Name",
  "Country Code",
  "Currency",
  "Beneficiary Id",
  "Account Id",
  "Action"
];
const ColumnsDetails = [
  { name: "Code", dataType: "string", key: "code", sort: true },
  { name: "Name", dataType: "string", key: "name", sort: true },
  { name: "Bank Name", dataType: "string", key: "bankName", sort: true },
  { name: "Country Code", dataType: "string", key: "country", sort: true },
  { name: "Currency", dataType: "string", key: "currency", sort: true },
  {
    name: "Beneficiary Id",
    dataType: "string",
    key: "fxgBeneficiaryId",
    sort: true
  },
  {
    name: "Account Id",
    dataType: "string",
    key: "fxgBeneficiaryAccountId",
    sort: true
  },
  { name: "Action", dataType: "component", key: "", sort: false }
];

class FxgLiquidityProviderPage extends React.Component {
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
      isDashboard: true,
      isDealExecuted: false,
      dealDetails: {},
      dealTypeForDlg: "",
      isAdminDeal: false,
      showActivityTrackingDialog: false,
      activities: [],
      sortByAscending: true,
      columnSortKey: "",
      apiData: [],
      showLPDemographicDetails: false,
      lpDetails: null,
      showPaymentDetails: false,
      selectedLPName: "",
      selectedLP: {},
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined
    };
  }
  handleNegativeButton = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      selectedLP: {}
    });
  };
  componentDidMount = () => {
    this.getRiskManagementReport();
    this.getCurrencies();
  };
  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ currencies: res.data.currrencies });
  };
  getActionButton = (id, enabled) => {
    const { classes } = this.props;
    return (
      <>
        {/* <Edit
        //   onClick={this.handleEditDirector.bind(this, director.id)}
          className={cx(classes.editIcon, classes.icon)}
        /> */}
        {enabled ? (
          <Check
            onClick={event => this.handleEnableDisableClick(event, id, enabled)}
            className={cx(classes.editIcon, classes.icon)}
          />
        ) : (
          <Close
            onClick={event => this.handleEnableDisableClick(event, id, enabled)}
            className={cx(classes.closeDIcon, classes.icon)}
          />
        )}
        {/* <ListAltIcon
          //   onClick={this.handleDeleteDirector.bind(this, director.id)}
          className={cx(classes.editIcon, classes.icon)}
        /> */}
      </>
    );
  };
  handleEnableDisableClick = (event, id, enabled) => {
    event.preventDefault();
    event.stopPropagation();
    return this.setState({
      handlePositiveFunctionName: "enableDisableLP",
      confirmationModalHeader: "Confirm",
      confirmationModalMsg: enabled
        ? "Do you want to Disable this LP now ?"
        : "Do you want to Enable this LP now ?",
      selectedLP: { id, enabled },
      confirmationModal: true
    });
  };
  enableDisableLP = async () => {
    const { id, enabled } = this.state.selectedLP;
    const record = {
      liquidityProviderId: id,
      enabled: !enabled,
      remarks: enabled
        ? "Disabling the LP"
        : "Enabling the LP"
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_LP_UPDATE_STATUS,
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
      this.getRiskManagementReport();
    }
  };
  getRiskManagementReport = async () => {
    const res = await apiHandler({
      url: endpoint.ADMIN_LP_LIST,
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
      this.parseIndicatorData(res.data);
    }
  };
  parseIndicatorData = data => {
    let reportData = [];
    let downloadData = [];
    let apiData = [];
    downloadData.push(Columns);
    data &&
      data.forEach(lp => {
        let row = [
          lp.code ? lp.code : "",
          lp.code ? lp.code : "",
          lp.name,
          lp.bankName,
          lp.country,
          lp.currency,
          lp.fxgBeneficiaryId,
          lp.fxgBeneficiaryAccountId,
          this.getActionButton(lp.id, lp.enabled)
        ];
        let obj = {
          id: lp.code,
          lpProvider: lp.name,
          address: lp.country,
          currencyCode: lp.currency,
          iban: lp.fxgBeneficiaryId,
          accountNum: lp.fxgBeneficiaryAccountId
        };
        reportData.push(row);
        apiData.push(obj);
        downloadData.push([
          lp.code ? lp.code : "",
          lp.name,
          lp.bankName,
          lp.country,
          lp.currency,
          lp.fxgBeneficiaryId,
          lp.fxgBeneficiaryAccountId
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
  handleTableRowClick = async selectedId => {
    this.setState({ selectedLPName: selectedId, showPaymentDetails: true });
  };
  closePaymentDetails = () => {
    this.setState({ selectedLPName: "", showPaymentDetails: false });
  };
  getDownloadData = () => {
    let filterData = [this.state.Columns || []];
    this.state.downloadReportData &&
      this.state.downloadReportData.forEach(task =>
        filterData.push([
          task[1],
          task[2],
          task[3],
          task[4],
          task[5],
          task[6],
          task[7],
          task[8]
        ])
      );
    return filterData;
  };
  downloadReport = () => {
    let wb = xlsx.utils.book_new();
    wb.SheetNames.push("LP List");
    const data = this.getDownloadData();
    let ws = xlsx.utils.aoa_to_sheet(data);
    wb.Sheets["LP List"] = ws;
    xlsx.writeFile(wb, "LP List.xlsx");
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
  closeLPModal = () => {
    this.setState({
      showLPDemographicDetails: false,
      lpDetails: null
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
      data.forEach(lp => {
        let row = [
          lp.code ? lp.code : "",
          lp.name,
          lp.bankName,
          lp.country,
          lp.currency,
          lp.fxgBeneficiaryId,
          lp.fxgBeneficiaryAccountId,
          this.getActionButton(lp.id, lp.enabled)
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
  addLPBeneficiry = async record => {
    console.log("ADD Beneficiary - ", record);
    this.closeLPModal();

    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_LP_CREATE,
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
        noticeModalErrMsg: "New Liquidity Provider is successfuly Created."
      });
      this.getRiskManagementReport();
    }
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
                      <h4
                        className={classes.header}
                        style={{ fontStyle: "bold", color: "#3c4858" }}
                      >
                        FXG Liquidity Provider
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
                            title="Download Liquidity Provider List"
                            placement="top"
                            classes={{ tooltip: classes.tooltipCalculator }}
                          >
                            <CloudDownloadIcon />
                          </Tooltip>
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Add LP"
                        onClick={() =>
                          this.setState({ showLPDemographicDetails: true })
                        }
                        style={{ color: "#53ac57" }}
                      >
                        <Tooltip
                          id="tooltip-totalSales"
                          title="You can add Liquidity Provider details"
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
          {this.state.showLPDemographicDetails && (
            <BeneficiaryDetails
              showModal={this.state.showLPDemographicDetails}
              record={this.state.lpDetails}
              type={"FXG_LP"}
              addBeneficiary={this.addLPBeneficiry}
              closeModal={this.closeLPModal}
              currencies={this.state.currencies}
            />
          )}
          {this.state.showPaymentDetails && (
            <PaymentSchedule
              showModal={this.state.showPaymentDetails}
              closeModal={this.closePaymentDetails}
              lpName={this.state.selectedLPName}
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

FxgLiquidityProviderPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(FxgLiquidityProviderPage));
