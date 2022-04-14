package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Service.UserService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private TokenProvider tokenProvider;

    @GetMapping("/getAuthorDetails/{userId}")
    @ResponseBody
    public UserFetchDTO getAuthorDetails(@PathVariable("userId") Long userId) {
        return userService.getUserDetails(userId);
    }

    @PostMapping("/picture")
    @ResponseBody
    public User addProfilePicture(
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "coverPicture", required = false) MultipartFile coverPicture,
            @RequestHeader(name = "Authorization") String token) {
        User currentUser = tokenProvider.getLoggedinUser(token).get();
        User user = userService.uploadOrEditPicture(currentUser.getEmailId(), profilePicture, coverPicture);
        return user;
    }

    @GetMapping("/getPicture")
    @ResponseBody
    public User getProfilePicture(@RequestHeader(name = "Authorization") String token) {
        User currentUser = tokenProvider.getLoggedinUser(token).get();
        User user = userService.getPicture(currentUser.getEmailId());
        return user;
    }


    @PutMapping("/updateUserProfile")
    @ResponseBody
    public User updateUserProfile(@RequestBody User user) {
        User updatedUser = userService.updateUser(user);
        return updatedUser;
    }


}
