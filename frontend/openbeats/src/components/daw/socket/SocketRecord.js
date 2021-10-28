import React from 'react';
import {appendScript} from '../../../utils/appendScript'
import adapter from 'webrtc-adapter';
import kurentoUtils from 'kurento-utils'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import $ from 'jquery'

/*
 * (C) Copyright 2014-2016 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var ws = new WebSocket('ws://localhost:8080/recording');
var videoInput;
var videoOutput;
var webRtcPeer;
var state;

const NO_CALL = 0;
const IN_CALL = 1;
const POST_CALL = 2;
const DISABLED = 3;
const IN_PLAY = 4;

window.onload = function() {
    // console = new Console();
    console.log('Page loaded ...');
    videoInput = document.getElementById('videoInput');
    videoOutput = document.getElementById('videoOutput');
    setState(NO_CALL);
}

window.onbeforeunload = function() {
    ws.close();
}

function setState(nextState) {
    switch (nextState) {
        case NO_CALL:
            $('#start').attr('disabled', false);
            $('#stop').attr('disabled', true);
            $('#play').attr('disabled', true);
            break;
        case DISABLED:
            $('#start').attr('disabled', true);
            $('#stop').attr('disabled', true);
            $('#play').attr('disabled', true);
            break;
        case IN_CALL:
            $('#start').attr('disabled', true);
            $('#stop').attr('disabled', false);
            $('#play').attr('disabled', true);
            break;
        case POST_CALL:
            $('#start').attr('disabled', false);
            $('#stop').attr('disabled', true);
            $('#play').attr('disabled', false);
            break;
        case IN_PLAY:
            $('#start').attr('disabled', true);
            $('#stop').attr('disabled', false);
            $('#play').attr('disabled', true);
            break;
        default:
            onError('Unknown state ' + nextState);
            return;
    }
    state = nextState;
}

ws.onmessage = function(message) {
    var parsedMessage = JSON.parse(message.data);
    // console.info('Received message: ' + message.data);

    switch (parsedMessage.id) {
        case 'startResponse':
            startResponse(parsedMessage);
            break;
        case 'playResponse':
            playResponse(parsedMessage);
            break;
        case 'playEnd':
            playEnd();
            break;
        case 'error':
            setState(NO_CALL);
            onError('Error message from server: ' + parsedMessage.message);
            break;
        case 'iceCandidate':
            webRtcPeer.addIceCandidate(parsedMessage.candidate, function(error) {
                if (error)
                    return console.log('Error adding candidate: ' + error);
            });
            break;
        case 'stopped':
            break;
        case 'paused':
            break;
        case 'recording':
            break;
        default:
            setState(NO_CALL);
            onError('Unrecognized message', parsedMessage);
    }
}

function start() {
    console.log('Starting video call ...');

    // Disable start button
    setState(DISABLED);
    // showSpinner(videoInput, videoOutput);
    console.log('Creating WebRtcPeer and generating local sdp offer ...');

    var options = {
        localVideo : videoInput,
        remoteVideo : videoOutput,
        mediaConstraints : getConstraints(),
        onicecandidate : onIceCandidate
    }

    webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
        function(error) {
            if (error)
                return console.log(error);
            webRtcPeer.generateOffer(onOffer);
        });
}

function onOffer(error, offerSdp) {
    if (error)
        return console.log('Error generating the offer');
    // console.info('Invoking SDP offer callback function ' + location.host);
    var message = {
        id : 'start',
        sdpOffer : offerSdp,
        mode :  $('input[name="mode"]:checked').val()
    }
    sendMessage(message);
}

function onError(error) {
    console.log(error);
}

function onIceCandidate(candidate) {
    console.log('Local candidate' + JSON.stringify(candidate));

    var message = {
        id : 'onIceCandidate',
        candidate : candidate
    };
    sendMessage(message);
}

function startResponse(message) {
    setState(IN_CALL);
    console.log('SDP answer received from server. Processing ...');

    webRtcPeer.processAnswer(message.sdpAnswer, function(error) {
        if (error)
            return console.log(error);
    });
}

function stop() {
    var stopMessageId = (state == IN_CALL) ? 'stop' : 'stopPlay';
    console.log('Stopping video while in ' + state + '...');
    setState(POST_CALL);
    if (webRtcPeer) {
        webRtcPeer.dispose();
        webRtcPeer = null;

        var message = {
            id : stopMessageId
        }
        sendMessage(message);
    }
    // hideSpinner(videoInput, videoOutput);
}

function play() {
    console.log("Starting to play recorded video...");

    // Disable start button
    setState(DISABLED);
    // showSpinner(videoOutput);

    console.log('Creating WebRtcPeer and generating local sdp offer ...');

    var options = {
        remoteVideo : videoOutput,
        mediaConstraints : getConstraints(),
        onicecandidate : onIceCandidate
    }

    webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
        function(error) {
            if (error)
                return console.log(error);
            webRtcPeer.generateOffer(onPlayOffer);
        });
}

function onPlayOffer(error, offerSdp) {
    if (error)
        return console.log('Error generating the offer');
    // console.info('Invoking SDP offer callback function ' + location.host);
    var message = {
        id : 'play',
        sdpOffer : offerSdp
    }
    sendMessage(message);
}

function getConstraints() {
    var mode = $('input[name="mode"]:checked').val();
    var constraints = {
        audio : true,
        video : true
    }

    if (mode == 'video-only') {
        constraints.audio = false;
    } else if (mode == 'audio-only') {
        constraints.video = false;
    }

    return constraints;
}


function playResponse(message) {
    setState(IN_PLAY);
    webRtcPeer.processAnswer(message.sdpAnswer, function(error) {
        if (error)
            return console.log(error);
    });
}

function playEnd() {
    setState(POST_CALL);
    // hideSpinner(videoInput, videoOutput);
}

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    ws.send(jsonMessage);
}

// function showSpinner() {
//     for (var i = 0; i < arguments.length; i++) {
//         arguments[i].poster = './img/transparent-1px.png';
//         arguments[i].style.background = "center transparent url('./img/spinner.gif') no-repeat";
//     }
// }
//
// function hideSpinner() {
//     for (var i = 0; i < arguments.length; i++) {
//         arguments[i].src = '';
//         arguments[i].poster = './img/webrtc.png';
//         arguments[i].style.background = '';
//     }
// }
/**
 * Lightbox utility (to display media pipeline image in a modal dialog)
 */
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});

const SocketRecord = () =>{
    return(
        <div className="container">
            <div className="row" style={{display: 'none'}}>
                <div className="col-md-12" >
                    <input type="radio" name="mode" value="video-and-audio"/> Video and audio
                    <input type="radio" name="mode" value="video-only" /> Video only
                    <input type="radio" name="mode" value="audio-only" checked="checked" /> Audio only
                </div>
            </div>
            <div className="row">
                <div className="col-md-5" style={{display: 'none'}}>
                    <h3>Local stream</h3>
                    <video id="videoInput" autoPlay width="480px" height="360px"
                           poster="img/webrtc.png"></video>
                </div>
                <div className=" flex flex-row">
                    <div className="p-5 ml-0.5 bg-gr2 rounded-full  text-xl hover:bg-gr3">
                        <a id="start" href="#" className="btn btn-success"
                           onClick={()=>start()}><span
                            className="glyphicon glyphicon-play"></span> Start Recording</a>
                    </div>
                    <div className="p-5 ml-0.5 bg-gr2 rounded-full text-xl  hover:bg-gr3">
                        <a
                        id="stop" href="#" className="btn btn-danger"
                        onClick={()=>stop()}><span
                        className="glyphicon glyphicon-stop"></span> Stop Recording</a>
                    </div>
                    <div className="p-5 ml-0.5 bg-gr2 rounded-full text-xl hover:bg-gr3">
                        <a
                        id="play" href="#" className="btn btn-warning"
                        onClick={()=>play()}><span
                        className="glyphicon glyphicon-play-circle"></span> Play</a>
                    </div>
                </div>
                <div className="col-md-5" style={{display: 'none'}}>
                    <h3>Remote stream</h3>
                    <video id="videoOutput" autoPlay width="480px" height="360px"
                           poster="img/webrtc.png"></video>
                </div>
            </div>
            <div className="row" style={{display: 'none'}}>
                <div className="col-md-12">
                    <label className="control-label" htmlFor="console">Console</label><br />
                    <br />
                        <div id="console" className="democonsole">
                            <ul></ul>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default SocketRecord
