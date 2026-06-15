import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import "../style.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) return alert("Email aur password daalo");
    setLoading(true);
    try {
      const url = isSignup ? "/auth/register" : "/auth/login";
      const res = await api.post(url, { email, password });
      if (!isSignup) {
        // 2FA — OTP step pe jao
        if (res.data.requireOTP) {
          setStep(2);
          alert("OTP bhej diya email pe!");
        }
      } else {
        alert("Account created! Now login 👌");
        setIsSignup(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp) return alert("OTP daalo");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-login-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", email);
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="app-title">We Talk</h2>

        {step === 1 && (
          <>
            <p className="tagline">Chat freely. Connect instantly.</p>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-box">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <span onClick={() => setShowPass(!showPass)}>👁️</span>
            </div>
            <button onClick={submit} disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
            </button>

            {!isSignup && (
              <p className="switch-text">
                <span onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </span>
              </p>
            )}

            <p className="switch-text">
              {isSignup ? (
                <>Already have an account?{" "}
                  <span onClick={() => setIsSignup(false)}>Login</span>
                </>
              ) : (
                <>New here?{" "}
                  <span onClick={() => setIsSignup(true)}>Create account</span>
                </>
              )}
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="tagline">OTP bheja {email} pe</p>
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
      </div>
    </div>
  );
}