/* eslint-disable no-unused-vars */
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

const customDateSelectorStyle = {
  ...customInputStyle
};

const materialTheme = createMuiTheme({
  overrides: {
    MuiInput: {
      input: {
        fontSize: 14,
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 400
      },
      underline: {
        "&:after": {
          borderBottom: "2px solid #94C634"
        }
      }
    },
    MuiInputLabel: {
      formControl: {
        fontSize: 14
      },
      shrink: {
        color: "#AAAAAA !important"
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#94C634"
      }
    },
    MuiPickersToolbarText: {
      toolbarTxt: {
        color: "white"
      }
    },
    MuiTypography: {
      colorPrimary: {
        color: "black"
      }
    },
    MuiButton: {
      textPrimary: {
        color: "black"
      }
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: "#94C634",
        color: "white"
      }
    }
  }
});

function CustomDateSelector({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    helpText,
    year
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  var formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl
    );
  } else {
    formControlClasses = classes.formControl;
  }
  var helpTextClasses = classNames({
    [classes.labelRootError]: error,
    [classes.labelRootSuccess]: success && !error,
    [classes.labelRootInfo]: true
  });

  return (
    <FormControl {...formControlProps} className={formControlClasses}>
      {labelText !== undefined ? (
        <InputLabel
          className={classes.labelRoot + " " + labelClasses}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
      {/* <Input
        classes={{
          input: inputClasses,
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses
        }}
        id={id}
        value={props.value}
        onChange={props.onChange}
        {...inputProps}
      /> */}
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={materialTheme}>
          {year ? (
            <DatePicker
              disableFuture
              id={id}
              openTo="year"
              format="dd/MM/yyyy"
              label="Date of birth"
              views={["year", "month", "date"]}
              value={props.value}
              onChange={props.onChange}
              // maxDate={Date.now()}
              {...inputProps}
            />
          ) : (
            <DatePicker
              id={id}
              value={props.value}
              // minDate={props.minDate}
              onChange={props.onChange}
              {...inputProps}
            />
          )}
        </ThemeProvider>
        {/* <KeyboardDatePicker
            classes={{
              input: inputClasses,
              root: marginTop,
              disabled: classes.disabled,
              underline: underlineClasses
            }}
            id={id}
            value={props.value}
            onChange={props.onChange}
            {...inputProps}
          /> */}
      </MuiPickersUtilsProvider>
      {helpText !== undefined ? (
        <FormHelperText id={id + "-text"} className={helpTextClasses}>
          <InfoOutlined className={classes.info} />
          {helpText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}

CustomDateSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool,
  helpText: PropTypes.node,
  year: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default withStyles(customDateSelectorStyle)(CustomDateSelector);
