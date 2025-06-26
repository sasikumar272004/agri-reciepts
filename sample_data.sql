-- Sample data for AMC database to test Analytics component and roles

-- Insert sample AMCs
INSERT INTO amcs (amc_key, name, city, district) VALUES
('amc1', 'Kakinada AMC', 'Kakinada', 'East Godavari'),
('amc2', 'Tuni AMC', 'Tuni', 'East Godavari');

-- Insert sample Commodities
INSERT INTO commodities (name) VALUES
('Rice'),
('Wheat'),
('Maize');

-- Insert sample Units
INSERT INTO units (name) VALUES
('Kg'),
('Ton');

-- Insert sample Traders
INSERT INTO traders (name, address, is_active, joined_date) VALUES
('Trader A', 'Address A', 1, NOW()),
('Trader B', 'Address B', 1, NOW());

-- Insert sample Users with roles and AMC associations
INSERT INTO users (username, full_name, role_id, amc_id, created_at) VALUES
('jd_user', 'JD User', 1, NULL, NOW()),
('supervisor_user', 'Supervisor User', 2, 1, NOW()),
('deo_user', 'DEO User', 3, 2, NOW());

-- Insert sample Receipts
INSERT INTO receipts (receipt_date, book_number, receipt_number, trader_id, payee_address, commodity_id, quantity, unit_id, nature_of_receipt, value_inr, fees_paid_inr, vehicle_number, invoice_number, collection_location, generated_by, amc_id, created_at) VALUES
('2024-06-01', 'B001', 'R001', 1, 'Address A', 1, 1000, 2, 'sale', 50000, 500, 'TN01AB1234', 'INV001', 'Office', 1, 1, NOW()),
('2024-06-05', 'B002', 'R002', 2, 'Address B', 2, 500, 1, 'mf', 30000, 300, 'TN02CD5678', 'INV002', 'checkpost', 2, 1, NOW()),
('2024-06-10', 'B003', 'R003', 1, 'Address A', 3, 200, 1, 'sale', 15000, 150, 'TN01AB1234', 'INV003', 'Office', 1, 2, NOW());

-- Insert sample Roles
INSERT INTO roles (role_key, role_name) VALUES
('JD', 'JD'),
('Supervisor', 'Supervisor'),
('DEO', 'DEO');

-- Insert sample Role Permissions (if applicable)
-- Add as needed

-- Insert sample Committees (if applicable)
INSERT INTO committees (id, name) VALUES
(1, 'Kakinada AMC'),
(2, 'Tuni AMC');

-- Insert sample Committee-User mapping (if applicable)
-- Add as needed

-- Insert sample other necessary tables and data as per schema

COMMIT;
