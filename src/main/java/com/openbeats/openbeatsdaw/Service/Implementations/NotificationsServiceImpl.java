package com.openbeats.openbeatsdaw.Service.Implementations;

import com.openbeats.openbeatsdaw.Repository.NotificationsRepository;
import com.openbeats.openbeatsdaw.Service.NotificationsService;
import com.openbeats.openbeatsdaw.model.Entity.Notifications;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class NotificationsServiceImpl implements NotificationsService {

    @Autowired
    private NotificationsRepository notificationsRepository;

    @Override
    public Page<Notifications> getNotifications(Long userid, int pageNo) {
        Pageable pageable = PageRequest.of(pageNo, 50);
        Page<Notifications> notifications = notificationsRepository.getNotifications(userid, pageable);
        return notifications;
    }

    @Override
    public boolean markNotificationsAsRead(Long userid) {
        notificationsRepository.markNotificationsAsRead(userid);
        return true;
    }
}
