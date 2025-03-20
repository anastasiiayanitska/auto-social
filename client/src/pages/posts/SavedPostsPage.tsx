import React, { useEffect, useState } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getSavedPosts } from "../../store/post/interactionThunks";
import PostsList from "../../components/Posts/PostsList";
import { Post, User } from "../../types/social.types";

interface SavedPostItem {
  _id: string;
  savedPost: Post;
  user: User;
  createdAt: string;
  updatedAt: string;
}

const SavedPostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { savedPosts, loadingSavedPosts } = useSelector(
    (state: RootState) => state.interactions
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [formattedPosts, setFormattedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user) {
      dispatch(getSavedPosts());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (savedPosts && savedPosts.length > 0) {
      const processed = savedPosts.map((item: SavedPostItem) => {
        return {
          ...item.savedPost,
          savedId: item._id,
          username: item.user.username,
        };
      });
      setFormattedPosts(processed);
    } else {
      setFormattedPosts([]);
    }
  }, [savedPosts]);

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box my={4} textAlign="center">
          <Typography variant="h5">
            Please log in to see saved posts.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {loadingSavedPosts ? (
          <Box
            display="flex"
            justifyContent="center"
            minHeight="200px"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        ) : formattedPosts.length === 0 ? (
          <Box my={4} textAlign="center">
            <Typography variant="h6">You have no saved posts yet.</Typography>
          </Box>
        ) : (
          <PostsList
            posts={formattedPosts}
            loading={loadingSavedPosts}
            error={null}
          />
        )}
      </Box>
    </Container>
  );
};

export default SavedPostsPage;
