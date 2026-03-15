import React from 'react';

const GlassCard = ({ children, className = '', padding = '1.5rem', style = {}, hover, glow, ...props }) => {
  const hoverClass = hover ? 'glass-card-hover' : '';
  const glowClass = glow ? 'glass-card-glow' : '';

  return (
    <div 
      className={`glass-card ${hoverClass} ${glowClass} ${className}`}
      style={{ padding, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
