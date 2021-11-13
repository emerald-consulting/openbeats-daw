package com.openbeats.openbeatsdaw.Service;


import com.openbeats.openbeatsdaw.Entity.SpotifyUserInfo;
import com.openbeats.openbeatsdaw.Entity.User;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.AuthProvider;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;
//
    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }
//
    private OAuth2User  processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        SpotifyUserInfo oAuth2UserInfo = SpotifyUserInfo.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());


        Optional<User> userOptional = userRepository.findByEmailId(oAuth2UserInfo.getEmail());
        User user;
        if(userOptional.isPresent()) {
            user = userOptional.get();

        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }
        return UserPrincipal.create(user, oAuth2User.getAttributes());

    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, SpotifyUserInfo oAuth2UserInfo) {
        User user = new User();
        user.setUsername(oAuth2UserInfo.getName());
        user.setFirstName(oAuth2UserInfo.getName());
        user.setPassword("YEsd");
        user.setLastName(oAuth2UserInfo.getName());
        user.setEmailId(oAuth2UserInfo.getEmail());
        user.setSubscriptionType("free");
        user.setEmailVerified(false);

        return userRepository.save(user);
    }

//    private User updateExistingUser(User existingUser, SpotifyUserInfo oAuth2UserInfo) {
//        existingUser.setName(oAuth2UserInfo.getName());
//        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
//        return userRepository.save(existingUser);
//    }

}
