const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const pool = require('../db');

const VALID_ROLES = ['student', 'faculty', 'do', 'admin'];

const normalizeRole = (value) => {
  if (!value) return 'student';
  const r = String(value).trim().toLowerCase();
  return VALID_ROLES.includes(r) ? r : 'student';
};

const shapeUser = (row) => {
  const role = row.role;
  const nameParts = (row.full_name || '').trim().split(/\s+/);
  return {
    id: row.id,
    name: row.full_name,
    full_name: row.full_name,
    first_name: nameParts[0] || '',
    last_name: nameParts.slice(1).join(' ') || '',
    email: row.email,
    role,
    student_number: role === 'faculty' ? null : row.id_number,
    faculty_number: role === 'faculty' ? row.id_number : null,
    status: row.status,
  };
};

// ------------------------------------------------------------
// POST /api/users/register  — public sign-up
// ------------------------------------------------------------
router.post('/register', async (req, res) => {
  const { full_name, email, password, user_type, student_number } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const role = normalizeRole(user_type);
  const idNumber = student_number ? String(student_number).trim() : null;

  try {
    // Check duplicate email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Check duplicate student number (students only)
    if (idNumber && role === 'student') {
      const [dupeId] = await pool.query(
        'SELECT id FROM users WHERE id_number = ? AND role = ?',
        [idNumber, 'student']
      );
      if (dupeId.length > 0) {
        return res.status(409).json({ error: 'An account with this student number already exists.' });
      }
    }

    const hash = await bcrypt.hash(String(password), 10);

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password, role, id_number, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [full_name.trim(), email.trim(), hash, role, idNumber]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Registration successful.', user: shapeUser(rows[0]) });
  } catch (err) {
    console.error('POST /api/users/register error:', err);
    // Return error details temporarily to aid debugging in production logs.
    res.status(500).json({ error: 'Failed to register. Please try again.', details: err.message });
  }
});

// ------------------------------------------------------------
// POST /api/users/login  — public login
// ------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userRow = rows[0];
    const match = await bcrypt.compare(String(password), userRow.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (userRow.status === 'suspended') {
      return res.status(403).json({ error: 'This account is suspended. Please contact the IT Admin.' });
    }

    res.json({
      message: 'Login successful.',
      token: `session-${userRow.id}-${Date.now()}`,
      user: shapeUser(userRow),
    });
  } catch (err) {
    console.error('POST /api/users/login error:', err);
    // Return error details temporarily to aid debugging in production logs.
    res.status(500).json({ error: 'Failed to log in. Please try again.', details: err.message });
  }
});

// ------------------------------------------------------------
// GET /api/users/me/reports?email=...&name=...
// ------------------------------------------------------------
router.get('/me/reports', async (req, res) => {
  const { email, name } = req.query;
  if (!email && !name) {
    return res.status(400).json({ error: 'Provide an email or name to look up reports.' });
  }
  try {
    const [rows] = await pool.query(
      `SELECT i.*, img.image_key AS primary_image
         FROM items i
         LEFT JOIN item_images img ON img.item_id = i.id AND img.is_primary = 1
        WHERE (? <> '' AND i.reporter_contact = ?)
           OR (? <> '' AND i.reporter_name = ?)
        ORDER BY i.date_reported DESC`,
      [email || '', email || '', name || '', name || '']
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/users/me/reports error:', err);
    res.status(500).json({ error: 'Failed to fetch your reports.' });
  }
});

// ------------------------------------------------------------
// GET /api/users  — admin: list all accounts
// ------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows.map(shapeUser));
  } catch (err) {
    console.error('GET /api/users error:', err);
    // Return error details temporarily to aid debugging in production logs.
    res.status(500).json({ error: 'Failed to fetch accounts.', details: err.message });
  }
});

// ------------------------------------------------------------
// POST /api/users  — admin: add an account
// ------------------------------------------------------------
router.post('/', async (req, res) => {
  const { name, full_name, email, role, student_number, password } = req.body;
  const displayName = full_name || name;

  if (!displayName || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const roleValue = normalizeRole(role);
  const idNumber = student_number ? String(student_number).trim() : null;
  const rawPassword = password && String(password).length >= 6 ? password : 'changeme123';

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Check duplicate student number when admin adds a student
    if (idNumber && roleValue === 'student') {
      const [dupeId] = await pool.query(
        'SELECT id FROM users WHERE id_number = ? AND role = ?',
        [idNumber, 'student']
      );
      if (dupeId.length > 0) {
        return res.status(409).json({ error: 'An account with this student number already exists.' });
      }
    }

    const hash = await bcrypt.hash(String(rawPassword), 10);
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password, role, id_number, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [displayName.trim(), email.trim(), hash, roleValue, idNumber]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({
      message: 'Account created.',
      defaultPassword: password ? undefined : 'changeme123',
      user: shapeUser(rows[0]),
    });
  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// ------------------------------------------------------------
// PUT /api/users/:id  — admin: modify an account
// ------------------------------------------------------------
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID.' });

  const { name, full_name, email, role, student_number } = req.body;
  const displayName = full_name || name;

  if (!displayName || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const roleValue = normalizeRole(role);
  const idNumber = student_number ? String(student_number).trim() : null;

  try {
    const [dupe] = await pool.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email.trim(), id]);
    if (dupe.length > 0) {
      return res.status(409).json({ error: 'Another account already uses this email.' });
    }

    // Check duplicate student number on edit (exclude current account)
    if (idNumber && roleValue === 'student') {
      const [dupeId] = await pool.query(
        'SELECT id FROM users WHERE id_number = ? AND role = ? AND id <> ?',
        [idNumber, 'student', id]
      );
      if (dupeId.length > 0) {
        return res.status(409).json({ error: 'Another account already uses this student number.' });
      }
    }

    const [result] = await pool.query(
      `UPDATE users SET full_name = ?, email = ?, role = ?, id_number = ? WHERE id = ?`,
      [displayName.trim(), email.trim(), roleValue, idNumber, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Account not found.' });

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.json({ message: 'Account updated.', user: shapeUser(rows[0]) });
  } catch (err) {
    console.error(`PUT /api/users/${id} error:`, err);
    res.status(500).json({ error: 'Failed to update account.' });
  }
});

// ------------------------------------------------------------
// PATCH /api/users/:id/suspend  — admin: toggle active/suspended
// ------------------------------------------------------------
router.patch('/:id/suspend', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID.' });

  try {
    const [rows] = await pool.query('SELECT status FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Account not found.' });

    const newStatus = rows[0].status === 'suspended' ? 'active' : 'suspended';
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);

    const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.json({ message: `Account ${newStatus}.`, user: shapeUser(updated[0]) });
  } catch (err) {
    console.error(`PATCH /api/users/${id}/suspend error:`, err);
    res.status(500).json({ error: 'Failed to update account status.' });
  }
});

// ------------------------------------------------------------
// DELETE /api/users/:id  — admin: delete an account
// ------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid account ID.' });

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Account not found.' });
    res.json({ message: 'Account deleted.' });
  } catch (err) {
    console.error(`DELETE /api/users/${id} error:`, err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

module.exports = router;