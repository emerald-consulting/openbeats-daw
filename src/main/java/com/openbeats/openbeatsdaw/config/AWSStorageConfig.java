package com.openbeats.openbeatsdaw.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class AWSStorageConfig {

    @Bean
    @Scope("singleton")
    public AmazonS3 s3Client(){
        AWSCredentials awsCredentials = new BasicAWSCredentials("AKIAWWCXI2RZJVGIAH6C", "WCNQR+QhxCe7Wpnv88br5C3Ag1O2ycaI6FfRK35r");
        return (AmazonS3)((AmazonS3ClientBuilder)((AmazonS3ClientBuilder)AmazonS3ClientBuilder.standard().withRegion("us-east-1")).withCredentials(new AWSStaticCredentialsProvider(awsCredentials))).build();
    }



}
