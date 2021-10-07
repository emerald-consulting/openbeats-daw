import React from "react";
import Navbar from "../navbar/Navbar";
import About from "../about/About";
import gif from '../landing-gif.gif';
import Footer from "../footer/Footer";

const HomePage = () => {

  return (
    <div>
      <div className=" pl-4 bg-green-300  " id='home'>
        <Navbar />
      </div>
      <div className="img-text-wrapper">

        <div style={{ backgroundImage: `url(${gif})` ,backgroundSize:'cover',height:'100vh',backgroundRepeat:'no-repeat' }} > 
          <div className="pl-40 pt-40 flex flex-col ">
            <h1  className="text-gr4 text-8xl ">Make some NOISE</h1>
            <button className={`bg-gr2 max-w-max hover:bg-gr3 text-white font-bold py-2 px-4 rounded`}>
                <p>Click to JAM</p>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-green-200  h-screen w-full" id='about'>
        <About />
      </div>
      <div className="bg-green-200  h-screen w-full" id='pricing'>
        <div className="text-4xl pt-2 font-mono">Pricing</div>
      </div>
      <Footer/>
    </div>
    
  );
};


export default HomePage;
