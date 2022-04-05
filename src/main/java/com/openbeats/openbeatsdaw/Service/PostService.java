package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface PostService {
    public Post addPost(Post post, MultipartFile track, MultipartFile picture );

    public boolean removePost(Long postId);

    public Page<Post> getPosts(Long userid, int pageNo);

    public List<Post> getTrending();
}
