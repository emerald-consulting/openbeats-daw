package com.openbeats.openbeatsdaw.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import com.openbeats.openbeatsdaw.model.Entity.Followers;
import org.springframework.data.repository.query.Param;


public interface FollowersRepository extends JpaRepository<Followers, Long> {
	
    public Followers save(Followers followers);

    public Followers findByFollowingUserIdAndFollowedUserId(@Param("followingUserId") Long followingUserId, @Param("followedUserId") Long followedUserId);

    List<Followers> findByFollowingUserId(@Param("followingUserId") Long followingUserId);

    List<Followers> findByFollowedUserId(@Param("followedUserId") Long followedUserId);
}
