import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUserProfileById } from "../../store/authSlice";
import { User } from "../../types/auth";

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch(fetchUserProfileById(id))
        .unwrap()
        .then((profile) => {
          setUserProfile(profile);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [dispatch, id]);

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p className="text-red-500">Помилка: {error}</p>;
  if (!userProfile) return <p>Користувача не знайдено</p>;

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">Профіль користувача</h2>
        <p>
          <strong>Ім'я:</strong> {userProfile.username}
        </p>
        {/* Виводити решту інформації відповідно до того, що повертає API */}
        {userProfile.firstName && (
          <p>
            <strong>Ім'я:</strong> {userProfile.firstName}
          </p>
        )}
        {userProfile.lastName && (
          <p>
            <strong>Прізвище:</strong> {userProfile.lastName}
          </p>
        )}
        {userProfile.bio && (
          <p>
            <strong>Біо:</strong> {userProfile.bio}
          </p>
        )}
        {userProfile.location && (
          <p>
            <strong>Розташування:</strong> {userProfile.location}
          </p>
        )}
        {userProfile.website && (
          <p>
            <strong>Веб-сайт:</strong> {userProfile.website}
          </p>
        )}
        {/* Показувати особисті дані (email, телефон) тільки якщо це власний профіль */}
      </div>
    </div>
  );
};

export default Profile;
