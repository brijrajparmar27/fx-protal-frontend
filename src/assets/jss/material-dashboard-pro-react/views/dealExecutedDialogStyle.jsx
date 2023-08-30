import { cardTitle, whiteColor, grayColor } from 'assets/jss/material-dashboard-pro-react.jsx';
import modalStyle from 'assets/jss/material-dashboard-pro-react/modalStyle.jsx';

const dealExecutedDialogStyle = (theme) => ({
  container: {
    fontWeight: 400,
    maxWidth: 1800,
  },
  walletContainer: {
    backgroundColor: '#EEEAEB',
    paddingLeft: '30px !important',
    paddingRight: '30px !important',
    paddingBottom: '30px !important',
  },
  content: {
    fontWeight: 400,
    fontSize: 16,
  },
  floatLeft: {
    float: 'left',
  },
  floatRight: {
    float: 'right',
  },
  floatNone: {
    float: 'none',
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignRight: {
    textAlign: 'right',
  },
  detailsHeader: {
    textAlign: 'left',
    marginBottom: 20,
    fontSize: 18,
  },
  detailsRow: {
    marginTop: 10,
    color: 'black',
    paddingRight: 15,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  detailsRowFooter: {
    fontSize: 12,
    textAlign: 'left',
  },
  button: {
    marginLeft: 20,
  },
  checkIcon: {
    color: '#A5DC86',
    border: 'solid 4px',
    borderRadius: 22,
    padding: 2,
    fontSize: 44,
    borderColor: 'aquamarine',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    zIndex: 2,
    color: theme.palette.grey[500],
  },
  titleContent: {
    paddingTop: 5,
    paddingLeft: 10,
    position: 'absolute',
  },
  loginModalTitle: {
    fontWeight: 600,
    textAlign: 'left',
  },
  modalRootContent: {
    [theme.breakpoints.up("sm")]: {
      margin: "auto"
    },
    borderRadius: "6px",
    maxWidth: "fit-content !important",
    overflow: "visible",
    maxHeight: "unset",
    position: "relative",
    height: "fit-content"
  },
  subTitle: {
    fontWeight: 400,
    fontSize: '16px',
  },
  heading: {
    fontWeight: "bold",
    fontSize: "1.05em",
    lineHeight: "1.5em"
  },
  center: {
    textAlign: 'center',
    margin: 20,
    marginTop: 40,
  },
  cardTitle: {
    ...cardTitle,
    marginTop: '0',
    marginBottom: '3px',
    color: grayColor[2],
    fontSize: '18px',
  },
  cardSubtitle: {
    color: grayColor[0],
    fontSize: '14px',
    margin: '0 0 10px',
  },
  textCenter: {
    textAlign: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center !important',
  },
  customButtonClass: {
    '&,&:focus,&:hover': {
      color: whiteColor,
    },
    marginLeft: '5px',
    marginRight: '5px',
  },
  inputAdornment: {
    marginRight: '18px',
  },
  inputAdornmentIcon: {
    color: grayColor[6],
  },
  cardHidden: {
    opacity: '0',
    transform: 'translate3d(0, -60px, 0)',
  },
  cardHeader: {
    marginBottom: '20px',
    zIndex: '3',
  },
  socialLine: {
    padding: '0.9375rem 0',
  },
  radio: {
    "&$checked": {
      color: "#2391d2"
    }
  },
  checked: {},
  ...modalStyle(theme),
});

export default dealExecutedDialogStyle;
