import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import { RootState } from "../../store/store";
import {
  setNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../store/features/notificationSlice";

import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../../utils/notificationApi";

import NotificationHeader from "../../components/Notifications/NotificationHeader";
import NotificationFilters from "../../components/Notifications/NotificationFilters";
import { NotificationsList } from "../../components/Notifications/NotificationsList";
const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(
    (state: RootState) => state.notifications
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?._id) {
      loadNotifications(currentUser._id);
    }
  }, [currentUser?._id, dispatch]);

  const loadNotifications = async (userId: string) => {
    try {
      const data = await fetchNotifications(userId);
      dispatch(setNotifications(data));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      dispatch(markNotificationAsRead(notificationId));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser?._id) return;

    try {
      await markAllAsRead(currentUser._id);
      dispatch(markAllNotificationsAsRead());
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const filterNotifications = () => {
    if (!activeFilter) return notifications;
    return notifications.filter(
      (notification) => notification.type === activeFilter
    );
  };

  const filteredNotifications = filterNotifications();

  if (!currentUser) return null;

  return (
    <Container>
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <NotificationFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <NotificationsList
        notifications={filteredNotifications}
        loading={loading}
        activeFilter={activeFilter}
        onMarkAsRead={handleMarkAsRead}
      />
    </Container>
  );
};

export default NotificationsPage;
