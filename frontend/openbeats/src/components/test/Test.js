
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
const Test1 = () => <div></div>
export default Test1

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

// export default Test;






















// const Test = () => {
//     return (
//         <View style={styles.container}>
//           <ImageBackground
//             style={styles.coverImage}
//             source={{
//               src: {logo},
//             }}>
//             <View style={styles.textView}>
//               <Text style={styles.imageText}>HAPPY MARRIED LIFE</Text>
//             </View>
//           </ImageBackground>
//         </View>
//       );

// };

// export default Test;




// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   coverImage: {
//     width: '100%',
//     height: 200,
//   },
//   textView: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   imageText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });