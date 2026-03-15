import React from 'react';

const GlassCard = ({ children, className = '', padding = '1.5rem', style = {}, ...props }) => {
  return (
    <div 
      className={`glass-card ${className}`}
      style={{ padding, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
