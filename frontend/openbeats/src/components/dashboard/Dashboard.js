import React, {useState, useContext } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import UserContextProvider, {UserContext} from "../../model/user-context/UserContext";
import bgimg2 from '../bg2.jpg'
import { useHistory } from "react-router";
import axios from "axios";

import LogNavbar from "../logNavbar/LogNavbar";

const Dashboard = () => {

  const [state, dispatch] = useContext(UserContext);
  const [profilePic, setProfilePic] = useState(null);

  let history = useHistory();
  console.log(state)

  const createWorkspace = () => {
    history.push('/daw')
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const onFileChange = event => {
    
    // Update the state
    setSelectedFile(event.target.files[0]);
  
  };

  const getImage = () => {
    
    let encodeString = 'c@gmail.com:test';
    const encodedString = Buffer.from(encodeString).toString('base64');
    axios.get("http://openbeats-daw.us-east-2.elasticbeanstalk.com/getImage?email="+state.user.emailId,{headers: {
      'Accept': 'MediaType.IMAGE_JPEG',
      'Content-Type': 'application/json',
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
        setProfilePic(response)
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
    
    axios.post("http://openbeats-daw.us-east-2.elasticbeanstalk.com/uploadProfilePic", formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Basic '+ encodedString
  }});
  };

  
              

    return (
      <div className='h-screen' style={{ backgroundImage: `url(${bgimg2})` ,backgroundSize:'cover',height:'100vh',backgroundRepeat:'no-repeat' }}>
        
        <LogNavbar/>
        <div className='flex flex-row'>
        
          <div className=" py-20 pl-20 pr-20 rounded-md">
            <div className="flex flex-col">
              <div className="p-2 m-1 bg-gr2 rounded " style={{borderRadius: '50%'}}>
                <img style={{borderRadius: '50%'}} src="https://cdn-icons-png.flaticon.com/256/149/149071.png"/>
                
              </div>
              <div><input className="text-xs " style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
                <button onClick={onFileUpload} className="rounded bg-gr4 p-1">
                  <p className="text-xs">Upload!</p>
                </button>
            </div>
            <div><button onClick={getImage} className="rounded bg-gr4 p-1">Get Image</button></div>
              <div className="p-2 m-1 bg-gr2 text-wh rounded ">{state.user.firstName}</div>
              <div className="p-2 m-1 bg-gr2 text-wh  rounded ">{state.user.emailId}</div>
            </div>
          </div>
          <div className="p-10"><h1 class="text-4xl text-wh pt-2 " style={{textAlign:'end'}}>Sessions</h1>
            <div className="flex flex-row  m-auto  " style={{width:'100%'}}> 
              
              <div className="bg-gr2 flex flex-col rounded shadow-default py-10 px-16" style={{width:'70%'}}>
                <h1 className="text-2xl text-wh">Saved sessions</h1>
                <Link className="p-2 text-whi mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
                  session 1
                </Link>
                <Link className="p-2 text-whi  mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
                  session 2
                </Link>

              </div>
              <div className=" rounded  ">
                <div className="bg-gr2 w-96 rounded ml-0.5 mb-0.5 shadow-default py-10 px-16">
                  <h1 className="text-2xl text-wh">Create a Session</h1>
                  <form onSubmit={createWorkspace}>
                      <div>
                          <input
                              type='session'
                              className={`w-full p-2 text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                              id='sessionid'
                              placeholder='Enter session name'
                          />
                      </div>

                      <div className='flex justify-center items-center '>
                          <button className={`text-white bg-gr4  hover:bg-gr2 py-2 px-4 rounded`}>
                              Create new Session
                          </button>
                          
                      </div>
                  </form>
                </div>
                <div className="bg-gr2 w-96 rounded ml-0.5 shadow-default py-10 px-16">
                  <h1 className="text-2xl text-wh">Join a Session</h1>
                  <form >
                      <div>
                          <input
                              type='session_join'
                              className={`w-full p-2 text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                              id='session_url'
                              placeholder='Enter session url'
                          />
                      </div>

                      <div className='flex justify-center items-center '>
                          <button className={`bg-gr4 text-white hover:bg-gr2 py-2 px-4 rounded`}>
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