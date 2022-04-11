package com.openbeats.openbeatsdaw.model.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Messages {

    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @Column(name = "conversation_id", insertable = false, updatable = false)
    private Long conversationId;

    @Column(name = "sender_id", insertable = false, updatable = false)
    private Long senderId;

    @Column(name="is_read")
    private Boolean isRead;

    @Column(name="content", length = 500)
    private String content;

    @Column(name = "created_at")
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    @JsonIgnore
    private Conversations conversationRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnore
    private User userRef;

}
