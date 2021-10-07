import React,{ forwardRef} from "react";
// import { render } from "react-dom";
import { Link } from "react-router-dom";
import logo from '../openbeats_notype-45.png';
import About from "../about/About";

const Navbar = () => {

  return (
    <div>  
    <nav className="p-2 flex flex-row bg-white-300">
      <Link className=" flex flex-row " to="/">
         <img className="pl-10 h-20" src={logo} alt={"logo"} ></img>
         <h1 class="text-6xl pt-2 font-mono">openbeats</h1>
      </Link>
        

      <div className="flex flex-row py-3" style={{flexDirection: 'row', marginLeft: 'auto'}} >
      
        <Link className="p-2 mr-7" style={{fontSize:28}}  to="/about" >
          About
        </Link>
        
        <Link className="p-2 mr-7" style={{fontSize:28}}  to="/dashboard">
          Paid plans
        </Link>

        <Link className="p-2 mr-7" style={{fontSize:28}}  to="/login">
          Login
        </Link>
        <Link className="p-2 pr-7" style={{fontSize:28}} to="/signup">
          SignUp
        </Link>

      </div>
      
    </nav>
    </div>
  );
};




export default Navbar;
