import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  Badge,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

interface UserListProps {
  users: any[];
  selectedUserId: string | null;
  unreadCounts: Record<string, number>;
  hasConversationWith: (userId: string) => boolean;
  onSelectUser: (id: string, name: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  selectedUserId,
  unreadCounts,
  hasConversationWith,
  onSelectUser,
}) => {
  // Helper function to get display name
  const getDisplayName = (user: any) => {
    if (user.fullName) return user.fullName;
    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    );
  };

  return (
    <Box elevation={3} sx={{ height: "100%", maxHeight: 600 }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        Contacts
      </Typography>

      <List sx={{ overflow: "auto", maxHeight: 540 }}>
        {users.length > 0 ? (
          users.map((user, index) => {
            const unreadCount = unreadCounts[user._id] || 0;
            const hasUnread = unreadCount > 0;
            const hasConversation = hasConversationWith(user._id);

            return (
              <React.Fragment key={user._id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedUserId === user._id}
                    onClick={() => onSelectUser(user._id, getDisplayName(user))}
                    sx={{
                      backgroundColor: hasUnread
                        ? "rgba(25, 118, 210, 0.08)"
                        : "transparent",
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="error"
                        badgeContent={unreadCount}
                        invisible={!hasUnread}
                      >
                        <Avatar alt={user.username} src={user.avatar} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getDisplayName(user)}
                      primaryTypographyProps={{
                        fontWeight: hasUnread ? "bold" : "normal",
                      }}
                      secondary={hasConversation ? "Active conversation" : null}
                    />
                    {hasConversation && (
                      <ChatIcon
                        fontSize="small"
                        color="primary"
                        sx={{ ml: 1, opacity: 0.7 }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {index < users.length - 1 && <Divider />}
              </React.Fragment>
            );
          })
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography color="text.secondary">
              No contacts available
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default UserList;
