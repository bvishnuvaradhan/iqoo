import React from 'react';
import { motion } from 'framer-motion';

const AIIndicator = ({ size = 'sm', label, variant = 'pulse' }) => {
  if (variant === 'pulse') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
          />
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-purple-500"
          />
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-500"
          />
        </div>
        {label && <span className="text-xs text-white/60">{label}</span>}
      </div>
    );
  }

  if (variant === 'processing') {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 rounded-full border-2 border-blue-500/30 border-t-cyan-500"
        />
        {label && <span className="text-xs text-white/60">{label}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]"></span>
      </div>
      {label && <span className="text-xs text-white/60">{label}</span>}
    </div>
  );
};

export default AIIndicator;
