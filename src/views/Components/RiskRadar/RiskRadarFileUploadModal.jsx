import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "components/CustomButtons/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox } from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { formatDate } from "utils/Utils";
import {
  blackColor,
  hexToRgb,
} from "assets/jss/material-dashboard-pro-react.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import { useEffect } from "react";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 80;
  const left = "calc(50% - 500px)";
  return {
    top: `${top}px`,
    left: `${left}`,
  };
}
const useStyles = makeStyles((theme) => ({
  ...customCheckboxRadioSwitch,
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
  checkboxLabelControl: {
    margin: "0",
  },
  checkboxLabel: {
    marginLeft: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)",
  },
}));

const RiskRadarFileUploadModal = ({
  data,
  showModal,
  closeModal,
  uploadNowInput,
}) => {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  const [selectedInvoices, setSelectedInvoices] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalHeader, setConfirmationModalHeader] = useState("");
  const [confirmationModalMsg, setConfirmationModalMsg] = useState("");

  // const [selectedModifiedInvoices, setSelectedModifiedInvoices] = useState({});
  // const [selectedRepeatedInvoices, setSelectedRepeatedInvoices] = useState({});
  // const [selectedHedges, setSelectedHedges] = useState({});
  // const [checkedInvoiceData, setCheckedInvoiceData] = useState(false);
  console.log(data);
  useEffect(() => {
    if (data && data.length > 0) {
      let selRow = {},
        modRow = {},
        repRow = {},
        hedgeRow = {};
      data.forEach((d, i) => {
        selRow[i] = d;
        // if (d.invoiceType === "EXTERNAL_HEDGES") {
        //   hedgeRow[i] = d
        // } else if (d.status === 'MODIFIED') {
        //   modRow[i] = d
        // } else if (d.status === 'EXISTING') {
        //   repRow[i] = d
        // } else {
        //   selRow[i] = d
        // }
      });
      setSelectedInvoices({ ...selRow });
      // setSelectedModifiedInvoices({ ...modRow });
      // setSelectedRepeatedInvoices({ ...repRow });
      // setSelectedHedges({ ...hedgeRow });
    }
  }, [data]);

  const fileUploadConfirmation = (e) => {
    e.preventDefault();
    if (e.target.files.length) {
      this.setState({
        uploadFiles: e.target.files,
        confirmationUploadRiskFile: true,
        confirmationUploadRiskFileHeader: "Are You Sure?",
        confirmationUploadRiskFileMsg: "Do you want to upload New Risks?",
      });
    }
  };

  const handleCardCheck = (e, invoice, index) => {
    if (e.target.checked) {
      // if (invoice.invoiceType === "EXTERNAL_HEDGES") {
      //   setSelectedHedges({ ...selectedHedges, [index]: invoice });
      // } else if (invoice.status === 'MODIFIED') {
      //   setSelectedModifiedInvoices({ ...selectedModifiedInvoices, [index]: invoice });
      // } else if (invoice.status === 'EXISTING') {
      //   setSelectedRepeatedInvoices({ ...selectedRepeatedInvoices, [index]: invoice });
      // } else {
      setSelectedInvoices({ ...selectedInvoices, [index]: invoice });
      // }
    } else {
      // if (invoice.invoiceType === "EXTERNAL_HEDGES") {
      //   setSelectedHedges({ ...selectedHedges, [index]: null });
      // } else if (invoice.status === 'MODIFIED') {
      //   setSelectedModifiedInvoices({ ...selectedModifiedInvoices, [index]: null });
      // } else if (invoice.status === 'EXISTING') {
      //   setSelectedRepeatedInvoices({ ...selectedRepeatedInvoices, [index]: null });
      // } else {
      setSelectedInvoices({ ...selectedInvoices, [index]: null });
      // }
    }
    console.log("invoices...listchecked ", invoice);
  };

  // const uploadInvoice = () => {
  //   uploadNowInput(selectedInvoices);
  // };

  const handleNegativeResponse = () => {
    setConfirmationModal(false);
    setConfirmationModalHeader("");
    setConfirmationModalMsg("");
  };
  const handlePositiveResponse = () => {
    setConfirmationModal(false);
    setConfirmationModalHeader("");
    setConfirmationModalMsg("");
    uploadNowInput(selectedInvoices);
  };

  const uploadInvoice = () => {
    setConfirmationModalHeader("Risk Input Upload");
    setConfirmationModalMsg("Only new records will be added to Risk Radar. Modified records will replace existing records in Risk Radar. If you would not like modified records to replace existing records, please press No in this message and Unselect before Uploading again.");
    setConfirmationModal(true);
  };

  return (
    <>
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={showModal}
        onClose={closeModal}
      >
        <div style={modalStyle} className={classes.paper}>
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <div style={{ textalign: "centre" }}>
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>
                Which data you would like to import
              </h2>
            </div>
            <div>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={closeModal}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          {/* <div style={{textAlign: 'right'}}>{'Only new payable / receivable inputs will be added'}</div> */}
          <div
            style={{
              height: 300,
              overflow: "auto",
              border: "1px solid #A0A0A0",
            }}
          >
            <>
              {data && data.length > 0 ? (
                <table style={{ width: "100%", textAlign: "center" }}>
                  <tr
                    style={{ border: "1px solid black", textAlign: "centre" }}
                  >
                    <th>Select</th>
                    <th>Category </th>
                    <th>Reference Id</th>
                    <th>Amount</th>
                    <th>Desciption</th>
                    <th>Date</th>
                    <th>Bought Currency</th>
                    <th>Sold Currency</th>
                    <th>Deal Date</th>
                    <th>Settlement Date</th>
                    <th>Status</th>
                  </tr>

                  {data &&
                    data.map((invoice, index) => (
                      <tr key={index}>
                        <td>
                          <FormControlLabel
                            className={classes.center}
                            classes={{
                              root: classes.checkboxLabelControl,
                              label: classes.checkboxLabel,
                            }}
                            control={
                              <Checkbox
                                tabIndex={-1}
                                //   onClick={(e) => handleCardCheck(e)}
                                checked={selectedInvoices[index] !== null}
                                onChange={(e) =>
                                  handleCardCheck(e, invoice, index)
                                }
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot,
                                }}
                              />
                            }
                          />
                        </td>
                        <td>{invoice.invoiceType}</td>
                        <td>{invoice.referenceId}</td>
                        <td>{invoice.amount + " " + invoice.currencyCode}</td>
                        <td>{invoice.description}</td>
                        <td>{formatDate(invoice.date)}</td>
                        <td>
                          {invoice.currencyBought +
                            " " +
                            invoice.boughtCurrencyCode}
                        </td>
                        <td>
                          {invoice.currencySold +
                            " " +
                            invoice.soldCurrencyCode}
                        </td>
                        <td>{formatDate(invoice.dealDate)}</td>
                        <td>{formatDate(invoice.settlementDate)}</td>
                        <td>{invoice.status}</td>
                      </tr>
                    ))}
                </table>
              ) : (
                <>
                  <div
                    style={{ marginTop: 10, textAlign: "center", color: "red" }}
                  >
                    No Risk Input available to upload
                  </div>
                </>
              )}
            </>
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="info"
              onClick={() => uploadInvoice()}
              style={{ marginBottom: "10px" }}
            >
              UPLOAD NOW
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={closeModal}
              style={{ marginBottom: "10px", marginLeft: "2px" }}
            >
              CANCEL
            </Button>
          </div>
        </div>
      </Modal>
      {confirmationModal && (
        <ConfirmationModal
          confirmationModal={confirmationModal}
          confirmationModalHeader={confirmationModalHeader}
          confirmationModalMsg={confirmationModalMsg}
          handleNegativeButton={handleNegativeResponse}
          handlePositiveButton={handlePositiveResponse}
          positiveButtonText="Yes"
          negativeButtonText="No"
        />
      )}
    </>
  );
};

export default RiskRadarFileUploadModal;
