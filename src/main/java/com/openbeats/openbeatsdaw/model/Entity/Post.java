package com.openbeats.openbeatsdaw.model.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;

@Entity
@Table(name = "posts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Column(name="description", length = 500)
    private String description;

    @Column(name="genre", length = 50)
    private String genre;

    @Column(name="title", length = 100)
    private String title;

    @Column(name="is_announcement")
    private Boolean isAnnouncement;

    @Column(name="is_media_added")
    private Boolean isMediaAdded;

    @Column(name = "track_file_name")
    private String trackFileName;

    @Column(name = "picture_file_name")
    private String pictureFileName;

    @Column(name = "total_likes")
    private Integer totalLikes;

    @Column(name = "total_dislikes")
    private Integer totalDislikes;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "bucket_name")
    private String bucketName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User userRef;
}
