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
import audioFile_N from './components/AudioPlayer/Brk_Snr.mp3'
import audioFile_Z from './components/AudioPlayer/Dsc_Oh.mp3'
import audioFile_X from './components/AudioPlayer/Cev_H2.mp3'
import audioFile_C from './components/AudioPlayer/Kick_n_Hat.mp3'
import audioFile_V from './components/AudioPlayer/punchy_kick_1.mp3'
import audioFile_B from './components/AudioPlayer/RP4_KICK_1.mp3'
import audioFile_M from './components/AudioPlayer/side_stick_1.mp3'
import audioFile_comma from './components/AudioPlayer/Heater-6.mp3'
import audioFile_dot from './components/AudioPlayer/Give_us_a_light.mp3'
//overflowY: 'scroll', height: '400px', max-width: '100%', overflow-x: 'hidden'
import Crunker from 'crunker'
var recording=false;
const map1 = new Map();

var soundsPLayed=new Array();

map1.set(90, audioFile_Z);
map1.set(78, audioFile_N);
map1.set(88, audioFile_X);
map1.set(67, audioFile_C);
map1.set(86, audioFile_V);
map1.set(66, audioFile_B);
map1.set(77, audioFile_M);
map1.set(188, audioFile_comma);
map1.set(190, audioFile_dot);


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
  const [changeRecordLabel, setChangeRecordLabel] = useState(false);
  
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

   React.useEffect(() => {
          document.addEventListener('keydown', handleKeydown);
      }, [])

  function concatAudioBuffer(buffers){
      let crunker = new Crunker();
      return crunker.concatAudio(buffers);
    }

 async  function getAudioBuffer(file){
    let crunker = new Crunker();

    let x= await crunker
      .fetchAudio(file)
      .then((buffers)=>{
            return buffers;
      });

        return x;

      }



 async function download() {
    var initBuffer=null;
    var tempBuffer=null;
//    var x=[audioFile1,audioFile,audioFile2,audioFile3];
    var x=soundsPLayed;
    console.log(x);
    for(var i=0;i<x.length;i++){
        console.log(i);
        if(i==0){
            initBuffer= await getAudioBuffer(x[i]);
        }else{
            tempBuffer= await getAudioBuffer(x[i]);
            console.log(initBuffer)
            var x1= new Array();
            if(i==1){
                x1.push(initBuffer[0]);
            }else{
                x1.push(initBuffer);
            }
            x1.push(tempBuffer[0]);
            initBuffer=concatAudioBuffer(x1);


        }

    }

        let crunker = new Crunker();
        console.log("this is aduio");
          console.log(initBuffer);
var ds= crunker.export(initBuffer, "audio/mp3");
console.log("this is audio buffer.");
console.log(ds);
pushFile(ds);

}

    const handleKeydown = (e) => {
    if(recording==true){
    console.log(e);
    console.log(map1.get(e.which));
    console.log("nice");
        if(map1.has(e.which)){
                soundsPLayed.push((map1.get(e.which)));
        }
    }
}

  const handleRecord = () => {
  recording=!recording;
   setChangeRecordLabel(!changeRecordLabel)

    if(recording==true){
        console.log("Recording");
    }

    if(recording==false){
        download();
        soundsPLayed=new Array();
    }

  };


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
                        <button onClick={handleRecord} className="bg-gr4 hover:bg-gr3">
                                              {!changeRecordLabel ? 'Record' : 'Stop Recording'}
                                            </button>

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
