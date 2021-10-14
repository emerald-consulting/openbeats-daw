import React from 'react'
import LogNavbar from '../logNavbar/LogNavbar'
import Pianoui from './pianoui/Pianoui'
import Fileupload from './Fileupload'

const Daw = () => {
    return (
        <div className="">
            
            <div className="flex flex-col h-screen">
                <LogNavbar/>
                <div className="flex flex-row   bg-gr1" style={{height:'60%'}}>
                    <div className="  bg-gr4 mr-1 " style={{width:'15%'}}></div>
                    <div className=" bg-gr4 mr-1 " style={{width:'65%'}}>
                        <div> row
                            <div>
                                Track 1
                            </div>
                            <div>
                                waveform
                            </div>
                        </div>
                    </div>
                    <div className=" bg-gr4 " style={{width:'20%'}}></div>
                </div>
                <div style={{ borderTop: "4px solid green"}} ></div>
                <div className="flex flex-row  bg-gr1" style={{height:'40%'}}>
                    <div className=" mr-1 bg-gr4" style={{width:'40%'}}>
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
