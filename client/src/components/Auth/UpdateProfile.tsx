import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUser } from "../../store/authSlice";
import { RootState, AppDispatch } from "../../store/store";
import { RegisterData } from "../../types/auth";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [authChecking, setAuthChecking] = useState(true);

  // Визначення стейту форми
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

  // Перевірка авторизації при завантаженні компонента
  useEffect(() => {
    console.log("Поточний стан користувача:", user);
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthChecking(false);
      return;
    }

    if (!user) {
      dispatch(fetchUser())
        .unwrap()
        .then((userData) => {
          console.log("✅ Користувач успішно отриманий", userData);
        })
        .catch((err) => {
          console.error("❌ Помилка отримання користувача:", err);
        })
        .finally(() => {
          setAuthChecking(false);
        });
    } else {
      setAuthChecking(false);
    }
  }, [dispatch, user]);

  // Заповнення форми даними користувача після успішного отримання
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
        // Пароль залишаємо порожнім з міркувань безпеки
        password: "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        phoneNumber: user.phoneNumber || "",
        website: user.website || "",
      }));
    }
  }, [user]);

  // Обробник змін полів форми
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files) {
      setFormData((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Обробник відправки форми
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Стан користувача перед відправкою:", user._id);
    // Перевірка наявності користувача та його ID
    if (!user || !user._id) {
      console.error(
        "❌ Неможливо оновити профіль: користувач не авторизований"
      );
      return;
    }

    console.log("📤 Відправка оновлення профілю:", formData);

    dispatch(
      updateUser({
        userId: user._id,
        userData: formData,
      })
    )
      .unwrap()
      .then(() => {
        return dispatch(fetchUser()).unwrap(); // ⚡ Додаємо оновлення користувача
      })
      .then(() => {
        navigate("/me");
      })
      .catch((err) => {
        console.error("❌ Помилка оновлення профілю:", err);
      });
  };

  // Відображення під час перевірки авторизації
  if (authChecking) {
    return <div className="loading">Перевірка авторизації...</div>;
  }

  // Якщо користувач не авторизований
  if (!user) {
    return (
      <div className="error-container">
        <h2>Помилка авторизації</h2>
        <p>Для оновлення профілю необхідно авторизуватись</p>
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Увійти в систему
        </button>
      </div>
    );
  }

  // Основний рендер форми
  return (
    <div className="update-profile-container">
      <h2>Оновлення профілю</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Оновлення..." : "Оновити профіль"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default UpdateProfile;
