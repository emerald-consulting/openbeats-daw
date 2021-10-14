package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.Entity.Session;
import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.SessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SessionMgmtService {

    @Autowired
    private SessionRepository sessionRepository;

    public boolean saveSession(String email, String sessionName) {
        List<Session> existingSessions = sessionRepository.findByUserEmail(email);

        if(existingSessions.size() < 3){
            Session sessiontoAdd = new Session();
            sessiontoAdd.setSessionName(sessionName);
            sessiontoAdd.setBucketName(sessionName);
            sessiontoAdd.setUserEmail(email);

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

    public List<Session> getAllUserSessions(String emailId){
        log.info("getting all sessions");
        return sessionRepository.findAllByUserEmail(emailId);
    }
}
