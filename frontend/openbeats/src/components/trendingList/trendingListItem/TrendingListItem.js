import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../../utils/constants";
import classes from "./TrendingListItem.module.css";
import ReactHashtag from "react-hashtag";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const TrendingListItem = ({ details }) => {
  const [author, setAuthor] = useState();
  const [isLiked, setIsLiked] = useState(false);
  let token = localStorage.getItem("auth-token");

  useEffect(() => {
    getAuthorDetails();
    getIsPostLikedByUser();
  }, []);

  const description =
    details.description && details.description.length > 50
      ? details.description.slice(0, 50) + "..."
      : details.description;

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

  return (
    <div className="mb-5">
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
          <small className={classes.description}>
            <ReactHashtag>{description}</ReactHashtag>
          </small>
          <br />
        </span>
        <button
          style={{
            marginLeft: "auto",
            color: "gray"
          }}
        >
        <FavoriteBorderIcon></FavoriteBorderIcon>{details.totalLikes}
        </button>
      </div>
    </div>
  );
};

export default TrendingListItem;