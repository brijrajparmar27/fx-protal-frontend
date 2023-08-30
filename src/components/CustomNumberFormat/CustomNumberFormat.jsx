import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import {
  NumberFormatComp,
  PhoneNumberFormatComp,
  creditCardFormatComp,
  SuffixFormatComp
} from "./NumberFormat.jsx";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';

import customNumberFormatStyle from "assets/jss/material-dashboard-pro-react/components/customNumberFormatStyle.jsx";

function CustomNumberFormat({ ...props }) {
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
    onChange,
    format,
    cardFormat,
    suffix,
    prefix,
    prefixLabel,
    ...other
  } = props;
  var formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControlNumber
    );
  } else {
    formControlClasses = classes.formControlNumber;
  }
  var helpTextClasses = classNames({
    [classes.labelRootError]: error,
    [classes.labelRootSuccess]: success && !error,
    [classes.labelRootInfo]: true
  });
  return (
    <FormControl {...formControlProps} className={formControlClasses}>
      {/* {labelText !== undefined ? (
        <FormHelperText
          className={classes.labelRoot + " " + labelClasses}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </FormHelperText>
      ) : null} */}
      {format !== undefined && (
        <TextField
          {...inputProps}
          {...other}
          label={labelText}
          className={classes.textField}
          format={format}
          value={props.value}
          onChange={props.onChange}
          id={id}
          InputProps={{
            inputComponent: cardFormat !== undefined ? creditCardFormatComp : PhoneNumberFormatComp
          }}
        />
      )}
      {suffix !== undefined && (
        <TextField
          {...inputProps}
          {...other}
          label={labelText}
          className={classes.textField}
          suffix={suffix}
          value={props.value}
          onChange={props.onChange}
          id={id}
          InputProps={{
            inputComponent: SuffixFormatComp
          }}
        />
      )}
      {format === undefined && suffix === undefined && (
        <TextField
          {...inputProps}
          {...other}
          label={labelText}
          className={classes.textField}
          value={props.value}
          onChange={props.onChange}
          id={id}
          InputProps={{
            inputComponent: NumberFormatComp,
            startAdornment: prefix?(<InputAdornment position="start">{prefixLabel}</InputAdornment>):(null)

          }}
        />
      )}
      {helpText !== undefined ? (
        <FormHelperText id={id + "-text"} className={helpTextClasses}>
          <InfoOutlined className={classes.info} />
          {helpText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}

CustomNumberFormat.propTypes = {
  classes: PropTypes.object,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool,
  format: PropTypes.string,
  cardFormat: PropTypes.string,
  suffix: PropTypes.string,
  helpText: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string
};

export default withStyles(customNumberFormatStyle)(CustomNumberFormat);
