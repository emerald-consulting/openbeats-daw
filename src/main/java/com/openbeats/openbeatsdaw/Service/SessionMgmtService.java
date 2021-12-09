package com.openbeats.openbeatsdaw.Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.openbeats.openbeatsdaw.Entity.Collaborators;
import com.openbeats.openbeatsdaw.Entity.File;
import com.openbeats.openbeatsdaw.Entity.Session;
import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.SessionRepository;
import com.openbeats.openbeatsdaw.model.AudioTrack;
import com.openbeats.openbeatsdaw.model.CreateStudioRequest;
import com.openbeats.openbeatsdaw.model.SessionStorage;
import com.openbeats.openbeatsdaw.model.StudioSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Slf4j
public class SessionMgmtService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserManagementService userManagementService;

    @Autowired
    private AWSStorageService awsStorageService;

    @Autowired
    private AmazonS3 amazonS3Client;

    @Autowired
    AudioFileService audioFileService;

    @Autowired
    CollaboratorMgmtService collaboratorMgmtService;

    public boolean saveSession(String email, String bucketName,String userSessionName) {
        List<Session> existingSessions = sessionRepository.findByUserEmail(email);

        if(existingSessions.size() < 3){
            Session sessiontoAdd = new Session();
            sessiontoAdd.setSessionName(userSessionName);
            sessiontoAdd.setBucketName(bucketName);
            sessiontoAdd.setUserEmail(email);
//            sessiontoAdd.setJoiningCode(joiningCode);

            sessionRepository.save(sessiontoAdd);
        }else {
            return false;
        }

        return true;
    }

    public boolean saveSession2(String email, String bucketName,String userSessionName,String joiningCode) {
        List<Session> existingSessions = sessionRepository.findByUserEmail(email);

        if(existingSessions.size() < 1000){
            Session sessiontoAdd = new Session();
            sessiontoAdd.setSessionName(userSessionName);
            sessiontoAdd.setBucketName(bucketName);
            sessiontoAdd.setUserEmail(email);
            sessiontoAdd.setJoiningCode(joiningCode);

            sessionRepository.save(sessiontoAdd);
        }else {
            return false;
        }

        return true;
    }

    public Session findSession(String email, String sessionName){
        log.info("finding session");
        log.info(email);
        log.info(sessionName);
        return sessionRepository.findByUserEmailAndBucketName(email,sessionName);
    }

    public boolean deleteSession(Session session){
        log.info("Deleting session");
        sessionRepository.delete(session);
        return true;
    }

    public StudioSession createStudioSessionFromSession(Session s){
        StudioSession studioSession=new StudioSession();
        studioSession.setSessionId(s.getJoiningCode());
        studioSession.setSessionName(s.getSessionName());
        studioSession.setBucketName(s.getBucketName());
        List<File> files= audioFileService.findAllFilesInSession(s.getSessionId());
        List<AudioTrack> audioTracks=new ArrayList<>();
        for(File file : files){
            audioTracks.add(audioFileService.convertFileToAudioTrack(file,s.getJoiningCode()));

        }

        studioSession.setAudioTracks(audioTracks);

        List<Collaborators> collaborators=collaboratorMgmtService.findAllCollaborators(s.getSessionId());
        List<User> users=new ArrayList<>();
        for(Collaborators c : collaborators) {
            Optional<User> userOptional = userManagementService.findUser(c.getUserEmail());
            if (userOptional.isPresent()) {
                users.add(userOptional.get());
            }
        }
        studioSession.setParticipants(users);
        return studioSession;
    }

    public List<StudioSession> getAllUserSessions(String emailId){
        log.info("getting all sessions");

        //make changes here

        List<Long> sessionsIds=collaboratorMgmtService.getAllSessionIdsByEmail(emailId);
        List<Session> sessionList=sessionRepository.findBysessionIdIn(sessionsIds);
        List<StudioSession> studioSessions=new ArrayList<>();
        for(Session s : sessionList){
            StudioSession studioSession=createStudioSessionFromSession(s);
                studioSessions.add(studioSession);
            SessionStorage.getInstance().setStudioSession(studioSession);
        }

        return studioSessions;


//        if(SessionStorage.getInstance().getUserSessions().containsKey(emailId)){
//            return SessionStorage.getInstance().getUserSessions().get(emailId);
//        }
//        return new ArrayList<>();
    }

    // New logic for handling sessions

    public StudioSession createStudioSession(CreateStudioRequest creator) {
        StudioSession studioSession = new StudioSession();
        Random rnd = new Random();
        int number = rnd.nextInt(999999);
        String sessionId = String.format("%06d", number);
        List<User> participants = new ArrayList<>();
        Optional<User> user = userManagementService.findUser(creator.getEmail());
        user.orElseThrow(()-> new UsernameNotFoundException("User does not exist"));

        participants.add(user.get());

        List<AudioTrack> audioTracks = new ArrayList<>();

        studioSession.setSessionId(sessionId);
        studioSession.setParticipants(participants);
        studioSession.setSessionName(creator.getRoomName());
        studioSession.setAudioTracks(audioTracks);

        SessionStorage.getInstance().setStudioSession(studioSession);

        return studioSession;
    }

    public StudioSession connectToStudioSession(String email, String sessionId) throws Exception {
        if (!SessionStorage.getInstance().getStudioSession().containsKey(sessionId)) {

            Session session=sessionRepository.findBySessionJoinCode(sessionId);
            if(session==null){
                throw new Exception("Session with provided id doesn't exist");
            }
            StudioSession studioSession=createStudioSessionFromSession(session);
            SessionStorage.getInstance().setStudioSession(studioSession);
        }

        Optional<User> user = userManagementService.findUser(email);
        user.orElseThrow(()-> new UsernameNotFoundException("User does not exist"));

        StudioSession studioSession = SessionStorage.getInstance().getStudioSession().get(sessionId);
//        if(studioSession==null){
//            //get session from db
//
//        }

        if (studioSession.getParticipants().size() == 0){
            throw new Exception("Session is not valid");
        }

        User tempUser = user.get();

        List<User> tempUsers = new ArrayList<>();
        boolean flag = true;
        for(User user1:studioSession.getParticipants()){
            if (user1.getEmailId().equals(tempUser.getEmailId())){
                flag = false;
                tempUsers.add(tempUser);
                continue;
            }
            tempUsers.add(user1);
        }
        studioSession.setParticipants(tempUsers);
        /*if(flag){
            studioSession.setParticipants(tempUsers);
            // studioSession.getParticipants().add(tempUser);
        }*/
        SessionStorage.getInstance().setStudioSession(studioSession);

        return studioSession;
    }

    public StudioSession studioSession(String fileName,MultipartFile file, String sessionId,String bucketName, String owner) throws Exception {

        if(!SessionStorage.getInstance().getStudioSession().containsKey(sessionId)){
            throw new Exception("Session not found");
        }

        log.info("Getting studio session");
        StudioSession studioSession = SessionStorage.getInstance().getStudioSession().get(sessionId);

        String newFileName = awsStorageService.uploadFile(file,bucketName);
        audioFileService.saveAudioFileDetails(newFileName,"","mp3",sessionId,owner);
        List<AudioTrack> audioTracks = studioSession.getAudioTracks();
        AudioTrack audioTrack = new AudioTrack();
        audioTrack.setSessionId(sessionId);
        audioTrack.setFile(newFileName);
        audioTrack.setOwner(owner);
        audioTracks.add(audioTrack);
        log.info("Storing audio tracks in session");
        SessionStorage.getInstance().setStudioSession(studioSession);

        return studioSession;


    }


    public Session findSessionByjoinCode(String sessionJoinCode){
        log.info("finding session");

        return sessionRepository.findBySessionJoinCode(sessionJoinCode);
    }

    public StudioSession getStudioSession(String sessionId) throws Exception {
        if(!SessionStorage.getInstance().getStudioSession().containsKey(sessionId)){
            throw new Exception("Session not found");
        }
//        StudioSession studioSession=new StudioSession();
        return SessionStorage.getInstance().getStudioSession().get(sessionId);
    }

    /*public ByteArrayOutputStream downloadFile(String keyName) {
        try {
            S3Object s3object = awsStorageService.getObject(new GetObjectRequest(bucketName, keyName));

            InputStream is = s3object.getObjectContent();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            int len;
            byte[] buffer = new byte[4096];
            while ((len = is.read(buffer, 0, buffer.length)) != -1) {
                outputStream.write(buffer, 0, len);
            }

            return outputStream;
        } catch (Exception e) {

        }

        return null;
    }*/


    /*public StudioSession addTrackToSession(String sessionId) throws Exception {
        if(!SessionStorage.getInstance().getStudioSession().containsKey(sessionId)){
            throw new Exception("Session not found");
        }


        log.info("Getting studio session");
        StudioSession studioSession = SessionStorage.getInstance().getStudioSession().get(sessionId);

        List<AudioTrack> audioTracks = studioSession.getAudioTracks();
    }*/
}
