const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const { parseQR } = require('../services/qrService');

// @desc    Validate QR code (pump operator scans)
// @route   POST /api/qr/validate
// @access  Private
const validateQR = async (req, res, next) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return ApiResponse.badRequest(res, 'QR data is required');
    }

    // Parse QR
    const result = parseQR(qrData);
    if (!result.valid) {
      return ApiResponse.badRequest(res, result.message);
    }

    // Find booking
    const booking = await Booking.findById(result.data.bookingId)
      .populate('userId', 'name phone')
      .populate('vehicleId', 'registrationNo vehicleType fuelType quotaRemaining')
      .populate('pumpId', 'name address');

    if (!booking) {
      return ApiResponse.notFound(res, 'Booking not found');
    }

    if (booking.bookingStatus === 'completed') {
      return ApiResponse.badRequest(res, 'This booking has already been completed');
    }

    if (booking.bookingStatus === 'cancelled') {
      return ApiResponse.badRequest(res, 'This booking was cancelled');
    }

    return ApiResponse.success(
      res,
      {
        booking,
        customer: booking.userId,
        vehicle: booking.vehicleId,
        pump: booking.pumpId,
        status: booking.bookingStatus,
        message: 'QR Valid ✅ — Proceed with fueling',
      },
      'QR code validated successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { validateQR };
