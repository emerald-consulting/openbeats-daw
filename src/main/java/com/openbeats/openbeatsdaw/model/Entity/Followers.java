package com.openbeats.openbeatsdaw.model.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "followers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Followers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "following_user_id", insertable = false, updatable = false)
    private Long followingUserId;

    @Column(name = "followed_user_id", insertable = false, updatable = false)
    private Long followedUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_user_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnore
    private User followingUserRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followed_user_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnore
    private User followedUserRef;

}
