import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../openbeats_notype-45.png";
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

const settings = ["Profile", "Account", "Logout"];

const MainHeader = (props) => {
  const [state, dispatch] = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const history = useHistory();
  const isUserLoggedin = state.user?.emailId.trim().length > 0;
  console.log(state.user);
  const pages = isUserLoggedin
    ? ["HOME", "INBOX", "DASHBOARD"]
    : ["ABOUT", "PRICING", "LOGIN", "SIGNUP"];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigationHandler = (event) => {
    history.push(event.target.value.toString().toLowerCase());
  };

  const logout = () => {
    localStorage.setItem("auth-token", "");
    localStorage.setItem("emailId", "");
    window.location.href = "/login";
  };

  const addedClasses = props.className + "custom-header";

  return (
    <AppBar
    className={addedClasses}
      position="static"
      sx={{ backgroundColor: "#ffff", color: "#049669" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ maxHeight: '80px'}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <Link className=" flex flex-row " to={isUserLoggedin? '/home': '/'}>
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
                sx={{ my: 2,color: "inherit",  display: "block" }}
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
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Harry" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
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
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={logout}>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainHeader;
