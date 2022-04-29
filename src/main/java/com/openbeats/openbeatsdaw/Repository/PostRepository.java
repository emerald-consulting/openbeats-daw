package com.openbeats.openbeatsdaw.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.openbeats.openbeatsdaw.model.PostDTO;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface PostRepository extends JpaRepository<Post, Long>{

    @Query("SELECT p FROM Post p WHERE p.userId= :userId or p.userId in (select followedUserId from Followers where followingUserId= :userId) order by p.createdAt desc")
    Page<Post> getPosts(@Param("userId")Long userId, Pageable pageable);

    List<Post> findFirst10ByOrderByTotalLikesDescCreatedAtDesc(Pageable pageable);

    List<Post> findFirst10ByUserIdAndIsAnnouncementOrderByCreatedAtDesc(@Param("userid") Long userid, @Param("isAnnouncement") boolean isAnnouncement, Pageable pageable);

    List<Post> findFirst5ByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Post p where p.description like %:searchText% or p.title like %:searchText% or p.genre like %:searchText% ")
    Page<Post> searchPosts(@Param("searchText")String searchText, Pageable pageable);
    
    @Query("SELECT p.genre FROM Post p WHERE p.genre <> '' order by p.genre asc")
    List<String> findDistinctByGenre();

    @Query("SELECT p FROM Post p WHERE p.userId= :userId order by p.createdAt desc")
    Page<Post> getPostsByUser(@Param("userId")Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.postId in (select r.postId from Reactions r where r.userId= :userId and r.isLike = 1) order by p.createdAt desc")
    Page<Post> getPostsLikedByUser(Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.userId= :userId and p.isMediaAdded = 1 order by p.createdAt desc")
    Page<Post> getMediaPostsByUser(Long userId, Pageable pageable);
}
