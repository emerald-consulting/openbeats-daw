package com.openbeats.openbeatsdaw.model;

import lombok.Data;

@Data
public class AudioTrack {

    private String sessionId;
    //private transient MultipartFile file;
    private String file;
}
