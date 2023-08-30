import React from "react";
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { formatMoney, formatDate } from "../../utils/Utils";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import statusCardStyle from "assets/jss/material-dashboard-pro-react/components/statusCardStyle.jsx";

function StatusCard({ ...props }) {
  const {
    title,
    eur,
    cad,
    fxRate,
    toBePaidBy,
    toBeRecievedBy,
    classes,
    baseCurrency,
    sellCurrency
  } = props;

  // result = dates.map(date => {
  //   const dayOfWeek = format(date, "eee");
  //   const disabled = dayOfWeek === "Sat" || dayOfWeek === "Sun";

  //   var containerClasses = cx(classes.daySelector, {
  //     [classes.highlight]: selectedDate == date
  //   });

  //   return (
  //     <div
  //       className={containerClasses}
  //       disabled={disabled}
  //       onClick={() => !disabled && handleSelectedDate(date)}
  //     >
  //       <div className={classes.dayOfWeek}>{dayOfWeek}</div>
  //       <div className={classes.date}>{date.getDate()}</div>
  //       <div className={classes.month}>{format(date, "MMM")}</div>
  //     </div>
  //   );
  // });
  return (
    <div className={classes.daySelectorContainer}>
      <Card className={classes.card}>
        <CardBody className={classes.cardBody}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={5} className={classes.title}>
              {title}
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={7}>
              <GridContainer justify="flex-end" style={{ textAlign: "right" }}>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={classes.eur}
                >
                  {eur ? baseCurrency + " " + formatMoney(eur) : ""}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={classes.cad}
                >
                  {formatMoney(cad) + " " + sellCurrency}
                </GridItem>
              </GridContainer>
            </GridItem>
            {(fxRate || toBePaidBy || toBeRecievedBy) && (
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <hr className={classes.hr} />
                {fxRate && (
                  <span className={classes.footer}>
                    Current FX rate: {fxRate}
                  </span>
                )}
                {toBePaidBy && (
                  <span className={classes.footer} style={{ float: "right" }}>
                    to pay by: {formatDate(toBePaidBy)}
                  </span>
                )}
                {toBeRecievedBy && (
                  <span className={classes.footer} style={{ float: "right" }}>
                    to receive by: {formatDate(toBeRecievedBy)}
                  </span>
                )}
              </GridItem>
            )}
          </GridContainer>
        </CardBody>
      </Card>
    </div>
  );
}

StatusCard.propTypes = {
  classes: PropTypes.object.isRequired,
  textAlign: PropTypes.oneOf(["right", "left", "center"]),
  title: PropTypes.string,
  sellCurrency: PropTypes.string,
  baseCurrency: PropTypes.string,
  eur: PropTypes.string,
  cad: PropTypes.string,
  fxRate: PropTypes.string,
  toBePaidBy: PropTypes.string,
  toBeRecievedBy: PropTypes.string
};

export default withStyles(statusCardStyle)(StatusCard);
