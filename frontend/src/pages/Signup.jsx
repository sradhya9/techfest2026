import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage("All fields are required");
      setIsSuccess(false);
      return;
    }
    try {
      const res = await axios.post(API + "/auth/register", {
        name,
        email,
        password,
      });
      setMessage(res.data.message);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
        <h1>SIGN UP</h1>
      </div>

      <div className="form-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit} className="brutal-form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
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
            Sign Up
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
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "underline", color: "var(--red)" }}>
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
