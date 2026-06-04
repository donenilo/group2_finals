import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { apiUrl } from "../../lib/api";

const AllReports = () => {
  const { role } = useOutletContext();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // No role redirect here — ProtectedRoute in App.jsx handles that
    fetch(apiUrl("/api/items"))
      .then((r) => r.json())
      .then(setReports)
      .catch(() => setReports([]));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ background: "#fff", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e8edf5" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", margin: "0 0 0.5rem" }}>
          All Reports — {role === "admin" ? "Admin View" : "Discipline Office View"}
        </p>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#1e2a4a", margin: 0 }}>
          System-Wide Reports
        </h2>
        <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.5rem 0 0" }}>
          {reports.length} total reports loaded.
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e8edf5", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ background: "#f8faff", borderBottom: "1.5px solid #e8edf5" }}>
              {["Item Name", "Category", "Location", "Status", "Reported By"].map((h) => (
                <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>
                  {h}
                </th>
              ))}
              {/* Edit/Modify Status column — Admin only, hidden from DO */}
              {role === "admin" && (
                <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontSize: "0.62rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td
                  colSpan={role === "admin" ? 6 : 5}
                  style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontStyle: "italic" }}
                >
                  No reports yet — or backend not running.
                </td>
              </tr>
            )}
            {reports.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#1e2a4a" }}>{item.title || "—"}</td>
                <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>{item.item_type || "—"}</td>
                <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>{item.location || "—"}</td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span style={{ padding: "0.2rem 0.7rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, background: item.status === "found" ? "#dcfce7" : "#fee2e2", color: item.status === "found" ? "#16a34a" : "#dc2626" }}>
                    {item.status || "unknown"}
                  </span>
                </td>
                <td style={{ padding: "0.85rem 1rem", color: "#64748b", fontSize: "0.75rem" }}>{item.reporter_name || "—"}</td>
                {/* Edit button — only rendered for admin, completely hidden from DO */}
                {role === "admin" && (
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <button
                      onClick={() => navigate(`/admin/edit/${item.id}`)}
                      style={{ padding: "0.3rem 0.7rem", borderRadius: "0.45rem", fontSize: "0.68rem", fontWeight: 700, background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe", cursor: "pointer" }}
                    >
                      Edit / Modify Status
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllReports;