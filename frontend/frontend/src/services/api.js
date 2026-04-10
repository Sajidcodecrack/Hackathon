import axios from 'axios';

// Create base Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Point to our backend
});

// Add a request interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export grouped endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verifyOTP: (data) => API.post('/auth/verify-otp', data),
};

export const vehicleAPI = {
  add: (data) => API.post('/vehicle/add', data),
  getMyVehicles: () => API.get('/vehicle/my-vehicles'),
  update: (id, data) => API.patch(`/vehicle/update/${id}`, data),
};

export const pumpAPI = {
  getNearby: (params) => API.get('/pump/nearby', { params }), // { lat, lng, fuelType, radius }
  getById: (id) => API.get(`/pump/${id}`),
};

export const bookingAPI = {
  create: (data) => API.post('/booking/create', data),
  getHistory: () => API.get('/booking/history'),
  checkIn: (id) => API.patch(`/booking/checkin/${id}`),
};

export const aiAPI = {
  recommend: (data) => API.post('/ai/recommend', data),
  estimateWait: (data) => API.post('/ai/estimate-wait', data),
};

export const transactionAPI = {
  getHistory: () => API.get('/transaction/history'),
  save: (data) => API.post('/transaction/save', data),
};

export const qrAPI = {
  validate: (data) => API.post('/qr/validate', data),
};

export default API;
