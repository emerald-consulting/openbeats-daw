package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Entity.Session;
import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Service.SessionMgmtService;
import com.openbeats.openbeatsdaw.Service.UserManagementService;
import com.openbeats.openbeatsdaw.Utils.LoginRequest;
import com.openbeats.openbeatsdaw.Utils.ResponseHandler;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.StudioSession;
import org.springframework.core.env.Environment;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/")
@Slf4j
public class OpenBeatsRestController {


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserManagementService createUser;

    @Autowired
    private Environment env;


    @Autowired
    private TokenProvider tokenProvider;


    @Autowired
    AWSStorageService service;

    @Autowired
    SessionMgmtService sessionMgmtService;

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

    @GetMapping("/userlogin")
    public ResponseEntity<Object> login(){
        log.info("Received login request");

        return ResponseHandler.generateResponse("Login success", HttpStatus.OK,true);

    }

    @GetMapping("/getUserDetails")
    public ResponseEntity<Object> userDetails(@RequestParam String emailId){
        UserDetails userDetails = createUser.loadUserByUsername(emailId);
        if(userDetails == null){
            return ResponseHandler.generateResponse("success", HttpStatus.MULTI_STATUS,userDetails);
        }
        return ResponseHandler.generateResponse("success", HttpStatus.OK,userDetails);
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
            redirectView.setUrl("http://openbeats-frontend.s3-website.us-east-2.amazonaws.com/confirmation");
            return redirectView;

        } else {
            log.info("User verified Unsuccessfully.");
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl("http://openbeats-frontend.s3-website.us-east-2.amazonaws.com");
            return redirectView;

        }
    }

    @RequestMapping("/spotifyOauth")
    @ResponseBody
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
//        Object p1=SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();
        return principal.getAttributes();
    }


    @PostMapping("/callOuath")
    public String callOauth()
    {

        log.info("Inside call outh");
        return "Success";
    }

    @RequestMapping(value = "/spotifyOauth1", method = RequestMethod.GET)
    @ResponseBody
    public Authentication currentUserName(Authentication authentication) {
        return authentication;
    }

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadFile(@RequestParam(value = "file") MultipartFile file,
                                             @RequestParam(value = "bucket")String bucket_name){
        return ResponseHandler.generateResponse("success", HttpStatus.OK,service.uploadFile(file,bucket_name));
    }

    @PostMapping("/createWorkspace")
    public ResponseEntity<Object> createBucket(@RequestParam(value = "sessionName")String sessionName,
                                               @RequestParam(value = "email") String email) throws Exception {
        if(email.equals("undefined") || !email.contains("@")){
            return ResponseHandler.generateResponse("Email id is not valid", HttpStatus.BAD_REQUEST,false);
        }
        String new_bucket_name = System.currentTimeMillis() + sessionName;
        boolean isSuccess = sessionMgmtService.saveSession(email,new_bucket_name,sessionName);
        if(!isSuccess){
            return ResponseHandler.generateResponse("failed to create session", HttpStatus.EXPECTATION_FAILED,isSuccess);
        }
        return ResponseHandler.generateResponse("success", HttpStatus.OK,service.createBucket(new_bucket_name));
    }

    @PostMapping("/deleteWorkspace")
    public ResponseEntity<Object> deleteBucket(@RequestParam(value = "sessionName")String sessionName,
                                               @RequestParam(value = "email") String email){
        Session sessionToDelete = sessionMgmtService.findSession(email,sessionName);

        if( sessionToDelete == null){
            return ResponseHandler.generateResponse("Unable to find and delete session info", HttpStatus.EXPECTATION_FAILED,false);
        }
        //log.debug("Session found",sessionToDelete.getSessionName());
        /*if(sessionToDelete.isEmpty()){
            log.info("No session found");
            return ResponseHandler.generateResponse("Unable to find and delete session info", HttpStatus.EXPECTATION_FAILED,false);
        }else{*/
        //Session temp = sessionToDelete.get();
        boolean isSuccess = sessionMgmtService.deleteSession(sessionToDelete);
        if(!isSuccess){
            log.info("Could not delete");
            return ResponseHandler.generateResponse("Unable to find and delete session info", HttpStatus.EXPECTATION_FAILED,false);
        }


        return ResponseHandler.generateResponse("success", HttpStatus.OK,service.deleteBucket(sessionName));
    }

    @GetMapping("/getSessionDetails")
    public ResponseEntity<Object> getSessionList(@RequestParam String emailId){
        List<StudioSession> sessionList = sessionMgmtService.getAllUserSessions(emailId);
        return ResponseHandler.generateResponse("success", HttpStatus.OK,sessionList);
    }

    @GetMapping("/getImage")
    public ResponseEntity<byte[]> fromDatabaseAsResEntity(@RequestParam("email") String email)
            throws SQLException {

        Optional<User> userDetails = createUser.findUser(email);
        byte[] imageBytes = null;
        if (userDetails.isPresent()) {
            imageBytes = userDetails.get().getProfilePicture();
        }

        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
    }

    @PostMapping("/uploadProfilePic")
    public ResponseEntity<Object> uploadProfilePic(@RequestParam("email") String email,
                                                   @RequestParam(value = "image") MultipartFile image) throws IOException {

        Optional<User> user = createUser.findUser(email);

        if(!user.isEmpty()){
            User usr = user.get();
            log.info("user email is:"+usr.getEmailId());

            usr.setProfilePicture(image.getBytes());
            User usr_response = createUser.saveProfilePic(usr);
            return ResponseHandler.generateResponse("success", HttpStatus.OK,usr_response);
        }else {
            return ResponseHandler.generateResponse("fail", HttpStatus.BAD_REQUEST,false);
        }

    }


    private String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        log.info(siteURL);
        return siteURL.replace(request.getServletPath(), "");
    }


}