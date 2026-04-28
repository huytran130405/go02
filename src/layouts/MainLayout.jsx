import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

const MainLayout = ({ children }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>

      {/* Header */}
      <header className="header">

        {/* LEFT: Logo + Nav */}
        <div className="logo-nav">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <i className="fa-solid fa-f"></i>
            </div>
            <h2>ForumHub</h2>
          </Link>

          {/* CENTER: Navigation */}
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} end>
              Home
            </NavLink>
            <NavLink to="/create-post" className={({ isActive }) => isActive ? "active" : ""}>
              Create Post
            </NavLink>
          </nav>
        </div>

        {/* RIGHT: Search + Auth */}
        <div className="header-right">
          <input
            type="text"
            placeholder="Search posts..."
            className="search-input"
          />

          {isLoggedIn ? (
            /* Đã đăng nhập: hiện avatar + tên + nút Logout */
            <div className="header-user-row">
              <div className="header-avatar" title={user?.email}>
                {user?.avatar || '?'}
              </div>
              <span className="header-user-name">{user?.name || user?.userName}</span>
              <button className="header-logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            /* Chưa đăng nhập: hiện nút Login */
            <NavLink to="/login" className="login-btn">Login</NavLink>
          )}
        </div>

      </header>

      {/* Content */}
      <main className="container">
        {children}
      </main>

    </div>
  );
};

export default MainLayout;