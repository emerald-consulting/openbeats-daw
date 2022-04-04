package com.openbeats.openbeatsdaw.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
import com.openbeats.openbeatsdaw.Service.PostService;
import com.openbeats.openbeatsdaw.Service.UserService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private TokenProvider tokenProvider;
    
    
    @GetMapping("/getAuthorDetails/{userId}")
    @ResponseBody
    public UserFetchDTO getPosts(@PathVariable("userId") Long userId) {
        return userService.getUserDetails(userId);
    }


    @PostMapping("/profilePicture")
    @ResponseBody
    public User addProfilePicture(@RequestParam(value = "profilePicture") MultipartFile profilePicture, @RequestHeader(name = "Authorization") String token) {
        User currentUser = tokenProvider.getLoggedinUser(token).get();
        User user = userService.uploadOrEditProfilePicture(currentUser.getEmailId(),profilePicture);
        return user;
    }

    @GetMapping("/getProfilePicture")
    @ResponseBody
    public User getProfilePicture(@RequestHeader(name = "Authorization") String token) {
        User currentUser = tokenProvider.getLoggedinUser(token).get();
        User user = userService.getProfilePicture(currentUser.getEmailId());
        return user;
    }

}
