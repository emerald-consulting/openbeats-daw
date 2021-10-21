import React,{useState} from 'react';
import Waveform from '../daw/waveform/Waveform';


const TrackComp = () => {
    const [rows, setRows]= useState([1])
    const [selectedFile, setSelectedFile] = useState(null);
    const handleClickR = index => {
        const list = [...rows];
        list.splice(index, 1);
        setRows(list);
    }
    const handleClickA = () => {
        let last=rows.at(-1)
        last=last+1
        setRows([...rows, last]);
    }
    const onFileChange = event => {
    
        // Update the state
        setSelectedFile(event.target.files[0]);
      
      };
    return(
        <div style={{overflowY:'scroll',height:'370px'}}>
            
        {
            rows.map((x,i) => {
                return (
                    <div id={x} className="flex flex-row mr-1 mb-0.5"  > 
                        {/* style={{height:'50%',width:'50%'}} const   selectedFile     */}
                        <div className=" flex flex-row bg-gr4 p-1 pt-4 mr-0.5" style={{width:'30%'}}>
                            Track {i+1}
                            {/* selectedFile.name goes in track name */}
                            <div>
                                <label for={"file-upload"+x} className="rounded border m-2 p-0.5 cursor-pointer">
                                    File +</label> 
                                <input id={"file-upload"+x} className="text-xs hidden" style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  /></div>
                            </div>
                        <div style={{width:'70%'}} className=" bg-gr4 p-2 mr-1">
                            {/* waveform {i+1} */}
                            <Waveform source={selectedFile} id={x}/>
                            {/* waveform component to be called here  */}
                        </div>
                        <button onClick={()=>handleClickR(i)} className="rounded bg-gr3 p-1">Remove</button>
                        
                    </div>
                )
            })
        }
        <button onClick={()=>handleClickA()} className="rounded bg-gr3 p-2 mt-0.5">Add</button>
        </div>
    )
}

const Dynamicdiv = () => {
    return (
        <div>
            <TrackComp />
        </div>
    )
}

export default Dynamicdiv
