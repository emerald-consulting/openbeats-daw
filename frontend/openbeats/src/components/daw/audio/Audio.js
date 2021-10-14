import React, { Components, useState } from 'react';
import ReactHowler from 'react-howler';
import sng from '../../song1.mp3';
import { Howl, Howler } from 'howler';
import { useAudioPlayer } from "react-use-audio-player";

// const Audio = () => {
//     const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
//         src: sng,
//         format: "mp3",
//         autoplay: false,
//         onend: () => console.log("sound has ended!")
//     });
 
//     if (!ready && !loading) return <div>No audio to play</div>
//     if (loading) return <div>Loading audio</div>
 
//     return (
//         <div>
//             <button onClick={togglePlayPause}>{playing ? "Pause" : "Play"}</button>
//         </div>
//     );
// };

const Audio = () => {
  // This sound file may not work due to cross-origin setting
    const [ play, setPlay ] = useState(false)
    return (
            
        <div >
            <ReactHowler src={sng} playing={'true'}/>
            <button><audio Controls='autoplay' className="rounded bg-gr4 p-4" onClick={() => setPlay(!play)}>
                </audio>  { play ? 'Pause' : 'Play' }
            </button>
        </div>

        
        // <button><audio src={sng} onSeek  onClick={'SoundPlay','stop','togglePlayPause'} 
        // Controls=' autoplay' ></audio>a</button>
        // <button><audio onClick={'togglePlayPause'}></audio>hello</button>
    );
  
};

export default Audio;