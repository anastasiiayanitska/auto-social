import React from "react";
import { Badge, IconButton } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

interface NotificationBadgeProps {
  unreadCount: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  id?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  unreadCount,
  onClick,
  id,
}) => {
  return (
    <IconButton
      color="inherit"
      aria-describedby={id}
      onClick={onClick}
      size="large"
    >
      <Badge badgeContent={unreadCount} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};
