package com.openbeats.openbeatsdaw.controller;

import com.amazonaws.services.cognitoidp.model.UsernameExistsException;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
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

    @Autowired
    UserRepository userRepository;

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

    @GetMapping("/getPicture/{emailId}")
    @ResponseBody
    public User getProfilePicture(@PathVariable("emailId") String emailId,
            @RequestHeader(name = "Authorization") String token) {
        User currentUser = tokenProvider.getLoggedinUser(token).get();
        // User user = userService.getPicture(currentUser.getEmailId());
        User user = userService.getPicture(emailId);
        return user;
    }

    @PutMapping("/updateUserProfile")
    @ResponseBody
    public User updateUserProfile(@RequestBody User user) throws UsernameExistsException {
        User updatedUser = userService.updateUser(user);
        Long count = userRepository.countByUsername(user.getUsername());
        if(count==1){
        
        return updatedUser;
        }
        else{
            throw new UsernameExistsException("User already exists");
        }
    }

}
