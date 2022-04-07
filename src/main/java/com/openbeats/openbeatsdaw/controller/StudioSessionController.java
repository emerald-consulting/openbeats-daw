package com.openbeats.openbeatsdaw.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openbeats.openbeatsdaw.Repository.SessionRepository;
import com.openbeats.openbeatsdaw.Service.*;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.*;
import com.openbeats.openbeatsdaw.model.Entity.File;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.Session;
import com.openbeats.openbeatsdaw.model.Entity.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.IOException;
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
    private TokenProvider tokenProvider;

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
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + request.getSessionId(), studioSession2);
        return true;
    }

    @GetMapping("/getFileOffsets")
    public List<File> getFileOffsets(@RequestParam("sessionId") Long sessionId) throws Exception {
        List<File> files = audioFileService.findAllFilesInSession(sessionId);
        return files;
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

//    @PostMapping("/midiUpload")
//    @ResponseBody
//    public Post addPost(@RequestPart("url") String url,
//                        @RequestHeader (name="Authorization") String token ) throws IOException {
//
////        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
//        AudioInputStream stream = AudioSystem.getAudioInputStream(inFile);
//        AudioSystem.write(stream, AudioFileFormat.Type.WAVE, new File("sound.wav"));
//        stream.close();
//    }

    @PostMapping("/midiUpload")
    @ResponseBody
    public boolean addmidi(@RequestParam(value = "track", required = true) MultipartFile track,
                        @RequestHeader (name="Authorization") String token ) throws IOException, UnsupportedAudioFileException {

        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        AudioInputStream stream = AudioSystem.getAudioInputStream((java.io.File) track);
        AudioSystem.write(stream, AudioFileFormat.Type.WAVE, new java.io.File("sound.wav"));
        stream.close();
        return true;

//        PostDTO postDTO = mapper.readValue(json, PostDTO.class);
//        postDTO.setUserId(currentUser.get().getUserid());
//        Post post = postMapper.postDTOToMetadata(postDTO);
//        return postService.addPost(post, track, picture);
    }
}
