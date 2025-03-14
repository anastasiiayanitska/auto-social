import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth/userThunks";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Alert, Stack, Box, Typography } from "@mui/material";
import {
  FormContainer,
  PasswordField,
  SubmitButton,
  validators,
} from "../comments/FormComponents";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validators.email(formData.email),
      password: validators.password(formData.password),
    };

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(
      loginUser({
        email: formData.email,
        password: formData.password,
      })
    );
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/me");
    }
  }, [isAuthenticated, navigate, loading]);

  return (
    <FormContainer title="Login">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />

          <PasswordField
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            helperText={formErrors.password}
            autoComplete="current-password"
          />

          {error && <Alert severity="error">{error}</Alert>}

          <SubmitButton loading={loading} text="Login" />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Link to="/forgot-password" style={{ textDecoration: "none" }}>
              <Typography color="primary" variant="body2">
                Forgot your password?
              </Typography>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Typography color="primary" variant="body2">
                Create a new account
              </Typography>
            </Link>
          </Box>
        </Stack>
      </form>
    </FormContainer>
  );
};

export default Login;
