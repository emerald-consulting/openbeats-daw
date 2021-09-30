package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateUser {
    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {

        return userRepository.save(user);

    }
}
