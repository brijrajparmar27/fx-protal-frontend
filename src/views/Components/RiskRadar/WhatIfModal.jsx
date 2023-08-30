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

// @material-ui/icons

// core components
import Button from "components/CustomButtons/Button.jsx";
import { formatMoney, formatDate } from "../../../utils/Utils";

import showModalStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";
import Table from "components/Table/Table.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const style = theme => ({
  ...showModalStyle,
  addDirectorsMaxWidth: {
    width: 600
  },
  center: {
    textAlign: "center "
  },
});
class WhatIfModal extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: false,
      riskAnalysis: null,
      RiskTableData: [],
      RateTableData: [],
      currencyPerformanceTableData: [],
      RiskHedgingImpactTableData: []
    };
  }
  handleClose() {
    this.props.closeModal();
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
          showModal: props.showModal,
          riskAnalysis: props.riskAnalysis
        };
      }
      return {
        showModal: props.showModal,
        ...statusDetails
      };
    }
    return null;
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  getRiskTableData = () => {
    let risks = [];
    console.log("Risk Analysis", this.state.riskAnalysis);
    if (this.state.riskAnalysis) {
      const {
        riskType,
        riskCurrencyCode,
        riskAmount,
        riskDueDate
      } = this.state.riskAnalysis;
      risks.push([
        0,
        riskType,
        riskCurrencyCode,
        formatMoney(riskAmount),
        formatDate(riskDueDate)
      ]);
    }
    return risks;
  };
  GetRateTableData = () => {
    let rate = [];
    if (this.state.riskAnalysis) {
      const {
        spotRate,
        forwardRate,
        hedgingCostPercentage
      } = this.state.riskAnalysis;
      rate.push([0, spotRate, forwardRate, hedgingCostPercentage + "%"]);
    }
    return rate;
  };
  GetCurrencyPerformanceTableData = () => {
    let performance = [];
    if (this.state.riskAnalysis) {
      const { currencyPerformanceCollection } = this.state.riskAnalysis;
      const {
        currencyPair,
        currencyPerformances
      } = currencyPerformanceCollection;

      performance.push([
        0,
        currencyPair,
        currencyPerformances &&
          currencyPerformances[0] &&
          currencyPerformances[0].performancePercentage + "%",
        currencyPerformances &&
          currencyPerformances[1] &&
          currencyPerformances[1].performancePercentage + "%",
        currencyPerformances &&
          currencyPerformances[2] &&
          currencyPerformances[2].performancePercentage + "%",
        currencyPerformances &&
          currencyPerformances[3] &&
          currencyPerformances[3].performancePercentage + "%",
        currencyPerformances &&
          currencyPerformances[4] &&
          currencyPerformances[4].performancePercentage + "%"
      ]);
    }
    return performance;
  };
  GetRiskHedgingImpactTableData = () => {
    let hedge = [];
    if (this.state.riskAnalysis) {
      const {
        riskType,
        hedgingPercentageBefore,
        hedgingPercentageAfter,
        overallHedgingPercentageBefore,
        overallHedgingPercentageAfter,
        totalRiskImpactBefore,
        totalRiskImpactAfter
      } = this.state.riskAnalysis;
      hedge.push(
        [
          0,
          riskType + " Hedging %",
          hedgingPercentageAfter + "%",
          hedgingPercentageBefore + "%"
        ],
        [
          1,
          "Overall Hedging %",
          overallHedgingPercentageAfter + "%",
          overallHedgingPercentageBefore + "%"
        ],
        [
          2,
          "Risk Impact",
          formatMoney(totalRiskImpactAfter),
          formatMoney(totalRiskImpactBefore)
        ]
      );
    }
    return hedge;
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal
          }}
          open={this.state.showModal}
          maxWidth="md"
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle
            id="notice-modal-slide-title"
            disableTypography
            className={cx(classes.center, classes.modalHeader)}
          >
            <h4 className={classes.modalTitle}>
              {"Quick Analysis of Costs and Impact if this Risk is Hedged"}
            </h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={cx(classes.modalBody, classes.alignLeft)}
          >
            <h4>
              <b>Risk</b>
            </h4>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={["Type", "Currency", "Amount", "Maturity Date"]}
              tableData={this.getRiskTableData()}
              customCellClasses={[classes.center, classes.right, classes.right]}
              customClassesForCells={[0, 4, 5]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right
              ]}
              customHeadClassesForCells={[0, 4, 5]}
            />
            {/* <h4>
              <b>Indicative Price Rate</b>
            </h4>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={[
                "Spot Price",
                "Indicative Forward Price",
                "Indicative Hedging Costs/Benefits (%)"
              ]}
              tableData={this.GetRateTableData()}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[]}
              customClassesForCells={[]}
              isMarketData={false}
            /> */}
            <h4>
              <b>Currency Performance</b>
            </h4>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={[
                "",
                "Today",
                "Last 1 week",
                "Last 3 month",
                "Last 6 month",
                "Last 12 month"
              ]}
              tableData={this.GetCurrencyPerformanceTableData()}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[]}
              customClassesForCells={[]}
              isMarketData={false}
            />
            <h4>
              <b>Hedging Impact Analysis</b>
            </h4>
            <Table
              striped
              tableHeaderColor="info"
              tableHead={["", "After Hedging", "Before Hedging"]}
              tableData={this.GetRiskHedgingImpactTableData()}
              customHeadCellClasses={[]}
              customHeadClassesForCells={[]}
              customCellClasses={[]}
              customClassesForCells={[]}
              isMarketData={false}
            />
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button onClick={() => this.handleClose()} color="info" round>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

WhatIfModal.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  riskAnalysis: PropTypes.object
};

export default withStyles(style)(WhatIfModal);
