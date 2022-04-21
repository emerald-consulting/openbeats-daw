package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.model.Entity.Messages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MessagesRepository extends JpaRepository<Messages, Long> {

    @Query("SELECT p FROM Messages p WHERE p.conversationId= :conversationId order by p.createdAt desc")
    Page<Messages> getMessagesByConversationId(Long conversationId, Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Messages set isRead = 1 WHERE conversationId= :conversationId and isRead= 0 and senderId != :userid")
    void markAsRead(Long userid, Long conversationId);

    Messages findFirstByConversationIdOrderByCreatedAtDesc(@Param("conversationId") Long conversationId);
}
