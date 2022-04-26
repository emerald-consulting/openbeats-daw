import React from "react";
import Navbar from "../navbar/Navbar";
import About from "../about/About";
import gif from "../landing-gif.gif";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";
import classes from './HomePage.module.css';

const HomePage = () => {
  return (
    <div style={{position:"fixed", width:"100%"}}>
      <div
        style={{
          backgroundColor: "black",
          backgroundSize: "cover",
          height: "40vh",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div>
          <h1
            className={classes.title}
          >
            The <span className="text-emrald-gr">Music Studio</span> in the cloud...
          </h1>
        </div>

      </div>
      <div className={`${classes.spacer} ${classes.layer}`}></div>
    </div>
  );
};

export default HomePage;
