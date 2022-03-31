package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.PostRepository;
import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Service.PostService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.common.Constants;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Service
public class PostsServiceImpl implements PostService {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    @Autowired
    private AWSStorageService awsStorageService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Override
    public Post addPost(Post post, MultipartFile track, MultipartFile picture ) {
        
        if(track != null){
            String trackName = awsStorageService.uploadFile(track, Constants.SM_BUCKET_NAME);
            post.setTrackFileName(trackName);
            post.setIsMediaAdded(true);
        }
        if(picture != null){
            String pictureName = awsStorageService.uploadFile(picture, Constants.SM_BUCKET_NAME);
            post.setPictureFileName(pictureName);
            post.setIsMediaAdded(true);
        }
        if(post.getIsMediaAdded()){
            post.setBucketName(Constants.SM_BUCKET_NAME);
        }
        post.setCreatedAt(new Date());
        return postRepository.saveAndFlush(post);
    }

    @Override
    public boolean removePost(Long postId) {
        Post postDetails = postRepository.getById(postId);

        if(postDetails.getIsMediaAdded()){
            String bucketName = postDetails.getBucketName();
            if(postDetails.getTrackFileName() != null && postDetails.getTrackFileName().length() > 0){
                awsStorageService.deleteFile(bucketName, postDetails.getTrackFileName());
            }
            if(postDetails.getPictureFileName() != null && postDetails.getPictureFileName().length() > 0){
                awsStorageService.deleteFile(bucketName, postDetails.getPictureFileName());
            }
        }
        // reactions to be deleted as well
        postRepository.deleteById(postId);
        return true;
    }
}
