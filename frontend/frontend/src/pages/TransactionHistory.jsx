import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Receipt, TrendingUp, TrendingDown, Target, Fuel, Filter, Search, ArrowUpRight, Calendar, CreditCard } from 'lucide-react';
import { transactionAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionHistory = () => {
  const [data, setData] = useState({ transactions: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    transactionAPI.getHistory().then((res) => {
      setData(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="mt-20"><LoadingSpinner /></div>;

  const { transactions = [], summary } = data;
  
  // Format data for Pie Chart
  const pumpData = summary?.pumpBreakdown ? Object.keys(summary.pumpBreakdown).map(key => ({
    name: key,
    value: summary.pumpBreakdown[key].totalSpent
  })) : [];
  
  const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      
      {/* Dynamic Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl border border-slate-800">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] -z-0" />
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
               <span className="bg-primary-500/20 text-primary-300 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-primary-500/30">Analytics Engine v2.0</span>
               <h1 className="text-4xl font-black tracking-tight">Financial Intelligence</h1>
               <p className="text-slate-400 font-medium">Tracking and optimizing every drop of your fuel consumption.</p>
            </div>
            
            <div className="flex gap-4">
               <div className="glass-panel bg-white/5 border-white/10 p-4 text-center min-w-[120px]">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Litres Used</p>
                  <p className="text-2xl font-black text-primary-400">{summary?.thisMonth?.totalLitres || '0'}L</p>
               </div>
               <div className="glass-panel bg-white/5 border-white/10 p-4 text-center min-w-[120px]">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Avg Daily</p>
                  <p className="text-2xl font-black text-indigo-400">৳{Math.round((summary?.thisMonth?.totalSpent || 0) / 30)}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Stats & Filters */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-6 border-l-4 border-primary-500">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">30-Day Spending</p>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter mt-1">৳{summary?.thisMonth?.totalSpent || '0'}</h2>
                 </div>
                 <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 shadow-inner">
                    <TrendingUp size={24} />
                 </div>
              </div>
              
              <div className="space-y-3">
                 <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-2"><Filter size={14}/> Quick Filters</p>
                 <div className="flex flex-wrap gap-2">
                    {['all', 'octane', 'diesel', 'petrol'].map(f => (
                       <button 
                         key={f} 
                         onClick={() => setFilter(f)}
                         className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${filter === f ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                       >
                         {f}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Pie Chart Analysis */}
           <div className="glass-panel p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <Target size={14}/> Station Loyalty breakdown
              </h3>
              <div className="h-64">
                {pumpData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pumpData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" animationDuration={1000}>
                        {pumpData.map((entry, index) => <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold italic">No Analysis Data Yet</div>}
              </div>
           </div>
        </div>

        {/* Right Side: Timeline Receipts */}
        <div className="lg:col-span-8 relative">
           <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />
           
           <div className="space-y-8">
              {transactions.length === 0 ? (
                 <div className="glass-panel p-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                       <CreditCard size={32} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800">No Transactions Captured</h3>
                       <p className="text-slate-400 text-sm">Fuel your vehicle at a partner station to see your analysis.</p>
                    </div>
                 </div>
              ) : (
                transactions.filter(t => filter === 'all' || t.fuelType === filter).map((tx, idx) => (
                  <motion.div 
                    key={tx._id}
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="relative pl-0 sm:pl-16 group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-[21px] top-6 w-3 h-3 rounded-full border-2 border-white bg-slate-300 group-hover:bg-primary-500 group-hover:scale-150 transition-all z-10 hidden sm:block" />
                    
                    {/* Receipt Card */}
                    <div className="glass-panel p-5 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all relative overflow-hidden flex flex-col sm:flex-row gap-4 justify-between items-center group/card">
                       {/* Background Decorative Element */}
                       <div className="absolute -bottom-4 -right-4 text-slate-50 opacity-0 group-hover/card:opacity-100 transition-opacity">
                          <Fuel size={80} />
                       </div>

                       <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover/card:bg-primary-50 group-hover/card:text-primary-500 transition-colors border border-slate-100">
                             <span className="text-[10px] font-black leading-none">{new Date(tx.createdAt).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                             <span className="text-lg font-black leading-none">{new Date(tx.createdAt).getDate()}</span>
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 group-hover/card:text-primary-600 transition-colors flex items-center gap-2">
                                {tx.pumpId?.name || 'SmartFuel Station'}
                                <ArrowUpRight size={14} className="opacity-0 group-hover/card:opacity-100 transition-all" />
                             </h4>
                             <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-semibold text-slate-400">
                                <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-indigo-500 font-bold uppercase tracking-wider">{tx.fuelType}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1 uppercase tracking-wider">{tx.vehicleId?.registrationNo}</span>
                             </div>
                          </div>
                       </div>

                       <div className="text-center sm:text-right relative z-10 bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto mt-2 sm:mt-0">
                          <p className="text-2xl font-black text-slate-800 tracking-tighter">৳{tx.amount}</p>
                          <p className="text-xs font-black text-white bg-slate-900 px-3 py-1 rounded-full inline-block mt-1 shadow-md shadow-slate-900/20 group-hover/card:bg-primary-600 group-hover/card:shadow-primary-600/20 transition-all">
                             {tx.litres} LITRES
                          </p>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory;
