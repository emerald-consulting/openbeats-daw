package com.openbeats.openbeatsdaw.model.mapper;
import com.openbeats.openbeatsdaw.model.Entity.Messages;
import com.openbeats.openbeatsdaw.model.MessageDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MessagesMapper {
    @Mapping(target = "conversationRef.conversationId", source = "conversationId")
    @Mapping(target = "userRef.userid", source = "senderId")
    Messages messagesDTOToMetadata(MessageDTO messageDTO);

}
