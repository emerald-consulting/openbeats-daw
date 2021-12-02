import React, {useState, useContext, useEffect } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link , useLocation} from "react-router-dom";
import UserContextProvider, {UserContext} from "../../model/user-context/UserContext";
import bgimg2 from '../bg2.jpg'
import { useHistory } from "react-router";
import axios from "axios";
import { loadUser, setUserEmail, setUserPassword , setUserToken } from "../../model/user/User";
import LogNavbar from "../logNavbar/LogNavbar";
import { useSelector, useDispatch } from 'react-redux'
import { setSession, setSessionId, setSessionName, setParticipants, setBucketName } from "../../model/session/Session";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LoadingOverlay from "react-loading-overlay";
import { url } from '../../utils/constants' 

const Dashboard = () => {

  const search = useLocation().search;
  const [state, dispatch] = useContext(UserContext);
  const [profilePic, setProfilePic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionList, setSessionList] = useState([]);
  const [error, setError] = useState(null);
  const user = useSelector(_state => _state.user);
  const session = useSelector(_state => _state.session);
  const dispatch2 = useDispatch();
  
  let history = useHistory();
  let encodeString = `${user.emailId}:${user.password}`;
  let jwtToken = `${user.jwtToken}`;
  //console.log("this is the jwt token"+jwtToken);
  const encodedString = Buffer.from(encodeString).toString('base64');
  console.log(state)
  console.log(sessionList)

  useEffect(() => { 
      document.getElementById('profilePic').src='https://cdn-icons-png.flaticon.com/256/149/149071.png';
      if(search){
      getSpotifyUserDetails( new URLSearchParams(search).get('token'), new URLSearchParams(search).get('email'));
      }
      else if ( jwtToken && jwtToken != "undefined"){
        getSessions();
        getImage();
      }
      else{
        let token = localStorage.getItem("auth-token");
        if(token){
          // dispatch2(setUserToken(token));
          let email = localStorage.getItem("emailId");
          // dispatch2(setUserEmail(email));
          getSpotifyUserDetails(token,email);
        } else {
          window.location.href = '/signin';
        }
      }

   }, []);


  // useEffect(() => {
  //   getSessions();
  // }, [])


   async function getSpotifyUserDetails(token,email){
      console.log('get getSpotifyUserDetails');
      await dispatch2(setUserToken(token));
      await dispatch2(setUserEmail(email));
      axios.get(url+"/getUserDetails?emailId="+email,{headers: {
                         'Content-Type': 'application/json',
                         'Authorization': 'Bearer '+ token
                 }}).then((response1) => {
                     if(response1.data.status==207){


                     }
                     else if(response1.data){
                          dispatch({
                                                 type: "LOAD_USER",
                                                 payload: response1.data.data
                                               });
                         console.log(response1.data.data)


                     }
                 });
      getImage(email);
      getSessions(email);
    }

  function getSessions( email = user.emailId){
    console.log('get session')
    setIsLoading(true);
    axios.get(url+"/getSessionDetails?emailId="+email,{headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          'Authorization': 'Bearer '+ jwtToken
      }}).then((response) => {
          console.log(response.data.data);
          setSessionList(response.data.data);
          setIsLoading(false);
       })
      .catch((_error)=>{
          // setError(_error);
          setIsLoading(false);
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
            'Authorization': 'Bearer '+ jwtToken
        }}).then((response) => {
            console.log(response.data);
            if(response.status==202){
               setError("You have exceeded the number of Free Sessions!!");
            }else{
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
           history.push('/daw?sessionId='+response.data.sessionId);
            }

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
            'Authorization': 'Bearer '+ jwtToken
        }}).then((response) => {
            console.log(response.data);

            if(response.status==202){
               setError("You have exceeded the number of Free Sessions!!");
            }else{
                dispatch2(setSessionId(response.data.sessionId));
                dispatch2(setSessionName(response.data.sessionName));
                dispatch2(setParticipants(response.data.participants));
                dispatch2(setBucketName(response.data.bucketName));
                history.push('/daw?sessionId='+response.data.sessionId);
            }
         })
        .catch((error)=>{
            setError("Invalid session ID");
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
             'Authorization': 'Bearer '+ jwtToken
        }}).then((response) => {
            console.log(response.data);
            if(response.status==202){
                                           setError(response.data.message)
                        }else{

            dispatch2(setSessionId(response.data.sessionId));
            dispatch2(setSessionName(response.data.sessionName));
            dispatch2(setParticipants(response.data.participants));
            dispatch2(setBucketName(response.data.bucketName));

             history.push('/daw?sessionId='+response.data.sessionId);
            }

         })
        .catch((error)=>{
            console.log(error);
        });

  }

  // const [selectedFile, setSelectedFile] = useState(null);
  const onFileChange = event => {
    
    // Update the state
    //setSelectedFile(event.target.files[0]);
    onFileUpload(event.target.files[0]);
  
  };

  const getImage = (email = state.user.emailId) => {
    // console.log(profilePic);
    // let encodeString = 'c@gmail.com:test';
    // const encodedString = Buffer.from(encodeString).toString('base64');
    document.getElementById('profilePic').src='https://cdn-icons-png.flaticon.com/256/149/149071.png';
    axios.get(url+"/getImage?email="+email,{ responseType: 'blob' },{headers: {
      //'Accept': 'MediaType.IMAGE_JPEG',
      //'Accept': 'application/json',
      //'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ jwtToken
    }}).then((response) => {
      // if(response.data){
      //   // dispatch({
      //   //   type: "STORE_IMAGE",
      //   //   payload: response.data
      //   // });
      //   setProfilePic(response.data)
      // }
      if(response.data && (response.data.size != 0)){
        // console.log(response.data)
        // setProfilePic(response.data)
        const picSrc = URL.createObjectURL(response.data);
        document.getElementById('profilePic').src=picSrc;
        setProfilePic(true);
      }
      else{
        document.getElementById('profilePic').src='https://cdn-icons-png.flaticon.com/256/149/149071.png';
      }
    });
  }

    const upgradeUser = () => {
        const formData = new FormData();
           formData.append(
             'email',state.user.emailId
           );

    axios.post(url+"/upgradeUser",formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ jwtToken
  }}).then((response) => {
        if(response){
          console.log(response);
          state.user.subscriptionType='paid';
              var x = document.getElementById("upgradeUserDiv");

                //x.innerHTML= '<h1 className="bg-gr4 p-2 mt-1 rounded">*now Logged-in as Premium user*</h1>';
                // x.innerHTML= 'now Logged-in as Premium user';
                x.style.display= 'none';
                setError("*now Logged-in as Premium user* !!");

        }
      });
    }



  const onFileUpload = file => {
    
    // Create an object of formData
    const formData = new FormData();
  
    // Update the formData object
    // formData.append(
    //   "myFile",
    //   selectedFile,
    //   selectedFile.name
    // );
    formData.append(
      'image',file
    );
    let bucketname="myawsbucket-3"
    formData.append(
      'email',state.user.emailId
    );
    
    axios.post(url+"/uploadProfilePic", formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ jwtToken
  }}).then( res => {
    getImage();
  });
  };

 const handleOnclose = () =>{
        setError(null);


    }

    return (
      <div className='h-screen' style={{ backgroundImage: `url(${bgimg2})` ,backgroundSize:'cover',height:'100vh',backgroundRepeat:'no-repeat' }}>
         {/*          */}
        <LogNavbar/>
        <div className='flex flex-row'>
        
          <div className=" py-20 pr-10 pl-20 rounded-md" style={{width:'40%', height:'80vh'}}>
            <div className="flex flex-col  p-2">
              <div className="p-2 m-1 bg-gr4 rounded " style={{borderRadius: '50%', margin:'auto'}}>
                <label for={"pic-upload"} className=" cursor-pointer">
                  <img style={{borderRadius: '50%',margin:'auto',width:'250px',height:'250px',objectFit:'cover'}} id='profilePic'  />
                </label> 
              </div>
              <div>
                <input className="text-xs hidden" id='pic-upload' style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
                {/* <button onClick={onFileUpload} className="rounded bg-gr4 p-1">
                  <p className="text-xs">Upload!</p>
                </button> */}
              </div>
              {/* <div><button onClick={getImage} className="rounded font-bold hover:bg-gr3 bg-gr4 p-2">Get Image</button></div> */}
              <div className="p-2 mt-1 bg-gr4 font-bold rounded ">{state.user?.firstName}</div>
              <div className="p-2 mt-1 bg-gr4  rounded ">{state.user?.emailId}</div>
              <div id="upgradeUserDiv" className='flex justify-center p-5'>
                {state.user?.subscriptionType=='paid'?'':<button onClick={upgradeUser} className="p-2 text-w bg-gr3 hover:bg-gr2 font-bold rounded">Upgrade to Premium</button>}
              </div>
            </div>
 

          </div>
          <div className="p-10 " style={{width:'60%', height:'80vh'}}>
            <h1 class="text-4xl text-gr4 pt-2 px-8" style={{textAlign:'end'}}>Sessions</h1>
            <div className="flex flex-row" style={{width:'100%'}}> 
              
              <div style={{width:'50%'}} className="rounded-lg bg-gr4 flex flex-col rounded shadow-default py-10 px-16" >
                <h1 className="text-2xl " >Saved sessions</h1>
                <LoadingOverlay
                  active={isLoading}
                  spinner
                  text='Please wait...'
                >
                  <div className="overflow-y-auto overflow-x-hidden " style={{height:'38.5vh'}}>
                    {
                      sessionList.map((session)=>(
                        <button onClick={()=>joinSessionFromList(session.sessionId)} style={{width:'50px'}} className=" p-2 text-w w-full bg-gr3 hover:bg-gr2 m-1 font-bold rounded" style={{fontSize:15}} >
                          {session.sessionId} : {session.sessionName}
                        </button>
                      ))
                    }
                  </div>
                </LoadingOverlay>
              </div>
              <div style={{width:'50%'}} className=" rounded  ">
                <div className="rounded-lg bg-gr4 w-96 rounded ml-0.5 mb-0.5 shadow-default py-10 px-16">
                  <h1 className="text-2xl ">Create a Session</h1>
                  <form onSubmit={createWorkspace}>
                      <div>
                          <input
                              type='session'
                              className={`w-full p-2 text-primary border-gr4 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                              id='sessionid'
                              placeholder='Enter session name'
                              required
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
                              required
                          />
                      </div>
                      <Snackbar TransitionComponent="Fade" autoHideDuration={6000} onClose={handleOnclose}
                                              action={
                                                  <IconButton
                                                      aria-label="close"
                                                      color="inherit"
                                                      sx={{ p: 0.5 }}
                                                      onClick={handleOnclose}
                                                      >
                                                      <CloseIcon />
                                                  </IconButton>
                                                  }
                                              message={error} open={error}/>

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