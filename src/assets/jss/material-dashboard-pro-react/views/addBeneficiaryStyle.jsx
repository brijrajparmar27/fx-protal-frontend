import {
  container,
  cardTitle,
  whiteColor,
  blackColor,
  hexToRgb,
  grayColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const addBeneficiaryStyle = theme => ({
  ...customCheckboxRadioSwitch,
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  inputUpload: {
    display: "none"
  },
  modal: {
    //width: 900
    //maxWidth: 900
  },
  addDirectorsMaxWidth: {
    //maxWidth: 600
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  // cardTitle: {
  //   ...cardTitle,
  //   color: whiteColor
  // },
  modalTitle: {
    textAlign: "left",
    fontSize: 20
  },
  selectFormControl: {
    [theme.breakpoints.up("lg")]: {
      marginTop: 10
    }
  },
  subTitle: {
    fontWeight: 400,
    fontSize: "16px",
    float: "left",
    paddingBottom: 20
  },
  center: {
    textAlign: "center",
    margin: 20,
    marginTop: 40
  },
  cardTitle: {
    ...cardTitle,
    marginTop: "0",
    marginBottom: "3px",
    color: grayColor[2],
    fontSize: "18px"
  },
  cardHeader: {
    zIndex: "3",
    marginBottom: "20px"
  },
  cardSubtitle: {
    color: grayColor[0],
    fontSize: "14px",
    margin: "0 0 10px"
  },
  textCenter: {
    textAlign: "center"
  },
  justifyContentCenter: {
    justifyContent: "center !important"
  },
  customButtonClass: {
    "&,&:focus,&:hover": {
      color: whiteColor
    },
    marginLeft: "5px",
    marginRight: "5px"
  },
  inputAdornment: {
    marginRight: "18px"
  },
  inputAdornmentIcon: {
    color: grayColor[6]
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  socialLine: {
    padding: "0.9375rem 0"
  },
  textLeft: {
    textAlgin: "left",
    float: "left"
  },
  uploadLabel: {
    alignSelf: "center",
    paddingRight: 20
  },
  graphFooter: {
    fontSize: "x-small",
    alignSelf: "flex-start",
    margin: "5px 5px"
  },
  uploadContainer: {
    display: "flex"
  },
  checkboxLabelControl: {
    margin: "0"
  },
  checkboxLabel: {
    marginLeft: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)"
  },
  ...modalStyle(theme)
});

export default addBeneficiaryStyle;
