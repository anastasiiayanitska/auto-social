// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../store/store";
// import {
//   Avatar,
//   Typography,
//   Box,
//   Link,
//   CircularProgress,
//   Alert,
//   Container,
// } from "@mui/material";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import LanguageIcon from "@mui/icons-material/Language";

// import PhoneIcon from "@mui/icons-material/Phone";
// import FollowCounters from "../Follow/FollowersCounter";
// import {
//   getFollowers,
//   getFollowing,
// } from "../../store/subscriptions/subscriptionThunks";

// const GetMyProfile: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
//   const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);

//   const {
//     user,
//     isAuthenticated,
//     loading: authLoading,
//     error: authError,
//   } = useSelector((state: RootState) => state.auth);
//   const { loading: subLoading, error: subError } = useSelector(
//     (state: RootState) => state.subscriptions
//   );

//   useEffect(() => {
//     const loadSubscriptions = async () => {
//       if (user && user._id && !subscriptionsLoaded) {
//         setSubscriptionsLoading(true);
//         try {
//           await dispatch(getFollowers(user._id)).unwrap();
//           await dispatch(getFollowing(user._id)).unwrap();
//           setSubscriptionsLoaded(true);
//         } catch (error) {
//           console.error("Error loading subscriptions", error);
//         } finally {
//           setSubscriptionsLoading(false);
//         }
//       }
//     };

//     loadSubscriptions();
//   }, [dispatch, user, subscriptionsLoaded]);

//   if (authLoading && !user) {
//     return <Alert severity="info">Loading user data...</Alert>;
//   }

//   if (authError) {
//     return <Alert severity="error">Error loading user: {authError}</Alert>;
//   }

//   if (!isAuthenticated || !user) {
//     return <Alert severity="warning">You are not authorized</Alert>;
//   }

//   return (
//     <Container>
//       {subscriptionsLoading && (
//         <Box display="flex" justifyContent="center" my={2}>
//           <CircularProgress size={20} sx={{ mr: 1 }} />
//           <Typography variant="body2">Loading subscription data...</Typography>
//         </Box>
//       )}

//       {subError && (
//         <Box my={2}>
//           <Alert severity="error">
//             Error loading subscriptions: {subError}
//           </Alert>
//         </Box>
//       )}

//       <Box
//         display="flex"
//         flexDirection={{ xs: "column", md: "row" }}
//         gap={4}
//         alignItems="flex-start"
//         color="white"
//         my={3}
//       >
//         {/* Фото */}
//         <Box display="flex" justifyContent="center" alignItems="center">
//           <Avatar
//             alt={user.username}
//             src={user.avatar}
//             sx={{ width: 140, height: 140 }}
//           />
//         </Box>

//         <Box flex={2} minWidth={0}>
//           <Typography variant="h4" gutterBottom>
//             {user.username}
//           </Typography>

//           {(user.firstName || user.lastName) && (
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               {user.firstName} {user.lastName}
//             </Typography>
//           )}

//           {user._id && (
//             <Box my={2}>
//               <FollowCounters userId={user._id} showIcons={true} />
//             </Box>
//           )}

//           {user.bio && (
//             <Typography variant="body1" color="white" mt={1}>
//               {user.bio}
//             </Typography>
//           )}
//         </Box>

//         <Box flex={1} minWidth={0}>
//           {user.location && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Typography variant="body1" color="white">
//                 {user.location}
//               </Typography>
//             </Box>
//           )}

//           {user.website && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Link
//                 href={user.website}
//                 target="_blank"
//                 rel="noopener"
//                 underline="hover"
//                 sx={{ color: "primary.main" }}
//               >
//                 {user.website}
//               </Link>
//             </Box>
//           )}

//           {user.phoneNumber && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Typography variant="body1" color="white">
//                 {user.phoneNumber}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default GetMyProfile;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  Avatar,
  Typography,
  Box,
  Link,
  CircularProgress,
  Alert,
  Container,
  Chip,
  Button,
  Tooltip,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import FollowCounters from "../Follow/FollowersCounter";
import {
  getFollowers,
  getFollowing,
} from "../../store/subscriptions/subscriptionThunks";
import { useNavigate } from "react-router-dom";

const GetMyProfile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch<AppDispatch>();
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useSelector((state: RootState) => state.auth);
  const { loading: subLoading, error: subError } = useSelector(
    (state: RootState) => state.subscriptions
  );
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  useEffect(() => {
    const loadSubscriptions = async () => {
      if (user && user._id && !subscriptionsLoaded) {
        setSubscriptionsLoading(true);
        try {
          await dispatch(getFollowers(user._id)).unwrap();
          await dispatch(getFollowing(user._id)).unwrap();
          setSubscriptionsLoaded(true);
        } catch (error) {
          console.error("Error loading subscriptions", error);
        } finally {
          setSubscriptionsLoading(false);
        }
      }
    };

    loadSubscriptions();
  }, [dispatch, user, subscriptionsLoaded]);

  if (authLoading && !user) {
    return (
      <Box sx={{ py: 4 }}>
        <ProfileSkeleton />
      </Box>
    );
  }

  if (authError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
          }}
        >
          Error loading user: {authError}
        </Alert>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="warning"
          variant="filled"
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
          }}
        >
          You are not authorized to view this profile
        </Alert>
      </Box>
    );
  }

  return (
    <Container>
      {subscriptionsLoading && (
        <Box
          display="flex"
          justifyContent="center"
          py={2}
          sx={{
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Loading subscription data...</Typography>
        </Box>
      )}

      {subError && (
        <Box my={2}>
          <Alert
            severity="error"
            variant="filled"
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
            }}
          >
            Error loading subscriptions
          </Alert>
        </Box>
      )}

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: 3, md: 6 }}
        alignItems={{ xs: "center", md: "flex-start" }}
        justifyContent="center"
        color="white"
        my={{ xs: 3, md: 4 }}
        px={{ xs: 2, md: 4 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box
            sx={{
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                opacity: 0.5,
                zIndex: -1,
              },
            }}
          >
            <Avatar
              alt={user.username}
              src={user.avatar}
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                border: "4px solid rgba(35, 35, 35, 0.9)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleNavigation("/update")}
            sx={{
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              fontSize: "0.8rem",
            }}
          >
            Edit Profile
          </Button>
        </Box>

        <Box
          flex={2}
          minWidth={0}
          display="flex"
          flexDirection="column"
          alignItems={{ xs: "center", md: "flex-start" }}
          textAlign={{ xs: "center", md: "left" }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
              letterSpacing: "-0.5px",
            }}
          >
            {user.username}
          </Typography>

          {(user.firstName || user.lastName) && (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 2,
                fontWeight: 500,
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
          )}

          {user._id && (
            <Box
              my={2}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                width: "100%",
              }}
            >
              <FollowCounters userId={user._id} showIcons={true} />
            </Box>
          )}

          {user.bio && (
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                maxWidth: "600px",
                color: "text.primary",
                lineHeight: 1.6,
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: 2,
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {user.bio}
            </Typography>
          )}
        </Box>

        <Box
          flex={1}
          minWidth={0}
          alignSelf={{ xs: "center", md: "flex-start" }}
          display="flex"
          flexDirection="column"
          gap={2}
          p={2}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "16px",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            mt: { xs: 0, md: 5 },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              mb: 1,
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            Contact Information
          </Typography>

          {user.location && (
            <Box display="flex" alignItems="center">
              <LocationOnIcon
                sx={{ mr: 1.5, color: "primary.light", fontSize: "1.2rem" }}
              />
              <Typography variant="body2">{user.location}</Typography>
            </Box>
          )}

          {user.website && (
            <Box display="flex" alignItems="center">
              <LanguageIcon
                sx={{ mr: 1.5, color: "primary.light", fontSize: "1.2rem" }}
              />
              <Link
                href={user.website}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                {user.website}
              </Link>
            </Box>
          )}

          {user.phoneNumber && (
            <Box display="flex" alignItems="center">
              <PhoneIcon
                sx={{ mr: 1.5, color: "primary.light", fontSize: "1.2rem" }}
              />
              <Typography variant="body2">{user.phoneNumber}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

// Скелетон для загрузки профиля
const ProfileSkeleton = () => (
  <Box
    display="flex"
    flexDirection={{ xs: "column", md: "row" }}
    gap={4}
    alignItems="flex-start"
    p={3}
  >
    <Skeleton
      variant="circular"
      width={160}
      height={160}
      animation="wave"
      sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
    />

    <Box flex={2}>
      <Skeleton
        variant="text"
        width={180}
        height={50}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
      <Skeleton
        variant="text"
        width={120}
        height={30}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", my: 1 }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={100}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: 2, mt: 3 }}
      />
    </Box>

    <Box flex={1}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={140}
        animation="wave"
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: 2 }}
      />
    </Box>
  </Box>
);

export default GetMyProfile;
