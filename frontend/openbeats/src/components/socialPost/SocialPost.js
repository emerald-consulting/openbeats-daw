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
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import LikeButton from '../likeButton/LikeButton'
const SocialPost = ({ details }) => {
  const [author, setAuthor] = useState();
  const [isLiked, setIsLiked] = useState(false);
  let token = localStorage.getItem("auth-token");
  const playlistCntxt = useContext(PlaylistContext);

  useEffect(() => {
    getAuthorDetails();
    getIsPostLikedByUser();
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

  const getIsPostLikedByUser = async () => {
    const res = await axios.get(url + "/isLiked/" + details.postId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setIsLiked(res.data);
  };

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
    setIsLiked(res.data);
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

  return (
    <>
      {author && (
        <Card className={classes.card}>
          <Card.Header className="mb-2">
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
          </Card.Header>

          <Card.Text className={classes.description}><ReactHashtag>{details.description}</ReactHashtag></Card.Text>
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
          <LikeButton details={details} token={token} />
        </Card>
      )}
    </>
  );
};

export default SocialPost;