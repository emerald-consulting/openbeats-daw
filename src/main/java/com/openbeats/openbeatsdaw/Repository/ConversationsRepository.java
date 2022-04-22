package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface ConversationsRepository extends JpaRepository<Conversations, Long> {

    @Query("SELECT p FROM Conversations p WHERE p.userId1= :userid or p.userId2= :userid order by p.updatedAt desc")
    List<Conversations> getAllConversationsByUserId(Long userid);

    Optional<Conversations> findByUserId1AndUserId2(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
