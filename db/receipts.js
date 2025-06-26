// db/receipts.js
import { pool } from './pool.js';

/** Helpers to get monthly bounds */
export function getMonthBounds(year, month) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12
    ? `${year + 1}-01-01`
    : `${year}-${String(month + 1).padStart(2, '0')}-01`;
  return [start, nextMonth];
}

/** Insert a new receipt */
export async function createReceipt(data) {
  const {
    receipt_date, book_number, receipt_number, trader_id,
    payee_address, commodity_id, quantity, unit_id,
    nature_of_receipt, value_inr, fees_paid_inr,
    vehicle_number, invoice_number, collection_location,
    generated_by, amc_id
  } = data;

  const [rows] = await pool.query(
    `INSERT INTO receipts
      (receipt_date, book_number, receipt_number, trader_id, payee_address,
       commodity_id, quantity, unit_id, nature_of_receipt,
       value_inr, fees_paid_inr, vehicle_number, invoice_number,
       collection_location, generated_by, amc_id)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [ receipt_date, book_number, receipt_number, trader_id, payee_address,
      commodity_id, quantity, unit_id, nature_of_receipt,
      value_inr, fees_paid_inr, vehicle_number, invoice_number,
      collection_location, generated_by, amc_id ]
  );
  return { receipt_id: rows.insertId, ...data };
}

/** Total receipts this month for an AMC */
export async function totalReceiptsThisMonth(amcId, year, month) {
  const [start, next] = getMonthBounds(year, month);
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM receipts
     WHERE amc_id = ?
       AND receipt_date >= ?
       AND receipt_date < ?`,
    [amcId, start, next]
  );
  return count;
}

/** Active (distinct) members this month in an AMC */
export async function activeMembersThisMonth(amcId, year, month) {
  const [start, next] = getMonthBounds(year, month);
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(DISTINCT trader_id) AS count
     FROM receipts
     WHERE amc_id = ?
       AND receipt_date >= ?
       AND receipt_date < ?`,
    [amcId, start, next]
  );
  return count;
}

/** Total value this month in an AMC */
export async function totalValueThisMonth(amcId, year, month) {
  const [start, next] = getMonthBounds(year, month);
  const [[{ sum }]] = await pool.query(
    `SELECT COALESCE(SUM(value_inr),0) AS sum
     FROM receipts
     WHERE amc_id = ?
       AND receipt_date >= ?
       AND receipt_date < ?`,
    [amcId, start, next]
  );
  return sum;
}

/** Total fees paid this month in an AMC */
export async function totalFeesThisMonth(amcId, year, month) {
  const [start, next] = getMonthBounds(year, month);
  const [[{ sum }]] = await pool.query(
    `SELECT COALESCE(SUM(fees_paid_inr),0) AS sum
     FROM receipts
     WHERE amc_id = ?
       AND receipt_date >= ?
       AND receipt_date < ?`,
    [amcId, start, next]
  );
  return sum;
}
