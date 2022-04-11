package com.openbeats.openbeatsdaw.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openbeats.openbeatsdaw.Service.Conversation.ConversationService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.ConversationsDTO;
import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import com.openbeats.openbeatsdaw.model.Entity.Messages;
import com.openbeats.openbeatsdaw.model.Entity.Post;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.PostDTO;
import com.openbeats.openbeatsdaw.model.mapper.ConversationsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Controller
@RestController
@RequestMapping("/")
public class ChatController {


    @Autowired
    ConversationService conversationService;

    @Autowired
    ConversationsMapper conversationsMapper;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Messages receiveMessage(@Payload Messages message){
        return message;
    }

    @MessageMapping("/private-message")
    public Messages recMessage(@Payload Messages message){
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
        System.out.println(message.toString());
        return message;
    }

    @PostMapping("/addConversation")
    @ResponseBody
    public Conversations addConversation(@RequestPart("json") String json,
                        @RequestHeader (name="Authorization") String token ) throws JsonProcessingException {

        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        ObjectMapper mapper = new ObjectMapper();
        ConversationsDTO conversationsDTO = mapper.readValue(json, ConversationsDTO.class);
//        conversationsDTO.setUserId1(currentUser.get().getUserid());
        Conversations conversations = conversationsMapper.conversationsDTOToMetadata(conversationsDTO);
        return conversationService.addConversation(conversations);
    }

    @GetMapping("/getConversationsList")
    @ResponseBody
    public List<Conversations> getConversationsList(@RequestHeader (name="Authorization") String token) {
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        return conversationService.getConversationsList(currentUser.get().getUserid());
    }

    @GetMapping("/getConversation/{receiverId}")
    @ResponseBody
    public Conversations getConversation(@PathVariable("receiverId")Long receiverId, @RequestHeader (name="Authorization") String token) {
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        return conversationService.getConversation(currentUser.get().getUserid(), receiverId);
    }


}
