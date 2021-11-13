
import { Link } from "react-router-dom";
import logo from '../openbeats_notype-45.png';
import gif from '../landing-gif.gif';
import LogNavbar from '../logNavbar/LogNavbar';

import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';

import './Waveform.css';

// import React from "react";
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
// import ReactAudioPlayer from '../src/index.tsx';

// export default Test;

// --------------------------------------------------------------------piano mp3

// import React from 'react';
// import { StyleSheet, Text, View} from 'react-native';

// import Sound from 'react-native-sound';

// export default class App extends React.Component {
//   constructor( props ){
//     super( props );

//     // backgroundColor
//     this.state = {
//       colorC : "white",
//       colorCs: "black",
//       colorD : "white",
//       colorDs: "black",
//       colorE : "white",
//       colorF : "white",
//       colorFs: "black",
//       colorG : "white",
//       colorGs: "black",
//       colorA : "white",
//       colorAs: "black",
//       colorB : "white",
//     }

//     // preload sounds
//     this.sound = {};
//     const soundList = [ "C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B" ]
//     soundList.forEach(note => {
//       this.sound[note] = new Sound( note + ".mp3", Sound.MAIN_BUNDLE, error => {
//         if ( error ) {
//           console.log("failed to load the sound.", error);
//         }
//       })
//     });
//   }
//   stroke ( note ) {
//     // change backgroundColor
//     switch ( note ) {
//       case "C":
//         this.setState({ colorC: "rgba(1, 1, 1, 0.1)" })
//         break;
//       case "Cs":
//         this.setState({ colorCs: "rgba(0, 0, 0, 0.5)" })
//         break;
//       case "D":
//         this.setState({ colorD: "rgba(1, 1, 1, 0.1)" })
//         break;
//       case "Ds":
//         this.setState({ colorDs: "rgba(0, 0, 0, 0.5)" })
//         break;
//       case "E":
//         this.setState({ colorE: "rgba(1, 1, 1, 0.1)" })
//         break;
//       case "F":
//         this.setState({ colorF: "rgba(1, 1, 1, 0.1)" })
//         break;
//       case "Fs":
//         this.setState({ colorFs: "rgba(0, 0, 0, 0.5)" })
//         break;
//       case "G":
//         this.setState({ colorG: "rgba(1, 1, 1, 0.1)" })
//         break;
//       case "Gs":
//         this.setState({ colorGs: "rgba(0, 0, 0, 0.5)" })
//         break;
//       case "A":
//         this.setState({ colorA: "rgba(1, 1, 1, 0.1)" })
//         break;
//       case "As":
//         this.setState({ colorAs: "rgba(0, 0, 0, 0.5)" })
//         break;
//       case "B":
//         this.setState({ colorB: "rgba(1, 1, 1, 0.1)" })
//         break;
//     }

//     // play sound
//     setTimeout( () => {
//       this.sound[note].play(success => {
//         if ( success ) {
//           console.log("successfully finished playing.");
//         } else {
//           console.log("failed to play the sound.");
//         }
//       });
//     }, 1);
//   }
//   stop( note ) {

//     // change backgroundColor
//     switch ( note ) {
//       case "C":
//         this.setState( { colorC: "white" } )
//         break;
//       case "Cs":
//         this.setState( { colorCs: "black" } )
//         break;
//       case "D":
//         this.setState( { colorD: "white" } )
//         break;
//       case "Ds":
//         this.setState( { colorDs: "black" } )
//         break;
//       case "E":
//         this.setState( { colorE: "white" } )
//         break;
//       case "F":
//         this.setState( { colorF: "white" } )
//         break;
//       case "Fs":
//         this.setState( { colorFs: "black" } )
//         break;
//       case "G":
//         this.setState( { colorG: "white" } )
//         break;
//       case "Gs":
//         this.setState( { colorGs: "black" } )
//         break;
//       case "A":
//         this.setState( { colorA: "white" } )
//         break;
//       case "As":
//         this.setState( { colorAs: "black" } )
//         break;
//       case "B":
//         this.setState( { colorB: "white" } )
//         break;
//     }

//     // stop sound
//     setTimeout( () => {
//       // gradually decrease the volume
//       for (let i=0; i<2000; i++) {
//         this.sound[note].setVolume( 1.0-i/2000. );
//       }
//       this.sound[note].stop();
//       this.sound[note].setVolume( 1.0 );
//     }, 1 )
//   }
//   render () {
//     return (
//       <View style={styles.container}>
//         <View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
//           <View style={{ flexDirection : "row", alignItems: "center", justifyContent: "center" }}>

//             <View
//               style={{ backgroundColor: "white", height: 100, width: 32, borderLeftWidth: 1, borderTopWidth: 1,}} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("Cs")}
//               onTouchEnd={() => this.stop("Cs")}
//               style={{ backgroundColor: this.state.colorCs, height: 100, width: 32, borderTopWidth: 1, borderLeftWidth: 1,}} >
//             </View >
//             <View
//               style={{ backgroundColor: "white", height: 100, width: 16, borderTopWidth: 1, }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("Ds")}
//               onTouchEnd={() => this.stop("Ds")}
//               style={{ backgroundColor: this.state.colorDs, height: 100, width: 32, borderTopWidth: 1, borderLeftWidth: 1,}} >
//             </View >
//             <View
//               style={{ backgroundColor: "white", height: 100, width: 32, borderTopWidth: 1, }} >
//             </View >
//             <View
//               style={{ backgroundColor: "white", height: 100, width: 32, borderTopWidth: 1, borderLeftWidth: 1, }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("Fs")}
//               onTouchEnd={() => this.stop("Fs")}
//               style={{ backgroundColor: this.state.colorFs, height: 100, width: 32, borderTopWidth: 1, }} >
//             </View >
//             <View
//               style={{ backgroundColor: "white", height: 100, width: 16, borderTopWidth: 1, }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("Gs")}
//               onTouchEnd={() => this.stop("Gs")}
//               style={{ backgroundColor: this.state.colorGs, height: 100, width: 32, borderTopWidth: 1, }} >
//             </View >
//             <View
//               style={{ backgroundColor: "white", height: 100, width: 16, borderTopWidth: 1, }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("As")}
//               onTouchEnd={() => this.stop("As")}
//               style={{ backgroundColor: this.state.colorAs, height: 100, width: 32, borderTopWidth: 1, }} >
//             </View >
//             <View
//               style={{ backgroundColor: "white", height: 100, width: 32, borderRightWidth: 1, borderTopWidth: 1, }} >
//             </View >

//           </View>

//           <View style={{ flexDirection : "row", alignItems: "center", justifyContent: "center" }}>

//             <View
//               onTouchStart={() => this.stroke("C")}
//               onTouchEnd={() => this.stop("C")}
//               style={{ backgroundColor: this.state.colorC, height: 100, width: 48, borderBottomWidth: 1, borderLeftWidth: 1 }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("D")}
//               onTouchEnd={() => this.stop("D")}
//               style={{ backgroundColor: this.state.colorD, height: 100, width: 48, borderBottomWidth: 1, borderLeftWidth: 1 }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("E")}
//               onTouchEnd={() => this.stop("E")}
//               style={{ backgroundColor: this.state.colorE, height: 100, width: 48, borderBottomWidth: 1, borderLeftWidth: 1 }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("F")}
//               onTouchEnd={() => this.stop("F")}
//               style={{ backgroundColor: this.state.colorF, height: 100, width: 48, borderBottomWidth: 1, borderLeftWidth: 1 }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("G")}
//               onTouchEnd={() => this.stop("G")}
//               style={{ backgroundColor: this.state.colorG, height: 100, width: 48, borderBottomWidth: 1, borderLeftWidth: 1 }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("A")}
//               onTouchEnd={() => this.stop("A")}
//               style={{ backgroundColor: this.state.colorA, height: 100, width: 48, borderBottomWidth: 1, borderLeftWidth: 1 }} >
//             </View >
//             <View
//               onTouchStart={() => this.stroke("B")}
//               onTouchEnd={() => this.stop("B")}
//               style={{ backgroundColor: this.state.colorB, height: 100, width: 48, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }} >
//             </View >

//           </View>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//     flexDirection: "row",
//   },
// });

// --------------------------------------------------------------------
// describe('ReactAudioPlayer', function() {
//   const song = './fixtures/turkish_march.ogg';
//   test('renders an audio element', function() {
//     const instance = ReactTestUtils.renderIntoDocument(
//       // <ReactAudioPlayer />
//     );
//     const instanceEl = ReactDOM.findDOMNode(instance);
//     expect(instanceEl.tagName).toBe('AUDIO');
//   });
//   test('sets the loop attribute if provided', function() {
//     const instance = ReactTestUtils.renderIntoDocument(
//       // <ReactAudioPlayer  src={song}  loop   />
//     );
//     const instanceEl = ReactDOM.findDOMNode(instance);
//     expect(instanceEl.getAttribute('loop')).not.toBe(null);
//   })
//   test('sets title', function() {
//     const instance = ReactTestUtils.renderIntoDocument(
//       // <ReactAudioPlayer src={song} title="Turkish march"      />
//     );
//     const instanceEl = ReactDOM.findDOMNode(instance);
//     expect(instanceEl.getAttribute("title")).toBe("Turkish march");
//   })
//   test('receives all custom props', function() {
//     const instance = ReactTestUtils.renderIntoDocument(
//       // <ReactAudioPlayer src={song} name="custom-name" data-id="custom-data"    controlsList="nodownload" />
//     );
//     const props = Object.keys(instance.props);
//     expect(props).toContain('name');
//     expect(props).toContain('data-id');
//     expect(props).toContain('controlsList');
//   });
// });
// const Test1 = () => <div></div>
// export default Test1

// class Waveform extends Component {  
//   state = {
//     playing: false,
//   };

//   componentDidMount() {
//     const track = document.querySelector('#track');

//     this.waveform = WaveSurfer.create({
//       barWidth: 3,
//       cursorWidth: 1,
//       container: '#waveform',
//       backend: 'WebAudio',
//       height: 80,
//       progressColor: '#2D5BFF',
//       responsive: true,
//       waveColor: '#EFEFEF',
//       cursorColor: 'transparent',
//     });

//     this.waveform.load(track);
//   };
  
//   handlePlay = () => {
//     this.setState({ playing: !this.state.playing });
//     this.waveform.playPause();
//   };
  
//   render() {
//     const url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3';

//     return (
//       <div className="WaveformContianer">
//         <button onClick={this.handlePlay} className="PlayButton">
//           {!this.state.playing ? 'Play' : 'Pause'}
//         </button>
//         <div id="waveform" className="Wave"/>
//         <audio id="track" src={url} />
//       </div>
//     );
//   }
// };

// export default Waveform;

//--------------------------------------------------------------------------



// const TrackComp = () => {
//     const [rows, setRows]= useState([1])
//     const handleClickR = index => {
//         const list = [...rows];
//         list.splice(index, 1);
//         setRows(list);
//     }
//     const handleClickA = () => {
//         let last=rows.at(-1)
//         last=last+1
//         setRows([...rows, last]);
//     }
//     return(
//         <div>
//             Yes
//         {
//             rows.map((x,i) => {
//                 return (
//                     <div id={x} className="flex flex-row mr-2" style={{height:'50%',width:'50%'}}> row
//                         <div className="rounded bg-gr2" style={{width:'40%'}}>
//                             Track 1
//                         </div>
//                         <div style={{width:'60%'}} className="rounded bg-gr2">
//                             waveform
//                         </div>
//                         <button onClick={()=>handleClickR(i)}>Remove</button>
                        
//                     </div>
//                 )
//             })
//         }
//         <button onClick={()=>handleClickA()}>Add</button>
//     </div>
//     )
// }

// const Test = () => {
    
//     return (

//         <div>
            
//             <TrackComp />
//         </div>


/* <div>
<LogNavbar />
<view className="flex flex-row p-10 bg-gr1 h-screen">
    
    <view className="p-5 mr-1 rounded bg-gr2" style={{ width: '25%' }}>
        <h1 className="text-5xl ">user</h1>

    </view>
    <view className="p-5 rounded bg-gr2" style={{ width: '75%' }}>
        <h1 className="text-5xl pl-5">sessions</h1>
        <view className="flex flex-row  p-5" style={{ height: '95%' }} >
            <view className="p-10 mr-1 flex flex-col  rounded bg-gr3" style={{width: '50%' }}>
                <h1 className="text-2xl">Saved sessions</h1>
                <Link className="mt-7 p-2  mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
                session 1
                </Link>
                <Link className="p-2 text-white  mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
                session 2
                </Link>
                <Link className="p-2 text-white  mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
                session 3
                </Link>
            </view>
            <view className=" flex flex-col rounded bg-gr2" style={{width: '50%' }}>
                <view className="p-5 mb-1 pb-10 rounded bg-gr3 "style={{height: '50%' }}><h1 className="text-2xl">create a session</h1>
                <form >
                    <div >
                        <input
                            type='session'
                            className={`w-full p-2 text-wh  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2`}
                            id='sessionid'
                            placeholder='Enter session name'
                        />
                    </div>

                    <div className='flex items-center mt-1'>
                        <button className={`text-wh bg-gr1  hover:bg-gr2 py-2 px-4 rounded`}>
                            Create new Session
                        </button>
                        
                    </div>
                </form>
                </view>
                <view className="p-5 rounded h-50 bg-gr3" style={{height: '50%' }}><h1 className="text-2xl">join a session</h1>
                    <form >
                        <div>
                            <input
                                type='session_join'
                                className={`w-full p-2 text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2`}
                                id='session_url'
                                placeholder='Enter session url'
                            />
                        </div>

                        <div className='flex items-center mt-1'>
                            <button className={`bg-gr1 text-wh hover:bg-gr2 py-2 px-4 rounded`}>
                                Join Session
                            </button>
                            
                        </div>
                    </form>
                </view>
            </view>
        </view>

    </view>
</view>
</div>
        
    );
};  */
const Test = () => {
return (<div>ab</div>
);

};

export default Test;