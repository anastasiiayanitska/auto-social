import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { getAllPosts } from "../../store/post/postsThunks.tsx";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  CardMedia,
} from "@mui/material";

const PostsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handlePostClick = (postId: string) => {
    console.log(postId);
    navigate(`/posts/${postId}`);
  };

  const renderPostCard = (post: any) => {
    switch (post.postType) {
      case "image":
        return (
          <Card
            onClick={() => handlePostClick(post._id)}
            sx={{ cursor: "pointer" }}
          >
            <CardMedia
              component="img"
              height="140"
              image={post.images?.[0]?.url || "https://via.placeholder.com/150"}
              alt={post.content}
            />
            <CardContent>
              <Typography variant="h6">{post.content}</Typography>
            </CardContent>
          </Card>
        );
      case "text":
        return (
          <Card
            onClick={() => handlePostClick(post._id)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Typography variant="h5" color="primary">
                {post.content}
              </Typography>
            </CardContent>
          </Card>
        );
      case "product":
        return (
          <Card
            onClick={() => handlePostClick(post._id)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Typography variant="h6">
                Product: {post.product?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {post.product?.description}
              </Typography>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card
            onClick={() => handlePostClick(post._id)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Typography variant="h6">{post.content}</Typography>
            </CardContent>
          </Card>
        );
    }
  };

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

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        All Posts
      </Typography>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            {renderPostCard(post)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostsList;
