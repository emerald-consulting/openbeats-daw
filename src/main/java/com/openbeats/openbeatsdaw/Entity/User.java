package com.openbeats.openbeatsdaw.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userid;

    @Column(name = "username")
    private String username;

    @Column(name = "user_password")
    private String password;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String lastName;

    @Column(name="preferred_name")
    private String preferredName;

    @Column(name="emailid")
    private String emailId;

    @Column(name="subscription_type")
    private String subscriptionType;

    @Column(name="is_premium_user")
    private Boolean isPremiumUser;

    @Column(name="is_email_verified")
    private boolean emailVerified;

    @Column(name = "verification_code", length = 64)
    private String verificationCode;

    @Column(name = "total_followers")
    private Integer totalFollowers;

    @Column(name = "total_following")
    private Integer totalFollowing;

    @Column(name="bio", length = 500)
    private String bio;

    @Column(name="created_at")
    private Date createdAt;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "profile_picture")
    private byte[] profilePicture;


}
