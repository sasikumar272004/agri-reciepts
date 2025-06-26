// db/jd.js
import { pool } from './pool.js';
import { getMonthBounds } from './receipts.js';

export async function districtMetrics(district, year, month) {
  const [start, next] = getMonthBounds(year, month);

  // Monthly
  const [[m]] = await pool.query(
    `SELECT
       COUNT(*)                        AS total_receipts_month,
       COUNT(DISTINCT r.trader_id)     AS active_traders_month,
       COALESCE(SUM(value_inr),0)      AS total_value_month,
       COALESCE(SUM(quantity),0)       AS total_quantity_month,
       CASE WHEN COUNT(*)=0 THEN 0
         ELSE ROUND(SUM(value_inr)/COUNT(*),2) 
       END                              AS avg_receipt_value
     FROM receipts r
     JOIN amcs a ON a.amc_id = r.amc_id
     WHERE a.district = ?
       AND r.receipt_date >= ?
       AND r.receipt_date < ?`,
    [district, start, next]
  );

  // Cumulative up to month end (exclusive next)
  const [[c]] = await pool.query(
    `SELECT
       COALESCE(SUM(value_inr),0) AS total_value_cumulative,
       COALESCE(SUM(quantity),0)  AS quantity_cumulative
     FROM receipts r
     JOIN amcs a ON a.amc_id = r.amc_id
     WHERE a.district = ?
       AND r.receipt_date < ?`,
    [district, next]
  );

  return { ...m, ...c };
}
