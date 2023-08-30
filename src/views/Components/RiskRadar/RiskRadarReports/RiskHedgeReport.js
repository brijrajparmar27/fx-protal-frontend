import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import { FormControl, IconButton } from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";
import {
  formatMoney,
  formatDate,
  parseCurrency
} from "../../../../utils/Utils";
import Pagination from "components/Pagination/Pagination.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import cx from "classnames";
import { successColor } from "assets/jss/material-dashboard-pro-react.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
// import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";

const DISPLAY_TITLE = {
  payables: "Payables",
  receivables: "Receivables",
  forecastedCosts: "Forecasted Costs",
  forecastedRevenues: "Forecasted Revenues",
  assets: "Asset or Investments",
  liabilities: "Liabilities",
  externalHedges: "External Hedges",
  internalHedges: "Internal Hedges"
};
const RISK_CATEGORY_INFO = {
  assets: {
    key: "assets",
    type: "ASSETS",
    displayName: "Asset or Investments"
  },

  liabilities: {
    key: "liabilities",
    type: "LIABILITIES",
    displayName: "Liabilities"
  },

  payables: { key: "payables", type: "PAYABLES", displayName: "Payables" },

  receivables: {
    key: "receivables",
    type: "RECEIVABLES",
    displayName: "Receivables"
  },

  forecastedrevenues: {
    key: "forecastedRevenues",
    type: "FORECASTED_REVENUES",
    displayName: "Forecasted Revenues"
  },

  forecastedcosts: {
    key: "forecastedCosts",
    type: "FORECASTED_COSTS",
    displayName: "Forecasted Costs"
  }

  // externalHedges: {key:'externalHedges', type:'ASSETS'}
};
const CATEGORY_OPTIONS = [
  {
    category: "risks",
    key: "payables",
    type: "PAYABLES",
    displayName: "Payables"
  },

  {
    category: "risks",
    key: "receivables",
    type: "RECEIVABLES",
    displayName: "Receivables"
  },
  {
    category: "risks",
    key: "forecastedCosts",
    type: "FORECASTED_COSTS",
    displayName: "Forecasted Costs"
  },
  {
    category: "risks",
    key: "forecastedRevenues",
    type: "FORECASTED_REVENUES",
    displayName: "Forecasted Revenues"
  },
  {
    category: "risks",
    key: "assets",
    type: "ASSETS",
    displayName: "Asset or Investments"
  },

  {
    category: "risks",
    key: "liabilities",
    type: "LIABILITIES",
    displayName: "Liabilities"
  },
  {
    category: "risks",
    key: "allRisks",
    type: "",
    displayName: "All Risks"
  },
  {
    category: "hedges",
    key: "externalHedges",
    type: "",
    displayName: "External Hedges"
  },

  {
    category: "hedges",
    key: "internalHedges",
    type: "",
    displayName: "Internal Hedges"
  },
  {
    category: "hedges",
    key: "allHedges",
    type: "",
    displayName: "All Hedges"
  }

  // externalHedges: {key:'externalHedges', type:'ASSETS'}
];
//unlinked partiallyLinked fullyLinked
const HEDGE_OPTIONS = [
  {
    category: "hedge",
    key: "unlinked",
    displayName: "Unlinked"
  },
  {
    category: "hedge",
    key: "partiallyLinked",
    displayName: "Partially Linked"
  },
  {
    category: "hedge",
    key: "fullyLinked",
    displayName: "Fully Linked"
  }
];

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const style = theme => ({
  container: {
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
  },
  closeButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    //color: theme.palette.grey[500],
    color: "#53ac57",
    float: "right"
  },
  center: {
    textAlign: "center "
  }
});

class RiskHedgeReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogTitle: "Link Hedge",
      apiData: {},
      columns: [
        "Reference ID",
        "Amount",
        "Date",
        "Hedge ID",
        "Bought Amount",
        "Sold Amount",
        "Exchange Rate"
        // "Type",
        // "Sell Amount",
        // "Sell Amount Balance",
        // "Bought Amount",
        // "Bought Amount Balance",
        // "Deal Date",
        // "Settlement Date",
        // ""
      ],
      displayData: [],

      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: [],

      hedgeTableColumns: ["Category", "Amount", "Date", ""],
      hedgeTableData: [],
      selectedCategory: "",
      selectedHedge: "allHedges",
      maturityDate: null,
      selectedCurrency: "allCurrencies",
      amount: "",
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
  componentDidMount() {
    console.log("componentDidMount", this.props);
    if (this.props.parsedRiskRadarData) {
      this.parseDisplayData(this.props.parsedRiskRadarData);
    }
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      this.props.isChanged !== newProps.isChanged &&
      newProps.parsedRiskRadarData
    ) {
      this.parseDisplayData(newProps.parsedRiskRadarData);
    }
  }

  getPageData = event => {
    let pageIndex = 0;
    let pageCount = Math.ceil(
      this.state.hedgeTableData.length / this.state.recordsPerPage
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

    let selectedList = this.state.hedgeTableData.slice(
      (pageIndex - 1) * this.state.recordsPerPage,
      pageIndex * this.state.recordsPerPage
    );
    this.setState({
      selectedPageIndex: pageIndex,
      selectedIndicatorList: selectedList
    });
  };

  getNoHedgePercentage = () => {
    const { riskRadarData, functionalCurrency } = this.props;
    const { hedges, totalHedges } = riskRadarData;
    let noHedgeAmount = 0;

    hedges &&
      hedges.forEach(hedge => {
        if (hedge.soldCurrencyCode === functionalCurrency) {
          noHedgeAmount =
            noHedgeAmount +
            hedge.currencyBoughtBalance * hedge.buyExchangeRateInFunCurrency;
        } else if (hedge.boughtCurrencyCode === functionalCurrency) {
          noHedgeAmount =
            noHedgeAmount +
            hedge.currencySoldBalance * hedge.sellExchangeRateInFunCurrency;
        } else {
          noHedgeAmount =
            noHedgeAmount +
            hedge.currencyBoughtBalance * hedge.buyExchangeRateInFunCurrency;
        }
      });

    return (noHedgeAmount * 100) / totalHedges;
  };
  onClickHedgeButton = (hedge, linkHedge) => {
    if (linkHedge) {
      // modal button
      this.linkDealWithRiskRadar(hedge);
    } else {
      //
      this.renderDialogRisks(hedge);
    }
  };
  handleClose = () => {
    this.setState({
      showModal: false
    });
  };
  getPageDetails = () => {
    let DataCount = Math.ceil(
      this.state.hedgeTableData.length / this.state.recordsPerPage
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
  renderDialogRisks = hedge => {
    const { riskRadarData, functionalCurrency } = this.props;
    const risks =
      riskRadarData && riskRadarData.risks ? riskRadarData.risks : [];
    let displayData = [];
    let data = risks.filter(x =>
      x.riskType === "PAYABLES" ||
      x.riskType === "FORECASTED_COSTS" ||
      x.riskType === "LIABILITIES"
        ? hedge.boughtCurrencyCode === x.currencyCode &&
          x.convertedValueAfterHedge > 0
        : hedge.soldCurrencyCode === x.currencyCode &&
          x.convertedValueAfterHedge > 0
    );
    data.forEach((x, index) => {
      let type = x.riskType.toLowerCase().replace("_", "");
      let category = RISK_CATEGORY_INFO[type];
      displayData.push([
        index,
        category.displayName,
        formatMoney(x.amount) + " " + x.currencyCode,
        formatDate(x.dueDate),
        this.getHedgeButton(
          {
            hedgeId: hedge.id,
            riskId: x.id
          },
          true
        )
      ]);
    });
    let selectedIndicatorList = displayData.slice(0, this.state.recordsPerPage);

    this.setState({
      selectedHedge: hedge,
      showModal: true,
      hedgeTableData: displayData,
      selectedIndicatorList: selectedIndicatorList
    });
  };
  delinkHedgeButton = rowData => {
    const { classes } = this.props;
    return (
      <Button
        size="sm"
        style={{
          backgroundColor: successColor[1]
        }}
        onClick={() => this.onClickDeLinkHedge(rowData)}
      >
        <h5>DeLink Hedge</h5>
      </Button>
    );
  };
  onClickDeLinkHedge = deal => {
    this.setState({
      confirmationModal: true,
      confirmationModalHeader: "De-Link Hedge",
      confirmationModalMsg: "Are you sure, you want to De-Link this Hedge?",
      deLinkDeal: deal
    });
  };
  handleNegativeResponse = () => {
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      deLinkDeal: {}
    });
  };
  handlePositiveResponse = () => {
    this.setState(
      {
        confirmationModal: false,
        confirmationModalHeader: "",
        confirmationModalMsg: ""
      },
      () => {
        this.deLinkDealWithRiskRadar(this.state.deLinkDeal);
      }
    );
  };

  linkDealWithRiskRadar = async dealDetails => {
    this.setState({ callInProgress: true });
    const param = {
      hedgeId: dealDetails.hedgeId,
      riskId: dealDetails.riskId
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_RADAR_LINK_HEDGE,
      data: param,
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
      this.setState({
        showModal: false
      });
      this.props.getRiskRadarData(this.props.functionalCurrency, 4, true);
    }
  };

  getHedgeButton = (hedge, linkHedge) => {
    return (
      <Button
        size="sm"
        style={{
          backgroundColor: successColor[1]
        }}
        onClick={() => this.onClickHedgeButton(hedge, linkHedge)}
      >
        <h5>Link It</h5>
      </Button>
    );
  };

  parseData = apiData => {
    const { hedges } = apiData;

    let displayData = [];

    let data =
      hedges &
      hedges.forEach(hedge => {
        if (
          hedge.currencyBoughtBalance !== 0 &&
          hedge.currencySoldBalance !== 0
        ) {
          displayData.push([
            hedge.id,
            hedge.hedgeType,
            hedge.soldCurrencyCode + " " + formatMoney(hedge.currencySold),
            hedge.soldCurrencyCode +
              " " +
              formatMoney(hedge.currencySoldBalance),
            hedge.boughtCurrencyCode + " " + formatMoney(hedge.currencyBought),
            hedge.boughtCurrencyCode +
              " " +
              formatMoney(hedge.currencyBoughtBalance),
            formatDate(hedge.dealDate),
            formatDate(hedge.settlementDate),
            this.getHedgeButton(hedge, false)
          ]);
        }
      });
    console.log("DISPLAY - ", displayData);
    this.setState({
      displayData
    });
  };

  handleChange = (name, value) => {
    this.setState(
      {
        [name]: value
      },
      () => {
        this.parseDisplayData(this.props.parsedRiskRadarData);
      }
    );
  };

  parseDisplayData = parsedRiskRadarData => {
    if (
      this.state.selectedCategory === "allRisks" ||
      this.state.selectedCategory === ""
    ) {
      this.parseCategoryData(parsedRiskRadarData, [
        "payables",
        "receivables",
        "forecastedCosts",
        "forecastedRevenues",
        "assets",
        "liabilities"
      ]);
    } else if (this.state.selectedCategory === "allHedges") {
      this.parseHedgeData(
        parsedRiskRadarData,
        ["externalHedges", "internalHedges"],
        []
      );
    } else if (this.state.selectedCategory === "externalHedges") {
      this.parseHedgeData(parsedRiskRadarData, ["externalHedges"], []);
    } else if (this.state.selectedCategory === "internalHedges") {
      this.parseHedgeData(parsedRiskRadarData, ["internalHedges"], []);
    } else {
      this.parseCategoryData(parsedRiskRadarData, [
        this.state.selectedCategory
      ]);
    }
  };
  filterCategoryData = (parsedRiskRadarData, category) => {
    let arr =
      parsedRiskRadarData && parsedRiskRadarData.risks
        ? parsedRiskRadarData.risks[category]
        : [];
    console.log("parseCategoryDataarr", arr);
    console.log("parseCategoryDataarr", this.state.maturityDate);
    console.log("parseCategoryDataarr", formatDate(this.state.maturityDate));

    if (this.state.selectedCurrency !== "allCurrencies") {
      arr = arr.filter(x => x.currencyCode === this.state.selectedCurrency);
      console.log("parseCategoryDataarr439", arr);
    }

    if (this.state.amount !== "") {
      arr = arr.filter(x => x.amount == this.state.amount);
      console.log("parseCategoryDataarr444", arr);
    }
    if (this.state.maturityDate !== "" && this.state.maturityDate !== null) {
      arr = arr.filter(
        x => formatDate(x.dueDate) == formatDate(this.state.maturityDate)
      );
      console.log("parseCategoryDataarr448", arr);
    }
    //unlinked partiallyLinked fullyLinked

    if (this.state.selectedHedge === "unlinked") {
      arr = arr.filter(x => x.riskHedgeModels.length === 0);
    } else if (this.state.selectedHedge === "partiallyLinked") {
      arr = arr.filter(
        x => x.riskHedgeModels.length > 0 && x.convertedValueAfterHedge !== 0
      );
    } else if (this.state.selectedHedge === "fullyLinked") {
      arr = arr.filter(x => x.convertedValueAfterHedge === 0);
    }
    return arr;
  };

  filterHedgeData = (parsedRiskRadarData, category) => {
    let arr =
      parsedRiskRadarData && parsedRiskRadarData.risks
        ? parsedRiskRadarData.risks[category]
        : [];

    return arr;
  };

  parseCategoryData = (parsedRiskRadarData, arr) => {
    let displayData = [];

    arr.forEach(x => {
      console.log("parseCategoryData", x);
      let categoryData = this.filterCategoryData(parsedRiskRadarData, x);
      console.log("parseCategoryData", categoryData);
      if (categoryData.length > 0) {
        displayData.push([
          displayData.length,
          DISPLAY_TITLE[x],
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]);
      }

      categoryData.forEach(y => {
        if (y.riskHedgeModels && y.riskHedgeModels.length > 0) {
          y.riskHedgeModels.forEach(z => {
            displayData.push([
              displayData.length,
              y.refId,
              y.currencyCode + " " + formatMoney(y.amount),
              formatDate(y.dueDate),
              z.dealId,
              z.boughtCurrencyCode + " " + formatMoney(z.currencyBought),
              z.soldCurrencyCode + " " + formatMoney(z.currencySold),
              z.exchangeRate,
              this.delinkHedgeButton({
                hedgeId: z.hedgeId,
                riskId: y.id
              }),
              ""
            ]);
          });
        } else {
          displayData.push([
            displayData.length,
            y.refId,
            y.currencyCode + " " + formatMoney(y.amount),
            formatDate(y.dueDate),
            " ",
            " ",
            "  ",
            " ",
            " ",
            " "
          ]);
        }
      });
    });
    console.log("DISPLAY - ", displayData);
    if (
      this.state.selectedCategory === "externalHedges" ||
      this.state.selectedCategory === "internalHedges" ||
      this.state.selectedCategory === "allHedges" ||
      this.state.selectedCategory === ""
    ) {
      this.getHedgeData(parsedRiskRadarData, displayData);
    } else {
      this.setState({
        displayData
      });
    }
  };
  getHedgeData = (parsedRiskRadarData, displayData) => {
    // if(this.state.selectedCategory==='allHedges'){
    //   this.parseHedgeData(parsedRiskRadarData, ['externalHedges', 'internalHedges'], displayData)

    // }
    if (this.state.selectedCategory === "externalHedges") {
      this.parseHedgeData(parsedRiskRadarData, ["externalHedges"], displayData);
    } else if (this.state.selectedCategory === "internalHedges") {
      this.parseHedgeData(parsedRiskRadarData, ["internalHedges"], displayData);
    } else {
      this.parseHedgeData(
        parsedRiskRadarData,
        ["externalHedges", "internalHedges"],
        displayData
      );
    }
  };
  deLinkDealWithRiskRadar = async deal => {
    console.log("deLinkDealWithRiskRadar", deal);
    this.setState({ callInProgress: true });
    const param = {
      riskId: deal.riskId,
      hedgeId: deal.hedgeId
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.RISK_RADAR_DELINK_HEDGE,
      data: param,
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
      this.props.getRiskRadarData(this.props.functionalCurrency, 4, true);
    }
  };
  parseHedgeData = (parsedRiskRadarData, arr, displayData) => {
    arr.forEach(x => {
      let hedgeData = this.filterHedgeData(parsedRiskRadarData, x);
      console.log("parseHedgeData", hedgeData);
      if (
        this.state.selectedCurrency !== "" &&
        this.state.selectedCurrency !== "allCurrencies"
      ) {
        hedgeData = hedgeData.filter(
          h =>
            h.boughtCurrencyCode === this.state.selectedCurrency ||
            h.soldCurrencyCode === this.state.selectedCurrency
        );
        console.log("parseHedgeData - filter", hedgeData);
      }

      if (hedgeData.length > 0) {
        displayData.push([
          displayData.length,
          DISPLAY_TITLE[x],
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]);
      }
      hedgeData.forEach(z => {
        displayData.push([
          displayData.length,
          "",
          "",
          formatDate(z.settlementDate),
          z.dealId,
          z.boughtCurrencyCode + " " + formatMoney(z.currencyBought),
          z.soldCurrencyCode + " " + formatMoney(z.currencySold),
          z.exchangeRate,
          !z.isLinkedHedge
            ? this.getHedgeButton(
                {
                  hedgeId: z.hedgeId,
                  riskId: z.riskId,
                  ...z
                },
                false
              )
            : this.delinkHedgeButton({
                hedgeId: z.id,
                riskId: z.riskId
              }),
          ""
        ]);
      });
    });
    this.setState({
      displayData
    });
  };

  render() {
    const { classes } = this.props;
    const currencies =
      this.props.currencies && this.props.currencies.length > 0
        ? this.props.currencies
        : [];
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11} style={{ display: "flex" }}>
            <GridContainer style={{ alignItems: "center" }}>
              <GridItem xs={2} sm={2} md={2} lg={2}>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="type"
                    className={classes.selectLabelRisk}
                  >
                    Choose Category
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.selectedCategory}
                    onChange={e =>
                      this.handleChange("selectedCategory", e.target.value)
                    }
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
                    {CATEGORY_OPTIONS.map((item, index) => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.key}
                        key={index}
                      >
                        {item.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText style={{ color: "red" }} hidden />
                </FormControl>
              </GridItem>
              <GridItem xs={2} sm={2} md={2} lg={2}>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="type"
                    className={classes.selectLabelRisk}
                  >
                    Choose Currency
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.selectedCurrency}
                    onChange={e =>
                      this.handleChange("selectedCurrency", e.target.value)
                    }
                    inputProps={{
                      name: "selectedCurrency",
                      id: "selectedCurrency",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      key={"allCurrencies"}
                      value="allCurrencies"
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      All Currencies
                    </MenuItem>
                    {currencies.map((item, index) => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.currencyCode}
                        key={index}
                      >
                        {item.currencyCode}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText style={{ color: "red" }} hidden />
                </FormControl>
              </GridItem>
              <GridItem xs={3} sm={3} md={3} lg={3}>
                <FormControl fullWidth style={{ paddingTop: "15px" }}>
                  <CustomNumberFormat
                    // success={this.state.amountState === "success"}
                    // error={this.state.amountState === "error"}
                    // helpText={
                    //   this.state.amountState === "error" &&
                    //   this.state.amountErrorMsg[0]
                    // }
                    value={this.state.amount}
                    labelText="Amount"
                    onChange={e => this.handleChange("amount", e.target.value)}
                    name="amount"
                    id={"amount"}
                    formControlProps={{
                      style: { marginTop: -5 },
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        // this.setState({
                        //   amountPristine: false
                        // });
                        // this.change(event, "amount", [
                        //   { type: "required" }
                        // ]);
                      },
                      onChange: event => {
                        // if (!this.state.amountPristine) {
                        //   this.setState({
                        //     amountPristine: false
                        //   });
                        //   this.change(event, "amount", [
                        //     { type: "required" }
                        //   ]);
                        // }
                      }
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={3} sm={3} md={3} lg={3}>
                <FormControl fullWidth>
                  <CustomDateSelector
                    clearable
                    id="rr_date"
                    inputProps={{
                      clearable: true,
                      format: "dd MMM yyyy",
                      label: "Date",
                      value: this.state.maturityDate,
                      onChange: date => this.handleChange("maturityDate", date),
                      keyboardbuttonprops: {
                        "aria-label": "change date"
                      }
                    }}
                    formControlProps={{
                      fullWidth: true
                      // className: cx(
                      //   classes.customDateControlClasses,
                      //   classes.customFormControlClasses
                      // )
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={2} sm={2} md={2} lg={2}>
                <FormControl fullWidth style={{ paddingTop: 3 }}>
                  <InputLabel
                    htmlFor="type"
                    className={classes.selectLabelRisk}
                  >
                    Choose Hedges
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.selectedHedge}
                    onChange={e =>
                      this.handleChange("selectedHedge", e.target.value)
                    }
                    inputProps={{
                      name: "selectedHedge",
                      id: "selectedHedge",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      key={"allHedges"}
                      value={"allHedges"}
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      All Hedges
                    </MenuItem>
                    {HEDGE_OPTIONS.map((item, index) => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.key}
                        key={index}
                      >
                        {item.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText style={{ color: "red" }} hidden />
                </FormControl>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={this.state.columns}
              tableData={this.state.displayData}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[]}
              customClassesForCells={[]}
              isMarketData={false}
            />
          </GridItem>
        </GridContainer>

        <>
          <Dialog
            classes={{
              root: classes.modalRoot
            }}
            // maxWidth='sm'
            open={this.state.showModal}
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
                onClick={() => this.handleClose()}
              >
                <CloseIcon />
              </IconButton>
              <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>
                {this.state.dialogTitle}
              </h3>
            </DialogTitle>
            <DialogContent
              id="classic-modal-slide-description"
              className={cx(classes.addDirectorsMaxWidth)}
            >
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <Table
                    striped
                    tableHeaderColor="info"
                    tableHead={this.state.hedgeTableColumns}
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
            </DialogContent>
          </Dialog>
        </>
        {this.state.confirmationModal && (
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeResponse}
            handlePositiveButton={this.handlePositiveResponse}
            positiveButtonText="Yes"
            negativeButtonText="No"
          />
        )}
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
      </div>
    );
  }
}
RiskHedgeReport.propTypes = {
  classes: PropTypes.object.isRequired,
  riskRadarData: PropTypes.object.isRequired,
  functionalCurrency: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(RiskHedgeReport));
