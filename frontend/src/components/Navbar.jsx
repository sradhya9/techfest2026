import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  const syncAuth = () => {
    setToken(localStorage.getItem("token"));
    setUserName(localStorage.getItem("name") || "");
    setUserRole(localStorage.getItem("role") || "");
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [location]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setToken(null);
    setUserName("");
    setUserRole("");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  }

  return (
    <nav className="navbar" style={{ flexWrap: "wrap", gap: "15px" }}>
      <h2 className="nav-logo">
        <Link to="/">TechFest <span>2026</span></Link>
      </h2>
      <div className="nav-links" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/my-registrations">My Registrations</Link>
        <Link to="/register">Form</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/contact">Contact</Link>
        {/* Organizer Dashboard is restricted to Admin only */}
        {userRole === "admin" && (
          <Link
            to="/dashboard"
            style={{
              backgroundColor: "var(--yellow)",
              color: "var(--dark)",
              padding: "2px 8px",
              border: "2px solid var(--dark)",
              boxShadow: "2px 2px 0px var(--dark)",
            }}
          >
            Dashboard (Admin)
          </Link>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {token ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>
              👤 {userName || "User"}{" "}
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "2px 6px",
                  background: userRole === "admin" ? "var(--red)" : "var(--yellow)",
                  color: userRole === "admin" ? "var(--cream)" : "var(--dark)",
                  fontWeight: "800",
                }}
              >
                {userRole.toUpperCase()}
              </span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                fontSize: "0.85rem",
                background: "transparent",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to="/login"
              style={{
                border: "var(--border-width) solid var(--dark)",
                padding: "6px 14px",
                fontWeight: "700",
                textTransform: "uppercase",
                fontSize: "0.9rem",
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                border: "var(--border-width) solid var(--dark)",
                backgroundColor: "var(--red)",
                color: "var(--cream)",
                padding: "6px 14px",
                fontWeight: "700",
                textTransform: "uppercase",
                fontSize: "0.9rem",
              }}
            >
              Sign Up
            </Link>
          </div>
        )}

        <button className="theme-toggle" onClick={toggleTheme} style={{ padding: "8px 14px" }}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
