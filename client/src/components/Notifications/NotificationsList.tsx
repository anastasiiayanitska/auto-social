import React from "react";

import { List, Typography, Box, CircularProgress } from "@mui/material";
import { NotificationItem } from "./NotificationItem";
interface Notification {
  _id: string;
  type: string;
  read: boolean;
  createdAt: string;
  senderId?: { _id: string; username: string };
  postId?: { _id: string };
}

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string, event: React.MouseEvent) => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  loading,
  onMarkAsRead,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="textSecondary">No notifications</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: 380, overflow: "auto" }}>
      <List>
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            isLast={index === notifications.length - 1}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </List>
    </Box>
  );
};
