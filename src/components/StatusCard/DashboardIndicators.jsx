import React from "react";
import PropTypes from "prop-types";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";

import { grayColor } from "assets/jss/material-dashboard-pro-react.jsx";

const DashboardIndicatorsStyle = {
  daySelectorContainer: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column"
    // height: 120
  },
  indicatorButton: {
    // width: 190,
    marginTop: 30,
    padding: 0
  },
  card: {
    marginTop: 0,
    marginBottom: 0,
    height: 100
  },
  settlementDate: {
    alignSelf: "flex-start",
    fontSize: "smaller",
    marginBottom: 5
  },
  cardBody: {
    paddingBottom: 5
  },
  title: {
    color: "#999999",
    fontSize: "0.8vw",
    minHeight: 20,
    textAlign: "right",
    textTransform: "capitalize"
  },
  cad: {
    color: "#E0A611",
    fontSize: 20,
    textAlign: "right"
  },
  hr: {
    margin: "5px 0px"
  },
  body: {
    display: "flex",
    justifyContent: "center"
  },
  daySelector: {
    width: 60,
    height: 70,
    boxShadow: "0px 0px 3px #D2D2D2",
    color: grayColor[2],
    borderRadius: 3,
    cursor: "pointer",
    "&[disabled]": {
      color: "grey",
      cursor: "default"
    }
  },
  footer: {
    fontSize: 16,
    alignSelf: "flex-end"
  },
  highlight: {
    backgroundColor: "#63B649",
    color: "white"
  },
  rightTextAlign: {
    textAlign: "right"
  },
  leftTextAlign: {
    textAlign: "left"
  },
  centerTextAlign: {
    textAlign: "center"
  },
  dayOfWeek: {
    marginTop: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "x-small"
  },
  date: {
    fontWeight: 500
  },
  month: {
    fontWeight: "400",
    fontSize: "x-small"
  },
  description: {
    minHeight: 18, // unicode zero width space character
    fontSize: 12
  }
};

function DashboardIndicators({ ...props }) {
  const {
    title,
    icon,
    count,
    onClick,
    toggleName,
    headingColor,
    classes
  } = props;

  const getHeaderIcon = () => {
    switch (icon) {
      case "people":
        return <PeopleIcon className={classes.listItemIcon} />;
      case "bar":
        return <BarChartIcon className={classes.listItemIcon} />;
      default:
        return null;
    }
  };
  // const [checkedA, setCheckedA] = useState(false);

  return (
    <div className={classes.daySelectorContainer}>
      <Button
        aria-controls="report-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={onClick}
        size="lg"
        className={classes.indicatorButton}
      >
        <Card className={classes.card}>
          <CardHeader
            color={headingColor}
            text
            style={{ float: "left", marginTop: 10, marginLeft: "1vw" }}
          >
            <CardText color={headingColor} style={{ float: "left" }}>
              {getHeaderIcon()}
            </CardText>
          </CardHeader>
          <CardBody
            className={classes.cardBody}
            style={{ marginTop: -20, top: -25 }}
          >
            <GridContainer justify="center">
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.title}
              >
                {title}
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} className={classes.cad}>
                +{count}
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ textAlign: "left" }}
              >
                <hr className={classes.hr} />
                <span className={classes.title} style={{ float: "left" }}>
                  {/* <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={checkedA}
                        onChange={onToggleSwitch("checkedA")}
                        value="checkedA"
                        classes={{
                          switchBase: classes.switchBase,
                          checked: classes.switchChecked,
                          icon: classes.switchIcon,
                          iconChecked: classes.switchIconChecked,
                          bar: classes.switchBar
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      label: classes.title
                    }}
                    label={toggleName}
                  /> */}
                  <QueryBuilderIcon />
                  {toggleName}
                </span>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </Button>
    </div>
  );
}

DashboardIndicators.propTypes = {
  classes: PropTypes.object.isRequired,
  textAlign: PropTypes.oneOf(["right", "left", "center"]),
  title: PropTypes.string,
  icon: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func,
  toggleName: PropTypes.string,
  headingColor: PropTypes.string
};

export default withStyles(DashboardIndicatorsStyle)(DashboardIndicators);
