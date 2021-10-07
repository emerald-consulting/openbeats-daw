import React from "react";
import Navbar from "../navbar/Navbar";
import About from "../about/About";
import gif from '../landing-gif.gif';

const HomePage = () => {

  return (
    <div>
      <div className=" pl-4 bg-green-300 py-3 " id='home'>
      
      <Navbar />
      </div>
      <div  className="bg-green-600  h-screen margin:0px" width='1880'>
      <img src={gif}  className="h-screen w-full" ></img>
      </div>
      <div className="bg-green-200  h-screen w-full" id='about'>
      <About />
      </div>
      <div className="bg-green-200  h-screen w-full" id='pricing'>
        <div className="text-4xl pt-2 font-mono">Pricing</div>
      </div>
    </div>
    
  );
};


export default HomePage;
