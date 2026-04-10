const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { sendOTP, verifyOTP } = require('../services/otpService');
const { verifyLicense } = require('../services/brtaService');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, phone, password, licenseNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return ApiResponse.badRequest(res, 'User with this phone already exists');
    }

    // Verify license with BRTA (if provided)
    let isVerified = false;
    if (licenseNumber) {
      const brtaResult = await verifyLicense(licenseNumber);
      if (!brtaResult.verified) {
        return ApiResponse.badRequest(res, brtaResult.message);
      }
      isVerified = true;
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      password,
      licenseNumber: licenseNumber || null,
      isVerified,
    });

    // Send OTP for phone verification
    const { otp, otpExpires } = await sendOTP(phone);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return ApiResponse.created(res, {
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
        otpVerified: user.otpVerified,
      },
      token,
      otpMessage: 'OTP sent to your phone. Check server console for OTP.',
    }, 'Registration successful. Please verify OTP.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ phone });
    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid phone or password');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return ApiResponse.unauthorized(res, 'Invalid phone or password');
    }

    // Generate token
    const token = generateToken(user._id);

    return ApiResponse.success(res, {
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
        otpVerified: user.otpVerified,
        role: user.role,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyUserOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Verify OTP
    const result = verifyOTP(user.otp, user.otpExpires, otp);
    if (!result.valid) {
      return ApiResponse.badRequest(res, result.message);
    }

    // Mark as OTP verified
    user.otpVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);

    return ApiResponse.success(res, {
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
        otpVerified: user.otpVerified,
      },
      token,
    }, 'OTP verified successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, verifyUserOTP };
