package com.openbeats.openbeatsdaw.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "studio")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "bucket_name")
    private String bucketName;

    @Column(name="session_name")
    private String sessionName;
}
