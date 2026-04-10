const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNearbyPumps, getPumpById, updateQueue, seedPumps } = require('../controllers/pumpController');

// POST /api/pump/seed (demo data — remove in production)
router.post('/seed', seedPumps);

// GET /api/pump/nearby?lat=23.8103&lng=90.4125&fuelType=octane&radius=10
router.get('/nearby', protect, getNearbyPumps);

// GET /api/pump/:id
router.get('/:id', protect, getPumpById);

// PATCH /api/pump/update-queue/:id
router.patch('/update-queue/:id', protect, updateQueue);

module.exports = router;
