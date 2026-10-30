import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(API + "/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      
      // Dispatch storage event so navbar updates immediately
      window.dispatchEvent(new Event("storage"));

      setMessage("Welcome " + res.data.name);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/events");
      }, 1000);
    } catch (err) {
      setIsSuccess(false);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server not reachable");
      }
    }
  }

  return (
    <div className="page form-page">
      <div className="page-header">
        <h1>LOGIN</h1>
      </div>

      <div className="form-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit} className="brutal-form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-register"
            style={{ width: "100%", marginTop: "10px" }}
          >
            Log In
          </button>

          {message && (
            <p
              style={{
                marginTop: "15px",
                padding: "10px",
                fontWeight: "700",
                border: "2px solid var(--dark)",
                backgroundColor: isSuccess ? "var(--yellow)" : "#ffdddd",
                color: "#1a1a1a",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}

          <p style={{ marginTop: "15px", textAlign: "center", fontWeight: "600" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ textDecoration: "underline", color: "var(--red)" }}>
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
