const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const pool = require('../db');

const upload = multer({ storage: multer.memoryStorage() });

const CATEGORY_MAP = {
  Electronics: 'Electronics',
  Documents: 'Document',
  'Personal Items': 'Accessory',
  'Books/Stationery': 'Document',
  Others: 'Other',
  Other: 'Other',
  Clothing: 'Clothing',
  Accessory: 'Accessory',
  Document: 'Document',
};

const sanitizeFilename = (filename) =>
  filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_');

// GET /api/items (for sorting/filtering)
router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    let sql = `
      SELECT
        i.*,
        img.image_key AS primary_image
      FROM items i
      LEFT JOIN item_images img
        ON img.item_id = i.id AND img.is_primary = 1
    `;

    if (sort === 'lost' || sort === 'found') {
      sql += ` WHERE i.status = ${pool.escape(sort)}`;
    }

    if (sort === 'name') {
      sql += ` ORDER BY i.title ASC`;
    } else if (sort === 'oldest') {
      sql += ` ORDER BY i.date_reported ASC`;
    } else {
      sql += ` ORDER BY i.date_reported DESC`;
    }

    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/items error:', err);
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid item ID.' });

  try {
    const [items] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    if (items.length === 0)
      return res.status(404).json({ error: 'Item not found.' });

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

// POST /api/items
router.post('/', upload.single('image'), async (req, res) => {
  const {
    title,
    description,
    item_type,
    status,
    location,
    reporter_name,
    reporter_contact,
  } = req.body;

  const resolvedItemType = CATEGORY_MAP[item_type] || item_type;
  const dateReported = new Date().toISOString().slice(0, 10);

  const requiredFields = { title, description, item_type: resolvedItemType, status, location };
  const missing = Object.entries(requiredFields)
    .filter(([, value]) => !value || String(value).trim() === '')
    .map(([key]) => key);

  if (missing.length > 0) {
    return res.status(400).json({ error: 'Missing required fields.', fields: missing });
  }

  const validTypes = ['Electronics', 'Clothing', 'Accessory', 'Document', 'Other'];
  const validStatuses = ['lost', 'found', 'claimed'];

  if (!validTypes.includes(resolvedItemType)) {
    return res.status(400).json({
      error: `Invalid item_type. Must be one of: ${validTypes.join(', ')}`,
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const connection = await pool.getConnection();
  let savedImagePath = null;

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO items
        (title, description, item_type, status, date_reported, location, reporter_name, reporter_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description.trim(),
        resolvedItemType,
        status,
        dateReported,
        location.trim(),
        reporter_name ? reporter_name.trim() : null,
        reporter_contact ? reporter_contact.trim() : null,
      ]
    );

    const itemId = result.insertId;

    if (req.file) {
      const imageFolder = path.join(__dirname, '..', 'uploads', 'items', String(itemId));
      await fs.mkdir(imageFolder, { recursive: true });

      const fileName = `${Date.now()}-${sanitizeFilename(req.file.originalname)}`;
      savedImagePath = path.join(imageFolder, fileName);

      await fs.writeFile(savedImagePath, req.file.buffer);

      const imageKey = path.posix.join('items', String(itemId), fileName);
      await connection.query(
        'INSERT INTO item_images (item_id, image_key, is_primary) VALUES (?, ?, 1)',
        [itemId, imageKey]
      );
    }

    await connection.commit();

    const [items] = await connection.query('SELECT * FROM items WHERE id = ?', [itemId]);
    const [images] = await connection.query(
      'SELECT image_id, image_key, is_primary, uploaded_at FROM item_images WHERE item_id = ? ORDER BY is_primary DESC',
      [itemId]
    );

    res.status(201).json({
      message: 'Item created successfully.',
      item: { ...items[0], images },
    });
  } catch (err) {
    await connection.rollback();

    if (savedImagePath) {
      await fs.unlink(savedImagePath).catch(() => {});
    }

    console.error('POST /api/items error:', err);
    res.status(500).json({ error: 'Failed to create item.' });
  } finally {
    connection.release();
  }
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid item ID.' });

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

  const requiredFields = { title, description, item_type, status, date_reported, location };
  const missing = Object.entries(requiredFields)
    .filter(([, v]) => !v || String(v).trim() === '')
    .map(([k]) => k);

  if (missing.length > 0)
    return res.status(400).json({ error: 'Missing required fields.', fields: missing });

  const validTypes = ['Electronics', 'Clothing', 'Accessory', 'Document', 'Other'];
  const validStatuses = ['lost', 'found', 'claimed'];

  if (!validTypes.includes(item_type))
    return res.status(400).json({ error: `Invalid item_type. Must be one of: ${validTypes.join(', ')}` });
  if (!validStatuses.includes(status))
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });

  try {
    const [result] = await pool.query(
      `UPDATE items SET
        title = ?, description = ?, item_type = ?, status = ?, date_reported = ?, location = ?, reporter_name = ?, reporter_contact = ?
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

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Item not found.' });

    const [updated] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    res.json({ message: 'Item updated successfully.', item: updated[0] });
  } catch (err) {
    console.error(`PUT /api/items/${id} error:`, err);
    res.status(500).json({ error: 'Failed to update item.' });
  }
});

module.exports = router;
