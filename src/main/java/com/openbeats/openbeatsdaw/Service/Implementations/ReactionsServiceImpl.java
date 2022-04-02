package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.PostRepository;
import com.openbeats.openbeatsdaw.Repository.ReactionsRepository;
import com.openbeats.openbeatsdaw.Repository.UserRepository;
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
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    ReactionsMapper mapper;

    @Override
    public boolean likePost(Long userId, Long postId) {
        Optional<Reactions> reaction = reactionsRepository.findByPostIdAndUserId(postId, userId);
        if (reaction.isPresent()) {
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
        Optional<Reactions> reaction = reactionsRepository.findByPostIdAndUserId(postId, userId);
        if (reaction.isPresent()) {
            return true;
        }
        return false;
    }

    @Override
    public Reactions updateReaction(Long postId, Long userId, Boolean isLike) {
        Optional<Reactions> optionalReaction = reactionsRepository.findByPostIdAndUserId(postId, userId);
        if (!optionalReaction.isPresent() && isLike) {
            Reactions newReaction = new Reactions();
            newReaction.setPostId(postId);
            newReaction.setUserId(userId);
            newReaction.setIsLike(isLike);
            newReaction.setIsDislike(!isLike);
            newReaction.setPostRef(postRepository.findById(postId).get());
            newReaction.setUserRef(userRepository.findById(userId).get());
            reactionsRepository.save(newReaction);
            return newReaction;
        } else {
            Reactions reaction = optionalReaction.get();
            Post post = reaction.getPostRef();
            if (isLike) {
                post.setTotalLikes(post.getTotalLikes() + 1);
                reaction.setIsLike(isLike);
                reaction.setIsDislike(!isLike);

            } else {
                if (post.getTotalLikes() != 0) {
                    post.setTotalLikes(post.getTotalLikes() - 1);
                    reaction.setIsLike(isLike);
                    reaction.setIsDislike(!isLike);
                }
            }
            reaction.setPostRef(post);
            reactionsRepository.save(reaction);
            return reaction;
        }
    }

    @Override
    public Reactions getReactionByPostIdAndUserId(Long postId, Long userId) {
        Reactions reaction = reactionsRepository.findByPostIdAndUserId(postId, userId).get();
        return reaction;
    }

}
