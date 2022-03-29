package com.openbeats.openbeatsdaw.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "conversations")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conversations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private Long conversationId;

    @Column(name = "user1_id", insertable = false, updatable = false)
    private Long userId1;

    @Column(name = "user2_id", insertable = false, updatable = false)
    private Long userId2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnore
    private User userRef1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", referencedColumnName = "user_id", nullable = false)
    @JsonIgnore
    private User userRef2;
}
