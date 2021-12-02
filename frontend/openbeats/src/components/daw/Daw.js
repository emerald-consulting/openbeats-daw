import React, {useContext, useRef, useEffect} from 'react'
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
    const dispatch2 = useDispatch();
    let jwtToken = `${user.jwtToken}`;
    console.log("this is the jwt token"+jwtToken);

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
                        <p className=" p-5 bg-gr2 hover:bg-gr3 mb-1 " style={{textAlign:'center'}}>Session ID : {session.sessionId}</p>
                        <p className=" p-5 bg-gr2 hover:bg-gr3 mb-1 " style={{textAlign:'center'}}>Collaborators</p>
                        {/* <Dynamicdiv/> */}
                        {session.participants.map((p)=>(<p className="p-2 bg-gr4 mb-1">{p.firstName}</p>))}
                        {/* <button onClick={connect}>Connect</button> */}
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


