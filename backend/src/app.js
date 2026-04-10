const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const pumpRoutes = require('./routes/pumpRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const qrRoutes = require('./routes/qrRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// --- Middleware ---
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🚀 Smart Fuel API is running!' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/pump', pumpRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/ai', aiRoutes);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// --- Global Error Handler ---
app.use(errorHandler);

module.exports = app;
