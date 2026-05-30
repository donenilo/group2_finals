import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ReportItem.css";

const ReportItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If we arrived from an item's "I Know This Item" button, prefill the name.
  const prefillName = location.state?.itemName || "";

  // Pull the logged-in user (if any) so we can auto-fill name & email.
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    reporterName: storedUser?.full_name || storedUser?.name || "",
    reporterContact: storedUser?.email || "",
    itemName: prefillName,
    category: "Electronics",
    otherCategory: "", 
    location: "",
    description: "",
    status: "found",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryMap = {
      Electronics: "Electronics",
      Documents: "Document",
      "Personal Items": "Accessory",
      "Books/Stationery": "Document",
      Others: "Other",
    };

    const itemType = categoryMap[formData.category] || "Other";
    const description = formData.otherCategory.trim()
      ? `${formData.description.trim()}\n\nCustom category: ${formData.otherCategory.trim()}`
      : formData.description.trim();

    const submission = new FormData();

    submission.append("title", formData.itemName.trim());
    submission.append("description", description);
    submission.append("item_type", itemType);
    submission.append("status", formData.status);
    submission.append("location", formData.location.trim());
    submission.append("reporter_name", formData.reporterName.trim());
    submission.append("reporter_contact", formData.reporterContact.trim());

    if (image) submission.append("image", image);

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        body: submission,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit report.");
      }

      alert("Report submitted successfully!");
      navigate("/items");
    } catch (error) {
      console.error("Submit failed:", error);
      alert(error.message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <header className="report-header">
          <h1 className="report-title">Report an Item</h1>
          <p className="report-subtitle">Helping the NU Community find what matters.</p>
        </header>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-row">
            <div className="form-group">
              <label>Reported by{storedUser && " (from your account)"}</label>
              <input
                type="text"
                name="reporterName"
                placeholder="Juan Dela Cruz"
                value={formData.reporterName}
                onChange={handleChange}
                required
                readOnly={!!storedUser}
                style={storedUser ? { background: "#f1f5f9", cursor: "not-allowed", opacity: 0.6 } : undefined}
              />
            </div>

            <div className="form-group">
              <label>Contact{storedUser && " (from your account)"}</label>
              <input
                type="text"
                name="reporterContact"
                placeholder="example@students.nu-laguna.edu.ph"
                value={formData.reporterContact}
                onChange={handleChange}
                required
                readOnly={!!storedUser}
                style={storedUser ? { background: "#f1f5f9", cursor: "not-allowed", opacity: 0.6 } : undefined}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="e.g., Blue Tumbler"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Report Type</label>
              <select name="status" value={formData.status} onChange={handleChange} className={`status-select ${formData.status}`}>
                <option value="found">I Found Something</option>
                <option value="lost">I Lost Something</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents/IDs</option>
              <option value="Personal Items">Personal Items</option>
              <option value="Books/Stationery">Books/Stationery</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {formData.category === "Others" && (
            <div className="form-group animate-fade-in">
              <label>Please specify category</label>
              <input
                type="text"
                name="otherCategory"
                placeholder="Enter category name"
                value={formData.otherCategory}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Attach Image</label>
            <div className="file-upload-container">
              <label htmlFor="file-upload" className="custom-file-upload">
                Choose an Image
              </label>
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              {/* FEEDBACK */}
              {image && <p className="file-name-display">Selected: <strong>{image.name}</strong></p>}
              <p className="file-hint">Upload a photo to help identify the item faster.</p>
            </div>
          </div>

          <div className="form-group">
            <label>Where was it located?</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" value="Submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItem;