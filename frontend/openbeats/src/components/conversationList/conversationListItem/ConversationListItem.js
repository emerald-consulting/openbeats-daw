import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { inboxPolling, linkIdenfilier, url } from "../../../utils/constants";
import classes from "./ConversationListItem.module.css";
import profileImg from "../../profileIcon.png";
import { UserContext } from "../../../model/user-context/UserContext";
import { useHistory, useLocation } from "react-router";

const ConversationListItem = ({ details, onSelectConversationHandler }) => {
  const [author, setAuthor] = useState();
  const [state, dispatch] = useContext(UserContext);
  const [lastMessage, setLastMessage] = useState(null);
  let token = localStorage.getItem("auth-token");
  let currentUserId = localStorage.getItem("currentUserId");
  const location = useLocation();

  useEffect(() => {
    getAuthorDetails();
    getLastMessage();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getLastMessage();
    }, inboxPolling);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has("conversationId")) {
      const selectedConversationId = queryParams.get("conversationId");
      if (
        selectedConversationId &&
        selectedConversationId == details.conversationId
      ) {
        onClickConversationHandler();
        queryParams.delete("conversationId");
      }
    }
  }, [author])

  const onClickConversationHandler = () => {
    onSelectConversationHandler({ ...details, author: { ...author } });
  };

  const getAuthorDetails = async () => {
    if (!state.user) {
      return;
    }
    const userId =
      details.userId1 == currentUserId ? details.userId2 : details.userId1;
    const res = await axios.get(url + "/getAuthorDetails/" + userId, {
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

  const getLastMessage = async () => {
    const res = await axios.get(
      url + "/getLastMessage/" + details.conversationId,
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
    if (res.data.content.includes(linkIdenfilier)) {
      res.data.content = 'Click here to join the session';
    }
    setLastMessage(res.data);
  };

  return (
    <>
    {author && <div className={classes.listItem} onClick={onClickConversationHandler}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          alt={author?.firstName}
          src={author?.profilePictureFileName || profileImg}
          className={classes.profileIcon}
        />
        <span className={classes.author}>
          <strong
            className={classes.username}
          >{`${author?.firstName} ${author?.lastName}`}</strong>
          <br />
          {lastMessage &&  (
            <p
              className={classes.description}
              style={{
                color:
                  !lastMessage.isRead &&
                  lastMessage.senderId != currentUserId
                    ? "#10b981"
                    : "#292524",
              }}
            >
              {lastMessage.content}
            </p>
          )}
          <br />
        </span>
      </div>
      <div className={classes.borderBottom}></div>
    </div>}
    </>
  );
};

export default ConversationListItem;
