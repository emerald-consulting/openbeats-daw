
package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.Entity.Collaborators;
import com.openbeats.openbeatsdaw.Entity.Session;
import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.CollaboratorRepository;
import lombok.extern.slf4j.Slf4j;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CollaboratorMgmtService {
    @Autowired
    CollaboratorRepository collaboratorRepository;

    @Autowired
    SessionMgmtService sessionMgmtService;


    public boolean save(String email,String sessionName,Long sessionId,String role) {

        Collaborators collaborators=new Collaborators();
        collaborators.setRole(role);
        collaborators.setSessionId(sessionId);
        collaborators.setUserEmail(email);
        collaborators.setSessionName(sessionName);

        collaboratorRepository.save(collaborators);

        return true;
    }

    public List<Long> getAllSessionIdsByEmail(String email){
        return  collaboratorRepository.findAllSessionsFromEmail(email);
    }


    public List<Long>  findAllSessionsFromEmailAndRole(String email,String role){
        return  collaboratorRepository.findAllSessionsFromEmailAndRole(email,role);
    }


    public boolean joinSession(String email,String sessionJoinCode,String role){
        Session session=sessionMgmtService.findSessionByjoinCode(sessionJoinCode);
        if(null==session) return false;
        List<Collaborators> allCollaborators=collaboratorRepository.findByEmailAndSessionId(email,session.getSessionId());
        if(allCollaborators.isEmpty()){
            save(email, session.getSessionName(),session.getSessionId(),role);
        }
        return true;

    }


    public List<Collaborators> findAllCollaborators(Long sessionId) {
        return collaboratorRepository.findAllBySessionId(sessionId);
    }
}
