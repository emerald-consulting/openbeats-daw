package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Service.ConversationsService;
import com.openbeats.openbeatsdaw.Service.MessagesService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.ConversationDTO;
import com.openbeats.openbeatsdaw.model.Entity.Conversations;
import com.openbeats.openbeatsdaw.model.Entity.Messages;
import com.openbeats.openbeatsdaw.model.Entity.User;
import com.openbeats.openbeatsdaw.model.MessageDTO;
import com.openbeats.openbeatsdaw.model.mapper.ConversationMapper;
import com.openbeats.openbeatsdaw.model.mapper.MessagesMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
@AllArgsConstructor
@Slf4j
public class ConversationsController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    ConversationMapper conversationMapper;

    @Autowired
    MessagesMapper messagesMapper;

    @Autowired
    ConversationsService conversationsService;

    @Autowired
    MessagesService messagesService;

    @PostMapping("/startConversation/{userId}")
    public Conversations startConversation(@PathVariable("userId") Long userId,
                                               @RequestHeader(name="Authorization") String token) {
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        Conversations prevConversation = conversationsService.findByUserIds(currentUser.get().getUserid(), userId);
        if(prevConversation != null && prevConversation.getConversationId() > 0) {
            return prevConversation;
        }
        ConversationDTO conversationDTO = new ConversationDTO();
        conversationDTO.setUserId1(currentUser.get().getUserid());
        conversationDTO.setUserId2(userId);
        Conversations conversations = conversationMapper.conversationDTOToMetadata(conversationDTO);
        return conversationsService.startConversation(conversations);
    }

    @PostMapping("/connectConversation/{conversationId}")
    public ResponseEntity<Long> connect(@PathVariable("conversationId") Long conversationId) {
        HttpHeaders responseHeaders = new HttpHeaders();
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + conversationId,conversationId);
        return ResponseEntity.ok().headers(responseHeaders).body(conversationId);
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<Messages> sendMessage(@RequestBody MessageDTO messageDTO,
                                                @RequestHeader (name="Authorization") String token){
        HttpHeaders responseHeaders = new HttpHeaders();
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        messageDTO.setSenderId(currentUser.get().getUserid());
        messageDTO.setIsRead(false);
        messageDTO.setCreatedAt(new Date());
        Messages message = messagesMapper.messagesDTOToMetadata(messageDTO);
        Messages res = messagesService.save(message);
        conversationsService.updateDateByConversationId(res.getConversationId());
        simpMessagingTemplate.convertAndSend("/topic/session-progress/" + res.getConversationId(),res);
        return ResponseEntity.ok().headers(responseHeaders).body(res);
    }

    @GetMapping("/getAllConversations")
    @ResponseBody
    public List<Conversations> getAllConversations( @RequestHeader (name="Authorization") String token){
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        return conversationsService.getAllConversationsByUserId(currentUser.get().getUserid());
    }

    @GetMapping("/getMessages/{conversationId}/{pageNo}")
    @ResponseBody
    public Page<Messages> getMessages(@PathVariable("conversationId") Long conversationId,
                                      @PathVariable("pageNo") int pageNo,
                                      @RequestHeader (name="Authorization") String token){
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        messagesService.markAsRead(currentUser.get().getUserid(), conversationId);
        return messagesService.getMessagesByConversationId(conversationId, pageNo);
    }

    @GetMapping("/markAsRead/{messageId}")
    @ResponseBody
    public boolean markAsReadById(@PathVariable("messageId") Long messageId){
        return messagesService.markAsReadById(messageId);
    }

    @GetMapping("/getLastMessage/{conversationId}")
    @ResponseBody
    public Messages getLastMessage(@PathVariable("conversationId") Long conversationId){
        return messagesService.getLastMessage(conversationId);
    }

}
