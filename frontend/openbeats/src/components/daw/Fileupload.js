import React,{useState, useContext} from 'react'
import axios from "axios"
import UserContextProvider, { UserContext } from "../../model/user-context/UserContext";
import { useSelector, useDispatch } from 'react-redux'
const url = "http://openbeatsdaw-env.eba-4gscs2mn.us-east-2.elasticbeanstalk.com"
//const url="http://localhost:8080"

const Fileupload = () => {

     const user = useSelector(_state => _state.user);
      let jwtToken = `${user.jwtToken}`;
         console.log("from Track js this is the jwt token"+jwtToken);
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
    
    axios.post(url+"/upload", formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
       'Authorization': 'Bearer '+ jwtToken
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
        <div className="text-wh text-xs hidden">
          {/* <br /> */}
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };
    return (
        <div  className="bg-gr2 ml-0.5 ">
            <div className="">
              <input className="text-xs hidden" style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  />
                <button onClick={onFileUpload}  className=" bg-gr2 p-5 hover:bg-gr3  " >
                  <p className="text">Upload!</p>
                </button>
            </div>
            <div >
                {fileData()}
            </div>
        </div>
    )
}

export default Fileupload
