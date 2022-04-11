package com.openbeats.openbeatsdaw.model;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.User;
import org.springframework.data.domain.Page;

public class UserAndPosts {
    public Page<Post> posts;
    public Page<User> users;
}
