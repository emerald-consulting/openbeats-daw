package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Service
@Slf4j
public class CreateUser {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @ResponseStatus(HttpStatus.CREATED)
    public String saveUser(User user) {
        List<User> users = userRepository.findAll();

        for (User tempUser : users) {
            log.info("UserName : "+tempUser.getUsername());
            log.info(String.valueOf(user.getUsername().equals(tempUser.getUsername())));
            if(user.getUsername().equals(tempUser.getUsername()) || user.getEmailId().equals(tempUser.getEmailId())) return "User Already Exists";
        }

        String encodedPassword=passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return "Successful!!";

    }

}
