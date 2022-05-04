import { IconButton, Snackbar } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  setAudioTracks,
  setBucketName,
  setNoRefresh,
  setParticipants,
  setSessionId,
  setSessionName,
} from "../../../model/session/Session";
import { linkIdenfilier, url } from "../../../utils/constants";
import classes from "./MessageListItem.module.css";
import CloseIcon from "@material-ui/icons/Close";

const MessageListItem = ({ messageDetails, isUserSender }) => {
  const [error, setError] = useState(null);
  let token = localStorage.getItem("auth-token");
  let userEmail = localStorage.getItem("emailId");
  const dispatch2 = useDispatch();
  let history = useHistory();

  const convertISOStringToViewableDay = () => {
    const tempDate = new Date(messageDetails.createdAt).toString().split(" ");
    const formattedDate = `${tempDate[1]} ${+tempDate[2]} ${
      tempDate[3]
    } at ${tempDate[4].slice(0, 5)}`;
    return formattedDate;
  };
  const createdAt = convertISOStringToViewableDay();
  let sessionId = null;

  if (messageDetails.content.includes(linkIdenfilier)) {
    sessionId = messageDetails.content.slice(linkIdenfilier.length);
  }

  function joinSession() {
    let sessionJoin = sessionId;
    let formdata = JSON.stringify({
      sessionId: sessionJoin,
      email: userEmail,
    });
    axios
      .post(url + "/connect", formdata, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(response.data);

        if (response.status == 202) {
          setError("You have exceeded the number of Free Sessions!!");
        } else {
          dispatch2(setSessionId(response.data.sessionId));
          dispatch2(setSessionName(response.data.sessionName));
          dispatch2(setParticipants(response.data.participants));
          dispatch2(setBucketName(response.data.bucketName));
          dispatch2(setNoRefresh(response.data.noRefresh));
          dispatch2(setAudioTracks([]));
          history.push("/daw?sessionId=" + response.data.sessionId);
        }
      })
      .catch((error) => {
        setError("Invalid session ID");
        console.log(error);
      });
  }

  const handleOnclose = () => {
    setError(null);
  };
  return (
    <div
      className={`${classes.messageBody}`}
      style={{
        backgroundColor: isUserSender ? "#bbf7d0" : "#e5e7eb",
        marginLeft: isUserSender ? "auto" : null,
        wordWrap: "break-word",
      }}
    >
      <div>
        {sessionId ? (
          <span>
            Click <strong onClick={joinSession}>here</strong> to join the
            session
          </span>
        ) : (
          <span>{messageDetails.content}</span>
        )}
      </div>
      <small style={{ fontSize: "10px", color: "grey" }} className="text-muted">
        {createdAt}
      </small>
      <Snackbar
        TransitionComponent="Fade"
        autoHideDuration={6000}
        onClose={handleOnclose}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={handleOnclose}
          >
            <CloseIcon />
          </IconButton>
        }
        message={error}
        open={error}
      />
    </div>
  );
};
export default MessageListItem;
