import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../../store/subscriptions/subscriptionThunks";
import { Button, CircularProgress } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

interface FollowButtonProps {
  userId: string;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  size = "medium",
  variant = "contained",
  onFollowChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { followStatus, loading } = useSelector(
    (state: RootState) => state.subscriptions
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isHovering, setIsHovering] = useState(false);

  const isOwnProfile = user && user._id === userId;

  const isFollowing = followStatus[userId] || false;

  useEffect(() => {
    if (isAuthenticated && !isOwnProfile && userId) {
      dispatch(checkFollowStatus(userId));
    }
  }, [dispatch, userId, isAuthenticated, isOwnProfile]);

  useEffect(() => {
    if (onFollowChange) {
      onFollowChange(isFollowing);
    }
  }, [isFollowing, onFollowChange]);

  if (isOwnProfile || !isAuthenticated) {
    return null;
  }

  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };

  const buttonText = isFollowing
    ? isHovering
      ? "Unsubscribe"
      : "Signed"
    : "Sign up";

  const buttonIcon = isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />;
  const buttonColor = isFollowing ? "secondary" : "primary";

  return (
    <Button
      variant={variant}
      size={size}
      color={buttonColor}
      startIcon={buttonIcon}
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        minWidth: "120px",
        ...(isFollowing &&
          isHovering && {
            backgroundColor: "error.main",
            color: "white",
            "&:hover": {
              backgroundColor: "error.dark",
            },
          }),
      }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
    </Button>
  );
};

export default FollowButton;
