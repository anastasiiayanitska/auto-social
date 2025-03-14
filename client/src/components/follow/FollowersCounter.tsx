import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  getFollowers,
  getFollowing,
} from "../../store/subscriptions/subscriptionThunks";
import { Typography, Box, Button, Badge, Tooltip } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

interface FollowCountersProps {
  userId: string;
  variant?: "text" | "buttons" | "badges";
  showIcons?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: (type: "followers" | "following") => void;
}

const FollowCounters: React.FC<FollowCountersProps> = ({
  userId,
  variant = "text",
  showIcons = true,
  size = "medium",
  onClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { followerCounts, followingCounts, loading } = useSelector(
    (state: RootState) => state.subscriptions
  );

  // Отримуємо кількість підписників та підписок
  const followersCount = followerCounts[userId] || 0;
  const followingCount = followingCounts[userId] || 0;

  // Визначаємо розмір тексту в залежності від параметра size
  const getFontSize = () => {
    switch (size) {
      case "small":
        return "0.875rem";
      case "large":
        return "1.25rem";
      default:
        return "1rem";
    }
  };

  useEffect(() => {
    if (userId) {
      // Завантажуємо дані лише якщо вони не були ще завантажені
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

  // Рендеримо в залежності від вибраного варіанту відображення
  if (variant === "buttons") {
    return (
      <Box display="flex" gap={2} my={1}>
        <Button
          variant="outlined"
          onClick={handleFollowersClick}
          startIcon={showIcons ? <PeopleIcon /> : undefined}
          size={size === "small" ? "small" : "medium"}
        >
          {followersCount} підписників
        </Button>
        <Button
          variant="outlined"
          onClick={handleFollowingClick}
          startIcon={showIcons ? <PersonIcon /> : undefined}
          size={size === "small" ? "small" : "medium"}
        >
          {followingCount} підписок
        </Button>
      </Box>
    );
  }

  if (variant === "badges") {
    return (
      <Box display="flex" gap={3} my={1}>
        <Tooltip title="Підписники">
          <Badge
            badgeContent={followersCount}
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={handleFollowersClick}
          >
            <PeopleIcon
              color="action"
              fontSize={size === "small" ? "small" : "medium"}
            />
          </Badge>
        </Tooltip>
        <Tooltip title="Підписки">
          <Badge
            badgeContent={followingCount}
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={handleFollowingClick}
          >
            <PersonIcon
              color="action"
              fontSize={size === "small" ? "small" : "medium"}
            />
          </Badge>
        </Tooltip>
      </Box>
    );
  }

  // За замовчуванням відображаємо текстом
  return (
    <Box display="flex" gap={3} my={1}>
      <Typography
        variant="body1"
        component="span"
        sx={{
          cursor: "pointer",
          fontSize: getFontSize(),
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
        <strong>{followersCount}</strong> підписників
      </Typography>
      <Typography
        variant="body1"
        component="span"
        sx={{
          cursor: "pointer",
          fontSize: getFontSize(),
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
        <strong>{followingCount}</strong> підписок
      </Typography>
    </Box>
  );
};

export default FollowCounters;
