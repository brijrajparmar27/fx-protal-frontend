import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import BarChartIcon from "@material-ui/icons/BarChart";
import AddIcon from "@material-ui/icons/Add";
import Check from "@material-ui/icons/Check";

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import CreateAdminUser from "views/Pages/CreateAdminUser.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
// import SARRecordDialog from "views/Components/SARRecordDialog.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import Tooltip from "@material-ui/core/Tooltip";

import { formatDate } from "../../utils/Utils";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

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
  ...customSelectStyle,
  ...regularFormsStyle
};

class ManageAdminUser extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
      Columns: [
        "First Name",
        "Last Name",
        "E-mail",
        "Phone Number",
        "Role",
        "Active"
      ],
      downloadReportData: [],
      reportList: [],
      enableUserList: {},
      recordsPerPage: 10,
      selectedPageIndex: 1,
      selectedReportList: [],
      // searchDuration: "This Week",
      // durations: ["Today", "Yesterday", "This Week"],
      // searchFromDate: null,
      // searchToDate: null,
      showCreateAdminUserDialog: false,
      // showRecordDlg: false,
      // recordDetails: {},
      countries: [],
      callInProgress: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1
    };
  }

  componentDidMount = () => {
    this.getCountries();
    this.getAdminUserList();
  };
  getCountries = async () => {
    const res = await apiHandler({
      url: endpoint.COUNTRIES,
      authToken: sessionStorage.getItem("token")
    });
    const countries = res.data.countryMetaData;
    this.setState({ countries: countries });
  };
  getAdminUserList = async () => {
    const res = await apiHandler({
      url: endpoint.ADMIN_USERS,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      alert(res.data.userDesc);
      return;
    } else {
      // console.log(res.data);
      let enabledState = {};
      res.data &&
        res.data.users &&
        res.data.users.forEach((user, index) => {
          enabledState[index] = user.enabled;
        });
      this.setState({
        users: res.data.users,
        enableUserList: enabledState
      });
    }
  };
  handleToggle = event => {
    this.setState({
      confirmationModal: true,
      confirmationModalHeader: "Confirm",
      confirmationModalMsg: event.target.checked
        ? "Are you sure you want to activate this user?"
        : "Are you sure you want to deactivate this user?",
      handlePositiveFunctionName: "toggleActionConfirm",
      eventId: event.target.id
    });
  };
  toggleActionConfirm = async () => {
    // console.log("user account enable");
    let id = this.state.eventId;
    let index = id.lastIndexOf("_");
    if (index !== -1) {
      id = id.substring(index + 1, id.length);
    }
    let enabledState = this.state.enableUserList;

    let user = this.state.users[id];
    if (enabledState[id]) {
      // Deactivate User
      await apiHandler({
        method: "DELETE",
        url: endpoint.DISABLE_USER + user.email,
        authToken: sessionStorage.getItem("token")
      });
    } else {
      // Activate User
      await apiHandler({
        method: "PUT",
        url: endpoint.ENABLE_USER + user.email,
        data: null,
        authToken: sessionStorage.getItem("token")
      });
    }

    enabledState[id] = !enabledState[id];
    this.setState({
      enableUserList: enabledState,
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1
    });
  };
  handleNegativeButton = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      handlePositiveFunctionName: undefined,
      eventId: -1
    });
  };
  GetUserData = () => {
    const fillButtons = userID => {
      return (
        <>
          <FormControlLabel
            className={this.props.classes.center}
            classes={{
              root: this.props.classes.checkboxLabelControl,
              label: this.props.classes.checkboxLabel
            }}
            control={
              <Checkbox
                tabIndex={-1}
                id={"checkbox_" + userID}
                onClick={this.handleToggle}
                checked={this.state.enableUserList[userID]}
                value={this.state.enableUserList[userID]}
                checkedIcon={
                  <Check className={this.props.classes.checkedIcon} />
                }
                icon={<Check className={this.props.classes.uncheckedIcon} />}
                classes={{
                  checked: this.props.classes.checked,
                  root: this.props.classes.checkRoot
                }}
              />
            }
            label={<div />}
          />
        </>
      );
    };

    let reportData = [];
    // let downloadData = [];
    // downloadData.push(this.state.Columns);
    this.state.users &&
      this.state.users.forEach((user, index) => {
        let row = [
          index,
          user.firstName,
          user.lastName,
          user.email,
          user.phoneNumber,
          user.role,
          fillButtons(index, user.enabled)
        ];
        reportData.push(row);
        // downloadData.push([
        //   user.firstName,
        //   user.lastName,
        //   user.email,
        //   user.phoneNumber,
        //   user.role,
        //   user.mfaEnabled
        // ]);
      });
    // let selectedList = reportData.slice(0, this.state.recordsPerPage);
    // this.setState({
    //   downloadReportData: downloadData,
    //   reportList: reportData,
    //   selectedReportList: selectedList
    // });
    return reportData;
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
  closeCreateAdminUserDialog = () => {
    this.setState({ showCreateAdminUserDialog: false });
  };
  // closeRecordModal = () => {
  //   this.setState({ showRecordDlg: false, recordDetails: {} });
  // };
  addAdminUser = async record => {
    this.setState({ callInProgress: true });
    // console.log(data);
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADMIN_USER_REGISTER,
      data: record,
      authToken: sessionStorage.getItem("token")
    });
    const data = res.data;
    if (data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        this.setState({
          callInProgress: false,
          showAdminUserModal: true,
          noticeModal: true,
          noticeModalErrMsg: data.userDesc
        });
      }
    } else {
      this.setState({
        callInProgress: false,
        closeModal: true,
        showAdminUserModal: false,
        noticeModal: true,
        noticeModalErrMsg: "Admin Added Successfully"
      });
    }
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      noticeModal: false
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
                <b>Manage Admin Users</b>
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
                    Admin User List
                  </h4>
                </CardHeader>

                <CardBody className={classes.cardBody}>
                  <GridContainer justify="flex-end">
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
                            filename={"SAR_" + formatDate(Date.now()) + ".csv"}
                            className="hidden"
                            ref={this.csvDownloadLink}
                            target="_blank"
                          />
                        </IconButton>
                      </GridItem>
                    )}
                    <GridItem
                      xs={4}
                      sm={4}
                      md={2}
                      lg={2}
                      style={{ textAlign: "right" }}
                      className={classes.filterRow}
                    >
                      <Button
                        size="lg"
                        style={{
                          width: "200px",
                          float: "right",
                          marginRight: 10
                        }}
                        onClick={() => {
                          this.setState({ showCreateAdminUserDialog: true });
                        }}
                      >
                        <AddIcon />
                        ADD
                      </Button>
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
                        tableData={this.GetUserData()}
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
          <CreateAdminUser
            showModal={this.state.showCreateAdminUserDialog}
            closeModal={this.closeCreateAdminUserDialog}
            countries={this.state.countries}
            addRecord={this.addAdminUser}
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
            handleNegativeButton={this.handleNegativeButton}
            handlePositiveButton={this[this.state.handlePositiveFunctionName]}
          />
          {/* <SARRecordDialog
            showModal={this.state.showRecordDlg}
            record={this.state.recordDetails}
            closeModal={this.closeRecordModal}
          /> */}
        </GridItem>
      </GridContainer>
    );
  }
}

ManageAdminUser.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ManageAdminUser);
