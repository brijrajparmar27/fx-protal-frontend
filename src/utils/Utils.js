import React, { createContext, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

export const StateContext = createContext();
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);
// const Context = React.createContext({ authenticated: false });

export const registerToken = async () => {
  // const history = useHistory();

  const code = {
    grant_type: "refresh_token",
    refresh_token: sessionStorage.getItem("refresh_token")
  };
  const response = await apiHandler({
    method: "POST",
    url: endpoint.LOGIN_OAUTH,
    data: code
  });
  console.log(response);
  if (response.data.access_token) {
    sessionStorage.setItem("token", response.data.access_token);
    sessionStorage.setItem("role", response.data.role);
    sessionStorage.setItem(
      "customerId",
      response.data.customerId ? response.data.customerId : -1
    );
    sessionStorage.setItem("tokenTime", Date.now());
    sessionStorage.setItem("view_as_client", response.data.view_as_client);
    sessionStorage.setItem(
      "readonly_customer",
      response.data.readonly_customer
    );
    sessionStorage.setItem("refresh_token", response.data.refresh_token);
    let status = "prospect";
    if (response.data.view_as_client) status = "view_as_client";
    else {
      if (response.data.is_user_admin) {
        status = "admin";
      } else if (response.data.prospectUser) {
        if (response.data.customerId) status = "registered";
        else status = "prospect";
      } else status = "approved";
    }
    sessionStorage.setItem("status", status);
  } /* else {
    // Auto Logout due to invalid Token
    console.log("Unauthorized Access");
    history.push("/home/logout");
  } */
};

export const refreshToken = () => {
  const history = useHistory();

  //clearInterval(tokenCheck);
  if (!window.tokenCheck) {
    let requestPending = false;
    window.tokenCheck = setInterval(async () => {
      if (sessionStorage.getItem("refresh_token")) {
        const time =
          (Date.now() - sessionStorage.getItem("tokenTime")) / (1000 * 60);
        if (time > 4 && !requestPending) {
          requestPending = true;
          const code = {
            grant_type: "refresh_token",
            refresh_token: sessionStorage.getItem("refresh_token")
          };
          const response = await apiHandler({
            method: "POST",
            url: endpoint.LOGIN_OAUTH,
            data: code
          });
          // console.log(response);
          if (response.data.access_token) {
            sessionStorage.setItem("token", response.data.access_token);
            sessionStorage.setItem(
              "customerId",
              response.data.customerId ? response.data.customerId : -1
            );
            sessionStorage.setItem("role", response.data.role);
            sessionStorage.setItem("tokenTime", Date.now());
            sessionStorage.setItem(
              "view_as_client",
              response.data.view_as_client
            );
            sessionStorage.setItem(
              "readonly_customer",
              response.data.readonly_customer
            );
            sessionStorage.setItem(
              "refresh_token",
              response.data.refresh_token
            );
            let status = "prospect";
            if (response.data.view_as_client) status = "view_as_client";
            else {
              if (response.data.is_user_admin) {
                status = "admin";
              } else if (response.data.prospectUser) {
                if (response.data.customerId) status = "registered";
                else status = "prospect";
              } else status = "approved";
            }
            sessionStorage.setItem("status", status);
            requestPending = false;
          } else {
            // Auto Logout due to invalid Token
            console.log("Unauthorized Access");
            history.push("/home/logout");
          }
        }
      }
    }, 5000);
  }
};

export const parseCurrency = amount => {
  if (amount && isNaN(amount) && amount.indexOf(",") !== -1) {
    let newAmount = "";
    let amountArr = amount.split(",");
    for (var k = 0; k < amountArr.length; k++) {
      // Trim the excess whitespace.
      amountArr[k] = amountArr[k].replace(/^\s*/, "").replace(/\s*$/, "");
      // Add additional code here, such as:
      newAmount = newAmount.concat(amountArr[k]);
    }
    amount = newAmount;
  }
  return amount;
};

export const formatMoney = (
  amount,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    // console.log(e);
  }
};

export const formatDate = dateObj => {
  if (dateObj === null || dateObj === "") return null;

  var monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];

  var date = new Date(dateObj);
  date =
    date.getDate() +
    " " +
    monthNames[date.getMonth()] +
    " " +
    date.getFullYear();
  return date;
};

export const parseDate = weekDate => {
  if (weekDate === null || weekDate === "") return null;

  let dateObj = new Date(weekDate);

  var month =
    (dateObj.getMonth() + 1 < 10 ? "0" : "") + (dateObj.getMonth() + 1);
  var date = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate();
  return dateObj.getFullYear() + "-" + month + "-" + date;
};

export const convertUTCDateToLocalDate = date => {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
};

export const shortenDealId = dealId => {
  let newDealId = dealId;
  let index = dealId.lastIndexOf("-");
  if (index !== -1) {
    newDealId = dealId.substring(index + 1, dealId.length);
  }
  return newDealId;
};
export const sortArray = (arr, key, sortByAscending, dataType) => {
  let data =
    dataType === "string"
      ? sortByString(arr, key, sortByAscending)
      : dataType === "date"
      ? sortByDate(arr, key, sortByAscending)
      : dataType === "number"
      ? sortByNumber(arr, key, sortByAscending)
      : arr;
  return data;
};
export const sortByNumber = (arr, key, ascending) => {
  arr.sort((a, b) => {
    if (parseFloat(a[key]) < parseFloat(b[key])) {
      return ascending ? -1 : 1;
    } else {
      return ascending ? 1 : -1;
    }
  });
  return arr;
};
export const sortByString = (arr, key, ascending) => {
  arr.sort((a, b) => {
    if (a[key] < b[key]) {
      return ascending ? -1 : 1;
    } else {
      return ascending ? 1 : -1;
    }
  });
  return arr;
};
export const sortByDate = (arr, key, ascending) => {
  arr.sort((a, b) => {
    if (ascending) {
      return new Date(a[key]).getTime() - new Date(b[key]).getTime();
    } else {
      return new Date(b[key]).getTime() - new Date(a[key]).getTime();
    }
  });
  return arr;
};
// export { Context };
