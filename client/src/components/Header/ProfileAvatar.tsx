import React from "react";
import { IconButton, Avatar, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProfileAvatarProps {
  avatar?: string;
  isActive: boolean;
}

const ProfileAvatar = ({ avatar, isActive }: ProfileAvatarProps) => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Profile" placement="right">
      <IconButton
        onClick={() => navigate("/me")}
        sx={{
          mb: 3,
          p: 0.5,
          border: isActive ? "1px solid #FF6B01" : "1px solid transparent",
          transition: "all 0.2s ease-in-out",
          background: isActive ? "rgba(255, 107, 1, 0.05)" : "transparent",
          "&:hover": {
            background: "rgba(255, 107, 1, 0.05)",
            transform: "scale(1.05)",
          },
        }}
      >
        <Avatar
          alt="Profile"
          src={avatar}
          sx={{
            width: 40,
            height: 40,
            boxShadow: isActive ? "0 0 0 2px rgba(255, 107, 1, 0.3)" : "none",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default ProfileAvatar;
