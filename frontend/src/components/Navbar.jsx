import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

// Menu items per role — shown in the user dropdown
const ROLE_MENU = {
  student: [
    { to: "/dashboard/my-account", label: "My Account" },
    { to: "/dashboard/my-reports", label: "My Reports" },
  ],
  faculty: [
    { to: "/dashboard/my-account", label: "My Account" },
    { to: "/dashboard/my-reports", label: "My Reports" },
  ],
  do: [
    { to: "/dashboard/my-account", label: "My Account" },
    { to: "/dashboard/all-reports", label: "All Reports" },
  ],
  admin: [
    { to: "/dashboard/my-account", label: "My Account" },
    { to: "/dashboard/all-reports", label: "All Reports" },
    { to: "/admin/manage-accounts", label: "Manage Accounts" }, // admin-only
    { to: "/admin/inventory", label: "Inventory" },             // admin-only
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const firstName = user?.first_name || user?.name || "User";
  const menuItems = ROLE_MENU[role] || ROLE_MENU.student;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  const closeMenu = () => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  };

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

          {/* Report Item link — only shown to logged-in users */}
          {isLoggedIn && (
            <NavLink to="/report-item" className={linkClass} onClick={closeMenu}>
              Report Item
            </NavLink>
          )}

          {isLoggedIn ? (
            <div className="nav__user" style={{ position: "relative" }}>
              <button
                className="nav__logout"
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
              >
                Welcome, {firstName} ▾
              </button>

              {userMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    onClick={() => setUserMenuOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 90 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      minWidth: "200px",
                      background: "#fff",
                      borderRadius: "0.9rem",
                      border: "1px solid #e8edf5",
                      boxShadow: "0 12px 32px rgba(53,64,143,0.14)",
                      padding: "0.4rem",
                      zIndex: 100,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {menuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeMenu}
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderRadius: "0.6rem",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "#35408f",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {item.label}
                      </Link>
                    ))}

                    <div style={{ height: "1px", background: "#e8edf5", margin: "0.35rem 0.4rem" }} />

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        padding: "0.6rem 0.8rem",
                        borderRadius: "0.6rem",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        color: "#dc2626",
                        background: "transparent",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      ↩ Logout
                    </button>
                  </div>
                </>
              )}
            </div>
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