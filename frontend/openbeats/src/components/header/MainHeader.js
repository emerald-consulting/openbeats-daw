import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../newLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import axios from "axios";
import { notificationsPolling, url } from "../../utils/constants";
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
import DehazeIcon from '@mui/icons-material/Dehaze';
import { UserContext } from "../../model/user-context/UserContext";
import { ListItem, TextField, Autocomplete, InputAdornment, Menu, MenuItem } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SearchItem from "./SearchItem";
import {clearAllSearch, updateSearch} from "../../model/search/searchReducer";
import _ from "lodash";
import NotificationList from "./notifications/NotificationList";
// import { ClassNames } from "@emotion/react";
import classes from "./MainHeader.module.css";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  // root: {
  //   backgroundColor: "yellow"
  // },
  clearIndicator: {
    backgroundColor: "gray",
    "& span": {
      "& svg": {
        backgroundColor: "red"
      }
    }
  }
}));


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
  let token = localStorage.getItem("auth-token");
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);




  const muiClasses = useStyles();
  const isUserLoggedin = state.user?.emailId.trim().length > 0;
  const pages = isUserLoggedin
    ? ["Home", "Inbox", "Daw"]
    : ["About", "Pricing", "Login", "Signup"];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const profile = () => {
    dispatcher(clearAllSearch())
    history.push({
      pathname: "/profile/" + state.user?.username,
    });
    // history.go();
  };

  const navigationHandler = (event) => {
    // debugger;
    // console.log(event.target.value.toString().toLowerCase());
    dispatcher(clearAllSearch())
    if (event.target.value == "DAW") {
      history.push("/dashboard");
    } else {
      history.push("/"+event.target.value.toString().toLowerCase());
    }
  };

  const logout = () => {
    dispatcher(clearAllSearch())
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (isUserLoggedin) {
      getUserDetails();
    }
  }, [state]);

  const getUserDetails = async () => {
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
    dispatcher(updateSearch(search));
    if (search) {
      getPosts(search);
    }
    else {
      setSearchOptions([])
    }
  }

  const getPosts = async (searchText) => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      getNotifications();
    }, notificationsPolling);
    return () => clearInterval(interval);
  }, []);

  const getNotifications = async()=>{
    const res = await axios.get(
      url + "/getNotifications/0",
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
    let list = res.data.content;
    let unread = list.filter(item => !item.isRead);
    setUnreadNotificationsCount(unread.length)
    setNotifications(list);
  }

  const onClickNotificationHandler = () =>{
    if(!showNotification){
      markNotificationsAsRead();
    }
    setShowNotification(prev=> !prev);
  }

  const markNotificationsAsRead = () =>{
    const res = axios.put(
      url + "/markNotificationsAsRead", null,
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
  }

  const addedClasses = props.className + "custom-header";

  return (
    <AppBar
      className={addedClasses}
      position="static"
      sx={{ backgroundColor: "#ffff", color: "#10b981" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ maxHeight: "80px", display:"flex", flexDirection:"row"}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2}}
          >
            <Link
              className=" flex flex-row "
              to={isUserLoggedin ? "/home" : "/"}
            >
              <img className="mt-1 h-10" src={logo} alt={"logo"} />
              <h1 className="mt-2 ml-2">Open Beats</h1>
            </Link>
          </Typography>
          {
            (window.location.pathname === '/home' || window.location.pathname.includes('/profile') ) && (
              <Autocomplete
                sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}
                style={{ width: "45%"}}
                freeSolo
                autoComplete
                muiClasses={{clearIndicatorDirty: classes.clearIndicator}}
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
                  style={{ marginLeft: '33%' }}
                />
                }
              />
            )
          }

{
            (window.location.pathname === '/home' || window.location.pathname.includes('/profile') ) && (
              <Autocomplete
                sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}
                style={{ width: "45%" }}
                freeSolo
                autoComplete
                muiClasses={{clearIndicatorDirty: classes.clearIndicator}}
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
                  style={{ marginLeft: '15%' }}
                />
                }
              />
            )
          }


          <Box sx={{ flexGrow: 1 }} />
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          > */}
            {/* <Link className=" flex flex-row " to="/dashboard"> */}
              {/* <img className="mt-1 h-10" src={logo} alt={"logo"} /> */}
              {/* <strong className="mt-2 ml-2">Open Beats</strong> */}
            {/* </Link> */}
          {/* </Typography> */}
          <Box className={classes.nav}>
            {pages.map((page) => (
              // console.log(page),
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

          {!isUserLoggedin && (
            <Box className={classes.responsiveNav}>
          <Tooltip title="Open settings" className={classes.responsiveNav}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} >
              <DehazeIcon />
            </IconButton>
          </Tooltip>


          <Menu
            sx={{ maxWidth: "150px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}

            anchorOrigin={{
              vertical: "bottom",
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

                {pages.map((page) => (

                <MenuItem>


                  <Button
                    key={page}
                    value={page}
                    onClick={navigationHandler}
                    style={{textTransform: "capitalize", color:"inherit", fontSize: "inherit", padding:"6px 18px"}}
                  >
                    {page}
                  </Button>

                  </MenuItem>
            ))}

        </Menu>

        </Box>
          )}
















          {isUserLoggedin && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Notifications">
                <IconButton
                  size="large"
                  aria-label="show notifications"
                  color="inherit"
                  className="m-5"
                  style={{ marginRight: "15px" }}
                  onClick={onClickNotificationHandler}
                >
                  <Badge badgeContent={unreadNotificationsCount} color="error">
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
                sx={{ maxWidth: "150px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}

                anchorOrigin={{
                  vertical: "bottom",
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

                <Box className={classes.responsiveNav}>

                  {pages.map((page) => (

                  <MenuItem >


                    <Button
                      key={page}
                      value={page}
                      onClick={navigationHandler}
                      style={{textTransform: "capitalize", color: "inherit", fontSize: "inherit", padding:"6px 18px"}}
                    >
                      {page}
                    </Button>

                    </MenuItem>
              ))}
                </Box>

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
      {showNotification && <NotificationList data={notifications} onClickNotificationHandler={onClickNotificationHandler}/>}
    </AppBar>
  );
};

export default MainHeader;
