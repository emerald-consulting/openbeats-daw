import { useEffect, useState } from "react";
import axios from "axios";
import classes from './NotificationListItem.module.css';
import profileImg from "../../../profileIcon.png";
import { useHistory } from "react-router";
import { url } from "../../../../utils/constants";


const NotificationListItem = ({details, onClickNotificationHandler})=>{
    const [author, setAuthor] = useState();
    let token = localStorage.getItem("auth-token");
    const history =  useHistory();

    useEffect(() => {
        getAuthorDetails();
    }, []);

    const description =
    details.content && details.content.length > 50
      ? details.content.slice(0, 50) + "..."
      : details.content;

  const getAuthorDetails = async () => {
    const res = await axios.get(url + "/getAuthorDetails/" + details.notifyByUserId, {
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

  const messageHandler = async () => {
    const res = await axios.post(
      url + "/startConversation/" + author.userid,
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
    onClickNotificationHandler();
  };

  const navigate = () => {
    if(details.type == 'message'){
      messageHandler();
    }else{
      history.push("/profile/" + author?.username);
      onClickNotificationHandler();
    }
  };

  return (
    <div className={classes.notificationItem} style={{backgroundColor: details.isRead? "#fff": "#F5F5F5" }}>
      {author && <div style={{ display: "flex", alignItems: "center" }} onClick={navigate}>
        <img
          alt="Harry"
          src={author?.profilePictureFileName || profileImg}
          className={classes.profileIcon}
        />
        <span className={classes.author}>
          <small
            className={classes.username}
          ><span>{`${author?.firstName} ${author?.lastName} `}</span>{description}</small>
          <br />
        </span>
      </div>}
    </div>
  );
}

export default NotificationListItem;