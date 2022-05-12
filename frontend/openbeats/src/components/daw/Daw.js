import React, {useContext, useRef, useEffect, useState} from 'react'
import LogNavbar from '../logNavbar/LogNavbar'
import Pianoui2 from './pianoui/Pianoui2'
import Drum from './drum/Drum'
import bgimg from '../bg.jpg'
import Tracks from './audio/Tracks'
import {UserContext} from "../../model/user-context/UserContext";
// import { url } from '../../utils/constants' 

import { useSelector, useDispatch } from 'react-redux'
// import { setAudioTracks } from "../../model/session/Session";

const Daw = () => {
    const [state, dispatch] = useContext(UserContext);
    let clientRef = useRef(null);
    
    const session = useSelector(_state => _state.session);
    const user = useSelector(_state => _state.user);
    const [keystrokeSubscribe, setKeystrokeSubscribe] = useState(true);
    const dispatch2 = useDispatch();
    let jwtToken = `${user.jwtToken}`;
    console.log("this is the jwt token"+jwtToken);

    const changekeystrokeSubscribe =(val)=>{
        setKeystrokeSubscribe(val);
    }

    return (
      // <div><LogNavbar/>
        <div style={{ backgroundColor: "#10b981"}} >
            
            <div className="flex flex-col" style={{overflowX:'hidden'}}>
                {/* <LogNavbar className="mb-0.5"/> */}
                <div className="flex flex-row" style={{}}>
                    <div className="flex flex-col" style={{width:'85%'}}>
                        <div className="flex flex-row">
                            {/*           empty      buttons upload         */}
                        </div>
                        <div >
                          {/* <Dynamicdiv/> */}
                          <Tracks changekeystrokeSubscribe = {changekeystrokeSubscribe} />
                        </div>

                    </div>

                    <div className="  mb-0.5" style={{width:'15%'}}>
                        <p className=" p-5 mb-1 " style={{textAlign:'center', backgroundColor: "#10b981"}}>Session ID : {session.sessionId}</p>
                        <p className=" p-5 mb-1 " style={{textAlign:'center', backgroundColor: "#10b981"}}>Collaborators</p>
                        {/* <Dynamicdiv/> */}
                        {session.participants.map((p)=>(<p className="p-2 bg-white mb-1">{p.firstName}</p>))}
                        {/* <button onClick={connect}>Connect</button> */}
                    </div>
                </div>
                <div style={{ borderTop: "4px solid #059669"}} ></div>
                <div className="flex flex-row" style={{height:'20%'}}>
                    <div className=" pr-5 pl-10" style={{width:'30%',whiteSpace:"break-spaces"}}>
                        <Drum keystrokeSubscribe={keystrokeSubscribe}/>
                    </div>
                    <div className="pt-5 pl-10" style={{width:'70%'}}>
                        <Pianoui2 keystrokeSubscribe={keystrokeSubscribe}/>
                    </div>

                </div>
            </div>
        </div>
        // </div>
    )
}

export default Daw


