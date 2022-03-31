package com.openbeats.openbeatsdaw.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openbeats.openbeatsdaw.model.Entity.Followers;
import org.springframework.data.repository.query.Param;


public interface FollowersRepository extends JpaRepository<Followers, Long> {
	
    public Followers save(Followers followers);

    public Followers findByFollowingUserIdAndFollowedUserId(@Param("followingUserId") Long followingUserId, @Param("followedUserId") Long followedUserId);
}
