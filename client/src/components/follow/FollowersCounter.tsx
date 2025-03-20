import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  getFollowers,
  getFollowing,
} from "../../store/subscriptions/subscriptionThunks";
import { Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

interface FollowCountersProps {
  userId: string;
  showIcons?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: (type: "followers" | "following") => void;
}

const FollowCounters: React.FC<FollowCountersProps> = ({
  userId,
  showIcons = true,
  size = "medium",
  onClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { followerCounts, followingCounts } = useSelector(
    (state: RootState) => state.subscriptions
  );

  const followersCount = followerCounts[userId] || 0;
  const followingCount = followingCounts[userId] || 0;

  useEffect(() => {
    if (userId) {
      if (followerCounts[userId] === undefined) {
        dispatch(getFollowers(userId));
      }
      if (followingCounts[userId] === undefined) {
        dispatch(getFollowing(userId));
      }
    }
  }, [dispatch, userId, followerCounts, followingCounts]);

  const handleFollowersClick = () => {
    if (onClick) {
      onClick("followers");
    } else {
      navigate(`/profile/${userId}/followers`);
    }
  };

  const handleFollowingClick = () => {
    if (onClick) {
      onClick("following");
    } else {
      navigate(`/profile/${userId}/following`);
    }
  };

  return (
    <Box display="flex" gap={3} my={1}>
      <Typography
        variant="body1"
        component="span"
        sx={{
          cursor: "pointer",
          fontSize: "24",
          fontWeight: "medium",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={handleFollowersClick}
      >
        {showIcons && (
          <PeopleIcon
            fontSize="inherit"
            sx={{ mr: 0.5, verticalAlign: "middle" }}
          />
        )}
        <strong>{followersCount}</strong> followers
      </Typography>
      <Typography
        variant="body1"
        component="span"
        sx={{
          cursor: "pointer",
          fontSize: "24",
          fontWeight: "medium",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={handleFollowingClick}
      >
        {showIcons && (
          <PersonIcon
            fontSize="inherit"
            sx={{ mr: 0.5, verticalAlign: "middle" }}
          />
        )}
        <strong>{followingCount}</strong> following
      </Typography>
    </Box>
  );
};

export default FollowCounters;
