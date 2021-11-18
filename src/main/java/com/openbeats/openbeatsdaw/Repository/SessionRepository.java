package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.Entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session,Long> {

    List<Session> findByUserEmail(String email);

    @Query("SELECT s FROM Session s WHERE s.userEmail = ?1 and s.bucketName = ?2")
    Session findByUserEmailAndBucketName(String email, String bucketName);


    @Query("SELECT s FROM Session s WHERE s.joiningCode = ?1")
    Session findBySessionJoinCode(String sessionJoinCode);


    List<Session> findAllByUserEmail(String email);

    List<Session> findBysessionIdIn(List<Long> sessionIdList);

    @Override
    void delete(Session entity);
}
