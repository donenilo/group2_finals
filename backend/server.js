const express = require('express');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve uploaded files from local filesystem only when using local storage.
if ((process.env.STORAGE_PROVIDER || 'local').trim() === 'local') {
  app.use('/uploads', express.static('uploads'));
}

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/users', usersRouter);

// Testing if server is up
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NUHanap API is running.' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Start
app.listen(PORT, () => {
  console.log(`✅ NUHanap API is running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   All items:    http://localhost:${PORT}/api/items`);
  
});