import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CSS/Login.css";

export default function Register() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/users/register", form);
      toast.success("Registered successfully 🎉");
      navigate("/");
    } catch (err) {
      toast.error("Error registering ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <div className="main">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

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

          <label>Role</label>
          <select
            required
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="link" onClick={() => navigate("/")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}