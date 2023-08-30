import {
  container,
  cardTitle,
  blackColor,
  hexToRgb,
  grayColor,
  dangerColor,
  successColor
} from "assets/jss/material-dashboard-pro-react.jsx";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const registerPageStyle = {
  ...customCheckboxRadioSwitch,
  cardTitle: {
    ...cardTitle,
    textAlign: "center"
  },
  modalCloseButton: {
    float: "right"
  },
  labelRootError: {
    color: dangerColor[0] + " !important"
  },
  labelRootSuccess: {
    color: successColor[0] + " !important"
  },
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA"
    //top: 7
  },
  select: {
    paddingBottom: 10,
    fontSize: 14
  },
  selectFormControl: {
    marginTop: 5
  },
  container: {
    ...container,
    position: "relative",
    zIndex: "3",
    marginTop: 20,
    fontWeight: 400,
    fontSize: 16
    // paddingTop: "23vh"
  },
  subTitle: {
    float: "left",
    marginLeft: 40,
    marginTop: 50
  },
  textIcon: {
    paddingRight: "0px !important"
  },
  customText: {
    paddingLeft: "5px !important"
  },
  cardContactUs: {
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
    marginTop: 60
  },
  modalTitle: {
    fontStyle: "normal"
  },
  signupModalTitle: {
    fontWeight: 900,
    marginBottom: 20,
    marginTop: 40
    //textAlign: "center"
  },
  buttonContainer: {
    padding: "40px 20px 20px 0px !important",
    marginLeft: -20
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
    //padding: "0 120px",
    position: "relative",
    marginTop: 40,
    marginBottom: 40
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
  marginLeft: {
    marginLeft: 5
  },
  checkboxLabel: {
    marginLeft: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)"
  }
};

export default registerPageStyle;
