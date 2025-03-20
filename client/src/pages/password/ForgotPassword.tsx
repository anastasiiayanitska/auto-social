import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/auth/passwordThunks";
import { useNavigate } from "react-router-dom";
import { Alert, Box, TextField } from "@mui/material";
import {
  FormContainer,
  SubmitButton,
  validators,
} from "../../components/Auth/FormComponents";
import { AppDispatch, RootState } from "../../store/store";
const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, passwordResetSent } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validators.email(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validators.email(email);
    setEmailError(error);

    if (error) return;

    const resultAction = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(resultAction)) {
      navigate("/reset-password", { state: { email } });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <FormContainer title="Password Recovery">
        {error && <Alert severity="error">{error}</Alert>}

        {passwordResetSent && (
          <Alert severity="success">
            A verification code has been sent to your email.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
          />

          <SubmitButton loading={loading} text="Send Verification Code" />
        </Box>
      </FormContainer>
    </div>
  );
};

export default ForgotPassword;
