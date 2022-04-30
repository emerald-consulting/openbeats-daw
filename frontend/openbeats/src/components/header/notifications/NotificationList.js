import NotificationListItem from "./notificationListItem/NotificationListItem";
import classes from './NotificationList.module.css';
import { useEffect, useRef } from "react";

const NotificationList = ({ data, onClickNotificationHandler }) => {

    const myRef = useRef();

  const handleClickOutside = (event) => {
    if (myRef.current && !myRef.current.contains(event.target)) {
        onClickNotificationHandler();
    }
};

useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
        document.removeEventListener('click', handleClickOutside, true);
    };
}, []);

  return (
    <div
      ref={myRef}
      className={classes.notifications}
    >
      {
        data.map((item) => <NotificationListItem key={`notify${item.notifyId}`} details={item} onClickNotificationHandler={onClickNotificationHandler} />)}
    </div>
  );
};

export default NotificationList;
