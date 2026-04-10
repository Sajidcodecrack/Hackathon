import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { Sparkles } from 'lucide-react';

const ExpenseChart = ({ data }) => {
  
  // Transform or Mock data to include an AI Forecast path
  const hasRealData = data && data.length > 0 && data.some(d => d.spent > 0);
  
  const baseChartData = hasRealData ? data : [
    { week: 'Week 1', spent: 1200, litres: 10 },
    { week: 'Week 2', spent: 2500, litres: 20 },
    { week: 'Week 3', spent: 1800, litres: 15 },
    { week: 'Week 4', spent: 3000, litres: 25 },
  ];

  // Inject AI Forecast Trend line (just +/- 10% of spend + a future projection)
  const chartDataWithAI = [...baseChartData].map((d, i) => ({
    ...d,
    aiForecast: d.spent > 0 ? Math.round(d.spent * 0.9 + (i * 200)) : null
  }));

  // Add a future week projection
  chartDataWithAI.push({
    week: 'Next Week',
    spent: 0,
    litres: 0,
    aiForecast: Math.round((chartDataWithAI[chartDataWithAI.length-1].spent * 0.85) || 2000)
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartDataWithAI}
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
          formatter={(value, name) => {
             if (name === 'aiForecast') return [`৳${value}`, '✨ AI Predicted Spend'];
             if (name === 'spent') return [`৳${value}`, 'Actual Spend'];
             return [`${value}L`, 'Fuel Volume'];
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '20px' }} />
        
        <Bar 
          dataKey="spent" 
          name="Actual Spend"
          radius={[6, 6, 0, 0]} 
          barSize={40}
          animationDuration={1500}
        >
          {chartDataWithAI.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === chartDataWithAI.length - 2 ? '#6366f1' : '#c7d2fe'} />
          ))}
        </Bar>

        {/* AI Projection Line Overlay */}
        <Line 
          type="monotone" 
          dataKey="aiForecast" 
          name="AI Forecast Trend"
          stroke="#14b8a6" 
          strokeWidth={4} 
          strokeDasharray="5 5" 
          dot={{ r: 6, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 8 }}
          animationDuration={2500}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
