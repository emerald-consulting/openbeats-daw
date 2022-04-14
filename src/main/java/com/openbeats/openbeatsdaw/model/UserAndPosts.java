package com.openbeats.openbeatsdaw.model;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import org.springframework.data.domain.Page;

public class UserAndPosts {
    public Page<Post> posts;
    public Page<UserFetchDTO> users;
}
