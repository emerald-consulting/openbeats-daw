import React, { useRef } from "react";
import logo from '../openbeats_notype-45.png';
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
    <div ref={titleRef} onClick={handleBackClick}>

    <div className="text-4xl pt-2 font-mono">About OpenBeats</div>
    <div>Open Beats, is a Digital Audio Workstation (DAW) that aims to allow artists to collaborate with others on music synchronously and remotely.</div>
    </div>
    
  );
};


export default About;
