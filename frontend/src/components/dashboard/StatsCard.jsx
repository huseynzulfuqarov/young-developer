import React, { useEffect, useState } from 'react';
import GlassCard from '../common/GlassCard';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendUp, color = 'var(--accent-primary)' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const end = typeof value === 'number' ? value : parseFloat(value) || 0;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const increment = end / steps;
    
    if (end === 0) {
      setDisplayValue(value);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(value);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <GlassCard padding="1.5rem" hover>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{title}</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            {displayValue}
            {typeof value === 'string' && value.toString().includes('%') && '%'}
          </h3>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
      
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500, color: trendUp ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
          {trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{trend}</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>vs last month</span>
        </div>
      )}
    </GlassCard>
  );
};

export default StatsCard;
