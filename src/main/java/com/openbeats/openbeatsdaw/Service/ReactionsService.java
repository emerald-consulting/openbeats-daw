package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.model.Entity.Reactions;

public interface ReactionsService {

    public  boolean likePost(Long userId, Long postId);

    boolean isLiked(Long userId, Long postId);

    Reactions updateReaction(Long postId, Long userId, Boolean isLike);

    Reactions getReactionByPostIdAndUserId(Long postId, Long userId);
}
