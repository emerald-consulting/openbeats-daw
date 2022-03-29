![openbeats_notype-45](https://user-images.githubusercontent.com/31867784/132925211-2aabc8a7-a06d-4354-99c0-56886400227c.png)

## Description

**Open Beats**, is a Digital Audio Workstation (DAW) that aims to allow artists to collaborate with others on music
synchronously and remotely. The project is currently beginning development
for [Alan Hunt's CSE 611 class](https://catalog.buffalo.edu/courses/index.php?abbr=CSE&num=611).

This repository contains the code for a Open Beats, the Digital Audio Workstation. The code for the API that serves the
social media application can be found [here](https://github.com/rychrome/openbeats).

## Getting Started

Step 1: 
First create account on AWS and obtain the access key id and secret access key.

Then replace code under @Bean from AWSStorageConfig in config package with -

@Bean
    public AmazonS3 s3() {
        AWSCredentials awsCredentials =
                new BasicAWSCredentials("<Key ID>", "<Secret Access Key>");
        return AmazonS3ClientBuilder
                .standard()
                .withRegion("us-east-2")
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();

    }

Note: Don't push your secret keys on Github.

Step 2:

Also if you have created mysql RDS instance on AWS, replace code in application.properties with

spring.datasource.driver-class-name= com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://<RDS url>
spring.datasource.username=<username>
spring.datasource.password=<password>

server.port=5000

STEP 3:
In constants.js (frontent) set 
export const url = "http://localhost:5000"

STEP 4 (Enabling Cors for local env) :
IN src/main/java/com/openbeats/openbeatsdaw/config/WebSocketConfig.java
Comment out Line 27 and uncomment line 28.

and, in src/main/java/com/openbeats/openbeatsdaw/config/WebSecurityConfig.java
Comment out Line 76 and uncomment line 77.


### Dependencies

*

### Installing

*

### Steps

*

### Building the project

*

## Authors

Contributors names and contact info

* [Ryan Dils](ryandils@buffalo.edu)
*

## Version History

## Acknowledgments

Inspiration, code snippets, etc.

* 
