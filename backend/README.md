# NUHanap API - Deliverable Member 4

## Folder Structure
```
backend/
├── server.js          ← Entry point, run this
├── db.js              ← MySQL connection pool
├── package.json
└── routes/
    └── items.js       ← All /api/items routes
```

---

## Setup

> Make sure XAMPP is running and `items_db.sql` is already imported in phpMyAdmin.

```bash
cd backend
npm install
npm run dev     # auto-restarts on save (uses nodemon)
```

Server runs at: **http://localhost:5000**

---

## Endpoints

### `GET /api/health`
To confirm if the server is up
```json
{ "status": "ok", "message": "NUHanap API is running." }
```

---

### `GET /api/items`
Returns all items with their primary image key.
Used by **Member 3** for Gallery Page.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Green Leather Wallet",
    "description": "...",
    "item_type": "Accessory",
    "status": "lost",
    "date_reported": "2026-05-05",
    "location": "Around Sampaloc Lane",
    "reporter_name": "Dan Buenaventura",
    "reporter_contact": "dan.buenaventura@example.com",
    "last_updated": "...",
    "primary_image": "items/1/wallet_front.jpg"
  },
  ...
]
```

---

### `GET /api/items/:id`
Returns one item plus ALL its images.
Used by **Member 1** for Item Details Page.

**Example:** `GET /api/items/1`

**Response:**
```json
{
  "id": 1,
  "title": "Green Leather Wallet",
  "status": "lost",
  ...
  "images": [
    { "image_id": 1, "image_key": "items/1/wallet_front.jpg", "is_primary": 1, "uploaded_at": "..." }
  ]
}
```

**Error cases:**
- `400` - ID is not a number
- `404` - No item with that ID

---

### `PUT /api/items/:id`
Updates an existing item.
Used by **Member 2** for Edit Page.

**Example:** `PUT /api/items/1`

**Request body (JSON):**
```json
{
  "title": "Green Leather Wallet",
  "description": "Updated description here",
  "item_type": "Accessory",
  "status": "claimed",
  "date_reported": "2026-05-05",
  "location": "Around Sampaloc Lane",
  "reporter_name": "Dan Buenaventura",
  "reporter_contact": "dan.buenaventura@example.com"
}
```

**Required fields:** `title`, `description`, `item_type`, `status`, `date_reported`, `location`
**Optional fields:** `reporter_name`, `reporter_contact`

**Valid `item_type` values:** `Electronics`, `Clothing`, `Accessory`, `Document`, `Other`
**Valid `status` values:** `lost`, `found`, `claimed`

**Success response:**
```json
{
  "message": "Item updated successfully.",
  "item": { ...updated item row... }
}
```

**Error cases:**
- `400` — Missing required fields (returns which ones are missing)
- `400` — Invalid enum value for `item_type` or `status`
- `404` — No item with that ID

---

## For the React team (Members 1, 2, 3)

Base URL to use in axios: `http://localhost:5000`

```js
// Example axios calls

// M3 - Get all items
const res = await axios.get('http://localhost:5000/api/items');

// M1 - Get one item
const res = await axios.get(`http://localhost:5000/api/items/${id}`);

// M2 - Update an item
const res = await axios.put(`http://localhost:5000/api/items/${id}`, formData);
```
