import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resendVerificationCode } from "../../store/authSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [verificationCode, setVerificationCode] = useState("");

  // Якщо користувач вже підтверджений, перенаправляємо на профіль
  useEffect(() => {
    if (isAuthenticated && user?.isVerified) {
      navigate("/profile");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    dispatch(
      verifyEmail({
        email: user.email,
        verificationCode: verificationCode,
      })
    ).then((result) => {
      // Якщо верифікація успішна, перенаправляємо на профіль
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/profile");
      }
    });
  };

  const handleResendCode = () => {
    if (!user) return;

    dispatch(
      resendVerificationCode({
        email: user.email,
      })
    );
  };

  return (
    <div className="verify-email-container">
      <h2>Підтвердження електронної пошти</h2>
      <p>
        Код підтвердження було надіслано на вашу електронну адресу:{" "}
        {user?.email}
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Введіть код підтвердження"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Підтвердити
        </button>
      </form>

      <button onClick={handleResendCode} disabled={loading}>
        Надіслати код повторно
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VerifyEmail;
