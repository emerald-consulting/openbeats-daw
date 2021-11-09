package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Service.SessionMgmtService;
import com.openbeats.openbeatsdaw.Utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class AwsController {

    @Autowired
    AWSStorageService awsStorageService;

    @PostMapping("/createSessionBucket")
    public ResponseEntity<Object> createBucket(@RequestParam(value = "sessionName")String sessionName) throws Exception {

        String new_bucket_name = System.currentTimeMillis() + sessionName;
        String bucketName = awsStorageService.createBucket(new_bucket_name);

        return ResponseHandler.generateResponse("success", HttpStatus.OK,awsStorageService.createBucket(new_bucket_name));
    }
}
