-- Alter users table to allow 'salt' column to be nullable
ALTER TABLE users MODIFY COLUMN salt VARCHAR(255) NULL;
