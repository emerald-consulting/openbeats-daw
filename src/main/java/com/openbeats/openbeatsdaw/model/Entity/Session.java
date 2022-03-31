package com.openbeats.openbeatsdaw.model.Entity;

import com.openbeats.openbeatsdaw.model.AudioTrack;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "session")
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

    @Column(name="session_join_code")
    private String joiningCode;


//    @ManyToMany
//    @JoinTable(
//            name = "course_like",
//            joinColumns = @JoinColumn(name = "student_id"),
//            inverseJoinColumns = @JoinColumn(name = "course_id"))
//    Set<Course> likedCourses;
//    private List<Collaborators> participants;
//
//    private List<AudioTrack> audioTracks;

}
