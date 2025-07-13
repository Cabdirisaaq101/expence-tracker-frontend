import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

interface UserProfile {
  name: string;
  profileImage?: string;
}

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load navbar profile:", err);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setTimeout(() => navigate("/login"), 0);
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-brand">
        <Link to="/dashboard">ExpenseTracker</Link>
      </div>

      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
        <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
        
        <div className="nav-controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          
          <div className="user-section">
            {profile?.profileImage && (
              <img
                src={`http://localhost:5000${profile.profileImage}`}
                alt="Profile"
                className="nav-avatar"
              />
            )}
            <span className="username">{profile?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <button 
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}