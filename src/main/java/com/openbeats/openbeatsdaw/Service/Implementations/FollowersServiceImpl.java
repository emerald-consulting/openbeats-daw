package com.openbeats.openbeatsdaw.Service.Implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openbeats.openbeatsdaw.Repository.FollowersRepository;
import com.openbeats.openbeatsdaw.Service.FollowersService;
import com.openbeats.openbeatsdaw.model.Entity.Followers;

@Service
public class FollowersServiceImpl implements FollowersService {
	
	@Autowired
	private FollowersRepository followersRepository;

	@Override
	public Followers follow(Followers followers) {
		return followersRepository.save(followers);
	}

	@Override
	public Boolean unfollow(Long followingUserId, Long followedUserId) {
		Followers followers = followersRepository.findByFollowingUserIdAndFollowedUserId(followingUserId, followedUserId);
		followersRepository.deleteById(followers.getId());
		return true;
	}

}
