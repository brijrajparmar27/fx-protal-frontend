import {
  whiteColor,
  blackColor,
  hexToRgb,
  grayColor,
  infoColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const pagesStyle = theme => ({
  wrapper: {
    height: "auto",
    minHeight: "100vh",
    position: "relative",
    top: "0"
  },
  hero: {
    background:
      "linear-gradient(rgba(20,20,20, .5), rgba(20,20,20, .5)), url(/static/media/home.5b80260f.png)",
    // backgroundImage: "url(/static/media/home.5b80260f.png)",
    backgroundSize: "cover",
    content: "",
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    width: "101%",
    height: "100%",
    zIndex: -2
    //opacity: 0.4
  },
  homeTitle: {
    position: "relative",
    textAlign: "center"
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "Roboto",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center"
  },
  description: {
    color: "#FFFFFF",
    fontFamily: "Roboto",
    fontSize: 18,
    textAlign: "center",
    fontWeight: 400
  },
  homeBodyContainer: {
    height: "calc(100% - 249px)",
    minHeight: "calc(100vh - 249px)",
    backgroundColor: "white",
    paddingTop: 60,
  },
  listItemText: {
    color: "white"
  },
  featureContainer: {
    marginTop: 50
  },
  featureTitleHeader: {
    //height: 35,
    color: "#000000",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
    //marginTop: 0
  },
  socialButton: {
    width: 35,
    margin: 10
  },
  groupContainer: {
    backgroundColor: "#ffffff",
    paddingTop: 100
  },
  groupHeader: {
    textAlign: "left",
    fontSize: 30,
    marginTop: 0
  },
  groupSubtext: {
    fontFamily: "Roboto",
    fontSize: 22,
    fontWeight: 400,
    lineHeight: "30px",
    paddingBottom: 10,
    textAlign: "justify"
  },
  grouptext: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "justify"
  },
  titleImage: {
    height: 70
  },
  sideImage: {
    width: "100%"
  },
  registerDemoContainer: {
    backgroundColor: infoColor[6],
    paddingBottom: 40
  },
  planContainer: {
    paddingTop: 40,
    paddingBottom: 40
  },
  icon: {
    color: "rgba(" + hexToRgb(whiteColor) + ", 0.76)",
    margin: "10px auto 0",
    width: "100px",
    height: "100px",
    border: "1px solid " + infoColor[7],
    borderRadius: "50%",
    lineHeight: "130px",
    "& svg": {
      width: "45px",
      height: "45px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "45px",
      fontSize: "45px"
    }
  },
  cardCategory: {
    color: grayColor[7],
    marginTop: "10px"
  },
  iconRose: {
    color: infoColor[1]
  },
  iconGray: {
    color: grayColor[0]
  },
  featureContent: {
    //width: 339,
    // "@media (max-width: 992px)": {
    //   width: "100%"
    // },
    color: "#000000",
    fontFamily: "Roboto",
    fontSize: 16,
    padding: 12,
    fontWeight: 400,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "justify"
  },
  fullPage: {
    "@media (max-width: 992px)": {
      paddingTop: 125,
      width: "104%"
    },
    position: "relative",
    minHeight: 700,
    display: "flex!important",
    margin: "0",
    border: "0",
    color: blackColor,
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      minHeight: "fit-content!important"
    },
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%",
      border: "none !important"
    },
    "&:before": {
      //backgroundColor: "rgba(" + hexToRgb(blackColor) + ", 0.65)"
    },
    "&:before,&:after": {
      display: "block",
      content: '""',
      position: "relative",
      width: "auto",
      height: "100%",
      top: "0",
      left: "0",
      zIndex: "2"
    }
  }
});

export default pagesStyle;
