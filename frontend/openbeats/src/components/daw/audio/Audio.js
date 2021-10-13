import React, { Components } from 'react';
import ReactHowler from 'react-howler';
import sng from '../../song1.mp3';
import { Howl, Howler } from 'howler';
import { useAudioPlayer } from "react-use-audio-player";

const Audio = () => {
    const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
        src: sng,
        format: "mp3",
        autoplay: false,
        onend: () => console.log("sound has ended!")
    });
 
    if (!ready && !loading) return <div>No audio to play</div>
    if (loading) return <div>Loading audio</div>
 
    return (
        <div>
            <button onClick={togglePlayPause}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
};

// const Audio = () => {
//   // This sound file may not work due to cross-origin setting
  
//     return (
      
//     //   <ReactHowler src={sng} playing={'true'}/>
        
//         <button><audio src={sng} onSeek  onClick={'SoundPlay','stop'} 
//         Controls=' autoplay' rate="4"></audio>a</button>
//         // <button><audio onClick={'togglePlayPause'}></audio>hello</button>
//     );
  
// };

export default Audio;