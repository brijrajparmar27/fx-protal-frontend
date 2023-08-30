import { grayColor } from "assets/jss/material-dashboard-pro-react.jsx";

const statusCardStyle = {
  daySelectorContainer: {
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    height: 120
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
    fontSize: 18,
    fontWeight: 400
  },
  eur: {
    color: "#999999",
    fontSize: 12
  },
  cad: {
    fontSize: 24,
    paddingRight: 10,
    fontWeight: 100
  },
  hr: {
    marginBottom: 5
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
    fontSize: "x-small",
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
  }
};

export default statusCardStyle;
