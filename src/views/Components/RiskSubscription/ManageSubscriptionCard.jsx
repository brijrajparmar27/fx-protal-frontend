import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import CircularProgresss from 'components/CircularProgress/CircularProgresss.jsx';
import cx from 'classnames';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import { Button } from '@material-ui/core';
import { validate } from 'utils/Validator';
import CapturePaymentDetails from 'views/Components/RiskSubscription/CapturePaymentDetails.jsx';
import { formatMoney, formatDate } from 'utils/Utils';
import styles from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import cardImages from 'assets/img/powered-by-stripe.png';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';

import ConfirmationModal from 'views/Components/ConfirmationModal.jsx';
import { cardTitle, roseColor, primaryColor } from 'assets/jss/material-dashboard-pro-react.jsx';

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ManageSubscriptionCard = ({ showModal, closeModal, records, updateRecord }) => {
  const classes = useStyles();
  const history = useHistory();
  const [callInProgress, setCallInProgress] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    cvv: '',
    cardValidUptoMM: '',
    cardValidUptoYY: '',
  });

  const cardInfoIntialState = {
    cardNumberState: '',
    cardNumberPristine: true,
    cardNumberErrorMsg: [],
    cardNameState: '',
    cardNamePristine: true,
    cardNameErrorMsg: [],
    cvvState: '',
    cvvPristine: true,
    cvvErrorMsg: [],
    cardValidUptoMMState: '',
    cardValidUptoMMPristine: true,
    cardValidUptoMMErrorMsg: [],
    cardValidUptoYYState: '',
    cardValidUptoYYPristine: true,
    cardValidUptoYYErrorMsg: [],
  };

  const [cardInfoState, setCardInfoState] = useState(cardInfoIntialState);

  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalHeader, setNoticeModalHeader] = useState('Error');
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalHeader, setConfirmationModalHeader] = useState('');
  const [confirmationModalMsg, setConfirmationModalMsg] = useState('');
  const error = {
    cardNumberErrorMsg: {
      required: 'Card Number is required',
    },
    cardNameErrorMsg: {
      required: 'Card Name is required',
    },
    cardValidUptoMMErrorMsg: {
      required: 'Invalid',
      range: 'Invalid',
    },
    cardValidUptoYYErrorMsg: {
      required: 'Invalid',
      range: 'Invalid',
    },
    cvvErrorMsg: {
      required: 'CVV Missing',
      validAmex: 'Please enter 4 digit number on the front of the your card',
    },
  };
  const handleClose = (e) => {
    closeModal();
  };
  const closeNoticeModal = () => {
    setNoticeModal(false);
    setNoticeModalHeader('');
    setNoticeModalErrMsg('');
  };
  const handleNegativeButton = () => {
    setConfirmationModal(false);
    setConfirmationModalHeader('');
    setConfirmationModalMsg('');
  };
  const handleChange = (name, event) => {
    setCardInfo({ ...cardInfo, [name]: event.target.value });
  };
  const change = (event, stateName, rules) => {
    let value = event.target.value;
    if (stateName === "cardNumber") {
      value = value.replace(/-/g, '').trim();
    }
    setCardInfo({ ...cardInfo, [stateName]: value });
    setCardInfoState({
      ...cardInfoState,
      ...validate(value, stateName, cardInfoState, rules, error),
    });
  };
  const changeSubscriptionCardInfo = async () => {
    setConfirmationModalHeader('Information');
    setConfirmationModalMsg('Do you want to update you Credit Card for Risk Subscription Payments?');
    setConfirmationModal(true);
  };
  const upgradePlan = async () => {
    updateRecord(cardInfo);
  };
  const cancelSubscriptionInfo = () => {
    closeModal();
  };
  return (
    <div className={classes.container}>
      <Dialog
        classes={{
          root: classes.center,
        }}
        maxWidth="md"
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle id="classic-modal-slide-title" disableTypography className={cx(classes.modalHeader)} style={{ width: 600 }}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={(e) => handleClose(e)}>
            <CloseIcon />
          </IconButton>
          <div className={classes.modalTitle}>
            <span
              style={{
                fontSize: 20,
                lineHeight: '25px',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              Manage Subscription Card
            </span>
          </div>
        </DialogTitle>

        <DialogContent id="classic-modal-slide-description" className={cx(classes.modalBody, classes.loginMaxWidth)} justify="center">
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <GridContainer style={{ marginTop: 20 }}>
                <GridItem xs={8} sm={8} md={8} lg={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12} style={{ marginLeft: 28, textAlign: 'start' }}>
                      <div className={classes.heading}>Payment Method</div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }}>
                      <div style={{ marginLeft: 28 }}>
                        {' '}
                        {'Please share your Credit Card information which can be used to deduct subscription money'}
                      </div>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} style={{ textAlign: 'start' }}>
                  <img src={cardImages} alt="Stripe Cards" style={{width: '100%', marginTop: '-20px'}} />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <CapturePaymentDetails handleChange={handleChange} change={change} />
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12} style={{ display: 'flex' }}>
              <Button
                size="sm"
                style={{
                  backgroundColor: primaryColor[5],
                  width: '80%',
                  margin: '30px 10px',
                }}
                onClick={() => changeSubscriptionCardInfo()}
              >
                UPDATE
              </Button>
              <Button
                size="sm"
                style={{
                  backgroundColor: primaryColor[5],
                  width: '80%',
                  margin: '30px 10px',
                }}
                onClick={() => cancelSubscriptionInfo()}
              >
                CANCEL
              </Button>
            </GridItem>
            {noticeModal && <NoticeModal noticeModal={noticeModal} noticeModalHeader={noticeModalHeader} noticeModalErrMsg={noticeModalErrMsg} closeModal={closeNoticeModal} />}
            {confirmationModal && (
              <ConfirmationModal
                confirmationModal={confirmationModal}
                confirmationModalHeader={confirmationModalHeader}
                confirmationModalMsg={confirmationModalMsg}
                handleNegativeButton={handleNegativeButton}
                handlePositiveButton={upgradePlan}
              />
            )}
            {callInProgress && <CircularProgresss callInProgress={callInProgress} />}
          </GridContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

ManageSubscriptionCard.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  records: PropTypes.object.isRequired,
  updateRecord: PropTypes.func,
};

export default ManageSubscriptionCard;
