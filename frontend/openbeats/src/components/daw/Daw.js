import React from 'react'
import LogNavbar from '../logNavbar/LogNavbar'
import Pianoui from './pianoui/Pianoui'
import Fileupload from './Fileupload'
import Dynamicdiv from '../dynamicdiv/Dynamicdiv'
import { Button, PlayerIcon } from 'react-player-controls'
import bgimg from '../bg.jpg'
import { useReactMediaRecorder } from "react-media-recorder";

const RecordView = () => {
    const {
      status,
      startRecording,
      stopRecording,
      mediaBlobUrl,
    } = useReactMediaRecorder({ video: true });
  
    return (
      <div className="text-sm text-red pt-10 pb-5" style={{textAlign:'center'}}>
        <p  className="rounded bg-gr4 mb-0.5">{status}</p>
        <button className="rounded mb-0.5 bg-gr4 p-0.5" onClick={startRecording}>Start Recording</button><br/>
        <button className="rounded bg-gr4 p-0.5" onClick={stopRecording}>Stop Recording</button>
        {/* <video src={mediaBlobUrl} controls autoPlay loop /> */}
      </div>
    );
  };

const PlayerButton = ({ style, children, ...props }) => (
    <Button
      style={{
        appearance: 'none',
        outline: 'none',
        border: 'none',
        borderRadius: 3,
        background: 'white',
        color: 'blue',
        '&:hover': {
          'color': 'lightblue',
        },
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  )

const Daw = () => {
    return (
        <div className="" style={{ backgroundImage: `url(${bgimg})` ,backgroundSize:'cover',height:'100vh',backgroundRepeat:'no-repeat' }} >
            
            <div className="flex flex-col h-screen">
                <LogNavbar/>
                <div className="flex flex-row   " style={{height:'60%'}}>
                    <div className="  mr-1 flex flex-col " style={{width:'15%'}}>
                        <div className="flex flex-row mb-1">
                            <PlayerIcon.Play className="w-10 ml-5 p-1 mt-1 bg-gr4 rounded"  />
                            <PlayerIcon.Pause className="w-10 ml-1 p-1 mt-1 rounded bg-gr4"/>
                            <PlayerIcon.Previous className="w-10 ml-1 mt-1 p-1 rounded bg-gr4"/>
                            <PlayerIcon.Next className="w-10 ml-1 mt-1 p-1 rounded bg-gr4"/>
                        </div>
                        <div className="flex flex-row">
                            
                            <PlayerIcon.SoundOn className="w-10 ml-16 p-1 rounded bg-gr4"/>
                            <PlayerIcon.SoundOff className="w-10 ml-1 p-1 rounded bg-gr4"/>
                            {/* <PlayerIcon.Stop/> */}
                        </div>
                        <div>
                            <RecordView/>
                        </div>

                        <div className="p-5" style={{whiteSpace:"break-spaces", wordWrap:'break-word'}}>
                            <Fileupload/>
                        </div>
                    </div>
                    <div className="  mr-1 p-1" style={{width:'65%'}}>
                        <Dynamicdiv/>
                    </div>
                    <div className="  mb-0.5" style={{width:'20%'}}>
                        <p className="text-2xl rounded p-3 " style={{textAlign:'center'}}>Collaborators</p>
                        <Dynamicdiv/>
                    </div>
                </div>
                <div style={{ borderTop: "4px solid green"}} ></div>
                <div className="flex flex-row  " style={{height:'40%'}}>
                    <div className=" mr-1 " style={{width:'40%'}}>
                        
                    </div>
                    <div className=" h-100vh" style={{width:'60%'}}>
                        <Pianoui/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Daw
