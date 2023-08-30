import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import cx from "classnames";
import { withRouter } from "react-router-dom";

// @material-ui/icons
import FileUpload from "components/FileUpload/FileUpload.jsx";
import Work from "@material-ui/icons/Work";
// import LockOutline from "@material-ui/icons/LockOutline";
import { validate } from "../../utils/Validator";
import { formatMoney, parseCurrency } from "../../utils/Utils";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomNumberFormat from "components/CustomNumberFormat/CustomNumberFormat.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardText from "components/Card/CardText.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import Search from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import StatusCard from "components/StatusCard/StatusCard.jsx";
import DealExecutedDialog from "views/Components/DealExecutedDialog.jsx";
import { apiHandler } from "api";
import { endpoint } from "api/endpoint";

import {
  cardTitle,
  roseColor,
  primaryColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const documentTypes = [
  {
    value: "Invoice",
    label: "Invoice from Customer"
  },
  {
    value: "Contract",
    label: "Contractual Agreement"
  },
  {
    value: "Other",
    label: "Any Other"
  }
];

const styles = theme => ({
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  title: {
    color: "black",
    position: "absolute",
    marginLeft: 20,
    marginTop: 20
  },
  cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  cardCategoryWhite: {
    margin: "0",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: ".875rem"
  },
  cardCategory: {
    color: "#999999",
    marginTop: "10px"
  },
  icon: {
    color: "#333333",
    margin: "10px auto 0",
    width: "130px",
    height: "130px",
    border: "1px solid #E5E5E5",
    borderRadius: "50%",
    lineHeight: "174px",
    "& svg": {
      width: "55px",
      height: "55px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      width: "55px",
      fontSize: "55px"
    }
  },
  iconRose: {
    color: roseColor
  },
  marginTop30: {
    marginTop: "30px"
  },
  testimonialIcon: {
    marginTop: "30px",
    "& svg": {
      width: "40px",
      height: "40px"
    }
  },
  input: {
    backgroundColor: "black",
    borderRadius: 4,
    color: "white"
  },
  inputGrey: {
    backgroundColor: "#EEEAEB",
    borderRadius: 4,
    color: "white"
  },
  labelRootInfo: {
    fontSize: "x-small",
    textAlign: "right",
    marginLeft: -46
  },
  info: {
    display: "inline-block",
    verticalAlign: "middle",
    fontSize: 14,
    marginRight: 5
  },
  cardTestimonialDescription: {
    fontStyle: "italic",
    color: "#999999"
  },
  listItemIcon: {
    marginTop: "-3px",
    top: "0px",
    position: "relative",
    marginRight: "3px",
    width: "20px",
    height: "20px",
    verticalAlign: "middle",
    color: "inherit",
    display: "inline-block"
  },
  filledSelect: {
    color: "white !important"
  },
  white: {
    color: "white"
  },
  selectDropDown: {
    backgroundColor: "#999999",
    paddingTop: 0,
    color: "white"
  },
  helperText: {
    backgroundColor: "white",
    paddingTop: 5,
    marginTop: 0,
    textAlign: "right"
  },
  uploadLabel: {
    alignSelf: "center",
    paddingRight: 20
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  linkButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    display: "inline",
    margin: 0,
    padding: 0,
    "&:hover": {
      textDecoration: "none"
    },
    "&:focus": {
      textDecoration: "none"
    }
  },
  ...customSelectStyle,
  ...regularFormsStyle
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class NewPayment extends React.Component {
  error = {
    companyNameErrorMsg: {
      required: "Company name is required",
      range: "Company name should be 1 to 200 characters"
    },
    emailAddressErrorMsg: {
      required: "Corporate Email is required",
      company: "Please enter a corporate email",
      valid: "Please enter a valid email"
    },
    bankNameErrorMsg: {
      required: "Bank Name is required"
    },
    addressErrorMsg: {
      required: "Address is required"
    },
    cityErrorMsg: {
      required: "City is required"
    },
    postalCodeErrorMsg: {
      required: "Postal code is required"
    },
    countryCodeErrorMsg: {
      required: "Country is required"
    },
    bicNumberErrorMsg: {
      required: "BIC Number is required"
    },
    accountNumberErrorMsg: {
      required: "Account Number is required"
    },
    paymentReasonErrorMsg: {
      required: "Payment reason is required",
      range: "Reason should be 1 to 100 characters"
    },
    referenceErrorMsg: {
      required: "Payment reference is required",
      range: "Reason should be 1 to 100 characters"
    },
    amountErrorMsg: {
      required: "Payment amount is required"
    },
    transactionDateErrorMsg: {
      required: "Payment date value is required",
      valid: "Old Dates are not allowed. Please select a valid Payment date"
    },
    docCategoryErrorMsg: {
      required: "Document Category is required"
    },
    otherDocCategoryErrorMsg: {
      required: "Document Category is required"
    },
    paymentCurrencyErrorMsg: {
      required: "Payment date value is required"
    }
  };

  initialState = {};

  constructor(props) {
    super(props);
    this.fileUploadComponent = React.createRef();

    this.initialState = {
      beneficiaries: [],
      selecetdBeneficiary: {},
      beneficiarySearchName: "",
      isSelectedBeneficiary: false,
      enableNewBeneficiaryAdd: false,
      baseCurrencyCode: "",
      payment: "",
      turnover: "",
      desgin: false,
      companyName: "",
      companyNameState: "",
      companyNamePristine: true,
      companyNameErrorMsg: [],
      bankCurrency: "",
      emailAddress: "",
      emailAddressState: "",
      emailAddressPristine: true,
      emailAddressErrorMsg: [],
      bankName: "",
      bankNameState: "",
      bankNamePristine: true,
      bankNameErrorMsg: [],
      address: "",
      addressState: "",
      addressPristine: true,
      addressErrorMsg: [],
      city: "",
      cityState: "",
      cityPristine: true,
      cityErrorMsg: [],
      postalCode: "",
      postalCodeState: "",
      postalCodePristine: true,
      postalCodeErrorMsg: [],
      countries: [],
      countryCode: "",
      countryCodeState: "",
      countryCodePristine: true,
      countryCodeErrorMsg: [],
      countryName: "",
      bicNumber: "",
      bicNumberState: "",
      bicNumberPristine: "",
      bicNumberErrorMsg: "",
      accountNumber: "",
      accountNumberState: "",
      accountNumberPristine: true,
      accountNumberErrorMsg: [],
      paymentReason: "",
      paymentReasonState: "",
      paymentReasonPristine: true,
      paymentReasonErrorMsg: [],
      reference: "",
      referenceState: "",
      referencePristine: true,
      referenceErrorMsg: [],
      supportingDocFile: "",
      isOtherCategory: false,
      otherDocCategory: "",
      otherDocCategoryState: "",
      otherDocCategoryPristine: true,
      otherDocCategoryErrorMsg: [],
      transactionDate: null,
      transactionDateState: "",
      transactionDateErrorMsg: [],
      amount: "0",
      amountState: "",
      amountPristine: true,
      amountErrorMsg: [],
      amountValue: "0",
      develop: false,
      checked: false,
      docCategory: "",
      docCategoryState: "",
      docCategoryErrorMsg: "",
      paymentCurrency: "",
      paymentCurrencyState: "",
      paymentCurrencyErrorMsg: [],
      currency: "",
      currencies: [],
      wallets: [],
      selectedWallet: "",
      walletStatus: {},
      isDealExecuted: false,
      fee: 0,
      trade: "",
      paymentId: "",
      disabledPaymentButton: false,
      callInProgress: false,
      waitHeader: "",
      otpModal: false,
      code1: "",
      isNoticeModal: false,
      noticeModalMsg: "",
      noticeModalHeaderMsg: ""
    };

    this.state = this.initialState;
  }

  currencyLabel = {
    USD: "US Dollars",
    EUR: "European Dollars",
    CAD: "Canada Dollars"
  };

  componentDidMount = () => {
    let viewClient = sessionStorage.getItem("view_as_client");
    let readonly_customer = sessionStorage.getItem("readonly_customer");
    if (viewClient === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg: "You are not authorized to perform the PAYMENT Deal"
      });
    } else if (readonly_customer === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg:
          "You cannot perform the PAYMENT Deal. Please contact your Admin"
      });
    }
    this.initialzeData();
  };
  initialzeData = () => {
    this.setState({
      transactionDate: this.getNextWorkingday(new Date())
    });
    this.getBaseCurrency();
    this.getCountries();
    this.getCurrencies();
    this.getBeneficiaries();
  };
  getNextWorkingday(date) {
    var tomorrow = new Date(date.setDate(date.getDate() + 1));
    return tomorrow.getDay() % 6 ? tomorrow : this.getNextWorkingday(tomorrow);
  }
  getBaseCurrency = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES_BASE,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: res.data.userDesc
      });
      return;
    } else {
      this.setState(
        {
          baseCurrencyCode: res.data.baseCurrency
        },
        () => {
          this.getWallets();
        }
      );
    }
  };
  getCountries = async () => {
    const res = await apiHandler({
      url: endpoint.COUNTRIES,
      authToken: sessionStorage.getItem("token")
    });
    const countries = res.data.countryMetaData;
    this.setState({ countries: countries });
  };
  getBeneficiaries = async () => {
    const res = await apiHandler({
      url: endpoint.BENEFICIARIES,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ beneficiaries: res.data }, () => {
      const { match } = this.props;
      if (match.params.beneficiaryId) {
        this.getWallets(match.params.beneficiaryId, res.data);
      }
    });
  };
  selectBeneficiary = (beneficiaryId, allBeneficiaries) => {
    let beneficiaries = allBeneficiaries.filter(beneficiary => {
      if (beneficiary.id === parseInt(beneficiaryId)) return true;
      else return false;
    });
    let baseCurrencyCode = this.state.baseCurrencyCode;
    if (beneficiaries.length > 0) {
      // check if wallet is available for selected beneficiary currency code
      let selectedWallet = this.state.wallets.filter(wallet => {
        return wallet.currencyCode === beneficiaries[0].currencyCode;
      });
      let paymentCurrency = baseCurrencyCode;
      if (selectedWallet) paymentCurrency = beneficiaries[0].currencyCode;

      this.setState(
        {
          selecetdBeneficiary: beneficiaries[0],
          isSelectedBeneficiary: true,
          paymentCurrency: paymentCurrency
        },
        () => {
          this.selectWalletForCurrency(paymentCurrency);
        }
      );
    } else {
      this.setState(
        {
          selecetdBeneficiary: {},
          isSelectedBeneficiary: false,
          paymentCurrency: baseCurrencyCode
        },
        () => {
          this.selectWalletForCurrency(baseCurrencyCode);
        }
      );
    }
  };

  getCurrencies = async () => {
    const res = await apiHandler({
      url: endpoint.CURRENCIES,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ currencies: res.data.currrencies });
  };
  getWallets = async (beneficiaryId, allBeneficiaries) => {
    if (this.state.wallets.length > 0) return;

    const res = await apiHandler({
      url: endpoint.WALLET_FIND,
      authToken: sessionStorage.getItem("token")
    });
    this.setState(
      {
        wallets: res.data
      },
      () => {
        if (beneficiaryId) {
          this.selectBeneficiary(beneficiaryId, allBeneficiaries);
        } else {
          // check if wallet is available for base currency else first wallet
          let selectedWallet = res.data.find(wallet => {
            return wallet.currencyCode === this.state.baseCurrencyCode;
          });
          if (selectedWallet) {
            this.selectWalletForCurrency(this.state.baseCurrencyCode);
          } else {
            this.selectWalletForCurrency(res.data[0].currencyCode);
          }
        }
      }
    );
  };
  selectWalletForCurrency = currencyCode => {
    if (currencyCode && currencyCode !== "") {
      let selectedWallet = this.state.wallets.find(wallet => {
        return wallet.currencyCode === currencyCode;
      });
      if (selectedWallet) {
        this.setState(
          {
            selectedWallet: selectedWallet
          },
          () => {
            // this.getCurrencyConversion(selectedWallet);
          }
        );
      } else if (this.state.wallets.length > 0) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "FXGuard says: There is no Wallet for this currency. Please deposit funds in this currency, or do a Spot deal to buy the payment currency from a currency which you currently have in your Wallet. You will then be able to book Payment in this currency"
        });
      }
    }
  };

  getCurrencyConversion = async wallet => {
    if (typeof wallet === "undefined") return;

    if (wallet.currencyCode === this.state.baseCurrencyCode) {
      let walletStatus = {
        availableAmount: wallet.balanceAmount,
        requiredAmount: +this.state.amountValue + +this.state.fee,
        remainingAmount:
          wallet.balanceAmount - (+this.state.amountValue + +this.state.fee),
        convertedExchangeRate: 1,
        currencyCode: wallet.currencyCode,
        baseCurrency: this.state.baseCurrencyCode
      };

      this.setState({ walletStatus: walletStatus });
      return;
    }

    let currencyConversionParam = {
      baseCurrency: this.state.baseCurrencyCode,
      currencies: [
        {
          currencyCode: wallet.currencyCode,
          amount: wallet.balanceAmount
        },
        {
          currencyCode: wallet.currencyCode,
          amount: +this.state.amountValue + +this.state.fee
        },
        {
          currencyCode: wallet.currencyCode,
          amount:
            wallet.balanceAmount - (+this.state.amountValue + +this.state.fee)
        }
      ]
    };
    const res = await apiHandler({
      method: "POST",
      url: endpoint.CURRENCIES_CONVERSION,
      data: currencyConversionParam,
      authToken: sessionStorage.getItem("token")
    });
    const { currencies, baseCurrency } = res.data;

    let walletStatus = {
      availableAmount: currencies[0].convertedAmount.toFixed(2),
      requiredAmount: currencies[1].convertedAmount.toFixed(2),
      remainingAmount: currencies[2].convertedAmount.toFixed(2),
      convertedExchangeRate: currencies[0].exchangeRate,
      currencyCode: currencies[0].currencyCode,
      baseCurrency: baseCurrency
    };

    this.setState({ walletStatus: walletStatus });
  };

  change = (event, stateName, rules) => {
    this.setState(
      validate(event.target.value, stateName, this.state, rules, this.error)
    );
  };
  disableWeekends = date => {
    return date ? date.getDay() === 0 || date.getDay() === 6 : null;
  };
  handleDateChange = date => {
    // console.log(date);
    this.setState(
      validate(
        date,
        "transactionDate",
        this.state,
        [{ type: "oldDate" }],
        this.error
      )
    );
    // this.setState({
    //   transactionDate: date
    // });
  };

  parseDate = dateObj => {
    if (dateObj === null || dateObj === "") return null;

    var month =
      (dateObj.getMonth() + 1 < 10 ? "0" : "") + (dateObj.getMonth() + 1);
    var date = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate();
    return dateObj.getFullYear() + "-" + month + "-" + date;
  };

  isValidated = () => {
    if (
      this.state.companyNameState === "success" &&
      this.state.emailAddressState === "success" &&
      this.state.bankNameState === "success" &&
      this.state.addressState === "success" &&
      this.state.cityState === "success" &&
      this.state.postalCodeState === "success" &&
      this.state.countryCodeState === "success" &&
      this.state.bicNumberState === "success" &&
      this.state.accountNumberState === "success" &&
      this.state.paymentReasonState === "success" &&
      this.state.referenceState === "success" &&
      this.state.transactionDateState === "success" &&
      this.state.amountState === "success"
    ) {
      return true;
    } else {
      if (this.state.companyNameState !== "success") {
        this.setState({ companyNameState: "error" });
      }
      if (this.state.emailAddressState !== "success") {
        this.setState({ emailAddressState: "error" });
      }
      if (this.state.bankNameState !== "success") {
        this.setState({ bankNameState: "error" });
      }
      if (this.state.addressState !== "success") {
        this.setState({ addressState: "error" });
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
      if (this.state.bicNumberState !== "success") {
        this.setState({ bicNumberState: "error" });
      }
      if (this.state.accountNumberState !== "success") {
        this.setState({ accountNumberState: "error" });
      }
      if (this.state.paymentReasonState !== "success") {
        this.setState({ paymentReasonState: "error" });
      }
      if (this.state.referenceState !== "success") {
        this.setState({ referenceState: "error" });
      }
      if (this.state.transactionDateState !== "success") {
        this.setState({ transactionDateState: "error" });
      }
      if (this.state.amountState !== "success") {
        this.setState({ amountState: "error" });
      }
    }
    return false;
  };
  isPaymentValidated = () => {
    if (
      this.state.paymentReasonState === "success" &&
      this.state.referenceState === "success" &&
      this.state.amountState === "success"
    ) {
      return true;
    } else {
      if (this.state.paymentReasonState !== "success") {
        this.setState({ paymentReasonState: "error" });
      }
      if (this.state.referenceState !== "success") {
        this.setState({ referenceState: "error" });
      }
      if (this.state.amountState !== "success") {
        this.setState({ amountState: "error" });
      }
    }
    return false;
  };

  handleBuyCurrency = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleCountryCode = event => {
    this.setState({
      [event.target.name]: event.target.value,
      countryName: event.currentTarget.innerText
    });
  };

  handleDocCategory = event => {
    let isOtherCategory = false;
    if (event.target.value === "Other") {
      isOtherCategory = true;
    }
    this.setState(
      validate(
        event.target.value,
        "docCategory",
        this.state,
        [{ type: "required" }],
        this.error
      )
    );
    this.setState({
      isOtherCategory: isOtherCategory
    });
  };

  handlePaymentCurrency = event => {
    let selectedWallet = this.state.wallets.find(wallet => {
      return wallet.currencyCode === event.target.value;
    });
    if (selectedWallet) {
      this.selectWalletForCurrency(event.target.value);
      this.setState(
        validate(
          event.target.value,
          "paymentCurrency",
          this.state,
          [{ type: "required" }],
          this.error
        )
      );
    } else {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "FXGuard says: There is no Wallet for this currency. Please deposit funds in this currency, or do a Spot deal to buy the payment currency from a currency which you currently have in your Wallet. You will then be able to book Payment in this currency"
      });
    }
  };

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value });
  };
  handleAmountChange = name => event => {
    let amountValue = parseCurrency(event.target.value);
    let fee = 0;
    if (+event.target.value > 0) fee = 10;
    this.setState(
      { [name]: event.target.value, fee: fee, amountValue: amountValue },
      () => {
        // this.getCurrencyConversion(this.state.selectedWallet);
      }
    );
  };

  validateOTP = async () => {
    const otpDetails = {
      id: this.state.paymentId,
      otp: this.state.code1
    };
    this.setState({
      callInProgress: true,
      waitHeader: "OTP validation is in progress..."
    });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.PAYMENT_OTP,
      data: otpDetails,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false, waitHeader: "", code1: "" });
    if (res.data.errorCode) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: "FXGuard says: " + res.data.userDesc
      });
    } else {
      this.closeOtpModal();
      let trade = res.data;
      trade.totalAmountToPay = trade.totalAmountToPay.toFixed(2);
      trade.dealType = "Payment";
      trade.settlementDate = this.parseDate(this.state.transactionDate);
      trade.soldCurrencyCode = this.state.selectedWallet.currencyCode;
      trade.wallet = this.state.selectedWallet;
      trade.walletStatus = {
        currencyCode: this.state.selectedWallet.currencyCode,
        availableAmount: (+this.state.selectedWallet.balanceAmount).toFixed(2),
        remainingAfterDeal: (
          +this.state.selectedWallet.balanceAmount -
          +this.state.fee -
          +this.state.amountValue
        ).toFixed(2)
      };
      this.setState({
        isDealExecuted: true,
        code1: "",
        trade: trade
      });
    }
  };

  resetOTP = async () => {
    const data = {
      access_token: sessionStorage.getItem("token")
    };
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.RESEND_OTP,
      data: data,
      authToken: sessionStorage.getItem("token")
    });
    // console.log(res.data);
    if (res.data.errorCode) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: "FXGuard says: " + res.data.userDesc
      });
    } else {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "SUCCESS",
        noticeModalMsg: "Please check your Email for new OTP code."
      });
    }
  };

  uploadSupportingDocument = async paymentDetails => {
    if (this.state.supportingDocFile !== "") {
      const formData = new FormData();
      formData.append("file", this.state.supportingDocFile);

      const res = await apiHandler({
        method: "POST",
        url: endpoint.UPLOAD_FILE,
        data: formData,
        authToken: sessionStorage.getItem("token")
      });
      if (res.data.errorCode) {
        this.setState({
          callInProgress: false,
          waitHeader: "",
          disabledPaymentButton: false,
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc
        });
      } else {
        paymentDetails = {
          ...paymentDetails,
          supportingDocument: res.data.name
        };
        // res.data.path
        this.paymentProcess(paymentDetails);
      }
    } else {
      paymentDetails = {
        ...paymentDetails,
        supportingDocument: null
      };
      // res.data.path
      this.paymentProcess(paymentDetails);
    }
  };
  paymentProcess = async paymentDetails => {
    const res = await apiHandler({
      method: "POST",
      url: endpoint.PAYMENT_CREATE,
      data: paymentDetails,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({
      callInProgress: false,
      waitHeader: "",
      disabledPaymentButton: false
    });
    if (res.data.paymentStatus === "PENDING_AUTH")
      this.setState({ paymentId: res.data.paymentId, otpModal: true });
    else if (res.data.errorCode) {
      if (res.data.errorCode === 403) {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg:
            "You do not have permission to create a Payment. Please contact your Admin."
        });
      } else {
        this.setState({
          isNoticeModal: true,
          noticeModalHeaderMsg: "Error",
          noticeModalMsg: res.data.userDesc
        });
      }
    }
  };
  createPayment = () => {
    if (!this.state.isSelectedBeneficiary) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: "Search or create new Beneficiary for Payment"
      });
      return;
    }
    // Check for Wallet Amount
    if (this.state.amountValue > this.state.selectedWallet.balanceAmount) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg:
          "FXGuard says: There is not enough money in this wallet. Please deposit funds in this currency, or do a Spot deal to buy the payment currency from a currency which you currently have in your Wallet. You will then be able to book Payment in this currency"
      });
      return;
    }
    if (!this.isPaymentValidated()) return;

    this.setState({
      disabledPaymentButton: true,
      callInProgress: true,
      waitHeader: "Payment in progress..."
    });
    const paymentDetails = {
      beneficiaryId: this.state.selecetdBeneficiary.id,
      beneficiaryName: this.state.selecetdBeneficiary.companyName,
      beneficiaryAddress: this.state.selecetdBeneficiary.address,
      beneficiaryAccountNo: this.state.selecetdBeneficiary.accountNumber,
      paymentReason: this.state.paymentReason,
      reference: this.state.reference,
      documentCategory: this.state.isOtherCategory
        ? this.state.otherDocCategory
        : this.state.docCategory,
      transactionDate: this.parseDate(this.state.transactionDate),
      currencyCode: this.state.paymentCurrency,
      fee: this.state.fee,
      transferAmount: this.state.amountValue
    };
    this.uploadSupportingDocument(paymentDetails);
  };

  addBeneficiary = async () => {
    if (!this.isValidated()) return;
    const beneficiary = {
      companyName: this.state.companyName,
      email: this.state.emailAddress,
      bankName: this.state.bankName,
      currencyCode: this.state.bankCurrency,
      address: this.state.address,
      city: this.state.city,
      postalCode: this.state.postalCode,
      countryCode: this.state.countryCode,
      countryName: this.state.countryName,
      bicNumber: this.state.bicNumber,
      accountNumber: this.state.accountNumber
    };
    this.setState({
      callInProgress: true,
      waitHeader: "Add Beneficiary is in progress..."
    });
    const res = await apiHandler({
      method: "POST",
      url: endpoint.BENEFICIARIES_ADD,
      data: beneficiary,
      authToken: sessionStorage.getItem("token")
    });
    this.setState({ callInProgress: false, waitHeader: "" });
    if (res.data.errorCode) {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Error",
        noticeModalMsg: res.data.userDesc
      });
    } else {
      beneficiary.id = res.data.beneficiaryId;
      this.setState(
        {
          enableNewBeneficiaryAdd: false,
          selecetdBeneficiary: beneficiary,
          paymentCurrency: beneficiary.currencyCode,
          isSelectedBeneficiary: true
        },
        () => {
          this.selectWalletForCurrency(beneficiary.currencyCode);
        }
      );
    }
  };

  searchBeneficiary = (name, event) => {
    let beneficiaries = [];
    this.setState({
      beneficiarySearchName: event.target.value
    });
    beneficiaries = this.state.beneficiaries.filter(beneficiary => {
      const name = beneficiary.companyName;
      const index = name
        .toLowerCase()
        .indexOf(event.target.value.toLowerCase());
      if (index !== -1) return true;
      else return false;
    });
    let baseCurrencyCode = this.state.baseCurrencyCode;
    if (event.target.value !== "" && beneficiaries.length > 0) {
      this.setState(
        {
          selecetdBeneficiary: beneficiaries[0],
          isSelectedBeneficiary: true,
          enableNewBeneficiaryAdd: false,
          paymentCurrency: beneficiaries[0].currencyCode
            ? beneficiaries[0].currencyCode
            : baseCurrencyCode
        },
        () => {
          this.selectWalletForCurrency(beneficiaries[0].currencyCode);
        }
      );
    } else {
      this.setState(
        {
          selecetdBeneficiary: {},
          isSelectedBeneficiary: false,
          paymentCurrency: baseCurrencyCode
        },
        () => {
          this.selectWalletForCurrency(baseCurrencyCode);
        }
      );
    }
  };
  enableCreateBeneficiary = () => {
    let viewClient = sessionStorage.getItem("view_as_client");
    let readonly_customer = sessionStorage.getItem("readonly_customer");
    if (viewClient === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg: "You are not authorised to add beneficiaries"
      });
    } else if (readonly_customer === "true") {
      this.setState({
        isNoticeModal: true,
        noticeModalHeaderMsg: "Information",
        noticeModalMsg:
          "You cannot create a Beneficiary. Please contact your Admin"
      });
    } else {
      this.setState({
        enableNewBeneficiaryAdd: true
      });
    }
  };
  handleNoticeModalClose = () => {
    this.setState({
      isNoticeModal: false,
      noticeModalHeaderMsg: "",
      noticeModalMsg: ""
    });
  };
  getFile = (name, file) => {
    // const file = event.target.files[0];
    this.setState({ [name]: file });
  };
  closeModal = () => {
    this.setState(this.initialState);
    this.initialzeData();
    this.fileUploadComponent.current.handleRemove();
  };

  closeOtpModal = () => {
    this.setState({ otpModal: false });
  };

  render() {
    const { classes } = this.props;
    const searchButton = classes.top + " " + classes.searchButton;
    return (
      <>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={7}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <h4>
                  <b>New Payment</b>
                </h4>
              </GridItem>
              <GridItem xs={12} sm={8} lg={12}>
                <Card>
                  <CardHeader color="warning" text>
                    <CardText color="warning">
                      <Work className={classes.listItemIcon} />
                    </CardText>
                    <span className={classes.title}>
                      Beneficiary Information
                    </span>
                  </CardHeader>
                  <CardBody>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <form id="newBeneficiaryId1" className={classes.form}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12} lg={4}>
                            <CustomInput
                              formControlProps={{
                                className: classes.top + " " + classes.search
                              }}
                              inputProps={{
                                placeholder: "Find by alias",
                                value: this.state.beneficiarySearchName,
                                inputProps: {
                                  "aria-label": "Search",
                                  className: classes.searchInput,
                                  onChange: event =>
                                    this.searchBeneficiary("search", event)
                                }
                              }}
                            />
                            <Button
                              color="white"
                              aria-label="edit"
                              justIcon
                              round
                              className={searchButton}
                            >
                              <Search
                                className={
                                  classes.headerLinksSvg +
                                  " " +
                                  classes.searchIcon
                                }
                              />
                            </Button>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12} lg={8}>
                            {this.state.isSelectedBeneficiary && (
                              <GridContainer justify="center">
                                <GridItem xs={12} sm={12} md={12} lg={5}>
                                  <label className={classes.uploadLabel}>
                                    Name:{" "}
                                  </label>
                                  <label className={classes.uploadLabel}>
                                    {this.state.selecetdBeneficiary.companyName}
                                  </label>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={7}>
                                  <label className={classes.uploadLabel}>
                                    Location:{" "}
                                  </label>
                                  <label className={classes.uploadLabel}>
                                    {this.state.selecetdBeneficiary.city}
                                    {", "}
                                    {this.state.selecetdBeneficiary.countryName}
                                  </label>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={5}>
                                  <label className={classes.uploadLabel}>
                                    Account:{" "}
                                  </label>
                                  <label className={classes.uploadLabel}>
                                    {
                                      this.state.selecetdBeneficiary
                                        .accountNumber
                                    }
                                  </label>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={7}>
                                  <label className={classes.uploadLabel}>
                                    Currency:{" "}
                                  </label>
                                  <label className={classes.uploadLabel}>
                                    {
                                      this.state.selecetdBeneficiary
                                        .currencyCode
                                    }
                                  </label>
                                </GridItem>
                              </GridContainer>
                            )}
                            {!this.state.isSelectedBeneficiary && (
                              <GridContainer justify="center">
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                  <label className={classes.uploadLabel}>
                                    No Beneficiary found by that alias.{" "}
                                    <a
                                      href="javascript:void(0);"
                                      onClick={this.enableCreateBeneficiary}
                                    >
                                      {" "}
                                      Create it.
                                    </a>
                                  </label>
                                </GridItem>
                              </GridContainer>
                            )}
                          </GridItem>
                        </GridContainer>
                      </form>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      {this.state.enableNewBeneficiaryAdd && (
                        <form id="newBeneficiaryId" className={classes.form}>
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={12} lg={8}>
                              <CustomInput
                                success={
                                  this.state.companyNameState === "success"
                                }
                                error={this.state.companyNameState === "error"}
                                helpText={
                                  this.state.companyNameState === "error" &&
                                  this.state.companyNameErrorMsg[0]
                                }
                                labelText="Company Name*"
                                id="np_companyName"
                                // inputProps={{
                                //   value: this.state.firstName,
                                //   onChange: this.handleChange
                                // }}
                                inputProps={{
                                  value: this.state.companyName,
                                  onChange: event =>
                                    this.handleChange("companyName", event)
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: event => {
                                    this.setState({
                                      companyNamePristine: false
                                    });
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
                                    if (!this.state.companyNamePristine) {
                                      this.setState({
                                        companyNamePristine: false
                                      });
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
                                    }
                                  }
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={4}>
                              <CustomInput
                                success={
                                  this.state.emailAddressState === "success"
                                }
                                error={this.state.emailAddressState === "error"}
                                helpText={
                                  this.state.emailAddressState === "error" &&
                                  this.state.emailAddressErrorMsg[0]
                                }
                                labelText="Email Address*"
                                id="np_emailAddress"
                                inputProps={{
                                  value: this.state.emailAddress,
                                  onChange: event =>
                                    this.handleChange("emailAddress", event)
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: event => {
                                    this.setState({
                                      emailAddressPristine: false
                                    });
                                    this.change(event, "emailAddress", [
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
                                    if (!this.state.emailAddressPristine) {
                                      this.setState({
                                        emailAddressPristine: false
                                      });
                                      this.change(event, "emailAddress", [
                                        { type: "required" },
                                        {
                                          type: "length",
                                          params: {
                                            min: 1,
                                            max: 100
                                          }
                                        }
                                      ]);
                                    }
                                  }
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={8}>
                              <CustomInput
                                success={this.state.bankNameState === "success"}
                                error={this.state.bankNameState === "error"}
                                helpText={
                                  this.state.bankNameState === "error" &&
                                  this.state.bankNameErrorMsg[0]
                                }
                                labelText="Bank Name*"
                                id="np_bankName"
                                inputProps={{
                                  value: this.state.bankName,
                                  onChange: event =>
                                    this.handleChange("bankName", event)
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: event => {
                                    this.setState({ bankNamePristine: false });
                                    this.change(event, "bankName", [
                                      { type: "required" }
                                    ]);
                                  },
                                  onChange: event => {
                                    if (!this.state.bankNamePristine) {
                                      this.setState({
                                        bankNamePristine: false
                                      });
                                      this.change(event, "bankName", [
                                        { type: "required" }
                                      ]);
                                    }
                                  }
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={4}>
                              <FormControl
                                fullWidth
                                className={classes.filledSelect}
                              >
                                <FormHelperText
                                  style={{
                                    backgroundColor: "white",
                                    paddingTop: 5,
                                    marginTop: 0,
                                    textAlign: "right"
                                  }}
                                >
                                  Account Currency*
                                </FormHelperText>
                                <Select
                                  MenuProps={{
                                    className: classes.selectMenu
                                  }}
                                  value={this.state.bankCurrency}
                                  onChange={this.handleBuyCurrency}
                                  inputProps={{
                                    name: "bankCurrency",
                                    id: "bankCurrency",
                                    classes: {
                                      icon: classes.white,
                                      root: classes.selectDropDown
                                    }
                                  }}
                                >
                                  <MenuItem
                                    disabled
                                    key={"currencyText"}
                                    classes={{
                                      root: classes.selectMenuItem
                                    }}
                                  >
                                    Choose Currency
                                  </MenuItem>
                                  {this.state.currencies.map(item => (
                                    <MenuItem
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value={item.currencyCode}
                                      key={item.currencyCode}
                                    >
                                      {item.currencyCode}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </GridItem>
                            <GridItem
                              xs={10}
                              sm={10}
                              md={12}
                              lg={12}
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
                                id="np_address"
                                inputProps={{
                                  value: this.state.address,
                                  onChange: event =>
                                    this.handleChange("address", event)
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: event => {
                                    this.setState({ addressPristine: false });
                                    this.change(event, "address", [
                                      { type: "required" }
                                    ]);
                                  },
                                  onChange: event => {
                                    if (!this.state.addressPristine) {
                                      this.setState({ addressPristine: false });
                                      this.change(event, "address", [
                                        { type: "required" }
                                      ]);
                                    }
                                  }
                                }}
                              />
                            </GridItem>
                            <GridItem
                              xs={10}
                              sm={10}
                              md={12}
                              lg={12}
                              className={classes.alignPadding}
                            >
                              <GridContainer>
                                <GridItem xs={12} sm={10} md={4}>
                                  <CustomInput
                                    success={this.state.cityState === "success"}
                                    error={this.state.cityState === "error"}
                                    helpText={
                                      this.state.cityState === "error" &&
                                      this.state.cityErrorMsg[0]
                                    }
                                    labelText="City*"
                                    id="np_city"
                                    inputProps={{
                                      value: this.state.city,
                                      onChange: event =>
                                        this.handleChange("city", event)
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: event => {
                                        this.setState({ cityPristine: false });
                                        this.change(event, "city", [
                                          { type: "required" }
                                        ]);
                                      },
                                      onChange: event => {
                                        if (!this.state.cityPristine) {
                                          this.setState({
                                            cityPristine: false
                                          });
                                          this.change(event, "city", [
                                            { type: "required" }
                                          ]);
                                        }
                                      }
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={10} md={4}>
                                  <CustomInput
                                    success={
                                      this.state.postalCodeState === "success"
                                    }
                                    error={
                                      this.state.postalCodeState === "error"
                                    }
                                    helpText={
                                      this.state.postalCodeState === "error" &&
                                      this.state.postalCodeErrorMsg[0]
                                    }
                                    labelText="Postal Code*"
                                    id="np_postalCode"
                                    inputProps={{
                                      value: this.state.postalCode,
                                      onChange: event =>
                                        this.handleChange("postalCode", event)
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: event => {
                                        this.setState({
                                          postalCodePristine: false
                                        });
                                        this.change(event, "postalCode", [
                                          { type: "required" }
                                        ]);
                                      },
                                      onChange: event => {
                                        if (!this.state.postalCodePristine) {
                                          this.setState({
                                            postalCodePristine: false
                                          });
                                          this.change(event, "postalCode", [
                                            { type: "required" }
                                          ]);
                                        }
                                      }
                                    }}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={10} md={4}>
                                  <FormControl
                                    fullWidth
                                    className={classes.selectFormControl}
                                  >
                                    <InputLabel
                                      htmlFor="type"
                                      className={classes.selectLabel}
                                    >
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
                                      onChange={this.handleCountryCode}
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
                                            selected:
                                              classes.selectMenuItemSelected
                                          }}
                                          value={item.countryCode}
                                          key={item.countryCode}
                                        >
                                          {item.countryName}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  {/*      <CustomInput
                                    success={
                                      this.state.countryCodeState === "success"
                                    }
                                    error={
                                      this.state.countryCodeState === "error"
                                    }
                                    helpText={
                                      this.state.countryCodeState === "error" &&
                                      this.state.countryCodeErrorMsg[0]
                                    }
                                    labelText="Country*"
                                    id="np_countryCode"
                                    inputProps={{
                                      value: this.state.countryCode,
                                      onChange: event =>
                                        this.handleChange("countryCode", event)
                                    }}
                                    formControlProps={{
                                      fullWidth: true,
                                      className:
                                        classes.customFormControlClasses,
                                      onBlur: event => {
                                        this.setState({
                                          countryCodePristine: false
                                        });
                                        this.change(event, "countryCode", [
                                          { type: "required" }
                                        ]);
                                      },
                                      onChange: event => {
                                        if (!this.state.countryCodePristine) {
                                          this.setState({
                                            countryCodePristine: false
                                          });
                                          this.change(event, "countryCode", [
                                            { type: "required" }
                                          ]);
                                        }
                                      }
                                    }}
                                />   */}
                                </GridItem>
                              </GridContainer>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={8}>
                              <CustomInput
                                success={
                                  this.state.bicNumberState === "success"
                                }
                                error={this.state.bicNumberState === "error"}
                                helpText={
                                  this.state.bicNumberState === "error" &&
                                  this.state.bicNumberErrorMsg[0]
                                }
                                labelText="BIC / Swift / Sort Code*"
                                id="np_bicNumber"
                                // inputProps={{
                                //   value: this.state.firstName,
                                //   onChange: this.handleChange
                                // }}
                                inputProps={{
                                  value: this.state.bicNumber,
                                  onChange: event =>
                                    this.handleChange("bicNumber", event)
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: event => {
                                    this.setState({ bicNumberPristine: false });
                                    this.change(event, "bicNumber", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 25
                                        }
                                      }
                                    ]);
                                  },
                                  onChange: event => {
                                    if (!this.state.bicNumberPristine) {
                                      this.setState({
                                        bicNumberPristine: false
                                      });
                                      this.change(event, "bicNumber", [
                                        { type: "required" },
                                        {
                                          type: "length",
                                          params: {
                                            min: 1,
                                            max: 25
                                          }
                                        }
                                      ]);
                                    }
                                  }
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={4}>
                              <CustomInput
                                success={
                                  this.state.accountNumberState === "success"
                                }
                                error={
                                  this.state.accountNumberState === "error"
                                }
                                helpText={
                                  this.state.accountNumberState === "error" &&
                                  this.state.accountNumberErrorMsg[0]
                                }
                                labelText="Account Number / IBAN*"
                                id="np_accountNumber"
                                inputProps={{
                                  value: this.state.accountNumber,
                                  onChange: event =>
                                    this.handleChange("accountNumber", event)
                                }}
                                formControlProps={{
                                  fullWidth: true,
                                  className: classes.customFormControlClasses,
                                  onBlur: event => {
                                    this.setState({
                                      accountNumberPristine: false
                                    });
                                    this.change(event, "accountNumber", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 25
                                        }
                                      }
                                    ]);
                                  },
                                  onChange: event => {
                                    if (!this.state.accountNumberPristine) {
                                      this.setState({
                                        accountNumberPristine: false
                                      });
                                      this.change(event, "accountNumber", [
                                        { type: "required" },
                                        {
                                          type: "length",
                                          params: {
                                            min: 1,
                                            max: 25
                                          }
                                        }
                                      ]);
                                    }
                                  }
                                }}
                              />
                            </GridItem>

                            <GridItem xs={12} sm={12} md={12} lg={12}>
                              <div
                                className={classes.center}
                                style={{ textAlign: "right" }}
                              >
                                <Button
                                  round={false}
                                  color="info"
                                  size="lg"
                                  onClick={this.addBeneficiary}
                                >
                                  ADD
                                </Button>
                              </div>
                            </GridItem>
                          </GridContainer>
                        </form>
                      )}
                    </GridItem>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={8} lg={12}>
                <Card>
                  <CardHeader color="warning" text>
                    <CardText color="warning">
                      <Work className={classes.listItemIcon} />
                    </CardText>
                    <span className={classes.title}>Payment Details</span>
                  </CardHeader>
                  <CardBody>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <form className={classes.form}>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12} lg={12}>
                            <CustomInput
                              success={
                                this.state.paymentReasonState === "success"
                              }
                              error={this.state.paymentReasonState === "error"}
                              helpText={
                                this.state.paymentReasonState === "error" &&
                                this.state.paymentReasonErrorMsg[0]
                              }
                              labelText="Reason*"
                              id="np_paymentReason"
                              // inputProps={{
                              //   value: this.state.firstName,
                              //   onChange: this.handleChange
                              // }}
                              inputProps={{
                                value: this.state.paymentReason,
                                onChange: event =>
                                  this.handleChange("paymentReason", event)
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: event => {
                                  this.setState({
                                    paymentReasonPristine: false
                                  });
                                  this.change(event, "paymentReason", [
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
                                  if (!this.state.paymentReasonPristine) {
                                    this.setState({
                                      paymentReasonPristine: false
                                    });
                                    this.change(event, "paymentReason", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 100
                                        }
                                      }
                                    ]);
                                  }
                                }
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4} lg={4}>
                            <CustomInput
                              success={this.state.referenceState === "success"}
                              error={this.state.referenceState === "error"}
                              helpText={
                                this.state.referenceState === "error" &&
                                this.state.referenceErrorMsg[0]
                              }
                              labelText="Reference*"
                              id="np_reference"
                              inputProps={{
                                value: this.state.reference,
                                onChange: event =>
                                  this.handleChange("reference", event)
                              }}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses,
                                onBlur: event => {
                                  this.setState({
                                    referencePristine: false
                                  });
                                  this.change(event, "reference", [
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
                                  if (!this.state.referencePristine) {
                                    this.setState({
                                      referencePristine: false
                                    });
                                    this.change(event, "reference", [
                                      { type: "required" },
                                      {
                                        type: "length",
                                        params: {
                                          min: 1,
                                          max: 100
                                        }
                                      }
                                    ]);
                                  }
                                }
                              }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={10} md={5} lg={5}>
                            <GridContainer spacing={8} alignItems="flex-end">
                              <GridItem
                                className={classes.uploadContainer}
                                xs={10}
                                sm={10}
                                md={12}
                                lg={12}
                              >
                                <label className={classes.uploadLabel}>
                                  Supporting Document
                                </label>
                                <FileUpload
                                  avatar
                                  addButtonProps={{
                                    color: "rose",
                                    round: true
                                  }}
                                  changeButtonProps={{
                                    color: "rose",
                                    round: true
                                  }}
                                  removeButtonProps={{
                                    color: "danger",
                                    round: true
                                  }}
                                  sendFile={file =>
                                    this.getFile("supportingDocFile", file)
                                  }
                                  ref={this.fileUploadComponent}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4} lg={3}>
                            <FormControl
                              fullWidth
                              className={classes.filledSelect}
                            >
                              <FormHelperText
                                style={{
                                  backgroundColor: "white",
                                  paddingTop: 5,
                                  marginTop: 0,
                                  textAlign: "left"
                                }}
                                success={
                                  this.state.docCategoryState === "success"
                                }
                                error={this.state.docCategoryState === "error"}
                                helpText={
                                  this.state.docCategoryState === "error" &&
                                  this.state.docCategoryErrorMsg[0]
                                }
                              >
                                Document Category
                              </FormHelperText>
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu
                                }}
                                value={this.state.docCategory}
                                onChange={this.handleDocCategory}
                                inputProps={{
                                  name: "docCategory",
                                  id: "docCategory",
                                  classes: {
                                    icon: classes.white,
                                    root: classes.selectDropDown
                                  }
                                }}
                              >
                                <MenuItem
                                  disabled
                                  key={"mainDocText"}
                                  classes={{
                                    root: classes.selectMenuItem
                                  }}
                                >
                                  Choose Document Category
                                </MenuItem>
                                {documentTypes.map(item => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value={item.value}
                                    key={item.value}
                                  >
                                    {item.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {this.state.isOtherCategory && (
                                <CustomInput
                                  success={
                                    this.state.docCategoryState === "success"
                                  }
                                  error={
                                    this.state.docCategoryState === "error"
                                  }
                                  helpText={
                                    this.state.docCategoryState === "error" &&
                                    this.state.docCategoryErrorMsg[0]
                                  }
                                  labelText="Other Category*"
                                  id="np_otherDocCategory"
                                  inputProps={{
                                    value: this.state.otherDocCategory,
                                    onChange: event =>
                                      this.handleChange(
                                        "otherDocCategory",
                                        event
                                      )
                                  }}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: event => {
                                      this.setState({
                                        otherDocCategoryPristine: false
                                      });
                                      this.change(event, "docCategory", [
                                        { type: "required" }
                                      ]);
                                    },
                                    onChange: event => {
                                      if (!this.state.paymentReasonPristine) {
                                        this.setState({
                                          paymentReasonPristine: false
                                        });
                                        this.change(event, "docCategory", [
                                          { type: "required" }
                                        ]);
                                      }
                                    }
                                  }}
                                />
                              )}
                            </FormControl>
                          </GridItem>
                          <GridItem
                            xs={10}
                            sm={10}
                            md={12}
                            lg={12}
                            className={classes.alignPadding}
                          >
                            <GridContainer>
                              <GridItem xs={12} sm={10} md={4}>
                                <CustomDateSelector
                                  success={
                                    this.state.transactionDateState ===
                                    "success"
                                  }
                                  error={
                                    this.state.transactionDateState === "error"
                                  }
                                  helpText={
                                    this.state.transactionDateState ===
                                      "error" &&
                                    this.state.transactionDateErrorMsg[0]
                                  }
                                  id="np_transactionDate"
                                  inputProps={{
                                    format: "dd MMM yyyy",
                                    label: "Payment Date*",
                                    value: this.state.transactionDate,
                                    shouldDisableDate: this.disableWeekends,
                                    minDate: Date.now(),
                                    onChange: this.handleDateChange,
                                    keyboardbuttonprops: {
                                      "aria-label": "change date"
                                    }
                                  }}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: cx(
                                      classes.customDateControlClasses,
                                      classes.customFormControlClasses
                                    )
                                  }}
                                />
                                {/*         <CustomInput
                                  success={
                                    this.state.transactionDateState ===
                                    "success"
                                  }
                                  error={
                                    this.state.transactionDateState === "error"
                                  }
                                  helpText={
                                    this.state.transactionDateState ===
                                      "error" &&
                                    this.state.transactionDateErrorMsg[0]
                                  }
                                  labelText="Payment Date*"
                                  id="np_transactionDate"
                                  inputProps={{
                                    value: this.state.transactionDate,
                                    onChange: event =>
                                      this.handleChange(
                                        "transactionDate",
                                        event
                                      )
                                  }}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: event => {
                                      this.setState({
                                        transactionDatePristine: false
                                      });
                                      this.change(event, "transactionDate", [
                                        { type: "required" }
                                      ]);
                                    },
                                    onChange: event => {
                                      if (!this.state.transactionDatePristine) {
                                        this.setState({
                                          transactionDatePristine: false
                                        });
                                        this.change(event, "transactionDate", [
                                          { type: "required" }
                                        ]);
                                      }
                                    }
                                  }}
                                />    */}
                              </GridItem>
                              <GridItem
                                xs={12}
                                sm={10}
                                md={4}
                                style={{ marginTop: "30px" }}
                              >
                                <CustomNumberFormat
                                  success={this.state.amountState === "success"}
                                  error={this.state.amountState === "error"}
                                  helpText={
                                    this.state.amountState === "error" &&
                                    this.state.amountErrorMsg[0]
                                  }
                                  id="np_amount"
                                  value={this.state.amount}
                                  onChange={this.handleAmountChange("amount")}
                                  formControlProps={{
                                    fullWidth: true,
                                    className: classes.customFormControlClasses,
                                    onBlur: event => {
                                      this.setState({
                                        amountPristine: false
                                      });
                                      this.change(event, "amount", [
                                        { type: "required" }
                                      ]);
                                    },
                                    onChange: event => {
                                      if (!this.state.amountPristine) {
                                        this.setState({
                                          amountPristine: false
                                        });
                                        this.change(event, "amount", [
                                          { type: "required" }
                                        ]);
                                      }
                                    }
                                  }}
                                />
                              </GridItem>
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                lg={4}
                                style={{ marginTop: "20px" }}
                              >
                                <FormControl
                                  fullWidth
                                  className={classes.filledSelect}
                                >
                                  <FormHelperText
                                    style={{
                                      backgroundColor: "white",
                                      paddingTop: 5,
                                      marginTop: 0,
                                      textAlign: "left"
                                    }}
                                  >
                                    Payment Currency*
                                  </FormHelperText>
                                  <Select
                                    MenuProps={{
                                      className: classes.selectMenu
                                    }}
                                    value={this.state.paymentCurrency}
                                    onChange={this.handlePaymentCurrency}
                                    inputProps={{
                                      name: "paymentCurrency",
                                      id: "paymentCurrency",
                                      classes: {
                                        icon: classes.white,
                                        root: classes.selectDropDown
                                      }
                                    }}
                                  >
                                    <MenuItem
                                      disabled
                                      key={"currencyText"}
                                      classes={{
                                        root: classes.selectMenuItem
                                      }}
                                    >
                                      Choose Currency
                                    </MenuItem>
                                    {this.state.currencies.map(item => (
                                      <MenuItem
                                        classes={{
                                          root: classes.selectMenuItem,
                                          selected:
                                            classes.selectMenuItemSelected
                                        }}
                                        value={item.currencyCode}
                                        key={item.currencyCode}
                                      >
                                        {item.currencyCode}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          {this.state.paymentCurrency && (
                            <React.Fragment>
                              <GridItem xs={10} sm={10} md={8} lg={8}>
                                <GridContainer justify="center">
                                  <GridItem
                                    xs={10}
                                    sm={10}
                                    md={12}
                                    lg={10}
                                    style={{
                                      textAlign: "center",
                                      backgroundColor: "#FBF2DC",
                                      height: 40,
                                      margin: 20,
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center"
                                    }}
                                  >
                                    Your payment has a Fee of {this.state.fee}{" "}
                                    {this.state.paymentCurrency}
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                              <GridItem xs={10} sm={10} md={12} lg={8}>
                                <GridContainer justify="center">
                                  <GridItem xs={10} sm={10} md={12} lg={4}>
                                    Total Amount to Pay
                                  </GridItem>
                                  <GridItem xs={10} sm={10} md={12} lg={4}>
                                    {formatMoney(
                                      +this.state.amountValue + +this.state.fee
                                    )}{" "}
                                    {this.state.paymentCurrency}
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                            </React.Fragment>
                          )}
                        </GridContainer>
                      </form>
                    </GridItem>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={3}>
            <h4>
              <b>Wallet Status</b>
            </h4>
            <StatusCard
              title={"Available on Wallet"}
              sellCurrency={
                this.state.selectedWallet &&
                this.state.selectedWallet.currencyCode
              }
              cad={
                this.state.selectedWallet &&
                this.state.selectedWallet.balanceAmount.toFixed(2)
              }
            />
            <StatusCard
              title={"Required for Payment including Fee"}
              sellCurrency={
                this.state.selectedWallet &&
                this.state.selectedWallet.currencyCode
              }
              cad={(+this.state.amountValue + +this.state.fee).toFixed(2)}
            />
            <StatusCard
              title={"Remaining after Payment"}
              sellCurrency={
                this.state.selectedWallet &&
                this.state.selectedWallet.currencyCode
              }
              cad={
                this.state.selectedWallet &&
                (
                  this.state.selectedWallet.balanceAmount -
                  (+this.state.amountValue + +this.state.fee)
                ).toFixed(2)
              }
            />
            <Button
              size="lg"
              style={{
                backgroundColor: primaryColor[5],
                width: "100%",
                marginTop: 30
              }}
              disabled={
                this.state.disabledPaymentButton || this.state.amountValue === 0
              }
              onClick={this.createPayment}
            >
              CREATE PAYMENT
            </Button>
          </GridItem>
        </GridContainer>
        <DealExecutedDialog
          showModal={this.state.isDealExecuted}
          trade={this.state.trade}
          dealType={"Payment"}
          closeModal={this.closeModal}
        />
        {/* OTP screen */}
        {this.state.otpModal && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
            }}
            open={this.state.otpModal}
            disableBackdropClick
            disableEscapeKeyDown
            TransitionComponent={Transition}
            keepMounted
            onClose={this.closeOtpModal}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
            <DialogTitle
              id="classic-modal-slide-title"
              disableTypography
              className={cx(classes.modalHeader)}
            >
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={this.closeOtpModal}
              >
                <CloseIcon />
              </IconButton>
              <h3 className={cx(classes.modalTitle, classes.loginModalTitle)}>
                Payment OTP
              </h3>
              <h5 className={classes.subTitle}>
                Please provide OTP to authorize your Payment:
              </h5>
            </DialogTitle>
            <DialogContent
              id="classic-modal-slide-description"
              className={cx(classes.modalBody, classes.loginMaxWidth)}
            >
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12}>
                  <form>
                    <GridContainer justify="center">
                      <Icon
                        className={classes.inputAdornmentIcon}
                        style={{ marginTop: 30 }}
                      >
                        lock_outline
                      </Icon>
                      {/* </GridItem> */}
                      <GridItem xs={4} sm={4} md={4}>
                        <CustomInput
                          id="np_code1"
                          inputProps={{
                            value: this.state.code1
                          }}
                          formControlProps={{
                            fullWidth: false,
                            onChange: event => {
                              this.handleChange("code1", event);
                            }
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer justify="center">
                      <Button
                        size="lg"
                        style={{ backgroundColor: primaryColor[5] }}
                        onClick={this.validateOTP}
                      >
                        PAY
                      </Button>
                    </GridContainer>
                    <GridContainer justify="center">
                      <a
                        href="javascript:void(0);"
                        onClick={() => this.resetOTP()}
                      >
                        Resend OTP
                      </a>
                    </GridContainer>
                  </form>
                </GridItem>
              </GridContainer>
            </DialogContent>
          </Dialog>
        )}
        {this.state.isNoticeModal && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
            }}
            open={this.state.isNoticeModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleNoticeModalClose()}
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle
              id="notice-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <h4 className={classes.modalTitle}>
                {this.state.noticeModalHeaderMsg}
              </h4>
            </DialogTitle>
            <DialogContent
              id="notice-modal-slide-description"
              className={classes.modalBody}
            >
              <p>{this.state.noticeModalMsg}</p>
            </DialogContent>
            <DialogActions
              style={{ justifyContent: "center" }}
              className={classes.modalFooter + " " + classes.modalFooterCenter}
            >
              <Button
                onClick={() => this.handleNoticeModalClose()}
                color="info"
                round
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {this.state.callInProgress && (
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal
            }}
            open={this.state.callInProgress}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle
              id="waiting-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <h4 className={classes.modalTitle}>{this.state.waitHeader}</h4>
            </DialogTitle>
            <DialogContent
              id="waiting-modal-slide-description"
              className={classes.modalBody}
              style={{ textAlign: "center" }}
            >
              <CircularProgress />
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
}

NewPayment.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object
};

//export default withStyles(contactUsPageStyle)(CustomerRegistration);
// export default withStyles(styles)(NewPayment);
export default withRouter(withStyles(styles)(NewPayment));
