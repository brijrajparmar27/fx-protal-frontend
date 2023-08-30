import React from "react";
import PropTypes from "prop-types";
import ReactToPrint from "react-to-print";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { AddCircleOutline } from "@material-ui/icons";
import { Grid, IconButton } from "@material-ui/core";

// core components
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import cx from "classnames";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CurrencyRiskDocumentPrint from "./PrintComponents/CurrencyRiskDocumentPrint";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { validate } from "../../../utils/Validator";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";
import moment from "moment";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";

import currencyriskdocument from "views/Pages/json/currencyriskdocument.json";

// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const style = {
  container: {
    // paddingTop: '50px',
    // paddingBottom: '60px',
    backgroundColor: "#ffffff",
    padding: "50px 30px 60px 50px"
    // , textAlign: "center"
  },
  question: {
    marginTop: "35px",
    fontSize: "20px"
  },
  options: {
    marginTop: "25px"
  },
  footer: {
    padding: "20px 15px 0px 15px",
    textAlign: "center"
  },
  left: {
    float: "left!important"
  },
  right: {
    float: "right!important"
  },
  textarea: {
    width: "95%",
    height: "80px",
    border: "1px solid gray",
    font: "-webkit-small-control",
    margin: "auto 16px",
    overflow: "auto",
    padding: "2px",
    resize: "both"
  },
  inputTitle: {
    width: "95%"
  },
  customDateControlClasses: {
    paddingTop: "10px !important",
    cursor: "pointer"
  },
  documentContainer: {
    padding: "20px 40px 20px 20px"
  },
  pageBreak: {
    marginTop: 60,
    pageBreakBefore: "always"
  },

  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

const approvedBy = { signedBy: "", date: "", designation: "" };

class CurrencyRiskDocument extends React.Component {
  error = {
    approvalDateErrorMsg: {
      required: "Approval Date is required"
    },
    signedByErrorMsg: {
      required: "Signed by is required"
    },
    approvedByNameErrorMsg: {
      required: "Name is required"
    },
    approvedByDesignationErrorMsg: {
      required: "Designation by is required"
    },
    approvedByName2ErrorMsg: {
      required: "Name is required"
    },
    approvedByDesignation2ErrorMsg: {
      required: "Designation by is required"
    },
    approvedByName3ErrorMsg: {
      required: "Name is required"
    },
    approvedByDesignation3ErrorMsg: {
      required: "Designation by is required"
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      document: 0,
      documentContent: {},
      approvalDateState: "",
      signedByState: "",
      signedByPristine: true,
      signedByErrorMsg: [],

      approvedByNameState: "",
      approvedByNamePristine: true,
      approvedByNameErrorMsg: [],

      approvedByDesignationState: "",
      approvedByDesignationPristine: true,
      approvedByDesignationErrorMsg: [],

      approvedByName2State: "",
      approvedByName2Pristine: true,
      approvedByName2ErrorMsg: [],

      approvedByDesignation2State: "",
      approvedByDesignation2Pristine: true,
      approvedByDesignation2ErrorMsg: [],

      approvedByName3State: "",
      approvedByName3Pristine: true,
      approvedByName3ErrorMsg: [],

      approvedByDesignation3State: "",
      approvedByDesignation3Pristine: true,
      approvedByDesignation3ErrorMsg: [],

      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      updated: false
    };
  }
  componentDidMount() {
    // var dd = {
    //     content: [
    //         'First paragraph',
    //         'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    //     ]
    // }
    // console.log('pdfdd',dd)
    // pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).download('test.pdf')
    let documentContent = { ...currencyriskdocument };

    let fields = documentContent.fields.map(f => {return {...f, isVisible: true}});
    documentContent.fields = [...fields];

    this.setState({
      documentContent: {...documentContent},
      updated: !this.state.updated
    });
    this.getUserInformation();
  }
  componentWillUnmount() {
    console.log('Unmount - ');
    let documentContent = { ...this.state.documentContent };

    let fields = documentContent.fields.map(f => {return {...f, isVisible: true}});

    // documentContent[event.target.name] = event.target.value
    documentContent.fields = [...fields];
    this.setState({
      documentContent: {...documentContent}
    });
  }
  getUserInformation = async () => {
    const res = await apiHandler({
      url: endpoint.USER_INFO,
      authToken: sessionStorage.getItem("token")
    });
    if (!res.data.errorCode) {
      const user = res.data;

      // let documentContent = { ...this.state.documentContent };
      // let fields = documentContent.fields
      // fields[0].value=user.customerName
      // documentContent.fields = fields
      this.onChangeTextArea("value", user.customerName, 0);
      console.log(user.customerName);
      // documentContent['companyName'] = user.customerName;
      this.setState({
        signedBy: user.firstName + " " + user.lastName
      });
    }
  };
  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );

    let documentContent = { ...this.state.documentContent };
    documentContent[stateName] = event.target.value;
    this.setState({
      documentContent
    });
  };
  onChangeTextArea = (name, value, index) => {
    let documentContent = { ...this.state.documentContent };

    let fields = documentContent.fields;
    //let index = fields.findIndex((x) => x.name === name);
    console.log("index", index);
    fields[index][name] = value;
    console.log(fields);
    console.log(fields[index]);

    // documentContent[event.target.name] = event.target.value
    documentContent.fields = fields;
    this.setState({
      documentContent
    });
  };

  handleDateChange = date => {
    // console.log(moment(date).format('DD-MM-YYYY'))
    let documentContent = { ...this.state.documentContent };
    documentContent.approvalDate = moment(date).format("DD MMM YYYY");
    this.setState({
      documentContent
    });
  };
  handleChange = (e, index, name) => {
    // console.log(e.target.name)
    console.log(e.target.value);

    let documentContent = { ...this.state.documentContent };

    let approvedByInfo = documentContent.approvedByInfo;
    approvedByInfo[index][name] = e.target.value;
    documentContent.approvedByInfo = approvedByInfo;

    this.setState({
      documentContent
    });
  };

  addApprovalRow = () => {
    let arr = this.state.documentContent.approvedByInfo;
    arr = [...arr, { ...approvedBy }];

    let documentContent = { ...this.state.documentContent };
    documentContent.approvedByInfo = arr;

    this.setState({
      documentContent
    });
  };

  removeContent = index => {
    let documentContent = { ...this.state.documentContent };

    let fields = [...documentContent.fields];
    // fields.splice(index, 1);
    fields[index].isVisible = false;

    documentContent.fields = [...fields];
    this.setState({
      documentContent,
      removeIndex: "",
      updated: !this.state.updated
    }, () => {
      this.forceUpdate();
    });
  };
  removeContentRow = index => {
    // Reset the whole data
    this.setState({
      confirmationModalHeader: "Confirmation",
      confirmationModalMsg:
        "Do you want to remove the selected point from Risk Policy document",
      removeIndex: index,
      confirmationModal: true
    });
  };
  handleNegativeResponse = () => {
    // Reset the whole data
    this.setState({
      confirmationModal: false,
      confirmationModalHeader: "",
      confirmationModalMsg: "",
      removeIndex: ""
    });
  };
  handlePositiveResponse = () => {
    this.setState(
      {
        confirmationModal: false,
        confirmationModalHeader: "",
        confirmationModalMsg: ""
      },
      () => {
        // Call for new quotes again
        this.removeContent(this.state.removeIndex);
      }
    );
  };
  addContentRow = () => {
    let documentContent = { ...this.state.documentContent };

    let fields = documentContent.fields;
    fields.push({
      heading: "",
      value: "",
      name: "",
      editable: true,
      isVisible: true
    });

    documentContent.fields = fields;
    this.setState({
      documentContent
    });
  };
  render() {
    const { classes } = this.props;
    let seq = 0;
    return (
      <>
        <GridContainer className={classes.documentContainer} justify="center">
          <GridItem
            xs={11}
            sm={11}
            md={11}
            lg={11}
            style={{ textAlign: "end" }}
          >
            <Button color="success" onClick={() => this.addContentRow()}>
              Add
            </Button>
          </GridItem>

          {this.state.documentContent && this.state.documentContent.fields && this.state.documentContent.fields.map((content, index) => {
            console.log('CONTENT - ', seq);
            seq = content.isVisible ? seq + 1 : seq;
            return (
                <>
              {content.isVisible && (
            <GridItem xs={11} sm={11} md={11} lg={11} key={index}>
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <label>{seq + ". "}</label>
                  <input
                    className={classes.inputTitle}
                    value={content.heading}
                    onChange={event =>
                      this.onChangeTextArea(
                        "heading",
                        event.target.value,
                        index
                      )
                    }
                    name={content.name}
                  />

                  <IconButton
                    edge="end"
                    color="inherit"
                    size="small"
                    style={{ float: "right" }}
                  >
                    <RemoveCircleOutlineOutlinedIcon
                      onClick={() => {
                        this.removeContentRow(index);
                      }}
                    />
                  </IconButton>
                </div>
                  {content.editable ? (
                    <textarea
                      className={classes.textarea}
                      onChange={event =>
                        this.onChangeTextArea("value", event.target.value, index)
                      }
                      name={content.name}
                    >
                      {content.value}
                    </textarea>
                  ) : (
                    <h4>{content.value}</h4>
                  )}
              </GridItem>
              )}
              </>
            );
          })}

          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer justify="left">
              <GridItem xs={3} sm={3} md={3} lg={3}>
                <CustomDateSelector
                  success={this.state.approvalDateState === "success"}
                  error={this.state.approvalDateState === "error"}
                  helpText={
                    this.state.approvalDateState === "error" &&
                    this.state.approvalDateErrorMsg
                  }
                  id="changeStatus_approvalDate"
                  inputProps={{
                    format: "dd MMM yyyy",
                    label: "Date",
                    value: this.state.documentContent.approvalDate,
                    onChange: this.handleDateChange,
                    keyboardbuttonprops: {
                      "aria-label": "change date"
                    }
                  }}
                  formControlProps={{
                    fullWidth: true,
                    className: cx(
                      classes.customDateControlClasses,
                      classes.customFormControlClasses
                    )
                  }}
                />
              </GridItem>
              <Grid item xs={2} style={{ alignSelf: "center" }}>
                <IconButton edge="end" color="inherit" size="small">
                  <AddCircleOutline
                    onClick={() => {
                      this.addApprovalRow();
                    }}
                  />
                </IconButton>
              </Grid>
            </GridContainer>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer justify="left">
              {this.state.documentContent && this.state.documentContent.approvedByInfo && this.state.documentContent.approvedByInfo.map(
                (content, index) => {
                  return (
                    <>
                      <GridItem xs={4} sm={4} md={4} lg={4}>
                        <CustomInput
                          // success={this.state.signedByState === 'success'}
                          // error={this.state.signedByState === 'error'}
                          // helpText={this.state.signedByState === 'error' && this.state.signedByErrorMsg[0]}
                          labelText="Signed by"
                          name={"signedBy"}
                          value={content.signedBy}
                          onChange={e =>
                            this.handleChange(e, index, "signedBy")
                          }
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                            // onBlur: (event) => {
                            //   this.setState({ signedByPristine: false });
                            //   this.change(event, 'signedBy', [
                            //     { type: 'required' },
                            //     {
                            //       type: 'length',
                            //       params: {
                            //         min: 1,
                            //         max: 100,
                            //       },
                            //     },
                            //   ]);
                            // },
                            // onChange: (event) => {
                            //   if (!this.state.signedByPristine) {
                            //     this.setState({ signedByPristine: false });
                            //     this.change(event, 'signedBy', [
                            //       { type: 'required' },
                            //       {
                            //         type: 'length',
                            //         params: {
                            //           min: 1,
                            //           max: 100,
                            //         },
                            //       },
                            //     ]);
                            //   }
                            // },
                          }}
                        />
                      </GridItem>
                      <GridItem xs={4} sm={4} md={4} lg={4}>
                        <CustomInput
                          // success={this.state.approvedByNameState === 'success'}
                          // error={this.state.approvedByNameState === 'error'}
                          // helpText={this.state.approvedByNameState === 'error' && this.state.approvedByNameErrorMsg[0]}
                          labelText="Name"
                          // id='s1_approvedByName'
                          name="aprrovedBy"
                          value={content.aprrovedBy}
                          onChange={e =>
                            this.handleChange(e, index, "aprrovedBy")
                          }
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                            // onBlur: (event) => {
                            //   this.setState({ approvedByNamePristine: false });
                            //   this.change(event, 'approvedByName', [
                            //     { type: 'required' },
                            //     {
                            //       type: 'length',
                            //       params: {
                            //         min: 1,
                            //         max: 100,
                            //       },
                            //     },
                            //   ]);
                            // },
                            // onChange: (event) => {
                            //   if (!this.state.approvedByNamePristine) {
                            //     this.setState({ approvedByNamePristine: false });
                            //     this.change(event, 'approvedByName', [
                            //       { type: 'required' },
                            //       {
                            //         type: 'length',
                            //         params: {
                            //           min: 1,
                            //           max: 100,
                            //         },
                            //       },
                            //     ]);
                            //   }
                            // },
                          }}
                        />
                      </GridItem>
                      <GridItem xs={4} sm={4} md={4} lg={4}>
                        <CustomInput
                          // success={this.state.approvedByDesignationState === 'success'}
                          // error={this.state.approvedByDesignationState === 'error'}
                          // helpText={this.state.approvedByDesignationState === 'error' && this.state.approvedByDesignationErrorMsg[0]}
                          labelText="Designation"
                          name="designation"
                          value={content.designation}
                          onChange={e =>
                            this.handleChange(e, index, "designation")
                          }
                          // id='s1_approvedByDesignation'
                          formControlProps={{
                            fullWidth: true,
                            className: classes.customFormControlClasses
                            // onBlur: (event) => {
                            //   this.setState({ approvedByDesignationPristine: false });
                            //   this.change(event, 'approvedByDesignation', [
                            //     { type: 'required' },
                            //     {
                            //       type: 'length',
                            //       params: {
                            //         min: 1,
                            //         max: 100,
                            //       },
                            //     },
                            //   ]);
                            // },
                            // onChange: (event) => {
                            //   if (!this.state.approvedByDesignationPristine) {
                            //     this.setState({
                            //       approvedByDesignationPristine: false,
                            //     });
                            //     this.change(event, 'approvedByDesignation', [
                            //       { type: 'required' },
                            //       {
                            //         type: 'length',
                            //         params: {
                            //           min: 1,
                            //           max: 100,
                            //         },
                            //       },
                            //     ]);
                            //   }
                            // },
                          }}
                        />
                      </GridItem>
                    </>
                  );
                }
              )}

              {/* <GridItem xs={4} sm={4} md={4} lg={4}>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <CustomInput
                    success={this.state.approvedByName2State === "success"}
                    error={this.state.approvedByName2State === "error"}
                    helpText={
                      this.state.approvedByName2State === "error" &&
                      this.state.approvedByName2ErrorMsg[0]
                    }
                    labelText="Name"
                    id="s1_approvedByName2"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ approvedByName2Pristine: false });
                        this.change(event, "approvedByName2", [
                          { type: "required" },
                          {
                            type: "length",
                            params: {
                              min: 1,
                              max: 100
                            }
                          }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.approvedByName2Pristine) {
                          this.setState({ approvedByName2Pristine: false });
                          this.change(event, "approvedByName2", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 100
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <CustomInput
                    success={
                      this.state.approvedByDesignation2State === "success"
                    }
                    error={this.state.approvedByDesignation2State === "error"}
                    helpText={
                      this.state.approvedByDesignation2State === "error" &&
                      this.state.approvedByDesignation2ErrorMsg[0]
                    }
                    labelText="Designation"
                    id="s1_approvedByDesignation2"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({
                          approvedByDesignation2Pristine: false
                        });
                        this.change(event, "approvedByDesignation2", [
                          { type: "required" },
                          {
                            type: "length",
                            params: {
                              min: 1,
                              max: 100
                            }
                          }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.approvedByDesignation2Pristine) {
                          this.setState({
                            approvedByDesignation2Pristine: false
                          });
                          this.change(event, "approvedByDesignation2", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 100
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
              </GridItem>
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <CustomInput
                    success={this.state.approvedByName3State === "success"}
                    error={this.state.approvedByName3State === "error"}
                    helpText={
                      this.state.approvedByName3State === "error" &&
                      this.state.approvedByName3ErrorMsg[0]
                    }
                    labelText="Name"
                    id="s1_approvedByName3"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({ approvedByName3Pristine: false });
                        this.change(event, "approvedByName3", [
                          { type: "required" },
                          {
                            type: "length",
                            params: {
                              min: 1,
                              max: 100
                            }
                          }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.approvedByName3Pristine) {
                          this.setState({ approvedByName3Pristine: false });
                          this.change(event, "approvedByName3", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 100
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <CustomInput
                    success={
                      this.state.approvedByDesignation3State === "success"
                    }
                    error={this.state.approvedByDesignation3State === "error"}
                    helpText={
                      this.state.approvedByDesignation3State === "error" &&
                      this.state.approvedByDesignation3ErrorMsg[0]
                    }
                    labelText="Designation"
                    id="s1_approvedByDesignation3"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses,
                      onBlur: event => {
                        this.setState({
                          approvedByDesignation3Pristine: false
                        });
                        this.change(event, "approvedByDesignation3", [
                          { type: "required" },
                          {
                            type: "length",
                            params: {
                              min: 1,
                              max: 100
                            }
                          }
                        ]);
                      },
                      onChange: event => {
                        if (!this.state.approvedByDesignation3Pristine) {
                          this.setState({
                            approvedByDesignation3Pristine: false
                          });
                          this.change(event, "approvedByDesignation3", [
                            { type: "required" },
                            {
                              type: "length",
                              params: {
                                min: 1,
                                max: 100
                              }
                            }
                          ]);
                        }
                      }
                    }}
                  />
                </GridItem>
              </GridItem> */}
            </GridContainer>
          </GridItem>
          <ConfirmationModal
            confirmationModal={this.state.confirmationModal}
            confirmationModalHeader={this.state.confirmationModalHeader}
            confirmationModalMsg={this.state.confirmationModalMsg}
            handleNegativeButton={this.handleNegativeResponse}
            handlePositiveButton={this.handlePositiveResponse}
            positiveButtonText="Yes"
            negativeButtonText="No"
          />
        </GridContainer>
        <div className={classes.footer}>
          <div className={classes.center}>
            {this.state.document !== "" && (
              <ReactToPrint
                trigger={() => <Button color="rose">Generate</Button>}
                pageStyle="@page { size: auto; margin-top: 15mm; margin-bottom: 20mm; } @media print { body { -webkit-print-color-adjust: exact; padding: 25px !important; } }"
                content={() => this.componentRef}
              />
            )}
          </div>
          <div className={classes.clearfix} />
        </div>
        <div style={{ overflow: "hidden", height: 0 }}>
          <CurrencyRiskDocumentPrint
            ref={el => (this.componentRef = el)}
            documentName={'Currency Risk Management Policy ("FX Policy")'}
            documentContent={this.state.documentContent}
          />
        </div>
      </>
    );
  }
}
CurrencyRiskDocument.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(CurrencyRiskDocument);
