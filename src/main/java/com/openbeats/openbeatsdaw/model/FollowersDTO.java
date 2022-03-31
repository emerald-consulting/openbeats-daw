package com.openbeats.openbeatsdaw.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FollowersDTO {
    private Long id;
    private Long followingUserId;
    private Long followedUserId;
}
