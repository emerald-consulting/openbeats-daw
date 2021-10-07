import React, { useRef } from "react";
import logo from '../openbeats_notype-45.png';
import { Link } from "react-scroll";

const styles={
   fontSize: 13
};
const Footer = () => {
    const titleRef = useRef()
    function handleBackClick() {
        titleRef.current.scrollIntoView({ behavior: 'smooth' })
        }

  return (
    <div className="mt-5 ml-10 flex felx-row ">
        <div className="">
          <Link className=" flex flex-row"  spy={true} smooth={true} to="navbar">
            <img className="pl-20 h-12" src={logo} alt={"logo"} ></img>
            <h1 class="text-4xl font-mono">openbeats</h1>
          </Link>
        </div>
        <div className="flex flex-row" style={{flexDirection: 'row', marginLeft: 'auto'}}>
          <div className="m-3 mr-48" >
            <text style={{ fontWeight: 'bold' }}>About us</text>
            <p className=' hover:underline' style={{ fontSize: 13 }}>What's OpenBeats</p>
            <p className=' hover:underline' style={{ fontSize: 13 }}>Carrers</p>
            <p className=' hover:underline' style={{ fontSize: 13 }}>Help</p>
            </div>
          <div className="m-3 mr-48" >
            <text style={{ fontWeight: 'bold' }}>Policies</text>
            <p className=' hover:underline' style={{ fontSize: 13 }}>Copyright & trademark</p>
            <p className=' hover:underline' style={{ fontSize: 13 }}> Terms of service</p>
            
            </div>
          <div className="m-3 mr-24" >
            <text style={{ fontWeight: 'bold' }}>More info</text>
            <p className=' hover:underline' style={styles}>For business</p>
            <p className=' hover:underline' style={styles}>For developers</p>
            
            </div>
        </div>
    </div>
    
  );
};


export default Footer;
