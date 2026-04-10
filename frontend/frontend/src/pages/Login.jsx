import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Phone, Lock, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(formData.phone, formData.password);
    setIsLoading(false);
    
    if (result.success) {
      if (!result.user.otpVerified) {
        navigate('/verify-otp', { state: { phone: formData.phone } });
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center -mt-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-8 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-primary-400/20 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[150px] h-[150px] bg-blue-400/20 rounded-full blur-[40px] pointer-events-none" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-tr from-primary-500 to-primary-300 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Fuel size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium text-center">Manage your fuel quota & bookings smartly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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
                className="input-field pl-11"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full mt-6 flex justify-between items-center group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="text-lg">{isLoading ? 'Signing in...' : 'Sign In'}</span>
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:translate-x-1 transition-transform">
               <ArrowRight size={20} />
            </div>
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-600 relative z-10">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold hover:underline underline-offset-4 decoration-2">
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
