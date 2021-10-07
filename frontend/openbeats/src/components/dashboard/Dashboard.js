import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";

import LogNavbar from "../logNavbar/LogNavbar";

const Dashboard = () => {

    return (
      <div>
        
      <LogNavbar/>
      <div className='flex flex-row  '>
        
        <div className="bg-green-100 m-10 rounded-md">
          <div className="flex flex-col">
            <div className="p-2 m-1 bg-green-200 rounded ">
              image
              {/* userEdit    class="fas fa-user-edit"icon={['fas', 'fa-user-edit']}  icon="coffee" size="xs"*/}
              <div className='p-4 '><svg icon="coffee" ></svg></div>
              {/* <Image source={require('../openbeats_notype-45.png')} style={{width: 400, height: 400, borderRadius: 400/ 2}} /> */}
            </div>
            <div className="p-2 m-1 bg-green-200 rounded ">Name</div>
            <div className="p-2 m-1 bg-green-200 rounded ">emai id</div>
          </div>
        </div>
        <div className="p-10"><h1 class="text-2xl pt-2 font-mono">Sessions</h1>
        <div className="flex flex-row bg-white-50 w-full  m-auto  shadow-default py-5">
          
          <div className="bg-green-200 m-1 flex flex-col w-96 rounded  shadow-default py-10 px-16">
            Saved sessions
            <Link className="p-2 text-white mr-7 bg-green-600 m-1  rounded" style={{fontSize:15}}  to="/about" >
              session 1
            </Link>
            <Link className="p-2 text-white  mr-7 bg-green-600 m-1  rounded" style={{fontSize:15}}  to="/about" >
              session 2
            </Link>

          </div>
          <div className="m-0 rounded  ">
            <div className="bg-green-200 w-96 rounded m-1 shadow-default py-10 px-16">
              Create a Session
              <form >
                  <div>
                      <input
                          type='session'
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='sessionid'
                          placeholder='Enter session name'
                      />
                  </div>

                  <div className='flex justify-center items-center mt-6'>
                      <button className={`bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded`}>
                          Create new Session
                      </button>
                      
                  </div>
              </form>
            </div>
            <div className="bg-green-200 w-96 rounded m-1 shadow-default py-10 px-16">
              Join a Session
              <form >
                  <div>
                      <input
                          type='session_join'
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='session_url'
                          placeholder='Enter session url'
                      />
                  </div>

                  <div className='flex justify-center items-center mt-6'>
                      <button className={`bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded`}>
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