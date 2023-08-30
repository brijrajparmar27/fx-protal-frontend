import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";
import { formatMoney, formatDate } from "../../../../utils/Utils";
import Pagination from "components/Pagination/Pagination.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import cx from "classnames";
import { successColor } from "assets/jss/material-dashboard-pro-react.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import NoticeModal from "views/Components/NoticeModal.jsx";

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

class HedgeNotLinkedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogTitle: "Link Hedge",
      apiData: {},
      columns: [
        "Type",
        "Sell Amount",
        "Sell Amount Balance",
        "Bought Amount",
        "Bought Amount Balance",
        "Deal Date",
        "Settlement Date",
        ""
      ],
      displayData: [],

      selectedPageIndex: 1,
      recordsPerPage: 10,
      selectedIndicatorList: [],

      hedgeTableColumns: ["Category", "Amount", "Date", ""],
      hedgeTableData: [],
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }

  componentDidMount() {
    this.parseData(this.props.riskRadarData);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.isChanged !== newProps.isChanged && newProps.riskRadarData) {
      this.parseData(newProps.riskRadarData);
    }
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };
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
        {linkHedge ? <h5>Link It</h5> : <h5>Link It</h5>}
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

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
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
HedgeNotLinkedList.propTypes = {
  classes: PropTypes.object.isRequired,
  riskRadarData: PropTypes.object.isRequired,
  functionalCurrency: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(HedgeNotLinkedList));
