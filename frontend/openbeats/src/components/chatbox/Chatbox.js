import { IconButton, Snackbar } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import useInput from "../../hooks/use-input";
import { linkIdenfilier, url } from "../../utils/constants";
import MessageList from "../messageList/MessageList";
import profileImg from "../profileIcon.png";
import classes from "./Chatbox.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router";

const Chatbox = ({ details }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [error, setError] = useState(null);
  let token = localStorage.getItem("auth-token");
  let userEmail = localStorage.getItem("emailId");
  const history =  useHistory();

  const {
    value: enteredMessage,
    inputChangeHandler: inputChangeHandler,
    inputBlueHandler: inputBlurHandler,
    reset: resetMessageBox,
  } = useInput((value) => true);

  const onSendHandler = async (sessionId) => {
    setIsLoading(true);
    const messageData = {
      conversationId: details.conversationId,
      content: sessionId ? linkIdenfilier + sessionId : enteredMessage.trim(),
    };
    const res = await axios.post(url + "/sendMessage", messageData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    resetMessageBox();
    setIsLoading(false);
  };

  function createWorkspace() {
    setSessionLoading(true);
    let room = `Session w/t ${details.author?.firstName} ${details.author?.lastName}`;
    let formdata = JSON.stringify({
      roomName: room,
      email: userEmail,
    });
    axios
      .post(url + "/start", formdata, {
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
        setSessionLoading(false);
        if (response.status == 202) {
          setError("You have exceeded the number of Free Sessions!!");
        } else {
          onSendHandler(response.data.sessionId);
        }
      })
      .catch((error) => {
        console.log(error);
        setSessionLoading(false);
      });
  }

  const handleOnclose = () => {
    setError(null);
  };

  const goToProfile = () => {
    history.push("/profile/" + details.author?.username);
  };

  return (
    <div>
      {!details && (
        <div className={classes.conv}>
          <div>Please select a conversation</div>{" "}
          <div className={classes.heart}></div>
        </div>
      )}

      {details && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                alt={details.author?.firstName}
                src={details.author?.profilePictureFileName || profileImg}
                className={classes.profileIcon}
                onClick={goToProfile}
              />
              <span className={classes.author} onClick={goToProfile}>
                <strong
                  className={classes.username}
                >{`${details.author?.firstName} ${details.author?.lastName}`}</strong>
              </span>
            </span>
            <span className={classes.NewSessionBtn}>
              <button onClick={createWorkspace} disabled={sessionLoading}>
                Daw Session+{sessionLoading ? "..." : null}
              </button>
            </span>
          </div>
          <hr className="mt-2" style={{ color: "grey", height: "1px" }} />
          <MessageList details={details} />
          <hr className="mt-2" style={{ color: "grey", height: "1px" }} />
          <div className={classes.new}>
            <div className="form-control mt-2" style={{ width: "75%" }}>
              <textarea
                // style={{width: "100%", resize: "none"}}
                // className={classes.textarea}
                type="text"
                id="desc"
                onChange={inputChangeHandler}
                value={enteredMessage}
                onBlur={inputBlurHandler}
                placeholder="Enter a message"
                rows="3"
              />
            </div>
            <div className="form-actions mt-5" style={{ width: "20%" }}>
              <button
                className={classes.submitButton}
                disabled={enteredMessage.trim().length < 1 || isLoading}
                onClick={(e) => onSendHandler(null)}
              >
                Send{isLoading ? "..." : null}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Chatbox;
