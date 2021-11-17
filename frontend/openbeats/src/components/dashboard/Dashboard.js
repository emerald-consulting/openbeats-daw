import React, {useState, useContext, useEffect } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import UserContextProvider, {UserContext} from "../../model/user-context/UserContext";
import bgimg2 from '../bg2.jpg'
import { useHistory } from "react-router";
import axios from "axios";

import LogNavbar from "../logNavbar/LogNavbar";
import { useSelector, useDispatch } from 'react-redux'
import { setSession, setSessionId, setSessionName, setParticipants, setBucketName } from "../../model/session/Session";

const url = "http://openbeatsdaw-env.eba-4gscs2mn.us-east-2.elasticbeanstalk.com"
// const url = "http://192.168.1.166:5000"

const Dashboard = () => {

  const [state, dispatch] = useContext(UserContext);
  const [profilePic, setProfilePic] = useState(null);
  const [sessionList, setSessionList] = useState([]);

  const user = useSelector(_state => _state.user);
  const session = useSelector(_state => _state.session);
  const dispatch2 = useDispatch();
  
  let history = useHistory();
  let encodeString = `${user.emailId}:${user.password}`;
  const encodedString = Buffer.from(encodeString).toString('base64');
  console.log(state)
  console.log(sessionList)

  useEffect(() => {
    getSessions();
  }, [])

  function getSessions(){
    console.log('get session')
    axios.get(url+"/getSessionDetails?emailId="+user.emailId,{headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          'Authorization': 'Basic '+ encodedString
      }}).then((response) => {
          console.log(response.data.data);
          setSessionList(response.data.data);
       })
      .catch((error)=>{
          console.log(error);
      });
  }

  function createWorkspace(e) {
    e.preventDefault();
    let room = e.target.elements.sessionid?.value;
    
    console.log(room)
    
    let formdata = JSON.stringify({
      roomName:room,
      email: user.emailId,
      })
    console.log(formdata)

      axios.post(url+"/start", formdata,{headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers" : "Content-Type",
            // "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            'Authorization': 'Basic '+ encodedString
        }}).then((response) => {
            console.log(response.data);
            dispatch2(setSessionId(response.data.sessionId));
            dispatch2(setSessionName(response.data.sessionName));
            dispatch2(setParticipants(response.data.participants));
            dispatch2(setBucketName(response.data.bucketName));
            // let s = {
            //   "sessionId": response.data.sessionId,
            //   "sessionName": response.data.sessionName,
            //   "participants":[]
            // }
            // dispatch2(setSession(s));
            history.push('/daw');
         })
        .catch((error)=>{
            console.log(error);
        });

    
    
  }

  function joinSession(e){
    e.preventDefault();
    let sessionJoin=e.target.elements.sessionJoinId?.value;
    console.log(sessionJoin);
    let formdata = JSON.stringify({
      sessionId:sessionJoin,
      email: user.emailId,
      })
    console.log(formdata)

    axios.post(url+"/connect", formdata,{headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers" : "Content-Type",
            // "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            'Authorization': 'Basic '+ encodedString
        }}).then((response) => {
            console.log(response.data);
            dispatch2(setSessionId(response.data.sessionId));
            dispatch2(setSessionName(response.data.sessionName));
            dispatch2(setParticipants(response.data.participants));
            dispatch2(setBucketName(response.data.bucketName));
            history.push('/daw');
         })
        .catch((error)=>{
            console.log(error);
        });

  }

  function joinSessionFromList(e){
    let sessionJoin=e
    console.log(sessionJoin);
    let formdata = JSON.stringify({
      sessionId:sessionJoin,
      email: user.emailId,
      })
    console.log(formdata)

    axios.post(url+"/connect", formdata,{headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            'Authorization': 'Basic '+ encodedString
        }}).then((response) => {
            console.log(response.data);
            dispatch2(setSessionId(response.data.sessionId));
            dispatch2(setSessionName(response.data.sessionName));
            dispatch2(setParticipants(response.data.participants));
            dispatch2(setBucketName(response.data.bucketName));
            history.push('/daw');
         })
        .catch((error)=>{
            console.log(error);
        });

  }

  const [selectedFile, setSelectedFile] = useState(null);
  const onFileChange = event => {
    
    // Update the state
    setSelectedFile(event.target.files[0]);
  
  };

  const getImage = () => {
    
    let encodeString = 'c@gmail.com:test';
    const encodedString = Buffer.from(encodeString).toString('base64');
    axios.get(url+"/getImage?email="+state.user.emailId,{ responseType: 'blob' },{headers: {
      //'Accept': 'MediaType.IMAGE_JPEG',
      //'Accept': 'application/json',
      //'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Basic '+ encodedString
    }}).then((response) => {
      // if(response.data){
      //   // dispatch({
      //   //   type: "STORE_IMAGE",
      //   //   payload: response.data
      //   // });
      //   setProfilePic(response.data)
      // }
      if(response){
        setProfilePic(response.data[0])
      }
    });
  }

    const upgradeUser = () => {

      let encodeString = 'c@gmail.com:test';
      const encodedString = Buffer.from(encodeString).toString('base64');
        const formData = new FormData();
           formData.append(
             'email',state.user.emailId
           );

    axios.post(url+"/upgradeUser",formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  }}).then((response) => {
        if(response){
          console.log(response);
          state.user.subscriptionType='paid';
              var x = document.getElementById("upgradeUserDiv");

                x.style.display = "none";

        }
      });
    }



  const onFileUpload = () => {
    
    // Create an object of formData
    const formData = new FormData();
  
    // Update the formData object
    // formData.append(
    //   "myFile",
    //   selectedFile,
    //   selectedFile.name
    // );
    formData.append(
      'image',selectedFile
    );
    let bucketname="myawsbucket-3"
    formData.append(
      'email',state.user.emailId
    );
  
    // Details of the uploaded file
    console.log(selectedFile);
  
    // Request made to the backend api
    // Send formData object
    let encodeString = 'c@gmail.com:test';
    const encodedString = Buffer.from(encodeString).toString('base64');
    
    axios.post(url+"/uploadProfilePic", formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Basic '+ encodedString
  }});
  };

  const imgSrc = () =>{
    return(
      profilePic?profilePic:'https://cdn-icons-png.flaticon.com/256/149/149071.png'
    )
  }

  
              

    return (
      <div className='h-screen' style={{ backgroundImage: `url(${bgimg2})` ,backgroundSize:'cover',height:'100vh',backgroundRepeat:'no-repeat' }}>
         {/*          */}
        <LogNavbar/>
        <div className='flex flex-row'>
        
          <div className=" py-20 pr-10 pl-20 rounded-md" style={{width:'40%', height:'80vh'}}>
            <div className="flex flex-col  p-2">
              <div className="p-2 m-1 bg-gr4 rounded " style={{borderRadius: '150px',width:'50%', margin:'auto'}}>
                <img style={{borderRadius: '40px',margin:'auto'}}  src={imgSrc()}/>
                
              </div>
              <div><input className="text-xs " style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
                <button onClick={onFileUpload} className="rounded bg-gr4 p-1">
                  <p className="text-xs">Upload!</p>
                </button>
              </div>
              <div><button onClick={getImage} className="rounded font-bold hover:bg-gr3 bg-gr4 p-2">Get Image</button></div>
              <div className="p-2 mt-1 bg-gr4 font-bold rounded ">{state.user.firstName}</div>
              <div className="p-2 mt-1 bg-gr4  rounded ">{state.user.emailId}</div>
              <div id="upgradeUserDiv">
                {state.user.subscriptionType=='paid'?'':<button onClick={upgradeUser} className="rounded font-bold hover:bg-gr3 bg-gr4 mt-1 p-2">Upgrade to Premium</button>}
              </div>
            </div>
 

          </div>
          <div className="p-10 " style={{width:'60%', height:'80vh'}}><h1 class="text-4xl text-gr4 pt-2 " style={{textAlign:'end',width:'100%'}}>Sessions</h1>
            <div className="flex flex-row  m-auto  " style={{width:'100%'}}> 
              
              <div className="rounded-lg bg-gr4 flex flex-col rounded shadow-default py-10 px-16" style={{width:'70%'}}>
                <h1 className="text-2xl ">Saved sessions</h1>
                {
                  sessionList.map((session)=>(
                    <button onClick={()=>joinSessionFromList(session.sessionId)} className="p-2 text-whi mr-7 bg-gr4 m-1 font-bold rounded" style={{fontSize:15}} >
                      {session.sessionId} : {session.sessionName}
                    </button>
                  ))
                }

              </div>
              <div className=" rounded  ">
                <div className="rounded-lg bg-gr4 w-96 rounded ml-0.5 mb-0.5 shadow-default py-10 px-16">
                  <h1 className="text-2xl ">Create a Session</h1>
                  <form onSubmit={createWorkspace}>
                      <div>
                          <input
                              type='session'
                              className={`w-full p-2 text-primary border-gr4 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                              id='sessionid'
                              placeholder='Enter session name'
                          />
                      </div>

                      <div className='flex justify-center items-center '>
                          <button className={`  bg-gr3 font-bold hover:bg-gr2 py-2 px-4 rounded`}>
                              Create new Session
                          </button>
                          
                      </div>
                  </form>
                </div>
                <div className="rounded-lg bg-gr4 w-96 rounded ml-0.5 shadow-default py-10 px-16">
                  <h1 className="text-2xl ">Join a Session</h1>
                  <form onSubmit={joinSession}>
                      <div>
                          <input
                              type='session_join'
                              className={`w-full p-2 border-gr4 border text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                              id='sessionJoinId'
                              placeholder='Enter session id'
                          />
                      </div>

                      <div className='flex justify-center items-center '>
                          <button className={`bg-gr3 font-bold hover:bg-gr2 py-2 px-4 rounded`}>
                              Join Session
                          </button>
                          
                      </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
  };
  
  
  export default Dashboard;