const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateQR } = require('../controllers/qrController');

// POST /api/qr/validate
router.post('/validate', protect, validateQR);

module.exports = router;
