import React from "react";
import { Link } from "react-router-dom";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  ThumbUp,
  ChatBubbleOutline,
  PersonAdd,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  type: string;
  read: boolean;
  createdAt: string;
  senderId?: { _id: string; username: string };
  postId?: { _id: string };
}

interface NotificationItemProps {
  notification: Notification;
  isLast: boolean;
  onMarkAsRead: (id: string, event: React.MouseEvent) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isLast,
  onMarkAsRead,
}) => {
  const content = renderNotificationContent(notification);

  return (
    <React.Fragment>
      <ListItem
        alignItems="flex-start"
        component={Link}
        to={content.linkTo}
        sx={{
          bgcolor: !notification.read ? "action.hover" : "transparent",
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            bgcolor: "action.selected",
          },
        }}
        onClick={(e) => !notification.read && onMarkAsRead(notification._id, e)}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "action.selected" }}>
            {getNotificationIcon(notification.type)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={content.primary} secondary={content.secondary} />
        {!notification.read && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "primary.main",
              alignSelf: "center",
              mr: 1,
            }}
          />
        )}
      </ListItem>
      {!isLast && <Divider variant="inset" component="li" />}
    </React.Fragment>
  );
};

// Utility functions
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <ThumbUp color="primary" />;
    case "comment":
      return <ChatBubbleOutline color="secondary" />;
    case "follow":
      return <PersonAdd color="success" />;
    default:
      return <NotificationsIcon />;
  }
};

const renderNotificationContent = (notification: Notification) => {
  const senderName = notification.senderId?.username || "User";
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  switch (notification.type) {
    case "like":
      return {
        primary: (
          <Typography variant="body2" noWrap>
            <Box component="span" fontWeight="bold">
              {senderName}
            </Box>{" "}
            liked your post
          </Typography>
        ),
        secondary: timeAgo,
        linkTo: `/posts/${notification.postId?._id}`,
      };
    case "comment":
      return {
        primary: (
          <Typography variant="body2" noWrap>
            <Box component="span" fontWeight="bold">
              {senderName}
            </Box>{" "}
            commented on your post
          </Typography>
        ),
        secondary: timeAgo,
        linkTo: `/posts/${notification.postId?._id}`,
      };
    case "follow":
      return {
        primary: (
          <Typography variant="body2" noWrap>
            <Box component="span" fontWeight="bold">
              {senderName}
            </Box>{" "}
            subscribed to you
          </Typography>
        ),
        secondary: timeAgo,
        linkTo: `/profile/${notification.senderId?._id}`,
      };
    default:
      return {
        primary: "New notification",
        secondary: timeAgo,
        linkTo: "/",
      };
  }
};
