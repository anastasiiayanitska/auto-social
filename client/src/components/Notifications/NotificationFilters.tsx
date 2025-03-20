import React from "react";
import { Button, Box } from "@mui/material";
import { ThumbUp, ChatBubbleOutline, PersonAdd } from "@mui/icons-material";
import {
  notificationTypes,
  getNotificationColor,
} from "../../utils/notificationUtils";

interface NotificationFiltersProps {
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  // Mapping for icon components
  const iconComponents: any = {
    ThumbUp: <ThumbUp fontSize="small" />,
    ChatBubbleOutline: <ChatBubbleOutline fontSize="small" />,
    PersonAdd: <PersonAdd fontSize="small" />,
  };

  return (
    <Box display="flex" gap={1} mb={3}>
      <Button
        variant={activeFilter === null ? "contained" : "outlined"}
        onClick={() => setActiveFilter(null)}
      >
        All
      </Button>
      {notificationTypes.map((type) => (
        <Button
          key={type.type}
          variant={activeFilter === type.type ? "contained" : "outlined"}
          startIcon={iconComponents[type.icon]}
          onClick={() => setActiveFilter(type.type)}
          color={
            getNotificationColor(type.type) as
              | "primary"
              | "secondary"
              | "success"
              | "error"
              | "info"
              | "warning"
          }
        >
          {type.label}
        </Button>
      ))}
    </Box>
  );
};

export default NotificationFilters;
