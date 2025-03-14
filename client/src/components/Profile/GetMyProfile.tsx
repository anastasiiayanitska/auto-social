// import React from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import ProfileInfo from "./ProfileInfo";

// const GetMyProfile: React.FC = () => {
//   const { user, isAuthenticated, loading, error } = useSelector(
//     (state: RootState) => state.auth
//   );

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;
//   if (!isAuthenticated || !user) return <p>You are not authorized</p>;
//   console.log("GetMyProfile state:", { loading, isAuthenticated, user });

//   // Оскільки ми вже перевірили все потрібне,
//   // передаємо користувача напряму, без потреби в додаткових завантаженнях
//   return <ProfileInfo userId={user._id} />;
// };

// export default GetMyProfile;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  Avatar,
  Typography,
  Box,
  Paper,
  Divider,
  Link,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FollowCounters from "../follow/FollowersCounter";
import {
  getFollowers,
  getFollowing,
} from "../../store/subscriptions/subscriptionThunks";

const GetMyProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useSelector((state: RootState) => state.auth);

  const {
    followers,
    following,
    loading: subLoading,
    error: subError,
  } = useSelector((state: RootState) => state.subscriptions);

  useEffect(() => {
    // Завантажуємо дані підписників тільки якщо користувач існує і дані ще не були завантажені
    if (user && user._id && !subscriptionsLoaded) {
      console.log("Loading subscription data for user:", user._id);
      setSubscriptionsLoading(true);

      // Load follower and following data when component mounts
      Promise.all([
        dispatch(getFollowers(user._id)).unwrap(),
        dispatch(getFollowing(user._id)).unwrap(),
      ])
        .then(() => {
          console.log("Subscription data loaded successfully");
          setSubscriptionsLoading(false);
          setSubscriptionsLoaded(true);
        })
        .catch((error) => {
          console.error("Error loading subscription data:", error);
          setSubscriptionsLoading(false);
        });
    }
  }, [dispatch, user, subscriptionsLoaded]);

  // Debug logs
  console.log("Auth state:", { user, isAuthenticated, authLoading, authError });
  console.log("Subscription state:", {
    followers,
    following,
    subLoading,
    subError,
  });

  // Показуємо індикатор завантаження лише якщо користувач не завантажений
  if (authLoading && !user) {
    return <Alert severity="info">Loading user data...</Alert>;
  }

  if (authError) {
    return <Alert severity="error">Error loading user: {authError}</Alert>;
  }

  if (!isAuthenticated || !user) {
    return <Alert severity="warning">You are not authorized</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        {/* Показуємо індикатор завантаження підписників тільки під час активного завантаження */}
        {subscriptionsLoading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2">
              Loading subscription data...
            </Typography>
          </Box>
        )}

        {subError && (
          <Box my={2}>
            <Alert severity="error">
              Error loading subscriptions: {subError}
            </Alert>
          </Box>
        )}

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3}>
          {/* Аватар */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              alt={user.username}
              src={user.avatar}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
          </Box>

          {/* Основна інформація */}
          <Box flexGrow={1}>
            <Typography variant="h4" gutterBottom>
              {user.username}
            </Typography>

            {(user.firstName || user.lastName) && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
            )}

            {/* Лічильники підписників/підписок */}
            {user._id && (
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Subscription data:
                </Typography>
                <FollowCounters
                  userId={user._id}
                  variant="text"
                  showIcons={true}
                />
              </Box>
            )}

            {user.bio && (
              <Typography variant="body1" mt={2}>
                {user.bio}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          {user.location && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">{user.location}</Typography>
            </Box>
          )}

          {user.website && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
              <Link
                href={user.website}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ color: "primary.main" }}
              >
                {user.website}
              </Link>
            </Box>
          )}

          {user.email && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">{user.email}</Typography>
            </Box>
          )}

          {user.phoneNumber && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">{user.phoneNumber}</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default GetMyProfile;
