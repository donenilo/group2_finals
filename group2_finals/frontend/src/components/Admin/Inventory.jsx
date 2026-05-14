import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all"); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const status = item.status?.toLowerCase().trim();
    if (filter === "all") return true;
    return status === filter;
  });

  return (
    <div className="report-list-container">
      <div className="report-list-header">
        <h2 className="section-title">Admin Inventory Management</h2>
        
        <div className="filter-bar">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "lost" ? "active-lost" : ""} onClick={() => setFilter("lost")}>Lost</button>
          <button className={filter === "found" ? "active-found" : ""} onClick={() => setFilter("found")}>Found</button>
          <button 
            className={filter === "pending" ? "active-pending" : "btn-testing"} 
            onClick={() => setFilter("pending")}
          >
            Pending Review
          </button>
        </div>
      </div>

      <div className="inventory-sheet">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id || item._id}>
                <td className="item-name-cell">
                  {item.title || "Unnamed Item"}
                </td>
                <td>{item.item_type || "N/A"}</td>
                <td>{item.location}</td>
                <td>
                  <div className="status-cell-wrapper">
                    <span className={`status-pill pill-${item.status?.toLowerCase().trim()}`}>
                      {item.status}
                    </span>
                  </div>
                </td>
                <td>
                  <button 
                    className="edit-action-btn" 
                    onClick={() => navigate(`/admin/edit/${item.id || item._id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;