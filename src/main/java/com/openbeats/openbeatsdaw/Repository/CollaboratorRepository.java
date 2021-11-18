package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.Entity.Collaborators;

import com.openbeats.openbeatsdaw.Entity.Session;
import com.openbeats.openbeatsdaw.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CollaboratorRepository extends JpaRepository<Collaborators,Long> {

    @Query("SELECT count(*) FROM Collaborators c WHERE c.userEmail = ?1")
    public int getCountOfUserSessions(String email);

    @Query("SELECT c.sessionId FROM Collaborators c WHERE c.userEmail = ?1")
    List<Long> findAllSessionsFromEmail(String email);

    @Query("SELECT c.sessionId FROM Collaborators c WHERE c.userEmail = ?1 and c.role= ?2")
    List<Long> findAllSessionsFromEmailAndRole(String email,String role);


    @Query("SELECT c FROM Collaborators c WHERE c.userEmail = ?1 and c.sessionId = ?2")
    List<Collaborators> findByEmailAndSessionId(String email, Long sessionId);

    List<Collaborators> findAllBySessionId(Long sessionId);
}
