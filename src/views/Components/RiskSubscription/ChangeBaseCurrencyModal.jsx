import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

// @material-ui/icons

// core components
import Button from 'components/CustomButtons/Button.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import confirmationModalStyle from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

class ChangeBaseCurrencyModal extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: 'cardHidden',
      currencies: [],
      currency: "",
      confirmationModal: false,
      confirmationModalHeader: '',
      confirmationModalMsg: '',
      noticeModal: false,
      noticeModalErrMsg: '',
      noticeModalHeader: '',
    };
  }
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    });
  };
  handlePositiveButton() {
    if (this.state.currency === "") {
      // No Currency is Selected
      this.setState({
        noticeModal: true,
        noticeModalHeader: 'Error',
        noticeModalErrMsg: 'Please select the new currency code before confirm',
      });
      return;
    }
    if (this.props.handlePositiveButton) {
      this.props.handlePositiveButton(this.state.currency);
    }
  }
  handleNegativeButton() {
    this.props.handleNegativeButton();
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: '' });
      }.bind(this),
      700
    );
    this.getCurrencies();
  }
  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    let currencies = res.data.currrencies.map(curr => curr.currencyCode);

    this.setState({
      currencies: currencies
    });
  };
  handleCurrency = event => {
    this.setState({ currency: event.target.value });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.confirmationModal !== state.confirmationModal) {
      let statusDetails = {};
      if (props.confirmationModal) {
        statusDetails = {
          confirmationModal: props.confirmationModal,
          confirmationModalHeader: props.confirmationModalHeader,
          confirmationModalMsg: props.confirmationModalMsg,
        };
      }
      return {
        confirmationModal: props.confirmationModal,
        ...statusDetails,
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
            root: classes.center + ' ' + classes.modalRoot,
            paper: classes.modal,
          }}
          open={this.state.confirmationModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleNegativeButton()}
          aria-labelledby='notice-modal-slide-title'
          aria-describedby='notice-modal-slide-description'
        >
          <DialogTitle id='notice-modal-slide-title' disableTypography className={classes.modalHeader}>
            <h4 className={classes.modalTitle}>{this.state.confirmationModalHeader}</h4>
          </DialogTitle>
          <DialogContent id='notice-modal-slide-description' className={classes.modalBody}>
            <p>{this.state.confirmationModalMsg}</p>
            <div style={{ marginTop: 15, marginBottom: 15}}>
            <span style={{ marginTop: 15 }}>Select Currency</span>
            <FormControl className={classes.filledSelect} style={{width: "50%"}} >
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                value={this.state.currency}
                onChange={this.handleCurrency}
                inputProps={{
                  name: "currency",
                  id: "currency",
                  classes: {
                    icon: classes.white,
                    root: classes.selectDropDown
                  }
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem
                  }}
                >
                  Choose Currency
                </MenuItem>
                {this.state.currencies.map(item => (
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value={item}
                    key={item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
            <p>{"Are you sure that you want to change the Reporting Currency?"}</p>
          </DialogContent>
          <DialogActions className={classes.modalFooter + ' ' + classes.modalFooterCenter}>
            <Button onClick={() => this.handlePositiveButton()} color='info' round>
            {this.props.positiveButtonText?this.props.positiveButtonText:'Confirm'}
              
            </Button>
            <Button onClick={() => this.handleNegativeButton()} color='info' round>
              {this.props.negativeButtonText?this.props.negativeButtonText:'Cancel'}
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.noticeModal && (
          <NoticeModal
            noticeModal={this.state.noticeModal}
            noticeModalHeader={this.state.noticeModalHeader}
            noticeModalErrMsg={this.state.noticeModalErrMsg}
            closeModal={this.closeNoticeModal}
          />
        )}
      </div>
    );
  }
}

ChangeBaseCurrencyModal.propTypes = {
  classes: PropTypes.object.isRequired,
  confirmationModal: PropTypes.bool.isRequired,
  confirmationModalHeader: PropTypes.string,
  confirmationModalMsg: PropTypes.string.isRequired,
  handleNegativeButton: PropTypes.func.isRequired,
  handlePositiveButton: PropTypes.func.isRequired,
};

export default withStyles(confirmationModalStyle)(ChangeBaseCurrencyModal);
