-- Create schema (database) and switch to it
CREATE DATABASE IF NOT EXISTS `items_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `items_db`;

-- Cleanup if re-running this script
DROP TABLE IF EXISTS item_images;
DROP TABLE IF EXISTS items;

-- Main table
CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  item_type ENUM('Electronics','Clothing','Accessory','Document','Other') NOT NULL,
  status ENUM('lost','found','claimed') NOT NULL,
  date_reported DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  reporter_name VARCHAR(100),
  reporter_contact VARCHAR(150),
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Item images table (supports multiple pictures per item)
CREATE TABLE item_images (
  image_id INT NOT NULL AUTO_INCREMENT,
  item_id INT NOT NULL,
  image_key VARCHAR(255) NOT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (image_id),
  CONSTRAINT fk_item_images_item
    FOREIGN KEY (item_id) REFERENCES items(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data: 5 lost, 5 found
-- (No seed data included; keep schema only.)

-- Helpful indexes
CREATE INDEX idx_items_status ON items (status);
CREATE INDEX idx_items_type ON items (item_type);
CREATE INDEX idx_item_images_item_id ON item_images (item_id);

-- USERS / ACCOUNTS TABLE
-- All seed accounts below have the password: Password123
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
