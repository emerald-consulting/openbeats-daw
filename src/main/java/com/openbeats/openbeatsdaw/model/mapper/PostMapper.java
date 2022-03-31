package com.openbeats.openbeatsdaw.model.mapper;

import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.PostDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "userRef.userid", source = "userId")
    Post postDTOToMetadata(PostDTO postDTO);
}
