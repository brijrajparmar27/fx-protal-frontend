import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@material-ui/icons/RadioButtonUncheckedOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { NavLink } from "react-router-dom";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import ContentPage from "views/Pages/ContentPage.jsx";
import HedgeAccountingQuestions from "../Components/HedgeAccounting/HedgeAccountingQuestions";
import SampleDocument from "../Components/HedgeAccounting/SampleDocument";
import AccountingEntries from "../Components/HedgeAccounting/AccountingEntries";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

const style = {
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

class HedgeAccounting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }
  componentWillMount() {}

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <h4 style={{ display: "inline-block" }}>
            <b>Hedge Accounting</b>
          </h4>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <div>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.root}
              >
                <AppBar position="static" color="default">
                  <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="What is Hedge Accounting?" {...a11yProps(0)} />
                    <Tab label="Type of Hedge Accounting" {...a11yProps(1)} />
                    <Tab
                      label="Can we achieve Hedge Accounting and which type?"
                      {...a11yProps(2)}
                    />
                    <Tab label="Sample Documentation" {...a11yProps(3)} />
                    <Tab label="Accounting Entries" {...a11yProps(4)} />
                  </Tabs>
                </AppBar>
                <TabPanel
                  value={this.state.value}
                  index={0}
                  className={classes.tabPanelClass}
                >
                  {/* <GridItem xs={12} sm={12} md={12} lg={12}>
                    <b className={classes.subTitle}>KYC Summary</b>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12} style={{ border: '1px solid #cccccc' }}>
                    <Table
                      striped
                      tableHeaderColor='gray'
                      tableHead={this.state.directorsKYCColumn}
                      tableData={directorKycData}
                      customCellClasses={[classes.center, classes.right, classes.right]}
                      customClassesForCells={[0, 4, 5]}
                      customHeadCellClasses={[classes.center, classes.right, classes.right]}
                      customHeadClassesForCells={[0, 4, 5]}
                    /> 
                                      </GridItem>
*/}
                  <ContentPage contentPath={"local-whatishedgeaccounting"} />
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={1}
                  className={classes.tabPanelClass}
                >
                  <ContentPage contentPath={"local-typesofhedgeaccounting"} />
                </TabPanel>

                <TabPanel
                  value={this.state.value}
                  index={2}
                  className={classes.tabPanelClass}
                >
                  <HedgeAccountingQuestions />
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={3}
                  className={classes.tabPanelClass}
                >
                  <SampleDocument />
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={4}
                  className={classes.tabPanelClass}
                >
                  <AccountingEntries />
                </TabPanel>
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}
HedgeAccounting.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(HedgeAccounting);
