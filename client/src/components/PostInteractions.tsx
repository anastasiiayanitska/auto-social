import React from "react";
import { Box, Divider, Card, CardActions, Typography } from "@mui/material";
import LikeButton from "./likeAndSave/LikeButton";
import CommentsSection from "./comments/CommentsSection";

const PostInteractions = ({ postId, likesCount = 0 }) => {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <LikeButton postId={postId} likesCount={likesCount} />
      </CardActions>
      <Divider />
      <CommentsSection postId={postId} />
    </Card>
  );
};

export default PostInteractions;
