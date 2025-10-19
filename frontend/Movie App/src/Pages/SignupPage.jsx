import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://ec2-13-126-126-15.ap-south-1.compute.amazonaws.com:8080/api/users/signup", { username, password });
      setLoading(false);
      navigate("/login"); // redirect to login after signup
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#141E30" }}>
      <form className="p-4 bg-dark text-light rounded shadow-lg" onSubmit={handleSubmit} style={{ width: "400px" }}>
        <h2 className="mb-4 text-center text-success">Signup</h2>

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

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ backgroundColor: "#1c1c1c", color: "white" }}
          />
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="mt-3 text-center">
          Already have an account? <span className="text-info" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
