package com.openbeats.openbeatsdaw.model.mapper;
import com.openbeats.openbeatsdaw.model.Entity.Conversations;

import com.openbeats.openbeatsdaw.model.ConversationsDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConversationsMapper {
    @Mapping(target = "userRef1.userid", source = "userId1")
    @Mapping(target = "userRef2.userid", source = "userId2")
    Conversations conversationsDTOToMetadata(ConversationsDTO conversationsDTO);
}
