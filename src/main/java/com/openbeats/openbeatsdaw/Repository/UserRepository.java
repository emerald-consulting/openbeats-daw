package com.openbeats.openbeatsdaw.Repository;



import com.openbeats.openbeatsdaw.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {


}
