package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Service.PostService;
import com.openbeats.openbeatsdaw.Service.UserService;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/getAuthorDetails/{userId}")
    @ResponseBody
    public UserFetchDTO getPosts(@PathVariable("userId") Long userId) {
        return userService.getUserDetails(userId);
    }
}
