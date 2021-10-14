import React, { useContext } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import UserContextProvider, {UserContext} from "../../model/user-context/UserContext";
import bgimg2 from '../bg2.jpg'
import LogNavbar from "../logNavbar/LogNavbar";

const Dashboard = () => {

  const [state, dispatch] = useContext(UserContext);

    return (
      <div className='h-screen' style={{ backgroundImage: `url(${bgimg2})` ,backgroundSize:'cover',height:'100vh',backgroundRepeat:'no-repeat' }}>
        
        <LogNavbar/>
        <div className='flex flex-row'>
        
          <div className=" py-20 pl-20 pr-20 rounded-md">
            <div className="flex flex-col">
              <div className="p-2 m-1 bg-gr2 rounded " style={{borderRadius: '50%'}}>
                <img style={{borderRadius: '50%'}} src="https://cdn-icons-png.flaticon.com/256/149/149071.png"/>
                
              </div>
              <div className="p-2 m-1 bg-gr2 text-wh rounded ">{state.user.firstName}</div>
              <div className="p-2 m-1 bg-gr2 text-wh  rounded ">{state.user.emailId}</div>
            </div>
          </div>
          <div className="p-10"><h1 class="text-4xl text-wh pt-2 " style={{textAlign:'end'}}>Sessions</h1>
            <div className="flex flex-row  m-auto  " style={{width:'100%'}}> 
              
              <div className="bg-gr2 flex flex-col w-96 rounded  shadow-default py-10 px-16">
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
                  <form >
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