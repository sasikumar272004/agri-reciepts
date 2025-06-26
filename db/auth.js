// db/auth.js
import { pool } from './pool.js';
import bcrypt from 'bcrypt';

/**
 * Fetches user + password hash, verifies with bcrypt.
 * Returns user info (without hash) or null.
 */
export async function authenticateUser(username, plainPassword) {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.full_name, u.role_id, u.amc_id, c.password_hash
     FROM users u
     JOIN user_credentials c ON c.user_id = u.user_id
     WHERE u.username = ?`,
    [username]
  );
  if (!rows.length) return null;

  const { password_hash, ...user } = rows[0];
  const match = await bcrypt.compare(plainPassword, password_hash);
  return match ? user : null;
}

/**
 * Registers a new user with hashed password.
 * Returns the new user id.
 */
export async function registerUser({ username, fullName, roleId, amcId, plainPassword }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [userResult] = await conn.query(
      `INSERT INTO users (username, full_name, role_id, amc_id, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [username, fullName, roleId, amcId]
    );

    const userId = userResult.insertId;
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    await conn.query(
      `INSERT INTO user_credentials (user_id, password_hash)
       VALUES (?, ?)`,
      [userId, passwordHash]
    );

    await conn.commit();
    return userId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
