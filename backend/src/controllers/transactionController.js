const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Pump = require('../models/Pump');
const ApiResponse = require('../utils/apiResponse');
const { deductQuota } = require('../services/quotaService');

// @desc    Save a fuel transaction (after QR scan + fueling)
// @route   POST /api/transaction/save
// @access  Private
const saveTransaction = async (req, res, next) => {
  try {
    const { bookingId, vehicleId, pumpId, litres, amount, fuelType } = req.body;

    // Validate vehicle belongs to user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
    if (!vehicle) {
      return ApiResponse.notFound(res, 'Vehicle not found');
    }

    // Deduct quota
    const quotaResult = deductQuota(vehicle.quotaRemaining, litres);
    if (!quotaResult.success) {
      return ApiResponse.badRequest(res, quotaResult.message);
    }

    // Update vehicle quota
    vehicle.quotaRemaining = quotaResult.newRemaining;
    await vehicle.save();

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.user._id,
      pumpId,
      vehicleId,
      bookingId: bookingId || null,
      litres,
      amount,
      fuelType: fuelType || vehicle.fuelType,
    });

    // Mark booking as completed if linked
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.bookingStatus = 'completed';
        await booking.save();
      }

      // Decrement pump queue
      const pump = await Pump.findById(pumpId);
      if (pump && pump.currentQueue > 0) {
        pump.currentQueue -= 1;
        await pump.save();
      }
    }

    return ApiResponse.created(
      res,
      {
        transaction,
        quotaRemaining: `${quotaResult.newRemaining}L`,
        message: quotaResult.message,
      },
      'Transaction saved! Quota updated.'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction history + expense summary
// @route   GET /api/transaction/history
// @access  Private
const getTransactionHistory = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('pumpId', 'name address')
      .populate('vehicleId', 'registrationNo vehicleType')
      .sort({ createdAt: -1 });

    // Calculate expense summary
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthTx = transactions.filter(
      (t) => new Date(t.createdAt) >= startOfMonth
    );

    const lastMonthTx = transactions.filter(
      (t) => new Date(t.createdAt) >= startOfLastMonth && new Date(t.createdAt) <= endOfLastMonth
    );

    const thisMonthTotal = thisMonthTx.reduce((sum, t) => sum + t.amount, 0);
    const thisMonthLitres = thisMonthTx.reduce((sum, t) => sum + t.litres, 0);
    const lastMonthTotal = lastMonthTx.reduce((sum, t) => sum + t.amount, 0);

    // Pump wise breakdown
    const pumpBreakdown = {};
    transactions.forEach((t) => {
      const pumpName = t.pumpId ? t.pumpId.name : 'Unknown';
      if (!pumpBreakdown[pumpName]) {
        pumpBreakdown[pumpName] = { visits: 0, totalSpent: 0, totalLitres: 0 };
      }
      pumpBreakdown[pumpName].visits += 1;
      pumpBreakdown[pumpName].totalSpent += t.amount;
      pumpBreakdown[pumpName].totalLitres += t.litres;
    });

    // Weekly breakdown (last 4 weeks)
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);

      const weekTx = transactions.filter(
        (t) => new Date(t.createdAt) >= weekStart && new Date(t.createdAt) < weekEnd
      );

      weeklyData.unshift({
        week: `Week ${4 - i}`,
        spent: weekTx.reduce((sum, t) => sum + t.amount, 0),
        litres: weekTx.reduce((sum, t) => sum + t.litres, 0),
      });
    }

    return ApiResponse.success(res, {
      transactions,
      summary: {
        thisMonth: {
          totalSpent: `৳${thisMonthTotal}`,
          totalLitres: `${thisMonthLitres}L`,
          transactionCount: thisMonthTx.length,
        },
        lastMonth: {
          totalSpent: `৳${lastMonthTotal}`,
        },
        comparison: lastMonthTotal > 0
          ? `${((thisMonthTotal / lastMonthTotal) * 100 - 100).toFixed(1)}% vs last month`
          : 'No last month data',
        weeklyTrend: weeklyData,
        pumpBreakdown,
      },
    }, 'Transaction history loaded');
  } catch (error) {
    next(error);
  }
};

module.exports = { saveTransaction, getTransactionHistory };
