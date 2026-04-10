const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { recommendPump, estimateWait } = require('../controllers/aiController');

// POST /api/ai/recommend
router.post('/recommend', protect, recommendPump);

// POST /api/ai/estimate-wait
router.post('/estimate-wait', protect, estimateWait);

module.exports = router;
