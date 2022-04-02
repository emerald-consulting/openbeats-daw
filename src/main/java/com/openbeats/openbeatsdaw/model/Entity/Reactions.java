package com.openbeats.openbeatsdaw.model.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "reactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reaction_id")
    private Long reactionId;

    @Column(name = "post_id", insertable = false, updatable = false)
    private Long postId;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Column(name="is_like")
    private Boolean isLike;

    @Column(name="is_dislike")
    private Boolean isDislike;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
    private Post postRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
    private User userRef;
}
