import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getFollowers } from "../../store/subscriptions/subscriptionThunks";
import { useParams, useNavigate } from "react-router-dom";
import UserList from "../../components/Profile/UserList";
import { Container } from "@mui/material";

const FollowersPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { followers, loading, error } = useSelector(
    (state: RootState) => state.subscriptions
  );

  useEffect(() => {
    if (userId) {
      dispatch(getFollowers(userId));
    }
  }, [dispatch, userId]);

  const handleUserClick = (followerId: string) => {
    navigate(`/profile/${followerId}`);
  };

  const mappedFollowers = followers[userId]?.map((follower) => ({
    _id: follower.follower._id || follower._id,
    username: follower.follower.username,
    avatar: follower.follower.avatar,
    bio: follower.follower.bio,
    website: follower.follower.website,
  }));

  return (
    <Container>
      <UserList
        title="Followers"
        users={mappedFollowers}
        loading={loading}
        error={error}
        emptyMessage="No followers yet."
        onUserClick={handleUserClick}
      />
    </Container>
  );
};

export default FollowersPage;
