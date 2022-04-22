import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../newLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import axios from "axios";
import { url } from "../../utils/constants";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { UserContext } from "../../model/user-context/UserContext";
import { ListItem, TextField, Autocomplete, InputAdornment, Menu, MenuItem } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SearchItem from "./SearchItem";

const settings = ["Profile", "Account", "Logout"];

const MainHeader = (props) => {
  const [state, dispatch] = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userDetails, setUserDetails] = useState();
  const history = useHistory();
  const [searchOptions, setSearchOptions] = useState([])
  const searchText = useSelector(state => state.search.searchText);
  const [autoCompleteState, setAutoCompleteState] = useState(false)
  const dispatcher = useDispatch();

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
  const profile = () => {
    dispatcher({ type: 'CLEAR_ALL_SEARCH' })
    history.push({
      pathname: "/profile/" + state.user?.username,
      state: { emailId: state.user?.emailId, userid: state.user?.userid },
    });
    history.go();
  };

  const navigationHandler = (event) => {
    dispatch({ type: 'CLEAR_ALL_SEARCH' })
    if (event.target.value == "DAW") {
      history.push("/dashboard");
    } else {
      history.push("/" + event.target.value.toString().toLowerCase());
    }
  };

  const logout = () => {
    dispatch({ type: 'CLEAR_ALL_SEARCH' })
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (isUserLoggedin) {
      getUserDetails();
    }
  }, [state]);

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
    localStorage.setItem("currentUserId", res.data.userid);
  };

  const onSearch = (e) => {
    const search = e.target.value?.trim();
    dispatcher({ type: 'UPDATE_SEARCH', value: search });
    if (search) {
      getPosts(search);
    }
    else {
      setSearchOptions([])
    }
  }

  const getPosts = async (searchText) => {
    let token = localStorage.getItem("auth-token");
    const finalUrl=`${url}/search/${searchText}`
    const res = await axios.get(finalUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    const data = res.data;
    const allItems = data.users?.filter(i=>i.userid != res.data.userId)?.concat(data.posts.content);
    let userid = '-1'
    if (allItems.length === 0) userid = '-2';
    allItems.push({ username: '-1', userid: userid, postId: '-1', title: searchText })

    setSearchOptions(allItems)
  }

  const onSelectItem = (item) => {
    setAutoCompleteState(false)
  }

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
              {/* <img className="mt-1 h-10" src={logo} alt={"logo"} /> */}
              <h1 className="mt-2 ml-2">Open Beats</h1>
            </Link>
          </Typography>
          {
            window.location.pathname === '/home' && (
              <Autocomplete
                freeSolo
                autoComplete
                includeInputInList
                options={searchOptions}
                onInputChange={onSearch}
                open={autoCompleteState}
                onOpen={() => setAutoCompleteState(true)}
                onClose={() => setAutoCompleteState(false)}
                getOptionLabel={(option) => JSON.stringify(option)}
                renderOption={(option, index) => {
                  return <SearchItem key={index} details={option} searchText={searchText} onSelectItem={onSelectItem} />
                }}
                renderInput={(params) => <TextField  {...params} placeholder='Search for songs, artists and more...' size='small'
                  style={{ minWidth: '320px', borderRadius: '30px', marginLeft: '150px' }}
                />
                }
              />
            )
          }
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Link className=" flex flex-row " to="/dashboard">
              {/* <img className="mt-1 h-10" src={logo} alt={"logo"} /> */}
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
                    <NotificationsIcon />
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
