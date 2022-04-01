import classes from "./SocialPost.module.css";
import Card from "react-bootstrap/Card";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../utils/constants";
import playButton from '../playBtn2.png'
import PlaylistContext from "../../model/playlist-store/playlist-context";
import soundImg from '../sound.jpeg';


const SocialPost = ({details}) => {

  const [author, setAuthor] = useState();
  const [isLiked, setIsLiked] = useState(false);
  let token = localStorage.getItem("auth-token");
  const playlistCntxt = useContext(PlaylistContext);

  useEffect(()=>{
    getAuthorDetails();
    getIsPostLikedByUser();
  }, []);

  const getAuthorDetails = async() =>{
    const res = await axios.get(url + "/getAuthorDetails/"+ details.userId,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ token
  }});
  setAuthor(res.data);
  console.log(res.data);
  }

  const getIsPostLikedByUser = async()=>{
    const res = await axios.get(url + "/isLiked/"+ details.postId,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ token
  }});
  setIsLiked(res.data);
  }

  const likeHandler = async() =>{
    const res = await axios.post(url + "/like/"+ details.postId, null, {headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ token
  }});
  setIsLiked(res.data);
  }

  const addToPlaylistHandler = () =>{
    playlistCntxt.addItem({...details, ...author});
  }

  return (
    <Card className={classes.card} style={{ width: "65%", padding: "5px" }}>
        <IconButton sx={{ p: 0 }}>
          <Avatar alt="Harry" src="/static/images/avatar/2.jpg" />
          <strong className={classes.username}></strong> {`${author?.firstName} ${author?.lastName}`} <span className="ml-2">@{author?.username}</span>
        </IconButton>
        <br/>
        <Card.Text>
        {details.description}
        </Card.Text>
      <Card.Img
        variant="top"
        src={details.pictureFileName? details.pictureFileName: details.trackFileName? soundImg: null}
      />
        { details.trackFileName && <img className={classes.overlay} src={playButton} onClick={addToPlaylistHandler}/ >}
      <button onClick={likeHandler}>{isLiked? "Already Liked": "Like"}</button>
    </Card>
  );
};

export default SocialPost;
