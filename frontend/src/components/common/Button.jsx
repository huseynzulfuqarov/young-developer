import React from 'react';

const Button = ({ children, variant = 'primary', className = '', loading = false, disabled, ...props }) => {
  return (
    <button 
      className={`btn-${variant} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="loader" style={{width: '16px', height: '16px', border: '2px solid transparent', borderTopColor: 'inherit', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
