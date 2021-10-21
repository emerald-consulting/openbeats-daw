import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";

import NavBar from "./components/NavBar/NavBar";
import Microphone from "./components/Microphone/Microphone";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";

//overflowY: 'scroll', height: '400px', max-width: '100%', overflow-x: 'hidden'

const divStyle = {
  overflowY: 'scroll', height: '400px', maxWidth: '100%', overflowX: 'hidden'
};

function Tracks() {
  const [files, setFiles] = useState([null]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const onFileChange = event => {
    //var blobUrl = URL.createObjectURL(event.target.files[0])
    setSelectedFile(event.target.files[0]);
    pushFile(URL.createObjectURL(event.target.files[0]))
  };

  const pushFile = file => {
    setFiles([...files, file]);
  };

  return (
    <div style={divStyle}>
      {/* <NavBar /> */}
      <Microphone pushFile={pushFile} />
      <div>
          <label for={"file-upload"} className="rounded border m-2 p-0.5 cursor-pointer">
              File +</label> 
          <input id={"file-upload"} className="text-xs hidden" style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
      </div>
                            
      <Grid container direction="column" spacing={3}>
        {files.map((file, index) => (
          <Grid key={index} item>
            <AudioPlayer file={file} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Tracks;
