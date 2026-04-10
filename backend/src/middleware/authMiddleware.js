const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.unauthorized(res, 'Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Not authorized, token invalid');
  }
};

module.exports = { protect };
