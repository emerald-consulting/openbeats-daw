package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.UserRepository;
import com.openbeats.openbeatsdaw.Service.AWSStorageService;
import com.openbeats.openbeatsdaw.Service.UserService;
import com.openbeats.openbeatsdaw.common.Constants;
import com.openbeats.openbeatsdaw.model.UserFetchDTO;
import com.openbeats.openbeatsdaw.model.Entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AWSStorageService awsStorageService;

    @Override
    public UserFetchDTO getUserDetails(Long userid) {
        return userRepository.getUserDetailsByUserId(userid);
    }

    @Override
    public User uploadOrEditPicture(String emailId, MultipartFile profilePictureName, MultipartFile coverPictureName) {
        User user = userRepository.findByEmailId(emailId).get();

        if (profilePictureName != null) {
            String pictureName = awsStorageService.uploadFile(profilePictureName, Constants.SM_BUCKET_NAME);
            user.setProfilePictureFileName(pictureName);
            user.setBucketName(Constants.SM_BUCKET_NAME);
        }
        if (coverPictureName != null) {
            String pictureName = awsStorageService.uploadFile(coverPictureName, Constants.SM_BUCKET_NAME);
            user.setCoverPictureFileName(pictureName);
            user.setBucketName(Constants.SM_BUCKET_NAME);
        }

        userRepository.save(user);
        return user;
    }

    @Override
    public User getPicture(String emailId) {
        User user = userRepository.findByEmailId(emailId).get();
        if (user.getProfilePictureFileName() != null && user.getProfilePictureFileName().length() > 0) {
            user.setProfilePictureFileName(awsStorageService.getUrl(user.getBucketName(), user.getProfilePictureFileName()).toString());
        }

        if (user.getCoverPictureFileName() != null && user.getCoverPictureFileName().length() > 0) {
            user.setCoverPictureFileName(awsStorageService.getUrl(user.getBucketName(), user.getCoverPictureFileName()).toString());
        }
        return user;
    }

    @Override
    public User updateUser(User user) {
        userRepository.saveAndFlush(user);
        return user;
    }
}
