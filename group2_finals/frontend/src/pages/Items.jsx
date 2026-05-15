import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import "./Items.css";

function Items() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`http://localhost:5000/api/items?sort=${sortOption}`);
        setItems(res.data);
      } catch (err) {
        setError("Failed to load items. Check if backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [sortOption]);

  // FIX: was filtering on item.name API returns item.title
  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="items-container">
      {/* HEADER */}
      <section className="gallery-header">
        <div className="header-text">
          <p className="subtitle">NUHanap? Gallery</p>
          <h2 className="title">Item Gallery</h2>
          <p className="description">Browse lost and found reports for the NU Community.</p>
        </div>

        <div className="controls-group">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search items..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {["newest", "oldest", "lost", "found"].map((option) => (
              <button
                key={option}
                className={`filter-btn ${sortOption === option ? "active" : ""}`}
                onClick={() => setSortOption(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      {loading ? (
        <div className="items-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : error ? (
        <div className="error-box"><p>{error}</p></div>
      ) : filteredItems.length > 0 ? (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="card-wrapper">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>Oops! No items match your search.</p>
          <button
            className="clear-btn"
            onClick={() => { setSortOption("newest"); setSearchQuery(""); }}
          >
            Reset Gallery
          </button>
        </div>
      )}
    </main>
  );
}

export default Items;
