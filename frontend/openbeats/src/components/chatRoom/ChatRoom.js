// import { useState } from "react";
// import NewPostForm from "../newPostForm/NewPostForm";
// import Playlist from "../playlist/Playlist";
// import PostList from "../postList/PostList";
// import TrendingList from "../trendingList/TrendingList";
// import classes from "../pages/SocialHomePage.module.css";

// const ChatRoom = () => {

//   const [refresh, setRefresh] = useState(0);
//   const refreshPosts = () => {
//     setRefresh((prev) => prev + 1);
//   };

// // ChatRoom 


//   return (
//     <div className={classes.container}>
//       <div className="p-5">
//         <div className={classes.leftpane}>
//           <div className={classes.splitScreen}>
//             <div className={classes.topPane}>
            
//               <NewPostForm refreshPosts={refreshPosts} />
//             </div>
//             <div className={classes.bottomPane}>
//               <Playlist />
//             </div>
//           </div>
//         </div>
//         {/* <div className={classes.middlepane}>
//           <PostList uriParam="getPosts" refresh={refresh} />
//         </div> */}
//         {/* <div className={classes.rightpane}>
//           <div className={classes.splitScreen}>
//             <div className={classes.topPane}>
//               <TrendingList/>
//             </div>
//             <div className={classes.bottomPane}>
//               Newly Released/ Announcements
//             </div>
//           </div>
//         </div> */}

        

//       </div>
//     </div>
//   );
// };
// export default ChatRoom;





import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import chatcss from "./chatRoom.module.css";
import pic from "../bg.jpg";
import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import classes from "../pages/SocialHomePage.module.css";

var stompClient =null;
const ChatRoom = () => {

    const [refresh, setRefresh] = useState(0);
    const refreshPosts = () => {
        setRefresh((prev) => prev + 1);
    };
    

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
        debugger;
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
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={chatcss.member}>
                    <div> 
                        <img alt={userData.member} src={pic} className={chatcss.memberPic}></img>
                    </div>
                    <div className={chatcss.membersTab}>
                        <span className={chatcss.memberProfileName}>{userData.receivername}</span>
                        <span className={chatcss.memberProfileId}>@akshata</span>
                    </div>
                    </li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={chatcss.member} key={index}>{name}</li>
                    ))}
                </ul>
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