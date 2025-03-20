import React from "react";
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Link,
  Container,
} from "@mui/material";
import { User } from "../../types/auth";

interface UserListProps {
  title: string;
  users: User[] | undefined;
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  onUserClick?: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  error,
  emptyMessage,
  onUserClick,
}) => {
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box>
      {!users || users.length === 0 ? (
        <Typography>{emptyMessage}</Typography>
      ) : (
        <List sx={{ width: "100%", bgcolor: "transparent" }}>
          {users.map((user, index) => (
            <React.Fragment key={user._id}>
              <ListItem
                alignItems="flex-start"
                button={!!onUserClick}
                onClick={onUserClick ? () => onUserClick(user._id) : undefined}
                sx={{
                  cursor: onUserClick ? "pointer" : "default",
                  bgcolor: "transparent",
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={user.username} src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="text.primary"
                      fontWeight="medium"
                    >
                      {user.username}
                    </Typography>
                  }
                  secondary={
                    <>
                      {user.bio && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: "block" }}
                        >
                          {user.bio}
                        </Typography>
                      )}
                      {user.website && (
                        <Box sx={{ mt: 0.5 }}>
                          <Link
                            href={user.website}
                            target="_blank"
                            rel="noopener"
                            onClick={(e) => e.stopPropagation()}
                            color="primary"
                            underline="hover"
                          >
                            {user.website}
                          </Link>
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
              {index < users?.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UserList;
