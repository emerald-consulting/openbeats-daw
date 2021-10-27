import ReactDOM from 'react-dom'
import React from 'react';
import './style.css';
import Crunker from 'crunker'
import audioFile_N from './Brk_Snr.mp3'
import audioFile_Z from './Dsc_Oh.mp3'
import audioFile_X from './Cev_H2.mp3'
import audioFile_C from './Kick_n_Hat.mp3'
import audioFile_V from './punchy_kick_1.mp3'
import audioFile_B from './RP4_KICK_1.mp3'
import audioFile_M from './side_stick_1.mp3'
import audioFile_comma from './Heater-6.mp3'
import audioFile_dot from './Give_us_a_light.mp3'
import audioFile2 from './side_stick_1.mp3'
import audioFile3 from './song1.mp3'
const keysPressed=new Array();
var soundsPLayed=new Array();
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const firstSoundsGroup = [
    { key: 'Z',
      keyCode: 90,
      id: 'Open-HH',
      url: audioFile_Z
    },
    { key: 'X',
      keyCode: 88,
      id: 'Closed-HH',
      url: audioFile_X
    },
    { key: 'C',
      keyCode: 67,
      id: 'Kick-and-Hat',
      url: audioFile_C
    },
    { key: 'V',
      keyCode: 86,
      id: 'Punchy-Kick',
      url: audioFile_V
    },
    { key: 'B',
      keyCode: 66,
      id: 'Kick',
      url: audioFile_B
    },
    { key: 'N',
      keyCode: 78,
      id: 'Snare',
      url: audioFile_N
    },
    { key: 'M',
      keyCode: 77,
      id: 'Side-Stick',
      url: audioFile_M
    },
    { key: ',',
      keyCode: 188,
      id: 'Clap',
      url: audioFile_comma
    },
    { key: '.',
      keyCode: 190,
      id: 'Shaker',
      url: audioFile_dot
    }
  ];




  const secondSoundsGroup = [
      { key: 'Z',
           keyCode: 90,
           id: 'Open-HH',
            url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
         },
         { key: 'X',
           keyCode: 88,
           id: 'Closed-HH',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
         },
         { key: 'C',
           keyCode: 67,
           id: 'Kick-and-Hat',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
         },
         { key: 'V',
           keyCode: 86,
           id: 'Punchy-Kick',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
         },
         { key: 'B',
           keyCode: 66,
           id: 'Kick',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
         },
         { key: 'N',
           keyCode: 78,
           id: 'Snare',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
         },
         { key: 'M',
           keyCode: 77,
           id: 'Side-Stick',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
         },
         { key: ',',
           keyCode: 188,
           id: 'Clap',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
         },
         { key: '.',
           keyCode: 190,
           id: 'Shaker',
           url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
         }
    ];

  const soundsName = {
    heaterKit: "Heater Kit",
    smoothPianoKit: "Smooth Piano Kit"
  };

  const soundsGroup = {
    heaterKit: firstSoundsGroup,
    smoothPianoKit: secondSoundsGroup
  }

  const KeyboardKey = ({ play, deactivateAudio, sound: { id, key, url, keyCode } }) => {
    const handleKeydown = (e) => {
      if(keyCode === e.keyCode) {
        const audio = document.getElementById(key);
        console.log(audio);
        play(key, id);
        deactivateAudio(audio)
      }
    }

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeydown);
    }, [])

    return (
    <div className="outer-drum-pad">
      <button value="test" id={keyCode} className="drum-pad" onClick={() => play(key, id)}>
        <audio className="clip" src={url} id={key} />
        {key}
      </button>
    </div>
    );
  }

  const Keyboard = ({ sounds, play, power, deactivateAudio }) =>  (
    <div className="keyboard">
      {power
        ? sounds.map((sound) => <KeyboardKey sound={sound} play={play} deactivateAudio={deactivateAudio} />)
        : sounds.map((sound) => <KeyboardKey sound={{...sound, url: "#" }} play={play} deactivateAudio={deactivateAudio} />)
      }
    </div>
  );

  const DumControle = ({ stop, name, power, volume, handleVolumeChange, changeSoundGroup }) => (
    <div className="controle pl-5">
      <button onClick={stop}>Turn Power {power ? 'OFF' : 'ON'}</button>
      <h2>Volume: %{Math.round(volume * 100)}</h2>
      <input
        max="1"
        min="0"
        step='0.01'
        type="range"
        value={volume}
        
        onChange={handleVolumeChange}
        />

    </div>
  );

  const App = () => {
    const [power, setPower] = React.useState(true);
    const [volume, setVolume] = React.useState(1);
    const [soundName, setSoundName] = React.useState("");
    const [soundType, setSoundType] = React.useState("heaterKit");
    const [sounds, setSounds] = React.useState(soundsGroup[soundType]);

    const styleActiveKey = (key) => {
      key.parentElement.style.backgroundColor = "#ffff00"
      key.parentElement.style.color = "#ffffff"
    }

    const deActivatedKey = (audio) => {
      audio.parentElement.style.backgroundColor = "#ffffff"
      audio.parentElement.style.color = "#000000"
    }

   const deactivateAudio = (audio) => {
     setTimeout(() => {
       audio.parentElement.style.backgroundColor = "#ff00ff"
       audio.parentElement.style.color = "#666666"
     }, 300)
   }

    const play = (key, sound) => {
      keysPressed.push(key);
      console.log(keysPressed);
      setSoundName(sound)
      const audio = document.getElementById(key);
      soundsPLayed.push(audio.src);
      styleActiveKey(audio);
      audio.currentTime = 0;
      audio.play();
      deactivateAudio(audio)
    }

    const stop = () => {
       setPower(!power)
    }

    const changeSoundGroup = () => {
      setSoundName("")
      if(soundType === "heaterKit"){
          setSoundType("smoothPianoKit");
          setSounds(soundsGroup.smoothPianoKit);
      } else {
          setSoundType("heaterKit");
          setSounds(soundsGroup.heaterKit);
      }
    }

    const handleVolumeChange = e => {
      setVolume(e.target.value)
    }

    const setKeyVolume = () => {
      const audioes = sounds.map(sound => document.getElementById(sound.key));
      audioes.forEach(audio => {
        if(audio) {
          audio.volume = volume;
        }
      })
    }

  async function download1(audioFile) {
var audioContext = new AudioContext();
  //var audioSrc = URL.createObjectURL(audioFile)
let crunker = new Crunker();

crunker
  .fetchAudio(audioFile)
  .then((buffers)=>{
      return buffers;
  });



  }

   function concatAudioBuffer(buffers){
      let crunker = new Crunker();
      return crunker.concatAudio(buffers);
    }

 async  function getAudioBuffer(file){
    let crunker = new Crunker();

    let x= await crunker
      .fetchAudio(file)
      .then((buffers)=>{
            return buffers;
      });

        return x;

      }



 async function download() {
    var initBuffer=null;
    var tempBuffer=null;
//    var x=[audioFile1,audioFile,audioFile2,audioFile3];
    var x=soundsPLayed;
    console.log(x);
    for(var i=0;i<x.length;i++){
        console.log(i);
        if(i==0){
            initBuffer= await getAudioBuffer(x[i]);
        }else{
            tempBuffer= await getAudioBuffer(x[i]);
            console.log(initBuffer)
            var x1= new Array();
            if(i==1){
                x1.push(initBuffer[0]);
            }else{
                x1.push(initBuffer);
            }
            x1.push(tempBuffer[0]);
            initBuffer=concatAudioBuffer(x1);


        }

    }

        let crunker = new Crunker();
        console.log("this is aduio");
          console.log(initBuffer);
var ds=        crunker.export(initBuffer, "audio/mp3");
crunker.download(ds.blob);


}



    return (
      <div id="drum-machine">
        {setKeyVolume()}
        <button className="rounded bg-gr4 p-1"  onClick={()=>download()}>Download</button>
        <div className="wrapper">
          <Keyboard sounds={sounds} play={play} power={power} deactivateAudio={deactivateAudio} />
          <DumControle
            stop={stop}
            power={power}
            volume={volume}
            name={soundName || soundsName[soundType]}
            handleVolumeChange={handleVolumeChange}
           />
        </div>
      </div>
    )
  };

//  ReactDOM.render(<App />, document.querySelector("#app"))
const AppCall = () => {

  return (
  
      <div className=""> <App /> </div>

  
  );
}

export default AppCall;