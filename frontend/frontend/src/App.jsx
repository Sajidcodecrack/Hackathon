import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages Placeholder (We will build these next)
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import FindPump from './pages/FindPump';
import TransactionHistory from './pages/TransactionHistory';
import BookingHistory from './pages/BookingHistory';
import Vehicles from './pages/Vehicles';
import OperatorScan from './pages/OperatorScan';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen relative flex flex-col pt-20">
          {/* Global Ambient Background Effects */}
          <div className="fixed inset-0 z-[-1] bg-background">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100/50 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[100px]" />
          </div>

          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/find-pump" element={<FindPump />} />
                <Route path="/transactions" element={<TransactionHistory />} />
                <Route path="/bookings" element={<BookingHistory />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/operator" element={<OperatorScan />} />
                <Route path="/profile" element={<Profile />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>

          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'glass-panel text-dark-800 font-medium',
              style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }
            }} 
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
