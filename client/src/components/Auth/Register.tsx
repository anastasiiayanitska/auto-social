import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/authSlice";
import { RootState, AppDispatch } from "../../store/store";
import { RegisterData } from "../../types/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Коректне визначення стейту
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
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/verifyEmail");
    }
  }, [isAuthenticated, navigate]);

  // Обробник змін у полях форми
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files) {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Створюємо об'єкт, який відповідає RegisterData
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      avatar: formData.avatar || null, // Переконаємося, що тут File | null
      firstName: formData.firstName || null,
      lastName: formData.lastName || null,
      bio: formData.bio || null,
      location: formData.location || null,
      phoneNumber: formData.phoneNumber || null,
      website: formData.website || null,
    };

    console.log("📤 Відправка реєстрації:", userData);
    dispatch(registerUser(userData)); // ✅ Передаємо коректний тип
  };

  return (
    <div className="register-container">
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Псевдонім"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="firstName"
          placeholder="Ім'я"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="призвіще"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bio"
          placeholder="bio"
          value={formData.bio}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="phoneNumber"
          placeholder="phone"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="website"
          placeholder="web"
          value={formData.website}
          onChange={handleChange}
        />
        <input type="file" name="avatar" onChange={handleChange} />
        <button type="submit" disabled={loading}>
          Зареєструватися
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
