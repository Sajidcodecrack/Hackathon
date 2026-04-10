const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pumpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pump',
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    litres: {
      type: Number,
      required: [true, 'Litres is required'],
      min: 0,
    },
    amount: {
      type: Number,
      required: [true, 'Amount (BDT) is required'],
      min: 0,
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'octane', 'cng'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
