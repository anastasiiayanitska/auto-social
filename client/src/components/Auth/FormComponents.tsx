import { useState, ReactNode, ChangeEvent, MouseEvent } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FormContainerProps {
  children: ReactNode;
  title: string;
}

export const FormContainer = ({ children, title }: FormContainerProps) => {
  return (
    <Container maxWidth="sm">
      <Stack spacing={3}>
        <Typography variant="h5" component="h2" color="white">
          {title}
        </Typography>
        {children}
      </Stack>
    </Container>
  );
};

interface PasswordFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  autoComplete?: string;
}

export const PasswordField = ({
  name,
  label,
  value,
  onChange,
  error = false,
  helperText = "",
  autoComplete = "off",
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
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

interface SubmitButtonProps {
  loading: boolean;
  text: string;
}

export const SubmitButton = ({ loading, text }: SubmitButtonProps) => {
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

type ValidatorFunction = (value: string, confirmValue?: string) => string;

export const validators: Record<string, ValidatorFunction> = {
  email: (value: string) =>
    /^\S+@\S+$/.test(value) ? "" : "Invalid email format",
  password: (value: string) =>
    value.length < 6 ? "Password must be at least 6 characters" : "",
  passwordMatch: (password: string, confirmPassword: string) =>
    password !== confirmPassword ? "Passwords do not match" : "",
};
