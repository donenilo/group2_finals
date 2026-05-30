import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

const NAV_CONFIG = {
  student: [
    { to: "/dashboard/my-account", label: "My Account", icon: "👤" },
    { to: "/dashboard/my-reports", label: "My Reports", icon: "📋" }
  ],
  faculty: [
    { to: "/dashboard/my-account", label: "My Account", icon: "👤" },
    { to: "/dashboard/my-reports", label: "My Reports", icon: "📋" }
  ],
  do: [
    { to: "/dashboard/my-account", label: "My Account", icon: "👤" },
    { to: "/dashboard/all-reports", label: "All Reports", icon: "📊" }
  ],
  admin: [
    { to: "/dashboard/my-account", label: "My Account", icon: "👤" },
    { to: "/dashboard/all-reports", label: "All Reports", icon: "📊" },
    { to: "/admin/manage-accounts", label: "Manage Accounts", icon: "⚙️" },
    { to: "/admin/inventory", label: "Inventory", icon: "🗂️" },
  ],
};

const ROLE_LABELS = {
  student: "Student",
  faculty: "Faculty",
  do: "Discipline Office",
  admin: "IT Admin",
};

const ROLE_COLORS = {
  student: "#35408F",
  faculty: "#0e7c5b",
  do: "#b45309",
  admin: "#7c3aed",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  if (!user) return null;

  const role = user.role?.toLowerCase() || "student";
  const navLinks = NAV_CONFIG[role] || NAV_CONFIG.student;
  const roleLabel = ROLE_LABELS[role] || "Student";
  const roleColor = ROLE_COLORS[role] || "#35408F";

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("my-account")) return "My Account";
    if (path.includes("my-reports")) return "My Reports";
    if (path.includes("all-reports")) return "All Reports";
    if (path.includes("manage-accounts")) return "Manage Accounts";
    if (path.includes("inventory")) return "Inventory";
    return "Dashboard";
  };

  return (
    <div className="dash-root">
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar--open" : ""}`}>
        <div className="dash-profile-card">
          <div className="dash-avatar" style={{ background: roleColor }}>
            {(user.first_name?.[0] || user.name?.[0] || "U").toUpperCase()}
          </div>
          <div className="dash-profile-info">
            <p className="dash-profile-name">
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.name || "User"}
            </p>
            <span className="dash-role-badge" style={{ background: roleColor + "18", color: roleColor }}>
              {roleLabel}
            </span>
          </div>
        </div>

        {(user.student_number || user.faculty_number) && (
          <div className="dash-id-display">
            <span className="dash-id-label">
              {role === "faculty" ? "Faculty No." : "Student No."}
            </span>
            <span className="dash-id-value">
              {user.student_number || user.faculty_number}
            </span>
          </div>
        )}

        <nav className="dash-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `dash-nav-link ${isActive ? "dash-nav-link--active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) =>
                isActive ? { "--link-color": roleColor } : {}
              }
            >
              <span className="dash-nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="dash-logout-btn" onClick={handleLogout}>
          <span>↩</span> Sign Out
        </button>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <span className="dash-menu-bar" />
            <span className="dash-menu-bar" />
            <span className="dash-menu-bar" />
          </button>

          <div className="dash-topbar-title">
            <h1 className="dash-page-title">{getPageTitle()}</h1>
            <p className="dash-breadcrumb">Dashboard / {getPageTitle()}</p>
          </div>

          <div className="dash-topbar-right">
            <span className="dash-topbar-name">
              {user.first_name || user.name || "User"}
            </span>
            <div className="dash-topbar-avatar" style={{ background: roleColor }}>
              {(user.first_name?.[0] || user.name?.[0] || "U").toUpperCase()}
            </div>
          </div>
        </header>

        <main className="dash-content">
          <Outlet context={{ user, roleColor, roleLabel, role }} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;