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
INSERT INTO items (title, description, item_type, status, date_reported, location, reporter_name, reporter_contact)
VALUES
  ('Green Leather Wallet',
   'Rectangular bifold green leather wallet containing student permit (Dan B.), two debit cards, and a TIN ID. Slight scuff on the corner.',
   'Accessory','lost','2026-05-05','Around Sampaloc Lane','Dan Buenaventura','dan.buenaventura@example.com'),

  ('iPhone 13 (Blue)',
   'Napaka burara. Blue iPhone 13 in a clear silicone case. Lock screen shows an animated girl. Small crack on tempered glass, bottom-right corner.',
   'Electronics','lost','2026-05-07','Sampaloc Lane: In Thrifty Beans stall ','Youone Clamar','0912-345-6789'),

  ('Set of House Keys',
   'Silver keyring with three keys and a teddy bear keychain. No visible labels on keys.',
   'Accessory','lost','2026-05-02','NU Laguna entrance: Guard post','Nicole Anoso','nicole.anoso@example.com'),

  ('NU Hoodie (Medium)',
   'Blue hoodie with NU Bulldogs print, medium size, no zippers.',
   'Clothing','lost','2026-04-30','LRC, circulation center','Paulo Manalo','paulo.manalo@nul.edu'),

  ('Type-C Charger',
   'USB-C charging cable for OPPO. White braided cable, approximately 1 meter long.',
   'Electronics','lost','2026-05-08','Henry Sy Building: Room 204','Sherrie Borbon','sherrie.borbon@example.com'),

  ('Oppo Wrist Band',
   'Found a silver Samsung smartwatch (round face) with a black silicone band. Battery shows 40% when turned on.',
   'Electronics','found','2026-05-09','Gym locker room, Downtown Fitness','Samantha Cole','samantha.finds@example.com'),

  ('Poliflask Tumbler Bottle (500ml)',
   'Baby blue tumbler with poliflask logo printed on the side',
   'Other','found','2026-05-06','ComLab 5','Ate Maintenance Staff','maryjoy101@example.com'),

  ('Glasses inside green case',
   'Circular reading glasses in a thin black frame, case labeled Executive Optical".',
   'Accessory','found','2026-05-03','Faculty Reception','Princess Dimla','princess.dimla@example.com'),

  ('Laptop Bag',
   'Sinong loko nakalimot ng mamahaling bagay na to? Black Laptop Bag with TUF Asus Gaming logo on the strap. Has ASUS Laptop inside.',
   'Electronics','found','2026-05-01','Henry Sy Building: Room 203','Youone Clamar','0912-345-6789'),

  ('Lenovo Bluetooth Earbuds',
   'Black bluetooth earbuds with Lenovo logo. Inside case. Kunin niyo bago ko arborin ''to.',
   'Electronics','found','2026-05-10','AcadArena','Eric Tabing','eric.tabing@example.com'
  );

-- Sample image references
INSERT INTO item_images (item_id, image_key, is_primary)
VALUES
  (1, 'items/1/wallet_front.jpg', 1),
  (2, 'items/2/iphone_blue.jpg', 1),
  (3, 'items/3/keys_teddy.jpg', 1),
  (4, 'items/4/nu_hoodie.jpg', 1),
  (5, 'items/5/typec_charger.jpg', 1),
  (6, 'items/6/oppo_wrist_band.jpg', 1),
  (7, 'items/7/poliflask_blue.jpg', 1),
  (8, 'items/8/glasses_green_case.jpg', 1),
  (9, 'items/9/laptop_bag_asus.jpg', 1),
  (10, 'items/10/lenovo_earbuds.jpg', 1);

-- Helpful indexes
CREATE INDEX idx_items_status ON items (status);
CREATE INDEX idx_items_type ON items (item_type);
CREATE INDEX idx_item_images_item_id ON item_images (item_id);

-- End of file

