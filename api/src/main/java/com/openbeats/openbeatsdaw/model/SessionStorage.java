package com.openbeats.openbeatsdaw.model;

import com.openbeats.openbeatsdaw.Entity.User;

import java.util.*;

public class SessionStorage {

    private static Map<String, StudioSession> studioSessions;
    private static Map<String, List<StudioSession>> userSessions;
    private static SessionStorage instance;

    private SessionStorage() {
        studioSessions = new HashMap<>();
        userSessions = new HashMap<>();
    }

    public static synchronized SessionStorage getInstance() {
        if (instance == null) {
            instance = new SessionStorage();
        }
        return instance;
    }

    public Map<String, StudioSession> getStudioSession() {
        return studioSessions;
    }

    public Map<String, List<StudioSession>> getUserSessions(){
        if(userSessions.isEmpty()){
            return new HashMap<>();
        }
        return userSessions;
    }

    public void setStudioSession(StudioSession studioSession) {
        studioSessions.put(studioSession.getSessionId(), studioSession);

        // user session mapping
        List<User> users = studioSession.getParticipants();
        for(User u: users){
            if(!userSessions.containsKey(u.getEmailId())){
                List<StudioSession> sessionList = new ArrayList<>();
                sessionList.add(studioSession);
                userSessions.put(u.getEmailId(),sessionList);
            }else {
                List<StudioSession> sessionList = userSessions.get(u.getEmailId());
                Set<StudioSession> removeDuplicates = new HashSet<StudioSession>(sessionList);
                removeDuplicates.add(studioSession);
                List<StudioSession> newSessionList = new ArrayList<>(removeDuplicates);
                userSessions.put(u.getEmailId(),newSessionList);
            }
        }
    }
}
