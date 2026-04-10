const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { addVehicle, getMyVehicles, updateVehicle } = require('../controllers/vehicleController');

// POST /api/vehicle/add
router.post(
  '/add',
  protect,
  [
    body('registrationNo').notEmpty().withMessage('Registration number is required'),
    body('vehicleType')
      .notEmpty()
      .isIn(['motorcycle', 'car', 'suv', 'truck', 'bus', 'cng'])
      .withMessage('Valid vehicle type is required'),
    body('fuelType')
      .notEmpty()
      .isIn(['petrol', 'diesel', 'octane', 'cng'])
      .withMessage('Valid fuel type is required'),
  ],
  validate,
  addVehicle
);

// GET /api/vehicle/my-vehicles
router.get('/my-vehicles', protect, getMyVehicles);

// PATCH /api/vehicle/update/:id
router.patch('/update/:id', protect, updateVehicle);

module.exports = router;
