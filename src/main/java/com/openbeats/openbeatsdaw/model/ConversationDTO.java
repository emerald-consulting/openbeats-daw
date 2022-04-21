package com.openbeats.openbeatsdaw.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConversationDTO {
    private Long conversationId;
    private Long userId1;
    private Long userId2;
}
