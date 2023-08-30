import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

const style = {
  container: {
    backgroundColor: "#ffffff",
    padding: "30px",
    height: 550
  }
};

class MarketRatesCalendar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <iframe
          scrolling="no"
          allowTransparency="true"
          frameBorder="0"
          width="100%"
          height="100%"
          src="https://www.tradays.com/en/economic-calendar/widget?mode=2&amp;utm_source="
        />
      </div>
    );
  }
}
MarketRatesCalendar.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(MarketRatesCalendar);
