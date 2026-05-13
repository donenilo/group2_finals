const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/items (for Member 3's Gallery Page)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        i.*,
        img.image_key AS primary_image
      FROM items i
      LEFT JOIN item_images img
        ON img.item_id = i.id AND img.is_primary = 1
      ORDER BY i.date_reported DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/items error:', err);
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

// GET /api/items/:id (for Member 1's Item Details Page)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Reject non-numeric IDs immediately
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID.' });
  }

  try {
    // Fetch the item row
    const [items] = await pool.query(
      'SELECT * FROM items WHERE id = ?',
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    // Fetch all images for this item
    const [images] = await pool.query(
      'SELECT image_id, image_key, is_primary, uploaded_at FROM item_images WHERE item_id = ? ORDER BY is_primary DESC',
      [id]
    );

    res.json({ ...items[0], images });
  } catch (err) {
    console.error(`GET /api/items/${id} error:`, err);
    res.status(500).json({ error: 'Failed to fetch item.' });
  }
});

// PUT /api/items/:id (for Member 2's Edit Item Page)
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID.' });
  }

  const {
    title,
    description,
    item_type,
    status,
    date_reported,
    location,
    reporter_name,
    reporter_contact,
  } = req.body;

  // Validation (required fields)
  const requiredFields = { title, description, item_type, status, date_reported, location };
  const missing = Object.entries(requiredFields)
    .filter(([, v]) => !v || String(v).trim() === '')
    .map(([k]) => k);

  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields.',
      fields: missing,
    });
  }

  // Enum validation
  const validTypes = ['Electronics', 'Clothing', 'Accessory', 'Document', 'Other'];
  const validStatuses = ['lost', 'found', 'claimed'];

  if (!validTypes.includes(item_type)) {
    return res.status(400).json({ error: `Invalid item_type. Must be one of: ${validTypes.join(', ')}` });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const [result] = await pool.query(
      `UPDATE items SET
        title           = ?,
        description     = ?,
        item_type       = ?,
        status          = ?,
        date_reported   = ?,
        location        = ?,
        reporter_name   = ?,
        reporter_contact = ?
      WHERE id = ?`,
      [
        title.trim(),
        description.trim(),
        item_type,
        status,
        date_reported,
        location.trim(),
        reporter_name ? reporter_name.trim() : null,
        reporter_contact ? reporter_contact.trim() : null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    // Return the updated item so the frontend can refresh
    const [updated] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    res.json({ message: 'Item updated successfully.', item: updated[0] });
  } catch (err) {
    console.error(`PUT /api/items/${id} error:`, err);
    res.status(500).json({ error: 'Failed to update item.' });
  }
});

module.exports = router;
