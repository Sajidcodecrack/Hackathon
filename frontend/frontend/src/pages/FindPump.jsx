import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Compass, Navigation2, Zap, Clock, Car, X, Calendar as CalendarIcon } from 'lucide-react';
import { pumpAPI, aiAPI, bookingAPI, vehicleAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FindPump = () => {
  const [location, setLocation] = useState(null);
  const [pumps, setPumps] = useState([]);
  const [aiRec, setAiRec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fuelType, setFuelType] = useState('octane');
  
  // Booking Modal State
  const [bookingModal, setBookingModal] = useState({ isOpen: false, pump: null });
  const [vehicles, setVehicles] = useState([]);
  const [bookingForm, setBookingForm] = useState({ vehicleId: '', slotTime: '' });
  const [isBooking, setIsBooking] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fetch vehicles for the booking modal
    vehicleAPI.getMyVehicles().then(res => setVehicles(res.data.data)).catch(() => {});
  }, []);

  const getLocationAndPumps = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          const res = await aiAPI.recommend({
            lat: latitude,
            lng: longitude,
            fuelType: fuelType,
            radius: 15
          });

          setPumps(res.data.data.allPumps);
          setAiRec(res.data.data.recommendation);
          toast.success('Pumps found! AI Recommendation ready.');
        } catch (error) {
          console.error(error);
          toast.error('Failed to fetch nearby pumps');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        toast.error('Location access denied!');
        setLoading(false);
      }
    );
  };

  const openBookingModal = (pump) => {
    // Only allow vehicles that match the pump's fuel types
    const suitableVehicles = vehicles.filter(v => pump.fuelTypes.includes(v.fuelType));
    
    if (suitableVehicles.length === 0) {
       toast.error(`You don't have any vehicles registered with ${pump.fuelTypes.join(' or ')}`);
       return;
    }

    setBookingForm({ 
      vehicleId: suitableVehicles[0]._id, 
      // Default to 15 mins from now
      slotTime: new Date(Date.now() + 15 * 60000).toISOString().slice(0, 16) 
    });
    setBookingModal({ isOpen: true, pump });
  };

  const handleBookingSubmit = async (e) => {
     e.preventDefault();
     setIsBooking(true);
     try {
        await bookingAPI.create({
           pumpId: bookingModal.pump._id,
           vehicleId: bookingForm.vehicleId,
           slotTime: bookingForm.slotTime
        });
        toast.success('Slot booked successfully! QR Code generated.');
        setBookingModal({ isOpen: false, pump: null });
        navigate('/bookings'); // Send them to see the QR code
     } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to book slot');
     } finally {
        setIsBooking(false);
     }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative">
      
      {/* Search Header */}
      <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-t-primary-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Compass className="text-primary-500" /> Find Nearest Pump
          </h1>
          <p className="text-slate-500 font-medium mt-1">Get AI-powered recommendations based on queue & distance.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="input-field py-2 w-1/3 md:w-40 bg-white"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
          >
            <option value="octane">Octane</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="cng">CNG</option>
          </select>

          <button 
            onClick={getLocationAndPumps}
            disabled={loading}
            className="btn-primary flex-1 whitespace-nowrap"
          >
            {loading ? 'Scanning Radar...' : <><Search size={18}/> Scan Nearby</>}
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center">
           <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-500 mb-4">
             <MapPin size={40} />
           </motion.div>
           <p className="text-lg font-medium text-slate-600 animate-pulse">Contacting Satellites...</p>
        </div>
      )}

      {/* AI Recommendation Highlight */}
      {!loading && aiRec && aiRec.recommendedPumpIndex !== -1 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative overflow-hidden rounded-2xl p-[2px] bg-gradient-to-r from-teal-400 via-primary-500 to-indigo-500">
          <div className="bg-white/95 backdrop-blur-3xl rounded-[14px] p-6 flex flex-col md:flex-row items-center md:items-start gap-4">
             <div className="bg-gradient-to-br from-indigo-100 to-primary-100 p-3 rounded-full text-primary-600 shadow-inner">
               <Zap size={28} className="fill-primary-500/20" />
             </div>
             <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
               <div>
                 <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 text-center md:text-left">
                    Gemini AI Pick: {aiRec.pumpName}
                 </h2>
                 <p className="text-slate-700 mt-2 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                   "{aiRec.reason}"
                 </p>
                 <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md"><Clock size={16}/> {aiRec.estimatedTotalTime}</span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-100">💡 {aiRec.tips}</span>
                 </div>
               </div>
               
               {/* Quick Book AI Recommended Pump */}
               <button 
                 onClick={() => openBookingModal(pumps[aiRec.recommendedPumpIndex])}
                 className="btn-primary shadow-indigo-500/30 whitespace-nowrap bg-gradient-to-r from-indigo-500 to-primary-500 w-full md:w-auto"
               >
                 Book AI Pick
               </button>
             </div>
          </div>
        </motion.div>
      )}

      {/* Pumps Grid */}
      {!loading && pumps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {pumps.map((pump, idx) => {
            const isRec = aiRec?.recommendedPumpIndex === idx;
            return (
              <motion.div key={pump._id} whileHover={{ y: -5 }} className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between ${isRec ? 'ring-2 ring-primary-500 shadow-primary-500/20' : ''}`}>
                 {isRec && <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">TOP PICK</div>}
                 
                 <div>
                   <h3 className="font-bold text-lg text-slate-800 pr-16 leading-tight">{pump.name}</h3>
                   <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin size={14} className="shrink-0"/> <span className="truncate">{pump.address}</span></p>
                   
                   <div className="flex items-center gap-4 mt-4 mb-5 pb-4 border-b border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-400">Wait Time</span>
                        <span className="font-bold text-primary-600 flex items-center gap-1"><Clock size={14}/> {pump.estimatedWait}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-400">Distance</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1"><Navigation2 size={14}/> {pump.distance}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-400">Queue</span>
                        <span className={`font-bold ${pump.currentQueue > 5 ? 'text-orange-500' : 'text-green-500'} flex items-center gap-1`}>
                          <Car size={14}/> {pump.currentQueue}
                        </span>
                      </div>
                   </div>
                 </div>

                 <div className="flex justify-between items-end mt-auto">
                    <div className="flex gap-1 flex-wrap w-1/2">
                      {pump.fuelTypes.map(f => (
                        <span key={f} className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded mb-1">{f}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => openBookingModal(pump)}
                      className="bg-dark-800 hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                    >
                      <CalendarIcon size={16} /> Book Slot
                    </button>
                 </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md relative"
            >
              <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold flex items-center gap-2"><CalendarIcon /> Book a Slot</h2>
                <button onClick={() => setBookingModal({ isOpen: false, pump: null })} className="bg-black/10 hover:bg-black/20 rounded-full p-1"><X size={20}/></button>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Station</p>
                   <p className="font-bold text-slate-800 text-lg flex items-center gap-2"><MapPin size={18} className="text-primary-500" /> {bookingModal.pump.name}</p>
                   <p className="text-sm text-primary-600 font-medium mt-1 bg-primary-50 px-2 py-0.5 rounded inline-block">Est. Wait: {bookingModal.pump.estimatedWait}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1">Select Vehicle</label>
                  <select 
                    required
                    className="input-field mt-1 bg-white font-medium text-slate-700" 
                    value={bookingForm.vehicleId} 
                    onChange={e => setBookingForm({...bookingForm, vehicleId: e.target.value})}
                  >
                    {vehicles.filter(v => bookingModal.pump.fuelTypes.includes(v.fuelType)).map(v => (
                       <option key={v._id} value={v._id}>{v.registrationNo} ({v.vehicleType} - {v.fuelType})</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1 ml-1">Only vehicles matching pump's fuel types are shown.</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1">Arrival Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="input-field mt-1 bg-white" 
                    value={bookingForm.slotTime} 
                    onChange={e => setBookingForm({...bookingForm, slotTime: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isBooking}
                  className="btn-primary w-full mt-2 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 disabled:opacity-70"
                >
                  {isBooking ? 'Securing Slot...' : 'Confirm Booking & Generate QR'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default FindPump;
