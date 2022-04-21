package com.openbeats.openbeatsdaw.model.mapper;
import com.openbeats.openbeatsdaw.model.ConversationDTO;
import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConversationMapper {
    @Mapping(target = "userRef1.userid", source = "userId1")
    @Mapping(target = "userRef2.userid", source = "userId2")
    Conversations conversationDTOToMetadata(ConversationDTO conversationDTO);
}
