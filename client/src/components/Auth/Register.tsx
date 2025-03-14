import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/auth/userThunks";
import { RootState, AppDispatch } from "../../store/store";
import { RegisterData } from "../../types/auth";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import {
  FormContainer,
  SubmitButton,
  validators,
} from "../comments/FormComponents";
import { ProfileForm } from "../ProfileFormComponent";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
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
    password: "",
    phoneNumber: "",
    website: "",
  });

  const validateForm = () => {
    const errors = {
      username:
        formData.username.length < 3
          ? "Username must be at least 3 characters"
          : "",
      email: validators.email(formData.email),
      password: validators.password(formData.password),
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

      // Clear error when user types
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction) && !loading) {
      navigate("/verify-email", { state: { email: formData.email } });
    }
  };

  return (
    <FormContainer title="Registration">
      <form onSubmit={handleSubmit}>
        <ProfileForm
          formData={formData}
          formErrors={formErrors}
          handleChange={handleChange}
          showPassword={true}
          isUpdate={false}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <SubmitButton loading={loading} text="Register" />
        </Box>
      </form>
    </FormContainer>
  );
};

export default Register;
