import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportItem.css";

const ReportItem = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    itemName: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const submission = new FormData();
    Object.keys(formData).forEach(key => submission.append(key, formData[key]));
    if (image) submission.append("image", image);

    console.log("Form Submitted:", formData);
    alert("Report submitted successfully!");
    navigate("/items");
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
            <button type="submit" className="submit-btn">Submit Report</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItem;