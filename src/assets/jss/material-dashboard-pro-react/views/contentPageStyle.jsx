const pagesStyle = () => ({
  wrapper: {
    height: "auto",
    minHeight: "100vh",
    position: "relative",
    top: "0"
  },
  container: {
    //paddingBottom: 60
  },
  privacyPolicyListContainer: {
    fontSize: 20,
    fontWeight: "bold"
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
  featureTitleHeader: {
    //height: 35,
    color: "#3c4858",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
    //marginTop: 0
  },
  groupContainer: {
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingBottom: 60
  },
  groupHeader: {
    textAlign: "left",
    fontSize: 30,
    marginTop: 0
  },
  groupSubtext: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "30px",
    paddingBottom: 10,
    textAlign: "justify"
  },
  grouptext: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: "justify"
  },
  table: {
    borderCollapse: "collapse"
  },
  td: {
    border: "1px solid #000"
  },
  tableTextHeader: {
    margin: "10px 20px",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: 400
  },
  tableText: {
    margin: "10px 20px",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: 300
  },
  privacyPolicyList: {
    fontWeight: 300
  },
  ulStyle: {
    listStyleType: "disc"
  },
  mb3: {
    marginBottom: 30
  },
  mb5: {
    marginBottom: 50
  }
});

export default pagesStyle;
