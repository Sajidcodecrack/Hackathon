const Pump = require('../models/Pump');
const ApiResponse = require('../utils/apiResponse');
const { calculateDistance } = require('../utils/helpers');
const { getAIRecommendation, estimateWaitTime } = require('../services/aiService');

// @desc    AI-powered pump recommendation
// @route   POST /api/ai/recommend
// @access  Private
const recommendPump = async (req, res, next) => {
  try {
    const { lat, lng, fuelType, radius = 10 } = req.body;

    if (!lat || !lng || !fuelType) {
      return ApiResponse.badRequest(res, 'lat, lng, and fuelType are required');
    }

    // Find nearby active pumps
    const pumps = await Pump.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000,
        },
      },
    });

    if (pumps.length === 0) {
      return ApiResponse.notFound(res, 'No pumps found nearby');
    }

    // Enrich pump data with distance + wait
    const enrichedPumps = pumps.map((pump) => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        pump.location.coordinates[1],
        pump.location.coordinates[0]
      );

      return {
        _id: pump._id,
        name: pump.name,
        address: pump.address,
        fuelTypes: pump.fuelTypes,
        currentQueue: pump.currentQueue,
        avgServiceTime: pump.avgServiceTime,
        distance: `${distance} km`,
        distanceValue: distance,
        estimatedWait: `${pump.currentQueue * pump.avgServiceTime} min`,
      };
    });

    // Get AI recommendation
    const recommendation = await getAIRecommendation(
      enrichedPumps,
      { lat, lng },
      fuelType
    );

    return ApiResponse.success(res, {
      recommendation,
      allPumps: enrichedPumps,
      totalPumpsFound: enrichedPumps.length,
    }, 'AI recommendation ready ✨');
  } catch (error) {
    next(error);
  }
};

// @desc    Estimate wait time for a specific pump
// @route   POST /api/ai/estimate-wait
// @access  Private
const estimateWait = async (req, res, next) => {
  try {
    const { pumpId } = req.body;

    if (!pumpId) {
      return ApiResponse.badRequest(res, 'pumpId is required');
    }

    const pump = await Pump.findById(pumpId);
    if (!pump) {
      return ApiResponse.notFound(res, 'Pump not found');
    }

    const waitEstimate = estimateWaitTime(pump.currentQueue, pump.avgServiceTime);

    return ApiResponse.success(res, {
      pump: {
        name: pump.name,
        address: pump.address,
        currentQueue: pump.currentQueue,
      },
      ...waitEstimate,
    }, 'Wait time estimated');
  } catch (error) {
    next(error);
  }
};

module.exports = { recommendPump, estimateWait };
