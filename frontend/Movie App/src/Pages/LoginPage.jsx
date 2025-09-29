import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/users/login", {
        username,
        password,
      });

      // save JWT and user info
      const { token, userId, username: uname } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", uname);

      setLoading(false);
      navigate("/"); // redirect to home after login
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#141E30" }}>
      <form className="p-4 bg-dark text-light rounded shadow-lg" onSubmit={handleSubmit} style={{ width: "400px" }}>
        <h2 className="mb-4 text-center text-danger">Login</h2>

        {error && <p className="text-danger">{error}</p>}

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ backgroundColor: "#1c1c1c", color: "white" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ backgroundColor: "#1c1c1c", color: "white" }}
          />
        </div>

        <button type="submit" className="btn btn-danger w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-3 text-center">
          Don't have an account? <span className="text-info" style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>Signup</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
