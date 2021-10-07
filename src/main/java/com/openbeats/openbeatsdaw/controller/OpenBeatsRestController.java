package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Service.UserManagementService;
import com.openbeats.openbeatsdaw.Utils.ResponseHandler;
import org.springframework.core.env.Environment;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/")
@Slf4j
public class OpenBeatsRestController {

    @Autowired
    private UserManagementService createUser;

    @Autowired
    private Environment env;

    @PostMapping("/createUser")
    public ResponseEntity<Object> createUser(@RequestBody User user, HttpServletRequest request) {
        log.info("Inside create User method of User Controller");
        try {
            User tempUser= createUser.saveUser(user,getSiteURL(request));
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

    @GetMapping("/verify")
    public RedirectView verifyUser(@Param("code") String code) {
        log.info("Inside user verification Method.");
        if (createUser.verify(code)) {
            log.info("User verified Successfully.");
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl("http://openbeats-frontend.s3-website.us-east-2.amazonaws.com/login");
            return redirectView;

        } else {
            log.info("User verified Unsuccessfully.");
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl("http://openbeats-frontend.s3-website.us-east-2.amazonaws.com");
            return redirectView;

        }
    }

    private String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        log.info(siteURL);
        return siteURL.replace(request.getServletPath(), "");
    }


}