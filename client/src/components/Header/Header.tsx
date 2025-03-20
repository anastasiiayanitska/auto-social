import React, { useState } from "react";
import { Box, Divider } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import ProfileAvatar from "./ProfileAvatar";
import NavigationMenu from "./NavigationMenu";
import NotificationIcons from "./NotificationIcons";
import SettingsMenu from "./SettingsMenu";
import { useNotifications } from "../../hooks/useNotifications";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { hasUnreadMessages, unreadNotifications } = useNotifications();

  const isActive = (path: string) => {
    if (path === "/chat") {
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  };

  const handleSettingsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "70px",
        backgroundColor: "rgba(25, 25, 25, 0.9)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 3,
        paddingBottom: 3,
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <ProfileAvatar avatar={user?.avatar} isActive={isActive("/me")} />

      <Divider sx={{ width: "40%", my: 1, opacity: 0.3 }} />

      <NavigationMenu isActive={isActive} />

      <Divider sx={{ width: "40%", my: 1, opacity: 0.3 }} />

      <NotificationIcons
        hasUnreadMessages={hasUnreadMessages}
        unreadNotifications={unreadNotifications}
        isActive={isActive}
      />

      <Divider sx={{ width: "40%", my: 1, opacity: 0.3 }} />

      {/* SettingsMenu піднятий вище і розташований одразу після блоку сповіщень */}
      <SettingsMenu
        anchorEl={anchorEl}
        handleSettingsOpen={handleSettingsOpen}
        handleSettingsClose={handleSettingsClose}
      />

      {/* Вільний простір перенесений в кінець */}
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
};

export default Header;
