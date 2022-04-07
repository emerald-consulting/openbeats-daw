import React,{ forwardRef} from "react";
// import { render } from "react-dom";
import { Link } from "react-router-dom";
import logo from '../openbeats_notype-45.png';
import { Link as Scroll } from "react-scroll";

const Navbar = () => {

  return (
    <div id='navbar' >  
    <nav className=" flex flex-row ">
      <Link className=" flex flex-row  " to="/">
         {/* <img className="pl-10 h-20" src={logo} alt={"logo"} ></img> */}
         <h1 class="text-6xl pt-2 font-mono">openbeats</h1>
      </Link>
        

      <div className="flex flex-row  " style={{flexDirection: 'row', marginLeft: 'auto'}} >
      
        <Scroll className="cursor-pointer " style={{fontSize:28}} spy={true} smooth={true} to="about" >
          <div className="hover:bg-gr4 py-5 px-7 h-full">
          About
          </div>
        </Scroll>

        <Scroll className="cursor-pointer	 " style={{fontSize:28}} spy={true} smooth={true} to="pricing">
        <div className="hover:bg-gr4 py-5 px-7 h-full">
          Pricing
          </div>
        </Scroll>

        <Link className="cursor-pointer" style={{fontSize:28}}  to="/login">
        <div className="hover:bg-gr4 py-5 px-7 h-full">
          Login
          </div>
        </Link>

        <Link className="cursor-pointer" style={{fontSize:28}} to="/signup">
        <div className="hover:bg-gr4 py-5 px-7 h-full">
          SignUp
          </div>
        </Link>

      </div>
      
    </nav>
    </div>
  );
};




export default Navbar;
