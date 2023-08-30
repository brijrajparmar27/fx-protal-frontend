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
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import Table from 'components/Table/Table.jsx';
import cx from 'classnames';

// @material-ui/icons
import Check from '@material-ui/icons/Check';
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import { formatDate, shortenDealId } from '../../utils/Utils';

import CompanyKYCSanctionsStyle from 'assets/jss/material-dashboard-pro-react/views/dealExecutedDialogStyle.jsx';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

class CompanyKYCSanctions extends React.Component {
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
        Open Link
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
              <span className={classes.titleContent}>Sanctions Details</span>
            </h3>
          </DialogTitle>
          <DialogContent id='classic-modal-slide-description' className={cx(classes.modalBody, classes.loginMaxWidth)}>
            <GridContainer>
              <GridItem xs={12} sm={10} md={12} lg={12}>
                <GridContainer justify='flex-start' className={classes.content}>
                  <GridItem xs={11} sm={11} md={11} lg={11} className={classes.alignRight}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <b style={{ fontWeight: 400, fontSize: 16, paddingTop: 20, paddingBottom: 20, display: 'flex' }}>Summary</b>
                      </GridItem>
                      {record.companySanctionNegativeData && (
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{
                            padding: '10px !important',
                            borderRight: '1px solid #cccccc',
                          }}
                        >
                          <Table
                            striped
                            tableHeaderColor='gray'
                            tableHead={record.companySanctionNegativeDataColumn}
                            tableData={record.companySanctionNegativeData}
                            customCellClasses={[classes.center, classes.right, classes.right]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[classes.center, classes.right, classes.right]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                      )}
                      {record.companySanctionTypeData && (
                        <GridItem xs={12} sm={12} md={6} lg={6} style={{ padding: '10px !important' }}>
                          <Table
                            striped
                            tableHeaderColor='gray'
                            tableHead={record.companySanctionTypeColumn}
                            tableData={record.companySanctionTypeData}
                            customCellClasses={[classes.center, classes.right, classes.right]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[classes.center, classes.right, classes.right]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                      )}

                      {record.sanctionDocumentsData && record.sanctionDocumentsData.length && (
                        <>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <b style={{ fontWeight: 400, fontSize: 16, paddingTop: 20, paddingBottom: 20, display: 'flex' }}>Sanction Documents</b>
                          </GridItem>

                          <GridItem xs={12} sm={12} md={6} lg={6} style={{ padding: '10px !important' }}>
                            <Table
                              striped
                              tableHeaderColor='gray'
                              tableHead={record.companySanctionDocumentsColumn}
                              tableData={record.sanctionDocumentsData}
                              customCellClasses={[classes.center, classes.right, classes.right]}
                              customClassesForCells={[0, 4, 5]}
                              customHeadCellClasses={[classes.center, classes.right, classes.right]}
                              customHeadClassesForCells={[0, 4, 5]}
                            />
                          </GridItem>
                        </>
                      )}
                      {record.insolventsData && record.insolventsData.length && (
                        <>
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <b style={{ fontWeight: 400, fontSize: 16, paddingTop: 20, paddingBottom: 20, display: 'flex' }}>Insolvent</b>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6} lg={6} style={{ padding: '10px !important' }}>
                            <Table
                              striped
                              tableHeaderColor='gray'
                              tableHead={record.companyInsolventsColumn}
                              tableData={record.insolventsData}
                              customCellClasses={[classes.center, classes.right, classes.right]}
                              customClassesForCells={[0, 4, 5]}
                              customHeadCellClasses={[classes.center, classes.right, classes.right]}
                              customHeadClassesForCells={[0, 4, 5]}
                            />
                          </GridItem>
                        </>
                      )}
                    </GridContainer>
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

CompanyKYCSanctions.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  record: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default withStyles(CompanyKYCSanctionsStyle)(CompanyKYCSanctions);
