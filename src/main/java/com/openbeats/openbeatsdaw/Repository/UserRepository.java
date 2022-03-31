package com.openbeats.openbeatsdaw.Repository;



import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.MyUserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmailId(String email);

    Optional<MyUserDetails> findMyUserDetailsByEmailId(String email);

    @Query("SELECT u FROM User u WHERE u.verificationCode = ?1")
    public User findByVerificationCode(String code);

    @Modifying
    @Transactional
    @Query("update User u set u.subscriptionType='paid' where u.emailId = ?1")
    int upgradeUserSubscription(String email);

}
