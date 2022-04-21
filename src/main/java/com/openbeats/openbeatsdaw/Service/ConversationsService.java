package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.model.Entity.Conversations;

import java.util.List;

public interface ConversationsService {
	
	public Conversations startConversation(Conversations conversations);

	List<Conversations> getAllConversationsByUserId(Long userid);

	void updateDateByConversationId(Long conversationId);

	Conversations findByUserIds(Long userid, Long userId);
}
