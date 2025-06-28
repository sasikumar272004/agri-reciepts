import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function authenticateUser(username, plainPassword) {
  const [rows] = await pool.query('SELECT * FROM user_credentials WHERE username = ?', [username]);

  if (rows.length === 0) return null;

  const user = rows[0];
  const isMatch = await bcrypt.compare(plainPassword, user.password_hash);

  if (!isMatch) return null;

  return user;
}

export async function registerUser({ username, fullName, roleId, amcId, plainPassword }) {
  const password_hash = await bcrypt.hash(plainPassword, 10);

  const [result] = await pool.query(
    'INSERT INTO user_credentials (username, full_name, role_id, amc_id, password_hash) VALUES (?, ?, ?, ?, ?)',
    [username, fullName, roleId, amcId, password_hash]
  );

  return result.insertId;
}
