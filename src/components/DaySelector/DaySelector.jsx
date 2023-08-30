import React from "react";
import { format } from "date-fns";
import cx from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import daySelectorStyle from "assets/jss/material-dashboard-pro-react/components/daySelectorStyle.jsx";

function DaySelector({ ...props }) {
  const { dates, handleSelectedDate, selectedDate, classes } = props;

  let result = null;
  result = dates.map(date => {
    const dayOfWeek = format(date, "eee");
    const disabled = dayOfWeek === "Sat" || dayOfWeek === "Sun";

    var containerClasses = cx(classes.daySelector, {
      [classes.highlight]: selectedDate.getTime() === date.getTime()
    });

    return (
      <div
        className={containerClasses}
        disabled={disabled}
        // onClick={() => !disabled && handleSelectedDate(date)}
      >
        <div className={classes.dayOfWeek}>{dayOfWeek}</div>
        <div className={classes.date}>{date.getDate()}</div>
        <div className={classes.month}>{format(date, "MMM")}</div>
      </div>
    );
  });
  return (
    <div className={classes.daySelectorContainer}>
      <div className={classes.settlementDate}>Settlement Date</div>
      <div className={classes.body}>{result}</div>
      {/* <div className={classes.footer}>
        {"Your Settlement Date is " + selectedDate.toString().slice(0, 15)}
      </div> */}
    </div>
  );
}

DaySelector.propTypes = {
  classes: PropTypes.object.isRequired,
  dates: PropTypes.array,
  textAlign: PropTypes.oneOf(["right", "left", "center"])
};

export default withStyles(daySelectorStyle)(DaySelector);
