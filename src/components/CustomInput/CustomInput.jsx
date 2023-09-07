import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";

function CustomInput({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    inputRef,
    type,
    labelProps,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    helpText,
    helpLinkText,
    helpLink
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
    [classes.whiteUnderline]: white
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white
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
      <Input
        classes={{
          input: inputClasses,
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses
        }}
        type={type || "text"}
        id={id}
        ref={inputRef}
        value={props.value}
        onChange={props.onChange}
        autoComplete="off"
        {...inputProps}
      />
      {helpText !== undefined && helpText !== null ? (
        <FormHelperText id={id + "-text"} className={helpTextClasses}>
          <InfoOutlined className={classes.info} />
          {helpText}
          {helpLinkText !== undefined ? (
            <NavLink to={helpLink}>{helpLinkText}</NavLink>
          ) : // <a href={helpLink}>{helpLinkText}</a>
          null}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}

CustomInput.propTypes = {
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
  helpLinkText: PropTypes.node,
  helpLink: PropTypes.node,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default withStyles(customInputStyle)(CustomInput);
