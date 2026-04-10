import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plus, Settings2, ShieldCheck, Droplet, Fuel } from 'lucide-react';
import { vehicleAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({ registrationNo: '', vehicleType: 'car', fuelType: 'octane' });

  const fetchVehicles = async () => {
    try {
      const res = await vehicleAPI.getMyVehicles();
      setVehicles(res.data.data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await vehicleAPI.add(formData);
      toast.success('Vehicle registered & Quota assigned! 🎉');
      setShowAdd(false);
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await vehicleAPI.update(editingVehicle._id, {
        vehicleType: editingVehicle.vehicleType,
        fuelType: editingVehicle.fuelType
      });
      toast.success('Vehicle updated successfully!');
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update vehicle');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
             <Car size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Garage</h1>
            <p className="text-slate-500 font-medium text-sm">Manage vehicles and monthly fuel quotas</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary py-2.5 shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:shadow-indigo-500/40"
        >
          {showAdd ? 'Cancel' : <><Plus size={18}/> Add Vehicle</>}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-6 border-l-4 border-l-indigo-500 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Register New Vehicle</h3>
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1">Reg. Number</label>
                  <input type="text" required placeholder="DHA-12-3456" className="input-field mt-1 uppercase" 
                    value={formData.registrationNo} onChange={e => setFormData({...formData, registrationNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1">Type</label>
                  <select className="input-field mt-1 bg-white" 
                    value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                  >
                    <option value="motorcycle">Motorcycle (25L)</option>
                    <option value="car">Car (80L)</option>
                    <option value="suv">SUV (100L)</option>
                    <option value="truck">Truck (200L)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1">Fuel Type</label>
                  <select className="input-field mt-1 bg-white" 
                    value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}
                  >
                    <option value="octane">Octane</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button type="submit" className="btn-primary mt-2 bg-gradient-to-r from-indigo-500 to-indigo-600">Save Vehicle</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <div className="mt-10"><LoadingSpinner /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.length === 0 && !showAdd ? (
             <div className="md:col-span-2 text-center py-10 glass-panel">
               No vehicles found. Add your first vehicle to get a fuel quota!
             </div>
          ) : (
            vehicles.map(v => {
              const quotaPercent = (v.quotaRemaining / v.quotaLimit) * 100;
              return (
                <motion.div key={v._id} whileHover={{ y: -5 }} className="glass-card p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <h2 className="text-2xl font-bold tracking-wider text-slate-800">{v.registrationNo}</h2>
                       <div className="flex items-center gap-2 mt-2">
                         <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded">{v.vehicleType}</span>
                         <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-600 border border-primary-100 px-2 py-1 rounded">{v.fuelType}</span>
                       </div>
                     </div>
                     <div 
                       onClick={() => setEditingVehicle(editingVehicle?._id === v._id ? null : v)}
                       className={`bg-slate-50 p-2 rounded-lg cursor-pointer transition-colors border border-slate-100 ${editingVehicle?._id === v._id ? 'text-primary-600 bg-primary-50 border-primary-200' : 'text-slate-400 hover:text-primary-500'}`}
                     >
                       <Settings2 size={20} />
                     </div>
                  </div>
                  
                  <AnimatePresence>
                  {editingVehicle?._id === v._id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden mt-2 mb-4 pt-4 border-t border-slate-100">
                      <form onSubmit={handleUpdate} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-slate-500">Change Type</label>
                          <select className="input-field py-1.5 px-2 text-sm mt-1 bg-white" value={editingVehicle.vehicleType} onChange={e => setEditingVehicle({...editingVehicle, vehicleType: e.target.value})}>
                            <option value="motorcycle">Motorcycle (25L)</option>
                            <option value="car">Car (80L)</option>
                            <option value="suv">SUV (100L)</option>
                            <option value="truck">Truck (200L)</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-semibold text-slate-500">Change Fuel</label>
                          <select className="input-field py-1.5 px-2 text-sm mt-1 bg-white" value={editingVehicle.fuelType} onChange={e => setEditingVehicle({...editingVehicle, fuelType: e.target.value})}>
                            <option value="octane">Octane</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="cng">CNG</option>
                          </select>
                        </div>
                        <button type="submit" className="bg-primary-500 text-white font-semibold py-1.5 px-4 rounded-lg shadow hover:bg-primary-600 transition-colors">Update</button>
                      </form>
                    </motion.div>
                  )}
                  </AnimatePresence>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100">
                     <div className="flex justify-between items-end mb-2">
                       <div className="flex items-center gap-2 text-slate-600">
                         <Droplet size={16} className={quotaPercent < 20 ? 'text-red-500' : 'text-primary-500'}/>
                         <span className="font-semibold text-sm">Monthly Quota</span>
                       </div>
                       <span className="font-bold text-slate-800">{v.quotaRemaining} <span className="text-slate-400 text-sm">/ {v.quotaLimit}L</span></span>
                     </div>
                     <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden w-full">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${quotaPercent}%` }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className={`h-full rounded-full ${quotaPercent < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]'}`}
                       />
                     </div>
                     {quotaPercent < 20 && <p className="text-xs text-red-500 font-medium mt-2">Quota running low!</p>}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Vehicles;
