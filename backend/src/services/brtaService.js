// Simulated BRTA (Bangladesh Road Transport Authority) License Verification
// In production, this would call the real BRTA API

const verifyLicense = async (licenseNumber) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulated validation: license must be like "DH-1234567890"
  const licenseRegex = /^[A-Z]{2}-\d{10}$/;

  if (!licenseRegex.test(licenseNumber)) {
    return {
      verified: false,
      message: 'Invalid license format. Expected: XX-1234567890',
    };
  }

  // Simulate: licenses starting with "XX" are invalid (for testing)
  if (licenseNumber.startsWith('XX')) {
    return {
      verified: false,
      message: 'License not found in BRTA database.',
    };
  }

  return {
    verified: true,
    message: 'License verified successfully by BRTA.',
    data: {
      licenseNumber,
      holderName: 'Verified User',
      status: 'active',
      expiryDate: '2028-12-31',
    },
  };
};

module.exports = { verifyLicense };
