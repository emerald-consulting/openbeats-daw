package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.ReactionsRepository;
import com.openbeats.openbeatsdaw.Service.ReactionsService;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.Reactions;
import com.openbeats.openbeatsdaw.model.ReactionsDTO;
import com.openbeats.openbeatsdaw.model.mapper.ReactionsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReactionsServiceImpl implements ReactionsService {

    @Autowired
    private ReactionsRepository reactionsRepository;

    @Autowired
    ReactionsMapper mapper;

    @Override
    public boolean likePost(Long userId, Long postId) {
        Optional<Reactions> reaction = reactionsRepository.findByPostIdAndUserId(postId, userId );
        if(reaction.isPresent()){
            reactionsRepository.deleteById(reaction.get().getReactionId());
            return false;
        }
        ReactionsDTO reactionsDTO = new ReactionsDTO();
        reactionsDTO.setPostId(postId);
        reactionsDTO.setUserId(userId);
        reactionsDTO.setIsLike(true);
        Reactions newReaction = mapper.reactionsDTOToMetadata(reactionsDTO);
        reactionsRepository.saveAndFlush(newReaction);
        return true;
    }

    @Override
    public boolean isLiked(Long userId, Long postId) {
        Optional<Reactions> reaction = reactionsRepository.findByPostIdAndUserId(postId, userId );
        if(reaction.isPresent()){
            return true;
        }
        return false;
    }
}
