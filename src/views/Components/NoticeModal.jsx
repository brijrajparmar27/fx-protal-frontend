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

import noticeModalStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class NoticeModal extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  handleClose() {
    this.props.closeModal();
    // this.setState({
    //   noticeModal: false,
    //   noticeModalHeader: "",
    //   noticeModalErrMsg: ""
    // });
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
    if (props.noticeModal !== state.noticeModal) {
      let statusDetails = {};
      if (props.noticeModal) {
        statusDetails = {
          noticeModal: props.noticeModal,
          noticeModalHeader: props.noticeModalHeader,
          noticeModalErrMsg: props.noticeModalErrMsg
        };
      }
      return {
        noticeModal: props.noticeModal,
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
          open={this.state.noticeModal}
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
              {this.state.noticeModalHeader}
            </h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
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

NoticeModal.propTypes = {
  classes: PropTypes.object.isRequired,
  noticeModal: PropTypes.bool.isRequired,
  noticeModalHeader: PropTypes.string,
  noticeModalErrMsg: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default withStyles(noticeModalStyle)(NoticeModal);
