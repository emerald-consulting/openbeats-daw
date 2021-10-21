import React from 'react';
import _ from 'lodash';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Recorder from 'recorder-js';

import DimensionsProvider from './DimensionsProvider';
import SoundfontProvider from './SoundfontProvider';
import PianoWithRecording from './PianoWithRecording';

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const recorder = new Recorder(audioContext);
let isRecording = false;
let blob = null;
navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => recorder.init(stream))
  .catch(err => console.log('Uh oh... unable to get stream...', err));
 
function startRecording() {
  recorder.start()
    .then(() => isRecording = true);
}
 
function stopRecording() {
  recorder.stop()
    .then(({blob, buffer}) => {
      blob = blob;
 
      // buffer is an AudioBuffer
    });
}
 
function download() {
  Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
}

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

class AppCall extends React.Component {
  state = {
    recording: {
      mode: 'RECORDING',
      events: [],
      currentTime: 0,
      currentEvents: [],
    },
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
  }

  getRecordingEndTime = () => {
    if (this.state.recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.recording.events.map(event => event.time + event.duration),
    );
  };

  setRecording = value => {
    this.setState({
      recording: Object.assign({}, this.state.recording, value),
    });
  };

  onClickPlay = () => {
    //startRecording();
    this.setRecording({
      mode: 'PLAYING',
    });
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.recording.events, event => [
        event.time,
        event.time + event.duration,
      ]),
    );
    startAndEndTimes.forEach(time => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.recording.events.filter(event => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents,
          });
        }, time * 1000),
      );
    });
    // Stop at the end
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);

    // let blob = new Blob(this.currentEvents, { 'type' : 'audio/webm;codecs=opus' });
    // window.open(URL.createObjectURL(blob));
    //stopRecording();
  };

  onClickStop = () => {
    this.scheduledEvents.forEach(scheduledEvent => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      mode: 'RECORDING',
      currentEvents: [],
    });
  };

  onClickClear = () => {
    this.onClickStop();
    this.setRecording({
      events: [],
      mode: 'RECORDING',
      currentEvents: [],
      currentTime: 0,
    });
  };

  recordedNotes =() => (<div className="mt-5 text-xs bg-gr4">
  <p>Recorded notes</p>
  <div>{JSON.stringify(this.state.recording.events)}</div>
</div>)

  render() {
    return (
      <div className="flex flex-col">
      <div className="flex flex-row" style={{height:'100%'}} >
          <div className="mt-5 flex flex-col pr-2">
            <button className="rounded bg-gr4 p-1 mb-1" onClick={this.onClickPlay}>Play</button>
            <button className="rounded bg-gr4 p-1 mb-1"  onClick={this.onClickStop}>Stop</button>
            <button className="rounded bg-gr4 p-1 mb-1"  onClick={this.onClickClear}>Clear</button>
            <button className="rounded bg-gr4 p-1"  onClick={()=>download()}>Download</button>
          </div>
          <div className="" style={{width:'100%'}}  >
            <SoundfontProvider 
              instrumentName="acoustic_grand_piano"
              audioContext={audioContext}
              hostname={soundfontHostname}
              render={({ isLoading, playNote, stopNote }) => (
                <PianoWithRecording 
                  recording={this.state.recording}
                  setRecording={this.setRecording}
                  noteRange={noteRange}
                  width={'600'}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  keyboardShortcuts={keyboardShortcuts}
                />
              )}
            />
          </div>
 
        
      </div>
      {this.state.recording.events[0]?this.recordedNotes():""}
      {/* <div className="mt-5 text-xs bg-gr4">
          <p>Recorded notes</p>
          <div>{JSON.stringify(this.state.recording.events)}</div>
        </div> */}
      </div>
    );
  }
}

export default AppCall;
