const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { saveTransaction, getTransactionHistory } = require('../controllers/transactionController');

// POST /api/transaction/save
router.post(
  '/save',
  protect,
  [
    body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
    body('pumpId').notEmpty().withMessage('Pump ID is required'),
    body('litres').isNumeric().withMessage('Litres must be a number'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
  ],
  validate,
  saveTransaction
);

// GET /api/transaction/history
router.get('/history', protect, getTransactionHistory);

module.exports = router;
