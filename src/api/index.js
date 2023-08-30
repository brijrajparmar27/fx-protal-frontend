import React from "react";
// import { browserHistory } from "react-router";

import axios from "axios";
import Logout from "views/Components/logout.jsx";
import { endpoint } from "./endpoint";

async function createRequest({ headers, params, authToken }) {
  return axios.create({
    responseType: "json",
    crossdomain: true,
    baseURL: endpoint.BASE_URL_STAGING,
    headers: {
      "Content-Type": headers
        ? headers["Content-Type"] || "application/json"
        : "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + authToken,
      ...headers
    },
    params
  });
}

export const handleCatchBlock = () => {
  console.log("Something went wrong fetching apis");
  return <Logout />;
};

export const apiHandler = async ({
  url,
  method,
  headers: reqHeaders,
  data: jsonData,
  params,
  authToken,
  retryNo
}) => {
  const callAPI = async ({
    url,
    method,
    reqHeaders,
    jsonData,
    params,
    authToken,
    retryNo
  }) => {
    try {
      const request = await createRequest({ reqHeaders, params, authToken });
      let result = [];
      switch (method) {
        case "POST":
          result = await request.post(url, jsonData);
          break;
        case "DELETE":
          result = await request.delete(url);
          break;
        case "PUT":
          result = await request.put(url, jsonData);
          break;
        default:
          result = await request.get(url);
      }
      if (result) {
        const { data, headers } = result;
        if (retryNo) console.log("Retry Num - ", url, retryNo);
        if (data.errorCode && data.errorCode === 401) {
          if (!retryNo) retryNo = 0;
          if (retryNo < 4) {
            let newToken = sessionStorage.getItem("token");
            await callAPI({
              url,
              method,
              reqHeaders,
              jsonData,
              params,
              newToken,
              retryNo: retryNo + 1
            });
            // return;
          } else {
            if (retryNo && retryNo > 0) {
              console.log("DATA WITH ERROR - ", retryNo, data);
              return {data: data};
            }
            return result;
          }
          // Logout();
          // browserHistory.push("/logout");
          // return;
        } else {
          if (retryNo && retryNo > 0) {
            console.log("DATA AFTER RETRY - ", retryNo, data);
          }
          return { data, headers };
        }
      } else {
        // Logout();
        console.log("UNKNOWN - ", retryNo);
        return {data: {errorCode: 500, userDesc: "System Error"}};
      }
    } catch (error) {
      return handleCatchBlock();
      // if (error && error.response) {
      //   const { data, headers } = error.response;
      //   return { data, headers };
      // }
    }
  };

  let result = await callAPI({
    url,
    method,
    reqHeaders,
    jsonData,
    params,
    authToken,
    retryNo: 0
  });
  // console.log('RESULT - ', result);
  return result;
};


// const INITIAL_DELAY = 2000
// const MAX_ATTEMPTS = 10

// function repeatUntilSucceeds(request) {
//   return new Promise((resolve, reject) => {
//     let attempt = 0
//     let delay = INITIAL_DELAY

//     function handleErrorRec(error) {
//       if (attempt < MAX_ATTEMPTS) {
//         setTimeout(execRequestRec, delay)
//         attempt += 1
//         delay *= 2
//       } else {
//         reject(error)
//       }
//     }

//     function execRequestRec() {
//       request().then(({ data, status, statusText }) => {
//         if (status === 200) {
//           resolve(data)
//         } else {
//           handleErrorRec(new Error(statusText))
//         }
//       }).catch(handleErrorRec)
//     }

//     execRequestRec()
//   })
// }

// function fetchRetry(url, options = {}, retries = 3, backoff = 300) {
//   /* 1 */
//   const retryCodes = [408, 500, 502, 503, 504, 522, 524]
//   return fetch(url, options)
//     .then(res => {
//       if (res.ok) return res.json()

//       if (retries > 0 && retryCodes.includes(res.status)) {
//         setTimeout(() => {
//           /* 2 */
//           return fetchRetry(url, options, retries - 1, backoff * 2) /* 3 */
//         }, backoff) /* 2 */
//       } else {
//         throw new Error(res)
//       }
//     })
//     .catch(console.error)
// }