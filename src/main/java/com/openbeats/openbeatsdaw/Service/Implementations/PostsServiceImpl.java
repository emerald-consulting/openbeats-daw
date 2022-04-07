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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

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
    public Post updatePost(Post post, MultipartFile track, MultipartFile picture ) {
        Post existingpost = postRepository.getById(post.getPostId());
        Post newPost=new Post();
        if(existingpost == null){
            return null;
        }
        else {
            String bucketName = existingpost.getBucketName();

            if(track != null && existingpost.getTrackFileName() != null && existingpost.getTrackFileName().length() > 0){
                awsStorageService.deleteFile(bucketName, existingpost.getTrackFileName());
            }
            if(picture != null && existingpost.getPictureFileName() != null && existingpost.getPictureFileName().length() > 0){
                awsStorageService.deleteFile(bucketName, existingpost.getPictureFileName());
            }
            if (track != null) {
                String trackName = awsStorageService.uploadFile(track, Constants.SM_BUCKET_NAME);
                existingpost.setTrackFileName(trackName);
                existingpost.setIsMediaAdded(true);
            }
            if (picture != null) {
                String pictureName = awsStorageService.uploadFile(picture, Constants.SM_BUCKET_NAME);
                existingpost.setPictureFileName(pictureName);
                existingpost.setIsMediaAdded(true);
            }
            if (existingpost.getIsMediaAdded()) {
                existingpost.setBucketName(Constants.SM_BUCKET_NAME);
            }
            existingpost.setDescription(post.getDescription());
            existingpost.setTitle(post.getTitle());
            existingpost.setGenre(post.getGenre());
            existingpost.setUpdatedAt(new Date());
            postRepository.saveAndFlush(existingpost);
            newPost.setPostId(existingpost.getPostId());
            newPost.setDescription(existingpost.getDescription());
            newPost.setGenre(existingpost.getGenre());
            newPost.setTitle(existingpost.getTitle());
            if(existingpost.getPictureFileName() != null && existingpost.getPictureFileName().length() > 0) {
                newPost.setPictureFileName(awsStorageService.getUrl(existingpost.getBucketName(),
                        existingpost.getPictureFileName()).toString());
            }
            if(existingpost.getTrackFileName() != null && existingpost.getTrackFileName().length() > 0) {
                newPost.setTrackFileName(awsStorageService.getUrl(existingpost.getBucketName(),
                        existingpost.getTrackFileName()).toString());
            }
            return newPost;
        }
    }



    @Override
    public boolean removePost(Long postId) {
        Post postDetails = postRepository.getById(postId);

        //if(postDetails.getIsMediaAdded()){
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

    @Override
    public Page<Post> getPosts(Long userid, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 10);
        Page<Post> posts = postRepository.getPosts(userid, pageable);
        posts.forEach(post->{
            if(post.getPictureFileName() != null && post.getPictureFileName().length() > 0){
                post.setPictureFileName(awsStorageService.getUrl(post.getBucketName(), post.getPictureFileName()).toString());
            }
            if(post.getTrackFileName() != null && post.getTrackFileName().length() > 0){
                post.setTrackFileName(awsStorageService.getUrl(post.getBucketName(), post.getTrackFileName()).toString());
            }
        });

        return posts;

    }

    @Override
    public List<Post> getTrending() {
        Pageable pageable = PageRequest.of(0, 10);
        return postRepository.findFirst10ByOrderByTotalLikesDescCreatedAtDesc(pageable);
    }

    @Override
    public List<Post> getAnnouncements() {
        Pageable pageable = PageRequest.of(0, 10);
        return postRepository.findFirst10ByIsAnnouncementOrderByCreatedAtDesc(true, pageable);
    }

    @Override
    public List<String> getAllGenre() {
        return postRepository.findDistinctByGenre();
    }

    @Override
    public Page<Post> getPostsByUser(Long userId, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 10);
        Page<Post> posts = postRepository.getPostsByUser(userId, pageable);
        posts.forEach(post->{
            if(post.getPictureFileName() != null && post.getPictureFileName().length() > 0){
                post.setPictureFileName(awsStorageService.getUrl(post.getBucketName(), post.getPictureFileName()).toString());
            }
            if(post.getTrackFileName() != null && post.getTrackFileName().length() > 0){
                post.setTrackFileName(awsStorageService.getUrl(post.getBucketName(), post.getTrackFileName()).toString());
            }
        });

        return posts;
    }

    @Override
    public Page<Post> getPostsLikedByUser(Long userId, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 10);
        Page<Post> posts = postRepository.getPostsLikedByUser(userId, pageable);
        posts.forEach(post->{
            if(post.getPictureFileName() != null && post.getPictureFileName().length() > 0){
                post.setPictureFileName(awsStorageService.getUrl(post.getBucketName(), post.getPictureFileName()).toString());
            }
            if(post.getTrackFileName() != null && post.getTrackFileName().length() > 0){
                post.setTrackFileName(awsStorageService.getUrl(post.getBucketName(), post.getTrackFileName()).toString());
            }
        });

        return posts;
    }

    @Override
    public Page<Post> getMediaPostsByUser(Long userId, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 10);
        Page<Post> posts = postRepository.getMediaPostsByUser(userId, pageable);
        posts.forEach(post->{
            if(post.getPictureFileName() != null && post.getPictureFileName().length() > 0){
                post.setPictureFileName(awsStorageService.getUrl(post.getBucketName(), post.getPictureFileName()).toString());
            }
            if(post.getTrackFileName() != null && post.getTrackFileName().length() > 0){
                post.setTrackFileName(awsStorageService.getUrl(post.getBucketName(), post.getTrackFileName()).toString());
            }
        });
        return posts;
    }
}
