import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/auth/passwordThunks";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, Box, TextField } from "@mui/material";
import {
  FormContainer,
  PasswordField,
  SubmitButton,
  validators,
} from "../comments/FormComponents";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    email: location.state?.email || "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Validate on change
    if (name === "email") {
      setFormErrors({
        ...formErrors,
        email: validators.email(value),
      });
    }

    if (name === "newPassword") {
      setFormErrors({
        ...formErrors,
        newPassword: validators.password(value),
        confirmPassword: validators.passwordMatch(
          value,
          formValues.confirmPassword
        ),
      });
    }

    if (name === "confirmPassword") {
      setFormErrors({
        ...formErrors,
        confirmPassword: validators.passwordMatch(
          formValues.newPassword,
          value
        ),
      });
    }
  };

  const validateForm = () => {
    const errors = {
      email: validators.email(formValues.email),
      newPassword: validators.password(formValues.newPassword),
      confirmPassword: validators.passwordMatch(
        formValues.newPassword,
        formValues.confirmPassword
      ),
    };

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const resultAction = await dispatch(
      resetPassword({
        email: formValues.email,
        code: formValues.code,
        password: formValues.newPassword,
      })
    );

    if (resetPassword.fulfilled.match(resultAction)) {
      alert("Password changed successfully");
      navigate("/login");
    }
  };

  return (
    <FormContainer title="Set New Password">
      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {!location.state?.email && (
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formValues.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="code"
          label="Confirmation Code"
          name="code"
          value={formValues.code}
          onChange={handleChange}
        />

        <PasswordField
          name="newPassword"
          label="New Password"
          value={formValues.newPassword}
          onChange={handleChange}
          error={formErrors.newPassword}
          helperText={formErrors.newPassword}
        />

        <PasswordField
          name="confirmPassword"
          label="Confirm Password"
          value={formValues.confirmPassword}
          onChange={handleChange}
          error={formErrors.confirmPassword}
          helperText={formErrors.confirmPassword}
        />

        <SubmitButton loading={loading} text="Save New Password" />
      </Box>
    </FormContainer>
  );
};

export default ResetPassword;
