import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Pagination,
  CircularProgress,
  Container,
} from "@mui/material";
import { Post, ProductPost, ServicePost } from "../../types/social.types";
import RegularPostCard from "./cards/RegularPostCard";
import ProductPostCard from "./cards/ProductPostCard";
import ServicePostCard from "./cards/ServicePostCard";

interface PostsListProps {
  posts: Post[] | ProductPost[] | ServicePost[];
  loading?: boolean;
  error?: string | null;
  limit?: number;
}

const PostsList: React.FC<PostsListProps> = ({
  posts,
  loading = false,
  error = null,
  limit = 10,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (posts.length > 0) {
      console.log(
        "PostsList received post IDs:",
        posts.map((post) => post._id)
      );
    }
  }, [posts]);

  const handlePostClick = (post: Post) => {
    const postId = post._id;
    console.log("Navigate to post:", postId);

    if (postId) {
      navigate(`/posts/${postId}`);
    } else {
      console.error("Post ID is undefined or null:", post);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const renderPostCard = (post: Post) => {
    switch (post.postType) {
      case "regular":
        return <RegularPostCard post={post} onClick={handlePostClick} />;
      case "product":
        return <ProductPostCard post={post} onClick={handlePostClick} />;
      case "service":
        return <ServicePostCard post={post} onClick={handlePostClick} />;
      default:
        return <RegularPostCard post={post} onClick={handlePostClick} />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
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

  if (posts.length === 0 && !loading) {
    return (
      <Box padding={2}>
        <Typography align="center" color="text.secondary">
          No posts to display
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {paginatedPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id || post.id}>
            {renderPostCard(post)}
          </Grid>
        ))}
      </Grid>

      {posts.length > limit && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(posts.length / limit)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PostsList;
