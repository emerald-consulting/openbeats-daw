package com.openbeats.openbeatsdaw.Service.Implementations;
import com.openbeats.openbeatsdaw.Repository.MessagesRepository;
import com.openbeats.openbeatsdaw.Service.MessagesService;
import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import com.openbeats.openbeatsdaw.model.Entity.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MessagesServiceImpl implements MessagesService {

    @Autowired
    private MessagesRepository messagesRepository;

    @Override
    public Messages save(Messages message) {
        return messagesRepository.save(message);
    }

    @Override
    public Page<Messages> getMessagesByConversationId(Long conversationId, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 1000);
        return messagesRepository.getMessagesByConversationId(conversationId,pageable);
    }

    @Override
    public void markAsRead(Long userid, Long conversationId) {
        messagesRepository.markAsRead(userid,conversationId);
    }

    @Override
    public boolean markAsReadById(Long messageId) {
        Optional<Messages> msg = messagesRepository.findById(messageId);
        if(msg.isPresent()){
            msg.get().setIsRead(true);
            messagesRepository.save(msg.get());
            return true;
        }
        return false;
    }

    @Override
    public Messages getLastMessage(Long conversationId) {
        return messagesRepository.findFirstByConversationIdOrderByCreatedAtDesc(conversationId);
    }
}
