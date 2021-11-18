import React, { useState, useEffect } from "react";
import axios from "axios"
import LoadingOverlay from 'react-loading-overlay';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import Microphone from "./components/Microphone/Microphone";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import PauseIcon from "@material-ui/icons/Pause";
import Checkbox from '@material-ui/core/Checkbox';
// import createBuffer from "audio-buffer-from"
// import AWS from 'aws-sdk';

// import SocketRecord from "../socket/SocketRecord";
// import Fileupload from "../Fileupload";

import { useSelector, useDispatch } from 'react-redux'
import { setAudioTracks } from "../../../model/session/Session";
import { setMaxDuration } from "../../../model/audio/Audio";

import audioFile_N from './components/AudioPlayer/Brk_Snr.mp3'
import audioFile_Z from './components/AudioPlayer/Dsc_Oh.mp3'
import audioFile_X from './components/AudioPlayer/Cev_H2.mp3'
import audioFile_C from './components/AudioPlayer/Kick_n_Hat.mp3'
import audioFile_V from './components/AudioPlayer/punchy_kick_1.mp3'
import audioFile_B from './components/AudioPlayer/RP4_KICK_1.mp3'
import audioFile_M from './components/AudioPlayer/side_stick_1.mp3'
import audioFile_comma from './components/AudioPlayer/Heater-6.mp3'
import audioFile_dot from './components/AudioPlayer/Give_us_a_light.mp3'
import audio_C from './components/AudioPlayer/C.mp3'
import audio_Db from './components/AudioPlayer/Db.mp3'
import audio_D from './components/AudioPlayer/D.mp3'
import audio_Eb from './components/AudioPlayer/Eb.mp3'
import audio_E from './components/AudioPlayer/E.mp3'
import audio_F from './components/AudioPlayer/F.mp3'
import audio_Gb from './components/AudioPlayer/Gb.mp3'
import audio_G from './components/AudioPlayer/G.mp3'
import audio_Ab from './components/AudioPlayer/Ab.mp3'
import audio_A from './components/AudioPlayer/A.mp3'
import audio_Bb from './components/AudioPlayer/Bb.mp3'
import audio_B from './components/AudioPlayer/B.mp3'


//overflowY: 'scroll', height: '400px', max-width: '100%', overflow-x: 'hidden'import Crunker from 'crunker'
import Crunker from 'crunker'
var recording=false;
const map1 = new Map();

// const url = "http://openbeatsdaw-env.eba-4gscs2mn.us-east-2.elasticbeanstalk.com"
const url = "http://192.168.1.166:5000"

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

map1.set(65, audio_C);
map1.set(87, audio_Db);
map1.set(83, audio_D);
map1.set(69, audio_Eb);
map1.set(68, audio_E);
map1.set(70, audio_F);
map1.set(84, audio_Gb);
map1.set(71, audio_G);
map1.set(89, audio_Ab);
map1.set(72, audio_A);
map1.set(85, audio_Bb);
map1.set(74, audio_B);

const divStyle = {
  overflowY: 'scroll',height: '60vh', maxWidth: '100%', overflowX: 'hidden'
};

// height: '100%',

function Tracks() {
  const [files, setFiles] = useState([]);
  const [playTracks, setPlayTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stopPlaying, setStopPlaying] = useState(0);
  const [selected, setSelected] = useState([]);
  const [changeRecordLabel, setChangeRecordLabel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fileIterator, setFileIterator] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const session = useSelector(_state => _state.session);
  const dispatch2 = useDispatch();
  const _audio = useSelector(_state => _state.audio);
  const user = useSelector(_state => _state.user);
  const maxDuration = _audio?_audio.maxDuration:1;
  console.log(maxDuration);

   let jwtToken = `${user.jwtToken}`;
    console.log("from Track js this is the jwt token"+jwtToken);
    
  // const onFileChange = event => {
  //   var blobUrl = URL.createObjectURL(event.target.files[0])
  //   setSelectedFile(event.target.files[0]);
  //   pushFile(URL.createObjectURL(event.target.files[0]))
  // };

  const uploadFIle = file => {
    let encodeString = 'test@test.com:test1234';
    const formData = new FormData();

    formData.append(
      'fileName','hello'
    );
    let _file = null;
    console.log(file.blob)
    if (file.blob){
      _file = new File([file.blob], 'audio.mp3');
    } else if (typeof file == "string"){
      console.log(file.substring(5))
      _file = new File([new Blob(file.substring(5))], 'audio.mp3')
    } else {
      _file = file;
    }
    formData.append(
      'file',_file
    );

    formData.append(
      'sessionId',session.sessionId
    );

    formData.append(
      'bucketName',session.bucketName
    );
    let requestsParams = "fileName=hello&file="+file+"&sessionId="+session.sessionId+"&bucketName="+session.bucketName;
    const encodedString = Buffer.from(encodeString).toString('base64');
    axios.post(url+"/studioSession",formData,{headers: {
    // axios.post(url+"/studioSession",formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ jwtToken

    }});
  }
    
  const onFileChange = event => {
    //var blobUrl = URL.createObjectURL(event.target.files[0])
    // setSelectedFile(event.target.files[0]);
    pushFile(URL.createObjectURL(event.target.files[0]));
    uploadFIle(event.target.files[0]);
  };

  const pushFile = file => {
    setFiles([...files, file]);
    setPlayTracks([...playTracks, false])
    setSelected([...selected, false])
    // console.log(file.blob)
    // let fileurl=""
    // if (file.blobURL){
    //   fileurl=file.blobURL
    // } else {
    //   fileurl=URL.createObjectURL(file.blob)
    // }
    // console.log(fileurl)
    
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
        <PlayArrowIcon  />
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
    console.log(selected);
    selected.forEach((t) => {
      temp.push(!t);
    });
    setSelected(temp);
    console.log(temp);
    
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
    setSelected(temp);
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
  for(var i=0;i<x.length;i++){
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
  var ds= crunker.export(initBuffer, "audio/mp3");
  pushFile(ds);

  uploadFIle(ds);

  const formData = new FormData();

      const file = new File([ds.blob], 'audio.mp3');

    formData.append(
      'file',file
    );

    formData.append(
      'bucket','myawsbucket-3'
    );
    // let bucketname="myawsbucket-1"
    // formData.append(
    //   'email',state.user.emailId
    // );

    let encodeString = 'c@gmail.com:test';
    const encodedString = Buffer.from(encodeString).toString('base64');

  //   axios.post(url+"/upload", formData,{headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     "Access-Control-Allow-Headers" : "Content-Type",
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  //     'Authorization': 'Basic '+ encodedString

  // }});

}

const handleKeydown = (e) => {
  if(recording==true){
  console.log(map1.get(e.which));
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

async function exportAsWav() {
  setIsLoading(true)
  let crunker = new Crunker();
  let temp=[];
  files.forEach(f=>{
    if (f.url){
      temp.push(f.url);
    } else if (typeof f == "string"){
      temp.push(f);
    } else {
      let _file = URL.createObjectURL(f);
      temp.push(_file);
    }
  });
  let expBuffer = await crunker.fetchAudio(...temp);
  let mergedBuffer = await crunker.mergeAudio(expBuffer);
  let exportedAudio = await crunker.export(mergedBuffer,'audio/wav');
  await crunker.download(exportedAudio.blob, "merged");
  setIsLoading(false)
}

// function* getFileCall(){
//   session.audioTracks.forEach(async function* (s) {
//     const formData = new FormData();
//     console.log(s.file);
//     formData.append(
//       'fileName',s.file
//     );
//     formData.append(
//       'bucketName',session.bucketName
//     );
//     let encodeString = 'test@test.com:test1234';
//     const encodedString = Buffer.from(encodeString).toString('base64');


//     yield await axios.post(url+"/getFile", formData,{ responseType: 'arraybuffer',headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       "Access-Control-Allow-Headers" : "Content-Type",
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "OPTIONS,POST,GET", 'Content-Type': 'audio/mpeg' ,

//       'Authorization': 'Basic '+ encodedString
  
//       }});
//     })
// }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getFileByNum(i){
  if(session.audioTracks[i]){
    const formData = new FormData();
    formData.append(
      'fileName',session.audioTracks[i].file
    );
    formData.append(
      'bucketName',session.bucketName
    );
    let encodeString = 'test@test.com:test1234';
    const encodedString = Buffer.from(encodeString).toString('base64');


    let res = await axios.post(url+"/getFile", formData,{ responseType: 'arraybuffer',headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", 'Content-Type': 'audio/mpeg' ,

      'Authorization': 'Bearer '+ jwtToken
  
      }});
    const _file = new Blob([res.data], {
      type: 'audio/mp3'
    });
    pushFile(_file);
    await sleep(3000);
  }
}

async function getAllFiles() {
  // setFileIterator(0);
  // setFiles([]);
  // setIsUpdating(true);
  setIsLoading(true)
  // if (session.audioTracks[0]){
  //   getFileByNum(0);
  // }
  



  // setIsLoading(true)
  let fileArray = []
  // setFiles([]);
  // for await (let _file of getFileCall()) {
  //   pushFile(_file)
  // }
  if (session.audioTracks.length == files.length){
    setIsLoading(false);
    return;
  }
  await session.audioTracks.forEach(async (s) => {
    const formData = new FormData();
    console.log(s.file);
    formData.append(
      'fileName',s.file
    );
    formData.append(
      'bucketName',session.bucketName
    );
    let encodeString = 'test@test.com:test1234';
    const encodedString = Buffer.from(encodeString).toString('base64');


    let res = await axios.post(url+"/getFile", formData,{ responseType: 'arraybuffer',headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", 'Content-Type': 'audio/mpeg' ,

      'Authorization': 'Bearer '+ jwtToken
  
      }});
    const _file = new Blob([res.data], {
      type: 'audio/mp3'
    });
    pushFile(_file);

    // await axios.post(url+"/getFile", formData,{ responseType: 'arraybuffer',headers: {
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json',
    //   "Access-Control-Allow-Headers" : "Content-Type",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "OPTIONS,POST,GET", 'Content-Type': 'audio/mpeg' ,

    //   'Authorization': 'Basic '+ encodedString
  
    // }}).then( res =>{
    //   if (res.data){
    //     console.log(res.data)
    //     const _file = new Blob([res.data], {
    //       type: 'audio/mp3'
    //     })
    //     pushFile(_file);
    //     fileArray.push(_file);
    //     console.log(fileArray);
    //     //setFiles(fileArray);
    //   }
    // }).catch( error => {console.log(error)});
  })
  setIsLoading(false)
  
}

// useEffect(() => {
//   if(isUpdating)
//   {
//     console.log(fileIterator)
//     if(files.length == session.audioTracks.length){
//       setIsUpdating(false);
//       setIsLoading(false);
//     } else{
//       getFileByNum(fileIterator+1);
//       setFileIterator(fileIterator+1);
//     }
//   }
// }, [files])

useEffect(() => {
  connect();
  getFileNames();
}, [])

useEffect(() => {
  getAllFiles();
}, [session.audioTracks])

function getFileNames() {
  const formData = new FormData();
  formData.append(
    'sessionId',session.sessionId
  );
  let encodeString = 'test@test.com:test1234';
  const encodedString = Buffer.from(encodeString).toString('base64');
  axios.get(url+"/getStudioSession?sessionId="+session.sessionId,{headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    'Authorization': 'Bearer '+ jwtToken

  }}).then((res)=>{
    console.log(res)
    if(res.data){
      dispatch2(setAudioTracks(res.data.audioTracks));
    }
  }).catch(error => {console.log(error)});
  
}    

const connect = () => {
  console.log("connecting to the session");
  let socket = new SockJS(url+"/studioSession");
  //{headers : {"Access-Control-Allow-Origin": "*" }}
  let stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log("connected to the frame: " + frame);
    stompClient.subscribe("/topic/session-progress/"+session.sessionId, function (response) {
        let data = JSON.parse(response.body);
        console.log(data);
        getFileNames();
        // displayResponse(data);
    })
  })
}


  return (
    <LoadingOverlay
    active={isLoading}
    spinner
    text='Please wait...'
    >
    <div style={divStyle}>
      {/* <NavBar /> */}
      <div className="flex flex-row pl-20">
        <div className="  bg-gr2 hover:bg-gr3">
          <Microphone style={{}}  pushFile={pushFile} />
        </div>
        <div className="p-2 ml-0.5  pt-5  bg-gr2 hover:bg-gr3">
            <label for={"file-upload"} className=" cursor-pointer">
                File+</label> 
            <input id={"file-upload"} className="text-xs hidden" style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
        </div>
        {/* <Fileupload/> */}
        <div className=" p-2 ml-0.5 flex  flex-row  bg-gr2 hover:bg-gr3">
          <Checkbox style={{color: "#00e676" }} checked={selected.every(Boolean)} onChange={toggleSelectAll} /> 
          <p className="pt-3 pr-1" >Select All</p>
        </div>
        <div className=" ml-0.5 pt-2 bg-gr2 hover:bg-gr3">{transportPlayButton}</div>
        <div className=" ml-0.5 pt-2 bg-gr2 hover:bg-gr3">
          <IconButton  onClick={stopPlayTracks}>
            <StopIcon  smooth={true}  />
          </IconButton>
        </div>

        {/* <div className="bg-gr2 p-4 ml-0.5 pt-5  hover:bg-gr3" style={{width:'20%'}}>
          <input   step='0.01' type="range" color="green" 
          min='0' max='1'/>
        </div> */}
        <div >
          <button onClick={handleRecord} 
            style={{height:'100%'}}
            className=" p-4 ml-0.5 pt-5 bg-gr2 hover:bg-gr3">
            {!changeRecordLabel ? 'Record Instrument' : 'Stop Recording'}
            
          </button>
        </div>
        <div className="p-4 pt-5 ml-0.5 bg-gr2 hover:bg-gr3">
          <button onClick={exportAsWav}>Export as WAV</button>
        </div>
        {/* <div className="p-4 pt-5 ml-0.5 bg-gr2 hover:bg-gr3">
          <button onClick={getAllFiles}>Reload</button>
        </div> */}
        
        
      </div>    
      <div className=" p-0.5 pt-0.5" style={{width:'100%'}}>
        <input   step='0.01' type="range"  min='0' max='1' value={seekValue} onChange={e=>setSeekValue(e.target.value)} style={{width:'50%',marginLeft:'515px'}}/>
      </div>             
      <Grid container direction="column" >
        {files.map((file, index) => (
          <Grid key={index} container >
            <Grid item md={0.2}>
            <Checkbox    style ={{  color: "#00e676" }} checked={selected[index]} onChange={(e)=>toggleSelectOne(e,index)}  /> 
            </Grid>
            <Grid item md={11}>
            <AudioPlayer file={file} playTrack={playTracks[index]} stopPlaying={stopPlaying} seek={seekValue} />
            </Grid>
            <Grid item md={0.5}>
            <IconButton onClick={()=>remove(index) }  className="float-right">
              {/* style={{marginTop: '-60px', position:'relative'}} */}
              <CancelIcon />
            </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
    </LoadingOverlay>
  );
}

export default Tracks;
