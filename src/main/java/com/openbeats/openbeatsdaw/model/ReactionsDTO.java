package com.openbeats.openbeatsdaw.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReactionsDTO {
    private Long reactionId;
    private Long postId;
    private Long userId;
    private Boolean isLike;
    private Boolean isDislike;
}
