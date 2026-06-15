import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import "../style.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const submit = async () => {
    try {
      const url = isSignup ? "/auth/register" : "/auth/login";
      const res = await api.post(url, { email, password });
      if (!isSignup) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", email);
        navigate("/chat");
      } else {
        alert("Account created! Now login 👌");
        setIsSignup(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="app-title">We Talk</h2>
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
        <button onClick={submit}>
          {isSignup ? "Create Account" : "Login"}
        </button>

        {/* ✅ Forgot password link */}
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
      </div>
    </div>
  );
}