import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import "../style.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!email) return alert("Email daalo");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      alert("OTP bhej diya!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp) return alert("OTP daalo");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (!newPassword) return alert("New password daalo");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      alert("Password reset ho gaya!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="app-title">We Talk</h2>

        {step === 1 && (
          <>
            <p className="tagline">Email daalo OTP aayega</p>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOTP()}
            />
            <button onClick={sendOTP} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="tagline">OTP bhej diya {email} pe</p>
            <input
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              onKeyDown={(e) => e.key === "Enter" && verifyOTP()}
            />
            <button onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="switch-text">
              <span onClick={() => setStep(1)}>← Back</span>
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <p className="tagline">New password set karo</p>
            <div className="password-box">
              <input
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && resetPassword()}
              />
              <span onClick={() => setShowPass(!showPass)}>👁️</span>
            </div>
            <button onClick={resetPassword} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="switch-text">
          <span onClick={() => navigate("/login")}>← Back to Login</span>
        </p>
      </div>
    </div>
  );
}