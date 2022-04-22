package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.ConversationsRepository;
import com.openbeats.openbeatsdaw.Service.ConversationsService;
import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ConversationsServiceImpl implements ConversationsService {

    @Autowired
    private ConversationsRepository conversationsRepository;

    @Override
    public Conversations startConversation(Conversations conversations) {
        conversations.setUpdatedAt(new Date());
        return conversationsRepository.save(conversations);
    }

    @Override
    public List<Conversations> getAllConversationsByUserId(Long userid) {
        return conversationsRepository.getAllConversationsByUserId(userid);
    }

    @Override
    public void updateDateByConversationId(Long conversationId) {
        Optional<Conversations> conversation = conversationsRepository.findById(conversationId);
        if(conversation.isPresent()){
            Conversations cnv = conversation.get();
            cnv.setUpdatedAt(new Date());
            conversationsRepository.save(cnv);
        }
    }

    @Override
    public Conversations findByUserIds(Long userId1, Long userId2) {
        Optional<Conversations> conversation1 = conversationsRepository.findByUserId1AndUserId2(userId1, userId2);
        if(conversation1.isPresent()){
            return conversation1.get();
        }
        Optional<Conversations> conversation2 = conversationsRepository.findByUserId1AndUserId2(userId2, userId1);
        if(conversation2.isPresent()){
            return conversation2.get();
        }
        return null;
    }
}
