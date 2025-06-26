// testDb.js
import dotenv from 'dotenv';
dotenv.config();

import { pool } from './db/pool.js';
import { authenticateUser } from './db/auth.js';
import {
  createTrader,
  getActiveTraders,
  deactivateTrader
} from './db/traders.js';
import {
  createReceipt,
  totalReceiptsThisMonth,
  activeMembersThisMonth,
  totalValueThisMonth,
  totalFeesThisMonth
} from './db/receipts.js';
import {
  supervisorMonthlySummary,
  topCommodities
} from './db/supervisor.js';
import { districtMetrics } from './db/jd.js';

async function main() {
  try {
    console.log('--- AUTH TEST ---');
    const user = await authenticateUser('deo_user', 'plain_password_here');
    console.log('authenticateUser:', user);

    console.log('\n--- TRADERS TEST ---');
    const newTrader = await createTrader({ name: 'Test Trader', address: 'XYZ' });
    console.log('createTrader:', newTrader);
    console.log('getActiveTraders:', await getActiveTraders());
    await deactivateTrader(newTrader.trader_id);
    console.log('getActiveTraders after deactivate:', await getActiveTraders());

    console.log('\n--- RECEIPTS TEST ---');
    // adjust payload to match your schema and seeded IDs
    const receipt = await createReceipt({
      receipt_date:      '2025-06-25',
      book_number:       'B99',
      receipt_number:    'R999',
      trader_id:         newTrader.trader_id,
      payee_address:     'Some Addr',
      commodity_id:      1,
      quantity:          123.456,
      unit_id:           1,
      nature_of_receipt: 'Test',
      value_inr:         9999.99,
      fees_paid_inr:     100.00,
      vehicle_number:    'XYZ1234',
      invoice_number:    'INV999',
      collection_location: 'Test Loc',
      generated_by:      user.user_id,
      amc_id:            user.amc_id
    });
    console.log('createReceipt:', receipt);

    console.log('\n-- Monthly Aggregates for AMC', user.amc_id, '--');
    console.log('totalReceiptsThisMonth:', await totalReceiptsThisMonth(user.amc_id, 2025, 6));
    console.log('activeMembersThisMonth:', await activeMembersThisMonth(user.amc_id, 2025, 6));
    console.log('totalValueThisMonth:', await totalValueThisMonth(user.amc_id, 2025, 6));
    console.log('totalFeesThisMonth:', await totalFeesThisMonth(user.amc_id, 2025, 6));

    console.log('\n--- SUPERVISOR TEST ---');
    console.log('supervisorMonthlySummary:', await supervisorMonthlySummary(user.amc_id, 2025, 6));
    console.log('topCommodities:', await topCommodities(user.amc_id, 2025, 6, 3));

    console.log('\n--- JOINT DIRECTOR TEST ---');
    console.log('districtMetrics (East Godavari):', await districtMetrics('East Godavari', 2025, 6));

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    // close all connections
    await pool.end();
  }
}

main();
