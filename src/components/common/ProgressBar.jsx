import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ value, max = 100, color = 'blue', size = 'sm', showLabel = false, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500'
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      <div className={`flex-1 bg-white/[0.06] rounded-full overflow-hidden ${sizes[size] || sizes.sm}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colors[color] || colors.blue}`}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-white/70 w-8 text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
