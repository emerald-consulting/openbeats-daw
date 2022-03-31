package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.mapper.FollowersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import com.openbeats.openbeatsdaw.Service.FollowersService;
import com.openbeats.openbeatsdaw.model.FollowersDTO;
import com.openbeats.openbeatsdaw.model.Entity.Followers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@RestController
@RequestMapping("/")
public class FollowersController {

	private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);


	@Autowired
	FollowersService followersService;

	@Autowired
	FollowersMapper mapper;

	@Autowired
	private TokenProvider tokenProvider;
	
	@PostMapping("/follow/{userId}")
	@ResponseBody
	public Followers follow(@PathVariable("userId") Long userId, @RequestHeader (name="Authorization") String token )
	{

		Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
		FollowersDTO followersDTO = new FollowersDTO();
		followersDTO.setFollowingUserId(currentUser.get().getUserid());
		followersDTO.setFollowedUserId(userId);
		Followers followers = mapper.followersDTOToMetadata(followersDTO);
		return followersService.follow(followers);
	}

	@PutMapping("/unfollow/{userId}")
	@ResponseBody
	public boolean unfollow(@PathVariable("userId") Long userId, @RequestHeader (name="Authorization") String token )
	{
		Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
		return followersService.unfollow(currentUser.get().getUserid(),userId );
	}

}