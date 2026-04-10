import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Receipt, TrendingUp, TrendingDown, Target, Fuel } from 'lucide-react';
import { transactionAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionHistory = () => {
  const [data, setData] = useState({ transactions: [], summary: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionAPI.getHistory().then((res) => {
      setData(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="mt-20"><LoadingSpinner /></div>;

  const { transactions, summary } = data;
  
  // Format data for Pie Chart (Pump Breakdown)
  const pumpData = summary?.pumpBreakdown ? Object.keys(summary.pumpBreakdown).map(key => ({
    name: key,
    value: summary.pumpBreakdown[key].totalSpent
  })) : [];
  
  const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Receipt className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-slate-800">Expense Analysis</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPI Card */}
        <div className="glass-panel p-6 flex flex-col justify-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Target size={150} />
           </div>
           
           <h3 className="text-slate-500 font-semibold mb-1">Total Spent Last 30 Days</h3>
           <h2 className="text-5xl font-extrabold text-slate-800 tracking-tighter mb-4">
             {summary?.thisMonth?.totalSpent || '৳0'}
           </h2>
           
           <div className="flex items-center gap-4">
             <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-700 font-semibold">
               <Fuel size={18} /> {summary?.thisMonth?.totalLitres || '0'} Litres
             </div>
             
             {summary?.comparison?.includes('%') && (
               <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-semibold ${
                 summary.comparison.includes('-') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
               }`}>
                 {summary.comparison.includes('-') ? <TrendingDown size={18}/> : <TrendingUp size={18}/>}
                 {summary.comparison.split(' ')[0]}
               </div>
             )}
           </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-panel p-6 h-64 md:h-80">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Spending by Fuel Station</h3>
          {pumpData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pumpData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pumpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `৳${value}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-panel mt-6 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white/50">
          <h3 className="font-bold text-lg text-slate-800">All Transactions</h3>
        </div>
        <div className="p-0">
          {transactions.length === 0 ? (
             <div className="p-8 text-center text-slate-500 font-medium">No transactions found. Go buy some fuel!</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <motion.div 
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  key={tx._id} 
                  className="p-4 hover:bg-slate-50/50 transition-colors flex justify-between items-center sm:px-6"
                >
                  <div className="flex items-center gap-4">
                     <div className="bg-primary-50 p-3 rounded-full text-primary-600 hidden sm:block">
                        <Receipt size={20} />
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-800">{tx.pumpId?.name || 'Unknown Pump'}</h4>
                       <p className="text-xs font-medium text-slate-400 mt-0.5">
                         {new Date(tx.createdAt).toLocaleString()} • {tx.vehicleId?.registrationNo} ({tx.fuelType})
                       </p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">৳{tx.amount}</p>
                    <p className="text-xs font-bold text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded mt-1">
                      {tx.litres}L
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory;
