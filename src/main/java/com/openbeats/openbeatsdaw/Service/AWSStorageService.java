package com.openbeats.openbeatsdaw.Service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class AWSStorageService {

    @Autowired
    AmazonS3 s3Client;

    public String uploadFile(MultipartFile multipartFile,String bucket_name){
        File fileObj = convertMultipartFileToFile(multipartFile);
        String filename = multipartFile.getOriginalFilename();
        s3Client.putObject(new PutObjectRequest(bucket_name,filename,fileObj));
        fileObj.delete();
        return filename;
    }

    public String createBucket(String new_bucket_name){
        Bucket b = null;
        if (s3Client.doesBucketExistV2(new_bucket_name)) {
            b = getBucket(new_bucket_name);
        } else {
            try {
                b = s3Client.createBucket(new_bucket_name);
            } catch (AmazonS3Exception e) {
                System.err.println(e.getErrorMessage());
            }
        }
        assert b != null;
        return b.getName();
    }

    private File convertMultipartFileToFile(MultipartFile file){
        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convertedFile)){
            fos.write(file.getBytes());
        }catch (IOException e){
            //log.error("Error converting file:",e);
        }
        return convertedFile;
    }

    public Bucket getBucket(String bucket_name) {
        Bucket named_bucket = null;
        List<Bucket> buckets = s3Client.listBuckets();
        for (Bucket b : buckets) {
            if (b.getName().equals(bucket_name)) {
                named_bucket = b;
            }
        }
        return named_bucket;
    }

    public String deleteBucket(String bucket_name){

        try {

            ObjectListing object_listing = s3Client.listObjects(bucket_name);
            while (true) {
                for (S3ObjectSummary summary : object_listing.getObjectSummaries()) {
                    s3Client.deleteObject(bucket_name, summary.getKey());
                }

                // more object_listing to retrieve?
                if (object_listing.isTruncated()) {
                    object_listing = s3Client.listNextBatchOfObjects(object_listing);
                } else {
                    break;
                }
            }

            VersionListing version_listing = s3Client.listVersions(
                    new ListVersionsRequest().withBucketName(bucket_name));
            while (true) {
                for (S3VersionSummary vs : version_listing.getVersionSummaries()) {
                    s3Client.deleteVersion(
                            bucket_name, vs.getKey(), vs.getVersionId());
                }

                if (version_listing.isTruncated()) {
                    version_listing = s3Client.listNextBatchOfVersions(
                            version_listing);
                } else {
                    break;
                }
            }

            s3Client.deleteBucket(bucket_name);
        } catch (AmazonServiceException e) {
            System.err.println(e.getErrorMessage());
            return "Error:"+e.getErrorMessage();
        }

        return "Bucket Deleted:"+bucket_name;
    }
}
