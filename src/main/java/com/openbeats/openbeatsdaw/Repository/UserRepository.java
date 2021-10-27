package com.openbeats.openbeatsdaw.Repository;



import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.model.MyUserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmailId(String email);

    Optional<MyUserDetails> findMyUserDetailsByEmailId(String email);

    @Query("SELECT u FROM User u WHERE u.verificationCode = ?1")
    public User findByVerificationCode(String code);

}
