import express from 'express';
import {
  createReceipt,
  totalReceiptsThisMonth,
  activeMembersThisMonth,
  totalValueThisMonth,
  totalFeesThisMonth
} from '../db/receipts.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes with authentication middleware
router.use(authenticateToken);

// Create a new receipt
router.post('/', async (req, res) => {
  try {
    const receiptData = req.body;
    const newReceipt = await createReceipt(receiptData);
    res.status(201).json(newReceipt);
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get monthly stats for an AMC
router.get('/stats/:year/:month/:amcId', async (req, res) => {
  try {
    const { year, month, amcId } = req.params;
    const totalReceipts = await totalReceiptsThisMonth(amcId, parseInt(year), parseInt(month));
    const activeMembers = await activeMembersThisMonth(amcId, parseInt(year), parseInt(month));
    const totalValue = await totalValueThisMonth(amcId, parseInt(year), parseInt(month));
    const totalFees = await totalFeesThisMonth(amcId, parseInt(year), parseInt(month));

    res.json({
      totalReceipts,
      activeMembers,
      totalValue,
      totalFees
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
