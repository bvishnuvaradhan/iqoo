import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-white/10 text-white/70',
    blue: 'bg-blue-500/20 text-blue-500',
    purple: 'bg-purple-500/20 text-purple-500',
    cyan: 'bg-cyan-500/20 text-cyan-500',
    success: 'bg-emerald-500/20 text-emerald-500',
    warning: 'bg-amber-500/20 text-amber-500',
    danger: 'bg-red-500/20 text-red-500'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  const combinedClasses = `inline-flex items-center justify-center rounded-full font-medium ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`;

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
};

export default Badge;
