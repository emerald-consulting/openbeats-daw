package com.openbeats.openbeatsdaw.controller;

import com.openbeats.openbeatsdaw.Service.NotificationsService;
import com.openbeats.openbeatsdaw.Utils.TokenProvider;
import com.openbeats.openbeatsdaw.model.Entity.Notifications;
import com.openbeats.openbeatsdaw.model.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/")
public class NotificationsController {

    @Autowired
    NotificationsService notificationsService;

    @Autowired
    private TokenProvider tokenProvider;


    @GetMapping("/getNotifications/{pageNo}")
    @ResponseBody
    public Page<Notifications> getNotifications(@PathVariable("pageNo") int pageNo, @RequestHeader(name="Authorization") String token) {

        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        return notificationsService.getNotifications(currentUser.get().getUserid(), pageNo);
    }

    @PutMapping("/markNotificationsAsRead")
    @ResponseBody
    public boolean markNotificationsAsRead(@RequestHeader(name="Authorization") String token){
        Optional<User> currentUser = tokenProvider.getLoggedinUser(token);
        return notificationsService.markNotificationsAsRead(currentUser.get().getUserid());
    }
}
