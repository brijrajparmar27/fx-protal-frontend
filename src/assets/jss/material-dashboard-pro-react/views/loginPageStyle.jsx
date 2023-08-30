import {
  container,
  cardTitle,
  whiteColor,
  grayColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

const loginPageStyle = theme => ({
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  loginMaxWidth: {
    maxWidth: 380
  },  
  forgotModal: {
    maxWidth: "600px !important",
    width: 600
  },
  // cardTitle: {
  //   ...cardTitle,
  //   color: whiteColor
  // },
  loginModalTitle: {
    fontWeight: 900,
    textAlign: "center"
  },
  subTitle: {
    fontWeight: 400,
    fontSize: "16px"
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
  cardSubtitle: {
    color: grayColor[0],
    fontSize: "14px",
    margin: "0 0 10px"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
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
  cardHeader: {
    marginBottom: "20px",
    zIndex: "3"
  },
  socialLine: {
    padding: "0.9375rem 0"
  },
  linkButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    display: "inline",
    margin: 0,
    padding: 0,
    "&:hover": {
      textDecoration: "none"
    },
    "&:focus": {
      textDecoration: "none"
    }
  },
  ...modalStyle(theme)
});

export default loginPageStyle;
