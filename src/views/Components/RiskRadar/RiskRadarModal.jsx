import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "../../../components/CustomButtons/Button";
import { makeStyles } from "@material-ui/core/styles";
import Iframe from 'react-iframe'

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 1050,
    height: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const RiskRadarModal = ({ showModal, closeModal }) => {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  return (
    <>
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={showModal}
        onClose={() => closeModal()}
      >
        <div style={modalStyle} className={classes.paper}>
          {/* <h2 className="ModalHeading">Are You Sure Want To Go To The Xero </h2>
          <Button
            variant="contained"
            color="info"
          
            style={{ marginTop: 30 }}
          >
           YES
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              closeModal();
            }}
            style={{ marginTop: 30 }}
          >
            NO
          </Button> */}
        <Iframe url="http://www.google.com"
        width="640px"
        height="320px"
        display="block"
        position="relative"/>
        </div>
      </Modal>
    </>
  );
};

export default RiskRadarModal;
