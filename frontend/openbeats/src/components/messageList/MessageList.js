import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { url } from "../../utils/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingOverlay from "react-loading-overlay";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useHistory, useLocation } from "react-router";
import MessageListItem from "./messageListItem/MessageListItem";
import _ from "lodash";
import { UserContext } from "../../model/user-context/UserContext";


const MessageList = ({ details }) => {
  const [list, setList] = useState([]);
  const [refreshNumber, setRefreshNumber] = useState(0);
  const [moreMessagesExist, setMoreMessagesExist] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useContext(UserContext);
  const [subscription, setSubscription ] = useState(null)
  const search = useLocation().search;
  let convoId = null;
  

  let token = localStorage.getItem("auth-token");

  const markAsRead = async (message) => {
    if (message && message.senderId && message.senderId !== state.user.userid) {
      const res = await axios.get(url + "/markAsRead/" + message.messageId, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          Authorization: "Bearer " + token,
        },
      });
    }
  };

  useEffect(() => {
    if(search){
      convoId = new URLSearchParams(search).get("conversationId");
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    getMessages();
    if (subscription) {
      subscription.unsubscribe();
    }
      startConnection();
  }, [details]);


  const nextHandler = () => {
    setRefreshNumber((prev) => prev + 1);
  };

  const getMessages = async () => {
    const res = await axios.get(
      url + "/getMessages/" + details.conversationId + "/" + refreshNumber,
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

    const messages = [...res.data.content];

    setList((prevList) => {
      if (refreshNumber == 0) {
        return [...messages];
      }
      return [...prevList, ...messages];
    });

    setMoreMessagesExist(!res.data.last);
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const startConnection = () => {
    axios
      .post(url + "/connectConversation/" + details.conversationId, {
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
        connect();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const connect = (conversationId = details.conversationId) => {
    // if (subscription) subscription.unsubscribe();
    let socket = new SockJS(url + "/studioSession");
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      console.log("connected to the frame: " + frame);
      const subscription = stompClient.subscribe(
        "/topic/session-progress/" + conversationId,
        function (response) {
          let data = JSON.parse(response.body);
          setList((prevList) => {
            if (prevList.length == 0) {
              return [data];
            }
            if (
              data &&
              data.messageId !== prevList[0].messageId &&
              data.conversationId == conversationId
            ) {
              return [data, ...prevList];
            }
            return [...prevList];
          });
          markAsRead(data);
        }
      );
      setSubscription(subscription);
    });
  };

  return (
    <LoadingOverlay active={isLoading} spinner>
      <div div="scrollableChat">
        <InfiniteScroll
          dataLength={list.length}
          next={nextHandler}
          hasMore={moreMessagesExist}
          loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          height={"55vh"}
          inverse={true}
          scrollableTarget="scrollableChat"
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          {list.map(
            (p) =>
              p &&
              p.content &&
              p.content.length && (
                <MessageListItem
                  messageDetails={p}
                  isUserSender={
                    p && p.senderId && p.senderId == state.user.userid
                  }
                />
              )
          )}
        </InfiniteScroll>
      </div>
    </LoadingOverlay>
  );
};

export default MessageList;
