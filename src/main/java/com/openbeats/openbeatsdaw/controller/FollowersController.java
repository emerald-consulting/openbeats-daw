package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.mapper.FollowersMapper;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import com.openbeats.openbeatsdaw.Repository.FollowersRepository;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
import com.openbeats.openbeatsdaw.Service.FollowersService;
import com.openbeats.openbeatsdaw.model.FollowersDTO;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
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
	private FollowersRepository followersRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	FollowersMapper mapper;

	@Autowired
	private TokenProvider tokenProvider;

	@GetMapping("/followers/{userId}")
	public Boolean isFollowing(@PathVariable("userId") Long userId, @RequestHeader(name = "Authorization") String token){
		Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
		Followers follower = followersRepository.findByFollowingUserIdAndFollowedUserId(currentUser.get().getUserid(),userId);
		System.out.println("******************************************** "+follower);
		if(follower!=null)return true;
		return false;
	}


	@PostMapping("/follow/{userId}")
	@ResponseBody
	public Followers follow(@PathVariable("userId") Long userId, @RequestHeader(name = "Authorization") String token) {
		Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
		User followingUser = currentUser.get();
		UserFetchDTO followedUser = userRepository.getUserDetailsByUserId(userId);
		FollowersDTO followersDTO = new FollowersDTO();
		followersDTO.setFollowingUserId(followingUser.getUserid());
		followersDTO.setFollowedUserId(userId);
		followingUser.setTotalFollowing(followingUser.getTotalFollowing()!=null? (followingUser.getTotalFollowing()+ 1):1); 
		followedUser.setTotalFollowers(followedUser.getTotalFollowers()!=null? (followedUser.getTotalFollowers()+ 1):1); 
		userRepository.save(followingUser);
		User followedUserEntity = new User();
		BeanUtils.copyProperties(followedUser, followedUserEntity);
		userRepository.save(followedUserEntity);
		Followers followers = mapper.followersDTOToMetadata(followersDTO);
		return followersService.follow(followers);
	}

	@PutMapping("/unfollow/{userId}")
	@ResponseBody
	public boolean unfollow(@PathVariable("userId") Long userId, @RequestHeader(name = "Authorization") String token) {
		Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
		User user = currentUser.get();
		user.setTotalFollowing(user.getTotalFollowing()- 1); 
		UserFetchDTO followedUser = userRepository.getUserDetailsByUserId(userId);
		followedUser.setTotalFollowers(followedUser.getTotalFollowers()-1); 
		User followedUserEntity = new User();
		BeanUtils.copyProperties(followedUser, followedUserEntity);
		userRepository.save(followedUserEntity);
		userRepository.save(user);
		return followersService.unfollow(currentUser.get().getUserid(), userId);
	}

}