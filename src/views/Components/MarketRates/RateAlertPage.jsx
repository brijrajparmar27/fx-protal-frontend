import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import HistoryIcon from "@material-ui/icons/History";
import Edit from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import signupPageStyle from "assets/jss/material-dashboard-pro-react/views/signupPageStyle";
import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

import Button from "components/CustomButtons/Button.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomMultilineText from "components/CustomMultilineText/CustomMultilineText.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import Table from "components/Table/Table.jsx";

import { validate } from "../../../utils/Validator";
import { formatMoney, parseCurrency } from "../../../utils/Utils";

import cx from "classnames";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const PRICEALERTOPTIONS = [
  { key: "MOVE_ABOVE", value: "Moves above" },
  { key: "MOVE_BELOW", value: "Moves below" }
];

const TABLECOLUMNKEY = [
  "currencyPair",
  "priceOption",
  "price",
  "frequency",
  "deliveryEmailEabled",
  "emailRecipents"
];

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
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

const style = theme => ({
  ...signupPageStyle,
  ...customSelectStyle,
  ...customInputStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important"
    //top: 7
  },
  select: {
    padding: "4px 24px",
    fontSize: 14
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: -15
    }
  },
  selectFormHelperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "left"
  },
  footer: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5
  },
  countryFormControl: {
  },
  phoneFormControl: {
    paddingTop: 0
  },
  modalCloseButton: {
    float: "right"
  },
  loginMaxWidth: {
    maxWidth: 650
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  graphIcon: {
    color: "green"
  },
  emptyIcon: {
    [theme.breakpoints.up("lg")]: {
      display: "none"
    }
  }
});

class RateAlertPage extends React.Component {
  error = {
    priceSelectedOptionErrorMsg: {
      required: "Please select Option"
    },
    priceErrorMsg: {
      required: "Price is required",
      positive: "Price should be positive number"
    },
    frequencyErrorMsg: {
      required: "Frequency is required"
    },
    emailIDsErrorMsg: {
      required: "Enter Email IDs"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      priceSelectedOption: "MOVE_ABOVE",
      priceSelectedOptionState: "",
      priceSelectedOptionPristine: true,
      priceSelectedOptionErrorMsg: [],

      price: "",
      priceState: "",
      pricePristine: false,
      priceErrorMsg: [],
      frequency: "Once",
      frequencyState: "",
      frequencyPristine: false,
      frequencyErrorMsg: [],

      emailIDs: "",
      emailIDsState: "",
      emailIDsPristine: false,
      emailIDsErrorMsg: [],
      tableData: [],
      sendEmail: true,

      showExistingAlerts: false,

      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: [],

      tableColumns: [
        "Currency Pair",
        "Condition",
        "Price",
        "Email Recipents",
        ""
      ],
      currencyPair: "",
      notification: "Email",
      id: -1,
      editDetails: false
    };
  }

  componentDidMount = () => {
    this.getAllCurrencyAlerts(false);
    this.getliveExchangeRateData();
  };
  getliveExchangeRateData = async () => {
    if (!this.props.currencyPair) return;
    
    const res = await apiHandler({
      url:
        endpoint.MARKET_EXCHANGE_RATE_LIVE +
        "?currency=" +
        this.props.currencyPair,
      authToken: sessionStorage.getItem("token")
    });
    if (
      res.data.errorCode &&
      (res.data.errorCode === 403 || res.data.errorCode === 500)
    ) {
      return;
    } else if (res.data.errorCode) {
      return;
    } else {
      let exchangeRates =
        res.data.exchangeRates && res.data.exchangeRates.length > 0
          ? res.data.exchangeRates[0]
          : null;
      // console.log("exchangeRates - ", exchangeRates);

      if (exchangeRates) {
        this.setState({
          price: exchangeRates.mid,
          priceState: "success"
        });
      }
    }
  };

  getAllCurrencyAlerts = async openManageCurrencyAlert => {
    const res = await apiHandler({
      url: endpoint.CURRENCY_ALERTS,
      authToken: sessionStorage.getItem("token")
    });
    if (
      res.data.errorCode &&
      (res.data.errorCode === 403 || res.data.errorCode === 500)
    ) {
      //this.props.setLoading(false);
      return;
    } else if (res.data.errorCode) {
      //this.props.setLoading(false);

      return;
    } else {
      //let exchangeRates=res.data.exchangeRates?res.data.exchangeRates:[]
      let apiData = res.data && res.data.length > 0 ? res.data : [];
      this.setState({
        apiData: apiData
      });
      this.parseData(apiData, openManageCurrencyAlert);
    }
  };

  parseData = (apiData, openManageCurrencyAlert) => {
    // let obj = apiData.filter(x => x.symbol === this.props.currencyPair);
    let tableData = this.getTableData(apiData);
    // if (obj.length > 0) {
    //   this.setState({
    //     currencyPair: obj[0].symbol,
    //     price: obj[0].price,
    //     priceSelectedOption: obj[0].condition,
    //     emailIDs: obj[0].email,
    //     priceState: "success",
    //     emailIDsState: "success",
    //     sendEmail: true,
    //     showExistingAlerts: openManageCurrencyAlert,
    //     tableData: tableData,
    //     selectedIndicatorList: tableData.slice(0, this.state.recordsPerPage),
    //     editDetails: true,
    //     id: obj[0].id
    //   });
    // } else {
    this.setState({
      currencyPair: this.props.currencyPair,
      showExistingAlerts: openManageCurrencyAlert,
      tableData: tableData,
      selectedIndicatorList: tableData.slice(0, this.state.recordsPerPage),
      editDetails: false,
      id: -1
    });
    // }
  };

  handleSimple = event => {
    this.setState(
      validate(
        event.target.value,
        event.target.name,
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };

  onSubmit = async () => {
    if (this.isValidated()) {
      this.setState({
        callInProgress: true
      });
      let param = {
        symbol: this.state.currencyPair,
        price: parseCurrency(this.state.price),
        condition: this.state.priceSelectedOption,
        email: this.state.emailIDs
      };
      if (this.state.editDetails) {
        param = {
          ...param,
          id: this.state.id
        };
      }
      const res = await apiHandler({
        method: "POST",
        url: endpoint.CURRENCY_ALERT_ADD,
        data: param,
        authToken: sessionStorage.getItem("token")
      });
      this.setState({ callInProgress: false });
      if (res.data.errorCode && res.data.errorCode === 404) {
        return;
      } else if (res.data.errorCode) {
        return;
      } else {
        this.getAllCurrencyAlerts(true);

        // this.props.onSubmitCurrencyPair()
      }
    }
  };
  isValidated = () => {
    if (
      this.state.priceState === "success" &&
      this.state.emailIDsState === "success"
    ) {
      return true;
    } else {
      if (this.state.priceState !== "success") {
        this.setState({ priceState: "error" });
      }
      if (this.state.emailIDsState !== "success") {
        this.setState({ emailIDsState: "error" });
      }

      return false;
    }
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };
  handleToggle = event => {
    this.setState({
      sendEmail: event.target.checked
    });
  };
  getTableData = apiData => {
    let tableData = [];
    apiData.map((data, index) => {
      let priceArr = data.price.toString().split(".");
      console.log(priceArr);

      let decimalPlaces =
        priceArr.length < 2
          ? 0
          : priceArr[1].toString().length > 5
          ? 5
          : priceArr[1].toString().length;
      tableData = [
        ...tableData,
        [
          index,
          data.symbol,
          data.condition,
          formatMoney(data.price, decimalPlaces),
          data.email,
          this.editButtonView(data)
        ]
      ];
    });

    return tableData;
  };
  getPageDetails = () => {
    let DataCount = Math.ceil(
      this.state.tableData.length / this.state.recordsPerPage
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

  editButtonView = rowData => {
    const { classes } = this.props;
    return (
      <div>
        <IconButton
          aria-label="close"
          // className={this.props.classes.graphIcon}
          onClick={() => this.onClickEdit(rowData)}
        >
          <Edit />
        </IconButton>
        <IconButton
          aria-label="delete"
          // className={this.props.classes.graphIcon}
          onClick={() => this.onClickDelete(rowData)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  };
  onClickEdit = data => {
    this.setState({
      currencyPair: data.symbol,
      price: data.price,
      priceSelectedOption: data.condition,
      emailIDs: data.email,
      priceState: "success",
      emailIDsState: "success",
      sendEmail: true,
      showExistingAlerts: false,
      editDetails: true,
      id: data.id
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currencyPair !== this.props.currencyPair) {
        // console.log('currencyPair prop has changed.', this.state.currencyPair);
        this.getliveExchangeRateData();
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.currencyPair !== state.currencyPair) {
      return {
        currencyPair: props.currencyPair
      };
    }
    return null;
  }
  onClickDelete = async rowData => {
    this.setState({
      callInProgress: true
    });
    const res = await apiHandler({
      method: "DELETE",
      url: endpoint.CURRENCY_ALERT_DELETE + rowData.id,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode && res.data.errorCode === 404) {
      return;
    } else if (res.data.errorCode) {
      return;
    } else {
      this.getAllCurrencyAlerts(true);

      // this.props.onSubmitCurrencyPair()
    }
  };
  getPageData = event => {
    let pageIndex = 0;
    let pageCount = Math.ceil(
      this.state.tableData.length / this.state.recordsPerPage
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

    let selectedList = this.state.tableData.slice(
      (pageIndex - 1) * this.state.recordsPerPage,
      pageIndex * this.state.recordsPerPage
    );
    this.setState({
      selectedPageIndex: pageIndex,
      selectedIndicatorList: selectedList
    });
  };
  existingAlertsView = () => {
    const { classes, currencyPairs } = this.props;
    return (
      <GridContainer>
                        <GridItem xs={5} sm={5} md={5} lg={5} style={{ float: "right" }}>
                <Button
                  round={false}
                  color="info"
                  size="md"
                  onClick={() => this.showExistingAlerts(false)}
                >
                  Configure my alerts
                </Button>
              </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <Table
            striped
            tableHeaderColor="info"
            tableHead={this.state.tableColumns}
            tableData={this.state.selectedIndicatorList}
            customHeadCellClasses={[]}
            customHeadClassesForCells={[]}
            customCellClasses={[]}
            customClassesForCells={[]}
          />
          <Pagination
            pages={this.getPageDetails()}
            currentPage={this.state.selectedPageIndex}
            color="info"
            onClick={this.getPageData}
          />
        </GridItem>
      </GridContainer>
    );
  };
  configureAlertView = () => {
    const { classes, currencyPairs } = this.props;
    return (
      <form className={classes.form}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            {/* <IconButton
aria-label="close"
className={this.props.classes.graphIcon}
// onClick={() => this.openRateAlertPageModal(obj)}
> */}
            <GridContainer>
              <GridItem
                xs={7}
                sm={7}
                md={7}
                lg={7}
                style={{ textAlign: "right" }}
              >
                <TrendingUpIcon className={this.props.classes.graphIcon} />
                <b>{this.state.currencyPair}</b>
              </GridItem>
              <GridItem xs={5} sm={5} md={5} lg={5} style={{ float: "right" }}>
                <Button
                  round={false}
                  color="info"
                  size="md"
                  onClick={() => this.showExistingAlerts(true)}
                >
                  Manage my alerts
                </Button>
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ textAlign: "left", marginTop: "20px" }}
          >
            <b>{"Condition"}</b>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridContainer>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <FormControl fullWidth className={classes.countryFormControl}>
                  <FormHelperText
                    style={{
                      backgroundColor: "white",
                      paddingTop: 5,
                      marginTop: 0,
                      textAlign: "left"
                    }}
                    success={this.state.priceSelectedOption === "success"}
                    error={this.state.priceSelectedOptionState === "error"}
                    helpText={
                      this.state.priceSelectedOptionState === "error" &&
                      this.state.priceSelectedOptionErrorMsg[0]
                    }
                  >
                    Price Movement*
                  </FormHelperText>
                  {/* <InputLabel
          htmlFor="type"
          className={classes.selectLabel}
        >
          Country*
        </InputLabel> */}
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={this.state.priceSelectedOption}
                    onChange={this.handleSimple}
                    inputProps={{
                      name: "priceSelectedOption",
                      id: "priceSelectedOption"
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Choose Option
                    </MenuItem>
                    {PRICEALERTOPTIONS.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.key}
                        key={item.key}
                      >
                        {item.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <CustomNumberFormat
                  success={this.state.priceState === "success"}
                  error={this.state.priceState === "error"}
                  helpText={
                    this.state.priceState === "error" &&
                    this.state.priceErrorMsg[0]
                  }
                  value={this.state.price}
                  labelText="Price"
                  onChange={this.handleChange}
                  id={"price"}
                  formControlProps={{
                    name: "price",
                    style: { paddingTop: 5 },
                    fullWidth: true,
                    className: classes.customFormControlClasses,
                    onBlur: event => {
                      this.setState({
                        pricePristine: false
                      });
                      this.change(event, "price", [
                        { type: "required" },
                        { type: "positive" }
                      ]);
                    },
                    onChange: event => {
                      if (!this.state.pricePristine) {
                        this.setState({
                          pricePristine: false
                        });
                        this.change(event, "price", [
                          { type: "required" },
                          { type: "positive" }
                        ]);
                      }
                    }
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          {/* <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'left', marginTop: '20px' }}>

                    <b>{'Frequency'}</b>

                </GridItem> */}
          {/* <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ textAlign: "left", marginTop: "20px" }}
          >
            <GridContainer>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <b>{"Frequency"}</b>
              </GridItem>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <b>{"Notification"}</b>
              </GridItem>
            </GridContainer>
          </GridItem> */}
          {/* <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridContainer spacing={1} alignItems="center">
              <GridItem xs={1} sm={1} md={1} lg={1}>
                <HistoryIcon className={classes.inputAdornmentIcon} />
              </GridItem>
              <GridItem
                className={classes.customText}
                xs={5}
                sm={5}
                md={5}
                lg={5}
              >
                <CustomInput
                  success={this.state.frequencyState === "success"}
                  error={this.state.frequencyState === "error"}
                  helpText={
                    this.state.frequencyState === "error" &&
                    this.state.frequencyErrorMsg[0]
                  }
                  labelText="Frequency*"
                  id="sp_frequency"
                  value={this.state.frequency}
                  formControlProps={{
                    disabled: true,
                    fullWidth: true,
                    className: classes.customFormControlClasses,
                    onBlur: event => {
                      this.setState({ frequencyPristine: false });
                      this.change(event, "frequency", [
                        { type: "required" },
                        { type: "frequency" }
                      ]);
                    },
                    onChange: event => {
                      if (!this.state.frequencyPristine) {
                        this.setState({ frequencyPristine: false });
                        this.change(event, "frequency", [{ type: "required" }]);
                      }
                    }
                  }}
                />
              </GridItem>
              <GridItem
                className={classes.customText}
                xs={6}
                sm={6}
                md={6}
                lg={6}
              >
                <CustomInput
                  labelText="Notification*"
                  id="sp_notification"
                  helpText={""}
                  value={this.state.notification}
                  formControlProps={{
                    disabled: true,
                    fullWidth: true,
                    className: classes.customFormControlClasses
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridItem> */}
          {/* <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'left', marginTop: '20px' }}>

                    <b>{'Notification'}</b>

                </GridItem> */}
          {/* <GridItem xs={6} sm={6} md={6} lg={6}>
                    <FormControlLabel
                        className={this.props.classes.center}
                        classes={{
                            root: this.props.classes.checkboxLabelControl,
                            label: this.props.classes.checkboxLabel,
                        }}
                        control={
                            <Switch
                                color='primary'
                                tabIndex={-1}
                                id={'checkbox'}
                                onChange={this.handleToggle}
                                checked={this.state.sendEmail}
                                disabled
                            // value={this.state.enableUserList[userID]}
                            // checkedIcon={<Check className={this.props.classes.checkedIcon} />}
                            // icon={<Check className={this.props.classes.uncheckedIcon} />}
                            // classes={{
                            //   checked: this.props.classes.checked,
                            //   root: this.props.classes.checkRoot,
                            // }}
                            />
                        }
                        label="Send Email"
                    />
                </GridItem>
              */}
          {this.state.sendEmail && (
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <CustomMultilineText
                success={this.state.emailIDsState === "success"}
                error={this.state.emailIDsState === "error"}
                helpText={
                  this.state.emailIDsState === "error" &&
                  this.state.emailIDsErrorMsg[0]
                    ? this.state.emailIDsErrorMsg[0]
                    : "Enter Email IDs separated by comma (,) Email Alerts will be sent once, when your condition is true."
                }
                value={this.state.emailIDs}
                labelText="Email ID"
                onChange={this.handleChange}
                id={"emailIDs"}
                formControlProps={{
                  name: "emailIDs",
                  style: { paddingTop: 5 },
                  fullWidth: true,
                  className: classes.customFormControlClasses,
                  onBlur: event => {
                    this.setState({
                      emailIDsPristine: false
                    });
                    this.change(event, "emailIDs", [{ type: "required" }]);
                  },
                  onChange: event => {
                    if (!this.state.emailIDsPristine) {
                      this.setState({
                        emailIDsPristine: false
                      });
                      this.change(event, "emailIDs", [{ type: "required" }]);
                    }
                  }
                }}
              />
            </GridItem>
          )}
          <GridItem xs={12} sm={12} md={12} lg={12}>
            <GridContainer
              spacing={1}
              style={{ textAlign: "center", marginTop: 20 }}
            >
              <GridItem
                className={classes.customText}
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <div className={classes.center}>
                  {this.state.callInProgress ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      onClick={() => this.onSubmit()}
                    >
                      SUBMIT
                    </Button>
                  )}
                </div>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </form>
    );
  };
  showExistingAlerts = (value) => {
    this.setState({
      selectedIndicatorList: this.state.tableData.slice(
        0,
        this.state.recordsPerPage
      ),
      showExistingAlerts: value
    });
  };
  render() {
    const { classes, currencyPairs } = this.props;
    return (
      <>
        {this.state.showExistingAlerts
            ? this.existingAlertsView()
            : this.configureAlertView()}
      </>
    );
  }
}
RateAlertPage.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(RateAlertPage);
