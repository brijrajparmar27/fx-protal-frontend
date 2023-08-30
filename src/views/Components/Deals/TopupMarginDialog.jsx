import React from "react";
import PropTypes from "prop-types";

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
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import noticeModalStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class TopupMarginDialog extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: false
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
            showModal: props.showModal
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
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle
            id="notice-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <h4 className={classes.modalTitle}>
              Top Up Margin
            </h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
            style={{textAlign:'left !important'}}
          >
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                              <GridContainer>
                              
                              <GridItem xs={12} sm={12} md={12} lg={12}>
                                  Date of Message: {this.props.date}
</GridItem>
<GridItem xs={12} sm={12} md={12} lg={12}>
    {'Top up Margin required now: '+this.props.topupMarginAmount}
</GridItem>
<GridItem xs={12} sm={12} md={12} lg={12}>
The above Top up Margin amount needs to be deposited with FXGuard within 3 days from the date of this message.
</GridItem>
<GridItem xs={12} sm={12} md={12} lg={12}>
The failure to deposit the Margin within the above time-frame would result in the unwinding of the underlying FX deal.
</GridItem>
                                  </GridContainer>
</GridItem>
            <p>{this.state.noticeModalErrMsg}</p>
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

TopupMarginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default withStyles(noticeModalStyle)(TopupMarginDialog);
