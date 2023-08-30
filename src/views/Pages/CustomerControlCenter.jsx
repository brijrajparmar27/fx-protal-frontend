import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@material-ui/icons/RadioButtonUncheckedOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Search from "@material-ui/icons/Search";

import { NavLink } from "react-router-dom";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import { blackColor } from "assets/jss/material-dashboard-pro-react.jsx";

const style = {
  ellipses: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: blackColor,
    display: "inline-block",
    width: 310,
    verticalAlign: "middle",
    fontSize: "1.2em",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
    fontWeight: 300,
    lineHeight: 1.42857143
  },
  search: {
    margin: "0",
    paddingTop: "7px",
    paddingBottom: "7px"
  },
  searchInput: {
    paddingTop: "2px"
  },
  top: {
    zIndex: "4"
  },
  searchIcon: {
    width: "17px",
    zIndex: "4"
  },
  cardTitleWhite: {
    fontSize: 14
  },
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  },
  gridIcon: {
    textAlign: "right",
    zIndex: "5",
    padding: "0px 0px !important"
  },
  icon: {
    //marginTop: "-3px",
    cursor: "pointer",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    display: "inline-block",
    color: "black"
  },
  paymentIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  editIcon: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 3
  },
  closeIcon: {
    backgroundColor: "#F44336",
    color: "white",
    padding: 3
  },
  addIcon: {
    marginTop: 25,
    height: 35,
    width: 35,
    borderRadius: 6,
    backgroundColor: "grey"
  },
  clientsCardLabel: {
    color: "#AAAAAA !important",
    fontSize: 14,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
    fontWeight: 400,
    lineHeight: 1.42857
  },
  kyc_label: {
    color: "#95c440"
  },
  kyc_ellipses: {
    marginLeft: 10,
    color: "#95c440",
    fontSize: 15,
    fontWeight: 400
  },

  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class CustomerControlCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerType: "RISK-CUSTOMER",
      transactionClientList: [],
      riskClientList: [],
      filterClientList: []
    };
  }
  componentDidMount() {
    this.getCustomerList();
    this.getRiskCustomerList();
  }
  getCustomerList = async () => {
    const res = await apiHandler({
      url: endpoint.ADMIN_CUSTOMER + "?query=1111",
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      const clients = res.data;
      console.log('CUSTOMER DATA - ', res.data);
      this.setState({
        transactionClientList: clients,
      });
    }
  };
  getRiskCustomerList = async () => {
    const res = await apiHandler({
      url: endpoint.RISK_ADMIN_USERS_LIST,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        this.setState({
          callInProgress: false,
          noticeModal: true,
          noticeModalHeader: "Error",
          noticeModalErrMsg: res.data.userDesc
        });
      }
    } else {
      const clients = res.data;
      console.log('RISK USER LIST - ', res.data);
      this.setState({
        riskClientList: clients.users,
        filterClientList: clients.users
      });
    }
  };
  sendState() {
    return this.state;
  }
  searchClientList = (name, event) => {
    let clients = [];
    let fullList = this.state.customerType === "RISK-CUSTOMER" ? this.state.riskClientList : this.state.transactionClientList;
    clients = fullList.filter(client => {
      const name = client.customerName;
      const index = name
        .toLowerCase()
        .indexOf(event.target.value.toLowerCase());
      if (index !== -1) return true;
      else return false;
    });
    this.setState({
      filterClientList: clients
    });
  };
  getStatusButton = status => {
    status = status ? status : "ACTIVE";
    if (
      status.toLowerCase() === "approved" ||
      status.toLowerCase() === "active"
    ) {
      return (
        <Button
          size="sm"
          style={{
            fontSize: 20,
            borderRadius: 10,
            padding: "0.40625rem 0.7rem",
            backgroundColor: "#95c440"
          }}
        >
          {status} <CheckCircleOutlineOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    } else if (status && status.toLowerCase() === "pending") {
      return (
        <Button
          size="sm"
          style={{
            fontSize: 20,
            borderRadius: 10,
            padding: "0.40625rem 0.7rem",
            backgroundColor: "rgb(223,165,43)"
          }}
        >
          {status}{" "}
          <RadioButtonUncheckedOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    } else {
      return (
        <Button
          color="danger"
          size="sm"
          style={{
            fontSize: 20,
            borderRadius: 10,
            padding: "0.40625rem 0.7rem"
          }}
        >
          {status} <CancelOutlinedIcon style={{ marginLeft: 10 }} />
        </Button>
      );
    }
  };
  handleCustomerTypeOption = event => {
    if (this.state.customerType === "RISK-CUSTOMER") {
      this.setState({
        customerType: event.target.value,
        filterClientList: this.state.transactionClientList
      });
    } else {
      this.setState({
        customerType: event.target.value,
        filterClientList: this.state.riskClientList
      });  
    }
  };
  render() {
    const { classes } = this.props;
    const searchButton = classes.top + " " + classes.searchButton;
    return (
      <GridContainer justify="center">
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <h4 style={{ display: "inline-block" }}>
            <b>Customer Control Center</b>
          </h4>
          <div style={{ display: "inline-block", marginLeft: 20 }}>
            <FormControl
              fullWidth
              className={classes.filledSelect}
              style={{marginTop: '-11px', minWidth: 150}}
            >
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                value={this.state.customerType}
                onChange={this.handleCustomerTypeOption}
                inputProps={{
                  name: "customerType",
                  id: "customerType",
                  classes: {
                    icon: classes.white,
                    root: classes.selectDropDown
                  }
                }}
              >
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem
                  }}
                  value={"RISK-CUSTOMER"}
                  key={"risk-customer"}
                >
                  Risk
                </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem
                  }}
                  value={"TRANSACTION-CUSTOMER"}
                  key={"transaction-customer"}
                >
                  Transaction
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: "inline-block", float: "right" }}>
            <CustomInput
              formControlProps={{
                className: classes.top + " " + classes.search
              }}
              inputProps={{
                placeholder: "Search",
                inputProps: {
                  "aria-label": "Search",
                  className: classes.searchInput,
                  onChange: event => this.searchClientList("search", event)
                }
              }}
            />
            <Button
              color="white"
              aria-label="edit"
              justIcon
              round
              className={searchButton}
            >
              <Search
                className={classes.headerLinksSvg + " " + classes.searchIcon}
              />
            </Button>
          </div>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={11}>
          <div>
            {this.state.customerType === "RISK-CUSTOMER" ? (
            <GridContainer>
            {this.state.filterClientList.map((client, index) => (
              <GridItem xs={12} sm={12} md={4} lg={4} key={index}>
                <Card className={classes.clientsCardLabel}>
                  <CardBody>
                    <GridContainer
                      direction="row"
                      style={{
                        borderBottom: "1px solid #d2d2d2",
                        paddingBottom: 10
                      }}
                    >
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          textAlign: "left",
                          marginTop: 15
                        }}
                      >
                        <GridContainer direction="row">
                          <GridItem lg={8}>
                            <span>Client Name</span>
                          </GridItem>
                        </GridContainer>
                        <GridContainer direction="row">
                          <GridItem lg={8}>
                            <span className={classes.ellipses}>
                              {client.name}
                            </span>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                          textAlign: "left",
                          marginTop: 15
                        }}
                      >
                        <GridContainer direction="row">
                          <GridItem lg={8}>
                            <span>Client Email</span>
                          </GridItem>
                        </GridContainer>
                        <GridContainer direction="row">
                          <GridItem lg={8}>
                            <span className={classes.ellipses}>
                              {client.email}
                            </span>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        style={{
                          textAlign: "left",
                          marginTop: 15
                        }}
                      >
                        <GridContainer direction="row">
                          <GridItem lg={12} style={{}}>
                            <span>Client Status</span>
                          </GridItem>
                        </GridContainer>
                        <GridContainer direction="row">
                          <GridItem lg={12}>
                            <span className={classes.ellipses}>
                              {this.getStatusButton(client.status)}
                            </span>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                    </GridContainer>
                    <GridContainer style={{ marginTop: 5 }}>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        style={{
                          textAlign: "left"
                        }}
                      >
                        <NavLink
                          to={
                            "/auth/admin/impersonate-login/" +
                            encodeURIComponent(client.email)
                          }
                          className={classes.navLink}
                        >
                          <Button
                            size="lg"
                            style={{
                              padding: 5,
                              width: "100%",
                              backgroundColor: "rgb(236, 246, 248)",
                              color: "grey",
                              fontSize: 13
                            }}
                          >
                            <h5>VIEW AS CLIENT</h5>
                          </Button>
                        </NavLink>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        style={{
                          textAlign: "left"
                        }}
                      >
                        <NavLink
                          to={
                            `/auth/admin/risk-user-page/` +
                            client.prospectId
                          }
                          className={classes.navLink}
                          style={{ display: "inline" }}
                        >
                          <Button
                            size="lg"
                            color="info"
                            style={{
                              padding: 5,
                              width: "100%",
                              fontSize: 13
                            }}
                          >
                            <h5>SEE INFORMATION</h5>
                          </Button>
                        </NavLink>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </GridContainer>
            ) : (
              <GridContainer>
              {this.state.filterClientList.map((client, index) => (
                <GridItem xs={12} sm={12} md={4} lg={4} key={index}>
                  <Card className={classes.clientsCardLabel}>
                    <CardBody>
                      <GridContainer
                        direction="row"
                        style={{
                          borderBottom: "1px solid #d2d2d2",
                          paddingBottom: 10
                        }}
                      >
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{
                            textAlign: "left",
                            marginTop: 15
                          }}
                        >
                          <GridContainer direction="row">
                            <GridItem lg={8} style={{}}>
                              <span>Client Name</span>
                            </GridItem>
                          </GridContainer>
                          <GridContainer direction="row">
                            <GridItem lg={8}>
                              <span className={classes.ellipses}>
                                {client.customerName}
                              </span>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                        <GridItem
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          style={{
                            textAlign: "left",
                            marginTop: 15
                          }}
                        >
                          <GridContainer direction="row">
                            <GridItem lg={8} style={{}}>
                              <span>Customer ID</span>
                            </GridItem>
                          </GridContainer>
                          <GridContainer direction="row">
                            <GridItem lg={8}>
                              <span className={classes.ellipses}>
                                {client.customerId}
                              </span>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                        <GridItem
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          style={{
                            textAlign: "left",
                            marginTop: 15
                          }}
                        >
                          <GridContainer direction="row">
                            <GridItem lg={8} style={{}}>
                              <span>Risk Level</span>
                            </GridItem>
                          </GridContainer>
                          <GridContainer direction="row">
                            <GridItem lg={8}>
                              <span className={classes.ellipses}>
                                {client.riskLevel || ""}
                              </span>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                        <GridItem
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          style={{
                            textAlign: "left",
                            marginTop: 15
                          }}
                        >
                          <GridContainer direction="row">
                            <GridItem lg={12} style={{}}>
                              <span>Client Status</span>
                            </GridItem>
                          </GridContainer>
                          <GridContainer direction="row">
                            <GridItem lg={12}>
                              <span className={classes.ellipses}>
                                {this.getStatusButton(client.customerStatus)}
                              </span>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                        <GridItem
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          style={{
                            position: "relative",
                            textAlign: "left",
                            marginTop: 15
                          }}
                        >
                          <GridContainer direction="row">
                            <GridItem lg={12} style={{}}>
                              <span>KYC Status</span>
                            </GridItem>
                          </GridContainer>
                          <GridContainer direction="row">
                            <GridItem lg={12}>
                              <span className={classes.ellipses}>
                                {this.getStatusButton(client.kycStatus)}
                              </span>
                            </GridItem>
                          </GridContainer>

                          {/* <GridContainer direction='row'>
                            <GridItem
                              lg={12}
                              style={{
                                position: 'absolute',
                                bottom: 0,
                              }}
                            >
                              <span className={classes.kyc_label}>
                                <CheckCircleOutlineOutlinedIcon style={{ marginRight: 10 }} />
                              </span>
                              <span>KYC STATUS</span>
                              <span className={classes.kyc_ellipses}>{client.kycStatus}</span>
                            </GridItem>
                          </GridContainer> */}
                        </GridItem>
                      </GridContainer>
                      <GridContainer style={{ marginTop: 5 }}>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{
                            textAlign: "left"
                          }}
                        >
                          <NavLink
                            to={
                              "/auth/admin/impersonate-login/" +
                              encodeURIComponent(client.customerEmail)
                            }
                            className={classes.navLink}
                          >
                            <Button
                              size="lg"
                              style={{
                                padding: 5,
                                width: "100%",
                                backgroundColor: "rgb(236, 246, 248)",
                                color: "grey",
                                fontSize: 13
                              }}
                            >
                              <h5>VIEW AS CLIENT</h5>
                            </Button>
                          </NavLink>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{
                            textAlign: "left"
                          }}
                        >
                          <NavLink
                            to={
                              `/auth/admin/customer-info-page/` +
                              client.customerId
                            }
                            className={classes.navLink}
                            style={{ display: "inline" }}
                          >
                            <Button
                              size="lg"
                              color="info"
                              style={{
                                padding: 5,
                                width: "100%",
                                fontSize: 13
                              }}
                            >
                              <h5>SEE INFORMATION</h5>
                            </Button>
                          </NavLink>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </GridContainer>
            )}
          </div>
        </GridItem>
        {/*    <Pagination
                      pages={this.getPageDetails()}
                      currentPage={this.state.selectedPageIndex}
                      color="info"
                      onClick={this.getPageData}
                />
            {/*    <Pagination
                    pages={[
                        { text: "FIRST" },
                        { text: "PREVIOUS" },
                        { text: 1 },
                        { text: 2 },
                        { active: true, text: 3 },
                        { text: 4 },
                        { text: 5 },
                        { text: "NEXT" },
                        { text: "LAST" }
                    ]}
                    color="info"
                />    */}
      </GridContainer>
    );
  }
}
CustomerControlCenter.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(CustomerControlCenter));
