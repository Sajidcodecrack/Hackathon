import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  
  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      toast.error('Please login or register first');
      navigate('/login');
    }
  }, [phone, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      return toast.error('Enter valid 6-digit OTP');
    }

    setIsLoading(true);
    try {
      const res = await authAPI.verifyOTP({ phone, otp });
      const { user: userData, token } = res.data.data;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      toast.success('Phone verified successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center -mt-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 relative overflow-hidden text-center"
      >
        <motion.div 
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShieldCheck size={40} />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Verify Phone</h1>
        <p className="text-slate-500 mt-2 font-medium">
          We've sent a 6-digit OTP to <br/><span className="text-slate-800 font-bold">{phone}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input 
            type="text"
            maxLength={6}
            required
            className="w-full tracking-[1em] text-center text-2xl font-bold px-4 py-4 bg-slate-50/80 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all"
            placeholder="......"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          />

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-70"
          >
            <span className="text-lg">{isLoading ? 'Verifying...' : 'Verify Now'}</span>
            {!isLoading && <ArrowRight size={20} />}
          </motion.button>
        </form>
        
        <p className="text-sm text-slate-400 mt-6 mt-4">
          Check your backend console for the OTP code!
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
