import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import Microphone from "./components/Microphone/Microphone";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import Fileupload from "../Fileupload";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import PauseIcon from "@material-ui/icons/Pause";
import Checkbox from '@material-ui/core/Checkbox';

//overflowY: 'scroll', height: '400px', max-width: '100%', overflow-x: 'hidden'

const divStyle = {
  overflowY: 'scroll', height: '400px', maxWidth: '100%', overflowX: 'hidden'
};

//

function Tracks() {
  const [files, setFiles] = useState([null]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [playTracks, setPlayTracks] = useState([false]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stopPlaying, setStopPlaying] = useState(0);
  const [selected, setSelected] = useState([false]);
  
  const onFileChange = event => {
    //var blobUrl = URL.createObjectURL(event.target.files[0])
    // setSelectedFile(event.target.files[0]);
    pushFile(URL.createObjectURL(event.target.files[0]))
  };

  const pushFile = file => {
    setFiles([...files, file]);
    setPlayTracks([...playTracks, false])
    setSelected([...selected, false])
  };

  const remove = index => {
    if (index !== -1) {
      setFiles(files.filter(function(file) { 
        return file !== files[index]
      }));
      var temp = selected;
      temp.splice(index, 1);
      setPlayTracks(temp);
      temp = playTracks;
      temp.splice(index, 1);
      setSelected(temp);
    }
  }

  const startPlayTracks = () => {
    var temp=[];
    for(var i=0;i<playTracks.length;i++){
      if(selected[i]){
        temp.push(true)
      } else{
        temp.push(false)
      }
    }
    // playTracks.forEach((t) => {
    //   temp.push(true);
    // });
    setPlayTracks(temp);
    setIsPlaying(true);
  }

  const pauseTracks = () => {
    var temp=[];
    playTracks.forEach((t) => {
      temp.push(false);
    });
    setPlayTracks(temp);
    setIsPlaying(false);
  }

  const stopPlayTracks = () => {
    pauseTracks();
    setStopPlaying(stopPlaying+1);
  }

  let transportPlayButton;

  if (!isPlaying) {
    transportPlayButton = (
      <IconButton onClick={startPlayTracks}>
        <PlayArrowIcon />
      </IconButton>
    );
  } else {
    transportPlayButton = (
      <IconButton onClick={pauseTracks}>
        <PauseIcon />
      </IconButton>
    );
  }

  const toggleSelectAll = event => {
    var temp=[];
    selected.forEach((t) => {
      temp.push(!t);
    });
    setSelected(temp);
    // console.log(selected)
    
  }

  const toggleSelectOne = (event, index) => {
    
    let temp=[]
    // temp[index]=event.target.checked;
    for(var i=0;i<selected.length;i++){
      if(i!=index){
        temp.push(selected[i])
      } else {
        temp.push(!selected[i])
      }
    }
    // temp[index]=!temp[index]
    console.log(temp)
    setSelected(temp);
    // console.log(selected[index])
    // console.log(index)
  }

  // React.useEffect (() => {
  //   console.log(selected)
  // },[selected]);

  return (
    <div style={divStyle}>
      {/* <NavBar /> */}
      <div className="flex flex-row box border">
        <Microphone style={{}} pushFile={pushFile} />
        <div className="p-5 ml-0.5 bg-gr4 hover:bg-gr3">
            <label for={"file-upload"} className=" cursor-pointer">
                File +</label> 
            <input id={"file-upload"} className="text-xs hidden" style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
        </div>
        <Fileupload />
        <Checkbox
          checked={selected.every(Boolean)}
          onChange={toggleSelectAll}
        /> <p className="mt-5">Select All</p>
        {transportPlayButton}
        <IconButton onClick={stopPlayTracks}>
          <StopIcon />
        </IconButton>
      </div>                 
      <Grid container direction="column" spacing={1}>
        {files.map((file, index) => (
          <Grid key={index} item>
            <Checkbox
              checked={selected[index]}
              onChange={(e)=>toggleSelectOne(e,index)}
            /> 
            <AudioPlayer file={file} playTrack={playTracks[index]} stopPlaying={stopPlaying}/>
            <IconButton onClick={()=>remove(index) } style={{marginTop: '-60px', position:'relative'}} className="float-right"><CancelIcon /></IconButton>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Tracks;
