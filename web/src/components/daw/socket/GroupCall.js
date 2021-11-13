import React from 'react';
import {appendScript} from '../../../utils/appendScript'
import adapter from 'webrtc-adapter';
import kurentoUtils from 'kurento-utils'
import { w3cwebsocket as W3CWebSocket } from "websocket";


/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
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

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

/**
 * Creates a video element for a new participant
 *
 * @param {String} name - the name of the new participant, to be used as tag
 *                        name of the video element.
 *                        The tag of the new element will be 'video<name>'
 * @return
 */
function Participant(name) {
    this.name = name;
    var container = document.createElement('div');
    container.className = isPresentMainParticipant() ? PARTICIPANT_CLASS : PARTICIPANT_MAIN_CLASS;
    container.id = name;

    console.log("creating video")
    var span = document.createElement('span');
    var video = document.createElement('video');
    var rtcPeer;

    container.appendChild(video);
    container.appendChild(span);
    container.onclick = switchContainerClass;
    document.getElementById('participants').appendChild(container);

    span.appendChild(document.createTextNode(name));

    video.id = 'video-' + name;
    video.autoplay = true;
    video.controls = false;


    console.log("DONE")

    this.getElement = function() {
        return container;
    }

    this.getVideoElement = function() {
        return video;
    }

    function switchContainerClass() {
        if (container.className === PARTICIPANT_CLASS) {
            var elements = Array.prototype.slice.call(document.getElementsByClassName(PARTICIPANT_MAIN_CLASS));
            elements.forEach(function(item) {
                item.className = PARTICIPANT_CLASS;
            });

            container.className = PARTICIPANT_MAIN_CLASS;
        } else {
            container.className = PARTICIPANT_CLASS;
        }
    }

    function isPresentMainParticipant() {
        return ((document.getElementsByClassName(PARTICIPANT_MAIN_CLASS)).length != 0);
    }

    this.offerToReceiveVideo = function(error, offerSdp, wp){
        if (error) return console.error ("sdp offer error")
        console.log('Invoking SDP offer callback function');
        var msg =  { id : "receiveVideoFrom",
            sender : name,
            sdpOffer : offerSdp
        };
        sendMessage(msg);
    }


    this.onIceCandidate = function (candidate, wp) {
        console.log("Local candidate" + JSON.stringify(candidate));

        var message = {
            id: 'onIceCandidate',
            candidate: candidate,
            name: name
        };
        sendMessage(message);
    }

    Object.defineProperty(this, 'rtcPeer', { writable: true});

    this.dispose = function() {
        console.log('Disposing participant ' + this.name);
        this.rtcPeer.dispose();
        container.parentNode.removeChild(container);
    };
}



var ws = new W3CWebSocket('ws://localhost:8080/groupcall');
ws.onopen = () => {
    console.log('WebSocket Client Connected');
};
var participants = {};
var name;

window.onbeforeunload = function() {
    ws.close();
};

ws.onmessage = function(message) {
    var parsedMessage = JSON.parse(message.data);
    console.info('Received message: ' + message.data);

    switch (parsedMessage.id) {
        case 'existingParticipants':
            onExistingParticipants(parsedMessage);
            break;
        case 'newParticipantArrived':
            onNewParticipant(parsedMessage);
            break;
        case 'participantLeft':
            onParticipantLeft(parsedMessage);
            break;
        case 'receiveVideoAnswer':
            receiveVideoResponse(parsedMessage);
            break;
        case 'iceCandidate':
            participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
                if (error) {
                    console.error("Error adding candidate: " + error);
                    return;
                }
            });
            break;
        default:
            console.error('Unrecognized message', parsedMessage);
    }
}

// function register() {
//     // name = document.getElementById('name').value;
//     name = Math.random();
//     // var room = document.getElementById('roomName').value;
//     var room = "Room 1"
//
//     document.getElementById('room-header').innerText = 'ROOM ' + room;
//     // document.getElementById('join').style.display = 'none';
//     document.getElementById('room').style.display = 'block';
//
//     var message = {
//         id : 'joinRoom',
//         name : name,
//         room : room,
//     }
//     sendMessage(message);
// }

function onNewParticipant(request) {
    receiveVideo(request.name);
}

function receiveVideoResponse(result) {
    participants[result.name].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
        if (error) return console.error (error);
    });
}

function callResponse(message) {
    if (message.response != 'accepted') {
        console.info('Call not accepted by peer. Closing call');
        window.stop();
    } else {
        kurentoUtils.WebRtcPeer.processAnswer(message.sdpAnswer, function (error) {
            if (error) return console.error (error);
        });
    }
}

function onExistingParticipants(msg) {
    var constraints = {
        audio : true,
        video : {
            mandatory : {
                maxWidth : 320,
                maxFrameRate : 15,
                minFrameRate : 15
            }
        }
    };
    console.log(name + " registered in room ");
    var participant = new Participant(name);
    participants[name] = participant;
    var video = participant.getVideoElement();

    var options = {
        localVideo: video,
        mediaConstraints: constraints,
        onicecandidate: participant.onIceCandidate.bind(participant)
    }
    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
        function (error) {
            if(error) {
                return console.error(error);
            }
            this.generateOffer (participant.offerToReceiveVideo.bind(participant));
        });

    msg.data.forEach(receiveVideo);
}

function leaveRoom() {
    sendMessage({
        id : 'leaveRoom'
    });

    for ( var key in participants) {
        participants[key].dispose();
    }
    //
    // document.getElementById('join').style.display = 'block';
    // document.getElementById('room').style.display = 'none';

    ws.close();
}

function receiveVideo(sender) {
    var participant = new Participant(sender);
    participants[sender] = participant;
    var video = participant.getVideoElement();

    var options = {
        remoteVideo: video,
        onicecandidate: participant.onIceCandidate.bind(participant)
    }

    participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
        function (error) {
            if(error) {
                return console.error(error);
            }
            this.generateOffer (participant.offerToReceiveVideo.bind(participant));
        });;
}

function onParticipantLeft(request) {
    console.log('Participant ' + request.name + ' left');
    var participant = participants[request.name];
    participant.dispose();
    delete participants[request.name];
}

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    ws.send(jsonMessage);
}



const GroupCall = ({emailId}) =>{
    function register() {
        // name = document.getElementById('name').value;
        // name = Math.random();
        name = emailId;
        // var room = document.getElementById('roomName').value;
        var room = "Room 1"

        document.getElementById('room-header').innerText = 'ROOM ' + room;
        // document.getElementById('join').style.display = 'none';
        document.getElementById('room').style.display = 'block';

        var message = {
            id : 'joinRoom',
            name : name,
            room : room,
        }
        sendMessage(message);
    }
    // React.useEffect(() => {
    //     register();
    // }, []);
    return(
        <div id="room">
            <h2 id="room-header"></h2>
            <div id="participants"></div>
            <div className="pt-0.5">
            <input type="button" id="button-leave" onMouseUp={()=>register()}
                   value="Register" className="p-5 box mr-1  bg-gr4 hover:bg-gr3" />
            <input type="button" id="button-leave" onMouseUp={()=>leaveRoom()}
                   value="Leave room" className="p-5 box bg-gr4 hover:bg-gr3"/>
            </div>
        </div>
    )
}

export default GroupCall
