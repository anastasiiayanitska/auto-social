import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/authSlice";
import { AppDispatch } from "../../store/store";

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("❌ Помилка виходу:", err);
      });
  }, [dispatch, navigate]);

  return <div className="loading">Вихід...</div>;
};

export default Logout;
