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

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 80;
  const left = 'calc(50% - 500px)';
  return {
    top: `${top}px`,
    left: `${left}`
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

const RiskRadarXeroModal = ({
  data,
  showModal,
  closeModal,
  getXeroInvoices,
  invoiceDataRetrieved,
  uploadNowInvoice,
  uploadLaterInvoice,
}) => {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  const [selectedInvoices, setSelectedInvoices] = useState({});
  const [checkedInvoiceData, setCheckedInvoiceData] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      let selRow = {};
      data.forEach((d,i) => selRow[i] = d);
      setSelectedInvoices({ ...selRow })
    }
  }, [data]);

  const handleCardCheck = (e, invoice, index) => {
    if (e.target.checked) {
      setSelectedInvoices({ ...selectedInvoices, [index]: invoice });
    } else {
      setSelectedInvoices({ ...selectedInvoices, [index]: null });
    }
    console.log("invoices...listchecked ", invoice);
  };

  const uploadInvoice = () => {
    uploadNowInvoice(selectedInvoices);
  };
  const downloadInvoice = () => {
    uploadLaterInvoice(selectedInvoices);
  };
  const getXeroInvoiceRecord = () => {
    getXeroInvoices();
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
          <div style={{ justifyContent: "space-between", display: "flex"}}>
            <div style={{ textalign: "centre" }}>
              <h2 style={{marginTop: 0, marginBottom: 0}}>Which data you would like to import</h2>
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
          <div style={{marginBottom: "17px"}}>
            <FormControlLabel
              className={classes.center}
              classes={{
                root: classes.checkboxLabelControl,
                label: classes.checkboxLabel,
              }}
              control={
                <Checkbox                
                  tabIndex={-1}
                  onClick={(e) => setCheckedInvoiceData(e.target.checked)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  checked={checkedInvoiceData}
                  icon={<Check className={classes.uncheckedIcon} />}
                  disabled={data && data.length > 0}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              label={
                <div className={classes.termsText}>
                  Account Payable / Account Receivable
                </div>
              }
            />
          </div>
          {/* <div style={{textAlign: 'right'}}>{'Only new payable / receivable inputs will be added'}</div> */}
          <div style={{height: 300, overflow: 'auto', border: '1px solid #A0A0A0'}}>
            <>
            {data && data.length > 0 ? (
              <table style={{ width: "100%", textAlign: "center" }}>
                <tr style={{ border: "1px solid black", textAlign: "centre" }}>
                  <th>Select</th>
                  <th>Category </th>
                  <th>Reference Id</th>
                  <th>Invoice Number</th>
                  <th>Amount</th>
                  <th>Expected Payment Date</th>
                  <th>Planned Payment Date</th>
                  <th>Invoice Status</th>
                </tr>

                {data && data.map((invoice, index) => (
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
                            onChange={(e) => handleCardCheck(e, invoice, index)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot,
                            }}
                          />
                        }
                      />
                    </td>
                    <td>{invoice.invoiceType}</td>
                    <td>{invoice.invoiceId}</td>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.amountDue + " " + invoice.currencyCode}</td>
                    <td>{formatDate(invoice.expectedPaymentDate)}</td>
                    <td>{formatDate(invoice.plannedPaymentDate)}</td>
                    <td>{invoice.status}</td>
                  </tr>
                ))}
              </table>
          ) : (
            <>{invoiceDataRetrieved && <div style={{marginTop: 10, textAlign: 'center', color: 'red'}}>No foreign currency denominated data returned</div>}</>
          )}
          </>
          </div>
          <div style={{textAlign: 'right'}}>
              {data && data.length ? (
                <>
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
                onClick={() => downloadInvoice()}
                style={{ marginBottom: "10px", marginLeft: "2px" }}
              >
                SAVE FOR LATER
              </Button>
              </>
              ) : (
              <Button
                variant="contained"
                color="info"
                onClick={() => getXeroInvoiceRecord()}
                disabled={!checkedInvoiceData}
                style={{ marginBottom: "10px" }}
              >
                GET DATA
              </Button>
              )}
              <Button
                variant="contained"
                color="info"
                onClick={closeModal}
                style={{ marginBottom: "10px", marginLeft: "2px"  }}
              >
                CANCEL
              </Button>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default RiskRadarXeroModal;
