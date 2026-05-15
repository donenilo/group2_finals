import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditReport.css";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    location: "",
    status: "lost",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setFormData({
          itemName: data.title || data.item_name || "",
          description: data.description || "",
          location: data.location || "",
          // FIX: status was uppercase from DB sometimes — normalize it
          status: data.status?.toLowerCase() || "lost",
        })
      )
      .catch((err) => console.error("Load error:", err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation — FIX: added description check (backend requires it)
    let tempErrors = {};
    if (!formData.itemName.trim())   tempErrors.itemName    = "Item name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";
    if (!formData.location.trim())   tempErrors.location    = "Location is required.";
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Item updated successfully!");
        // FIX: was navigating to "/report" which doesn't exist — corrected to inventory
        navigate("/admin/inventory");
      } else {
        const errData = await response.json();
        alert(errData.message || "Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Network error — check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-report-container">
      <div className="edit-report-card">
        <div className="edit-report-header">
          <span className="admin-tag">Admin</span>
          <h2 className="edit-report-title">Edit Report</h2>
        </div>

        <form onSubmit={handleUpdate}>
          {/* Item Name */}
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              className={`input-field ${errors.itemName ? "error-border" : ""}`}
              // FIX: className was "error-input" but CSS defines "error-border"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="e.g. Black Umbrella"
            />
            {errors.itemName && <span className="error-message">{errors.itemName}</span>}
          </div>

          {/* Description — FIX: this field was missing entirely from the original */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              className={`textarea-field ${errors.description ? "error-border" : ""}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the item in detail..."
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select
              className="status-dropdown"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="claimed">Claimed / Returned</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className={`input-field ${errors.location ? "error-border" : ""}`}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. NU Library, 2nd Floor"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          {/* Actions */}
          <div className="edit-report-actions">
            <button
              type="submit"
              className="primary-btn"
              // FIX: was onClick={isSubmitting} (boolean, not a handler) — should be disabled
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Item"}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/admin/inventory")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReport;
