import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  ShieldAlert, Users, Fuel, TrendingUp, 
  MapPin, AlertTriangle, CheckCircle, Activity 
} from 'lucide-react';

const GovtDashboard = () => {
  // Mock Data for Analytics
  const consumptionData = [
    { name: 'Dhaka', petrol: 4500, diesel: 6200, octane: 2100 },
    { name: 'Chittagong', petrol: 3200, diesel: 4800, octane: 1500 },
    { name: 'Sylhet', petrol: 2100, diesel: 3100, octane: 900 },
    { name: 'Rajshahi', petrol: 1800, diesel: 2900, octane: 700 },
    { name: 'Khulna', petrol: 2400, diesel: 3500, octane: 1100 },
  ];

  const fuelTypeData = [
    { name: 'Diesel', value: 55, color: '#3b82f6' },
    { name: 'Petrol', value: 30, color: '#10b981' },
    { name: 'Octane', value: 15, color: '#f59e0b' },
  ];

  const trendData = [
    { day: 'Mon', usage: 1200 },
    { day: 'Tue', usage: 1400 },
    { day: 'Wed', usage: 1100 },
    { day: 'Thu', usage: 1600 },
    { day: 'Fri', usage: 2100 },
    { day: 'Sat', usage: 1800 },
    { day: 'Sun', usage: 1500 },
  ];

  const stats = [
    { label: 'Total Active Users', value: '1.2M', icon: Users, color: 'blue' },
    { label: 'Registered Pumps', value: '3,450', icon: MapPin, color: 'emerald' },
    { label: 'Fuel Reserved (L)', value: '450M', icon: Fuel, color: 'amber' },
    { label: 'Efficiency Index', value: '+12.4%', icon: TrendingUp, color: 'indigo' },
  ];

  const alerts = [
    { id: 1, pump: 'Padma Fuel Station, Dhaka', issue: 'Fuel Level Critical (<5%)', type: 'critical' },
    { id: 2, pump: 'Jamuna Oil, Chittagong', issue: 'Suspicious Transaction Peak', type: 'warning' },
    { id: 3, pump: 'Meghna Petrol, Sylhet', issue: 'Offline for maintenance', type: 'info' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShieldAlert className="text-primary-600" size={32} />
            Govt. Analytics Dashboard
          </h1>
          <p className="text-slate-500 font-medium">National Fuel Monitoring & Strategic Control</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
            Download Report
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all">
            Adjust Quotas
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 border-b-4 border-b-primary-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consumption Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity className="text-primary-600" />
              <h2 className="text-xl font-black text-slate-900">Consumption by Division (Liters)</h2>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="petrol" name="Petrol" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="diesel" name="Diesel" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="octane" name="Octane" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Type Distribution */}
        <div className="glass-panel p-8">
          <h2 className="text-xl font-black text-slate-900 mb-8">Fuel Type Demand</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fuelTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {fuelTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {fuelTypeData.map(fuel => (
              <div key={fuel.name} className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500">{fuel.name}</span>
                <span className="text-slate-900">{fuel.value}% Share</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Alerts & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Alerts */}
        <div className="glass-panel p-8">
          <div className="flex items-center gap-2 mb-6 text-red-600">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-black">Critical System Alerts</h2>
          </div>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-2xl flex items-start gap-4 ${
                alert.type === 'critical' ? 'bg-red-50 border border-red-100' : 
                alert.type === 'warning' ? 'bg-amber-50 border border-amber-100' : 'bg-blue-50 border border-blue-100'
              }`}>
                <div className={`p-2 rounded-xl ${
                  alert.type === 'critical' ? 'bg-red-200 text-red-700' : 
                  alert.type === 'warning' ? 'bg-amber-200 text-amber-700' : 'bg-blue-200 text-blue-700'
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{alert.pump}</h4>
                  <p className="text-sm font-medium text-slate-600">{alert.issue}</p>
                </div>
                <div className="ml-auto">
                   <button className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:underline">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="glass-panel p-8">
           <div className="flex items-center gap-2 mb-8">
             <TrendingUp className="text-indigo-600" />
             <h2 className="text-xl font-black text-slate-900">National Refueling Trend (Weekly)</h2>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={trendData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                 <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                 <Line type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={4} dot={{ fill: '#6366f1', r: 6 }} activeDot={{ r: 8 }} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GovtDashboard;
