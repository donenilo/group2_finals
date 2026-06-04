const mysql = require('mysql2/promise');

const parseDatabaseUrl = (databaseUrl) => {
  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: decodeURIComponent(url.pathname.replace(/^\//, '')),
    };
  } catch (error) {
    console.error('Invalid DATABASE_URL format:', error.message);
    return null;
  }
};

const fromUrl = process.env.DATABASE_URL ? parseDatabaseUrl(process.env.DATABASE_URL) : null;
const useSsl = (process.env.DB_SSL || '').trim().toLowerCase() === 'true';

const pool = mysql.createPool({
  host: fromUrl?.host || process.env.DB_HOST || 'localhost',
  port: fromUrl?.port || Number(process.env.DB_PORT || 3306),
  user: fromUrl?.user || process.env.DB_USER || 'root',
  password: fromUrl?.password || process.env.DB_PASSWORD || '',
  database: fromUrl?.database || process.env.DB_NAME || 'items_db',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

module.exports = pool;
