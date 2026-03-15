import React, { useEffect, useState } from 'react';

const HealthScoreGauge = ({ score = 0, size = 120, strokeWidth = 12 }) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentScore(score);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (currentScore / 100) * circumference;

  let color = 'var(--accent-danger)';
  if (currentScore > 30) color = 'var(--accent-warning)';
  if (currentScore > 60) color = 'var(--accent-success)';
  if (currentScore > 80) color = '#10b981'; // emerald

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{currentScore}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/100</span>
      </div>
    </div>
  );
};

export default HealthScoreGauge;
