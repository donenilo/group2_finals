USE `items_db`;

-- Re-runnable: drop only the users table
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id              INT NOT NULL AUTO_INCREMENT,
  full_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL,
  password        VARCHAR(255) NOT NULL,           -- bcrypt hash, never plain text
  role            ENUM('student','faculty','do','admin') NOT NULL DEFAULT 'student',
  id_number       VARCHAR(50),                     -- student number OR faculty number
  status          ENUM('active','suspended') NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (full_name, email, password, role, id_number, status) VALUES
  ('Estudyanteng Brainrot',   'student@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2023-676767', 'active'),
  ('Sir Joey',  'faculty@nu-laguna.edu.ph', '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'faculty', 'FAC-0012',    'active'),
  ('DO Staff',    'do@nu-laguna.edu.ph',      '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'do',      NULL,          'active'),
  ('IT Admin',    'admin@nu-laguna.edu.ph',   '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'admin',   NULL,          'active'),
  ('Carlos Jiro Reano',   'carlos@nu-laguna.edu.ph',   '$2a$10$LDhxs9zenu2.ABOOuU626uMA9zjcoi2abhwNE1tvYstt9YC3YSmbC', 'student', '2022-000088', 'suspended');

CREATE INDEX idx_users_role   ON users (role);
CREATE INDEX idx_users_status ON users (status);
