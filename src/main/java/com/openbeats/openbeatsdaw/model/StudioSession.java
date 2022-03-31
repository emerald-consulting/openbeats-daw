package com.openbeats.openbeatsdaw.model;

import com.openbeats.openbeatsdaw.model.Entity.User;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class StudioSession implements Serializable {
    private String sessionId;
    private String sessionName;
    private List<User> participants;
    private List<AudioTrack> audioTracks;
    private String bucketName;
}
