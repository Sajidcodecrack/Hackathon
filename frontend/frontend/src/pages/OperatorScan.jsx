import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldCheck, Fuel, CheckCircle, Database } from 'lucide-react';
import { qrAPI, transactionAPI, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const OperatorScan = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [session, setSession] = useState(null); // Holds verified booking data
  
  // Transaction Form
  const [txForm, setTxForm] = useState({ litres: '', amount: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Demo active bookings list
  const [activeBookings, setActiveBookings] = useState([]);
  
  // Fetch some active bookings to easily simulate a scan
  useEffect(() => {
    if (!session) {
      bookingAPI.getHistory().then(res => {
         // Filter for ones we can scan
         const scanable = res.data.data.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'checked_in');
         setActiveBookings(scanable);
      }).catch(() => {});
    }
  }, [session]);

  // 1. Operator Validates - Faking a scan by passing the JSON data directly to backend
  const handleSimulateScan = async (booking) => {
    setIsValidating(true);
    try {
      // Reconstruct the exact JSON payload the QR Code would have
      const qrData = JSON.stringify({
        bookingId: booking._id,
        userId: typeof booking.userId === 'object' ? booking.userId._id : booking.userId,
        pumpId: typeof booking.pumpId === 'object' ? booking.pumpId._id : booking.pumpId,
      });

      const res = await qrAPI.validate({ qrData });
      setSession(res.data.data);
      toast.success(res.data.message);
    } catch (error) {
       toast.error(error.response?.data?.message || 'Invalid QR Code Data');
    } finally {
       setIsValidating(false);
    }
  };

  // 2. Operator inputs fuel litres and BDT amount
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        bookingId: session.booking._id,
        vehicleId: session.vehicle._id,
        pumpId: session.pump._id,
        fuelType: session.vehicle.fuelType, // default to vehicle's requested fuel
        litres: parseFloat(txForm.litres),
        amount: parseFloat(txForm.amount)
      };

      const res = await transactionAPI.save(payload);
      toast.success(res.data.message);
      
      // Reset for next scan
      setSession(null);
      setTxForm({ litres: '', amount: '' });
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex justify-center mt-6">
      
      {!session ? (
        <motion.div className="w-full max-w-lg glass-card p-8 text-center relative overflow-hidden flex flex-col items-center">
           <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary-400 to-indigo-500"></div>
           
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border-4 border-white shadow-sm">
             <Scan size={36} />
           </div>
           
           <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Operator Dashboard</h1>
           <p className="text-slate-500 mt-2 font-medium mb-6">Select a customer block below to simulate scanning their QR code.</p>

           {/* Demo list of scans */}
           <div className="w-full space-y-3">
             <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs mb-2 pl-1 border-b border-slate-100 pb-2">
                <Database size={14} /> Active Area Bookings
             </div>
             
             {activeBookings.length === 0 ? (
               <div className="bg-slate-50 p-4 rounded-xl text-slate-400 text-sm font-medium border border-slate-100">
                 No pending customer bookings right now.
               </div>
             ) : (
               activeBookings.map(b => (
                 <div key={b._id} className="bg-white border border-slate-200 hover:border-primary-400 p-4 rounded-xl flex justify-between items-center transition-colors shadow-sm text-left">
                   <div>
                     <p className="font-bold text-slate-800">{b.vehicleId?.registrationNo}</p>
                     <p className="text-xs text-slate-500">Pass ID: {b._id.slice(-8).toUpperCase()}</p>
                   </div>
                   <button 
                     onClick={() => handleSimulateScan(b)}
                     disabled={isValidating}
                     className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-primary-200"
                   >
                     Simulate Scan
                   </button>
                 </div>
               ))
             )}
           </div>

           <div className="mt-8 p-4 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-100 w-full text-left">
             <span className="font-bold text-indigo-800">Hackathon Note:</span> Instead of making you paste JSON or hook up a real camera, this list fetches active bookings and simulates the exact same backend validation flow!
           </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
          className="w-full max-w-lg glass-card p-8 border-l-4 border-l-green-500 relative"
        >
           <button onClick={() => setSession(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-semibold">Cancel</button>
           
           <div className="flex items-center gap-3 mb-6">
             <div className="bg-green-100 text-green-600 p-2 rounded-full">
               <ShieldCheck size={28} />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-slate-800">Pass Validated</h2>
               <p className="text-sm font-medium text-green-600">Access Granted</p>
             </div>
           </div>

           {/* Customer Data */}
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mb-6">
             <div className="flex justify-between">
               <span className="text-slate-500 font-medium text-sm">Customer</span>
               <span className="font-bold text-slate-800">{session.customer.name}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500 font-medium text-sm">Vehicle</span>
               <span className="font-bold text-slate-800">{session.vehicle.registrationNo}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-500 font-medium text-sm">Fuel Requested</span>
               <span className="font-bold text-primary-600 bg-primary-50 px-2 rounded uppercase text-sm">
                 {session.vehicle.fuelType}
               </span>
             </div>
             <div className="flex justify-between font-bold border-t border-slate-200 pt-2 mt-2">
               <span className="text-slate-500 text-sm">Available Quota</span>
               <span className={`${session.vehicle.quotaRemaining < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                 {session.vehicle.quotaRemaining}L
               </span>
             </div>
           </div>

           {/* Log Action */}
           <form onSubmit={handleSaveTransaction} className="space-y-4 pt-2">
             <h3 className="font-bold text-slate-800 flex items-center gap-2"><Fuel size={18}/> Process Payment & Fuel</h3>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Litres Dispensed</label>
                  <div className="relative mt-1">
                    <input 
                      type="number" step="0.1" required max={session.vehicle.quotaRemaining}
                      className="input-field pr-8 font-bold text-lg focus:ring-green-500/20 focus:border-green-500"
                      value={txForm.litres} onChange={e => setTxForm({...txForm, litres: e.target.value})}
                    />
                    <span className="absolute right-3 top-3.5 text-slate-400 font-bold">L</span>
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Total Amount</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-3.5 text-slate-400 font-bold">৳</span>
                    <input 
                      type="number" required
                      className="input-field pl-8 font-bold text-lg focus:ring-green-500/20 focus:border-green-500"
                      value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})}
                    />
                  </div>
               </div>
             </div>

             <button 
               disabled={isSaving}
               className="btn-primary w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30 border-none"
             >
               {isSaving ? 'Processing...' : <><CheckCircle size={20}/> Complete Transaction</>}
             </button>
           </form>

        </motion.div>
      )}

    </motion.div>
  );
};

export default OperatorScan;
