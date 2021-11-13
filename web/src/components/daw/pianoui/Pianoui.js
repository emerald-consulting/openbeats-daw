import React, {useState} from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import _ from 'lodash';
import 'react-piano/dist/styles.css';


import DimensionsProvider from './DimensionsProvider';
import SoundfontProvider from './SoundfontProvider';
import './style.css';


// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const AppCall = () => {


  return (
    <div>
      <div className="rounded" style={{boxShadow:'0px 5px 8px 3px'}}> <ResponsivePiano /> </div>

    </div>
  );
}

function BasicPiano() {
  return (
    <SoundfontProvider
      instrumentName="acoustic_grand_piano"
      audioContext={audioContext}
      hostname={soundfontHostname}
      render={({ isLoading, playNote, stopNote }) => (
        <Piano
          noteRange={noteRange}
          width={300}
          playNote={playNote}
          stopNote={stopNote}
          disabled={isLoading}
          keyboardShortcuts={keyboardShortcuts}
        />
      )}
    />
  );
}

function ResponsivePiano(props) {
  // const [recording, setRecording] = useState({
  //     mode: 'RECORDING',
  //     events: [],
  //     currentTime: 0,
  //     currentEvents: [],
  // })
  const [mode, setMode] = useState('RECORDING')
  const [events, setEvents] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [currentEvents, setCurrentEvents] = useState([])
  var scheduledEvents = [];

  const getRecordingEndTime = () => {
    if (events.length === 0) {
      return 0;
    }
    return Math.max(
      ...events.map(event => event.time + event.duration),
    );
  };

  // const setRecording = value => {
  //   setState({
  //     recording: Object.assign({}, state.recording, value),
  //   });
  // };

  const onClickPlay = () => {
    console.log("clicked")
    setMode('PLAYING')
    // setRecording({
    //   mode: 'PLAYING',
    // });
    console.log(mode)
    const startAndEndTimes = _.uniq(
      _.flatMap(events, event => [
        event.time,
        event.time + event.duration,
      ]),
    );
    startAndEndTimes.forEach(time => {
      scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = events.filter(event => {
            return event.time <= time && event.time + event.duration > time;
          });
          // setRecording({
          //   currentEvents,
          // });
          setCurrentEvents(currentEvents)
        }, time * 1000),
      );
    });
    // Stop at the end
    setTimeout(() => {
      onClickStop();
    }, getRecordingEndTime() * 1000);

    // let blob = new Blob(this.currentEvents, { 'type' : 'audio/webm;codecs=opus' });
    // window.open(URL.createObjectURL(blob));
  };

  const onClickStop = () => {
    scheduledEvents.forEach(scheduledEvent => {
      clearTimeout(scheduledEvent);
    });
    // setRecording({
    //   mode: 'RECORDING',
    //   currentEvents: [],
    // });
    setMode('RECORDING')
    setCurrentEvents([])
  };
  const onClickClear = () => {
    onClickStop();
    // setRecording({
    //   events: [],
    //   mode: 'RECORDING',
    //   currentEvents: [],
    //   currentTime: 0,
    // });
  };
  return (
    <div>
    <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <SoundfontProvider
          instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
          hostname={soundfontHostname}
          render={({ isLoading, playNote, stopNote }) => (
            <Piano
              noteRange={noteRange}
              width={containerWidth}
              // height={containerHeight}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              {...props}
            />
          )}
        />
      )}
    </DimensionsProvider>
    <div className="mt-5">
      <button onClick={()=>onClickPlay()}>Play</button>
      <button onClick={()=>onClickStop()}>Stop</button>
      <button onClick={()=>onClickClear()}>Clear</button>
    </div>
    <div className="mt-5">
          <strong>Recorded notes</strong>
          <div>{JSON.stringify(events)}</div>
        </div>
  </div>
  );
}



export default AppCall;
