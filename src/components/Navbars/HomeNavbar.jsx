import React, { useState, useEffect } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";

// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import LogoBlue from "assets/img/FXguardBlueLogoTransparent.png";

// core components
import Button from "components/CustomButtons/Button";

import homeNavbarStyle from "assets/jss/material-dashboard-pro-react/components/homeNavbarStyle.jsx";

const HomeCustomDropdown = withStyles({
  menuButton: {
    color: "black",
    fontWeight: 500,
    "&:hover": {
      color: "black"
    },
    "&:focus": {
      color: "black"
    }
  }
})(CustomDropdown);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const HomeNavbar = props => {
  const [open, setOpen] = useState(false);
  const { classes, color, data, history } = props;
  const [noticeModalMsg, setNoticeModalMsg] = React.useState("");
  const [noticeModalHeaderMsg, setNoticeModalHeaderMsg] = React.useState("");
  const [noticeModal, setNoticeModal] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = routeName => {
    return props.location.pathname.indexOf(routeName) > -1 ? true : false;
  };

  const componentDidUpdate = () => {
    if (history.location.pathname !== props.location.pathname) {
      setOpen(false);
    }
    // clear all token
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('lastLoginTime');
    sessionStorage.removeItem('tokenTime');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('status');
    sessionStorage.removeItem('riskStatus');
    sessionStorage.removeItem('readonly_customer');
    sessionStorage.removeItem('customerId');
    sessionStorage.removeItem('view_as_client');
    sessionStorage.removeItem('customerRegistrationAppliedDate');
    sessionStorage.removeItem('module');
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('ht');
  };

  const messageBoxClick = () => {
    setNoticeModal(true);
    setNoticeModalHeaderMsg("");
    setNoticeModalMsg("Please Sign Up for access to DASHBOARD");
  };

  const handleClose = () => {
    setNoticeModal(false);
  };

  useEffect(e => {
    componentDidUpdate(e);
  }, []);

  const onClick = param => {
    param.his.push(param.to);
  };

  const appBarClasses = cx({
    [" " + classes[color]]: color
  });

  // data.menu = data.menu.filter(item => {
  //   if ((authenticated === undefined || !authenticated) && item.isAuthenticated) {
  //     return true;
  //   }else if(){

  //   }
  // });

  var list = navLink => (
    <List className={classes.list}>
      {data.menu.map((menuItem, index) => {
        return (
          <ListItem className={classes.listItem} key={index}>
            {menuItem.type === "buttonMenu" && (
              <HomeCustomDropdown
                hoverColor="info"
                innerDropDown
                buttonText={menuItem.label}
                buttonProps={{
                  round: true,
                  fullWidth: true,
                  style: { marginBottom: "0" },
                  color: "info"
                }}
                onClick={onClick}
                dropdownList={menuItem.children.map(subMenuItem => {
                  return {
                    link: true,
                    to: "" + subMenuItem.link,
                    text: subMenuItem.label,
                    his: history
                  };
                })}
              />
            )}
            {(menuItem.type === "button" ||
              menuItem.type === "buttonPrimary") && (
              <NavLink
                to={"" + menuItem.link}
                style={{ marginBottom: 10 }}
                className={cx(
                  menuItem.type === "buttonPrimary" && classes.listItemButton,
                  navLink,
                  {
                    [classes.navLinkActive]: activeRoute(menuItem.link)
                  }
                )}
              >
                <ListItemText
                  primary={menuItem.label}
                  disableTypography={true}
                  className={classes.listItemText}
                />
              </NavLink>
            )}
            {menuItem.type === "messageBox" && (
              <Button
                className={cx(classes.title, classes.messageBoxButton)}
                onClick={messageBoxClick}
                style={{ width: "100%", textAlign: "left" }}
                color="transparent"
              >
                <ListItemText
                  primary={menuItem.label}
                  disableTypography={true}
                  className={cx(classes.listItemButton, navLink, {
                    [classes.navLinkActive]: activeRoute(menuItem.link)
                  })}
                />
              </Button>
            )}
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <AppBar position="static" className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={classes.flex}>
            <NavLink to={"/home"} className={classes.navLink}>
              {/* <Button size="sm" className={classes.title} color="transparent"> */}
              {/* {brandText} */}
              <img src={LogoBlue} alt="logo" className={classes.logo} />
              {/* </Button> */}
            </NavLink>
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
        <Hidden smDown>{list(classes.navLink)}</Hidden>
        <Hidden mdUp>
          <Button
            className={classes.sidebarButton}
            color="primary"
            justIcon
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
        <Hidden mdUp>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={"right"}
              open={open}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {list(classes.navLink)}
            </Drawer>
          </Hidden>
        </Hidden>
      </Toolbar>
      {noticeModal && (
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal
          }}
          open={noticeModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => handleClose("noticeModal")}
          aria-labelledby="notice-modal-slide-title"
          aria-describedby="notice-modal-slide-description"
        >
          <DialogTitle
            id="notice-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <h4 className={classes.modalTitle}>{noticeModalHeaderMsg}</h4>
          </DialogTitle>
          <DialogContent
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <p>{noticeModalMsg}</p>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            <Button
              onClick={() => handleClose("noticeModal")}
              color="info"
              round
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AppBar>
  );
};

HomeNavbar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string,
  data: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object
};

export default withStyles(homeNavbarStyle)(HomeNavbar);
