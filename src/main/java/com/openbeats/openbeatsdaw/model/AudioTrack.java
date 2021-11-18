package com.openbeats.openbeatsdaw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "file")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AudioTrack {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_id")
    private Long audioTrackId;

    @Column(name="session_id")
    private String sessionId;
    //private transient MultipartFile file;

    @Column(name="file_name")
    private String file;
}
