import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../store/features/notificationSlice";
import { Popover, Box, Button } from "@mui/material";

import { NotificationsList } from "./NotificationsList";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../../utils/notificationApi";

const NotificationDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(
    (state: RootState) => state.notifications
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (currentUser?._id) {
      fetchNotifications(currentUser._id)
        .then((data) => {
          dispatch(setNotifications(data));
        })
        .catch((err) => {
          console.error("Error fetching notifications:", err);
        });
    }
  }, [currentUser?._id, dispatch]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    event.preventDefault();

    markAsRead(notificationId)
      .then(() => {
        dispatch(markNotificationAsRead(notificationId));
      })
      .catch((err) => {
        console.error("Error marking notification as read:", err);
      });
  };

  const handleMarkAllAsRead = () => {
    if (!currentUser?._id) return;

    markAllAsRead(currentUser._id)
      .then(() => {
        dispatch(markAllNotificationsAsRead());
      })
      .catch((err) => {
        console.error("Error marking all notifications as read:", err);
      });
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  if (!currentUser) return null;

  return (
    <>
      <NotificationBadge
        unreadCount={unreadCount}
        onClick={handleClick}
        id={id}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 500,
            overflow: "hidden",
          },
        }}
      >
        <NotificationHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        <NotificationsList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
        />

        <Box
          sx={{
            p: 1,
            borderTop: 1,
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Button
            component={Link}
            to="/notifications"
            color="primary"
            onClick={handleClose}
            fullWidth
          >
            View all notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
};
