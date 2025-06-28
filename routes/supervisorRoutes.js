import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Example route for supervisor
router.get('/', (req, res) => {
  res.json({ message: 'Supervisor route is working' });
});

export default router;
