import axios from "axios";
import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { Facebook } from 'react-spinners-css';
import { url } from "../../utils/constants";
import ConversationListItem from "./conversationListItem/ConversationListItem";

const ConversationList = ({onSelectConversationHandler}) => {
  let token = localStorage.getItem("auth-token");
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    getAllConversations();
  }, []);

  const getAllConversations = async () => {
    setIsLoading(true);
    const res = await axios.get(url + "/getAllConversations", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setList([...res.data]);
    setIsLoading(false);
  };
  return (
    <LoadingOverlay active={isLoading} 
    spinner={<Facebook color="#10b981"/>}>
      <h2 className="mb-1" style={{ color: "#000" }}>
        Messages
      </h2>
      {list.map((item) => (
        <ConversationListItem details={item} onSelectConversationHandler={onSelectConversationHandler}/>
      ))}
    </LoadingOverlay>
  );
};

export default ConversationList;
