import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import TextField from "@material-ui/core/TextField";

import customNumberFormatStyle from "assets/jss/material-dashboard-pro-react/components/customNumberFormatStyle.jsx";

function CustomMultilineText({ ...props }) {
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
    suffix,
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
        <TextField
          {...inputProps}
          {...other}
          multiline
          rows={4}
          label={labelText}
          className={classes.textField}
          format={format}
          value={props.value}
          onChange={props.onChange}
          id={id}
          
        />
      
      

      {helpText !== undefined ? (
        <FormHelperText id={id + "-text"} className={helpTextClasses}>
          <InfoOutlined className={classes.info} />
          {helpText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}

CustomMultilineText.propTypes = {
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
  suffix: PropTypes.string,
  helpText: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.string
};

export default withStyles(customNumberFormatStyle)(CustomMultilineText);
