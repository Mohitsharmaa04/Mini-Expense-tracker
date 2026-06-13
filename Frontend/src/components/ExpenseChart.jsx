import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid 
} from 'recharts';
import { BarChart2, PieChart as PieIcon, Info } from 'lucide-react';

const CHART_COLORS = [
  '#ff7675', // Food
  '#74b9ff', // Utilities
  '#ffeaa7', // Transport
  '#a29bfe', // Entertainment
  '#55efc4', // Health
  '#fd79a8', // Education
  '#fdcb6e', // Shopping
  '#b2bec3'  // Others
];

const ExpenseChart = ({ categoryBreakdown }) => {
  const [chartType, setChartType] = useState('pie'); // 'pie' or 'bar'

  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="card card-chart" style={{ 
        textAlign: 'center', 
        padding: '3rem 1.5rem', 
        color: 'var(--text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '320px'
      }}>
        <Info size={36} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
        <p>No transaction data available yet to display charts.</p>
      </div>
    );
  }

  // Format currency for chart tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {data.category || data.name}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Prepare data for Pie Chart
  const pieData = categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.total
  }));

  // Prepare data for Bar Chart
  const barData = categoryBreakdown.map((item) => ({
    category: item.category,
    amount: item.total
  }));

  return (
    <div className="card card-chart animate-fade-in" style={{ minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
      {/* Chart Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          <PieIcon size={18} style={{ color: 'var(--accent-primary)' }} />
          Spending Breakdown
        </h3>

        {/* Chart Toggle Buttons */}
        <div style={{ 
          display: 'inline-flex', 
          backgroundColor: 'var(--bg-app)', 
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '2px'
        }}>
          <button
            onClick={() => setChartType('pie')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: chartType === 'pie' ? 'var(--accent-primary)' : 'transparent',
              color: chartType === 'pie' ? 'var(--bg-app)' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            <PieIcon size={12} />
            Pie
          </button>
          <button
            onClick={() => setChartType('bar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: chartType === 'bar' ? 'var(--accent-primary)' : 'transparent',
              color: chartType === 'bar' ? 'var(--bg-app)' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            <BarChart2 size={12} />
            Bar
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconSize={10} 
                iconType="circle"
                formatter={(value) => <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{value}</span>}
              />
            </PieChart>
          ) : (
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false} 
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
