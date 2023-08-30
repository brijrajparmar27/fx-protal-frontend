import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { NavLink } from "react-router-dom";

// @material-ui/icons
import SwapHoriz from "@material-ui/icons/SwapHoriz";
// import LockOutline from "@material-ui/icons/LockOutline";
import { validate } from "../../utils/Validator";
import { formatMoney, formatDate, sortArray } from "../../utils/Utils";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Typography from "@material-ui/core/Typography";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import StatusCard from "components/StatusCard/DashboardStatusCard.jsx";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
import { IconButton } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CSVLink } from "react-csv";
import ListAltIcon from "@material-ui/icons/ListAlt";
import Table from "components/Table/Table.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import Pagination from "components/Pagination/Pagination.jsx";
import EditUsers from "./EditUsers";
import ChartistGraph from "react-chartist";
import { dailySalesChart } from "variables/charts";
import NoticeModal from "views/Components/NoticeModal.jsx";
import TopupMarginDialog from "views/Components/Deals/TopupMarginDialog.jsx";
import PortalDashboardGraph from "views/Components/MarketRates/PortalDashboardGraph";
import CurrencyPairAlert from "views/Components/MarketRates/CurrencyPairAlert";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import RateCalculator from "views/Pages/RateCalculator";
import CustomerRegistrationDialog from "views/Components/CustomerRegistrationDialog.jsx";

import {
  cardTitle,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const users = [
  {
    id: 1,
    firstName: "Saravanakumar",
    lastName: "Velusamy",
    phone: "+55 98 765 3456",
    role: "Owner",
    email: "jeo@company.com"
  },
  {
    id: 2,
    firstName: "Aryan",
    lastName: "Saravanakumar",
    phone: "+55 98 765 3456",
    role: "Owner",
    email: "jeo@company.com"
  },
  {
    id: 3,
    firstName: "Aryan",
    lastName: "Saravanakumar",
    phone: "+55 98 765 3456",
    role: "Owner",
    email: "jeo@company.com"
  },
  {
    id: 4,
    firstName: "Aryan",
    lastName: "Saravanakumar",
    phone: "+55 98 765 3456",
    role: "Owner",
    email: "jeo@company.com"
  }
];
const styles = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  tableFontSize: {
    fontSize: 12
  },
  title: {
    color: "black",
    position: "absolute",
    marginLeft: 20,
    marginTop: 20
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
  filterInput: {
    top: -20
  },
  // icon: {
  //   color: "#333333",
  //   margin: "10px auto 0",
  //   width: "130px",
  //   height: "130px",
  //   border: "1px solid #E5E5E5",
  //   borderRadius: "50%",
  //   lineHeight: "174px",
  //   "& svg": {
  //     width: "55px",
  //     height: "55px"
  //   },
  //   "& .fab,& .fas,& .far,& .fal,& .material-icons": {
  //     width: "55px",
  //     fontSize: "55px"
  //   }
  // },
  iconRose: {
    color: roseColor
  },
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "25px",
    height: "25px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black",
    borderRadius: 3
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
    color: "white"
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46
  },
  info: {
    display: "inline-block",
    verticalAlign: "super",
    fontSize: 14,
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
    backgroundColor: "grey",
    color: "white !important",
    height: 25,
    width: 70
  },
  white: {
    color: "white"
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white"
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right"
  },
  tooltipCalculator: {
    padding: "10px 15px",
    minWidth: "200px",
    color: whiteColor,
    lineHeight: "1.7em",
    background: "rgb(" + hexToRgb(grayColor[6]) + ")",
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
    textAlign: "top",
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
  marketLink: {
    color: "#3c4858",
    "&:hover": {
      color: "#4CAF50"
    }
  },
  ...customSelectStyle,
  ...regularFormsStyle
};
const ColumnDetails = {
  FXFWD: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    { name: "Trade Date", dataType: "date", key: "dealDate", sort: true },
    {
      name: "Settlement Date",
      dataType: "date",
      key: "settlementDate",
      sort: true
    },
    {
      name: "Currency Bought",
      dataType: "number",
      key: "currencyBought",
      sort: false
    },
    {
      name: "Currency Sold",
      dataType: "number",
      key: "currencySold",
      sort: false
    },
    {
      name: "Current Valuation",
      dataType: "number",
      key: "currentValuation",
      sort: false
    },
    { name: "Status", dataType: "string", key: "status", sort: false }
  ],
  FXSPOT: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    { name: "Trade Date", dataType: "date", key: "dealDate", sort: true },
    {
      name: "Settlement Date",
      dataType: "date",
      key: "settlementDate",
      sort: true
    },
    {
      name: "Currency Bought",
      dataType: "number",
      key: "currencyBought",
      sort: false
    },
    {
      name: "Currency Sold",
      dataType: "number",
      key: "currencySold",
      sort: false
    },
    { name: "Status", dataType: "string", key: "status", sort: false }
  ],
  MARGINS: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    { name: "Trade Date", dataType: "date", key: "dealDate", sort: true },
    {
      name: "Settlement Date",
      dataType: "date",
      key: "settlementDate",
      sort: true
    },
    {
      name: "Current Valuation",
      dataType: "number",
      key: "currentValuation",
      sort: false
    },
    {
      name: "Initial Margin",
      dataType: "number",
      key: "marginDeposit",
      sort: false
    },
    { name: "Status", dataType: "string", key: "status", sort: false },
    { name: " ", dataType: "string", key: "status", sort: false }
  ],
  PAYMENTS: [
    { name: "Deal ID", dataType: "string", key: "dealId", sort: false },
    { name: "Payment Date", dataType: "date", key: "dealDate", sort: true },
    {
      name: "Beneficiary",
      dataType: "string",
      key: "beneficiaryName",
      sort: false
    },
    {
      name: "Amount Paid",
      dataType: "number",
      key: "transferAmount",
      sort: false
    },
    { name: "Status", dataType: "string", key: "status", sort: false }
  ]
};
class PortalDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.csvDownloadLink = React.createRef();
    this.state = {
      isDashboard: true,
      user: users[0],
      payment: "",
      turnover: "",
      desgin: false,
      code: "",
      codeState: "",
      codePristine: "",
      codeStateErrorMsg: "",
      develop: false,
      checked: false,
      buyCurrency: "",
      buyCurrencyState: "",
      mappedCurrencies: [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY"
      ],
      baseCurrency: "",
      quoteCurrency: "",
      sell: "",
      sellState: "",
      sellPristine: true,
      sellStateErrorMsg: [],
      sellCurrency: "",
      currency: "",
      buy: "",
      buyState: "",
      buyPristine: true,
      buyStateErrorMsg: [],
      dates: [],
      selectedDate: null,
      showEditUser: false,
      totalFunds: 0,
      baseCurrencycode: "EUR",
      noWalletMessage: "",
      wallets: [],
      fetchedWalletData: false,
      showSpot: true,
      showForward: false,
      showMargins: false,
      showPayments: false,
      dealColumns: this.dealStatusColumns["FXSPOT"],
      dealAllData: [],
      dealSelectedData: [],
      selectedPageIndex: 1,
      spotDealData: [],
      spotDealDownloadData: [],
      forwardDealData: [],
      forwardDealDownloadData: [],
      marginsDealData: [],
      marginsDealDownloadData: [],
      paymentsDealData: [],
      paymentsDealDownloadData: [],
      recordsPerPage: 10,
      isDealExecuted: false,
      dealDetails: {},
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: "",
      showCurrencyPairAlertModal: false,
      totalFundsDataFetched: false,
      sortByAscending: true,
      columnSortKey: "",
      columnDetails: ColumnDetails["FXSPOT"],
      apiData: [],
      spotDealAPIData: [],
      marginDealAPIData: [],
      forwardDealAPIData: [],
      paymentsDealAPIData: [],
      selectedTab: "FXSPOT",
      showTopupMarginModal: false,
      topupMarginAmount: "",
      topupMarginDate: "",
      showCustomerRegistrationDetails: false,
      customerRegistrationDetails: {}
    };
  }

  currencies = [
    {
      value: "USD",
      label: "US Dollars"
    },
    {
      value: "EUR",
      label: "European Dollars"
    },
    {
      value: "CAD",
      label: "Canada Dollars"
    }
  ];

  dealStatusColumns = {
    FXFWD: [
      "Deal ID",
      "Trade Date",
      "Settlement Date",
      "Currency Bought",
      "Currency Sold",
      "Current Valuation",
      "Status"
    ],
    FXSPOT: [
      "Deal ID",
      "Trade Date",
      "Settlement Date",
      "Currency Bought",
      "Currency Sold",
      "Status"
    ],
    MARGINS: [
      "Deal ID",
      "Trade Date",
      "Settlement Date",
      "Current Valuation",
      "Initial Margin",
      "Status",
      " "
    ],
    PAYMENTS: [
      "Deal ID",
      "Payment Date",
      "Beneficiary",
      "Amount Paid",
      "Status"
    ]
  };

  componentDidMount = () => {
    let dates = [];
    for (let i = 0; i < 5; i++) {
      let today = new Date();
      today.setDate(today.getDate() + i);
      dates.push(today);
    }
    if (
      sessionStorage.getItem("role") === "role-prospect-user" &&
      sessionStorage.getItem("status") === "registered"
    ) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Information",
        noticeModalErrMsg:
          "You have applied for Customer approval. We will get back to you once approved."
      });
    }

    this.getBaseCurrency();
    this.getCurrencies();
    this.getDealStatus();
    this.setState({ dates: dates });
    this.getCurrencyPair();
  };
  getCurrencyPair = async () => {
    const res = await apiHandler({
      url: endpoint.MARKET_INTELLIGENCE,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      let quoteCurrency = "GBP";
      let baseCurrency = "EUR";
      if (this.state.baseCurrencycode === "EUR") {
        baseCurrency = "EUR";
        quoteCurrency = "USD";
      } else if (this.state.baseCurrencycode === "GBP") {
        baseCurrency = "EUR";
        quoteCurrency = "GBP";
      } else {
        baseCurrency = "USD";
        quoteCurrency = this.state.baseCurrencycode;
      }
      this.setState({
        baseCurrency: baseCurrency,
        quoteCurrency: quoteCurrency
      });
      // console.log(res.data.userDesc);
      return;
    } else {
      console.log("getcurrencypair", res.data);
      if (res.data.fromCurrencyCode && res.data.toCurrencyCode) {
        this.setState({
          baseCurrency: res.data.fromCurrencyCode,
          quoteCurrency: res.data.toCurrencyCode
        });
      } else {
        this.setState({
          baseCurrency: "EUR",
          quoteCurrency: "GBP"
        });
      }
    }
  };
  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    let currencies = res.data.currrencies.map(curr => curr.currencyCode);

    this.setState({
      mappedCurrencies: currencies
    });
  };
  getBaseCurrency = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      // console.log(res.data.userDesc);
      return;
    } else {
      this.setState(
        {
          baseCurrencycode: res.data.baseCurrency
        },
        () => {
          this.getWallets();
        }
      );
    }
  };
  getWallets = async () => {
    const res = await apiHandler({
      url: endpoint.WALLET_FIND,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      return;
    } else if (res.data.errorCode) {
      alert(res.data.userDesc);
      return;
    }
    let defaultWallet = {
      currencyCode: this.state.baseCurrencycode,
      balanceAmount: 0,
      convertedAmount: 0,
      exchangeRate: 1
    };
    if (res.data.errorCode) {
      // alert(res.data.userDesc);
      this.setState({ wallets: defaultWallet, fetchedWalletData: true });
      return;
    } else {
      let wallets = [];
      wallets.push(defaultWallet);
      res.data &&
        res.data.length > 0 &&
        res.data.forEach(wallet => {
          if (wallet.currencyCode === this.state.baseCurrencycode) {
            wallets[0].balanceAmount = wallet.balanceAmount;
            wallets[0].convertedAmount = wallet.balanceAmount;
            wallets[0].exchangeRate = 1;
          } else {
            wallets.push(wallet);
          }
        });
      this.getCurrencyConversion(wallets, true);
    }
  };
  getCurrencyConversion = async (wallets, fetchedWalletData) => {
    let currencies = [];
    let totalFunds = 0;
    wallets.forEach((wallet, index) => {
      if (wallet.currencyCode !== this.state.baseCurrencycode) {
        currencies.push({
          currencyCode: wallet.currencyCode,
          amount: wallet.balanceAmount,
          tag: "tag" + (index + 1)
        });
      } else {
        totalFunds = wallet.balanceAmount;
      }
    });
    if (currencies.length === 0) {
      this.setState({
        wallets: wallets,
        fetchedWalletData: fetchedWalletData,
        noWalletMessage: wallets.length > 0 ? "" : "No Currency Wallet",
        totalFunds: formatMoney(totalFunds),
        totalFundsDataFetched: true
      });
      return;
    }
    let currencyConversionParam = {
      baseCurrency: this.state.baseCurrencycode,
      currencies: currencies
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CURRENCIES_CONVERSION,
      data: currencyConversionParam,
      authToken: sessionStorage.getItem("token")
    });
    // let wallets = this.state.wallets;
    wallets.forEach(wallet => {
      res.data.currencies.forEach(currency => {
        if (wallet.currencyCode === currency.currencyCode) {
          totalFunds = totalFunds + currency.convertedAmount;
          wallet.convertedAmount = currency.convertedAmount;
          wallet.exchangeRate = currency.exchangeRate;
        }
      });
    });
    this.setState({
      wallets: wallets,
      totalFunds: formatMoney(totalFunds),
      fetchedWalletData: fetchedWalletData,
      totalFundsDataFetched: true
    });
  };

  getDealStatus = () => {
    const dealType = ["FXSPOT", "FXFWD", "MARGIN", "PAYMENT"];
    dealType.forEach(async type => {
      const res = await apiHandler({
        url: endpoint.DEALS + "?type=" + type,
        authToken: sessionStorage.getItem("token")
      });
      if (res.data.errorCode && res.data.errorCode === 403) {
        return;
      } else if (res.data.errorCode) {
        alert(res.data.userDesc);
        return;
      } else {
        this.parseDealData(type, res.data.deals, "FXSPOT");
      }
    });
  };

  getStatusButton = (status, amount, deal) => {
    let color = "success";
    if (status === "SETTLED" || status === "SETTELED") {
      color = "success";
    } else if (status === "PENDING") {
      color = "warning";
    } else if (
      status === "TOP UP MARGIN" &&
      amount &&
      amount > 0 &&
      deal.status !== "SETTLED"
    ) {
      color = "danger";
    } else {
      color = "gray";
    }
    return (
      <Button
        color={color}
        size="sm"
        round
        onClick={e => this.onClickStatusButton(e, status, amount, deal)}
      >
        {status}
      </Button>
    );
  };
  onClickStatusButton = (event, status, amount, deal) => {
    event.stopPropagation();
    if (
      status === "TOP UP MARGIN" &&
      amount &&
      amount > 0 &&
      deal.status !== "SETTLED"
    ) {
      this.setState({
        showTopupMarginModal: true,
        topupMarginDate: formatDate(deal.marginCalculationDate),
        topupMarginAmount:
          deal.marginRequiredCurrencyCode + " " + formatMoney(amount)
      });
    } else {
    }
  };
  shortenDealId = dealId => {
    let newDealId = dealId;
    let index = dealId.lastIndexOf("-");
    if (index !== -1) {
      newDealId = dealId.substring(index + 1, dealId.length);
    }
    return newDealId;
  };
  parseDealData = (dealType, deals, displayTypeData) => {
    let dealState = [];
    let dealDownloadState = [];
    let obj = {};
    switch (dealType) {
      case "FXSPOT":
        dealDownloadState.push(this.dealStatusColumns["FXSPOT"]);
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              formatMoney(deal.currencyBought) + " " + deal.boughtCurrencyCode,
              formatMoney(deal.currencySold) + " " + deal.soldCurrencyCode,
              this.getStatusButton(deal.status)
            ];
            dealState.push(dealRow);
            // Download Data
            dealDownloadState.push([
              deal.dealId,
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              formatMoney(deal.currencyBought) + " " + deal.boughtCurrencyCode,
              formatMoney(deal.currencySold) + " " + deal.soldCurrencyCode,
              deal.status
            ]);
          });
        obj = {
          spotDealData: dealState,
          spotDealDownloadData: dealDownloadState,
          spotDealAPIData: deals,
          selectedTab: "FXSPOT"
        };
        if (displayTypeData === "FXSPOT") {
          obj = {
            ...obj,
            dealAllData: dealState,
            selectedPageIndex: 1,
            dealSelectedData: dealState.slice(0, 10),
            apiData: deals
          };
        }
        this.setState({
          ...obj
        });
        break;
      case "FXFWD":
        dealDownloadState.push(this.dealStatusColumns["FXFWD"]);
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              formatMoney(deal.currencyBought) + " " + deal.boughtCurrencyCode,
              formatMoney(deal.currencySold) + " " + deal.soldCurrencyCode,
              deal.currentValuation
                ? formatMoney(deal.currentValuation) +
                  " " +
                  deal.currencyValuationCurrencyCode
                : "",
              this.getStatusButton(deal.status)
            ];
            dealState.push(dealRow);
            // Download Data
            dealDownloadState.push([
              deal.dealId,
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              formatMoney(deal.currencyBought) + " " + deal.boughtCurrencyCode,
              formatMoney(deal.currencySold) + " " + deal.soldCurrencyCode,
              deal.currentValuation
                ? formatMoney(deal.currentValuation) +
                  " " +
                  deal.currencyValuationCurrencyCode
                : "",
              deal.status
            ]);
          });
        obj = {
          forwardDealData: dealState,
          forwardDealDownloadData: dealDownloadState,
          forwardDealAPIData: deals,
          selectedTab: "FXFWD"
        };
        if (displayTypeData === "FXFWD") {
          obj = {
            ...obj,
            dealAllData: dealState,
            selectedPageIndex: 1,
            dealSelectedData: dealState.slice(0, 10),
            apiData: deals
          };
        }
        this.setState({
          ...obj
        });
        break;
      case "MARGIN":
        dealDownloadState.push(this.dealStatusColumns["MARGINS"]);
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              deal.currentValuation
                ? formatMoney(deal.currentValuation) +
                  " " +
                  deal.currencyValuationCurrencyCode
                : "",
              formatMoney(deal.marginDeposit) +
                " " +
                deal.marginDepositCurrencyCode,
              this.getStatusButton(deal.status),
              this.getStatusButton(
                "TOP UP MARGIN",
                deal.marginToupRequired,
                deal
              )
            ];
            dealState.push(dealRow);
            // Download Data
            dealDownloadState.push([
              deal.dealId,
              formatDate(deal.dealDate),
              formatDate(deal.settlementDate),
              deal.currentValuation
                ? formatMoney(deal.currentValuation) +
                  " " +
                  deal.currencyValuationCurrencyCode
                : "",
              formatMoney(deal.marginDeposit) +
                " " +
                deal.marginDepositCurrencyCode,
              deal.status
            ]);
          });
        obj = {
          marginsDealData: dealState,
          marginsDealDownloadData: dealDownloadState,
          marginDealAPIData: deals,
          selectedTab: "MARGIN"
        };
        if (displayTypeData === "MARGIN") {
          obj = {
            ...obj,
            dealAllData: dealState,
            selectedPageIndex: 1,
            dealSelectedData: dealState.slice(0, 10),
            apiData: deals
          };
        }
        this.setState({
          ...obj
        });
        break;
      case "PAYMENT":
        dealDownloadState.push(this.dealStatusColumns["PAYMENTS"]);
        deals &&
          deals.forEach(deal => {
            let dealRow = [
              deal.dealId,
              this.shortenDealId(deal.dealId),
              formatDate(deal.dealDate),
              deal.beneficiaryName,
              formatMoney(deal.transferAmount) +
                " " +
                deal.transferAmountCurrencyCode,
              this.getStatusButton(deal.status)
            ];
            dealState.push(dealRow);
            // Download Data
            dealDownloadState.push([
              deal.dealId,
              formatDate(deal.dealDate),
              deal.beneficiaryName,
              formatMoney(deal.transferAmount) +
                " " +
                deal.transferAmountCurrencyCode,
              deal.status
            ]);
          });
        obj = {
          paymentsDealData: dealState,
          paymentsDealDownloadData: dealDownloadState,
          paymentsDealAPIData: deals,
          selectedTab: "PAYMENT",
          apiData: deals
        };
        if (displayTypeData === "PAYMENT") {
          obj = {
            ...obj,
            dealAllData: dealState,
            selectedPageIndex: 1,
            dealSelectedData: dealState.slice(0, 10)
          };
        }
        this.setState({
          ...obj
        });
        break;
      default:
        break;
    }
  };
  showSpotDeal = () => {
    this.setState({
      dealColumns: this.dealStatusColumns["FXSPOT"],
      dealAllData: this.state.spotDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.spotDealData.slice(
        0,
        this.state.recordsPerPage
      ),
      showSpot: true,
      showForward: false,
      showMargins: false,
      showPayments: false,
      columnSortKey: "",
      columnDetails: ColumnDetails["FXSPOT"],
      apiData: this.state.spotDealAPIData
    });
  };
  showForwardDeal = () => {
    this.setState({
      dealColumns: this.dealStatusColumns["FXFWD"],
      dealAllData: this.state.forwardDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.forwardDealData.slice(
        0,
        this.state.recordsPerPage
      ),
      showSpot: false,
      showForward: true,
      showMargins: false,
      showPayments: false,
      columnSortKey: "",
      columnDetails: ColumnDetails["FXFWD"],
      apiData: this.state.forwardDealAPIData
    });
  };
  showMarginsDeal = () => {
    this.setState({
      dealColumns: this.dealStatusColumns["MARGINS"],
      dealAllData: this.state.marginsDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.marginsDealData.slice(
        0,
        this.state.recordsPerPage
      ),
      showSpot: false,
      showForward: false,
      showMargins: true,
      showPayments: false,
      columnSortKey: "",
      columnDetails: ColumnDetails["MARGINS"],
      apiData: this.state.marginDealAPIData
    });
  };
  showPaymentsDeal = () => {
    this.setState({
      dealColumns: this.dealStatusColumns["PAYMENTS"],
      dealAllData: this.state.paymentsDealData,
      selectedPageIndex: 1,
      dealSelectedData: this.state.paymentsDealData.slice(
        0,
        this.state.recordsPerPage
      ),
      showSpot: false,
      showForward: false,
      showMargins: false,
      showPayments: true,
      columnSortKey: "",
      columnDetails: ColumnDetails["PAYMENTS"],
      apiData: this.state.paymentsDealAPIData
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
    // let reportData = [];

    // let selectedList = reportData.slice(0, this.state.recordsPerPage);
    this.setState({
      sortByAscending: sortByAscending,
      columnSortKey: columnKey,
      apiData: data
    });
    this.parseDealData(this.state.selectedTab, data, this.state.selectedTab);
  };
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };

  isValidated = () => {
    if (
      this.state.firstNameState === "success" &&
      this.state.lastNameState === "success" &&
      this.state.emailState === "success" &&
      this.state.phoneState === "success" &&
      this.state.companyNameState === "success" &&
      this.state.addressState === "success" &&
      this.state.cityState === "success" &&
      this.state.postalCodeState === "success" &&
      this.state.countryState === "success" &&
      this.state.passwordState === "success" &&
      this.state.passwordConfirmationState === "success"
    ) {
      return true;
    } else {
      if (this.state.firstNameState !== "success") {
        this.setState({ firstNameState: "error" });
      }
      if (this.state.lastNameState !== "success") {
        this.setState({ lastNameState: "error" });
      }
      if (this.state.emailState !== "success") {
        this.setState({ emailState: "error" });
      }
      if (this.state.phoneState !== "success") {
        this.setState({ phoneState: "error" });
      }
      if (this.state.companyNameState !== "success") {
        this.setState({ companyNameState: "error" });
      }
      if (this.state.addressState !== "success") {
        this.setState({ addressState: "error" });
      }
      if (this.state.cityState !== "success") {
        this.setState({ cityState: "error" });
      }
      if (this.state.postalCodeState !== "success") {
        this.setState({ postalCodeState: "error" });
      }
      if (this.state.countryState !== "success") {
        this.setState({ countryState: "error" });
      }
      if (this.state.passwordState !== "success") {
        this.setState({ passwordState: "error" });
      }
      if (this.state.passwordConfirmationState !== "success") {
        this.setState({ passwordConfirmationState: "error" });
      }
    }
    return false;
  };

  handleSelectedDate = value => {
    this.setState({ selectedDate: value });
  };

  handleBuyCurrency = event => {
    let wrongData = false;
    if (event.target.name === "baseCurrency") {
      if (this.state.quoteCurrency === event.target.value) wrongData = true;
    } else if (event.target.name === "quoteCurrency") {
      if (this.state.baseCurrency === event.target.value) wrongData = true;
    }
    if (wrongData) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Currency",
        noticeModalErrMsg: "Please select different Currency."
      });
    } else {
      this.setState({ [event.target.name]: event.target.value }, () => {
        this.saveCurrencyPair(
          this.state.baseCurrency,
          this.state.quoteCurrency
        );
      });
    }
  };

  handleSellCurrency = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.saveCurrencyPair(this.state.baseCurrency, this.state.quoteCurrency);
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ showEditUser: false });
  };

  handleEditDirector = () => {
    this.setState(() => {
      return { showEditUser: true };
    });
    // this.setState(state => {
    //   return {
    //     showAddDirector: true,
    //     editDirector: state.directors.filter(director => director.id === id)[0]
    //   };
    // });
  };
  dealTableRowClick = async dealId => {
    const dealType = this.state.showSpot
      ? "FXSPOT"
      : this.state.showForward
      ? "FXFWD"
      : this.state.showMargins
      ? "MARGIN"
      : this.state.showPayments
      ? "PAYMENT"
      : "SPOT";

    const res = await apiHandler({
      url: endpoint.DEAL + "?type=" + dealType + "&dealId=" + dealId,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode && res.data.errorCode === 403) {
      // No details for Deal
      return;
    } else if (res.data.errorCode) {
      alert(res.data.userDesc);
      return;
    } else {
      let dealTypeForDlg = "FxSpot";
      switch (dealType) {
        case "FXSPOT":
          dealTypeForDlg = "FxSpot";
          break;
        case "FXFWD":
          dealTypeForDlg = "FxForward";
          break;
        case "MARGIN":
          dealTypeForDlg = "FxForward";
          break;
        case "PAYMENT":
          dealTypeForDlg = "Payment";
          break;
        default:
          break;
      }
      this.setState({
        isDealExecuted: true,
        dealDetails: res.data,
        dealType: dealTypeForDlg
      });
      // console.log(res.data);
    }
  };
  closeDealModal = () => {
    this.setState({
      isDealExecuted: false,
      dealDetails: {},
      dealType: ""
    });
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  closeTopupMarginModal = () => {
    this.setState({
      showTopupMarginModal: false,
      topupMarginAmount: "",
      topupMarginDate: ""
    });
  };
  getPageData = event => {
    let pageIndex = 0;
    let pageCount = Math.ceil(
      this.state.dealAllData.length / this.state.recordsPerPage
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

    let dealSelectedData = this.state.dealAllData.slice(
      (pageIndex - 1) * this.state.recordsPerPage,
      pageIndex * this.state.recordsPerPage
    );
    this.setState({
      selectedPageIndex: pageIndex,
      dealSelectedData: dealSelectedData
    });
  };
  getPageDetails = () => {
    let DataCount = Math.ceil(
      this.state.dealAllData.length / this.state.recordsPerPage
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

  onClickMarketRates = () => {
    this.props.history.push("/auth/market-rates");
  };
  onClickRedirect = path => {
    this.props.history.push(path);
  };

  swapCurrencies = () => {
    let baseCurrency = this.state.baseCurrency;
    this.setState(
      {
        baseCurrency: this.state.quoteCurrency,
        quoteCurrency: baseCurrency
      },
      () => {
        this.saveCurrencyPair(
          this.state.baseCurrency,
          this.state.quoteCurrency
        );
      }
    );
  };
  saveCurrencyPair = async (baseCurrency, quoteCurrency) => {
    let currencyPairParam = {
      fromCurrencyCode: baseCurrency,
      toCurrencyCode: quoteCurrency
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.MARKET_INTELLIGENCE,
      data: currencyPairParam,
      authToken: sessionStorage.getItem("token")
    });
  };

  onClickCreateRateAlert = () => {
    this.setState({
      showCurrencyPairAlertModal: true
    });
  };
  handleCloseDialog = stateName => {
    this.setState({
      [stateName]: false
    });
  };
  openFundsPage = currencyCode => {
    //this.props.history.push("/auth/funds");
    this.props.history.push({
      pathname: `/auth/funds`,
      state: {
        currencyCode: currencyCode
      }
    });
  };
  downloadReport = () => {
    this.csvDownloadLink.current.link.click();
  };
  getDownloadData = () => {
    if (this.state.showSpot) {
      return this.state.spotDealDownloadData;
    } else if (this.state.showForward) {
      return this.state.forwardDealDownloadData;
    } else if (this.state.showMargins) {
      return this.state.marginsDealDownloadData;
    } else if (this.state.showPayments) {
      return this.state.paymentsDealDownloadData;
    } else {
      return [];
    }
  };
  getDownloadFile = () => {
    if (this.state.showSpot) {
      return "FxSpot" + formatDate(Date.now()) + ".csv";
    } else if (this.state.showForward) {
      return "FxForward" + formatDate(Date.now()) + ".csv";
    } else if (this.state.showMargins) {
      return "Margins" + formatDate(Date.now()) + ".csv";
    } else if (this.state.showPayments) {
      return "Payments" + formatDate(Date.now()) + ".csv";
    } else {
      return "Deals" + formatDate(Date.now()) + ".csv";
    }
  };
  getDocumentLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    ) : null;
  };
  getCustomerDetails = async customerId => {
    const res = await apiHandler({
      url:
        endpoint.ADMIN_CUSTOMER_CUSTOMERDETAILS_CUSTOMERID +
        "?customerId=" +
        customerId,
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
      customerRegistrationDetails: {},
      showCustomerRegistrationDetails: false
    });
  };
  render() {
    const { classes } = this.props;
    let status = sessionStorage.getItem("status");
    const customerId = sessionStorage.getItem("customerId");
    const customerRegistrationAppliedDate = sessionStorage.getItem(
      "customerRegistrationAppliedDate"
    );
    return (
      <GridContainer justify="center">
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <GridContainer>
            <GridItem xs={3} sm={3} lg={3}>
              <h4>
                <b>Currency Wallet</b>
              </h4>
            </GridItem>
            <GridItem xs={8} sm={8} lg={8}>
              {this.state.totalFundsDataFetched && (
                <h4 style={{ float: "right" }}>
                  <b>Total funds in base currency: </b>
                  {this.state.totalFunds} {this.state.baseCurrencycode}
                  <Tooltip
                    id="tooltip-totalFunds"
                    title="This is approximate total amount based on current exchange rates. This is subject to change with exchange rates."
                    placement="top"
                    classes={{
                      tooltip: classes.tooltipCalculator
                    }}
                  >
                    <InfoOutlined className={classes.info} />
                  </Tooltip>
                </h4>
              )}
            </GridItem>
            <GridItem xs={1} sm={1} md={1} lg={1}>
              <IconButton
                onClick={() => this.openFundsPage("")}
                style={{ color: "#53ac57" }}
              >
                <Tooltip
                  id="tooltip-totalSales"
                  title="Full Account Statement"
                  placement="top"
                  classes={{ tooltip: classes.tooltipCalculator }}
                >
                  <ListAltIcon />
                </Tooltip>
              </IconButton>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <GridContainer>
            {status === "registered" && (
              <Card style={{width: 500, position: "absolute", top: 40, textAlign: "center", left: "25vw"}}>
                <CardBody>
                  {"You have already applied for the Customer Registration on "}
                  {customerRegistrationAppliedDate}
                  {
                    ". We will contact you as soon as possible to get you live so that you can manage your FX risks. Your application details can be found here "
                  }
                  {customerId && customerId !== -1 && (
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => this.getCustomerDetails(customerId)}
                    >
                      Click
                    </a>
                  )}
                </CardBody>
              </Card>
            )}
            <GridItem xs={12} sm={8} lg={12}>
              {/* <Card>
                  <CardBody> */}
              <div style={{ textAlign: "right", marginBottom: 50 }}>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer justify="flex-start">
                    {this.state.fetchedWalletData &&
                    this.state.wallets.length > 0 ? (
                      this.state.wallets.map((wallet, index) => (
                        <GridItem
                          xs={11}
                          sm={11}
                          md={11}
                          lg={3}
                          key={index}
                          onClick={() =>
                            this.openFundsPage(wallet.currencyCode)
                          }
                        >
                          <StatusCard
                            headingColor={
                              wallet.currencyCode ===
                              this.state.baseCurrencycode
                                ? "warning"
                                : "info"
                            }
                            openFundsPage={this.openFundsPage}
                            heading={wallet.currencyCode}
                            baseCurrency={
                              wallet.currencyCode ===
                              this.state.baseCurrencycode
                                ? ""
                                : this.state.baseCurrencycode
                            }
                            sellCurrency={wallet.currencyCode}
                            eur={
                              wallet.currencyCode ===
                              this.state.baseCurrencycode
                                ? ""
                                : wallet.convertedAmount
                            }
                            cad={wallet.balanceAmount}
                            description={
                              wallet.currencyCode ===
                              this.state.baseCurrencycode
                                ? "Base Currency"
                                : ""
                            }
                            fxRate={
                              wallet.currencyCode ===
                              this.state.baseCurrencycode
                                ? ""
                                : wallet.exchangeRate
                            }
                          />
                        </GridItem>
                      ))
                    ) : (
                      <div> {this.state.noWalletMessage} </div>
                    )}
                  </GridContainer>
                </GridItem>
              </div>
              {/* </CardBody>
                </Card> */}
            </GridItem>
          </GridContainer>
        </GridItem>

        <GridItem xs={11} sm={11} md={11} lg={7}>
          <GridContainer>
            <GridItem xs={4} sm={4} md={4} lg={4}>
              <h4>
                <b>Deal Status</b>
              </h4>
            </GridItem>
            {/* <GridItem xs={4} sm={4} md={4} lg={4}>
                    <div style={{ float: "left" }}>

            <NavLink to="/auth/spot-rate-calculator" activeClassName="selected">
              <h4 className={classes.marketLink}><b>Spot Rate Calculator</b></h4>
</NavLink>
</div>
<Tooltip
                                id="tooltip-totalSales"
                                title="Click to check Spot Rate of Currency"
                                placement="top"
                                classes={{ tooltip: classes.tooltipCalculator }}
                              >
                                <InfoOutlined className={classes.info} />
                              </Tooltip>
           
            </GridItem>
       */}
            {/* <GridItem xs={4} sm={4} md={4} lg={4}>
                          <div style={{ float: "left" }}>

            <NavLink to="/auth/fwd-rate-calculator" activeClassName="selected">
              <h4 className={classes.marketLink}><b>Forward Rate Calculator</b></h4>
</NavLink>
</div>
<Tooltip
                                id="tooltip-totalSales"
                                title="Click to check Forward Rate of Currency"
                                placement="top"
                                classes={{ tooltip: classes.tooltipCalculator }}
                              >
                                <InfoOutlined className={classes.info} />
                              </Tooltip>
           
            </GridItem>
          */}
            <GridItem xs={12} sm={8} lg={12}>
              <Card>
                <CardBody>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
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
                            data={this.getDownloadData()}
                            filename={this.getDownloadFile()}
                            className="hidden"
                            ref={this.csvDownloadLink}
                            target="_blank"
                          />
                        </IconButton>
                      </GridItem>
                      <GridItem xs={6} sm={6} md={3} lg={3}>
                        {this.state.showSpot ? (
                          <Button
                            color="success"
                            round
                            className={classes.marginRight}
                            style={{
                              marginLeft: 30
                            }}
                          >
                            FX SPOT
                          </Button>
                        ) : (
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: 12,
                              marginLeft: 30,
                              cursor: "pointer"
                            }}
                            onClick={this.showSpotDeal}
                          >
                            FX SPOT
                          </span>
                        )}
                      </GridItem>
                      <GridItem xs={6} sm={6} md={3} lg={3}>
                        {this.state.showForward ? (
                          <Button
                            color="success"
                            round
                            className={classes.marginRight}
                            style={{
                              marginLeft: 30
                            }}
                          >
                            FX FORWARD
                          </Button>
                        ) : (
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: 12,
                              marginLeft: 30,
                              cursor: "pointer"
                            }}
                            onClick={this.showForwardDeal}
                          >
                            FX FORWARD
                          </span>
                        )}
                      </GridItem>
                      <GridItem xs={6} sm={6} md={3} lg={3}>
                        {this.state.showMargins ? (
                          <Button
                            color="success"
                            round
                            className={classes.marginRight}
                            style={{
                              marginLeft: 30,
                              cursor: "pointer"
                            }}
                          >
                            MARGINS
                          </Button>
                        ) : (
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: 12,
                              marginLeft: 30,
                              cursor: "pointer"
                            }}
                            onClick={this.showMarginsDeal}
                          >
                            MARGINS
                          </span>
                        )}
                      </GridItem>
                      <GridItem xs={6} sm={6} md={3} lg={3}>
                        {this.state.showPayments ? (
                          <Button
                            color="success"
                            round
                            className={classes.marginRight}
                            style={{
                              marginLeft: 30
                            }}
                          >
                            PAYMENTS
                          </Button>
                        ) : (
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: 12,
                              marginLeft: 30,
                              cursor: "pointer"
                            }}
                            onClick={this.showPaymentsDeal}
                          >
                            PAYMENTS
                          </span>
                        )}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <Table
                      hover
                      tableHeaderColor="gray"
                      tableHead={this.state.dealColumns}
                      tableData={this.state.dealSelectedData}
                      customCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      classes={
                        {
                          // tableRow: classes.tableFontSize
                        }
                      }
                      customClassesForCells={[0, 4, 5]}
                      customHeadCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customHeadClassesForCells={[0, 4, 5]}
                      onClick={this.dealTableRowClick}
                      onClickColumnHeader={this.onClickColumnHeader}
                      columnsDetails={this.state.columnDetails}
                      columnSortKey={this.state.columnSortKey}
                      sortByAscending={this.state.sortByAscending}
                    />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ textAlign: "center" }}
                  >
                    <EditUsers
                      handleClose={this.handleClose}
                      showModal={this.state.showEditUser}
                      saveDirector={this.saveDirector}
                      user={this.state.user}
                    />
                    <Pagination
                      pages={this.getPageDetails()}
                      currentPage={this.state.selectedPageIndex}
                      color="info"
                      onClick={this.getPageData}
                    />
                    {/*    <Pagination
                      pages={[
                        { text: "FIRST" },
                        { text: "PREVIOUS" },
                        { text: 1 },
                        { text: 2 },
                        { active: true, text: 3 },
                        { text: 4 },
                        { text: 5 },
                        { text: "NEXT" },
                        { text: "LAST" }
                      ]}
                      color="info"
                    />  */}
                  </GridItem>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={4}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <div style={{ float: "left" }}>
                <h4>
                  <b>Live FX Rates and Calculator</b>
                </h4>

                {/* <b>Market Intelligence</b> */}
              </div>
              {/* <Tooltip
                id="tooltip-totalSales"
                title="Click to check Market Rates of Currency"
                placement="top"
                classes={{ tooltip: classes.tooltipCalculator }}
              >
                <InfoOutlined className={classes.info} />
              </Tooltip> */}
              {/* <Button
                size="sm"
                style={{ backgroundColor: "#40A8BD"
              //  , float: "right" 
              }}
              onClick={() => this.onClickRedirect('/auth/spot-rate-calculator')}

              >
                SPOT RATE CALCULATOR
              </Button>
              <Button
                size="sm"
                style={{ backgroundColor: "#40A8BD"
              //  , float: "right" 
              }}
              onClick={() => this.onClickRedirect('/auth/fwd-rate-calculator')}

>
                FORWARD RATE CALCULATOR
              </Button> */}
            </GridItem>
            <GridItem xs={12} sm={8} md={12} lg={12}>
              <Card>
                <CardBody style={{ paddingLeft: 0, paddingRight: 10 }}>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer>
                      {/* <GridItem xs={12} sm={12} md={6} lg={6}>
                        <span style={{ marginTop: 15 }}>
                          Currency Intelligence
                        </span>
                      </GridItem> */}
                      <GridItem xs={12} sm={12} md={7} lg={7}>
                        {/* <GridContainer justify="flex-end">
                            <GridItem xs={12} sm={12} md={12} lg={4}> */}
                        <FormControl className={classes.filledSelect}>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            value={this.state.baseCurrency}
                            onChange={this.handleBuyCurrency}
                            inputProps={{
                              name: "baseCurrency",
                              id: "baseCurrency",
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
                              Choose Currency
                            </MenuItem>
                            {this.state.mappedCurrencies.map(item => (
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
                        {/* </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={4}> */}
                        <SwapHoriz
                          onClick={() => this.swapCurrencies()}
                          style={{
                            fontSize: 38,
                            backgroundColor: "#40A8BD",
                            color: "white",
                            padding: 3,
                            width: 55,
                            height: 25,
                            marginLeft: 5,
                            marginRight: 5
                          }}
                        />
                        {/* </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={4}> */}
                        <FormControl className={classes.filledSelect}>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            value={this.state.quoteCurrency}
                            onChange={this.handleBuyCurrency}
                            inputProps={{
                              name: "quoteCurrency",
                              id: "quoteCurrency",
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
                              Choose Currency
                            </MenuItem>
                            {this.state.mappedCurrencies.map(item => (
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
                        {/* </GridItem>
                          </GridContainer> */}
                      </GridItem>
                      <GridItem xs={12} sm={12} md={5} lg={5}>
                        <Button
                          color="success"
                          size="sm"
                          round
                          style={{ marginRight: 7, marginTop: 0 }}
                          onClick={() => this.onClickCreateRateAlert()}
                        >
                          CREATE RATE ALERT
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  {/* <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginTop: 20 }}
                  >
                    <Button
                      color="success"
                      size="sm"
                      round
                      style={{ marginRight: "7px" }}
                      onClick={() => this.onClickMarketRates()}
                    >
                      MARKET RATES
                    </Button>
                    <Button
                      color="success"
                      size="sm"
                      round
                      style={{ marginRight: "7px" }}
                      onClick={() => this.onClickCreateRateAlert()}
                    >
                      CREATE RATE ALERT
                    </Button>
                  </GridItem> */}
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      textAlign: "center"
                      // backgroundColor: "#1D64B0"
                    }}
                  >
                    <PortalDashboardGraph
                      quoteCurrency={this.state.quoteCurrency}
                      baseCurrency={this.state.baseCurrency}
                    />
                  </GridItem>
                  {/* <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      textAlign: "center"
                    }}
                  >
                    <span
                      style={{ fontSize: 12, fontWeight: 500, marginRight: 25 }}
                    >
                      1 DAY
                    </span>
                    <Button
                      style={{
                        textAlign: "center",
                        backgroundColor: "#1D64B0"
                      }}
                      size="sm"
                      className={classes.marginRight}
                    >
                      1 WEEK
                    </Button>
                    <span
                      style={{ fontSize: 12, fontWeight: 500, marginLeft: 25 }}
                    >
                      1 MONTH
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 500, marginLeft: 25 }}
                    >
                      1 YEAR
                    </span>
                  </GridItem>
                */}
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <div style={{ float: "left" }}>
                <h4>
                  <span>
                    <b>
                      Reference Rate Calculator{" "}
                      <Tooltip
                        id="tooltip-calculator"
                        title="Reference rates are the market mid-point of the bid and offer for each currency – supplied by Xignite. Therefore, they are not dealing rates. For dealing rates, please choose the FX Dealing from the main page."
                        placement="top"
                        classes={{
                          tooltip: classes.tooltipCalculator
                        }}
                      >
                        <InfoOutlined className={classes.info} />
                      </Tooltip>
                    </b>
                  </span>
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: "small",
                      color: "#31ae0c"
                    }}
                  >
                    Live!
                  </span>
                </h4>
              </div>
            </GridItem>
            <GridItem xs={12} sm={8} md={12} lg={12}>
              <Card>
                <CardBody>
                  <RateCalculator />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <DealExecutedDialog
            showModal={this.state.isDealExecuted}
            trade={this.state.dealDetails}
            dealType={this.state.dealType}
            closeModal={this.closeDealModal}
            isDashboard={this.state.isDashboard}
          />
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
          <TopupMarginDialog
            showModal={this.state.showTopupMarginModal}
            date={this.state.topupMarginDate}
            closeModal={this.closeTopupMarginModal}
            topupMarginAmount={this.state.topupMarginAmount}
          />
          {this.state.showCurrencyPairAlertModal && (
            <CurrencyPairAlert
              currencyPair={this.state.baseCurrency + this.state.quoteCurrency}
              showModal={this.state.showCurrencyPairAlertModal}
              handleClose={this.handleCloseDialog}
            />
          )}
          {this.state.showCustomerRegistrationDetails && (
            <CustomerRegistrationDialog
              showModal={this.state.showCustomerRegistrationDetails}
              customerRegistrationDetails={
                this.state.customerRegistrationDetails
              }
              closeModal={this.closeCustomerRegistrationDetails}
            />
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

PortalDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(PortalDashboard));
