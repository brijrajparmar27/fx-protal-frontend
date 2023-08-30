import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";

// @material-ui/icons
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
const style = theme => ({
  ...customSelectStyle,
  ...regularFormsStyle,
  ...customCheckboxRadioSwitch,
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  },
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important"
    //top: 7
  },
  select: {
    paddingBottom: 10,
    fontSize: 14
  },
  ellipses: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
    width: 195,
    verticalAlign: "middle"
  },
  directors: {
    backgroundColor: "rgba(64,168,189,0.15)"
  },
  cardTitleWhite: {
    fontSize: 14
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  },
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black"
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  addIcon: {
    marginTop: 40,
    height: 45,
    width: 45,
    borderRadius: 6,
    backgroundColor: "grey"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  alignRight: {
    textAlign: "right"
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class CustomerRegistrationDialog extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: false,
      companyDesc: "",
      companyName: "",
      contactEmail: "",
      contactName: "",
      contactTitle: "",
      customerId: -1,
      directors: [],
      directorsInfo: {
        column: [],
        data: []
      },
      utilityOrBankStmtLink: "",
      email: "",
      firstName: "",
      incorporationNumber: "",
      lastName: "",
      mainStockMarket: "",
      ownershipType: "",
      type: "",
      payments: "",
      phoneNumber: "",
      platformUsage: [],
      secondaryStockMarket: "",
      turnover: ""
    };
  }
  handleClickOpen() {
    this.setState({ showModal: true });
  }
  handleClose() {
    this.props.closeModal();
    //this.setState({ showModal: false });
  }
  handleLoginSubmit() {
    this.setState({
      showModal: false,
      otpModal: true
    });
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
      let customerRegistrationDetails = {};
      if (props.showModal) {
        customerRegistrationDetails = CustomerRegistrationDialog.initialState;
        customerRegistrationDetails = {
          ...customerRegistrationDetails,
          ...props.customerRegistrationDetails
        };
      }

      return {
        showModal: props.showModal,
        ...customerRegistrationDetails
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
    const { showModal } = this.state;

    return (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot
          }}
          maxWidth="md"
          open={showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.handleClose()}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>
              <span className={classes.titleContent}>
                Customer Registration Application Details
              </span>
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.modalBody, classes.loginMaxWidth)}
          >
            <GridContainer>
              <GridItem xs={12} sm={10} md={12} lg={12}>
                <GridContainer justify="flex-start" className={classes.content}>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <CustomInput
                          labelText="Company Name*"
                          id="crd_companyName"
                          inputProps={{
                            value: this.state.companyName || "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <CustomInput
                          labelText="Incorporation Number*"
                          id="crd_incorporationNumber"
                          inputProps={{
                            value: this.state.incorporationNumber || "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={10} md={12} lg={12}>
                        <b className={classes.subTitle}>
                          Registered Office Address
                        </b>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        className={classes.alignPadding}
                      >
                        <CustomInput
                          labelText="Address*"
                          id="crd_address"
                          inputProps={{
                            value:
                              (this.state.office &&
                                this.state.office.address) ||
                              "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <CustomInput
                          labelText="Corporate email address*"
                          id="crd_companyEmail"
                          inputProps={{
                            value: this.state.email || "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={classes.alignPadding}
                      >
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={2}>
                            <CustomInput
                              labelText="City*"
                              id="crd_city"
                              inputProps={{
                                value:
                                  (this.state.office &&
                                    this.state.office.city) ||
                                  "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4}>
                            <CustomInput
                              labelText="Postal Code*"
                              id="crd_postalCode"
                              inputProps={{
                                value:
                                  (this.state.office &&
                                    this.state.office.postalCode) ||
                                  "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <CustomInput
                              labelText="Country*"
                              id="crd_countryCode"
                              inputProps={{
                                value:
                                  (this.state.office &&
                                    this.state.office.countryCode) ||
                                  "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={10} md={12} lg={12}>
                        <b className={classes.subTitle}>Ownership</b>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <CustomInput
                              labelText="Ownership Type"
                              id="crd_type"
                              inputProps={{
                                value: this.state.type || "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={6} />
                        </GridContainer>
                      </GridItem>
                      {this.state.type === "Public" && (
                        <>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <CustomInput
                              labelText="Main Stock Market*"
                              id="crd_mainStockMarket"
                              inputProps={{
                                value: this.state.mainStockMarket || "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <CustomInput
                              labelText="Secondary Stock Market*"
                              id="crd_secondaryStockMarket"
                              inputProps={{
                                value: this.state.secondaryStockMarket || "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                        </>
                      )}
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer justify="center" />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={12} lg={12}>
                        <CustomInput
                          labelText="Brief description of company"
                          id="crd_companyDescription"
                          inputProps={{
                            value: this.state.companyDesc || "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <CustomInput
                          labelText="Contact Name*"
                          id="crd_contactName"
                          inputProps={{
                            value: this.state.contactName || "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <CustomInput
                          labelText="Contact Title*"
                          id="crd_contactTitle"
                          inputProps={{
                            value: this.state.contactTitle || "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={10} md={12} lg={12}>
                        <b className={classes.subTitle}>Business address</b>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        className={classes.alignPadding}
                      >
                        <CustomInput
                          labelText="Address*"
                          id="crd_contactAddress"
                          inputProps={{
                            value:
                              (this.state.business &&
                                this.state.business.address) ||
                              "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6}>
                        <CustomInput
                          labelText="Contact email address*"
                          id="crd_contactEmail"
                          inputProps={{
                            value: this.state.contactEmail || "",
                            disabled: true
                          }}
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                          }}
                        />
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={classes.alignPadding}
                      >
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={4}>
                            <CustomInput
                              labelText="City*"
                              id="contactCity"
                              inputProps={{
                                value:
                                  (this.state.business &&
                                    this.state.business.city) ||
                                  "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={2}>
                            <CustomInput
                              labelText="Postal Code*"
                              id="crd_contactPostalCode"
                              inputProps={{
                                value:
                                  (this.state.business &&
                                    this.state.business.postalCode) ||
                                  "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <CustomInput
                              labelText="Country*"
                              id="crd_countryCode"
                              inputProps={{
                                value:
                                  (this.state.business &&
                                    this.state.business.countryCode) ||
                                  "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <CustomInput
                              labelText="Expected FX Turnover in a year"
                              id="crd_turnover"
                              inputProps={{
                                value: this.state.turnover || "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={6}>
                            <CustomInput
                              labelText="Expected 3rd payments in a year"
                              id="crd_payments"
                              inputProps={{
                                value: this.state.payments || "",
                                disabled: true
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={10} md={12} lg={12}>
                        <b className={classes.subTitle}>
                          How you may use our platform ?
                        </b>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <GridContainer>
                          {this.state.platformUsage &&
                            this.state.platformUsage.map((usage, index) => (
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                lg={6}
                                key={index}
                              >
                                <CustomInput
                                  inputProps={{
                                    value: usage || "",
                                    disabled: true
                                  }}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses
                                  }}
                                />
                              </GridItem>
                            ))}
                        </GridContainer>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <GridContainer>
                          <GridItem xs={12} sm={10} md={12} lg={12}>
                            <b className={classes.subTitle}>
                              Director's Information
                            </b>
                          </GridItem>
                          <GridItem xs={12} sm={10} md={12} lg={12}>
                            <Table
                              striped
                              tableHeaderColor="gray"
                              tableHead={
                                this.state.directorsInfo &&
                                this.state.directorsInfo.column
                              }
                              tableData={
                                this.state.directorsInfo &&
                                this.state.directorsInfo.data
                              }
                              customCellClasses={[
                                classes.center,
                                classes.right,
                                classes.right
                              ]}
                              customClassesForCells={[0, 4, 5]}
                              customHeadCellClasses={[
                                classes.center,
                                classes.right,
                                classes.right
                              ]}
                              customHeadClassesForCells={[0, 4, 5]}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={10}
                        md={10}
                        lg={12}
                        className={classes.buttonContainer}
                      >
                        <div className={classes.alignRight}>
                          <Button
                            round={false}
                            color="github"
                            size="lg"
                            className={classes.button}
                            onClick={() => this.handleClose()}
                          >
                            CLOSE
                          </Button>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

CustomerRegistrationDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  customerRegistrationDetails: PropTypes.object
};

export default withStyles(style)(CustomerRegistrationDialog);
