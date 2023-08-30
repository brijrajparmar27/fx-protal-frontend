import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Button from "components/CustomButtons/Button.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
// import style from "assets/jss/material-dashboard-react/views/pageStyle";
import style from 'assets/jss/material-dashboard-pro-react/views/signupPageStyle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const useStyles = makeStyles(style);
const CircularProgresss = ({ callInProgress, text = "Processing..." }) => {
  const classes = useStyles();

  const [cardAnimaton, setCardAnimaton] = useState("cardHidden");

  useEffect(() => {
    const intervalCall = setInterval(() => {
      setCardAnimaton("");
    }, 700);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, []);

  return (
    <div className={classes.container}>
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal,
        }}
        open={callInProgress}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="notice-modal-slide-title"
        aria-describedby="notice-modal-slide-description"
      >
        <DialogTitle
          id="waiting-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <h4 className={classes.modalTitle}>{text}</h4>
        </DialogTitle>
        <DialogContent
          id="waiting-modal-slide-description"
          className={classes.modalBody}
          style={{ textAlign: "center" }}
        >
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </div>
  );
};

CircularProgresss.propTypes = {
  callInProgress: PropTypes.bool,
};

export default CircularProgresss;
