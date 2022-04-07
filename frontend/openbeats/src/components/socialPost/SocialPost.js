import React from 'react';
import classes from "./SocialPost.module.css";
import Card from "react-bootstrap/Card";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../utils/constants";
import playButton from "../playBtn2.png";
import PlaylistContext from "../../model/playlist-store/playlist-context";
import soundImg from "../sound.jpeg";
import Tooltip from "@mui/material/Tooltip";
import ReactHashtag from "react-hashtag";
import LikeButton from '../likeButton/LikeButton'
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditPostDialog from './EditPostDialog'
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const SocialPost = ({ details,removePost, updatePost  }) => {
  const [author, setAuthor] = useState();
  const [isLiked, setIsLiked] = useState(false);
  let token = localStorage.getItem("auth-token");
  const playlistCntxt = useContext(PlaylistContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [editDialogState, setEditDialogState] = React.useState(false)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getAuthorDetails();
    // getIsPostLikedByUser();
  }, []);

  const getAuthorDetails = async () => {
    const res = await axios.get(url + "/getAuthorDetails/" + details.userId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setAuthor(res.data);
  };

  // const getIsPostLikedByUser = async () => {
  //   const res = await axios.get(url + "/isLiked/" + details.postId, {
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Headers": "Content-Type",
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  //       Authorization: "Bearer " + token,
  //     },
  //   });
  //   setIsLiked(res.data);
  // };

  const likeHandler = async () => {
    const res = await axios.post(url + "/like/" + details.postId, null, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    // setIsLiked(res.data);
  };

  const deletePost = async () => {
    closeMenu()
    const postId = details.postId;
    const res = await axios.put(url + "/removePost/" + postId, null, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    if (res) {
      removePost(postId)
    }
  };

  const addToPlaylistHandler = () => {
    playlistCntxt.addItem({ ...details, ...author });
  };

  const addToPlaylistAtTopHandler = () => {
    playlistCntxt.addItemAtFirst({ ...details, ...author });
  };
  const convertISOStringToViewableDay = () => {
    const tempDate = new Date(details.createdAt).toString().split(" ");
    const formattedDate = `${tempDate[1]} ${+tempDate[2]} ${
      tempDate[3]
    } at ${tempDate[4].slice(0, 5)}`;
    return formattedDate;
  };
  const createdAt = convertISOStringToViewableDay();

  const toggleEditPostDialog = () => {
    closeMenu();
    setEditDialogState(!editDialogState)
  }

  return (
    <>
      {author && (
        <Card className={classes.card}>
           <Card.Header >
            <div style={{ display: "flex", alignItems: "center" , justifyContent:'space-between'}} >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt="Harry"
                  src="https://www.goldderby.com/wp-content/uploads/2019/10/Ryan-Reynolds.jpg"
                  className={classes.profileIcon}
                />
                <span className={classes.author}>
                  <strong
                    className={classes.username}
                  >{`${author?.firstName} ${author?.lastName}`}</strong>
                  <a className="ml-2">@{author?.username}</a>
                  <br />
                  <small className="text-muted">{createdAt}</small>
                </span>
              </div>
              <>
                <IconButton onClick={openMenu} size='small'>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={closeMenu}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem style={{display:'block',marginLeft:'20px',minWidth:'70px',marginBottom:'5px'}} onClick={toggleEditPostDialog}>Edit</MenuItem>
                  <MenuItem style={{display:'block',marginLeft:'20px',minWidth:'70px',marginBottom:'5px'}} onClick={deletePost}>Delete</MenuItem>
                </Menu>
              </>
            </div>
          </Card.Header>

          <Card.Text className={classes.description}>
            <ReactHashtag>{details.description}</ReactHashtag>
          </Card.Text>
          {details.trackFileName && (
            <Tooltip title="Add to Queue">
              <button
                className={classes.addButton}
                onClick={addToPlaylistHandler}
              >
                &#x2b;
              </button>
            </Tooltip>
          )}

          <Card.Img
            variant="top"
            src={
              details.pictureFileName
                ? details.pictureFileName
                : details.trackFileName
                ? soundImg
                : null
            }
            className={classes.cargImg}
          />

          {details.trackFileName && (
            <img
              className={classes.overlay}
              src={playButton}
              onClick={addToPlaylistAtTopHandler}
            />
          )}
          {/* <Card.Footer>
            <button style={{ marginLeft: "90%" }} onClick={likeHandler}>
            <FavoriteBorderIcon></FavoriteBorderIcon>{details.totalLikes}
            </button>
          </Card.Footer> */}
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:'-30px',marginRight:'-22px'}}>
          <LikeButton details={details} token={token} />
          </div>
        </Card>
      )}
      {
        editDialogState && (
          <EditPostDialog onClose={toggleEditPostDialog} open={editDialogState} updatePost={updatePost} post={details} />
        )
      }
    </>
  );
};

export default SocialPost;
