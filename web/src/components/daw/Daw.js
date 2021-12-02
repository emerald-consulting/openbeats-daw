import React, {useContext, useRef} from 'react'
import LogNavbar from '../logNavbar/LogNavbar'
import Pianoui2 from './pianoui/Pianoui2'
import Drum from './drum/Drum'
import Fileupload from './Fileupload'
import Dynamicdiv from '../dynamicdiv/Dynamicdiv'
import { Button, PlayerIcon } from 'react-player-controls'
import bgimg from '../bg.jpg'
import { useReactMediaRecorder } from "react-media-recorder";
import Tracks from './audio/Tracks'
import GroupCall from './socket/GroupCall'
import {UserContext} from "../../model/user-context/UserContext";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from "axios"

import { useSelector, useDispatch } from 'react-redux'
import { setAudioTracks } from "../../model/session/Session";

const url = "localhost:5001"

const RecordView = () => {
    const {
      status,
      startRecording,
      stopRecording,
      mediaBlobUrl,
    } = useReactMediaRecorder({ video: true });
  
    return (
      <div className="text-sm text-red pt-10 pb-5" style={{textAlign:'center'}}>
        <p  className="rounded bg-gr4 mb-0.5">{status}</p>
        <button className="rounded mb-0.5 bg-gr4 p-0.5" onClick={startRecording}>Start Recording</button><br/>
        <button className="rounded bg-gr4 p-0.5" onClick={stopRecording}>Stop Recording</button>
        {/* <video src={mediaBlobUrl} controls autoPlay loop /> */}
      </div>
    );
  };

const PlayerButton = ({ style, children, ...props }) => (
    <Button
      style={{
        appearance: 'none',
        outline: 'none',
        border: 'none',
        borderRadius: 3,
        background: 'white',
        color: 'blue',
        '&:hover': {
          'color': 'lightblue',
        },
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  )

const Daw = () => {
    const [state, dispatch] = useContext(UserContext);
    let clientRef = useRef(null);
    
    const session = useSelector(_state => _state.session);
    const dispatch2 = useDispatch();

    const sendMessage = (msg) => {
      console.log("sending...")
      clientRef.sendMessage('/topics/all', msg);
    }

    const connect = () => {
      console.log("connecting to the game");
      let socket = new SockJS(url+"/studioSession");
      //{headers : {"Access-Control-Allow-Origin": "*" }}
      let stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame) {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe("/topic/session-progress/"+session.sessionId, function (response) {
            let data = JSON.parse(response.body);
            console.log(data);
            // displayResponse(data);
        })
      })
      const formData = new FormData();
      formData.append(
        'sessionId',session.sessionId
      );
      let encodeString = 'test@test.com:test1234';
      const encodedString = Buffer.from(encodeString).toString('base64');
      axios.get(url+"/getStudioSession?sessionId="+session.sessionId,{headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        'Authorization': 'Basic '+ encodedString

      }}).then((res)=>{
        console.log(res)
        if(res.data){
          dispatch2(setAudioTracks(res.data.audioTracks))
        }
      }).catch(error => {console.log(error)});
    }

    return (
      // <div><LogNavbar/>
        <div className="h-screen" style={{ backgroundImage: `url(${bgimg})` ,backgroundSize:'cover',backgroundRepeat:'no-repeat' }} >
            
            <div className="flex flex-col" style={{overflowX:'hidden'}}>
                <LogNavbar className="mb-0.5"/>
                <div className="flex flex-row" style={{}}>
                    <div className="flex flex-col" style={{width:'85%',height:'100%'}}>
                        <div className="flex flex-row">
                            {/*           empty      buttons upload         */}
                        </div>
                        <div >
                          {/* <Dynamicdiv/> */}
                          <Tracks />
                        </div>

                    </div>

                    <div className="  mb-0.5" style={{width:'15%'}}>
                        <p className=" p-5 bg-gr2 hover:bg-gr3  " style={{textAlign:'center'}}>Session ID : {session.sessionId}</p>
                        <p className=" p-5 bg-gr2 hover:bg-gr3  " style={{textAlign:'center'}}>Collaborators</p>
                        {/* <Dynamicdiv/> */}
                        {session.participants.map((p)=>(<p>{p.firstName}</p>))}
                        <button onClick={connect}>Connect</button>
                    </div>
                </div>
                <div style={{ borderTop: "4px solid green"}} ></div>
                <div className="flex flex-row" style={{height:'30%'}}>
                    <div className=" pr-5 " style={{width:'30%',whiteSpace:"break-spaces"}}>
                        <Drum/>
                    </div>
                    <div className="pt-5" style={{width:'70%'}}>
                        <Pianoui2/>
                    </div>

                </div>
            </div>
        </div>
        // </div>
    )
}

export default Daw


