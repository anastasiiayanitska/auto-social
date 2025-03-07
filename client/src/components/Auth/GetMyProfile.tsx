import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const GetMyProfile: React.FC = () => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">Ошибка: {error}</p>;
  if (!isAuthenticated || !user) return <p>Вы не авторизованы</p>;

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">Профиль пользователя</h2>
        <p>
          <strong>Имя:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>avatar:</strong> {user.avatar}
        </p>
        <p>
          <strong>firstName:</strong> {user.firstName}
        </p>
        <p>
          <strong>lastName:</strong> {user.lastName}
        </p>
        <p>
          <strong>bio:</strong> {user.bio}
        </p>
        <p>
          <strong>location:</strong> {user.location}
        </p>
        <p>
          <strong>phoneNumber:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>website:</strong> {user.website}
        </p>
      </div>
    </div>
  );
};

export default GetMyProfile;
