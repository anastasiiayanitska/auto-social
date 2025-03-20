import React from "react";
import { Typography, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const EmptyChatPlaceholder: React.FC = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        height: 600,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        p: 2,
      }}
    >
      <PersonIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
      <Typography color="text.secondary">
        Select a user to start a chat
      </Typography>
    </Paper>
  );
};

export default EmptyChatPlaceholder;
