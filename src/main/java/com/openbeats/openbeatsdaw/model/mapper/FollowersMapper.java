package com.openbeats.openbeatsdaw.model.mapper;
import com.openbeats.openbeatsdaw.model.Entity.Followers;
import com.openbeats.openbeatsdaw.model.FollowersDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FollowersMapper {
    @Mapping(target = "followingUserRef.userid", source = "followingUserId")
    @Mapping(target = "followedUserRef.userid", source = "followedUserId")
    Followers followersDTOToMetadata(FollowersDTO followersDTO);
}
