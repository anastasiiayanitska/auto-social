import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Home as HomeIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface NavigationItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

interface NavigationMenuProps {
  isActive: (path: string) => boolean;
}

const NavigationMenu = ({ isActive }: NavigationMenuProps) => {
  const navigate = useNavigate();

  const menuItems: NavigationItem[] = [
    { path: "/feed", icon: <HomeIcon />, label: "Feed" },
    { path: "/posts", icon: <ArticleIcon />, label: "Posts" },
    { path: "/all-users", icon: <PeopleIcon />, label: "Profiles" },
    { path: "/save-posts", icon: <BookmarkIcon />, label: "Saved Posts" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
      {menuItems.map((item) => (
        <Tooltip title={item.label} placement="right" key={item.path}>
          <IconButton
            onClick={() => navigate(item.path)}
            sx={{
              color: isActive(item.path)
                ? "#FF6B01"
                : "rgba(255, 255, 255, 0.7)",
              backgroundColor: isActive(item.path)
                ? "rgba(255, 107, 1, 0.05)"
                : "transparent",
              transition: "all 0.2s",
              p: 1.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                transform: "translateY(-2px)",
                color: isActive(item.path) ? "#FF8C3A" : "white",
              },
            }}
          >
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default NavigationMenu;
