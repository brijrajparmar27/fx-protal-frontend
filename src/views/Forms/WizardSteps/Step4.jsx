import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
// core components

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const style = {
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
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
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
  footerText: {
    fontSize: "x-small",
    alignSelf: "flex-end",
    marginTop: 5
  },

  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      disclaimer: false,
      skipKYC: false
    };
  }
  componentDidMount = () => {
    if (this.props.apiDataFetched) {
      this.setState({ ...this.props.allStates });
    }
  };
  componentWillReceiveProps(newProps) {
    if (
      this.props.apiDataFetched != newProps.apiDataFetched &&
      newProps.apiDataFetched
    ) {
      this.setState(this.setState({ ...newProps.allStates }));
    }
  }
  sendState() {
    return this.state;
  }
  disclaimerClick = () => {
    this.setState({ disclaimer: true });
  };
  handleToggle = e => {
    this.setState({ [e.target.name]: e.target.checked });
  };
  isValidated() {
    if (!this.state.disclaimer) {
      alert("Please read disclaimer");
      return false;
    }
    if (!this.state.checked) {
      alert("Please confirm terms and conditions");
      return false;
    }
    return true;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h5 style={{ fontWeight: 500, textAlign: "center" }}>
          You are about to submit your customer application to FXGuard
        </h5>
        <p>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.checked}
                tabIndex={-1}
                onClick={e => this.handleToggle(e)}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot
                }}
                disabled={!this.state.disclaimer}
                name="checked"
              />
            }
          />
          Please make sure to review our{" "}
          <a
            onClick={this.disclaimerClick}
            href="/cms/public/pdfs/FXGuard_Customer_Terms_and_Conditions_of_Business.pdf"
            target="_blank"
          >
            commercial terms & conditions
          </a>
        </p>
        <p className={classes.footerText}>
          * View Commercial terms & conditions before selecting checkbox
        </p>

        <p>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.skipKYC}
                tabIndex={-1}
                onClick={e => this.handleToggle(e)}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot
                }}
                name="skipKYC"
              />
            }
          />
          Skip KYC
        </p>
      </div>
    );
  }
}
Step4.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(Step4);
