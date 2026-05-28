import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand" onClick={closeMenu}>
          <img 
            src="https://static.wixstatic.com/media/2179b6_6c859da3978c4f17b27e723b90bc9f31~mv2.png/v1/fill/w_167,h_188,al_c,usm_0.66_1.00_0.01/zP6W5Ac5.png" 
            alt="NU Logo" 
            className="nav__logo-img" 
          />
          <div>
            <p className="nav__title">NUHanap?</p>
            <p className="nav__subtitle">Lost and Found System</p>
          </div>
        </Link>

        {/* HAMBURGER */}
        <button 
          className={`nav__toggle ${isMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* NAV LINKS */}
        <nav className={`nav__links ${isMenuOpen ? "nav__links--open" : ""}`}>
          <NavLink to="/" className={linkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/items" className={linkClass} onClick={closeMenu}>Items</NavLink>
          <NavLink to="/report-item" className={linkClass} onClick={closeMenu}>Report</NavLink>
          <NavLink to="/admin/inventory" className={linkClass} onClick={closeMenu}>Inventory</NavLink>
          <NavLink to="/account" className={linkClass} onClick={closeMenu}>Account</NavLink>
          
          {isLoggedIn ? (
            <button className="nav__logout" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={linkClass} onClick={closeMenu}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;