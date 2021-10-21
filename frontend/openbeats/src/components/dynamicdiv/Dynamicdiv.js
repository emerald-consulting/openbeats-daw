import React,{useState} from 'react'


const TrackComp = () => {
    const [rows, setRows]= useState([1])
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
    return(
        <div style={{overflowY:'scroll',height:'370px'}}>
            
        {
            rows.map((x,i) => {
                return (
                    <div id={x} className="flex flex-row mr-1 mb-0.5"  > 
                    {/* style={{height:'50%',width:'50%'}} */}
                        <div className=" bg-gr4 p-2 mr-0.5" style={{width:'20%'}}>
                            Track {i+1}
                        </div>
                        <div style={{width:'80%'}} className=" bg-gr4 p-2 mr-1">
                            waveform {i+1}
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
