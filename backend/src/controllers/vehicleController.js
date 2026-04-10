const Vehicle = require('../models/Vehicle');
const ApiResponse = require('../utils/apiResponse');
const { assignQuota } = require('../services/quotaService');

// @desc    Add a vehicle
// @route   POST /api/vehicle/add
// @access  Private
const addVehicle = async (req, res, next) => {
  try {
    const { registrationNo, vehicleType, fuelType } = req.body;

    // Check if vehicle already exists
    const existing = await Vehicle.findOne({ registrationNo: registrationNo.toUpperCase() });
    if (existing) {
      return ApiResponse.badRequest(res, 'Vehicle with this registration already exists');
    }

    // Auto-assign quota based on vehicle type
    const { quotaLimit, quotaRemaining } = assignQuota(vehicleType);

    const vehicle = await Vehicle.create({
      userId: req.user._id,
      registrationNo,
      vehicleType,
      fuelType,
      quotaLimit,
      quotaRemaining,
    });

    return ApiResponse.created(res, vehicle, 'Vehicle added and quota assigned successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's vehicles
// @route   GET /api/vehicle/my-vehicles
// @access  Private
const getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id });

    return ApiResponse.success(res, vehicles, `Found ${vehicles.length} vehicle(s)`);
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PATCH /api/vehicle/update/:id
// @access  Private
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!vehicle) {
      return ApiResponse.notFound(res, 'Vehicle not found');
    }

    // Update allowed fields
    const { vehicleType, fuelType } = req.body;

    if (vehicleType) {
      vehicle.vehicleType = vehicleType;
      // Re-assign quota if vehicle type changes
      const { quotaLimit, quotaRemaining } = assignQuota(vehicleType);
      vehicle.quotaLimit = quotaLimit;
      vehicle.quotaRemaining = quotaRemaining;
    }

    if (fuelType) vehicle.fuelType = fuelType;

    await vehicle.save();

    return ApiResponse.success(res, vehicle, 'Vehicle updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { addVehicle, getMyVehicles, updateVehicle };
