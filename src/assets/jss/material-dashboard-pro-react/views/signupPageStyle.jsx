import {
  container,
  cardTitle,
  blackColor,
  hexToRgb,
  grayColor
} from "assets/jss/material-dashboard-pro-react.jsx";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const registerPageStyle = {
  ...customCheckboxRadioSwitch,
  cardTitle: {
    ...cardTitle,
    textAlign: "center"
  },
  container: {
    ...container,
    position: "relative",
    zIndex: "3"
    // paddingTop: "23vh"
  },
  subTitle: {
    float: "left",
    marginLeft: 40,
    marginTop: 50
  },
  textIcon: {
    paddingRight: "0px !important",
    paddingTop: "30px !important",
    marginRight: 10
  },
  customText: {
    paddingLeft: "5px !important"
  },
  cardSignup: {
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 6px 30px 5px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 8px 10px -5px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
    marginBottom: "100px",
    padding: "40px 0px",
    marginTop: "15vh"
  },
  signupModalTitle: {
    fontWeight: 900,
    textAlign: "center"
  },
  buttonContainer: {
    padding: "20px !important",
    paddingTop: "40px !important"
  },
  termsLink: {
    color: "#40A8BD"
  },
  termsText: {
    color: "darkslategrey"
  },
  alignPadding: {
    paddingLeft: "20px !important",
    paddingRight: "0px !important"
  },
  alignAddressPadding: {
    paddingLeft: "30px !important",
    paddingRight: "0px !important"
  },
  center: {
    textAlign: "center"
  },
  right: {
    textAlign: "right"
  },
  left: {
    textAlign: "left"
  },
  form: {
    padding: "0",
    position: "relative"
  },
  socialTitle: {
    fontSize: "18px"
  },
  inputAdornment: {
    marginRight: "18px",
    position: "relative"
  },
  inputAdornmentIcon: {
    color: grayColor[6]
  },
  customFormControlClasses: {
    margin: "0 12px"
  },
  checkboxLabelControl: {
    margin: "0"
  },
  checkboxLabel: {
    marginLeft: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)"
  }
};

export default registerPageStyle;
