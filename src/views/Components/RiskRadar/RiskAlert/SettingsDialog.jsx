import React from "react";
import PropTypes from "prop-types";

import cx from "classnames";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { validate } from "../../../../utils/Validator";
import { parseCurrency } from "../../../../utils/Utils";

import Button from "components/CustomButtons/Button.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import CustomMultilineText from "components/CustomMultilineText/CustomMultilineText.jsx";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const style = theme => ({
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
    // , textAlign: "center"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  iconButton: {
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
    // float:'right'
  },
  center: {
    textAlign: "center "
  },
  groupHeader: {
    textAlign: "left",
    fontSize: 30,
    marginTop: 0
  },
  featureTitleHeader: {
    //height: 35,
    color: "#3c4858",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold"
    // textAlign: "center"
    //marginTop: 0
  },
  addDirectorsMaxWidth: {
    maxWidth: 600
  },
  circleTooltiptext: {
    visibility: "hidden",
    width: "auto",
    backgroundColor: "#555",
    color: "#fff",
    textAlign: "center",
    borderRadius: "6px",
    padding: "5px ",
    position: "absolute",
    zIndex: "1",
    top: "125%",
    left: "50%",
    opacity: "0",
    transition: "opacity 0.3s"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
});

class SettingsDialog extends React.Component {
  error = {
    lowRiskAmountErrorMsg: {
      required: "Low Risk Amount is required",
      positive: "Low Risk Amount should be positive number",

      range: "Low Risk Amount should be less than medium risk amount"
    },
    mediumRiskAmountErrorMsg: {
      required: "Medium Risk Amount is required",
      positive: "Medium Risk Amount should be positive number",

      range: "Medium Risk Amount should be less than high risk amount"
    },

    highRiskAmountErrorMsg: {
      required: "High Risk Amount is required",
      positive: "High Risk Amount should be positive number",

      range: "High Risk Amount should be greater than medium risk amount"
    },

    thresoldRiskAmountErrorMsg: {
      required: "Thresold Risk Amount is required",
      positive: "Thresold Risk Amount should be positive number",

      range:
        "Thresold Risk Amount should be greater than min risk amount and less than max risk amount"
    },
    unbearableRiskAmountErrorMsg: {
      required: "Thresold Risk Amount is required",
      positive: "Thresold Risk Amount should be positive number",

      range:
        "Thresold Risk Amount should be greater than high risk amount and less than max risk amount"
    },
    emailIDsErrorMsg: {
      required: "Enter Email IDs"
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      minRiskAmount: 0,
      maxRiskAmount: 0,

      lowRiskAmount: "",
      lowRiskAmountState: "",
      lowRiskAmountPristine: false,
      lowRiskAmountErrorMsg: [],
      lowRiskAmountRangeError: false,

      emailIDs: "",
      emailIDsState: "",
      emailIDsPristine: false,
      emailIDsErrorMsg: [],

      mediumRiskAmount: "",
      mediumRiskAmountState: "",
      mediumRiskAmountPristine: false,
      mediumRiskAmountErrorMsg: [],
      mediumRiskAmountRangeError: false,

      highRiskAmount: "",
      highRiskAmountState: "",
      highRiskAmountPristine: false,
      highRiskAmountErrorMsg: [],

      unbearableRiskAmount: "",
      unbearableRiskAmountState: "",
      unbearableRiskAmountPristine: false,
      unbearableRiskAmountErrorMsg: [],

      thresoldRiskAmount: "",
      thresoldRiskAmountState: "",
      thresoldRiskAmountPristine: false,
      thresoldRiskAmountErrorMsg: [],

      sendEmail: true
    };
  }
  componentDidMount() {
    this.setRiskAmounts(this.props);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.isChanged !== newProps.isChanged) {
      this.setRiskAmounts(newProps);
    }
  }
  onSubmit = () => {
    if (this.isValid()) {
      this.props.onConfirmClick(
        this.state.lowRiskAmount,
        this.state.mediumRiskAmount,
        this.state.highRiskAmount,
        this.state.thresoldRiskAmount,
        this.state.emailIDs,
        this.state.sendEmail
      );
    }
  };
  isValid = () => {
    if (
      this.state.lowRiskAmountState === "success" &&
      this.state.mediumRiskAmountState === "success" &&
      this.state.highRiskAmountState === "success"
    ) {
      if (
        this.state.sendEmail &&
        (this.state.thresoldRiskAmountState !== "success" ||
          this.state.emailIDsState !== "success")
      ) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  };
  setRiskAmounts = props => {
    console.log("setriskamount", props);
    this.setState({
      lowRiskAmount: props.lowRiskAmount,
      mediumRiskAmount: props.mediumRiskAmount,
      highRiskAmount: props.highRiskAmount,
      unbearableRiskAmount: props.unbearableRiskAmount,

      thresoldRiskAmount: props.thresoldRiskAmount,
      emailIDs: props.emailIDs,
      sendEmail: props.sendEmail,

      lowRiskAmountState: "success",
      mediumRiskAmountState: "success",
      highRiskAmountState: "success",
      thresoldRiskAmountState: "success",
      emailIDsState: "success"
    });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error),
      () => {
        this.setState({
          lowRiskAmountRangeError:
            parseFloat(parseCurrency(this.state.lowRiskAmount)) >
            parseFloat(parseCurrency(this.state.mediumRiskAmount)),
          lowRiskAmountState:
            parseFloat(parseCurrency(this.state.lowRiskAmount)) >
              parseFloat(parseCurrency(this.state.mediumRiskAmount)) ||
            this.state.lowRiskAmountErrorMsg.length > 0
              ? "error"
              : "success",

          mediumRiskAmountRangeError:
            parseFloat(parseCurrency(this.state.mediumRiskAmount)) >
            parseFloat(parseCurrency(this.state.highRiskAmount)),
          mediumRiskAmountState:
            parseFloat(parseCurrency(this.state.mediumRiskAmount)) >
              parseFloat(parseCurrency(this.state.highRiskAmount)) ||
            this.state.mediumRiskAmountErrorMsg.length > 0
              ? "error"
              : "success"
        });
      }
    );
  };
  handleToggle = event => {
    this.setState({
      sendEmail: event.target.checked
    });
  };

  render() {
    const { classes, functionalCurrency } = this.props;

    return (
      <>
        <Dialog
          classes={{
            root: classes.modalRoot
          }}
          // maxWidth='sm'
          open={this.props.showSettingsDialog}
          style={{ zIndex: 1032 }}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.props.toggleSettingsDialog(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.center, classes.modalHeader)}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.props.toggleSettingsDialog(false)}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>
              {"My Risk Alert Settings"}
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <form className={classes.form}>
              <GridContainer>
                <GridItem xs={6} sm={6} md={6} lg={6}>
                  <CustomNumberFormat
                    success={this.state.lowRiskAmountState === "success"}
                    error={this.state.lowRiskAmountState === "error"}
                    helpText={
                      this.state.lowRiskAmountState === "error" &&
                      this.state.lowRiskAmountErrorMsg.length > 0
                        ? this.state.lowRiskAmountErrorMsg[0]
                        : this.state.lowRiskAmountRangeError
                        ? this.error.lowRiskAmountErrorMsg.range
                        : ""
                    }
                    value={this.state.lowRiskAmount}
                    labelText="Low Risk Amount (Upper Threshold)"
                    onChange={this.handleChange}
                    id={"lowRiskAmount"}
                    prefix
                    prefixLabel={functionalCurrency ? functionalCurrency : ""}
                    formControlProps={{
                      name: "lowRiskAmount",
                      style: { paddingTop: 5 },
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({
                          lowRiskAmountPristine: false
                        });
                        this.change(event, "lowRiskAmount", [
                          { type: "required" },
                          { type: "positive" }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.lowRiskAmountPristine) {
                          this.setState({
                            lowRiskAmountPristine: false
                          });
                          this.change(event, "lowRiskAmount", [
                            { type: "required" },
                            { type: "positive" }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>

                <GridItem xs={6} sm={6} md={6} lg={6}>
                  <CustomNumberFormat
                    success={this.state.mediumRiskAmountState === "success"}
                    error={this.state.mediumRiskAmountState === "error"}
                    helpText={
                      this.state.mediumRiskAmountState === "error" &&
                      this.state.mediumRiskAmountErrorMsg.length > 0
                        ? this.state.mediumRiskAmountErrorMsg[0]
                        : this.state.mediumRiskAmountRangeError
                        ? this.error.mediumRiskAmountErrorMsg.range
                        : ""
                    }
                    prefix
                    prefixLabel={functionalCurrency ? functionalCurrency : ""}
                    value={this.state.mediumRiskAmount}
                    labelText="Medium Risk Amount (Upper Threshold)"
                    onChange={this.handleChange}
                    id={"mediumRiskAmount"}
                    formControlProps={{
                      name: "mediumRiskAmount",
                      style: { paddingTop: 5 },
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({
                          mediumRiskAmountPristine: false
                        });
                        this.change(event, "mediumRiskAmount", [
                          { type: "required" },
                          { type: "positive" }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.mediumRiskAmountPristine) {
                          this.setState({
                            mediumRiskAmountPristine: false
                          });
                          this.change(event, "mediumRiskAmount", [
                            { type: "required" },
                            { type: "positive" }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>

                <GridItem xs={6} sm={6} md={6} lg={6}>
                  <CustomNumberFormat
                    success={this.state.highRiskAmountState === "success"}
                    error={this.state.highRiskAmountState === "error"}
                    helpText={
                      this.state.highRiskAmountState === "error" &&
                      this.state.highRiskAmountErrorMsg[0]
                    }
                    value={this.state.highRiskAmount}
                    labelText="High Risk Amount (Upper Threshold)"
                    onChange={this.handleChange}
                    prefix
                    prefixLabel={functionalCurrency ? functionalCurrency : ""}
                    id={"highRiskAmount"}
                    formControlProps={{
                      name: "highRiskAmount",
                      style: { paddingTop: 5 },
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({
                          highRiskAmountPristine: false
                        });
                        this.change(event, "highRiskAmount", [
                          { type: "required" },
                          { type: "positive" }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.highRiskAmountPristine) {
                          this.setState({
                            highRiskAmountPristine: false
                          });
                          this.change(event, "highRiskAmount", [
                            { type: "required" },
                            { type: "positive" }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>

                {/* 
                <GridItem xs={6} sm={6} md={6} lg={6}>
                  <CustomNumberFormat
                    success={this.state.unbearableRiskAmountState === "success"}
                    error={this.state.unbearableRiskAmountState === "error"}
                    helpText={
                      this.state.unbearableRiskAmountState === "error" &&
                      this.state.unbearableRiskAmountErrorMsg[0]
                    }
                    value={this.state.unbearableRiskAmount}
                    labelText="Un-Bearable Risk Amount"
                    onChange={this.handleChange}
                    id={"unbearableRiskAmount"}
                    formControlProps={{
                      name: "unbearableRiskAmount",
                      style: { paddingTop: 5 },
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({
                          unbearableRiskAmountPristine: false
                        });
                        this.change(event, "unbearableRiskAmount", [
                          { type: "required" },
                          { type: "positive" },
                          {
                            type: "range",
                            params: {
                              min: this.state.highRiskAmount,
                              max: this.props.maxRiskAmount
                            }
                          }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.unbearableRiskAmountPristine) {
                          this.setState({
                            unbearableRiskAmountPristine: false
                          });
                          this.change(event, "unbearableRiskAmount", [
                            { type: "required" },
                            { type: "positive" },
                            {
                              type: "range",
                              params: {
                                min: this.state.highRiskAmount,
                                max: this.props.maxRiskAmount
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem> */}

                <GridItem xs={6} sm={6} md={6} lg={6}>
                  <FormControlLabel
                    className={this.props.classes.center}
                    classes={{
                      root: this.props.classes.checkboxLabelControl,
                      label: this.props.classes.checkboxLabel
                    }}
                    control={
                      <Switch
                        color="primary"
                        tabIndex={-1}
                        id={"checkbox"}
                        onChange={this.handleToggle}
                        checked={this.state.sendEmail}
                        // value={this.state.enableUserList[userID]}
                        // checkedIcon={<Check className={this.props.classes.checkedIcon} />}
                        // icon={<Check className={this.props.classes.uncheckedIcon} />}
                        // classes={{
                        //   checked: this.props.classes.checked,
                        //   root: this.props.classes.checkRoot,
                        // }}
                      />
                    }
                    label="Send Email"
                  />
                </GridItem>
                {this.state.sendEmail && (
                  <>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <CustomMultilineText
                        success={this.state.emailIDsState === "success"}
                        error={this.state.emailIDsState === "error"}
                        helpText={
                          this.state.emailIDsState === "error" &&
                          this.state.emailIDsErrorMsg[0]
                            ? this.state.emailIDsErrorMsg[0]
                            : "Enter Email IDs separated by semicolon (;) Email Alerts will be sent when your Risk Amount exceeds threshold risk amount."
                        }
                        value={this.state.emailIDs}
                        labelText="Email ID"
                        onChange={this.handleChange}
                        id={"emailIDs"}
                        formControlProps={{
                          name: "emailIDs",
                          style: { paddingTop: 5 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              emailIDsPristine: false
                            });
                            this.change(event, "emailIDs", [
                              { type: "required" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.emailIDsPristine) {
                              this.setState({
                                emailIDsPristine: false
                              });
                              this.change(event, "emailIDs", [
                                { type: "required" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>

                    <GridItem xs={6} sm={6} md={6} lg={6}>
                      <CustomNumberFormat
                        success={
                          this.state.thresoldRiskAmountState === "success"
                        }
                        error={this.state.thresoldRiskAmountState === "error"}
                        helpText={
                          this.state.thresoldRiskAmountState === "error" &&
                          this.state.thresoldRiskAmountErrorMsg[0]
                        }
                        value={this.state.thresoldRiskAmount}
                        prefix
                        prefixLabel={
                          functionalCurrency ? functionalCurrency : ""
                        }
                        labelText="Minimum Threshold Risk amount for alert"
                        onChange={this.handleChange}
                        id={"thresoldRiskAmount"}
                        formControlProps={{
                          name: "thresoldRiskAmount",
                          style: { paddingTop: 5 },
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                          onBlur: event => {
                            this.setState({
                              thresoldRiskAmountPristine: false
                            });
                            this.change(event, "thresoldRiskAmount", [
                              { type: "required" },
                              { type: "positive" }
                            ]);
                          },
                          onChange: event => {
                            if (!this.state.thresoldRiskAmountPristine) {
                              this.setState({
                                thresoldRiskAmountPristine: false
                              });
                              this.change(event, "thresoldRiskAmount", [
                                { type: "required" },
                                { type: "positive" }
                              ]);
                            }
                          }
                        }}
                      />
                    </GridItem>
                  </>
                )}
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div className={cx(classes.buttonContainer, classes.center)}>
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      onClick={() => this.onSubmit()}
                    >
                      CONFIRM
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
SettingsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  isChanged: PropTypes.bool
};
export default withStyles(style)(SettingsDialog);
