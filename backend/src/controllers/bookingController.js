const Booking = require('../models/Booking');
const Pump = require('../models/Pump');
const Vehicle = require('../models/Vehicle');
const ApiResponse = require('../utils/apiResponse');
const { generateQR } = require('../services/qrService');

// @desc    Create a booking (time slot)
// @route   POST /api/booking/create
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { pumpId, vehicleId, slotTime } = req.body;

    // Validate pump exists
    const pump = await Pump.findById(pumpId);
    if (!pump) {
      return ApiResponse.notFound(res, 'Pump not found');
    }

    // Validate vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
    if (!vehicle) {
      return ApiResponse.notFound(res, 'Vehicle not found or does not belong to you');
    }

    // Check pump has the fuel type
    if (!pump.fuelTypes.includes(vehicle.fuelType)) {
      return ApiResponse.badRequest(
        res,
        `This pump does not have ${vehicle.fuelType}`
      );
    }

    // Check quota
    if (vehicle.quotaRemaining <= 0) {
      return ApiResponse.badRequest(res, 'No fuel quota remaining for this vehicle');
    }

    // Check for existing active booking at same pump/slot
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      pumpId,
      bookingStatus: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      return ApiResponse.badRequest(res, 'You already have an active booking at this pump');
    }

    // Calculate estimated wait
    const estimatedWait = pump.currentQueue * pump.avgServiceTime;

    // Generate QR code
    const qrPayload = {
      bookingId: null, // will update after creation
      userId: req.user._id.toString(),
      pumpId: pumpId,
      vehicleId: vehicleId,
      vehicleReg: vehicle.registrationNo,
      fuelType: vehicle.fuelType,
      slotTime: slotTime,
    };

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      pumpId,
      vehicleId,
      slotTime: new Date(slotTime),
      bookingStatus: 'confirmed',
      estimatedWait,
    });

    // Generate QR with booking ID
    qrPayload.bookingId = booking._id.toString();
    const { qrImage } = await generateQR(qrPayload);

    // Save QR to booking
    booking.qrCode = qrImage;
    await booking.save();

    // Increment pump queue
    pump.currentQueue += 1;
    await pump.save();

    return ApiResponse.created(
      res,
      {
        booking,
        qrCode: qrImage,
        estimatedWait: `${estimatedWait} min`,
        reminder: `Your slot is at ${new Date(slotTime).toLocaleString()}`,
      },
      'Booking confirmed! QR code generated.'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking history
// @route   GET /api/booking/history
// @access  Private
const getBookingHistory = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('pumpId', 'name address')
      .populate('vehicleId', 'registrationNo vehicleType fuelType')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, bookings, `Found ${bookings.length} booking(s)`);
  } catch (error) {
    next(error);
  }
};

// @desc    Check-in at pump (change status)
// @route   PATCH /api/booking/checkin/:id
// @access  Private
const checkinBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return ApiResponse.notFound(res, 'Booking not found');
    }

    if (booking.bookingStatus !== 'confirmed') {
      return ApiResponse.badRequest(res, `Cannot check-in. Current status: ${booking.bookingStatus}`);
    }

    booking.bookingStatus = 'checked_in';
    await booking.save();

    return ApiResponse.success(res, booking, 'Checked in successfully! Show QR to pump operator.');
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookingHistory, checkinBooking };
