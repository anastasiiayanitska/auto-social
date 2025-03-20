import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getFollowing } from "../../store/subscriptions/subscriptionThunks";
import { useParams, useNavigate } from "react-router-dom";
import UserList from "../../components/Profile/UserList";
import { Container } from "@mui/material";

const FollowingPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { following, loading, error } = useSelector(
    (state: RootState) => state.subscriptions
  );

  useEffect(() => {
    if (userId) {
      dispatch(getFollowing(userId));
    }
  }, [dispatch, userId]);

  const handleUserClick = (followingId: string) => {
    navigate(`/profile/${followingId}`);
  };

  const mappedFollowing = following[userId]?.map((followed) => ({
    _id: followed.following._id || followed._id,
    username: followed.following.username,
    avatar: followed.following.avatar,
    bio: followed.following.bio,
    website: followed.following.website,
  }));

  return (
    <Container>
      <UserList
        title="Following"
        users={mappedFollowing}
        loading={loading}
        error={error}
        emptyMessage="Not following anyone yet."
        onUserClick={handleUserClick}
      />
    </Container>
  );
};

export default FollowingPage;
