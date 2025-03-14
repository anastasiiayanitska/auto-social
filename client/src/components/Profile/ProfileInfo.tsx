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
//   Paper,
//   Divider,
//   Link,
//   CircularProgress,
//   Alert,
//   Container,
// } from "@mui/material";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import LanguageIcon from "@mui/icons-material/Language";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import PersonIcon from "@mui/icons-material/Person";
// import FollowButton from "../follow/FollowButton";
// import FollowCounters from "../follow/FollowersCounter";

// interface ProfileProps {
//   userId?: string; // Необов'язковий, якщо не передано - показуємо власний профіль
// }

// const ProfileInfo: React.FC<ProfileProps> = ({ userId }) => {
//   const { id } = useParams<{ id: string }>();
//   const profileId = userId || id; // Використовуємо або переданий userId, або id з параметрів URL

//   const dispatch = useDispatch<AppDispatch>();
//   const [userProfile, setUserProfile] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Отримуємо дані про поточного користувача зі стейту
//   const { user: currentUser, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );

//   // Визначаємо, чи це власний профіль
//   const isOwnProfile =
//     !profileId || (currentUser && currentUser._id === profileId);

//   useEffect(() => {
//     // Якщо це власний профіль і currentUser існує, використовуємо його дані
//     if (isOwnProfile && currentUser) {
//       setUserProfile(currentUser);
//       return;
//     }

//     // Якщо це чужий профіль або профіль за ID, завантажуємо дані
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

//   return (
//     <Container maxWidth="md">
//       <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
//         <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3}>
//           {/* Аватар і кнопка підписки */}
//           <Box display="flex" flexDirection="column" alignItems="center">
//             <Avatar
//               alt={userProfile.username}
//               src={userProfile.avatar}
//               sx={{ width: 120, height: 120, mb: 2 }}
//             />
//             {profileId && !isOwnProfile && <FollowButton userId={profileId} />}
//           </Box>

//           {/* Основна інформація */}
//           <Box flexGrow={1}>
//             <Typography variant="h4" gutterBottom>
//               {userProfile.username}
//             </Typography>

//             {(userProfile.firstName || userProfile.lastName) && (
//               <Typography variant="h6" color="text.secondary" gutterBottom>
//                 {userProfile.firstName} {userProfile.lastName}
//               </Typography>
//             )}

//             {/* Лічильники підписників/підписок */}
//             {profileId && (
//               <FollowCounters
//                 userId={profileId}
//                 variant="text"
//                 showIcons={true}
//               />
//             )}

//             {userProfile.bio && (
//               <Typography variant="body1" mt={2}>
//                 {userProfile.bio}
//               </Typography>
//             )}
//           </Box>
//         </Box>

//         <Divider sx={{ my: 3 }} />

//         <Box>
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

//           {/* Показуємо email та телефон тільки якщо це власний профіль */}
//           {isOwnProfile && userProfile.email && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Typography variant="body1">{userProfile.email}</Typography>
//             </Box>
//           )}

//           {isOwnProfile && userProfile.phoneNumber && (
//             <Box display="flex" alignItems="center" mb={1.5}>
//               <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
//               <Typography variant="body1">{userProfile.phoneNumber}</Typography>
//             </Box>
//           )}
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default ProfileInfo;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUserProfileById } from "../../store/auth/profileThunks";
import { User } from "../../types/auth";
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
import PersonIcon from "@mui/icons-material/Person";
import FollowButton from "../follow/FollowButton";
import FollowCounters from "../follow/FollowersCounter";

interface ProfileProps {
  userId?: string; // Необов'язковий, якщо не передано - показуємо власний профіль
}

const ProfileInfo: React.FC<ProfileProps> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const profileId = userId || id; // Використовуємо або переданий userId, або id з параметрів URL

  const dispatch = useDispatch<AppDispatch>();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отримуємо дані про поточного користувача зі стейту
  const { user: currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Визначаємо, чи це власний профіль
  const isOwnProfile = currentUser && currentUser._id === profileId;

  useEffect(() => {
    // Якщо це власний профіль і currentUser існує, використовуємо його дані
    if (isOwnProfile && currentUser) {
      setUserProfile(currentUser);
      setIsLoading(false); // Переконуємось, що loading встановлено в false
      return;
    }

    // Якщо це чужий профіль або профіль за ID, завантажуємо дані
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

  if (!isAuthenticated)
    return <Alert severity="warning">You are not authorized</Alert>;
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!userProfile) return <Alert severity="info">User not found</Alert>;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={3}>
          {/* Аватар і кнопка підписки */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              alt={userProfile.username}
              src={userProfile.avatar}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            {profileId && !isOwnProfile && <FollowButton userId={profileId} />}
          </Box>

          {/* Основна інформація */}
          <Box flexGrow={1}>
            <Typography variant="h4" gutterBottom>
              {userProfile.username}
            </Typography>

            {(userProfile.firstName || userProfile.lastName) && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {userProfile.firstName} {userProfile.lastName}
              </Typography>
            )}

            {/* Лічильники підписників/підписок */}
            {profileId && (
              <FollowCounters
                userId={profileId}
                variant="text"
                showIcons={true}
              />
            )}

            {userProfile.bio && (
              <Typography variant="body1" mt={2}>
                {userProfile.bio}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          {userProfile.location && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">{userProfile.location}</Typography>
            </Box>
          )}

          {userProfile.website && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <LanguageIcon sx={{ mr: 1, color: "primary.main" }} />
              <Link
                href={userProfile.website}
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ color: "primary.main" }}
              >
                {userProfile.website}
              </Link>
            </Box>
          )}

          {/* Показуємо email та телефон тільки якщо це власний профіль */}
          {isOwnProfile && userProfile.email && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">{userProfile.email}</Typography>
            </Box>
          )}

          {isOwnProfile && userProfile.phoneNumber && (
            <Box display="flex" alignItems="center" mb={1.5}>
              <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">{userProfile.phoneNumber}</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileInfo;
