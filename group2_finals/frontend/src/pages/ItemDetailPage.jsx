import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ItemDetailPage.css";

function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/api/items/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Item not found.");
          throw new Error("Failed to load item.");
        }
        const data = await res.json();
        setItem(data);

        const primary = data.images?.find((img) => img.is_primary) || data.images?.[0];
        setActiveImage(primary ? `http://localhost:5000/uploads/${primary.image_key}` : null);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const formattedDate = item?.date_reported
    ? new Date(item.date_reported).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date Unknown";

  const statusLabel =
    item?.status === "lost"
      ? "Lost"
      : item?.status === "found"
      ? "Found"
      : item?.status === "claimed"
      ? "Claimed"
      : item?.status || "Unknown";

  const statusClass =
    item?.status === "lost"
      ? "detail__status--lost"
      : item?.status === "found"
      ? "detail__status--found"
      : "detail__status--claimed";
  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton">
          <div className="skeleton-img" />
          <div className="skeleton-info">
            <div className="skeleton-line skeleton-line--short" />
            <div className="skeleton-line skeleton-line--long" />
            <div className="skeleton-line skeleton-line--med" />
            <div className="skeleton-line skeleton-line--med" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <span className="detail-error__icon">🔍</span>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="detail__back-btn" onClick={() => navigate("/items")}>
            ← Back to Gallery
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="detail-page">
      {/* Breadcrumb */}
      <div className="detail__breadcrumb">
        <button className="detail__back-btn" onClick={() => navigate("/items")}>
          ← Back to Gallery
        </button>
        <span className="detail__breadcrumb-sep">/</span>
        <span className="detail__breadcrumb-current">{item.title}</span>
      </div>

      {/* Main Card */}
      <div className="detail__card">

        {/* LEFT: Image Panel */}
        <div className="detail__image-panel">
          <div className="detail__main-image-wrap">
            <img
              src={
                activeImage ||
                "https://placehold.co/800x600/1A237E/FFFFFF?text=No+Photo"
              }
              alt={item.title}
              className="detail__main-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/800x600/1A237E/FFFFFF?text=No+Photo";
              }}
            />
            <div className={`detail__status ${statusClass}`}>{statusLabel}</div>
          </div>

          {/* Thumbnails (if multiple images) */}
          {item.images && item.images.length > 1 && (
            <div className="detail__thumbs">
              {item.images.map((img) => {
                const src = `http://localhost:5000/uploads/${img.image_key}`;
                return (
                  <button
                    key={img.image_id}
                    className={`detail__thumb ${activeImage === src ? "detail__thumb--active" : ""}`}
                    onClick={() => setActiveImage(src)}
                  >
                    <img
                      src={src}
                      alt="thumbnail"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/200x200/1A237E/FFFFFF?text=?";
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Info Panel */}
        <div className="detail__info-panel">
          {/* Header */}
          <div className="detail__info-header">
            <span className="detail__type-badge">{item.item_type || "Other"}</span>
            <h1 className="detail__title">{item.title}</h1>
            <p className="detail__description">{item.description}</p>
          </div>

          {
            
          }
          <div className="detail__meta-grid">
            <div className="detail__meta-item">
              <span className="detail__meta-label">📍 Location</span>
              <span className="detail__meta-value">{item.location || "Unknown"}</span>
            </div>
            <div className="detail__meta-item">
              <span className="detail__meta-label">📅 Date Reported</span>
              <span className="detail__meta-value">{formattedDate}</span>
            </div>
            <div className="detail__meta-item">
              <span className="detail__meta-label">🏷️ Category</span>
              <span className="detail__meta-value">{item.item_type || "Other"}</span>
            </div>
            <div className="detail__meta-item">
              <span className="detail__meta-label">📋 Status</span>
              <span className={`detail__meta-status ${statusClass}`}>{statusLabel}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="detail__divider" />

          {/* Reporter info */}
          <div className="detail__reporter">
            <p className="detail__reporter-label">Reported by</p>
            <div className="detail__reporter-card">
              <div className="detail__reporter-avatar">
                {(item.reporter_name || "A")[0].toUpperCase()}
              </div>
              <div>
                <p className="detail__reporter-name">
                  {item.reporter_name || "Anonymous"}
                </p>
                {item.reporter_contact && (
                  <p className="detail__reporter-contact">{item.reporter_contact}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="detail__actions">
            <button
              className="detail__action-btn detail__action-btn--primary"
              onClick={() => navigate("/report-item")}
            >
              📝 I Know This Item
            </button>
            <button
              className="detail__action-btn detail__action-btn--secondary"
              onClick={() => navigate("/items")}
            >
              ← Back to Gallery
            </button>
          </div>

          {/* Item ID reference */}
          <p className="detail__ref">Reference ID: #{String(item.id).padStart(4, "0")}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailPage;
