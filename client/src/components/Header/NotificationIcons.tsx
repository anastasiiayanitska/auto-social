import React from "react";
import { IconButton, Badge, Tooltip, Box } from "@mui/material";
import {
  Send as MessageIcon,
  Notifications as NotificationIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface NotificationIconsProps {
  hasUnreadMessages: boolean;
  unreadNotifications: number;
  isActive: (path: string) => boolean;
}

const NotificationIcons = ({
  hasUnreadMessages,
  unreadNotifications,
  isActive,
}: NotificationIconsProps) => {
  const navigate = useNavigate();

  const badgeStyle = {
    "& .MuiBadge-badge": {
      width: "10px",
      height: "10px",
      minWidth: "10px",
      minHeight: "10px",
      borderRadius: "50%",
      backgroundColor: "#FF6B01",
      color: "#FF6B01",
      boxShadow: "0 0 0 2px rgba(25, 25, 25, 0.9)",
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Notifications with badge */}
      <Tooltip title="Notifications">
        <IconButton onClick={() => navigate("/notifications")}>
          <Badge variant="dot" invisible={!unreadNotifications} sx={badgeStyle}>
            <NotificationIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Chat">
        <IconButton onClick={() => navigate("/chat")}>
          <Badge variant="dot" invisible={!hasUnreadMessages} sx={badgeStyle}>
            <MessageIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Search moved below chat */}
      <Tooltip title="Search" placement="right">
        <IconButton
          onClick={() => navigate("/search-product")}
          sx={{
            color: isActive("/search-product")
              ? "#FF6B01"
              : "rgba(255, 255, 255, 0.7)",
            backgroundColor: isActive("/search-product")
              ? "rgba(255, 107, 1, 0.05)"
              : "transparent",
            transition: "all 0.2s",
            p: 1.5,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              transform: "translateY(-2px)",
              color: isActive("/search-product") ? "#FF8C3A" : "white",
            },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NotificationIcons;
