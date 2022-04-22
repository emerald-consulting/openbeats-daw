import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../newLogo.png";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { UserContext } from "../../model/user-context/UserContext";
import { ListItem } from "@mui/material";
import axios from "axios";
import { url } from "../../utils/constants";
import { NotificationItem } from "../notifications/NotificationItem";

const settings = ["Profile", "Account", "Logout"];

const MainHeader = (props) => {
  const [state, dispatch] = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userDetails, setUserDetails] = useState();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const history = useHistory();
  const isUserLoggedin = state.user?.emailId.trim().length > 0;
  const pages = isUserLoggedin
    ? ["HOME", "INBOX", "DAW"]
    : ["ABOUT", "PRICING", "LOGIN", "SIGNUP"];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [refresh, setRefresh] = useState(0);
  const refreshPosts = () => {
    setRefresh((prev) => prev + 1);
  };

  const profile = () => {
    history.push({
      pathname: "/profile/" + state.user?.username,
      state: { emailId: state.user?.emailId, userid: state.user?.userid },
    });
    history.go();
  };

  const navigationHandler = (event) => {
    if (event.target.value == "DAW") {
      history.push("dashboard");
    } else {
      history.push("/" + event.target.value.toString().toLowerCase());
    }
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("emailId");
    localStorage.removeItem("playlist");
    localStorage.removeItem("versions");
    window.location.href = "/login";
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (isUserLoggedin) {
      getUserDetails();
    }
  }, [state]);

  useEffect(() => {
    getFollowNotifications();
  }, []);

  const getUserDetails = async () => {
    let token = localStorage.getItem("auth-token");
    const res = await axios.get(
      url + "/getAuthorDetails/" + state.user.userid,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          Authorization: "Bearer " + token,
        },
      }
    );
    setUserDetails(res.data);
  };

  const getFollowNotifications = async () => {
    let token = localStorage.getItem("auth-token");
    const res = await axios.get(url + "/getNotifications/0", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setNotifications(res.data.content);
  };

  const addedClasses = props.className + "custom-header";

  return (
    <AppBar
      className={addedClasses}
      position="static"
      sx={{ backgroundColor: "#ffff", color: "#10b981" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ maxHeight: "80px" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <Link
              className=" flex flex-row "
              to={isUserLoggedin ? "/home" : "/"}
            >
              <img className="mt-1 h-10" src={logo} alt={"logo"} />
              <h1 className="mt-2 ml-2">Open Beats</h1>
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Link className=" flex flex-row " to="/dashboard">
              <img className="mt-1 h-10" src={logo} alt={"logo"} />
              <strong className="mt-2 ml-2">Open Beats</strong>
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                value={page}
                onClick={navigationHandler}
                sx={{ my: 2, color: "inherit", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {isUserLoggedin && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Notifications">
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  className="m-5"
                  style={{ marginRight: "15px" }}
                >
                  <Badge badgeContent={17} color="error">
                    <IconButton ref={anchorRef} onClick={handleToggle}>
                      <NotificationsIcon />
                    </IconButton>
                    {open && (
                      <NotificationItem
                        handleClose={handleClose}
                        handleListKeyDown={handleListKeyDown}
                        anchorRef={anchorRef}
                        open={open}
                        notifications={notifications}
                      />
                    )}
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={state.user.username}
                    src={userDetails?.profilePictureFileName}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px", maxWidth: "200px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
                <MenuItem onClick={profile}>
                  <ListItem>Profile</ListItem>
                </MenuItem>
                <MenuItem onClick={logout}>
                  <ListItem>Logout</ListItem>
                </MenuItem>

                {/* {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu} divider>
                    <ListItem onClick={getOnClickHandler(setting)}>
                    <Typography
                      textAlign="center"
                      // onClick={getOnClickHandler(setting)}
                    >
                      {setting}
                    </Typography></ListItem>
                  </MenuItem>
                ))} */}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainHeader;
