import React, { useEffect, useRef, useState, useContext } from "react";
import WaveSurfer from "wavesurfer.js";
import Drawer from "wavesurfer.js/src/drawer.js";
import { uuid } from "uuidv4";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import LoopIcon from "@material-ui/icons/Loop";

import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { green, red, blue } from "@material-ui/core/colors";

import PauseIcon from "@material-ui/icons/Pause";
import Grid from "@material-ui/core/Grid";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { UserContext } from "../../../../../model/user-context/UserContext";
import { Slider } from "@material-ui/core";

const faces = [
  "http://i.pravatar.cc/300?img=1",
  "http://i.pravatar.cc/300?img=2",
  "http://i.pravatar.cc/300?img=3",
  "http://i.pravatar.cc/300?img=4"
];
var isLoop=false;
const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: '100%',
    height:'20',
    // minWidth: 240,
    // background:'#68BC76',
    background: '#444447',
    // margin: "auto",
    transition: "0.3s",
    
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  media: {
    width: "100%"
  },
  list: {
    padding: 0
  },
  listItem: {
    //paddingBottom: 0
  },
  buttons: {
    padding: theme.spacing(1)
  },
  controls: {
    minWidth: "100%"
  },
  icon: {
    height: 18,
    width: 18
  },
  avatar: {
    display: "inline-block"
  }
}));
/*
avatar username ostalo layout sa grid

*/
function AudioPlayer({ file, playTrack, stopPlaying }) {
  const wavesurfer = useRef(null);
  const [state, dispatch] = useContext(UserContext);
  const [volume, setVolume] = useState(1);

  const handleVolumeChange = e => {
    setVolume(e.target.value);
    wavesurfer.current.setVolume (e.target.value);
  }

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuid()}`;

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: "blue",
      progressColor: "tomato",

      height: 30,
      width:70,
      cursorWidth: 1,
      cursorColor: "lightgray",
      barWidth: 1,
      normalize: true,
      responsive: true,
      fillParent: true,
      
      // scrollParent:true
    });

    // const wav = require("../../static/12346 3203.ogg");
    const wav = require("../../../../song1.mp3");

    // console.log("wav", wav);
    wavesurfer.current.load(wav);
    // wavesurfer.current.setVolume(newVolume)
    wavesurfer.current.on("ready", () => {
      setPlayerReady(true);
    });

    const handleResize = wavesurfer.current.util.debounce(() => {
      wavesurfer.current.empty();
      wavesurfer.current.drawBuffer();
    }, 150);

    wavesurfer.current.on("play", () => setIsPlaying(true));
    wavesurfer.current.on("pause", () => setIsPlaying(false));
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    console.log("file", file);
    if (file) {
      if (file.blobURL){
        wavesurfer.current.load(file.blobURL);
        
      }  else if(file.blob){
        wavesurfer.current.loadBlob(file.blob);
        
      } else {
        wavesurfer.current.load(file);
        console.log(wavesurfer.current.getCurrentTime());
      }
      
      
    }
  }, [file]);

  useEffect(() => {
    console.log("playTrack", playTrack);
    if (playTrack) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
    
  }, [playTrack]);

  
  useEffect(() => {
    console.log("stopPlaying", stopPlaying);
    wavesurfer.current.stop();
  }, [stopPlaying]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
    } else {
      wavesurfer.current.pause();
    }
  };

  const stopPlayback = () => wavesurfer.current.stop();

  const classes = useStyles();

  let transportPlayButton;

  if (!isPlaying) {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PlayArrowIcon className={classes.icon} />
      </IconButton>
    );
  } else {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PauseIcon className={classes.icon} />
      </IconButton>
    );
  }

  const fastForward = () => {
        wavesurfer.current.skipForward();
      }
   const skipBackward = () => {
          wavesurfer.current.skipBackward();
        }
   const setLoop=() =>{
        isLoop=!isLoop;
        console.log(isLoop);
   }

   if(wavesurfer.current != null){
    wavesurfer.current.on('finish', function () {
           if(isLoop){
            wavesurfer.current.play();
//            isPlaying=true;
           }
       });
   }


  let transportFastForwardButton;

     transportFastForwardButton = (
          <IconButton onClick={fastForward}>
            <FastForwardIcon  />
          </IconButton>
        );


  let transportFastRewindButton;

     transportFastForwardButton = (
          <IconButton onClick={skipBackward}>
            <FastRewindIcon  />
          </IconButton>
        );

  return (
    <>
      <Card className={classes.card } container >

        <Grid container >
          <input className="no-border " step='0.01' type="range"  value={volume} 
            onChange={handleVolumeChange} min='0' max='1'/>
          <Grid item  >
            <List className={classes.list} >
              <ListItem alignItems="flex-start" className={classes.listItem}>
                    {/* 
                      coming from above      
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}  />
                    </ListItemAvatar> */}
                <ListItemText className="pt-4"
                  primary={state.user.firstName}
                  // secondary="@username · 11h ago"
                />
                <Grid item   className={classes.buttons}>
                  <Grid container item > 
                    <div className="pt-1">{transportPlayButton}</div>
                    <IconButton onClick={stopPlayback}>
                      <StopIcon className={classes.icon} />
                    </IconButton>
                    <IconButton onClick={skipBackward}>
                        <FastRewindIcon  />
                    </IconButton>
                    <IconButton onClick={fastForward}>
                                <FastForwardIcon  />
                              </IconButton>
                    <IconButton onClick={setLoop}>
                                                    <LoopIcon  />
                                                  </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Grid>
          <Grid item id={wavesurferId} style={{width:'55%'}} className="pt-6"/>

        </Grid>
        
      </Card>
      <br/>
    </>
  );
}

export default AudioPlayer;
