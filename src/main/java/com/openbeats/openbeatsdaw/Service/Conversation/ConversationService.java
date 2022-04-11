package com.openbeats.openbeatsdaw.Service.Conversation;

import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface ConversationService {

    public Conversations addConversation(Conversations conversations);

    public Conversations getConversation(Long senderId,  Long receiverId);

    public List<Conversations> getConversationsList(Long userId);



}

