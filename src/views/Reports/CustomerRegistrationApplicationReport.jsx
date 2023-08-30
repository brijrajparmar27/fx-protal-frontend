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
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import AdjustOutlinedIcon from "@material-ui/icons/AdjustOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import BarChartIcon from "@material-ui/icons/BarChart";
import DateRangeIcon from "@material-ui/icons/DateRange";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddIcon from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";

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
import CustomerRegistrationDialog from "views/Components/CustomerRegistrationDialog.jsx";
import ChangeStatusDialog from "views/Components/ChangeStatusDialog.jsx";
import StatusActivityTrackingDialog from "views/Components/StatusActivityTrackingDialog.jsx";
import CustomerKYCStatus from "views/Components/CustomerKYCStatus.jsx";
import IdCheckDetails from "views/Components/IdCheckDetails.jsx";
import IdCheckPerform from "views/Components/IdCheckPerform.jsx";
import CompanyKYCSanctions from "views/Components/CompanyKYCSanctions.jsx";
import AddDirectors from "../Pages/AddDirectors";
import AddCustomers from "../Components/AddCustomers";
import NoticeModal from "views/Components/NoticeModal.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import { formatDate, parseDate, sortArray } from "../../utils/Utils";
import Tooltip from "@material-ui/core/Tooltip";
import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const styles = theme => ({
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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
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
});

const ColumnsDetails = [
  { name: "Date", dataType: "date", key: "createdDate", sort: true },
  { name: "Company Name", dataType: "string", key: "customerName", sort: true },

  {
    name: "Incorporation No.",
    dataType: "string",
    key: "incorporationNumber",
    sort: true
  },
  {
    name: "Registered Office Address",
    dataType: "string",
    key: "currencyCode",
    sort: true
  },
  { name: "City", dataType: "string", key: "city", sort: true },
  { name: "Country", dataType: "string", key: "country", sort: true },
  { name: "Status", dataType: "", key: "status", sort: false },
  { name: "KYC", dataType: "string", key: "address", sort: true }
];

const Columns = [
  "Date",
  "Company Name",
  "Incorporation No.",
  "Registered Office Address",
  "City",
  "Country",
  "Status",
  "KYC"
];

class CustomerRegistrationApplicationReport extends React.Component {
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
      customerRegistrationDetails: {},
      showCustomerRegistrationDetails: false,
      showActivityTrackingDialog: false,
      activities: [],
      showChangeStatusDialog: false,
      taskDetails: {},
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
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      deleteCustomerId: "",
      deleteKycEntityId: "",
      sortByAscending: true,
      columnSortKey: "",
      apiData: []
    };
  }

  componentDidMount = () => {
    this.getCustomerRegistrationApplicationReport();
  };
  // getStatusButton = status => {
  //   let color = "success";
  //   if (status === "SETTLED" || status === "SETTELED") color = "success";
  //   else if (status === "PENDING") color = "warning";
  //   else color = null;
  //   return (
  //     <Button color={color} size="sm" round>
  //       {status}
  //     </Button>
  //   );
  // };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  closeActivityTrackingDetails = () => {
    this.setState({
      activities: null,
      showActivityTrackingDialog: false
    });
  };
  // ADMIN_ACTIVITY_DETAILS
  // ?type=KYC&activityId=
  handleStatus = async (activityId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const res = await apiHandler({
      url:
        endpoint.ADMIN_ACTIVITY_DETAILS + "?type=KYC&activityId=" + activityId,
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
  getKYCStatusButton = customerId => {
    return (
      <Button
        size="sm"
        round
        style={{
          backgroundColor: "#95c440"
        }}
        onClick={event => this.getCustomerKYCInfo(customerId, event)}
      >
        {"DETAILS"}
      </Button>
    );
  };
  getClientStatusButton = (status, activityId) => {
    if (
      status.toLowerCase() === "approved" ||
      status.toLowerCase() === "active"
    ) {
      return (
        <Button
          size="sm"
          round
          style={{
            backgroundColor: "#95c440"
          }}
          onClick={event => this.handleStatus(activityId, event)}
        >
          {status} <CheckCircleOutlineOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    } else if (status.toLowerCase() === "pending") {
      return (
        <Button
          size="sm"
          round
          style={{
            backgroundColor: "rgb(223,165,43)"
          }}
          onClick={event => this.handleStatus(activityId, event)}
        >
          {status} <AdjustOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    } else {
      return (
        <Button
          color="danger"
          size="sm"
          round
          onClick={event => this.handleStatus(activityId, event)}
        >
          {status} <CancelOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    }
  };
  getCustomerRegistrationApplicationReport = async () => {
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
    //ADMIN_CUSTOMER_APPLIEDASCUSTOMER
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_APPLIEDASCUSTOMER + queryParam,
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
        apiData: res.data && res.data.clients ? res.data.clients : [],
        columnSortKey: ""
      });
      // console.log(res.data);
    }
  };
  parseIndicatorData = data => {
    let reportData = [];
    let downloadData = [];
    let apiData = [];

    downloadData.push(Columns);
    data.clients &&
      data.clients.forEach(client => {
        let row = [
          client.customerId,
          formatDate(client.createDate),
          client.customerName,
          client.incorporationNumber,
          client.address && client.address.address,
          client.address && client.address.city,
          client.address && client.address.country,
          this.getClientStatusButton(client.customerStatus, client.customerId),
          this.getKYCStatusButton(client.customerId)
        ];
        let obj = {
          customerId: client.customerId,
          createDate: client.createDate,
          customerName: client.customerName,
          incorporationNumber: client.incorporationNumber,
          address: client.address && client.address.address,
          city: client.address && client.address.city,
          country: client.address && client.address.country,
          customerStatus: client.customerStatus
        };
        apiData.push(obj);

        reportData.push(row);
        downloadData.push([
          formatDate(client.createDate),
          client.customerName,
          client.incorporationNumber,
          client.address && client.address.address,
          client.address && client.address.city,
          client.address && client.address.country,
          client.customerStatus
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
      data.forEach(client => {
        let row = [
          client.customerId,
          formatDate(client.createDate),
          client.customerName,
          client.incorporationNumber,
          client.address,
          client.city,
          client.country,
          this.getClientStatusButton(client.customerStatus, client.customerId),
          this.getKYCStatusButton(client.customerId)
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
  getDocumentLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    ) : null;
  };
  //ADMIN_CUSTOMER_CUSTOMERDETAILS
  getCustomerDetails = async customerId => {
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_CUSTOMERDETAILS + customerId,
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
      let customerDetails = res.data;
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
    }
  };
  closeCustomerRegistrationDetails = () => {
    this.setState({
      customerRegistrationDetails: null,
      showCustomerRegistrationDetails: false
    });
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
        this.getCustomerRegistrationApplicationReport();
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
        this.getCustomerRegistrationApplicationReport();
      }
    );
  };
  closeChangeStatusDialog = () => {
    this.setState({
      showChangeStatusDialog: false,
      taskDetails: null
    });
  };
  updateTaskStatus = taskUpdatedInfo => {
    if (taskUpdatedInfo.taskType === "BENEFICIARY") {
      this.updateBeneficiaryStatus(taskUpdatedInfo);
    }
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
  getCustomerKYCInfo = async (customerId, event) => {
    if (event && event !== null) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ callInProgress: true });
    const res = await apiHandler({
      url: endpoint.ADMIN_KYC_DETAILS_CUSTOMER + customerId,
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
      this.setState({ showCustomerKYCStatus: false });
      this.getDirectorKycData(res.data);
    }
  };
  refreshKycData = customerId => {
    this.getCustomerKYCInfo(customerId, null);
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
    console.log("1046");
    console.log(companySanctions);
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
        fillButtons(
          companySanctions.notes && companySanctions.notes["Adverse Media"]
        )
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
    // Call API to delete director and refresh
    this.setState({ callInProgress: true });
    // KYC_CUSTOMER_DELETE
    const res = await apiHandler({
      url:
        endpoint.KYC_CUSTOMER_DELETE +
        "?customerId=" +
        customerId +
        "&kycEntityId=" +
        kycEntityId,
      authToken: sessionStorage.deleteItem("token")
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
      this.refreshKycData(customerId);
    }
  };
  handleDirectorClose = async () => {
    this.setState({ showAddDirector: false, editDirector: null });
  };
  handleEditDirector = async (customerId, kycEntityId) => {
    // Call API to get Director and show popup
    this.setState({ callInProgress: true });
    // KYC_CUSTOMER_CUSTOMER_ID
    const res = await apiHandler({
      url:
        endpoint.KYC_CUSTOMER_CUSTOMER_ID +
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
    //KYC_PERSON_ONLY
    const res = await apiHandler({
      url: endpoint.KYC_PERSON_ONLY,
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
      this.refreshKycData(director.customerId);
    }
  };

  handleCustomerClose = () => {
    this.setState({ showAddCustomer: false, editCustomer: null });
  };

  handleEditCustomer = async (customerId, kycEntityId) => {
    // Call API to get Data and Show Edit Customer popup
    this.setState({ callInProgress: true });
    //KYC_CUSTOMER_CUSTOMER_ID
    const res = await apiHandler({
      url:
        endpoint.KYC_CUSTOMER_CUSTOMER_ID +
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
    //fx-kyc/kyc/customer/companyOnly
    const res = await apiHandler({
      url: endpoint.KYC_COMPANY_ONLY,
      method: "POST",
      data: addonCompany,
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
        return;
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
    // KYC_CUSTOMER_EXCUTEKYC
    const res = await apiHandler({
      url: endpoint.KYC_CUSTOMER_EXCUTEKYC,
      moethod: "PUT",
      authToken: sessionStorage.getItem("token"),
      data: data
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
        return;
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
    // KYC_PERSON_ONLY
    const res = await apiHandler({
      url: endpoint.KYC_PERSON_ONLY,
      method: "POST",
      data: directorData,
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
        return;
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
    //KYC_COMPANY_ONLY
    const res = await apiHandler({
      url: endpoint.KYC_COMPANY_ONLY,
      method: "POST",
      data: customerData,
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
        return;
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
    // KYC_CUSTOMER_COMPANY_DIRECTOR
    const res = await apiHandler({
      url: endpoint.KYC_CUSTOMER_COMPANY_DIRECTOR,
      method: "POST",
      data: customerData,
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
        return;
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
    // KYC_CUSTOMER_IDENTITYCHECK
    const res = await apiHandler({
      url: endpoint.KYC_CUSTOMER_IDENTITYCHECK,
      menthod: "POST",
      data: record,
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
        return;
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
    // ADMIN_CUSTOMER_CREATE
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER_CREATE,
      method: "POST",
      data: record,
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
        return;
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
                    CUSTOMER REGISTRATION APPLICATION
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
                            Application Date
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
                            id="cr_searchFromDate"
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
                            id="cr_searchToDate"
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
                                  "CRA_" + formatDate(Date.now()) + ".csv"
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
                        onClick={this.getCustomerDetails}
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
          <CustomerRegistrationDialog
            showModal={this.state.showCustomerRegistrationDetails}
            customerRegistrationDetails={this.state.customerRegistrationDetails}
            closeModal={this.closeCustomerRegistrationDetails}
          />
          <ChangeStatusDialog
            showModal={this.state.showChangeStatusDialog}
            closeModal={this.closeChangeStatusDialog}
            taskInfo={this.state.taskDetails}
            updateStatus={this.updateTaskStatus}
          />
          <StatusActivityTrackingDialog
            showModal={this.state.showActivityTrackingDialog}
            activities={this.state.activities}
            closeModal={this.closeActivityTrackingDetails}
          />
          <CustomerKYCStatus
            showModal={this.state.showCustomerKYCStatus}
            closeModal={this.closeCustomerKYCStatus}
            taskInfo={this.state.taskDetails}
            updateStatus={this.showKycChangeStatus}
            customerRegistrationDetails={this.state.customerRegistrationDetails}
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
          {this.state.noticeModal && (
            <NoticeModal
              noticeModal={this.state.noticeModal}
              noticeModalHeader={this.state.noticeModalHeader}
              noticeModalErrMsg={this.state.noticeModalErrMsg}
              closeModal={this.closeNoticeModal}
            />
          )}
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeResponse}
            handlePositiveButton={this.handlePositiveResponse}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

CustomerRegistrationApplicationReport.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(
  withStyles(styles)(CustomerRegistrationApplicationReport)
);
