import React from "react";
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import { formatMoney } from "../../utils/Utils";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import walletStatusStyle from "assets/jss/material-dashboard-pro-react/components/walletStatusStyle.jsx";

function WalletStatus({ ...props }) {
  const {
    title,
    dealRate,
    cad,
    fxRate,
    toBePaidBy,
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
  const sellCurrencyCode = sellCurrency ? sellCurrency : "CAD";
  const baseCurrencyCode = baseCurrency ? baseCurrency : "EUR";
  return (
    <div className={classes.daySelectorContainer}>
      <Card>
        <CardBody className={classes.cardBody}>
          <GridContainer justify="center">
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ textAlign: "left" }}
              className={classes.title}
            >
              {title}
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12} className={classes.cad}>
              <GridContainer justify="flex-end" style={{ paddingRight: 10 }}>
                {formatMoney(cad) + " " + sellCurrencyCode}
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <hr className={classes.hr} />
              {fxRate && (
                <span className={classes.footer} style={{ float: "left" }}>
                  FX rate: {fxRate}
                </span>
              )}
              {toBePaidBy && (
                <span className={classes.footer} style={{ float: "right" }}>
                  {baseCurrencyCode}: {dealRate}
                </span>
              )}
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </div>
  );
}

WalletStatus.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  dealRate: PropTypes.string,
  cad: PropTypes.string,
  fxRate: PropTypes.string,
  toBePaidBy: PropTypes.string,
  baseCurrency: PropTypes.string,
  sellCurrency: PropTypes.string
};

export default withStyles(walletStatusStyle)(WalletStatus);
