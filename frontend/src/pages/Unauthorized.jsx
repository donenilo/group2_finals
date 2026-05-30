import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "linear-gradient(135deg, #f1f4fb 0%, #fff 100%)" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "3rem 2rem", background: "#fff", borderRadius: "1.5rem", border: "1px solid #e8edf5", boxShadow: "0 8px 32px rgba(53,64,143,0.08)" }}>
        <div style={{ fontSize: "5rem", fontWeight: 900, color: "#35408f", lineHeight: 1, marginBottom: "0.5rem", opacity: 0.15 }}>403</div>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚫</div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1e2a4a", margin: "0 0 0.75rem" }}>Access Denied</h1>
        <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, margin: "0 0 2rem" }}>
          You don't have permission to view this page. This area is restricted based on your account role. If you believe this is a mistake, please contact the IT Admin.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate(-1)} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.7rem", fontSize: "0.82rem", fontWeight: 700, background: "#f1f5f9", color: "#64748b", border: "none", cursor: "pointer" }}>← Go Back</button>
          <button onClick={() => navigate("/dashboard/my-account")} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.7rem", fontSize: "0.82rem", fontWeight: 700, background: "#35408f", color: "#ffd700", border: "none", cursor: "pointer" }}>My Dashboard</button>
          <button onClick={() => navigate("/")} style={{ padding: "0.65rem 1.25rem", borderRadius: "0.7rem", fontSize: "0.82rem", fontWeight: 700, background: "#f8faff", color: "#35408f", border: "1.5px solid #35408f30", cursor: "pointer" }}>Home</button>
        </div>
      </div>
    </main>
  );
};

export default Unauthorized;