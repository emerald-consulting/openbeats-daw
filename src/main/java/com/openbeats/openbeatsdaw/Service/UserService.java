package com.openbeats.openbeatsdaw.Service;

import java.net.URL;

import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import com.openbeats.openbeatsdaw.model.Entity.User;

import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    public UserFetchDTO getUserDetails(Long userid);

    public User uploadOrEditPicture(String emailId, MultipartFile profilePictureName, MultipartFile coverPictureName);

    public User getPicture(String emailId);

}