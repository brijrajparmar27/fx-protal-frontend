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
import { formatMoney, formatDate, shortenDealId } from "../../utils/Utils";

import {
  cardTitle,
  whiteColor,
  grayColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

const StatusActivityTrackingDialogStyle = theme => ({
  container: {
    fontWeight: 400,
    maxWidth: 1800
  },
  walletContainer: {
    backgroundColor: "#EEEAEB",
    paddingLeft: "30px !important",
    paddingRight: "30px !important",
    paddingBottom: "30px !important"
  },
  content: {
    fontWeight: 400,
    fontSize: 16,
    textAlign: "left"
  },
  floatRight: {
    float: "right"
  },
  alignLeft: {
    textAlign: "left"
  },
  alignRight: {
    textAlign: "right"
  },
  detailsHeader: {
    textAlign: "left",
    marginBottom: 20,
    fontSize: 18
  },
  detailsRow: {
    marginTop: 10,
    color: "black",
    paddingRight: 15
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20
  },
  detailsRowFooter: {
    fontSize: 12,
    textAlign: "left"
  },
  button: {
    marginLeft: 20
  },
  checkIcon: {
    color: "#A5DC86",
    border: "solid 4px",
    borderRadius: 22,
    padding: 2,
    fontSize: 44,
    borderColor: "aquamarine"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  titleContent: {
    paddingTop: 5,
    paddingLeft: 10,
    position: "absolute"
  },
  loginModalTitle: {
    fontWeight: 600,
    textAlign: "left"
  },
  subTitle: {
    fontWeight: 400,
    fontSize: "16px"
  },
  center: {
    textAlign: "center",
    margin: 20,
    marginTop: 40
  },
  cardTitle: {
    ...cardTitle,
    marginTop: "0",
    marginBottom: "3px",
    color: grayColor[2],
    fontSize: "18px"
  },
  cardSubtitle: {
    color: grayColor[0],
    fontSize: "14px",
    margin: "0 0 10px"
  },
  textCenter: {
    textAlign: "center"
  },
  justifyContentCenter: {
    justifyContent: "center !important"
  },
  customButtonClass: {
    "&,&:focus,&:hover": {
      color: whiteColor
    },
    marginLeft: "5px",
    marginRight: "5px"
  },
  inputAdornment: {
    marginRight: "18px"
  },
  inputAdornmentIcon: {
    color: grayColor[6]
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  cardHeader: {
    marginBottom: "20px",
    zIndex: "3"
  },
  socialLine: {
    padding: "0.9375rem 0"
  },
  ...modalStyle(theme)
});

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class StatusActivityTrackingDialog extends React.Component {
  initialState = {
    cardAnimaton: "cardHidden",
    showModal: true,
    record: null
  };

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = this.initialState;
  }
  handleClose() {
    this.props.closeModal();
    this.setState(this.initialState);
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
      let statusActivityTrackingDialog = {};
      if (props.showModal) {
        statusActivityTrackingDialog =
          StatusActivityTrackingDialog.initialState;
        statusActivityTrackingDialog = {
          ...statusActivityTrackingDialog,
          record:
            props.activities && props.activities.length > 0
              ? props.activities[0]
              : null
        };
      }
      return {
        showModal: props.showModal,
        ...statusActivityTrackingDialog
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
  showDateRecord = index => {
    this.setState({
      record: this.props.activities[index]
    });
  };
  render() {
    const { classes, activities } = this.props;
    const { showModal, record } = this.state;

    return activities ? (
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
                Activity Tracking Details
              </span>
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.modalBody, classes.loginMaxWidth)}
          >
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={3}
                    lg={3}
                    style={{ borderRight: "1px solid #CCC" }}
                  >
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <div
                        className={classes.detailsHeader}
                        style={{ display: "table-cell" }}
                      >
                        <span>Report Date</span>
                      </div>
                    </GridItem>
                    {this.props.activities &&
                      this.props.activities.map((activity, index) => (
                        <GridItem xs={12} sm={12} md={12} lg={12} key={index}>
                          <div className={classes.detailsRow}>
                            <Button
                              round={false}
                              color="info"
                              size="md"
                              className={classes.button}
                              onClick={() => this.showDateRecord(index)}
                            >
                              {formatDate(activity.reportDate)}
                            </Button>
                          </div>
                        </GridItem>
                      ))}
                  </GridItem>
                  <GridItem xs={12} sm={12} md={9} lg={9}>
                    <GridItem xs={12} sm={10} md={12} lg={12}>
                      <GridContainer
                        justify="flex-start"
                        className={classes.content}
                      >
                        <GridItem xs={12} sm={10} md={8} lg={7}>
                          <div
                            className={classes.detailsHeader}
                            style={{ display: "table-cell" }}
                          >
                            <span className={classes.alignLeft}>Detail:</span>
                          </div>
                          <div className={classes.detailsRow}>
                            <span className={classes.alignLeft}>Status</span>
                            <span className={classes.floatRight}>
                              {record && record.status}
                            </span>
                          </div>
                          {record && record.cancellationFee && (
                            <div className={classes.detailsRow}>
                              <span className={classes.alignLeft}>
                                Cancellation Fee
                              </span>
                              <span className={classes.floatRight}>
                                {record && formatMoney(record.cancellationFee)}{" "}
                                {record && record.cancellationFeeCurrencyCode}
                              </span>
                            </div>
                          )}
                          <div className={classes.detailsRow}>
                            <span className={classes.alignLeft}>
                              Report Date
                            </span>
                            <span className={classes.floatRight}>
                              {formatDate(record && record.reportDate)}
                            </span>
                          </div>
                          <div className={classes.detailsRow}>
                            <span className={classes.alignLeft}>
                              Name of Member of Staff
                            </span>
                            <span className={classes.floatRight}>
                              {record && record.memberName}
                            </span>
                          </div>
                          {record && record.customerId && (
                            <div className={classes.detailsRow}>
                              <span className={classes.alignLeft}>
                                Customer ID
                              </span>
                              <span className={classes.floatRight}>
                                {record && record.customerId}
                              </span>
                            </div>
                          )}
                          {record && record.customerName && (
                            <div className={classes.detailsRow}>
                              <span className={classes.alignLeft}>
                                Client Name/Company
                              </span>
                              <span className={classes.floatRight}>
                                {record && record.customerName}
                              </span>
                            </div>
                          )}
                          <div className={classes.detailsRow}>
                            <span className={classes.alignLeft}>Type</span>
                            <span className={classes.floatRight}>
                              {record && record.type}
                            </span>
                          </div>
                          {record && record.dealId && (
                            <div className={classes.detailsRow}>
                              <span className={classes.alignLeft}>Deal ID</span>
                              <span className={classes.floatRight}>
                                {shortenDealId(record && record.dealId)}
                              </span>
                            </div>
                          )}
                          <div className={classes.detailsRow}>
                            <span className={classes.alignLeft}>Signature</span>
                            <span className={classes.floatRight}>
                              {record && record.signature}
                            </span>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={10} md={4} lg={5}>
                          <div className={classes.walletContainer}>
                            <h4 className={classes.alignLeft}>
                              Reason of report
                            </h4>
                            <span>{record && record.reason}</span>
                          </div>
                          <div>
                            <h4 className={classes.alignLeft}>Documents</h4>
                            {record &&
                              record.documentLinks &&
                              record.documentLinks.map((doc, index) => (
                                <div key={index}>
                                  <span className={classes.alignLeft}>
                                    {this.getDocumentLink(doc)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
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

StatusActivityTrackingDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired
};

export default withStyles(StatusActivityTrackingDialogStyle)(
  StatusActivityTrackingDialog
);
