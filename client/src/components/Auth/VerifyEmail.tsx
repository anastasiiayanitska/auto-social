import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyEmail,
  resendVerificationCode,
} from "../../store/auth/verificationThunks";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/me");
    }
  }, [isAuthenticated, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("First enter your email");
      return;
    }

    const resultAction = await dispatch(
      verifyEmail({
        email,
        code,
      })
    );

    if (verifyEmail.fulfilled.match(resultAction)) {
      navigate("/me");
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert("First enter your email");
      return;
    }

    await dispatch(resendVerificationCode({ email }));
    alert("A new code has been sent to your email.");
  };

  return (
    <div>
      <h2>Email Confirmation</h2>
      {error && <div className="error">{error}</div>}

      <p>Enter the confirmation code sent to your email.</p>

      <form onSubmit={handleVerify}>
        {!location.state?.email && (
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="code">Confirmation code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Audit..." : "Confirm"}
        </button>
      </form>

      <button onClick={handleResend} disabled={loading}>
        Resend code
      </button>
    </div>
  );
}

export default VerifyEmail;
