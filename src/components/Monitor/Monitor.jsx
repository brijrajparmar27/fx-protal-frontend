import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "components/CustomButtons/Button.jsx";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";

import { useStateValue } from "../../utils/Utils";
function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function useMonitor(props) {
  // const useMonitor = props => {
  const [warningTime] = useState(1 * 30 * 1000);
  const [signoutTime] = useState(2 * 30 * 1000);

  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState("");
  const [noticeModalHeaderMsg, setNoticeModalHeaderMsg] = useState("");

  const [, dispatch] = useStateValue();
  const { history, classes } = props;

  let warnTimeout;
  let logoutTimeout;

  const warn = () => {
    // console.log("Warning");
    // window.alert("You will be logged out automatically in 1 minute");
    setNoticeModalErrMsg(
      "In case of No Action, You are about to logout in next 1 min."
    );
    setNoticeModalHeaderMsg("Auto Logout");
    setNoticeModal(true);
  };
  const logout = () => {
    // console.log("You have been loged out");
    setNoticeModal(false);
    setNoticeModalErrMsg("");
    setNoticeModalHeaderMsg("");
    handleLogout();
  };

  const setTimeouts = () => {
    warnTimeout = setTimeout(warn, warningTime);
    logoutTimeout = setTimeout(logout, signoutTime);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch({
      type: "changeAuthenticated",
      authenticated: false
    });
    history.push("/");
  };

  const clearTimeouts = () => {
    if (warnTimeout) clearTimeout(warnTimeout);
    if (logoutTimeout) clearTimeout(logoutTimeout);
  };

  useEffect(() => {
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress"
    ];

    const resetTimeout = () => {
      clearTimeouts();
      setTimeouts();
    };

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }

    setTimeouts();
    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
        clearTimeouts();
      }
    };
  }, []);

  const handleNoticeModalClose = modal => {
    var x = [];
    x[modal] = false;
    setNoticeModal(false);
    setNoticeModalErrMsg("");
    setNoticeModalHeaderMsg("");
  };

  return (
    <div className={cx(classes.container)}>
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal
        }}
        open={noticeModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleNoticeModalClose("noticeModal")}
        aria-labelledby="notice-modal-slide-title"
        aria-describedby="notice-modal-slide-description"
      >
        <DialogTitle
          id="notice-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <h4 className={classes.modalTitle}>{noticeModalHeaderMsg}</h4>
        </DialogTitle>
        <DialogContent
          id="notice-modal-slide-description"
          className={classes.modalBody}
        >
          <p>{noticeModalErrMsg}</p>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center" }}
          className={classes.modalFooter + " " + classes.modalFooterCenter}
        >
          <Button
            onClick={() => handleNoticeModalClose("noticeModal")}
            color="info"
            round
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
useMonitor.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object
};
export default useMonitor;
