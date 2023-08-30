import React from "react";
import PropTypes from "prop-types";
import ReactToPrint from "react-to-print";

// @material-ui/core components
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

// core components
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import moment from "moment";

import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import cx from "classnames";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import HedgeAccountingDocumentPrint from "./PrintComponents/HedgeAccountingDocumentPrint";

import { validate } from "../../../utils/Validator";

import hedgeaccountingdocuement from "views/Pages/json/hedgeaccountingdocuement.json";

// import PrintButton from './PrintButton'

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
    width: "100%",
    height: "80px",
    border: "1px solid gray",
    font: "medium -moz-fixed",
    font: "-webkit-small-control",

    overflow: "auto",
    padding: "2px",
    resize: "both"
  },
  customDateControlClasses: {
    paddingTop: "4px !important",
    cursor: "pointer",
    marginBottom: "0px !important"
  },
  documentContainer: {
    padding: "20px 40px 20px 20px"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

const typesOfHedgingRelationship = [
  {
    name: "Fair value hedge",
    value: 1
  },
  {
    name: "Cash flow hedge",
    value: 2
  },
  {
    name: "Net Investment Hedging of a foreign operation",
    value: 3
  }
];
const natureOfRiskOptions = [
  {
    name: "Foreign exchange risk",
    value: 1
  },
  {
    name: "Interest rate risk",
    value: 2
  },
  {
    name: "Other, please specify",
    value: 3
  }
];
const identificationOfHedgeItem = [
  {
    name: "Is the hedged item a layer component?",
    value: 1
  },
  {
    name: "Is the hedged item a risk component?",
    value: 2
  },
  {
    name: "Is the hedged item a group of items?",
    value: 3
  }
];
const forecastedTransaction = [
  {
    name: "Yes",
    value: 1
  },
  {
    name: "No",
    value: 2
  }
];

const proportionOfHedgingOptions = [
  {
    name: "100%",
    value: 1
  },
  {
    name: "Specify a %",
    value: 2
  }
];

const foreignCurrencyOptions = [
  {
    name: "Included in hedge designation",
    value: 1
  },
  {
    name: "Excluded from hedge designation and recognised in P&L",
    value: 2
  },
  {
    name: "Excluded from hedge designation and deferred in OCI",
    value: 3
  },
  {
    name: "NA",
    value: 4
  }
];
const timeValueOptions = [
  {
    name: "Included in hedge designation",
    value: 1
  },

  {
    name: "Excluded from hedge designation and deferred in OCI",
    value: 3
  },
  {
    name: "NA",
    value: 4
  }
];

class HedgeAccountingDocument extends React.Component {
  error = {
    dateOfDesignationErrorMsg: {
      required: "Date is required"
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
      documentContent: hedgeaccountingdocuement,
      dateOfDesignationState: "",
      dateOfDesignationErrorMsg: [],

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
      approvedByDesignation3ErrorMsg: []
    };
  }

  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
    // console.log(validate(event.target.value, stateName, this.state, rules, this.error))
    // let validate=validate(event.target.value, stateName, this.state, rules, this.error);
    // this.setState(validate)
  };
  // handleChange = (event) => {
  //   let documentContent = { ...this.state.documentContent };
  //   documentContent[event.target.name] = event.target.value;
  //   this.setState({
  //     documentContent,
  //   });
  // };

  handleDateChange = date => {
    let documentContent = { ...this.state.documentContent };

    documentContent.dateOfDesignation = moment(date).format("DD MMM YYYY");
    this.setState({
      documentContent
    });
  };
  handleChange = (name, value) => {
    let documentContent = { ...this.state.documentContent };

    // if(name==='identificationOfHedgeItem'){
    //   documentContent.identificationOfHedgeItemDescription=documentContent['identificationOfHedgeItemSelected' + value]
    // }

    documentContent[name] = value;
    this.setState({
      documentContent
    });
  };
  onChangeSelect = (e, text) => {
    let documentContent = { ...this.state.documentContent };
    console.log(e.target.value);
    console.log(e.target.name);
    console.log(text);
    if (e.target.name === "identificationOfHedgeItem") {
      console.log("identificationOfHedgeItem called");
      console.log(
        documentContent["identificationOfHedgeItemSelected" + e.target.value]
      );

      documentContent.identificationOfHedgeItemDescription =
        documentContent["identificationOfHedgeItemSelected" + e.target.value];
    }

    console.log(documentContent);
    documentContent[e.target.name + "Option"] = e.target.value;
    documentContent[e.target.name + "Text"] = text;

    this.setState({
      documentContent
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <GridContainer className={classes.documentContainer} justify="center">
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <h4>Risk Management Objectives and Strategy</h4>
            <textarea
              className={classes.textarea}
              onChange={event =>
                this.handleChange(event.target.name, event.target.value)
              }
              name="riskManagementObjective"
            >
              {this.state.documentContent.riskManagementObjective}
            </textarea>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer spacing={1} justify="center">
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Type of Hedging Relationship
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.documentContent.typeOfHedingOption}
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    inputProps={{
                      name: "typeOfHeding",
                      id: "typeOfHeding",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Select Type
                    </MenuItem>
                    {typesOfHedgingRelationship.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <CustomDateSelector
                  success={this.state.dateOfDesignationState === "success"}
                  error={this.state.dateOfDesignationState === "error"}
                  helpText={
                    this.state.dateOfDesignationState === "error" &&
                    this.state.dateOfDesignationErrorMsg
                  }
                  id="changeStatus_approvalDate"
                  inputProps={{
                    format: "dd MMM yyyy",
                    label: "Date of Designation of hedge*",
                    value: this.state.documentContent.dateOfDesignation,
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
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Nature of risk being hedged
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.documentContent.natureofRiskOption}
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    inputProps={{
                      name: "natureofRisk",
                      id: "natureofRisk",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Select Option
                    </MenuItem>
                    {natureOfRiskOptions.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer spacing={1} justify="left">
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Identification of hedged item
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    value={
                      this.state.documentContent.identificationOfHedgeItemOption
                    }
                    // onChange={(e)=>this.handleChange(e.target.name,e.target.value)}
                    inputProps={{
                      name: "identificationOfHedgeItem",
                      id: "identificationOfHedgeItem",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Choose Type
                    </MenuItem>
                    {identificationOfHedgeItem.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={6} sm={6} md={6} lg={6}>
                {console.log(
                  "natureOfRiskOption",
                  this.state.documentContent.natureofRiskOption
                )}
                {this.state.documentContent.natureofRiskOption == 3 && (
                  <CustomInput
                    labelText="Nature of risk being hedged"
                    name="natureofRiskOther"
                    value={this.state.documentContent.natureofRiskOther}
                    onChange={e =>
                      this.handleChange("natureofRiskOther", e.target.value)
                    }
                    id="s1_natureofRiskOther"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses
                      // onChange: (event) => {
                      //   this.change(event, 'natureOfForecastedDesignation');
                      // },
                    }}
                  />
                )}
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer spacing={1} justify="left">
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: 15 }}
              >
                {this.state.documentContent.identificationOfHedgeItemOption !==
                  "" && (
                  <textarea
                    className={classes.textarea}
                    value={
                      this.state.documentContent
                        .identificationOfHedgeItemDescription
                    }
                    onChange={event =>
                      this.handleChange(event.target.name, event.target.value)
                    }
                    name="identificationOfHedgeItemDescription"
                  >
                    {
                      this.state.documentContent
                        .identificationOfHedgeItemDescription
                    }
                  </textarea>
                )}
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer spacing={1} justify="left">
              <GridItem xs={6} sm={6} md={6} lg={6}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Forecasted transaction
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={
                      this.state.documentContent.isForecastedTransactionOption
                    }
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    // onChange={(e)=>this.handleChange(e.target.name,e.target.value)}
                    inputProps={{
                      name: "isForecastedTransaction",
                      id: "isForecastedTransaction",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Choose Type
                    </MenuItem>
                    {forecastedTransaction.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                {this.state.documentContent.isForecastedTransactionOption ==
                  1 && (
                  <GridContainer spacing={1} justify="center">
                    <GridItem xs={4} sm={4} md={4} lg={4}>
                      <CustomInput
                        labelText="Forecasted transaction"
                        name="natureOfForecastedDesignation"
                        value={
                          this.state.documentContent
                            .natureOfForecastedDesignation
                        }
                        onChange={e =>
                          this.handleChange(
                            "natureOfForecastedDesignation",
                            e.target.value
                          )
                        }
                        id="s1_natureOfForecastedDesignation"
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                          // onChange: (event) => {
                          //   this.change(event, 'natureOfForecastedDesignation');
                          // },
                        }}
                      />
                    </GridItem>
                    <GridItem xs={4} sm={4} md={4} lg={4}>
                      <CustomInput
                        value={this.state.documentContent.timeScale}
                        labelText="Time Scale"
                        id="s1_timeScale"
                        name="timeScale"
                        onChange={e =>
                          this.handleChange("timeScale", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                          // onChange: (event) => {
                          //   this.change(event, 'timeScale');
                          // },
                        }}
                      />
                    </GridItem>
                    <GridItem xs={4} sm={4} md={4} lg={4}>
                      <CustomInput
                        value={this.state.documentContent.rationale}
                        labelText="Rationale"
                        id="s1_rationale"
                        name="rationale"
                        onChange={e =>
                          this.handleChange("rationale", e.target.value)
                        }
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                          // onChange: (event) => {
                          //   this.change(event, 'rationale');
                          // },
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem
            xs={11}
            sm={11}
            md={11}
            lg={11}
            style={{ marginTop: "20px" }}
          >
            <h4>Identification of hedging instrument</h4>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer spacing={1} justify="left">
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <CustomInput
                  value={this.state.documentContent.dealId}
                  labelText="Deal ID"
                  id="s1_dealId"
                  onChange={e => this.handleChange("dealId", e.target.value)}
                  formControlProps={{
                    fullWidth: true,
                    className: classes.customFormControlClasses

                    // onChange: (event) => {
                    //   this.change(event, 'dealId');
                    // },
                  }}
                />
              </GridItem>
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Designation of forward element
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={
                      this.state.documentContent
                        .designationOfForwardElementOption
                    }
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    inputProps={{
                      name: "designationOfForwardElement",
                      id: "designationOfForwardElement",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Select Option
                    </MenuItem>
                    {foreignCurrencyOptions.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Foreign currency basis spreads
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.documentContent.foreignCurrencyOption}
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    inputProps={{
                      name: "foreignCurrency",
                      id: "foreignCurrency",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Select Option
                    </MenuItem>
                    {foreignCurrencyOptions.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={11} sm={11} md={11} lg={11}>
            <GridContainer spacing={1} justify="left">
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Time value of an option
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.timeValueOption}
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    inputProps={{
                      name: "timeValue",
                      id: "timeValue",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Select Option
                    </MenuItem>
                    {timeValueOptions.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={4} sm={4} md={4} lg={4}>
                <FormControl fullWidth className={classes.filledSelect}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Proportion used for hedging
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    value={this.state.proportionOfHedgingOption}
                    onChange={(e, child) =>
                      this.onChangeSelect(e, child.props.children)
                    }
                    inputProps={{
                      name: "proportionOfHedging",
                      id: "proportionOfHedging",
                      classes: {
                        icon: classes.white,
                        root: classes.selectDropDown
                      }
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Select Option
                    </MenuItem>
                    {proportionOfHedgingOptions.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={4} sm={4} md={4} lg={4}>
                {this.state.documentContent.proportionOfHedgingOption == 2 && (
                  <CustomInput
                    value={this.state.documentContent.proportionOfHedgingValue}
                    labelText="Specify %"
                    id="s1_proportionOfHedgingValue"
                    onChange={e =>
                      this.handleChange(
                        "proportionOfHedgingValue",
                        e.target.value
                      )
                    }
                    formControlProps={{
                      fullWidth: true,
                      className: classes.customFormControlClasses
                      // onChange: (event) => {
                      //   this.change(event, 'proportionOfHedgingValue');
                      // },
                    }}
                  />
                )}
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem
            xs={11}
            sm={11}
            md={11}
            lg={11}
            style={{ marginTop: "20px" }}
          >
            <h4>Hedge effectiveness</h4>
            <textarea
              className={classes.textarea}
              onChange={e => this.handleChange(e.target.name, e.target.value)}
              name="hedgeEffectiveness"
            >
              {this.state.documentContent.hedgeEffectiveness}
            </textarea>
          </GridItem>

          <GridItem xs={11} sm={11} md={11} lg={11}>
            <p>Credit risk does not dominate</p>
            <textarea
              className={classes.textarea}
              onChange={e => this.handleChange(e.target.name, e.target.value)}
              name="creditRisk"
            >
              {this.state.documentContent.creditRisk}
            </textarea>
          </GridItem>
          <GridItem
            xs={11}
            sm={11}
            md={11}
            lg={11}
            style={{ marginTop: "20px" }}
          >
            <h4>Expected causes of hedge ineffectiveness, if any</h4>
            <textarea
              className={classes.textarea}
              placeholder={
                this.state.documentContent.expectedCausesOfHedgePlaceHolder
              }
              onChange={e => this.handleChange(e.target.name, e.target.value)}
              name="expectedCausesOfHedge"
            >
              {this.state.documentContent.expectedCausesOfHedge}
            </textarea>
          </GridItem>
          <GridItem
            xs={11}
            sm={11}
            md={11}
            lg={11}
            style={{ marginTop: "20px" }}
          >
            <h5>
              Any other information that may be used to assist with
              understanding the hedging relationship, for example a diagram of
              the transaction structure{" "}
            </h5>
            <textarea
              className={classes.textarea}
              onChange={e => this.handleChange(e.target.name, e.target.value)}
              name="anyOtherInfo"
            >
              {this.state.documentContent.anyOtherInfo}
            </textarea>
          </GridItem>
        </GridContainer>
        <div className={classes.footer}>
          <div className={classes.center}>
            {this.state.document !== "" && (
              <ReactToPrint
                trigger={() => <Button color="rose">Generate</Button>}
                pageStyle="@page { size: auto; margin-top: 18mm; margin-bottom: 18mm; } @media print { body { -webkit-print-color-adjust: exact; padding: 20px !important; } }"
                content={() => this.componentRef}
              />
            )}
          </div>
          <div className={classes.clearfix} />
        </div>
        <div style={{ overflow: "hidden", height: 0 }}>
          <HedgeAccountingDocumentPrint
            ref={el => (this.componentRef = el)}
            documentName={"Hedge Accounting Documentation Template under IFRS9"}
            documentContent={this.state.documentContent}
          />
        </div>
      </>
    );
  }
}
HedgeAccountingDocument.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(HedgeAccountingDocument);
