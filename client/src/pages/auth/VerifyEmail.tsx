import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyEmail,
  resendVerificationCode,
} from "../../store/auth/verificationThunks";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Email as EmailIcon, Send as SendIcon } from "@mui/icons-material";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/store";

function VerifyEmail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/me");
    }
  }, [isAuthenticated, navigate, loading]);

  const handleVerify = async (e: any) => {
    e.preventDefault();

    if (!email) {
      dispatch({ type: "SET_ERROR", payload: "Please enter your email" });
      return;
    }

    const resultAction = await dispatch(
      verifyEmail({
        email,
        code,
      })
    );

    if (verifyEmail.fulfilled.match(resultAction)) {
      navigate("/me");
    }
  };

  const handleResend = async () => {
    if (!email) {
      dispatch({ type: "SET_ERROR", payload: "Please enter your email" });
      return;
    }

    await dispatch(resendVerificationCode({ email }));
    dispatch({
      type: "SET_SUCCESS",
      payload: "A new code has been sent to your email",
    });
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
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EmailIcon sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
        <Typography variant="h5" component="h2" sx={{ mb: 3 }} color="white">
          Email Confirmation
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3 }} color="white">
          Enter the confirmation code sent to your email.
        </Typography>

        <form onSubmit={handleVerify} style={{ width: "100%" }}>
          {!location.state?.email && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="Confirmation Code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm"
            )}
          </Button>
        </form>

        <Button
          onClick={handleResend}
          disabled={loading}
          startIcon={<SendIcon />}
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
        >
          Resend code
        </Button>
      </Container>
    </div>
  );
}

export default VerifyEmail;
