import React, {useContext} from "react";
import { Link } from "react-router-dom";
import logo from '../openbeats_notype-45.png';
// import About from "../about/About";
import { useHistory } from "react-router"
import { UserContext } from "../../model/user-context/UserContext";
import { useSelector, useDispatch } from 'react-redux'

const LogNavbar = () => {
  const [state, dispatch] = useContext(UserContext);
  const user = useSelector(_state => _state.user);
  console.log(user);

  const logout = () => {
    localStorage.setItem('auth-token','');
    localStorage.setItem('emailId','');
    window.location.href = '/login';
  }
  
  return (
    <div>  
    <nav className=" flex flex-row ">
      <Link className=" flex flex-row " to="/dashboard">
         <img className="mt-1 pl-10 h-10" src={logo} alt={"logo"} ></img>
         {/* <h1 class="text-6xl pt-2 font-mono">openbeats</h1> */}
      </Link>
        

      <div className="flex flex-row py-3" style={{flexDirection: 'row', marginLeft: 'auto'}} >
        <Link className=" mr-7 text-gr4" style={{fontSize:14}}  to="/dashboard">
          {state.user?.firstName}
        </Link>
        <button onClick={logout} className=" mr-7 text-gr4" style={{fontSize:14}} >
          Logout
        </button>

      </div>
      
    </nav>
    <div style={{ borderTop: "2px solid green "}}></div>
    </div>
  );
};




export default LogNavbar;
