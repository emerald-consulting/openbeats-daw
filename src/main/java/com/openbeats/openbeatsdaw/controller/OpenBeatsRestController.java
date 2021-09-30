package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Service.UserManagementService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/")
@Slf4j
public class OpenBeatsRestController {

    @Autowired
    private UserManagementService createUser;

    @PostMapping("/createUser")
    public String createUser(@RequestBody User user){
        log.info("Inside create User method of User Controller");
         return createUser.saveUser(user);

    }

    @GetMapping("/user")
    public String user() {
        return ("<h1>Welcome User</h1>");
    }

    @GetMapping("/")
    public String home() {
        return ("<h1>Welcome</h1>");
    }


}
