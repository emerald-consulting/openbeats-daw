package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import com.openbeats.openbeatsdaw.model.Entity.Messages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversations, Long> {

    @Query("SELECT c FROM Conversations c WHERE c.userId1=:userId OR c.userId2=:userId")
    List<Conversations> getConversationsList(@Param("userId")Long userId);

    @Query("SELECT c FROM Conversations c WHERE (c.userId1=:senderId AND c.userId2=:receiverId) OR (c.userId1=:receiverId AND c.userId2=:senderId)")
    Conversations getConversation(@Param("senderId")Long senderId, @Param("receiverId")Long receiverId);

}
