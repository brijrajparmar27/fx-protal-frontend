import React from "react";
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
import { formatDate, shortenDealId } from "../../utils/Utils";

import CustomerActivityRecordDialogStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class CustomerActivityRecordDialog extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: true
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
    const { classes, record } = this.props;
    const { showModal } = this.state;

    return record ? (
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
              <span className={classes.titleContent}>
                Customer Activity Details
              </span>
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
                    sm={10}
                    md={8}
                    lg={7}
                    className={classes.alignRight}
                  >
                    <div
                      className={classes.detailsHeader}
                      style={{ display: "table-cell" }}
                    >
                      <span className={classes.floatLeft}>Detail:</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Report Date</span>
                      <span>{formatDate(record.reportDate)}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>
                        Name of Member of Staff
                      </span>
                      <span>{record.memberName}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Customer ID</span>
                      <span>{record.customerId}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>
                        Client Name/Company
                      </span>
                      <span>{record.customerName}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Type</span>
                      <span>{record.type}</span>
                    </div>
                    {record.dealId && (
                      <div className={classes.detailsRow}>
                        <span className={classes.floatLeft}>Deal ID</span>
                        <span>{shortenDealId(record.dealId)}</span>
                      </div>
                    )}
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Signature</span>
                      <span>{record.signature}</span>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={10} md={4} lg={5}>
                    <div className={classes.walletContainer}>
                      <h4 className={classes.alignLeft}>Reason of report</h4>
                      <span>{record.reason}</span>
                    </div>
                    <div>
                      <h4 className={classes.alignLeft}>Documents</h4>
                      {record.documentLinks &&
                        record.documentLinks.map((doc, index) => (
                          <div key={index}>
                            <span className={classes.floatLeft}>
                              {this.getDocumentLink(doc)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </GridItem>
                </GridContainer>
              </GridItem>
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
            </GridContainer>
          </DialogContent>
        </Dialog>
      </div>
    ) : (
      <></>
    );
  }
}

CustomerActivityRecordDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  record: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default withStyles(CustomerActivityRecordDialogStyle)(
  CustomerActivityRecordDialog
);
