import { useState } from "react";
import {
  TextField,
  Button,
  Alert,
  Stack,
  Typography,
  Box,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Reusable form container component
export const FormContainer = ({ children, title }) => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          {children}
        </Stack>
      </Paper>
    </Container>
  );
};

// Reusable password field component with visibility toggle
export const PasswordField = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

// Reusable submit button
export const SubmitButton = ({ loading, text }) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={loading}
      sx={{ mt: 3, mb: 2 }}
    >
      {loading ? "Processing..." : text}
    </Button>
  );
};

// Common validation functions
export const validators = {
  email: (value) => (/^\S+@\S+$/.test(value) ? "" : "Invalid email format"),
  password: (value) =>
    value.length < 6 ? "Password must be at least 6 characters" : "",
  passwordMatch: (password, confirmPassword) =>
    password !== confirmPassword ? "Passwords do not match" : "",
};
