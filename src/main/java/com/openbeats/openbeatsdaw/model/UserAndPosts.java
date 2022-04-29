package com.openbeats.openbeatsdaw.model;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import org.springframework.data.domain.Page;
import java.util.List;

public class UserAndPosts {
    public Page<Post> posts;
    public List<UserFetchDTO> users;
    public Long userId;
}
