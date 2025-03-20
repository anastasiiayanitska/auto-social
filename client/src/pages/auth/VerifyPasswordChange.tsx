import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyPasswordChange } from "../../store/auth/passwordThunks";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { RootState } from "../../store/store";
import { AppDispatch } from "../../store/store";

function VerifyPasswordChange() {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      verifyPasswordChange({
        email,
        code,
      })
    );

    if (verifyPasswordChange.fulfilled.match(resultAction)) {
      alert("Password changed successfully");
      navigate("/me");
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
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="h2" color="white" sx={{ mb: 3 }}>
          Confirm Password Change
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3 }} color="white">
          Enter the confirmation code sent to your email.
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
      </Container>
    </div>
  );
}

export default VerifyPasswordChange;
