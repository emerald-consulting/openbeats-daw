import React,{useState, useContext} from 'react'
import axios from "axios"
import UserContextProvider, { UserContext } from "../../model/user-context/UserContext";


const Fileupload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    // const [state, dispatch] = useContext(UserContext);
    // dispatch({
    //   type: "STORE_AUDIO",
    //   payload: selectedFile
    // });
  const onFileChange = event => {
    
    // Update the state
    setSelectedFile(event.target.files[0]);
  
  };
  const onFileUpload = () => {
    
    // Create an object of formData
    const formData = new FormData();

    formData.append(
      'file',selectedFile
    );
    let bucketname="myawsbucket-3"
    formData.append(
      'bucket',bucketname
    );
  
    // Details of the uploaded file
    console.log(selectedFile);
  
    // Request made to the backend api
    // Send formData object
    let encodeString = 'c@gmail.com:test';
    const encodedString = Buffer.from(encodeString).toString('base64');
    
    axios.post("http://openbeats-daw.us-east-2.elasticbeanstalk.com/upload", formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Basic '+ encodedString
  }});
  };
  const fileData = () => {
    
    if (selectedFile) {
       
      return (
        <div className="text-wh text-xs">
          <h2 >File Details:</h2>
           <p>File Name: {selectedFile.name}</p>
           <p>File Type: {selectedFile.type}</p>
           <p>Last Modified:{" "} {selectedFile.lastModifiedDate.toDateString()}  </p>

        </div>
      );
    } else {
      return (
        <div className="text-wh text-xs">
          {/* <br /> */}
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };
    return (
        <div  className="">
            <div><input className="text-xs " style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
                <button onClick={onFileUpload} className="rounded bg-gr4 p-1">
                  <p className="text-xs">Upload!</p>
                </button>
            </div>
            <div >
                {fileData()}
            </div>
        </div>
    )
}

export default Fileupload
