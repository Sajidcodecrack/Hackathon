const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
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
    slotTime: {
      type: Date,
      required: [true, 'Slot time is required'],
    },
    qrCode: {
      type: String,
      default: null,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    estimatedWait: {
      type: Number, // in minutes
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
