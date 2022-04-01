package com.openbeats.openbeatsdaw.model.mapper;

import com.openbeats.openbeatsdaw.model.Entity.Reactions;
import com.openbeats.openbeatsdaw.model.ReactionsDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReactionsMapper {
    @Mapping(target = "postRef.postId", source = "postId")
    @Mapping(target = "userRef.userid", source = "userId")
    Reactions reactionsDTOToMetadata(ReactionsDTO reactionsDTO);

}
