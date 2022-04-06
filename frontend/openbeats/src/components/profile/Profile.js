import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useEffect, useContext, useState, useRef } from "react";
import { UserContext } from "../../model/user-context/UserContext";
import axios from "axios";
import "./Profile.css";
import { url } from "../../utils/constants";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import UserProfileForm from "./UserProfileForm";

const Profile = () => {
  const [state, dispatch] = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [profileUrl, setProfileUrl] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  let token = localStorage.getItem("auth-token");
  const user = useSelector((_state) => _state.user);
  let jwtToken = `${user.jwtToken}`;

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

  const getPicture = async () => {
    const res = await axios.get(url + "/getPicture", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setProfileUrl(res.data.profilePictureFileName);
    setCoverUrl(res.data.coverPictureFileName);
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
        Authorization: "Bearer " + jwtToken,
      },
    });
    setProfileUrl(res.data.profilePictureFileName);
    setCoverUrl(res.data.coverPictureFileName);
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
    const profileFile = dataURLtoFile(preview, "bhavya.jpg");
    setProfileFile(profileFile);
  };

  useEffect(() => {
    getPicture();
  }, []);

  useEffect(() => {
    getPicture();
  }, [profileUrl]);

  useEffect(() => {
    addProfilePicture();
  }, [coverFile]);

  const fileRef = useRef();

  const handleChange = (e) => {
    const [file] = e.target.files;
    const testFile = e.target.files[0];
    setCoverFile(testFile);
  };

  return (
    <div>
      <div>
        <div>
          <button onClick={() => fileRef.current.click()}>
            <img
              src={coverUrl}
              style={{ width: "1000px", height: "300px" }}
            ></img>
          </button>
          <input
            ref={fileRef}
            onChange={(e) => {
              handleChange(e);
            }}
            multiple={false}
            type="file"
            hidden
          />
          <Button
            onClick={handleProfileModalOpen}
            style={{ float: "right", marginTop: "20px" }}
          >
            Edit Profile
          </Button>
          {handleProfileModalOpen?(<UserProfileForm handleClickOpen={handleProfileModalOpen}
            handleClose={handleProfileModalClose} open={openUserModal}></UserProfileForm>):null}
        </div>
        <button onClick={handleClickOpen}>
          <Avatar src={profileUrl} sx={{ width: 202, height: 202 }}></Avatar>
        </button>
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
      </div>
      <div className="row">
        <div className="col-md-4 animated fadeIn">
          <div className="card">
            <div className="card-body">
              <div className="avatar">
                <img className="card-img-top" alt="" />
              </div>
              <h5 className="card-title">
                {state.user.firstName} {state.user.lastName}
              </h5>
              <p className="card-text">
                @{state.user.username}
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ color: "gray" }} />
      <Button>Posts</Button>
      <Button>Media</Button>
      <Button>Likes</Button>
      {posts.map((post) => (
        <>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image="https://www.cnet.com/a/img/resize/3dc8b7091b334390110e01ac8abe2d43be9a1eb7/2017/05/07/35276ddf-5d7a-448c-9c7c-d675e3c61aa7/grootpushingbutton.jpg?auto=webp&width=940"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h7" component="div">
                {state.user.firstName} {state.user.lastName}
              </Typography>
              <Typography variant="h7" color="text.secondary">
                @{state.user.username}
              </Typography>
              <Typography>{post.description}</Typography>

              {/* <Typography variant="h7" color="text.secondary">
              @{state.user.username}
            </Typography>
            <Typography>{post.description}</Typography> */}
            </CardContent>
          </Card>
          <hr style={{ marginTop: "15px", color: "gray" }} />
        </>
      ))}
    </div>
  );
};

export default Profile;
