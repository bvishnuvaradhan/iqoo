import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, onClick, className = '', disabled, loading }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    secondary: 'glass border border-white/[0.1] text-white hover:bg-white/[0.08]',
    ghost: 'bg-transparent text-white/70 hover:bg-white/[0.05] hover:text-white',
    danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
  };

  const sizes = {
    sm: 'text-xs h-8 px-3 gap-1.5',
    md: 'text-sm h-10 px-4 gap-2',
    lg: 'text-base h-12 px-6 gap-2'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  const combinedClasses = `rounded-xl font-medium flex items-center justify-center transition-all ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  return (
    <motion.button
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={combinedClasses}
    >
      {loading ? (
        <Loader2 size={iconSizes[size] || 18} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={iconSizes[size] || 18} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
