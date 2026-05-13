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
      .then(res => res.json())
      .then(data => setFormData({
        itemName: data.itemName || data.item_name || "",
        description: data.description || "",
        location: data.location || "",
        status: data.status?.toLowerCase() || "lost"
      }))
      .catch(err => console.error("Load error:", err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    let tempErrors = {};
    if (!formData.itemName.trim()) tempErrors.itemName = "Name is required";
    if (!formData.location.trim()) tempErrors.location = "Location is required";
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
        alert("Success!");
        navigate("/report");
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-report-container">
      <div className="edit-card">
        <h2 className="edit-title">Modify {formData.status} Entry</h2>
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="form-group">
            <label>Item Name</label>
            <input 
              type="text" 
              value={formData.itemName} 
              onChange={e => setFormData({...formData, itemName: e.target.value})}
              className={errors.itemName ? "error-input" : ""}
            />
          </div>
          <div className="form-group">
            <label>Status (Lost/Found)</label>
            <select 
              className={`status-select select-${formData.status}`}
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="edit-actions">
            <button type="submit" className="primary-btn" disabled={isSubmitting}>Update</button>
            <button type="button" className="secondary-btn" onClick={() => navigate("/report")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReport;