import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Menu from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EventNoteIcon from '@material-ui/icons/EventNote';
import ReportOutlinedIcon from '@material-ui/icons/ReportOutlined';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import LogoBlue from 'assets/img/FXguardLogoTransparent.png';
import { useStateValue } from '../../utils/Utils';
import { apiHandler } from 'api';
import { endpoint } from 'api/endpoint';
import IdleTimer from 'react-idle-timer';
// import CustomerRegistrationDialog from "views/Components/CustomerRegistrationDialog.jsx";
import TimeoutTimer from 'views/Components/Login/TimeoutTimer';
// import { module } from 'assets/config';

// core components
import Button from 'components/CustomButtons/Button';
import { formatDate } from '../../utils/Utils';

import authNavbarStyle from 'assets/jss/material-dashboard-pro-react/components/authNavbarStyle.jsx';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function AuthNavbar(props) {
  const [anchorEl] = useState(document.querySelector('#root div header'));
  const [open, setOpen] = useState(true);
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [placement] = useState('top');
  // eslint-disable-next-line no-unused-vars
  const [{ authenticated }, dispatch] = useStateValue();
  const [userInfo, setUserInfo] = useState({});
  const [showCustomerRegistrationDetails, setShowCustomerRegistrationDetails] = useState(false);
  const [customerRegistrationDetails, setCustomerRegistrationDetails] = useState({});
  const [resetTimer, setResetTimer] = useState(false);
  let module = sessionStorage.getItem('module');
  const disableButton = () => {};

  const { classes, color, history } = props;
  const appBarClasses = cx({
    [' ' + classes[color]]: color,
  });

  /******************/
  // useMonitor(props);

  const [popupTimeout] = useState(1000 * 60 * 14); // 14 min
  const [logoutTimeout] = useState(1000 * 60 * 15); // 15 min
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeModalErrMsg, setNoticeModalErrMsg] = useState('You will be logged out automatically in 1 minute.');
  const [noticeModalHeaderMsg, setNoticeModalHeaderMsg] = useState('FXGuard');

  const onAction = () => {
    // console.log("user did something", new Date().toTimeString());
    setNoticeModal(false);
  };

  const onActive = () => {
    // console.log("user is active");
    setNoticeModal(false);
  };

  const onPopupIdle = () => {
    // console.log("user is popup idle", new Date().toTimeString());
    setNoticeModal(true);
    setResetTimer(!resetTimer);
  };

  const onLogoutIdle = () => {
    // console.log("user is Logout idle", new Date().toTimeString());
    setNoticeModal(false);
    idlePopupTimer.reset();
    idleLogoutTimer.reset();
    sessionStorage.setItem('logout', 'timeout');
    handleLogout();
  };

  const handleClose = () => {
    setNoticeModal(false);
  };

  /******************/
  useEffect(() => {
    componentDidUpdate();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const handleUserProfile = () => {
    setOpenUserProfile(!openUserProfile);
  };
  const handleLogout = () => {
    setNoticeModal(false);
    sessionStorage.removeItem('token');
    dispatch({
      type: 'changeAuthenticated',
      authenticated: false,
    });
    setOpenUserProfile(!openUserProfile);
    history.push('/');
  };
  const handleAdminView = async () => {
    setNoticeModal(false);
    // Logoff from Client to Admin
    const code = {
      grant_type: 'log_off_view_as_client',
      access_token: sessionStorage.getItem('token'),
    };
    const res = await apiHandler({
      method: 'POST',
      url: endpoint.LOGIN_OAUTH,
      data: code,
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        props.history.push('/home/logout');
        return;
      } else if (res.data.errorCode === 403) {
        return;
      } else {
        setNoticeModalErrMsg(res.data.userDesc);
        setNoticeModalHeaderMsg('Error');
        setNoticeModal(true);
      }
    } else {
      if (res.data.error) {
        setNoticeModalErrMsg('Error in Logoff from Client View');
        setNoticeModalHeaderMsg('Error');
        setNoticeModal(true);
      } else {
        sessionStorage.removeItem('company_name');
        sessionStorage.setItem('token', res.data.access_token);
        sessionStorage.setItem('role', res.data.role);
        sessionStorage.setItem('customerId', res.data.customerId ? res.data.customerId : -1);
        sessionStorage.setItem('tokenTime', Date.now());
        sessionStorage.setItem('refresh_token', res.data.refresh_token);
        sessionStorage.setItem('status', 'admin');
        sessionStorage.setItem('view_as_client', false);
        sessionStorage.setItem('readonly_customer', res.data.readonly_customer);
        props.history.push(`/auth/admin/admin-dashboard`);
      }
    }
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  };
  const componentDidUpdate = () => {
    if (history.location.pathname !== props.location.pathname) {
      setOpen(false);
    }
    getUserInformation();
  };
  const getUserInformation = async () => {
    const res = await apiHandler({
      url: endpoint.USER_INFO,
      authToken: sessionStorage.getItem('token'),
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        props.history.push('/home/logout');
        return;
      } else {
        return;
      }
    } else {
      const user = res.data;
      if (user && user.customerRegistrationAppliedDate) {
        sessionStorage.setItem('customerRegistrationAppliedDate', formatDate(user.customerRegistrationAppliedDate));
      }
      setUserInfo(user);
      props.setUserInfo(user);
    }
  };
  const checkIsDisabled = (e) => {
    const module = sessionStorage.getItem('module');
    if (sessionStorage.getItem('role') && sessionStorage.getItem('role') == 'role-prospect-user') {
      if (module === 'RISKS') {
        if (sessionStorage.getItem('riskStatus') && sessionStorage.getItem('riskStatus') === 'ACTIVE') {
        } else {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    }
  };
  // const getDocumentLink = link => {
  //   return link !== "" ? (
  //     <a href={link} target="_blank" rel="noopener noreferrer">
  //       Open Link
  //     </a>
  //   ) : null;
  // };
  // const getCustomerDetails = async customerId => {
  //   const res = await apiHandler({
  //     url:
  //       endpoint.ADMIN_CUSTOMER_CUSTOMERDETAILS_CUSTOMERID +
  //       "?customerId=" +
  //       customerId,
  //     authToken: sessionStorage.getItem("token")
  //   });

  //   if (res.data.errorCode) {
  //     if (res.data.errorCode === 401) {
  //       console.log("Unauthorized Access");
  //       props.history.push("/home/logout");
  //       return;
  //     } else if (res.data.errorCode === 403) {
  //       return;
  //     } else {
  //       setNoticeModalErrMsg(res.data.userDesc);
  //       setNoticeModalHeaderMsg("Error");
  //       setNoticeModal(true);
  //     }
  //   } else {
  //     let customerDetails = res.data;
  //     if (customerDetails.ownershipType !== "") {
  //       switch (customerDetails.ownershipType) {
  //         case "2":
  //           customerDetails.type = "Private";
  //           break;
  //         case "3":
  //           customerDetails.type = "Public";
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //     if (customerDetails.addresses) {
  //       customerDetails.business = customerDetails.addresses.filter(addr => {
  //         return addr.addressType === "BUSINESS_ADDRESS";
  //       })[0];
  //       customerDetails.office = customerDetails.addresses.filter(addr => {
  //         return addr.addressType === "REGISTERED_OFFICE_ADDRESS";
  //       })[0];
  //     }
  //     if (customerDetails.directors) {
  //       let directorColumn = [
  //         "First Name",
  //         "Last Name",
  //         "Date of Birth",
  //         "Email",
  //         "Address",
  //         "Country Code",
  //         "City",
  //         "Postal Code",
  //         "Address Proof",
  //         "Utility / Bank Statement"
  //       ];
  //       let directorData = [];
  //       customerDetails.directors.forEach((director, index) => {
  //         directorData.push([
  //           index,
  //           director.firstName,
  //           director.lastName,
  //           formatDate(director.dob),
  //           director.email,
  //           director.address,
  //           director.countryCode,
  //           director.city,
  //           director.postalCode,
  //           getDocumentLink(director.addressProofLink),
  //           getDocumentLink(director.utilityOrBankStmtLink)
  //         ]);
  //       });
  //       customerDetails.directorsInfo = {
  //         column: directorColumn,
  //         data: directorData
  //       };
  //     }
  //     setCustomerRegistrationDetails(customerDetails);
  //     setShowCustomerRegistrationDetails(true);
  //   }
  // };
  // const closeCustomerRegistrationDetails = () => {
  //   setCustomerRegistrationDetails({});
  //   setShowCustomerRegistrationDetails(false);
  // };
  const onClickSubMenuLinks = (param) => {
    if (sessionStorage.getItem('role') && sessionStorage.getItem('role') == 'role-prospect-user') {
      if (module === 'RISKS') {
        if (sessionStorage.getItem('riskStatus') && sessionStorage.getItem('riskStatus') === 'ACTIVE') param.his.push(param.to);
      }
    } else {
      param.his.push(param.to);
    }
  };
  const resetModule = () => {
    sessionStorage.removeItem('module');
  };
  const managerClasses = classNames({
    [classes.managerClasses]: true,
  });

  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: false,
  });

  let viewClient = sessionStorage.getItem('view_as_client');
  let role = sessionStorage.getItem('role');

  var authlist = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <NavLink to={module === 'RISKS' ? '/auth/risk-portal' : '/auth/portal-dashboard'} className={classes.navLink} onClick={(e) => checkIsDisabled(e)}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText primary={'Dashboard'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      {/* <ListItem className={classes.listItem}>
        <NavLink
          to={"/auth/risk-portal"}
          className={classes.navLink}
          onClick={e => checkIsDisabled(e)}
        >
          <ListItemText
            primary={"Risk Management"}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem> */}
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="info"
          buttonText="Risk Management"
          buttonProps={{
            round: true,
            fullWidth: true,
            color: 'info',
          }}
          onClick={onClickSubMenuLinks}
          dropdownList={
            module === 'RISKS'
              ? [
                  {
                    link: true,
                    to: '/auth/rate-calculator',
                    text: 'Reference Rate Calculator',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-insight',
                    text: 'Risk Insight',
                    his: history,
                  },
                  // {
                  //   link: true,
                  //   to: '/auth/fx-exposure-calculator1',
                  //   text: 'Exposure Calculator - 1',
                  //   his: history,
                  // },
                  {
                    link: true,
                    to: '/auth/fx-exposure-calculator',
                    text: 'Exposure Calculator',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-radar',
                    text: 'Risk Radar',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/fx-currency-risk-policy',
                    text: 'Currency Risk Policy',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/hedging-qna',
                    text: 'Hedging Guidance Q&A',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/portal-hedge',
                    text: 'Hedge Accounting',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/rate-alert',
                    text: 'Create Rate Alert',
                    his: history,
                  },
                ]
              : [
                  {
                    link: true,
                    to: '/auth/risk-portal',
                    text: 'FX Risk Management Framework',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-insight',
                    text: 'Risk Insight',
                    his: history,
                  },
                  // {
                  //   link: true,
                  //   to: '/auth/fx-exposure-calculator1',
                  //   text: 'Exposure Calculator - 1',
                  //   his: history,
                  // },
                  {
                    link: true,
                    to: '/auth/fx-exposure-calculator',
                    text: 'Exposure Calculator',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-radar',
                    text: 'Risk Radar',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/fx-currency-risk-policy',
                    text: 'Currency Risk Policy',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/hedging-qna',
                    text: 'Hedging Guidance Q&A',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/portal-hedge',
                    text: 'Hedge Accounting',
                    his: history,
                  },
                ]
          }
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/auth/market-rates'} className={classes.navLink} onClick={(e) => checkIsDisabled(e)}>
          {/* <Dashboard className={classes.listItemIcon} /> */}
          <ListItemText primary={'Market Intelligence'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      {/* <ListItem className={classes.listItem}>
        <NavLink to={'/auth/portal-hedge'} className={classes.navLink}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText primary={'Hedge Accounting'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem> */}
      {/* <ListItem className={classes.listItem}>
        <NavLink
          to={"/auth/pricing-page"}
          className={cx(classes.navLink, {
            [classes.navLinkActive]: this.activeRoute("/auth/pricing-page")
          })}
        >
          <MonetizationOn className={classes.listItemIcon} />
          <ListItemText
            primary={"Pricing"}
            disableTypography={true}
            className={classes.listItemText}
          />
        </NavLink>
      </ListItem> */}
      {module !== 'RISKS' && (
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor="info"
            buttonText="FX Dealing"
            buttonProps={{
              round: true,
              fullWidth: true,
              style: { marginBottom: '0' },
              color: 'info',
            }}
            onClick={onClickSubMenuLinks}
            dropdownList={[
              {
                link: true,
                to: '/auth/fx-spot-deals',
                text: 'FX Spot',
                his: history,
              },
              {
                link: true,
                to: '/auth/fx-forward-deals',
                text: 'FX Forward',
                his: history,
              },
            ]}
          />
        </ListItem>
      )}
      {module !== 'RISKS' && (
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor="info"
            buttonText="Payments"
            buttonProps={{
              round: true,
              fullWidth: true,
              color: 'info',
            }}
            onClick={onClickSubMenuLinks}
            dropdownList={[
              {
                link: true,
                to: '/auth/new-payment',
                text: 'New Payment',
                his: history,
              },
              {
                link: true,
                to: '/auth/manage-beneficiaries',
                text: 'Manage Beneficiaries',
                his: history,
              },
            ]}
          />
        </ListItem>
      )}
      {viewClient === 'true' && module !== 'RISKS' && (
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor="info"
            buttonText="Book Trade"
            buttonProps={{
              round: true,
              fullWidth: true,
              color: 'info',
            }}
            onClick={onClickSubMenuLinks}
            dropdownList={[
              {
                link: true,
                to: '/auth/fx-spot-manual-deals',
                text: 'FX Spot',
                his: history,
              },
              {
                link: true,
                to: '/auth/fx-forward-manual-deals',
                text: 'FX Forward',
                his: history,
              },
            ]}
          />
        </ListItem>
      )}
      {viewClient === 'true' && (
        <ListItem className={classes.listItem}>
          <Button color="info" onClick={handleAdminView}>
            VIEW AS ADMIN
          </Button>
        </ListItem>
      )}
      {/* <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
          >
            <NotificationsIcon className={classes.listItemIcon} />
          </Button>
        </div>
      </ListItem> */}
      {/* <ListItem className={classes.listItem}>
        <NavLink
          to={"/home/register-page"}
          className={cx(classes.navLink, {
            [classes.navLinkActive]: activeRoute("/auth/register-page")
          })}
        >
          <Person className={classes.listItemIcon} />
        </NavLink>
      </ListItem> */}
      <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            aria-label="Notifications"
            aria-owns={open ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={handleUserProfile}
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
            // buttonRef={node => {
            //   setAnchorEl(node);
            // }}
          >
            {/* <Notifications
              className={classes.headerLinksSvg + " " + classes.links}
            /> */}
            <Person className={classes.listItemIcon} />
            {/* <span className={classes.notifications}>5</span> */}
            <Hidden mdUp implementation="css">
              <span onClick={handleUserProfile} className={classes.linkText}>
                {'Notification'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openUserProfile}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement="bottom-end"
            className={classNames(
              {
                [classes.popperClose]: !openUserProfile,
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              },
              classes.settingsMenuList
            )}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleUserProfile}>
                    <MenuList role="menu">
                      <MenuItem dense disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span style={{ fontWeight: 600 }}>
                          {userInfo.firstName} {userInfo.lastName}
                        </span>
                        <span style={{ marginLeft: 10 }}>{userInfo.customerName}</span>
                      </MenuItem>
                      <MenuItem dense divider disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span>{userInfo.email}</span>
                      </MenuItem>
                      <MenuItem onClick={handleUserProfile} className={dropdownItem}>
                        <NavLink
                          to={'/auth/manage-account'}
                          className={cx(classes.navLinkWhite, {
                            [classes.navLinkActive]: activeRoute('/auth/manage-account'),
                          })}
                          onClick={(e) => checkIsDisabled(e)}
                        >
                          {'Manage Account'}
                        </NavLink>
                      </MenuItem>

                      {/* <MenuItem
                        onClick={handleUserProfile}
                        className={dropdownItem}
                      >
                        {"Settings"}
                      </MenuItem> */}
                      <MenuItem onClick={handleLogout} className={dropdownItem}>
                        {'Log Out'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ListItem>
    </List>
  );
  const adminlist = (
    <List className={classes.list}>
      <ListItem
        className={classes.listItem}
        onClick={() => {
          return false;
        }}
      >
        <NavLink to={'/auth/admin/admin-dashboard'} className={classes.navLink} x>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText primary={'Dashboard'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/auth/admin/customer-control-center'} className={classes.navLink}>
          <EventNoteIcon className={classes.listItemIcon} />
          <ListItemText primary={'Customer Control Center'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="info"
          buttonText="FXG"
          buttonProps={{
            round: true,
            fullWidth: true,
            style: { marginBottom: '0' },
            color: 'info',
          }}
          onClick={onClickSubMenuLinks}
          dropdownList={[
            {
              link: true,
              to: '/auth/admin/fxgtrade',
              text: 'FXG Trade',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/liquidity-provider',
              text: 'FXG Liquidity Provider',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/beneficiary',
              text: 'FXG Beneficiary',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/fxg-wallets',
              text: 'FXG Wallet',
              his: history,
            },
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/auth/admin/risk-management'} className={classes.navLink}>
          <MultilineChartIcon className={classes.listItemIcon} />
          <ListItemText primary={'Risk Management'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="info"
          buttonText="General Report"
          buttonProps={{
            round: true,
            fullWidth: true,
            style: { marginBottom: '0' },
            color: 'info',
          }}
          onClick={onClickSubMenuLinks}
          dropdownList={[
            {
              link: true,
              to: '/auth/admin/fx-spot-report',
              text: 'FX Spot',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/fx-forward-report',
              text: 'FX Forward',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/margin-report',
              text: 'Margins',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/payment-report',
              text: 'Third Party Payments',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/beneficiaries-report',
              text: 'Beneficiaries',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/signup-report',
              text: 'Signup Client',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/customer-registration-report',
              text: 'Customer Registration Application',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/keepme-updated-report',
              text: 'Keep me Updated',
              his: history,
            },
            {
              link: true,
              to: '/auth/admin/enquiry-report',
              text: 'Enquiry',
              his: history,
            },
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/auth/admin/sar-report'} className={classes.navLink}>
          <ReportOutlinedIcon className={classes.listItemIcon} />
          <ListItemText primary={'SAR Report'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/auth/admin/news-blogs'} className={classes.navLink}>
          <ListItemText primary={'Blogs'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
          >
            <NotificationsIcon className={classes.listItemIcon} />
          </Button>
        </div>
      </ListItem>
      <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            aria-label="Notifications"
            aria-owns={open ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={handleUserProfile}
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
          >
            <Person className={classes.listItemIcon} />
            {/* <span className={classes.notifications}>5</span> */}
            <Hidden mdUp implementation="css">
              <span onClick={handleUserProfile} className={classes.linkText}>
                {'Notification'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openUserProfile}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement="bottom-end"
            className={classNames(
              {
                [classes.popperClose]: !openUserProfile,
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              },
              classes.settingsMenuList
            )}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleUserProfile}>
                    <MenuList role="menu">
                      <MenuItem dense disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span style={{ fontWeight: 600 }}>
                          {userInfo.firstName} {userInfo.lastName}
                        </span>
                        <span style={{ marginLeft: 10 }}>{userInfo.customerName}</span>
                      </MenuItem>
                      <MenuItem dense divider disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span>{userInfo.email}</span>
                      </MenuItem>
                      {role === 'role-admin-user' && (
                        <MenuItem className={dropdownItem}>
                          <NavLink
                            to={'/auth/admin/manage-admin'}
                            className={cx(classes.navLinkWhite, {
                              [classes.navLinkActive]: activeRoute('/auth/admin/manage-admin'),
                            })}
                          >
                            {'Manage Admin User'}
                          </NavLink>
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleUserProfile} className={dropdownItem}>
                        <NavLink
                          to={'/auth/admin/common-settings'}
                          className={cx(classes.navLinkWhite, {
                            [classes.navLinkActive]: activeRoute('/auth/admin/manage-admin'),
                          })}
                        >
                          {'Settings'}
                        </NavLink>
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className={dropdownItem}>
                        {'Log Out'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ListItem>
    </List>
  );
  const allList = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <NavLink to='/auth/portal-dashboard' className={classes.navLink} onClick={(e) => checkIsDisabled(e)}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText primary={'Dashboard'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="info"
          buttonText="Risk Management"
          buttonProps={{
            round: true,
            fullWidth: true,
            color: 'info',
          }}
          onClick={onClickSubMenuLinks}
          dropdownList={[
                  {
                    link: true,
                    to: '/auth/risk-portal',
                    text: 'FX Risk Management Framework',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-insight',
                    text: 'Risk Insight',
                    his: history,
                  },
                  // {
                  //   link: true,
                  //   to: '/auth/fx-exposure-calculator1',
                  //   text: 'Exposure Calculator - 1',
                  //   his: history,
                  // },
                  {
                    link: true,
                    to: '/auth/fx-exposure-calculator',
                    text: 'Exposure Calculator',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-radar',
                    text: 'Risk Radar',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/fx-currency-risk-policy',
                    text: 'Currency Risk Policy',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/hedging-qna',
                    text: 'Hedging Guidance Q&A',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/portal-hedge',
                    text: 'Hedge Accounting',
                    his: history,
                  },
                ]
          }
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/auth/market-rates'} className={classes.navLink} onClick={(e) => checkIsDisabled(e)}>
          <ListItemText primary={'Market Intelligence'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="info"
          buttonText="FX Dealing"
          buttonProps={{
            round: true,
            fullWidth: true,
            style: { marginBottom: '0' },
            color: 'info',
          }}
          onClick={onClickSubMenuLinks}
          dropdownList={[
            {
              link: true,
              to: '/auth/fx-spot-deals',
              text: 'FX Spot',
              his: history,
            },
            {
              link: true,
              to: '/auth/fx-forward-deals',
              text: 'FX Forward',
              his: history,
            },
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="info"
          buttonText="Payments"
          buttonProps={{
            round: true,
            fullWidth: true,
            color: 'info',
          }}
          onClick={onClickSubMenuLinks}
          dropdownList={[
            {
              link: true,
              to: '/auth/new-payment',
              text: 'New Payment',
              his: history,
            },
            {
              link: true,
              to: '/auth/manage-beneficiaries',
              text: 'Manage Beneficiaries',
              his: history,
            },
          ]}
        />
      </ListItem>
      {viewClient === 'true' && (
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor="info"
            buttonText="Book Trade"
            buttonProps={{
              round: true,
              fullWidth: true,
              color: 'info',
            }}
            onClick={onClickSubMenuLinks}
            dropdownList={[
              {
                link: true,
                to: '/auth/fx-spot-manual-deals',
                text: 'FX Spot',
                his: history,
              },
              {
                link: true,
                to: '/auth/fx-forward-manual-deals',
                text: 'FX Forward',
                his: history,
              },
            ]}
          />
        </ListItem>
      )}
      {viewClient === 'true' && (
        <ListItem className={classes.listItem}>
          <Button color="info" onClick={handleAdminView}>
            VIEW AS ADMIN
          </Button>
        </ListItem>
      )}
      <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            aria-label="Notifications"
            aria-owns={open ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={handleUserProfile}
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
          >
            <Person className={classes.listItemIcon} />
            <Hidden mdUp implementation="css">
              <span onClick={handleUserProfile} className={classes.linkText}>
                {'Notification'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openUserProfile}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement="bottom-end"
            className={classNames(
              {
                [classes.popperClose]: !openUserProfile,
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              },
              classes.settingsMenuList
            )}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleUserProfile}>
                    <MenuList role="menu">
                      <MenuItem dense disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span style={{ fontWeight: 600 }}>
                          {userInfo.firstName} {userInfo.lastName}
                        </span>
                        <span style={{ marginLeft: 10 }}>{userInfo.customerName}</span>
                      </MenuItem>
                      <MenuItem dense divider disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span>{userInfo.email}</span>
                      </MenuItem>
                      <MenuItem onClick={handleUserProfile} className={dropdownItem}>
                        <NavLink
                          to={'/auth/manage-account'}
                          className={cx(classes.navLinkWhite, {
                            [classes.navLinkActive]: activeRoute('/auth/manage-account'),
                          })}
                          onClick={(e) => checkIsDisabled(e)}
                        >
                          {'Manage Account'}
                        </NavLink>
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className={dropdownItem}>
                        {'Log Out'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ListItem>
    </List>
  );
  const riskNavBar = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <NavLink to='/auth/risk-portal' className={classes.navLink} onClick={(e) => checkIsDisabled(e)}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText primary={'Dashboard'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      {sessionStorage.getItem('ht') === 'false' && (
      // <ListItem className={classes.listItem}>
      //   <NavLink to={'/auth/modules'} className={classes.navLink} onClick={() => resetModule()}>
      //     <ListItemText primary={'Plan Selection'} disableTypography={true} className={classes.listItemText} />
      //   </NavLink>
      // </ListItem>
      <ListItem className={classes.listItem}>
      <CustomDropdown
        hoverColor="info"
        buttonText="Plan Selection"
        buttonProps={{
          round: true,
          fullWidth: true,
          style: { marginBottom: '0' },
          color: 'info',
        }}
        // onClick={onClickSubMenuLinks}
        dropdownList={[
          {
            click: true,
            text: 'FX Risk Management',
            onClick: () => navigateToRiskModule(),
            his: history,
          },
          {
            click: true,
            text: 'FX Deals and Payments',
            onClick: () => navigateToTransactionModule(),
            his: history,
          },
        ]}
      />
    </ListItem>
      )}
      <ListItem className={classes.listItem}>
        <CustomDropdown
          hoverColor="info"
          buttonText="Risk Management"
          buttonProps={{
            round: true,
            fullWidth: true,
            color: 'info',
          }}
          onClick={onClickSubMenuLinks}
          dropdownList={[
                  {
                    link: true,
                    to: '/auth/rate-calculator',
                    text: 'Reference Rate Calculator',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-insight',
                    text: 'Risk Insight',
                    his: history,
                  },
                  // {
                  //   link: true,
                  //   to: '/auth/fx-exposure-calculator1',
                  //   text: 'Exposure Calculator - 1',
                  //   his: history,
                  // },
                  {
                    link: true,
                    to: '/auth/fx-exposure-calculator',
                    text: 'Exposure Calculator',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/risk-radar',
                    text: 'Risk Radar',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/fx-currency-risk-policy',
                    text: 'Currency Risk Policy',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/hedging-qna',
                    text: 'Hedging Guidance Q&A',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/portal-hedge',
                    text: 'Hedge Accounting',
                    his: history,
                  },
                  {
                    link: true,
                    to: '/auth/rate-alert',
                    text: 'Create Rate Alert',
                    his: history,
                  },
                ]
          }
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={'/auth/market-rates'} className={classes.navLink} onClick={(e) => checkIsDisabled(e)}>
          <ListItemText primary={'Market Intelligence'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      {viewClient === 'true' && (
        <ListItem className={classes.listItem}>
          <Button color="info" onClick={handleAdminView}>
            VIEW AS ADMIN
          </Button>
        </ListItem>
      )}
      <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            aria-label="Notifications"
            aria-owns={open ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={handleUserProfile}
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
          >
            <Person className={classes.listItemIcon} />
            <Hidden mdUp implementation="css">
              <span onClick={handleUserProfile} className={classes.linkText}>
                {'Notification'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openUserProfile}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement="bottom-end"
            className={classNames(
              {
                [classes.popperClose]: !openUserProfile,
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              },
              classes.settingsMenuList
            )}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleUserProfile}>
                    <MenuList role="menu">
                      <MenuItem dense disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span style={{ fontWeight: 600 }}>
                          {userInfo.firstName} {userInfo.lastName}
                        </span>
                        <span style={{ marginLeft: 10 }}>{userInfo.customerName}</span>
                      </MenuItem>
                      <MenuItem dense divider disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span>{userInfo.email}</span>
                      </MenuItem>
                      <MenuItem onClick={handleUserProfile} className={dropdownItem}>
                        <NavLink
                          to={'/auth/manage-account'}
                          className={cx(classes.navLinkWhite, {
                            [classes.navLinkActive]: activeRoute('/auth/manage-account'),
                          })}
                          onClick={(e) => checkIsDisabled(e)}
                        >
                          {'Manage Account'}
                        </NavLink>
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className={dropdownItem}>
                        {'Log Out'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ListItem>
    </List>
  );
  const noModuleNavBar = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            aria-label="Notifications"
            aria-owns={open ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={handleUserProfile}
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
          >
            <Person className={classes.listItemIcon} />
            <Hidden mdUp implementation="css">
              <span onClick={handleUserProfile} className={classes.linkText}>
                {'Notification'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openUserProfile}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement="bottom-end"
            className={classNames(
              {
                [classes.popperClose]: !openUserProfile,
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              },
              classes.settingsMenuList
            )}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleUserProfile}>
                    <MenuList role="menu">
                      <MenuItem dense disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span style={{ fontWeight: 600 }}>
                          {userInfo.firstName} {userInfo.lastName}
                        </span>
                        <span style={{ marginLeft: 10 }}>{userInfo.customerName}</span>
                      </MenuItem>
                      <MenuItem dense divider disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span>{userInfo.email}</span>
                      </MenuItem>
                      <MenuItem onClick={handleUserProfile} className={dropdownItem}>
                        <NavLink
                          to={'/auth/manage-account'}
                          className={cx(classes.navLinkWhite, {
                            [classes.navLinkActive]: activeRoute('/auth/manage-account'),
                          })}
                          onClick={(e) => checkIsDisabled(e)}
                        >
                          {'Manage Account'}
                        </NavLink>
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className={dropdownItem}>
                        {'Log Out'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ListItem>
    </List>
  );
  const transactionNavBar = (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <NavLink to='/auth/portal-dashboard' className={classes.navLink} onClick={(e) => checkIsDisabled(e)}>
          <Dashboard className={classes.listItemIcon} />
          <ListItemText primary={'Dashboard'} disableTypography={true} className={classes.listItemText} />
        </NavLink>
      </ListItem>
      {sessionStorage.getItem('ht') === 'false' && (
      // <ListItem className={classes.listItem}>
      //   <NavLink to={'/auth/modules'} className={classes.navLink} onClick={() => resetModule()}>
      //     <ListItemText primary={'Plan Selection'} disableTypography={true} className={classes.listItemText} />
      //   </NavLink>
      // </ListItem>
      <ListItem className={classes.listItem}>
      <CustomDropdown
        hoverColor="info"
        buttonText="Plan Selection"
        buttonProps={{
          round: true,
          fullWidth: true,
          style: { marginBottom: '0' },
          color: 'info',
        }}
        onClick={onClickSubMenuLinks}
        dropdownList={[
          {
            click: true,
            text: 'FX Risk Management',
            onClick: () => navigateToRiskModule(),
            his: history,
          },
          {
            click: true,
            text: 'FX Deals and Payments',
            onClick: () => navigateToTransactionModule(),
            his: history,
          },
        ]}
      />
    </ListItem>
      )}
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor="info"
            buttonText="FX Dealing"
            buttonProps={{
              round: true,
              fullWidth: true,
              style: { marginBottom: '0' },
              color: 'info',
            }}
            onClick={onClickSubMenuLinks}
            dropdownList={[
              {
                link: true,
                to: '/auth/fx-spot-deals',
                text: 'FX Spot',
                his: history,
              },
              {
                link: true,
                to: '/auth/fx-forward-deals',
                text: 'FX Forward',
                his: history,
              },
            ]}
          />
        </ListItem>
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor="info"
            buttonText="Payments"
            buttonProps={{
              round: true,
              fullWidth: true,
              color: 'info',
            }}
            onClick={onClickSubMenuLinks}
            dropdownList={[
              {
                link: true,
                to: '/auth/new-payment',
                text: 'New Payment',
                his: history,
              },
              {
                link: true,
                to: '/auth/manage-beneficiaries',
                text: 'Manage Beneficiaries',
                his: history,
              },
            ]}
          />
        </ListItem>
      {viewClient === 'true' && (
        <ListItem className={classes.listItem}>
          <CustomDropdown
            hoverColor="info"
            buttonText="Book Trade"
            buttonProps={{
              round: true,
              fullWidth: true,
              color: 'info',
            }}
            onClick={onClickSubMenuLinks}
            dropdownList={[
              {
                link: true,
                to: '/auth/fx-spot-manual-deals',
                text: 'FX Spot',
                his: history,
              },
              {
                link: true,
                to: '/auth/fx-forward-manual-deals',
                text: 'FX Forward',
                his: history,
              },
            ]}
          />
        </ListItem>
      )}
      {viewClient === 'true' && (
        <ListItem className={classes.listItem}>
          <Button color="info" onClick={handleAdminView}>
            VIEW AS ADMIN
          </Button>
        </ListItem>
      )}
      <ListItem className={classes.listItem}>
        <div className={managerClasses}>
          <Button
            color="transparent"
            justIcon
            aria-label="Notifications"
            aria-owns={open ? 'menu-list' : null}
            aria-haspopup="true"
            onClick={handleUserProfile}
            className={classes.buttonLink}
            muiClasses={{
              label: '',
            }}
          >
            <Person className={classes.listItemIcon} />
            <Hidden mdUp implementation="css">
              <span onClick={handleUserProfile} className={classes.linkText}>
                {'Notification'}
              </span>
            </Hidden>
          </Button>
          <Popper
            open={openUserProfile}
            anchorEl={anchorEl}
            transition
            disablePortal
            placement="bottom-end"
            className={classNames(
              {
                [classes.popperClose]: !openUserProfile,
                [classes.pooperResponsive]: true,
                [classes.pooperNav]: true,
              },
              classes.settingsMenuList
            )}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleUserProfile}>
                    <MenuList role="menu">
                      <MenuItem dense disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span style={{ fontWeight: 600 }}>
                          {userInfo.firstName} {userInfo.lastName}
                        </span>
                        <span style={{ marginLeft: 10 }}>{userInfo.customerName}</span>
                      </MenuItem>
                      <MenuItem dense divider disabled className={dropdownItem} style={{ color: '#000', opacity: 1 }}>
                        <span>{userInfo.email}</span>
                      </MenuItem>
                      <MenuItem onClick={handleUserProfile} className={dropdownItem}>
                        <NavLink
                          to={'/auth/manage-account'}
                          className={cx(classes.navLinkWhite, {
                            [classes.navLinkActive]: activeRoute('/auth/manage-account'),
                          })}
                          onClick={(e) => checkIsDisabled(e)}
                        >
                          {'Manage Account'}
                        </NavLink>
                      </MenuItem>
                      <MenuItem onClick={handleLogout} className={dropdownItem}>
                        {'Log Out'}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ListItem>
    </List>
  );
  const getNavbarList = () => {
    const access = sessionStorage.getItem('access');
    const module = sessionStorage.getItem('module');
    if (props.location.pathname.indexOf('/auth/admin') !== -1) {
      return adminlist;
    } else {
      return access === 'a' ? allList : module === 'TRANSACTION' ? transactionNavBar : module === 'RISKS' ? riskNavBar : noModuleNavBar;
    }
  };
  const navigateToRiskModule = async () => {
    console.log('RISKS');
    const res = await apiHandler({
      method: 'GET',
      url: endpoint.RISK_SUBSCRIPTION_STATUS,
      authToken: sessionStorage.getItem("token")
    });
    if (res.data.errorCode) {
      if (res.data.errorCode === 401) {
        console.log('Unauthorized Access');
        props.history.push('/home/logout');
        return;
      } else {
        sessionStorage.setItem('module', 'RISKS');
        props.history.push(`/auth/risk-subscription`);
      }
    } else {
      console.log(res.data);
      sessionStorage.setItem('riskStatus', res.data.status);
      sessionStorage.setItem('module', 'RISKS');
      if (res.data.status === 'ACTIVE') {
        props.history.push(`/auth/risk-portal`);
      } else {
        let expiry = res.data.planRenewalExpiryDate ? new Date(res.data.planRenewalExpiryDate) : null;
        let date = new Date();
        // date.setDate(date.getDate() - 15);
        if (res.data.status === 'INACTIVE' && res.data.paymentDeclined && expiry && expiry > date) {
          sessionStorage.setItem('riskStatus', 'INACTIVE_TIMEOUT');
          // props.history.push(`/auth/risk-payment`);
          props.history.push(`/auth/risk-portal`);
        } else {
          props.history.push(`/auth/risk-subscription`);
        }
      }
    }
  };
  const navigateToTransactionModule = () => {
    console.log('TRANSACTION');
    const status = sessionStorage.getItem('status');
    const role = sessionStorage.getItem('role');
    sessionStorage.setItem('module', 'TRANSACTION');
    if (status !== 'registered' && role == 'role-prospect-user') {
          history.push(`/auth/customer-registration`);
        } else history.push(`/auth/portal-dashboard`);
  };
  let idlePopupTimer = null;
  let idleLogoutTimer = null;
  let status = sessionStorage.getItem('status');
  let companyName = sessionStorage.getItem('company_name');
  let customerId = sessionStorage.getItem('customerId');
  let customerRegistrationAppliedDate = sessionStorage.getItem('customerRegistrationAppliedDate');
  console.log('MODULE - ', module);
  return (
    <AppBar position="static" className={classes.appBar + appBarClasses}>
      <IdleTimer
        ref={(ref) => {
          idlePopupTimer = ref;
        }}
        element={document}
        onActive={onActive}
        onIdle={onPopupIdle}
        onAction={onAction}
        debounce={250}
        timeout={popupTimeout}
      />
      <IdleTimer
        ref={(ref) => {
          idleLogoutTimer = ref;
        }}
        element={document}
        onActive={onActive}
        onIdle={onLogoutIdle}
        onAction={onAction}
        debounce={250}
        timeout={logoutTimeout}
      />
      {(module === 'RISKS' || module === 'TRANSACTION') && (
      <Popper className={classes.popper} open={open} anchorEl={anchorEl} placement={placement} transition style={status === 'approved' ? { width: 'fit-content' } : {}}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {status === 'prospect' && role !== 'role-prospect' && (
                <Typography className={classes.typography}>
                  {module === 'RISKS' 
                    ? sessionStorage.getItem('riskStatus') === 'ACTIVE'
                      ? 'Live!'
                      : sessionStorage.getItem('riskStatus') === 'INACTIVE_TIMEOUT'
                        ? 'For continuing access, please complete the step below'
                        : 'For Risk Management access, please subscribe to one of the plans below' 
                    : 'For live access, please complete the Customer Registration Form'}
                </Typography>
              )}
              {status === 'prospect' && role === 'role-prospect' && (
                <Typography className={classes.typography}>
                  {'This is a demo of FXGuard. For live access, please click '}
                  <NavLink to={'/auth/customer-registration'}>here</NavLink>
                  {/* <a
                      style={{ cursor: "pointer" }}
                      onClick={() => getCustomerDetails(customerId)}
                    >
                      here
                    </a> */}
                  {' and complete Customer Registration'}
                  {/* <NavLink
                    to={"/auth/customer-registration"}
                    className={classes.navLink}
                    style={{ display: "inline" }}
                  >
                    <Button size="sm">Customer Registration</Button>
                  </NavLink> */}
                </Typography>
              )}
              {/* {status === "registered" && (
                <Typography className={classes.typography}>
                  {"You have already applied for the Customer Registration on "}
                  {customerRegistrationAppliedDate}
                  {
                    ". We will contact you as soon as possible to get you live so that you can manage your FX risks. Your application details can be found here "
                  }
                  {customerId && customerId !== -1 && (
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => getCustomerDetails(customerId)}
                    >
                      Click
                    </a>
                  )}
                </Typography>
              )} */}
              {status === 'approved' && (
                <Typography
                  className={classes.typography}
                  style={{ color: '#31AE0C' }}
                  title="You are in Live environment and all deals are live and legally binding. Terms and Conditions Apply "
                >
                  Live!
                </Typography>
              )}
              {status === 'view_as_client' && (
                <Typography className={classes.typography}>
                  <span>{companyName}</span>
                </Typography>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
      )}
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={classes.flex}>
            {status === 'admin' ? (
              <NavLink to={'/auth/admin/admin-dashboard'} className={classes.navLink}>
                <img src={LogoBlue} alt="logo" className={classes.logo} />
              </NavLink>
            ) : (
              <>
                {module === 'RISKS' ? (
                  <>
                  {sessionStorage.getItem('riskStatus') === 'ACTIVE' ? (
                    <NavLink to={'/auth/risk-portal'} className={classes.navLink}>
                      <img src={LogoBlue} alt="logo" className={classes.logo} />
                    </NavLink>
                  ) : (
                    <NavLink to={'/auth/risk-subscription'} className={classes.navLink}>
                      <img src={LogoBlue} alt="logo" className={classes.logo} />
                    </NavLink>
                  )}
                  </>
                ) : (
                  <>
                  {module === 'TRANSACTION' ? (
                  <NavLink to={'/auth/portal-dashboard'} className={classes.navLink}>
                    <img src={LogoBlue} alt="logo" className={classes.logo} />
                  </NavLink>
                  ) : (
                    <img src={LogoBlue} alt="logo" className={classes.logo} />
                  )}
                  </>
                )}
              </>
            )}
          </div>
        </Hidden>
        <Hidden mdUp>
          <div className={classes.flex}>
            <Button href="#" className={classes.title} color="transparent">
              {/* MD Pro React */}
              <img src={LogoBlue} alt="logo" className={classes.logo} />
            </Button>
          </div>
        </Hidden>
        <Hidden smDown>{getNavbarList()}</Hidden>
        <Hidden mdUp>
          <Button className={classes.sidebarButton} color="transparent" justIcon aria-label="open drawer" onClick={handleDrawerToggle}>
            <Menu />
          </Button>
        </Hidden>
        <Hidden mdUp>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={'right'}
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {getNavbarList()}
            </Drawer>
          </Hidden>
        </Hidden>
      </Toolbar>
      {/* <CustomerRegistrationDialog
        showModal={showCustomerRegistrationDetails}
        customerRegistrationDetails={customerRegistrationDetails}
        closeModal={closeCustomerRegistrationDetails}
      /> */}
      {noticeModal && (
        <Dialog
          classes={{
            root: classes.center + ' ' + classes.modalRoot,
            paper: classes.modal,
          }}
          open={noticeModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => handleClose()}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle id="notice-modal-slide-title" disableTypography className={classes.modalHeader}>
            <h4 className={classes.modalTitle}>{noticeModalHeaderMsg}</h4>
          </DialogTitle>
          <DialogContent id="notice-modal-slide-description" className={classes.modalBody}>
            <TimeoutTimer resetTimer={resetTimer} />
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }} className={classes.modalFooter + ' ' + classes.modalFooterCenter}>
            {/* <Button onClick={() => handleClose()} color="info" round>
              STAY
            </Button> */}
          </DialogActions>
        </Dialog>
      )}
    </AppBar>
  );
}

AuthNavbar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  brandText: PropTypes.string,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default withStyles(authNavbarStyle)(AuthNavbar);
