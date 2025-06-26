// db/supervisor.js
import { pool } from './pool.js';
import { getMonthBounds } from './receipts.js';

export async function supervisorMonthlySummary(amcId, year, month) {
  const [start, next] = getMonthBounds(year, month);
  const [[row]] = await pool.query(
    `SELECT
       COUNT(*)                    AS total_receipts,
       COUNT(DISTINCT trader_id)   AS active_members,
       COALESCE(SUM(value_inr),0)  AS total_value,
       COALESCE(SUM(fees_paid_inr),0) AS total_fees
     FROM receipts
     WHERE amc_id = ?
       AND receipt_date >= ?
       AND receipt_date < ?`,
    [amcId, start, next]
  );
  return row;
}

export async function topCommodities(amcId, year, month, limit = 5) {
  const [start, next] = getMonthBounds(year, month);
  const [rows] = await pool.query(
    `SELECT c.name AS commodity, SUM(r.quantity) AS total_quantity
     FROM receipts r
     JOIN commodities c ON c.commodity_id = r.commodity_id
     WHERE r.amc_id = ?
       AND r.receipt_date >= ?
       AND r.receipt_date < ?
     GROUP BY c.name
     ORDER BY total_quantity DESC
     LIMIT ?`,
    [amcId, start, next, limit]
  );
  return rows;
}
