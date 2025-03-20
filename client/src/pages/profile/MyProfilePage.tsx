import React, { useEffect } from "react";
import { Container, Box, Divider, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getMyPosts } from "../../store/post/postsThunks";
import GetMyProfile from "../../components/Profile/GetMyProfile";
import PostsList from "../../components/Posts/PostsList";
import CreatePostButton from "../../components/Posts/CreatePostButton";

const MyProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myPosts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(getMyPosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <Box>
      <GetMyProfile />
      <CreatePostButton />
      <Divider sx={{ my: 4 }} />

      {loading && myPosts.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          minHeight="200px"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Container>
          <PostsList posts={myPosts} loading={loading} error={error} />
        </Container>
      )}
    </Box>
  );
};

export default MyProfilePage;
