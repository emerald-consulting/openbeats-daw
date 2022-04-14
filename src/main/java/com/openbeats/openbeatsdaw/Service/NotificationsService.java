package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.model.Entity.Notifications;
import org.springframework.data.domain.Page;

public interface NotificationsService {

    public Page<Notifications> getNotifications(Long userid, int pageNo);

}
