package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.UserRepository;
import com.openbeats.openbeatsdaw.Service.UserService;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserFetchDTO getUserDetails(Long userid) {
        return userRepository.getUserDetailsByUserId(userid);
    }
}
