const { generateOTP } = require('../utils/helpers');

// Simulate sending OTP (in production, use SMS gateway like Twilio/BulkSMS)
const sendOTP = async (phone) => {
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // In production: send SMS here
  console.log(`📱 OTP for ${phone}: ${otp} (expires in 5 min)`);

  return { otp, otpExpires };
};

// Verify OTP
const verifyOTP = (storedOtp, storedExpiry, enteredOtp) => {
  if (!storedOtp || !storedExpiry) {
    return { valid: false, message: 'No OTP requested. Please request OTP first.' };
  }

  if (new Date() > new Date(storedExpiry)) {
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (storedOtp !== enteredOtp) {
    return { valid: false, message: 'Invalid OTP.' };
  }

  return { valid: true, message: 'OTP verified successfully.' };
};

module.exports = { sendOTP, verifyOTP };
