const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { createBooking, getBookingHistory, checkinBooking } = require('../controllers/bookingController');

// POST /api/booking/create
router.post(
  '/create',
  protect,
  [
    body('pumpId').notEmpty().withMessage('Pump ID is required'),
    body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
    body('slotTime').notEmpty().withMessage('Slot time is required'),
  ],
  validate,
  createBooking
);

// GET /api/booking/history
router.get('/history', protect, getBookingHistory);

// PATCH /api/booking/checkin/:id
router.patch('/checkin/:id', protect, checkinBooking);

module.exports = router;
