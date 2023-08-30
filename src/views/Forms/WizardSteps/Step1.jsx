import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// @material-ui/icons

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { validate } from "../../../utils/Validator";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import FormHelperText from "@material-ui/core/FormHelperText";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  },
  ...customSelectStyle,
  ...regularFormsStyle,
  selectLabel: {
    fontSize: 14,
    textTransform: "none",
    color: "#AAAAAA !important"
    //top: 7
  },
  select: {
    paddingBottom: 10,
    fontSize: 14
  }
};

class Step1 extends React.Component {
  error = {
    companyNameErrorMsg: {
      required: "Company name is required",
      range: "Company Name should be 1 to 200 characters",
      valid: "Please enter a valid company name"
    },
    incorporationNumberErrorMsg: {
      required: "Incorporation number is required",
      range: "Incorporation number should be digits"
    },
    addressErrorMsg: {
      required: "Address is required",
      range: "First name should be 1 to 100 characters"
    },
    companyEmailErrorMsg: {
      required: "Corporate Email is required",
      company: "Please enter a corporate email",
      valid: "Please enter a valid email"
    },
    cityErrorMsg: {
      required: "City is required"
    },
    mainStockMarketErrorMsg: {
      required: "Main Stock Market is required"
    },
    postalCodeErrorMsg: {
      required: "Postal code is required"
    },
    countryCodeErrorMsg: {
      required: "Country is required"
    },
    typeErrorMsg: {
      required: "Password is required"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      companyNameState: "",
      companyNamePristine: true,
      companyNameErrorMsg: [],
      incorporationNumberState: "",
      incorporationNumberPristine: true,
      incorporationNumberErrorMsg: [],
      companyEmailState: "",
      companyEmailPristine: true,
      companyEmailErrorMsg: [],
      addressState: "",
      addressPristine: true,
      addressErrorMsg: [],
      cityState: "",
      cityPristine: true,
      cityErrorMsg: [],
      postalCodeState: "",
      postalCodePristine: true,
      postalCodeErrorMsg: [],
      countryCodeState: "",
      countryCodePristine: true,
      countryCodeErrorMsg: [],
      typeState: "",
      typePristine: true,
      typeErrorMsg: [],
      mainStockMarketState: "",
      mainStockMarketPristine: true,
      mainStockMarketErrorMsg: [],
      secondaryStockMarketState: "",
      secondaryStockMarketPristine: true,
      secondaryStockMarketErrorMsg: [],
      companyName: "",
      incorporationNumber: "",
      companyEmail: "",
      address: "",
      city: "",
      postalCode: "",
      countryCode: "",
      type: "",
      mainStockMarket: "",
      secondaryStockMarket: "",
      companyDesc: "description",
      ownershipType: "ownership_type",
      countries: []
    };
  }

  componentDidMount = async () => {
    this.setState({
      allStates: this.props.allStates
    });
    const res = await apiHandler({
      url: endpoint.COUNTRIES,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log("Unauthorized Access");
        this.props.history.push("/home/logout");
        return;
      } else {
        return;
      }
    } else {
      const countries = res.data.countryMetaData;
      this.setState({ countries: countries });
    }
  };
  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      this.props.apiDataFetched != newProps.apiDataFetched &&
      newProps.apiDataFetched
    ) {
      this.setState(this.setState({ ...newProps.allStates }));
    }
  }

  handleSimple = event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "State"]: "success"
    });
  };
  sendState() {
    return this.state;
  }
  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }
  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }

  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };

  // change = (event, stateName, rules, stateNameEqualTo) => {
  //   const value = event.target.value;
  //   rules.forEach(rule => {
  //     switch (rule.type) {
  //       case "email":
  //         if (this.verifyEmail(event.target.value)) {
  //           this.setState({ [stateName + "State"]: "success" });
  //         } else {
  //           this.setState({ [stateName + "State"]: "error" });
  //         }
  //         break;
  //       case "length":
  //         if (this.verifyLength(event.target.value, stateNameEqualTo)) {
  //           this.setState({ [stateName + "State"]: "success" });
  //         } else {
  //           this.setState({ [stateName + "State"]: "error" });
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //     this.setState((state, props) => {
  //       let data = state;
  //       data[stateName] = value;
  //       //return {[stateName]: event.target.value };
  //       return {data: data};
  //     });
  //   });
  // }
  isValidated() {
    // return true;
    if (
      this.state.companyNameState === "success" &&
      this.state.incorporationNumberState === "success" &&
      this.state.addressState === "success" &&
      this.state.companyEmailState === "success" &&
      this.state.cityState === "success" &&
      this.state.postalCodeState === "success" &&
      this.state.countryCodeState === "success" && this.state.type !== ""
    ) {
      if (this.state.type === "Public") {
        if (this.state.mainStockMarketState  === "success") return true;
        else {
          if (this.state.mainStockMarketState !== "success") {
            this.setState({ mainStockMarketState: "error" });
          }
          return false;
        }
      } else return true; 
    } else {
      if (this.state.companyNameState !== "success") {
        this.setState({ companyNameState: "error" });
      }
      if (this.state.incorporationNumberState !== "success") {
        this.setState({ incorporationNumberState: "error" });
      }
      if (this.state.addressState !== "success") {
        this.setState({ addressState: "error" });
      }
      if (this.state.companyEmailState !== "success") {
        this.setState({ companyEmailState: "error" });
      }
      if (this.state.cityState !== "success") {
        this.setState({ cityState: "error" });
      }
      if (this.state.postalCodeState !== "success") {
        this.setState({ postalCodeState: "error" });
      }

      if (this.state.countryCodeState !== "success") {
        this.setState({ countryCodeState: "error" });
      }
    }
    return false;
  }
  render() {
    const { classes } = this.props;
    return (
      this.state.countries && (
        <GridContainer justify="center">
          {/* <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>
            Let's start with the basic information (with validation)
          </h4>
        </GridItem> */}
          {/* <GridItem xs={12} sm={4}>
          <PictureUpload />
        </GridItem> */}
          <GridItem xs={12} sm={12} md={12} lg={6}>
            {/* <GridContainer spacing={1} alignItems="center">
            <GridItem className={classes.textIcon}>
              <Face className={classes.inputAdornmentIcon} />
            </GridItem>
            <GridItem
              className={classes.customText}
              xs={12}
              sm={12}
              md={10}
              lg={10}
            > */}
            <CustomInput
              success={this.state.companyNameState === "success"}
              error={this.state.companyNameState === "error"}
              helpText={
                this.state.companyNameState === "error" &&
                this.state.companyNameErrorMsg[0]
              }
              labelText="Company Name*"
              id="s1_companyName"
              inputProps={{
                value: this.state.companyName
                //onChange: (event) => this.handleChange('companyName', event),
              }}
              formControlProps={{
                fullWidth: true,
                className: classes.customFormControlClasses,
                onBlur: event => {
                  this.setState({ companyNamePristine: false });
                  this.change(event, "companyName", [
                    { type: "required" },
                    {
                      type: "length",
                      params: {
                        min: 1,
                        max: 200
                      }
                    }
                  ]);
                },
                onChange: event => {
                  //if (!this.state.companyNamePristine) {
                  this.setState({ companyNamePristine: false });
                  this.change(event, "companyName", [
                    { type: "required" },
                    {
                      type: "length",
                      params: {
                        min: 1,
                        max: 200
                      }
                    }
                  ]);
                  //  }
                }
              }}
            />
            {/* </GridItem>
          </GridContainer> */}
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={6}>
            {/* <GridContainer spacing={1} alignItems="center">
            <GridItem className={classes.textIcon}>
              <Face className={classes.inputAdornmentIcon} />
            </GridItem>
            <GridItem
              className={classes.customText}
              xs={12}
              sm={12}
              md={10}
              lg={10}
            > */}
            <CustomInput
              success={this.state.incorporationNumberState === "success"}
              error={this.state.incorporationNumberState === "error"}
              helpText={
                this.state.incorporationNumberState === "error" &&
                this.state.incorporationNumberErrorMsg[0]
              }
              labelText="Incorporation Number*"
              id="s1_incorporationNumber"
              inputProps={{
                value: this.state.incorporationNumber
                //onChange: (event) => this.handleChange('companyName', event),
              }}
              formControlProps={{
                fullWidth: true,
                className: classes.customFormControlClasses,
                onBlur: event => {
                  this.setState({ incorporationNumberPristine: false });
                  this.change(event, "incorporationNumber", [
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
                  //   if (!this.state.incorporationNumberPristine) {
                  this.setState({ incorporationNumberPristine: false });
                  this.change(event, "incorporationNumber", [
                    { type: "required" },
                    {
                      type: "length",
                      params: {
                        min: 1,
                        max: 100
                      }
                    }
                  ]);
                  // }
                }
              }}
            />
            {/* </GridItem>
          </GridContainer> */}
          </GridItem>
          <GridItem xs={12} sm={10} md={12} lg={12}>
            <b className={classes.subTitle}>Registered Office Address</b>
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={6}
            className={classes.alignPadding}
          >
            <CustomInput
              success={this.state.addressState === "success"}
              error={this.state.addressState === "error"}
              helpText={
                this.state.addressState === "error" &&
                this.state.addressErrorMsg[0]
              }
              labelText="Address*"
              id="s1_address"
              inputProps={{
                value: this.state.address
                //onChange: (event) => this.handleChange('companyName', event),
              }}
              formControlProps={{
                fullWidth: true,
                className: classes.customFormControlClasses,
                onBlur: event => {
                  this.setState({ addressPristine: false });
                  this.change(event, "address", [{ type: "required" }]);
                },
                onChange: event => {
                  // if (!this.state.addressPristine) {
                  this.setState({ addressPristine: false });
                  this.change(event, "address", [{ type: "required" }]);
                  // }
                }
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={6}>
            <CustomInput
              success={this.state.companyEmailState === "success"}
              error={this.state.companyEmailState === "error"}
              helpText={
                this.state.companyEmailState === "error" &&
                this.state.companyEmailErrorMsg[0]
              }
              labelText="Corporate email address*"
              id="s1_companyEmail"
              inputProps={{
                value: this.state.companyEmail
                //onChange: (event) => this.handleChange('companyName', event),
              }}
              formControlProps={{
                fullWidth: true,
                className: classes.customFormControlClasses,
                onBlur: event => {
                  this.setState({ companyEmailPristine: false });
                  this.change(event, "companyEmail", [
                    { type: "required" },
                    { type: "email" }
                  ]);
                },
                onChange: event => {
                  //  if (!this.state.companyEmailPristine) {
                  this.setState({ companyEmailPristine: false });
                  this.change(event, "companyEmail", [
                    { type: "required" },
                    { type: "email" }
                  ]);
                  //}
                }
              }}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={12}
            lg={12}
            className={classes.alignPadding}
          >
            <GridContainer>
              <GridItem xs={12} sm={12} md={2}>
                <CustomInput
                  success={this.state.cityState === "success"}
                  error={this.state.cityState === "error"}
                  helpText={
                    this.state.cityState === "error" &&
                    this.state.cityErrorMsg[0]
                  }
                  labelText="City*"
                  id="s1_city"
                  inputProps={{
                    value: this.state.city
                    //onChange: (event) => this.handleChange('companyName', event),
                  }}
                  formControlProps={{
                    fullWidth: true,
                    className: classes.customFormControlClasses,
                    onBlur: event => {
                      this.setState({ cityPristine: false });
                      this.change(event, "city", [{ type: "required" }]);
                    },
                    onChange: event => {
                      //if (!this.state.cityPristine) {
                      this.setState({ cityPristine: false });
                      this.change(event, "city", [{ type: "required" }]);
                      //}
                    }
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  success={this.state.postalCodeState === "success"}
                  error={this.state.postalCodeState === "error"}
                  helpText={
                    this.state.postalCodeState === "error" &&
                    this.state.postalCodeErrorMsg[0]
                  }
                  labelText="Postal Code*"
                  id="s1_postalCode"
                  inputProps={{
                    value: this.state.postalCode
                    //onChange: (event) => this.handleChange('companyName', event),
                  }}
                  formControlProps={{
                    fullWidth: true,
                    className: classes.customFormControlClasses,
                    onBlur: event => {
                      this.setState({ postalCodePristine: false });
                      this.change(event, "postalCode", [{ type: "required" }]);
                    },
                    onChange: event => {
                      //    if (!this.state.postalCodePristine) {
                      this.setState({ postalCodePristine: false });
                      this.change(event, "postalCode", [{ type: "required" }]);
                      //  }
                    }
                  }}
                />
              </GridItem>
              {/* <GridItem xs={12} sm={10} md={4}>
              <CustomInput
                success={this.state.countryCodeState === "success"}
                error={this.state.countryCodeState === "error"}
                helpText={
                  this.state.countryCodeState === "error" &&
                  this.state.countryCodeErrorMsg[0]
                }
                labelText="Country*"
                id="s1_countryCode"
                formControlProps={{
                  fullWidth: true,
                  className: classes.customFormControlClasses,
                  onBlur: event => {
                    this.setState({ countryCodePristine: false });
                    this.change(event, "countryCode", [{ type: "required" }]);
                  },
                  onChange: event => {
                    if (!this.state.countryCodePristine) {
                      this.setState({ countryCodePristine: false });
                      this.change(event, "countryCode", [{ type: "required" }]);
                    }
                  }
                }}
              />
            </GridItem> */}
              <GridItem xs={12} sm={12} md={12} lg={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Country*
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={this.state.countryCode}
                    onChange={this.handleSimple}
                    inputProps={{
                      name: "countryCode",
                      id: "countryCode"
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem
                      }}
                    >
                      Choose Country
                    </MenuItem>
                    {this.state.countries.map(item => (
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={item.countryCode}
                        key={item.countryCode}
                      >
                        {item.countryName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    style={{ color: "red" }}
                    hidden={this.state.countryCodeState !== "error"}
                  >
                    {this.error.countryCodeErrorMsg["required"]}
                  </FormHelperText>
                </FormControl>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} sm={10} md={12} lg={12}>
            <b className={classes.subTitle}>Ownership</b>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={6}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="type" className={classes.selectLabel}>
                    Type
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={this.state.type}
                    onChange={this.handleSimple}
                    inputProps={{
                      name: "type",
                      id: "type"
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
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="Private"
                    >
                      Private
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="Public"
                    >
                      Public
                    </MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={6} />
            </GridContainer>
          </GridItem>
          {this.state.type === "Public" && (
            <>
              <GridItem xs={12} sm={12} md={12} lg={6}>
                <CustomInput
                  success={this.state.mainStockMarketState === "success"}
                  error={this.state.mainStockMarketState === "error"}
                  helpText={
                    this.state.mainStockMarketState === "error" &&
                    this.state.mainStockMarketErrorMsg[0]
                  }
                  labelText="Main Stock Market*"
                  id="s1_mainStockMarket"
                  inputProps={{
                    value: this.state.mainStockMarket
                    //onChange: (event) => this.handleChange('companyName', event),
                  }}
                  formControlProps={{
                    fullWidth: true,
                    className: classes.customFormControlClasses,
                    onBlur: event => {
                      this.setState({ mainStockMarketPristine: false });
                      this.change(event, "mainStockMarket", [
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
                      // if (!this.state.mainStockMarketPristine) {
                      this.setState({ mainStockMarketPristine: false });
                      this.change(event, "mainStockMarket", [
                        { type: "required" },
                        {
                          type: "length",
                          params: {
                            min: 1,
                            max: 100
                          }
                        }
                      ]);
                      //   }
                    }
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={6}>
                {/* <GridContainer spacing={1} alignItems="center">
            <GridItem className={classes.textIcon}>
              <Face className={classes.inputAdornmentIcon} />
            </GridItem>
            <GridItem
              className={classes.customText}
              xs={12}
              sm={12}
              md={10}
              lg={10}
            > */}
                <CustomInput
                  success={this.state.secondaryStockMarketState === "success"}
                  error={this.state.secondaryStockMarketState === "error"}
                  helpText={
                    this.state.secondaryStockMarketState === "error" &&
                    this.state.secondaryStockMarketErrorMsg[0]
                  }
                  labelText="Second Stock Market, if any"
                  id="s1_secondaryStockMarket"
                  inputProps={{
                    value: this.state.secondaryStockMarket
                    //onChange: (event) => this.handleChange('companyName', event),
                  }}
                  formControlProps={{
                    fullWidth: true,
                    className: classes.customFormControlClasses,
                    onBlur: event => {
                      this.setState({ secondaryStockMarketPristine: false });
                      this.change(event, "secondaryStockMarket", []);
                    },
                    onChange: event => {
                      //    if (!this.state.secondaryStockMarketPristine) {
                      this.setState({ secondaryStockMarketPristine: false });
                      this.change(event, "secondaryStockMarket", []);
                      //  }
                    }
                  }}
                />
              </GridItem>
            </>
            // <GridItem xs={12} sm={12} md={12}>
            //   <GridContainer>
            //     <GridItem xs={12} sm={12} md={12} lg={6}>
            //       <FormControl fullWidth className={classes.selectFormControl}>
            //         <InputLabel
            //           htmlFor="mainStockMarket"
            //           className={classes.selectLabel}
            //         >
            //           Main Stock Market
            //         </InputLabel>
            //         <Select
            //           MenuProps={{
            //             className: classes.selectMenu
            //           }}
            //           classes={{
            //             select: classes.select
            //           }}
            //           value={this.state.mainStockMarket}
            //           onChange={this.handleSimple}
            //           inputProps={{
            //             name: "mainStockMarket",
            //             id: "mainStockMarket"
            //           }}
            //         >
            //           <MenuItem
            //             disabled
            //             classes={{
            //               root: classes.selectMenuItem
            //             }}
            //           >
            //             Choose City
            //           </MenuItem>
            //           <MenuItem
            //             classes={{
            //               root: classes.selectMenuItem,
            //               selected: classes.selectMenuItemSelected
            //             }}
            //             value="2"
            //           >
            //             Paris
            //           </MenuItem>
            //           <MenuItem
            //             classes={{
            //               root: classes.selectMenuItem,
            //               selected: classes.selectMenuItemSelected
            //             }}
            //             value="3"
            //           >
            //             Bucharest
            //           </MenuItem>
            //         </Select>
            //       </FormControl>
            //     </GridItem>
            //     <GridItem xs={12} sm={12} md={12} lg={6}>
            //       <FormControl fullWidth className={classes.selectFormControl}>
            //         <InputLabel
            //           htmlFor="secondaryStockMarket"
            //           className={classes.selectLabel}
            //         >
            //           Secondary Stock Market
            //         </InputLabel>
            //         <Select
            //           MenuProps={{
            //             className: classes.selectMenu
            //           }}
            //           classes={{
            //             select: classes.select
            //           }}
            //           value={this.state.secondaryStockMarket}
            //           onChange={this.handleSimple}
            //           inputProps={{
            //             name: "secondaryStockMarket",
            //             id: "secondaryStockMarket"
            //           }}
            //         >
            //           <MenuItem
            //             disabled
            //             classes={{
            //               root: classes.selectMenuItem
            //             }}
            //           >
            //             Choose City
            //           </MenuItem>
            //           <MenuItem
            //             classes={{
            //               root: classes.selectMenuItem,
            //               selected: classes.selectMenuItemSelected
            //             }}
            //             value="2"
            //           >
            //             Paris
            //           </MenuItem>
            //           <MenuItem
            //             classes={{
            //               root: classes.selectMenuItem,
            //               selected: classes.selectMenuItemSelected
            //             }}
            //             value="3"
            //           >
            //             Bucharest
            //           </MenuItem>
            //         </Select>
            //       </FormControl>
            //     </GridItem>
            //   </GridContainer>
            // </GridItem>
          )}
        </GridContainer>
      )
    );
  }
}
Step1.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRouter(withStyles(style)(Step1));
