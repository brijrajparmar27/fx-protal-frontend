import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DateRangeIcon from "@material-ui/icons/DateRange";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Table from "components/Table/Table.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import StatusCard from "components/StatusCard/StatusCard.jsx";
import FileUpload from "components/FileUpload/FileUpload.jsx";
import { formatMoney, parseCurrency } from "../../../utils/Utils";
import { validate } from "../../../utils/Validator";

// @material-ui/icons
import Work from "@material-ui/icons/Work";

import { primaryColor } from "assets/jss/material-dashboard-pro-react.jsx";
import confirmationModalStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const style = {
  modal: {
    margin: "auto",
    maxWidth: "70%"
  },
  ...confirmationModalStyle
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const Columns = [
  "Transaction Id",
  "Date",
  "Deal Reference",
  "Credit or Debit",
  "From Account Name",
  "Amount",
  "FXG Balance"
];
class StatementRecordModal extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: false,
      paymentReason: "",
      columns: Columns,
      downloadReportData: [],
      reportList: [],
      recordsPerPage: 10,
      selectedPageIndex: 1,
      selectedReportList: [],
      searchDuration: "This Week",
      durations: ["Today", "Yesterday", "This Week", "This Month"],
      searchFromDate: null,
      searchToDate: null
    };
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      let statusDetails = {};
      if (props.showModal) {
        statusDetails = {
          reportList: props.statementOfWallets,
          columns: props.columnHeadings || Columns,
          selectedReportList: props.statementOfWallets.slice(
            0,
            state.recordsPerPage
          )
        };
      }
      return {
        showModal: props.showModal,
        ...statusDetails
      };
    }
    return null;
  }
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
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  render() {
    const { classes, heading } = this.props;

    return (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal
          }}
          open={this.state.showModal}
          maxWidth="lg"
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleNegativeButton()}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle
            id="notice-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <h4 className={classes.modalTitle}>{heading}</h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <GridContainer justify="flex-end">
              {/* <GridItem
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
                      Walllet Transactions
                    </FormLabel>
                  </GridItem>
                  <GridItem
                    xs={6}
                    sm={6}
                    md={2}
                    lg={2}
                    style={{ textAlign: "right" }}
                  >
                    <FormControl fullWidth className={classes.filledSelect}>
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
                          this.handleDateChange("searchFromDate", date, event),
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
                          this.handleDateChange("searchToDate", date, event),
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
              </GridItem> */}
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
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button onClick={() => this.props.closeModal()} color="info" round>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

StatementRecordModal.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  heading: PropTypes.string,
  columnHeadings: PropTypes.object,
  statementOfWallets: PropTypes.object
};

export default withStyles(style)(StatementRecordModal);
