import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { apiUrl } from "../../lib/api";
import "./ManageAccounts.css";

const API = apiUrl("/api/users");

const MOCK_ACCOUNTS = [
  { id: 1, name: "Ana Reyes", email: "ana.reyes@nu.edu.ph", role: "student", student_number: "2023-00001", status: "active" },
  { id: 2, name: "Ben Santos", email: "ben.santos@nu.edu.ph", role: "student", student_number: "2023-00002", status: "active" },
  { id: 3, name: "Prof. Cruz", email: "p.cruz@nu.edu.ph", role: "faculty", faculty_number: "FAC-0012", status: "active" },
  { id: 4, name: "DO Staff", email: "do@nu.edu.ph", role: "do", student_number: null, status: "active" },
  { id: 5, name: "Carlo Lim", email: "carlo.lim@nu.edu.ph", role: "student", student_number: "2022-00088", status: "suspended" },
];

const ROLE_BADGE = {
  student: { bg: "#35408f18", color: "#35408f", label: "Student" },
  faculty: { bg: "#0e7c5b18", color: "#0e7c5b", label: "Faculty" },
  do: { bg: "#b4530918", color: "#b45309", label: "DO" },
  admin: { bg: "#7c3aed18", color: "#7c3aed", label: "Admin" },
};

const ManageAccounts = () => {
  // ProtectedRoute already guarantees only admins reach this page.
  // We still read role from context for any display purposes.
  const { role } = useOutletContext();
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [newAccount, setNewAccount] = useState({ name: "", email: "", role: "student", student_number: "" });
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((data) => {
        setAccounts(Array.isArray(data) ? data : []);
        setUsingMock(false);
      })
      .catch(() => {
        setAccounts(MOCK_ACCOUNTS);
        setUsingMock(true);
      });
  }, []);

  const filtered = accounts.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.student_number || "").includes(search);
    const matchRole = filterRole === "all" || a.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleSuspend = async (id) => {
    if (usingMock) {
      setAccounts((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: a.status === "suspended" ? "active" : "suspended" } : a)
      );
      return;
    }
    try {
      const res = await fetch(`${API}/${id}/suspend`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAccounts((prev) => prev.map((a) => a.id === id ? data.user : a));
    } catch (err) {
      alert(err.message || "Could not update status.");
    }
  };

  const handleDelete = async (id) => {
    if (usingMock) {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      setConfirmDelete(null);
      return;
    }
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || "Could not delete account.");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleAdd = async () => {
    if (!newAccount.name || !newAccount.email) return;
    if (usingMock) {
      setAccounts((prev) => [...prev, { ...newAccount, id: Date.now(), status: "active" }]);
      setNewAccount({ name: "", email: "", role: "student", student_number: "" });
      setShowAddModal(false);
      return;
    }
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAccounts((prev) => [data.user, ...prev]);
      setNewAccount({ name: "", email: "", role: "student", student_number: "" });
      setShowAddModal(false);
      if (data.defaultPassword) {
        alert(`Account created. Temporary password: ${data.defaultPassword}`);
      }
    } catch (err) {
      alert(err.message || "Could not create account.");
    }
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    if (usingMock) {
      setAccounts((prev) => prev.map((a) => a.id === editTarget.id ? editTarget : a));
      setEditTarget(null);
      return;
    }
    try {
      const res = await fetch(`${API}/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTarget),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAccounts((prev) => prev.map((a) => a.id === editTarget.id ? data.user : a));
      setEditTarget(null);
    } catch (err) {
      alert(err.message || "Could not update account.");
    }
  };

  return (
    <div className="mgmt-page">
      <div className="mgmt-header">
        <div>
          <h2 className="mgmt-title">Account Management</h2>
          <p className="mgmt-sub">{accounts.length} total accounts</p>
        </div>
        {/* Add Account — Admin only action */}
        {role === "admin" && (
          <button className="mgmt-add-btn" onClick={() => setShowAddModal(true)}>
            + Add Account
          </button>
        )}
      </div>

      <div className="mgmt-toolbar">
        <input
          type="text"
          className="mgmt-search"
          placeholder="🔍  Search by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mgmt-filters">
          {["all", "student", "faculty", "do", "admin"].map((r) => (
            <button
              key={r}
              className={`mgmt-filter-btn ${filterRole === r ? "active" : ""}`}
              onClick={() => setFilterRole(r)}
            >
              {r === "all" ? "All" : ROLE_BADGE[r]?.label || r}
            </button>
          ))}
        </div>
      </div>

      <div className="mgmt-table-wrap">
        <table className="mgmt-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID Number</th>
              <th>Role</th>
              <th>Status</th>
              {/* Actions column — Admin only */}
              {role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={role === "admin" ? 6 : 5} className="mgmt-empty">
                  No accounts found.
                </td>
              </tr>
            )}
            {filtered.map((acc) => {
              const badge = ROLE_BADGE[acc.role] || ROLE_BADGE.student;
              return (
                <tr key={acc.id} className={acc.status === "suspended" ? "mgmt-row--suspended" : ""}>
                  <td className="mgmt-name-cell">
                    <div className="mgmt-mini-avatar" style={{ background: badge.color }}>
                      {acc.name[0].toUpperCase()}
                    </div>
                    <span>{acc.name}</span>
                  </td>
                  <td className="mgmt-email">{acc.email}</td>
                  <td className="mgmt-id">{acc.student_number || acc.faculty_number || "—"}</td>
                  <td>
                    <span className="mgmt-role-badge" style={{ background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  </td>
                  <td>
                    <span className={`mgmt-status-pill ${acc.status}`}>
                      {acc.status === "suspended" ? "⏸ Suspended" : "✓ Active"}
                    </span>
                  </td>
                  {/* Edit / Suspend / Delete — Admin only */}
                  {role === "admin" && (
                    <td>
                      <div className="mgmt-actions">
                        <button className="mgmt-btn mgmt-btn--edit" onClick={() => setEditTarget({ ...acc })}>
                          Edit
                        </button>
                        <button
                          className={`mgmt-btn ${acc.status === "suspended" ? "mgmt-btn--unsuspend" : "mgmt-btn--suspend"}`}
                          onClick={() => handleSuspend(acc.id)}
                        >
                          {acc.status === "suspended" ? "Unsuspend" : "Suspend"}
                        </button>
                        <button className="mgmt-btn mgmt-btn--delete" onClick={() => setConfirmDelete(acc)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="mgmt-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="mgmt-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="mgmt-modal-title">Add New Account</h3>
            <div className="mgmt-form">
              <label>Full Name</label>
              <input value={newAccount.name} onChange={(e) => setNewAccount((p) => ({ ...p, name: e.target.value }))} placeholder="Juan dela Cruz" />
              <label>Email</label>
              <input type="email" value={newAccount.email} onChange={(e) => setNewAccount((p) => ({ ...p, email: e.target.value }))} placeholder="user@nu.edu.ph" />
              <label>Role</label>
              <select value={newAccount.role} onChange={(e) => setNewAccount((p) => ({ ...p, role: e.target.value }))}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="do">Discipline Office</option>
                <option value="admin">Admin (IT)</option>
              </select>
              <label>ID Number</label>
              <input value={newAccount.student_number} onChange={(e) => setNewAccount((p) => ({ ...p, student_number: e.target.value }))} placeholder="2024-XXXXXX" />
            </div>
            <div className="mgmt-modal-footer">
              <button className="mgmt-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="mgmt-modal-confirm" onClick={handleAdd}>Add Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="mgmt-modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="mgmt-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="mgmt-modal-title">Edit Account</h3>
            <div className="mgmt-form">
              <label>Full Name</label>
              <input value={editTarget.name} onChange={(e) => setEditTarget((p) => ({ ...p, name: e.target.value, full_name: e.target.value }))} />
              <label>Email</label>
              <input type="email" value={editTarget.email} onChange={(e) => setEditTarget((p) => ({ ...p, email: e.target.value }))} />
              <label>Role</label>
              <select value={editTarget.role} onChange={(e) => setEditTarget((p) => ({ ...p, role: e.target.value }))}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="do">Discipline Office</option>
                <option value="admin">Admin (IT)</option>
              </select>
              <label>ID Number</label>
              <input value={editTarget.student_number || editTarget.faculty_number || ""} onChange={(e) => setEditTarget((p) => ({ ...p, student_number: e.target.value }))} />
            </div>
            <div className="mgmt-modal-footer">
              <button className="mgmt-modal-cancel" onClick={() => setEditTarget(null)}>Cancel</button>
              <button className="mgmt-modal-confirm" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="mgmt-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="mgmt-modal mgmt-modal--danger" onClick={(e) => e.stopPropagation()}>
            <h3 className="mgmt-modal-title">Delete Account?</h3>
            <p className="mgmt-confirm-text">
              You are about to permanently delete <strong>{confirmDelete.name}</strong>'s account. This cannot be undone.
            </p>
            <div className="mgmt-modal-footer">
              <button className="mgmt-modal-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="mgmt-modal-delete" onClick={() => handleDelete(confirmDelete.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <p className="mgmt-note">
        {usingMock
          ? "⚠️ Backend not detected — showing demo data. Start the API server to manage real accounts."
          : "✓ Connected to the database. Changes here are saved to the users table."}
      </p>
    </div>
  );
};

export default ManageAccounts;