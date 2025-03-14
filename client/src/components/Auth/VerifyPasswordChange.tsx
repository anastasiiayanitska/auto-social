import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyPasswordChange } from "../../store/auth/passwordThunks";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyPasswordChange() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      verifyPasswordChange({
        email,
        code,
      })
    );

    if (verifyPasswordChange.fulfilled.match(resultAction)) {
      alert("Password changed successfully");
      navigate("/me");
    }
  };

  return (
    <div>
      <h2>Confirm password change</h2>
      {error && <div className="error">{error}</div>}

      <p>Enter the confirmation code sent to your email.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="verificationCode">Confirmation code</label>
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
    </div>
  );
}

export default VerifyPasswordChange;
