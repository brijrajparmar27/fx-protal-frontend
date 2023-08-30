import React from "react";
import { formatDate, convertUTCDateToLocalDate } from "../utils/Utils";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

const styles = {
  container: {
    height: 20,
    width: "100%",
    backgroundColor: "#153E6D"
  },
  label: {
    color: "white",
    float: "right",
    paddingRight: 30
  }
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastLoginTime: sessionStorage.getItem("lastLoginTime")
    };
  }

  getLastLoggedInDateTime = lastLoginTime => {
    const timeArr = lastLoginTime.split("T");
    let time = "";
    if (timeArr.length > 1) {
      time = timeArr[1].split(".")[0];
    }
    let utcDate = new Date(lastLoginTime);
    let newDate = convertUTCDateToLocalDate(utcDate);

    return (
      formatDate(newDate) +
      " " +
      (newDate.getHours() < 10 ? "0" : "") +
      newDate.getHours() +
      ":" +
      (newDate.getMinutes() < 10 ? "0" : "") +
      newDate.getMinutes() +
      ":" +
      (newDate.getSeconds() < 10 ? "0" : "") +
      newDate.getSeconds()
    );
    // return formatDate(lastLoginTime) + " " + time;
  };

  render() {
    const { classes, userInfo } = this.props;
    const { lastLoginTime } = this.state;
    return (
      <div className={classes.container}>
        {lastLoginTime && lastLoginTime != "undefined" && (
          <label className={classes.label}>
            Last Logged In at {this.getLastLoggedInDateTime(lastLoginTime)}
          </label>
        )}
      </div>
    );
  }
}
Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
