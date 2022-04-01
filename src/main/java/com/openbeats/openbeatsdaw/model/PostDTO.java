package com.openbeats.openbeatsdaw.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class PostDTO {
    private Long postId;
    private Long userId;
    private String description;
    private String genre;
    private String title;
    private Boolean isAnnouncement;
    private Boolean isMediaAdded;
    private String trackFileName;
    private String pictureFileName;
    private Integer totalLikes;
    private Integer totalDislikes;
    private Date createdAt;
    private Date updatedAt;
    private String bucketName;
}
