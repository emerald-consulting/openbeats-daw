package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.springframework.web.multipart.MultipartFile;

public interface PostService {
    public Post addPost(Post post, MultipartFile track, MultipartFile picture );

    boolean removePost(Long postId);
}
