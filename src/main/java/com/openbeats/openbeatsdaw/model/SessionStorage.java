package com.openbeats.openbeatsdaw.model;

import java.util.HashMap;
import java.util.Map;

public class SessionStorage {

    private static Map<String, StudioSession> studioSessions;
    private static SessionStorage instance;

    private SessionStorage() {
        studioSessions = new HashMap<>();
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

    public void setStudioSession(StudioSession studioSession) {
        studioSessions.put(studioSession.getSessionId(), studioSession);
    }
}
