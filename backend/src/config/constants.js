// Fuel Quota Limits (litres per month)
const FUEL_QUOTAS = {
  motorcycle: 25,
  car: 80,
  suv: 100,
  truck: 200,
  bus: 300,
  cng: 50,
};

// Vehicle fuel type mapping
const FUEL_TYPES = ['petrol', 'diesel', 'octane', 'cng'];

// Booking status
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Average service time per vehicle (in minutes)
const AVG_SERVICE_TIME = 5;

module.exports = {
  FUEL_QUOTAS,
  FUEL_TYPES,
  BOOKING_STATUS,
  AVG_SERVICE_TIME,
};
