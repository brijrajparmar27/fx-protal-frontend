export const endpoint = {
  // BASE_URL_STAGING: "http://localhost/",
  BASE_URL_STAGING: window.location.origin,
  BASE_URL_STAGING_AXIOS: window.location.origin + "/",
  // BASE_URL_STAGING:
  //   "http://dev-jsi-781798588.ap-south-1.elb.amazonaws.com:9999",

  APP_LINK: "cms/url-link",
  LOGIN_OAUTH: "fx-auth-server/oauth/token",
  RESEND_OTP: "fx-auth-server/oauth/resendOtp",
  LOGIN_SUBSCRIBED_APPS: "fx-crm/user/subscribed-modules",
  USER_SIGNUP: "fx-crm/prospect/public/signup",
  VALIDATE_EMAIL: "fx-auth-server/oauth/user/isUserExist?input=",
  USER_EMAIL_SEND_OTP: "fx-crm/public/v1/verfication/sendOtp",
  USER_EMAIL_VERIFY_OTP: "fx-crm/public/v1/verfication/verify",
  USER_LIST: "fx-crm/customer/user/findAll",
  USER_DISABLE: "fx-crm/customer/user/disable/",
  USER_ENABLE: "fx-crm/customer/user/enable/",
  USER_INVITE_SEND: "fx-crm/customer/user/sendInvitation",
  USER_INFO_UPDATE: "fx-crm/user/updateUserInfo",
  USER_ROLE_UPDATE: "fx-crm/customer/user/updateRole",
  USER_PLAN_UPDATE: "fx-crm/plan/customer/upgradePlan",
  CUSTOMER_REGISTRATION: "fx-crm/customer/registration",
  CUSTOMER_REGISTER: "fx-crm/customer/register",
  UPLOAD_FILE: "fx-crm/public/uploadFile",
  // UPLOAD_FILE: "fx-crm/public/upload",
  FX_DEALS_GET: "fx-forrex/fx/deals",
  KYC_PERSON_ONLY: "fx-kyc/kyc/customer/personOnly",
  KYC_CUSTOMER_EXCUTEKYC: "fx-kyc/kyc/customer/executeKyc",
  KYC_CUSTOMER_DELETE: "fx-kyc/kyc/customer/delete",
  KYC_COMPANY_ONLY: "fx-kyc/kyc/customer/companyOnly",
  KYC_COMPANY_EXECUTEKYC: "fx-kyc/kyc/customer/executeKyc",
  KYC_CUSTOMER_IDENTITYCHECK: "fx-kyc/kyc/customer/identityCheck",
  KYC_CUSTOMER_CUSTOMER_ID: "fx-kyc/kyc/customer/find?customerId=",
  KYC_CUSTOMER_COMPANY_DIRECTOR: "fx-kyc/kyc/customer/companyAndDirectors",
  KYC_CUSTOMER_COMPANYANDDIRECTORS: "/fx-kyc/kyc/customer/companyAndDirectors",
  CUSTOMER_IDENTITYCHECK: "/fx-kyc/kyc/customer/identityCheck",
  USER_INFO: "fx-crm/user/userInfo",
  MARKET_INTELLIGENCE: "fx-forrex/fx/marketIntelligence",
  MARKET_INTELLIGENCE_NEWS: "fx-forrex/marketIntelligence",
  CURRENCIES_BASE: "fx-crm/customer/baseCurrency",
  CURRENCIES: "fx-forrex/fx/currencies",
  CALENDAR: "fx-forrex/public/calendar/holidays/",
  COUNTRIES: "fx-crm/public/countriesMetaData",
  CONTACTUS: "fx-crm/public/contactus",
  CURRENCIES_CONVERSION: "fx-forrex/fx/currencyConversion",
  WALLET_TRANSACTION: "fx-forrex/wallet/findWalletTxn",
  WALLET_FIND: "fx-forrex/wallet/findWallet",
  FIND_QUOTE: "/fx-forrex/fx/v2/findQuote",
  PLACE_TRADE: "fx-forrex/fx/v2/placeOrder",
  BENEFICIARIES_SELECTED: "/fx-forrex/fx/beneficiary/find/",
  BENEFICIARIES: "fx-forrex/fx/beneficiary/findAll",
  BENEFICIARIES_ADD: "/fx-forrex/fx/beneficiary/addBeneficiary",
  PAYMENT_OTP: "fx-forrex/fx/createPayment/validateOtp",
  PAYMENT_CREATE: "fx-forrex/fx/createPayment",
  DEALS: "fx-forrex/fx/deals",
  DEAL: "fx-forrex/fx/deal",

  DISABLE_USER: "fx-auth-server/oauth/disableUser/",
  ENABLE_USER: "fx-auth-server/oauth/enableUser/",
  CALCULATOR_GROSS_MARGIN: "fx-forrex/calculator/grossMargin",
  CALCULATOR_EXPOSURE: "fx-forrex/calculator/exposureCalculator",
  CALCULATOR_SENSITIVE_AMOUNT: "fx-forrex/calculator/updateSensitiveAmt",

  MARKET_EXCHANGE_RATE_LIVE: "fx-forrex/exchangeRate/live",
  MARKET_EXCHANGE_RATE_HISTORICAL: "fx-forrex/exchangeRate/latestHistorical",
  MARKET_EXCHANGE_RATE_BARS: "fx-forrex/exchangeRate/getBars",
  CURRENCY_ALERTS: "fx-forrex/currency/alert/findAll",
  CURRENCY_ALERT_ADD: "fx-forrex/currency/alert/add",
  CURRENCY_ALERT_DELETE: "fx-forrex/currency/alert/delete/",

  FORGET_PASSWORD: "fx-auth-server1/oauth/user/forgetPassword",
  CHANGE_PASSWORD: "fx-auth-server1/oauth/user/changePassword",
  KEEP_ME_UPDATE: "fx-crm/public/keepMeUpdated",
  UPDATE_USER_DETAIL: "fx-crm/public/customer/user/updateDetails",
  CURRENCY_PAIRS: "fx-forrex/fx/currencyPairs",
  CALCULATE_HEDGING_COST: "fx-forrex/calculate/hedgingCost",
  CALCULATOR_RISK_EXPOSURE: "fx-forrex/calculator/unhedgeRiskExposure",
  MARKET_EXCHANGE_RATE_SINGLELIVE: "fx-forrex/exchangeRate/single/live",
  MARKET_EXCHANGE_RATE_LIVEGRAPH: "fx-forrex/exchangeRate/liveGraph",
  MARKET_EXCHANGE_RATE_FORWARD: "fx-forrex/exchangeRate/forwardRate",
  CURRENCY_PERFORMANCE: "fx-forrex/currency/performance",
  CALCULATE_HEADING_COST: "fx-forrex/v2/calculate/hedgingCost",

  // Risk Radar
  RISK_RADAR_ADD_BULK_RISKS: "fx-forrex/v1/riskradar/addBulkRisks",
  RISK_RADAR_ADD_BULK_HEDGES:
    "fx-forrex/v1/riskradar/externalhedge/addBulkHedges",
  RISK_RADAR_UPDATE_BULK_HEDGES:
    "fx-forrex/v1/riskradar/externalhedge/addOrUpdate",
  RISK_RADAR_UPDATE_BULK_RISKS: "fx-forrex/v1/riskradar/risk/addOrUpdate",
  RISK_RADAR_UPDATE_SENSITIVITY: "fx-forrex/v1/riskradar/addOrUpdate",
  RISK_RADAR_GET_SENSITIVITY: "fx-forrex/v1/riskradar/sensitivitypercentage",
  RISK_RADAR_CLEAR_INPUT: "fx-forrex/v1/riskradar/delete",
  // Risk Radar Report
  RISK_RADAR_CALCULATE: "fx-forrex/v1/riskradar/calculate",
  RISK_RADAR_PAST_DATA: "fx-forrex/v1/riskradar/past-dated-risk-hedges",
  RISK_RADAR_MID_HEDGING_REPORT: "fx-forrex/v1/riskradar/calculateMidHedging",
  RISK_RADAR_CALCULATE_HEDGING_COST: "/fx-forrex/calculate/hedgingCost",
  RISK_RADAR_LINK_HEDGE: "fx-forrex/v1/riskradar/linkHedge",
  RISK_RADAR_DELINK_HEDGE: "fx-forrex/v1/riskradar/delinkHedge",
  RISK_RADAR_RISK_ANALYSIS: "fx-forrex/v1/riskradar/riskAnalysis",
  RISK_RADAR_HEDGE_EFFECTIVENESS: "fx-forrex/v1/riskradar/hedgeEffectiveness",

  // Risk Alert
  RISK_ALERT_GET: "fx-forrex/riskalert/get",
  RISK_ALERT_SAVE: "fx-forrex/riskalert/save",

  // Risk Insight
  RISKINSIGHT_ALL_QUESTIONS: "fx-forrex/v1/riskinsight/findAllQuestions",
  RISKINSIGHT_FIRST_QUESTIONS: "fx-forrex/v1/riskinsight/findFirstQuestion",
  RISKINSIGHT_NEXT_QUESTIONS: "fx-forrex/v1/riskinsight/findQuestion",
  RISKINSIGHT_DELETE_QUESTIONS: "fx-forrex/v1/riskinsight/delete",
  RISKINSIGHT_SUBMIT_ANSWER: "fx-forrex/v1/riskinsight/submitAnswer",
  RISKINSIGHT_REPORT: "fx-forrex/v1/riskinsight/findQuestionsReport",

  //Admin Module
  ADMIN_CUSTOMER: "fx-crm/admin/customer/search",
  ADMIN_SETTINGS: "fx-crm/admin/setting/find",
  ADMIN_CUSTOMER_SETTINGS: "fx-crm/admin/customer/setting/find",
  ADMIN_SETTING_UPDATE: "fx-crm/admin/setting/update",
  PLAN_VOLUME_UPDATE: "fx-crm/plan/volume/update",
  PLAN_UPGRADE: "fx-crm/plan/findUpgradablePlans",
  PLAN_FIND: "fx-crm/plan/find",
  ADMIN_ACTIVITY_DETAILS: "fx-crm/admin/adminActivity/detail",
  ADMIN_DEALS: "fx-forrex/admin/deals",
  ADMIN_DEAL: "fx-forrex/admin/deal/",
  ADMIN_CUSTOMER_UPDATE_STATUS: "fx-crm/admin/customer/updateStatus",
  ADMIN_CUSTOMER_USER_RESGISTER: "fx-crm/customer/user/register",
  ADMIN_CUSTOMER_SETTING_UPDATE: "fx-crm/admin/customer/setting/update",
  ADMIN_CUSTOMER_UPDATE_KYC_STATUS: "fx-crm/admin/customer/updateKycStatus",
  ADMIN_CUSTOMER_DUEDILIGENCE_CREATE:
    "/fx-crm/admin/customer/duediligence/create",
  ADMIN_CUSTOMER_DUEDILIGENCE_GET: "fx-crm/admin/customer/duediligence/get",
  ADMIN_CUSTOMER_DUEDILIGENCE_FIND: "fx-crm/admin/customer/duediligence/find",
  ADMIN_USERS: "fx-auth-server/admin/findAdminUsers",
  ADMIN_USER_REGISTER: "fx-auth-server/admin/register",
  ADMIN_CUSTOMER_APPLIEDASCUSTOMER: "fx-crm/admin/customer/appliedAsCustomer",
  ADMIN_CUSTOMER_CUSTOMERDETAILS:
    "fx-crm/admin/customer/customerDetails?customerId=",
  ADMIN_KYC_DETAILS_CUSTOMER: "fx-crm/admin/kyc/details/customer",
  ADMIN_CONTACTUS_FIND: "fx-crm/admin/contactUs/find",
  ADMIN_ACTIVITY_DETAIL_ACTIVITYID:
    "fx-crm/admin/adminActivity/detail?type=ENQUIRY&activityId=",
  ADMIN_ACTIVITY_DETAIL_TRADE: "fx-crm/admin/adminActivity/detail",
  ADMIN_TRADE_FIND: "fx-forrex/admin/trade/find",
  ADMIN_UPDATE_FIND: "fx-crm/admin/keepMeUpdated/find",
  ADMIN_CLIENTS: "fx-crm/admin/clients",
  ADMIN_SARREPORT_FIND: "fx-crm/admin/sarreport/find",
  ADMIN_SARREPORT_GET: "fx-crm/admin/sarreport/get/",
  ADMIN_SARREPORT_CREATE: "fx-crm/admin/sarreport/create",
  ADMIN_SIGNUP: "fx-crm/admin/signup/find",
  ADMIN_CUSTOMER_CREATE: "fx-crm/admin/customer/duediligence/create",
  ADMIN_REPORT_BENEFICIARIES: "/fx-forrex/admin/beneficiaries",
  ADMIN_TASK_FINDPENDINGTASK: "fx-crm/admin/task/findPendingTask",
  ADMIN_TASK_UPDATE: "/fx-crm/admin/task/update",
  ADMIN_CUSTOMER_PENDING_CLIENTLIST: "fx-crm/admin/customer/",
  ADMIN_TRADE_PENDING_FOREXLIST: "fx-forrex/admin/trade/",
  ADMIN_CUSTOMER_CUSTOMERDETAILS_CUSTOMERID:
    "fx-crm/admin/customer/customerDetails",
  ADMIN_TASK_DETAIL: "fx-crm/admin/task/detail",
  ADMIN_CUSTOMER_KYC_DETAILS: "fx-crm/admin/kyc/details/customer/",
  ADMIN_CUSTOMER_KYC_DELETE: "fx-kyc/kyc/customer/delete",
  CUSTOMER_FIND: "fx-kyc/kyc/customer/find",
  CUSTOMER_PERSONONLY: "/fx-kyc/kyc/customer/personOnly",

  // LIQUIDITY PROVIDER
  ADMIN_LP_LIST: "fx-forrex/v1/lp/findAll",
  ADMIN_LP_FIND_BY_ID: "fx-forrex/v1/lp/find/",
  ADMIN_LP_CREATE: "fx-forrex/v1/lp/add",
  ADMIN_LP_DEALS: "fx-forrex/v1/lp/findLPDeals",
  ADMIN_LP_UPDATE_STATUS: "fx-forrex/v1/lp/enabledisable",
  ADMIN_LP_ADD_RULE: "fx-forrex/fx/beneficiary/rules/beneficiaryAccount/",
  ADMIN_OP_WALLETS_LIST:
    "fx-forrex/admin/paymentwallet/findFxgOperationAccount",
  ADMIN_PARENT_WALLETS_LIST:
    "fx-forrex/admin/paymentwallet/findFxgParentAccount",
  ADMIN_LP_NET_AMOUNT_STATUS: "fx-forrex/v1/lp/findLpPayment",
  ADMIN_LP_UNSCHEDULE_DEAL: "fx-forrex/v1/lp/unscheduleDeal",
  ADMIN_LP_DEAL_PAYOUT: "fx-forrex/v1/lp/dealPayout",
  ADMIN_LP_NET_PAYOUT: "fx-forrex/v1/lp/netPayoutToLp",
  ADMIN_FXG_BENEFICIARY_CREATE: "fx-forrex/v1/fxg/beneficiary/create",
  ADMIN_FXG_BENEFICIARY_LIST: "fx-forrex/v1/fxg/beneficiary/findAll",
  ADMIN_FXG_BENEFICIARY_STATEMENT: "fx-forrex/v1/fxg/account/beneficiary/statement",
  ADMIN_FXG_BENEFICIARY_UPDATE_STATUS: "fx-forrex/v1/fxg/beneficiary/enabledisable",
  ADMIN_FXG_BENEFICIARY_TRANSFER_FUNDS: "fx-forrex/v1/fxg/beneficiary/transferFund",
  ADMIN_WALLET_STATEMENT: "fx-forrex/v1/fxg/account/findAccountStatement/",

  // RISK SUBSCRIPTION
  RISK_ACTIVE_PLANS: "fx-crm/master/risk/plan/findActivePlans",
  RISK_INITIATE_SUBSCRIPTION: "fx-crm/risk/plan/initiateSubscription",
  RISK_SUBSCRIPTION_PAYMENT_SETUP: "fx-crm/risk/plan/setupPaymentMethod",
  RISK_SUBSCRIPTION_PAYMENT_SETUP_STATUS: "fx-crm/risk/plan/payment-setup-status/",
  RISK_SUBSCRIPTION_PAYMENT_COLLECT_STATUS: "fx-crm/risk/plan/payment-collect-status/",
  RISK_SUBSCRIPTION_PAYMENT_METHOD_STATUS: "/fx-crm/risk/plan/payment-method-status/",
  RISK_SUBSCRIPTION_STATUS: "fx-crm/risk/plan/findRiskSubscrptionStatus",
  RISK_SUBSCRIPTION_CANCEL: "fx-crm/risk/plan/cancelFutureSubscription",
  RISK_SUBSCRIPTION_ACTIVATE: "fx-crm/risk/plan/activateRenewalSubs",
  RISK_SUBSCRIPTION_PAYMENT_METHOD: "fx-crm/risk/plan/paymentMethod",
  RISK_ADMIN_USERS_LIST: "fx-crm/risk/plan/riskSubscribedUsers",
  RISK_ADMIN_USERS_INFO: "fx-crm/user/userInfo?email=",
  RISK_INVITE_USERS: "fx-crm/prospect/user/invite",
  RISK_REINVITE_USERS: "fx-crm/prospect/user/resendInvitation",
  RISK_CLIENT_USERS_LIST: "fx-crm/prospect/user/findAll/",
  RISK_CLIENT_USERS_DETAILS: "fx-crm/prospect/user/find/",
  RISK_CLIENT_USERS_ENABLE_DISABLE: "fx-crm/prospect/user/enable-disable",
  RISK_SUBSCRIPTION_CALCULATE: "fx-crm/risk/plan/upgrade/calculate-plan-amt",
  RISK_SUBSCRIPTION_CALCULATE_NEW: "fx-crm/risk/plan/upgrade/calculate-plan-amt-new",
  RISK_SUBSCRIPTION_UPGRADE: "fx-crm/risk/plan/upgrade",
  RISK_SUBSCRIPTION_CARD_UPDATE: "fx-crm/risk/plan/update-payment-method",
  RISK_SUBSCRIPTION_MANUAL_PAY: "fx-crm/risk/plan/pay/",
  // Blogs
  FIND_ACTIVE_BLOG: "fx-crm/blog/find",
  GET_BLOG_BY_ID: "fx-crm/blog/get/1",
  UPDATE_BLOG: 'fx-crm/blog/update',
  UPLOAD_BLOG_FILE: 'fx-crm/blog/upload',
  ADD_BLOG: "fx-crm/blog/create",
  ENABLE_DISABLE_BLOG: 'fx-crm/blog/enable-disable/',
  DELETE_BLOG: "fx-crm/blog//delete",
  // XERO
  XERO_CONNECT: "fx-forrex/v1/xero/accounting/authorize?redirectUri=",
  XERO_AUTH_LOGIN: "fx-forrex/v1/xero/accounting/access-token",
  XERO_GET_INVOICES: "fx-forrex/v1/xero/accounting/invoices?baseCurrency="

  // http://localhost:9092/fx-forrex/v1/xero/accounting/access-token?code=ce99-6g0Umqg-h-qN6STyab6zEHC3aZUOS0BlRw_7TA&scope=openid%20profile%20email%20accounting.transactions&state=44b72abc-26d6-4d47-aff4-6bc61aa5a35a&session_state=GkMaKqOpieqzpONgXnUV96jovhsOXHEAH8gvcqVngV4.GEenIOloZ7ISTS2Sk2y_Bg

};

// ,
//       noticeModal: false,
//       noticeModalHeader: "",
//       noticeModalErrMsg: ""

//       closeNoticeModal = () => {
//         this.setState({
//           noticeModal: false,
//           noticeModalHeader: "",
//           noticeModalErrMsg: ""
//         });
//       };

// import { apiHandler } from "api";
// import { endpoint } from "api/endpoint";

// const code = {
//   mfa_code: code1 + code2,
//   grant_type: "mfa",
//   mfa_token: mfa_token
// };
// const res = await apiHandler({
//   method: "POST",
//   url: endpoint.LOGIN_OAUTH,
//   data: code,
//   authToken: sessionStorage.getItem("token")
// });

// const res = await apiHandler({
//   url: endpoint.LOGIN_OAUTH,
//   authToken: sessionStorage.getItem("token")
// });

// if (res.data.errorCode) {
//   if (res.data.errorCode === 401) {
//     console.log("Unauthorized Access");
//     this.props.history.push("/home/logout");
//     return;
//   } else if (res.data.errorCode === 403) {
//     return;
//   } else {
//     this.setState({
//       noticeModal: true,
//       noticeModalHeader: "Error",
//       noticeModalErrMsg: res.data.userDesc
//     });
//   }
// }

// this.setState({
//   isNoticeModal: true,
//   noticeModalHeaderMsg: "Error",
//   noticeModalMsg: res.data.userDesc
// });

// {this.state.noticeModal && (
//   <NoticeModal
//       noticeModal={this.state.noticeModal}
//       noticeModalHeader={this.state.noticeModalHeader}
//       noticeModalErrMsg={this.state.noticeModalErrMsg}
//       closeModal={this.closeNoticeModal}
//   />
// )}


// amount: 100
// createdDate: "2022-01-07T07:54:12.701594"
// creditor: "LLOYD Bank"
// currency: "GBP"
// debitor: "FXG_OPERATION"
// provider: "CLEARBANK"
// reason: ""
// reference: "Testing Payment"
// status: "Settled"
// supportedDocLink: null
// supportedDocType: "Invoice"
// transactionId: "ieUzHsDzZvTrf5NBSksh"