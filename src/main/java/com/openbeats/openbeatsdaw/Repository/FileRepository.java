package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.Entity.Collaborators;
import com.openbeats.openbeatsdaw.Entity.File;
import com.openbeats.openbeatsdaw.Entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FileRepository extends JpaRepository<File,Long> {

    List<File> findBysessionId(Long sessionId);

    @Transactional
    @Modifying
    @Query("UPDATE File f SET f.artist_name = ?2 where f.userEmail = ?1")
    void updateArtistName(String email,String name);

}
