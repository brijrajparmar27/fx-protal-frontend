import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";
import FormHelperText from "@material-ui/core/FormHelperText";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

// @material-ui/icons
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { validate } from "../../utils/Validator";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
const styles = theme => ({
  selectDropDown: {
    paddingTop: 0,
    color: "white",
    margin: 5,
    marginLeft: 10
  },
  filledSelect: {
    color: "white !important"
  },
  selectMenu: {
    margin: 5
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

class EditUsers extends React.Component {
  error = {
    nameErrorMsg: {
      required: "Company name is required",
      range: "Company name should be 1 to 100 characters"
    },
    emailAddressErrorMsg: {
      required: "Last name is required",
      range: "First name should be 1 to 100 characters"
    },
    cityErrorMsg: {
      required: "City is required"
    },
    postalCodeErrorMsg: {
      required: "Postal code is required"
    },
    countryErrorMsg: {
      required: "Country is required"
    }
  };

  initialState = {};

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered

    this.initialState = {
      checkedA: true,
      cardAnimaton: "cardHidden",
      showModal: false,
      name: "",
      nameState: "",
      namePristine: true,
      nameErrorMsg: [],
      emailAddress: "",
      emailAddressState: "",
      emailAddressPristine: true,
      emailAddressErrorMsg: [],
      phoneNumber: "",
      phoneNumberState: "",
      phoneNumberPristine: true,
      phoneNumberErrorMsg: [],
      inviteUserRole: ""
    };

    this.state = this.initialState;
  }

  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };

  isValidated = () => {
    if (
      this.state.nameState === "success" &&
      this.state.emailAddressState === "success"
    ) {
      return true;
    } else {
      if (this.state.nameState !== "success") {
        this.setState({ nameState: "error" });
      }
      if (this.state.emailAddressState !== "success") {
        this.setState({ emailAddressState: "error" });
      }
    }
    return false;
  };

  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }

  handleInviteUserRole = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  saveUserRole = () => {
    if (this.isValidated()) {
      this.props.saveUserRole({
        email: this.state.emailAddress,
        role: this.state.inviteUserRole
      });
      this.props.handleClose();
    }
  };

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
      let user = {};
      if (props.showModal) {
        user = EditUsers.initialState;
        user = {
          ...user,
          ...props.userData,
          nameState: "success",
          emailAddressState: "success"
        };
      }

      return {
        showModal: props.showModal,
        ...user
      };
    }
    return null;
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={cx(classes.container)}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot
          }}
          maxWidth="md"
          open={this.props.showModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.props.handleClose()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
            style={{ textAlign: "left" }}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.props.handleClose()}
            >
              <CloseIcon />
            </IconButton>
            <h3 style={{ textAlign: "left", fontSize: 20, display: "inline" }}>
              Edit User
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.addDirectorsMaxWidth)}
          >
            <form className={classes.form}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={5} lg={5}>
                  <CustomInput
                    success={this.state.nameState === "success"}
                    error={this.state.nameState === "error"}
                    helpText={
                      this.state.nameState === "error" &&
                      this.state.nameErrorMsg[0]
                    }
                    labelText="Name*"
                    id="eu_name"
                    // inputProps={{
                    //   value: this.state.firstName,
                    //   onChange: this.handleChange
                    // }}
                    inputProps={{
                      value: this.state.name,
                      disabled: true,
                      onChange: event => this.handleChange("name", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ namePristine: false });
                        this.change(event, "name", [
                          { type: "required" },
                          {
                            type: "length",
                            params: {
                              min: 1,
                              max: 100
                            }
                          }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.namePristine) {
                          this.setState({ namePristine: false });
                          this.change(event, "name", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 100
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={7} lg={7}>
                  <CustomInput
                    success={this.state.emailAddressState === "success"}
                    error={this.state.emailAddressState === "error"}
                    helpText={
                      this.state.emailAddressState === "error" &&
                      this.state.emailAddressErrorMsg[0]
                    }
                    labelText="Email*"
                    id="eu_emailAddress"
                    inputProps={{
                      value: this.state.emailAddress,
                      disabled: true,
                      onChange: event =>
                        this.handleChange("emailAddress", event)
                    }}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ emailAddressPristine: false });
                        this.change(event, "emailAddress", [
                          { type: "required" },
                          {
                            type: "length",
                            params: {
                              min: 1,
                              max: 100
                            }
                          }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.emailAddressPristine) {
                          this.setState({ emailAddressPristine: false });
                          this.change(event, "emailAddress", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 100
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <FormControl
                    fullWidth
                    className={classes.filledSelect}
                    style={{ marginTop: -25 }}
                  >
                    <FormHelperText className={classes.selectFormHelperText}>
                      Role
                    </FormHelperText>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state.inviteUserRole}
                      onChange={this.handleInviteUserRole}
                      inputProps={{
                        name: "inviteUserRole",
                        id: "inviteUserRole"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose Role
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="role-customer-user-manager"
                      >
                        Customer Manager
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="role-customer-user"
                      >
                        Customer User
                      </MenuItem>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <div
                    className={classes.center}
                    style={{ textAlign: "right" }}
                  >
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      onClick={this.saveUserRole}
                    >
                      SAVE
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </form>
            {/* <GridContainer justify="center"> */}
            {/* <Card>
              <CardHeader color="warning" text>
                <CardText color="warning">
                  <Work className={classes.listItemIcon} />
                </CardText>
              </CardHeader>
              <CardBody style={{ paddingLeft: 100, top: -60 }}>

              </CardBody>
            </Card> */}
            {/* </GridContainer> */}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

EditUsers.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  userData: PropTypes.object,
  saveUserRole: PropTypes.func,
  handleClose: PropTypes.func
};

export default withRouter(withStyles(styles)(EditUsers));
