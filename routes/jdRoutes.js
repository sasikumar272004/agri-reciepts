import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Example route for jd
router.get('/', (req, res) => {
  res.json({ message: 'JD route is working' });
});

export default router;
