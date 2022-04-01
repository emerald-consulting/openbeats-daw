package com.openbeats.openbeatsdaw.Service;

public interface ReactionsService {

    public  boolean likePost(Long userId, Long postId);

    boolean isLiked(Long userId, Long postId);
}
