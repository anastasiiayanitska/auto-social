import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HandymanIcon from "@mui/icons-material/Handyman";

const CreatePostButton: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <Box
      sx={{
        position: "relative",
        top: 30,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: 0,
        zIndex: 1,
        transform: "translateY(-28px)",
      }}
    >
      <Tooltip title="Create post">
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "50%",
            width: 56,
            height: 56,
            minWidth: 0,
            boxShadow: 3,
          }}
          onClick={handleClick}
        >
          <AddIcon fontSize="large" />
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => handleMenuItemClick("/posts/create/regular")}
          sx={{ gap: 1 }}
        >
          <PostAddIcon color="action" />
          Post
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("/posts/create/product")}
          sx={{ gap: 1 }}
        >
          <ShoppingBagIcon color="action" />
          Product
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("/posts/create/service")}
          sx={{ gap: 1 }}
        >
          <HandymanIcon color="action" />
          Service
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CreatePostButton;
