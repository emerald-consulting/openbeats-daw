package com.openbeats.openbeatsdaw.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFetchDTO {
    private Long userid;
    private String username;
    private String firstName;
    private String lastName;
    private String profilePictureFileName;
    private String coverPictureFileName;
    private String profilePictureFileUrl;
    private String coverPictureFileUrl;
    private String bucketName;
    private String emailId;
    private Integer totalFollowers;
    private Integer totalFollowing;
}
