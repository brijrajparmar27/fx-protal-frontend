import React from "react";
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import { IconButton } from "@material-ui/core";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { formatMoney, formatDate } from "../../utils/Utils";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import statusCardStyle from "assets/jss/material-dashboard-pro-react/components/statusCardStyle.jsx";

function StatusCard({ ...props }) {
  const {
    title,
    sellCurrency,
    baseCurrency,
    eur,
    cad,
    description,
    fxRate,
    toBePaidBy,
    classes,
    heading,
    headingColor
  } = props;

  let descriptionStr = description === "" ? "  " : description;
  return (
    <div className={classes.daySelectorContainer}>
      <Card style={{ height: 110 }}>
        {heading && (
          <CardHeader
            color={headingColor}
            text
            style={{ float: "left"}}
          >
            <CardText color={headingColor} style={{ float: "left", marginTop: 0 }}>
              {heading}
            </CardText>
            <IconButton
              style={{ color: "#53ac57", float: 'left' }}
            >
              <Tooltip
                id="tooltip-totalSales"
                title="Account Statement"
                placement="top"
                classes={{ tooltip: classes.tooltipCalculator }}
              >
                <ListAltIcon />
              </Tooltip>
            </IconButton>
          </CardHeader>
        )}
        <CardBody
          className={classes.cardBody}
          style={{ marginTop: -20, top: -35 }}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} lg={3} className={classes.title}>
              {title}
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={9}>
              <GridContainer justify="flex-end" style={{ textAlign: "right", paddingTop:'20px' }}>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={classes.eur}
                >
                  {eur === "" ? " " : baseCurrency + " " + formatMoney(eur)}
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
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ textAlign: "left" }}
            >
              <div className={classes.description}>{descriptionStr}</div>
              <hr className={classes.hr} />
              {fxRate && (
                <span className={classes.footer} style={{ float: "left" }}>
                  Current FX rate: {fxRate.toFixed(4)}
                </span>
              )}
              {toBePaidBy && (
                <span className={classes.footer} style={{ float: "right" }}>
                  to be paid by: {formatDate(toBePaidBy)}
                </span>
              )}
            </GridItem>
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
  description: PropTypes.string,
  fxRate: PropTypes.string,
  toBePaidBy: PropTypes.string,
  heading: PropTypes.string,
  headingColor: PropTypes.string
};

export default withStyles(statusCardStyle)(StatusCard);
