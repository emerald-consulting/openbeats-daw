import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import Microphone from "./components/Microphone/Microphone";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import Fileupload from "../Fileupload";

//overflowY: 'scroll', height: '400px', max-width: '100%', overflow-x: 'hidden'

const divStyle = {
  overflowY: 'scroll', height: '400px', maxWidth: '100%', overflowX: 'hidden'
};

//

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

  const remove = index => {
    if (index !== -1) {
      setFiles(files.filter(function(file) { 
        return file !== files[index]
      }));
    }
  }

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
      </div>                 
      <Grid container direction="column" spacing={1}>
        {files.map((file, index) => (
          <Grid key={index} item>
            <AudioPlayer file={file} />
            <IconButton onClick={()=>remove(index) } style={{marginTop: '-60px', position:'relative'}} className="float-right"><CancelIcon /></IconButton>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Tracks;
