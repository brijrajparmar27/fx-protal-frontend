import React from "react";
import PropTypes from "prop-types";
import { CSVLink } from "react-csv";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import cx from "classnames";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import PaymentList from "views/Components/admin/PaymentList.jsx";
import IconButton from "@material-ui/core/IconButton";
import Button from "components/CustomButtons/Button.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
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
  },
  radio: {
    "&$checked": {
      color: "#2391d2"
    }
  },
  checked: {}
});
const ColumnsDetails = [
  { name: "Deal ID", dataType: "string", key: "dealId", sort: true },
  { name: "LP Name", dataType: "string", key: "customerName", sort: true },
  { name: "Payment Date", dataType: "date", key: "paymentDate", sort: true },
  {
    name: "Settlement Date",
    dataType: "date",
    key: "settlementDate",
    sort: true
  },
  { name: "Amount Paid", dataType: "number", key: "amount", sort: true },
  { name: "Status", dataType: "", key: "status", sort: false }
];
const Columns = [
  "Deal ID",
  "LP Name",
  "Payment Date",
  "Settlement Date",
  "Amount Paid",
  "Status"
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
class PaymentSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
      showModal: true,
      value: 0,
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
  handleClose = () => {
    this.props.closeModal();
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let beneficiary = {};
      //   if (props.showModal) {
      //     beneficiary = PaymentSchedule.initialState;
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

  render() {
    const { classes, lpName } = this.props;

    return (
      <div className={cx(classes.container)}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot
          }}
          maxWidth="md"
          fullScreen={true}
          open={this.state.showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
            style={{ textAlign: "left" }}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.handleClose()}
            >
              <CloseIcon />
            </IconButton>
            <div style={{ display: "flex" }}>
              {/* <h4 style={{ marginRight: 20, paddingTop: 7 }}>{lpName} {" View By"}</h4>
              <RadioGroup
                row
                aria-label="Deal-Type"
                name="lp-deals"
                defaultValue="DEALS"
                onChange={event => this.onSelectDisplayType(event)}
                horizontal
              >
                <FormControlLabel
                  value="DEALS"
                  label="Deals"
                  control={
                    <Radio
                      name="lp-deals"
                      classes={{
                        root: classes.radio,
                        checked: classes.checked
                      }}
                    />
                  }
                />
                <FormControlLabel
                  value="PAYMENTS"
                  label="Payments"
                  control={
                    <Radio
                      name="lp-deals"
                      classes={{
                        root: classes.radio,
                        checked: classes.checked
                      }}
                    />
                  }
                />
              </RadioGroup> */}
              <h3
                style={{ textAlign: "left", fontSize: 20, display: "inline" }}
              >
                {"Scheduled Payments - " + lpName}
              </h3>
            </div>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <GridContainer justify="center">
              <GridItem xs={11} sm={11} md={11} lg={11}>
                <div>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={classes.root}
                    >
                      <AppBar position="static" color="default">
                        <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth"
                          aria-label="full width tabs example"
                        >
                          <Tab label="To Pay" {...a11yProps(0)} />
                          <Tab label="Scheduled" {...a11yProps(1)} />
                          <Tab label="Paid" {...a11yProps(2)} />
                          <Tab label="Paid & Received" {...a11yProps(3)} />
                          <Tab label="UNSCHEDULED" {...a11yProps(4)} />
                        </Tabs>
                      </AppBar>
                      <TabPanel
                        value={this.state.value}
                        index={0}
                        className={classes.tabPanelClass}
                      >
                        <PaymentList type="TOPAY" lpName={lpName} />
                      </TabPanel>
                      <TabPanel
                        value={this.state.value}
                        index={1}
                        className={classes.tabPanelClass}
                      >
                        <PaymentList type="SCHEDULED" lpName={lpName} />
                      </TabPanel>
                      <TabPanel
                        value={this.state.value}
                        index={2}
                        className={classes.tabPanelClass}
                      >
                        <PaymentList type="BATCH_PAID" lpName={lpName} />
                      </TabPanel>
                      <TabPanel
                        value={this.state.value}
                        index={3}
                        className={classes.tabPanelClass}
                      >
                        <PaymentList type="BATCH_RECEIVED" lpName={lpName} />
                      </TabPanel>
                      <TabPanel
                        value={this.state.value}
                        index={4}
                        className={classes.tabPanelClass}
                      >
                        <PaymentList type="UNSCHEDULED" lpName={lpName} />
                      </TabPanel>
                    </GridItem>
                  </GridContainer>
                </div>
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
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

PaymentSchedule.propTypes = {
  classes: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  lpName: PropTypes.string
};

export default withRouter(withStyles(styles)(PaymentSchedule));
