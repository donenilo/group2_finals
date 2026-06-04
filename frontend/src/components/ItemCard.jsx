import React from "react";
import { useNavigate } from "react-router-dom"; 
import { assetUrl } from "../lib/api";
import "./ItemCard.css";

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  const formattedDate = item.date_reported
    ? new Date(item.date_reported).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date Unknown";

  const statusLabel =
    item.status === "lost"
      ? "Lost"
      : item.status === "found"
      ? "Found"
      : item.status || "Unknown";

  const imageSrc = item.primary_image
    ? assetUrl(item.primary_image)
    : "https://placehold.co/800x600/1A237E/FFFFFF?text=No+Photo";

  return (
    <article className="item-card group">
      <div className="item-card__image-wrap">
        <img
          src={imageSrc}
          alt={item.title || "Item image"}
          className="item-card__image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/800x600/1A237E/FFFFFF?text=No+Photo";
          }}
        />
        <div
          className={`item-card__status ${
            item.status === "lost"
              ? "item-card__status--lost"
              : "item-card__status--found"
          }`}
        >
          {statusLabel}
        </div>
      </div>

      <div className="item-card__body">
        <h3 className="item-card__title">{item.title}</h3>
        <div className="item-card__meta-row">
          <span className="item-card__chip">📍 {item.location || "Unknown"}</span>
          <span className="item-card__chip">{formattedDate}</span>
        </div>
        <p className="item-card__description">
          {item.description || "No description available."}
        </p>
        <div className="item-card__footer">
          <div className="item-card__finder">
            <span className="item-card__finder-label">Reported by</span>
            <span className="item-card__finder-value">
              {item.reporter_name || "Anonymous"}
            </span>
          </div>
          {/* ── OPEN BUTTON: now navigates to detail page ── */}
          <button
            className="item-card__button"
            onClick={() => navigate(`/item/${item.id}`)}
          >
            Open
          </button>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
