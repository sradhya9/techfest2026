import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
 const { theme, toggleTheme } = useTheme();

 return (
 <nav className="navbar">
 <h2 className="nav-logo">TechFest <span>2026</span></h2>
 <div className="nav-links">
 <Link to="/">Home</Link>
 <Link to="/events">Events</Link>
 <Link to="/register">Register</Link>
 <Link to="/gallery">Gallery</Link>
 <Link to="/contact">Contact</Link>
 <Link to="/dashboard">Dashboard</Link>
 </div>
 <button className="theme-toggle" onClick={toggleTheme}>
 {theme === "light" ? "Switch to Dark" : "Switch to Light"}
 </button>
 </nav>
 );
}

export default Navbar;
