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
                        <div className=" bg-gr4 p-2 mr-0.5" style={{width:'20%'}}>
                            Track {i+1}
                            {/* selectedFile.name goes in track name */}
                            <div><input className="text-xs " style={{maxWidth:'100%'}}  type="file" onChange={onFileChange}  /></div>
                        </div>
                        <div style={{width:'80%'}} className=" bg-gr4 p-2 mr-1">
                            waveform {i+1}
                            <Waveform source={selectedFile} id={i+1}/>
                            {/* waveform component to be called here  */}
                        </div>
                        <button onClick={()=>handleClickR(i)} className="rounded bg-gr3 p-2">Remove</button>
                        
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
