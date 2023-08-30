import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import cx from 'classnames';

// @material-ui/icons
import Check from '@material-ui/icons/Check';
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import { formatDate } from '../../utils/Utils';

import IdCheckDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

class IdCheckDetails extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: 'cardHidden',
      showModal: true,
    };
  }
  handleClickOpen() {
    this.setState({ showModal: true });
  }
  handleClose() {
    this.props.closeModal();
    //this.setState({ showModal: false });
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: '' });
      }.bind(this),
      700
    );
  }
  static getDerivedStateFromProps(props, state) {
    if (props.showModal !== state.showModal) {
      return {
        showModal: props.showModal,
      };
    }
    return null;
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  getDocumentLink = (link) => {
    return (
      <a href={link} target='_blank' rel='noopener noreferrer'>
        Open
      </a>
    );
  };
  render() {
    const { classes, record } = this.props;
    const { showModal } = this.state;
    return record ? (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center,
          }}
          maxWidth='md'
          open={showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby='classic-modal-slide-title'
          aria-describedby='classic-modal-slide-description'
        >
          <DialogTitle id='classic-modal-slide-title' disableTypography className={cx(classes.modalHeader)}>
            <IconButton aria-label='close' className={classes.closeButton} onClick={() => this.handleClose()}>
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>
              <Check className={classes.checkIcon} />
              <span className={classes.titleContent}>ID Check Details</span>
            </h3>
          </DialogTitle>
          <DialogContent id='classic-modal-slide-description' className={cx(classes.modalBody, classes.loginMaxWidth)}>
            <GridContainer>
              <GridItem xs={12} sm={10} md={12} lg={12}>
                <GridContainer justify='flex-start' className={classes.content}>
                  <GridItem xs={11} sm={11} md={6} lg={6} className={classes.alignRight}>
                    <div className={classes.detailsHeader} style={{ display: 'table-cell' }}>
                      <span className={classes.floatLeft}>Detail:</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Name</span>
                      <span>{record.first_name + ' ' + record.last_name}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Status</span>
                      <span>{record.status}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Date of Birth</span>
                      <span>{formatDate(record.date_of_birth)}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Nationality</span>
                      <span>{record.nationality}</span>
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Country Code</span>
                      <span>{record.country_code}</span>
                    </div>
                  </GridItem>
                  <GridItem xs={11} sm={11} md={6} lg={6} className={classes.alignRight}>
                    <h4 className={classes.alignLeft}>Document</h4>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Document Description</span>
                      <span>{record.document_description}</span>
                      <span className={classes.floatNone} />
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Is Expired</span>
                      <span>{record.is_expired ? 'YES' : 'NO'}</span>
                      <span className={classes.floatNone} />
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Expiry Date</span>
                      <span>{formatDate(record.expiry_date)}</span>
                      <span className={classes.floatNone} />
                    </div>
                    <div className={classes.detailsRow}>
                      <span className={classes.floatLeft}>Document Number</span>
                      <span>{record.document_number}</span>
                      <span className={classes.floatNone} />
                    </div>
                    {record && record.documentCheckReport && (
                      <div className={classes.detailsRow}>
                        <span className={classes.floatLeft}>Document Link</span>
                        <span>{this.getDocumentLink(record.documentCheckReport)}</span>
                        <span className={classes.floatNone} />
                      </div>
                    )}
                  </GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={10} md={10} lg={12} className={classes.buttonContainer}>
                <div className={classes.alignRight}>
                  <Button round={false} color='github' size='lg' className={classes.button} onClick={() => this.handleClose()}>
                    CLOSE
                  </Button>
                </div>
              </GridItem>
            </GridContainer>
          </DialogContent>
        </Dialog>
      </div>
    ) : (
      <></>
    );
  }
}

IdCheckDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  record: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default withStyles(IdCheckDetailsStyle)(IdCheckDetails);
