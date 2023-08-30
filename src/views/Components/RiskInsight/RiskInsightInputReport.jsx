import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
import Button from "components/CustomButtons/Button.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import ReactSlider from "react-slider";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// core components
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import addCustomersStyle from "assets/jss/material-dashboard-pro-react/views/addDirectorsStyle.jsx";

const style = theme => ({
  container: {
    paddingTop: "50px",
    paddingBottom: "60px",
    backgroundColor: "#ffffff",
    textAlign: "center"
  },
  question: {
    fontSize: 20,
    marginTop: 15,
    padding: 20
  },
  options: {
    marginTop: "25px"
  },
  footer: {
    padding: "40px 0px 0px 0px"
  },
  left: {
    float: "left!important"
  },
  right: {
    float: "right!important"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  horizontalSlider: {
    width: "100%",
    maxWidth: 500,
    height: 50,
    top: 10,

    // border: '1px solid grey',
    "& sliderThumb": {
      top: 1,
      width: 50,
      height: 48,
      lineHeight: 38
    },
    "& sliderTrack": {
      top: 10,
      height: 10
    }
  },
  sliderThumb: {
    fontSize: "0.9em",
    textAlign: "center",
    backgroundColor: "#000",
    color: "#FFF",
    cursor: "pointer",
    border: "5px solid gray",
    boxSizing: "border-box"
  },
  sliderTrack: {
    position: "relative",
    background: "#0000001a",
    top: 10,
    height: 10
  },
  ...addCustomersStyle,
  ...modalStyle,
  ...customCheckboxRadioSwitch
});

class RiskInsightInputReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noticeModal: false,
      noticeModalHeader: "",
      noticeModalErrMsg: ""
    };
  }
  componentDidMount() {
    this.getCurrencies();
  }

  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({
      currencies: res.data.currrencies,
      dropDownCurrencies: res.data.currrencies
    });
  };

  getOptions = question => {
    const optionType = question.optionType;
    switch (optionType) {
      case "CHECKBOX":
        return this.getCheckBoxOptions(question);
        break;
      case "BUTTON":
        return this.getButtonOptions(question);
        break;
      case "MULTIADD":
        return this.renderMultiAddOptions(question);
        break;
      case "SLIDER":
        return this.renderSliderOptions(question);
        break;
    }
  };
  getCheckBoxOptions = question => {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={1} sm={1} md={1} lg={1} />
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <div className={classes.options}>
            {question.answerOptions.map((obj, index) => {
              return (
                <FormControlLabel
                  key={index}
                  className={classes.center}
                  classes={{
                    root: classes.checkboxLabelControl,
                    label: classes.checkboxLabel
                  }}
                  control={
                    <Checkbox
                      tabIndex={-1}
                      disabled={true}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      checked={
                        question.answer && question.answer.name === obj.name
                      }
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot
                      }}
                      name={obj.name}
                    />
                  }
                  label={<div className={classes.termsText}>{obj.name}</div>}
                />
              );
            })}
          </div>
        </GridItem>
      </GridContainer>
    );
  };
  getButtonOptions = question => {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={1} sm={1} md={1} lg={1} />
        <GridItem xs={10} sm={10} md={10} lg={10}>
          <div className={classes.options}>
            {question.answerOptions.map((obj, index) => {
              return (
                <Button
                  key={index}
                  style={
                    question.answer && question.answer.name !== obj.name
                      ? {
                          textAlign: "center",
                          backgroundColor: "#ffffff",
                          color: "black",
                          border: "1px solid #1D64B0",
                          marginRight: "10px",
                          marginLeft: "10px"
                        }
                      : {
                          textAlign: "center",
                          backgroundColor: "#1D64B0",
                          marginRight: "10px",
                          marginLeft: "10px"
                        }
                  }
                  size="sm"
                  className={classes.marginRight}
                >
                  {obj.name}
                </Button>
              );
            })}
          </div>
        </GridItem>
      </GridContainer>
    );
  };
  renderMultiAddOptions = question => {
    const answer = question.answer;
    const { classes } = this.props;
    const { currencies, dropDownCurrencies } = this.state;

    return (
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <GridContainer>
          {answer &&
          answer.currencyAmounts &&
          answer.currencyAmounts.length === 0 ? (
            <GridContainer>
              <GridItem xs={1} sm={1} md={1} lg={1} />
              <GridItem xs={3} sm={3} md={3} lg={3}>
                <div className={classes.options}>No Response</div>
              </GridItem>
            </GridContainer>
          ) : (
            answer.currencyAmounts.map((obj, index) => {
              return (
                <GridContainer key={index}>
                  <GridItem xs={1} sm={1} md={1} lg={1} />
                  <GridItem xs={3} sm={3} md={3} lg={3}>
                    <FormControl
                      fullWidth
                      style={{
                        paddingTop: 9
                      }}
                    >
                      <InputLabel
                        htmlFor="type"
                        className={classes.selectLabelRisk}
                      >
                        Currency
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        disabled={true}
                        value={obj.currencyCode}
                        inputProps={{
                          name: "currencycode",
                          id: "rr_currencycode",
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
                          Currency
                        </MenuItem>
                        {dropDownCurrencies &&
                          dropDownCurrencies.map(item => (
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={item.currencyCode}
                              key={item.currencyCode}
                            >
                              {item.currencyCode}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <FormControl fullWidth>
                      <CustomNumberFormat
                        value={obj.amount}
                        disabled={true}
                        labelText="Amount"
                        name="amount"
                        id={"amount"}
                        formControlProps={{
                          fullWidth: true,
                          className: classes.customFormControlClasses
                        }}
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
              );
            })
          )}
        </GridContainer>
      </GridItem>
    );
  };
  renderSliderOptions = question => {
    const { classes } = this.props;

    let response =
      question.answer && question.answer.name === ""
        ? 0
        : parseInt(question.answer.name);
    return (
      <div className={classes.options}>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <GridContainer>
            <GridItem xs={1} sm={1} md={1} lg={1} />
            <GridItem
              xs={8}
              sm={8}
              md={8}
              lg={8}
              style={{ textAlign: "-webkit-center" }}
            >
              <ReactSlider
                id={"slider"}
                value={response}
                disabled={true}
                className={classes.horizontalSlider}
                thumbClassName={classes.sliderThumb}
                trackClassName={classes.sliderTrack}
                renderThumb={(props, state) => (
                  <div {...props}>{state.valueNow + "%"}</div>
                )}
              />
            </GridItem>
            <GridItem xs={2} sm={2} md={2} lg={2} />
          </GridContainer>
        </GridItem>
      </div>
    );
  };

  render() {
    const { classes, reportData } = this.props;
    return (
      <GridItem xs={12} sm={12} md={12} lg={12}>
        {reportData &&
          reportData.questionaries &&
          reportData.questionaries.map((question, index) => (
            <>
              <div className={classes.question}>
                {question.questionId + ".    " + question.question}
              </div>
              {question.answer ? (
                this.getOptions(question)
              ) : (
                <GridContainer>
                  <GridItem xs={1} sm={1} md={1} lg={1} />
                  <GridItem
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                    style={{ textAlign: "-webkit-center" }}
                  >
                    <div className={classes.options}>No Response</div>
                  </GridItem>
                </GridContainer>
              )}
            </>
          ))}
      </GridItem>
    );
  }
}
RiskInsightInputReport.propTypes = {
  classes: PropTypes.object.isRequired,
  reportData: PropTypes.object
};
export default withStyles(style)(RiskInsightInputReport);
