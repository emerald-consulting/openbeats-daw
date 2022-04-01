package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.model.Entity.Reactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReactionsRepository extends JpaRepository<Reactions,Long> {

    public Optional<Reactions> findByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);

}
