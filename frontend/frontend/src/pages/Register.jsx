import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Lock, Hash, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    password: '',
    licenseNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authAPI.register(formData);
      toast.success(res.data.message);
      // Navigate to verify OTP with phone number
      navigate('/verify-otp', { state: { phone: formData.phone } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center my-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card p-8 relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2 font-medium text-center">Join SmartFuel to manage quotas easily.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input 
                type="text"
                required
                className="input-field pl-11"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Phone size={18} />
              </div>
              <input 
                type="tel"
                required
                className="input-field pl-11"
                placeholder="017xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password"
                required
                minLength={6}
                className="input-field pl-11"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex justify-between">
              BRTA License No.
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Optional</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Hash size={18} />
              </div>
              <input 
                type="text"
                className="input-field pl-11"
                placeholder="XX-1234567890"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              />
            </div>
            <p className="text-xs text-slate-400 ml-1 mt-1">If provided, auto-verifies your profile instantly.</p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full mt-6 flex justify-between items-center group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="text-lg">{isLoading ? 'Creating Account...' : 'Continue'}</span>
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:translate-x-1 transition-transform">
               <ArrowRight size={20} />
            </div>
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold hover:underline underline-offset-4 decoration-2">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
