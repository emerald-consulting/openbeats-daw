package com.openbeats.openbeatsdaw.Repository;



import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.MyUserDetails;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    // @Modifying
    // @Transactional
    // @Query("SELECT u FROM User u WHERE u.userid = ?1")
    // Optional<User> findByUserId(@Param("userid") Long userid);

    Optional<User> findByEmailId(String email);

    Optional<MyUserDetails> findMyUserDetailsByEmailId(String email);

    @Query("SELECT u FROM User u WHERE u.verificationCode = ?1")
    public User findByVerificationCode(String code);

    @Modifying
    @Transactional
    @Query("update User u set u.subscriptionType='paid' where u.emailId = ?1")
    int upgradeUserSubscription(String email);

    @Query("SELECT new com.openbeats.openbeatsdaw.model.UserFetchDTO(u.userid, u.username, u.firstName, u.lastName)" +
    " from User u where u.userid = :userid")
    UserFetchDTO getUserDetailsByUserId(@Param("userid") Long userid);

    @Query("SELECT new com.openbeats.openbeatsdaw.model.UserFetchDTO(u.userid, u.username, u.firstName, u.lastName) FROM User u where u.username like %:searchText% ")
    Page<User> searchUsers(@Param("searchText")String searchText, Pageable pageable);

}
