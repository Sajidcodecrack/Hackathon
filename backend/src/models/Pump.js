const mongoose = require('mongoose');

const pumpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pump name is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    fuelTypes: {
      type: [String],
      enum: ['petrol', 'diesel', 'octane', 'cng'],
      required: true,
    },
    currentQueue: {
      type: Number,
      default: 0,
      min: 0,
    },
    avgServiceTime: {
      type: Number,
      default: 5, // minutes per vehicle
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    operatingHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' },
    },
  },
  { timestamps: true }
);

// Geo index for nearby pump queries
pumpSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pump', pumpSchema);
