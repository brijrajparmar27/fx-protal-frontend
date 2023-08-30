import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import BlogFileUploadPage from "./BlogFileUploadPage";
import BlogListAdmin from "./BlogListAdmin";
import BlogHtmlFileUpload from "./BlogHtmlFileUpload";

const style = {
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
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
  value: PropTypes.any.isRequired,
};

class BlogPageAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
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
            <b>Blogs</b>
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
                {/* <AppBar position="static" color="default">
                  <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="Blog List" {...a11yProps(0)} />
                    <Tab label="Add New Blog" {...a11yProps(1)} />
                    <Tab label="Upload HTML File" {...a11yProps(2)} />
                  </Tabs>
                </AppBar> */}
                <TabPanel
                  value={this.state.value}
                  index={0}
                  className={classes.tabPanelClass}
                >
                  {/* <BlogHtmlFileUpload /> */}
                  <hr style={{ border: "1px solid black" }} />
                  <BlogListAdmin />
                </TabPanel>

                {/* <TabPanel
                  value={this.state.value}
                  index={1}
                  className={classes.tabPanelClass}
                >
                  <BlogFileUploadPage />
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={2}
                  className={classes.tabPanelClass}
                >
                  <BlogHtmlFileUpload />
                </TabPanel> */}
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}
BlogPageAdmin.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(style)(BlogPageAdmin);
