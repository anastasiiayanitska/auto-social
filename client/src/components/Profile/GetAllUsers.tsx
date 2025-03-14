import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { fetchAllUsers } from "../../store/auth/userThunks";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Link,
  Divider,
  Box,
} from "@mui/material";

const GetAllUsers: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!isAuthenticated || !users) return <p>You are not authorized</p>;

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {users.map((user, index) => (
        <React.Fragment key={user._id}>
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => handleUserClick(user._id)}
            sx={{ cursor: "pointer" }}
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
          {index < users.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default GetAllUsers;
