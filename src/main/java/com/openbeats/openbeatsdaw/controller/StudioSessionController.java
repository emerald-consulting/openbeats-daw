package com.openbeats.openbeatsdaw.controller;

import com.amazonaws.services.cloudfront.model.FieldLevelEncryption;
import com.openbeats.openbeatsdaw.Entity.Collaborators;
import com.openbeats.openbeatsdaw.Entity.Session;
import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.SessionRepository;
import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Service.CollaboratorMgmtService;
import com.openbeats.openbeatsdaw.Service.SessionMgmtService;
import com.openbeats.openbeatsdaw.Service.UserManagementService;
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
import java.util.List;
import java.util.Optional;

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

    @Autowired
    CollaboratorMgmtService collaboratorMgmtService;

    @Autowired
    UserManagementService userManagementService;

    @Autowired
    SessionRepository sessionRepository;


    public boolean checkIfUserIsEligibleToCreateSession(String email){
        Optional<User> userOptional = userManagementService.findUser(email);
        User user;
        if (userOptional.isPresent()) {
            user=userOptional.get();
            if("free".equalsIgnoreCase(user.getSubscriptionType())){
                List<Long> sessionIds=collaboratorMgmtService.findAllSessionsFromEmailAndRole(email,"OWNER");
                if(sessionIds.size()>=3){
                    return false;
                }
            }

        }



        return true;
    }


    public boolean checkIfUserIsEligibleToJoinSession(String email,String joinCode){
        Optional<User> userOptional = userManagementService.findUser(email);
        User user;
        if (userOptional.isPresent()) {
            user=userOptional.get();


            if("free".equalsIgnoreCase(user.getSubscriptionType())){
                List<Long> sessionIds=collaboratorMgmtService.findAllSessionsFromEmailAndRole(email,"USER");
                List<Session> sessionList=sessionRepository.findBysessionIdIn(sessionIds);
                for(Session session: sessionList){
                    if(joinCode.equalsIgnoreCase(session.getJoiningCode())){
                        return true;
                    }
                }

                if(sessionIds.size()>=3){

                    return false;
                }
            }

        }



        return true;
    }

    //@CrossOrigin(origins = "localhost:3000")
    @PostMapping("/start")
    public ResponseEntity<StudioSession> start(@RequestBody CreateStudioRequest creator) {
        HttpHeaders responseHeaders = new HttpHeaders();
        //responseHeaders.set("Access-Control-Allow-Origin", "*");
        log.info("create session request: {}", creator);
        if(!checkIfUserIsEligibleToCreateSession(creator.getEmail())){
            return ResponseEntity.accepted().headers(responseHeaders).body(new StudioSession());
        }
        StudioSession studioSession = sessionMgmtService.createStudioSession(creator);
        String new_bucket_name = System.currentTimeMillis() + studioSession.getSessionId();
        String bucketName = awsStorageService.createBucket(new_bucket_name);
        studioSession.setBucketName(bucketName);
        sessionMgmtService.saveSession2(creator.getEmail(),bucketName,creator.getRoomName(),studioSession.getSessionId());
        collaboratorMgmtService.joinSession(creator.getEmail(),studioSession.getSessionId(),"OWNER");
        return ResponseEntity.ok().headers(responseHeaders).body(studioSession);
    }
    //accepted ==202
    @PostMapping("/connect")
    public ResponseEntity<StudioSession> connect(@RequestBody ConnectRequest request) throws Exception {
        log.info("connect request: {}", request);
        HttpHeaders responseHeaders = new HttpHeaders();
        if(!checkIfUserIsEligibleToJoinSession(request.getEmail(),request.getSessionId())){
            return ResponseEntity.accepted().headers(responseHeaders).body(new StudioSession());
        }
        /*responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.set("Access-Control-Allow-Headers","Content-Type,Authorization");
        responseHeaders.set("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");*/
        collaboratorMgmtService.joinSession(request.getEmail(), request.getSessionId(),"USER");
        //StudioSession  = sessionMgmtService.getStudioSession(request.getSessionId());
        StudioSession studioSession = sessionMgmtService.connectToStudioSession(request.getEmail(), request.getSessionId());
        //log.info("Studio session partidipants {}",studioSession.getParticipants().size());
        //log.info("Studio session partidipants {}",studioSession.getParticipants());
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + request.getSessionId(),studioSession);
        return ResponseEntity.ok().headers(responseHeaders).body(studioSession);
    }

    //@CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/studioSession")
    public ResponseEntity<StudioSessionResponse> studioSession(@RequestParam(value = "fileName") String fileName,
                                                               @RequestParam(value = "file") MultipartFile file,
                                                               @RequestParam(value = "bucketName") String bucketName,
                                                               @RequestParam(value = "sessionId") String sessionId,
                                                               @RequestParam(value = "owner") String owner) throws Exception {
        log.info("session info received: {}", sessionId);
        HttpHeaders responseHeaders = new HttpHeaders();
        //responseHeaders.set("Access-Control-Allow-Origin", "*");
        StudioSession studioSession = sessionMgmtService.studioSession(fileName,file,sessionId,bucketName,owner);
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
