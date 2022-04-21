package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.model.Entity.Messages;
import org.springframework.data.domain.Page;

public interface MessagesService {


    Messages save(Messages message);

    Page<Messages> getMessagesByConversationId(Long conversationId, int pageNo);

    void markAsRead(Long userid,Long conversationId);

    boolean markAsReadById(Long messageId);

    Messages getLastMessage(Long conversationId);
}
