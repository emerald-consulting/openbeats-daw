package com.openbeats.openbeatsdaw.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openbeats.openbeatsdaw.Service.PostService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.PostDTO;
import com.openbeats.openbeatsdaw.model.mapper.PostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    PostMapper postMapper;

    @Autowired
    private TokenProvider tokenProvider;

    @PostMapping("/post")
    @ResponseBody
    public Post addPost(@RequestPart("json") String json,
                        @RequestParam("track") MultipartFile track,
                        @RequestParam("picture") MultipartFile picture,
                        @RequestHeader (name="Authorization") String token ) throws JsonProcessingException {

        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        ObjectMapper mapper = new ObjectMapper();
        PostDTO postDTO = mapper.readValue(json, PostDTO.class);
        postDTO.setUserId(currentUser.get().getUserid());
        Post post = postMapper.postDTOToMetadata(postDTO);
        return postService.addPost(post, track, picture);
    }

    @PutMapping("/removePost/{postId}")
    @ResponseBody
    public boolean removePost(@PathVariable("postId") Long postId){
        return postService.removePost(postId);
    }

    @GetMapping("/getPosts/{pageNo}")
    @ResponseBody
    public List<Post> getPosts(@PathVariable("pageNo") int pageNo, @RequestHeader (name="Authorization") String token) {
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        return postService.getPosts(currentUser.get().getUserid(), pageNo);
    }

}
