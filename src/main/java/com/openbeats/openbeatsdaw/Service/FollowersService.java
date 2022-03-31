package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.model.Entity.Followers;

public interface FollowersService {
	
	public Followers follow(Followers followers);

    Boolean unfollow(Long followingUserId, Long followedUserId);
}
