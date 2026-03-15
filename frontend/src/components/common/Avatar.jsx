import React from 'react';

const Avatar = ({ src, alt, size = '40px', className = '', style = {} }) => {
  return (
    <div 
      className={className}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: `calc(${size} * 0.4)`, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {alt ? alt.charAt(0).toUpperCase() : '?'}
        </span>
      )}
    </div>
  );
};

export default Avatar;
