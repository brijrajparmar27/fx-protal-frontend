import Calendar from "views/Calendar/Calendar.jsx";
import Charts from "views/Charts/Charts.jsx";
import Dashboard from "views/Dashboard/Dashboard.jsx";
import ErrorPage from "views/Pages/ErrorPage.jsx";
import ExtendedForms from "views/Forms/ExtendedForms.jsx";
import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import FullScreenMap from "views/Maps/FullScreenMap.jsx";
import GoogleMaps from "views/Maps/GoogleMaps.jsx";
import LockScreenPage from "views/Pages/LockScreenPage.jsx";
import Logout from "views/Components/logout.jsx";
import LoginPage from "views/Pages/LoginPage.jsx";
import ForgotPasswordPage from "views/Pages/ForgotPasswordPage.jsx";
import Notifications from "views/Components/Notifications.jsx";
import Panels from "views/Components/Panels.jsx";
import PricingPage from "views/Pages/PricingPage.jsx";
import BlogsPage from "views/Pages/BlogsPage.jsx";
import BlogsEditPage from "views/Pages/BlogsEditPage.jsx";
import BlogPageAdmin from "./views/Pages/BlogPageAdmin";
import HomePage from "views/Pages/HomePage.jsx";
import ContentPage from "views/Pages/ContentPage.jsx";
import RTLSupport from "views/Pages/RTLSupport.jsx";
import ReactTables from "views/Tables/ReactTables.jsx";
import RegisterPage from "views/Pages/RegisterPage.jsx";
import SignupPage from "views/Pages/SignupPage.jsx";
import InviteUserPage from "views/Pages/InviteUserPage.jsx";
import ContactUs from "views/Pages/ContactUs.jsx";
import CustomerRegistration from "views/Pages/CustomerRegistration.jsx";
import ModuleSelectionPage from "views/Pages/ModuleSelection.jsx";
import RiskSubscription from "views/Pages/RiskSubscription.jsx";
import RiskPaymentStatus from "views/Pages/RiskPaymentStatus.jsx";
import RiskCardStatus from  "views/Pages/RiskCardStatus.jsx";
import FxSpotDeals from "views/Pages/FxSpotDeals.jsx";
import NewPayment from "views/Pages/NewPayment.jsx";
import ManageAccount from "views/Pages/ManageAccount.jsx";
import ManageBeneficiaries from "views/Pages/ManageBeneficiaries.jsx";
import FxForwardDeals from "views/Pages/FxForwardDeals.jsx";
import FXExposureCalculator from "views/Pages/FxExposureCalculator.jsx";
import FxExposureCalculatorNew from "./views/Pages/FxExposureCalculatorNew";
import FXCurrencyRiskPolicy from "views/Pages/FXCurrencyRiskPolicy.jsx";
import SubmitCustomerRegistration from "views/Pages/SubmitCustomerRegistration.jsx";
import RegularForms from "views/Forms/RegularForms.jsx";
import RegularTables from "views/Tables/RegularTables.jsx";
import SweetAlert from "views/Components/SweetAlert.jsx";
import TimelinePage from "views/Pages/Timeline.jsx";
import Typography from "views/Components/Typography.jsx";
import UserProfile from "views/Pages/UserProfile.jsx";
import ValidationForms from "views/Forms/ValidationForms.jsx";
import VectorMap from "views/Maps/VectorMap.jsx";
import Widgets from "views/Widgets/Widgets.jsx";
import Wizard from "views/Forms/Wizard.jsx";
import PortalDashboard from "views/Pages/PortalDashboard.jsx";
import FxSpotManualDeals from "views/Pages/FxSpotManualDeals.jsx";
import FxForwardManualDeals from "views/Pages/FxForwardManualDeals.jsx";

import AdminDashboard from "views/Pages/AdminDashboard.jsx";
import CustomerControlCenter from "views/Pages/CustomerControlCenter.jsx";
import CustomerInfoPage from "views/Pages/CustomerInfoPage.jsx";
import RiskUserInfoPage from "views/Pages/RiskUserInfoPage.jsx";
import ImpersonateLogin from "views/Pages/ImpersonateLogin.jsx";
import ManageAdminUser from "views/Pages/ManageAdminUser.jsx";
import RiskManagement from "views/Pages/RiskManagementPage.jsx";
import FxgTradePage from "views/Pages/FxgTradePage.jsx";
import FxgLiquidityProviderPage from "views/Pages/FxgLiquidityProviderPage.jsx";
import FxgBeneficiaryPage from "views/Pages/FxgBeneficiaryPage.jsx";
import FxgWalletsPage from "views/Pages/FxgWalletsPage.jsx";
import CommonSettings from "views/Pages/CommonSettingsPage.jsx";
import HedgeAccounting from "views/Pages/HedgeAccounting.jsx";
import RiskRadarPage from "views/Pages/RiskRadarPage.jsx";
import RiskManagementPortal from "views/Pages/RiskManagementPortal.jsx";
import FundsPage from "views/Pages/FundsPage.jsx";
import RiskInsight from "views/Pages/RiskInsight.jsx";
import ReferenceRateCalculator from "views/Pages/ReferenceRateCalculator.jsx";
import CreateRateAlert from "views/Pages/CreateRateAlert.jsx";

import HedgingQnA from "views/Pages/HedgingQnA.jsx";
import MarketRates from "views/Pages/MarketRates.jsx";
import Xero from "views/Pages/Xero.jsx";
import ForwardRateCalculator from "views/Pages/ForwardRateCalculator.jsx";
import SpotRateCalculator from "views/Pages/SpotRateCalculator.jsx";

import FxSpotReport from "views/Reports/FxSpotReport.jsx";
import FxForwardReport from "views/Reports/FxForwardReport.jsx";
import MarginReport from "views/Reports/MarginReport.jsx";
import PaymentReport from "views/Reports/PaymentReport.jsx";
import BeneficiariesReport from "views/Reports/BeneficiariesReport.jsx";
import SignupClientsReport from "views/Reports/SignupClientsReport.jsx";
import CustomerRegistrationApplicationReport from "views/Reports/CustomerRegistrationApplicationReport.jsx";
import KeepmeUpdatedReport from "views/Reports/KeepmeUpdatedReport.jsx";
import EnquiryReport from "views/Reports/EnquiryReport.jsx";
import SARReport from "views/Reports/SARReport.jsx";

import RegisterYourInterest from './views/Pages/RegisterYourInterest';

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Pages",
    rtlName: "صفحات",
    icon: Image,
    state: "pageCollapse",
    views: [
      {
        path: "/our-team",
        name: "Our Team Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/ourTeam.json",
        layout: "/home"
      },
      {
        path: "/contact-us",
        name: "Contact Us",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: ContactUs,
        layout: "/home"
      },
      {
        path: "/what-we-do",
        name: "What We Do",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/whatWeDo.json",
        layout: "/home"
      },
      {
        path: "/learn-more",
        name: "Learn More",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/learnMore.json",
        layout: "/home"
      },
      {
        path: "/our-values",
        name: "Our Values",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/ourValues.json",
        layout: "/home"
      },
      {
        path: "/our-clients",
        name: "Our Clients",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/ourClients.json",
        layout: "/home"
      },
      {
        path: "/fx-risk-management",
        name: "Fx Risk Management",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/fxRiskManagement.json",
        layout: "/home"
      },
      {
        path: "/fx-deals-payments",
        name: "Fx Spot",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/fxDealPayments.json",
        layout: "/home"
      },
      {
        path: "/fx-spot",
        name: "Fx Spot",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/fxSpot.json",
        layout: "/home"
      },
      {
        path: "/fx-forwards",
        name: "FX Forwards",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/fxForwards.json",
        layout: "/home"
      },
      {
        path: "/payments",
        name: "Payments",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/payments.json",
        layout: "/home"
      },
      {
        path: "/regulatory-information",
        name: "Regulatory Information",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/regulatoryInformation.json",
        layout: "/home"
      },
      {
        path: "/value-add",
        name: "Value Add",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/valueAdd.json",
        layout: "/home"
      },
      {
        path: "/careers",
        name: "Careers",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/careers.json",
        layout: "/home"
      },
      {
        path: "/terms-and-conditions",
        name: "Terms And Conditions",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/termsAndConditions.json",
        layout: "/home"
      },
      {
        path: "/privacy-policy",
        name: "Privacy Policy",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/privacyPolicy.json",
        layout: "/home"
      },
      {
        path: "/plan-information",
        name: "Plan Information",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/planInformation.json",
        layout: "/home"
      },
      {
        path: "/pricing/fx-risk-management",
        name: "Risk Pricing Information",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/riskPlanInformation.json",
        layout: "/home"
      },
      {
        path: "/pricing/fx-deals-payments",
        name: "Deals Pricing Information",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/dealsPlanInformation.json",
        layout: "/home"
      },
      {
        path: "/faq",
        name: "Frequently Asked Questions",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/faq.json",
        layout: "/home"
      },
      {
        path: "/news-blogs",
        name: "Blogs Page",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: BlogsPage,
        layout: "/home"
      },
      {
        path: "/pricing-page",
        name: "Pricing Page",
        rtlName: "عالتسعير",
        mini: "PP",
        rtlMini: "ع",
        component: PricingPage,
        layout: "/home"
      },
      {
        path: "/our-team",
        name: "Our Team Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ContentPage,
        contentPath: "/cms/public/pages/ourTeam.json",
        layout: "/auth"
      },
      {
        path: "/",
        name: "Home Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: HomePage,
        layout: "/home"
      },
      {
        path: "/rtl-support-page",
        name: "RTL Support",
        rtlName: "صودعم رتل",
        mini: "RS",
        rtlMini: "صو",
        component: RTLSupport,
        layout: "/rtl"
      },
      {
        path: "/timeline-page",
        name: "Timeline Page",
        rtlName: "تيالجدول الزمني",
        mini: "T",
        rtlMini: "تي",
        component: TimelinePage,
        layout: "/admin"
      },
      {
        path: "/forgot-page",
        name: "Forgot Password Page",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: ForgotPasswordPage,
        overlay: true,
        layout: "/home"
      },
      {
        path: "/logout",
        name: "Logout Page",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: Logout,
        overlay: true,
        layout: "/home"
      },
      {
        path: "/login-page",
        name: "Login Page",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: LoginPage,
        overlay: true,
        layout: "/home"
      },
      {
        path: "/register-page",
        name: "Register Page",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: RegisterPage,
        layout: "/home"
      },
      {
        path: "/signup-page/:emailId",
        name: "Invite User Page",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: InviteUserPage,
        overlay: true,
        layout: "/home"
      },
      {
        path: "/signup-page",
        name: "Signup Page",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: SignupPage,
        overlay: true,
        layout: "/home"
      },
      {
        path: '/register-interest',
        name: 'Register Your Interest',
        rtlName: 'تسجيل',
        mini: 'R',
        rtlMini: 'صع',
        component: RegisterYourInterest,
        overlay: true,
        layout: '/home',
      },
      {
        path: "/lock-screen-page",
        name: "Lock Screen Page",
        rtlName: "اقفل الشاشة",
        mini: "LS",
        rtlMini: "هذاع",
        component: LockScreenPage,
        layout: "/home"
      },
      {
        path: "/user-page",
        name: "User Profile",
        rtlName: "ملف تعريفي للمستخدم",
        mini: "UP",
        rtlMini: "شع",
        component: UserProfile,
        layout: "/admin"
      },
      {
        path: "/modules",
        name: "Module Selection Page",
        rtlName: "صفحة الخطأ",
        mini: "E",
        rtlMini: "البريد",
        component: ModuleSelectionPage,
        layout: "/auth"
      },
      {
        path: "/error-page",
        name: "Error Page",
        rtlName: "صفحة الخطأ",
        mini: "E",
        rtlMini: "البريد",
        component: ErrorPage,
        layout: "/auth"
      },
      {
        path: "/customer-registration",
        name: "Our Team Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: CustomerRegistration,
        layout: "/auth"
      },
      {
        path: "/risk-subscription",
        name: "Risk Subscription Plans",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskSubscription,
        layout: "/auth"
      },
      {
        path: "/risk-payment-status",
        name: "Risk Payment Status",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskPaymentStatus,
        layout: "/auth"
      },
      {
        path: "/risk-card-status",
        name: "Risk Card Status",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskCardStatus,
        layout: "/auth"
      },
      {
        path: "/portal-dashboard",
        name: "Our Team Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: PortalDashboard,
        layout: "/auth"
      },
      {
        path: "/portal-hedge",
        name: "Hedge Accounting Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: HedgeAccounting,
        layout: "/auth"
      },
      {
        path: "/risk-portal",
        name: "Risk Management Portal Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskManagementPortal,
        layout: "/auth"
      },
      {
        path: "/risk-radar",
        name: "Risk Radar Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskRadarPage,
        layout: "/auth"
      },
      {
        path: "/risk-insight",
        name: "Risk Insight",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskInsight,
        layout: "/auth"
      },
      {
        path: "/rate-alert",
        name: "Create Rate Alert",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: CreateRateAlert,
        layout: "/auth"
      },
      {
        path: "/rate-calculator",
        name: "Reference Rate Calculator",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ReferenceRateCalculator,
        layout: "/auth"
      },
      {
        path: "/funds",
        name: "Funds In Funds Out",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FundsPage,
        layout: "/auth"
      },
      {
        path: "/hedging-qna",
        name: "Hedging Guidance Q&A",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: HedgingQnA,
        layout: "/auth"
      },
      {
        path: "/market-rates",
        name: "Market Rates",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: MarketRates,
        layout: "/auth"
      },
      {
        path: "/xero",
        name: "Xero Integration",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: Xero,
        layout: "/auth"
      },
      {
        path: "/fwd-rate-calculator",
        name: "Forward Rate Calculator",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ForwardRateCalculator,
        layout: "/auth"
      },
      {
        path: "/spot-rate-calculator",
        name: "Spot Rate Calculator",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: SpotRateCalculator,
        layout: "/auth"
      },
      {
        path: "/manage-beneficiaries",
        name: "Manage Beneficiaries",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ManageBeneficiaries,
        layout: "/auth"
      },
      {
        path: "/fx-spot-deals",
        name: "FX spot deals",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxSpotDeals,
        layout: "/auth"
      },
      {
        path: "/manage-account",
        name: "Manage Account",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ManageAccount,
        layout: "/auth"
      },
      {
        path: "/new-payment/:beneficiaryId",
        name: "New Payment",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: NewPayment,
        layout: "/auth"
      },
      {
        path: "/new-payment",
        name: "New Payment",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: NewPayment,
        layout: "/auth"
      },
      {
        path: "/fx-forward-deals",
        name: "FX forward deals",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxForwardDeals,
        layout: "/auth"
      },
      {
        path: "/fx-spot-manual-deals",
        name: "FX spot deals",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxSpotManualDeals,
        layout: "/auth"
      },
      {
        path: "/fx-forward-manual-deals",
        name: "FX forward deals",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxForwardManualDeals,
        layout: "/auth"
      },
      {
        path: "/submit-customer-registration",
        name: "Add Directors Page",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: SubmitCustomerRegistration,
        //overlay: true,
        layout: "/auth/customer-registration"
      },
      {
        path: "/fx-exposure-calculator1",
        name: "FX Exposure Calculator1",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxExposureCalculatorNew,
        layout: "/auth"
      },
      {
        path: "/fx-exposure-calculator",
        name: "FX Exposure Calculator",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FXExposureCalculator,
        layout: "/auth"
      },
      {
        path: "/fx-currency-risk-policy",
        name: "Currency Risk Policy",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FXCurrencyRiskPolicy,
        layout: "/auth"
      },
      {
        path: "/admin-dashboard",
        name: "Admin Dashboard",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: AdminDashboard,
        layout: "/auth/admin"
      },
      {
        path: "/impersonate-login/:clientEmail",
        name: "Impersonate Login",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ImpersonateLogin,
        layout: "/auth/admin"
      },
      {
        path: "/customer-control-center",
        name: "Customer Control Center",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: CustomerControlCenter,
        layout: "/auth/admin"
      },
      {
        path: "/customer-info-page/:customerId",
        name: "Client Info",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: CustomerInfoPage,
        layout: "/auth/admin"
      },
      {
        path: "/risk-user-page/:customerId",
        name: "Risk User Info",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskUserInfoPage,
        layout: "/auth/admin"
      },
      {
        path: "/fx-spot-report",
        name: "FX Spot General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxSpotReport,
        layout: "/auth/admin"
      },
      {
        path: "/fx-forward-report",
        name: "FX Forward General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxForwardReport,
        layout: "/auth/admin"
      },
      {
        path: "/margin-report",
        name: "Margin General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: MarginReport,
        layout: "/auth/admin"
      },
      {
        path: "/payment-report",
        name: "Payment General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: PaymentReport,
        layout: "/auth/admin"
      },
      {
        path: "/beneficiaries-report",
        name: "Beneficiaries General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: BeneficiariesReport,
        layout: "/auth/admin"
      },
      {
        path: "/signup-report",
        name: "Signup Client General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: SignupClientsReport,
        layout: "/auth/admin"
      },
      {
        path: "/customer-registration-report",
        name: "Customer Registration Application General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: CustomerRegistrationApplicationReport,
        layout: "/auth/admin"
      },
      {
        path: "/keepme-updated-report",
        name: "Keep me Updated General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: KeepmeUpdatedReport,
        layout: "/auth/admin"
      },
      {
        path: "/enquiry-report",
        name: "Enquiry General Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: EnquiryReport,
        layout: "/auth/admin"
      },
      {
        path: "/sar-report",
        name: "SAR Report",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: SARReport,
        layout: "/auth/admin"
      },
      // {
      //   path: "/blog",
      //   name: "BLOG",
      //   rtlName: "عالتسعير",
      //   mini: "HP",
      //   rtlMini: "ع",
      //   component: BlogPageAdmin,
      //   layout: "/auth/admin"
      // },
      {
        path: "/manage-admin",
        name: "Manage Admin User",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: ManageAdminUser,
        layout: "/auth/admin"
      },
      {
        path: "/risk-management",
        name: "Risk Management",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: RiskManagement,
        layout: "/auth/admin"
      },
      {
        path: "/fxgtrade",
        name: "FXG Trade",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxgTradePage,
        layout: "/auth/admin"
      },
      {
        path: "/liquidity-provider",
        name: "FXG Liquidity Provider Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxgLiquidityProviderPage,
        layout: "/auth/admin"
      },
      {
        path: "/beneficiary",
        name: "FXG Beneficiary Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxgBeneficiaryPage,
        layout: "/auth/admin"
      },
      {
        path: "/fxg-wallets",
        name: "FXG Wallets Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: FxgWalletsPage,
        layout: "/auth/admin"
      },
      {
        path: "/common-settings",
        name: "Common Settings",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: CommonSettings,
        layout: "/auth/admin"
      },
      {
        path: "/news-blogs",
        name: "Blog Edit Page",
        rtlName: "عالتسعير",
        mini: "HP",
        rtlMini: "ع",
        component: BlogPageAdmin,
        layout: "/auth/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Components",
    rtlName: "المكونات",
    icon: Apps,
    state: "componentsCollapse",
    views: [
      {
        collapse: true,
        name: "Multi Level Collapse",
        rtlName: "انهيار متعدد المستويات",
        mini: "MC",
        rtlMini: "ر",
        state: "multiCollapse",
        views: []
      },
      {
        path: "/panels",
        name: "Panels",
        rtlName: "لوحات",
        mini: "P",
        rtlMini: "ع",
        component: Panels,
        layout: "/admin"
      },
      {
        path: "/sweet-alert",
        name: "Sweet Alert",
        rtlName: "الحلو تنبيه",
        mini: "SA",
        rtlMini: "ومن",
        component: SweetAlert,
        layout: "/admin"
      },
      {
        path: "/notifications",
        name: "Notifications",
        rtlName: "إخطارات",
        mini: "N",
        rtlMini: "ن",
        component: Notifications,
        layout: "/admin"
      },
      {
        path: "/typography",
        name: "Typography",
        rtlName: "طباعة",
        mini: "T",
        rtlMini: "ر",
        component: Typography,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Forms",
    rtlName: "إستمارات",
    icon: "content_paste",
    state: "formsCollapse",
    views: [
      {
        path: "/regular-forms",
        name: "Regular Forms",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: RegularForms,
        layout: "/admin"
      },
      {
        path: "/extended-forms",
        name: "Extended Forms",
        rtlName: "نماذج موسعة",
        mini: "EF",
        rtlMini: "هوو",
        component: ExtendedForms,
        layout: "/admin"
      },
      {
        path: "/validation-forms",
        name: "Validation Forms",
        rtlName: "نماذج التحقق من الصحة",
        mini: "VF",
        rtlMini: "تو",
        component: ValidationForms,
        layout: "/admin"
      },
      {
        path: "/wizard",
        name: "Wizard",
        rtlName: "ساحر",
        mini: "W",
        rtlMini: "ث",
        component: Wizard,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Tables",
    rtlName: "الجداول",
    icon: GridOn,
    state: "tablesCollapse",
    views: [
      {
        path: "/regular-tables",
        name: "Regular Tables",
        rtlName: "طاولات عادية",
        mini: "RT",
        rtlMini: "صر",
        component: RegularTables,
        layout: "/admin"
      },
      {
        path: "/extended-tables",
        name: "Extended Tables",
        rtlName: "جداول ممتدة",
        mini: "ET",
        rtlMini: "هور",
        component: ExtendedTables,
        layout: "/admin"
      },
      {
        path: "/react-tables",
        name: "React Tables",
        rtlName: "رد فعل الطاولة",
        mini: "RT",
        rtlMini: "در",
        component: ReactTables,
        layout: "/admin"
      }
    ]
  },
  {
    collapse: true,
    name: "Maps",
    rtlName: "خرائط",
    icon: Place,
    state: "mapsCollapse",
    views: [
      {
        path: "/google-maps",
        name: "Google Maps",
        rtlName: "خرائط جوجل",
        mini: "GM",
        rtlMini: "زم",
        component: GoogleMaps,
        layout: "/admin"
      },
      {
        path: "/full-screen-maps",
        name: "Full Screen Map",
        rtlName: "خريطة كاملة الشاشة",
        mini: "FSM",
        rtlMini: "ووم",
        component: FullScreenMap,
        layout: "/admin"
      },
      {
        path: "/vector-maps",
        name: "Vector Map",
        rtlName: "خريطة المتجه",
        mini: "VM",
        rtlMini: "تم",
        component: VectorMap,
        layout: "/admin"
      }
    ]
  },
  {
    path: "/widgets",
    name: "Widgets",
    rtlName: "الحاجيات",
    icon: WidgetsIcon,
    component: Widgets,
    layout: "/admin"
  },
  {
    path: "/charts",
    name: "Charts",
    rtlName: "الرسوم البيانية",
    icon: Timeline,
    component: Charts,
    layout: "/admin"
  },
  {
    path: "/calendar",
    name: "Calendar",
    rtlName: "التقويم",
    icon: DateRange,
    component: Calendar,
    layout: "/admin"
  }
];
export default dashRoutes;
