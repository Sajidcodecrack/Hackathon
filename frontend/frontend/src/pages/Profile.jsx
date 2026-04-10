import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Hash, ShieldCheck, Mail, LogOut, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { vehicleAPI, bookingAPI } from '../services/api';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [activeBookings, setActiveBookings] = useState(0);

  useEffect(() => {
    vehicleAPI.getMyVehicles().then(res => setVehicles(res.data.data)).catch(() => {});
    bookingAPI.getHistory().then(res => {
       const activeCount = res.data.data.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'checked_in').length;
       setActiveBookings(activeCount);
    }).catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6 mt-4">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-8 relative overflow-hidden flex flex-col items-center sm:items-start sm:flex-row gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl -z-10" />
        
        <div className="w-24 h-24 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><Phone size={14} className="text-slate-400" /> {user.phone}</span>
            {user.brtaVerified ? (
               <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100"><ShieldCheck size={14} /> BRTA Verified</span>
            ) : (
               <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100">Pending Verification</span>
            )}
          </div>
        </div>
        
        <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary-500 rounded-xl transition-colors border border-slate-100 absolute top-6 right-6">
          <Settings size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Details */}
        <div className="md:col-span-2 glass-panel p-6 space-y-6">
           <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Account Information</h3>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="space-y-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><User size={12}/> Full Name</span>
               <p className="font-semibold text-slate-800">{user.name}</p>
             </div>
             <div className="space-y-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Phone size={12}/> Phone</span>
               <p className="font-semibold text-slate-800">{user.phone}</p>
               {user.otpVerified && <span className="text-xs text-green-500 font-bold">Verified</span>}
             </div>
             <div className="space-y-1 sm:col-span-2">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Hash size={12}/> License Number</span>
               <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-1 flex justify-between items-center">
                 <span className="font-mono font-medium text-slate-700">{user.licenseNumber || 'Not Provided'}</span>
               </div>
             </div>
           </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
             <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Garage Summary</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Total Vehicles</span>
                  <span className="bg-primary-50 text-primary-600 font-bold px-3 py-1 rounded-lg">{vehicles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Active Bookings</span>
                  <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-lg">{activeBookings}</span>
                </div>
             </div>
          </div>

          <button 
            onClick={logout}
            className="w-full glass-card p-4 flex items-center justify-center gap-2 text-red-500 font-semibold hover:bg-red-50 transition-colors border-red-100"
          >
            <LogOut size={18} /> Sign Out securely
          </button>
        </div>
      </div>

    </motion.div>
  );
};

export default Profile;
