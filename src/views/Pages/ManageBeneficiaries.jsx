import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Edit from "@material-ui/icons/Edit";
import Work from "@material-ui/icons/Work";
// import Payment from '@material-ui/icons/AttachMoney';
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import Search from "@material-ui/icons/Search";

import cx from "classnames";
import { NavLink } from "react-router-dom";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import NewBeneficiary from "./NewBeneficiary";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import NoticeModal from "views/Components/NoticeModal.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

const style = {
  ellipses: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
    width: 210,
    verticalAlign: "middle"
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
    backgroundColor: "#a2bba3",
    color: "white",
    padding: 3,
    cursor: "auto"
  },
  closeIcon: {
    backgroundColor: "#A98381",
    color: "white",
    padding: 3,
    cursor: "auto"
  },
  addIcon: {
    marginTop: 25,
    height: 35,
    width: 35,
    borderRadius: 6,
    backgroundColor: "grey"
  },
  beneficiaries: {
    fontSize: 12,
    height: 145
  },
  LabelText: {
    textAlign: "right",
    paddingRight: "0px !important"
  },

  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class ManageBeneficiaries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,
      removeAddBeneficiary: false,
      showAddBeneficiary: false,
      showEditBeneficiary: false,
      currencies: [],
      allBeneficiaries: [],
      beneficiaries: [],
      beneficiary: null,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  componentWillMount = () => {
    let viewClient = sessionStorage.getItem("view_as_client");
    let readonly_customer = sessionStorage.getItem("readonly_customer");
    let removeAddBeneficiary =
      viewClient === "true" || readonly_customer === "true";
    this.setState({ removeAddBeneficiary: removeAddBeneficiary });

    if (viewClient === "true") {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Information",
        noticeModalErrMsg: "You are not authorised to add beneficiaries"
      });
    } else if (readonly_customer === "true") {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Information",
        noticeModalErrMsg:
          "You cannot create a Beneficiary. Please contact your Admin"
      });
    }
    this.getBeneficiaries();
    this.getCurrencies();
  };
  getBeneficiaries = async () => {
    const res = await apiHandler({
      url: endpoint.BENEFICIARIES,
      authToken: sessionStorage.getItem("token")
    });
    const beneficiaries = res.data;
    this.setState({
      allBeneficiaries: beneficiaries,
      beneficiaries: beneficiaries
    });
  };
  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ currencies: res.data.currrencies });
  };
  sendState() {
    return this.state;
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleClose = () => {
    this.setState({ showAddBeneficiary: false, showEditBeneficiary: false });
  };

  showAddBeneficiaryHandler = () => {
    this.setState({
      showAddBeneficiary: true,
      showEditBeneficiary: false,
      editBeneficiary: null
    });
  };

  handleDeleteBeneficiary = () => {
    // this.setState(state => {
    //     return {
    //         beneficiaries: state.beneficiaries.filter(beneficiary => beneficiary.id != id)
    //     };
    // });
  };
  searchBeneficiary = (name, event) => {
    let beneficiaries = [];
    beneficiaries = this.state.allBeneficiaries.filter(beneficiary => {
      const name = beneficiary.companyName;
      const index = name
        .toLowerCase()
        .indexOf(event.target.value.toLowerCase());
      if (index !== -1) return true;
      else return false;
    });
    this.setState({
      beneficiaries: beneficiaries
    });
  };

  handlePaymentBeneficiary = () => {
    // let beneficiary = this.state.beneficiaries.filter(beneficiary => beneficiary.id === id)[0];
    // this.setState({ showAddBeneficiary: true, showEditBeneficiary: true, beneficiary: beneficiary });
  };

  handleEditBeneficiary = () => {
    // let beneficiary = this.state.beneficiaries.filter(beneficiary => beneficiary.id === id)[0];
    // this.setState({ showAddBeneficiary: true, showEditBeneficiary: true, beneficiary: beneficiary });
  };

  addBeneficiary = async beneficiary => {
    const res = await apiHandler({
      url: endpoint.BENEFICIARIES_ADD,
      method: "POST",
      authToken: sessionStorage.getItem("token"),
      data: beneficiary
    });
    if (res.data.errorCode) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: res.data.userDesc
      });
      return;
    } else {
      this.setState(
        state => {
          state.beneficiaries.push({
            ...beneficiary,
            id: res.data.beneficiaryId
          });
          return { beneficiaries: state.beneficiaries };
        },
        () => {
          this.setState({
            noticeModal: true,
            noticeModalHeader: "Success",
            noticeModalErrMsg: "New Beneficiary has been created"
          });
        }
      );
    }
  };

  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };

  isValidated() {
    return true;
  }
  render() {
    const { classes } = this.props;
    const searchButton = classes.top + " " + classes.searchButton;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} lg={10}>
          <h4>
            <b>Manage Beneficiaries</b>
          </h4>
          <div style={{ textAlign: "end" }}>
            <CustomInput
              formControlProps={{
                className: classes.top + " " + classes.search
              }}
              inputProps={{
                placeholder: "Search",
                inputProps: {
                  "aria-label": "Search",
                  className: classes.searchInput,
                  onChange: event => this.searchBeneficiary("search", event)
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
        <GridItem xs={12} sm={12} md={12} lg={10}>
          <div>
            <GridContainer>
              {this.state.beneficiaries &&
                this.state.beneficiaries.map((beneficiary, index) => (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={4}
                    lg={4}
                    key={"beneficiary_" + index}
                  >
                    <Card className={classes.beneficiaries}>
                      {" "}
                      <CardHeader color="warning" text>
                        <CardText color="warning">
                          <Work className={classes.listItemIcon} />
                        </CardText>
                      </CardHeader>
                      <CardBody style={{ top: -60 }}>
                        <GridContainer direction="row">
                          <GridItem
                            xs={6}
                            sm={6}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 20
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem lg={4} className={classes.LabelText}>
                                <span>Name</span>
                              </GridItem>
                              <GridItem lg={5}>
                                <span className={classes.ellipses}>
                                  {beneficiary.companyName}
                                </span>
                              </GridItem>
                              <GridItem lg={3} className={classes.gridIcon}>
                                <NavLink
                                  to={"/auth/new-payment/" + beneficiary.id}
                                  className={cx(classes.navLink)}
                                >
                                  <AccountBalanceWalletIcon
                                    onClick={this.handlePaymentBeneficiary.bind(
                                      this,
                                      beneficiary.id
                                    )}
                                    className={cx(
                                      classes.paymentIcon,
                                      classes.icon
                                    )}
                                  />
                                </NavLink>

                                <Edit
                                  onClick={this.handleEditBeneficiary.bind(
                                    this,
                                    beneficiary.id
                                  )}
                                  className={cx(classes.editIcon, classes.icon)}
                                />
                                <Close
                                  onClick={this.handleDeleteBeneficiary.bind(
                                    this,
                                    beneficiary.id
                                  )}
                                  className={cx(
                                    classes.closeIcon,
                                    classes.icon
                                  )}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem
                            xs={6}
                            sm={6}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 5
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem lg={4} className={classes.LabelText}>
                                <span>Location</span>
                              </GridItem>
                              <GridItem lg={8}>
                                <span className={classes.ellipses}>
                                  {beneficiary.city}
                                  {", "}
                                  {beneficiary.countryName}
                                </span>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem
                            xs={6}
                            sm={6}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 5
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem lg={4} className={classes.LabelText}>
                                <span>Account no. /IBAN</span>
                              </GridItem>
                              <GridItem lg={8}>
                                <span className={classes.ellipses}>
                                  {beneficiary.accountNumber}
                                </span>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem
                            xs={6}
                            sm={6}
                            md={12}
                            lg={12}
                            style={{
                              textAlign: "left",
                              marginTop: 5
                            }}
                          >
                            <GridContainer direction="row">
                              <GridItem lg={4} className={classes.LabelText}>
                                <span>Bank Currency</span>
                              </GridItem>
                              <GridItem lg={8}>
                                <span className={classes.ellipses}>
                                  {beneficiary.currencyCode}
                                </span>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              {!this.state.removeAddBeneficiary && (
                <GridItem xs={12} sm={12} md={4} lg={4}>
                  <Card
                    pricing
                    className={classes.directors}
                    style={{
                      backgroundColor: "rgba(64,168,189,0.15)",
                      minHeight: 145
                    }}
                  >
                    <CardBody>
                      <Add
                        className={cx(
                          classes.editIcon,
                          classes.icon,
                          classes.addIcon
                        )}
                        onClick={this.showAddBeneficiaryHandler}
                      />
                    </CardBody>
                  </Card>
                </GridItem>
              )}
            </GridContainer>
            {this.state.showAddBeneficiary && (
              <NewBeneficiary
                handleClose={this.handleClose}
                showModal={this.state.showAddBeneficiary}
                showEditBeneficiary={this.state.showEditBeneficiary}
                currencies={this.state.currencies}
                beneficiary={this.state.beneficiary}
                addBeneficiary={this.addBeneficiary}
                updateBeneficiary={this.updateBeneficiary}
              />
            )}
            {this.state.noticeModal && (
              <NoticeModal
                noticeModal={this.state.noticeModal}
                noticeModalHeader={this.state.noticeModalHeader}
                noticeModalErrMsg={this.state.noticeModalErrMsg}
                closeModal={this.closeNoticeModal}
              />
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

ManageBeneficiaries.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(ManageBeneficiaries);
