// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../store/store";
// import { fetchUserProfileById } from "../../store/auth/profileThunks";
// import { User } from "../../types/auth";
// import {
//   Avatar,
//   Typography,
//   Box,
//   Button,
//   Link,
//   CircularProgress,
//   Alert,
//   Container,
// } from "@mui/material";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import LanguageIcon from "@mui/icons-material/Language";
// import ChatIcon from "@mui/icons-material/Chat";
// import PhoneIcon from "@mui/icons-material/Phone";

// import FollowButton from "../Follow/FollowButton";
// import FollowCounters from "../Follow/FollowersCounter";
// import { useNavigate } from "react-router-dom";

// interface ProfileProps {
//   userId?: string;
// }

// const ProfileInfo: React.FC<ProfileProps> = ({ userId }) => {
//   const { id } = useParams<{ id: string }>();
//   const profileId = userId || id;
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const [userProfile, setUserProfile] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { user: currentUser, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const isOwnProfile = currentUser && currentUser._id === profileId;

//   useEffect(() => {
//     if (isOwnProfile && currentUser) {
//       setUserProfile(currentUser);
//       setIsLoading(false);
//       return;
//     }

//     if (profileId) {
//       setIsLoading(true);
//       dispatch(fetchUserProfileById(profileId))
//         .unwrap()
//         .then((profile) => {
//           setUserProfile(profile);
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           setError(typeof err === "string" ? err : "Failed to load profile");
//           setIsLoading(false);
//         });
//     }
//   }, [dispatch, profileId, currentUser, isOwnProfile]);

//   if (!isAuthenticated)
//     return <Alert severity="warning">You are not authorized</Alert>;
//   if (isLoading)
//     return (
//       <Box display="flex" justifyContent="center" my={4}>
//         <CircularProgress />
//       </Box>
//     );
//   if (error) return <Alert severity="error">Error: {error}</Alert>;
//   if (!userProfile) return <Alert severity="info">User not found</Alert>;
//   const handleStartChat = () => {
//     navigate(`/chat/${userId}`);
//   };

//   return (
//     <Container>
//       <Box
//         display="flex"
//         flexDirection={{ xs: "column", md: "row" }}
//         gap={4}
//         alignItems="flex-start"
//         color="white"
//         my={3}
//       >
//         <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
//           <Avatar
//             alt={userProfile.username}
//             src={userProfile.avatar}
//             sx={{ width: 140, height: 140 }}
//           />
//           {profileId && !isOwnProfile && <FollowButton userId={profileId} />}
//           {profileId && !isOwnProfile && (
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<ChatIcon />}
//               onClick={handleStartChat}
//             >
//               Write
//             </Button>
//           )}
//         </Box>

//         <Box flex={2} minWidth={0}>
//           <Typography variant="h4" gutterBottom>
//             {userProfile.username}
//           </Typography>

//           {(userProfile.firstName || userProfile.lastName) && (
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               {userProfile.firstName} {userProfile.lastName}
//             </Typography>
//           )}

//           {profileId && (
//             <FollowCounters
//               userId={profileId}
//               variant="text"
//               showIcons={true}
//             />
//           )}

//           {userProfile.bio && (
//             <Typography variant="body1" mt={2}>
//               {userProfile.bio}
//             </Typography>
//           )}
//         </Box>

//         <Box flex={1} minWidth={0}>
//           {userProfile.location && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Typography variant="body1">{userProfile.location}</Typography>
//             </Box>
//           )}

//           {userProfile.website && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Link
//                 href={userProfile.website}
//                 target="_blank"
//                 rel="noopener"
//                 underline="hover"
//                 sx={{ color: "primary.main" }}
//               >
//                 {userProfile.website}
//               </Link>
//             </Box>
//           )}

//           {userProfile.phoneNumber && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Typography variant="body1">{userProfile.phoneNumber}</Typography>
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default ProfileInfo;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUserProfileById } from "../../store/auth/profileThunks";
import { User } from "../../types/auth";
import {
  Avatar,
  Typography,
  Box,
  Button,
  Link,
  CircularProgress,
  Alert,
  Container,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";

import FollowButton from "../Follow/FollowButton";
import FollowCounters from "../Follow/FollowersCounter";

interface ProfileProps {
  userId?: string;
}

const ProfileInfo: React.FC<ProfileProps> = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { id } = useParams<{ id: string }>();
  const profileId = userId || id;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user: currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const isOwnProfile = currentUser && currentUser._id === profileId;

  useEffect(() => {
    if (isOwnProfile && currentUser) {
      setUserProfile(currentUser);
      setIsLoading(false);
      return;
    }

    if (profileId) {
      setIsLoading(true);
      dispatch(fetchUserProfileById(profileId))
        .unwrap()
        .then((profile) => {
          setUserProfile(profile);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(typeof err === "string" ? err : "Failed to load profile");
          setIsLoading(false);
        });
    }
  }, [dispatch, profileId, currentUser, isOwnProfile]);

  const handleStartChat = () => {
    navigate(`/chat/${userId}`);
  };

  if (!isAuthenticated) {
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

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <ProfileSkeleton />
      </Box>
    );
  }

  if (error) {
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
          Error: {error}
        </Alert>
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="info"
          variant="filled"
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
          }}
        >
          User not found
        </Alert>
      </Box>
    );
  }

  return (
    <Container>
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
              alt={userProfile.username}
              src={userProfile.avatar}
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                border: "4px solid rgba(35, 35, 35, 0.9)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
          </Box>

          {profileId && !isOwnProfile && (
            <Box display="flex" flexDirection="column" gap={2} width="100%">
              <FollowButton
                userId={profileId}
                sx={{
                  borderRadius: "20px",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.8rem",
                }}
              />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ChatIcon />}
                onClick={handleStartChat}
                sx={{
                  borderRadius: "20px",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.8rem",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Write
              </Button>
            </Box>
          )}
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
            {userProfile.username}
          </Typography>

          {(userProfile.firstName || userProfile.lastName) && (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 2,
                fontWeight: 500,
              }}
            >
              {userProfile.firstName} {userProfile.lastName}
            </Typography>
          )}

          {profileId && (
            <Box
              my={2}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                width: "100%",
              }}
            >
              <FollowCounters userId={profileId} showIcons={true} />
            </Box>
          )}

          {userProfile.bio && (
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
              {userProfile.bio}
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

          {userProfile.location && (
            <Box display="flex" alignItems="center">
              <LocationOnIcon
                sx={{ mr: 1.5, color: "primary.light", fontSize: "1.2rem" }}
              />
              <Typography variant="body2">{userProfile.location}</Typography>
            </Box>
          )}

          {userProfile.website && (
            <Box display="flex" alignItems="center">
              <LanguageIcon
                sx={{ mr: 1.5, color: "primary.light", fontSize: "1.2rem" }}
              />
              <Link
                href={userProfile.website}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                {userProfile.website}
              </Link>
            </Box>
          )}

          {userProfile.phoneNumber && (
            <Box display="flex" alignItems="center">
              <PhoneIcon
                sx={{ mr: 1.5, color: "primary.light", fontSize: "1.2rem" }}
              />
              <Typography variant="body2">{userProfile.phoneNumber}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

// Skeleton for profile loading
const ProfileSkeleton = () => {
  const theme = useTheme();

  return (
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
};

export default ProfileInfo;
