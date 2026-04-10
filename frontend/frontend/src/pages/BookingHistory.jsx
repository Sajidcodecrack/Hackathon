import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, QrCode, CheckCircle2 } from 'lucide-react';
import { bookingAPI } from '../services/api';
import QRModal from '../components/QRModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState({ isOpen: false, url: null, id: null, pumpName: null, vehicleReg: null, slotTime: null });

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getHistory();
      setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCheckIn = async (id) => {
    try {
      await bookingAPI.checkIn(id);
      toast.success('Successfully checked in at pump!');
      fetchBookings(); // Refresh status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    }
  };

  if (loading) return <div className="mt-20"><LoadingSpinner /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-primary-500" size={28} />
        <h1 className="text-3xl font-bold text-slate-800">My Bookings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.length === 0 ? (
          <div className="md:col-span-2 glass-panel p-10 text-center text-slate-500">
            No active or past bookings found. Book a slot from "Find Pump"
          </div>
        ) : (
          bookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'confirmed';
            const isActive = isConfirmed || b.bookingStatus === 'checked_in';
            
            return (
              <motion.div 
                key={b._id} 
                whileHover={{ y: -4 }}
                className={`glass-card p-6 border-t-4 ${isActive ? 'border-t-primary-500 shadow-primary-500/10' : 'border-t-slate-300 opacity-80'}`}
              >
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                        isConfirmed ? 'bg-amber-100 text-amber-700' :
                        b.bookingStatus === 'checked_in' ? 'bg-blue-100 text-blue-700' :
                        b.bookingStatus === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {b.bookingStatus.replace('_', ' ')}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 mt-2">{b.pumpId?.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin size={14}/> {b.pumpId?.address}</p>
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100 mb-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-1"><Clock size={12}/> Slot Time</span>
                      <span className="font-bold text-slate-700">{new Date(b.slotTime).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-400 mb-1 block text-right">Vehicle</span>
                      <span className="font-bold text-slate-700">{b.vehicleId?.registrationNo}</span>
                    </div>
                 </div>

                 <div className="flex gap-3 mt-auto">
                    {/* Only show QR if uncompleted */}
                    {isActive && b.qrCode && (
                       <button 
                         onClick={() => setQrModal({ 
                           isOpen: true, 
                           url: b.qrCode, 
                           id: b._id,
                           pumpName: b.pumpId?.name, 
                           vehicleReg: b.vehicleId?.registrationNo, 
                           slotTime: b.slotTime 
                         })}
                         className="flex-1 py-2.5 bg-dark-800 hover:bg-black text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                       >
                         <QrCode size={18} /> Show Pass
                       </button>
                    )}
                    
                    {/* Location Check-In Button */}
                    {isConfirmed && (
                       <button 
                         onClick={() => handleCheckIn(b._id)}
                         className="flex-1 py-2.5 bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                       >
                         <MapPin size={18} /> I've Arrived
                       </button>
                    )}

                    {b.bookingStatus === 'completed' && (
                       <div className="w-full py-2.5 bg-green-50 text-green-600 font-semibold rounded-xl flex items-center justify-center gap-2">
                         <CheckCircle2 size={18} /> Booking Completed
                       </div>
                    )}
                 </div>
              </motion.div>
            )
          })
        )}
      </div>

      <QRModal 
        isOpen={qrModal.isOpen} 
        onClose={() => setQrModal({ isOpen: false, url: null, id: null, pumpName: null, vehicleReg: null, slotTime: null })} 
        qrCodeUrl={qrModal.url}
        bookingId={qrModal.id}
        pumpName={qrModal.pumpName}
        vehicleReg={qrModal.vehicleReg}
        slotTime={qrModal.slotTime}
      />
    </motion.div>
  );
};

export default BookingHistory;
