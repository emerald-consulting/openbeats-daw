package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Service.SessionMgmtService;
import com.openbeats.openbeatsdaw.model.ConnectRequest;
import com.openbeats.openbeatsdaw.model.CreateStudioRequest;
import com.openbeats.openbeatsdaw.model.StudioSession;
import com.openbeats.openbeatsdaw.model.StudioSessionResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@AllArgsConstructor
@Slf4j
public class StudioSessionController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    SessionMgmtService sessionMgmtService;

    @PostMapping("/start")
    @ResponseBody
    public ResponseEntity<StudioSession> start(@RequestBody CreateStudioRequest creator) {
        log.info("create session request: {}", creator);
        return ResponseEntity.ok(sessionMgmtService.createStudioSession(creator));
    }

    @PostMapping("/connect")
    @ResponseBody
    public ResponseEntity<StudioSession> connect(@RequestBody ConnectRequest request) throws Exception {
        log.info("connect request: {}", request);
        return ResponseEntity.ok(sessionMgmtService.connectToStudioSession(request.getEmail(), request.getSessionId()));
    }

    @PostMapping("/studioSession")
    public ResponseEntity<StudioSessionResponse> studioSession(@RequestPart(value = "file") String file,
                                                               @RequestParam(value = "sessionId") String sessionId) throws Exception {
        log.info("session info received: {}", sessionId);
        StudioSession studioSession = sessionMgmtService.studioSession(file,sessionId);
        log.info("Studio session {}",studioSession);
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + studioSession.getSessionId(), studioSession);

        StudioSessionResponse studioSessionResponse = new StudioSessionResponse();
        studioSessionResponse.setSessionId(studioSession.getSessionId());
        studioSessionResponse.setSessionName(studioSession.getSessionName());
        studioSessionResponse.setParticipants(studioSession.getParticipants());
        studioSessionResponse.setAudioTracks(studioSession.getAudioTracks());

        return ResponseEntity.ok(studioSessionResponse);
    }

    /*@PostMapping("/addTrack/{sessionId}")
    public ResponseEntity<StudioSession> addTrack(@PathVariable("sessionId") String sessionId) throws Exception {
        log.info("Adding new track to the session: {}", sessionId);
        return ResponseEntity.ok(sessionMgmtService.addTrackToSession(sessionId));
    }*/
}
