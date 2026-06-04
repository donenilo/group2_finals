-- Create the app database if it is missing, then switch to it.
CREATE DATABASE IF NOT EXISTS `items_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `items_db`;

-- Re-runnable: drop only the users table so existing item data stays intact.
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id           INT NOT NULL AUTO_INCREMENT,
  full_name    VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('student','faculty','do','admin') NOT NULL DEFAULT 'student',
  id_number    VARCHAR(50),
  status       ENUM('active','suspended') NOT NULL DEFAULT 'active',
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_id_number (id_number),
  KEY idx_users_role (role),
  KEY idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- All seed accounts below use the password: Password123
-- Some of the names and emails are based on the reporter data already used in items_db.sql.
-- (No seed data included; keep schema only.)
