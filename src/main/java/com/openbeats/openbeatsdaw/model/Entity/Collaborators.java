package com.openbeats.openbeatsdaw.model.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "collaborators")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Collaborators {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collaborator_id")
    private Long collaboratorId;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name="session_name")
    private String sessionName;

    @Column(name="session_id")
    private Long sessionId;

    @Column(name="role")
    private String role;

//    @ManyToMany
//    @JoinTable(
//            name = "",
//            joinColumns = @JoinColumn(name = "session_id"),
//            inverseJoinColumns = @JoinColumn(name = "session_id"))
//    Set<Session> sessionsList;


}
