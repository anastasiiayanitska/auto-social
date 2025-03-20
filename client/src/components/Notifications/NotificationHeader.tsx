import React from "react";
import { Typography, Badge, Button, Box } from "@mui/material";
import {
  Notifications as NotificationsIcon,
  DoneAll,
} from "@mui/icons-material";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  onMarkAllAsRead,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h4" component="h1">
        <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
          <NotificationsIcon fontSize="large" />
        </Badge>
        Notification
      </Typography>
      {unreadCount > 0 && (
        <Button
          variant="outlined"
          startIcon={<DoneAll />}
          onClick={onMarkAllAsRead}
        >
          Mark all as read
        </Button>
      )}
    </Box>
  );
};

export default NotificationHeader;
