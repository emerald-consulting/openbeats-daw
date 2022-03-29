package com.openbeats.openbeatsdaw.Entity;

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
public class Posts {

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

    @Column(name="is_announcement")
    private Boolean isAnnouncement;

    @Column(name="is_media_added")
    private Boolean isMediaAdded;

    @Column(name = "track_file_id", insertable = false, updatable = false)
    private Long trackFileId;

    @Column(name = "picture_file_id", insertable = false, updatable = false)
    private Long pictureFileId;

    @Column(name = "total_likes")
    private Integer totalLikes;

    @Column(name = "total_dislikes")
    private Integer totalDislikes;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_file_id", referencedColumnName = "file_id", nullable = true)
    @JsonIgnore
    private File trackFileRef;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "picture_file_id", referencedColumnName = "file_id", nullable = true)
    @JsonIgnore
    private File pictureFileRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User userRef;
}
