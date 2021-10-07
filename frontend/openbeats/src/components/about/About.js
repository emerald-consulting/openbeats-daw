import React, { useRef } from "react";


const About = () => {
    const titleRef = useRef()
    function handleBackClick() {
        titleRef.current.scrollIntoView({ behavior: 'smooth' })
        }

  return (
    <div ref={titleRef} onClick={handleBackClick}>

    come here
    </div>
    
  );
};


export default About;
