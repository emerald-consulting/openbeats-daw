import React, { useRef } from "react";
import pic from '../Picture1.png';
//import { Link } from "react-router-dom";

// const styles={
//    fontSize: 13
// };
const About = () => {
    const titleRef = useRef()
    function handleBackClick() {
        titleRef.current.scrollIntoView({ behavior: 'smooth' })
        }

  return (
    <div ref={titleRef} className="bg-gr3 h-screen pt-40 flex flex-col pb-40">
      
          <div className="pt-2" style={{color: "white", textAlign:"center"}}>
            <h1 className="text-4xl pb-10 font-mono">About OpenBeats</h1>
            <p>Open Beats, is a Digital Audio Workstation (DAW) that aims to allow artists, </p>
            <p>to collaborate with others on music synchronously and remotely.</p>
            <p> Start a Studio session, Invite your friends, Collaborate live and more.. </p>
          </div>
    </div>
    
  );
};


export default About;
