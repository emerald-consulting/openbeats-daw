package com.openbeats.openbeatsdaw.Repository;

import com.openbeats.openbeatsdaw.model.Entity.Notifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationsRepository extends JpaRepository<Notifications, Long> {

    @Query("SELECT p FROM Notifications p WHERE p.notifyForUserId= :userid order by p.createdAt desc")
    Page<Notifications> getNotifications(Long userid, Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Notifications set isRead = 1 WHERE notifyForUserId= :userid")
    void markNotificationsAsRead(Long userid);
}
