import React, { useRef } from "react";
import pic from '../Picture1.png';
import { Link } from "react-router-dom";

const styles={
   fontSize: 13
};
const About = () => {
    const titleRef = useRef()
    function handleBackClick() {
        titleRef.current.scrollIntoView({ behavior: 'smooth' })
        }

  return (
    <div ref={titleRef} onClick={handleBackClick} className="bg-gr3 h-screen pl-40 pt-40 flex flex-col pb-40">
      <div className="flex flex-row ">
        <div>
          <div className="text-4xl pt-2 font-mono">About OpenBeats</div>
          <div className="pt-2">
            <p>Open Beats, is a Digital Audio Workstation (DAW) that aims to allow artists, </p>
            <p>to collaborate with others on music synchronously and remotely.</p>

            <p className="pt-2"> Start a Studio session, Invite your friends, Collaborate live and more.. </p>
          </div>
        </div>
        <div className="">
          <img src={pic}></img>
        </div>
        </div>
    </div>
    
  );
};


export default About;
