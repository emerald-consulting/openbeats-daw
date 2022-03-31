package com.openbeats.openbeatsdaw.model.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notify_id")
    private Long notifyId;

    @Column(name = "notify_for_user_id", insertable = false, updatable = false)
    private Long notifyForUserId;

    @Column(name = "notify_by_user_id", insertable = false, updatable = false)
    private Long notifyByUserId;

    @Column(name="type", length = 50)
    private String type;

    @Column(name="is_read")
    private Boolean isRead;

    @Column(name="content", length = 255)
    private String content;

    @Column(name = "created_at")
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notify_for_user_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnore
    private User notifyForUserRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notify_by_user_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnore
    private User notifyByUserRef;
}
