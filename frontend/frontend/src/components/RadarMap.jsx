import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info, Zap } from 'lucide-react';

const RadarMap = ({ pumps, location, aiRec }) => {
  // Simulate a high-tech radar map
  const dots = pumps.map((p, i) => ({
    id: p._id,
    x: 50 + (Math.random() - 0.5) * 60, // Random positions centered
    y: 50 + (Math.random() - 0.5) * 60,
    name: p.name,
    isRec: aiRec?.recommendedPumpIndex === i,
    traffic: Math.floor(Math.random() * 100) // Simulate traffic %
  }));

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
      {/* Radar Background Grids */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[10%] h-[10%] border border-primary-500 rounded-full animate-ping" />
        <div className="w-[30%] h-[30%] border border-primary-500 rounded-full" />
        <div className="w-[50%] h-[50%] border border-primary-500 rounded-full" />
        <div className="w-[70%] h-[70%] border border-primary-500 rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent" />
      </div>

      {/* Axis Lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-full h-px bg-primary-500" />
        <div className="h-full w-px bg-primary-500" />
      </div>

      {/* Scanning Line */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 w-[100%] h-[2px] bg-gradient-to-r from-primary-500 to-transparent origin-left z-10 opacity-30"
        style={{ marginTop: '-1px' }}
      />

      {/* Pump Points */}
      {dots.map((dot, idx) => (
        <motion.div
           key={dot.id}
           initial={{ opacity: 0, scale: 0 }}
           animate={{ opacity: 1, scale: 1 }}
           className="absolute z-20 group"
           style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        >
           <div className={`relative flex items-center justify-center cursor-pointer`}>
              {dot.isRec && (
                <div className="absolute -inset-4 bg-primary-500/20 rounded-full animate-pulse border border-primary-500/30" />
              )}
              <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-white ${dot.isRec ? 'bg-indigo-500' : dot.traffic > 70 ? 'bg-red-500' : dot.traffic > 40 ? 'bg-orange-500' : 'bg-green-500'}`} />
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 font-bold border border-slate-700">
                {dot.name} {dot.isRec && '✨'}
                <div className="flex items-center gap-1 mt-0.5">
                   <div className="w-1 h-1 rounded-full bg-slate-400" />
                   Traffic: {dot.traffic}%
                </div>
              </div>
           </div>
        </motion.div>
      ))}

      {/* Current Location */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="relative">
          <div className="absolute -inset-3 bg-blue-500/20 rounded-full animate-ping" />
          <MapPin size={20} className="text-blue-500 filter drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 glass-panel bg-slate-900/80 p-3 space-y-2 border-slate-700">
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
            <div className="w-2 h-2 rounded-full bg-green-500" /> Smooth Traffic
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> Moderate
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
            <div className="w-2 h-2 rounded-full bg-red-500" /> Jam / Long Queue
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-primary-400 border-t border-slate-700 pt-1">
            <Zap size={10} /> AI Optimized Route
         </div>
      </div>

      {/* Top Status Bar */}
      <div className="absolute top-4 right-4 glass-panel bg-slate-900/80 px-3 py-1 flex items-center gap-2 border-slate-700">
         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
         <span className="text-[10px] font-bold text-primary-400 tracking-widest uppercase">Live AI Traffic Sync</span>
      </div>
    </div>
  );
};

export default RadarMap;
