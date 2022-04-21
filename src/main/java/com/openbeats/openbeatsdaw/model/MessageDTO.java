package com.openbeats.openbeatsdaw.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class MessageDTO {
    private Long messageId;
    private Long conversationId;
    private Long senderId;
    private Boolean isRead;
    private String content;
    private Date createdAt;
}
