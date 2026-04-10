const Pump = require('../models/Pump');
const ApiResponse = require('../utils/apiResponse');
const { calculateDistance } = require('../utils/helpers');

// @desc    Get nearby pumps based on user location
// @route   GET /api/pump/nearby?lat=XX&lng=XX&fuelType=octane&radius=10
// @access  Private
const getNearbyPumps = async (req, res, next) => {
  try {
    const { lat, lng, fuelType, radius = 10 } = req.query;

    if (!lat || !lng) {
      return ApiResponse.badRequest(res, 'Latitude and longitude are required');
    }

    // Find pumps within radius using MongoDB geospatial query
    const pumps = await Pump.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000, // km to meters
        },
      },
      ...(fuelType && { fuelTypes: fuelType }),
    });

    // Add distance and estimated wait to each pump
    const pumpsWithDetails = pumps.map((pump) => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        pump.location.coordinates[1],
        pump.location.coordinates[0]
      );

      const estimatedWait = pump.currentQueue * pump.avgServiceTime;

      return {
        ...pump.toObject(),
        distance: `${distance} km`,
        distanceValue: distance,
        estimatedWait: `${estimatedWait} min`,
        estimatedWaitValue: estimatedWait,
      };
    });

    return ApiResponse.success(
      res,
      pumpsWithDetails,
      `Found ${pumpsWithDetails.length} nearby pump(s)`
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pump details
// @route   GET /api/pump/:id
// @access  Private
const getPumpById = async (req, res, next) => {
  try {
    const pump = await Pump.findById(req.params.id);

    if (!pump) {
      return ApiResponse.notFound(res, 'Pump not found');
    }

    const estimatedWait = pump.currentQueue * pump.avgServiceTime;

    return ApiResponse.success(res, {
      ...pump.toObject(),
      estimatedWait: `${estimatedWait} min`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pump queue (pump operator use)
// @route   PATCH /api/pump/update-queue/:id
// @access  Private
const updateQueue = async (req, res, next) => {
  try {
    const { currentQueue, avgServiceTime } = req.body;

    const pump = await Pump.findById(req.params.id);
    if (!pump) {
      return ApiResponse.notFound(res, 'Pump not found');
    }

    if (currentQueue !== undefined) pump.currentQueue = currentQueue;
    if (avgServiceTime !== undefined) pump.avgServiceTime = avgServiceTime;

    await pump.save();

    return ApiResponse.success(res, pump, 'Queue updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Seed demo pumps (for testing)
// @route   POST /api/pump/seed
// @access  Public (remove in production)
const seedPumps = async (req, res, next) => {
  try {
    const count = await Pump.countDocuments();
    if (count > 0) {
      return ApiResponse.badRequest(res, 'Pumps already seeded');
    }

    const demoPumps = [
      {
        name: 'Padma Fuel Station',
        location: { type: 'Point', coordinates: [90.4125, 23.8103] },
        address: 'Gulshan-1, Dhaka',
        fuelTypes: ['petrol', 'octane', 'diesel'],
        currentQueue: 5,
        avgServiceTime: 5,
      },
      {
        name: 'Meghna Petroleum',
        location: { type: 'Point', coordinates: [90.4070, 23.8050] },
        address: 'Banani, Dhaka',
        fuelTypes: ['petrol', 'octane', 'cng'],
        currentQueue: 3,
        avgServiceTime: 4,
      },
      {
        name: 'Jamuna Oil Depot',
        location: { type: 'Point', coordinates: [90.3935, 23.7945] },
        address: 'Mohakhali, Dhaka',
        fuelTypes: ['petrol', 'diesel', 'octane', 'cng'],
        currentQueue: 8,
        avgServiceTime: 6,
      },
      {
        name: 'Bangla Fuel Hub',
        location: { type: 'Point', coordinates: [90.4250, 23.7808] },
        address: 'Rampura, Dhaka',
        fuelTypes: ['petrol', 'octane'],
        currentQueue: 2,
        avgServiceTime: 4,
      },
      {
        name: 'Sundarban CNG Station',
        location: { type: 'Point', coordinates: [90.3690, 23.7560] },
        address: 'Dhanmondi, Dhaka',
        fuelTypes: ['cng', 'petrol'],
        currentQueue: 10,
        avgServiceTime: 3,
      },
    ];

    await Pump.insertMany(demoPumps);

    return ApiResponse.created(res, null, `${demoPumps.length} demo pumps seeded successfully`);
  } catch (error) {
    next(error);
  }
};

module.exports = { getNearbyPumps, getPumpById, updateQueue, seedPumps };
