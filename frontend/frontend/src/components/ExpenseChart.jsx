import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const ExpenseChart = ({ data }) => {
  // If no data or all 0, provide some visually pleasing mock data just for preview
  const chartData = data && data.length > 0 ? data : [
    { week: 'Week 1', spent: 1200, litres: 10 },
    { week: 'Week 2', spent: 2500, litres: 20 },
    { week: 'Week 3', spent: 1800, litres: 15 },
    { week: 'Week 4', spent: 3000, litres: 25 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="week" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          tickFormatter={(value) => `৳${value}`}
        />
        <Tooltip 
          cursor={{ fill: '#f1f5f9' }}
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)',
            fontWeight: 600
          }}
          formatter={(value, name) => [name === 'spent' ? `৳${value}` : `${value}L`, name === 'spent' ? 'Amount Spent' : 'Fuel Volume']}
        />
        <Bar 
          dataKey="spent" 
          radius={[6, 6, 0, 0]} 
          barSize={40}
          animationDuration={1500}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#0d9488' : '#cdedea'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
