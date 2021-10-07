import React from "react";
import Navbar from "../navbar/Navbar";
import About from "../about/About";
import Dashboard from "../dashboard/Dashboard";
import gif from '../landing-gif.gif';

const HomePage = () => {

  return (
    <div>
      <div className=" pl-4 bg-green-300 py-3 ">
      
      <Navbar />
      </div>
      <div  className="bg-green-600  h-screen margin:0px" width='1880'>
      <img src={gif}  className="h-screen w-full" ></img>
      </div>
      <div className="bg-green-200  h-44">
      <About />
      
      </div>
    </div>
    
  );
};


export default HomePage;
