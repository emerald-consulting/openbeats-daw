package com.openbeats.openbeatsdaw.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface PostRepository extends JpaRepository<Post, Long>{

    @Query("SELECT p FROM Post p WHERE p.userId= :userId or p.userId in (select followedUserId from Followers where followingUserId= :userId) order by p.createdAt desc")
    List<Post> getPosts(@Param("userId")Long userId, Pageable pageable);
}
