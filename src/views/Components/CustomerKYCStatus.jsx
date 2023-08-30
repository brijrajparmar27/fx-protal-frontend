import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

// @material-ui/icons
import AddIcon from "@material-ui/icons/Add";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddDirectors from "../Pages/AddDirectors";
import AddCustomers from "../Components/AddCustomers";
import NoticeModal from "views/Components/NoticeModal.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
const style = theme => ({
  ...customSelectStyle,
  ...regularFormsStyle,
  ...customCheckboxRadioSwitch,
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  customFormControlClasses: {
    margin: 0
  },
  subTitle: {
    fontWeight: 400,
    fontSize: "16px",
    paddingBottom: 20,
    display: "flex"
  },
  subTitle2: {
    fontWeight: 400,
    fontSize: "16px",
    paddingTop: 20,
    paddingBottom: 20,
    display: "flex"
  },
  subTitle3: {
    fontWeight: 700,
    fontSize: "16px",
    textDecoration: "underline",
    paddingTop: 40,
    paddingBottom: 20,
    display: "flex"
  },
  fieldRatingText: {
    padding: "12px 8px !important",
    margin: "auto 5px !important",
    position: "relative",
    fontSize: "1em",
    borderTop: "1px solid #DDD",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 300,
    lineHeight: 1.42857143,
    borderBottom: "none",
    verticalAlign: "middle",
    "&:nth-child(odd)": {
      borderRight: "1px solid #DDD"
    }
  },
  grid: {
    display: "inline-block"
  },
  tabPanelClass: {
    minHeight: "calc(100vh - 270px)",
    maxHeight: "calc(100vh - 270px)",
    overflowY: "auto"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  },
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important"
    //top: 7
  },
  select: {
    paddingBottom: 10,
    fontSize: 14
  },
  ellipses: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
    width: 195,
    verticalAlign: "middle"
  },
  directors: {
    backgroundColor: "rgba(64,168,189,0.15)"
  },
  cardTitleWhite: {
    fontSize: 14
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
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
    marginTop: 40,
    height: 45,
    width: 45,
    borderRadius: 6,
    backgroundColor: "grey"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  alignRight: {
    textAlign: "right"
  },
  noBenfData: {
    padding: "20px 8px!important",
    fontSize: "1em",
    fontWeight: 300,
    lineHeight: 1.42857143,
    verticalAlign: "middle",
    textAlign: "center"
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}
class CustomerKYCStatus extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      showModal: false,
      isAddon: true,
      anchorAddDirectorEl: null,
      companyDetail: {},
      contactDetail: {},
      creditRating: {},
      shareHoldersData: [],
      directorsData: [],
      directorsKYCColumn: [
        "Additional",
        "Name",
        "Position",
        "Score",
        "RAG",
        "Details",
        "Actions",
        "ID Check"
      ],
      directorKycData: [],
      shareholerColumn: ["Name of Shareholders"],
      directorColumn: [
        "Name",
        "Date Of Birth",
        "Position",
        "Appointment Date",
        "Address",
        "Postal Code"
      ],
      companySanctionNegativeDataColumn: ["Negative Data Type", "Present"],
      companySanctionTypeColumn: ["Sanction Type", "Previously", "Currently"],
      companySanctionDocumentsColumn: [
        "Sanction Name",
        "Original Link",
        "Secure Link"
      ],
      companyInsolventsColumn: ["Original Link", "Secure Link"],

      companySanction: {},
      creditLimitColumn: [
        "Rating",
        "Rating Type",
        "Description",
        "Range",
        "Credit Limit"
      ],
      creditLimitData: [],
      beneficiaryKYCColumn: [
        "Name",
        "Risk Score",
        "RAG",
        "Details",
        "Alerts",
        "Sanctions",
        "Status"
      ], //'Contact Details', 'Credit Rating', 'Regn No.',
      beneficiaryKYCData: [],
      value: 0,
      showAlertModal: false,
      alertColumn: ["type", "Rule", "Message", "Score"],
      alertData: [],
      showAddDirector: false,
      showAddCustomer: false,
      callInProgress: false,
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  handleClose = () => {
    this.props.closeModal();
    this.setState({ showModal: false });
  };
  handleAlertClose = () => {
    this.props.handleAlertClose();
    // this.setState({ showAlertModal: false, alertData: [] });
  };
  handleStatus = () => {
    this.props.updateStatus(this.props.taskInfo);
  };
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  static getDerivedStateFromProps(props, state) {
    if (
      props.showModal !== state.showModal ||
      props.showAlertModal !== state.showAlertModal
    ) {
      let customerKycDetails = {};
      if (props.showModal) {
        customerKycDetails = CustomerKYCStatus.initialState;
        customerKycDetails = {
          ...customerKycDetails,
          ...props.kycInfo,
          ...props.showAlertModal,
          ...props.alertData
        };
      }
      if (props.showAlertModal) {
        customerKycDetails = {
          ...customerKycDetails,
          ...props.kycInfo,
          ...props.showAlertModal,
          ...props.alertData
        };
      }
      return {
        showModal: props.showModal,
        showAlertModal: props.showAlertModal,
        alertData: props.alertData || [],
        companyDetail:
          customerKycDetails.companyKycDetails &&
          customerKycDetails.companyKycDetails[0]
            ? customerKycDetails.companyKycDetails[0]
            : {},
        directorKycData: customerKycDetails.directorKycData
          ? customerKycDetails.directorKycData
          : [],
        contactDetail:
          customerKycDetails.companyKycDetails &&
          customerKycDetails.companyKycDetails[0] &&
          customerKycDetails.companyKycDetails[0].contactDetail
            ? customerKycDetails.companyKycDetails[0].contactDetail
            : {},
        creditRating:
          customerKycDetails.companyKycDetails &&
          customerKycDetails.companyKycDetails[0] &&
          customerKycDetails.companyKycDetails[0].creditRating
            ? customerKycDetails.companyKycDetails[0].creditRating
            : {},
        creditLimitData: customerKycDetails.creditLimitData || [],
        shareHoldersData: customerKycDetails.shareHoldersData || [],
        directorsData: customerKycDetails.directorsData || [],
        companySanction: customerKycDetails.companySanction || {},
        beneficiaryKYCData: customerKycDetails.beneficiaryKycDetails || [],
        ...customerKycDetails
      };
    }
    return null;
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  getIcon = status => {
    let color = "#50ae55";
    switch (status) {
      case "RED":
        color = "#df3d2b";
        break;
      case "AMBER":
        color = "#dfa52b";
        break;
      case "GREEN":
        color = "#50ae55";
        break;
    }
    return (
      <FiberManualRecordIcon
        style={{ color: color, textAlign: "center", width: 50, height: 50 }}
      />
    );
  };
  getCompanyDocLink = link => {
    return link !== "" ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        Open Detail Report
      </a>
    ) : null;
  };
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  handleMenuClose = () => {
    this.setState({
      anchorAddDirectorEl: null
    });
  };

  handleDirectorClose = () => {
    this.setState({ showAddDirector: false });
  };

  showAddDirectorHandler = () => {
    this.setState({ showAddDirector: true });
    this.handleMenuClose();
  };

  handleDeleteDirector = id => {
    // Do Nothing
  };

  handleEditDirector = id => {
    // Do Nothing
  };

  addDirector = async director => {
    // console.log('director - ', director);
    const customerRegistrationDetails = this.props.customerRegistrationDetails;

    const addonDirector = {
      ...director,
      customerId: customerRegistrationDetails.customerId,
      companyName: customerRegistrationDetails.companyName,
      countryCode: director.alpha2Code,
      designation: "DIRECTOR",
      additionalDirector: true
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_PERSON_ONLY,
      data: addonDirector,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: res.data.userDesc
      });
      return;
    } else {
      this.props.refreshKycData(customerRegistrationDetails.customerId);
    }
  };

  updateDirector = director => {
    // Do Nothing
  };

  handleCustomerClose = () => {
    this.setState({ showAddCustomer: false });
  };

  showAddCustomerHandler = () => {
    this.setState({ showAddCustomer: true });
    this.handleMenuClose();
  };

  handleDeleteCustomer = id => {
    // Do Nothing
  };

  handleEditCustomer = id => {
    // Do Nothing
  };

  addCustomer = async company => {
    console.log("company - ", company);
    const customerRegistrationDetails = this.props.customerRegistrationDetails;

    const addonCompany = {
      customerId: customerRegistrationDetails.customerId,
      additionalCompany: true,
      ...company
    };
    this.setState({ callInProgress: true });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.KYC_COMPANY_ONLY,
      data: addonCompany,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false });
    if (res.data.errorCode) {
      this.setState({
        noticeModal: true,
        noticeModalHeader: "Error",
        noticeModalErrMsg: res.data.userDesc
      });
      return;
    } else {
      this.handleCustomerClose();
      this.props.refreshKycData(customerRegistrationDetails.customerId);
    }
  };

  updateCustomer = customer => {
    // Do Nothing
  };
  closeNoticeModal = () => {
    this.setState({
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    });
  };

  render() {
    const { classes } = this.props;
    const {
      showModal,
      companyDetail,
      contactDetail,
      directorKycData,
      creditRating,
      creditLimitData,
      shareHoldersData,
      directorsData,
      companySanction,
      showAlertModal,
      beneficiaryKYCData,
      alertData
    } = this.state;

    return (
      <div className={classes.container}>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot
          }}
          maxWidth="Md"
          style={{ zIndex: 1030 }}
          fullScreen={true}
          open={showModal}
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
          >
            {/* <IconButton aria-label='close' className={classes.closeButton} onClick={() => this.handleClose()}>
              <CloseIcon />
            </IconButton> */}

            {this.props.kycInfo &&
            (this.props.kycInfo.isCompanyKYCExists ||
              this.props.kycInfo.isDirectorKYCExists) ? (
              <Button
                size="lg"
                style={{
                  backgroundColor: "#50ae55",
                  visibility: this.state.value === 0 ? "visible" : "hidden",
                  width: "200px",
                  float: "right",
                  marginRight: 10,
                  textAlign: "right"
                }}
                onClick={event => {
                  this.setState({ anchorAddDirectorEl: event.currentTarget });
                }}
              >
                <AddIcon />
                ADD
              </Button>
            ) : (
              <Button
                size="lg"
                style={{
                  backgroundColor: "#50ae55",
                  visibility: this.state.value === 0 ? "visible" : "hidden",
                  width: "200px",
                  float: "right",
                  marginRight: 10,
                  textAlign: "right"
                }}
                onClick={event => {
                  this.props.performKYC(this.props.customerRegistrationDetails);
                }}
              >
                PERFORM KYC
              </Button>
            )}
            <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>
              <span className={classes.titleContent}>
                Customer Due Dilligence Report
              </span>
            </h3>
            <Menu
              id="director-menu"
              elevation={0}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
              MenuListProps={{
                style: {
                  border: "1px solid #d3d4d5",
                  borderRadius: "3px",
                  boxShadow:
                    "0 2px 5px 0 rgba(' + hexToRgb(blackColor) + ', 0.26)"
                }
              }}
              anchorEl={this.state.anchorAddDirectorEl}
              keepMounted
              open={Boolean(this.state.anchorAddDirectorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuItem onClick={this.showAddDirectorHandler}>
                {"DIRECTOR / SHAREHOLDER"}
              </MenuItem>
              <MenuItem onClick={this.showAddCustomerHandler}>
                {"COMPANY"}
              </MenuItem>
            </Menu>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.modalBody, classes.loginMaxWidth)}
          >
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
                    <Tab label="Summary" {...a11yProps(0)} />
                    <Tab label="Company Information" {...a11yProps(1)} />
                    <Tab label="Credit Rating" {...a11yProps(2)} />
                    <Tab label="Director / Shareholders" {...a11yProps(3)} />
                    <Tab label="Sanctions" {...a11yProps(4)} />
                    <Tab label="Beneficiaries" {...a11yProps(5)} />
                  </Tabs>
                </AppBar>
                <TabPanel
                  value={this.state.value}
                  index={0}
                  className={classes.tabPanelClass}
                >
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <b className={classes.subTitle}>KYC Summary</b>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ border: "1px solid #cccccc" }}
                  >
                    <Table
                      striped
                      tableHeaderColor="gray"
                      tableHead={this.state.directorsKYCColumn}
                      tableData={directorKycData}
                      customCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customClassesForCells={[0, 4, 5]}
                      customHeadCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customHeadClassesForCells={[0, 4, 5]}
                    />
                  </GridItem>
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={1}
                  className={classes.tabPanelClass}
                >
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <b className={classes.subTitle2}>
                      Company Detail Information
                    </b>
                  </GridItem>
                  <div style={{ display: "flex" }}>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={9}
                      lg={9}
                      style={{ borderRight: "1px solid #CCCCCC" }}
                    >
                      <GridContainer>
                        {/* Company Details */}
                        <GridItem xs={12} sm={12} md={6} lg={6}>
                          <CustomInput
                            labelText="Company Name"
                            id="kyc_companyName"
                            inputProps={{
                              value: companyDetail.name || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} lg={6}>
                          <CustomInput
                            labelText="Registration Number"
                            id="kyc_registrationNumber"
                            inputProps={{
                              value: companyDetail.registrationNumber || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <CustomInput
                            labelText="Description"
                            id="kyc_description"
                            multiline
                            inputProps={{
                              value: companyDetail.description || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <CustomInput
                            labelText="Address"
                            id="kyc_address"
                            inputProps={{
                              value: contactDetail.addressLine1 || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} lg={6}>
                          <CustomInput
                            labelText="Street"
                            id="kyc_street"
                            inputProps={{
                              value: contactDetail.street || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} lg={6}>
                          <CustomInput
                            labelText="City"
                            id="kyc_city"
                            inputProps={{
                              value: contactDetail.city || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomInput
                            labelText="Postal Code"
                            id="kyc_postalCode"
                            inputProps={{
                              value: contactDetail.postalCode || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomInput
                            labelText="Country Code"
                            id="kyc_country"
                            inputProps={{
                              value: contactDetail.country || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <CustomInput
                            labelText="Phone"
                            id="kyc_telephone"
                            inputProps={{
                              value: contactDetail.telephone || "",
                              disabled: true
                            }}
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3} lg={3}>
                      <GridContainer>
                        {/* Risk Score & RAG status */}
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          {this.getIcon(companyDetail.rag)}
                        </GridItem>
                        <GridItem xs={7} sm={7} md={7} lg={7}>
                          <FormLabel className={cx(classes.currencyLabel)}>
                            Risk Score:
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={5} sm={5} md={5} lg={5}>
                          <FormLabel className={cx(classes.currencyLabel)}>
                            {companyDetail.riskScore || ""}
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          {this.getCompanyDocLink(companyDetail.pdfreport)}
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </div>
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={2}
                  className={classes.tabPanelClass}
                >
                  <div>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <b className={classes.subTitle2}>
                        Company Credit Score Details
                      </b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <Table
                        striped
                        tableHeaderColor="gray"
                        tableHead={this.state.creditLimitColumn}
                        tableData={creditLimitData}
                        customCellClasses={[
                          classes.center,
                          classes.right,
                          classes.right
                        ]}
                        customClassesForCells={[0, 4, 5]}
                        customHeadCellClasses={[
                          classes.center,
                          classes.right,
                          classes.right
                        ]}
                        customHeadClassesForCells={[0, 4, 5]}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                              <b className={classes.subTitle3}>
                                Financial Field / Established
                              </b>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6} lg={6}>
                              <b>Rating</b>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6} lg={6}>
                              <b>Description</b>
                            </GridItem>
                            {creditRating &&
                              creditRating.established &&
                              creditRating.established.map(est => (
                                <>
                                  <GridItem
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    lg={5}
                                    className={classes.fieldRatingText}
                                  >
                                    {est.ratingRange}
                                  </GridItem>
                                  <GridItem
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    className={classes.fieldRatingText}
                                  >
                                    {est.description}
                                  </GridItem>
                                </>
                              ))}
                          </GridContainer>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                              <b className={classes.subTitle3}>
                                Newly Incorporated
                              </b>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6} lg={6}>
                              <b>Rating</b>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6} lg={6}>
                              <b>Description</b>
                            </GridItem>
                            {creditRating &&
                              creditRating.newlyIncorporated &&
                              creditRating.newlyIncorporated.map(ni => (
                                <>
                                  <GridItem
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    lg={5}
                                    className={classes.fieldRatingText}
                                  >
                                    {ni.ratingRange}
                                  </GridItem>
                                  <GridItem
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    className={classes.fieldRatingText}
                                  >
                                    {ni.description}
                                  </GridItem>
                                </>
                              ))}
                          </GridContainer>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                              <b className={classes.subTitle3}>
                                International Score Band
                              </b>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6} lg={6}>
                              <b>Rating</b>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6} lg={6}>
                              <b>Description</b>
                            </GridItem>
                            {creditRating &&
                              creditRating.internationalScoreBand &&
                              creditRating.internationalScoreBand.map(isb => (
                                <>
                                  <GridItem
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    lg={5}
                                    className={classes.fieldRatingText}
                                  >
                                    {isb.ratingRange}
                                  </GridItem>
                                  <GridItem
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    className={classes.fieldRatingText}
                                  >
                                    {isb.description}
                                  </GridItem>
                                </>
                              ))}
                          </GridContainer>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </div>
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={3}
                  className={classes.tabPanelClass}
                >
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <b className={classes.subTitle2}>Director List</b>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ border: "1px solid #cccccc" }}
                  >
                    <Table
                      striped
                      tableHeaderColor="gray"
                      tableHead={this.state.directorColumn}
                      tableData={directorsData}
                      customCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customClassesForCells={[0, 4, 5]}
                      customHeadCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customHeadClassesForCells={[0, 4, 5]}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <b className={classes.subTitle2}>Top 10 Shareholding</b>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ border: "1px solid #cccccc" }}
                  >
                    <Table
                      striped
                      tableHeaderColor="gray"
                      tableHead={this.state.shareholerColumn}
                      tableData={shareHoldersData}
                      customCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customClassesForCells={[0, 4, 5]}
                      customHeadCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customHeadClassesForCells={[0, 4, 5]}
                    />
                  </GridItem>
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={4}
                  className={classes.tabPanelClass}
                >
                  <GridContainer>
                    {/* <GridItem xs={12} sm={12} md={12} lg={12}>
                      <b className={classes.subTitle2}>Contact Details</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={9} lg={9}>
                      <CustomInput
                        labelText='Company Name'
                        id='kyc_sanctions_companyName'
                        inputProps={{
                          value: (companySanction && companySanction.companyName) || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3} lg={3}>
                      <CustomInput
                        labelText='Match'
                        id='kyc_sanctions_match'
                        inputProps={{
                          value: (companySanction && companySanction.match) || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>{' '}
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <CustomInput
                        labelText='Address 1'
                        id='kyc_sanctions_address1'
                        inputProps={{
                          value: (companySanction && companySanction.address1) || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <CustomInput
                        labelText='Address 2'
                        id='kyc_sanctions_address2'
                        multiline
                        inputProps={{
                          value: (companySanction && companySanction.address2) || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomInput
                        labelText='City'
                        id='kyc_sanctions_city'
                        inputProps={{
                          value: (companySanction && companySanction.city) || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomInput
                        labelText='Postal code'
                        id='kyc_sanction_postalcode'
                        inputProps={{
                          value: (companySanction && companySanction.postalCode) || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <CustomInput
                        labelText='Country'
                        id='kyc_sanction_country'
                        inputProps={{
                          value: (companySanction && companySanction.country) || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
             */}
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <b className={classes.subTitle2}>Summary</b>
                    </GridItem>
                    {companySanction &&
                      companySanction.companySanctionNegativeData && (
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{
                            padding: "10px !important",
                            borderRight: "1px solid #cccccc"
                          }}
                        >
                          <Table
                            striped
                            tableHeaderColor="gray"
                            tableHead={
                              this.state.companySanctionNegativeDataColumn
                            }
                            tableData={
                              companySanction &&
                              companySanction.companySanctionNegativeData
                            }
                            customCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                      )}
                    {companySanction &&
                      companySanction.companySanctionTypeData && (
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ padding: "10px !important" }}
                        >
                          <Table
                            striped
                            tableHeaderColor="gray"
                            tableHead={this.state.companySanctionTypeColumn}
                            tableData={companySanction.companySanctionTypeData}
                            customCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                      )}
                    {companySanction &&
                    companySanction.sanctionDocumentsData &&
                    companySanction.sanctionDocumentsData.length ? (
                      <>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <b
                            style={{
                              fontWeight: 400,
                              fontSize: 16,
                              paddingTop: 20,
                              paddingBottom: 20,
                              display: "flex"
                            }}
                          >
                            Sanction Documents
                          </b>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ padding: "10px !important" }}
                        >
                          <Table
                            striped
                            tableHeaderColor="gray"
                            tableHead={
                              this.state.companySanctionDocumentsColumn
                            }
                            tableData={companySanction.sanctionDocumentsData}
                            customCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                      </>
                    ) : null}
                    {companySanction &&
                    companySanction.insolventsData &&
                    companySanction.insolventsData.length ? (
                      <>
                        <GridItem xs={12} sm={12} md={12} lg={12}>
                          <b
                            style={{
                              fontWeight: 400,
                              fontSize: 16,
                              paddingTop: 20,
                              paddingBottom: 20,
                              display: "flex"
                            }}
                          >
                            Insolvent
                          </b>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ padding: "10px !important" }}
                        >
                          <Table
                            striped
                            tableHeaderColor="gray"
                            tableHead={this.state.companyInsolventsColumn}
                            tableData={companySanction.insolventsData}
                            customCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customClassesForCells={[0, 4, 5]}
                            customHeadCellClasses={[
                              classes.center,
                              classes.right,
                              classes.right
                            ]}
                            customHeadClassesForCells={[0, 4, 5]}
                          />
                        </GridItem>
                      </>
                    ) : null}
                    {/* {companySanction.insolvents && (
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <b className={classes.subTitle2}>Articles</b>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <CustomInput
                        labelText='Source'
                        id='kyc_sanction_postalcode'
                        inputProps={{
                          value: companySanction.postalCode || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6} lg={6}>
                      <CustomInput
                        labelText='Original Link'
                        id='kyc_sanction_country'
                        inputProps={{
                          value: companySanction.country || '',
                          disabled: true,
                        }}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses,
                        }}
                      />
                    </GridItem>
                    )} */}
                  </GridContainer>
                </TabPanel>
                <TabPanel
                  value={this.state.value}
                  index={5}
                  className={classes.tabPanelClass}
                >
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <b className={classes.subTitle} />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ border: "1px solid #cccccc" }}
                  >
                    <Table
                      striped
                      tableHeaderColor="gray"
                      tableHead={this.state.beneficiaryKYCColumn}
                      tableData={beneficiaryKYCData}
                      customCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customClassesForCells={[0, 4, 5]}
                      customHeadCellClasses={[
                        classes.center,
                        classes.right,
                        classes.right
                      ]}
                      customHeadClassesForCells={[0, 4, 5]}
                    />
                  </GridItem>
                  {beneficiaryKYCData.length === 0 && (
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={classes.noBenfData}
                    >
                      No Beneficiary Data available for this client.
                    </GridItem>
                  )}
                </TabPanel>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <div
                  className={classes.center}
                  style={{ textAlign: "right", marginTop: 30 }}
                >
                  {this.props.taskInfo && (
                    <Button
                      round={false}
                      color="info"
                      size="lg"
                      onClick={this.handleStatus}
                    >
                      UPDATE STATUS
                    </Button>
                  )}
                  <Button round={false} size="lg" onClick={this.handleClose}>
                    CLOSE
                  </Button>
                </div>
              </GridItem>
            </GridContainer>
          </DialogContent>
        </Dialog>
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot
          }}
          maxWidth="Sm"
          open={showAlertModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleAlertClose()}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={cx(classes.modalHeader)}
          >
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={() => this.handleAlertClose()}
            >
              <CloseIcon />
            </IconButton>
            <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>
              <span className={classes.titleContent}>Alerts</span>
            </h3>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={cx(classes.modalBody, classes.loginMaxWidth)}
          >
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ padding: "10px !important" }}
              >
                <Table
                  striped
                  tableHeaderColor="gray"
                  tableHead={this.state.alertColumn}
                  tableData={this.state.alertData}
                  customCellClasses={[
                    classes.center,
                    classes.right,
                    classes.right
                  ]}
                  customClassesForCells={[0, 4, 5]}
                  customHeadCellClasses={[
                    classes.center,
                    classes.right,
                    classes.right
                  ]}
                  customHeadClassesForCells={[0, 4, 5]}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <div
                  className={classes.center}
                  style={{ textAlign: "right", marginTop: 30 }}
                >
                  <Button
                    round={false}
                    size="md"
                    onClick={this.handleAlertClose}
                  >
                    CLOSE
                  </Button>
                </div>
              </GridItem>
            </GridContainer>
          </DialogContent>
        </Dialog>
        <AddDirectors
          handleClose={this.handleDirectorClose}
          showModal={this.state.showAddDirector}
          addDirector={this.addDirector}
          directors={this.state.directors}
          editDirector={this.state.editDirector}
          updateDirector={this.updateDirector}
          isAddon={this.state.isAddon}
        />
        <AddCustomers
          handleClose={this.handleCustomerClose}
          showModal={this.state.showAddCustomer}
          addCustomer={this.addCustomer}
          customers={this.state.customers}
          editCustomer={this.state.editCustomer}
          updateCustomer={this.updateCustomer}
        />
        <NoticeModal
          noticeModal={this.state.noticeModal}
          noticeModalHeader={this.state.noticeModalHeader}
          noticeModalErrMsg={this.state.noticeModalErrMsg}
          closeModal={this.closeNoticeModal}
        />
        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
            }}
            open={this.state.callInProgress}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle
              id="waiting-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <h4 className={classes.modalTitle}>{"Processing..."}</h4>
            </DialogTitle>
            <DialogContent
              id="waiting-modal-slide-description"
              className={classes.modalBody}
              style={{ textAlign: "center" }}
            >
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }
}

CustomerKYCStatus.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  kycInfo: PropTypes.object,
  performKYC: PropTypes.func,
  taskInfo: PropTypes.object,
  updateStatus: PropTypes.func,
  refreshKycData: PropTypes.func,
  updateCustomerKyc: PropTypes.func
};

export default withStyles(style)(CustomerKYCStatus);
