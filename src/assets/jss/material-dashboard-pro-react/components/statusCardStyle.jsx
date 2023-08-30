import {
  grayColor,
  whiteColor,
  hexToRgb,
  blackColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const statusCardStyle = {
  daySelectorContainer: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column"
    // height: 120
  },
  card: {
    marginBottom: 0
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
    fontSize: 16,
    fontWeight: 400
  },
  eur: {
    color: "#999999",
    fontSize: 12,
    minHeight: 20
  },
  cad: {
    color: "#E0A611",
    fontSize: 18
  },
  hr: {
    margin: "0px 0px 5px 0px"
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
    minHeight: 10, // unicode zero width space character
    fontSize: 12
  },
  iconButton: {
    padding: "10px 15px",
    minWidth: "200px",
    color: whiteColor,
    lineHeight: "1.7em",
    background: "rgba(" + hexToRgb(grayColor[6]) + ",0.9)",
    border: "none",
    borderRadius: "3px",
    opacity: "1!important",
    boxShadow:
      "0 8px 10px 1px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 3px 14px 2px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 5px 5px -3px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
    maxWidth: "400px",
    textAlign: "center",
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "400",
    textShadow: "none",
    textTransform: "none",
    letterSpacing: "normal",
    wordBreak: "normal",
    wordSpacing: "normal",
    wordWrap: "normal",
    whiteSpace: "normal",
    lineBreak: "auto"
  }
};

export default statusCardStyle;
