-- Sample user credentials for testing login and registration

-- Delete existing test users if any
DELETE FROM user_credentials WHERE user_id IN (SELECT user_id FROM users WHERE username IN ('test_deo', 'test_supervisor', 'test_jd'));
DELETE FROM users WHERE username IN ('test_deo', 'test_supervisor', 'test_jd');

-- Insert test users
INSERT INTO users (username, full_name, role_id, amc_id, created_at) VALUES
('test_deo', 'Test DEO User', 3, 2, NOW()),
('test_supervisor', 'Test Supervisor User', 2, 1, NOW()),
('test_jd', 'Test Joint Director', 1, NULL, NOW());

-- Insert password hashes for test users (password: 'password123')
INSERT INTO user_credentials (user_id, password_hash)
SELECT user_id, 
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8v1b6Z9q6b6Z9q6b6Z9q6b6Z9q6b6' -- bcrypt hash for 'password123'
FROM users WHERE username IN ('test_deo', 'test_supervisor', 'test_jd');
