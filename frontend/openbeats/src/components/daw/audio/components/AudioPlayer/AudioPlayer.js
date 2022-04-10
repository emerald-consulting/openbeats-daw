import React, { useEffect, useRef, useState, useContext, useLayoutEffect } from "react";
import * as WaveSurfer from "wavesurfer.js";
import * as Region from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import { uuid } from "uuidv4";

import { useSelector, useDispatch } from "react-redux";
import { setMaxDuration } from "../../../../../model/audio/Audio";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";

import PauseIcon from "@material-ui/icons/Pause";
import Grid from "@material-ui/core/Grid";

import { UserContext } from "../../../../../model/user-context/UserContext";
import Draggable from "react-draggable";
import { useLocation } from "react-router";
import axios from "axios";
import { url } from "../../../../../utils/constants";


const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    background: "#68BC76",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
  },
  media: {
    width: "100%",
  },
  controls: {
    minWidth: "100%",
  },
  icon: {
    height: 20,
    width: 20,
  },
  avatar: {
    display: "inline-block",
  },
  slider: {
    width: "60px",
    marginLeft: "4px",
    marginRight: "4px",
    marginTop: "6px",
    color: "#2d4858",
  },
  scroll: {
    backgroundColor: "#ffff",
  },
}));

function AudioPlayer({
  file,
  playTrack,
  stopPlaying,
  seek = 0,
  zoom,
  owner,
  isSelected,
  isMusicPlaying,
  playHeadPos,
  playRegion,
  cutRegion,
  cropRegion,
  updateFileOffsets,
  fileId,
  initOffset,
  volume,
  fileName,
  index,
  fileVersionHandler
}) {
  const wavesurfer = useRef(null);
  const [state, dispatch] = useContext(UserContext);
  const [loopStyle, setLoopStyle] = useState(false);
  const [waveWidth, setWaveWidth] = useState(1000);
  const [deltaPosition, setDeltaPosition] = useState(0);
  const [fileVersions, setfileVersions] = useState([]);

  const _audio = useSelector((_state) => _state.audio);
  const maxDuration = _audio ? _audio.maxDuration : -1;
  const dispatch2 = useDispatch();
  var isLoop = false;
  const search = useLocation().search;
  const sessionId = new URLSearchParams(search).get("sessionId");
  let token = localStorage.getItem("auth-token");

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurferId = `wavesurfer--${uuid()}`;

  useEffect(() => {
    const colors = ["hsl(0,100%,50%, 0,5)", "hsl(300,100%,50%, 0.3)"];
    wavesurfer.current = WaveSurfer.create({
      container: `#${wavesurferId}`,
      waveColor: "green",
      progressColor: "green",
      hideScrollbar: true,
      cursorWidth: 0,
      height: 100,
      width: 50,
      fillParent: true,
      scrollParent: false,
      minPxPerSec: 30,
      plugins: [
        Region.create({
          regions: [
            {
              id: 1,
              start: 2,
              end: 4,
              // color: colors[Math.floor(Math.random() * 2) % 2],
              minLength: 4
            },
          ],
        }),
      ],
    });

    const wav = require("../../../../song1.mp3");

    wavesurfer.current.load(wav);
    wavesurfer.current.on("ready", () => {
      setPlayerReady(true);
      let cDur = wavesurfer.current.getDuration();
      console.log(cDur);
      setWaveWidth(cDur * 30);
      if (cDur > maxDuration) {
        dispatch2(setMaxDuration(cDur));
      }
    });

    const handleResize = wavesurfer.current.util.debounce(() => {
      wavesurfer.current.empty();
      wavesurfer.current.drawBuffer();
    }, 150);

    wavesurfer.current.on("play", () => setIsPlaying(true));
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    console.log("file", file);
    if (file) {
      if (file.blobURL) {
        wavesurfer.current.load(file.blobURL);
      } else if (file.blob) {
        wavesurfer.current.loadBlob(file.blob);
      } else if (typeof file == "string") {
        wavesurfer.current.load(file);
      } else {
        wavesurfer.current.loadBlob(file);
      }
    }
  }, [file]);

  useEffect(() => {
    if (!isMusicPlaying || !isSelected) {
      wavesurfer.current.pause();
      setIsPlaying(false);
      return;
    }
    if (playHeadPos < deltaPosition || playHeadPos > waveWidth + deltaPosition)
      return;

    if (!isPlaying) {
      setIsPlaying(true);
      wavesurfer.current.play((playHeadPos - deltaPosition) / 30);
    }
  }, [isMusicPlaying, isSelected, playHeadPos, isPlaying, deltaPosition]);

  useEffect(() => {
    console.log("seek", seek);
    wavesurfer.current.seekAndCenter(parseInt(seek));
  }, [seek]);

  useEffect(() => {
    console.log("zoom", zoom);
    wavesurfer.current.zoom(parseInt(zoom));
  }, [zoom]);

  useEffect(() => {
    wavesurfer.current.stop();
  }, [stopPlaying]);

  useEffect(() => {
    if (playRegion) {
      var region = wavesurfer.current.regions.list[1];
      if(region.end - region.start > 1){
        wavesurfer.current.regions.list[1].play()
      }else
      wavesurfer.current.play();
    }
  }, [playRegion]);

  useEffect(() => {
    console.log("cropRegion", cropRegion);
    if (cropRegion) copy();
  }, [cropRegion]);

  useEffect(() => {
    console.log("cutRegion", cutRegion);
    if (cutRegion) cut();
  }, [cutRegion]);

  useEffect(() => {
    if(volume)
    wavesurfer.current.setVolume(volume);
  }, [volume]);

  const togglePlayback = () => {
    if (!isPlaying) {
      wavesurfer.current.regions.list[1].play();
      console.log(wavesurfer.current.getDuration());
    } else {
      wavesurfer.current.pause();
    }
  };

  const stopPlayback = () => wavesurfer.current.stop();

  const classes = useStyles();

  let transportPlayButton;

  if (!isPlaying) {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PlayArrowIcon className={classes.icon} />
      </IconButton>
    );
  } else {
    transportPlayButton = (
      <IconButton onClick={togglePlayback}>
        <PauseIcon className={classes.icon} />
      </IconButton>
    );
  }

  const fastForward = () => {
    wavesurfer.current.skipForward();
  };
  const skipBackward = () => {
    wavesurfer.current.skipBackward();
  };
  const setLoop = () => {
    isLoop = !isLoop;
    console.log(isLoop);

    if (isLoop) {
      setLoopStyle(true);
    } else {
      setLoopStyle(false);
    }
    wavesurfer.current.regions.list[1].setLoop(isLoop);
  };

  if (wavesurfer.current != null) {
    wavesurfer.current.on("finish", function () {
      if (isLoop) {
        wavesurfer.current.play();
      }
    });
  }

  const addWindow = () => {
    wavesurfer.current.addPlugin(
      WaveSurfer.regions.create({
        regionsMinLength: 0.5,
        regions: [
          {
            start: 0.5,
            end: 1.5,
            loop: isLoop,
            color: "hsla(400, 100%, 30%, 0.5)",
          },
        ],
        dragSelection: {
          slop: 5,
        },
      })
    );
  };

  const handleDrag = (e, ui) => {
    setDeltaPosition((prevPos) => prevPos + ui.deltaX);
  };

  let transportFastForwardButton;

  transportFastForwardButton = (
    <IconButton onClick={fastForward}>
      <FastForwardIcon />
    </IconButton>
  );

  let transportFastRewindButton;

  transportFastForwardButton = (
    <IconButton onClick={skipBackward}>
      <FastRewindIcon />
    </IconButton>
  );

  function paste(instance, cutSelection) {
    var offlineAudioContext = instance.backend.ac;
    var originalAudioBuffer = instance.backend.buffer;

    let cursorPosition = instance.getCurrentTime();
    var newAudioBuffer = offlineAudioContext.createBuffer(
      originalAudioBuffer.numberOfChannels,
      originalAudioBuffer.length + cutSelection.length,
      originalAudioBuffer.sampleRate
    );

    for (
      var channel = 0;
      channel < originalAudioBuffer.numberOfChannels;
      channel++
    ) {
      var new_channel_data = newAudioBuffer.getChannelData(channel);
      var empty_segment_data = cutSelection.getChannelData(channel);
      var original_channel_data = originalAudioBuffer.getChannelData(channel);

      var before_data = original_channel_data.subarray(
        0,
        cursorPosition * originalAudioBuffer.sampleRate
      );
      var mid_data = empty_segment_data;
      var after_data = original_channel_data.subarray(
        Math.floor(cursorPosition * originalAudioBuffer.sampleRate),
        originalAudioBuffer.length * originalAudioBuffer.sampleRate
      );

      new_channel_data.set(before_data);
      new_channel_data.set(
        mid_data,
        cursorPosition * newAudioBuffer.sampleRate
      );
      new_channel_data.set(
        after_data,
        (cursorPosition + cutSelection.duration) * newAudioBuffer.sampleRate
      );
    }
    return newAudioBuffer;
  }

  function cut() {
    try {
      var selection = wavesurfer.current.regions.list[1];
      let instance = wavesurfer.current;

      var start = selection.start;
      var end = selection.end;

      var originalAudioBuffer = instance.backend.buffer;

      var lengthInSamples = Math.floor(
        (end - start) * originalAudioBuffer.sampleRate
      );
      if (!window.OfflineAudioContext) {
        if (!window.webkitOfflineAudioContext) {
          alert("webkit context not found");
        }
        window.OfflineAudioContext = window.webkitOfflineAudioContext;
      }
      var offlineAudioContext = instance.backend.ac;

      var emptySegment = offlineAudioContext.createBuffer(
        originalAudioBuffer.numberOfChannels,
        lengthInSamples,
        originalAudioBuffer.sampleRate
      );

      var newAudioBuffer = offlineAudioContext.createBuffer(
        originalAudioBuffer.numberOfChannels,
        start === 0
          ? originalAudioBuffer.length - emptySegment.length
          : originalAudioBuffer.length,
        originalAudioBuffer.sampleRate
      );

      for (
        var channel = 0;
        channel < originalAudioBuffer.numberOfChannels;
        channel++
      ) {
        var new_channel_data = newAudioBuffer.getChannelData(channel);
        var empty_segment_data = emptySegment.getChannelData(channel);
        var original_channel_data = originalAudioBuffer.getChannelData(channel);

        var before_data = original_channel_data.subarray(
          0,
          start * originalAudioBuffer.sampleRate
        );
        var mid_data = original_channel_data.subarray(
          start * originalAudioBuffer.sampleRate,
          end * originalAudioBuffer.sampleRate
        );
        var after_data = original_channel_data.subarray(
          Math.floor(end * originalAudioBuffer.sampleRate),
          originalAudioBuffer.length * originalAudioBuffer.sampleRate
        );

        empty_segment_data.set(mid_data.slice());
        if (start > 0) {
          new_channel_data.set(before_data.slice());
          new_channel_data.set(
            after_data.slice(),
            start * newAudioBuffer.sampleRate
          );
        } else {
          new_channel_data.set(after_data.slice());
        }
      }
      // instance.loadDecodedBuffer(newAudioBuffer);
      const newMpeg = bufferToWave(newAudioBuffer, 0, newAudioBuffer.length);
      const _file = new File([newMpeg], "cropped.mp3");
      updateFile(_file);
    } catch (e) {
      console.log(e);
      window.location.reload(true);
    }
  }

  const copy =async ()=> {
    try {
      var region = wavesurfer.current.regions.list[1];
      let instance = wavesurfer.current;
      var segmentDuration = region.end - region.start;
      var originalBuffer = instance.backend.buffer;
      if(!originalBuffer){
        return;
      }
      var emptySegment = instance.backend.ac.createBuffer(
        originalBuffer.numberOfChannels,
        segmentDuration * originalBuffer.sampleRate,
        originalBuffer.sampleRate
      );
      for (var i = 0; i < originalBuffer.numberOfChannels; i++) {
        var chanData = originalBuffer.getChannelData(i);
        var emptySegmentData = emptySegment.getChannelData(i);
        var mid_data = chanData.subarray(
          region.start * originalBuffer.sampleRate,
          region.end * originalBuffer.sampleRate
        );
        emptySegmentData.set(mid_data, 0);
      }
      // instance.loadDecodedBuffer(emptySegment);
      const newMpeg = bufferToWave(emptySegment, 0, emptySegment.length);
      const _file = new File([newMpeg], "audio.mp3");
      updateFile(_file);
    } catch (e) {
      console.log(e);
      window.location.reload(true);
    }
  }

  function bufferToWave(abuffer, offset, len) {
    var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [],
      i,
      sample,
      pos = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // update data chunk
        pos += 2;
      }
      offset++; // next source sample
    }

    // create Blob
    return new Blob([buffer], { type: "audio/mpeg" });

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  const dragStopHandler = () => {
    const data = {
      fileId: fileId,
      offset: deltaPosition,
    };
    updateFileOffsets(data);
  };

  useEffect(() => {
    console.log("initOffset effect", initOffset);
    setDeltaPosition(initOffset);
  }, [initOffset]);

  const updateFile = (file) => {
    fileVersionHandler(index, fileName);
    const formData = new FormData();
    formData.append("file", file);

    formData.append("fileId", fileId);

    formData.append("sessionId", sessionId);

    axios.put(url + "/updateFile", formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
  };

  return (
    <>
      <Draggable
        axis="x"
        bounds={{ left: 0 }}
        onDrag={handleDrag}
        onStop={dragStopHandler}
        position={{ x: deltaPosition, y: 0 }}
      >
        <div style={{ width: `${waveWidth}px`, borderLeft: "5px solid grey", cursor: "grabbing"}} container>
          <Grid item id={wavesurferId} className={classes.scroll + " mt-5"} />
        </div>
      </Draggable>
    </>
  );
}

export default AudioPlayer;
