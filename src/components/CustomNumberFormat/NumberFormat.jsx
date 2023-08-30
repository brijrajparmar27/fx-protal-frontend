import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
// @material-ui/core components

function NumberFormatComp(props) {
  const { classes, id, inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      id={id}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      classes={classes}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatComp.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  format: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

function PhoneNumberFormatComp(props) {
  const { classes, id, inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      id={id}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      classes={classes}
      format={"###-###-#####"}
      isNumericString
    />
  );
}
//       thousandSeparator
PhoneNumberFormatComp.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  format: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

function creditCardFormatComp(props) {
  const { classes, id, inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      id={id}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      classes={classes}
      format="####-####-####-####"
      isNumericString
    />
  );
}
//       thousandSeparator
creditCardFormatComp.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  format: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

function SuffixFormatComp(props) {
  const { classes, id, inputRef, onChange, suffix, ...other } = props;

  return (
    <NumberFormat
      {...other}
      id={id}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      classes={classes}
      suffix={"%"}
      isNumericString
    />
  );
}
//       thousandSeparator
SuffixFormatComp.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  suffix: PropTypes.string,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export { NumberFormatComp, PhoneNumberFormatComp, creditCardFormatComp, SuffixFormatComp };
