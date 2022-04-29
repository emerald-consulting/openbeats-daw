import axios from "axios";
import { useContext, useState } from "react";
import useInput from "../../hooks/use-input";
import { UserContext } from "../../model/user-context/UserContext";
import { url } from "../../utils/constants";
import MessageList from "../messageList/MessageList";
import profileImg from "../profileIcon.png";
import classes from './Chatbox.module.css';

const Chatbox = ({ details }) => {

  const [isLoading, setIsLoading] = useState(false);
  let token = localStorage.getItem("auth-token");

  const {
    value: enteredMessage,
    inputChangeHandler: inputChangeHandler,
    inputBlueHandler: inputBlurHandler,
    reset: resetMessageBox,
  } = useInput((value) => true);

  const onSendHandler = async()=>{
    setIsLoading(true);
    const messageData={
      conversationId: details.conversationId,
      content: enteredMessage.trim(),
    }
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
  }

  return (
<div>
{!details && <div className={classes.conv}><div>Please select a conversation</div> <div className={classes.heart}></div></div>}

    {details && <div>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <img
          alt={details.author?.firstName}
          src={details.author?.profilePictureFileName || profileImg}
          className={classes.profileIcon}
        />
        <span className={classes.author}>
          <strong
            className={classes.username}
          >{`${details.author?.firstName} ${details.author?.lastName}`}</strong>
        </span>
      </div>
      <hr className="mt-2" style={{color: "grey", height:"1px"}}/>
      <MessageList details = {details}/>
      <hr className="mt-2" style={{color: "grey", height:"1px"}}/>
      <div className={classes.new}>

      <div className="form-control mt-2" style={{ width: "75%" }}>
        <textarea
          style={{width: "100%", resize: "none"}}
          className={classes.textarea}
          type="text"
          id="desc"
          onChange={inputChangeHandler}
          value={enteredMessage}
          onBlur={inputBlurHandler}
          placeholder="Enter a message"
          rows="2"
        />
      </div>
      <div className="form-actions mt-5" style={{ width: "20%" }}>
      <button
          
          className={classes.submitButton}
          disabled={enteredMessage.trim().length<1 || isLoading}
          onClick = {onSendHandler}
        >
          Send{isLoading ? "..." : null}
        </button>
      </div>
      </div>

    </div>}
    </div>
  );
};

export default Chatbox;

