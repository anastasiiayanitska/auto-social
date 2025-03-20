import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../store/auth/passwordThunks";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import {
  FormContainer,
  PasswordField,
  SubmitButton,
  validators,
} from "../../components/Auth/FormComponents";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/store";

const ChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, passwordChangeRequested, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

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

    setIsSubmitting(true);

    try {
      const resultAction = await dispatch(
        changePassword({
          email: user.email,
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
        })
      );

      if (changePassword.fulfilled.match(resultAction)) {
        navigate("/verify-password-change", { state: { email: user.email } });
      }
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer title="Change Password">
      {error && <Alert severity="error">{error}</Alert>}

      {passwordChangeRequested && (
        <Alert severity="success">
          A verification code has been sent to your email.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <PasswordField
          name="currentPassword"
          label="Current Password"
          autoComplete="current-password"
          value={formValues.currentPassword}
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

        <SubmitButton loading={isSubmitting} text="Change Password" />
      </Box>
    </FormContainer>
  );
};

export default ChangePassword;
