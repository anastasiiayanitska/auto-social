import React from "react";
import { TextField, Grid, Divider, Typography, Stack } from "@mui/material";
import { PasswordField } from "./comments/FormComponents";
import { RegisterData } from "../types/auth";

// Types for props
interface ProfileFormProps {
  formData: RegisterData;
  formErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  isUpdate?: boolean;
}

// Account section with optional password field
export const AccountSection = ({
  formData,
  formErrors,
  handleChange,
  showPassword = true,
  isUpdate = false,
}: ProfileFormProps) => (
  <>
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
          disabled={isUpdate} // Username might not be editable when updating
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
          disabled={isUpdate} // Email might not be editable when updating
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
  </>
);

// Profile information section
export const ProfileSection = ({
  formData,
  handleChange,
}: ProfileFormProps) => (
  <>
    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
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
  </>
);

// Contact information section
export const ContactSection = ({
  formData,
  formErrors,
  handleChange,
}: ProfileFormProps) => (
  <>
    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
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
  </>
);

// Avatar upload section
export const AvatarSection = ({ handleChange, formData }: ProfileFormProps) => (
  <>
    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
      Profile Picture
    </Typography>
    <TextField
      fullWidth
      type="file"
      id="avatar"
      name="avatar"
      onChange={handleChange}
      inputProps={{ accept: "image/*" }}
      InputLabelProps={{ shrink: true }}
    />
    {formData.avatar && typeof formData.avatar === "string" && (
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ mt: 1, display: "block" }}
      >
        Current avatar: {formData.avatar.split("/").pop()}
      </Typography>
    )}
  </>
);

// Complete profile form component
export const ProfileForm = ({
  formData,
  formErrors,
  handleChange,
  showPassword = true,
  isUpdate = false,
}: ProfileFormProps) => {
  return (
    <Stack spacing={2}>
      <AccountSection
        formData={formData}
        formErrors={formErrors}
        handleChange={handleChange}
        showPassword={showPassword}
        isUpdate={isUpdate}
      />

      <Divider sx={{ my: 2 }} />

      <ProfileSection
        formData={formData}
        formErrors={formErrors}
        handleChange={handleChange}
      />

      <Divider sx={{ my: 2 }} />

      <ContactSection
        formData={formData}
        formErrors={formErrors}
        handleChange={handleChange}
      />

      <Divider sx={{ my: 2 }} />

      <AvatarSection
        formData={formData}
        formErrors={formErrors}
        handleChange={handleChange}
      />
    </Stack>
  );
};
