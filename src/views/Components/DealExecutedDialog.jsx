import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";

// @material-ui/icons
import Check from "@material-ui/icons/Check";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import WalletStatus from "components/WalletStatus/WalletStatus.jsx";
import { formatMoney, formatDate, shortenDealId } from "../../utils/Utils";

import dealExecutedDialogStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class DealExecutedDialog extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: true,
      documentLink: "google.com"
    };
  }
  handleClickOpen() {
    this.setState({ showModal: true });
  }
  handleClose() {
    this.props.closeModal();
    //this.setState({ showModal: false });
  }
  handleLoginSubmit() {
    this.setState({
      showModal: false,
      otpModal: true
    });
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
  // componentDidUpdate(e) {
  //   if (this.state.showModal === this.props.showModal) {
  //     e.history.go(-1);
  //   }
  // }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      return {
        showModal: props.showModal
      };
    }
    return null;
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  getDocumentLink = link => {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
    );
  };

  render() {
    const { classes, trade, isDashboard, isAdminDeal } = this.props;
    const { showModal } = this.state;
    return trade ? (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center
          }}
          maxWidth="md"
          open={showModal}
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
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.handleClose()}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>
              <Check className={classes.checkIcon} />
              {(this.props.dealType === "FxSpot" ||
                this.props.dealType === "FxForward") && (
                <span className={classes.titleContent}>Deal Executed</span>
              )}

              {this.props.dealType === "Payment" && (
                <span className={classes.titleContent}>Payment Instructed</span>
              )}
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.modalBody, classes.loginMaxWidth)}
          >
            <GridContainer>
              <GridItem xs={12} sm={10} md={12} lg={12}>
                <GridContainer justify="flex-start" className={classes.content}>
                  <GridItem
                    xs={12}
                    sm={isAdminDeal ? 12 : 10}
                    md={isAdminDeal ? 12 : 8}
                    lg={isAdminDeal ? 12 : 7}
                    className={classes.alignRight}
                  >
                    {this.props.dealType === "FxSpot" && (
                      <div className={classes.detailsHeader}>
                        Details of FX Spot Deal
                      </div>
                    )}
                    {this.props.dealType === "FxForward" && (
                      <div className={classes.detailsHeader}>
                        Details of FX Forward Deal
                      </div>
                    )}
                    {this.props.dealType === "Payment" && (
                      <div className={classes.detailsHeader}>
                        Details of your Payment
                      </div>
                    )}
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Deal Date</span>
                      <span>{formatDate(trade.dealDate)}</span>
                    </div>
                    {trade.dealId && (
                      <div className={classes.detailsRow}>
                        <span className={classes.floatLeft}>Deal ID</span>
                        <span>{shortenDealId(trade.dealId)}</span>
                      </div>
                    )}
                    {trade.status && (
                      <div className={classes.detailsRow}>
                        <span className={classes.floatLeft}>Deal Status</span>
                        <span>{shortenDealId(trade.status)}</span>
                      </div>
                    )}
                    {this.props.dealType === "FxSpot" && (
                      <React.Fragment>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Currency Sold
                          </span>
                          <span>
                            {formatMoney(trade.amountSold)}{" "}
                            {trade.soldCurrencyCode}
                          </span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Currency Bought
                          </span>
                          <span>
                            {formatMoney(trade.amountBought)}{" "}
                            {trade.boughtCurrencyCode}
                          </span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Applicable Exchange Rate
                          </span>
                          <span>
                            {trade.exchageRate && trade.exchageRate.toFixed(5)}
                          </span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Settlement Date
                          </span>
                          <span>{formatDate(trade.settlementDate)}</span>
                        </div>
                        {isAdminDeal && trade.liquidityProvider && (
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>
                              Counterparty Bank
                            </span>
                            <span>{trade.liquidityProvider}</span>
                          </div>
                        )}
                        {!isAdminDeal && (
                          <>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                FXGuard Fee
                              </span>
                              <span>
                                {formatMoney(trade.fee)} {trade.feeCurrencyCode}
                              </span>
                            </div>
                            <hr />
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Amount remaining to be paid
                              </span>
                              <span>
                                {formatMoney(
                                  trade &&
                                    trade.walletStatus &&
                                    trade.walletStatus.pendingToPaid
                                )}{" "}
                                {trade.soldCurrencyCode}
                              </span>
                              <div className={classes.detailsRowFooter}>
                                by {formatDate(trade.settlementDate)}
                              </div>
                            </div>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Amount you will receive
                              </span>
                              <span>
                                {formatMoney(trade.amountBought)}{" "}
                                {trade.boughtCurrencyCode}
                              </span>
                              <div className={classes.detailsRowFooter}>
                                by {formatDate(trade.settlementDate)}
                              </div>
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    )}
                    {this.props.dealType === "FxForward" && (
                      <React.Fragment>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Currency Sold
                          </span>
                          <span>
                            {formatMoney(trade.amountSold)}{" "}
                            {trade.soldCurrencyCode}
                          </span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Currency Bought
                          </span>
                          <span>
                            {formatMoney(trade.amountBought)}{" "}
                            {trade.boughtCurrencyCode}
                          </span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Applicable Exchange Rate
                          </span>
                          <span>
                            {trade.exchageRate && trade.exchageRate.toFixed(5)}
                          </span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Settlement Date
                          </span>
                          <span>{formatDate(trade.settlementDate)}</span>
                        </div>
                        {isAdminDeal && trade.liquidityProvider && (
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>
                              Counterparty Bank
                            </span>
                            <span>{trade.liquidityProvider}</span>
                          </div>
                        )}
                        {!isAdminDeal && (
                          <>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                FXGuard Fee
                              </span>
                              <span>
                                {formatMoney(trade.fee)} {trade.feeCurrencyCode}
                              </span>
                            </div>
                            <hr />
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Amount remaining to be paid
                              </span>
                              <span>
                                {formatMoney(
                                  trade &&
                                    trade.walletStatus &&
                                    trade.walletStatus.pendingToPaid
                                )}{" "}
                                {trade.soldCurrencyCode}
                              </span>
                              <div className={classes.detailsRowFooter}>
                                by {formatDate(trade.settlementDate)}
                              </div>
                            </div>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Amount you will receive
                              </span>
                              <span>
                                {formatMoney(trade.amountBought)}{" "}
                                {trade.boughtCurrencyCode}
                              </span>
                              <div className={classes.detailsRowFooter}>
                                by {formatDate(trade.settlementDate)}
                              </div>
                            </div>
                            <div className={classes.detailsRow}>
                              <span className={classes.floatLeft}>
                                Margin deposited
                              </span>
                              <span>
                                {formatMoney(trade && trade.marginAmount)}{" "}
                                {trade.marginCurrencyCode}
                              </span>
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    )}
                    {this.props.dealType === "Payment" && (
                      <React.Fragment>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>Beneficiary</span>
                          <span>{trade.beneficiary}</span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>Bank Name</span>
                          <span>{trade.bankName}</span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Account Number
                          </span>
                          <span>{trade.accountNumber}</span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>Amount</span>
                          <span>
                            {formatMoney(trade.transferAmount)}{" "}
                            {trade &&
                              trade.walletStatus &&
                              trade.walletStatus.currencyCode}
                          </span>
                        </div>
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>FXGuard Fee</span>
                          <span>
                            {formatMoney(trade.fee)}{" "}
                            {trade &&
                              trade.walletStatus &&
                              trade.walletStatus.currencyCode}
                          </span>
                        </div>
                        <hr />
                        <div className={classes.detailsRow}>
                          <span className={classes.floatLeft}>
                            Total Amount
                          </span>
                          <span>
                            {formatMoney(trade.totalAmountToPay)}{" "}
                            {trade &&
                              trade.walletStatus &&
                              trade.walletStatus.currencyCode}
                          </span>
                        </div>
                        {trade.settlementDate && (
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>
                              Payment Date
                            </span>
                            <span>{formatDate(trade.settlementDate)}</span>
                          </div>
                        )}
                        {isAdminDeal && trade.liquidityProvider && (
                          <div className={classes.detailsRow}>
                            <span className={classes.floatLeft}>
                              Counterparty Bank
                            </span>
                            <span>{trade.liquidityProvider}</span>
                          </div>
                        )}
                        {!isAdminDeal && (
                          <>
                            {trade.supportingDocument &&
                              trade.supportingDocument !== "" && (
                                <div className={classes.detailsRow}>
                                  <span className={classes.floatLeft}>
                                    Document
                                  </span>
                                  <span>
                                    {this.getDocumentLink(
                                      trade.supportingDocument
                                    )}
                                  </span>
                                </div>
                              )}
                          </>
                        )}
                      </React.Fragment>
                    )}
                  </GridItem>
                  {!isAdminDeal && (
                    <GridItem
                      xs={12}
                      sm={10}
                      md={4}
                      lg={5}
                      className={classes.walletContainer}
                    >
                      <h4 className={classes.alignLeft}>Wallet Status</h4>
                      {(this.props.dealType === "FxSpot" ||
                        this.props.dealType === "FxForward") && (
                        <React.Fragment>
                          <WalletStatus
                            title={"Before the Deal"}
                            cad={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.availableAmount
                            }
                            sellCurrency={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.currencyCode
                            }
                          />
                          <WalletStatus
                            title={"After the deal"}
                            cad={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.remainingAfterDeal
                            }
                            sellCurrency={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.currencyCode
                            }
                          />
                        </React.Fragment>
                      )}
                      {this.props.dealType === "Payment" && (
                        <React.Fragment>
                          <WalletStatus
                            title={"Before this payment"}
                            dealRate="123,234"
                            cad={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.availableAmount
                            }
                            sellCurrency={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.currencyCode
                            }
                            toBePaidBy=""
                            fxRate=""
                          />
                          <WalletStatus
                            title={"After this payment"}
                            dealRate="123,234"
                            cad={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.remainingAfterDeal
                            }
                            sellCurrency={
                              trade &&
                              trade.walletStatus &&
                              trade.walletStatus.currencyCode
                            }
                            toBePaidBy=""
                            fxRate=""
                          />
                        </React.Fragment>
                      )}
                    </GridItem>
                  )}
                </GridContainer>
              </GridItem>
              {!isDashboard && (
                <GridItem
                  xs={12}
                  sm={10}
                  md={10}
                  lg={12}
                  className={classes.buttonContainer}
                >
                  <div className={classes.alignRight}>
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      className={classes.button}
                      onClick={() => this.handleClose()}
                    >
                      NEW DEAL
                    </Button>
                    <NavLink
                      to={"/auth/portal-dashboard"}
                      className={cx(classes.navLink)}
                    >
                      <Button
                        round={false}
                        color="github"
                        size="lg"
                        className={classes.button}
                        onClick={() => this.handleLoginSubmit()}
                      >
                        BACK TO DASHBOARD
                      </Button>
                    </NavLink>
                  </div>
                </GridItem>
              )}
              {isDashboard && (
                <GridItem
                  xs={12}
                  sm={10}
                  md={10}
                  lg={12}
                  className={classes.buttonContainer}
                >
                  <div className={classes.alignRight}>
                    <Button
                      round={false}
                      color="github"
                      size="lg"
                      className={classes.button}
                      onClick={() => this.handleClose()}
                    >
                      CLOSE
                    </Button>
                  </div>
                </GridItem>
              )}
            </GridContainer>
          </DialogContent>
        </Dialog>
      </div>
    ) : (
      <></>
    );
  }
}

DealExecutedDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  dealType: PropTypes.string.isRequired,
  trade: PropTypes.object.isRequired,
  isDashboard: PropTypes.bool,
  isAdminDeal: PropTypes.bool
};

export default withStyles(dealExecutedDialogStyle)(DealExecutedDialog);
