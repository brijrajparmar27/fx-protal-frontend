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
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import WalletStatus from "components/WalletStatus/WalletStatus.jsx";
import { formatMoney, formatDate, shortenDealId } from "../../../utils/Utils";

import dealExecutedDialogStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const PaymentsColumns = [
  "LP Name",
  "Settlement Date",
  "Currency",
  "Amount To Pay",
  "Amount Paid",
  "Amount To Receive",
  "Amount Received",
  "Status"
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class LPPayments extends React.Component {
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
  render() {
    const { classes, payments, batchId } = this.props;
    const { showModal } = this.state;
    return payments ? (
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
              Adjusted Payments in this Batch - {shortenDealId(batchId)}
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.modalBody, classes.loginMaxWidth)}
          >
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <Table
                  hover
                  tableHeaderColor="gray"
                  tableHead={PaymentsColumns}
                  tableData={payments}
                />
              </GridItem>
            </GridContainer>
          </DialogContent>
        </Dialog>
      </div>
    ) : (
      <></>
    );
  }
}

LPPayments.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  payments: PropTypes.array.isRequired,
  batchId: PropTypes.string
};

export default withStyles(dealExecutedDialogStyle)(LPPayments);
