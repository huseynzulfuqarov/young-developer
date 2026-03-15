import React from 'react';

const SpinStyle = () => (
  <style>{`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}</style>
);

export const Skeleton = ({ className = '', style = {}, width = '100%', height = '20px', borderRadius = 'var(--radius-sm)' }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius, ...style }}
    />
  );
};

export const Spinner = ({ size = '24px', color = 'var(--accent-primary)', className = '' }) => {
  return (
    <>
      <SpinStyle />
      <div 
        className={className}
        style={{
          width: size,
          height: size,
          border: `3px solid ${color}33`, 
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
    </>
  );
};
