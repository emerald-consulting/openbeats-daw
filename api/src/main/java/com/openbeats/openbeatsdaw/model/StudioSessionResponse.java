package com.openbeats.openbeatsdaw.model;

import com.openbeats.openbeatsdaw.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudioSessionResponse {

    private String sessionId;
    private String sessionName;
    private List<User> participants;
    private List<AudioTrack> audioTracks;
    private String bucketName;
}
