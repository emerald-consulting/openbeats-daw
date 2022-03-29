package com.openbeats.openbeatsdaw.model;

import lombok.Data;

@Data
public class UpdateFileOffetRequest {

    private Long fileId;
    private Integer offset;
    private String sessionId;
}
