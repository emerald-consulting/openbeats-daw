// import classes from "..socialPost";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../utils/constants";
import chatcss from "./chatRoom.module.css";
import pic from "../bg.jpg";


const ConversationListItem = ({ senderId, conversation }) => {
  const [receiverDetails, setReceiverDetails] = useState();
  let token = localStorage.getItem("auth-token");

  let receiverId = conversation.userId2;
  if(senderId==conversation.userId2){
    receiverId = conversation.userId1;
  }

  useEffect(() => {
    getReceiverDetails();
  }, []);

  const getReceiverDetails = async () => {
    const res = await axios.get(url + "/getAuthorDetails/" + receiverId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setReceiverDetails(res.data);
  };

  return (
    <>
      {receiverDetails && (
        <Card >
          <Card.Header className="mb-2">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                alt="Harry"
                src={pic}
                className={chatcss.memberPic}
              />
              <span >
                <strong
                >{`${receiverDetails?.firstName} ${receiverDetails?.lastName}`}</strong>
                <a >@{receiverDetails?.userid}</a>
                <br />
                {/* <small className="text-muted">{createdAt}</small> */}
              </span>
            </div>
          </Card.Header>

        </Card>
      )}
    </>
  );
};

export default ConversationListItem;
