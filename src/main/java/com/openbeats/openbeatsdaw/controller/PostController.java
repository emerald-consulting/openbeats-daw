package com.openbeats.openbeatsdaw.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openbeats.openbeatsdaw.Service.PostService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.PostDTO;
import com.openbeats.openbeatsdaw.model.UserAndPosts;
import com.openbeats.openbeatsdaw.model.mapper.PostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
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
                        @RequestParam(value = "track", required = false) MultipartFile track,
                        @RequestParam(value = "picture", required = false) MultipartFile picture,
                        @RequestHeader (name="Authorization") String token ) throws JsonProcessingException {

        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        ObjectMapper mapper = new ObjectMapper();
        PostDTO postDTO = mapper.readValue(json, PostDTO.class);
        postDTO.setUserId(currentUser.get().getUserid());
        Post post = postMapper.postDTOToMetadata(postDTO);
        return postService.addPost(post, track, picture);
    }



    @PutMapping("/post")
    @ResponseBody
    public Post updatePost(@RequestPart("json") String json,
                           @RequestParam(value = "track", required = false) MultipartFile track,
                           @RequestParam(value = "picture", required = false) MultipartFile picture,
                           @RequestHeader (name="Authorization") String token ) throws JsonProcessingException {

        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        ObjectMapper mapper = new ObjectMapper();
        PostDTO postDTO = mapper.readValue(json, PostDTO.class);
        postDTO.setUserId(currentUser.get().getUserid());
        Post post = postMapper.postDTOToMetadata(postDTO);
        return postService.updatePost(post, track, picture);
    }

    @PutMapping("/removePost/{postId}")
    @ResponseBody
    public boolean removePost(@PathVariable("postId") Long postId){
        return postService.removePost(postId);
    }

    @GetMapping("/getPosts/{pageNo}")
    @ResponseBody
    public Page<Post> getPosts(@PathVariable("pageNo") int pageNo, @RequestHeader (name="Authorization") String token) {
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        return postService.getPosts(currentUser.get().getUserid(), pageNo);
    }

    @GetMapping("/getPostsByUser/{userId}/{pageNo}")
    @ResponseBody
    public Page<Post> getPostsByUser(@PathVariable("userId") Long userId, @PathVariable("pageNo") int pageNo) {
        return postService.getPostsByUser(userId, pageNo);
    }

    @GetMapping("/getPostsLikedByUser/{userId}/{pageNo}")
    @ResponseBody
    public Page<Post> getPostsLikedByUser(@PathVariable("userId") Long userId, @PathVariable("pageNo") int pageNo) {
        return postService.getPostsLikedByUser(userId, pageNo);
    }

    @GetMapping("/getMediaPostsByUser/{userId}/{pageNo}")
    @ResponseBody
    public Page<Post> getMediaPostsByUser(@PathVariable("userId") Long userId, @PathVariable("pageNo") int pageNo) {
        return postService.getMediaPostsByUser(userId, pageNo);
    }

    @GetMapping("/getAllGenre")
    @ResponseBody
    public List<String> getAllGenre() {
        return postService.getAllGenre();
    }

    @GetMapping("/getTrending")
    @ResponseBody
    public List<Post> getTrending() {
        return postService.getTrending();
    }

    @GetMapping("/getAnnouncements/{username}")
    @ResponseBody
    public List<Post> getAnnouncements(@PathVariable("username") String username) {
        return postService.getAnnouncements(username);
    }

    @GetMapping("/getNewlyReleased")
    @ResponseBody
    public List<Post> getNewlyReleased() {
        return postService.getNewlyReleased();
    }

    @GetMapping("/search/{searchText}")
    @ResponseBody
    public UserAndPosts search(@PathVariable("searchText") String searchText,@RequestHeader(name = "Authorization") String token) {
        User currentUser = tokenProvider.getLoggedinUser(token).get();
        return postService.search(searchText,currentUser.getUserid());
    }

    @GetMapping("/allSearchPosts/{searchText}")
    @ResponseBody
    public List<Post> allSearchPosts(@PathVariable("searchText") String searchText) {
        return postService.allSearchPosts(searchText);
    }

}
