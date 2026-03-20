import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CSS/Login.css";

export default function Login() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Login successful 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <div className="main">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="link" onClick={() => navigate("/register")}>
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}