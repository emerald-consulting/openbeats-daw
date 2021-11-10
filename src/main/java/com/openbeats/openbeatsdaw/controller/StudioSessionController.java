package com.openbeats.openbeatsdaw.controller;

import com.amazonaws.services.cloudfront.model.FieldLevelEncryption;
import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Service.SessionMgmtService;
import com.openbeats.openbeatsdaw.model.ConnectRequest;
import com.openbeats.openbeatsdaw.model.CreateStudioRequest;
import com.openbeats.openbeatsdaw.model.StudioSession;
import com.openbeats.openbeatsdaw.model.StudioSessionResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;

@RestController
@RequestMapping("/")
@AllArgsConstructor
@Slf4j
public class StudioSessionController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    SessionMgmtService sessionMgmtService;

    @Autowired
    AWSStorageService awsStorageService;

    //@CrossOrigin(origins = "localhost:3000")
    @PostMapping("/start")
    public ResponseEntity<StudioSession> start(@RequestBody CreateStudioRequest creator) {
        HttpHeaders responseHeaders = new HttpHeaders();
        //responseHeaders.set("Access-Control-Allow-Origin", "*");
        log.info("create session request: {}", creator);
        StudioSession studioSession = sessionMgmtService.createStudioSession(creator);
        String new_bucket_name = System.currentTimeMillis() + studioSession.getSessionId();
        String bucketName = awsStorageService.createBucket(new_bucket_name);
        studioSession.setBucketName(bucketName);

        return ResponseEntity.ok().headers(responseHeaders).body(studioSession);
    }

    @PostMapping("/connect")
    public ResponseEntity<StudioSession> connect(@RequestBody ConnectRequest request) throws Exception {
        log.info("connect request: {}", request);
        HttpHeaders responseHeaders = new HttpHeaders();
        /*responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.set("Access-Control-Allow-Headers","Content-Type,Authorization");
        responseHeaders.set("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");*/
        return ResponseEntity.ok().headers(responseHeaders).body(sessionMgmtService.connectToStudioSession(request.getEmail(), request.getSessionId()));
    }

    //@CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/studioSession")
    public ResponseEntity<StudioSessionResponse> studioSession(@RequestParam(value = "fileName") String fileName,
                                                               //@RequestParam(value = "file") MultipartFile file,
                                                               @RequestParam(value = "bucketName") String bucketName,
                                                               @RequestParam(value = "sessionId") String sessionId) throws Exception {
        log.info("session info received: {}", sessionId);
        HttpHeaders responseHeaders = new HttpHeaders();
        //responseHeaders.set("Access-Control-Allow-Origin", "*");
        StudioSession studioSession = sessionMgmtService.studioSession(fileName,sessionId,bucketName);
        log.info("Studio session {}",studioSession);
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + studioSession.getSessionId(), studioSession);

        StudioSessionResponse studioSessionResponse = new StudioSessionResponse();
        studioSessionResponse.setSessionId(studioSession.getSessionId());
        studioSessionResponse.setSessionName(studioSession.getSessionName());
        studioSessionResponse.setParticipants(studioSession.getParticipants());
        studioSessionResponse.setAudioTracks(studioSession.getAudioTracks());
        studioSessionResponse.setBucketName(studioSession.getBucketName());
        return ResponseEntity.ok().headers(responseHeaders).body(studioSessionResponse);
    }

    //@CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getStudioSession")
    public ResponseEntity<StudioSessionResponse> studioSession(@RequestParam("sessionId") String sessionId) throws Exception {
        log.info("fetching session data of session id: {}", sessionId);
        HttpHeaders responseHeaders = new HttpHeaders();
        //responseHeaders.set("Access-Control-Allow-Origin", "*");
        StudioSession studioSession = sessionMgmtService.getStudioSession(sessionId);

        StudioSessionResponse studioSessionResponse = new StudioSessionResponse();
        studioSessionResponse.setSessionId(studioSession.getSessionId());
        studioSessionResponse.setSessionName(studioSession.getSessionName());
        studioSessionResponse.setParticipants(studioSession.getParticipants());
        studioSessionResponse.setAudioTracks(studioSession.getAudioTracks());
        studioSessionResponse.setBucketName(studioSession.getBucketName());

        return ResponseEntity.ok().headers(responseHeaders).body(studioSessionResponse);
    }

    /*@GetMapping(value = "/download/{filename}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String filename) {
        ByteArrayOutputStream downloadInputStream = sessionMgmtService.downloadFile(filename);

        return ResponseEntity.ok()
                .contentType(contentType(filename))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(downloadInputStream.toByteArray());
    }*/


    /*@PostMapping("/addTrack/{sessionId}")
    public ResponseEntity<StudioSession> addTrack(@PathVariable("sessionId") String sessionId) throws Exception {
        log.info("Adding new track to the session: {}", sessionId);
        return ResponseEntity.ok(sessionMgmtService.addTrackToSession(sessionId));
    }*/
}
