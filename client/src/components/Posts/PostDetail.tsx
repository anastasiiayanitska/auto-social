import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store/store";
import { getPostById } from "../../store/post/postsThunks.tsx";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import PostInteractions from "../PostInteractions";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch();
  const { singlePost, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!singlePost) {
    return <Typography align="center">Post not found.</Typography>;
  }

  const renderPostContent = () => {
    switch (singlePost.postType) {
      case "image":
        return (
          <CardMedia
            component="img"
            height="400"
            image={
              singlePost.images?.[0]?.url || "https://via.placeholder.com/400"
            }
            alt={singlePost.content}
          />
        );
      case "product":
        return (
          <Box>
            <Typography variant="h6">
              Product Name: {singlePost.product?.title}
            </Typography>
            <Typography variant="body2">
              {singlePost.product?.description}
            </Typography>
          </Box>
        );
      case "service":
        return (
          <Box>
            <Typography variant="h6">
              Service Name: {singlePost.service?.name}
            </Typography>
            <Typography variant="body2">
              {singlePost.service?.description}
            </Typography>
          </Box>
        );
      default:
        return <Typography variant="body1">{singlePost.content}</Typography>;
    }
  };

  return (
    <Box padding={2}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Post Details
          </Typography>
          {renderPostContent()}
        </CardContent>
      </Card>

      {/* Add interactions component */}
      {postId && (
        <PostInteractions
          postId={postId}
          likesCount={singlePost.likesCount || 0}
          commentsCount={singlePost.commentsCount || 0}
        />
      )}
    </Box>
  );
};

export default PostDetail;
