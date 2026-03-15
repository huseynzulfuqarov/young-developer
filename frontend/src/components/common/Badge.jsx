import React from 'react';

const Badge = ({ children, variant = 'primary', className = '', style = {}, ...props }) => {
  return (
    <span 
      className={`badge ${variant} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
