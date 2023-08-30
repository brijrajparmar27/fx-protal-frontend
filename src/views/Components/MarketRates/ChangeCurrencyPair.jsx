import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import signupPageStyle from "assets/jss/material-dashboard-pro-react/views/signupPageStyle";
import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { validate } from "../../../utils/Validator";

import cx from "classnames";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </div>
  );
}

const style = theme => ({
  ...signupPageStyle,
  ...customSelectStyle,
  ...customInputStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important"
    //top: 7
  },
  select: {
    padding: "4px 24px",
    fontSize: 14
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: -15
    }
  },
  selectFormHelperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "left"
  },
  footer: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5
  },
  countryFormControl: {
    marginTop: 5
  },
  phoneFormControl: {
    paddingTop: 0
  },
  modalCloseButton: {
    float: "right"
  },
  loginMaxWidth: {
    maxWidth: 650
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  emptyIcon: {
    [theme.breakpoints.up("lg")]: {
      display: "none"
    }
  }
});

class ChangeCurrencyPair extends React.Component {
  error = {
    baseCurrencyErrorMsg: {
      required: "Base Currency is required"
    },
    quoteCurrencyErrorMsg: {
      required: "Quote Currency is required"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      document: "",
      quoteCurrency: "",
      quoteCurrencyState: "",
      quoteCurrencyPristine: true,
      quoteCurrencyErrorMsg: [],

      baseCurrency: "",
      baseCurrencyState: "",
      baseCurrencyPristine: true,
      baseCurrencyErrorMsg: []
    };
  }
  componentWillReceiveProps(newProps) {
    console.log("componentWillReceiveProps outside", newProps);
    if (this.props.showModal != newProps.showModal) {
      console.log("componentWillReceiveProps inside", newProps);
      this.setState({
        quoteCurrency: newProps.editObject.quoteCurrency,
        baseCurrency: newProps.editObject.baseCurrency,
        baseCurrencyState: "success",
        quoteCurrencyState: "success"
      });
    }
  }
  handleSimple = event => {
    this.setState(
      validate(
        event.target.value,
        event.target.name,
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
  };

  onSubmit = () => {
    // console.log("onsubmit", this.isValidated());
    if (this.isValidated()) {
      this.props.onSubmitCurrencyPair(
        this.state.baseCurrency,
        this.state.quoteCurrency
      );
      this.props.handleClose("showCurrencyPairModal");
    }
  };
  isValidated = () => {
    if (
      this.state.quoteCurrencyState === "success" &&
      this.state.baseCurrencyState === "success"
    ) {
      return true;
    } else {
      if (this.state.baseCurrencyState !== "success") {
        this.setState({ baseCurrencyState: "error" });
      }
      if (this.state.quoteCurrencyState !== "success") {
        this.setState({ quoteCurrencyState: "error" });
      }
      return false;
    }
  };

  render() {
    const { classes, currencies } = this.props;
    return (
      <>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal + " " + classes.loginMaxWidth
          }}
          // maxWidth='sm'
          open={this.props.showModal}
          style={{ zIndex: 1032 }}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.props.handleClose("showCurrencyPairModal")}
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
              onClick={() => this.props.handleClose("showCurrencyPairModal")}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.showModalTitle)}>
              {"Change Currency Pair"}
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <form className={classes.form}>
              <GridContainer>
                <GridItem
                  xs={10}
                  sm={10}
                  md={11}
                  lg={11}
                  className={classes.alignPadding}
                >
                  <FormControl fullWidth className={classes.countryFormControl}>
                    <FormHelperText
                      style={{
                        backgroundColor: "white",
                        paddingTop: 5,
                        marginTop: 0,
                        textAlign: "left"
                      }}
                      success={this.state.baseCurrencyState === "success"}
                      error={this.state.baseCurrencyState === "error"}
                      helpText={
                        this.state.baseCurrencyState === "error" &&
                        this.state.baseCurrencyErrorMsg[0]
                      }
                    >
                      Base Currency*
                    </FormHelperText>

                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state.baseCurrency}
                      onChange={this.handleSimple}
                      inputProps={{
                        name: "baseCurrency",
                        id: "baseCurrency"
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
                      {currencies &&
                        currencies.map(item => (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={item.currencyCode}
                            key={item.currencyCode}
                          >
                            {item.currencyCode}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem
                  xs={10}
                  sm={10}
                  md={11}
                  lg={11}
                  className={classes.alignPadding}
                >
                  <FormControl fullWidth className={classes.countryFormControl}>
                    <FormHelperText
                      style={{
                        backgroundColor: "white",
                        paddingTop: 5,
                        marginTop: 0,
                        textAlign: "left"
                      }}
                      success={this.state.quoteCurrencyState === "success"}
                      error={this.state.quoteCurrencyState === "error"}
                      helpText={
                        this.state.quoteCurrencyState === "error" &&
                        this.state.quoteCurrencyErrorMsg[0]
                      }
                    >
                      Quote Currency*
                    </FormHelperText>
                    {/* <InputLabel
                          htmlFor="type"
                          className={classes.selectLabel}
                        >
                          Country*
                        </InputLabel> */}
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state.quoteCurrency}
                      onChange={this.handleSimple}
                      inputProps={{
                        name: "quoteCurrency",
                        id: "quoteCurrency"
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
                      {currencies &&
                        currencies.map(item => {
                          if (item.currencyCode !== this.state.baseCurrency) {
                            return (
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={item.currencyCode}
                                key={item.currencyCode}
                              >
                                {item.currencyCode}
                              </MenuItem>
                            );
                          }
                        })}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GridContainer
                    spacing={1}
                    style={{ textAlign: "center", marginTop: 20 }}
                  >
                    <GridItem
                      className={classes.customText}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <div className={classes.center}>
                        {this.state.callInProgress ? (
                          <CircularProgress />
                        ) : (
                          <Button
                            round={false}
                            color="info"
                            size="lg"
                            onClick={this.onSubmit}
                          >
                            SUBMIT
                          </Button>
                        )}
                      </div>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
ChangeCurrencyPair.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(ChangeCurrencyPair);
