import React from "react";
import PropTypes from "prop-types";

import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Add from "@material-ui/icons/Add";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Checkbox } from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import { FormControl, IconButton } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Table from "components/Table/Table.jsx";
import { format } from "date-fns";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";

import cx from "classnames";
import moment from "moment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Button from "components/CustomButtons/Button.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import { validate } from "../../../../utils/Validator";
import { formatDate, parseCurrency } from "../../../../utils/Utils";

import {
  cardTitle,
  roseColor,
  successColor,
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const style = theme => ({
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  exposureCard: {
    marginTop: 15,
    marginBottom: 10
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem"
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px"
  },
  footer: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "5px 25px"
  },
  pr0: {
    paddingRight: "0px !important;"
  },
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "25px",
    height: "25px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px"
    }
  },
  iconRose: {
    color: roseColor
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
  addIcon: {
    marginTop: 0,
    height: 35,
    width: 35,
    borderRadius: 6
  },
  marginTop30: {
    marginTop: "30px"
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px"
    }
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white"
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "black"
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 18,
    marginRight: 5
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999"
  },
  listItemIcon: {
    marginTop: "-3px",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    color: "inherit",
    display: "inline-block"
  },
  filledSelect: {
    // backgroundColor: 'grey',
    // color: 'white !important',
  },
  white: {
    color: "#999999"
  },
  selectDropDown: {
    paddingTop: 0,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "14px",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right"
  },
  currencyLabel: {
    float: "left",
    backgroundColor: "white",
    fontSize: 16,
    fontWeight: 400,
    color: "black"
  },
  customFormControlClasses: {
    margin: "0px"
  },
  customDateControlClasses: {
    paddingTop: 6
  },
  boxInput: {
    border: "1px solid #757575",
    padding: 5
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
    maxWidth: "400px",
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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  center: {
    textAlign: "center "
  },
  checkboxLabelControl: {
    margin: "0",
  },
  checkboxLabel: {
    marginLeft: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)",
  },  
  ...customSelectStyle,
  ...regularFormsStyle,
  ...customCheckboxRadioSwitch
});

const categoryOptions = [
  { name: "Payables", value: "payables" },
  { name: "Receivables", value: "receivables" },
  { name: "Forecasted Revenues", value: "forecastedRevenues" },
  { name: "Forecasted Costs", value: "forecastedCosts" },
  { name: "Asset or Investments", value: "assets" },
  { name: "Liabilities", value: "liabilities" },
  { name: "External Hedges", value: "externalHedges" }
];

const initialState = {
  callInProgress: false,
  noticeModal: false,
  noticeModalHeader: "",
  noticeModalErrMsg: "",
  confirmationModal: false,
  confirmationModalHeader: "",
  confirmationModalMsg: "",

  selectedCategory: "",
  selectedCategoryTab: "payables",

  amount: 0,
  amountState: "",
  amountPristine: false,
  amountErrorMsg: [],
  date: null,
  dateState: "",
  datePristine: false,
  dateErrorMsg: [],
  description: "",
  descriptionState: "",
  descriptionPristine: false,
  descriptionErrorMsg: [],

  dealDate: null,
  dealDateState: "",
  dealDatePristine: false,
  dealDateErrorMsg: [],

  settlementDate: null,
  settlementDatePristine: false,
  settlementDateErrorMsg: [],

  currencyBought: 0,
  currencyBoughtPristine: false,
  currencyBoughtErrorMsg: [],

  currencySold: 0,
  currencySoldState: "",
  currencySoldPristine: false,
  currencySoldErrorMsg: [],
  boughtCurrencyCode: "",
  boughtCurrencyCodeState: "",
  soldCurrencyCode: "",
  soldCurrencyCodeState: "",
  selectedCategoryState: "",
  selectedCategory: "",
  currencycode: "",
  currencycodeState: "",
  referenceId: "",
  dealId: "",

  refIdState: "",
  refIdPristine: false,
  refIdErrorMsg: [],
  id: null,
  checkedCashAssets: false
};

class RiskInputDialog extends React.Component {
  error = {
    hedgingPercentagePayablesErrorMsg: {
      required: "Hedging Percentage value is required",
      range: "Hedging percentage value should be between 0 to 100"
    },
    hedgingPercentageReceivablesErrorMsg: {
      required: "Hedging Percentage value is required",
      range: "Hedging percentage value should be between 0 to 100"
    },
    hedgingPercentageForecastedRevenuesErrorMsg: {
      required: "Hedging Percentage value is required",
      range: "Hedging percentage value should be between 0 to 100"
    },
    hedgingPercentageForecastedCostsErrorMsg: {
      required: "Hedging Percentage value is required",
      range: "Hedging percentage value should be between 0 to 100"
    },
    hedgingPercentageExistingAssetsErrorMsg: {
      required: "Hedging Percentage value is required",
      range: "Hedging percentage value should be between 0 to 100"
    },
    hedgingPercentageExistingLiabilitiesErrorMsg: {
      required: "Hedging Percentage value is required",
      range: "Hedging percentage value should be between 0 to 100"
    },
    functionalCurrencyErrorMsg: {
      required: "Currency value is required"
    },
    amountErrorMsg: {
      required: "Amount is required"
    },
    dateErrorMsg: {
      required: "Date is required"
    },
    dealDateErrorMsg: {
      required: "Deal Date is required"
    },
    settlementDateErrorMsg: {
      required: "Settlement Date is required"
    },
    currencySoldErrorMsg: {
      required: "Amount is required"
    },
    currencyBoughtErrorMsg: {
      required: "Amount is required"
    }
  };

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount = () => {
    this.initialzeData();
  };
  onConfirmClick = () => {
    if (this.isValidateCategoryData()) {
      let displayId =
        this.state.selectedCategory === "externalHedges"
          ? this.state.dealId
          : this.state.referenceId;
      this.props.onConfirmClick(
        this.state.selectedCategory,
        displayId,
        this.state.amount,
        this.state.currencycode,
        this.state.description,
        this.state.date,
        this.state.dealDate,
        this.state.boughtCurrencyCode,
        this.state.currencyBought,
        this.state.soldCurrencyCode,
        this.state.currencySold,
        this.state.settlementDate,
        this.state.id,
        this.props.editCategoryData,
        this.state.checkedCashAssets,
        true
      );
    }
  };
  isValidateCategoryData = () => {
    if (
      this.state.selectedCategoryState === "success" &&
      this.state.currencycodeState === "success" &&
      // this.state.currencycode !== this.state.functionalCurrency &&
      this.state.amountState === "success" &&
      this.state.selectedCategory != "externalHedges"
    ) {
      if (this.state.dateState === "success") {
        return true;
      } else {
        if (this.state.dateState !== "success") {
          if (this.state.dateState === "") {
            this.state.dateErrorMsg.push(this.error["dateErrorMsg"].required);
          }
          this.setState({ dateState: "error" });
        }
        return false;
      }
      // }
      return true;
    } else if (
      this.state.selectedCategoryState === "success" &&
      this.state.dealDateState === "success" &&
      this.state.boughtCurrencyCodeState === "success" &&
      this.state.currencyBoughtState === "success" &&
      this.state.soldCurrencyCodeState === "success" &&
      this.state.currencySoldState === "success" &&
      this.state.settlementDateState === "success" &&
      this.state.selectedCategory == "externalHedges"
    ) {
      return true;
    } else {
      if (
        this.state.selectedCategoryState !== "success" &&
        this.state.selectedCategory !== "externalHedges"
      ) {
        this.setState({ selectedCategoryState: "error" });
      }
      if (
        this.state.currencycodeState !== "success" &&
        this.state.selectedCategory !== "externalHedges"
      ) {
        this.setState({ currencycodeState: "error" });
      }
      if (
        this.state.amountState !== "success" &&
        this.state.selectedCategory !== "externalHedges"
      ) {
        if (this.state.amountState === "") {
          this.state.amountErrorMsg.push(this.error["amountErrorMsg"].required);
        }
        this.setState({ amountState: "error" });
      }

      if (
        this.state.dealDateState !== "success" &&
        this.state.selectedCategory == "externalHedges"
      ) {
        if (this.state.dealDateState === "") {
          this.state.dealDateErrorMsg.push(
            this.error["dealDateErrorMsg"].required
          );
        }
        this.setState({ dealDateState: "error" });
      }
      if (
        this.state.settlementDateState !== "success" &&
        this.state.selectedCategory == "externalHedges"
      ) {
        if (this.state.settlementDateState === "") {
          this.state.settlementDateErrorMsg.push(
            this.error["settlementDateErrorMsg"].required
          );
        }
        this.setState({ settlementDateState: "error" });
      }
      if (
        this.state.soldCurrencyCodeState !== "success" &&
        this.state.selectedCategory == "externalHedges"
      ) {
        this.setState({ soldCurrencyCodeState: "error" });
      }
      if (
        this.state.boughtCurrencyCodeState !== "success" &&
        this.state.selectedCategory == "externalHedges"
      ) {
        this.setState({ boughtCurrencyCodeState: "error" });
      }

      if (
        this.state.currencyBoughtState !== "success" &&
        this.state.selectedCategory == "externalHedges"
      ) {
        if (this.state.currencyBoughtState === "") {
          this.state.currencyBoughtErrorMsg.push(
            this.error["currencyBoughtErrorMsg"].required
          );
        }
        this.setState({ currencyBoughtState: "error" });
      }
      if (
        this.state.currencySoldState !== "success" &&
        this.state.selectedCategory == "externalHedges"
      ) {
        if (this.state.currencySoldState === "") {
          this.state.currencySoldErrorMsg.push(
            this.error["currencySoldErrorMsg"].required
          );
        }
        this.setState({ currencySoldState: "error" });
      }
    }
    return false;
  };

  getCategory = (name, rowIndex) => {
    let obj = categoryOptions.filter(x => x.name === name);
    if (obj.length > 0) {
      return categoryOptions.filter(x => x.name === name)[0].value;
    } else {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg:
          "Category in row " + rowIndex + " cell A is not valid"
      });
      return "";
    }
  };
  getDate = (date, rowIndex) => {
    if (!moment(date).isValid()) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg:
          "Date in row " +
          rowIndex +
          " cell A. Is not valid. Please enter date in YYYY-MM-DD format."
      });
      return null;
    } else {
      return date;
    }
  };
  initialzeData = () => {
    if (this.props.editCategoryData) {
      this.setState({
        ...this.props.editObject,
        checkedCashAssets: this.props.editObject.notExpired
      });
    }
  };

  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };

  changePercentage = (event, stateName, rules) => {
    const value = event.target.value.substring(
      0,
      event.target.value.length - 1
    );
    this.setState(validate(value, stateName, this.state, rules, this.error));
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onChange = (stateArr, index, name) => event => {
    // console.log("onchange", stateArr);
    // console.log("onchange", index);

    // console.log("onchange", event.target.name);

    let arr = this.state[stateArr];
    if (index != null) {
      arr[index][name] = event.target.value;
      // console.log("onchange314", arr);
    } else {
      if (stateArr == "profit") {
        // if(event.target.value=='other'){
        //   arr.amount=''
        // }else{
        //   arr.amount=event.target.value
        // }
        arr[name] = event.target.value;
      } else {
        arr = event.target.value;
      }
    }

    this.setState({ [stateArr]: arr }, () => {
      // console.log(stateArr);
      // console.log(arr);
      // console.log(this.state.senstitivityPercentage);
    });
  };

  handleDateChange = (name, date) => {
    // console.log(moment(date).format("DD-MM-YYYY"));
    this.setState(
      validate(
        moment(date).format("YYYY-MM-DD"),
        name,
        this.state,
        [],
        this.error
      )
    );
  };

  onChangeSelect = (e, name, text) => {
    this.setState(validate(e.target.value, name, this.state, [], this.error));
  };

  handleClickSelectCategory = selectedCategory => {
    let selectedIndicatorList = this.state[selectedCategory + "Display"].slice(
      0,
      this.state.recordsPerPage
    );

    this.setState({
      selectedCategoryTab: selectedCategory,
      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: selectedIndicatorList
    });
  };

  render() {
    const { classes, currencies } = this.props;
    console.log(this.props);
    return (
      <>
        <Dialog
          classes={{
            root: classes.modalRoot
          }}
          // maxWidth='sm'
          open
          style={{ zIndex: 1032 }}
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
            className={cx(classes.center, classes.modalHeader)}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.props.toggleRiskInputDialog(false)}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>
              {this.props.editCategoryData ? "Edit" : "Add"}
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <form className={classes.form}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <FormControl
                    fullWidth
                    style={{ paddingTop: 9, paddingBottom: 15 }}
                  >
                    <InputLabel
                      htmlFor="type"
                      className={classes.selectLabelRisk}
                    >
                      Category
                    </InputLabel>
                    <Select
                      disabled={this.props.editCategoryData}
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      value={this.state.selectedCategory}
                      onChange={e => this.onChangeSelect(e, "selectedCategory")}
                      inputProps={{
                        name: "selectedCategory",
                        id: "selectedCategory",
                        classes: {
                          icon: classes.white,
                          root: classes.selectDropDown
                        }
                      }}
                    >
                      <MenuItem
                        disabled
                        key={"selectedCategory"}
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Option
                      </MenuItem>
                      {categoryOptions.map((item, index) => (
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value={item.value}
                          key={index}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      style={{ color: "red" }}
                      hidden={this.state.selectedCategoryState !== "error"}
                    >
                      Category selection is required
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  {this.state.selectedCategory !== "externalHedges" ? (
                    <CustomInput
                      labelText="Reference ID"
                      id="rr_id"
                      onChange={event =>
                        this.handleChange("referenceId", event)
                      }
                      value={this.state.referenceId}
                      formControlProps={{
                        style: { marginTop: -5 },
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({ idPristine: false });
                          this.change(event, "referenceId", []);
                        },
                        onChange: event => {
                          if (!this.state.idPristine) {
                            this.setState({ idPristine: false });
                            this.change(event, "referenceId", []);
                          }
                        }
                      }}
                    />
                  ) : (
                    <CustomInput
                      labelText="Deal ID"
                      id="rr_id"
                      onChange={event => this.handleChange("dealId", event)}
                      value={this.state.dealId}
                      formControlProps={{
                        style: { marginTop: -5 },
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({ idPristine: false });
                          this.change(event, "dealId", []);
                        },
                        onChange: event => {
                          if (!this.state.idPristine) {
                            this.setState({ idPristine: false });
                            this.change(event, "dealId", []);
                          }
                        }
                      }}
                    />
                  )}
                </GridItem>

                <GridItem xs={12} sm={12} md={4} lg={4}>
                  {this.state.selectedCategory !== "externalHedges" ? (
                    <FormControl fullWidth>
                      <CustomNumberFormat
                        success={this.state.amountState === "success"}
                        error={this.state.amountState === "error"}
                        helpText={
                          this.state.amountState === "error" &&
                          this.state.amountErrorMsg[0]
                        }
                        value={this.state.amount}
                        labelText="Amount"
                        onChange={event => this.handleChange("amount", event)}
                        name="amount"
                        id={"amount"}
                        formControlProps={{
                          style: { marginTop: -5 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              amountPristine: false
                            });
                            this.change(event, "amount", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.amountPristine) {
                              this.setState({
                                amountPristine: false
                              });
                              this.change(event, "amount", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    </FormControl>
                  ) : (
                    <CustomDateSelector
                      success={this.state.dealDateState === "success"}
                      error={this.state.dealDateState === "error"}
                      helpText={
                        this.state.dealDateState === "error" &&
                        this.state.dealDateErrorMsg
                      }
                      id="rr_date"
                      inputProps={{
                        format: "dd MMM yyyy",
                        label: "Deal Date",
                        value: this.state.dealDate,
                        onChange: date =>
                          this.handleDateChange("dealDate", date),
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
                  )}
                </GridItem>
                <GridItem xs={12} sm={12} md={4} lg={4}>
                  <FormControl
                    fullWidth
                    style={{
                      paddingTop: 9
                    }}
                  >
                    <InputLabel
                      htmlFor="type"
                      className={classes.selectLabelRisk}
                    >
                      {this.state.selectedCategory == "externalHedges"
                        ? "Currency Bought"
                        : "Currency"}
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      value={
                        this.state.selectedCategory == "externalHedges"
                          ? this.state.boughtCurrencyCode
                          : this.state.currencycode
                      }
                      onChange={e =>
                        this.onChangeSelect(
                          e,
                          this.state.selectedCategory == "externalHedges"
                            ? "boughtCurrencyCode"
                            : "currencycode"
                        )
                      }
                      inputProps={{
                        name: "currencycode",
                        id: "rr_currencycode",
                        classes: {
                          icon: classes.white,
                          root: classes.selectDropDown
                        }
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Currency
                      </MenuItem>
                      {currencies &&
                        currencies.map(item => (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={item.currencyCode}
                            key={item.currencyCode}
                          >
                            {item.currencyCode}
                          </MenuItem>
                        ))}
                    </Select>
                    {/* {this.state.selectedCategory !==
                                    "externalHedges" && (
                                    <FormHelperText
                                      style={{
                                        color: "red",
                                        backgroundColor: "white"
                                      }}
                                      hidden={
                                        this.state.currencycodeState !== "error"
                                      }
                                    >
                                      Choose currency other than local currency
                                    </FormHelperText>
                                  )}{" "} */}
                    {this.state.selectedCategory == "externalHedges" ? (
                      <FormHelperText
                        style={{
                          color: "red",
                          backgroundColor: "white"
                        }}
                        hidden={this.state.boughtCurrencyCodeState !== "error"}
                      >
                        Please select currency
                      </FormHelperText>
                    ) : (
                      <FormHelperText
                        style={{ color: "red" }}
                        hidden={this.state.currencycodeState !== "error"}
                      >
                        Currency is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </GridItem>
                {this.state.selectedCategory !== "externalHedges" && (
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    {!this.state.checkedCashAssets && (
                    <CustomDateSelector
                      success={this.state.dateState === "success"}
                      error={this.state.dateState === "error"}
                      helpText={
                        this.state.dateState === "error" &&
                        this.state.dateErrorMsg
                      }
                      id="rr_date"
                      inputProps={{
                        format: "dd MMM yyyy",
                        label:
                          this.state.selectedCategory === "assets"
                            ? "Expected Sale Date"
                            : this.state.selectedCategory === "liabilities"
                            ? "Expected Payment Date"
                            : "Date",
                        value: this.state.date,
                        onChange: date => this.handleDateChange("date", date),
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
                    )}
                  </GridItem>
                )}

                {this.state.selectedCategory !== "externalHedges" && (
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    <CustomInput
                      success={this.state.descriptionState === "success"}
                      error={this.state.descriptionState === "error"}
                      helpText={
                        this.state.descriptionState === "error" &&
                        this.state.descriptionErrorMsg[0]
                      }
                      labelText="Description"
                      id="s1_Description"
                      onChange={event =>
                        this.handleChange("description", event)
                      }
                      value={this.state.description}
                      formControlProps={{
                        style: { marginTop: -5 },
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                        onBlur: event => {
                          this.setState({
                            descriptionPristine: false
                          });
                          this.change(event, "description", []);
                        },
                        onChange: event => {
                          if (!this.state.descriptionPristine) {
                            this.setState({
                              descriptionPristine: false
                            });
                            this.change(event, "description", []);
                          }
                        }
                      }}
                    />
                  </GridItem>
                )}
                {this.state.selectedCategory == "externalHedges" && (
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    <FormControl fullWidth>
                      <CustomNumberFormat
                        success={this.state.currencyBoughtState === "success"}
                        error={this.state.currencyBoughtState === "error"}
                        helpText={
                          this.state.currencyBoughtState === "error" &&
                          this.state.currencyBoughtErrorMsg[0]
                        }
                        value={this.state.currencyBought}
                        labelText="Currency Bought Amount"
                        onChange={event =>
                          this.handleChange("currencyBought", event)
                        }
                        name="currencyBought"
                        id={"currencyBought"}
                        formControlProps={{
                          style: { marginTop: -5 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              currencyBoughtPristine: false
                            });
                            this.change(event, "currencyBought", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.currencyBoughtPristine) {
                              this.setState({
                                currencyBoughtPristine: false
                              });
                              this.change(event, "currencyBought", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    </FormControl>
                  </GridItem>
                )}
                {this.state.selectedCategory == "externalHedges" && (
                  <GridItem xs={12} sm={12} md={4} lg={4}>
                    <FormControl
                      fullWidth
                      style={{
                        paddingTop: 9
                      }}
                    >
                      <InputLabel
                        htmlFor="type"
                        className={classes.selectLabelRisk}
                      >
                        Currency Sold
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        value={this.state.soldCurrencyCode}
                        onChange={e =>
                          this.onChangeSelect(e, "soldCurrencyCode")
                        }
                        inputProps={{
                          name: "soldCurrencyCode",
                          id: "rr_soldCurrencyCode",
                          classes: {
                            icon: classes.white,
                            root: classes.selectDropDown
                          }
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          Currency
                        </MenuItem>
                        {currencies &&
                          currencies.map(item => (
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={item.currencyCode}
                              key={item.currencyCode}
                            >
                              {item.currencyCode}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText
                        style={{
                          color: "red",
                          backgroundColor: "white"
                        }}
                        hidden={this.state.soldCurrencyCodeState !== "error"}
                      >
                        Please select currency
                      </FormHelperText>
                    </FormControl>
                  </GridItem>
                )}

                {this.state.selectedCategory == "externalHedges" && (
                  <>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <FormControl fullWidth>
                        <CustomNumberFormat
                          success={this.state.currencySoldState === "success"}
                          error={this.state.currencySoldState === "error"}
                          helpText={
                            this.state.currencySoldState === "error" &&
                            this.state.currencySoldErrorMsg[0]
                          }
                          value={this.state.currencySold}
                          labelText="Currency Sold Amount"
                          onChange={event =>
                            this.handleChange("currencySold", event)
                          }
                          name="currencySold"
                          id={"currencySold"}
                          formControlProps={{
                            style: { marginTop: -5 },
                            fullWidth: true,
                            className: classes.customFormControlClasses,
                            onBlur: event => {
                              this.setState({
                                currencySoldPristine: false
                              });
                              this.change(event, "currencySold", [
                                { type: "required" }
                              ]);
                            },
                            onChange: event => {
                              if (!this.state.currencySoldPristine) {
                                this.setState({
                                  currencySoldPristine: false
                                });
                                this.change(event, "currencySold", [
                                  { type: "required" }
                                ]);
                              }
                            }
                          }}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomDateSelector
                        success={this.state.settlementDateState === "success"}
                        error={this.state.settlementDateState === "error"}
                        helpText={
                          this.state.settlementDateState === "error" &&
                          this.state.settlementDateErrorMsg
                        }
                        id="rr_date"
                        inputProps={{
                          format: "dd MMM yyyy",
                          label: "Settlement Date",
                          value: this.state.settlementDate,
                          onChange: date =>
                            this.handleDateChange("settlementDate", date),
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
                  </>
                )}
                {this.state.selectedCategory == "assets" && (
                  <GridItem xs={12} sm={12} md={8} lg={8} style={{marginBottom: "17px", textAlign: "right"}}>
                    <FormControlLabel
                      className={classes.center}
                      classes={{
                        root: classes.checkboxLabelControl,
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox                
                          tabIndex={-1}
                          onClick={(e) => this.setState({checkedCashAssets: e.target.checked, date: new Date(), dateState: 'success'})}
                          checkedIcon={<Check className={classes.checkedIcon} />}
                          checked={this.state.checkedCashAssets}
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      }
                      label={
                        <div className={classes.termsText}>
                          This is Cash Balance
                        </div>
                      }
                    />
                  </GridItem>
                )}
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div className={cx(classes.buttonContainer, classes.center)}>
                    <Button
                      round={false}
                      color="success"
                      size="lg"
                      onClick={() => this.onConfirmClick()}
                    >
                      CONFIRM
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

RiskInputDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  calculateGraph: PropTypes.func.isRequired,
  inputData: PropTypes.object,
  isChanged: PropTypes.bool,
  addRow: PropTypes.func,
  editObject: PropTypes.object,
  clearData: PropTypes.func
};

export default withStyles(style)(RiskInputDialog);
