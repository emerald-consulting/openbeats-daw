package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.ConversationRepository;
import com.openbeats.openbeatsdaw.Service.Conversation.ConversationService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.common.Constants;
import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ConversationServiceImpl implements ConversationService {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    @Autowired
    private ConversationRepository chatRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Override
    public List<Conversations> getConversationsList(Long userId) {
        List<Conversations> posts = chatRepository.getConversationsList(userId);
        return posts;
    }

    @Override
    public Conversations addConversation(Conversations conversations) {
        return chatRepository.saveAndFlush(conversations);
    }

    @Override
    public Conversations getConversation(Long senderId, Long receiverId) {
        return chatRepository.getConversation(senderId,receiverId);
    }
}
