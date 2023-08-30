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
  customDateControlClasses: {
    paddingTop: 9
  },
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important",
    top: 10
  },
  input: {
    fontSize: 12,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  select: {
    paddingBottom: 18,
    marginBottom: -12,
    fontSize: 14
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
    fontSize: "16px",
    float: "left",
    paddingBottom: 20
  },
  center: {
    textAlign: "center",
    margin: 20,
    marginTop: 40
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
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
  uploadContainer: {
    display: "flex"
  },
  ...modalStyle(theme)
});

export default loginPageStyle;
