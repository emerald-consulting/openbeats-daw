package com.openbeats.openbeatsdaw.model;

import com.openbeats.openbeatsdaw.Entity.File;
import com.openbeats.openbeatsdaw.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;

public class MyUserDetails implements UserDetails {

    private Long userid;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String preferredName;
    private String emailId;
    private String subscriptionType;
    private boolean emailVerified;
    private int totalFollowers;
    private int totalFollowing;
    private String bio;
    private Date createdAt;
    // private File profilePicRef;
    // private File coverPicRef;


    public MyUserDetails(User u){
        this.userid = u.getUserid();
        this.username = u.getUsername();
        this.password = u.getPassword();
        this.firstName = u.getFirstName();
        this.lastName = u.getLastName();
        this.preferredName = u.getPreferredName();
        this.emailId = u.getEmailId();
        this.subscriptionType = u.getSubscriptionType();
        this.emailVerified = u.isEmailVerified();
        this.bio = u.getBio();
        this.createdAt = u.getCreatedAt();
        this.totalFollowers = u.getTotalFollowers();
        this.totalFollowing = u.getTotalFollowing();
        this.bio = u.getBio();
        this.createdAt = u.getCreatedAt();
        // this.profilePicRef = u.getProfilePicRef();
        // this.coverPicRef = u.getCoverPicRef();
    }

    public MyUserDetails(){

    }
    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }


}
