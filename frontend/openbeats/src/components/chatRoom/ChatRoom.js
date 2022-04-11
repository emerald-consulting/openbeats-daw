import axios from "axios";
import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import chatcss from "./chatRoom.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import pic from "../bg.jpg";
import { url } from "../../utils/constants";
import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import classes from "../pages/SocialHomePage.module.css";
import ConversationListItem from "./ConversationListItem";

var stompClient =null;
const ChatRoom = () => {

    let token = localStorage.getItem("auth-token");

    const [refresh, setRefresh] = useState(0);
    const refreshPosts = () => {
        setRefresh((prev) => prev + 1);
    };
    
    useEffect(()=>{
        getUserId();
        getConversationsList();
    },[]);

    const [currentUserId, setCurrentUserId] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: 'Shreyaa',
        receivername: 'Akshata',
        connected: false,
        message: ''
      });
    useEffect(() => {
        connect();
        console.log(userData);
    }, []);

    const getUserId = async () => {
        const res = await axios.get(url+"/getUserDetails?emailId="+localStorage.getItem("emailId"),
        {headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            Authorization: "Bearer " + token,
}}).then((response1) => {
    if(response1.data.status==200){
        setCurrentUserId(()=>{
            console.log("response1.data.data.userid = ", response1.data.data.userid);
                return response1.data.data.userid
            })
    }
})}
    
    let uriParam = "getConversationsList"
    const getConversationsList = async () => {
        console.log("Conversations  ");
        const res = await axios.get(url + "/" + uriParam, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            Authorization: "Bearer " + token,
          },
        });
        setConversations(()=>{
        console.log("Conversation list = ", res.data);
            return res.data
        })
        console.log("Conversations = ",res);
      };
    

    const connect =()=>{
        ////alert("connect")
        let Sock = new SockJS('http://localhost:5001/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        //alert("onConnected")
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        //alert("userJoin")
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        // debugger;
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                alert("join")
                if(!privateChats.get(payloadData.senderName)){
                    // privateChats.set(payloadData.senderName,[]);
                    // privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                console.log(privateChats.get(tab))
                break;
            case "MESSAGE":
                //alert("message")
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload)=>{
        //alert("onPrivateMessage")
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        //alert("onError")
        console.log(err);

    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE",
                date: "Jan 20, 2022"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:userData.receivername,
            message: userData.message,
            status:"MESSAGE"
          };

          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }


    return (

    <div className={classes.container}>
        {/* <div className="p-5"> */}

{/* Leftpane */}
            <div className={classes.leftpane}>
                <div className={classes.splitScreen}>
                    <div className={chatcss.topPane}>  
                        <NewPostForm refreshPosts={refreshPosts} />
                    </div>
                    <div className={classes.bottomPane}>
                        <Playlist />
                    </div>
                </div>
            </div>
{/* Rightpane */}




    <div className={chatcss.container}>
        <div className={chatcss.chatBox}>
            <div className={chatcss.memberList}>

            <InfiniteScroll
          dataLength={conversations.length}
          loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          height={"75vh"}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }

        >
          
          {conversations.map((c,i) => (
            <ConversationListItem key={i} senderId = {currentUserId} conversation={c} />
          ))}
        </InfiniteScroll>

                
            </div>
            {tab==="CHATROOM" && <div className={chatcss.chatContent}>
                <div className={chatcss.chatProfile}>
                {/* Profile info of receiver */}
                    <div> 
                        <img alt={userData.receivername} src={pic} className={chatcss.receiverPic}></img>
                    </div>
                    <div>
                        <div className={chatcss.receiverProfileName}>{userData.receivername}</div>
                        <div className={chatcss.receiverProfileId}>@akshata</div>
                    </div>
                    <div className={chatcss.sender}><button className={chatcss.createDawSession}>+ Daw Session</button></div>
                </div>
                <ul className={chatcss.chatMessages}>
                    {publicChats.map((chat,index)=>(
                        <li className={chatcss.message} key={index}>
                            {chat.senderName !== userData.username && 
                            <div>
                                <div className={chatcss.messageData}>{chat.message}</div>
                                <div className={chatcss.date}>{chat.date}</div> 
                            </div>}
                            {chat.senderName === userData.username && 
                            <div className={chatcss.sender}>
                                <div className={chatcss.messageData}>{chat.message}</div>
                                <div className={chatcss.date}>{chat.date}</div> 
                                
                                {/* <span className={chatcss.senderAvatar}>{chat.senderName}</span> */}
                            </div>}
                        </li>
                    ))}
                </ul>

                <div className={chatcss.sendMessage}>
                    <input type="text" className={chatcss.inputMessage} placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className={chatcss.sendButton} onClick={sendValue}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className={chatcss.chatContent}>
                <ul className={chatcss.chatMessages}> not chat
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={chatcss.message} key={index}>
                            {chat.senderName !== userData.username && <div><div className={chatcss.receiverAvatar}>{chat.senderName}</div>
                            <div className={chatcss.messageData}>{chat.message}</div></div>}
                            {chat.senderName === userData.username && <div className={chatcss.sender}>
                                <span className={chatcss.messageData}>{chat.message}</span> 
                                {/* <span className={chatcss.senderAvatar}>{chat.senderName}</span> */}
                                </div>}
                        </li>
                    ))}
                </ul>

                <div className={chatcss.sendMessage}>
                    <input type="text" className={chatcss.inputMessage} placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className={chatcss.sendButton} onClick={sendPrivateValue}>send</button>
                </div>
            </div>}
        </div>
        
    </div>
    {/* </div> */}
    </div>
    )
}

export default ChatRoom