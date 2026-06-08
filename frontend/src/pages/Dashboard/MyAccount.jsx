import React from "react";
import { useOutletContext } from "react-router-dom";
import "./MyAccount.css";

const MyAccount = () => {
  const { user, roleColor, roleLabel, role } = useOutletContext();

  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.name || "—";

  const idNumber = user.student_number || user.faculty_number || "—";
  const idLabel = role === "faculty" ? "Faculty Number" : "Student Number";
  const showId = role === "student" || role === "faculty";

  const details = [
    { label: "Full Name", value: fullName, icon: "👤" },
    { label: "Email", value: user.email || "—", icon: "✉️" },
    ...(showId ? [{ label: idLabel, value: idNumber, icon: "🪪" }] : []),
    { label: "Role", value: roleLabel, icon: "🏷️" },
    { label: "Account Status", value: user.status || "Active", icon: "✅" },
  ];

  return (
    <div className="account-page">
      <div className="account-hero" style={{ "--accent": roleColor }}>
        <div className="account-hero-bg" />
        <div className="account-hero-inner">
          <div className="account-big-avatar" style={{ background: roleColor }}>
            {(user.first_name?.[0] || user.name?.[0] || "U").toUpperCase()}
          </div>
          <div className="account-hero-text">
            <h2 className="account-hero-name">{fullName}</h2>
            <span className="account-hero-badge" style={{ background: roleColor + "22", color: roleColor }}>
              {roleLabel}
            </span>
            <p className="account-hero-sub">{user.email || "No email on record"}</p>
          </div>
        </div>
      </div>

      <div className="account-section">
        <h3 className="account-section-title">Profile Details</h3>
        <div className="account-grid">
          {details.map((d) => (
            <div key={d.label} className="account-detail-card">
              <span className="account-detail-icon">{d.icon}</span>
              <div>
                <p className="account-detail-label">{d.label}</p>
                <p className="account-detail-value">{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="account-section">
        <h3 className="account-section-title">Quick Access</h3>
        <div className="account-quick-links">
          {(role === "student" || role === "faculty") && (
            <>
              <a href="/dashboard/my-reports" className="account-quick-btn" style={{ "--btn-color": roleColor }}>📋 My Reports</a>
              <a href="/items" className="account-quick-btn" style={{ "--btn-color": roleColor }}>🔍 Browse Items</a>
              <a href="/report-item" className="account-quick-btn" style={{ "--btn-color": roleColor }}>📝 Report an Item</a>
            </>
          )}
          {(role === "do" || role === "admin") && (
            <>
              <a href="/dashboard/all-reports" className="account-quick-btn" style={{ "--btn-color": roleColor }}>📊 All Reports</a>
              <a href="/items" className="account-quick-btn" style={{ "--btn-color": roleColor }}>🔍 Items Gallery</a>
            </>
          )}
          {role === "admin" && (
            <a href="/admin/manage-accounts" className="account-quick-btn" style={{ "--btn-color": roleColor }}>⚙️ Manage Accounts</a>
          )}
        </div>
      </div>

      <p className="account-placeholder-note">
        Kung gusto niyo palitan pa yung design ng accounts page, go lang nag set lang aq ng baseline
      </p>
    </div>
  );
};

export default MyAccount;