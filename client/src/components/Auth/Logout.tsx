import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/auth/userThunks";
import { AppDispatch } from "../../store/store";

const Logout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutUser())
      // .unwrap()
      .then(() => {
        console.log("Exit");

        navigate("/login");
      })
      .catch((err) => {
        console.error("Exit error:", err);
      });
  }, [dispatch, navigate]);

  return <div className="loading">Exit...</div>;
};

export default Logout;
