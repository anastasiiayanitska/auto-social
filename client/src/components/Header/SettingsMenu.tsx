import React from "react";
import { IconButton, Tooltip, Menu, MenuItem, Divider } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface SettingsMenuProps {
  anchorEl: null | HTMLElement;
  handleSettingsOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleSettingsClose: () => void;
}

const SettingsMenu = ({
  anchorEl,
  handleSettingsOpen,
  handleSettingsClose,
}: SettingsMenuProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    handleSettingsClose();
  };

  return (
    <>
      <Tooltip title="Settings" placement="right">
        <IconButton
          onClick={handleSettingsOpen}
          sx={{
            color: Boolean(anchorEl) ? "#FF6B01" : "rgba(255, 255, 255, 0.7)",
            backgroundColor: Boolean(anchorEl)
              ? "rgba(255, 107, 1, 0.05)"
              : "transparent",
            transition: "all 0.2s",
            p: 1.5,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              transform: "translateY(-2px)",
              color: Boolean(anchorEl) ? "#FF8C3A" : "white",
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(35, 35, 35, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            minWidth: 180,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <MenuItem
          onClick={() => handleNavigation("/update")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(255, 107, 1, 0.05)",
            },
          }}
        >
          Edit Profile
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation("/change-password")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(255, 107, 1, 0.05)",
            },
          }}
        >
          Change Password
        </MenuItem>
        <Divider
          sx={{ my: 0.5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        />
        <MenuItem
          onClick={() => handleNavigation("/delete")}
          sx={{
            color: "#ff6b6b",
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(255, 107, 107, 0.05)",
            },
          }}
        >
          Delete Profile
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation("/logout")}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(255, 107, 1, 0.05)",
            },
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenu;
