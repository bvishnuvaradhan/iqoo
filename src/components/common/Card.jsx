import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

const Card = ({ children, className = '', variant = 'default', onClick, animated = true }) => {
  const baseClasses = 'rounded-2xl overflow-hidden';
  const variants = {
    default: 'glass',
    ai: 'glass border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.1)] bg-gradient-to-br from-white/[0.04] to-purple-500/[0.02]',
    elevated: 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] p-5 shadow-lg'
  };

  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-white/[0.06] transition-colors duration-200' : '';
  const combinedClasses = `${baseClasses} ${variants[variant] || variants.default} ${interactiveClasses} ${className}`;

  if (animated) {
    return (
      <motion.div
        variants={fadeInUp}
        onClick={onClick}
        className={combinedClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={combinedClasses}>
      {children}
    </div>
  );
};

export default Card;
