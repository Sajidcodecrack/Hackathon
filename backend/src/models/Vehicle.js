const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registrationNo: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['motorcycle', 'car', 'suv', 'truck', 'bus', 'cng'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['petrol', 'diesel', 'octane', 'cng'],
    },
    quotaRemaining: {
      type: Number,
      default: 0,
    },
    quotaLimit: {
      type: Number,
      default: 0,
    },
    lastQuotaReset: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
