import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// Get Started Images
import videoImg from "assets/img/landing/FXGuardPoster.png";

// core components
import Button from "components/CustomButtons/Button.jsx";

import noticeModalStyle from "assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class GetStartedModal extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: false,
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
    const { classes, title, videoLink } = this.props;

    return (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modalRootContent
          }}
          open={this.state.showModal}
          TransitionComponent={Transition}
          keepMounted
          disableBackdropClick
          disableEscapeKeyDown
          onClose={() => this.handleClose()}
          aria-labelledby="show-modal-slide-title"
          aria-describedby="show-modal-slide-description"
        >
          <DialogTitle
            id="show-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton aria-label='close' className={classes.closeButton} onClick={() => this.props.closeModal()}>
              <CloseIcon />
            </IconButton>
            <h4 className={classes.modalTitle}>
              {title}
            </h4>
          </DialogTitle>
          <DialogContent
            id="show-modal-slide-description"
            className={classes.modalBody}
          >
            <video
              style={{
                width: window.innerWidth <= 992 ? "100%" : 700,
                position: "relative",
                marginBottom: 10
              }}
              poster={videoImg}
              controls
            >
              <source src={videoLink} type="video/mp4" />
            </video>
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

GetStartedModal.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  videoLink: PropTypes.string
};

export default withStyles(noticeModalStyle)(GetStartedModal);
