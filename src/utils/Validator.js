import { endpoint } from 'api/endpoint';
import axios from 'axios';

// function that returns true if value is email, false otherwise
const verifyEmail = value => {
  if (value === "") return true;
  // var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // var emailRex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
  var emailRex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/;

  if (emailRex.test(value)) {
    return true;
  }
  return false;
};

// function that returns true if value is email, false otherwise
const verifyCompanyEmail = value => {
  var emailRex = /(@gmail|@yahoo|@hotmail)/;
  if (emailRex.test(value)) {
    return false;
  }
  return true;
};

const validatePhone = value => {
  var phoneRex = /^\d{3}-\d{3}-\d{4}$/gm;
  var phoneRex1 = /^\d{10}$/gm;
  if (phoneRex.test(value) || phoneRex1.test(value)) {
    return true;
  }
  return false;
};

const validatePassword = value => {
  //var passwordRex = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)(?=.*[@#$!]+.*)[0-9a-zA-Z!@#$]{8,}$/;
  // var passwordRex = /^(?=.*[0-9]+.*)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z]+.*)(?=.*[@#$!]+.*)[0-9a-zA-Z!@#$]{8,15}$/;
  var passwordRex = /^(?=.*[0-9]+.*)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z]+.*)(?=.*[~!@#$%^&*()_+]+.*)[0-9a-zA-Z~!@#$%^&*()_+]{8,16}$/;
  if (passwordRex.test(value)) {
    return true;
  }
  return false;
};

// function that verifies if a string has a given length or not
const verifyLength = (value, length) => {
  if (value.length >= length.min && value.length <= length.max) {
    return true;
  }
  return false;
};

const verifyValidValue = (value, length) => {
  value = parseFloat(value.toString().replace(",", ""));
  let max = parseFloat(length.max.toString().replace(",", "")),
    min = parseFloat(length.min.toString().replace(",", ""));

  if (value >= min && value <= max) {
    return true;
  }
  return false;
};

const verifyOldDate = value => {
  const date = new Date(value.toDateString());
  const today = new Date(new Date().toDateString());
  if (date < today) {
    return false;
  } else {
    return true;
  }
};

const verifyValidAmexCVV = value => {
  return value.length === 4 ? true : false;
};

const verifyPositiveValue = value => {
  console.log("verifyPositiveValue - ", parseFloat(value));
  return parseFloat(value) >= 0 ? true : false;
};

const validate = (value, stateName, state, rules, error) => {
  state[stateName + "ErrorMsg"] = [];
  let stateValue = { [stateName + "State"]: "success" };

  rules &&
    rules.forEach(rule => {
      switch (rule.type) {
        case "phone":
          if (!validatePhone(value)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["valid"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "password":
          if (!validatePassword(value)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["password"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "matchPassword":
          if (value !== rule.params) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["matchPassword"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "email":
          if (!verifyEmail(value)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["valid"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "companyEmail":
          if (!verifyCompanyEmail(value)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["company"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "required":
          if (typeof value === "string") {
            if (value.trim() === "") {
              state[stateName + "ErrorMsg"].push(
                error[stateName + "ErrorMsg"]["required"]
              );

              stateValue = {
                ...stateValue,
                [stateName + "State"]: "error",
                [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
              };
            }
          } else {
            if (value === "") {
              state[stateName + "ErrorMsg"].push(
                error[stateName + "ErrorMsg"]["required"]
              );

              stateValue = {
                ...stateValue,
                [stateName + "State"]: "error",
                [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
              };
            }
          }
          break;
        case "special":
          if (!value.match(/^[a-zA-Z0-9_.-\s]+$/i)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["special"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "length":
          if (!verifyLength(value, rule.params)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["range"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "oldDate":
          if (!verifyOldDate(value, rule.params)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["valid"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "range":
          if (!verifyValidValue(value, rule.params)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["range"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "positive":
          if (!verifyPositiveValue(value, rule.params)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["positive"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        case "validAmex":
          if (!verifyValidAmexCVV(value)) {
            state[stateName + "ErrorMsg"].push(
              error[stateName + "ErrorMsg"]["validAmex"]
            );

            stateValue = {
              ...stateValue,
              [stateName + "State"]: "error",
              [stateName + "ErrorMsg"]: state[stateName + "ErrorMsg"]
            };
          }
          break;
        default:
          break;
      }
    });

  return { [stateName]: value, ...stateValue };
};

export { validate };
