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
INSERT INTO users (full_name, email, password, role, id_number, status) VALUES
  ('Estudyanteng Brainrot', 'student@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2023-676767', 'active'),
  ('Dan Buenaventura', 'dan.buenaventura@example.com', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2023-676768', 'active'),
  ('Youone Clamar', 'youone.clamar@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2023-676769', 'active'),
  ('Nicole Anoso', 'nicole.anoso@example.com', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2023-676770', 'active'),
  ('Paulo Manalo', 'paulo.manalo@nul.edu', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2023-676771', 'active'),
  ('Sherrie Borbon', 'sherrie.borbon@example.com', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'faculty', 'FAC-0031', 'active'),
  ('Samantha Cole', 'samantha.finds@example.com', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'do', 'DO-0018', 'active'),
  ('Ate Maintenance Staff', 'maryjoy101@example.com', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'do', 'DO-0042', 'active'),
  ('Princess Dimla', 'princess.dimla@example.com', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'faculty', 'FAC-0065', 'active'),
  ('Eric Tabing', 'eric.tabing@example.com', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2023-676772', 'active'),
  ('Sir Joey', 'faculty@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'faculty', 'FAC-0012', 'active'),
  ('DO Staff', 'do@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'do', NULL, 'active'),
  ('IT Admin', 'admin@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'admin', NULL, 'active'),
  ('Carlos Jiro Reano', 'carlos@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2022-000088', 'suspended');
