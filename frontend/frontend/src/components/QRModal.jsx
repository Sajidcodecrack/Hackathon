import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Clock, Car, MapPin } from 'lucide-react';

const QRModal = ({ isOpen, onClose, qrCodeUrl, bookingId, pumpName, vehicleReg, slotTime }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm relative"
        >
          {/* Apple Wallet Style Pass Design */}
          <div className="bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden text-white relative border border-slate-700">
            
            {/* Animated Glow Behind */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/40 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/40 rounded-full blur-[80px]" />

            {/* Header Content */}
            <div className="p-6 pb-8 relative border-b border-dashed border-slate-700">
               <button 
                 onClick={onClose}
                 className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-1.5 transition-colors"
               >
                 <X size={18} />
               </button>

               <div className="flex items-center gap-3 mb-6">
                 <div className="bg-gradient-to-tr from-primary-500 to-indigo-500 p-2.5 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                   <Shield size={20} className="text-white" />
                 </div>
                 <div>
                   <h2 className="text-lg font-bold tracking-wide uppercase text-slate-100">SmartFuel Pass</h2>
                   <p className="text-primary-400 text-xs font-semibold tracking-widest">VERIFIED ACCESS</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin size={12}/> Station</p>
                   <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{pumpName || 'Smart Fuel Station'}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-2">
                   <div>
                     <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5"><Car size={12}/> Vehicle</p>
                     <p className="font-semibold text-slate-200">{vehicleReg || 'N/A'}</p>
                   </div>
                   <div>
                     <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock size={12}/> Slot</p>
                     <p className="font-semibold text-slate-200">{slotTime ? new Date(slotTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Anytime'}</p>
                   </div>
                 </div>
               </div>

               {/* Cutout circles for wallet look */}
               <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-slate-900 rounded-full border-t border-r border-slate-700/0 hidden sm:block" style={{boxShadow: 'inset -1px 1px 0 rgba(51, 65, 85, 0.5)'}} />
               <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-900 rounded-full border-t border-l border-slate-700/0 hidden sm:block" style={{boxShadow: 'inset 1px 1px 0 rgba(51, 65, 85, 0.5)'}} />
            </div>

            {/* QR Code Section */}
            <div className="p-8 flex flex-col items-center justify-center relative bg-white">
              {/* Outer decorative scanning frame */}
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 border-2 border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group">
                {/* QR Image */}
                <div className="bg-white p-2 rounded-xl relative">
                  <img src={qrCodeUrl} alt="Secure Booking QR Code" className="w-[200px] h-[200px] object-contain relative z-10 mix-blend-multiply filter contrast-125" />
                  
                  {/* Laser scan animation overlay */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-primary-500 z-20 shadow-[0_0_8px_rgba(20,184,166,0.8)]"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Pass ID</p>
                 <p className="text-tracking-widest font-mono text-slate-800 font-bold bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200">
                   {bookingId?.slice(-8).toUpperCase() || 'XXXXXXXX'}
                 </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QRModal;
