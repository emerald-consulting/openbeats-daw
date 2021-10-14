import React from 'react'
import LogNavbar from '../logNavbar/LogNavbar'
import Pianoui from './pianoui/Pianoui'
import Fileupload from './Fileupload'
import Dynamicdiv from '../dynamicdiv/Dynamicdiv'
import { Button, PlayerIcon } from 'react-player-controls'

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
        <div className="" >
            
            <div className="flex flex-col h-screen">
                <LogNavbar/>
                <div className="flex flex-row   bg-gr1" style={{height:'60%'}}>
                    <div className="  bg-gr1 mr-1 " style={{width:'15%'}}>
                        <PlayerIcon.Play className="w-10 ml-5 mt-5" style={{color:'err'}} />
                        <PlayerIcon.Pause className="w-10 ml-5"/>
                        <PlayerIcon.Previous className="w-10 ml-5"/>
                        <PlayerIcon.Next className="w-10 ml-5"/>
                        <PlayerIcon.SoundOn className="w-10 ml-5"/>
                        <PlayerIcon.SoundOff className="w-10 ml-5"/>
                    </div>
                    <div className=" bg-gr1 mr-1 p-1" style={{width:'65%'}}>
                        <Dynamicdiv/>
                    </div>
                    <div className=" bg-gr2 mb-0.5" style={{width:'20%'}}>
                        <p className="text-2xl rounded bg-gr2 p-3 " style={{textAlign:'center'}}>Collaborators</p>
                        <Dynamicdiv/>
                    </div>
                </div>
                <div style={{ borderTop: "4px solid green"}} ></div>
                <div className="flex flex-row  bg-gr1" style={{height:'40%'}}>
                    <div className=" mr-1 bg-gr1" style={{width:'40%'}}>
                        <Fileupload/>
                    </div>
                    <div className=" bg-gr1" style={{width:'60%'}}>
                        <Pianoui/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Daw
