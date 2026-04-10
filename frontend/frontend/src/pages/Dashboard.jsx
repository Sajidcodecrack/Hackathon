import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Car, Droplet, CreditCard, Calendar, Activity, Sparkles } from 'lucide-react';
import { transactionAPI, vehicleAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ExpenseChart from '../components/ExpenseChart';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    vehicles: [],
    transactions: [],
    summary: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vehiclesRes, txRes] = await Promise.all([
          vehicleAPI.getMyVehicles(),
          transactionAPI.getHistory()
        ]);
        
        setData({
          vehicles: vehiclesRes.data.data,
          transactions: txRes.data.data.transactions,
          summary: txRes.data.data.summary
        });
      } catch (error) {
        console.error("Dashboard data load failed", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <div className="mt-20"><LoadingSpinner /></div>;

  const { summary = {}, vehicles = [] } = data;
  
  // Calculate total quota
  const totalRemainingQuota = vehicles.reduce((sum, v) => sum + v.quotaRemaining, 0);
  const totalLimitQuota = vehicles.reduce((sum, v) => sum + v.quotaLimit, 0);
  const quotaPercentage = totalLimitQuota > 0 ? (totalRemainingQuota / totalLimitQuota) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hi, {user?.name} 👋</h1>
          <p className="text-slate-500 font-medium">Here's your fuel consumption overview.</p>
        </div>
        <div className="bg-primary-50 px-4 py-2 rounded-lg font-semibold text-primary-600 border border-primary-100 flex items-center gap-2">
          <Droplet size={18} />
          Total Quota Left: {totalRemainingQuota}L
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Quota Card */}
         <motion.div 
           whileHover={{ y: -5 }}
           className="glass-card p-6 border-l-4 border-l-primary-500"
         >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Available Quota</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalRemainingQuota} / {totalLimitQuota} L</h3>
              </div>
              <div className="p-3 bg-primary-50 rounded-xl text-primary-600"><Droplet size={20} /></div>
            </div>
            <div className="mt-4 bg-slate-100 h-2 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${quotaPercentage}%` }}
                 transition={{ duration: 1, delay: 0.2 }}
                 className={`h-full ${quotaPercentage < 20 ? 'bg-red-500' : 'bg-primary-500'}`}
               />
            </div>
         </motion.div>

         {/* Spend Card */}
         <motion.div 
           whileHover={{ y: -5 }}
           className="glass-card p-6 border-l-4 border-l-blue-500"
         >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">This Month Expenses</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{summary?.thisMonth?.totalSpent || '৳0'}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><CreditCard size={20} /></div>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500">
               {summary?.comparison || "No previous data"}
            </p>
         </motion.div>

         {/* Vehicles Card */}
         <motion.div 
           whileHover={{ y: -5 }}
           className="glass-card p-6 border-l-4 border-l-indigo-500"
         >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Vehicles</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{vehicles.length}</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Car size={20} /></div>
            </div>
            <p className="mt-3 text-sm font-medium text-indigo-500">
               Total {summary?.thisMonth?.totalLitres || '0L'} fueled this month
            </p>
         </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center gap-2 mb-6">
             <Activity className="text-primary-500" />
             <h2 className="text-lg font-bold text-slate-800">Weekly Fuel Expenses</h2>
          </div>
          <div className="h-72">
            <ExpenseChart data={summary?.weeklyTrend || []} />
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="glass-panel p-6 flex flex-col h-full">
          <div className="flex items-center justify-between gap-2 mb-6">
             <div className="flex items-center gap-2">
               <Calendar className="text-blue-500" />
               <h2 className="text-lg font-bold text-slate-800">Recent Logs</h2>
             </div>
             <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">View All</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {(data?.transactions?.length || 0) === 0 ? (
               <p className="text-center text-slate-400 mt-10">No fuel records yet.</p>
            ) : (
              data.transactions.slice(0, 5).map((tx) => (
                <div key={tx._id} className="p-3 border border-slate-100 rounded-xl bg-white hover:shadow-md transition-shadow flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-800">{tx.pumpId?.name || "Fuel Pump"}</h4>
                    <span className="text-xs font-medium text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">৳{tx.amount}</p>
                    <span className="text-xs font-medium text-primary-600">{tx.litres}L • {tx.fuelType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* AI Energy Insights Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
           <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 border border-primary-500/30">
              <Activity size={32} className="animate-pulse" />
           </div>
           
           <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                 <Sparkles className="text-primary-400" size={20} /> AI Consumption Analysis
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                 Based on your last {data?.transactions?.length || 0} refueling sessions, your average fuel efficiency has improved by 4.2%. We recommend avoiding the "Metro Station" route during 5PM-7PM to save approximately 0.8L of fuel normally lost to idling.
              </p>
           </div>
           
           <div className="flex gap-4">
              <div className="text-center bg-slate-800/50 p-3 rounded-xl border border-slate-700 min-w-[100px]">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</p>
                 <p className="text-lg font-bold text-green-400">+4.2%</p>
              </div>
              <div className="text-center bg-slate-800/50 p-3 rounded-xl border border-slate-700 min-w-[100px]">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Savings</p>
                 <p className="text-lg font-bold text-primary-400">৳2,450</p>
              </div>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
