import {
  Avatar,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Profile.module.css";
import { url } from "../../utils/constants";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import UserProfileForm from "./UserProfileForm";
import { useHistory, useLocation } from "react-router";
import Nav from "react-bootstrap/Nav";
import PostList from "../postList/PostList";

const Profile = (props) => {
  const [profileUrl, setProfileUrl] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  let history = useHistory();
  const [refresh, setRefresh] = useState(0);
  const [postsUri, setPostsUri] = useState("getPostsByUser");

  let token = localStorage.getItem("auth-token");
  const [isLoading,setIsLoading]=useState(false);
  const user = useSelector((_state) => _state.user);
  let jwtToken = `${user.jwtToken}`;
  
  const currentUserId=+window.location.pathname.split('/')[2];
  
  const location = useLocation();
  // const eId = location.state?.emailId;

  const handleClickOpen = () => {
    if(!currentUserId){

      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProfileModalOpen = () => {
    setOpenUserModal(true);
  };

  const handleProfileModalClose = () => {
    setOpenUserModal(false);
  };

  const handleFollowingModalOpen = () => {
    setShowFollowing(true);
  };

  const handleFollowingModalClose = () => {
    setShowFollowing(false);
  };

  const handleFollowerModalOpen = () => {
    setShowFollowers(true);
  };

  const handleFollowerModalClose = () => {
    setShowFollowers(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value,
    });
  };

  const updateUser = async () => {
    const res = await axios.put(url + "/updateUserProfile", currentUser, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setCurrentUser(res.data);
    handleProfileModalClose();
  };

  const getPicture = async () => {
    if(currentUserId){
      const res = await axios.get(
        url + "/getAuthorDetails/" + currentUserId,
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

    setCurrentUser(res.data);
    setProfileUrl(res.data.profilePictureFileUrl);
    setCoverUrl(res.data.coverPictureFileUrl);
    }
    else{
    const res = await axios.get(url + "/getPicture/" + props.username, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setCurrentUser(res.data);
    setProfileUrl(res.data.profilePictureFileUrl);
    setCoverUrl(res.data.coverPictureFileUrl);
  }
  };

  const addProfilePicture = async () => {
    const formData = new FormData();
    formData.append("profilePicture", profileFile);
    formData.append("coverPicture", coverFile);
    const res = await axios.post(url + "/picture", formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    getPicture();
    handleClose();
  };

  const onClose = () => {
    setPreview(profileUrl);
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const onCrop = (preview) => {
    setPreview(preview);
    const profileFile = dataURLtoFile(preview, "test.jpg");
    setProfileFile(profileFile);
  };

  useEffect(() => {
    getPicture();
  }, []);

  useEffect(() => {
    if(!currentUserId){
      getPicture();
    }
  }, [location,props.isFollowing]);

  useEffect(() => {
    addProfilePicture();
  }, [coverFile]);

  const fileRef = useRef();

  const handleChange = (e) => {
    const [file] = e.target.files;
    const testFile = e.target.files[0];
    setCoverFile(testFile);
  };

  const upgradeUser = () => {
    const formData = new FormData();
    formData.append("email", currentUser.emailId);

    axios
      .post(url + "/upgradeUser", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        if (response) {
          setCurrentUser({
            ...currentUser,
            subscriptionType: "paid",
          });
        }
      });
  };

  const messageHandler = async () => {
    const res = await axios.post(
      url + "/startConversation/" + currentUser.userid,
      null,
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
    history.push("/inbox?conversationId=" + res.data.conversationId);
  };

  const refreshPosts = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div>
      <div>
        <div>
          <Button
            onClick={() => fileRef.current.click()}
            disabled={!props.isCurrentUser}
          >
            <img
              src={coverUrl}
              style={{ width: "1000px", height: "300px" }}
            ></img>
          </Button>
          <input
            ref={fileRef}
            onChange={(e) => {
              handleChange(e);
            }}
            multiple={false}
            type="file"
            hidden
          />
          {props.isCurrentUser ? (
            <Button
              variant="contained"
              onClick={handleProfileModalOpen}
              style={{
                float: "right",
                marginTop: "20px",
                backgroundColor: "#1E90FF",
              }}
              disabled={!props.isCurrentUser}
            >
              Edit Profile
            </Button>
          ) : !props.isFollowing ? (
            <Button
              variant="contained"
              onClick={props.followUser}
              style={{
                float: "right",
                marginTop: "20px",
                backgroundColor: "#1E90FF",
                color: "black",
              }}
              disabled={props.isCurrentUser}
            >
              Follow
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={props.unfollowUser}
              style={{
                float: "right",
                marginTop: "20px",
                backgroundColor: "#1E90FF",
                color: "black",
              }}
              disabled={props.isCurrentUser}
            >
              Unfollow
            </Button>
          )}
          {!props.isCurrentUser && (
            <Button
              variant="contained"
              onClick={messageHandler}
              style={{
                float: "right",
                marginTop: "20px",
                marginRight: "10px",
                backgroundColor: "#1E90FF",
                color: "black",
              }}
              disabled={props.isCurrentUser}
            >
              Message
            </Button>
          )}

          {openUserModal ? (
            <UserProfileForm
              user={currentUser}
              handleClickOpen={handleProfileModalOpen}
              handleClose={handleProfileModalClose}
              open={openUserModal}
              handleInputChange={handleInputChange}
              updateUser={updateUser}
              upgradeUser={upgradeUser}
            ></UserProfileForm>
          ) : null}
        </div>
        <Button onClick={handleClickOpen} disabled={!props.isCurrentUser}>
          <Avatar
            src={profileUrl}
            sx={{
              width: 202,
              height: 202,
              transform: `translate(30px, -100px)`,
            }}
          ></Avatar>
        </Button>
        {open ? (
          <ProfilePicture
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
            onCrop={onCrop}
            onClose={onClose}
            click={true}
            preview={preview}
            src={profileUrl}
            addProfilePicture={addProfilePicture}
          />
        ) : null}
        <div style={{ transform: `translate(55px, -80px)` }}>
          <Typography sx={{ fontSize: 25, fontWeight: "bold" }}>
            {currentUser.firstName} {currentUser.lastName}
          </Typography>
          <Typography sx={{ fontSize: 18, color: "#66CDAA" }}>
            @{currentUser.username}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: 18 }}>
            {currentUser.bio}
          </Typography>
          <br />
          {currentUser.totalFollowing ? (
            <span style={{ color: "black" }}>{currentUser.totalFollowing}</span>
          ) : (
            <span style={{ color: "black" }}>0</span>
          )}
          &nbsp;&nbsp;
          <Button onClick={handleFollowingModalOpen}>
            <span style={{ color: "#66CDAA" }}>Following</span>
          </Button>
          {showFollowing && (
            <Dialog
              open={showFollowing}
              onClose={handleFollowingModalClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">FOLLOWING</DialogTitle>
              <DialogContent>
                {props.followingList &&
                  props.followingList.map((val) => (
                    <DialogContentText id="alert-dialog-description">
                      <a
                        href={"/profile/" + val}
                        style={{ cursor: "pointer", color: "#66CDAA" }}
                      >
                        @{val}
                      </a>
                    </DialogContentText>
                  ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleFollowingModalClose}>Ok</Button>
              </DialogActions>
            </Dialog>
          )}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {currentUser.totalFollowers ? (
            <span style={{ color: "black" }}>{currentUser.totalFollowers}</span>
          ) : (
            <span style={{ color: "black" }}>0</span>
          )}
          &nbsp;&nbsp;
          <Button onClick={handleFollowerModalOpen}>
            <span style={{ color: "#66CDAA" }}>Followers</span>
          </Button>{" "}
          {showFollowers && (
            <Dialog
              open={showFollowers}
              onClose={handleFollowerModalClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">FOLLOWERS</DialogTitle>
              <DialogContent>
                {props.followersList &&
                  props.followersList.map((val) => (
                    <DialogContentText id="alert-dialog-description">
                      <a
                        href={"/profile/" + val}
                        style={{ cursor: "pointer", color: "#66CDAA" }}
                      >
                        @{val}
                      </a>
                    </DialogContentText>
                  ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleFollowerModalClose}>Ok</Button>
              </DialogActions>
            </Dialog>
          )}
        </div>
      </div>
      <Nav justify variant="tabs" defaultActiveKey="1">
        <Nav.Item onClick={(e) => setPostsUri("getPostsByUser")}>
          <Nav.Link eventKey="1">Posts</Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={(e) => setPostsUri("getMediaPostsByUser")}>
          <Nav.Link eventKey="2">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={(e) => setPostsUri("getPostsLikedByUser")}>
          <Nav.Link eventKey="3">Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      {currentUser.userid && (
        <PostList
          uriParam={`${postsUri}/${currentUser.userid}`}
          refresh={refresh}
        />
      )}
    </div>
  );
};

export default Profile;
