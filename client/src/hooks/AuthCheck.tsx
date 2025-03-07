import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../store/authSlice"; // Используем уже существующий экшен

const AuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser() as any); // Запрашиваем данные о пользователе через Redux
  }, [dispatch]);
};

export default AuthCheck;
