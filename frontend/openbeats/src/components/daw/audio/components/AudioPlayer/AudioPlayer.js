import React, { useEffect, useRef, useState, useContext } from "react";
import WaveSurfer from "wavesurfer.js";
import { uuid } from "uuidv4";

import { useSelector, useDispatch } from 'react-redux'
import { setMaxDuration } from "../../../../../model/audio/Audio";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import LoopIcon from "@material-ui/icons/Loop";
import CropIcon from '@material-ui/icons/Crop';

import PauseIcon from "@material-ui/icons/Pause";
import Grid from "@material-ui/core/Grid";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from '@material-ui/icons/VolumeUp';
import Slider from '@material-ui/core/Slider';
import { UserContext } from "../../../../../model/user-context/UserContext";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: '100%',
    height:'20',
    // minWidth: 240,
    // background:'#68BC76',
    background: '#68BC76',
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
  },
  slider:{
    width:'60px',
    marginLeft: '4px',
    marginRight: '4px',
    marginTop:'25px',
    color:'#2d4858'
    
  },
  scroll: {
    paddingTop: '6px',
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
    

  }
}));
/*
avatar username ostalo layout sa grid

*/
function AudioPlayer({ file, playTrack, stopPlaying, seek=0, zoom }) {
  const wavesurfer = useRef(null);
  const [state, dispatch] = useContext(UserContext);
  const [volume, setVolume] = useState(1);
  const [loopStyle, setLoopStyle] = useState(false);

  const _audio = useSelector(_state => _state.audio);
  const maxDuration = _audio?_audio.maxDuration:-1;
  const dispatch2 = useDispatch();
  var isLoop=false;

  const handleVolumeChange = (e,v) => {
    // console.log(e.target.value,v);
    // setVolume(e.target.value);
    setVolume(v);
    wavesurfer.current.setVolume (v);
  }

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuid()}`;

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: "#FFFFFF",
      progressColor: "#006622",

      height: 60,
      cursorWidth: 1,
      cursorColor: "red",
      barWidth: 1,
      // normalize: true,
      fillParent: false,
      minPxPerSec: 50,
      // responsive: true,
      
      scrollParent:true
    });

    // const wav = require("../../static/12346 3203.ogg");
    const wav = require("../../../../song1.mp3");

    // console.log("wav", wav);
    wavesurfer.current.load(wav);
    
    // wavesurfer.current.zoom(0.5);
    // wavesurfer.current.setVolume(newVolume)
    wavesurfer.current.on("ready", () => {
      // wavesurfer.current.skip(0.5);
      // wavesurfer.current.zoom(100);
      // wavesurfer.current.setHeight(60);
      // wavesurfer.current.toggleScroll()
      // wavesurfer.current.setCursorColor('red');
      setPlayerReady(true);
      let cDur = wavesurfer.current.getDuration();
      console.log(cDur)
      if (cDur > maxDuration){
        dispatch2(setMaxDuration(cDur))
      }
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
        
      } else if (typeof file == "string"){
        wavesurfer.current.load(file)
      } else {
        // let audio = new Audio();
        // audio.src = URL.createObjectURL(file)
        // wavesurfer.current.load(audio);
        // wavesurfer.current.loadDecodedBuffer(file)
        wavesurfer.current.loadBlob(file);
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
    console.log("seek", seek);
    wavesurfer.current.seekAndCenter(parseInt(seek));
    
  }, [seek]);

  useEffect(() => {
    console.log("zoom", zoom);
    wavesurfer.current.zoom(parseInt(zoom));
    
  }, [zoom]);

  
  useEffect(() => {
    console.log("stopPlaying", stopPlaying);
    wavesurfer.current.stop();
  }, [stopPlaying]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.play();
      console.log(wavesurfer.current.getDuration());
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
        
        if (isLoop){ setLoopStyle(true)}
        else{setLoopStyle(false)}
        

        //style={{color:"red"}}
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
          {/* <Grid container > 
            <VolumeDown />
            <Slider aria-label="Volume" value={volume} onChange={handleVolumeChange} min='0' max='1' step='0.01' className={classes.slider}/>
            <VolumeUp />
          </Grid> */}
          {/* <VolumeDown className='mt-7'/> */}
          
            <VolumeDown className='mt-7'/>
          {/* <input  className={classes.scroll +" no-border w-20"}  step='0.01' type="range"  value={volume} 
            onChange={handleVolumeChange} min='0' max='1'/> */}
          <Slider  value={volume} onChange={handleVolumeChange} min={0} max={1} step={0.01} className={classes.slider}/>
          {/* <VolumeUp className='mt-7'/> */}
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
                    <IconButton onClick={setLoop} >
                       {loopStyle? <LoopIcon style={{color:'blue'}} />: <LoopIcon/> }
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Grid>
          <Grid item id={wavesurferId} style={{width:'65%'}} className={classes.scroll+" mt-5"}/>
          <CropIcon className="mt-7 ml-3"/>
        </Grid>
      </Card>
      <br/>
    </>
  );
}

export default AudioPlayer;
