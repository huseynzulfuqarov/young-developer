import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../common/GlassCard';

const MemberStatusChart = ({ data }) => {
  const COLORS = {
    CHAMPION: '#eab308', 
    ACTIVE: '#22c55e',   
    AT_RISK: '#f59e0b',  
    CHURNED: '#ef4444'   
  };

  const chartData = [
    { name: 'Champions', value: data?.championMembers || 0, color: COLORS.CHAMPION },
    { name: 'Active', value: data?.activeMembers || 0, color: COLORS.ACTIVE },
    { name: 'At Risk', value: data?.atRiskMembers || 0, color: COLORS.AT_RISK },
    { name: 'Churned', value: data?.churnedMembers || 0, color: COLORS.CHURNED },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    chartData.push({ name: 'No Data', value: 1, color: 'var(--border-subtle)' });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', color: 'white' }}>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Member Status</h3>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        {chartData.map((entry, index) => (
          entry.name !== 'No Data' && (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></span>
              {entry.name}
            </div>
          )
        ))}
      </div>
    </GlassCard>
  );
};

export default MemberStatusChart;
