package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

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

    @PostMapping("/getFile")
    public ResponseEntity<byte[]> getFile(@RequestParam(value = "fileName") String filename,
                                          @RequestParam(value = "bucketName") String bucketName ) throws IOException {
        ByteArrayOutputStream download = awsStorageService.downloadFile(filename,bucketName);
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("audio/mpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(download.toByteArray());
    }

}
