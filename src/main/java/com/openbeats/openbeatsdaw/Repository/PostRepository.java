package com.openbeats.openbeatsdaw.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface PostRepository extends JpaRepository<Post, Long>{

    @Query("SELECT p FROM Post p WHERE p.userId= :userId or p.userId in (select followedUserId from Followers where followingUserId= :userId) order by p.createdAt desc")
    Page<Post> getPosts(@Param("userId")Long userId, Pageable pageable);

    List<Post> findFirst10ByOrderByTotalLikesDescCreatedAtDesc(Pageable pageable);
}
