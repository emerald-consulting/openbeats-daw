import { Avatar, Button, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Profile.module.css";
import { url } from "../../utils/constants";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import UserProfileForm from "./UserProfileForm";
import { useLocation } from "react-router";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  follow: {
    color: "#66CDAA",
    fontWeight: "bold",
  },
});

const Profile = (props) => {
  // console.log("pizza ",props)
  const loggedInUserEmailId = localStorage.getItem("emailId");
  const classes = useStyles();
  const [profileUrl, setProfileUrl] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  // const [userEmailId, setUserEmailId] = useState("");
  // const [isCurrentUser, setIsCurrentUser] = useState();
  // const [isFollowing, setIsFollowing] = useState(props.isFollowing);

  let token = localStorage.getItem("auth-token");
  const user = useSelector((_state) => _state.user);
  let jwtToken = `${user.jwtToken}`;
  const location = useLocation();
  const authorId = location.state?.userid;
  const eId = location.state?.emailId;

  const handleClickOpen = () => {
    setOpen(true);
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
    const res = await axios.get(url + "/getPicture/" + eId, {
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
    getPicture();
  }, [location]);

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
          <span style={{ color: "#66CDAA" }}>Following</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {currentUser.totalFollowers ? (
            <span style={{ color: "black" }}>{currentUser.totalFollowers}</span>
          ) : (
            <span style={{ color: "black" }}>0</span>
          )}
          &nbsp;&nbsp;
          <span style={{ color: "#66CDAA" }}>Followers</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
