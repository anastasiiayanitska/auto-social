import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUserProfileById } from "../../store/auth/profileThunks";
import { getUserPosts } from "../../store/post/postsThunks";
import PostsList from "../../components/Posts/PostsList";
import ProfileInfo from "../../components/Profile/ProfileInfo";

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    userPosts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      dispatch(fetchUserProfileById(id))
        .unwrap()
        .then(() => {
          setIsLoading(false);

          dispatch(getUserPosts(id));
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box my={4}>
          <Alert severity="error">Error: {error}</Alert>
        </Box>
      </Container>
    );
  }

  const userPostsArray = id && userPosts[id] ? userPosts[id] : [];

  return (
    <Box>
      <ProfileInfo userId={id || ""} />
      <Divider sx={{ my: 4 }} />
      {postsLoading && userPostsArray.length === 0 ? (
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
          <PostsList
            posts={userPostsArray}
            loading={postsLoading}
            error={postsError}
          />
        </Container>
      )}
    </Box>
  );
};

export default UserProfilePage;
