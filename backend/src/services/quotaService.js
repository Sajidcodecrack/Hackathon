const { FUEL_QUOTAS } = require('../config/constants');

// Auto-assign quota based on vehicle type
const assignQuota = (vehicleType) => {
  const quota = FUEL_QUOTAS[vehicleType];

  if (!quota) {
    return { quotaLimit: 50, quotaRemaining: 50 }; // default fallback
  }

  return { quotaLimit: quota, quotaRemaining: quota };
};

// Deduct fuel from quota
const deductQuota = (currentRemaining, litres) => {
  if (litres > currentRemaining) {
    return { success: false, message: `Insufficient quota. Remaining: ${currentRemaining}L` };
  }

  return {
    success: true,
    newRemaining: currentRemaining - litres,
    message: `${litres}L deducted. Remaining: ${currentRemaining - litres}L`,
  };
};

module.exports = { assignQuota, deductQuota };
