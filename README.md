# 🚀 SmartFuel: AI-Powered Fuel & Queue Management System

SmartFuel is a state-of-the-art solution designed to modernize the fuel distribution ecosystem. It eliminates long queues at fuel stations, prevents quota manipulation, and provides real-time insights for both citizens and government bodies through AI-driven analytics.

---

## 🏗️ System Architecture

The project follows a modern **MERN-like** architecture with a focus on real-time responsiveness and security.

- **Frontend**: React 19 (Vite) with Tailwind CSS, Framer Motion for premium UI/UX, and Lucide icons.
- **Backend**: Node.js & Express.js handling RESTful APIs, JWT Authentication, and QR service logic.
- **Database**: MongoDB (Mongoose) for scalable data storage of users, vehicles, transactions, and pumps.
- **Security**: BCrypt for password hashing, Helmet for header security, and Protected Routes for sensitive data.

---

## 🔄 Project Workflows

### 👤 User Flow
1. **Secure Onboarding**: Register via phone/NID with OTP verification for identity proofing.
2. **Digital Garage**: Add vehicles to the system. Each vehicle gets a unique fuel quota based on its type.
3. **Smart Discovery**: Use the real-time map to find nearby fuel pumps, check available fuel types, and view current wait times.
4. **Seamless Refueling**: Show your vehicle's unique QR code to the pump operator.
5. **Insights**: Track monthly expenses and receive AI-generated tips to improve fuel efficiency.

### ⛽ Pump Operator Flow
1. **Verification**: Scan the customer's digital QR code using the built-in scanner.
2. **Quota Validation**: The system instantly checks if the vehicle has enough remaining quota.
3. **Transaction**: Input the fuel amount. The system calculates the price and updates the quota in real-time.
4. **Confirmation**: A digital receipt is generated for both the customer and the station.

---

## 📊 Govt Analytics Dashboard
A centralized control panel designed for regulatory bodies to monitor the national energy landscape:
- **National Consumption**: Real-time heatmaps of fuel usage across different regions.
- **Strategic Reserves**: Predictive alerts when station stocks fall below critical levels.
- **Fraud Detection**: AI algorithms flag suspicious refueling patterns or quota sharing.
- **Dynamic Policy**: Ability to adjust quotas nationally or regionally during energy crises.

---

## 🚀 How to Run the Project

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend/frontend
npm install
npm run dev
```
The app will be running at `http://localhost:5173`.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Leaflet, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB, JWT, Regex-based Security.
- **AI/ML**: Simulated consumption analysis for efficiency recommendations.

---

## 📝 Features at a Glance
- ✅ **QR-Based Transactions**: Secure and contactless.
- ✅ **Real-Time Map**: Integrated station locator.
- ✅ **Quota Management**: Automated weekly/monthly resets.
- ✅ **Digital Payments**: Integrated simulation for fuel purchases.
- ✅ **AI Assistant**: Smart support for user queries.
