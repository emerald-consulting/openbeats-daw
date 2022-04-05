package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {
    public Post addPost(Post post, MultipartFile track, MultipartFile picture );

    boolean removePost(Long postId);

    Page<Post> getPosts(Long userid, int pageNo);
}