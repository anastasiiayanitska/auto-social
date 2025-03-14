import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  likePost,
  unlikePost,
  checkLikeStatus,
} from "../../store/post/interactionThunks";
import {
  Typography,
  IconButton,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const LikeButton = ({ postId, likesCount = 0 }) => {
  const dispatch = useDispatch();
  const likeStatus = useSelector((state: RootState) =>
    state.interactions.likeStatus.find((status) => status.postId === postId)
  );

  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(checkLikeStatus(postId)).finally(() => setLoading(false));
  }, [dispatch, postId]);

  const handleLikeToggle = async () => {
    setLoading(true);
    try {
      if (likeStatus?.liked) {
        await dispatch(unlikePost(postId));
        setLocalLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await dispatch(likePost(postId));
        setLocalLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title={likeStatus?.liked ? "Unlike" : "Like"}>
        <IconButton
          onClick={handleLikeToggle}
          disabled={loading}
          color="primary"
          size="small"
        >
          {loading ? (
            <CircularProgress size={16} />
          ) : likeStatus?.liked ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Tooltip>
      <Typography variant="body2" color="text.secondary">
        {localLikesCount}
      </Typography>
    </Box>
  );
};

export default LikeButton;
