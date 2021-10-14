import React from "react";
import { Link } from "react-router-dom";
import logo from '../openbeats_notype-45.png';
// import About from "../about/About";

const LogNavbar = () => {

  return (
    <div>  
    <nav className=" flex flex-row ">
      <Link className=" flex flex-row " to="/">
         <img className="mt-1 pl-10 h-10" src={logo} alt={"logo"} ></img>
         {/* <h1 class="text-6xl pt-2 font-mono">openbeats</h1> */}
      </Link>
        

      <div className="flex flex-row py-3" style={{flexDirection: 'row', marginLeft: 'auto'}} >

        <Link className="mr-7" style={{fontSize:14}}  to="/signin">
          Logout
        </Link>

      </div>
      
    </nav>
    <div style={{ borderTop: "2px solid green "}}></div>
    </div>
  );
};




export default LogNavbar;
