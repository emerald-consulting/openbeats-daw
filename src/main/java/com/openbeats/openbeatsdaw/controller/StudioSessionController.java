package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.model.Entity.File;
import com.openbeats.openbeatsdaw.model.Entity.Session;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.Repository.SessionRepository;
import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Service.AudioFileService;
import com.openbeats.openbeatsdaw.Service.CollaboratorMgmtService;
import com.openbeats.openbeatsdaw.Service.SessionMgmtService;
import com.openbeats.openbeatsdaw.Service.UserManagementService;
import com.openbeats.openbeatsdaw.model.*;
import com.openbeats.openbeatsdaw.model.SessionStorage;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    AudioFileService audioFileService;


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
                                                               @RequestParam(value = "owner") String owner,
                                                               @RequestParam(value = "email") String email) throws Exception {
        log.info("session info received: {}", sessionId);
        HttpHeaders responseHeaders = new HttpHeaders();
        //responseHeaders.set("Access-Control-Allow-Origin", "*");
        StudioSession studioSession = sessionMgmtService.studioSession(fileName,file,sessionId,bucketName,owner,email);
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

    @PutMapping("/updateFileOffset")
    public boolean updateFileOffset(@RequestBody UpdateFileOffetRequest request) throws Exception {
        audioFileService.updateAudioFileOffset(request.getFileId(), request.getOffset());

        if(!SessionStorage.getInstance().getStudioSession().containsKey(request.getSessionId())){
            throw new Exception("Session not found");
        }

        log.info("Getting studio session");
        StudioSession studioSession = SessionStorage.getInstance().getStudioSession().get(request.getSessionId());
        List<AudioTrack> audioTracks = studioSession.getAudioTracks();
        audioTracks.forEach(audioTrack -> {
            if(audioTrack.getAudioTrackId() == request.getFileId()){
                audioTrack.setOffset(request.getOffset());
            }
        });


        StudioSession studioSession2 = sessionMgmtService.getStudioSession(request.getSessionId());
        StudioSessionResponse studioSessionResponse = new StudioSessionResponse();
        studioSessionResponse.setSessionId(studioSession.getSessionId());
        studioSessionResponse.setSessionName(studioSession.getSessionName());
        studioSessionResponse.setParticipants(studioSession.getParticipants());
        studioSessionResponse.setAudioTracks(studioSession.getAudioTracks());
        studioSessionResponse.setBucketName(studioSession.getBucketName());
        studioSessionResponse.setNoRefresh(true);
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + request.getSessionId(), studioSessionResponse);
        return true;
    }

    @GetMapping("/getFileOffsets")
    public List<File> getFileOffsets(@RequestParam("sessionId") Long sessionId) throws Exception {
        List<File> files = audioFileService.findAllFilesInSession(sessionId);
        return files;
    }

    @PutMapping("/updateFile")
    public boolean updateFile(@RequestParam(value = "file") MultipartFile file,
                                 @RequestParam(value = "fileId") Long fileId,
                                 @RequestParam(value = "sessionId") String sessionId) throws Exception {
        StudioSession studioSession = SessionStorage.getInstance().getStudioSession().get(sessionId);
        String fileName = awsStorageService.uploadFile(file, studioSession.getBucketName());
        boolean res = audioFileService.updateAudioFileDetails(fileId, fileName);
        List<AudioTrack> audioTracks = studioSession.getAudioTracks();
        audioTracks.forEach(audioTrack -> {
            if(audioTrack.getAudioTrackId() == fileId){
                audioTrack.setFile(fileName);
            }
        });
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + studioSession.getSessionId(), studioSession);
        return res;
    }

    @PutMapping("/undoFileChange")
    public boolean updateFile(@RequestParam(value = "fileId") Long fileId,
                              @RequestParam(value = "prevFileName") String prevFileName,
                              @RequestParam(value = "sessionId") String sessionId) throws Exception {
        StudioSession studioSession = SessionStorage.getInstance().getStudioSession().get(sessionId);
        boolean res = audioFileService.updateAudioFileDetails(fileId, prevFileName);
        List<AudioTrack> audioTracks = studioSession.getAudioTracks();
        audioTracks.forEach(audioTrack -> {
            if(audioTrack.getAudioTrackId() == fileId){
                audioTrack.setFile(prevFileName);
            }
        });
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + studioSession.getSessionId(), studioSession);
        return res;
    }

    @PutMapping("/removeFile")
    public boolean updateFile(@RequestParam(value = "fileName") String fileName,
                              @RequestParam(value = "fileId") Long fileId,
                              @RequestParam(value = "sessionId") String sessionId) throws Exception {
        StudioSession studioSession = SessionStorage.getInstance().getStudioSession().get(sessionId);
        //awsStorageService.deleteFile(studioSession.getBucketName(), fileName);
        List<AudioTrack> audioTracks = studioSession.getAudioTracks();
        int i = 0;
        int j = -1;
        for (AudioTrack audioTrack: audioTracks){
            if(audioTrack.getAudioTrackId() == fileId){
                j = i;
                break;
            }
            i++;
        }
        if(j != -1){
            audioTracks.remove(j);
            audioFileService.deleteByFileId(fileId);
        }
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + studioSession.getSessionId(), studioSession);
        return true;
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
