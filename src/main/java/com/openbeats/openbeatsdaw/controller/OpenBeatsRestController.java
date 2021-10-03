package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Service.UserManagementService;
import com.openbeats.openbeatsdaw.Utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Object> createUser(@RequestBody User user) {
         log.info("Inside create User method of User Controller");
        try {
            User tempUser= createUser.saveUser(user);
            tempUser.setPassword("");
            return ResponseHandler.generateResponse("User account has been created Sucessfully.", HttpStatus.OK,tempUser);
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS,null);
        }
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
