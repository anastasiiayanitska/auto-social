import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/auth/profileThunks";
import { fetchUser } from "../../store/auth/userThunks";
import { RootState, AppDispatch } from "../../store/store";
import { RegisterData } from "../../types/auth";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Button,
  Typography,
  Box,
  Container,
  Paper,
} from "@mui/material";
import {
  FormContainer,
  SubmitButton,
} from "../../components/Auth/FormComponents";
import ProfileForm from "../../components/Auth/ProfileFormComponent";

const UpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [authChecking, setAuthChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    avatar: null,
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    phoneNumber: "",
    website: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    website: "",
  });

  useEffect(() => {
    setAuthChecking(false);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || null,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        phoneNumber: user.phoneNumber || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const errors = {
      phoneNumber:
        formData.phoneNumber && !/^\d{10,15}$/.test(formData.phoneNumber)
          ? "Invalid phone number"
          : "",
      website:
        formData.website &&
        !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          formData.website
        )
          ? "Invalid website URL"
          : "",
    };

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files) {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user || !user._id) {
      console.error("Unable to update profile: user not authorized");
      return;
    }

    setIsSubmitting(true);
    const dataToSubmit = { ...formData };

    dispatch(
      updateUser({
        userId: user._id,
        userData: dataToSubmit,
      })
    )
      .then(() => {
        navigate("/me");
        return dispatch(fetchUser()).unwrap();
      })
      .catch((err) => {
        console.error("Profile update error:", err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (loading && !user) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
          color: "white",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Authorization Error
          </Typography>
          <Typography variant="body1" paragraph>
            You must be logged in to update your profile.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <FormContainer title="Update Profile">
      <form onSubmit={handleSubmit}>
        <ProfileForm
          formData={formData}
          formErrors={formErrors}
          handleChange={handleChange}
          showPassword={false}
          isUpdate={true}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <SubmitButton loading={isSubmitting} text="Update Profile" />
        </Box>
      </form>
    </FormContainer>
  );
};

export default UpdateProfile;
