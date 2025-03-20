import React, { useEffect, useState } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getUserFeed } from "../../store/post/postsThunks";
import PostsList from "../../components/Posts/PostsList";

const FeedPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feed, loading, error } = useSelector(
    (state: RootState) => state.posts
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(getUserFeed({ page, limit }));
  }, [dispatch, page, limit]);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {loading && feed.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            minHeight="200px"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <PostsList posts={feed} loading={loading} error={error} />
        )}
      </Box>
    </Container>
  );
};

export default FeedPage;
