// db/traders.js
import { pool } from './pool.js';

/** Create a new trader */
export async function createTrader({ name, address }) {
  const [result] = await pool.query(
    `INSERT INTO traders (name, address, joined_date)
     VALUES (?, ?, CURDATE())`,
    [name, address]
  );
  return { trader_id: result.insertId, name, address };
}

/** Fetch all active traders */
export async function getActiveTraders() {
  const [rows] = await pool.query(
    `SELECT trader_id, name, address, joined_date
     FROM traders
     WHERE is_active = 1`
  );
  return rows;
}

/** Deactivate a trader */
export async function deactivateTrader(traderId) {
  await pool.query(
    `UPDATE traders
     SET is_active = 0
     WHERE trader_id = ?`,
    [traderId]
  );
  return true;
}
