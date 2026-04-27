import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/layout.css";

const MainLayout = ({ children }) => {
  return (
    <div>

      {/* Header */}
      <header className="header">

        {/* LEFT: Logo */}
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
            <NavLink to="/create" className={({ isActive }) => isActive ? "active" : ""}>
              Create Post
            </NavLink>
          </nav>
        </div>

        {/* RIGHT: Search + Login */}
        <div className="header-right">
          <input
            type="text"
            placeholder="Search posts..."
            className="search-input"
          />
          <button className="login-btn">Login</button>
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