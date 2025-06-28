import express from 'express';
import {
  totalReceiptsThisMonth,
  activeMembersThisMonth,
  totalValueThisMonth,
  totalFeesThisMonth
} from '../../db/receipts.js';

const router = express.Router();

// Helper to get current year and month or from query params
function getYearMonth(query) {
  const year = query.year ? parseInt(query.year, 10) : new Date().getFullYear();
  const month = query.month ? parseInt(query.month, 10) : new Date().getMonth() + 1;
  return { year, month };
}

// Endpoint to get total receipts this month for an AMC
router.get('/totalReceipts', async (req, res) => {
  try {
    const { amcId } = req.query;
    if (!amcId) return res.status(400).json({ error: 'amcId is required' });
    const { year, month } = getYearMonth(req.query);
    const count = await totalReceiptsThisMonth(amcId, year, month);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get active members this month for an AMC
router.get('/activeMembers', async (req, res) => {
  try {
    const { amcId } = req.query;
    if (!amcId) return res.status(400).json({ error: 'amcId is required' });
    const { year, month } = getYearMonth(req.query);
    const count = await activeMembersThisMonth(amcId, year, month);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get total value this month for an AMC
router.get('/totalValue', async (req, res) => {
  try {
    const { amcId } = req.query;
    if (!amcId) return res.status(400).json({ error: 'amcId is required' });
    const { year, month } = getYearMonth(req.query);
    const sum = await totalValueThisMonth(amcId, year, month);
    res.json({ sum });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get total fees this month for an AMC
router.get('/totalFees', async (req, res) => {
  try {
    const { amcId } = req.query;
    if (!amcId) return res.status(400).json({ error: 'amcId is required' });
    const { year, month } = getYearMonth(req.query);
    const sum = await totalFeesThisMonth(amcId, year, month);
    res.json({ sum });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
