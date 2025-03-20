// import React from "react";
// import {
//   TextField,
//   Grid,
//   Divider,
//   Typography,
//   Stack,
//   Box,
// } from "@mui/material";
// import { PasswordField } from "./FormComponents";
// import { RegisterData } from "../../types/auth";

// interface ProfileFormProps {
//   formData: RegisterData;
//   formErrors: Record<string, string>;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   showPassword?: boolean;
//   isUpdate?: boolean;
// }

// const ProfileForm = ({
//   formData,
//   formErrors,
//   handleChange,
//   showPassword = false,
//   isUpdate = false,
// }: ProfileFormProps) => {
//   return (
//     <Stack spacing={2} color="white">
//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h6" gutterBottom>
//           Account Information
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               required
//               fullWidth
//               id="username"
//               name="username"
//               label="Username"
//               value={formData.username}
//               onChange={handleChange}
//               error={!!formErrors.username}
//               helperText={formErrors.username}
//               disabled={isUpdate}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               required
//               fullWidth
//               id="email"
//               name="email"
//               label="Email Address"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               error={!!formErrors.email}
//               helperText={formErrors.email}
//               disabled={isUpdate}
//             />
//           </Grid>
//           {showPassword && (
//             <Grid item xs={12}>
//               <PasswordField
//                 name="password"
//                 label={
//                   isUpdate
//                     ? "New Password (leave blank to keep current)"
//                     : "Password"
//                 }
//                 value={formData.password}
//                 onChange={handleChange}
//                 error={formErrors.password}
//                 helperText={formErrors.password}
//                 autoComplete={isUpdate ? "new-password" : "current-password"}
//               />
//             </Grid>
//           )}
//         </Grid>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h6" gutterBottom>
//           Profile Information
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               id="firstName"
//               name="firstName"
//               label="First Name"
//               value={formData.firstName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               id="lastName"
//               name="lastName"
//               label="Last Name"
//               value={formData.lastName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="bio"
//               name="bio"
//               label="Bio"
//               multiline
//               rows={2}
//               value={formData.bio}
//               onChange={handleChange}
//             />
//           </Grid>
//         </Grid>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h6" gutterBottom>
//           Contact Information
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               id="location"
//               name="location"
//               label="Location"
//               value={formData.location}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               id="phoneNumber"
//               name="phoneNumber"
//               label="Phone Number"
//               type="tel"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               error={!!formErrors.phoneNumber}
//               helperText={formErrors.phoneNumber}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               id="website"
//               name="website"
//               label="Website"
//               value={formData.website}
//               onChange={handleChange}
//               error={!!formErrors.website}
//               helperText={formErrors.website}
//             />
//           </Grid>
//         </Grid>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ mb: 1 }}>
//         <Typography variant="h6" gutterBottom>
//           Profile Picture
//         </Typography>
//         <TextField
//           fullWidth
//           type="file"
//           id="avatar"
//           name="avatar"
//           onChange={handleChange}
//           inputProps={{ accept: "image/*" }}
//           InputLabelProps={{ shrink: true }}
//         />
//         {formData.avatar && typeof formData.avatar === "string" && (
//           <Typography
//             variant="caption"
//             color="textSecondary"
//             sx={{ mt: 1, display: "block" }}
//           >
//             Current avatar: {formData.avatar.split("/").pop()}
//           </Typography>
//         )}
//       </Box>
//     </Stack>
//   );
// };

// export default ProfileForm;
import React from "react";
import {
  TextField,
  Grid,
  Divider,
  Typography,
  Stack,
  Box,
  Button,
} from "@mui/material";
import { PasswordField } from "./FormComponents";
import { RegisterData } from "../../types/auth";

interface ProfileFormProps {
  formData: RegisterData;
  formErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  isUpdate?: boolean;
}

const ProfileForm = ({
  formData,
  formErrors,
  handleChange,
  showPassword = false,
  isUpdate = false,
}: ProfileFormProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Extract filename from avatar path or File object
  const getFileName = () => {
    if (!formData.avatar) return "";
    if (typeof formData.avatar === "string") {
      return formData.avatar.split("/").pop() || "";
    }
    return formData.avatar.name;
  };

  return (
    <Stack spacing={2} color="white">
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              disabled={isUpdate}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={isUpdate}
            />
          </Grid>
          {showPassword && (
            <Grid item xs={12}>
              <PasswordField
                name="password"
                label={
                  isUpdate
                    ? "New Password (leave blank to keep current)"
                    : "Password"
                }
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                helperText={formErrors.password}
                autoComplete={isUpdate ? "new-password" : "current-password"}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="bio"
              name="bio"
              label="Bio"
              multiline
              rows={2}
              value={formData.bio}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="website"
              name="website"
              label="Website"
              value={formData.website}
              onChange={handleChange}
              error={!!formErrors.website}
              helperText={formErrors.website}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Profile Picture
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          id="avatar"
          name="avatar"
          onChange={handleChange}
          accept="image/*"
          style={{ display: "none" }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadClick}
          >
            Upload Photo
          </Button>
          {formData.avatar && (
            <Typography variant="body2" color="textSecondary">
              {getFileName()}
            </Typography>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default ProfileForm;
